// Class to manage filtering and tags
class FilterManager {
    constructor(entryManager) {
      this.entryManager = entryManager;
    }
    
    // Setup category filter
    setupCategoryFilter() {
      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
          console.log("Filter changed to:", categoryFilter.value);
          this.entryManager.displayEntries(categoryFilter.value);
        });
        
        // Initial population of the filter dropdown
        this.populateTagFilter();
      }
    }
    
    // Function to populate the filter dropdown with unique tags from entries
    populateTagFilter() {
      const categoryFilter = document.getElementById("category-filter");
      if (!categoryFilter) return;
      
      // Clear existing options except "All"
      while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
      }
      
      // Get unique tags
      const uniqueTags = this.entryManager.getUniqueTags();
      
      // Add unique tags as options
      uniqueTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag.toLowerCase();
        option.textContent = tag;
        categoryFilter.appendChild(option);
      });
    }
  }
  