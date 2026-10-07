
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