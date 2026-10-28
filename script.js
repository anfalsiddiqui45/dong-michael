/* ==========================================================================
   script.js  -  Reads live content from Supabase (with local fallback)
   and renders Professor Dr. Yun-Hao Dong's Academic Website.
   ========================================================================== */

/* ---------- DOM & Helper functions ---------- */

function byId(id) {
    return document.getElementById(id);
}

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function isSafeLink(url) {
    return typeof url === "string" && /^(https?:|mailto:)/i.test(url.trim());
}

function makeLink(url, text, className) {
    if (!isSafeLink(url)) return null;
    const link = makeElement("a", className, text);
    link.href = url.trim();
    if (!/^mailto:/i.test(url)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
    return link;
}

function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
}

function showSection(sectionId) {
    const section = byId(sectionId);
    if (section) section.hidden = false;
    const navLink = document.querySelector('#site-nav a[href="#' + sectionId + '"]');
    if (navLink) navLink.hidden = false;
}

function hideSection(sectionId) {
    const section = byId(sectionId);
    if (section) section.hidden = true;
    const navLink = document.querySelector('#site-nav a[href="#' + sectionId + '"]');
    if (navLink) navLink.hidden = true;
}

/* ---------- DATA FETCHING (Supabase is the single source of truth) ---------- */

// The homepage must load the live DB content and not the local static data file.
async function loadPublicData() {
    if (window.SUPABASE_CONFIG_READY && window.supabase) {
        const { data, error } = await window.supabase
            .from("site_content")
            .select("page_data")
            .eq("id", "main")
            .maybeSingle();

        if (error) {
            console.warn("Supabase fetch error:", error);
            return {};
        }

        if (data && data.page_data) {
            return data.page_data;
        }
    }

    return {};
}

let lastSnapshot = "";

// Re-render only when the content actually changed (keeps publication filters intact)
async function refreshContent() {
    try {
        const data = await loadPublicData();
        const snapshot = JSON.stringify(data);
        if (snapshot === lastSnapshot) return;
        lastSnapshot = snapshot;
        renderAll(data);
    } catch (err) {
        console.warn("Content refresh failed:", err);
    }
}


/* ---------- HOME ---------- */
function renderHome(data) {
    byId("hero-name").textContent = data.name || "Dr. Yun-Hao Dong";
    byId("hero-position").textContent = data.title || "Senior Lecturer";
    byId("nav-name").textContent = data.name || "Dr. Yun-Hao Dong";
    document.title = (data.name || "Dr. Yun-Hao Dong") + " – Academic Profile";

    const universityLine = [data.department, data.university].filter(hasText).join(", ");
    byId("hero-university").textContent = universityLine;

    byId("hero-description").textContent = data.shortDescription || "";

    const photo = byId("profile-image");
    photo.src = hasText(data.profileImage) ? data.profileImage : "images/placeholder.svg";
    photo.alt = "Photo of " + (data.name || "Professor");
    photo.onerror = function () {
        photo.onerror = null;
        photo.src = "images/placeholder.svg";
    };

    byId("footer-text").textContent =
        "© " + new Date().getFullYear() + " " + (data.name || "Dr. Yun-Hao Dong") + (hasText(data.university) ? " · " + data.university : "");
}


/* ---------- ABOUT & MEMBERSHIPS ---------- */
function renderAbout(data) {
    let paragraphs = [];
    if (Array.isArray(data.about)) paragraphs = data.about;
    else if (hasText(data.about)) paragraphs = [data.about];

    if (paragraphs.length === 0) {
        hideSection("about");
        return;
    }

    showSection("about");
    const box = byId("about-text");
    box.innerHTML = "";
    paragraphs.forEach(function (text) {
        if (hasText(text)) {
            box.appendChild(makeElement("p", "", text));
        }
    });

    const memberships = data.memberships || [];
    const block = byId("memberships-block");
    if (!block) return;

    if (memberships.length === 0) {
        block.hidden = true;
    } else {
        block.hidden = false;
        const list = byId("memberships-list");
        list.innerHTML = "";
        memberships.forEach(function (item) {
            const text = typeof item === "string" ? item : (item.title || item.name || "");
            if (hasText(text)) {
                list.appendChild(makeElement("li", "", text));
            }
        });
    }
}


