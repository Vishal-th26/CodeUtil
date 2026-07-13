import faiss
import numpy as np
from embeddings.embedder import get_embeddings

embeddings = get_embeddings()



class FaissStore:
    def __init__(self, dimension):

        self.index = faiss.IndexFlatIP(dimension)
        self.chunks = []

    def add(self,chunk, embedding):
        embedding = np.array(embedding, dtype=np.float32)
        embedding = embedding.reshape(1,-1)  #this reshaping makes it 2d in nature
        self.index.add(embedding)
        self.chunks.append(chunk)

    def search(self,query_embedding,k= 5):
        query_embedding = np.array(query_embedding, dtype=np.float32)
        query_embedding = query_embedding.reshape(1,-1)
        scores, indices = self.index.search(query_embedding, k)
        result = []
        for score, idx in zip(scores[0],indices[0]):
            if idx == -1:    #-1 means no match found this, hence we check that here
                continue
            result.append({
                "score":float(score),
                "chunk": self.chunks[idx]
            })

        return result
    

        
