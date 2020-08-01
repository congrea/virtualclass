if(window.location.search !== null && window.location.search !== "") {
  // when plugin has a support of pwa
  document.querySelector("html").classList.add("pwaSupported");
}
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
});

// Track how the PWA was launched 
window.addEventListener('load', () => {
  if (navigator.fullscreen) {
    console.log('Launched: pwa app from ios');
    document.querySelector("html").classList.add("pwaRunning");
  } else if (matchMedia('(display-mode: fullscreen)').matches) {
    console.log('Launched: pwa app from android');
    document.querySelector("html").classList.add("pwaRunning");
  } else {
    console.log('Launched: Browser Tab');
  }

  // Track the android app running
  if(document.referrer.includes('net.vidyamantra.congrea')) {
    document.querySelector("html").classList.add("twaRunning");
    console.log('Launched: Android app');
  }
});