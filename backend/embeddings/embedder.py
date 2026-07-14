from langchain_community.embeddings import FastEmbedEmbeddings

_embeddings = None

def get_embeddings():
    global _embeddings

    if _embeddings is None:
        _embeddings = FastEmbedEmbeddings(
            model_name="BAAI/bge-small-en-v1.5",
            cache_dir="/tmp/fastembed_cache",
        )

    return _embeddings