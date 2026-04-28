// cv-loader.js
// Hauptmodul für das Laden und Verarbeiten von JSON-Daten für die Website

// ==================== INITIALISIERUNG & HAUPTPROZESS ====================

/**
 * Hauptfunktion - Startet den gesamten Datenladevorgang
 * Koordiniert alle Unterfunktionen basierend auf der aktuellen Seite
 */
function loadCVData() {
    console.log("Starte Datenladung...");
    try {
        const resume = jsonData.resume;
        
        // Funktionen für ALLE Seiten
        fillContactInfo(resume.personalInfo);
        fillInterests(resume.interests);
        
        // Funktionen nur für Lebenslauf-Seite (cv.html)
        if (document.getElementById('json-work-experience')) {
            fillWorkExperience(resume.workExperience);
            fillEducation(resume.education);
            fillSkills(resume.skills);
            updateTimeline(resume);
        }
        
        // Funktionen für rechtliche Seiten
        fillImpressumData(resume.personalInfo);
        fillDatenschutzData(resume.personalInfo);
        
        console.log(" Alle Daten erfolgreich geladen");
    } catch (error) {
        console.error(" Fehler beim Laden:", error);
        showError("Daten konnten nicht geladen werden");
    }
}

// ==================== KONTAKTINFORMATIONEN (FÜR ALLE SEITEN) ====================

/**
 * Füllt Kontaktdaten in der Sidebar auf ALLEN Seiten
 * @param {Object} personalInfo - JSON-Daten mit persönlichen Informationen
 */
function fillContactInfo(personalInfo) {
    if (!personalInfo) return;
    
    setText('.json-email', personalInfo.email);
    setText('.json-phone', personalInfo.phone);
    setText('.json-country', personalInfo.address.country);
    
    const addressElement = document.querySelector('.json-address');
    if (addressElement) {
        addressElement.textContent = `${personalInfo.address.street}, ${personalInfo.address.city}`;
    }
    
    console.log(" Kontaktinfo geladen");
}

// ==================== INTERESSEN (FÜR ALLE SEITEN) ====================

/**
 * Füllt die Interessenliste in der Sidebar auf ALLEN Seiten
 * @param {Array} interests - Array mit Interessen aus JSON
 */
function fillInterests(interests) {
    const container = document.getElementById('json-interests');
    if (!container || !interests) return;
    
    let html = '<div class="interests-list">';
    interests.forEach(interest => {
        html += `<span class="interest-tag">${interest}</span>`;
    });
    html += '</div>';
    container.innerHTML = html;
    
    console.log(" Interessen geladen");
}

// ==================== BERUFSERFAHRUNG (NUR CV.HTML) ====================

/**
 * Erstellt die Berufserfahrungsliste für die Lebenslauf-Seite
 * @param {Array} workExperience - Array mit Berufserfahrung aus JSON
 */
function fillWorkExperience(workExperience) {
    const container = document.getElementById('json-work-experience');
    if (!container || !workExperience) return;
    
    let html = '';
    workExperience.forEach((job, index) => {
        const isLast = index === workExperience.length - 1;
        html += `
        <div class="work-item ${isLast ? 'last' : ''}">
            <div class="job-header">
                <h3>${job.position}</h3>
                <div class="job-meta">
                    <span class="company">${job.company}</span>
                    <span class="location">${job.location}</span>
                    <span class="period">${job.period}</span>
                </div>
            </div>
            <ul class="job-responsibilities">
                ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        </div>`;
    });
    container.innerHTML = html;
    
    console.log(" Berufserfahrung geladen");
}

// ==================== AUSBILDUNG (NUR CV.HTML) ====================

/**
 * Erstellt die Ausbildungsliste für die Lebenslauf-Seite
 * @param {Array} education - Array mit Ausbildung aus JSON
 */
