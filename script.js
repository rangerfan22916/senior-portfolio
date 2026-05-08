const channels=document.querySelectorAll('.channel');

channels.forEach(channel=>{

  channel.addEventListener('mouseenter',()=>{

    if(!channel.classList.contains('selected')){

      channel.style.transform='scale(1.03)';

    }

  });

  channel.addEventListener('mouseleave',()=>{

    channel.style.transform='scale(1)';

  });

});