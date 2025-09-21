# from __future__ import annotations

# import asyncio
# import uvicorn
# import os

# from mcp.server.stdio import stdio_server

# from mcp_server import mcp
# from api import create_app
# from settings import settings


# async def run_stdio_server() -> None:
#     async with stdio_server(mcp) as _:
#         await asyncio.Future()  # run forever until stdio closes


# def run_http() -> None:
#     app = create_app(settings.gemini_api_key)
#     uvicorn.run(app, host=settings.http_host, port=settings.http_port)


# if __name__ == "__main__":
#     # Default to HTTP API; stdio is launched by MCP clients/Inspector via entrypoint
#     run_http()

from dotenv import load_dotenv
import os
import uvicorn
from api import create_app
from settings import settings

load_dotenv()  # reads .env

def run_http() -> None:
    app = create_app(settings.gemini_api_key)
    host = os.getenv("FACTMCP_HTTP_HOST", "0.0.0.0")
    port = int(os.getenv("FACTMCP_HTTP_PORT", 8080))
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    run_http()
