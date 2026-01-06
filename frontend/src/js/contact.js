import { getGroupedLocations } from "./api.js";
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

  // Clear container initially (remove any static content if present)
  mapContainer.innerHTML = '';
  mapContainer.className = "w-full sm:w-3/4 flex flex-col gap-6 mt-6 reveal"; // Modified container class for stacking

  // Create select dynamically
  const select = document.createElement("select");
  select.id = "location-select";
  select.className =
    "w-full sm:w-1/2 bg-luxury-base border border-white/10 text-white px-4 py-3 rounded shadow-inner mb-4";

  mapContainer.parentNode.insertBefore(select, mapContainer);

  const renderMaps = (locationsList) => {
    mapContainer.innerHTML = ''; // Clear previous maps

    if (!locationsList || locationsList.length === 0) {
      mapContainer.innerHTML = '<p class="text-gray-400 text-center">No map available for this location.</p>';
      return;
    }

    locationsList.forEach(loc => {
      const wrapper = document.createElement("div");
      wrapper.className = "w-full h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative";

      const iframe = document.createElement("iframe");
      iframe.className = "w-full h-full border-0";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = loc.map_embed_url;

      wrapper.appendChild(iframe);
      mapContainer.appendChild(wrapper);
    });
  };

  try {
    // Fetch grouped locations from backend
    const groupedCities = await getGroupedLocations();

    // Populate select options with City Names
    groupedCities.forEach((cityGroup, idx) => {
      const option = document.createElement("option");
      option.value = idx; // Store index to easily retrieve object from array
      option.textContent = cityGroup.city_name;
      select.appendChild(option);

      // Set first city as default
      if (idx === 0) renderMaps(cityGroup.locations);
    });

    // Change maps when selecting a city
    select.addEventListener("change", (e) => {
      const selectedIndex = e.target.value;
      const selectedCity = groupedCities[selectedIndex];
      if (selectedCity) {
        renderMaps(selectedCity.locations);
      }
    });

  } catch (error) {
    console.error("Error fetching locations:", error);
    mapContainer.innerHTML = '<p class="text-red-400 text-center">Failed to load locations.</p>';
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

  document.getElementById("touch").textContent =
    translations[language]["touch"];
  document.getElementById("touchp").textContent =
    translations[language]["touchp"];
  document.getElementById("touchp1").textContent =
    translations[language]["touchp1"];
  document.getElementById("reach").textContent =
    translations[language]["reach"];
  document.getElementById("reachp").textContent =
    translations[language]["reachp"];
  document.getElementById("name_placeholder").placeholder =
    translations[language]["name_placeholder"];
  document.getElementById("email_placeholder").placeholder =
    translations[language]["email_placeholder"];
  document.getElementById("subject_placeholder").placeholder =
    translations[language]["subject_placeholder"];
  document.getElementById("message_placeholder").placeholder =
    translations[language]["message_placeholder"];
  document.getElementById("send").textContent = translations[language]["send"];
  document.getElementById("locations").textContent =
    translations[language]["locations"];
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
