const channels =
document.querySelectorAll('.channel');

const timeDisplay =
document.querySelector('.time');

const dateDisplay =
document.querySelector('.date');

const muteBtn =
document.getElementById('muteBtn');

const musicFrame =
document.querySelector('#musicContainer iframe');

let musicMuted = false;

/* =========================
   CLOCK
========================= */

const updateTime = () => {

  const now = new Date();

  const hours =
    now.getHours() % 12 || 12;

  const minutes =
    String(now.getMinutes()).padStart(2,'0');

  const ampm =
    now.getHours() >= 12 ? 'PM' : 'AM';

  const days =
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const day =
    days[now.getDay()];

  const month =
    now.getMonth() + 1;

  const date =
    now.getDate();

  timeDisplay.innerHTML =
    `${hours}:${minutes} <span class="ampm">${ampm}</span>`;

  dateDisplay.textContent =
    `${day} ${month}/${date}`;

};

updateTime();

setInterval(updateTime,1000);

/* =========================
   CHANNEL SELECT
========================= */

channels.forEach(channel => {

  channel.addEventListener('click', () => {

    if(channel.classList.contains('empty'))
      return;

    channels.forEach(ch =>
      ch.classList.remove('selected')
    );

    channel.classList.add('selected');

  });

});

/* =========================
   LOADING SCREEN + MUSIC
========================= */

window.addEventListener('load', () => {

  const loadingScreen =
  document.getElementById('loadingScreen');

  setTimeout(() => {

    /* FADE OUT */

    loadingScreen.classList.add('fade-out');

    /* START MUSIC */

    musicFrame.src =
    "https://www.youtube.com/embed/5-E_0uhPzaE?autoplay=1&loop=1&playlist=5-E_0uhPzaE";

  }, 4200);

});

/* =========================
   MUTE BUTTON
========================= */

const toggleMusic = () => {

  if(musicMuted){

    musicFrame.src =
    "https://www.youtube.com/embed/5-E_0uhPzaE?autoplay=1&loop=1&playlist=5-E_0uhPzaE";

    muteBtn.textContent = '🔊';

    musicMuted = false;

  } else {

    musicFrame.src = "";

    muteBtn.textContent = '🔇';

    musicMuted = true;

  }

};

muteBtn.addEventListener('click',toggleMusic);