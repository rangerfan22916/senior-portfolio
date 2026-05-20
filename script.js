const channels = document.querySelectorAll('.channel');
const timeDisplay = document.querySelector('.time');
const dateDisplay = document.querySelector('.date');
const muteBtn = document.getElementById('muteBtn');
const musicFrame = document.querySelector('#musicContainer iframe');

const aboutPage = document.getElementById('aboutPage');
const projectsPage = document.getElementById('projectsPage');
const pageViewer = document.getElementById('pageViewer');
const pageViewerTitle = document.getElementById('pageViewerTitle');
const pageViewerContent = document.getElementById('pageViewerContent');
const aboutContentContainer = document.getElementById('aboutContentContainer');
const projectTabs = document.getElementById('projectTabs');
const projectsGrid = document.getElementById('projectsGrid');
const aboutTextPage = document.getElementById('aboutTextPage');

const settingsBtn = document.querySelector('.settings-btn');

let projectData = null;

/* =========================
   CLOCK
========================= */
function updateTime(){

  const now = new Date();

  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2,'0');
  const ampm = now.getHours() >= 12 ? 'PM':'AM';

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  timeDisplay.innerHTML =
    `${hours}:${minutes} <span class="ampm">${ampm}</span>`;

  dateDisplay.textContent =
    `${days[now.getDay()]} ${now.getMonth()+1}/${now.getDate()}`;

}

setInterval(updateTime,1000);
updateTime();

/* =========================
   CHANNEL CLICK
========================= */
channels.forEach(c=>{

  c.addEventListener('click',()=>{

    if(c.classList.contains('empty')) return;

    channels.forEach(x=>x.classList.remove('selected'));
    c.classList.add('selected');

    const pageName = c.dataset.page;

    if(pageName){
      openPage(pageName);
    }

  });

});

/* =========================
   LOADING SCREEN
========================= */
function hideLoadingScreen(){

  const loadingScreen = document.getElementById('loadingScreen');

  if(!loadingScreen || loadingScreen.classList.contains('fade-out')) return;

  loadingScreen.classList.add('fade-out');

  setTimeout(()=>{

    loadingScreen.style.display = 'none';

    startMusic();

  },1500);

}

function scheduleHideLoadingScreen(){
  setTimeout(hideLoadingScreen,4500);
}

if(document.readyState === 'complete'){
  scheduleHideLoadingScreen();
}else{
  window.addEventListener('load', scheduleHideLoadingScreen);
}

/* =========================
   MUSIC
========================= */
let musicMuted = false;

const musicBaseUrl =
"https://www.youtube.com/embed/5-E_0uhPzaE?rel=0&modestbranding=1&controls=0&loop=1&playlist=5-E_0uhPzaE";

const musicMutedUrl = `${musicBaseUrl}&autoplay=1&mute=1`;
const musicUnmutedUrl = `${musicBaseUrl}&autoplay=1&mute=0`;

function startMusic(){
  if(!musicFrame) return;
  musicFrame.src = musicMuted ? musicMutedUrl : musicUnmutedUrl;
}

muteBtn.textContent = "🔊";

muteBtn.addEventListener('click',()=>{

  musicMuted = !musicMuted;

  musicFrame.src = musicMuted ? musicMutedUrl : musicUnmutedUrl;

  muteBtn.textContent = musicMuted ? "🔇" : "🔊";

});

/* =========================
   PAGE DATA
========================= */
const pageDataFiles = {
  about: 'data/about.json',
  projects: 'data/projects.json',
  contact: 'data/contact.json',
  skills: 'data/skills.json',
  resume: 'data/resume.json',
  settings: 'data/settings.json',
  future: 'data/future.json'
};

function loadPageData(pageKey){

  const path = pageDataFiles[pageKey];

  if(!path) return Promise.reject("No page");

  return fetch(path).then(r=>r.json());

}

/* =========================
   PAGE ROUTER
========================= */
function openPage(pageKey){

  closeSubPage();

  if(pageKey === 'about') openAboutPage();
  else if(pageKey === 'projects') openProjectsPage();
  else openGenericPage(pageKey);

}

