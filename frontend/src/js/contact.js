import { getLocations } from "./api.js";
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
    const locations = await getLocations();

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
