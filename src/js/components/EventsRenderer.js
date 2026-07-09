export default class EventsRenderer {
  constructor(contentContainerId, emptyStateId, wireHeartButtonFn) {
    this.container = document.getElementById(contentContainerId);
    this.emptyState = document.getElementById(emptyStateId);
    this.emptyStateTitle = document.getElementById("empty-state-event-title");
    this.emptyStateText = document.getElementById("empty-state-event-text");
    this.wireHeartButton = wireHeartButtonFn;
  }

  render(eventsList, cityName = "") {
    this.container.replaceChildren();

    if (eventsList.length === 0) {
      if (cityName) {
        this._setEmptyMessage(
          "No Events Found",
          `We couldn't find any events in ${cityName} right now. Try another destination.`,
        );
      } else {
        this._setEmptyMessage(
          "No City Selected",
          "Select a country and city from the dashboard to discover events",
        );
      }
      this.showEmptyState(true);
    } else {
      this.showEmptyState(false);
      eventsList.forEach((event) => {
        const card = this._buildEventCard(event);
        this.container.appendChild(card);
      });
    }
  }
  _setEmptyMessage(title, text) {
    if (this.emptyStateTitle) this.emptyStateTitle.textContent = title;
    if (this.emptyStateText) this.emptyStateText.textContent = text;
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

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "event-card-image";

    const img = document.createElement("img");
    img.src = event.imageUrl;
    img.alt = event.name;

    const categorySpan = document.createElement("span");
    categorySpan.className = "event-card-category";
    categorySpan.textContent = event.category;

    const saveBtn = document.createElement("button");
    saveBtn.className = "event-card-save";
    const heartIcon = document.createElement("i");
    heartIcon.className = "fa-regular fa-heart";
    saveBtn.appendChild(heartIcon);

    this.wireHeartButton({
      btn: saveBtn,
      cardEl: card,
      plan: {
        id: `event-${event.name}-${event.date}`,
        type: "event",
        title: event.name,
        subtitle: event.venueName || event.category,
        date: `${event.date} ${event.time ? "at " + event.time : ""}`,
      },
    });

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(categorySpan);
    imageWrapper.appendChild(saveBtn);

    const body = document.createElement("div");
    body.className = "event-card-body";

    const title = document.createElement("h3");
    title.textContent = event.name;

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "event-card-info";

    const dateLine = document.createElement("div");
    const calendarIcon = document.createElement("i");
    calendarIcon.className = "fa-regular fa-calendar";
    dateLine.appendChild(calendarIcon);
    dateLine.appendChild(
      document.createTextNode(
        ` ${event.date} ${event.time ? "at " + event.time : ""}`,
      ),
    );

    const locationLine = document.createElement("div");
    const locationIcon = document.createElement("i");
    locationIcon.className = "fa-solid fa-location-dot";
    locationLine.appendChild(locationIcon);
    locationLine.appendChild(
      document.createTextNode(` ${event.venueName}, ${event.cityName}`),
    );

    infoWrapper.appendChild(dateLine);
    infoWrapper.appendChild(locationLine);

    const footer = document.createElement("div");
    footer.className = "event-card-footer";

    const saveTextBtn = document.createElement("button");
    saveTextBtn.className = "btn-event";
    const saveTextIcon = document.createElement("i");
    saveTextIcon.className = "fa-regular fa-heart";
    saveTextBtn.appendChild(saveTextIcon);
    saveTextBtn.appendChild(document.createTextNode(" Save"));

    this.wireHeartButton({
      btn: saveTextBtn,
      cardEl: card,
      plan: {
        id: `event-${event.name}-${event.date}`,
        type: "event",
        title: event.name,
        subtitle: event.venueName || event.category,
        date: `${event.date} ${event.time ? "at " + event.time : ""}`,
      },
    });

    const buyLink = document.createElement("a");
    buyLink.href = event.ticketUrl;
    buyLink.target = "_blank";
    buyLink.className = "btn-buy-ticket";
    const ticketIcon = document.createElement("i");
    ticketIcon.className = "fa-solid fa-ticket";
    buyLink.appendChild(ticketIcon);
    buyLink.appendChild(document.createTextNode(" Buy Tickets"));

    footer.appendChild(saveTextBtn);
    footer.appendChild(buyLink);

    body.appendChild(title);
    body.appendChild(infoWrapper);
    body.appendChild(footer);

    // ---- assemble the full card ----
    card.appendChild(imageWrapper);
    card.appendChild(body);

    return card;
  }
}
