
/* TRIPEASE SCHEDULE */

function generateTripEaseSchedule() {
    const destinationInput = document.getElementById("plannerDestination");
    const startDateInput = document.getElementById("plannerStartDate");
    const endDateInput = document.getElementById("plannerEndDate");
    const travelTypeInput = document.getElementById("travelType");

    const scheduleDestination = document.getElementById("scheduleDestination");
    const scheduleDates = document.getElementById("scheduleDates");
    const scheduleDuration = document.getElementById("scheduleDuration");
    const scheduleTravelType = document.getElementById("scheduleTravelType");
    const itineraryTimeline = document.getElementById("itineraryTimeline");

    if (!destinationInput || !startDateInput || !endDateInput || !itineraryTimeline) {
        console.error("TripEase Schedule: Required elements not found.");
        return;
    }

    const destination = destinationInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const travelType = travelTypeInput?.value || "Solo";

    if (!destination || !startDate || !endDate) return;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        alert("Please select valid travel dates.");
        return;
    }

    if (end < start) {
        alert("Return date cannot be before the start date.");
        return;
    }

    const totalNights = Math.round((end - start) / 86400000);
    const totalDays = totalNights + 1;

    scheduleDestination && (scheduleDestination.textContent = destination);
    scheduleDates && (scheduleDates.textContent =
        `${formatScheduleDate(start)} - ${formatScheduleDate(end)}`);
    scheduleDuration && (scheduleDuration.textContent =
        `${totalDays} Days / ${totalNights} Nights`);
    scheduleTravelType && (scheduleTravelType.textContent =
        formatTravelType(travelType));

    itineraryTimeline.innerHTML = "";

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        const dayNumber = i + 1;
        let dayData;

        if (totalDays === 1) {
            dayData = {
                title: `Explore ${destination}`,
                activities: [
                    ["09:00 AM", "Start Your Journey",
                        `Begin your day and explore the highlights of ${destination}.`, "fa-location-dot"],
                    ["01:00 PM", "Lunch & Local Experience",
                        `Enjoy local food and experience the culture of ${destination}.`, "fa-utensils"],
                    ["04:00 PM", "Explore & Sightseeing",
                        `Visit popular attractions and enjoy your time in ${destination}.`, "fa-camera"],
                    ["07:00 PM", "End Your Day",
                        `Relax and complete your memorable day in ${destination}.`, "fa-moon"]
                ]
            };
        } else if (dayNumber === 1) {
            dayData = {
                title: "Arrival & Hotel Check-in",
                activities: [
                    ["09:00 AM", "Departure",
                        `Start your journey towards ${destination}.`, "fa-plane-departure"],
                    ["01:00 PM", "Arrival in Destination",
                        `Arrive at ${destination} and begin your trip.`, "fa-location-dot"],
                    ["03:00 PM", "Hotel Check-in",
                        "Check in to your hotel and take some time to relax.", "fa-hotel"],
                    ["06:00 PM", "Local Exploration",
                        `Take a relaxed evening walk and explore ${destination}.`, "fa-person-walking"],
                    ["08:00 PM", "Dinner",
                        "Enjoy dinner and prepare for the next day.", "fa-utensils"]
                ]
            };
        } else if (dayNumber === totalDays) {
            dayData = {
                title: "Hotel Check-out & Departure",
                activities: [
                    ["08:00 AM", "Breakfast",
                        "Enjoy your final breakfast during the trip.", "fa-mug-hot"],
                    ["10:00 AM", "Hotel Check-out",
                        "Complete your hotel check-out and prepare for departure.", "fa-hotel"],
                    ["12:00 PM", "Last Sightseeing",
                        `Enjoy some final moments in ${destination}.`, "fa-camera"],
                    ["04:00 PM", "Departure",
                        "Start your return journey.", "fa-plane-departure"]
                ]
            };
        } else {
            dayData = {
                title: `Explore ${destination}`,
                activities: [
                    ["08:00 AM", "Breakfast",
                        "Start your day with a refreshing breakfast.", "fa-mug-hot"],
                    ["10:00 AM", "Sightseeing",
                        `Explore popular attractions and places in ${destination}.`, "fa-camera"],
                    ["01:00 PM", "Lunch",
                        "Enjoy delicious local food and take a short break.", "fa-utensils"],
                    ["03:00 PM", "Explore More",
                        `Discover more experiences and hidden gems around ${destination}.`, "fa-map-location-dot"],
                    ["07:00 PM", "Evening Experience",
                        "Enjoy the evening, shopping, local markets or nearby attractions.", "fa-city"],
                    ["09:00 PM", "Dinner & Relax",
                        "Have dinner and relax after an exciting day.", "fa-utensils"]
                ]
            };
        }

        const activitiesHTML = dayData.activities.map(
            ([time, title, description, icon]) => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <span class="activity-time">${time}</span>
                        <h4>${title}</h4>
                        <p>${description}</p>
                    </div>
                </div>
            `
        ).join("");

        const dayElement = document.createElement("div");
        dayElement.className = "itinerary-day";
        dayElement.innerHTML = `
            <div class="day-number">
                <span>DAY</span>
                <strong>${dayNumber}</strong>
            </div>

            <div class="day-content">
                <div class="day-header">
                    <div>
                        <span class="day-date">${formatScheduleDate(currentDate)}</span>
                        <h3>${dayData.title}</h3>
                    </div>
                </div>

                <div class="day-activities">${activitiesHTML}</div>

                <div class="day-footer">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${destination}</span>
                </div>
            </div>
        `;

        itineraryTimeline.appendChild(dayElement);
    }

    document.getElementById("schedule")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    console.log(`TripEase Schedule generated: ${totalDays} days`);
}


function formatScheduleDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function formatTravelType(type) {
    const types = {
        solo: "Solo",
        couple: "Couple",
        family: "Family",
        friends: "Friends",
        office: "Office / Work",
        "office/work-related": "Office / Work",
        others: "Others"
    };

    return types[type?.toLowerCase()] || type || "Travel Type";
}


function editTripEaseSchedule() {
    const tripPlanner = document.getElementById("trip-planner");

    if (!tripPlanner) {
        console.error("TripEase: #trip-planner section not found.");
        return;
    }

    tripPlanner.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    setTimeout(() => {
        document.getElementById("plannerDestination")?.focus();
    }, 700);
}


function downloadTripEaseItinerary() {
    const destinationInput = document.getElementById("plannerDestination");
    const startDateInput = document.getElementById("plannerStartDate");
    const endDateInput = document.getElementById("plannerEndDate");
    const travelTypeInput = document.getElementById("travelType");
    const itineraryTimeline = document.getElementById("itineraryTimeline");

    if (!destinationInput || !startDateInput || !endDateInput || !itineraryTimeline) {
        alert("Unable to download itinerary.");
        return;
    }

    const destination = destinationInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const travelType = travelTypeInput?.value || "solo";

    if (!destination || !startDate || !endDate) {
        alert("Please generate a trip schedule first.");
        return;
    }

    if (!itineraryTimeline.innerText.trim()) {
        alert("Please generate your itinerary first.");
        return;
    }

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        alert("Please select valid travel dates.");
        return;
    }

    if (end < start) {
        alert("Return date cannot be before the start date.");
        return;
    }

    const nights = Math.round((end - start) / 86400000);
    const days = nights + 1;

    const downloadText = `
TRIPEASE
YOUR TRAVEL ITINERARY
========================================

Destination:
${destination}

Travel Dates:
${formatScheduleDate(start)} - ${formatScheduleDate(end)}

Duration:
${days} Days / ${nights} Nights

Travel Type:
${formatTravelType(travelType)}

========================================
ITINERARY
========================================

${itineraryTimeline.innerText}

========================================
Generated by TripEase
========================================
    `.trim();

    const blob = new Blob([downloadText], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `TripEase-${destination
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")}-Itinerary.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".edit-schedule-btn")
        ?.addEventListener("click", editTripEaseSchedule);

    document.querySelector(".download-schedule-btn")
        ?.addEventListener("click", downloadTripEaseItinerary);
});

