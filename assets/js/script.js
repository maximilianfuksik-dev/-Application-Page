// Clock logic 

function updateClock () {  // 
    // Date object containing current time and date 
    const now = new Date(); 
    // ensures hours, min, sec are always displayed as two-digit text  
    const hours = now.getHours().toString().padStart(2, "0"); 
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    // All weekdays in an ARRAY 
    const days = [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"

    ];
    // All months in an array 
    const months =[
        "Januar", // 0
        "Feburar", // 1
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
    ];

    const dayName = days[now.getDay()];  // Access via array selects the matching day
    const monthName = months[now.getMonth()]; // Access via array selects the matching month
    const day = now.getDate().toString().padStart(2, '0'); // Access current day of week
    const year = now.getFullYear(); // Access current year 

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('date').textContent = `${dayName}, ${monthName} ${day}. ${year}`;

}


if(document.getElementById('clock')) {
  setInterval(updateClock, 1000); // Call function with interval of 1000 milliseconds = 1 second
  updateClock();  // Clock is displayed immediately
}
 
 
// Clock logic END 

// Document display on the website 
  function openModal(filePath) {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");

    frame.src = filePath;
    modal.style.display = "block"; // Opens the PDF 
  }

  function closeModal() {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");

    modal.style.display = "none";
    frame.src = ""; // Stops the PDF
  }

  window.onclick = function(event) {
    const modal = document.getElementById("pdf-modal");
    if (event.target == modal) {
        closeModal();
    }
  }
// Document display END 

// Dark mode function 
 document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById('toggle-checkbox');
    const themeStylesheet = document.getElementById('light');

    // Checks if a selection has already been made 
    const userTheme = localStorage.getItem('theme');

    // current time in variable for automatic dark mode setting 
    const now = new Date();
    const hours = now.getHours();

    // Variable for which start theme should apply 
    let initialTheme;
    // Conditions for theme change 
    if (userTheme) { // negate operator and then 
        initialTheme = userTheme;  
    } else {
        initialTheme = (hours >= 18 || hours < 6) ? "dark" : "light";
    }

    // Activate theme 
    setTheme(initialTheme);

    checkbox.checked = initialTheme === "dark";

    checkbox.addEventListener("change", function () {
        const newTheme = checkbox.checked ? "dark" : "light";
        setTheme (newTheme);
        localStorage.setItem("theme", newTheme);

    });

    function setTheme(theme) {
        // *** CHANGED: Both CSS files now without # in filename ***
        // *** Make sure files are named: stylesheet.css and styledark.css ***
        const href = theme == "dark" ? "assets/css/styledark.css" : "assets/css/stylesheet.css";
        themeStylesheet.setAttribute("href", href);
    }

 });

 // END Dark mode function 
  // To use this: Add elements with class "skill-progress" and data-level attribute to your HTML
  
  document.addEventListener("DOMContentLoaded", () => {
    const skills = document.querySelectorAll(".skill-progress");
  
    skills.forEach(skill => {
      const level = skill.getAttribute("data-level");
      skill.style.width = level + "%";
    });
  });

 // END Skill-Bar function