/* ---------- ACADEMIC EXPERIENCE ---------- */
function renderExperience(data) {
    const experiences = data.academicExperience || [];
    const block = byId("experience-block");
    const container = byId("experience-list");

    if (!block || !container) return;

    if (!Array.isArray(experiences) || experiences.length === 0) {
        block.hidden = true;
        return;
    }

    block.hidden = false;
    container.innerHTML = "";
    experiences.forEach(function (exp) {
        const entry = makeElement("div", "entry");
        const dateStr = [exp.startYear, exp.endYear].filter(hasText).join("–") || exp.year || "";
        if (hasText(dateStr)) entry.appendChild(makeElement("p", "entry-date", dateStr));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", exp.title));
        if (hasText(exp.institution)) {
            const instEl = makeElement("p", "entry-institution", exp.institution);
            instEl.style.fontWeight = "600";
            body.appendChild(instEl);
        }
        if (hasText(exp.description)) body.appendChild(makeElement("p", "", exp.description));
        entry.appendChild(body);
        container.appendChild(entry);
    });
}


/* ---------- RESEARCH ---------- */
function renderResearch(data) {
    const interests = data.researchInterests || [];
    if (interests.length === 0) {
        hideSection("research");
        return;
    }

    showSection("research");
    const container = byId("research-list");
    container.innerHTML = "";
    interests.forEach(function (item) {
        const block = makeElement("div", "research-item");
        block.appendChild(makeElement("h3", "", item.title));
        if (hasText(item.description)) {
            block.appendChild(makeElement("p", "", item.description));
        }
        container.appendChild(block);
    });
}


/* ---------- PUBLICATIONS ---------- */
function renderPublications(data) {
    const publications = data.publications || [];
    if (publications.length === 0) {
        hideSection("publications");
        return;
    }

    showSection("publications");

    // Sort newest year first
    const sorted = publications.slice().sort(function (a, b) {
        return Number(String(b.year).match(/\d{4}/)?.[0] || 0) - Number(String(a.year).match(/\d{4}/)?.[0] || 0);
    });

    const listBox = byId("publication-list");
    const filterBox = byId("publication-filters");
    if (listBox) listBox.innerHTML = "";
    if (filterBox) filterBox.innerHTML = "";

    function showPublications(selectedYear) {
        listBox.innerHTML = "";
        let lastYear = null;

        sorted.forEach(function (paper) {
            if (selectedYear !== "all" && String(paper.year) !== selectedYear) return;

            if (String(paper.year) !== lastYear) {
                listBox.appendChild(makeElement("h3", "year-heading", String(paper.year)));
                lastYear = String(paper.year);
            }

            const entry = makeElement("article", "publication");
            entry.appendChild(makeElement("p", "publication-title", paper.title));
            entry.appendChild(makeElement("p", "publication-authors", paper.authors));
            entry.appendChild(makeElement("p", "publication-venue", paper.venue));

            if (hasText(paper.description)) {
                entry.appendChild(makeElement("p", "publication-abstract", paper.description));
            }

            const link = makeLink(paper.link, "View paper →", "text-link");
            if (link) entry.appendChild(link);

            listBox.appendChild(entry);
        });
    }

    const years = [];
    sorted.forEach(function (paper) {
        const yr = String(paper.year || "").trim();
        if (yr && years.indexOf(yr) === -1) years.push(yr);
    });

    function addFilterButton(label, value) {
        const button = makeElement("button", "filter-button", label);
        button.type = "button";
        button.addEventListener("click", function () {
            filterBox.querySelectorAll(".filter-button").forEach(function (b) {
                b.classList.remove("active");
            });
            button.classList.add("active");
            showPublications(value);
        });
        filterBox.appendChild(button);
        return button;
    }

    const allButton = addFilterButton("All", "all");
    years.forEach(function (year) {
        addFilterButton(year, year);
    });
    allButton.classList.add("active");

    showPublications("all");

    const note = byId("full-list-note");
    if (note) {
        note.innerHTML = "";
        const fullLink = makeLink(data.publicationsFullListUrl, "See the complete publication list on the university website →", "text-link");
        if (fullLink) note.appendChild(fullLink);
    }
}