/* SAVED ITINERARIES */

const TRIPEASE_SAVED_ITINERARIES_KEY =
    "tripeaseSavedItineraries";

let tripeaseToastTimer = null;


/* LOCAL STORAGE */

function getSavedTripEaseItineraries() {

    try {

        const saved =
            localStorage.getItem(
                TRIPEASE_SAVED_ITINERARIES_KEY
            );

        return saved ? JSON.parse(saved) : [];

    } catch (error) {

        console.error(
            "TripEase: Unable to read saved itineraries.",
            error
        );

        return [];
    }
}


function setSavedTripEaseItineraries(itineraries) {

    try {

        localStorage.setItem(
            TRIPEASE_SAVED_ITINERARIES_KEY,
            JSON.stringify(itineraries)
        );

    } catch (error) {

        console.error(
            "TripEase: Unable to save itineraries.",
            error
        );

        alert(
            "Unable to save your itinerary. Please try again."
        );
    }
}


/* HTML ESCAPE */

function escapeTripEaseHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* TOAST NOTIFICATION */

function showTripEaseToast(
    message,
    title = "Success"
) {

    const toast =
        document.getElementById("tripeaseToast");

    const toastMessage =
        document.getElementById(
            "tripeaseToastMessage"
        );

    const toastTitle =
        toast?.querySelector(
            ".tripease-toast-content strong"
        );

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    if (toastTitle) {
        toastTitle.textContent = title;
    }

    clearTimeout(tripeaseToastTimer);

    toast.hidden = false;

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    tripeaseToastTimer = setTimeout(() => {
        hideTripEaseToast();
    }, 3500);
}


