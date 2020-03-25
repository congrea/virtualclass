window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  //deferredPrompt = event;
  window.deferredPrompt = event;
  // Update UI notify the user they can install the PWA
  // showInstallPromotion();
  // divInstall.classList.toggle('hidden', false);
});