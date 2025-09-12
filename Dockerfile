FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy everything first, then move backend files
COPY . /tmp/source/

# Copy backend requirements and install dependencies
RUN cp /tmp/source/backend/requirements.txt . && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application code to working directory
RUN cp -r /tmp/source/backend/* . && \
    rm -rf /tmp/source

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Start full backend app with proper PORT handling
CMD ["python", "-c", "import os; import uvicorn; from app.main import app; uvicorn.run(app, host='0.0.0.0', port=int(os.getenv('PORT', '8000')))"]
