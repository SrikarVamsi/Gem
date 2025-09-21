# FactCheck Chrome Extension - Comprehensive Project Overview

## 🎯 **Project Vision & Impact**

### **Problem Statement**

In today's digital age, misinformation and fake news spread rapidly across the internet, particularly in India where social media platforms are heavily used for news consumption. Users often encounter unverified claims, scam messages, and misleading information without easy access to reliable fact-checking tools.

### **Solution Impact**

The **FactCheck Chrome Extension (Gem)** addresses this critical issue by providing:

- **Real-time fact-checking** of selected text directly in the browser
- **AI-powered analysis** using Google's Gemini model for accurate verification
- **Source-grounded evidence** from trusted Indian and international sources
- **Scam detection** to protect users from fraudulent content
- **Seamless user experience** with a modern, Monica AI-inspired interface

### **Target Impact**

- **Individual Users**: Empower citizens to verify information before sharing
- **Educational Sector**: Help students and researchers verify academic claims
- **Media Professionals**: Assist journalists in fact-checking sources
- **General Public**: Reduce the spread of misinformation in India

---

## 🏗️ **Technical Architecture**

### **System Overview**

The project follows a **client-server architecture** with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   FastAPI       │    │   Google        │
│   Extension     │◄──►│   Backend       │◄──►│   Gemini AI     │
│   (Frontend)    │    │   (MCP Server)  │    │   (Analysis)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │   Trusted       │
         └──────────────►│   Sources       │
                        │   (PIB, WHO,    │
                        │    Reuters, etc)│
                        └─────────────────┘
```

### **Technology Stack**

#### **Frontend (Chrome Extension)**

- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No framework dependencies for lightweight performance
- **CSS3**: Modern styling with glassmorphism effects and animations
- **Chrome APIs**: Side Panel, Context Menus, Storage, Scripting
- **Architecture**: Service Worker + Content Scripts + Side Panel

#### **Backend (MCP Server)**

- **FastAPI**: High-performance Python web framework
- **Model Context Protocol (MCP)**: Standardized AI tool integration
- **Google Gemini 1.5 Flash**: Advanced AI model for content analysis
- **HTTPX**: Async HTTP client for web scraping
- **BeautifulSoup4**: HTML parsing and content extraction
- **Tenacity**: Retry logic for robust API calls
- **Pydantic**: Data validation and settings management

#### **Data Sources**

- **Government Sources**: PIB (Press Information Bureau), FactCheck.pib.gov.in
- **International**: WHO, UNICEF, Reuters
- **Indian Fact-Checkers**: AltNews, BoomLive
- **General**: Wikipedia for additional context

---

## 🔧 **Technical Implementation Details**

### **1. Chrome Extension Architecture**

#### **Manifest V3 Configuration**

```json
{
  "manifest_version": 3,
  "name": "Gem",
  "permissions": [
    "storage",
    "contextMenus",
    "activeTab",
    "scripting",
    "sidePanel"
  ],
  "host_permissions": ["http://127.0.0.1:8080/*", "http://localhost:8080/*"]
}
```

#### **Key Components**

- **Background Service Worker** (`background.js`): Handles extension lifecycle and message routing
- **Content Script** (`contentScript.js`): Detects text selection and communicates with webpage
- **Side Panel** (`sidepanel.html/js`): Main UI for fact-checking interface
- **Popup** (`popup.html/js`): Entry point and instructions
- **Options Page** (`options.html`): Configuration settings

#### **User Interaction Flow**

1. **Text Selection**: User selects text on any webpage
2. **Auto-Detection**: Content script detects selection with 100ms debounce
3. **Side Panel Activation**: Background script opens side panel
4. **API Communication**: Side panel sends selected text to backend
5. **AI Analysis**: Backend processes text with Gemini AI
6. **Results Display**: Side panel shows structured results with sources

### **2. Backend MCP Server**

#### **API Endpoints**

```python
POST /check
{
  "content": "Selected text to verify",
  "language_hint": "en" (optional)
}

