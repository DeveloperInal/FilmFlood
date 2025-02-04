FROM python:3.10.12-slim

WORKDIR /app/fastapi/


COPY pyproject.toml poetry.lock ./app/fastapi/


RUN pip install poetry


RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app"]