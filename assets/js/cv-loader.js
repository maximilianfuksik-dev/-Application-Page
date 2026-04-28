// ============================================
// cv-loader.js - Hauptmodul (Optimiert)
// Lädt alle JSON-Dateien und verteilt die Daten
// ============================================

// Globale Daten-Container
let siteData = {
    resume: null,
    pageContent: null,
    certificates: null,
    projects: null,
    config: null
};

// ==================== JSON-LADER ====================

async function loadAllJSON() {
    console.log("🚀 Lade alle JSON-Dateien...");
    
    const files = {
        resume: 'data/resume.json',
        pageContent: 'data/pageContent.json',
        certificates: 'data/certificates.json',
        projects: 'data/projects.json',
        config: 'data/config.json'
    };
    
    try {
        const promises = Object.entries(files).map(async ([key, path]) => {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    siteData[key] = await response.json();
                    console.log(`✅ ${key}.json geladen`);
                } else {
                    console.warn(`⚠️ ${key}.json nicht gefunden (${response.status})`);
                    siteData[key] = null;
                }
            } catch (error) {
                console.warn(`⚠️ ${key}.json konnte nicht geladen werden:`, error);
                siteData[key] = null;
            }
        });
        
        await Promise.all(promises);
        console.log("📦 Alle JSON-Dateien verarbeitet", siteData);
        return true;
    } catch (error) {
        console.error("❌ Fehler beim Laden der JSONs:", error);
        return false;
    }
}

// ==================== SEITEN-ERKENNUNG ====================

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const pageName = filename.replace('.html', '');
    console.log(`📍 Erkannte Seite: ${pageName}`);
    return pageName;
}

// ==================== RENDER-FUNKTIONEN (ALLE SEITEN) ====================

function renderContactInfo() {
    const info = siteData.resume?.personalInfo;
    if (!info) {
        console.warn("⚠️ Keine Kontaktinfo in resume.json gefunden");
        return;
    }
    
    setText('.json-email', info.email);
    setText('.json-phone', info.phone);
    setText('.json-country', info.address?.country);
    
    const addressEl = document.querySelector('.json-address');
    if (addressEl && info.address) {
        addressEl.textContent = `${info.address.street || ''}, ${info.address.city || ''}`;
    }
    console.log("📞 Kontaktinfo geladen");
}