Response:
{
  "analysis": {
    "label": "Verified|Suspicious|Fake",
    "explanation": "Detailed explanation",
    "confidence": 0.85,
    "evidence": [{"url": "...", "quote": "...", "support": "supports|refutes"}]
  },
  "scam": {"is_suspicious": true, "matched": ["pattern1", "pattern2"]},
  "sources": [{"url": "...", "title": "...", "text": "..."}]
}
```

#### **MCP Tools Implementation**

- **`search(query, limit)`**: Searches trusted sources for relevant content
- **`fetch_url(url)`**: Extracts and cleans content from web pages
- **`detect_scam(content)`**: Pattern-based scam detection using regex

#### **AI Integration**

- **Model**: Google Gemini 1.5 Flash
- **System Instruction**: Specialized for Indian fact-checking context
- **Output Format**: Structured JSON with confidence scores
- **Retry Logic**: Exponential backoff for API reliability

### **3. Data Processing Pipeline**

#### **Content Analysis Flow**

1. **Text Input**: User selects text on webpage
2. **Source Search**: Query trusted sources for related content
3. **Content Fetching**: Download and parse relevant web pages
4. **Scam Detection**: Apply pattern-based fraud detection
5. **AI Analysis**: Send to Gemini with context and sources
6. **Structured Output**: Return labeled, explained, and sourced results

#### **Source Reliability**

- **Government Sources**: PIB, official fact-checking portals
- **International Organizations**: WHO, UNICEF for health/global issues
- **Reputable News**: Reuters for international news
- **Indian Fact-Checkers**: AltNews, BoomLive for local verification

---

## 🎨 **User Experience Design**

### **Interface Philosophy**

- **Monica AI-Inspired**: Clean, modern, professional design
- **Glassmorphism**: Subtle transparency and blur effects
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: High contrast, keyboard navigation, screen reader support

### **Key UI Features**

- **Square-shaped Popup**: Professional, properly justified content
- **Side Panel Interface**: Non-intrusive, always accessible
- **Auto-Detection**: Seamless text selection processing
- **Visual Feedback**: Loading states, animations, progress indicators
- **Source Integration**: Numbered references with clickable links
- **Copy Functionality**: Easy sharing of verification results

### **Visual Design Elements**

- **Color Scheme**: Google-inspired palette (#35A652, #FAB905, #EA4336, #C42321, #4386F5)
- **Typography**: System fonts for cross-platform consistency
- **Animations**: Smooth transitions, staggered reveals, water-like effects
- **Icons**: Emoji-based indicators for different verification states

---

## 🚀 **Deployment & Usage**

### **Installation Process**

1. **Backend Setup**:

   ```bash
   cd factCheckMCP
   uv run python -m factCheckMCP.main
   ```

2. **Extension Installation**:

   - Open Chrome → chrome://extensions
   - Enable Developer mode
   - Load unpacked → Select `chrome_extension` folder

3. **Configuration**:
   - Set up Google Gemini API key
   - Configure trusted sources if needed

### **Usage Scenarios**

- **Social Media**: Verify posts before sharing
- **News Articles**: Check claims in real-time
- **Academic Research**: Validate sources and claims
- **Email/WhatsApp**: Detect scam messages
- **General Browsing**: Verify any selected text

---

## 📊 **Performance & Scalability**

### **Performance Optimizations**

- **Lazy Loading**: Heavy dependencies loaded only when needed
- **Debounced Selection**: Prevents excessive API calls
- **Caching**: Chrome storage for user preferences
- **Efficient Parsing**: BeautifulSoup for fast HTML processing
- **Retry Logic**: Robust error handling and recovery

### **Scalability Considerations**

- **Modular Architecture**: Easy to add new fact-checking sources
- **API Rate Limiting**: Respects external service limits
- **Error Handling**: Graceful degradation when services unavailable
- **Resource Management**: Minimal memory footprint

---

## 🔒 **Security & Privacy**

### **Data Protection**

- **Local Processing**: No data sent to external servers except Gemini
- **Source Verification**: Only trusted, reputable sources used
- **No Data Storage**: Selected text not permanently stored
- **HTTPS Only**: Secure communication with backend

### **Privacy Features**

- **User Control**: Users choose what to verify
- **Transparent Sources**: All references clearly cited
- **No Tracking**: No user behavior monitoring
- **Local Backend**: Full control over data processing

---

## 🎯 **Future Enhancements**

### **Planned Features**

- **Multi-language Support**: Hindi, regional languages
- **Batch Processing**: Verify multiple claims at once
- **Historical Tracking**: User verification history
- **Community Features**: User-contributed fact-checks
- **Mobile App**: Extend to mobile platforms

### **Technical Improvements**

- **Advanced AI Models**: Integration with newer Gemini versions
- **Real-time Sources**: Live news and social media monitoring
- **Machine Learning**: Improved scam detection patterns
- **API Optimization**: Faster response times

---

## 📈 **Impact Metrics**

### **Success Indicators**

- **User Adoption**: Number of active users
- **Verification Accuracy**: Percentage of correct classifications
- **Source Reliability**: Quality of referenced sources
- **User Engagement**: Frequency of use and feature adoption

### **Social Impact**

- **Misinformation Reduction**: Decrease in false information sharing
- **Digital Literacy**: Improved fact-checking awareness
- **Community Trust**: Enhanced credibility of information sources
- **Educational Value**: Learning tool for critical thinking

---

## 🏆 **Technical Achievements**

### **Innovation Highlights**

- **MCP Integration**: First Chrome extension using Model Context Protocol
- **AI-Powered Fact-Checking**: Real-time verification with source grounding
- **Indian Context**: Specialized for Indian misinformation patterns
- **Modern UI/UX**: Professional, accessible interface design
- **Scalable Architecture**: Modular, extensible codebase

### **Code Quality**

- **Clean Architecture**: Separation of concerns, modular design
- **Error Handling**: Comprehensive error management
- **Documentation**: Well-documented code and APIs
- **Testing**: Robust testing framework for reliability
- **Performance**: Optimized for speed and efficiency

---

This project represents a significant step forward in combating misinformation through technology, combining cutting-edge AI capabilities with user-friendly design to create a powerful tool for truth verification in the digital age.
