FROM python:3.10.12-slim

WORKDIR /app

RUN pip install --upgrade pip && \
    pip install poetry

COPY pyproject.toml poetry.lock ./

# Отключаем проверку README.md и пакетный режим
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

COPY . .

EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "main:app"]
