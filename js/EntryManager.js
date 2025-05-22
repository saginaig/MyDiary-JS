// EntryManager depends on Entry

class EntryManager {
  constructor() {
    this.currentViewIndex = 0;
  }
  
  // Get all entries from localStorage
  getEntries() {
    return JSON.parse(localStorage.getItem("entries")) || [];
  }
  
  // Save entries to localStorage
  saveEntries(entries) {
    localStorage.setItem("entries", JSON.stringify(entries));
  }
  
  // Add a new entry
  saveEntry(entry) {
    let entries = this.getEntries();
    
    // If the entry is an Entry object, convert it to JSON
    const entryData = entry instanceof Entry ? entry.toJSON() : entry;
    
    entries.unshift(entryData); // Add to the beginning of the array for newest first
    this.saveEntries(entries);
    
    // Update UI
    this.displayEntries();
    return entries.length;
  }
  
  // Delete an entry by index
  deleteEntry(index) {
    let entries = this.getEntries();
    
    // Remove the entry from the array
    entries.splice(index, 1);
    
    // Save the updated entries back to localStorage
    this.saveEntries(entries);
    
    // Update the UI after deletion
    this.displayEntries();
  }
  
  // Update an existing entry
  updateEntry(index, updatedEntry) {
    let entries = this.getEntries();
    
    if (index >= 0 && index < entries.length) {
      entries[index] = updatedEntry;
      this.saveEntries(entries);
      return true;
    }
    return false;
  }
  
  // Get a single entry by index
  getEntry(index) {
    const entries = this.getEntries();
    if (index >= 0 && index < entries.length) {
      // Return as Entry object
      return Entry.fromJSON(entries[index]);
    }
    return null;
  }
  
  // Get all unique tags from entries
  getUniqueTags() {
    const entries = this.getEntries();
    const uniqueTags = new Set();
    
    entries.forEach(entry => {
      if (entry.tags) {
        const tags = entry.tags.split(",").map(tag => tag.trim());
        tags.forEach(tag => {
          if (tag) uniqueTags.add(tag);
        });
      }
    });
    
    return Array.from(uniqueTags);
  }
  
  // SECURITY FIX: Escape HTML to prevent XSS attacks
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Display entries with optional tag filtering
  displayEntries(filterTag = null) {
    const entriesContainer = document.querySelector(".entries-list");
    if (!entriesContainer) {
      console.error("Entries container not found");
      return;
    }
    
    entriesContainer.innerHTML = '';
    
    let entries = this.getEntries();
    let filteredEntries = entries.slice(); // Create a copy of all entries
    
    if (!Array.isArray(entries) || entries.length === 0) {
      entriesContainer.innerHTML = '<p>No entries yet. Create your first entry!</p>';
      return;
    }
    
    if (filterTag && filterTag !== "all") {
      filteredEntries = entries.filter(entry => {
        // Check if entry has tags
        if (!entry.tags || entry.tags.trim() === "") return false;
        
        // Split tags by comma and trim whitespace
        const entryTags = entry.tags.split(",").map(tag => tag.trim().toLowerCase());
        
        // Check if the filter tag is in the entry tags
        return entryTags.includes(filterTag.toLowerCase());
      });
    }
    
    if (filteredEntries.length === 0) {
      entriesContainer.innerHTML = '<p>No entries found with the selected tag. Try another filter or create a new entry!</p>';
      return;
    }
    
    // Create the HTML structure
    filteredEntries.forEach((entry, index) => {
      // Find the correct entry index in the original entries array
      const originalIndex = entries.findIndex(e => 
        e.title === entry.title && 
        e.dateTime === entry.dateTime && 
        e.content === entry.content
      );
      
      // Create the entry card
      const entryCard = document.createElement("article");
      entryCard.classList.add("entry-card");
      entryCard.setAttribute("data-index", originalIndex); // Store index as attribute
      
      // SECURITY FIX: Escape user content to prevent XSS
      let cardHTML = `
        <div class="entry-card-content">
          <h3>${this.escapeHtml(entry.title)}</h3>
          <p><strong>Date & Time:</strong> ${this.escapeHtml(entry.dateTime)}</p>
      `;
      
      // Add tags if they exist
      if (entry.tags && entry.tags.trim() !== "") {
        cardHTML += `<p><strong>Tags:</strong> ${this.escapeHtml(entry.tags)}</p>`;
      }
      
      // Add content wrapper
      cardHTML += `<p class="content ${entry.content.length > 250 ? 'long' : ''}">${this.escapeHtml(entry.content)}</p>`;
      
      // Add toggle button if content is long
      if (entry.content.length > 250) {
        cardHTML += `<button class="toggle-btn visible">Показать больше</button>`;
      }
      
      // Add image if it exists (src should be safe base64 data URL)
      if (entry.image) {
        cardHTML += `<img src="${entry.image}" alt="Entry image">`;
      }
      
      // Close the content wrapper div
      cardHTML += `</div>`;
      
      // Add action buttons as a separate, fixed section
      cardHTML += `
        <div class="entry-actions">
          <button class="delete-btn">Delete</button>
          <button class="view-btn">View</button>
          <button class="edit-btn">Edit</button>
        </div>
      `;
      
      // Set the HTML
      entryCard.innerHTML = cardHTML;
      
      // Add the card to the container
      entriesContainer.appendChild(entryCard);
    });
    
    // Add event listeners
    this.setupEntryCardEvents();
  }
  
