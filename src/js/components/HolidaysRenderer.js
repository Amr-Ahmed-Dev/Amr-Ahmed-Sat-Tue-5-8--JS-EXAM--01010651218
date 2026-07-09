import {wireHeartButton} from "../utils/Helpers.js";

export default class HolidaysRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
  }

  render(holidaysList) {
    this.container.innerHTML = "";

    this.showEmptyState(false);

    holidaysList.forEach((holiday) => {
      const holidayDate = new Date(holiday.date);
      const day = holidayDate.getDate();
      const month = holidayDate.toLocaleString("en-US", {month: "short"});
      const dayName = holidayDate.toLocaleString("en-US", {weekday: "long"});

      const holidayType =
        holiday.types && holiday.types.length > 0 ? holiday.types[0] : "Public";

      const card = document.createElement("div");
      card.className = "holiday-card";
      card.innerHTML = `
        <div class="holiday-card-header">
          <div class="holiday-date-box">
            <span class="day">${day}</span><span class="month">${month}</span>
          </div>
          <button class="holiday-action-btn">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <h3>${holiday.localName}</h3>
        <p class="holiday-name">${holiday.name}</p>
        <div class="holiday-card-footer">
          <span class="holiday-day-badge">
            <i class="fa-regular fa-calendar"></i> ${dayName}
          </span>
          <span class="holiday-type-badge">${holidayType}</span>
        </div>
      `;

      const heartBtn = card.querySelector(".holiday-action-btn");

      wireHeartButton({
        btn: heartBtn,
        cardEl: card,
        plan: {
          id: `holiday-${holiday.date}-${holiday.name}`,
          type: "holiday",
          title: holiday.localName,
          subtitle: holiday.name,
          date: `${dayName}, ${month} ${day}`,
        },
      });

      this.container.appendChild(card);
    });
  }

  showEmptyState(show) {
    if (show) {
      this.emptyState?.classList.remove("hidden");
      this.container?.classList.add("hidden");
    } else {
      this.emptyState?.classList.add("hidden");
      this.container?.classList.remove("hidden");
    }
  }
}
