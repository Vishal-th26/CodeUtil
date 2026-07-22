import ast
import json




class PythonVisitor(ast.NodeVisitor):
    
    def __init__(self,source_code):
        self.metadata = []
        self.scope_stack = []
        self.source_code = source_code
        self.imports = []
    
 


    def get_current_function(self):
        for item in reversed(self.scope_stack):
            if item.get("type") in ("function", "asyncfunction"):
                return item
        return None
        

    def visit_ClassDef(self, node):
        class_meta = {"type":"class", 
        "name":node.name,
        "start_line": node.lineno,
        "end_line": node.end_lineno,
        "source_code": self.get_source(node)
        }
        self.metadata.append(class_meta)
        self.scope_stack.append(class_meta)

        self.generic_visit(node)
        self.scope_stack.pop()

    def handle_any_function(self, node, func_type):
        parent_class = next((item["name"] for item in reversed(self.scope_stack) if item.get("type") == "class"), None)
        
        qualified_name = self.get_qualified_name(node.name)
        args = [arg.arg for arg in node.args.args]

        func_meta = {
            "type": func_type,
            "name": node.name,
            "args": args,
            "parent_class": parent_class,
            "loops": [],
            "has_condition": False,
            "calls": [],
            "start_line": node.lineno,
            "end_line": node.end_lineno,
            "source_code": self.get_source(node),
            "qualified_name": qualified_name,
        }


        
        self.metadata.append(func_meta)
        self.scope_stack.append(func_meta)
        self.generic_visit(node)
        self.scope_stack.pop()


    def visit_FunctionDef(self, node):
        self.handle_any_function(node, "function")

    def visit_AsyncFunctionDef(self, node):
        self.handle_any_function(node, "asyncfunction")

    def mark_loop_found(self, node):
        current_function = self.get_current_function()

        if current_function:
            current_function["loops"].append({
                "type": type(node).__name__,
                "line": node.lineno
            })

    def get_source(self, node):
        return ast.get_source_segment(self.source_code, node)
    
    def visit_Import(self, node):
        for alias in node.names:
            self.imports.append({
                "module": alias.name,
                "alias": alias.asname
            })

        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        for alias in node.names:
            self.imports.append({
                "module": node.module,
                "name": alias.name,
                "alias": alias.asname
            })

        self.generic_visit(node)

    def get_qualified_name(self, name):
        scopes = [
            item["name"]
            for item in self.scope_stack
            if item["type"] in (
                "class",
                "function",
                "asyncfunction"
            )
        ]

        scopes.append(name)

        return ".".join(scopes)
    
    
    def get_call_name(self, node):
        if isinstance(node, ast.Name):
            return node.id

        elif isinstance(node, ast.Attribute):
            value = self.get_call_name(node.value)

            if value:
                return f"{value}.{node.attr}"

            return node.attr

        return None
    
    def visit_Call(self, node):
        current_function = self.get_current_function()

        if current_function:
            call_name = self.get_call_name(node.func)

            if call_name:
                current_function["calls"].append({
                    "name": call_name,
                    "line": node.lineno
                })

        self.generic_visit(node)
    
    
    
    
    
    def visit_If(self, node):
        current_function = self.get_current_function()

        if current_function:
            current_function["has_condition"] = True

        self.generic_visit(node)






    def visit_For(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_While(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_ListComp(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_DictComp(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_SetComp(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_GeneratorExp(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)


    def visit_AsyncFor(self, node):
        self.mark_loop_found(node)
        self.generic_visit(node)

        
        


    


if __name__ == "__main__":
    with open("student_sample/sample_dataset.py", 'r') as f:
        code = f.read()

    tree = ast.parse(code)

    visitor = PythonVisitor(code)
    visitor.visit(tree)

    json_output = json.dumps(visitor.metadata, indent=4)

    print(json_output)