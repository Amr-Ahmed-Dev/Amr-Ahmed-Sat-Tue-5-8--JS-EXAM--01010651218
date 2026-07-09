// src/js/components/LongWeekendRenderer.js
import {wireHeartButton} from "../utils/Helpers.js";

export default class LongWeekendRenderer {
  constructor(contentContainerId, emptyStateId) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
  }

  render(longWeekendsList) {
    this.container.innerHTML = "";

    if (longWeekendsList.length === 0) {
      this.showEmptyState(true);
      return;
    }

    this.showEmptyState(false);

    longWeekendsList.forEach((lw, index) => {
      const card = this._buildCard(lw, index);
      this.container.appendChild(card);
    });
  }

  _buildCard(lw, index) {
    const start = new Date(lw.startDate);
    const end = new Date(lw.endDate);

    const dateRangeLabel =
      `${start.toLocaleString("en-US", {month: "short", day: "numeric"})} - ` +
      `${end.toLocaleString("en-US", {month: "short", day: "numeric", year: "numeric"})}`;

    const infoBoxClass = lw.needBridgeDay ? "warning" : "success";
    const infoBoxIcon = lw.needBridgeDay ? "fa-info-circle" : "fa-check-circle";
    const infoBoxText = lw.needBridgeDay
      ? "Requires taking a bridge day off"
      : "No extra days off needed!";

    const days = this._buildDaysList(start, end);

    const card = document.createElement("div");
    card.className = "lw-card";
    card.innerHTML = `
      <div class="lw-card-header">
        <span class="lw-badge">
          <i class="fa-solid fa-calendar-days"></i> ${lw.dayCount} Days
        </span>
        <button class="holiday-action-btn">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <h3>Long Weekend #${index + 1}</h3>
      <div class="lw-dates">
        <i class="fa-regular fa-calendar"></i> ${dateRangeLabel}
      </div>
      <div class="lw-info-box ${infoBoxClass}">
        <i class="fa-solid ${infoBoxIcon}"></i> ${infoBoxText}
      </div>
      <div class="lw-days-visual">
        ${days
          .map(
            (day) => `
          <div class="lw-day ${day.isWeekend ? "weekend" : ""}">
            <span class="name">${day.name}</span>
            <span class="num">${day.num}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    const heartBtn = card.querySelector(".holiday-action-btn");

    wireHeartButton({
      btn: heartBtn,
      cardEl: card,
      plan: {
        id: `lw-${lw.startDate}-${lw.endDate}`,
        type: "long-weekends",
        title: `Long Weekend #${index + 1}`,
        subtitle: infoBoxText,
        date: dateRangeLabel,
      },
    });

    return card;
  }

  _buildDaysList(start, end) {
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      days.push({
        name: current.toLocaleString("en-US", {weekday: "short"}),
        num: current.getDate(),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
      current.setDate(current.getDate() + 1);
    }

    return days;
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
