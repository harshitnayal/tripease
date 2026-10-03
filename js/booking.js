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

  /* BOOK NOW BUTTON */

  
/* MY BOOKINGS - BOOKING MANAGEMENT */

const myBookingsList = document.getElementById("myBookingsList");
const myBookingsEmpty = document.getElementById("myBookingsEmpty");

const totalBookingsEl = document.getElementById("totalBookings");
const confirmedBookingsEl = document.getElementById("confirmedBookings");
const pendingBookingsEl = document.getElementById("pendingBookings");
const cancelledBookingsEl = document.getElementById("cancelledBookings");

const bookingFilters = document.querySelectorAll(".booking-filter");

// Load saved bookings from localStorage
let myBookings = [];

try {
  myBookings = JSON.parse(
    localStorage.getItem("tripEaseMyBookings")
  ) || [];
} catch (error) {
  console.error("Unable to load saved bookings:", error);
  myBookings = [];
}

// Save bookings
function saveMyBookings() {
  localStorage.setItem(
    "tripEaseMyBookings",
    JSON.stringify(myBookings)
  );
}

// Format date
function formatBookingDate(date) {
  if (!date) return "Not specified";

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
  };

  return new Date(date + "T00:00:00").toLocaleDateString(
    "en-IN",
    options
  );
}

// Generate booking ID
function generateBookingId() {
  return "TE" + Date.now().toString().slice(-8);
}

// Get booking details from the selected form
function getBookingFormDetails(type) {
  const details = {
    hotels: {
      date: document.getElementById("bookingHotelCheckIn").value,
      endDate: document.getElementById("bookingHotelCheckOut").value,
      guests: document.getElementById("bookingHotelGuests").value
    },

    flights: {
      date: document.getElementById("flightDeparture").value,
      endDate: document.getElementById("flightReturn").value,
      guests: document.getElementById("flightPassengers").value,
      travelClass: document.getElementById("flightClass").value
    },

    trains: {
      date: document.getElementById("trainDate").value,
      guests: document.getElementById("trainPassengers").value,
      travelClass: document.getElementById("trainClass").value
    },

    buses: {
      date: document.getElementById("busDate").value,
      guests: document.getElementById("busPassengers").value,
      travelClass: document.getElementById("busType").value
    }
  };

  return details[type];
}

