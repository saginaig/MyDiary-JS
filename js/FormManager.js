// Class to manage forms and input handling
class FormManager {
    constructor(entryManager) {
      this.entryManager = entryManager;
    }
    
    // Set up form submission listeners
    setupFormListeners() {
      const entryForm = document.getElementById("entry-form");
      if (entryForm) {
        entryForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
      }
    }
    
    // Handle form submission
    handleFormSubmit(event) {
      event.preventDefault(); // Prevent form from submitting
      
      // Get the values from the form
      const title = document.getElementById("entry-title")?.value || "";
      const content = document.getElementById("entry-content")?.value || "";
      const date = document.getElementById("entry-date")?.value || "";
      const tags = document.getElementById("entry-tags")?.value || "";
      const imageFile = document.getElementById("entry-image")?.files[0];
      
      const time = new Date().toTimeString().split(' ')[0].slice(0, 5);
      // Combine date and time into one string
      const dateTime = `${date} ${time}`;
      
      // Create an Entry object instead of plain object
      let newEntry = new Entry(title, content, dateTime, tags, null);
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newEntry.image = event.target.result; // Save as Data URL
          this.entryManager.saveEntry(newEntry);
          this.resetForm();
        };
        reader.readAsDataURL(imageFile);
      } else {
        this.entryManager.saveEntry(newEntry);
        this.resetForm();
      }
    }
    
    // Reset the form fields after submission
    resetForm() {
      // Clear form fields manually
      if (document.getElementById("entry-title")) document.getElementById("entry-title").value = "";
      if (document.getElementById("entry-content")) document.getElementById("entry-content").value = "";
      if (document.getElementById("entry-tags")) document.getElementById("entry-tags").value = "";
      if (document.getElementById("entry-image")) document.getElementById("entry-image").value = "";
      
      // Clear image preview
      const previewContainer = document.getElementById("image-preview-container");
      if (previewContainer) {
        previewContainer.style.display = "none";
        const imagePreview = document.getElementById("image-preview");
        if (imagePreview) imagePreview.src = "";
      }
      
      // Reset date to current date
      const dateField = document.getElementById("entry-date");
      if (dateField) dateField.value = new Date().toISOString().split('T')[0];
    }
  }
  