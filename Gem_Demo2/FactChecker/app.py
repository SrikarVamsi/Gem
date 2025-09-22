import streamlit as st
import requests
import json
import time
from typing import Dict, Any, List, Optional

# Configure page
st.set_page_config(
    page_title="Gem - AI Fact Checker",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to match the chrome extension theme
st.markdown("""
<style>
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
    
    /* Global Styles */
    .main {
        background: linear-gradient(135deg, #f8f6f4 0%, #f0f8f0 100%);
        font-family: "Google Sans", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Hide Streamlit default elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Custom container styling */
    .stApp {
        background: linear-gradient(135deg, #f8f6f4 0%, #f0f8f0 100%);
    }
    
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 800px;
    }
    
    /* Header styling */
    .header-container {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px) saturate(150%);
        border-radius: 24px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border: 3px solid transparent;
        background: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box,
                    linear-gradient(135deg, #4285f4 0%, #34a853 25%, #fbbc05 50%, #ea4335 75%, #4285f4 100%) border-box;
        text-align: center;
    }
    
    .logo-container {
        width: 90px;
        height: 90px;
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(66, 133, 244, 0.25) 0%, rgba(52, 168, 83, 0.25) 50%, rgba(251, 188, 5, 0.25) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        box-shadow: 0 16px 40px rgba(66, 133, 244, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .app-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #4285f4 0%, #ea4236 25%, #fcbc05 50%, #34a754 75%, #4285f4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .app-subtitle {
        font-size: 1.1rem;
        color: #5f6368;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    
    /* Input section styling */
    .input-container {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(25px) saturate(200%);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    
    .input-label {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Custom textarea styling */
    .stTextArea textarea {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        padding: 1rem;
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.6;
        min-height: 120px;
        backdrop-filter: blur(10px);
        color: #1a1a1a !important;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }
    
    .stTextArea textarea::placeholder {
        color: #666 !important;
    }
    
    .stTextArea textarea:focus {
        border-color: rgba(66, 133, 244, 0.5);
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.05);
        background: rgba(255, 255, 255, 0.95);
    }
    
    /* Button styling */
    .stButton > button {
        background: linear-gradient(135deg, #8acff1 0%, #4285f4 25%, #34a754 50%, #fcbc05 75%, #ea4236 100%);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        box-shadow: 0 8px 24px rgba(66, 133, 244, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 16px 40px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    
    .stButton > button:active {
        transform: translateY(-1px) scale(1.01);
    }
    
    /* Results section styling */
    .results-container {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(25px) saturate(200%);
        border-radius: 20px;
        padding: 2rem;
        margin-top: 2rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.4);
    }
    
    .verdict-badge {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 20px;
        margin-bottom: 1.5rem;
        font-weight: 700;
        font-size: 1.2rem;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(25px) saturate(200%);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .verdict-badge.verified {
        background: linear-gradient(135deg, rgba(52, 167, 84, 0.9) 0%, rgba(52, 167, 84, 0.7) 100%);
        color: white;
    }
    
    .verdict-badge.suspicious {
        background: linear-gradient(135deg, rgba(252, 188, 5, 0.9) 0%, rgba(252, 188, 5, 0.7) 100%);
        color: white;
    }
    
    .verdict-badge.fake {
        background: linear-gradient(135deg, rgba(234, 66, 31, 0.9) 0%, rgba(234, 66, 31, 0.7) 100%);
        color: white;
    }
    
    .verdict-badge.unknown {
        background: linear-gradient(135deg, rgba(66, 133, 244, 0.9) 0%, rgba(66, 133, 244, 0.7) 100%);
        color: white;
    }
    
    .verdict-emoji {
        font-size: 2rem;
    }
    
    .confidence-bar {
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        overflow: hidden;
        margin-top: 0.5rem;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .confidence-fill {
        height: 100%;
        background: linear-gradient(90deg, rgba(66, 133, 244, 0.7) 0%, rgba(52, 168, 83, 0.7) 25%, rgba(251, 188, 5, 0.7) 50%, rgba(234, 67, 53, 0.7) 75%);
        border-radius: 8px;
        transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    .explanation-box {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        border: 1px solid #e2e8f0;
        font-size: 1rem;
        line-height: 1.6;
        color: #1e293b;
    }
    
    .sources-section {
        margin-top: 1.5rem;
    }
    
    .source-item {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    .source-item:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .source-title {
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 0.25rem;
    }
    
    .source-domain {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
    }
    
    .source-link {
        color: #4285f4;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .source-link:hover {
        text-decoration: underline;
    }
    
    /* Loading animation */
    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(66, 133, 244, 0.2);
        border-top: 3px solid #4285f4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .main .block-container {
            padding: 1rem;
        }
        
        .header-container {
            padding: 1.5rem;
        }
        
        .app-title {
            font-size: 2rem;
        }
        
        .input-container {
            padding: 1.5rem;
        }
        
        .results-container {
            padding: 1.5rem;
        }
    }
</style>
""", unsafe_allow_html=True)

# Backend configuration - Uses environment variable for deployment
import os
BACKEND_URL = os.getenv("BACKEND_URL", "https://gem-production-f95b.up.railway.app")

def get_verdict_class(label: str) -> str:
    """Convert label to CSS class for styling"""
    lower_label = label.lower()
    if "verified" in lower_label or "true" in lower_label:
        return "verified"
    elif "suspicious" in lower_label:
        return "suspicious"
    elif "fake" in lower_label or "false" in lower_label:
        return "fake"
    else:
        return "unknown"

def get_verdict_emoji(label: str, confidence: float) -> str:
    """Get appropriate emoji based on verdict and confidence"""
    lower_label = label.lower()
    conf = confidence or 0.5
    
    if "verified" in lower_label or "true" in lower_label:
        return "😊" if conf > 0.8 else "🙂"
    elif "suspicious" in lower_label:
        return "🤔" if conf > 0.7 else "😐"
    elif "fake" in lower_label or "false" in lower_label:
        return "😡" if conf > 0.8 else "😟"
    else:
        return "❓"

def extract_domain(url: str) -> str:
    """Extract domain from URL"""
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).hostname
        return domain.replace("www.", "") if domain else url
    except:
        return url

