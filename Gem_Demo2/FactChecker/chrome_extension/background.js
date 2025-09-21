const DEFAULT_API = "http://127.0.0.1:8080";

async function getApiBase() {
  try {
    const { apiBase } = await chrome.storage.sync.get({ apiBase: DEFAULT_API });
    return apiBase || DEFAULT_API;
  } catch (error) {
    console.error("Error getting API base:", error);
    return DEFAULT_API;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "factcheck-selection",
    title: "Verify with Gem",
    contexts: ["selection"],
  });
});

// Handle side panel opening
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "factcheck-selection") return;

  // Open side panel
  await chrome.sidePanel.open({ tabId: tab.id });

  // Send selected text to side panel
  chrome.runtime.sendMessage({
    type: "SELECTED_TEXT",
    text: info.selectionText || "",
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log("Background script received message:", message);

    if (message.type === "PING") {
      // Respond to ping from content script
      sendResponse({ status: "pong" });
      return true;
    } else if (message.type === "OPEN_SIDE_PANEL_WITH_RESULT") {
      // Open side panel and send result
      chrome.sidePanel
        .open({ tabId: sender.tab.id })
        .then(() => {
          chrome.runtime.sendMessage({
            type: "FACTCHECK_RESULT",
            data: message.data,
          });
        })
        .catch((error) => {
          console.error("Error opening side panel:", error);
        });
    } else if (message.type === "SELECTED_TEXT_FROM_CONTENT") {
      console.log("Forwarding selected text to side panel:", message.text);
      // Forward selected text to side panel with error handling
      try {
        chrome.runtime.sendMessage({
          type: "SELECTED_TEXT",
          text: message.text,
        });
      } catch (error) {
        console.error("Error forwarding selected text:", error);
        // Retry once after a short delay
        setTimeout(() => {
          try {
            chrome.runtime.sendMessage({
              type: "SELECTED_TEXT",
              text: message.text,
            });
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }, 100);
      }
      // Always send a response to the content script
      sendResponse({ status: "received" });
      return true;
    } else if (message.type === "OPEN_SOURCES") {
      console.log("Opening sources from sidepanel:", message.sources);

      // Open each source in a new tab
      message.sources.forEach((source, index) => {
        setTimeout(() => {
          try {
            chrome.tabs.create({ url: source.url });
            console.log(
              `Opening source ${index + 1}: ${source.title} - ${source.url}`
            );
          } catch (error) {
            console.error("Error opening tab:", error);
          }
        }, index * 300); // Stagger the opening to avoid overwhelming the browser
      });

      // Send response back to sidepanel
      sendResponse({
        status: "success",
        opened: message.sources.length,
      });
      return true;
    }
  } catch (error) {
    console.error("Error processing message in background:", error);
  }

  // Return true to indicate we will send a response asynchronously
  return true;
});
