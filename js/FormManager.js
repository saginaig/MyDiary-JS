class FormManager {
  constructor(entryManager) {
    this.entryManager = entryManager;
  }
  
  setupFormListeners() {
    const entryForm = document.getElementById("entry-form-form");
    if (entryForm) {
      entryForm.addEventListener("submit", (event) => this.handleFormSubmit(event));
    }
  }
  
  handleFormSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById("entry-title")?.value.trim() || "";
    const content = document.getElementById("entry-content")?.value.trim() || "";
    const date = document.getElementById("entry-date")?.value || "";
    const tags = document.getElementById("entry-tags")?.value.trim() || "";
    const imageFile = document.getElementById("entry-image")?.files[0];
    
    if (!title || !content || !date) {
      alert("Please fill in all required fields (Title, Content, Date)");
      return;
    }
    
    if (imageFile && !SecurityUtils.isValidImageType(imageFile)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }
    
    const time = new Date().toTimeString().split(' ')[0].slice(0, 5);
    const dateTime = `${date} ${time}`;
    
    let newEntry = new Entry(title, content, dateTime, tags, null);
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newEntry.image = event.target.result;
        this.entryManager.saveEntry(newEntry);
        this.resetForm();
      };
      reader.readAsDataURL(imageFile);
    } else {
      this.entryManager.saveEntry(newEntry);
      this.resetForm();
    }
  }
  
  resetForm() {
    if (document.getElementById("entry-title")) document.getElementById("entry-title").value = "";
    if (document.getElementById("entry-content")) document.getElementById("entry-content").value = "";
    if (document.getElementById("entry-tags")) document.getElementById("entry-tags").value = "";
    if (document.getElementById("entry-image")) document.getElementById("entry-image").value = "";
    
    const previewContainer = document.getElementById("image-preview-container");
    if (previewContainer) {
      previewContainer.style.display = "none";
      const imagePreview = document.getElementById("image-preview");
      if (imagePreview) imagePreview.src = "";
    }
    
    const dateField = document.getElementById("entry-date");
    if (dateField) dateField.value = new Date().toISOString().split('T')[0];
  }
}