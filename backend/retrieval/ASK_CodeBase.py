from retrieval.bm25_store import BM25Store
from retrieval.faiss_store import FaissStore
from LLM.qroq_client import ask_groq_llm
from embeddings.embedder import get_embeddings

embeddings = get_embeddings()



def ask_codebase(query,Faiss_store,bm25_store):
    query_vector = embeddings.embed_query(query)

    semantic_results = Faiss_store.search(query_vector, k=5)

    keyword_results = bm25_store.search(query, k=5)

    context = ""
    combined = []
    seen = set()

    for result in (
        semantic_results + keyword_results
    ):
        chunk = result['chunk']
        unique_id = (
            chunk['source_file'],
            chunk['qualified_name']  )
        
        if unique_id not in seen:
            combined.append(chunk)
            seen.add(unique_id)
        
    for chunk in combined[:4]:
        context += (
            f"FILE: {chunk['source_file']}\n"
            f"FUNCTION: {chunk['qualified_name']}\n"
            f"LINES: {chunk['start_line']}-{chunk['end_line']}\n\n"
            f"{chunk['text']}\n"
            f"{'='*80}\n\n"
        )
    
    if len(combined)==0:
        return "I couldn't find that information in the uploaded codebase."
    answer = ask_groq_llm(context= context, question= query)

    return answer