  // Set up event listeners for entry cards
  setupEntryCardEvents() {
    const self = this; // Store reference to this for use in event handlers
    
    document.querySelectorAll('.entry-card').forEach(card => {
      const index = parseInt(card.getAttribute('data-index'));
      
      // Double-click to view
      card.addEventListener('dblclick', () => self.viewEntry(index));
      
      // Toggle button for long content
      const toggleBtn = card.querySelector('.toggle-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', e => {
          e.stopPropagation(); // Prevent double-click
          const content = card.querySelector('.content');
          content.classList.toggle('expanded');
          
          if (content.classList.contains('expanded')) {
            card.style.minHeight = 'auto';
            toggleBtn.textContent = 'Hide';
          } else {
            card.style.minHeight = '250px';
            toggleBtn.textContent = 'Expand';
          }
        });
      }
      
      // Action buttons
      const deleteBtn = card.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', e => {
          e.stopPropagation();
          self.deleteEntry(index);
        });
      }
      
      const viewBtn = card.querySelector('.view-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', e => {
          e.stopPropagation();
          console.log(`View button clicked for entry index ${index}`);
          self.viewEntry(index);
        });
      }
      
      const editBtn = card.querySelector('.edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', e => {
          e.stopPropagation();
          // Now we need to make this work with the global ModalManager
          if (window.modalManager) {
            window.modalManager.openEditForm(index);
          } else {
            console.error("Modal manager not initialized");
          }
        });
      }
    });
  }
  
  // View an entry in the modal
  viewEntry(index) {
    console.log(`viewEntry called with index: ${index}`);
    
    const entries = this.getEntries();
    console.log(`Total entries: ${entries.length}`);
    
    if (index >= 0 && index < entries.length) {
      this.currentViewIndex = index;
      const entry = entries[this.currentViewIndex];
      console.log("Entry found:", entry);
      
      // Reference the correct modal
      const modal = document.getElementById("modal1");
      console.log("Modal element:", modal);
      
      if (!modal) {
        console.error("Modal element with ID 'modal1' not found!");
        return;
      }
      
      // Update modal content
      const modalTitle = modal.querySelector(".modal-content h2");
      const modalDate = modal.querySelector(".modal-content p:nth-of-type(1)");
      const modalTags = modal.querySelector(".modal-content p:nth-of-type(2)");
      const modalContent = modal.querySelector(".modal-content p:nth-of-type(3)");
      const modalImage = modal.querySelector(".modal-content img");
      
      console.log("Modal elements:", {
        title: modalTitle,
        date: modalDate,
        tags: modalTags,
        content: modalContent,
        image: modalImage
      });
      
      // SECURITY: Using textContent is safe (already secure in your code)
      if (modalTitle) modalTitle.textContent = entry.title;
      if (modalDate) modalDate.textContent = `Date & Time: ${entry.dateTime}`;
      
      // Handle tags display
      if (modalTags) {
        if (entry.tags && entry.tags.trim() !== "") {
          modalTags.textContent = `Tags: ${entry.tags}`;
          modalTags.style.display = "block";
        } else {
          modalTags.style.display = "none";
        }
      }
      
      if (modalContent) modalContent.textContent = entry.content;
      
      // Handle image display
      if (modalImage) {
        if (entry.image) {
          modalImage.src = entry.image;
          modalImage.style.display = "block";
        } else {
          modalImage.style.display = "none";
        }
      }
      
      // Update navigation button states
      if (window.modalManager) {
        window.modalManager.updateNavButtons(entries.length);
      }
      
      // Ensure the modal has the proper class
      if (!modal.classList.contains("modal")) {
        console.log("Adding 'modal' class to modal1");
        modal.classList.add("modal");
      }
      
      // Display the modal
      console.log("Setting modal display to flex");
      if (modal) {
        modal.style.display = "flex";
      } else {
        console.error("Modal element not found");
        console.error("Invalid entry index:", index);
      }
      
      // Log the state after update
      setTimeout(() => {
        const element = document.getElementById("modal1");
        console.log(`Element modal1:`, element);
        if (element) {
          console.log(`- Display: ${element.style.display}`);
          console.log(`- Classes: ${element.className}`);
          console.log(`- Visibility: ${window.getComputedStyle(element).visibility}`);
          console.log(`- Opacity: ${window.getComputedStyle(element).opacity}`);
          console.log(`- Z-index: ${window.getComputedStyle(element).zIndex}`);
        }
      }, 100);
    } else {
      console.error("Invalid entry index:", index);
    }
  }
}