// ============================================
// script.js - UI Functions
// Clock, Dark Mode, Modal, Skill Bars
// ============================================

// ==================== CLOCK ====================

// Updates the clock display with current time and date
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();

    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const dateEl = document.getElementById('date');
    
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
    if (dateEl) dateEl.textContent = `${dayName}, ${monthName} ${day}, ${year}`;
}

// Start clock only if element exists
if (document.getElementById('clock')) {
    setInterval(updateClock, 1000);
    updateClock();
}

// ==================== MODAL (PDF Viewer) ====================

// Opens modal with PDF viewer
function openModal(filePath) {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");
    if (modal && frame) {
        frame.src = filePath;
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

// Closes modal and stops PDF playback
function closeModal() {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");
    if (modal && frame) {
        modal.style.display = "none";
        frame.src = "";
        document.body.style.overflow = "auto";
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("pdf-modal");
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ==================== DARK MODE ====================

// Initialize dark mode toggle
document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.getElementById('toggle-checkbox');
    const themeStylesheet = document.getElementById('light');
    
    if (!checkbox || !themeStylesheet) {
        console.warn("Dark mode elements not found");
        return;
    }

    // Load saved theme or detect based on time (dark from 6 PM to 6 AM)
    const userTheme = localStorage.getItem('theme');
    const now = new Date();
    const hours = now.getHours();

    let initialTheme;
    if (userTheme) {
        initialTheme = userTheme;
    } else {
        initialTheme = (hours >= 18 || hours < 6) ? "dark" : "light";
    }

    // Switches between light and dark mode stylesheets
    function setTheme(theme) {
        const href = theme === "dark" ? "assets/css/styledark.css" : "assets/css/stylesheet.css";
        themeStylesheet.setAttribute("href", href);
        console.log(`Theme changed to: ${theme}`);
    }

    // Apply initial theme
    setTheme(initialTheme);
    checkbox.checked = initialTheme === "dark";

    // Listen for checkbox changes
    checkbox.addEventListener("change", function() {
        const newTheme = checkbox.checked ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
});

// ==================== SKILL BARS ====================

// Initialize skill bar widths from data-level attribute
document.addEventListener("DOMContentLoaded", function() {
    const skills = document.querySelectorAll(".skill-progress");
    skills.forEach(skill => {
        const level = skill.getAttribute("data-level");
        if (level) {
            skill.style.width = level + "%";
        }
    });
});