import os
import json
import requests
import pandas as pd
from typing import List, Dict, Optional
from pymongo import MongoClient
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ProcessorConfig:
    excel_input_path: Path
    excel_output_path: Path
    llama_url: str
    llama_model_name: str
    neural_search_url: str
    mongodb_uri: str
    mongodb_dbname_for_chunks: str
    mongodb_dbname_for_paragraphs: str
    top_k: int = 5


class LLaMAExcelProcessor:
    def __init__(self, config: ProcessorConfig):
        self.config = config
        if not self.config.excel_input_path.exists():
            raise FileNotFoundError(f"Input file not found: {self.config.excel_input_path}")
        if not self.config.excel_output_path.parent.exists():
            self.config.excel_output_path.parent.mkdir(parents=True)
        try:
            client = MongoClient(self.config.mongodb_uri, serverSelectionTimeoutMS=5000)
            client.server_info()
            self.chunk_db = client[self.config.mongodb_dbname_for_chunks]
            self.paragraph_db = client[self.config.mongodb_dbname_for_paragraphs]
        except Exception as e:
            raise ConnectionError(f"Failed to connect to MongoDB: {e}")

    def generate_prompt(self, content: str, query: str) -> str:
        return f"""
        당신은 GridOne에서 개발한 `참고자료`에서 질문에 대한 답변을 찾는 데 탁월한 능력을 가진 세계 최고의 AI 도우미입니다.
        참고 자료에서 사용자 질문에 대한 모든 답변을 찾아 반복 없이 답변을 제공하세요.

        ### 규칙:
        1. 사용자가 요청하거나 질문과 같은 언어로 응답하세요.
        2. 응답을 번역하거나 여러 언어로 텍스트를 포함하지 마세요.
        3. 대화를 자연스럽게 유지하세요 - 매 응답마다 자기소개를 하지 마세요.
        4. 확실하지 않은 용어는 같은 언어 내에서 더 간단한 표현을 사용하세요.
        5. 비윤리적이거나 부적절한 요청은 정중히 거절하세요.
        6. 참고자료 내용에 [table]~[/table]을 포함하는 경우 테이블 데이터를 의미합니다. 답변 생성에는 [table], [/table] 태그를 제외하고 내용만 참고하여 생성합니다.

        ### 참고자료:
        {content}

        ### 사용자 질문:
        {query}

        ### 답변:
        """

    def send_request_to_llama(self, prompt: str) -> str:
        try:
            payload = {
                "model": self.config.llama_model_name,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0,
                "top_p": 1,
            }
            resp = requests.post(
                self.config.llama_url,
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=300
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
        except requests.Timeout:
            return "LLM 요청이 시간 초과되었습니다."
        except requests.RequestException as e:
            return f"LLM 요청 중 오류가 발생했습니다: {e}"

    def get_neural_search_results(self, query: str, k: Optional[int] = None) -> List[Dict]:
        k = k or self.config.top_k
        payload = {
            "reqid": "62325",
            "input": {
                "items": [{
                    "query": query,
                    "vectorsearch_constraints": {"collection_name": "kwater_collection"},
                    "bm25_constraints": {"analyser": "nori", "collection_name": "kwater_collection"},
                    "k": k,
                    "fusion_strategy": "simple",
                }]
            }
        }
        try:
            resp = requests.post(
                self.config.neural_search_url,
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=30
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                {
                    "doc_id": item["metadatas"]["doc_id"],
                    "paragraph_id": item["metadatas"]["paragraph_id"]
                }
                for item in data["output"]["items"][0]["top_k_chunks"]
            ]
        except Exception:
            return []

    def get_combined_context(self, docs: List[Dict]) -> str:
        contexts = []
        for d in docs:
            doc_id = d.get("doc_id")
            pid = d.get("paragraph_id")
            if not doc_id or not pid:
                continue
            col = self.paragraph_db[doc_id]
            rec = col.find_one({"metadatas.paragraph_id": pid})
            if rec and "context" in rec:
                contexts.append(rec["context"])
        return "\n\n".join(contexts)

    def process_excel(self) -> None:
        df = pd.read_excel(self.config.excel_input_path)
        rows = []
        for idx, row in df.iterrows():
            q1 = str(row.get("query", "")).strip()
            q2 = str(row.get("query2", "")).strip()
            if not q1 or not q2:
                continue

            docs1 = self.get_neural_search_results(q1)
            ctx1 = self.get_combined_context(docs1)
            prompt1 = self.generate_prompt(ctx1, q1)
            a1 = self.send_request_to_llama(prompt1)

            docs2 = self.get_neural_search_results(q2)
            ctx2 = self.get_combined_context(docs2)
            combined = f"\n이전 질문: {q1}\n이전 답변: {a1}\n\n{ctx2}"
            print(f"###\n{combined}")
            prompt2 = self.generate_prompt(combined, q2)
            a2 = self.send_request_to_llama(prompt2)
            print(f"### 멀티턴 답변 :\n{a2}")

            rows.append({
                "번호": idx + 1,
                "쿼리1": q1,
                "답변1": a1,
                "쿼리2": q2,
                "답변2": a2,
            })

        pd.DataFrame(rows).to_excel(self.config.excel_output_path, index=False)


def main():
    config = ProcessorConfig(
        excel_input_path=Path("./통합테스트 질의셋.xlsx"),
        excel_output_path=Path("./테스팅.xlsx"),
        llama_url="http://10.10.1.60:10222/v1/chat/completions",
        llama_model_name="gemma3-27b-it-4bit",
        neural_search_url="http://10.10.1.60:10288/v2/predict",
        mongodb_uri="mongodb://10.30.1.195:27017",
        mongodb_dbname_for_chunks="kwater_collection",
        mongodb_dbname_for_paragraphs="paragraphmap",
        top_k=5,
    )
    processor = LLaMAExcelProcessor(config)
    processor.process_excel()


if __name__ == "__main__":
    main()
