// Class to manage UI interactions
class UIManager {
    constructor(entryManager) {
      this.entryManager = entryManager;
    }
    
    // Set up close buttons for modals
    setupCloseButtons() {
      document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          const modal = this.closest(".modal");
          if (modal) {
            modal.style.display = "none";
          }
        });
      });
    }
  }