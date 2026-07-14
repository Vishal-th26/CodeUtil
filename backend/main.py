import ast
import json
import re
from urllib import response

from praiser import codeVisitor
from LLM.qroq_client import ask_groq_llm
from chunker.function_chunker import build_function_chunk , build_class_chunk , build_import_chunk
from retrieval.bm25_store import BM25Store
from retrieval.faiss_store import FaissStore
from retrieval.ASK_CodeBase import ask_codebase
from embeddings.embedder import get_embeddings

embeddings = get_embeddings()


MAX_CONTEXT_LENGTH = 5000




uploaded_files = [r"D:\codeUtil\student_sample\sample_dataset.py",
                  r"D:\codeUtil\student_sample\sample_dataset_1.py"]





def build_codebase(uploaded_files):

    faiss_store = FaissStore(dimension=384)
    bm25_store = BM25Store()
    all_chunks = []

    for file_path in uploaded_files:
        process_file(
            file_path,
            all_chunks,
            faiss_store,
            bm25_store
        )

    bm25_store.build()

    metadata = {
        "files_processed": len(uploaded_files),
        "chunks_created": len(all_chunks)
    }

    return {
        "faiss_store": faiss_store,
        "bm25_store": bm25_store,
        "all_chunks": all_chunks,
        "metadata": metadata
    }



def process_file(file_path, all_chunks, faiss_store, bm25_store):
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    tree = ast.parse(code)
    visitor = codeVisitor(code)
    visitor.visit(tree)

    def index_chunk(chunk):
        all_chunks.append(chunk)
        chunk['source_file'] = file_path
        vector = embeddings.embed_query(chunk['text'])
        faiss_store.add(chunk, vector)
        bm25_store.add(chunk)

    for meta in visitor.metadata:
        if meta['type'] == ('function','asyncfunction'):
            index_chunk(build_function_chunk(meta, file_path))
        elif meta['type'] == 'class':
            index_chunk(build_class_chunk(meta, file_path))
        
        
    if visitor.imports:
        index_chunk(build_import_chunk(visitor.imports, file_path))
       




def generate_viva_questions(all_chunks):
    context = ""
    count = 0
    for chunk in all_chunks:
        piece = (
            f"FILE: {chunk['source_file']}\n"
            f"FUNCTION: {chunk['qualified_name']}\n"
            f"LINES: {chunk['start_line']}-{chunk['end_line']}\n\n"
            f"{chunk['text'][:300]}\n"
            f"{'=' * 80}\n\n"
            
)
        count += 1
        print(f"Chunks used: {count}")
        print(f"Chars used: {len(context)}")
        print(f"Approx tokens: {len(context)//4}")
        
        
        if len(context) + len(piece) > MAX_CONTEXT_LENGTH:
            break
        context += piece

    prompt = """
You are an experienced technical interviewer.

Based ONLY on the provided codebase, generate exactly 10 viva questions.

Requirements:
- 3 easy questions
- 4 medium questions
- 3 hard questions
- Questions must be specific to the uploaded code.
- Avoid duplicates.
- Avoid generic Python trivia unless it directly relates to the code.

Return ONLY valid JSON.

JSON format:

{
  "easy": [
    {
      "question": "...",
      "source_function": "...",
      "source_file": "..."
    }
  ],
  "medium": [],
  "hard": []
}

Do not include markdown.
Do not include explanations.
Do not include any text outside the JSON.
"""

    response = ask_groq_llm(
        context=context,
        question=prompt
    )

    response = response.strip()
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", response, re.DOTALL)
    if match:
        response = match.group(1).strip()
    else:
        # fallback: remove any stray fences
        response = response.replace("```json", "").replace("```", "").strip()
        
    
    if not response or not response.strip():
        return {
            "error": "Empty response from LLM"
        }


    if response.startswith("```json"):
        response = response[7:]

    if response.endswith("```"):
        response = response[:-3]
    response = re.sub(
        r"<think>.*?</think>",
        "",
        response,
        flags=re.DOTALL
    ).strip()

    match = re.search(
        r"\{.*\}",
        response,
        re.DOTALL
    )

    if not match:
        raise ValueError(
            f"No JSON found.\nResponse:\n{response}"
        )

    response = match.group(0)

    questions = json.loads(response)
    return questions



def generate_viva_answers(viva_questions,faiss_store,bm25_store):

    answers = {
        "easy": [],
        "medium": [],
        "hard": []
    }

    for difficulty, questions in viva_questions.items():

        for q in questions:

            answer = ask_codebase(
                q["question"],
                faiss_store,
                bm25_store
            )

            answers[difficulty].append({
                "question": q["question"],
                "answer": answer,
                "source_function": q["source_function"],
                "source_file": q["source_file"]
            })

    return answers





def ask_question(
        question,
        faiss_store,
        bm25_store
):
    return ask_codebase(
        question,
        faiss_store,
        bm25_store
    )


#--------------------demo test---------------------

if __name__ == "__main__":

    paths = [
        r"D:\codeUtil\student_sample\sample_dataset_1.py",
        r"D:\codeUtil\student_sample\sample_dataset.py"
    ]

    engine = build_codebase(paths)

    questions = generate_viva_questions(
        engine["all_chunks"]
    )

    answers = generate_viva_answers(
        questions,
        engine["faiss_store"],
        engine["bm25_store"]
    )

    print(questions)
    print(answers)

    print("#" * 80)
    print("CodeUtil Ready!")
    print("Type 'exit' to quit.")
    print("#" * 80)

    while True:
        query = input(">> ")

        if query.lower() == "exit":
            break

        answer = ask_question(
            query,
            engine["faiss_store"],
            engine["bm25_store"]
        )

        print("\n")
        print(answer)
        print("\n" + "#" * 80)
