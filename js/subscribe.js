
// NEWSLETTER SUBSCRIBE JS


const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");

// Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (newsletterForm && newsletterEmail && newsletterMessage) {

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterEmail.value.trim();

    // Empty email validation
    if (email === "") {
      showNewsletterMessage(
        "Please enter your email address.",
        "error"
      );

      newsletterEmail.focus();
      return;
    }

    // Email Regex validation
    if (!emailRegex.test(email)) {
      showNewsletterMessage(
        "Please enter a valid email address.",
        "error"
      );

      newsletterEmail.focus();
      return;
    }

    // Success message
    showNewsletterMessage(
      "Thank you for subscribing to TripEase!",
      "success"
    );

    newsletterForm.reset();
  });

  // Display status message
  function showNewsletterMessage(message, type) {
    newsletterMessage.textContent = message;

    if (type === "success") {
      newsletterMessage.style.color = "#15803d";
    } else {
      newsletterMessage.style.color = "#dc2626";
    }
  }
}


newsletterEmail.addEventListener("input", () => {
  if (newsletterMessage.style.color === "rgb(21, 128, 61)") {
    newsletterMessage.textContent = "";
    newsletterMessage.style.color = "";
  }
});