//importer l'objet translations
import { translations } from "./translations.js";

//declarer les selecteurs de langues
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

//ouvrir la barre laterale
document.getElementById("sidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
});

//fermer la barre laterale
document.getElementById("close").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
});

// Lorsque le contenu de la page est entièrement chargé, ce code récupère la langue précédemment choisie par l'utilisateur (depuis le localStorage)
// ou utilise "fr" (français) comme langue par défaut si aucune n'est trouvée.
// Ensuite, il met à jour l'interface avec la langue sélectionnée et synchronise les menus déroulants principaux et de la barre latérale avec cette langue.
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

// Met à jour la langue de l’interface en fonction du choix de l’utilisateur et modifie le texte de tous les éléments concernés.
function updateLanguage(language) {
  // Enregistre la langue choisie dans le stockage local du navigateur.
  localStorage.setItem("language", language);

  // Récupère tous les éléments de la page qui doivent être traduits selon la langue sélectionnée.
  const home = document.querySelector(".home");
  const cars = document.querySelector(".cars");
  const about = document.querySelector(".about");
  const homesidebar = document.querySelector(".home1");
  const carssidebar = document.querySelector(".cars1");
  const aboutsidebar = document.querySelector(".about1");
  const contactsidebar = document.querySelector(".contact1");
  const hero = document.getElementById("hero-title");
  const contact = document.querySelector(".contact");
  const herotext = document.querySelector(".hero-text");
  const explorebtn = document.getElementById("explore-btn");

  // Met à jour le texte de chaque élément avec la traduction correspondant à la langue choisie.
  homesidebar.textContent = translations[language]["acceuil"];
  carssidebar.textContent = translations[language]["voitures"];
  aboutsidebar.textContent = translations[language]["apropos"];
  contactsidebar.textContent = translations[language]["contact"];
  contact.textContent = translations[language]["contact"];
  home.textContent = translations[language]["acceuil"];
  cars.textContent = translations[language]["voitures"];
  about.textContent = translations[language]["apropos"];
  explorebtn.textContent = translations[language]["explorebtn"];
  hero.textContent = translations[language]["hero"];
  herotext.textContent = translations[language]["herotext"];
}

// Lorsqu’on clique sur le bouton "Explorer", applique un effet de fondu puis redirige vers la page cars.html après 0,5 seconde.
document.getElementById("explore-btn").addEventListener("click", () => {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "cars.html";
  }, 500);
});
