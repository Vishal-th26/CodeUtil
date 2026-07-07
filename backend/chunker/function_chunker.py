
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