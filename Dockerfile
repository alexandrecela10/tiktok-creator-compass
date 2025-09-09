FROM python:3.11-slim

WORKDIR /app

# Install minimal dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install only FastAPI and Uvicorn first for testing
RUN pip install fastapi uvicorn

# Copy simple test app
COPY simple-health-app.py .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Start simple test app
CMD ["python", "simple-health-app.py"]
