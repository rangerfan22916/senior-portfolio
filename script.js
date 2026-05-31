const channels = document.querySelectorAll(".channel");
const timeDisplay = document.querySelector(".time");
const dateDisplay = document.querySelector(".date");
const muteBtn = document.getElementById("muteBtn");
const musicFrame = document.getElementById("musicFrame");

const aboutPage = document.getElementById("aboutPage");
const projectsPage = document.getElementById("projectsPage");
const pageViewer = document.getElementById("pageViewer");
const pageViewerTitle = document.getElementById("pageViewerTitle");
const pageViewerContent = document.getElementById("pageViewerContent");
const aboutContentContainer = document.getElementById("aboutContentContainer");
const projectTabs = document.getElementById("projectTabs");
const projectsGrid = document.getElementById("projectsGrid");
const aboutTextPage = document.getElementById("aboutTextPage");
const contactPage = document.getElementById("contactPage");
const skillsPage = document.getElementById("skillsPage");
const resumePage = document.getElementById("resumePage");
const futurePage = document.getElementById("futurePage");
const settingsPage = document.getElementById("settingsPage");

let projectData = null;

/* =========================
   CLOCK
========================= */
function updateTime() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  timeDisplay.innerHTML = `${hours}:${minutes} <span class="ampm">${ampm}</span>`;
  dateDisplay.textContent = `${days[now.getDay()]} ${now.getMonth() + 1}/${now.getDate()}`;
}
setInterval(updateTime, 1000);
updateTime();

/* =========================
   CHANNEL CLICK
========================= */
channels.forEach((c) => {
  c.addEventListener("click", () => {
    if (c.classList.contains("empty")) return;
    channels.forEach((x) => x.classList.remove("selected"));
    c.classList.add("selected");
    const pageName = c.dataset.page;
    if (pageName) openPage(pageName);
  });
});

/* =========================
   LOADING SCREEN
========================= */
const loadingScreenDelay = 4500;
const loadingScreenFadeDuration = 1500;
const musicStartDelay = loadingScreenDelay + loadingScreenFadeDuration;

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (!loadingScreen || loadingScreen.classList.contains("fade-out")) return;
  loadingScreen.classList.add("fade-out");
  setTimeout(() => { loadingScreen.style.display = "none"; }, loadingScreenFadeDuration);
}

function scheduleHideLoadingScreen() {
  setTimeout(hideLoadingScreen, loadingScreenDelay);
  setTimeout(startMusic, musicStartDelay);
}

if (document.readyState === "complete") {
  scheduleHideLoadingScreen();
} else {
  window.addEventListener("load", scheduleHideLoadingScreen);
}

/* =========================
   MUSIC
========================= */
let musicMuted = false;
const musicBaseUrl = "https://www.youtube.com/embed/I8Mc-oOZfEk?rel=0&modestbranding=1&controls=0&loop=1&playlist=I8Mc-oOZfEk";
const musicMutedUrl = `${musicBaseUrl}&autoplay=1&mute=1`;
const musicUnmutedUrl = `${musicBaseUrl}&autoplay=1&mute=0`;

function startMusic() {
  if (!musicFrame) return;
  musicFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  musicFrame.src = musicMuted ? musicMutedUrl : musicUnmutedUrl;
}

muteBtn.textContent = "🔊";
muteBtn.addEventListener("click", () => {
  musicMuted = !musicMuted;
  if (!musicFrame) return;
  musicFrame.src = musicMuted ? musicMutedUrl : musicUnmutedUrl;
  muteBtn.textContent = musicMuted ? "🔇" : "🔊";
});

/* =========================
   SETTINGS MUTE BUTTON
========================= */
const settingsMuteBtn = document.getElementById("settingsMuteBtn");
if (settingsMuteBtn) {
  settingsMuteBtn.addEventListener("click", () => {
    musicMuted = !musicMuted;
    if (!musicFrame) return;
    musicFrame.src = musicMuted ? musicMutedUrl : musicUnmutedUrl;
    muteBtn.textContent = musicMuted ? "🔇" : "🔊";
    settingsMuteBtn.textContent = musicMuted ? "Unmute" : "Mute";
  });
}

