import { translations } from "./translations.js"; // On importe l'objet contenant toutes les traductions

// On récupère les éléments <select> du menu principal et de la sidebar
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

// Quand la page est entièrement chargée
window.addEventListener("DOMContentLoaded", () => {
  // On récupère la langue sauvegardée dans le stockage local, ou on met "fr" par défaut
  const savedLang = localStorage.getItem("language") || "fr";

  // On applique cette langue à l’interface
  updateLanguage(savedLang);

  // On met à jour la sélection dans les deux menus déroulants
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;
});

// Quand on clique sur l'icône du menu (hamburger ou autre)
document.getElementById("sidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex"; // On affiche la sidebar
});

// Quand on clique sur la croix de fermeture de la sidebar
document.getElementById("close").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none"; // On cache la sidebar
});

// Fonction pour mettre à jour les textes de l’interface selon la langue choisie
function updateLanguage(language) {
  // On sauvegarde la langue sélectionnée dans le stockage local
  localStorage.setItem("language", language);

  // On récupère les éléments de navigation
  const home = document.querySelector(".home");
  const cars = document.querySelector(".cars");
  const book = document.querySelector(".book");
  const about = document.querySelector(".about");
  const contact = document.querySelector(".contact");
  const contactus = document.querySelector(".contactus");
  const contacttel = document.querySelector(".contact-tel");
  const contactemail = document.querySelector(".contact-email");
  const contactadresse = document.querySelector(".contact-adresse");
  const contacthoraire = document.querySelector(".contact-horaire");
  const homesidebar = document.querySelector(".home1");
  const carssidebar = document.querySelector(".cars1");
  const booksidebar = document.querySelector(".book1");
  const aboutsidebar = document.querySelector(".about1");
  const contactsidebar = document.querySelector(".contact1");

  // On met à jour les textes avec les traductions correspondant à la langue choisie
  contact.textContent = translations[language]["contact"];
  home.textContent = translations[language]["acceuil"];
  cars.textContent = translations[language]["voitures"];
  book.textContent = translations[language]["reserver"];
  about.textContent = translations[language]["apropos"];
  homesidebar.textContent = translations[language]["acceuil"];
  carssidebar.textContent = translations[language]["voitures"];
  booksidebar.textContent = translations[language]["reserver"];
  aboutsidebar.textContent = translations[language]["apropos"];
  contactsidebar.textContent = translations[language]["contact"];

  if (language == "ar") {
    // Cas de la langue arabe: alignement à droite
    contacttel.textContent = translations[language]["contacttel"];
    contacttel.style.textAlign = "right";
    contactemail.textContent = translations[language]["contactemail"];
    contactemail.style.textAlign = "right";
    contactadresse.textContent = translations[language]["contactadresse"];
    contactadresse.style.textAlign = "right";
    contacthoraire.textContent = translations[language]["contacthoraire"];
    contacthoraire.style.textAlign = "right";
    contactus.textContent = translations[language]["contactus"];
    contactus.style.textAlign = "right";
  } else {
    // Autres langues : alignement à gauche avec texte normal
    contacttel.textContent = translations[language]["contacttel"];
    contacttel.style.textAlign = "left";
    contactemail.textContent = translations[language]["contactemail"];
    contactemail.style.textAlign = "left";
    contactadresse.textContent = translations[language]["contactadresse"];
    contactadresse.style.textAlign = "left";
    contacthoraire.textContent = translations[language]["contacthoraire"];
    contacthoraire.style.textAlign = "left";
    contactus.textContent = translations[language]["contactus"];
    contactus.style.textAlign = "left";
  }
}

// Quand l’utilisateur change la langue dans la sidebar
document.getElementById("languages1").addEventListener("change", (e) => {
  const language = e.target.value;
  languagesSelect.value = language; // On synchronise le menu principal
  updateLanguage(language); // Et on applique la langue
});

// Quand l’utilisateur change la langue dans le menu principal
document.getElementById("languages").addEventListener("change", (e) => {
  const language = e.target.value;
  updateLanguage(language); // On applique la langue
  languagesSelectSidebar.value = language; // On synchronise la sidebar
});