function renderInterests() {
    const interests = siteData.resume?.interests;
    const container = document.getElementById('json-interests');
    if (!container) return;
    if (!interests || interests.length === 0) {
        container.innerHTML = '<p>Keine Interessen angegeben</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="interests-list">
            ${interests.map(i => `<span class="interest-tag">${escapeHtml(i)}</span>`).join('')}
        </div>
    `;
    console.log(`❤️ ${interests.length} Interessen geladen`);
}

// ==================== CV-SEITE (cv.html) ====================

function renderWorkExperience() {
    const container = document.getElementById('json-work-experience');
    const experiences = siteData.resume?.workExperience;
    if (!container) return;
    if (!experiences || experiences.length === 0) {
        container.innerHTML = '<p>Keine Berufserfahrung vorhanden</p>';
        return;
    }
    
    let html = '';
    experiences.forEach((job, idx) => {
        const isLast = idx === experiences.length - 1;
        html += `
        <div class="work-item ${isLast ? 'last' : ''}">
            <div class="job-header">
                <h3>${escapeHtml(job.position)}</h3>
                <div class="job-meta">
                    <span class="company">${escapeHtml(job.company)}</span>
                    <span class="location">${escapeHtml(job.location)}</span>
                    <span class="period">${escapeHtml(job.period)}</span>
                </div>
            </div>
            <ul class="job-responsibilities">
                ${job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
        </div>`;
    });
    container.innerHTML = html;
    console.log(`💼 ${experiences.length} Berufserfahrungen geladen`);
}

function renderEducation() {
    const container = document.getElementById('json-education');
    const education = siteData.resume?.education;
    if (!container) return;
    if (!education || education.length === 0) {
        container.innerHTML = '<p>Keine Ausbildung vorhanden</p>';
        return;
    }
    
    let html = '';
    education.forEach((edu, idx) => {
        const isLast = idx === education.length - 1;
        html += `
        <div class="education-item ${isLast ? 'last' : ''}">
            <div class="education-header">
                <h3>${escapeHtml(edu.program)}</h3>
                <div class="education-meta">
                    <span class="institution">${escapeHtml(edu.institution)}</span>
                    <span class="period">${escapeHtml(edu.period)}</span>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    console.log(`🎓 ${education.length} Ausbildungen geladen`);
}

function renderSkills() {
    const container = document.getElementById('json-skills');
    const skills = siteData.resume?.skills;
    if (!container) return;
    if (!skills) {
        container.innerHTML = '<p>Keine Skills vorhanden</p>';
        return;
    }
    
    let html = '<div class="skills-container">';
    
    if (skills.languages?.length) {
        html += `<div class="skills-category">
            <h4>🌐 Sprachen</h4>
            <div class="skills-list languages">
                ${skills.languages.map(l => `<span class="skill-tag">${escapeHtml(l.language)} (${l.level})</span>`).join('')}
            </div>
        </div>`;
    }
    
    if (skills.software?.length) {
        html += `<div class="skills-category">
            <h4>💻 Software & Technologien</h4>
            <div class="skills-list software">
                ${skills.software.map(s => `<span class="skill-tag">${escapeHtml(s.name)} (${s.level})</span>`).join('')}
            </div>
        </div>`;
    }
    
    if (skills.drivingLicense) {
        html += `<div class="skills-category">
            <h4>🚗 Führerschein</h4>
            <p class="license">${escapeHtml(skills.drivingLicense)}</p>
        </div>`;
    }
    
    if (skills.abilities?.length) {
        html += `<div class="skills-category">
            <h4>⭐ Persönliche Fähigkeiten</h4>
            <div class="skills-list abilities">
                ${skills.abilities.map(a => `<span class="skill-tag">${escapeHtml(a)}</span>`).join('')}
            </div>
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    console.log("🛠️ Skills geladen");
}

// ==================== INDEX-SEITE (index.html) - FIXED ====================

function renderIndexPage() {
    const content = siteData.pageContent?.index;
    if (!content) {
        console.warn("⚠️ Keine Index-Inhalte in pageContent.json gefunden");
        return;
    }
    
    console.log("📝 Lade Index-Inhalte:", content);
    
    // Welcome Section
    if (content.welcome) {
        setText('#welcome-title', content.welcome.title);
        setText('#welcome-text', content.welcome.text);
        console.log("✅ Welcome-Bereich geladen");
    }
    
    // +++ FIX: About Sections - ALLE Abschnitte werden jetzt geladen +++
    if (content.aboutSections && content.aboutSections.length > 0) {
        const container = document.querySelector('.about-section');
        if (container) {
            let html = '';
            content.aboutSections.forEach((section, index) => {
                const reverseClass = section.reverse ? 'reverse' : '';
                const imagePath = section.image ? `assets/images/${section.image}` : '';
                html += `
                <div class="about-item ${reverseClass}">
                    <div class="about-image">
                        ${imagePath ? `<img src="${imagePath}" alt="${escapeHtml(section.imageAlt || 'Bild')}">` : ''}
                    </div>
                    <div class="about-text">
                        <h2>${escapeHtml(section.title)}</h2>
                        <p>${escapeHtml(section.text)}</p>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
            console.log(`✅ ${content.aboutSections.length} About-Abschnitte geladen`);
        } else {
            console.warn("⚠️ Container .about-section nicht gefunden");
        }
    } else {
        console.warn("⚠️ Keine aboutSections in pageContent.json gefunden");
    }
    
    // Gallery
    if (content.gallery) {
        const galleryTitle = document.querySelector('.gallery h2');
        if (galleryTitle) galleryTitle.textContent = content.gallery.title;
        
        const images = document.querySelectorAll('.gallery-item img');
        if (images.length && content.gallery.images) {
            images.forEach((img, i) => {
                if (content.gallery.images[i] && content.gallery.images[i] !== '') {
                    img.src = `assets/images/${content.gallery.images[i]}`;
                }
            });
            console.log(`✅ ${content.gallery.images.filter(img => img).length} Galerie-Bilder geladen`);
        }
    }
}

// ==================== ZERTIFIKATE-SEITE (certificate.html) ====================

function renderCertificates() {
    const container = document.getElementById('certificates-container');
    const data = siteData.certificates;
    if (!container) return;
    if (!data?.items || data.items.length === 0) {
        container.innerHTML = '<p>Keine Zertifikate vorhanden</p>';
        return;
    }
    
    const titleEl = document.getElementById('certificates-title');
    if (titleEl && data.title) titleEl.textContent = data.title;
    
    let html = '<div class="documents-grid">';
    data.items.forEach(cert => {
        html += `
        <div class="document-card">
            <div class="document-icon">📜</div>
            <div class="document-info">
                <h4>${escapeHtml(cert.name)}</h4>
                <p>${escapeHtml(cert.issuer)} • ${escapeHtml(cert.date)}</p>
                ${cert.file ? `<button onclick="openModal('${cert.file}')" class="btn">Ansehen</button>` : ''}
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    console.log(`📜 ${data.items.length} Zertifikate geladen`);
}

// ==================== PROJEKTE-SEITE (project.html) ====================

function renderProjects() {
    const container = document.getElementById('projects-container');
    const data = siteData.projects;
    if (!container) return;
    if (!data?.items || data.items.length === 0) {
        container.innerHTML = '<p>Keine Projekte vorhanden</p>';
        return;
    }
    
    const titleEl = document.getElementById('projects-title');
    if (titleEl && data.title) titleEl.textContent = data.title;
    
    let html = '<div class="projects-grid">';
    data.items.forEach(project => {
        html += `
        <div class="project-card">
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.description)}</p>
            ${project.link ? `<a href="${project.link}" target="_blank" class="btn">Mehr erfahren</a>` : ''}
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    console.log(`📁 ${data.items.length} Projekte geladen`);
}

// ==================== RECHTLICHE SEITEN ====================

function renderImpressum() {
    const info = siteData.resume?.personalInfo;
    if (!info) return;
    
    setText('.json-name', info.name);
    setText('.json-address-street', info.address?.street);
    setText('.json-address-city', info.address?.city);
    setText('.json-country', info.address?.country);
    setText('.json-phone', info.phone);
    setText('.json-email', info.email);
    console.log("📜 Impressum geladen");
}

function renderDatenschutz() {
    const info = siteData.resume?.personalInfo;
    if (!info) return;
    setText('#ds-email', info.email);
    console.log("🔒 Datenschutz geladen");
}

// ==================== ABOUT-SEITE ====================

function renderAboutPage() {
    const content = siteData.pageContent?.about;
    if (!content) {
        console.warn("⚠️ Keine About-Inhalte in pageContent.json gefunden");
        return;
    }
    
    setText('#about-title', content.title);
    setText('#about-content', content.content);
    console.log("📖 About-Seite geladen");
}

// ==================== KONTAKT-SEITE ====================

function renderContactPage() {
    const content = siteData.pageContent?.contact;
    if (!content) {
        console.warn("⚠️ Keine Contact-Inhalte in pageContent.json gefunden");
        return;
    }
    
    setText('#contact-title', content.title);
    setText('#contact-text', content.text);
    console.log("✉️ Kontakt-Seite geladen");
}

// ==================== HAUPT-FUNKTION ====================

async function init() {
    console.log("🔧 CV Loader initialisiert...");
    
    const success = await loadAllJSON();
    if (!success) {
        showError("Daten konnten nicht geladen werden");
        return;
    }
    
    const page = getCurrentPage();
    console.log(`📄 Seite: ${page}`);
    
    // Basis-Funktionen (alle Seiten)
    renderContactInfo();
    renderInterests();
    
    // Seitenspezifische Funktionen
    switch(page) {
        case 'index':
            renderIndexPage();
            break;
        case 'cv':
            renderWorkExperience();
            renderEducation();
            renderSkills();
            break;
        case 'certificate':
            renderCertificates();
            break;
        case 'project':
            renderProjects();
            break;
        case 'about':
            renderAboutPage();
            break;
        case 'contact':
            renderContactPage();
            break;
        case 'legalnotice':
        case 'impressum':
            renderImpressum();
            break;
        case 'privacypolicy':
        case 'datenschutz':
            renderDatenschutz();
            break;
        default:
            console.log(`ℹ️ Keine spezifische Logik für Seite: ${page}`);
    }
    
    console.log("✅ Alle Daten geladen und gerendert");
}

// ==================== HILFSFUNKTIONEN ====================

function setText(selector, text) {
    if (!text) return;
    document.querySelectorAll(selector).forEach(el => {
        if (el) el.textContent = text;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showError(message) {
    const containers = ['json-work-experience', 'json-education', 'json-skills', 'json-interests'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<div class="json-error">⚠️ ${message}</div>`;
    });
}

// Globale Debug-Funktionen
window.reloadCVData = () => {
    console.log("🔄 Reload gestartet...");
    init();
};
window.testJSON = () => {
    console.log("📊 Aktuelle siteData:", siteData);
    alert(`JSON-Status:\nResume: ${siteData.resume ? '✅' : '❌'}\nPageContent: ${siteData.pageContent ? '✅' : '❌'}\nCertificates: ${siteData.certificates ? '✅' : '❌'}\nProjects: ${siteData.projects ? '✅' : '❌'}`);
};

// ==================== START ====================

document.addEventListener('DOMContentLoaded', init);