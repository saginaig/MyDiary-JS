// Class to manage theme
class ThemeManager {
  
    constructor() {
    }
    
    // Set up theme toggle functionality
    setupThemeToggle() {
      const toggleContainer = document.getElementById("theme-toggle-container");
      const sunCircle = document.getElementById("sun");
      const sunRays = document.getElementById("sun-rays");
      const moonShadow = document.getElementById("moon-shadow");
      
      if (!toggleContainer || !sunCircle || !sunRays || !moonShadow) {
        return; // Exit if elements not found
      }
      
      // Check if there's a saved theme in localStorage
      const savedTheme = localStorage.getItem("theme");
      
      // Set initial state based on saved theme
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        this.setMoonState(sunRays, sunCircle, moonShadow);
      }
      
      // Toggle theme when clicked
      toggleContainer.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        
        if (document.body.classList.contains("dark-mode")) {
          // Switch to moon
          this.animateToMoon(sunRays, sunCircle, moonShadow);
          localStorage.setItem("theme", "dark");
        } else {
          // Switch to sun
          this.animateToSun(sunRays, sunCircle, moonShadow);
          localStorage.setItem("theme", "light");
        }
      });
    }
    
    // Function to animate from sun to moon
    animateToMoon(sunRays, sunCircle, moonShadow) {
      // Fade out rays
      sunRays.style.animation = "raysFadeOut 0.5s forwards";
      
      // Change sun color to white (moon color)
      sunCircle.style.animation = "sunToMoon 0.5s forwards";
      
      // Show moon shadow with delay
      setTimeout(() => {
        moonShadow.style.animation = "moonShadowIn 0.3s forwards";
      }, 300);
    }
    
    // Function to animate from moon to sun
    animateToSun(sunRays, sunCircle, moonShadow) {
      // Hide moon shadow
      moonShadow.style.animation = "moonShadowOut 0.3s forwards";
      
      // Change moon back to sun color with delay
      setTimeout(() => {
        sunCircle.style.animation = "moonToSun 0.5s forwards";
        
        // Fade rays back in
        sunRays.style.animation = "raysIn 0.5s forwards";
      }, 200);
    }
    
    // Set initial moon state without animation if in dark mode
    setMoonState(sunRays, sunCircle, moonShadow) {
      sunRays.style.opacity = "0";
      sunCircle.style.fill = "#FFFFFF";
      moonShadow.style.visibility = "visible";
    }
  }