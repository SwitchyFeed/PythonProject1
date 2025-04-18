import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import requests

openai.api_base = "https://api.deepseek.com/v1"

openai.api_key = "sk-4ac17203bf044f3b9fb922b5270ae975"

def get_label_from_deepseek(message):
    system_prompt = (
        "Ты классификатор. Отвечай ТОЛЬКО в формате {'label': {I}}, "
        "где I — одна из категорий: phishing(I = 0), spam(I = 1), manipulation (I = 2), safe(I=3)."
    )

    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0
    }

    try:
        response = openai.ChatCompletion.create(**data)

        result = response['choices'][0]['message']['content']
        return result
    except openai.Error as e:
        print("Ошибка:", e)
        return None

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
    label_response = get_label_from_deepseek(text)
    label_json = json.loads(label_response.replace("'", '"'))
    print(label_json)
    return {"class": int(label_json["label"])}
