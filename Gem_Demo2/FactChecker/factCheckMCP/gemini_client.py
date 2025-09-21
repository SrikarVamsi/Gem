from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from tenacity import retry, stop_after_attempt, wait_exponential


class GeminiClient:
    """Thin wrapper around google-generativeai for structured outputs.

    The client is initialized with a system instruction that enforces
    explainable, source-grounded fact-checking outputs.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str = "gemini-1.5-flash",
        system_instruction: Optional[str] = None,
    ) -> None:
        # Lazy import and initialization to avoid heavy imports during server startup
        self._api_key = api_key
        self._model_name = model_name
        self._system_instruction = system_instruction or (
            "You are a strict, explainable fact-checking assistant for India. "
            "Classify claims as Verified, Suspicious, or Fake; always include a concise, "
            "non-technical explanation and cite evidence snippets from provided or fetched sources. "
            "Be neutral, avoid sensationalism, and prefer official sources (PIB, government portals, WHO, etc.)."
        )
        self._model = None

        # Prefer JSON output for downstream consumption
        self.generation_config = {
            "temperature": 0.2,
            "top_p": 0.9,
            "top_k": 40,
            "response_mime_type": "application/json",
        }

    def _get_model(self):
        if self._model is not None:
            return self._model
        # Import here to avoid importing IPython and other heavy deps at startup
        import google.generativeai as genai

        genai.configure(api_key=self._api_key)
        self._model = genai.GenerativeModel(
            self._model_name,
            system_instruction=self._system_instruction,
        )
        return self._model

    @retry(wait=wait_exponential(min=1, max=8), stop=stop_after_attempt(3))
    def analyze_content(
        self,
        content_text: str,
        fetched_sources: List[Dict[str, Any]],
        language_hint: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Analyze content and compare with fetched sources.

        fetched_sources: list of {url, title, text}
        Returns structured JSON dict with: label, explanation, evidence[]
        """

        sources_preview = [
            {
                "url": s.get("url"),
                "title": s.get("title"),
                "snippet": (s.get("text") or "")[:1200],
            }
            for s in fetched_sources
        ]

        prompt = {
            "task": "fact_check_misinformation",
            "language_hint": language_hint or "auto",
            "requirements": [
                "Return strict JSON with fields: label, explanation, evidence (array of {url, quote, support: one of ['supports','refutes','unrelated']}).",
                "label must be one of: Verified, Suspicious, Fake.",
                "explanation must be short, specific, and educational.",
                "Use only provided sources for evidence; do not fabricate.",
                "Include 'confidence' as a number between 0 and 1 indicating your certainty in the label.",
            ],
            "content": content_text,
            "sources": sources_preview,
        }

        model = self._get_model()
        response = model.generate_content(
            [json.dumps(prompt, ensure_ascii=False)],
            generation_config=self.generation_config,
        )

        text = response.text or "{}"
        try:
            data = json.loads(text)
            if "confidence" not in data or not isinstance(data.get("confidence"), (int, float)):
                data["confidence"] = 0.5
            return data
        except json.JSONDecodeError:
            # Fallback: wrap raw text
            return {
                "label": "Suspicious",
                "explanation": text.strip(),
                "evidence": [],
                "confidence": 0.5,
            }


