window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  document.querySelector("#installContainer").style.display= "block";
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
});

// Track how the PWA was launched 
window.addEventListener('load', () => {
  if (navigator.fullscreen) {
    console.log('Launched: Installed (iOS)');
    document.querySelector("html").classList.add("pwa");
  } else if (matchMedia('(display-mode: fullscreen)').matches) {
    console.log('Launched: Installed');
    document.querySelector("html").classList.add("pwa");
  } else {
    console.log('Launched: Browser Tab');
  }
});