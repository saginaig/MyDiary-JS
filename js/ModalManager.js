
// Class to manage modals
class ModalManager {
    constructor(entryManager) {
      this.entryManager = entryManager;
    }
    
    // Set up modal navigation
    setupModalNavigation() {
      const modal1 = document.getElementById("modal1");
      if (modal1) {
        // Previous entry button
        const prevButton = modal1.querySelector(".nav-arrows button:first-child");
        if (prevButton) {
          prevButton.addEventListener("click", () => {
            if (this.entryManager.currentViewIndex > 0) {
              this.entryManager.viewEntry(this.entryManager.currentViewIndex - 1);
            }
          });
        }
        
        // Next entry button
        const nextButton = modal1.querySelector(".nav-arrows button:last-child");
        if (nextButton) {
          nextButton.addEventListener("click", () => {
            const entries = this.entryManager.getEntries();
            if (this.entryManager.currentViewIndex < entries.length - 1) {
              this.entryManager.viewEntry(this.entryManager.currentViewIndex + 1);
            }
          });
        }
        
        // Close on outside click
        window.addEventListener("click", (event) => {
          if (event.target === modal1) {
            modal1.style.display = "none";
          }
        });
      }
      
      // Set up edit modal events
      this.setupEditModal();
    }
    
    // Set up edit modal events
    setupEditModal() {
      const editModal = document.getElementById("edit-modal");
      if (editModal) {
        // Form submission
        const editForm = editModal.querySelector("#edit-form");
        if (editForm) {
          editForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const titleInput = editModal.querySelector("#edit-title");
            const contentInput = editModal.querySelector("#edit-content");
            const dateInput = editModal.querySelector("#edit-date");
            const tagsInput = editModal.querySelector("#edit-tags");
            const imageFileInput = editModal.querySelector("#edit-image");
            
            const title = titleInput ? titleInput.value : "";
            const content = contentInput ? contentInput.value : "";
            const date = dateInput ? dateInput.value : "";
            const tags = tagsInput ? tagsInput.value : "";
            const imageFile = imageFileInput ? imageFileInput.files[0] : null;
            
            const editingIndex = parseInt(editForm.getAttribute('data-editingIndex'));
            
            if (!isNaN(editingIndex)) {
              const entries = this.entryManager.getEntries();
              
              if (editingIndex >= 0 && editingIndex < entries.length) {
                const existingEntry = entries[editingIndex];
                const existingImage = existingEntry ? existingEntry.image : null;
                
                const updatedEntry = {
                  title,
                  content,
                  dateTime: `${date} ${new Date().toTimeString().split(' ')[0].slice(0, 5)}`,
                  tags,
                  image: existingImage // Keep existing image by default
                };
                
                if (imageFile) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    updatedEntry.image = event.target.result;
                    this.entryManager.updateEntry(editingIndex, updatedEntry);
                    this.closeEditModal();
                    this.entryManager.displayEntries();
                  };
                  reader.readAsDataURL(imageFile);
                } else {
                  this.entryManager.updateEntry(editingIndex, updatedEntry);
                  this.closeEditModal();
                  this.entryManager.displayEntries();
                }
              }
            }
            
            editForm.reset();
          });
        }
      }
    }
    
    // Update navigation buttons based on current position
    updateNavButtons(totalEntries) {
      const modal = document.getElementById("modal1");
      if (!modal) return;
      
      const prevButton = modal.querySelector(".nav-arrows button:first-child");
      const nextButton = modal.querySelector(".nav-arrows button:last-child");
      
      if (prevButton) {
        if (this.entryManager.currentViewIndex <= 0) {
          prevButton.classList.add("disabled");
          prevButton.disabled = true;
        } else {
          prevButton.classList.remove("disabled");
          prevButton.disabled = false;
        }
      }
      
      if (nextButton) {
        if (this.entryManager.currentViewIndex >= totalEntries - 1) {
          nextButton.classList.add("disabled");
          nextButton.disabled = true;
        } else {
          nextButton.classList.remove("disabled");
          nextButton.disabled = false;
        }
      }
    }
    
    // Open the edit form for an entry
    openEditForm(index) {
      const entry = this.entryManager.getEntry(index);
      
      if (entry) {
        const editModal = document.getElementById("edit-modal");
        
        if (editModal) {
          const editForm = editModal.querySelector("#edit-form");
          const titleInput = editModal.querySelector("#edit-title");
          const contentInput = editModal.querySelector("#edit-content");
          const dateInput = editModal.querySelector("#edit-date");
          const tagsInput = editModal.querySelector("#edit-tags");
          
          // Set form values
          if (titleInput) titleInput.value = entry.title;
          if (contentInput) contentInput.value = entry.content;
          if (dateInput) dateInput.value = entry.dateTime.split(" ")[0]; // Only date part
          if (tagsInput) tagsInput.value = entry.tags || '';
          
          // Store editing index
          if (editForm) editForm.setAttribute('data-editingIndex', index);
          
          // Show edit modal
          editModal.style.display = "block";
          
          // Hide view modal
          const viewModal = document.getElementById("modal1");
          if (viewModal) viewModal.style.display = "none";
        } else {
          console.error("Edit modal element not found!");
        }
      } else {
        console.error("Invalid entry index for editing:", index);
      }
    }
    
    // Close the edit modal
    closeEditModal() {
      const editModal = document.getElementById("edit-modal");
      if (editModal) editModal.style.display = "none";
    }
  }