function getSelectedRange() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  return selection.getRangeAt(0);
}

function highlightText(range, text, label) {
  const span = document.createElement("span");
  span.textContent = text;
  span.style.textDecoration = "underline wavy red";
  span.style.textDecorationThickness = "2px";
  span.title = label;
  span.style.cursor = "help";
  range.deleteContents();
  range.insertNode(span);
}

function showToast(message, coords) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "absolute";
  toast.style.left = `${coords.x}px`;
  toast.style.top = `${coords.y}px`;
  toast.style.background = "#323232";
  toast.style.color = "#fff";
  toast.style.padding = "8px 12px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = 9999;
  toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "highlight") {
    const { data, text } = message;
    const range = getSelectedRange();
    if (!range) return;

    if (data.class === 3) {
      const rect = range.getBoundingClientRect();
      showToast("Ничего не найдено!", { x: rect.left + window.scrollX, y: rect.top + window.scrollY });
    } else {
      let label = "Подозрение на неизвестный тип";
      if (data.class === 0) label = "Подозрение на фишинг";
      if (data.class === 1) label = "Подозрение на спам";
      if (data.class === 2) label = "Подозрение на манипуляцию";

      highlightText(range, text, label);
    }
  }
});
