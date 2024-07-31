function removeFlash() {
    setTimeout(() => {
      const alert = document.querySelector('.alert.fade.show');
      if (alert) {
        alert.style.opacity = '0'; // Start fade out
        setTimeout(() => {
          alert.remove(); // Remove from DOM after fade out
        }, 500); // Match the duration of the CSS transition
      }
    }, 5000); // 3 seconds delay before starting the fade-out
  }

  // Call the function to set the timeout
  removeFlash();