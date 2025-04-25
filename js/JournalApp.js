// Main App class to initialize and coordinate components
class JournalApp {
  constructor() {
    // Main components
    this.entryManager = new EntryManager();
    
    // Create and store UI components (making them available globally)
    this.uiManager = new UIManager(this.entryManager);
    this.modalManager = new ModalManager(this.entryManager);
    this.formManager = new FormManager(this.entryManager);
    this.filterManager = new FilterManager(this.entryManager);
    this.tabManager = new TabManager();
    this.themeManager = new ThemeManager();
    this.dragDropManager = new DragDropManager();
    
    // Track network status
    this.isOnline = navigator.onLine;
    
    // Make important managers available globally (not ideal practice but helps with the current structure)
    window.entryManager = this.entryManager;
    window.modalManager = this.modalManager;
    window.filterManager = this.filterManager;
    
    // Register service worker
    this.registerServiceWorker();
    
    // Setup network status monitoring
    this.setupNetworkStatusMonitoring();
  }
  
  // Initialize the application
  init() {
    console.log("Initializing JournalApp...");
    
    // Set current date right away (don't wait for DOMContentLoaded)
    this.setCurrentDate();
    
    // Display any existing entries
    this.entryManager.displayEntries();
    
    // Initialize UI components
    this.modalManager.setupModalNavigation();
    this.filterManager.setupCategoryFilter();
    this.tabManager.setupTabNavigation();
    this.dragDropManager.setupDragAndDrop();
    this.themeManager.setupThemeToggle();
    this.formManager.setupFormListeners();
    
    // Set up close buttons for modals
    this.uiManager.setupCloseButtons();
    
    console.log("JournalApp initialized successfully");
  }
  
  // Set current date in the entry form
  setCurrentDate() {
    const dateField = document.getElementById("entry-date");
    if (dateField) {
      const today = new Date();
      const currentDate = today.toISOString().split('T')[0];
      const currentTime = today.toTimeString().split(' ')[0].slice(0, 5);
      dateField.value = currentDate;
      console.log(`Current Date: ${currentDate}, Current Time: ${currentTime}`);
    }
  }
  
  // Register service worker for offline functionality
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }
  
  // Setup simple network status monitoring
  setupNetworkStatusMonitoring() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log("🟢 Online");
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log("🔴 Offline");
    });
  }
  
  // Create a new instance and initialize the app
  static start() {
    console.log("Starting JournalApp...");
    const app = new JournalApp();
    app.init();
    window.journalApp = app; // Make it globally available
    return app;
  }
}