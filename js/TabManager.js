// Class to manage tab navigation
class TabManager {
    constructor() {
    }
    
    // Set up tab navigation
    setupTabNavigation() {
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabPanes = document.querySelectorAll('.tab-pane');
      
      if (tabButtons.length === 0) return;
      
      // Function to activate a specific tab
      const activateTab = (tabId, pushState = false) => {
        // Find the button for this tab
        const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        
        // If tab button doesn't exist, return
        if (!targetButton) return;
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to target button and corresponding pane
        targetButton.classList.add('active');
        const targetPane = document.getElementById(tabId);
        if (targetPane) targetPane.classList.add('active');
        
        // Update history state if requested
        if (pushState) {
          history.pushState({tab: tabId}, '', `#${tabId}`);
        }
      };
      
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabToActivate = this.getAttribute('data-tab');
          activateTab(tabToActivate, true); // Push state to history
        });
      });
      
      // Handle history navigation
      window.addEventListener('popstate', function(e) {
        // If state exists and has a tab property
        if (e.state && e.state.tab) {
          activateTab(e.state.tab, false); // Don't push state when handling history events
        } else {
          // If no state (like initial page load), use the URL hash
          const hash = window.location.hash ? window.location.hash.substring(1) : null;
          if (hash) {
            activateTab(hash, false);
          } else {
            // Default to first tab if no hash
            const defaultTab = tabButtons[0].getAttribute('data-tab');
            activateTab(defaultTab, false);
          }
        }
      });
      
      // Set initial state on page load
      const initialTab = window.location.hash ? window.location.hash.substring(1) : tabButtons[0].getAttribute('data-tab');
      
      // Check if the hash corresponds to a valid tab
      const validTab = document.querySelector(`.tab-button[data-tab="${initialTab}"]`) ? 
                      initialTab : tabButtons[0].getAttribute('data-tab');
      
      // Activate the initial tab and set initial history state
      activateTab(validTab, false);
      history.replaceState({tab: validTab}, '', `#${validTab}`);
    }
  }
  