function fillEducation(education) {
    const container = document.getElementById('json-education');
    if (!container || !education) return;
    
    let html = '';
    education.forEach((edu, index) => {
        const isLast = index === education.length - 1;
        html += `
        <div class="education-item ${isLast ? 'last' : ''}">
            <div class="education-header">
                <h3>${edu.program}</h3>
                <div class="education-meta">
                    <span class="institution">${edu.institution}</span>
                    <span class="period">${edu.period}</span>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    
    console.log(" Ausbildung geladen");
}

// ==================== SKILLS & FÄHIGKEITEN (NUR CV.HTML) ====================

/**
 * Erstellt die Skills-Sektion für die Lebenslauf-Seite
 * @param {Object} skills - Skills-Daten aus JSON
 */
function fillSkills(skills) {
    const container = document.getElementById('json-skills');
    if (!container || !skills) return;
    
    let html = '<div class="skills-container">';
    
    // Sprachen
    if (skills.languages?.length > 0) {
        html += `<div class="skills-category">
            <h4>Sprachen</h4>
            <div class="skills-list languages">`;
        skills.languages.forEach(lang => {
            html += `<span class="skill-tag">${lang.language} (${lang.level})</span>`;
        });
        html += `</div></div>`;
    }
    
    // Software & Technologien
    if (skills.software?.length > 0) {
        html += `<div class="skills-category">
            <h4>Software & Technologien</h4>
            <div class="skills-list software">`;
        skills.software.forEach(soft => {
            html += `<span class="skill-tag">${soft.name} (${soft.level})</span>`;
        });
        html += `</div></div>`;
    }
    
    // Führerschein
    if (skills.drivingLicense) {
        html += `<div class="skills-category">
            <h4>Führerschein</h4>
            <p class="license">${skills.drivingLicense}</p>
        </div>`;
    }
    
    // Persönliche Fähigkeiten
    if (skills.abilities?.length > 0) {
        html += `<div class="skills-category">
            <h4>Persönliche Fähigkeiten</h4>
            <div class="skills-list abilities">`;
        skills.abilities.forEach(ability => {
            html += `<span class="skill-tag">${ability}</span>`;
        });
        html += `</div></div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    console.log(" Skills geladen");
}

// ==================== TIMELINE-VERARBEITUNG (NUR CV.HTML) ====================

/**
 * Aktualisiert die Timeline mit JSON-Daten
 * @param {Object} resume - Komplette Resume-Daten aus JSON
 */
function updateTimeline(resume) {
    console.log("Aktualisiere Timeline...");
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    const yearMapping = {
        0: '2016', 1: '2017', 2: '2018', 3: '2019', 4: '2020',
        5: '2021', 6: '2022', 7: '2023', 8: '2024', 9: '2025'
    };
    
    const yearEvents = {};
    
    // Berufserfahrung zu Jahren zuordnen
    if (resume.workExperience) {
        resume.workExperience.forEach(job => {
            const years = extractYearsFromPeriod(job.period);
            years.forEach(year => {
                if (!yearEvents[year]) yearEvents[year] = [];
                yearEvents[year].push({
                    type: 'work',
                    title: job.position,
                    company: job.company,
                    description: `${job.position} bei ${job.company} (${job.period})`
                });
            });
        });
    }
    
    // Ausbildung zu Jahren zuordnen
    if (resume.education) {
        resume.education.forEach(edu => {
            const years = extractYearsFromPeriod(edu.period);
            years.forEach(year => {
                if (!yearEvents[year]) yearEvents[year] = [];
                yearEvents[year].push({
                    type: 'education',
                    title: edu.program,
                    institution: edu.institution,
                    description: `${edu.program} bei ${edu.institution} (${edu.period})`
                });
            });
        });
    }
    
    const defaultTooltips = {
        '2016': 'Schule: Beginn der gymnasialen Laufbahn',
        '2017': 'Praktische Erfahrungen & Projekte',
        '2018': 'Schulische Weiterbildung, Schwerpunkt BWL',
        '2019': 'Abschluss Mittlere Reife / Praktikum',
        '2020': 'Fachabitur Wirtschaft & Verwaltung',
        '2021': 'Erste IT-Projekte / Selbststudium',
        '2022': 'Praktische Erfahrungen in IT & Netzwerke',
        '2023': 'Weiterbildung in IT-Sicherheit',
        '2024': 'Webentwicklung & Projekte',
        '2025': 'Beginn Umschulung Fachinformatiker Anwendungsentwicklung'
    };
    
    const yearTitles = {
        '2016': 'Fachhochschulreife',
        '2017': 'Schulische Weiterbildung',
        '2018': 'Schulische Weiterbildung',
        '2019': 'Ausbildung startet',
        '2020': 'Fachabitur',
        '2021': 'Berufseinstieg',
        '2022': 'Kundenberater',
        '2023': 'Vertrieb & Beratung',
        '2024': 'Kundenberatung',
        '2025': 'Umschulung'
    };
    
    // Timeline-Items aktualisieren
    timelineItems.forEach((item, index) => {
        const year = yearMapping[index];
        if (!year) return;
        
        const tooltipElement = item.querySelector('.timeline-tooltip');
        let displayDescription = '';
        let displayType = 'default';
        
        // Ereignisse für dieses Jahr vorhanden?
        if (yearEvents[year]?.length > 0) {
            displayType = yearEvents[year][0].type;
            if (yearEvents[year].length === 1) {
                displayDescription = yearEvents[year][0].description;
            } else {
                displayDescription = `<strong>${yearEvents[year].length} Ereignisse:</strong><br>`;
                yearEvents[year].forEach((event, i) => {
                    if (i < 3) {
                        displayDescription += `• ${event.title}`;
                        if (event.company || event.institution) {
                            displayDescription += ` (${event.company || event.institution})`;
                        }
                        displayDescription += '<br>';
                    }
                });
                if (yearEvents[year].length > 3) {
                    displayDescription += `• ... und ${yearEvents[year].length - 3} weitere`;
                }
            }
        } else {
            displayDescription = defaultTooltips[year] || `Aktivitäten in ${year}`;
            displayType = (year >= '2021' && year <= '2024') ? 'work' : 'education';
        }
        
        // Tooltip-Inhalt setzen
        if (tooltipElement) {
            tooltipElement.innerHTML = displayDescription;
        }
        
        // CSS-Klassen für Styling
        if (displayType === 'work') {
            item.classList.add('work-year');
            item.classList.remove('education-year');
        } else if (displayType === 'education') {
            item.classList.add('education-year');
            item.classList.remove('work-year');
        }
        
        // Jahr-Titel hinzufügen
        const titleElement = item.querySelector('.timeline-title');
        if (!titleElement) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'timeline-title';
            titleDiv.textContent = yearTitles[year] || year;
            titleDiv.style.cssText = 'font-size: 0.8em; margin-top: 5px; font-weight: bold;';
            item.appendChild(titleDiv);
        }
        
        // Interaktive Features
        item.style.cursor = 'pointer';
        item.style.transition = 'all 0.3s ease';
        
        // Event-Listener für Hover-Effekte
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Klick-Event für Details
        item.addEventListener('click', function() {
            const yearTitle = yearTitles[year] || year;
            const yearDesc = tooltipElement.textContent || tooltipElement.innerText;
            alert(`${year}\n${yearTitle}\n${yearDesc}`);
        });
    });
    
    console.log("✅ Timeline aktualisiert");
}

// ==================== RECHTLICHE SEITEN (IMPRESSUM & DATENSCHUTZ) ====================

/**
 * Füllt Impressum-Daten auf impressum.html
 * @param {Object} personalInfo - Persönliche Informationen aus JSON
 */
function fillImpressumData(personalInfo) {
    if (!personalInfo) return;
    setText('.json-name', personalInfo.name);
    setText('.json-address-street', personalInfo.address.street);
    setText('.json-address-city', personalInfo.address.city);
    setText('.json-country', personalInfo.address.country);
    setText('.json-phone', personalInfo.phone);
    setText('.json-email', personalInfo.email);
    
    // Nur auf Impressum-Seite ausführen
    const impressumContainer = document.querySelector('.impressum-details');
    if (impressumContainer) {
        console.log("Fülle Impressum...");
        
        const addressHtml = `
            <p><strong>${personalInfo.name}</strong></p>
            <p>${personalInfo.address.street}<br>
            ${personalInfo.address.city}<br>
            ${personalInfo.address.country}</p>
        `;
        
        const firstSection = document.querySelector('.impressum-section .impressum-details');
        if (firstSection) {
            firstSection.innerHTML = addressHtml;
        }
    }
}

/**
 * Füllt Datenschutz-Daten auf datenschutz.html
 * @param {Object} personalInfo - Persönliche Informationen aus JSON
 */
function fillDatenschutzData(personalInfo) {
    if (!personalInfo) return;
    
    // Nur auf Datenschutz-Seite ausführen
    const datenschutzContainer = document.querySelector('.datenschutz-details');
    if (datenschutzContainer) {
        console.log("Fülle Datenschutz...");
        
        const verantwortlichSection = document.querySelector('.datenschutz-section:nth-child(1) .datenschutz-details');
        if (verantwortlichSection) {
            const verantwortlichHtml = `
                <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
                <p><strong>${personalInfo.name}</strong><br>
                ${personalInfo.address.street}<br>
                ${personalInfo.address.city}<br>
                ${personalInfo.address.country}</p>
                <p>E-Mail: <span id="ds-email">${personalInfo.email}</span></p>
            `;
            verantwortlichSection.innerHTML = verantwortlichHtml;
        }
    }
}

// ==================== HILFSFUNKTIONEN ====================

/**
 * Extrahiert Jahre aus Zeitperioden (z.B. "2021 - 2023")
 * @param {string} period - Zeitperiode als String
 * @returns {Array} - Array mit extrahierten Jahren
 */
function extractYearsFromPeriod(period) {
    const years = [];
    const matches = period.match(/\b(20\d{2})\b/g);
    if (matches) {
        matches.forEach(match => years.push(match));
    }
    return years;
}

/**
 * Setzt Text auf alle Elemente mit einem bestimmten Selektor
 * @param {string} selector - CSS-Selektor
 * @param {string} text - Anzuzeigender Text
 */
function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => {
        el.textContent = text;
    });
}

