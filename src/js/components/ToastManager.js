// components/ToastManager.js
class ToastManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  show(message, type = "success", duration = 2500) {
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = document.createElement("i");
    icon.className =
      type === "success"
        ? "fa-solid fa-circle-check"
        : type === "error"
          ? "fa-solid fa-circle-xmark"
          : "fa-solid fa-circle-info";

    const text = document.createElement("span");
    text.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    const closeIcon = document.createElement("i");
    closeIcon.className = "fa-solid fa-xmark";
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener("click", () => this._remove(toast));

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(closeBtn);

    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => this._remove(toast), duration);
  }

  _remove(toast) {
    if (!toast.isConnected) return;
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }
}

const toast = new ToastManager("toast-container");
export default toast;
