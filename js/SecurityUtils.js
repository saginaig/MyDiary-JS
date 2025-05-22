//XSS attacks prevention

class SecurityUtils {
    static escapeHtml(unsafe) {
      if (typeof unsafe !== 'string') {
        return unsafe;
      }
      
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    static safeSetText(element, text) {
      if (element) {
        element.textContent = text;
      }
    }
    
    static safeSetHTML(element, html) {
      if (element) {
        element.innerHTML = SecurityUtils.escapeHtml(html);
      }
    }
    
    static isValidImageType(file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(file.type);
    }
  }