// ThemeManager.js
class ThemeManager {
  constructor() {
  }
  
  setupThemeToggle() {
    const toggleContainer = document.getElementById("theme-toggle-container");
    const sunCircle = document.getElementById("sun");
    const sunRays = document.getElementById("sun-rays");
    const moonShadow = document.getElementById("moon-shadow");
    
    if (!toggleContainer || !sunCircle || !sunRays || !moonShadow) {
      return;
    }
    
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      this.setMoonState(sunRays, sunCircle, moonShadow);
    }
    
    toggleContainer.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      
      if (document.body.classList.contains("dark-mode")) {
        this.animateToMoon(sunRays, sunCircle, moonShadow);
        localStorage.setItem("theme", "dark");
      } else {
        this.animateToSun(sunRays, sunCircle, moonShadow);
        localStorage.setItem("theme", "light");
      }
    });
  }
  
  animateToMoon(sunRays, sunCircle, moonShadow) {
    sunRays.style.animation = "raysFadeOut 0.5s forwards";
    sunCircle.style.animation = "sunToMoon 0.5s forwards";
    
    setTimeout(() => {
      moonShadow.style.animation = "moonShadowIn 0.3s forwards";
    }, 300);
  }
  
  animateToSun(sunRays, sunCircle, moonShadow) {
    moonShadow.style.animation = "moonShadowOut 0.3s forwards";
    
    setTimeout(() => {
      sunCircle.style.animation = "moonToSun 0.5s forwards";
      sunRays.style.animation = "raysIn 0.5s forwards";
    }, 200);
  }
  
  setMoonState(sunRays, sunCircle, moonShadow) {
    sunRays.style.opacity = "0";
    sunCircle.style.fill = "#FFFFFF";
    moonShadow.style.visibility = "visible";
  }
}
