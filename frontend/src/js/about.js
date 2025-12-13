// Importer l'objet de traductions depuis le fichier translations.js
import { translations } from "./translations.js";

// Récupérer les éléments de sélection de langue dans le header et la sidebar
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

// Quand le contenu de la page est entièrement chargé
window.addEventListener("DOMContentLoaded", () => {
  // Récupérer la langue enregistrée dans le localStorage, ou utiliser "fr" par défaut
  const savedLang = localStorage.getItem("language") || "fr";

  // Appliquer la langue choisie à tous les éléments du site
  updateLanguage(savedLang);

  // Mettre à jour la valeur des menus déroulants de langue
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;
});

// Afficher la sidebar quand on clique sur l'icône du menu
document.getElementById("sidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex"; // Afficher la sidebar
});

// Cacher la sidebar quand on clique sur le bouton de fermeture
document.getElementById("close").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none"; // Masquer la sidebar
});

/**
 * Met à jour les textes de la page selon la langue sélectionnée
 * Le code de la langue (ex : "fr", "en", "ar")
 */
function updateLanguage(language) {
  // Enregistrer la langue choisie dans le localStorage
  localStorage.setItem("language", language);

  // Récupérer les éléments HTML à traduire
  const home = document.querySelector(".home");
  const cars = document.querySelector(".cars");
  const book = document.querySelector(".book");
  const about = document.querySelector(".about");
  const titre = document.querySelector(".titreabout");
  const paragraph1 = document.getElementById("p1");
  const paragraph2 = document.getElementById("p2");
  const contact = document.querySelector(".contact");
  const homesidebar = document.querySelector(".home1");
  const carssidebar = document.querySelector(".cars1");
  const booksidebar = document.querySelector(".book1");
  const aboutsidebar = document.querySelector(".about1");
  const contactsidebar = document.querySelector(".contact1");

  // Mettre à jour les contenus textes avec la langue choisie
  contact.textContent = translations[language]["contact"];
  home.textContent = translations[language]["acceuil"];
  cars.textContent = translations[language]["voitures"];
  book.textContent = translations[language]["reserver"];
  about.textContent = translations[language]["apropos"];
  titre.textContent = translations[language]["titre"];
  homesidebar.textContent = translations[language]["acceuil"];
  carssidebar.textContent = translations[language]["voitures"];
  booksidebar.textContent = translations[language]["reserver"];
  aboutsidebar.textContent = translations[language]["apropos"];
  contactsidebar.textContent = translations[language]["contact"];

  // Cas particulier pour la langue arabe (alignement à droite + suppression des points)
  if (language == "ar") {
    paragraph1.textContent = translations[language]["p1"].replace(/[.]/g, "");
    paragraph1.style.textAlign = "right";
    paragraph2.textContent = translations[language]["p1"].replace(/[.]/g, "");
    paragraph2.style.textAlign = "right";
  } else {
    // Autres langues : alignement à gauche avec texte normal
    paragraph1.textContent = translations[language]["p1"];
    paragraph1.style.textAlign = "left";
    paragraph2.textContent = translations[language]["p1"];
    paragraph2.style.textAlign = "left";
  }
}

// Quand l'utilisateur change la langue dans la sidebar
document.getElementById("languages1").addEventListener("change", (e) => {
  const language = e.target.value;
  languagesSelect.value = language; // Synchroniser avec le menu principal
  updateLanguage(language); // Appliquer la traduction
});

// Quand l'utilisateur change la langue dans le menu principal (navbar)
document.getElementById("languages").addEventListener("change", (e) => {
  const language = e.target.value;
  updateLanguage(language); // Appliquer la traduction
  languagesSelectSidebar.value = language; // Synchroniser avec la sidebar
});
