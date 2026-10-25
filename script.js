/* ==========================================================================
   script.js  -  reads everything from data.js and builds the page.
   You normally do NOT need to edit this file.
   ========================================================================== */

/* ---------- Small helper functions ---------- */

// Find an element by its id
function byId(id) {
    return document.getElementById(id);
}

// Create an element with a CSS class and optional text.
// We always use textContent (not innerHTML) so special characters are safe.
function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

// Only allow normal web links (https, http, mailto). Anything else is ignored.
function isSafeLink(url) {
    return typeof url === "string" && /^(https?:|mailto:)/i.test(url.trim());
}

// Create a link element. Returns null if the link is empty or unsafe.
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

// Check if a value actually contains text
function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
}

// Hide a whole section AND its menu link when it has nothing to show
function hideSection(sectionId) {
    const section = byId(sectionId);
    if (section) section.hidden = true;
    const navLink = document.querySelector('#site-nav a[href="#' + sectionId + '"]');
    if (navLink) navLink.hidden = true;
}


/* ---------- HOME ---------- */
function renderHome(data) {
    byId("hero-name").textContent = data.name;
    byId("hero-position").textContent = data.title;
    byId("nav-name").textContent = data.name;
    document.title = data.name + " – Academic Profile";

    // University (and department, if given)
    const universityLine = [data.department, data.university].filter(hasText).join(", ");
    byId("hero-university").textContent = universityLine;

    byId("hero-description").textContent = data.shortDescription;

    // Profile photo. If images/profile.jpg is missing, show the grey placeholder.
    const photo = byId("profile-image");
    photo.src = hasText(data.profileImage) ? data.profileImage : "images/placeholder.svg";
    photo.alt = "Photo of " + data.name;
    photo.onerror = function () {
        photo.onerror = null; // avoid an endless loop
        photo.src = "images/placeholder.svg";
    };

    byId("footer-text").textContent =
        "© " + new Date().getFullYear() + " " + data.name + (hasText(data.university) ? " · " + data.university : "");
}


/* ---------- ABOUT ---------- */
function renderAbout(data) {
    // "about" can be one text or a list of paragraphs
    let paragraphs = [];
    if (Array.isArray(data.about)) paragraphs = data.about;
    else if (hasText(data.about)) paragraphs = [data.about];

    if (paragraphs.length === 0) {
        hideSection("about");
        return;
    }

    const box = byId("about-text");
    paragraphs.forEach(function (text) {
        box.appendChild(makeElement("p", "", text));
    });

    // Memberships (optional)
    const memberships = data.memberships || [];
    if (memberships.length === 0) {
        byId("memberships-block").hidden = true;
    } else {
        const list = byId("memberships-list");
        memberships.forEach(function (item) {
            list.appendChild(makeElement("li", "", item));
        });
    }
}


/* ---------- RESEARCH ---------- */
function renderResearch(data) {
    const interests = data.researchInterests || [];
    if (interests.length === 0) {
        hideSection("research");
        return;
    }

    const container = byId("research-list");
    interests.forEach(function (item) {
        const block = makeElement("div", "research-item");
        block.appendChild(makeElement("h3", "", item.title));
        if (hasText(item.description)) {
            block.appendChild(makeElement("p", "", item.description));
        }
        container.appendChild(block);
    });
}


