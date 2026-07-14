from retrieval.bm25_store import BM25Store
from retrieval.faiss_store import FaissStore
from LLM.qroq_client import ask_groq_llm
from embeddings.embedder import get_embeddings

embeddings = get_embeddings()


def ask_codebase(query, Faiss_store, bm25_store, k=6, final_k=4):
    query_vector = embeddings.embed_query(query)

    semantic_results = Faiss_store.search(query_vector, k=k)
    keyword_results = bm25_store.search(query, k=k)

    def rrf_merge(*result_lists, rrf_k=60):
        scores = {}
        chunk_lookup = {}
        for results in result_lists:
            for rank, result in enumerate(results):
                chunk = result['chunk']
                uid = (chunk['source_file'], chunk['qualified_name'])
                chunk_lookup[uid] = chunk
                scores[uid] = scores.get(uid, 0) + 1.0 / (rrf_k + rank + 1)
        ranked_uids = sorted(scores, key=scores.get, reverse=True)
        return [chunk_lookup[uid] for uid in ranked_uids]

    combined = rrf_merge(semantic_results, keyword_results)

    if len(combined) == 0:
        return "I couldn't find that information in the uploaded codebase."

    context = ""
    for chunk in combined[:final_k]:
        context += (
            f"FILE: {chunk['source_file']}\n"
            f"FUNCTION: {chunk['qualified_name']}\n"
            f"LINES: {chunk['start_line']}-{chunk['end_line']}\n\n"
            f"{chunk['text']}\n"
            f"{'='*80}\n\n"
        )

    answer = ask_groq_llm(context=context, question=query)
    return answer