/* =========================
   ABOUT PAGE
========================= */
function openAboutPage(){

  loadPageData('about').then(data=>{

    aboutContentContainer.innerHTML = `

      <div class="about-image-panel">

        <img id="aboutMainImage" class="about-mii" src="${data.image}">

        <button id="humanifyBtn" class="humanify-btn">
          HUMANIFY
        </button>

      </div>

      <div class="about-text-panel">

        <h1>${data.title}</h1>

        ${data.description.map(p=>`<p>${p}</p>`).join('')}

      </div>

    `;

    const img = document.getElementById('aboutMainImage');
    const btn = document.getElementById('humanifyBtn');

    let human = false;

    btn.addEventListener('click', () => {

      human = !human;

      // SMOOTH WI-FI STYLE TRANSITION
      img.style.transition = "0.35s ease";
      img.style.opacity = "0";
      img.style.transform = "scale(1.05)";

      setTimeout(() => {

        img.src = human
          ? "imgs/me.jpg"
          : data.image;

        img.onload = () => {
          img.style.opacity = "1";
          img.style.transform = "scale(1)";
        };

      }, 350);

      btn.textContent = human ? "MIIIFY" : "HUMANIFY";

    });

    aboutPage.style.display = "flex";
    setTimeout(()=>aboutPage.classList.add("active"),10);

  });

}

/* =========================
   PROJECTS PAGE
========================= */
function openProjectsPage(){

  loadPageData('projects').then(data=>{

    projectData = data;

    renderProjects(data);

    projectsPage.style.display = "flex";
    setTimeout(()=>projectsPage.classList.add("active"),10);

  });

}

function renderProjects(data){

  const tabs = [
    {id:"all",label:"All"}
  ].concat(data.years.map(y=>({
    id:y.id,
    label:y.label
  })));

  projectTabs.innerHTML = tabs.map(t=>`
    <button class="project-tab ${t.id===data.default?'active':''}"
            data-year="${t.id}">
      ${t.label}
    </button>
  `).join('');

  projectTabs.querySelectorAll(".project-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      showYear(btn.dataset.year,btn);
    });
  });

  showYear(data.default || "all");

}

function showYear(year,btn){

  projectTabs.querySelectorAll(".project-tab")
    .forEach(b=>b.classList.remove("active"));

  if(btn) btn.classList.add("active");

  let projects = [];

  if(year === "all"){

    projects = projectData.years.flatMap(y=>
      y.projects.map(p=>({...p,year:y.label}))
    );

  }else{

    const y = projectData.years.find(x=>x.id===year);

    if(y){
      projects = y.projects.map(p=>({...p,year:y.label}));
    }

  }

  projectsGrid.innerHTML = renderCards(projects);

    // CLICK OPEN PROJECT VIEWER
    projectsGrid.querySelectorAll(".project-card").forEach(card=>{

      card.addEventListener("click",()=>{

        const link = card.dataset.link;
        const title = card.dataset.title;

        if(link){
          openProjectViewer(title, link);
        }

      });

    });

}

function renderCards(projects){

  return projects.map(p=>`

    <div class="channel project-card"
         data-link="${p.link || ''}">
        data-title="${p.title || ''}">

      <div class="project-card-image">
        <img src="${p.image || 'imgs/default.png'}">
      </div>

      <div class="project-card-title">${p.title}</div>

      ${p.description ? `
        <div class="project-card-copy">
          ${p.description}
        </div>
      `:''}

      ${p.year ? `
        <div class="project-card-year">
          ${p.year}
        </div>
      `:''}

    </div>

  `).join('');

}

/* =========================
    PROJECT VIEWER
  ========================= */
  function openProjectViewer(title, link){

    if(!link) return;

    const projectViewer = document.getElementById('projectViewer');
    const projectViewerTitle = document.getElementById('projectViewerTitle');
    const projectIframe = document.getElementById('projectIframe');
    const visitBtn = document.getElementById('visitProjectBtn');

    projectViewerTitle.textContent = title || 'Project';
    projectIframe.src = link;
    visitBtn.href = link;

    projectViewer.style.display = "flex";
    setTimeout(()=>projectViewer.classList.add("active"),10);

  }

  /* =========================
   GENERIC PAGE VIEWER
========================= */
function openGenericPage(pageKey){

  loadPageData(pageKey).then(data=>{

    pageViewerTitle.textContent = data.title || "Page";

    pageViewerContent.innerHTML =
      (data.content || [])
        .map(p=>`<p>${p}</p>`)
        .join('');

    pageViewer.style.display = "flex";
    setTimeout(()=>pageViewer.classList.add("active"),10);

  });

}

/* =========================
   CLOSE ALL PAGES
========================= */
function closeSubPage(){

  [aboutPage,projectsPage,pageViewer,aboutTextPage]
    .forEach(p=>{

      if(!p) return;

      p.classList.remove("active");
      p.style.display = "none";

    });

}