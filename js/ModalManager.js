// ModalManager.js (Updated)
class ModalManager {
  constructor(entryManager) {
    this.entryManager = entryManager;
  }
  
  setupModalNavigation() {
    const modal1 = document.getElementById("modal1");
    if (modal1) {
      const prevButton = modal1.querySelector("#prev-entry");
      const nextButton = modal1.querySelector("#next-entry");
      
      if (prevButton) {
        prevButton.addEventListener("click", () => {
          if (this.entryManager.currentViewIndex > 0) {
            this.entryManager.viewEntry(this.entryManager.currentViewIndex - 1);
          }
        });
      }
      
      if (nextButton) {
        nextButton.addEventListener("click", () => {
          const entries = this.entryManager.getEntries();
          if (this.entryManager.currentViewIndex < entries.length - 1) {
            this.entryManager.viewEntry(this.entryManager.currentViewIndex + 1);
          }
        });
      }
      
      window.addEventListener("click", (event) => {
        if (event.target === modal1) {
          modal1.style.display = "none";
        }
      });
      
      const closeBtn = modal1.querySelector(".close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal1.style.display = "none";
        });
      }
    }
    
    this.setupEditModal();
  }
  
  setupEditModal() {
    const editModal = document.getElementById("edit-modal");
    if (editModal) {
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
                image: existingImage
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
      
      const closeBtn = editModal.querySelector(".close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.closeEditModal();
        });
      }
    }
  }
  
  updateNavButtons(totalEntries) {
    const modal = document.getElementById("modal1");
    if (!modal) return;
    
    const prevButton = modal.querySelector("#prev-entry");
    const nextButton = modal.querySelector("#next-entry");
    
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
        
        if (titleInput) titleInput.value = entry.title;
        if (contentInput) contentInput.value = entry.content;
        if (dateInput) dateInput.value = entry.dateTime.split(" ")[0];
        if (tagsInput) tagsInput.value = entry.tags || '';
        
        if (editForm) editForm.setAttribute('data-editingIndex', index);
        
        editModal.style.display = "block";
        
        const viewModal = document.getElementById("modal1");
        if (viewModal) viewModal.style.display = "none";
      } else {
        console.error("Edit modal element not found!");
      }
    } else {
      console.error("Invalid entry index for editing:", index);
    }
  }
  
  closeEditModal() {
    const editModal = document.getElementById("edit-modal");
    if (editModal) editModal.style.display = "none";
  }
}