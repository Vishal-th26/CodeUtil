from rank_bm25 import BM25Okapi

class BM25Store:
    def __init__(self):
        self.document = []
        self.tokenized_docs = []
        self.bm25 = None

    def add(self, chunk):
        text = chunk['text']

        self.document.append(chunk)
        self.tokenized_docs.append(text.lower().split())

    def build(self):
        self.bm25 = BM25Okapi(self.tokenized_docs)

    def search(self,query, k =5):
        tokens = query.lower().split()

        scores = self.bm25.get_scores(tokens)

        ranked = sorted(
            enumerate(scores),key= lambda x: x[1], reverse= True
        )

        results = []
        for idx,score in ranked[:k]:
            results.append({
                "score": float(score),  
                "chunk": self.document[idx]
            })
        return results