function hideTripEaseToast() {

    const toast =
        document.getElementById("tripeaseToast");

    if (!toast) {
        return;
    }

    toast.classList.remove("show");

    setTimeout(() => {

        if (!toast.classList.contains("show")) {
            toast.hidden = true;
        }

    }, 300);
}


/* FORMAT SAVED DATE */

function formatSavedTripEaseDate(dateString) {

    if (!dateString) {
        return "Recently";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* SAVE CURRENT SCHEDULE */

function saveTripEaseSchedule() {

    const destinationInput =
        document.getElementById(
            "plannerDestination"
        );

    const startDateInput =
        document.getElementById(
            "plannerStartDate"
        );

    const endDateInput =
        document.getElementById(
            "plannerEndDate"
        );

    const travelTypeInput =
        document.getElementById(
            "travelType"
        );

    const itineraryTimeline =
        document.getElementById(
            "itineraryTimeline"
        );


    if (
        !destinationInput ||
        !startDateInput ||
        !endDateInput ||
        !itineraryTimeline
    ) {

        console.error(
            "TripEase: Required schedule elements not found."
        );

        return;
    }


    const destination =
        destinationInput.value.trim();

    const startDate =
        startDateInput.value;

    const endDate =
        endDateInput.value;

    const travelType =
        travelTypeInput?.value || "solo";


    if (
        !destination ||
        !startDate ||
        !endDate
    ) {

        alert(
            "Please generate a trip schedule before saving it."
        );

        return;
    }


    if (!itineraryTimeline.innerHTML.trim()) {

        alert(
            "Please generate your itinerary before saving it."
        );

        return;
    }


    const start =
        new Date(
            startDate + "T00:00:00"
        );

    const end =
        new Date(
            endDate + "T00:00:00"
        );


    if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime())
    ) {

        alert(
            "Please select valid travel dates."
        );

        return;
    }


    if (end < start) {

        alert(
            "Return date cannot be before the start date."
        );

        return;
    }


    const totalNights =
        Math.round(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );

    const totalDays =
        totalNights + 1;


    const savedItineraries =
        getSavedTripEaseItineraries();


    /* Prevent duplicate */

    const alreadySaved =
        savedItineraries.some(item =>

            item.destination?.toLowerCase() ===
                destination.toLowerCase() &&

            item.startDate === startDate &&

            item.endDate === endDate &&

            item.travelType === travelType
        );


    if (alreadySaved) {

        alert(
            "This itinerary is already saved."
        );

        return;
    }


    /* Create itinerary */

    const itinerary = {

        id: Date.now().toString(),

        destination,

        startDate,

        endDate,

        travelType,

        totalDays,

        totalNights,

        itineraryHTML:
            itineraryTimeline.innerHTML,

        createdAt:
            new Date().toISOString()
    };


    savedItineraries.unshift(
        itinerary
    );


    setSavedTripEaseItineraries(
        savedItineraries
    );


    renderSavedTripEaseItineraries();


    /* Modern success notification */

    showTripEaseToast(
        `${destination} itinerary saved successfully.`
    );


    console.log(
        "TripEase: Itinerary saved successfully."
    );
}


/* RENDER SAVED ITINERARIES */

