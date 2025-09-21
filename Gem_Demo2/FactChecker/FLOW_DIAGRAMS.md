# Gem Fact-Checker Chrome Extension - Flow Diagrams

## Diagram 1: Process Flow / Use-Case Diagram

_User Journey and Experience Flow_

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GEM FACT-CHECKER USER JOURNEY                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │   TEXT      │    │   AI        │    │   RESULTS   │
│ SELECTS     │───▶│ SELECTION   │───▶│ VERIFICATION│───▶│ DISPLAY     │
│ TEXT ON     │    │ DETECTION   │    │ PROCESSING  │    │ & ANALYSIS  │
│ WEBPAGE     │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   SIDE      │    │   AUTO      │    │   MCP       │    │   VERDICT   │
│ PANEL       │    │   POPUP     │    │   BACKEND   │    │   BADGE     │
│ OPENS       │    │   APPEARS   │    │   ANALYSIS  │    │   (Verified │
│             │    │             │    │             │    │   Suspicious│
│             │    │             │    │             │    │   Fake)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   TEXT      │    │   LOADING   │    │   EVIDENCE  │    │   SOURCES   │
│ INPUT      │    │   SPINNER   │    │   ANALYSIS  │    │   LIST      │
│ FIELD      │    │   DISPLAY   │    │   WITH      │    │   WITH      │
│ POPULATED  │    │             │    │   QUOTES    │    │   URLS      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │   CONFIDENCE│    │   SCAM      │    │   ACTION    │
│ CAN EDIT   │    │   SCORE     │    │   WARNING   │    │   BUTTONS   │
│ TEXT       │    │   DISPLAY   │    │   (IF       │    │   (Share,  │
│            │    │             │    │   DETECTED) │    │   Save,     │
│            │    │             │    │             │    │   Copy)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER BENEFITS                                     │
│  • Instant fact-checking of any selected text                                │
│  • Trusted source verification with evidence                                 │
│  • Scam detection and warning system                                         │
│  • Confidence scoring for reliability assessment                             │
│  • Shareable reports for social media and communication                      │
│  • Saved verification history for future reference                          │
└─────────────────────────────────────────────────────────────────────────────────┘