/* =========================
   PAGE DATA
========================= */
const pageDataFiles = {
  about: "data/about.json",
  projects: "data/projects.json",
  contact: "data/contact.json",
  skills: "data/skills.json",
  resume: "data/resume.json",
  settings: "data/settings.json",
  future: "data/future.json",
};

function loadPageData(pageKey) {
  const path = pageDataFiles[pageKey];
  if (!path) return Promise.reject("No page");
  return fetch(path).then((r) => r.json());
}

/* =========================
   PAGE ROUTER
========================= */
function openPage(pageKey) {
  closeSubPage();
  if (pageKey === "about")    openAboutPage();
  else if (pageKey === "projects") openProjectsPage();
  else if (pageKey === "contact")  openDirectPage(contactPage);
  else if (pageKey === "skills")   openDirectPage(skillsPage);
  else if (pageKey === "resume")   openDirectPage(resumePage);
  else if (pageKey === "future")   openDirectPage(futurePage);
  else if (pageKey === "settings") openDirectPage(settingsPage);
  else openGenericPage(pageKey);
}

/* open a fully pre-built page */
function openDirectPage(el) {
  if (!el) return;
  el.style.display = "flex";
  setTimeout(() => {
    el.classList.add("active");
    // animate skill bars if this is the skills page
    if (el.id === "skillsPage") {
      el.querySelectorAll(".skill-bar").forEach(bar => {
        const target = bar.style.width;
        bar.style.width = "0%";
        setTimeout(() => { bar.style.width = target; }, 80);
      });
    }
  }, 10);
}

/* =========================
   ABOUT PAGE
========================= */
function openAboutPage() {
  loadPageData("about").then((data) => {
    aboutContentContainer.innerHTML = `
      <div class="about-image-panel">
        <img id="aboutMainImage" class="about-mii" src="${data.image}">
        <button id="humanifyBtn" class="humanify-btn">HUMANIFY</button>
      </div>
      <div class="about-text-panel">
        <h1>${data.title}</h1>
        ${data.description.map((p) => `<p>${p}</p>`).join("")}
      </div>
    `;

    const img = document.getElementById("aboutMainImage");
    const btn = document.getElementById("humanifyBtn");
    let human = false;

    btn.addEventListener("click", () => {
      human = !human;
      img.style.transition = "0.35s ease";
      img.style.opacity = "0";
      img.style.transform = "scale(1.05)";
      setTimeout(() => {
        img.src = human ? "imgs/me.jpg" : data.image;
        img.onload = () => {
          img.style.opacity = "1";
          img.style.transform = "scale(1)";
        };
      }, 350);
      btn.textContent = human ? "MIIIFY" : "HUMANIFY";
    });

    aboutPage.style.display = "flex";
    setTimeout(() => aboutPage.classList.add("active"), 10);
  });
}

/* =========================
   PROJECTS PAGE
========================= */
function openProjectsPage() {
  loadPageData("projects").then((data) => {
    projectData = data;
    renderProjects(data);
    projectsPage.style.display = "flex";
    setTimeout(() => projectsPage.classList.add("active"), 10);
  });
}

function renderProjects(data) {
  const tabs = [{ id: "all", label: "All" }].concat(
    data.years.map((y) => ({ id: y.id, label: y.label }))
  );

  projectTabs.innerHTML = tabs.map((t) => `
    <button class="project-tab ${t.id === data.default ? "active" : ""}" data-year="${t.id}">
      ${t.label}
    </button>
  `).join("");

  projectTabs.querySelectorAll(".project-tab").forEach((btn) => {
    btn.addEventListener("click", () => showYear(btn.dataset.year, btn));
  });

  showYear(data.default || "all");
}

function showYear(year, btn) {
  projectTabs.querySelectorAll(".project-tab").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  let projects = [];
  if (year === "all") {
    projects = projectData.years.flatMap((y) =>
      y.projects.map((p) => ({ ...p, year: y.label }))
    );
  } else {
    const y = projectData.years.find((x) => x.id === year);
    if (y) projects = y.projects.map((p) => ({ ...p, year: y.label }));
  }

  projectsGrid.innerHTML = renderCards(projects);

  projectsGrid.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => {
      const link = card.dataset.link;
      const title = card.dataset.title;
      if (link && link !== "#") openInlineViewer(title, link);
    });
  });
}

