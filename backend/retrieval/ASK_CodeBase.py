from backend.retrieval.bm25_store import BM25Store
from backend.retrieval.faiss_store import FaissStore
from backend.LLM.qroq_client import ask_groq_qna, ask_groq_chat
from backend.embeddings.embedder import get_embeddings

embeddings = get_embeddings()


def _retrieve_context(query, faiss_store, bm25_store, k=6, final_k=4):
    """Shared retrieval + context-building. Both ask_codebase variants use
    this - only the model they hand the context to differs."""
    query_vector = embeddings.embed_query(query)

    semantic_results = faiss_store.search(query_vector, k=k)
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
        return None

    context = ""
    for chunk in combined[:final_k]:
        context += (
            f"FILE: {chunk['source_file']}\n"
            f"{chunk.get('type', 'FUNCTION').upper()}: {chunk['qualified_name']}\n"
            f"LINES: {chunk['start_line']}-{chunk['end_line']}\n\n"
            f"{chunk['text']}\n"
            f"{'='*80}\n\n"
        )
    return context


def ask_codebase(query, faiss_store, bm25_store, k=6, final_k=4):
    """Grounded, strict answering. Use for anything where correctness
    matters - viva prep, "explain this function", grading-adjacent
    features. Answers on the bigger reasoning model."""
    context = _retrieve_context(query, faiss_store, bm25_store, k, final_k)
    if context is None:
        return "I couldn't find that information in the uploaded codebase."
    return ask_groq_qna(context=context, question=query)


def ask_codebase_chat(query, faiss_store, bm25_store, k=6, final_k=4):
    """Fast/cheap answering for low-stakes lookups - e.g. a live-typing
    suggestion panel, casual browsing. NOT for anything feeding into
    viva questions or grading context - the smaller model is more likely
    to drift from the "only answer from context" rule."""
    context = _retrieve_context(query, faiss_store, bm25_store, k, final_k)
    if context is None:
        return "I couldn't find that information in the uploaded codebase."
    return ask_groq_chat(context=context, question=query)