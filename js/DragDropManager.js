// Class to manage drag and drop functionality

class DragDropManager {
  constructor() {
    // No specific state needed for this class
    console.log("DragDropManager initialized");
  }
  
  // Set up drag and drop functionality
  setupDragAndDrop() {
    console.log("Setting up drag and drop...");
    
    const contentArea = document.getElementById('entry-content');
    const imageInput = document.getElementById('entry-image');
    const previewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeButton = document.getElementById('remove-image');
    
    if (!contentArea) console.log("Content area not found");
    if (!imageInput) console.log("Image input not found");
    if (!previewContainer) console.log("Preview container not found");
    if (!imagePreview) console.log("Image preview not found");
    if (!removeButton) console.log("Remove button not found");
    
    if (!contentArea || !imageInput || !previewContainer || !imagePreview || !removeButton) {
      console.error("Required elements for drag and drop are missing");
      return; // Exit if elements not found
    }
    
    console.log("All elements found, setting up event listeners...");
    
    // Store reference to this for event handlers
    const self = this;
    
    // Setup drag and drop for the textarea
    contentArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      contentArea.classList.add('highlight-drop-zone');
    });
    
    contentArea.addEventListener('dragleave', function() {
      contentArea.classList.remove('highlight-drop-zone');
    });
    
    contentArea.addEventListener('drop', function(e) {
      e.preventDefault();
      contentArea.classList.remove('highlight-drop-zone');
      
      self.handleFiles(e.dataTransfer.files, imageInput, previewContainer, imagePreview);
    });
    
    // Also handle traditional file input changes
    imageInput.addEventListener('change', function() {
      console.log("File input change detected");
      self.handleFiles(this.files, imageInput, previewContainer, imagePreview);
    });
    
    // Remove image button functionality
    removeButton.addEventListener('click', function() {
      console.log("Remove button clicked");
      // Clear the file input
      imageInput.value = '';
      
      // Hide the preview
      previewContainer.style.display = 'none';
      imagePreview.src = '';
      
      // If using FileList objects, create a new empty one
      // Note: FileList is read-only, so this is a workaround
      try {
        const dataTransfer = new DataTransfer();
        imageInput.files = dataTransfer.files;
      } catch (e) {
        console.log('Browser does not support DataTransfer API for files');
      }
    });
    
    // Add animation effects during drag
    contentArea.addEventListener('dragenter', function() {
      // Add a subtle transform
      contentArea.style.transition = 'transform 0.2s ease';
      contentArea.style.transform = 'scale(1.01)';
    });
    
    contentArea.addEventListener('dragend', function() {
      contentArea.style.transform = 'scale(1)';
    });
    
    contentArea.addEventListener('drop', function() {
      contentArea.style.transform = 'scale(1)';
    });
    
    console.log("Drag and drop setup complete");
  }
  
  // Function to handle file selection
  handleFiles(files, imageInput, previewContainer, imagePreview) {
    console.log("Handling files:", files.length, "files received");
    
    if (files.length > 0) {
      const file = files[0];
      console.log("File type:", file.type);
      
      // Check if the file is an image
      if (file.type.match('image.*')) {
        console.log("Valid image file detected");
        const reader = new FileReader();
        
        reader.onload = function(e) {
          console.log("File loaded successfully");
          // Display the image preview
          imagePreview.src = e.target.result;
          previewContainer.style.display = 'block';
          
          // Update the file input
          // This is tricky as FileList is read-only
          // For most browsers, we can use a trick with the DataTransfer API
          try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            console.log("File added to input successfully");
          } catch (err) {
            console.error('Browser does not support DataTransfer API for files:', err);
            // Fallback: just show the preview, the actual file will be handled differently
          }
        };
        
        reader.onerror = function(e) {
          console.error("Error reading file:", e);
        };
        
        reader.readAsDataURL(file);
      } else {
        console.log("Not an image file");
        alert('Please select an image file.');
      }
    } else {
      console.log("No files provided");
    }
  }
}