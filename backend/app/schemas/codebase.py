from pydantic import BaseModel
from typing import Literal


class UploadResponse(BaseModel):
    status: Literal["processing", "done"]
    files_indexed: int
    message: str


class AskRequest(BaseModel):
    query: str


class AskResponse(BaseModel):
    answer: str


class VivaResponse(BaseModel):
    questions: dict
    answers: dict