function renderSavedTripEaseItineraries() {

    const grid =
        document.getElementById(
            "savedItinerariesGrid"
        );

    const emptyState =
        document.getElementById(
            "savedItinerariesEmpty"
        );

    const clearAllButton =
        document.getElementById(
            "clearAllSavedBtn"
        );


    if (!grid || !emptyState) {

        console.error(
            "TripEase: Saved itinerary elements not found."
        );

        return;
    }


    const savedItineraries =
        getSavedTripEaseItineraries();


    grid.innerHTML = "";


    if (savedItineraries.length === 0) {

        grid.style.display = "none";

        emptyState.hidden = false;

        if (clearAllButton) {
            clearAllButton.hidden = true;
        }

        return;
    }

    grid.style.display = "flex";

    emptyState.hidden = true;


    if (clearAllButton) {
        clearAllButton.hidden = false;
    }


    savedItineraries.forEach(
        itinerary => {

            const card =
                createSavedTripEaseCard(
                    itinerary
                );

            grid.appendChild(card);
        }
    );
}


/* CREATE SAVED CARD */

function createSavedTripEaseCard(
    itinerary
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "saved-itinerary-card";


    const destination =
        escapeTripEaseHTML(
            itinerary.destination
        );


    const travelType =
        escapeTripEaseHTML(
            formatTravelType(
                itinerary.travelType
            )
        );


    const start =
        new Date(
            itinerary.startDate +
            "T00:00:00"
        );


    const end =
        new Date(
            itinerary.endDate +
            "T00:00:00"
        );


    const dateText =
        `${formatScheduleDate(start)} - ${formatScheduleDate(end)}`;


    const savedOn =
        formatSavedTripEaseDate(
            itinerary.createdAt
        );


    card.innerHTML = `

        <div class="saved-card-top">

            <div class="saved-card-location">

                <div class="saved-location-icon">

                    <i class="fa-solid fa-location-dot"></i>

                </div>


                <div class="saved-location-text">

                    <span>DESTINATION</span>

                    <h3 title="${destination}">
                        ${destination}
                    </h3>

                </div>

            </div>


            <span class="saved-travel-type">
                ${travelType}
            </span>

        </div>


        <div class="saved-card-details">

            <div class="saved-detail-item">

                <span>TRAVEL DATES</span>

                <strong>
                    ${dateText}
                </strong>

            </div>


            <div class="saved-detail-item">

                <span>DURATION</span>

                <strong>
                    ${itinerary.totalDays}
                    Days /
                    ${itinerary.totalNights}
                    Nights
                </strong>

            </div>

        </div>


        <div class="saved-card-footer">

            <span class="saved-card-date">

                <i class="fa-regular fa-calendar-check"></i>

                Saved on ${savedOn}

            </span>


            <div class="saved-card-actions">

                <button
                    type="button"
                    class="saved-card-btn saved-view-btn"
                    data-action="view"
                    data-id="${itinerary.id}"
                >
                    <i class="fa-solid fa-eye"></i>
                    View
                </button>


                <button
                    type="button"
                    class="saved-card-btn saved-delete-btn"
                    data-action="delete"
                    data-id="${itinerary.id}"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>

            </div>

        </div>
    `;


    return card;
}


/* VIEW SAVED ITINERARY */