// Create a new booking
function createMyBooking(type, item) {
  const formDetails = getBookingFormDetails(type);

  const title = getItemTitle(item, type);

  const price = Number(
    item.price ?? item.fare ?? item.amount ?? item.basePrice ?? 0
  );

  const booking = {
    id: generateBookingId(),
    type,
    title,
    location:
      item.location ||
      item.city ||
      (item.from && item.to
        ? `${item.from} → ${item.to}`
        : "India"),
    image: item.image || item.imageUrl || "",
    date: formDetails.date,
    endDate: formDetails.endDate || "",
    guests: Number(formDetails.guests) || 1,
    travelClass: formDetails.travelClass || "",
    price:
      type === "hotels"
        ? price * (formDetails.date && formDetails.endDate
            ? Math.max(
                1,
                Math.round(
                  (new Date(formDetails.endDate) -
                    new Date(formDetails.date)) /
                    (1000 * 60 * 60 * 24)
                )
              )
            : 1)
        : price * (Number(formDetails.guests) || 1),
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  myBookings.unshift(booking);

  saveMyBookings();
  renderMyBookings();

  return booking;
}

// Update summary cards
function updateBookingSummary() {
  totalBookingsEl.textContent = myBookings.length;

  confirmedBookingsEl.textContent = myBookings.filter(
    booking => booking.status === "confirmed"
  ).length;

  pendingBookingsEl.textContent = myBookings.filter(
    booking => booking.status === "pending"
  ).length;

  cancelledBookingsEl.textContent = myBookings.filter(
    booking => booking.status === "cancelled"
  ).length;
}

// Render booking cards
function renderMyBookings(filter = "all") {
  if (!myBookingsList || !myBookingsEmpty) return;

  updateBookingSummary();

  const filteredBookings =
    filter === "all"
      ? myBookings
      : myBookings.filter(
          booking => booking.status === filter
        );

  if (filteredBookings.length === 0) {
    myBookingsList.innerHTML = "";
    myBookingsEmpty.style.display = "flex";

    const heading = myBookingsEmpty.querySelector("h3");
    const message = myBookingsEmpty.querySelector("p");

    if (myBookings.length === 0) {
      heading.textContent = "No Bookings Yet";
      message.textContent =
        "You haven't made any reservations yet. Start planning your next adventure with TripEase!";
    } else {
      heading.textContent = `No ${filter} bookings`;
      message.textContent =
        `You don't have any ${filter} bookings at the moment.`;
    }

    return;
  }

  myBookingsEmpty.style.display = "none";

  myBookingsList.innerHTML = filteredBookings
    .map(booking => {
      const icon =
        booking.type === "hotels"
          ? "🏨"
          : booking.type === "flights"
            ? "✈️"
            : booking.type === "trains"
              ? "🚆"
              : "🚌";

      const typeName =
        booking.type.charAt(0).toUpperCase() +
        booking.type.slice(1);

      const imageHTML = booking.image
        ? `<img src="${escapeHTML(booking.image)}"
                alt="${escapeHTML(booking.title)}"
                loading="lazy">`
        : `<div class="booking-result-icon">${icon}</div>`;

      const dateLabel =
        booking.type === "hotels"
          ? "Check-in"
          : "Journey Date";

      const endDateHTML = booking.endDate
        ? `
          <div class="booking-info-item">
            <span>Return / Check-out</span>
            <strong>${formatBookingDate(booking.endDate)}</strong>
          </div>
        `
        : "";

      const classHTML = booking.travelClass
        ? `
          <div class="booking-info-item">
            <span>Class / Type</span>
            <strong>${escapeHTML(booking.travelClass)}</strong>
          </div>
        `
        : "";

      const cancelButton =
        booking.status !== "cancelled"
          ? `
            <button
              type="button"
              class="booking-action-btn cancel-booking-btn"
              data-action="cancel"
              data-id="${escapeHTML(booking.id)}"
            >
              Cancel Booking
            </button>
          `
          : "";

      return `
        <article class="my-booking-card">

          <div class="my-booking-image">
            ${imageHTML}
          </div>

          <div class="my-booking-details">

            <div class="my-booking-top">
              <div>
                <h3 class="my-booking-title">
                  ${escapeHTML(booking.title)}
                </h3>

                <span class="my-booking-type">
                  ${icon} ${typeName}
                </span>
              </div>

              <span class="booking-status ${booking.status}">
                ${booking.status}
              </span>
            </div>

            <div class="my-booking-info">

              <div class="booking-info-item">
                <span>Booking ID</span>
                <strong>${escapeHTML(booking.id)}</strong>
              </div>

              <div class="booking-info-item">
                <span>${dateLabel}</span>
                <strong>${formatBookingDate(booking.date)}</strong>
              </div>

              ${endDateHTML}

              <div class="booking-info-item">
                <span>Guests / Passengers</span>
                <strong>${booking.guests}</strong>
              </div>

              ${classHTML}

              <div class="booking-info-item">
                <span>Location / Route</span>
                <strong>${escapeHTML(booking.location)}</strong>
              </div>

            </div>

            <div class="my-booking-footer">

              <div class="my-booking-price">
                ${formatPrice(booking.price)}
              </div>

              <div class="my-booking-actions">

                <button
                  type="button"
                  class="booking-action-btn view-booking-btn"
                  data-action="view"
                  data-id="${escapeHTML(booking.id)}"
                >
                  View Details
                </button>

                ${cancelButton}

              </div>

            </div>

          </div>

        </article>
      `;
    })
    .join("");
}

// Booking filter buttons
bookingFilters.forEach(button => {
  button.addEventListener("click", () => {
    bookingFilters.forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    renderMyBookings(button.dataset.filter);
  });
});

// View and cancel booking actions
myBookingsList.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const bookingId = button.dataset.id;
  const action = button.dataset.action;

  const booking = myBookings.find(
    item => item.id === bookingId
  );

  if (!booking) return;

  if (action === "view") {
    alert(
      `Booking Details\n\n` +
      `Booking ID: ${booking.id}\n` +
      `Type: ${booking.type}\n` +
      `Name: ${booking.title}\n` +
      `Date: ${formatBookingDate(booking.date)}\n` +
      `Guests: ${booking.guests}\n` +
      `Amount: ${formatPrice(booking.price)}\n` +
      `Status: ${booking.status.toUpperCase()}\n\n` +
      `This is a demo reservation.`
    );
  }

  if (action === "cancel") {
    const confirmCancel = confirm(
      `Are you sure you want to cancel booking ${booking.id}?`
    );

    if (!confirmCancel) return;

    booking.status = "cancelled";

    saveMyBookings();

    const activeFilter =
      document.querySelector(".booking-filter.active")
        ?.dataset.filter || "all";

    renderMyBookings(activeFilter);
  }
});

// Handle Book Now clicks
Object.entries(resultsContainers).forEach(([type, container]) => {
  if (!container) return;

  container.addEventListener("click", event => {
    const button = event.target.closest(".booking-btn");

    if (!button) return;

    const selectedType = button.dataset.bookType;
    const selectedId = button.dataset.bookId;

    const item = bookingData[selectedType]?.find(
      booking => String(booking.id) === String(selectedId)
    );

    if (!item) return;

    const booking = createMyBooking(selectedType, item);

    alert(
      `Booking created successfully! 🎉\n\n` +
      `Booking ID: ${booking.id}\n` +
      `Name: ${booking.title}\n` +
      `Amount: ${formatPrice(booking.price)}\n\n` +
      `You can view your reservation in My Bookings.\n\n` +
      `Note: This is a demo booking. No real payment or reservation has been made.`
    );
  });
});

renderMyBookings();

  showBookingTab("hotels");
});
