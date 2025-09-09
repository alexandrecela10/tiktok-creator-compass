#!/usr/bin/env python3
"""
Minimal FastAPI app for testing Railway deployment
This strips out all dependencies that could cause startup issues
"""
from fastapi import FastAPI
import os

app = FastAPI(title="Health Check Test")

@app.get("/")
async def root():
    return {"message": "Simple health test app", "port": os.getenv("PORT", "8000")}

@app.get("/health")
async def health():
    return {"status": "healthy", "port": os.getenv("PORT", "8000")}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
