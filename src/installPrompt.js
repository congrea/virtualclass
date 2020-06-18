if(window.location.search !== "null" && window.system.device=="mobTab" && window.system.mybrowser.name == "Chrome") {
  // when plugin has a support of pwa
  document.querySelector("html").classList.add("pwaSupported");
  window.addEventListener('beforeinstallprompt', (event) => {
    console.log('👍', 'beforeinstallprompt', event);
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;
  });
}

// Track how the PWA was launched 
window.addEventListener('load', () => {
  if (navigator.fullscreen) {
    console.log('Launched: Installed (iOS)');
    document.querySelector("html").classList.add("pwaRunning");
  } else if (matchMedia('(display-mode: fullscreen)').matches) {
    console.log('Launched: Installed');
    document.querySelector("html").classList.add("pwaRunning");
  } else {
    console.log('Launched: Browser Tab');
  }
});