/**
 * Zeigt Fehlermeldungen in den entsprechenden Containern an
 * @param {string} message - Fehlermeldung
 */
function showError(message) {
    ['json-work-experience', 'json-education', 'json-skills', 'json-interests'].forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="json-error">${message}</div>`;
        }
    });
}

// ==================== JSON-LADE-FUNKTIONEN ====================

/**
 * Lädt JSON-Daten aus einer externen Datei
 * Wird verwendet, wenn jsonData nicht direkt eingebunden ist
 */
function loadJSONFromFile() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON-Datei nicht gefunden');
            }
            return response.json();
        })
        .then(data => {
            window.jsonData = data;
            loadCVData();
        })
        .catch(error => {
            console.error('Fehler beim Laden der JSON-Datei:', error);
            showError('Daten konnten nicht geladen werden');
        });
}

// ==================== EVENT-LISTENER & INITIALISIERUNG ====================

/**
 * Initialisiert den CV Loader wenn DOM geladen ist
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("CV Loader initialisiert");
    
    if (typeof jsonData !== 'undefined') {
        loadCVData();
    } else {
        console.log("JSON-Daten nicht eingebunden, versuche externe Datei...");
        loadJSONFromFile();
    }
});

// ==================== GLOBALE FUNKTIONEN FÜR DEBUGGING ====================

/**
 * Lädt CV-Daten neu (für Debugging)
 */
window.reloadCVData = function() {
    console.log("Lade CV-Daten neu");
    loadCVData();
};

/**
 * Testet JSON-Ladung (für Debugging)
 */
window.testJSONLoad = function() {
    if (typeof jsonData !== 'undefined') {
        console.log("Teste JSON-Ladung...");
        console.log("Name aus JSON:", jsonData.resume.personalInfo.name);
        console.log("Anzahl Berufserfahrungen:", jsonData.resume.workExperience.length);
        console.log("Anzahl Ausbildungen:", jsonData.resume.education.length);
        
        alert(`JSON-Test erfolgreich!\nName: ${jsonData.resume.personalInfo.name}\nBerufe: ${jsonData.resume.workExperience.length}\nAusbildungen: ${jsonData.resume.education.length}`);
    } else {
        alert("JSON-Daten nicht gefunden!");
    }
};