# 💎 Gem – Select->Verify->Understand

![Gem Logo](./assets/gem-logo.png)  
> **Instant fact-checking, right where misinformation spreads.**  

---

## 🚨 The Problem
Misinformation spreads faster than the truth.  
From fake WhatsApp forwards to scam messages and manipulated news, it has become one of the **biggest threats to society**.  

- ❌ Social unrest fueled by false claims  
- ❌ Public health crises triggered by misinformation  
- ❌ Financial scams stealing money from the vulnerable  

And the worst part?  
Most people don’t have **accessible tools** to verify information at the moment they consume it.  

---

## 💡 Our Solution – **Gem**
Meet **Gem**, your **real-time fact-checking Chrome extension**, powered by **Google Gemini**.  

✨ Highlight text in your browser → Gem instantly verifies it using **trusted sources** and explains *why* it’s trustworthy or misleading.  

✅ **Instant Verdict** – Verified, Suspicious, or Fake  
✅ **Confidence Score** – back by Gemini’s analysis  
✅ **Source Evidence** – PIB, AltNews, WHO, Reuters, Wikipedia  
✅ **Scam Detection** – financial safety layer  
✅ **Explainable AI** – users learn while verifying  

> In short: **Gem stops misinformation at the point of consumption.**

---

## 🎥 How It Works (Workflow)

1. User highlights text in any webpage.  
2. Gem side panel opens automatically.  
3. Text sent → **FastAPI MCP backend**.  
4. Backend fetches sources (PIB, Reuters, WHO, etc).  
5. **Google Gemini 1.5 Flash** analyzes claim + evidence.  
6. Side panel shows: Verdict ✅, Confidence Bar 📊, Evidence Cards 📰.  
7. User can share or save report.  

![Workflow Diagram](./assets/workflow.png)

---

## 🖼️ Screenshots

| Select Text | Gemini Verifying | Results Displayed |
|-------------|-----------------|-------------------|
| ![](./assets/step1.png) | ![](./assets/step2.png) | ![](./assets/step3.png) |

---

## 🛠️ Tech Stack

**Frontend (Chrome Extension)**  
- Manifest V3, Vanilla JS, CSS3  
- Chrome APIs: `sidePanel`, `contextMenus`, `storage`  

**Backend (FastAPI MCP Server)**  
- FastAPI, HTTPX, BeautifulSoup4, Tenacity, Pydantic  

**AI Layer**  
- Google Gemini 1.5 Flash (via MCP)  
- Structured JSON outputs: `{ label, explanation, confidence, evidence }`  

**Sources**  
- PIB, AltNews, BoomLive, Reuters, WHO, Wikipedia  

**Google Cloud (Infra)**  
- Cloud Run (deployment)  
- Secret Manager (secure keys)  
- Cloud Logging (usage & errors)  
- BigQuery / Firestore (analytics)  

---

## 🔥 Features Roadmap
- 🌍 Multi-language support (Hindi, Telugu, Tamil, etc)  
- 📱 Mobile-friendly interface (via companion app)  
- 🛡️ Community-powered misinformation reports  
- 📊 Analytics dashboard for trends  

---

## ⚡ Quick Start

Clone this repo and install dependencies:

```bash
git clone https://github.com/<your-username>/gem.git
cd gem
