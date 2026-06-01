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
const mainMenu = document.getElementById("mainMenu");

let projectData = null;

/* ── CLOCK ── */
function updateTime() {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, "0");
  const ap = now.getHours() >= 12 ? "PM" : "AM";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  timeDisplay.innerHTML = `${h}:${m} <span class="ampm">${ap}</span>`;
  dateDisplay.textContent = `${days[now.getDay()]} ${now.getMonth() + 1}/${now.getDate()}`;
}
setInterval(updateTime, 1000);
updateTime();

/* ── CHANNEL CLICK ── */
channels.forEach((c) => {
  c.addEventListener("click", () => {
    if (c.classList.contains("empty")) return;
    channels.forEach((x) => x.classList.remove("selected"));
    c.classList.add("selected");
    const p = c.dataset.page;
    if (p) openPage(p);
  });
});

/* ── LOADING SCREEN ── */
// total time = loadingScreenDelay + fadeDur (keep ~4.5s)
const loadingScreenDelay = 3500,
  fadeDur = 1000;
function hideLoadingScreen() {
  const ls = document.getElementById("loadingScreen");
  if (!ls || ls.classList.contains("fade-out")) return;
  ls.classList.add("fade-out");
  setTimeout(() => {
    ls.style.display = "none";
  }, fadeDur);
}
function scheduleHide() {
  setTimeout(hideLoadingScreen, loadingScreenDelay);
  setTimeout(startMusic, loadingScreenDelay + fadeDur);
}
// Always schedule hide after the configured delay so the loader can't get stuck waiting
scheduleHide();
// Quick fallback: ensure loader is removed after the configured delay so UI is usable
setTimeout(
  () => {
    try {
      hideLoadingScreen();
    } catch (e) {}
  },
  loadingScreenDelay + fadeDur + 300,
);

/* ── MUSIC ── */
let musicMuted = false;
const base =
  "https://www.youtube.com/embed/I8Mc-oOZfEk?rel=0&modestbranding=1&controls=0&loop=1&playlist=I8Mc-oOZfEk";
const mutedUrl = `${base}&autoplay=1&mute=1`;
const unmutedUrl = `${base}&autoplay=1&mute=0`;
function startMusic() {
  if (!musicFrame) return;
  musicFrame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  musicFrame.src = musicMuted ? mutedUrl : unmutedUrl;
}
muteBtn.textContent = "🔊";
muteBtn.addEventListener("click", () => {
  musicMuted = !musicMuted;
  if (musicFrame) musicFrame.src = musicMuted ? mutedUrl : unmutedUrl;
  muteBtn.textContent = musicMuted ? "🔇" : "🔊";
});
const settingsMuteBtn = document.getElementById("settingsMuteBtn");
if (settingsMuteBtn) {
  settingsMuteBtn.addEventListener("click", () => {
    musicMuted = !musicMuted;
    if (musicFrame) musicFrame.src = musicMuted ? mutedUrl : unmutedUrl;
    muteBtn.textContent = musicMuted ? "🔇" : "🔊";
    settingsMuteBtn.textContent = musicMuted ? "Unmute" : "Mute";
  });
}

/* ── PAGE DATA ── */
const pageDataFiles = {
  about: "data/about.json",
  projects: "data/projects.json",
  contact: "data/contact.json",
  skills: "data/skills.json",
  resume: "data/resume.json",
  settings: "data/settings.json",
  future: "data/future.json",
};
function loadPageData(key) {
  const p = pageDataFiles[key];
  if (!p) return Promise.reject("No page");
  return fetch(p).then((r) => r.json());
}

/* ═══════════════════════════════════════════════
   FEATURED PROJECTS — HOME SCREEN CHANNELS
   Three empty slots become Sophomore/Junior/Senior
═══════════════════════════════════════════════ */
const yearCfg = [
  {
    label: "Sophomore",
    id: "sophomore",
    grad: "linear-gradient(145deg,#e4f0ff,#c8e0ff)",
    accent: "#1a72c1",
    light: "#deeeff",
    dot: "#3db5ff",
  },
  {
    label: "Junior",
    id: "junior",
    grad: "linear-gradient(145deg,#e4fff0,#c8f5de)",
    accent: "#1a8a4a",
    light: "#d8ffeb",
    dot: "#36d97a",
  },
  {
    label: "Senior",
    id: "senior",
    grad: "linear-gradient(145deg,#f2eeff,#e0d4ff)",
    accent: "#6b35c9",
    light: "#ece4ff",
    dot: "#9f6ff5",
  },
];

