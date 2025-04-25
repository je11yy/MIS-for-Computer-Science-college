FROM python:3.11

RUN apt-get update && apt-get install -y \
    postgresql-client \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn

COPY . .