/* ---------- PROJECTS ---------- */
function renderProjects(data) {
    const projects = (data.projects || []).slice().sort(function (a, b) {
        const aYear = Number(String(a.year || '').match(/\d{4}/)?.[0] || 0);
        const bYear = Number(String(b.year || '').match(/\d{4}/)?.[0] || 0);
        return bYear - aYear;
    });

    if (projects.length === 0) {
        hideSection("projects");
        return;
    }

    showSection("projects");
    const container = byId("project-list");
    container.innerHTML = "";
    projects.forEach(function (project) {
        const entry = makeElement("div", "entry");
        if (hasText(project.year)) entry.appendChild(makeElement("p", "entry-date", project.year));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", project.title));
        if (hasText(project.role)) {
            const roleEl = makeElement("p", "entry-role", project.role);
            roleEl.style.fontWeight = "600";
            roleEl.style.color = "var(--navy)";
            body.appendChild(roleEl);
        }
        if (hasText(project.description)) body.appendChild(makeElement("p", "", project.description));
        const link = makeLink(project.link, "Project link →", "text-link");
        if (link) body.appendChild(link);

        entry.appendChild(body);
        container.appendChild(entry);
    });
}


/* ---------- EDUCATION & AWARDS ---------- */
function renderEducation(data) {
    const education = data.education || [];
    const awards = data.awards || [];

    if (education.length === 0 && awards.length === 0) {
        hideSection("education");
        return;
    }

    showSection("education");
    const eduContainer = byId("education-list");
    eduContainer.innerHTML = "";

    education.forEach(function (item) {
        const entry = makeElement("div", "entry");
        if (hasText(item.year)) entry.appendChild(makeElement("p", "entry-date", item.year));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", item.degree));
        if (hasText(item.institution)) body.appendChild(makeElement("p", "", item.institution));
        entry.appendChild(body);
        eduContainer.appendChild(entry);
    });

    const awardContainer = byId("award-list");
    const awardsBlock = byId("awards-block");

    if (awards.length === 0) {
        if (awardsBlock) awardsBlock.hidden = true;
    } else {
        if (awardsBlock) awardsBlock.hidden = false;
        if (awardContainer) {
            awardContainer.innerHTML = "";
            awards.forEach(function (award) {
                const entry = makeElement("div", "entry");
                if (hasText(award.year)) entry.appendChild(makeElement("p", "entry-date", award.year));

                const body = makeElement("div", "entry-body");
                body.appendChild(makeElement("h3", "", award.title));
                const text = hasText(award.details) ? award.details : (hasText(award.description) ? award.description : (hasText(award.organization) ? award.organization : ""));
                if (hasText(text)) body.appendChild(makeElement("p", "", text));
                entry.appendChild(body);
                awardContainer.appendChild(entry);
            });
        }
    }

    if (education.length === 0) eduContainer.hidden = true;
    else eduContainer.hidden = false;
}


