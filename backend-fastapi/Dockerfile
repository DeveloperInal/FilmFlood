FROM python:3.10.12-slim

WORKDIR /app/fastapi

# Установка Poetry
RUN pip install --upgrade pip && \
    pip install poetry

# Копируем ТОЛЬКО файлы зависимостей
COPY pyproject.toml poetry.lock ./

# Устанавливаем зависимости
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Копируем остальные файлы проекта
COPY . .

EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "main:app"]
