
// Uhrzeit logic 

function updateClock () {  // 
    // Date Objekt das die aktuelle Zeit und das aktuelle Datum enthält 
    const now = new Date(); 
    // sorgt dafür das die Std, min, sec immer in zwei stellen als Text angezeigt wird  
    const hours = now.getHours().toString().padStart(2, "0"); 
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    // Alle Wochentage in einem ARRAY 
    const days = [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"

    ];
    // Alle Monate in einem Array 
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

    const dayName = days[now.getDay()];  // Durch Array zugriff wird der Passende Tag gewählt
    const monthName = months[now.getMonth()]; // Durch Array zugriff wird der passende Monat gewählt
    const day = now.getDate().toString().padStart(2, '0'); // Zugriff auf Aktuellen Wochentag
    const year = now.getFullYear(); // Zugriff auf das Aktuelle Jahr 

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('date').textContent = `${dayName}, ${monthName} ${day}. ${year}`;

}

setInterval(updateClock, 1000); // Aufruf der Funtion mit einer Intervallfunktion auf 1000 Milisec's = 1 Sec
updateClock(); // Uhr wird sofort angezeigt 
// Uhrzeit Logic ENDE 

// Dokumenten Anzeige auf der Website 
  function openModal(filePath) {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");

    frame.src = filePath;
    modal.style.display = "block"; // Öffnet das PDF 
  }

  function closeModal() {
    const modal = document.getElementById("pdf-modal");
    const frame = document.getElementById("modal-frame");

    modal.style.display = "none";
    frame.src = ""; // Stoppt das PDF
  }

  window.onclick = function(event) {
    const modal = document.getElementById("pdf-modal");
    if (event.target == modal) {
        closeModal();
    }
  }
// Dokumenten Anzeige  ENDE 

// Darkmode Funktion 
 document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById('toggle-checkbox');
    const themeStylesheet = document.getElementById('light');

    // Prüft ob auswahl schon einmal getroffen wurde 

    const userTheme = localStorage.getItem('theme');

    // aktuelle Uhrzeit in Variabele für automatische Einstellung des darkmodes 
    const now = new Date();
    const hours = now.getHours();

    // Variable für welches Start Theme gelten soll 
    let initialTheme;
    // Bedigungen für Theme wechsel 
    if (userTheme) { // negate operator und dann 
        initialTheme = userTheme;  
    } else {
        initialTheme = (hours >= 40 || hours < 6) ? "dark" : "light";
    }

    // Thema altivieren 
    setTheme(initialTheme);

    checkbox.checked = initialTheme === "dark";

    checkbox.addEventListener("change", function () {
        const newTheme = checkbox.checked ? "dark" : "light";
        setTheme (newTheme);
        localStorage.setItem("theme", newTheme);

    });

    function setTheme(theme) {
        const href = theme == "dark" ? "styledark.css" : "stylesheet.css";
        themeStylesheet.setAttribute("href", href);
    }

 });

 // ENDE Darkmode Funktion 

  // Skill-Bar Funktion
  document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skill-progress");

  skills.forEach(skill => {
    const level = skill.getAttribute("data-level");
    skill.style.width = level + "%";
  });
});

// ENDE Skill-Bar Funktion 


