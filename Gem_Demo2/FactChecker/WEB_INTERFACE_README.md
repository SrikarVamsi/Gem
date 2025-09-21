# Gem Web Interface

A beautiful Streamlit web interface for the Gem AI Fact Checker that matches the chrome extension's design theme.

## Features

- **Matching Design**: Uses the same soothing greens, whites, and glassmorphism effects as the chrome extension
- **Mobile-Friendly**: Responsive design that works on all devices
- **Real-time Analysis**: Connects to your FastAPI backend for instant fact-checking
- **Clean Results Display**: Shows verdict, confidence, explanation, evidence, and sources
- **Easy Configuration**: Simple backend URL configuration

## Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Backend URL**:
   - Open `app.py`
   - Update the `BACKEND_URL` variable (line 15) to match your backend:
   ```python
   BACKEND_URL = "http://127.0.0.1:8080"  # Change this to your actual backend URL
   ```

3. **Start Your Backend**:
   Make sure your FastAPI backend from `factCheckMCP/` is running on the configured URL.

4. **Run the Web Interface**:
   ```bash
   streamlit run app.py
   ```

5. **Open in Browser**:
   The interface will open at `http://localhost:8501`

## Usage

1. **Enter Text**: Type or paste the text you want to fact-check
2. **Click Analyze**: Press the "💎 Analyze with Gem" button
3. **View Results**: See the verdict, confidence score, explanation, evidence, and sources

## Design Features

- **Color Scheme**: Soothing greens (`#34a754`), light blues (`#8acff1`), and clean whites
- **Typography**: Google Sans and Poppins fonts for modern readability
- **Effects**: Glassmorphism with backdrop blur and subtle animations
- **Layout**: Clean, minimal design with proper spacing and rounded corners
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices

## Backend Integration

The web interface expects your FastAPI backend to be running and accessible at the configured URL. It makes POST requests to `/check` endpoint with the following format:

**Request**:
```json
{
  "content": "Text to analyze"
}
```

**Expected Response**:
```json
{
  "analysis": {
    "label": "Verified|Suspicious|Fake",
    "explanation": "Detailed explanation",
    "confidence": 0.85,
    "evidence": [...]
  },
  "sources": [...],
  "scam": {
    "is_suspicious": false
  }
}
```

## Customization

- **Colors**: Modify the CSS variables in the `<style>` section
- **Layout**: Adjust the Streamlit column configurations
- **Backend**: Change the `BACKEND_URL` variable
- **Styling**: Update the custom CSS classes for different looks

## Troubleshooting

- **Backend Connection Error**: Ensure your FastAPI backend is running and accessible
- **Styling Issues**: Check that all CSS is properly loaded
- **Mobile Issues**: Test responsive design on different screen sizes

## Files

- `app.py` - Main Streamlit application
- `requirements.txt` - Python dependencies
- `WEB_INTERFACE_README.md` - This documentation

Enjoy your beautiful Gem web interface! 💎
