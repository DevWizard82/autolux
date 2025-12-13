// Importation des traductions depuis le fichier translations.js
import { getcars } from "./api.js";
import { translations } from "./translations.js";

// Récupération des sélecteurs de langue depuis le DOM
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

//afficher la barre laterale
document.getElementById("sidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
});

//fermer la barre laterale
document.getElementById("close").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
});

// Fonction pour mettre à jour la langue de l’interface
function updateLanguage(language) {
  // Sauvegarde de la langue choisie dans le localStorage
  localStorage.setItem("language", language);

  // Sélection des éléments à traduire
  const home = document.querySelector(".home");
  const cars = document.querySelector(".cars");
  const book = document.querySelector(".book");
  const about = document.querySelector(".about");
  const date_start = document.querySelector(".date_start");
  const date_end = document.querySelector(".date_end");
  const car_name = document.querySelector(".car_name");
  const nom = document.querySelector(".nom");
  const email = document.querySelector(".email");
  const tel = document.querySelector(".tel");
  const submit = document.querySelector(".submit-btn");
  const contact = document.querySelector(".contact");
  const homesidebar = document.querySelector(".home1");
  const carssidebar = document.querySelector(".cars1");
  const booksidebar = document.querySelector(".book1");
  const aboutsidebar = document.querySelector(".about1");
  const contactsidebar = document.querySelector(".contact1");
  // Application des traductions selon la langue choisie
  contact.textContent = translations[language]["contact"];
  home.textContent = translations[language]["acceuil"];
  cars.textContent = translations[language]["voitures"];
  book.textContent = translations[language]["reserver"];
  about.textContent = translations[language]["apropos"];
  date_start.textContent = translations[language]["date_debut"];
  date_end.textContent = translations[language]["date_fin"];
  car_name.textContent = translations[language]["car"];
  nom.textContent = translations[language]["name"];
  email.textContent = translations[language]["email"];
  tel.textContent = translations[language]["tel"];
  submit.value = translations[language]["booknow"];
  homesidebar.textContent = translations[language]["acceuil"];
  carssidebar.textContent = translations[language]["voitures"];
  booksidebar.textContent = translations[language]["reserver"];
  aboutsidebar.textContent = translations[language]["apropos"];
  contactsidebar.textContent = translations[language]["contact"];
}

// Changement de langue via le sélecteur de la sidebar
document.getElementById("languages1").addEventListener("change", (e) => {
  const language = e.target.value;
  // Synchronisation du sélecteur principal
  languagesSelect.value = language;
  // Mise à jour de la langue de la page
  updateLanguage(language);
});

// Changement de langue via le sélecteur principal
document.getElementById("languages").addEventListener("change", (e) => {
  const language = e.target.value;
  // Mise à jour de la langue de la page
  updateLanguage(language);
  // Synchronisation du sélecteur de la sidebar
  languagesSelectSidebar.value = language;
});

async function init() {
  const cars = await getcars();
  const savedLang = localStorage.getItem("language") || "fr";
  // Mise à jour de la langue de la page
  updateLanguage(savedLang);
  // Mise à jour de la valeur du sélecteur principal
  languagesSelect.value = savedLang;
  // Mise à jour de la valeur du sélecteur de la sidebar
  languagesSelectSidebar.value = savedLang;

  // Remplissage du menu déroulant des voitures
  const carname = document.getElementById("car_name");

  cars.forEach((car) => {
    // Création d’une option pour chaque voiture
    const option = document.createElement("option");
    // Remplacement des tirets ou espaces par des underscores pour la valeur
    option.value = car.name.replace(/[- ]/g, "_");
    // Affichage du nom avec des espaces à la place des tirets
    option.textContent = car.name.replace(/-/g, " ");
    // Ajout de l’option au menu déroulant
    carname.appendChild(option);
  });

  // Vérification s’il y a une voiture sélectionnée enregistrée
  const id = localStorage.getItem("id");

  if (id) {
    // Si oui, on sélectionne cette voiture dans le menu déroulant
    carname.value = id;
  }
}

init();
