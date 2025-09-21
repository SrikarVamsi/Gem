from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

import httpx
from bs4 import BeautifulSoup
from mcp.server.fastmcp import FastMCP


def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


mcp = FastMCP("FactCheckMCP")


@mcp.tool()
def search(query: str, limit: int = 5) -> List[Dict[str, str]]:
    """Search trusted sources for a query.

    Returns a list of {url, title} from a small curated set of endpoints.
    """
    trusted = [
        "https://pib.gov.in/PressReleasePage.aspx",
        "https://www.factcheck.pib.gov.in/",
        "https://www.who.int/",
        "https://www.unicef.org/",
        "https://www.reuters.com/",
        "https://www.altnews.in/",
        "https://www.boomlive.in/",
        "https://wikipedia.org/",
    ]

    results: List[Dict[str, str]] = []
    # Minimal heuristic search by fetching home pages; in production, replace with search APIs
    for base in trusted:
        if len(results) >= limit:
            break
        try:
            with httpx.Client(timeout=10.0, follow_redirects=True) as client:
                r = client.get(base)
                r.raise_for_status()
        except Exception:
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        for a in soup.find_all("a", href=True):
            title = _clean_text(a.get_text() or "")
            href = a["href"]
            if not title or len(title) < 8:
                continue
            if query.lower() in title.lower():
                if href.startswith("/"):
                    # Best effort join
                    href = base.rstrip("/") + href
                results.append({"url": href, "title": title})
                if len(results) >= limit:
                    break
    return results[:limit]


@mcp.tool()
def fetch_url(url: str, max_chars: int = 40000) -> Dict[str, str]:
    """Fetch and extract main text from a URL.

    Returns {url, title, text}.
    """
    with httpx.Client(timeout=15.0, follow_redirects=True) as client:
        r = client.get(url)
        r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    title = _clean_text(soup.title.get_text()) if soup.title else url
    # Simple extraction heuristic
    paragraphs = [
        _clean_text(p.get_text(" ")) for p in soup.find_all(["article", "p", "li"])
    ]
    text = _clean_text(" ".join(p for p in paragraphs if p))[:max_chars]
    return {"url": url, "title": title, "text": text}


@mcp.tool()
def detect_scam(content: str) -> Dict[str, Any]:
    """Lightweight pattern-based scam heuristics (UPI, KYC, lottery, investment)."""
    patterns = [
        r"free\s*lottery|won\s*prize",
        r"update\s*KYC|block\s*account",
        r"OTP\s*sharing",
        r"90%\s*returns|double\s*investment",
        r"urgent\s*payment|UPI\s*transfer",
    ]
    matches = [p for p in patterns if re.search(p, content, re.IGNORECASE)]
    return {"is_suspicious": bool(matches), "matched": matches}


@mcp.prompt()
def fact_check_prompt(claim: str) -> str:
    """Prompt template guiding explainable fact-checking for Indian context."""
    return (
        "Analyze the following claim for misinformation relevant to India. "
        "Cross-check with official sources (PIB, government portals, WHO, etc.). "
        "Produce a short explanation and cite evidence. Claim: " + claim
    )


