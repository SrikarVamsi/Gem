// Side Panel JavaScript for Gem Fact Checker
class GemSidePanel {
  constructor() {
    this.textInput = document.getElementById("textInput");
    this.verifyBtn = document.getElementById("verifyBtn");
    this.statusSection = document.getElementById("statusSection");
    this.statusText = document.getElementById("statusText");
    this.resultsSection = document.getElementById("resultsSection");
    this.pinButton = document.getElementById("pinButton");
    this.highlightedTextCard = document.getElementById("highlightedTextCard");
    this.highlightedText = document.getElementById("highlightedText");

    this.isPinned = false;
    this.currentText = "";
    this.currentSources = []; // Store sources from the last API response

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSelectedText();

    // Add a fallback mechanism to check for text selection periodically
    this.setupPeriodicTextCheck();
  }

  setupPeriodicTextCheck() {
    // Check for text selection every 2 seconds as a fallback
    setInterval(() => {
      this.checkForSelectedText();
    }, 2000);
  }

  async checkForSelectedText() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) return;

      // Try to get selected text from content script
      this.sendMessageWithRetry(tab.id, { type: "GET_SELECTED_TEXT" })
        .then((response) => {
          if (
            response &&
            response.text &&
            response.text.trim() &&
            response.text !== this.currentText
          ) {
            this.textInput.value = response.text;
            this.currentText = response.text;
            this.showHighlightedText(response.text);
            // Auto-verify if text is provided
            setTimeout(() => this.verifyText(), 1000);
          }
        })
        .catch((error) => {
          // Silently fail - this is just a fallback check
        });
    } catch (error) {
      // Silently fail - this is just a fallback check
    }
  }

  setupEventListeners() {
    // Verify button click
    this.verifyBtn.addEventListener("click", () => this.verifyText());

    // Enter key in textarea
    this.textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        this.verifyText();
      }
    });

    // Pin button
    this.pinButton.addEventListener("click", () => this.togglePin());

    // Listen for messages from content script and background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      try {
        console.log("Sidepanel received message:", message);

        if (message.type === "SELECTED_TEXT") {
          console.log("Processing selected text:", message.text);
          this.textInput.value = message.text;
          this.currentText = message.text;
          this.textInput.focus();

          // Show highlighted text card
          if (message.text && message.text.trim()) {
            this.showHighlightedText(message.text);
            // Auto-verify if text is provided
            setTimeout(() => this.verifyText(), 1000);
          } else {
            this.hideHighlightedText();
          }
        } else if (message.type === "FACTCHECK_RESULT") {
          this.showResults(message.data);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // ESC key to close (if not pinned)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.isPinned) {
        this.closePanel();
      }
    });
  }

  async loadSelectedText() {
    try {
      // Get the current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        console.log("No active tab found");
        return;
      }

      // Send message to content script to get selected text with retry logic
      this.sendMessageWithRetry(tab.id, { type: "GET_SELECTED_TEXT" })
        .then((response) => {
          if (response && response.text) {
            this.textInput.value = response.text;
            this.currentText = response.text;
            // Auto-verify if text is provided
            if (response.text.trim()) {
              setTimeout(() => this.verifyText(), 1000);
            }
          }
        })
        .catch((error) => {
          console.log("Could not get selected text:", error.message);
          // Try to inject content script if it's not loaded
          this.injectContentScriptIfNeeded(tab.id);
        });
    } catch (error) {
      console.log("Could not load selected text:", error);
    }
  }

  async sendMessageWithRetry(tabId, message, retries = 3, delay = 500) {
    return new Promise((resolve, reject) => {
      const attempt = (retryCount) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            console.log(
              `Message send failed (attempt ${retryCount}):`,
              chrome.runtime.lastError.message
            );

            if (retryCount > 0) {
              setTimeout(
                () => attempt(retryCount - 1),
                delay * (4 - retryCount)
              );
            } else {
              reject(new Error(chrome.runtime.lastError.message));
            }
          } else {
            resolve(response);
          }
        });
      };

      attempt(retries);
    });
  }

  async injectContentScriptIfNeeded(tabId) {
    try {
      // Try to inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["contentScript.js"],
      });
      console.log("Content script injected successfully");

      // Wait a bit for the script to initialize, then try again
      setTimeout(() => {
        this.loadSelectedText();
      }, 1000);
    } catch (error) {
      console.log("Could not inject content script:", error);
    }
  }

  async verifyText() {
    const text = this.textInput.value.trim();
    if (!text) {
      this.showStatus("Please enter some text to verify", "error");
      return;
    }

    this.showLoading();

    try {
      const result = await this.postCheck(text);
      this.showResults(result);
    } catch (error) {
      this.showError(error.message);
    }
  }

  async postCheck(content) {
    console.log("Sending request to MCP server with content:", content);

    const response = await fetch("http://127.0.0.1:8080/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("MCP server response:", result);
    console.log("Sources in response:", result?.sources);
    console.log("Sources length:", result?.sources?.length);

    return result;
  }

  showLoading() {
    this.statusSection.style.display = "block";
    this.resultsSection.style.display = "none";
    this.verifyBtn.disabled = true;
    this.statusText.innerHTML = `
      <div class="spinner"></div>
      <span>Verifying your text...</span>
    `;
  }

  showSkeletonLoader() {
    this.statusSection.style.display = "block";
    this.resultsSection.style.display = "none";
    this.verifyBtn.disabled = true;
    this.statusText.innerHTML = `
      <div class="skeleton short"></div>
      <div class="skeleton medium"></div>
      <div class="skeleton long"></div>
    `;
  }

  showStatus(message, type = "info") {
    this.statusSection.style.display = "block";
    this.resultsSection.style.display = "none";
    this.verifyBtn.disabled = false;
    this.statusText.textContent = message;

    // Add type-specific styling
    this.statusSection.className = `status-section ${type}`;
  }

  showError(message) {
    this.showStatus(`Error: ${message}`, "error");
  }

  showHighlightedText(text) {
    this.highlightedText.textContent = text;
    this.highlightedTextCard.style.display = "block";
    this.highlightedTextCard.classList.add("slide-in");
  }

  hideHighlightedText() {
    this.highlightedTextCard.style.display = "none";
    this.highlightedTextCard.classList.remove("slide-in");
  }

  showResults(result) {
    this.statusSection.style.display = "none";
    this.resultsSection.style.display = "block";
    this.verifyBtn.disabled = false;

    const analysis = result?.analysis || {};
    const label = analysis?.label || "Unknown";
    const explanation = analysis?.explanation || "No explanation available";
    const confidence = analysis?.confidence || 0.5;
    const evidence = analysis?.evidence || [];
    const sources = result?.sources || [];
    const scam = result?.scam?.is_suspicious;

    // Debug: Log the full result and sources
    console.log("Full API result:", result);
    console.log("Sources from API:", sources);
    console.log("Sources length:", sources.length);

    // Store the sources from the API response for the Sources button
    this.currentSources = sources;
    console.log("Stored currentSources:", this.currentSources);

    this.resultsSection.innerHTML = this.renderResults({
      label,
      explanation,
      confidence,
      evidence,
      sources,
      scam,
    });

    // Scroll to results section to make it visible
    this.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // Add slide-in animation
    this.resultsSection.classList.add("slide-in");

    // Setup interactive elements
    setTimeout(() => {
      this.setupActionButtons();
      this.setupSourceLinks();
    }, 100);
  }

  renderResults({ label, explanation, confidence, evidence, sources, scam }) {
    const confPercent = Math.round(confidence * 100);
    const verdictClass = this.getVerdictClass(label);
    const verdictLabel = this.getVerdictLabel(label);
    const emoji = this.getVerdictEmoji(label, confidence);

    const evidenceHtml =
      evidence.length > 0 ? this.renderEvidence(evidence) : "";
    const sourcesHtml = sources.length > 0 ? this.renderSources(sources) : "";
    const scamWarning = scam ? this.renderScamWarning() : "";
    const actionButtonsHtml = this.renderActionButtons();
    const sourceLinksHtml = this.renderSourceLinks(sources);

    return `
      <div class="verdict-badge ${verdictClass}">
        <span class="verdict-emoji">${emoji}</span>
        <div class="verdict-text">
          <div class="verdict-label">${verdictLabel}</div>
          <div class="verdict-confidence">${confPercent}% confidence</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${confPercent}%"></div>
          </div>
        </div>
      </div>
      
      <div class="explanation">
        ${explanation}
      </div>
      
      ${scamWarning}
      
      ${evidenceHtml}
      
      ${sourcesHtml}
      
      ${actionButtonsHtml}
      
      ${sourceLinksHtml}
    `;
  }

  getVerdictClass(label) {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("verified") || lowerLabel.includes("true"))
      return "verified";
    if (lowerLabel.includes("suspicious")) return "suspicious";
    if (lowerLabel.includes("fake") || lowerLabel.includes("false"))
      return "fake";
    return "unknown";
  }

  getVerdictLabel(label) {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("verified") || lowerLabel.includes("true"))
      return "Verified";
    if (lowerLabel.includes("suspicious")) return "Suspicious";
    if (lowerLabel.includes("fake") || lowerLabel.includes("false"))
      return "Fake";
    return "Unknown";
  }

  getVerdictEmoji(label, confidence) {
    const lowerLabel = label.toLowerCase();
    const conf = confidence || 0.5;

    if (lowerLabel.includes("verified") || lowerLabel.includes("true")) {
      return conf > 0.8 ? "😊" : "🙂";
    }
    if (lowerLabel.includes("suspicious")) {
      return conf > 0.7 ? "🤔" : "😐";
    }
    if (lowerLabel.includes("fake") || lowerLabel.includes("false")) {
      return conf > 0.8 ? "😡" : "😟";
    }
    return "❓";
  }

  renderScamWarning() {
    return `
      <div class="scam-warning">
        <span>⚠️</span>
        <span>Possible scam indicators detected</span>
      </div>
    `;
  }

  renderEvidence(evidence) {
    if (evidence.length === 0) return "";

    const evidenceItems = evidence
      .slice(0, 3)
      .map((item) => {
        const url = item?.url || "#";
        const quote = item?.quote || "No quote available";
        const support = item?.support || "unrelated";
        const supportClass = support.toLowerCase();
        const supportColor = this.getSupportColor(support);

        return `
        <div class="evidence-item">
          <div class="evidence-quote">"${quote}"</div>
          <div class="evidence-actions">
            <a href="${url}" target="_blank" class="source-link">View Source</a>
            <span class="support-badge ${supportClass}">${support}</span>
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <div class="evidence-section">
        <div class="section-title">
          <span>📚</span>
          <span>Evidence</span>
        </div>
        ${evidenceItems}
      </div>
    `;
  }

  renderSources(sources) {
    if (sources.length === 0) {
      return `
        <div class="sources-box">
          <div class="sources-box-header">
            <span>🔍</span>
            <span>Verification Sources</span>
          </div>
          <div class="sources-box-content">
            <div class="no-sources-message">
              <div class="no-sources-icon">📚</div>
              <div class="no-sources-text">
                <strong>AI Knowledge Base</strong><br>
                This verification was completed using our AI's comprehensive knowledge base and reasoning capabilities.
              </div>
            </div>
          </div>
        </div>
      `;
    }

    const sourceItems = sources
      .slice(0, 8) // Show more sources
      .map((source, index) => {
        const url = source?.url || "#";
        const title = source?.title || "Source";
        const domain = this.extractDomain(url);

        return `
        <div class="source-item">
          <div class="source-number">${index + 1}</div>
          <div class="source-content">
            <div class="source-title">${title}</div>
            <div class="source-domain">${domain}</div>
            <a href="${url}" target="_blank" class="source-link">
              🔗 Visit Source
            </a>
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <div class="sources-box">
        <div class="sources-box-header">
          <span>🔍</span>
          <span>Verification Sources</span>
          <div class="sources-count-badge">
            ${sources.length} source${sources.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div class="sources-box-content">
          <div class="sources-description">
            The following trusted sources were consulted to verify this information:
          </div>
          ${sourceItems}
        </div>
      </div>
    `;
  }

  extractDomain(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "");
    } catch (e) {
      return url;
    }
  }

  renderActionButtons() {
    return `
      <div class="action-buttons">
        <button class="action-btn save-btn" data-action="save">
          <span>💾</span>
          <span>Save</span>
        </button>
        <button class="action-btn share-btn" data-action="share">
          <span>📤</span>
          <span>Share</span>
        </button>
        <button class="action-btn copy-btn" data-action="copy">
          <span>📋</span>
          <span>Copy</span>
        </button>
        <button class="action-btn visit-sources-btn" data-action="visit-sources">
          <span>🔍</span>
          <span>Sources</span>
        </button>
      </div>
    `;
  }

  renderSourceLinks(sources) {
    if (!sources || sources.length === 0) {
      return "";
    }

    const sourceLinks = sources
      .slice(0, 5) // Show up to 5 source links
      .map((source, index) => {
        const url = source?.url || "#";
        const title = source?.title || `Source ${index + 1}`;
        const domain = this.extractDomain(url);
        return `
          <a href="${url}" target="_blank" class="source-link" data-source-index="${index}" data-source-url="${url}">
            <div style="font-weight: 600; margin-bottom: 2px;">${title}</div>
            <div style="font-size: 11px; color: #666; opacity: 0.8;">${domain}</div>
          </a>
        `;
      })
      .join("");

    return `
      <div class="source-links">
        <div style="font-size: 12px; font-weight: 600; color: #5f6368; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
          🔗 Quick Source Links
        </div>
        ${sourceLinks}
      </div>
    `;
  }

  getSupportColor(support) {
    const lowerSupport = support.toLowerCase();
    if (lowerSupport === "supports") return "#35A652";
    if (lowerSupport === "refutes") return "#EA4336";
    return "#4386F5";
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    this.pinButton.classList.toggle("pinned", this.isPinned);
    this.pinButton.textContent = this.isPinned ? "📍" : "📌";
    this.pinButton.title = this.isPinned ? "Unpin panel" : "Pin panel";
  }

  closePanel() {
    // Close the side panel
    chrome.sidePanel.close();
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      // Show feedback
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = "✅ Copied!";
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  setupCopyButtons() {
    const copyButtons = document.querySelectorAll(".copy-button");
    copyButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const textToCopy =
          button.getAttribute("data-copy-text") || this.currentText;
        this.copyToClipboard(textToCopy);
      });
    });
  }

  setupActionButtons() {
    const actionButtons = document.querySelectorAll(".action-btn");
    actionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = button.getAttribute("data-action");
        this.handleAction(action, e);
      });
    });
  }

  setupSourceLinks() {
    const sourceLinks = document.querySelectorAll(".source-link");
    sourceLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const sourceIndex = link.getAttribute("data-source-index");
        this.handleSourceClick(sourceIndex, e);
      });
    });
  }

  handleAction(action, event) {
    switch (action) {
      case "share":
        this.shareReport();
        break;
      case "save":
        this.saveReport(event);
        break;
      case "copy":
        this.copyReport(event);
        break;
      case "visit-sources":
        this.openAllSources(event);
        break;
      default:
        console.log("Unknown action:", action);
    }
  }

  handleSourceClick(sourceIndex, event) {
    console.log(`Opening source ${sourceIndex}`);
    // The link will open automatically due to target="_blank"
    // We can add analytics or tracking here if needed
  }

  copyReport(event) {
    const reportText = this.generateReportText();
    this.copyToClipboard(reportText);

    // Show feedback
    const button = event.target.closest(".action-btn");
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = "<span>✅</span><span>Copied!</span>";
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    }
  }

  openAllSources(event) {
    console.log("openAllSources called");
    console.log("Current sources from API:", this.currentSources);
    console.log("Current sources type:", typeof this.currentSources);
    console.log("Current sources length:", this.currentSources?.length);

    // Use the sources from the API response instead of DOM extraction
    const sources = this.currentSources
      .filter((source) => source.url && source.url !== "#")
      .map((source) => ({
        url: source.url,
        title: source.title || "Source",
      }));

    console.log("Filtered sources:", sources);
    console.log("Sources after filtering:", sources.length);

    if (sources.length === 0) {
      console.log("No sources to open");
      console.log("Debug info:");
      console.log("- currentSources:", this.currentSources);
      console.log("- currentSources length:", this.currentSources?.length);
      console.log("- Have you verified text first?", this.currentText);

      alert(
        "No sources found to open. Make sure you have verified some text first.\n\nDebug: Check console for details."
      );
      return;
    }

    // Show feedback
    const button = event.target.closest(".action-btn");
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = `<span>🔍</span><span>Opening ${sources.length} sources...</span>`;

      // Send message to background script to open tabs
      chrome.runtime.sendMessage(
        {
          type: "OPEN_SOURCES",
          sources: sources,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message to background:",
              chrome.runtime.lastError
            );
            // Fallback: try to open in current window
            sources.forEach((source, index) => {
              setTimeout(() => {
                window.open(source.url, "_blank");
              }, index * 200);
            });
          } else {
            console.log("Sources opened successfully:", response);
          }
        }
      );

      setTimeout(() => {
        button.innerHTML = originalText;
      }, sources.length * 300 + 1500);
    }
  }

  generateReportText() {
    const verdict =
      document.querySelector(".verdict-label")?.textContent || "Unknown";
    const confidence =
      document.querySelector(".verdict-confidence")?.textContent || "N/A";
    const explanation =
      document.querySelector(".explanation")?.textContent || "";

    return `Gem Fact Check Report:

Text: "${this.currentText}"

Verdict: ${verdict}
Confidence: ${confidence}

Explanation: ${explanation}

Verified by Gem 💎 - AI Fact Checker`;
  }

  shareReport() {
    // Create shareable content
    const shareText = `Gem Fact Check Result:\n\n"${
      this.currentText
    }"\n\nVerdict: ${
      document.querySelector(".verdict-label")?.textContent || "Unknown"
    }\nConfidence: ${
      document.querySelector(".verdict-confidence")?.textContent || "N/A"
    }\n\nVerified by Gem 💎`;

    if (navigator.share) {
      navigator
        .share({
          title: "Gem Fact Check Result",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => {
          console.log("Error sharing:", err);
          this.copyToClipboard(shareText);
        });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  saveReport() {
    // Save report to local storage
    const report = {
      text: this.currentText,
      timestamp: new Date().toISOString(),
      verdict:
        document.querySelector(".verdict-label")?.textContent || "Unknown",
      confidence:
        document.querySelector(".verdict-confidence")?.textContent || "N/A",
      explanation: document.querySelector(".explanation")?.textContent || "",
    };

    const savedReports = JSON.parse(localStorage.getItem("gemReports") || "[]");
    savedReports.unshift(report);

    // Keep only last 50 reports
    if (savedReports.length > 50) {
      savedReports.splice(50);
    }

    localStorage.setItem("gemReports", JSON.stringify(savedReports));

    // Show feedback
    const button = event.target.closest(".gem-button");
    const originalText = button.innerHTML;
    button.innerHTML = "<span>✅</span><span>Saved!</span>";
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  }
}

// Error boundary for side panel
window.addEventListener("error", (event) => {
  console.error("Side panel error:", event.error);
  // You could show a user-friendly error message here
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection in side panel:", event.reason);
  // You could show a user-friendly error message here
});

// Initialize the side panel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Check if required elements exist
    const textInput = document.getElementById("textInput");
    const verifyBtn = document.getElementById("verifyBtn");

    if (!textInput || !verifyBtn) {
      console.error("Required elements not found in sidepanel");
      return;
    }

    new GemSidePanel();
  } catch (error) {
    console.error("Error initializing side panel:", error);

    // Show error message to user
    const statusSection = document.getElementById("statusSection");
    const statusText = document.getElementById("statusText");

    if (statusSection && statusText) {
      statusSection.style.display = "block";
      statusText.textContent =
        "Error initializing extension. Please refresh the page.";
      statusSection.className = "status-section error";
    }
  }
});
