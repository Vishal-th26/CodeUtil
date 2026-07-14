
def build_function_chunk(func_meta, file_path):
    args = ", ".join(func_meta["args"])

    calls = ", ".join([call["name"] for call in func_meta.get("calls", [])])
    loops = "Yes" if func_meta.get("loops") else "No"
    conditions = "Yes" if func_meta.get("has_condition") else "No"

    chunk_text = f"""
File: {file_path}
Type: Function
Name: {func_meta['name']}
Qualified Name: {func_meta['qualified_name']}
Start Line: {func_meta['start_line']}
End Line: {func_meta['end_line']}
Arguments: {args}
Function Calls: {calls}
Contains Loops: {loops}
Contains Conditions: {conditions}

code:
{func_meta["source_code" ]}

"""
    return {
    "name": func_meta["name"],
    "qualified_name": func_meta["qualified_name"],
    "source_file": file_path,
    "start_line": func_meta["start_line"],
    "end_line": func_meta["end_line"],
    "text": chunk_text
    }


def build_class_chunk(class_meta,file_path):

    qualified_name = class_meta.get("qualified_name", class_meta['name'])

    chunk_text = f""""
    File:{file_path}
    Type: Class
    Name: {class_meta['name']}
    Qualified Name: {qualified_name}
    Start Line: {class_meta['start_line']}
    End Line: {class_meta['end_line']}
    
    code: {class_meta['source_code']}
    
    """
    return {
    "name": class_meta["name"],
    "qualified_name": qualified_name,
    "source_file": file_path,
    "start_line": class_meta["start_line"],
    "end_line": class_meta["end_line"],
    "text": chunk_text
    }



def build_import_chunk(imports, file_path):
    import_lines = []
    for imp in imports:
        if "name" in imp:  # from-import: {"module":..., "name":..., "alias":...}
            line = f"from {imp['module']} import {imp['name']}"
            if imp.get("alias"):
                line += f" as {imp['alias']}"
        else:  # plain import: {"module":..., "alias":...}
            line = f"import {imp['module']}"
            if imp.get("alias"):
                line += f" as {imp['alias']}"
        import_lines.append(line)

    import_block = "\n".join(import_lines)

    chunk_text = f"""
File: {file_path}
Type: Imports
Qualified Name: {file_path}::imports
Start Line: 0
End Line: 0

code:
{import_block}

"""
    return {
        "name": "imports",
        "qualified_name": f"{file_path}::imports",
        "source_file": file_path,
        "start_line": 0,
        "end_line": 0,
        "text": chunk_text
    }

