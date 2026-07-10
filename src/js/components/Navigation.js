export default class Navigation {
  constructor() {
    this.pageTitle = document.getElementById("page-title");
    this.pageSubtitle = document.getElementById("page-subtitle");
    this.navButtons = document.querySelectorAll("[data-view]");
    this.goDashboardButtons = document.querySelectorAll(
      "[id^='go-dashboard' i]",
    );
    this.viewConfigs = {
      dashboard: {
        title: "Dashboard",
        subtitle: "Welcome to your travel dashboard",
      },
      holidays: {
        title: "Holidays",
        subtitle: "Explore public holidays around the world",
      },
      events: {title: "Events", subtitle: "Discover local and upcoming events"},
      weather: {
        title: "Weather",
        subtitle: "Check the current weather conditions",
      },
      "long-weekends": {
        title: "Long Weekends",
        subtitle: "Plan your long weekend getaways",
      },
      currency: {
        title: "Currency",
        subtitle: "Convert currency and view exchange rates",
      },
      "sun-times": {
        title: "Sun Times",
        subtitle: "View sunrise and sunset schedules",
      },
      "my-plans": {
        title: "My Plans",
        subtitle: "Manage your customized travel itineraries",
      },
    };

    this.initEvents();
    this.initRouting();
  }

  initEvents() {
    this.navButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const viewName = btn.getAttribute("data-view");
        this.switchView(viewName);
      });
    });
    this.goDashboardButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchView("dashboard");
      });
    });
  }

  initRouting() {
    const initialView = this._getViewFromURL();
    if (initialView && this.viewConfigs[initialView]) {
      this.switchView(initialView, false);
    }

    window.addEventListener("popstate", () => {
      const viewName = this._getViewFromURL() || "dashboard";
      this.switchView(viewName, false);
    });
  }

  _getViewFromURL() {
    const hash = window.location.hash.replace("#", "");
    return hash && this.viewConfigs[hash] ? hash : null;
  }

  switchView(viewName, updateURL = true) {
    const config = this.viewConfigs[viewName];
    if (!config) return;
    this.resetAllViews();
    const targetView = document.getElementById(`${viewName}-view`);
    const targetBtn = document.querySelector(`[data-view='${viewName}']`);
    if (targetView) targetView.classList.add("active");
    if (targetBtn) targetBtn.classList.add("active");
    if (this.pageTitle) this.pageTitle.textContent = config.title;
    if (this.pageSubtitle) this.pageSubtitle.textContent = config.subtitle;

    if (updateURL) {
      history.pushState({view: viewName}, "", `#${viewName}`);
    }
  }

  resetAllViews() {
    Object.keys(this.viewConfigs).forEach((viewName) => {
      const view = document.getElementById(`${viewName}-view`);
      const btn = document.querySelector(`[data-view='${viewName}']`);
      if (view) view.classList.remove("active");
      if (btn) btn.classList.remove("active");
    });
  }
}