/* ---------- PUBLICATIONS (with a simple year filter) ---------- */
function renderPublications(data) {
    const publications = data.publications || [];
    if (publications.length === 0) {
        hideSection("publications");
        return;
    }

    // Sort newest year first. (Items in the same year keep the order from data.js)
    const sorted = publications.slice().sort(function (a, b) {
        return Number(b.year) - Number(a.year);
    });

    const listBox = byId("publication-list");
    const filterBox = byId("publication-filters");

    // Draw the publications for one year, or all of them
    function showPublications(selectedYear) {
        listBox.innerHTML = "";
        let lastYear = null;

        sorted.forEach(function (paper) {
            if (selectedYear !== "all" && String(paper.year) !== selectedYear) return;

            // Year heading (only when the year changes)
            if (String(paper.year) !== lastYear) {
                listBox.appendChild(makeElement("h3", "year-heading", String(paper.year)));
                lastYear = String(paper.year);
            }

            const entry = makeElement("article", "publication");
            entry.appendChild(makeElement("p", "publication-title", paper.title));
            entry.appendChild(makeElement("p", "publication-authors", paper.authors));
            entry.appendChild(makeElement("p", "publication-venue", paper.venue));

            const link = makeLink(paper.link, "View paper →", "text-link");
            if (link) entry.appendChild(link);

            listBox.appendChild(entry);
        });
    }

    // Build the filter buttons: "All" + one button for each year
    const years = [];
    sorted.forEach(function (paper) {
        if (years.indexOf(String(paper.year)) === -1) years.push(String(paper.year));
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

    // Link to the complete official list (optional)
    const note = byId("full-list-note");
    const fullLink = makeLink(data.publicationsFullListUrl, "See the complete publication list on the university website →", "text-link");
    if (fullLink) note.appendChild(fullLink);
}


/* ---------- PROJECTS ---------- */
function renderProjects(data) {
    const projects = data.projects || [];
    if (projects.length === 0) {
        hideSection("projects");
        return;
    }

    const container = byId("project-list");
    projects.forEach(function (project) {
        const entry = makeElement("div", "entry");
        if (hasText(project.year)) entry.appendChild(makeElement("p", "entry-date", project.year));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", project.title));
        if (hasText(project.description)) body.appendChild(makeElement("p", "", project.description));
        const link = makeLink(project.link, "Project link →", "text-link");
        if (link) body.appendChild(link);

        entry.appendChild(body);
        container.appendChild(entry);
    });
}


/* ---------- EDUCATION (and awards) ---------- */
function renderEducation(data) {
    const education = data.education || [];
    const awards = data.awards || [];

    if (education.length === 0 && awards.length === 0) {
        hideSection("education");
        return;
    }

    const eduContainer = byId("education-list");
    education.forEach(function (item) {
        const entry = makeElement("div", "entry");
        if (hasText(item.year)) entry.appendChild(makeElement("p", "entry-date", item.year));

        const body = makeElement("div", "entry-body");
        body.appendChild(makeElement("h3", "", item.degree));
        if (hasText(item.institution)) body.appendChild(makeElement("p", "", item.institution));
        entry.appendChild(body);
        eduContainer.appendChild(entry);
    });

    // Awards (optional)
    if (awards.length === 0) {
        byId("awards-block").hidden = true;
    } else {
        const awardContainer = byId("award-list");
        awards.forEach(function (award) {
            const entry = makeElement("div", "entry");
            if (hasText(award.year)) entry.appendChild(makeElement("p", "entry-date", award.year));

            const body = makeElement("div", "entry-body");
            body.appendChild(makeElement("h3", "", award.title));
            if (hasText(award.details)) body.appendChild(makeElement("p", "", award.details));
            entry.appendChild(body);
            awardContainer.appendChild(entry);
        });
    }

    // If there is no education list, hide the empty top heading space
    if (education.length === 0) eduContainer.hidden = true;
}


/* ---------- NEWS ---------- */
function renderNews(data) {
    const news = data.news || [];
    if (news.length === 0) {
        hideSection("news");
        return;
    }

    const container = byId("news-list");
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

    // Each row: [label, value, is it a link?, link text]
    const rows = [
        ["Email", contact.email, "email"],
        ["University", contact.university, "text"],
        ["Office", contact.office, "text"],
        ["Google Scholar", contact.googleScholar, "link", "Google Scholar profile"],
        ["ORCID", contact.orcid, "link", contact.orcid],
        ["ResearchGate", contact.researchGate, "link", "ResearchGate profile"],
        ["LinkedIn", contact.linkedin, "link", "LinkedIn profile"],
        ["Scopus", contact.scopus, "link", "Scopus author profile"],
        ["University profile", contact.universityProfile, "link", "Profile on the university website"]
    ];

    let shown = 0;
    rows.forEach(function (row) {
        const label = row[0], value = row[1], kind = row[2], linkText = row[3];
        if (!hasText(value)) return; // only show fields that have information

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
}


/* ---------- MOBILE MENU BUTTON ---------- */
function setupMenuButton() {
    const button = byId("menu-button");
    const nav = byId("site-nav");

    button.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after choosing a link (on phones)
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });
    });
}


/* ---------- START EVERYTHING ---------- */
(function startWebsite() {
    if (typeof professorData === "undefined") {
        document.body.insertAdjacentHTML(
            "afterbegin",
            "<p style='padding:1rem;color:#b00020'>Could not load data.js. Check the file for a missing comma or quote.</p>"
        );
        return;
    }

    renderHome(professorData);
    renderAbout(professorData);
    renderResearch(professorData);
    renderPublications(professorData);
    renderProjects(professorData);
    renderEducation(professorData);
    renderNews(professorData);
    renderContact(professorData);
    setupMenuButton();
})();