function viewSavedTripEaseItinerary(id) {

    const savedItineraries =
        getSavedTripEaseItineraries();


    const itinerary =
        savedItineraries.find(
            item => item.id === id
        );


    if (!itinerary) {

        alert(
            "Saved itinerary could not be found."
        );

        return;
    }


    const destinationInput =
        document.getElementById(
            "plannerDestination"
        );

    const startDateInput =
        document.getElementById(
            "plannerStartDate"
        );

    const endDateInput =
        document.getElementById(
            "plannerEndDate"
        );

    const travelTypeInput =
        document.getElementById(
            "travelType"
        );


    if (destinationInput) {
        destinationInput.value =
            itinerary.destination;
    }


    if (startDateInput) {
        startDateInput.value =
            itinerary.startDate;
    }


    if (endDateInput) {
        endDateInput.value =
            itinerary.endDate;
    }


    if (travelTypeInput) {
        travelTypeInput.value =
            itinerary.travelType;
    }


    const scheduleDestination =
        document.getElementById(
            "scheduleDestination"
        );

    const scheduleDates =
        document.getElementById(
            "scheduleDates"
        );

    const scheduleDuration =
        document.getElementById(
            "scheduleDuration"
        );

    const scheduleTravelType =
        document.getElementById(
            "scheduleTravelType"
        );

    const itineraryTimeline =
        document.getElementById(
            "itineraryTimeline"
        );


    if (scheduleDestination) {

        scheduleDestination.textContent =
            itinerary.destination;
    }


    if (scheduleDates) {

        const start =
            new Date(
                itinerary.startDate +
                "T00:00:00"
            );

        const end =
            new Date(
                itinerary.endDate +
                "T00:00:00"
            );

        scheduleDates.textContent =
            `${formatScheduleDate(start)} - ${formatScheduleDate(end)}`;
    }


    if (scheduleDuration) {

        scheduleDuration.textContent =
            `${itinerary.totalDays} Days / ${itinerary.totalNights} Nights`;
    }


    if (scheduleTravelType) {

        scheduleTravelType.textContent =
            formatTravelType(
                itinerary.travelType
            );
    }


    if (itineraryTimeline) {

        itineraryTimeline.innerHTML =
            itinerary.itineraryHTML;
    }


    const scheduleSection =
        document.getElementById(
            "schedule"
        );


    if (scheduleSection) {

        scheduleSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    showTripEaseToast(
        `${itinerary.destination} itinerary loaded.`,
        "Itinerary Loaded"
    );


    console.log(
        "TripEase: Saved itinerary loaded.",
        itinerary.destination
    );
}


/* DELETE SAVED ITINERARY */

function deleteSavedTripEaseItinerary(id) {

    const savedItineraries =
        getSavedTripEaseItineraries();


    const itinerary =
        savedItineraries.find(
            item => item.id === id
        );


    if (!itinerary) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete your ${itinerary.destination} itinerary?`
        );


    if (!confirmDelete) {
        return;
    }


    const updatedItineraries =
        savedItineraries.filter(
            item => item.id !== id
        );


    setSavedTripEaseItineraries(
        updatedItineraries
    );


    renderSavedTripEaseItineraries();


    showTripEaseToast(
        `${itinerary.destination} itinerary deleted.`,
        "Deleted"
    );


    console.log(
        "TripEase: Itinerary deleted."
    );
}


/* CLEAR ALL SAVED ITINERARIES */

function clearAllTripEaseItineraries() {

    const savedItineraries =
        getSavedTripEaseItineraries();


    if (savedItineraries.length === 0) {
        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all saved itineraries? This action cannot be undone."
        );


    if (!confirmClear) {
        return;
    }


    setSavedTripEaseItineraries([]);


    renderSavedTripEaseItineraries();


    showTripEaseToast(
        "All saved itineraries have been cleared.",
        "Trips Cleared"
    );


    console.log(
        "TripEase: All saved itineraries cleared."
    );
}


/* SAVED CARD BUTTON EVENTS */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".saved-card-btn"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if (!id) {
            return;
        }


        if (action === "view") {

            viewSavedTripEaseItinerary(
                id
            );
        }


        if (action === "delete") {

            deleteSavedTripEaseItinerary(
                id
            );
        }
    }
);


/* DOM CONTENT LOADED */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Save button */

        const saveButton =
            document.querySelector(
                ".save-schedule-btn"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveTripEaseSchedule
            );
        }


        /* Clear all button */

        const clearAllButton =
            document.getElementById(
                "clearAllSavedBtn"
            );


        if (clearAllButton) {

            clearAllButton.addEventListener(
                "click",
                clearAllTripEaseItineraries
            );
        }


        /* Toast close */

        const toastClose =
            document.getElementById(
                "tripeaseToastClose"
            );


        if (toastClose) {

            toastClose.addEventListener(
                "click",
                hideTripEaseToast
            );
        }


        /* Render saved trips */

        renderSavedTripEaseItineraries();
    }
);

document.addEventListener("DOMContentLoaded", () => {

    const savedGrid =
        document.getElementById("savedItinerariesGrid");

    if (!savedGrid) {
        return;
    }

    savedGrid.addEventListener(
        "wheel",
        (event) => {

            if (event.deltaY === 0) {
                return;
            }

            event.preventDefault();

            savedGrid.scrollLeft += event.deltaY;
        },
        {
            passive: false
        }
    );

});