/* TRIPEASE - BOOKING SECTION */

document.addEventListener("DOMContentLoaded", () => {
  /* ACCESS ELEMENTS */

  const bookingTabs = document.querySelectorAll(".booking-tab");
  const bookingPanels = document.querySelectorAll(".booking-panel");

  const bookingContent = document.getElementById("bookingContent");

  const resultsContainers = {
    hotels: document.getElementById("hotelBookingResults"),
    flights: document.getElementById("flightBookingResults"),
    trains: document.getElementById("trainBookingResults"),
    buses: document.getElementById("busBookingResults"),
  };

  const messageElements = {
    hotels: document.getElementById("hotelBookingMessage"),
    flights: document.getElementById("flightBookingMessage"),
    trains: document.getElementById("trainBookingMessage"),
    buses: document.getElementById("busBookingMessage"),
  };

  /* BOOKING DATA*/

  const bookingData = window.TripEaseBookingData;

  if (!bookingData) {
    console.error(
      "TripEaseBookingData is missing. Load bookingData.js before booking.js.",
    );
    return;
  }

  console.log("Booking data connected successfully!");

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }

    return price || "Price unavailable";
  };

  const escapeHTML = (value = "") => {
    return String(value).replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });
  };

  function showMessage(type, message, status = "success") {
    const element = messageElements[type];

    if (!element) return;

    element.textContent = message;
    element.className = `form-message ${status}`;
  }

  function clearMessage(type) {
    const element = messageElements[type];

    if (!element) return;

    element.textContent = "";
    element.className = "form-message";
  }

  function getSearchableText(item) {
    return [
      item.name,
      item.city,
      item.location,
      item.from,
      item.to,
      item.source,
      item.destination,
      item.route,
      item.operator,
      item.airline,
      item.trainName,
      item.busName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function getItemTitle(item, type) {
    return (
      item.name ||
      item.airline ||
      item.trainName ||
      item.busName ||
      item.operator ||
      (type === "hotels"
        ? "Hotel"
        : type === "flights"
          ? "Flight"
          : type === "trains"
            ? "Train"
            : "Bus")
    );
  }

  function getItemDescription(item) {
    if (item.description) return item.description;

    if (Array.isArray(item.amenities)) {
      return item.amenities.join(" • ");
    }

    if (item.from && item.to) {
      return `${item.from} → ${item.to}`;
    }

    if (item.route) return item.route;

    return item.badge || "Plan your journey with TripEase.";
  }

  function showBookingTab(selectedTab) {
    bookingTabs.forEach((tab) => {
      const isActive = tab.dataset.booking === selectedTab;

      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    bookingPanels.forEach((panel) => {
      const isActive = panel.dataset.panel === selectedTab;

      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  }

  bookingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showBookingTab(tab.dataset.booking);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();

      const tabs = [...bookingTabs];
      const currentIndex = tabs.indexOf(tab);

      const direction = event.key === "ArrowRight" ? 1 : -1;

      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;

      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  /* RENDER BOOKING CARDS */

  function renderBookingCards(type, items) {
    const container = resultsContainers[type];

    if (!container) return;

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `
      <div class="booking-empty">
        <span>🔍</span>
        <h3>No results found</h3>
        <p>Try another destination or search again.</p>
      </div>
    `;
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const title = getItemTitle(item, type);

        const location =
          item.location ||
          item.city ||
          (item.from && item.to ? `${item.from} → ${item.to}` : "India");

        const rating = item.rating;
        const reviews = item.reviews ?? item.reviewCount;

        const image = item.image || item.imageUrl;

        const description = getItemDescription(item);

        const price = item.price ?? item.fare ?? item.amount ?? item.basePrice;

        const badge = item.badge || "";

        const icon =
          type === "hotels"
            ? "🏨"
            : type === "flights"
              ? "✈️"
              : type === "trains"
                ? "🚆"
                : "🚌";

        // Check whether this is a travel booking card
        const isTransport =
          type === "flights" || type === "trains" || type === "buses";

        // Departure and arrival details
        const departure = item.departure || "--:--";
        const arrival = item.arrival || "--:--";
        const duration = item.duration || "Duration unavailable";

        // Route details for flights, trains and buses
        const routeHTML = isTransport
          ? `
        <div class="booking-route">

          <div class="booking-route-point">
            <strong>${escapeHTML(departure)}</strong>
            <span>${escapeHTML(item.from || "Origin")}</span>
          </div>

          <div class="booking-route-middle">
            <small>${escapeHTML(duration)}</small>
            <div class="booking-route-line">
              <span>${icon}</span>
            </div>
          </div>

          <div class="booking-route-point booking-route-arrival">
            <strong>${escapeHTML(arrival)}</strong>
            <span>${escapeHTML(item.to || "Destination")}</span>
          </div>

        </div>
      `
          : "";

        return `
      <article class="booking-result-card" data-book-id="${escapeHTML(item.id)}">

        <div class="booking-image-wrapper">

          ${
            image
              ? `
                <img
                  src="${escapeHTML(image)}"
                  alt="${escapeHTML(title)}"
                  class="booking-result-image"
                  loading="lazy"
                >
              `
              : `
                <div class="booking-result-icon">
                  ${icon}
                </div>
              `
          }

          ${
            badge
              ? `<span class="booking-badge">${escapeHTML(badge)}</span>`
              : ""
          }

        </div>

        <div class="booking-result-content">

          <div class="booking-card-heading">
            <h3>${escapeHTML(title)}</h3>

            ${
              rating !== undefined
                ? `
                  <span class="booking-rating">
                    ⭐ ${escapeHTML(rating)}
                  </span>
                `
                : ""
            }
          </div>

          ${
            isTransport
              ? routeHTML
              : `
                <p class="booking-location">
                  📍 ${escapeHTML(location)}
                </p>

                <p class="booking-description">
                  ${escapeHTML(description)}
                </p>
              `
          }

          ${
            reviews !== undefined
              ? `
                <p class="booking-reviews">
                  ${escapeHTML(reviews)} reviews
                </p>
              `
              : ""
          }

          <div class="booking-card-footer">

            <div class="booking-price">
              <strong>${formatPrice(price)}</strong>
              <small>${type === "hotels" ? "/ night" : "/ person"}</small>
            </div>

            <button
              type="button"
              class="booking-btn"
              data-book-id="${escapeHTML(item.id)}"
              data-book-type="${type}"
            >
              Book Now
            </button>

          </div>

        </div>

      </article>
    `;
      })
      .join("");
  }

  /* INITIAL CARDS */

  const bookingTypes = ["hotels", "flights", "trains", "buses"];

  bookingTypes.forEach((type) => {
    renderBookingCards(type, bookingData[type]);
  });

  /* SEARCH FILTER */

  function filterResults(type, searchValues) {
    const allItems = bookingData[type] || [];

    const filteredItems = allItems.filter((item) => {
      const searchableText = getSearchableText(item);

      return searchValues.every((value) => {
        if (!value) return true;

        return searchableText.includes(value.toLowerCase());
      });
    });

    renderBookingCards(type, filteredItems);

    return filteredItems.length;
  }

  /* HOTEL SEARCH */

  const hotelForm = document.getElementById("hotelBookingForm");

  if (hotelForm) {
    hotelForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const destination = document
        .getElementById("bookingHotelDestination")
        .value.trim();

      const checkIn = document.getElementById("bookingHotelCheckIn").value;

      const checkOut = document.getElementById("bookingHotelCheckOut").value;

      if (checkOut <= checkIn) {
        showMessage(
          "hotels",
          "Check-out date must be after check-in date.",
          "error",
        );
        return;
      }

      const count = filterResults("hotels", [destination]);

      if (count > 0) {
        showMessage(
          "hotels",
          `${count} hotel(s) found for ${destination}.`,
          "success",
        );
      } else {
        showMessage(
          "hotels",
          `No hotels found for ${destination}. Try another city.`,
          "error",
        );
      }
    });
  }

  /* FLIGHT SEARCH */

  const flightForm = document.getElementById("flightBookingForm");

  if (flightForm) {
    flightForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const from = document.getElementById("flightFrom").value.trim();

      const to = document.getElementById("flightTo").value.trim();

      const departure = document.getElementById("flightDeparture").value;

      const returnDate = document.getElementById("flightReturn").value;

      if (returnDate && returnDate < departure) {
        showMessage(
          "flights",
          "Return date cannot be before departure date.",
          "error",
        );
        return;
      }

      const count = filterResults("flights", [from, to]);

      if (count > 0) {
        showMessage(
          "flights",
          `${count} flight(s) found for ${from} to ${to}.`,
          "success",
        );
      } else {
        showMessage(
          "flights",
          `No flights found for ${from} to ${to}.`,
          "error",
        );
      }
    });
  }

  /* TRAIN SEARCH */

  const trainForm = document.getElementById("trainBookingForm");

  if (trainForm) {
    trainForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const from = document.getElementById("trainFrom").value.trim();

      const to = document.getElementById("trainTo").value.trim();

      const count = filterResults("trains", [from, to]);

      if (count > 0) {
        showMessage(
          "trains",
          `${count} train(s) found for ${from} to ${to}.`,
          "success",
        );
      } else {
        showMessage("trains", `No trains found for ${from} to ${to}.`, "error");
      }
    });
  }

  /* BUS SEARCH */

  const busForm = document.getElementById("busBookingForm");

  if (busForm) {
    busForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const from = document.getElementById("busFrom").value.trim();

      const to = document.getElementById("busTo").value.trim();

      const count = filterResults("buses", [from, to]);

      if (count > 0) {
        showMessage(
          "buses",
          `${count} bus(es) found for ${from} to ${to}.`,
          "success",
        );
      } else {
        showMessage("buses", `No buses found for ${from} to ${to}.`, "error");
      }
    });
  }

  /* BOOK NOW BUTTON */

  Object.entries(resultsContainers).forEach(([type, container]) => {
    if (!container) return;

    container.addEventListener("click", (event) => {
      const button = event.target.closest(".booking-btn");

      if (!button) return;

      const selectedType = button.dataset.bookType;
      const selectedId = button.dataset.bookId;

      const item = bookingData[selectedType]?.find(
        (booking) => String(booking.id) === String(selectedId),
      );

      if (!item) return;

      const title = getItemTitle(item, selectedType);

      alert(
        `${title} selected successfully!\n\n` +
          "This is a demo booking. No real payment or reservation has been made.",
      );
    });
  });

  document.querySelectorAll(".booking-results").forEach((container) => {
    container.addEventListener(
      "wheel",
      (event) => {
        if (container.scrollWidth <= container.clientWidth) return;

        event.preventDefault();

        container.scrollLeft += event.deltaY;
      },
      { passive: false },
    );
  });

  /* DATE VALIDATION */

  const today = new Date().toISOString().split("T")[0];

  const dateInputs = [
    "bookingHotelCheckIn",
    "bookingHotelCheckOut",
    "flightDeparture",
    "flightReturn",
    "trainDate",
    "busDate",
  ];

  dateInputs.forEach((id) => {
    const input = document.getElementById(id);

    if (input) {
      input.min = today;
    }
  });

  const hotelCheckIn = document.getElementById("bookingHotelCheckIn");

  const hotelCheckOut = document.getElementById("bookingHotelCheckOut");

  if (hotelCheckIn && hotelCheckOut) {
    hotelCheckIn.addEventListener("change", () => {
      hotelCheckOut.min = hotelCheckIn.value;

      if (hotelCheckOut.value && hotelCheckOut.value <= hotelCheckIn.value) {
        hotelCheckOut.value = "";
      }
    });
  }

  const flightDeparture = document.getElementById("flightDeparture");

  const flightReturn = document.getElementById("flightReturn");

  if (flightDeparture && flightReturn) {
    flightDeparture.addEventListener("change", () => {
      flightReturn.min = flightDeparture.value;

      if (flightReturn.value && flightReturn.value < flightDeparture.value) {
        flightReturn.value = "";
      }
    });
  }

  showBookingTab("hotels");
});
