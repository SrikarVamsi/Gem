# FactCheck MCP Chrome Extension

This MV3 extension sends selected text to your local API at `http://127.0.0.1:8080/check` and overlays the result.

## Load locally
1. Ensure the API server is running:
   ```powershell
   uv run python -m factCheckMCP.main
   ```
2. Open Chrome → chrome://extensions → Enable Developer mode.
3. Click "Load unpacked" and select the `chrome_extension` folder.

## Build a ZIP
From the project root:
```powershell
Compress-Archive -Path chrome_extension\* -DestinationPath factcheck-extension.zip -Force
```
Then drag `factcheck-extension.zip` into chrome://extensions (Dev mode) or upload to the Chrome Web Store.

## Use
- Right-click selected text → "Verify with FactCheck MCP".
- Or click the extension icon, choose "Use Selection", then "Verify".
- Configure API base at the Options page.
