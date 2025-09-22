# 💎 Gem – Select → Verify → Understand

<p align="center">
  <img src="https://github.com/SrikarVamsi/Gem/blob/main/logo.png" alt="Gem Logo" width="200">
</p>

> **Instant fact-checking, right where misinformation spreads.**

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
 
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  <img src="https://img.shields.io/github/stars/SrikarVamsi/Gem?style=social" />
</p>

---

## **Note**
Here are the options

Option 1: Chrome Extension (Full Experience) - check the Quick start section to see how to run the backend before adding the extension to chrome.

Download gem-extension.zip
Run the MCP backend
Open Chrome → chrome://extensions/
Enable "Developer mode" (top right)
Click "Load unpacked" → Select extracted folder
Visit any webpage, highlight text → Gem side panel opens


Option 2: Web Demo (Fastest)

Visit the web demo link : 
Try the sample claims or enter your own
See real-time fact-checking with AI analysis

--- 

## 🎬 Demo Video

<p align="center">
  <a href="https://drive.google.com/file/d/1tI6x8x2cOwEPFrhoZlrkbfXmw9egM4bh/view?usp=sharing" target="_blank">
    <img src="https://img.shields.io/badge/▶️-Watch%20Demo-red?style=for-the-badge" alt="Demo Video" />
  </a>
</p>

---

## 📑 Table of Contents
- [🚨 The Problem](#-the-problem)  
- [💡 Our Solution – Gem](#-our-solution--gem)  
- [🎥 How It Works](#-how-it-works-workflow)  
- [🖼️ Screenshots](#-screenshots)  
- [🛠️ Tech Stack](#-tech-stack)  
- [🔥 Features Roadmap](#-features-roadmap)  
- [⚡ Quick Start](#-quick-start-local-setup)  

- [📜 License](#-license)  
- [🙌 Acknowledgements](#-acknowledgements)  

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
✅ **Confidence Score** – backed by Gemini’s analysis  
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

<p align="center">
  <img src="https://github.com/SrikarVamsi/Gem/blob/main/Architecure.jpeg" width="600" />
</p>

<p align="center">
  <img src="https://github.com/SrikarVamsi/Gem/blob/main/Use_Case.jpeg" width="600" />
</p>

---

## 🖼️ Screenshots
<p align="center">
  <img src="https://github.com/SrikarVamsi/Gem/blob/main/Initial.png" width="400" />
  <img src="https://github.com/SrikarVamsi/Gem/blob/main/Side_Panel.png" width="400" />
</p>

---

## 🛠️ Tech Stack

### 🤖 AI & Intelligence
- **Gemini 2.5 Flash** – misinformation detection & explanation  
- **MCP Integration** – structured JSON outputs (`label`, `explanation`, `confidence`, `evidence`)  
- **Vertex AI** – scalable model orchestration & monitoring  
- **Responsible AI APIs** – toxicity & bias filtering  
- **LangChain** – AI pipeline flexibility  

### 🌐 Frontend (Chrome Extension)
- **Chrome Extension (Manifest V3)** – `sidePanel`, `contextMenus`, `storage`  
- **Vanilla JS + CSS3** – lightweight, fast UI  
- **Material Design 3** – Google’s clean design system  
- **LocalStorage / IndexedDB** – caching previous checks  
- **Firebase Authentication** – user profiles  

### ⚡ Backend (API & Scraping)
- **FastAPI (MCP Server)** – core API engine  
- **HTTPX + BeautifulSoup4 + Tenacity** – robust scraping & retries  
- **Pydantic** – structured data validation  

### ☁️ Infrastructure (Google Cloud)
- **Cloud Run** – serverless FastAPI deployment  
- **Secret Manager** – secure API key storage  
- **Cloud Logging & Monitoring** – performance & reliability tracking  
- **BigQuery & Firestore** – analytics & storage  


---

## 🔥 Features Roadmap
- 🌍 Multi-language support (Hindi, Telugu, Tamil, etc)  
- 📱 Mobile-friendly interface (via companion app)  
- 🛡️ Community-powered misinformation reports  
- 📊 Analytics dashboard for misinformation trends  

---

## ⚡ Quick Start (Local Setup)

Since it is a chrome extension, you can set it up in your browser with the below steps, Don't forget to run the BACKEND SERVER first to get to see the extension in real time action!

<details>
<summary>1️⃣ Setup Chrome Extension</summary>

1. Zip the folder: `chrome_extension`  
2. Open Chrome → go to `chrome://extensions/`  
3. Enable **Developer Mode**  
4. Click **Load unpacked** → select the `chrome_extension` folder  
5. Highlight any text → side panel opens and calls your deployed backend  
</details>

<details>
<summary>2️⃣ Setup Backend</summary>

```bash
# Navigate to backend folder
cd factCheckMCP

# Install dependencies
pip install -r requirements.txt

# Run locally
python3 main.py

```
</details>
---

## 📜 License
This project is licensed under the MIT License.  


---

## 🙌 Acknowledgements
We would like to thank the following for their support and inspiration:

- Google GEN AI Exchange Hackathon
- Team members of 'TEAM LEVEL UP':
    - Sri Chandra
    - Omkar
    - Srikar
    - Kavya 
