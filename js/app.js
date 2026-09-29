// NAVBAR FUNCTIONALITY

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

// Trip Search Form
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