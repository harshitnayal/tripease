/* FOOTER JAVASCRIPT */

document.addEventListener("DOMContentLoaded", () => {

    // 1. AUTOMATIC COPYRIGHT YEAR

    const footerYear = document.getElementById("footerCurrentYear");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // 2. BACK TO TOP BUTTON

    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {

        // Show button after scrolling 300px
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        };

        window.addEventListener("scroll", toggleBackToTop, {
            passive: true
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        toggleBackToTop();
    }

});