// NAVBAR FUNCTIONALITY

// Access navbar elements
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

// Close menu after clicking a link

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    });
});

// TRIP SEARCH FUNCTIONALITY

// Access elements
const tripSearchForm = document.getElementById("tripSearchForm");
const destinationInput = document.getElementById("destination");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const travellersInput = document.getElementById("travellers");
const searchMessage = document.getElementById("searchMessage");

// Get today's date in local timezone
const today = new Date();

const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
)
    .toISOString()
    .split("T")[0];

// Prevent selecting past dates
startDateInput.min = localToday;
endDateInput.min = localToday;

startDateInput.addEventListener("change", () => {
    const startDate = startDateInput.value;

    endDateInput.min = startDate || localToday;

    if (endDateInput.value && endDateInput.value <= startDate) {
        endDateInput.value = "";
    }
});

// Handle form submission
tripSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = destinationInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const travellers = travellersInput.value;

    // Validate all fields
    if (!destination || !startDate || !endDate || !travellers) {
        searchMessage.textContent = "Please fill in all the fields.";
        searchMessage.classList.add("error");
        return;
    }

    // Validate date range
    if (endDate <= startDate) {
        searchMessage.textContent =
            "End date must be after the start date.";

        searchMessage.classList.add("error");
        return;
    }

    // Display success message
    searchMessage.classList.remove("error");

    searchMessage.textContent =
        `Your trip to ${destination} from ${startDate} to ${endDate} for ${travellers} traveller(s) is ready to plan!`;

    console.log({
        destination,
        startDate,
        endDate,
        travellers
    });
});


/*  DESTINATION SECTION  */

// Access destination elements
const destinationCarousel = document.getElementById("destinationCarousel");
const destinationCards = document.querySelectorAll(".destination-card");
const exploreButtons = document.querySelectorAll(".explore-btn");

// Horizontal scrolling with mouse wheel
if (destinationCarousel) {
    destinationCarousel.addEventListener(
        "wheel",
        (event) => {
            // Convert vertical mouse wheel movement to horizontal scrolling
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();

                destinationCarousel.scrollBy({
                    left: event.deltaY,
                    behavior: "auto"
                });
            }
        },
        { passive: false }
    );
}

// Explore Now button functionality
exploreButtons.forEach((button) => {
    button.addEventListener("click", () => {

        const selectedDestination = button.dataset.destination;

        // Get trip planner elements
        const destinationInput = document.getElementById("destination");
        const tripPlanner = document.getElementById("trip-planner");

        // Check if elements exist
        if (!destinationInput || !tripPlanner) {
            console.error("Trip planner elements not found!");
            return;
        }

        destinationInput.value = selectedDestination;

        destinationInput.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        // Smoothly scroll to trip planner
        tripPlanner.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        // Focus destination input after scrolling
        setTimeout(() => {
            destinationInput.focus({ preventScroll: true });
        }, 500);
    });
});

/* TRIP PLANNER FUNCTIONALITY */

const tripPlannerForm = document.getElementById("tripPlannerForm");

if (tripPlannerForm) {

    // Access Elements
    const travelTypeSelect = document.getElementById("travelType");
    const businessDetails = document.getElementById("businessDetails");

    const startDateInput = document.getElementById("plannerStartDate");
    const endDateInput = document.getElementById("plannerEndDate");

    const message = document.getElementById("tripPlannerMessage");


    // Get Today's Date in Local Timezone
    const today = new Date();

    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    )
        .toISOString()
        .split("T")[0];


    // Prevent Selecting Past Dates
    startDateInput.min = localToday;
    endDateInput.min = localToday;


    // Update Return Date Based on Departure Date
    startDateInput.addEventListener("change", () => {

        const startDate = startDateInput.value;

        endDateInput.min = startDate || localToday;

        if (endDateInput.value && endDateInput.value <= startDate) {
            endDateInput.value = "";
        }

    });


    // Show Business Details When Business Is Selected
    travelTypeSelect.addEventListener("change", () => {

        businessDetails.hidden =
            travelTypeSelect.value !== "Business";

    });


    // Handle Form Submission
    tripPlannerForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const formData = new FormData(tripPlannerForm);


        // Get Form Values
        const destination = formData.get("destination").trim();
        const travelType = formData.get("travelType");
        const startDate = formData.get("startDate");
        const endDate = formData.get("endDate");
        const travellers = formData.get("travellers");
        const budget = formData.get("budget");
        const companyName = formData.get("companyName");
        const meetingPurpose = formData.get("meetingPurpose");
        const notes = formData.get("notes") || "";


        // Clear Previous Message and Classes
        message.textContent = "";
        message.classList.remove("error", "success");


        // Validate Date Range
        if (endDate <= startDate) {

            message.textContent =
                "Return date must be after departure date.";

            message.classList.add("error");

            return;
        }


        // Display Trip Overview
        document.getElementById("summaryDestination").textContent =
            destination;

        document.getElementById("summaryTravelType").textContent =
            travelType;

        document.getElementById("summaryStartDate").textContent =
            startDate;

        document.getElementById("summaryEndDate").textContent =
            endDate;

        document.getElementById("summaryTravellers").textContent =
            travellers;


        // Format Budget in Indian Rupees
        document.getElementById("summaryBudget").textContent =
            Number(budget).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            });


        // Business Travel Summary
        const summaryBusiness =
            document.getElementById("summaryBusiness");

        if (summaryBusiness) {

            if (travelType === "Business") {

                summaryBusiness.hidden = false;

                document.getElementById("summaryCompany").textContent =
                    companyName || "Not provided";

                document.getElementById("summaryPurpose").textContent =
                    meetingPurpose || "Not provided";

            } else {

                summaryBusiness.hidden = true;

            }

        }

        // Additional Requirements
        const summaryNotesWrapper =
            document.getElementById("summaryNotesWrapper");

        if (summaryNotesWrapper) {

            summaryNotesWrapper.hidden = !notes.trim();

            if (notes.trim()) {

                document.getElementById("summaryNotes").textContent =
                    notes;

            }

        }


        document.getElementById("summaryPlaceholder").hidden = true;

        document.getElementById("summaryContent").hidden = false;


        // Success Message
        message.textContent =
            "Your trip plan has been generated successfully!";

        message.classList.add("success");


        const tripSummary = document.getElementById("tripSummary");

        const summaryPosition =
            tripSummary.getBoundingClientRect().top +
            window.scrollY - 120;

        window.scrollTo({
            top: summaryPosition,
            behavior: "smooth"
        });

    });

}