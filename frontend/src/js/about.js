//importer l'objet translations
import { translations } from "./translations.js";

//declarer les selecteurs de langues
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "fr";
  updateLanguage(savedLang);
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;
});

//changer la langue si la valeur du selecteur de langues au niveau de la barre laterale change
document.getElementById("languages1").addEventListener("change", (e) => {
  const language = e.target.value;
  languagesSelect.value = language;
  updateLanguage(language);
});

//changer la langue si la valeur du selecteur de langues change
document.getElementById("languages").addEventListener("change", (e) => {
  const language = e.target.value;
  updateLanguage(language);
  languagesSelectSidebar.value = language;
});

function updateLanguage(language) {
  if (!language) return;

  localStorage.setItem("language", language);

  // ===== NAV =====
  const navFleet = document.querySelectorAll("a[href*='cars.html']");
  const navAbout = document.querySelectorAll("a[href*='about.html']");
  const navLogin = document.querySelectorAll("a[href*='login.html']");

  navFleet.forEach((el) => (el.textContent = translations[language]["fleet"]));
  navAbout.forEach((el) => (el.textContent = translations[language]["about"]));
  navLogin.forEach((el) => (el.textContent = translations[language]["login"]));

  // ===== HERO =====
  const heroTagline = document.querySelector("header p");
  const heroTitle1 = document.querySelector("header h1");
  const heroDesc = document.querySelector("header p.text-gray-300");

  if (heroTagline)
    heroTagline.textContent = translations[language]["hero_tagline"];

  if (heroTitle1)
    heroTitle1.innerHTML = `
      ${translations[language]["hero_title_1"]} <br />
      <span class="text-gradient">${translations[language]["hero_title_2"]}</span>
    `;

  if (heroDesc) heroDesc.textContent = translations[language]["hero_text"];

  const who = document.getElementById("who");
  const ourStory = document.getElementById("our_story");
  who.textContent = translations[language]["who"];
  ourStory.textContent = translations[language]["our_story"];
}

// 1. Navbar Scroll Effect
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
