// Content script for Gem side panel integration
let selectionTimeout = null;
let lastSelectedText = "";
let isContextValid = true;

console.log("Gem content script loaded");

// Enhanced context validation (synchronous only)
function isExtensionContextValid() {
  try {
    // Test if we can access chrome.runtime and its properties
    if (!chrome.runtime || !chrome.runtime.id) {
      isContextValid = false;
      return false;
    }

    // Test if we can access chrome.runtime methods
    if (typeof chrome.runtime.sendMessage !== "function") {
      isContextValid = false;
      return false;
    }

    // Test if we can access chrome.runtime.onMessage
    if (typeof chrome.runtime.onMessage !== "object") {
      isContextValid = false;
      return false;
    }

    return isContextValid;
  } catch (e) {
    isContextValid = false;
    return false;
  }
}

// Async context validation for actual message testing
async function testContextWithMessage() {
  try {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "PING" }, (response) => {
        if (chrome.runtime.lastError) {
          isContextValid = false;
          console.log("Context invalidated:", chrome.runtime.lastError.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (e) {
    isContextValid = false;
    return false;
  }
}

// Send message with retry logic
function sendMessageWithRetry(message, retries = 3, delay = 500) {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount) => {
      // First check synchronous context validation
      if (!isExtensionContextValid()) {
        reject(new Error("Extension context invalidated"));
        return;
      }

      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.log(
            `Message send failed (attempt ${retryCount}):`,
            chrome.runtime.lastError.message
          );

          // Check if it's a context invalidation error
          if (
            chrome.runtime.lastError.message.includes(
              "Extension context invalidated"
            ) ||
            chrome.runtime.lastError.message.includes(
              "Receiving end does not exist"
            )
          ) {
            isContextValid = false;
            reject(new Error("Extension context invalidated"));
            return;
          }

          if (retryCount > 0) {
            setTimeout(() => attempt(retryCount - 1), delay * (4 - retryCount)); // Exponential backoff
          } else {
            reject(new Error("All retry attempts failed"));
          }
        } else {
          resolve(response);
        }
      });
    };

    attempt(retries);
  });
}

// Cleanup function to remove event listeners when context is invalidated
function cleanup() {
  document.removeEventListener("mouseup", handleTextSelection);
  document.removeEventListener("keyup", handleTextSelection);
  document.removeEventListener("selectionchange", handleTextSelection);
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  // Clear all intervals
  if (contextMonitor) clearInterval(contextMonitor);
  if (contextTester) clearInterval(contextTester);

  console.log("Content script cleaned up due to context invalidation");
}

// Handle page visibility changes
function handleVisibilityChange() {
  if (document.hidden) {
    // Page is hidden, pause monitoring
    return;
  } else {
    // Page is visible, check context validity
    if (!isExtensionContextValid()) {
      cleanup();
    }
  }
}

// Monitor extension context with exponential backoff
let contextCheckInterval = 1000;
const contextMonitor = setInterval(() => {
  if (!isExtensionContextValid()) {
    cleanup();
    clearInterval(contextMonitor);
  } else {
    // Gradually increase check interval if context is stable
    contextCheckInterval = Math.min(contextCheckInterval * 1.1, 5000);
  }
}, contextCheckInterval);

// Periodic context test with actual message (less frequent)
let contextTestInterval = 10000; // Test every 10 seconds
const contextTester = setInterval(async () => {
  if (!isExtensionContextValid()) {
    cleanup();
    clearInterval(contextTester);
    return;
  }

  // Test context with actual message
  const isValid = await testContextWithMessage();
  if (!isValid) {
    cleanup();
    clearInterval(contextTester);
  }
}, contextTestInterval);

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if extension context is valid
  if (!isExtensionContextValid()) {
    console.log("Extension context invalidated, ignoring message");
    return;
  }

  console.log("Content script received message:", message);
  if (message.type === "GET_SELECTED_TEXT") {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";
    console.log("Selected text:", text);

    // Always send a response, even if empty
    sendResponse({ text: text });
    return true; // Indicate we will send a response
  }

  // Handle ping messages
  if (message.type === "PING") {
    sendResponse({ status: "pong" });
    return true;
  }
});

// Handle text selection to send to side panel
function handleTextSelection() {
  clearTimeout(selectionTimeout);

  selectionTimeout = setTimeout(() => {
    // Check if extension context is valid
    if (!isExtensionContextValid()) {
      console.log("Extension context invalidated, skipping text selection");
      return;
    }

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    console.log("Text selection detected:", text);

    if (text && text.length > 1 && text !== lastSelectedText) {
      lastSelectedText = text;
      console.log("Sending selected text to background:", text);

      // Send selected text to background script with retry logic
      sendMessageWithRetry({
        type: "SELECTED_TEXT_FROM_CONTENT",
        text: text,
      }).catch((error) => {
        console.log(
          "Failed to send selected text after retries:",
          error.message
        );
      });
    }
  }, 50); // Reduced timeout for faster response
}

// Enhanced text selection detection
function setupTextSelectionListeners() {
  // Primary selection events
  document.addEventListener("mouseup", handleTextSelection);
  document.addEventListener("keyup", handleTextSelection);
  document.addEventListener("selectionchange", handleTextSelection);

  // Additional aggressive detection
  document.addEventListener("mouseup", () => {
    setTimeout(handleTextSelection, 50);
  });

  document.addEventListener("mousedown", () => {
    setTimeout(handleTextSelection, 200);
  });

  // Double-check selection after mouseup
  document.addEventListener("mouseup", () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 1) {
        handleTextSelection();
      }
    }, 100);
  });

  // Add touch events for mobile devices
  document.addEventListener("touchend", handleTextSelection);

  // Add focus events to catch programmatic selections
  document.addEventListener("focus", () => {
    setTimeout(handleTextSelection, 100);
  });

  // Monitor page visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);

  console.log("Text selection listeners attached");
}

// Setup listeners when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupTextSelectionListeners);
} else {
  setupTextSelectionListeners();
}

// Fallback: Periodic check for text selection
setInterval(() => {
  if (!isExtensionContextValid()) {
    console.log("Extension context invalidated, skipping periodic check");
    return;
  }

  const selection = window.getSelection();
  const text = selection?.toString().trim();
  if (text && text.length > 1 && text !== lastSelectedText) {
    console.log("Periodic check detected text:", text);
    handleTextSelection();
  }
}, 3000); // Increased interval to reduce load

// Handle context menu clicks (legacy support)
chrome.runtime.onMessage.addListener((msg) => {
  // Check if extension context is valid
  if (!isExtensionContextValid()) {
    console.log("Extension context invalidated, ignoring message");
    return;
  }

  if (msg?.type === "FACTCHECK_RESULT") {
    // Open side panel with results using retry logic
    sendMessageWithRetry({
      type: "OPEN_SIDE_PANEL_WITH_RESULT",
      data: msg.data,
    }).catch((error) => {
      console.log("Failed to open side panel after retries:", error.message);
    });
  } else if (msg?.type === "FACTCHECK_ERROR") {
    // Handle error
    console.error("FactCheck error:", msg.error);
  }
});
