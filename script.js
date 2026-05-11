const channels =
document.querySelectorAll('.channel');

const timeDisplay =
document.querySelector('.time');

const dateDisplay =
document.querySelector('.date');

const muteBtn =
document.getElementById('muteBtn');

let musicMuted = false;

const musicFrame =
document.querySelector('#musicContainer iframe');

/* CLOCK */

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

/* CHANNEL SELECT */

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

/* MUTE BUTTON */

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