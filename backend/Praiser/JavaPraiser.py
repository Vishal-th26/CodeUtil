import tree_sitter_java as tsjava
from tree_sitter import Language, Parser

JAVA_LANGUAGE = Language(tsjava.language())


class JavaVisitor:


    LOOP_TYPES = {"for_statement", "while_statement", "enhanced_for_statement", "do_statement"}
    FUNC_TYPES = {"method_declaration", "constructor_declaration"}

    def __init__(self, source_code: str):
        self.source_code = source_code
        self.code_bytes = source_code.encode("utf-8")
        self.metadata = []
        self.imports = []
        self.scope_stack = []
        self._parser = Parser(JAVA_LANGUAGE)
        self._consumed_chain_nodes = set()

    def visit(self):
        tree = self._parser.parse(self.code_bytes)
        self._walk(tree.root_node)

    def _src(self, node):
        return self.code_bytes[node.start_byte:node.end_byte].decode("utf-8")

    def get_current_function(self):
        for item in reversed(self.scope_stack):
            if item.get("type") in ("function", "constructor"):
                return item
        return None

    def get_qualified_name(self, name):
        scopes = [
            item["name"] for item in self.scope_stack
            if item["type"] in ("class", "function", "constructor")
        ]
        scopes.append(name)
        return ".".join(scopes)

    def _walk(self, node):
        handler = getattr(self, f"_visit_{node.type}", None)
        if handler:
            handler(node)
        else:
            for child in node.children:
                self._walk(child)

    # ---- declarations ----

    def _visit_class_declaration(self, node):
        name_node = node.child_by_field_name("name")
        name = self._src(name_node) if name_node else "<anonymous>"

        class_meta = {
            "type": "class",
            "name": name,
            "start_line": node.start_point[0] + 1,
            "end_line": node.end_point[0] + 1,
            "source_code": self._src(node),
        }
        self.metadata.append(class_meta)
        self.scope_stack.append(class_meta)

        for child in node.children:
            self._walk(child)

        self.scope_stack.pop()

    def _visit_method_declaration(self, node):
        self._handle_function(node, "function")

    def _visit_constructor_declaration(self, node):
        self._handle_function(node, "constructor")

    def _handle_function(self, node, func_type):
        name_node = node.child_by_field_name("name")
        name = self._src(name_node) if name_node else "<anonymous>"

        parent_class = next(
            (item["name"] for item in reversed(self.scope_stack) if item.get("type") == "class"),
            None
        )

        params_node = node.child_by_field_name("parameters")
        args = []
        if params_node:
            for child in params_node.children:
                if child.type == "formal_parameter":
                    id_node = child.child_by_field_name("name")
                    if id_node:
                        args.append(self._src(id_node))

        func_meta = {
            "type": func_type,
            "name": name,
            "args": args,
            "parent_class": parent_class,
            "loops": [],
            "has_condition": False,
            "calls": [],
            "start_line": node.start_point[0] + 1,
            "end_line": node.end_point[0] + 1,
            "source_code": self._src(node),
            "qualified_name": self.get_qualified_name(name),
        }

        self.metadata.append(func_meta)
        self.scope_stack.append(func_meta)

        for child in node.children:
            self._walk(child)

        self.scope_stack.pop()

    # ---- imports ----

    def _visit_import_declaration(self, node):
        # import_declaration wraps a scoped_identifier / asterisk, no "name" field
        text = self._src(node).replace("import", "", 1).strip().rstrip(";").strip()
        self.imports.append({"module": text, "alias": None})

    # ---- control flow / calls ----

    def _visit_if_statement(self, node):
        current = self.get_current_function()
        if current:
            current["has_condition"] = True
        for child in node.children:
            self._walk(child)

    def _mark_loop(self, node):
        current = self.get_current_function()
        if current:
            current["loops"].append({"type": node.type, "line": node.start_point[0] + 1})
        for child in node.children:
            self._walk(child)

    def _visit_for_statement(self, node):
        self._mark_loop(node)

    def _visit_enhanced_for_statement(self, node):
        self._mark_loop(node)

    def _visit_while_statement(self, node):
        self._mark_loop(node)

    def _visit_do_statement(self, node):
        self._mark_loop(node)

    def _resolve_call_chain(self, node):
        """
        Walks DOWN through a chain of method_invocation nodes
        (a.b().c(helper()).d() is parsed as nested invocations, each one's
        "object" being the invocation before it) and flattens it into one
        readable name, e.g. "a.b.c.d".

        Also collects every "arguments" node along the chain, so the caller
        can still walk into them for calls buried inside arguments
        (e.g. the helper() inside .c(helper())), since we skip re-walking
        the "object" chain itself (that would double-count each segment as
        its own call).

        Returns (chain_name, arg_nodes, base_node) where base_node is the
        root of the chain (an identifier/field_access, or None for a local
        call like simpleCall()).
        """
        method_names = []
        arg_nodes = []
        current = node

        while current is not None and current.type == "method_invocation":
            name_node = current.child_by_field_name("name")
            args_node = current.child_by_field_name("arguments")
            if name_node:
                method_names.append(self._src(name_node))
            if args_node:
                arg_nodes.append(args_node)
            current = current.child_by_field_name("object")

        method_names.reverse()
        base = self._src(current) if current is not None else None
        chain_name = ".".join(([base] if base else []) + method_names)
        return chain_name, arg_nodes, current

    def _visit_method_invocation(self, node):
        # Skip nodes that are themselves the "object" of a parent
        # method_invocation - they're already folded into the parent's
        # resolved chain name by _resolve_call_chain, so registering them
        # again here would produce duplicate/partial call entries
        # (e.g. "a.b", "a.b.c" AND "a.b.c.d" for one chained call).
        if id(node) in self._consumed_chain_nodes:
            return

        current = self.get_current_function()
        chain_name, arg_nodes, base_node = self._resolve_call_chain(node)

        if current and chain_name:
            current["calls"].append({"name": chain_name, "line": node.start_point[0] + 1})

        # mark every intermediate invocation in this chain as consumed,
        # then still walk their argument lists (calls can hide in there,
        # e.g. .c(helper())) plus the chain's root object if it's an
        # expression worth descending into (e.g. array access).
        c = node
        while c is not None and c.type == "method_invocation":
            self._consumed_chain_nodes.add(id(c))
            c = c.child_by_field_name("object")

        for args_node in arg_nodes:
            self._walk(args_node)

        if base_node is not None and base_node.type != "identifier":
            self._walk(base_node)