def call_backend_api(text: str) -> Dict[str, Any]:
    """Call the FastAPI backend to analyze text"""
    try:
        response = requests.post(
            f"{BACKEND_URL}/check",
            json={"content": text},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error connecting to backend: {str(e)}")
        st.info(f"Make sure your backend is running at: {BACKEND_URL}")
        return None

def display_results(result: Dict[str, Any]):
    """Display the fact-checking results"""
    if not result:
        return
    
    analysis = result.get("analysis", {})
    sources = result.get("sources", [])
    scam = result.get("scam", {})
    
    label = analysis.get("label", "Unknown")
    explanation = analysis.get("explanation", "No explanation available")
    confidence = analysis.get("confidence", 0.5)
    evidence = analysis.get("evidence", [])
    
    verdict_class = get_verdict_class(label)
    emoji = get_verdict_emoji(label, confidence)
    conf_percent = int(confidence * 100)
    
    # Display verdict badge
    st.markdown(f"""
    <div class="verdict-badge {verdict_class}">
        <span class="verdict-emoji">{emoji}</span>
        <div>
            <div style="font-size: 1.2rem; font-weight: 700;">{label}</div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">{conf_percent}% confidence</div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: {conf_percent}%"></div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Display explanation
    st.markdown(f"""
    <div class="explanation-box">
        <strong>Explanation:</strong><br>
        {explanation}
    </div>
    """, unsafe_allow_html=True)
    
    # Display scam warning if applicable
    if scam.get("is_suspicious"):
        st.warning("⚠️ Possible scam indicators detected")
    
    # Display evidence if available
    if evidence:
        st.markdown("**📚 Evidence:**")
        for i, item in enumerate(evidence[:3]):  # Show top 3 evidence items
            quote = item.get("quote", "No quote available")
            support = item.get("support", "unrelated")
            url = item.get("url", "#")
            
            support_color = "#35A652" if support.lower() == "supports" else "#EA4336" if support.lower() == "refutes" else "#4386F5"
            
            st.markdown(f"""
            <div class="source-item">
                <div style="font-style: italic; margin-bottom: 0.5rem;">"{quote}"</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <a href="{url}" target="_blank" class="source-link">View Source</a>
                    <span style="background: {support_color}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">{support}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    # Display sources
    if sources:
        st.markdown("**🔍 Verification Sources:**")
        for i, source in enumerate(sources[:5]):  # Show top 5 sources
            url = source.get("url", "#")
            title = source.get("title", f"Source {i+1}")
            domain = extract_domain(url)
            
            st.markdown(f"""
            <div class="source-item">
                <div class="source-title">{title}</div>
                <div class="source-domain">{domain}</div>
                <a href="{url}" target="_blank" class="source-link">🔗 Visit Source</a>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div style="background: rgba(66, 133, 244, 0.1); border: 1px solid rgba(66, 133, 244, 0.3); border-radius: 8px; padding: 1rem; margin: 1rem 0; color: #1a1a1a;">
            📚 This verification was completed using our AI's comprehensive knowledge base.
        </div>
        """, unsafe_allow_html=True)

def main():
    """Main Streamlit app"""
    
    # Header
    st.markdown("""
    <div class="header-container">
        <div class="logo-container">
            <span style="font-size: 3rem;">💎</span>
        </div>
        <div class="app-title">Gem</div>
        <div class="app-subtitle">AI Fact Checker</div>
        <p style="color: #5f6368; font-size: 1rem; margin: 0;">
            Paste or type text below to verify with our AI-powered fact-checking system
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Input section
    st.markdown("""
    <div class="input-container">
        <div class="input-label">📝 Text to Verify</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Text input
    text_input = st.text_area(
        "Text Input",
        placeholder="Enter the text you want to fact-check here...",
        height=120,
        key="text_input",
        label_visibility="collapsed"
    )
    
    # Analyze button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        analyze_button = st.button("💎 Analyze with Gem", use_container_width=True)
    
    # Process analysis
    if analyze_button:
        if not text_input.strip():
            st.error("Please enter some text to analyze.")
        else:
            with st.spinner("Analyzing your text..."):
                result = call_backend_api(text_input.strip())
                
                if result:
                    st.markdown('<div class="results-container">', unsafe_allow_html=True)
                    display_results(result)
                    st.markdown('</div>', unsafe_allow_html=True)
    
    # Footer
    st.markdown("""
    <div style="text-align: center; margin-top: 3rem; padding: 2rem; color: #5f6368; font-size: 0.9rem;">
        <p>Powered by Gem 💎 - AI Fact Checker</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">
            Backend URL: <code>{}</code> | 
            <a href="#" style="color: #4285f4;">Documentation</a> | 
            <a href="#" style="color: #4285f4;">Support</a>
        </p>
    </div>
    """.format(BACKEND_URL), unsafe_allow_html=True)

if __name__ == "__main__":
    main()
