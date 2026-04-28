// ============================================
// cv-loader.js - Data loading module
// Loads JSON files and fills page content
// NO UI functions (clock, modal, dark mode, skill bars)
// ============================================

// Global data container
let siteData = {
    resume: null,
    pageContent: null,
    certificates: null,
    projects: null,
    config: null
};

// ==================== JSON LOADER ====================

async function loadAllJSON() {
    console.log("Loading all JSON files...");
    
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
                    console.log(`Loaded: ${key}.json`);
                } else {
                    console.warn(`${key}.json not found`);
                    siteData[key] = null;
                }
            } catch (error) {
                console.warn(`${key}.json could not be loaded:`, error);
                siteData[key] = null;
            }
        });
        
        await Promise.all(promises);
        console.log("All JSON files processed");
        return true;
    } catch (error) {
        console.error("Error loading JSONs:", error);
        return false;
    }
}

// ==================== PAGE DETECTION ====================

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const pageName = filename.replace('.html', '');
    console.log(`Detected page: ${pageName}`);
    return pageName;
}

// ==================== RENDER FUNCTIONS ====================

function renderNavigation() {
    const config = siteData.config;
    if (!config?.navigation) return;
    
    const navContainer = document.getElementById('nav-links');
    if (!navContainer) return;
    
    const navItems = [
        { name: "Home", key: "home", icon: "🏠︎" },
        { name: "About", key: "about", icon: "𓂃🖊" },
        { name: "Lebenslauf", key: "cv", icon: "🇨🇻" },
        { name: "Zertifikate", key: "certificates", icon: "🗐" },
        { name: "Projekte", key: "projects", icon: "🗒" },
        { name: "Kontakt", key: "contact", icon: "✉" },
        { name: "Weiteres", key: "weiteres", icon: "»" }
    ];
    
    let html = '';
    navItems.forEach(item => {
        const path = config.navigation[item.key];
        if (path) {
            html += `<li><a href="${path}"> ${item.icon} ${item.name}</a></li>`;
        }
    });
    
    // FIXED: Removed dark mode toggle from here - now only in HTML static
    navContainer.innerHTML = html;
    console.log("Navigation rendered");
}

function renderSocialLinks() {
    const config = siteData.config;
    if (!config?.sidebar?.socialLinks) return;
    
    const container = document.getElementById('social-links');
    if (!container) return;
    
    let html = '';
    config.sidebar.socialLinks.forEach(link => {
        const icon = link.icon || (link.name === 'GitHub' ? '🐙' : '💼');
        html += `
            <a href="${link.url}" target="_blank" class="profile-link">
                <span class="profile-icon">${icon}</span>
                ${link.name}
            </a>
            <br>
        `;
    });
    
    container.innerHTML = html;
    console.log("Social links rendered");
}

function renderFooter() {
    const config = siteData.config;
    if (!config?.footer) return;
    
    const container = document.getElementById('footer-links');
    if (!container) return;
    
    const currentYear = new Date().getFullYear();
    
    let html = '';
    if (config.footer.impressum) html += `<a href="${config.footer.impressum}">Impressum</a> | `;
    if (config.footer.datenschutz) html += `<a href="${config.footer.datenschutz}">Datenschutz</a> | `;
    if (config.footer.contact) html += `<a href="${config.footer.contact}">Kontakt</a> | `;
    html += `© ${currentYear} Maximilian Fuksik. Alle Rechte vorbehalten.`;
    
    container.innerHTML = html;
    console.log("Footer rendered");
}

function renderSearchPlaceholder() {
    const config = siteData.config;
    const searchInput = document.getElementById('json-search');
    if (!searchInput) return;
    searchInput.placeholder = config?.sidebar?.searchPlaceholder || "Search...";
}

