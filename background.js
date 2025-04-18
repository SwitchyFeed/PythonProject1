chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-message",
    title: "Проверить сообщение",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "check-message") {
    const selectedText = info.selectionText;
    const SERVER_URL = "https://electric-zara-switchyfeed-4a33dae6.koyeb.app/validate";

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: selectedText })
      });

      const result = await response.json();
      if (result && result.class !== undefined) {
        chrome.tabs.sendMessage(tab.id, { action: "highlight", data: result, text: selectedText });
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  }
});