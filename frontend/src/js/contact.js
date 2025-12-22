import { translations } from "./translations.js";
import axios from "axios";

// On récupère les éléments <select> du menu principal et de la sidebar
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

// Quand la page est entièrement chargée
window.addEventListener("DOMContentLoaded", async () => {
  // On récupère la langue sauvegardée dans le stockage local, ou on met "fr" par défaut
  const savedLang = localStorage.getItem("language") || "fr";

  // On applique cette langue à l’interface
  updateLanguage(savedLang);

  // On met à jour la sélection dans les deux menus déroulants
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;

  const mapContainer = document.getElementById("map-container");

  // Create select dynamically
  const select = document.createElement("select");
  select.id = "location-select";
  select.className =
    "w-full sm:w-1/2 bg-luxury-base border border-white/10 text-white px-4 py-3 rounded shadow-inner mb-4";

  mapContainer.parentNode.insertBefore(select, mapContainer);

  // Create iframe for the map
  const mapIframe = document.createElement("iframe");
  mapIframe.id = "map-iframe";
  mapIframe.className = "w-full h-full border-0";
  mapIframe.allowFullscreen = true;
  mapIframe.loading = "lazy";
  mapIframe.referrerPolicy = "no-referrer-when-downgrade";

  mapContainer.appendChild(mapIframe);

  try {
    // Fetch locations from backend
    const response = await axios.get("http://localhost:3000/api/locations");
    const locations = response.data; // array of { city_name, map_embed_url }

    // Populate select options
    locations.forEach((loc, idx) => {
      const option = document.createElement("option");
      option.value = loc.city_name;
      option.textContent = loc.city_name;
      select.appendChild(option);

      // Set first location as default
      if (idx === 0) mapIframe.src = loc.map_embed_url;
    });

    // Change map when selecting a city
    select.addEventListener("change", (e) => {
      const selected = locations.find(
        (loc) => loc.city_name === e.target.value
      );
      if (selected) mapIframe.src = selected.map_embed_url;
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    mapIframe.src = ""; // optional fallback
  }
});

// Fonction pour mettre à jour les textes de l’interface selon la langue choisie
function updateLanguage(language) {
  localStorage.setItem("language", language);
  const nav_contact = document.getElementById("nav_contact");

  nav_contact.textContent = translations[language]["contact"];

  // ===== NAV =====
  const navFleet = document.querySelectorAll("nav a[href*='cars.html']");
  const navAbout = document.querySelectorAll("a[href*='about.html']");
  const navLogin = document.querySelectorAll("a[href*='login.html']");

  navFleet.forEach((el) => (el.textContent = translations[language]["fleet"]));
  navAbout.forEach((el) => (el.textContent = translations[language]["about"]));
  navLogin.forEach((el) => (el.textContent = translations[language]["login"]));
}

// Quand l’utilisateur change la langue dans la sidebar
document.getElementById("languages1").addEventListener("change", (e) => {
  const language = e.target.value;
  languagesSelect.value = language;
  updateLanguage(language);
});

// Quand l’utilisateur change la langue dans le menu principal
document.getElementById("languages").addEventListener("change", (e) => {
  const language = e.target.value;
  updateLanguage(language);
  languagesSelectSidebar.value = language;
});

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("glass-nav");
    navbar.classList.remove("py-6");
    navbar.classList.add("py-4");
  } else {
    navbar.classList.remove("glass-nav");
    navbar.classList.remove("py-4");
    navbar.classList.add("py-6");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function toggleMenu() {
  mobileMenu.classList.toggle("translate-x-full");
  document.body.classList.toggle("overflow-hidden");
}
mobileMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);

// 4. USER AUTH & AVATAR LOGIC (CRITICAL)
document.addEventListener("DOMContentLoaded", () => {
  updateNavbarUser();
});

function updateNavbarUser() {
  // Retrieve user data
  const token = localStorage.getItem("token");
  const firstname = localStorage.getItem("first_name") || "Client";
  const lastname = localStorage.getItem("last_name") || "";
  const email = localStorage.getItem("email") || "user@autolux.ma";

  // Select DOM Elements
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navUserInfo = document.getElementById("nav-user-info");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");
  const mobileUserInfo = document.getElementById("mobile-user-info");

  // Logic
  if (token) {
    // --- USER IS LOGGED IN ---

    // 1. Hide Login Buttons
    if (navLoginBtn) navLoginBtn.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";

    // 2. Prepare Avatar Data
    const initials = (firstname[0] + (lastname[0] || "")).toUpperCase();
    const fullName = `${firstname} ${lastname}`.trim();

    // 3. HTML Structure for Avatar + Dropdown
    const avatarHTML = `
            <button class="custom-avatar-btn" title="${fullName}">
                ${initials}
            </button>
            <div class="glass-dropdown">
                <div class="dropdown-header">
                    <p class="dropdown-name">${fullName}</p>
                    <p class="dropdown-email">${email}</p>
                </div>
                <div class="dropdown-body">
                    <button class="dropdown-item">
                        <i class="fa-solid fa-user"></i> Profile
                    </button>
                    <button class="dropdown-item">
                        <i class="fa-solid fa-gear"></i> Settings
                    </button>
                    <button class="dropdown-item logout" onclick="handleLogout()">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
          `;

    // 4. Inject into Desktop Navbar
    if (navUserInfo) {
      navUserInfo.classList.remove("hidden");
      navUserInfo.classList.add("flex");
      navUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(navUserInfo);
    }

    // 5. Inject into Mobile Menu
    if (mobileUserInfo) {
      mobileUserInfo.classList.remove("hidden");
      mobileUserInfo.classList.add("flex");
      mobileUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(mobileUserInfo);
    }
  } else {
    // --- USER IS GUEST ---
    if (navLoginBtn) navLoginBtn.style.display = "block";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
    if (navUserInfo) navUserInfo.classList.add("hidden");
    if (mobileUserInfo) mobileUserInfo.classList.add("hidden");
  }
}

// Helper to handle Dropdown Toggling
function setupDropdownListeners(container) {
  const btn = container.querySelector(".custom-avatar-btn");
  const dropdown = container.querySelector(".glass-dropdown");

  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close any other open dropdowns first
      document.querySelectorAll(".glass-dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  }
}

// Handle Logout
window.handleLogout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("email");
  window.location.reload(); // Refresh page to reset UI
};

// Close Dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".custom-avatar-btn") &&
    !e.target.closest(".glass-dropdown")
  ) {
    document.querySelectorAll(".glass-dropdown").forEach((d) => {
      d.classList.remove("active");
    });
  }
});

// send message

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      const successMessage = document.createElement("div");
      successMessage.className =
        "mt-4 p-4 bg-luxury-gold/20 text-luxury-gold rounded-lg text-center font-semibold";
      successMessage.textContent = "Thank you! Your message has been sent.";
      form.appendChild(successMessage);

      form.reset();
      setTimeout(() => successMessage.remove(), 5000);
    } else {
      alert(data.error || "Failed to send message. Try again later.");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending message. Check console for details.");
  }
});
