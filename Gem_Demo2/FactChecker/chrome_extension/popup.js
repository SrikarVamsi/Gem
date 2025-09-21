// Popup script to open side panel
document.addEventListener("DOMContentLoaded", async () => {
  const openSidePanelBtn = document.getElementById("openSidePanel");

  openSidePanelBtn.addEventListener("click", async () => {
    try {
      // Get the current tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Open the side panel
      await chrome.sidePanel.open({ tabId: tab.id });

      // Close the popup
      window.close();
    } catch (error) {
      console.error("Error opening side panel:", error);
    }
  });
});
