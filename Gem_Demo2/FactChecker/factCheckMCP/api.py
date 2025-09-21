from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gemini_client import GeminiClient
from mcp_server import fetch_url, search, detect_scam


class CheckRequest(BaseModel):
    content: str
    language_hint: Optional[str] = None


class FeedbackRequest(BaseModel):
    content: str
    label: str
    helpful: bool
    notes: Optional[str] = None


def create_app(gemini_api_key: str) -> FastAPI:
    app = FastAPI(title="FactCheckMCP API")
    # Enable CORS for extension/local dev
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    gemini = GeminiClient(api_key=gemini_api_key)

    @app.post("/check")
    def check(req: CheckRequest) -> Dict[str, Any]:
        # Simple flow: search → fetch top N → analyze
        hits = search(req.content, limit=4)
        fetched: List[Dict[str, Any]] = []
        for h in hits:
            try:
                fetched.append(fetch_url(h["url"]))
            except Exception:
                continue

        scam = detect_scam(req.content)
        analysis = gemini.analyze_content(req.content, fetched, req.language_hint)
        # Include sources in response for UI display
        return {"analysis": analysis, "scam": scam, "sources": fetched or hits}

    @app.post("/feedback")
    def feedback(req: FeedbackRequest) -> Dict[str, Any]:
        # Placeholder: in production, write to durable store (BigQuery/Firestore)
        return {"status": "ok"}

    return app


