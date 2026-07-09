import plansStore from "../store/PlansStore.js";
import toast from "../components/ToastManager.js";

export function wireHeartButton({btn, iconSelector = "i", plan, cardEl}) {
  const icon = btn.querySelector(iconSelector) || btn;

  const applyState = (saved) => {
    icon.classList.toggle("fa-regular", !saved);
    icon.classList.toggle("fa-solid", saved);
    icon.classList.toggle("favorited", saved);
    btn.classList.toggle("saved", saved);
  };

  applyState(plansStore.isSaved(plan.id));

  if (cardEl) cardEl.dataset.planId = plan.id;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const added = plansStore.toggle(plan);
    applyState(added);

    if (added) {
      icon.classList.remove("heart-pop");
      void icon.offsetWidth; // restart the animation
      icon.classList.add("heart-pop");
    }

    toast.show(
      added ? "Saved to My Plans!" : "Removed from My Plans",
      added ? "success" : "info",
    );
  });
}

export function updatePlansIndicators() {
  const badge = document.getElementById("plans-count");
  const statSaved = document.getElementById("stat-saved");
  const total = plansStore.count("all");

  if (badge) {
    badge.textContent = total;
    badge.classList.toggle("hidden", total === 0);
  }
  if (statSaved) statSaved.textContent = total;

  const filterAll = document.getElementById("filter-all-count");
  const filterHoliday = document.getElementById("filter-holiday-count");
  const filterEvent = document.getElementById("filter-event-count");
  const filterLw = document.getElementById("filter-lw-count");

  if (filterAll) filterAll.textContent = plansStore.count("all");
  if (filterHoliday) filterHoliday.textContent = plansStore.count("holiday");
  if (filterEvent) filterEvent.textContent = plansStore.count("event");
  if (filterLw) filterLw.textContent = plansStore.count("longweekend");
}
