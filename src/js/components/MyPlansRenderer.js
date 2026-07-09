// components/MyPlansRenderer.js
import plansStore from "../store/PlansStore.js";
import toast from "./ToastManager.js";
import {updatePlansIndicators} from "../utils/helpers.js";

export default class MyPlansRenderer {
  constructor(contentId, appNavigation) {
    this.container = document.getElementById(contentId);
    this.appNavigation = appNavigation;
    this.currentFilter = "all";
    this.filterButtons = document.querySelectorAll(".plan-filter");

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    const clearBtn = document.getElementById("clear-all-plans-btn");
    clearBtn?.addEventListener("click", () => {
      if (plansStore.count("all") === 0) return;

      const doClear = () => {
        plansStore.clearAll();
        toast.show("All plans cleared", "info");
      };

      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "Clear all saved plans?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, clear all",
          confirmButtonColor: "#ef4444",
        }).then((result) => {
          if (result.isConfirmed) doClear();
        });
      } else if (confirm("Clear all saved plans?")) {
        doClear();
      }
    });

    document
      .getElementById("start-exploring-btn")
      ?.addEventListener("click", () => this.appNavigation.showDashboard());

    plansStore.onChange(() => {
      updatePlansIndicators();
      this.render();
    });
  }

  render() {
    if (!this.container) return;
    const plans = plansStore.getByType(this.currentFilter);
    this.container.innerHTML = "";

    if (plans.length === 0) {
      this.container.appendChild(this._buildEmptyState());
      return;
    }

    plans.forEach((plan) => this.container.appendChild(this._buildCard(plan)));
  }

  _buildEmptyState() {
    const wrapper = document.createElement("div");
    wrapper.className = "empty-state";

    const noneForFilter = this.currentFilter !== "all";
    wrapper.innerHTML = `
      <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
      <h3>${noneForFilter ? "Nothing Here Yet" : "No Saved Plans Yet"}</h3>
      <p>${
        noneForFilter
          ? "You haven't saved anything in this category yet."
          : "Start exploring and save holidays, events, or long weekends you like!"
      }</p>
      <button class="btn-primary" id="start-exploring-btn-inner">
        <i class="fa-solid fa-compass"></i> Start Exploring
      </button>
    `;
    wrapper;
    wrapper
      .querySelector("#start-exploring-btn-inner")
      .addEventListener("click", () =>
        this.appNavigation.switchView("dashboard"),
      );
    return wrapper;
  }

  _typeMeta(type) {
    if (type === "holiday")
      return {label: "Holiday", icon: "fa-calendar-check"};
    if (type === "event") return {label: "Event", icon: "fa-ticket"};
    return {label: "Long Weekend", icon: "fa-umbrella-beach"};
  }

  _buildCard(plan) {
    const meta = this._typeMeta(plan.type);

    const card = document.createElement("div");
    card.className = "plan-card";
    card.dataset.planId = plan.id;

    card.innerHTML = `
      <div class="plan-card-header">
        <span class="plan-type-badge ${plan.type}">
          <i class="fa-solid ${meta.icon}"></i> ${meta.label}
        </span>
        <button class="plan-remove-btn" title="Remove">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <h3>${plan.title}</h3>
      <p class="plan-subtitle">${plan.subtitle || ""}</p>
      <div class="plan-card-footer">
        <span><i class="fa-regular fa-calendar"></i> ${plan.date || ""}</span>
        ${plan.location ? `<span><i class="fa-solid fa-location-dot"></i> ${plan.location}</span>` : ""}
      </div>
    `;

    card.querySelector(".plan-remove-btn").addEventListener("click", () => {
      plansStore.remove(plan.id);
      toast.show("Removed from My Plans", "info");

      document.querySelectorAll(`[data-plan-id="${plan.id}"]`).forEach((el) => {
        const icon = el.querySelector(".fa-heart");
        if (icon) {
          icon.classList.remove("fa-solid", "favorited");
          icon.classList.add("fa-regular");
        }
      });
    });

    return card;
  }
}
