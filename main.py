from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/validate")
def validate(data: Message):
    text = data.message
    if "ошибка" in text.lower():
        return {"class": 1, "suspect": "Ошибка обнаружена"}
    return {"class": 3}