USE CASES:
1. Text Selection → Auto-verification
2. Manual Text Input → Verification
3. Context Menu → "Verify with Gem"
4. Extension Icon Click → Side Panel Access
5. Results Sharing → Social Media/Communication
6. Report Saving → Local Storage
7. Source Verification → External Link Access
```

---

## Diagram 2: Architecture Diagram

_Technical System Components and Data Flow_

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GEM FACT-CHECKER ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              INPUT LAYER                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   WEBPAGE   │    │   USER      │    │   CONTEXT   │    │   MANUAL    │
│   TEXT      │    │   SELECTION │    │   MENU      │    │   TEXT      │
│   SELECTION │    │   DETECTION │    │   CLICK     │    │   INPUT     │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CHROME EXTENSION LAYER                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CONTENT   │    │   BACKGROUND│    │   SIDE      │    │   POPUP     │
│   SCRIPT    │    │   SCRIPT    │    │   PANEL     │    │   HTML      │
│   (DOM      │    │   (Service  │    │   (Main     │    │   (Welcome  │
│   Events)   │    │   Worker)   │    │   UI)       │    │   Screen)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   TEXT      │    │   MESSAGE   │    │   UI        │    │   REDIRECT  │
│   CAPTURE   │    │   ROUTING   │    │   RENDERING │    │   TO SIDE   │
│   & SEND    │    │   & EVENTS  │    │   & LOGIC   │    │   PANEL     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              COMMUNICATION LAYER                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CHROME    │    │   HTTP      │    │   JSON      │    │   CORS      │
│   MESSAGING │    │   REQUESTS  │    │   API       │    │   HANDLING  │
│   API       │    │   (Fetch)   │    │   FORMAT    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   MCP       │    │   FASTAPI   │    │   GEMINI   │    │   FACT      │
│   SERVER    │    │   SERVER    │    │   AI       │    │   CHECKING  │
│   (Model    │    │   (HTTP     │    │   CLIENT   │    │   LOGIC     │
│   Context   │    │   Endpoint) │    │   (LLM)    │    │             │
│   Protocol) │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PYTHON    │    │   UVICORN   │    │   GOOGLE   │    │   ANALYSIS  │
│   BACKEND   │    │   SERVER    │    │   AI       │    │   ENGINE    │
│   (main.py) │    │   (Port     │    │   API      │    │             │
│             │    │   8080)     │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PROCESSING LAYER                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   TEXT      │    │   AI        │    │   EVIDENCE  │    │   SOURCE    │
│   ANALYSIS  │    │   REASONING │    │   EXTRACTION│    │   VERIFICATION│
│   &         │    │   &         │    │   &         │    │   &         │
│   PARSING   │    │   VALIDATION│    │   QUOTATION │    │   LINKING   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CONFIDENCE│    │   SCAM      │    │   FACTUAL   │    │   TRUSTED   │
│   SCORING   │    │   DETECTION │    │   ACCURACY  │    │   SOURCES   │
│   (0-100%)  │    │   ALGORITHM │    │   ASSESSMENT│    │   DATABASE  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              OUTPUT LAYER                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   VERDICT   │    │   EXPLANATION│   │   EVIDENCE  │    │   SOURCES   │
│   BADGE     │    │   TEXT       │   │   LIST      │    │   LIST      │
│   (Verified │    │   (Full      │   │   (Quotes   │    │   (URLs     │
│   Suspicious│    │   Analysis)  │   │   & Links)  │    │   & Titles) │
│   Fake)     │    │             │   │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CONFIDENCE│    │   SCAM      │    │   ACTION    │    │   USER      │
│   BAR       │    │   WARNING   │    │   BUTTONS   │    │   FEEDBACK  │
│   (Progress │    │   (If       │    │   (Share,   │    │   &         │
│   Indicator)│    │   Detected) │    │   Save,     │    │   INTERACTION│
│             │    │             │    │   Copy)     │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW SUMMARY                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

INPUT → CHROME EXTENSION → HTTP API → MCP BACKEND → AI PROCESSING → OUTPUT

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USER      │    │   TEXT      │    │   AI        │    │   RESULTS   │
│   SELECTS   │───▶│   SENT TO   │───▶│   ANALYZES  │───▶│   DISPLAYED │
│   TEXT      │    │   BACKEND   │    │   & VERIFIES│    │   TO USER   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

TECHNICAL STACK:
• Frontend: HTML5, CSS3, JavaScript (ES6+)
• Extension: Chrome Extension Manifest V3
• Backend: Python, FastAPI, Uvicorn
• AI: Google Gemini AI, MCP Protocol
• Communication: HTTP/REST API, Chrome Messaging API
• Storage: Local Storage (reports), No external database
• Hosting: Local development (127.0.0.1:8080)

SECURITY FEATURES:
• CORS handling for cross-origin requests
• Input sanitization and validation
• Secure API communication
• No sensitive data storage
• Local processing only
```

---

## Key Differences Summary

| Aspect       | Process Flow Diagram             | Architecture Diagram               |
| ------------ | -------------------------------- | ---------------------------------- |
| **Focus**    | User-centric, story-driven       | System-centric, technical          |
| **Purpose**  | Shows user experience journey    | Shows technical infrastructure     |
| **Elements** | User actions, UI interactions    | Components, APIs, data flow        |
| **Style**    | Linear progression with benefits | Structured blocks with connections |
| **Audience** | End users, stakeholders          | Developers, technical team         |
| **Content**  | What user does and gets          | How system works internally        |

## Implementation Notes

1. **Process Flow**: Emphasizes the seamless user experience from text selection to verified results
2. **Architecture**: Shows the robust technical foundation with clear separation of concerns
3. **Data Flow**: Illustrates how information moves through the system layers
4. **Security**: Highlights the secure, local-first approach
5. **Scalability**: Demonstrates modular design for future enhancements

These diagrams provide a comprehensive view of both the user experience and technical implementation of the Gem fact-checker Chrome extension.