function renderContactInfo() {
    const info = siteData.resume?.personalInfo;
    if (!info) return;
    
    const container = document.getElementById('json-contact');
    if (!container) return;
    
    container.innerHTML = `
        <p>📧 Email: <span class="json-email">${escapeHtml(info.email)}</span></p>
        <p>📞 Tel: <span class="json-phone">${escapeHtml(info.phone)}</span></p>
        <p>📍 Adresse: <span class="json-address">${escapeHtml(info.address?.street || '')}, ${escapeHtml(info.address?.city || '')}</span></p>
        <p>🌎 Land: <span class="json-country">${escapeHtml(info.address?.country || '')}</span></p>
    `;
    console.log("Contact info loaded");
}

function renderInterests() {
    const interests = siteData.resume?.interests;
    const container = document.getElementById('json-interests');
    if (!container) return;
    
    if (!interests || interests.length === 0) {
        container.innerHTML = '<p>No interests listed</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="interests-list">
            ${interests.map(i => `<span class="interest-tag"> ${escapeHtml(i)}</span>`).join('')}
        </div>
    `;
    console.log(`${interests.length} interests loaded`);
}

function renderTimeline() {
    const resume = siteData.resume;
    if (!resume) return;
    
    const yearEvents = {};
    
    if (resume.workExperience) {
        resume.workExperience.forEach(job => {
            const years = extractYears(job.period);
            years.forEach(year => {
                if (!yearEvents[year]) yearEvents[year] = [];
                yearEvents[year].push({ type: 'work', desc: `${job.position} bei ${job.company}` });
            });
        });
    }
    
    if (resume.education) {
        resume.education.forEach(edu => {
            const years = extractYears(edu.period);
            years.forEach(year => {
                if (!yearEvents[year]) yearEvents[year] = [];
                yearEvents[year].push({ type: 'education', desc: edu.program });
            });
        });
    }
    
    const defaults = {
        '2016': 'Schulabschluss', '2017': 'Schulische Ausbildung', '2018': 'Fachabitur', '2019': 'Ausbildung beginnt',
        '2020': 'Fachabitur abgeschlossen', '2021': 'Berufseinstieg', '2022': 'Kundenberatung', '2023': 'Vertrieb & Beratung',
        '2024': 'Weiterbildung', '2025': 'Aktuell: Umschulung FI/AE'
    };
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const yearEl = item.querySelector('.timeline-year');
        if (!yearEl) return;
        const year = yearEl.textContent.trim();
        const tooltip = item.querySelector('.timeline-tooltip');
        
        if (yearEvents[year] && yearEvents[year].length > 0) {
            tooltip.innerHTML = yearEvents[year][0].desc;
            item.classList.add('has-data');
        } else {
            tooltip.innerHTML = defaults[year] || `Aktivitäten in ${year}`;
        }
    });
    console.log("Timeline rendered");
}

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
    console.log(`${experiences.length} work experiences loaded`);
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
    console.log(`${education.length} education items loaded`);
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
            <h4> Persönliche Fähigkeiten</h4>
            <div class="skills-list abilities">
                ${skills.abilities.map(a => `<span class="skill-tag">${escapeHtml(a)}</span>`).join('')}
            </div>
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    console.log("Skills loaded");
}

function renderIndexPage() {
    const content = siteData.pageContent?.index;
    if (!content) return;
    
    if (content.welcome) {
        setText('#welcome-title', content.welcome.title);
        setText('#welcome-text', content.welcome.text);
    }
    
    if (content.aboutSections?.length) {
        const container = document.querySelector('.about-section');
        if (container) {
            let html = '';
            content.aboutSections.forEach(section => {
                const reverseClass = section.reverse ? 'reverse' : '';
                const imagePath = section.image ? `assets/images/${section.image}` : '';
                html += `
                <div class="about-item ${reverseClass}">
                    <div class="about-image">
                        ${imagePath ? `<img src="${imagePath}" alt="${escapeHtml(section.imageAlt || 'Image')}">` : ''}
                    </div>
                    <div class="about-text">
                        <h2>${escapeHtml(section.title)}</h2>
                        <p>${escapeHtml(section.text)}</p>
                    </div>
                </div>`;
            });
            container.innerHTML = html;
        }
    }
    
    if (content.gallery) {
        const galleryTitle = document.querySelector('.gallery h2');
        if (galleryTitle) galleryTitle.textContent = content.gallery.title;
        
        const images = document.querySelectorAll('.gallery-item img');
        if (images.length && content.gallery.images) {
            images.forEach((img, i) => {
                if (content.gallery.images[i]) {
                    img.src = `assets/images/${content.gallery.images[i]}`;
                }
            });
        }
    }
    console.log("Index page rendered");
}

function renderAboutPage() {
    const content = siteData.pageContent?.about;
    if (!content) return;
    
    const titleEl = document.getElementById('about-title-1');
    if (titleEl) titleEl.textContent = content.title;
    
    const textEl = document.getElementById('about-text-1');
    if (textEl && content.text) {
        const formattedText = content.text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
        textEl.innerHTML = `<p>${formattedText}</p>`;
    }
    
    const img1 = document.getElementById('about-image-1');
    if (img1 && content.image1) {
        img1.src = `assets/images/${content.image1}`;
    }
    
    const img2 = document.getElementById('about-image-2');
    if (img2) {
        if (content.image2) {
            img2.src = `assets/images/${content.image2}`;
            img2.style.display = 'block';
        } else {
            img2.style.display = 'none';
        }
    }
    console.log("About page rendered");
}

function renderCertificates() {
    const container = document.getElementById('certificates-container');
    const data = siteData.certificates;
    if (!container || !data?.items) return;
    
    let html = '<div class="documents-grid">';
    data.items.forEach(cert => {
        html += `
        <div class="document-card">
            <div class="document-icon">📜</div>
            <div class="document-info">
                <h4>${escapeHtml(cert.name)}</h4>
                <p>${escapeHtml(cert.issuer)} • ${escapeHtml(cert.date)}</p>
                ${cert.file ? `<button class="btn view-certificate" data-file="${escapeHtml(cert.file)}">Ansehen</button>` : ''}
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    console.log(`${data.items.length} certificates loaded`);
    
    // Add event listeners for certificate buttons (to avoid inline onclick)
    document.querySelectorAll('.view-certificate').forEach(btn => {
        btn.addEventListener('click', function() {
            const file = this.getAttribute('data-file');
            if (typeof openModal === 'function') {
                openModal(file);
            } else {
                console.warn('openModal function not available yet');
            }
        });
    });
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    const data = siteData.projects;
    if (!container || !data?.items) return;
    
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
    console.log(`${data.items.length} projects loaded`);
}

// ==================== HELPER FUNCTIONS ====================

function extractYears(period) {
    const years = [];
    const matches = period.match(/\b(20\d{2})\b/g);
    if (matches) matches.forEach(m => years.push(m));
    return years;
}

function setText(selector, text) {
    if (!text) return;
    document.querySelectorAll(selector).forEach(el => {
        if (el) el.textContent = text;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function showError(message) {
    const containers = ['json-work-experience', 'json-education', 'json-skills', 'json-interests'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<div class="json-error">⚠️ ${message}</div>`;
    });
}

// ==================== MAIN INIT ====================

async function init() {
    console.log("CV Loader initializing...");
    
    const success = await loadAllJSON();
    if (!success) {
        showError("Data could not be loaded");
        return;
    }
    
    const page = getCurrentPage();
    
    // Global functions (all pages)
    renderNavigation();
    renderSocialLinks();
    renderFooter();
    renderSearchPlaceholder();
    renderContactInfo();
    renderInterests();
    
    // Page specific functions
    switch(page) {
        case 'index':
            renderIndexPage();
            break;
        case 'cv':
            renderTimeline();
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
        default:
            console.log(`No specific logic for page: ${page}`);
    }
    
    console.log("All data loaded and rendered");
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Debug functions
window.reloadCVData = () => init();
window.testJSON = () => {
    alert(`JSON Status:\nResume: ${siteData.resume ? 'OK' : 'Missing'}\nPageContent: ${siteData.pageContent ? 'OK' : 'Missing'}\nConfig: ${siteData.config ? 'OK' : 'Missing'}`);
};