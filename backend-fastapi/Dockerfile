FROM python:3.10.12-slim

WORKDIR /


COPY pyproject.toml poetry.lock ./


RUN pip install poetry


RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app"]