from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Укажи путь к папке с моделью
model_path = "./rubert_classifier"

# Загружаем токенизатор и модель
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

from transformers import pipeline

classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

# Пример
result = classifier("Пример текста для классификации")
print(result)