/* ---------- NEWS ---------- */
function renderNews(data) {
    const news = (data.news || []).slice().sort(function (a, b) {
        const aYear = Number(String(a.date || '').match(/\d{4}/)?.[0] || 0);
        const bYear = Number(String(b.date || '').match(/\d{4}/)?.[0] || 0);
        return bYear - aYear;
    });

    if (news.length === 0) {
        hideSection("news");
        return;
    }

    showSection("news");
    const container = byId("news-list");
    container.innerHTML = "";
    news.forEach(function (item) {
        const entry = makeElement("div", "entry");
        if (hasText(item.date)) entry.appendChild(makeElement("p", "entry-date", item.date));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", item.title));
        if (hasText(item.description)) body.appendChild(makeElement("p", "", item.description));
        const link = makeLink(item.link, "Read more →", "text-link");
        if (link) body.appendChild(link);

        entry.appendChild(body);
        container.appendChild(entry);
    });
}


/* ---------- CONTACT ---------- */
function renderContact(data) {
    const contact = data.contact || {};
    const container = byId("contact-list");
    if (!container) return;

    container.innerHTML = "";

    const rows = [
        ["Email", contact.email, "email"],
        ["University", contact.university, "text"],
        ["Office", contact.office, "text"],
        ["Google Scholar", contact.googleScholar, "link", "Google Scholar profile"],
        ["ORCID", contact.orcid, "link", contact.orcid],
        ["LinkedIn", contact.linkedin, "link", "LinkedIn profile"],
        ["Scopus", contact.scopus, "link", "Scopus author profile"],
        ["ResearchGate", contact.researchGate, "link", "ResearchGate profile"],
        ["University Profile", contact.universityProfile, "link", "HKMU Scholars profile"]
    ];

    let shown = 0;
    rows.forEach(function (row) {
        const label = row[0], value = row[1], kind = row[2], linkText = row[3];
        if (!hasText(value)) return;

        container.appendChild(makeElement("dt", "", label));
        const valueBox = makeElement("dd");

        if (kind === "email") {
            const mail = makeLink("mailto:" + value.trim(), value.trim());
            valueBox.appendChild(mail || document.createTextNode(value));
        } else if (kind === "link") {
            const link = makeLink(value, linkText);
            valueBox.appendChild(link || document.createTextNode(value));
        } else {
            valueBox.textContent = value;
        }
        container.appendChild(valueBox);
        shown++;
    });

    if (shown === 0) hideSection("contact");
    else showSection("contact");
}


/* ---------- CUSTOM SECTIONS ---------- */
function renderCustomSections(data) {
    const customSections = Array.isArray(data.customSections) ? data.customSections : [];
    const container = byId("custom-sections");

    if (!container) return;
    container.innerHTML = "";

    if (customSections.length === 0) return;

    customSections.forEach(function (section) {
        const block = makeElement("div", "custom-section");
        if (hasText(section.title)) block.appendChild(makeElement("h3", "", section.title));
        if (hasText(section.content)) block.appendChild(makeElement("p", "", section.content));
        if (hasText(section.link)) {
            const label = hasText(section.linkText) ? section.linkText : "Read more →";
            const link = makeLink(section.link, label, "text-link");
            if (link) block.appendChild(link);
        }
        container.appendChild(block);
    });
}


/* ---------- RENDER ALL SECTIONS ---------- */
function renderAll(data) {
    renderHome(data);
    renderAbout(data);
    renderExperience(data);
    renderResearch(data);
    renderPublications(data);
    renderProjects(data);
    renderEducation(data);
    renderNews(data);
    renderContact(data);
    renderCustomSections(data);
}

/* ---------- MOBILE MENU BUTTON ---------- */
function setupMenuButton() {
    const button = byId("menu-button");
    const nav = byId("site-nav");
    if (!button || !nav) return;

    button.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });
    });
}

/* ---------- START WEBSITE ---------- */
function initPublicPage() {
    setupMenuButton();

    // Load the live database content immediately; do not render static data from data.js.
    refreshContent();

    // Live updates: instant via Supabase Realtime, plus safety nets
    if (window.SUPABASE_CONFIG_READY && window.supabase) {
        window.supabase
            .channel("site-content-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, refreshContent)
            .subscribe();
    }

    document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshContent(); });
    window.setInterval(refreshContent, 15000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPublicPage);
} else {
    initPublicPage();
}