function renderCards(projects) {
  return projects.map((p) => `
    <div class="project-card"
         data-link="${p.link || ""}"
         data-title="${p.title || ""}">
      <div class="project-card-title">${p.title}</div>
      ${p.description ? `<div class="project-card-copy">${p.description}</div>` : ""}
      <div class="project-card-footer">
        ${p.year ? `<div class="project-card-year">${p.year}</div>` : ""}
        ${p.link && p.link !== "#" ? `<div class="project-card-arrow">↗</div>` : ""}
      </div>
    </div>
  `).join("");
}

/* =========================
   INLINE PROJECT VIEWER
   (loads site inside the projects page)
========================= */
function openInlineViewer(title, link) {
  if (!link) return;

  const grid    = document.getElementById("projectsGrid");
  const tabs    = document.getElementById("projectTabs");
  const viewer  = document.getElementById("inlineViewer");
  const iframe  = document.getElementById("inlineIframe");
  const label   = document.getElementById("inlineTitle");
  const visitBtn = document.getElementById("inlineVisitBtn");

  label.textContent = title || "Project";
  visitBtn.href = link;
  iframe.src = link;

  // hide grid & tabs, show viewer
  grid.style.display   = "none";
  tabs.style.display   = "none";
  viewer.style.display = "flex";
}

function closeInlineViewer() {
  const grid   = document.getElementById("projectsGrid");
  const tabs   = document.getElementById("projectTabs");
  const viewer = document.getElementById("inlineViewer");
  const iframe = document.getElementById("inlineIframe");

  iframe.src = "";
  viewer.style.display = "none";
  grid.style.display   = "grid";
  tabs.style.display   = "flex";
}

/* keep old function so nothing breaks */
function openProjectViewer(title, link) {
  openInlineViewer(title, link);
}

/* =========================
   GENERIC PAGE VIEWER (fallback)
========================= */
function openGenericPage(pageKey) {
  loadPageData(pageKey).then((data) => {
    pageViewerTitle.textContent = data.title || "Page";
    pageViewerContent.innerHTML = (data.content || []).map((p) => `<p>${p}</p>`).join("");
    pageViewer.style.display = "flex";
    setTimeout(() => pageViewer.classList.add("active"), 10);
  });
}

/* =========================
   CLOSE ALL PAGES
========================= */
function closeSubPage() {
  const allPages = [
    aboutPage, projectsPage, pageViewer, document.getElementById("projectViewer"),
    aboutTextPage, contactPage, skillsPage, resumePage, futurePage, settingsPage
  ];
  allPages.forEach((p) => {
    if (!p) return;
    p.classList.remove("active");
    p.style.display = "none";
  });
}

/* =========================
   SETTINGS BUTTON (★)
========================= */
document.querySelector(".settings-btn").addEventListener("click", () => {
  openPage("settings");
});

/* =========================
   FUTURE PROGRESS ANIMATION
========================= */
document.addEventListener("click", (e) => {
  const fp = document.getElementById("futurePage");
  if (fp && fp.classList.contains("active")) {
    const fill = fp.querySelector(".future-progress-fill");
    const pct  = fp.querySelector(".future-progress-pct");
    if (fill && !fill.classList.contains("animated")) {
      fill.classList.add("animated");

      const start    = new Date("2025-09-04");
      const end      = new Date("2026-06-25");
      const today    = new Date();
      const total    = end - start;
      const elapsed  = Math.min(Math.max(today - start, 0), total);
      const percent  = Math.round((elapsed / total) * 100);

      fill.style.transition = "none";
      fill.style.width = "0%";
      setTimeout(() => {
        fill.style.transition = "width 2s cubic-bezier(.25,.46,.45,.94) 0.1s";
        fill.style.width = percent + "%";
        if (pct) pct.textContent = percent + "%";
      }, 50);
    }
  }
});