function initFeaturedProjects() {
  loadPageData("projects").then((data) => {
    if (!data) return;
    projectData = data;
    buildFeaturedChannels(data.featured || []);
  });
}

function buildFeaturedChannels(featured) {
  const slots = Array.from(document.querySelectorAll(".channel.empty"));
  yearCfg.forEach((cfg, i) => {
    const slot = slots[i];
    if (!slot) return;
    const items = featured.filter((f) => f.year === cfg.label);
    slot.classList.remove("empty");
    slot.classList.add("fyc");
    slot.style.background = cfg.grad;
    slot.style.borderColor = "rgba(0,0,0,0.07)";
    slot.innerHTML = `
      <div class="fyc-inner">
        <div class="fyc-head">
          <span class="fyc-dot" style="background:${cfg.dot};box-shadow:0 0 7px ${cfg.dot}99;"></span>
          <span class="fyc-label" style="color:${cfg.accent};">${cfg.label}</span>
          <span class="fyc-badge" style="background:${cfg.light};color:${cfg.accent};">${items.length} projects</span>
        </div>
        <div class="fyc-list">
          ${items
            .map(
              (item, ri) => `
            <div class="fyc-row" data-title="${encodeURIComponent(item.title)}" style="--d:${ri * 0.06}s;">
              <span class="fyc-row-dot" style="background:${cfg.dot};"></span>
              <span class="fyc-row-title">${item.title}</span>
              <span class="fyc-row-arr" style="color:${cfg.accent};">›</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="fyc-hint" style="color:${cfg.accent};">View all →</div>
      </div>`;

    /* whole channel → open featured page for that year */
    slot.addEventListener("click", (e) => {
      if (e.target.closest(".fyc-row")) return;
      openFeaturedPage(cfg.label, featured);
    });

    /* individual row → open featured page scrolled to that project */
    slot.querySelectorAll(".fyc-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        const title = decodeURIComponent(row.dataset.title);
        openFeaturedPage(cfg.label, featured, title);
      });
    });
  });

  /* hide leftover empty slots */
  slots.slice(yearCfg.length).forEach((s) => (s.style.display = "none"));
}

/* ═══════════════════════════════════════════════
   FEATURED PAGE  — year cards + modal
═══════════════════════════════════════════════ */
function openFeaturedPage(yearLabel, allFeatured, scrollToTitle) {
  closeSubPage();
  if (mainMenu) mainMenu.style.display = "none";

  const page = document.getElementById("featuredProjectPage");
  const titleEl = document.getElementById("featuredProjectTitle");
  const body = document.getElementById("featuredProjectBody");
  const visitBtn = document.getElementById("featuredProjectVisitBtn");

  const cfg = yearCfg.find((c) => c.label === yearLabel) || yearCfg[0];
  const items = allFeatured.filter((f) => f.year === yearLabel);

  titleEl.textContent = `${yearLabel} — Featured Projects`;
  visitBtn.style.display = "none";

  body.innerHTML = `
    <div class="fp-year-grid">
      ${items
        .map(
          (item, idx) => `
        <div class="fp-card" id="fpc-${idx}" data-title="${encodeURIComponent(item.title)}" style="--card-accent:${cfg.accent};--card-light:${cfg.light};--card-dot:${cfg.dot};">
          <div class="fp-card-preview-wrap">
            ${
              item.link && item.link.startsWith("http")
                ? `<iframe class="fp-card-iframe" src="${item.link}" title="${item.title}" loading="lazy" scrolling="no"></iframe>`
                : item.screenshots && item.screenshots[0]
                  ? `<img class="fp-card-img" src="${item.screenshots[0]}" alt="${item.title}">`
                  : `<div class="fp-card-placeholder"><span>${item.title[0]}</span></div>`
            }
            <div class="fp-card-overlay">
              <a class="fp-card-visit" href="${item.link || "#"}" target="_blank" ${!item.link || item.link === "#" ? 'style="display:none"' : ""}>Visit Site ↗</a>
              <button class="fp-card-details-btn" data-idx="${idx}">About This Project</button>
            </div>
          </div>
          <div class="fp-card-footer">
            <div class="fp-card-name">${item.title}</div>
            <button class="fp-card-details-btn fp-card-details-inline" data-idx="${idx}" style="color:${cfg.accent};border-color:${cfg.dot}44;background:${cfg.light};">Details ›</button>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  /* details modal buttons */
  body.querySelectorAll(".fp-card-details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openProjectModal(items[Number(btn.dataset.idx)], cfg);
    });
  });

  page.style.display = "flex";
  setTimeout(() => {
    page.classList.add("active");
    if (scrollToTitle) {
      const target = page.querySelector(
        `.fp-card[data-title="${encodeURIComponent(scrollToTitle)}"]`,
      );
      if (target)
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 10);
}

/* ── PROJECT MODAL ── */
function openProjectModal(item, cfg) {
  document.getElementById("proj-modal-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "proj-modal-overlay";
  overlay.className = "pm-overlay";
  overlay.innerHTML = `
    <div class="pm-box">
      <button class="pm-close" aria-label="Close">✕</button>
      <div class="pm-year-badge" style="background:${cfg.light};color:${cfg.accent};">${item.year} Year</div>
      <h2 class="pm-title">${item.title}</h2>
      <p class="pm-desc">${item.description || ""}</p>
      ${
        item.skills && item.skills.length
          ? `
        <div class="pm-section-label">Skills Learned</div>
        <div class="pm-skills">
          ${item.skills.map((s) => `<span class="pm-skill" style="background:${cfg.light};color:${cfg.accent};border-color:${cfg.dot}55;">${s}</span>`).join("")}
        </div>
      `
          : ""
      }
      ${
        item.reflection
          ? `
        <div class="pm-section-label">Reflection</div>
        <blockquote class="pm-reflection" style="border-color:${cfg.dot};">"${item.reflection}"</blockquote>
      `
          : ""
      }
      ${
        item.link && item.link.startsWith("http")
          ? `
        <a class="pm-visit-btn" href="${item.link}" target="_blank" style="background:${cfg.grad || cfg.light};color:${cfg.accent};border-color:${cfg.dot}88;">Visit Live Site ↗</a>
      `
          : ""
      }
    </div>`;

  overlay
    .querySelector(".pm-close")
    .addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("pm-visible"));
}

/* ═══════════════════════════════════════════════
   PROJECTS PAGE  — Wii bubble grid, filterable
═══════════════════════════════════════════════ */
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
    data.years.map((y) => ({ id: y.id, label: y.label })),
  );
  projectTabs.innerHTML = tabs
    .map(
      (t) =>
        `<button class="project-tab ${t.id === (data.default || "all") ? "active" : ""}" data-year="${t.id}">${t.label}</button>`,
    )
    .join("");
  projectTabs
    .querySelectorAll(".project-tab")
    .forEach((btn) =>
      btn.addEventListener("click", () => showYear(btn.dataset.year, btn)),
    );
  showYear(data.default || "all");
}

function showYear(year, btn) {
  projectTabs
    .querySelectorAll(".project-tab")
    .forEach((b) => b.classList.remove("active"));
  (btn || projectTabs.querySelector(`[data-year="${year}"]`))?.classList.add(
    "active",
  );

  let projects = [];
  if (year === "all") {
    projects = projectData.years.flatMap((y) =>
      y.projects.map((p) => ({ ...p, yearLabel: y.label })),
    );
  } else {
    const y = projectData.years.find((x) => x.id === year);
    if (y) projects = y.projects.map((p) => ({ ...p, yearLabel: y.label }));
  }
  renderWiiBubbles(projects);
}

/* colour palette per year */
const bubblePalette = {
  Sophomore: {
    grad: "linear-gradient(145deg,#e4f0ff,#cce0ff)",
    accent: "#1a72c1",
    light: "#deeeff",
    dot: "#3db5ff",
  },
  Junior: {
    grad: "linear-gradient(145deg,#e4fff0,#c8f5de)",
    accent: "#1a8a4a",
    light: "#d8ffeb",
    dot: "#36d97a",
  },
  Senior: {
    grad: "linear-gradient(145deg,#f2eeff,#e0d4ff)",
    accent: "#6b35c9",
    light: "#ece4ff",
    dot: "#9f6ff5",
  },
};

function renderWiiBubbles(projects) {
  projectsGrid.innerHTML = "";
  projectsGrid.className = "wii-bubble-grid";

  projects.forEach((p, i) => {
    const pal = bubblePalette[p.yearLabel] || bubblePalette.Senior;
    const iconSet = [
      "💻",
      "🌐",
      "🕹️",
      "🎨",
      "📱",
      "📁",
      "🧩",
      "🚀",
      "⭐",
      "🔥",
      "🎯",
      "✨",
    ];
    const icon = p.icon || iconSet[i % iconSet.length];

    const card = document.createElement("div");
    card.className = "wii-bubble";
    card.style.cssText = `background:${pal.grad};--accent:${pal.accent};--light:${pal.light};--dot:${pal.dot};`;
    card.innerHTML = `
      <div class="wb-top">
        <div class="wb-dot" style="background:${pal.dot};box-shadow:0 0 6px ${pal.dot}99;"></div>
        <span class="wb-year" style="color:${pal.accent};">${p.yearLabel}</span>
      </div>
      <div class="wb-preview">
        ${
          p.link && p.link !== "#" && p.link.startsWith("http")
            ? `<iframe class="wb-iframe" src="${p.link}" title="${p.title}" loading="lazy" scrolling="no" tabindex="-1"></iframe>
             <div class="wb-iframe-shield"></div>`
            : p.image
              ? `<img class="wb-img" src="${p.image}" alt="${p.title}">`
              : `<div class="wb-placeholder">${icon}</div>`
        }
      </div>
      <div class="wb-footer">
        <span class="wb-icon">${icon}</span>
        <div class="wb-info">
          <div class="wb-title">${p.title}</div>
          ${p.description ? `<div class="wb-desc">${p.description}</div>` : ""}
        </div>
        ${p.link && p.link !== "#" ? `<span class="wb-arr" style="color:${pal.accent};">↗</span>` : ""}
      </div>`;

    if (p.link && p.link !== "#") {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => openInlineViewer(p.title, p.link));
    }

    projectsGrid.appendChild(card);
  });
}

/* ── INLINE VIEWER ── */
function openInlineViewer(title, link) {
  if (!link) return;
  const grid = document.getElementById("projectsGrid");
  const tabs = document.getElementById("projectTabs");
  const viewer = document.getElementById("inlineViewer");
  document.getElementById("inlineTitle").textContent = title || "Project";
  document.getElementById("inlineVisitBtn").href = link;
  document.getElementById("inlineIframe").src = link;
  grid.style.display = "none";
  tabs.style.display = "none";
  viewer.style.display = "flex";
}
function closeInlineViewer() {
  document.getElementById("inlineIframe").src = "";
  document.getElementById("inlineViewer").style.display = "none";
  document.getElementById("projectsGrid").style.display = "";
  document.getElementById("projectTabs").style.display = "flex";
}
function openProjectViewer(t, l) {
  openInlineViewer(t, l);
}

/* ── PAGE ROUTER ── */
function openPage(key) {
  closeSubPage();
  if (mainMenu) mainMenu.style.display = "none";
  if (key === "about") openAboutPage();
  else if (key === "projects") openProjectsPage();
  else if (key === "contact") openDirectPage(contactPage);
  else if (key === "skills") openDirectPage(skillsPage);
  else if (key === "resume") openDirectPage(resumePage);
  else if (key === "future") openDirectPage(futurePage);
  else if (key === "settings") openDirectPage(settingsPage);
  else openGenericPage(key);
}
function openDirectPage(el) {
  if (!el) return;
  el.style.display = "flex";
  setTimeout(() => {
    el.classList.add("active");
    if (el.id === "skillsPage") {
      el.querySelectorAll(".skill-bar").forEach((bar) => {
        const t = bar.style.width;
        bar.style.width = "0%";
        setTimeout(() => (bar.style.width = t), 80);
      });
    }
  }, 10);
}

/* ── ABOUT PAGE ── */
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
      </div>`;
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

/* ── GENERIC PAGE ── */
function openGenericPage(key) {
  loadPageData(key).then((data) => {
    pageViewerTitle.textContent = data.title || "Page";
    pageViewerContent.innerHTML = (data.content || [])
      .map((p) => `<p>${p}</p>`)
      .join("");
    pageViewer.style.display = "flex";
    setTimeout(() => pageViewer.classList.add("active"), 10);
  });
}

/* ── CLOSE ALL ── */
function closeSubPage() {
  const pages = [
    aboutPage,
    projectsPage,
    pageViewer,
    document.getElementById("projectViewer"),
    document.getElementById("featuredProjectPage"),
    aboutTextPage,
    contactPage,
    skillsPage,
    resumePage,
    futurePage,
    settingsPage,
  ].filter(Boolean);

  pages.forEach((p) => {
    if (!p) return;
    // If page is active, remove class then wait for CSS transition before hiding
    if (p.classList.contains("active")) {
      p.classList.remove("active");
      setTimeout(() => {
        try {
          p.style.display = "none";
        } catch (e) {}
      }, 320);
    } else {
      p.style.display = "none";
    }
  });
  document.getElementById("proj-modal-overlay")?.remove();
  if (mainMenu) mainMenu.style.display = "block";
}

document
  .querySelector(".settings-btn")
  .addEventListener("click", () => openPage("settings"));
initFeaturedProjects();

/* ── MINI GAME: Bubble Pop ── */
const miniGameOverlay = document.getElementById("miniGameOverlay");
const mgPlayArea = () => document.getElementById("mg-play-area");
let mgInterval = null;
let mgTimeLeft = 20;
let mgScore = 0;
let mgRunning = false;
let mgMode = "bubble"; // 'bubble' or 'pick'
let mgPickRound = 0;
let mgPickMax = 8;
let mgPickTimeout = null;
let mgWhackInterval = null;
let mgTapInterval = null;
let mgSimonSeq = [];
let mgSimonInput = [];
let mgSimonStepTimeout = null;

function openMiniGame() {
  if (!miniGameOverlay) return;
  document.getElementById("mg-score").textContent = "0";
  document.getElementById("mg-timer").textContent = "20";
  // show high score for current mode
  document.getElementById("mg-high").textContent = getHighForMode(mgMode) || 0;
  miniGameOverlay.style.display = "flex";
}

function closeMiniGame() {
  if (!miniGameOverlay) return;
  stopMiniGame();
  miniGameOverlay.style.display = "none";
  const area = mgPlayArea();
  if (area) area.innerHTML = "";
}

function spawnBubble() {
  const area = mgPlayArea();
  if (!area) return;
  const b = document.createElement("div");
  b.className = "mg-bubble";
  const size = 48 + Math.floor(Math.random() * 36);
  b.style.width = b.style.height = size + "px";
  const x = Math.random() * (area.clientWidth - size);
  const y = Math.random() * (area.clientHeight - size);
  b.style.left = x + "px";
  b.style.top = y + "px";
  b.textContent = "💥";
  b.addEventListener("click", () => {
    mgScore += Math.ceil(10 * (size / 64));
    document.getElementById("mg-score").textContent = mgScore;
    playSfx("pop");
    b.remove();
  });
  area.appendChild(b);
  setTimeout(() => b.remove(), 2500);
}

/* ── Simple sound effects (WebAudio) ── */
const _ac = window.AudioContext ? new AudioContext() : null;
function playSfx(type) {
  if (!_ac) return;
  const o = _ac.createOscillator();
  const g = _ac.createGain();
  o.connect(g);
  g.connect(_ac.destination);
  const now = _ac.currentTime;
  switch (type) {
    case "pop":
      o.type = "sine";
      o.frequency.setValueAtTime(900, now);
      g.gain.setValueAtTime(0.0025, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      break;
    case "correct":
      o.type = "triangle";
      o.frequency.setValueAtTime(700, now);
      g.gain.setValueAtTime(0.006, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      break;
    case "wrong":
      o.type = "sawtooth";
      o.frequency.setValueAtTime(180, now);
      g.gain.setValueAtTime(0.01, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      break;
    case "win":
      o.type = "square";
      o.frequency.setValueAtTime(1200, now);
      g.gain.setValueAtTime(0.01, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      break;
    default:
      o.type = "sine";
      o.frequency.setValueAtTime(600, now);
      g.gain.setValueAtTime(0.005, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  }
  o.start(now);
  o.stop(now + 0.5);
}

/* ── High score persistence per mode ── */
function highKey(mode) {
  return "mg_high_" + (mode || "bubble");
}
function getHighForMode(mode) {
  try {
    return parseInt(localStorage.getItem(highKey(mode)) || "0", 10);
  } catch (e) {
    return 0;
  }
}
function setHighForMode(mode, score) {
  try {
    localStorage.setItem(highKey(mode), String(score));
  } catch (e) {}
}
function checkAndStoreHigh() {
  const prev = getHighForMode(mgMode) || 0;
  if (mgScore > prev) {
    setHighForMode(mgMode, mgScore);
    document.getElementById("mg-high").textContent = mgScore;
    playSfx("win");
  }
}

function startMiniGame() {
  if (mgRunning) return;
  mgRunning = true;
  mgScore = 0;
  document.getElementById("mg-score").textContent = mgScore;
  if (mgMode === "pick") {
    // start pick rounds
    mgPickRound = 0;
    document.getElementById("mg-timer").textContent =
      // record high for mode when a game ends
      checkAndStoreHigh();
    `${mgPickRound}/${mgPickMax}`;
    startPickGame();
    return;
  }
  if (mgMode === "whack") {
    startWhackGame();
    return;
  }
  if (mgMode === "simon") {
    startSimonGame();
    return;
  }
  if (mgMode === "tap") {
    startTapGame();
    return;
  }
  // default: bubble mode
  mgTimeLeft = 20;
  document.getElementById("mg-timer").textContent = mgTimeLeft;
  mgInterval = setInterval(() => {
    if (mgTimeLeft <= 0) {
      stopMiniGame();
      return;
    }
    mgTimeLeft -= 1;
    document.getElementById("mg-timer").textContent = mgTimeLeft;
    // spawn 1-2 bubbles per second
    spawnBubble();
    if (Math.random() > 0.6) spawnBubble();
  }, 1000);
}

function stopMiniGame() {
  mgRunning = false;
  clearInterval(mgInterval);
  mgInterval = null;
  clearTimeout(mgPickTimeout);
  mgPickTimeout = null;
  clearInterval(mgWhackInterval);
  mgWhackInterval = null;
  clearInterval(mgTapInterval);
  mgTapInterval = null;
  clearTimeout(mgSimonStepTimeout);
  mgSimonStepTimeout = null;

  const area = mgPlayArea();
  if (area) {
    area.innerHTML =
      '<div style="padding:20px;text-align:center;font-weight:800;color:#153047;">Game stopped. Choose another mode or press Start.</div>';
  }
}

// wire buttons
document
  .querySelectorAll(".remote-btn")
  .forEach((btn) => btn.addEventListener("click", openMiniGame));
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList && e.target.classList.contains("mg-close"))
    closeMiniGame();
  if (e.target && e.target.id === "mg-start") startMiniGame();
  if (e.target && e.target.id === "mg-stop") stopMiniGame();
  if (e.target && e.target.id === "mg-quit") closeMiniGame();
  // mode buttons
  if (e.target && e.target.id === "mg-mode-bubble") {
    mgMode = "bubble";
    document.getElementById("mg-mode-bubble").classList.add("active");
    document.getElementById("mg-mode-pick").classList.remove("active");
    const area = mgPlayArea();
    if (area) area.classList.remove("pick-mode");
    document.querySelector(".mg-title").textContent = "Bubble Pop";
  }
  if (e.target && e.target.id === "mg-mode-pick") {
    mgMode = "pick";
    document.getElementById("mg-mode-pick").classList.add("active");
    document.getElementById("mg-mode-bubble").classList.remove("active");
    const area = mgPlayArea();
    if (area) area.classList.add("pick-mode");
    document.querySelector(".mg-title").textContent = "Pick Fast";
  }
  if (e.target && e.target.id === "mg-mode-whack") {
    mgMode = "whack";
    document.getElementById("mg-mode-whack").classList.add("active");
    ["mg-mode-bubble", "mg-mode-pick", "mg-mode-simon", "mg-mode-tap"].forEach(
      (id) => document.getElementById(id)?.classList.remove("active"),
    );
    const area = mgPlayArea();
    if (area) area.classList.remove("pick-mode");
    document.querySelector(".mg-title").textContent = "Whack-a-Mole";
  }
  if (e.target && e.target.id === "mg-mode-simon") {
    mgMode = "simon";
    document.getElementById("mg-mode-simon").classList.add("active");
    ["mg-mode-bubble", "mg-mode-pick", "mg-mode-whack", "mg-mode-tap"].forEach(
      (id) => document.getElementById(id)?.classList.remove("active"),
    );
    const area = mgPlayArea();
    if (area) area.classList.remove("pick-mode");
    document.querySelector(".mg-title").textContent = "Simon Says";
  }
  if (e.target && e.target.id === "mg-mode-tap") {
    mgMode = "tap";
    document.getElementById("mg-mode-tap").classList.add("active");
    [
      "mg-mode-bubble",
      "mg-mode-pick",
      "mg-mode-whack",
      "mg-mode-simon",
    ].forEach((id) => document.getElementById(id)?.classList.remove("active"));
    const area = mgPlayArea();
    if (area) area.classList.remove("pick-mode");
    document.querySelector(".mg-title").textContent = "Tap Rush";
  }
});

// Extra blur handler: remove focus/caret from non-inputs after clicks
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!t) return;
  if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
    return;
  const active = document.activeElement;
  if (!active) return;
  if (
    active.tagName !== "INPUT" &&
    active.tagName !== "TEXTAREA" &&
    !active.isContentEditable
  ) {
    try {
      active.blur();
    } catch (err) {}
  }
});

/* ── PICK GAME ── */
const pickEmojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍒",
  "🍉",
  "🍓",
  "🍍",
  "🥝",
  "🍑",
  "🥥",
  "🍋",
  "🍊",
];
function startPickGame() {
  const area = mgPlayArea();
  if (!area) return;
  area.innerHTML = "";
  area.classList.add("pick-mode");
  nextPickRound();
}

function nextPickRound() {
  const area = mgPlayArea();
  if (!area) return;
  mgPickRound += 1;
  document.getElementById("mg-timer").textContent =
    `${mgPickRound}/${mgPickMax}`;
  if (mgPickRound > mgPickMax) return finishPickGame();
  // choose target and two distractors
  const choices = [];
  const target = pickEmojis[Math.floor(Math.random() * pickEmojis.length)];
  choices.push(target);
  while (choices.length < 3) {
    const c = pickEmojis[Math.floor(Math.random() * pickEmojis.length)];
    if (!choices.includes(c)) choices.push(c);
  }
  // shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  area.innerHTML = "";
  // prompt
  const prompt = document.createElement("div");
  prompt.className = "mg-prompt";
  prompt.style.marginBottom = "6px";
  prompt.textContent = `Pick: ${target}`;
  area.appendChild(prompt);
  // render choices
  choices.forEach((ch) => {
    const b = document.createElement("button");
    b.className = "mg-choice";
    b.textContent = ch;
    b.addEventListener("click", () => {
      if (b.classList.contains("disabled")) return;
      const correct = ch === target;
      if (correct) {
        mgScore += 10;
        document.getElementById("mg-score").textContent = mgScore;
        b.classList.add("correct");
      } else {
        b.classList.add("wrong");
      }
      // disable all
      area
        .querySelectorAll(".mg-choice")
        .forEach((x) => x.classList.add("disabled"));
      mgPickTimeout = setTimeout(() => {
        // next round
        nextPickRound();
      }, 700);
    });
    area.appendChild(b);
  });
}

function finishPickGame() {
  const area = mgPlayArea();
  if (!area) return;
  area.classList.remove("pick-mode");
  area.innerHTML = `<div style="padding:20px;text-align:center;font-weight:800;">Finished! Score: ${mgScore}</div>`;
  mgRunning = false;
  checkAndStoreHigh();
}

/* ── ADDITIONAL GAMES: Whack, Tap, Simon ── */
function startWhackGame() {
  const area = mgPlayArea();
  if (!area) return;
  mgRunning = true;
  mgScore = 0;
  mgTimeLeft = 20;
  document.getElementById("mg-score").textContent = mgScore;
  document.getElementById("mg-timer").textContent = mgTimeLeft;
  area.classList.remove("pick-mode");
  area.innerHTML = "";
  const holes = document.createElement("div");
  holes.className = "mg-holes";
  for (let i = 0; i < 6; i++) {
    const h = document.createElement("div");
    h.className = "mg-hole";
    holes.appendChild(h);
  }
  area.appendChild(holes);
  mgWhackInterval = setInterval(() => {
    mgTimeLeft -= 1;
    document.getElementById("mg-timer").textContent = mgTimeLeft;
    if (mgTimeLeft <= 0) {
      stopMiniGame();
      return;
    }
    const hs = holes.children;
    const idx = Math.floor(Math.random() * hs.length);
    const mole = document.createElement("div");
    mole.className = "mg-mole";
    mole.textContent = "🐹";
    mole.addEventListener("click", () => {
      mgScore += 5;
      document.getElementById("mg-score").textContent = mgScore;
      mole.remove();
    });
    hs[idx].appendChild(mole);
    setTimeout(() => {
      try {
        mole.remove();
      } catch (e) {}
    }, 700);
  }, 900);
}

function startTapGame() {
  const area = mgPlayArea();
  if (!area) return;
  mgRunning = true;
  mgScore = 0;
  mgTimeLeft = 15;
  document.getElementById("mg-score").textContent = mgScore;
  document.getElementById("mg-timer").textContent = mgTimeLeft;
  area.classList.remove("pick-mode");
  area.innerHTML = "";
  mgTapInterval = setInterval(() => {
    mgTimeLeft -= 1;
    document.getElementById("mg-timer").textContent = mgTimeLeft;
    if (mgTimeLeft <= 0) {
      stopMiniGame();
      return;
    }
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) spawnTapTarget();
  }, 900);
}

function spawnTapTarget() {
  const area = mgPlayArea();
  if (!area) return;
  const t = document.createElement("div");
  t.className = "mg-target";
  t.textContent = "⭐";
  const size = 40 + Math.floor(Math.random() * 36);
  t.style.width = t.style.height = `${size}px`;
  const x = Math.random() * (area.clientWidth - size);
  const y = Math.random() * (area.clientHeight - size);
  t.style.left = x + "px";
  t.style.top = y + "px";
  t.addEventListener("click", () => {
    mgScore += 1;
    document.getElementById("mg-score").textContent = mgScore;
    t.remove();
  });
  area.appendChild(t);
  setTimeout(() => {
    try {
      t.remove();
    } catch (e) {}
  }, 1200);
}

function startSimonGame() {
  const area = mgPlayArea();
  if (!area) return;
  mgRunning = true;
  mgScore = 0;
  document.getElementById("mg-score").textContent = mgScore;
  document.getElementById("mg-timer").textContent = "0/5";
  area.classList.remove("pick-mode");
  area.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "simon-grid";
  const colors = ["red", "green", "blue", "yellow"];
  colors.forEach((c, idx) => {
    const t = document.createElement("div");
    t.className = "simon-tile simon-" + c;
    t.dataset.color = c;
    t.textContent = idx + 1;
    grid.appendChild(t);
  });
  area.appendChild(grid);
  mgSimonSeq = [];
  mgSimonInput = [];
  for (let i = 0; i < 5; i++)
    mgSimonSeq.push(
      ["red", "green", "blue", "yellow"][Math.floor(Math.random() * 4)],
    );
  playSimonRound(0);
}

function playSimonRound(step) {
  const area = mgPlayArea();
  if (!area) return;
  document.getElementById("mg-timer").textContent = `${step + 1}/5`;
  const grid = area.querySelector(".simon-grid");
  if (!grid) return;
  mgSimonInput = [];
  let i = 0;
  function flashNext() {
    if (i > step) {
      enableSimonInput(step);
      return;
    }
    const color = mgSimonSeq[i];
    const tile = grid.querySelector(".simon-" + color);
    tile.classList.add("flash");
    setTimeout(() => {
      tile.classList.remove("flash");
      i++;
      setTimeout(flashNext, 300);
    }, 600);
  }
  flashNext();
}

function enableSimonInput(roundStep) {
  const area = mgPlayArea();
  const grid = area.querySelector(".simon-grid");
  if (!grid) return;
  grid.querySelectorAll(".simon-tile").forEach((t) => {
    t.onclick = () => {
      const c = t.dataset.color;
      mgSimonInput.push(c);
      const idx = mgSimonInput.length - 1;
      if (mgSimonInput[idx] !== mgSimonSeq[idx]) {
        area.innerHTML = `<div style="padding:20px;text-align:center;font-weight:800;color:#b91c1c;">Wrong! Score: ${mgScore}</div>`;
        mgRunning = false;
        return;
      }
      mgScore += 5;
      document.getElementById("mg-score").textContent = mgScore;
      if (mgSimonInput.length > roundStep) {
        if (roundStep >= 4) {
          area.innerHTML = `<div style="padding:20px;text-align:center;font-weight:800;">Simon Complete! Score: ${mgScore}</div>`;
          mgRunning = false;
          return;
        }
        setTimeout(() => playSimonRound(roundStep + 1), 600);
      }
    };
  });
}

/* ── FUTURE PROGRESS ── */
document.addEventListener("click", () => {
  const fp = document.getElementById("futurePage");
  if (fp && fp.classList.contains("active")) {
    const fill = fp.querySelector(".future-progress-fill");
    const pct = fp.querySelector(".future-progress-pct");
    if (fill && !fill.classList.contains("animated")) {
      fill.classList.add("animated");
      const start = new Date("2025-09-04"),
        end = new Date("2026-06-25"),
        today = new Date();
      const pctVal = Math.round(
        (Math.min(Math.max(today - start, 0), end - start) / (end - start)) *
          100,
      );
      fill.style.transition = "none";
      fill.style.width = "0%";
      setTimeout(() => {
        fill.style.transition = "width 2s cubic-bezier(.25,.46,.45,.94) 0.1s";
        fill.style.width = pctVal + "%";
        if (pct) pct.textContent = pctVal + "%";
      }, 50);
    }
  }
});
