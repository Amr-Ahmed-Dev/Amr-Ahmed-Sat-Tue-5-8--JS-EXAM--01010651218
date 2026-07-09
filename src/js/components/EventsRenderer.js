// js/components/EventsRenderer.js

export default class EventsRenderer {
  constructor(contentContainerId, emptyStateId, wireHeartButtonFn) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
    this.emptyStateTitle = document.getElementById("empty-state-event-title");
    this.emptyStateText = document.getElementById("empty-state-event-text");
    this.wireHeartButton = wireHeartButtonFn;
  }

  render(eventsList, cityName = "") {
    if (!this.container) return;
    this.container.innerHTML = "";

    if (!eventsList || eventsList.length === 0) {
      this.showEmptyState(true);
      this.emptyStateTitle.textContent = "No Events Found";
      this.emptyStateText.textContent = cityName
        ? `Sorry, no events found in ${cityName}.`
        : "Select a country and city from the dashboard to discover events";
      return;
    }

    this.showEmptyState(false);
    eventsList.forEach((event) => {
      this.container.appendChild(this._buildEventCard(event));
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

  _buildEventCard(event) {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-image">
        <img src="${event.imageUrl || "default-img.jpg"}" alt="${event.name}">
        <button class="save-btn"><i class="fa-regular fa-heart"></i></button>
      </div>
      <div class="event-info">
        <h3>${event.name}</h3>
        <p>${event.venueName || event.category}</p>
        <div class="event-date">
          <i class="fa-regular fa-calendar"></i> ${event.date}
        </div>
        <button class="save-text-btn">Save to My Plans</button>
      </div>
    `;

    const saveBtn = card.querySelector(".save-btn");
    const saveTextBtn = card.querySelector(".save-text-btn");

    if (this.wireHeartButton) {
      const planData = {
        btn: saveBtn,
        cardEl: card,
        plan: {
          id: `event-${event.name}-${event.date}`,
          type: "event",
          title: event.name,
          subtitle: event.venueName || event.category,
          date: `${event.date} ${event.time ? "at " + event.time : ""}`,
        },
      };

      this.wireHeartButton(planData);
      this.wireHeartButton({...planData, btn: saveTextBtn});
    }

    return card;
  }
}
