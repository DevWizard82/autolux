import { getcars } from "./api.js";

//importer l'objet traductions contenant tout le texte dans les differentes pages html en 10 langues differentes(en, fr, ar, pt, es, de, ja, zh, ru, it)
import { translations } from "./translations.js";

//declaration des variables necessaires
const cardContainer = document.getElementById("card-container");
const citiesSelect = document.getElementById("cities");
const categoriesSelect = document.querySelectorAll(".category-btn");
const currenciesSelect = document.getElementById("currencies");
const sidebarCurrencies = document.getElementById("currencies1");
const searchEl = document.getElementById("search");
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

//fonction qui affiche les voitures selon les filtres choisis tel que les villes ou bien encore les differentes categories
async function displayCars(
  cars,
  // Paramètres par défaut pour la ville, la catégorie et la langue, même si aucun argument n'est passé.
  city = "Toutes_les_villes", // Ville par défaut : toutes les villes
  category = "All", // Catégorie par défaut : toutes les catégories
  language = "fr" // Langue par défaut : français
) {
  // Vider le contenu actuel du conteneur de cartes
  cardContainer.innerHTML = "";

  language = localStorage.getItem("language") || "fr";

  // Filtrer les voitures selon les critères de ville et de catégorie
  const filtered = cars.filter((car) => {
    // Vérifie si la catégorie correspond à celle sélectionnée
    const categoriesMatch =
      category === "All" || car.category === category.toLowerCase();
    // Vérifie si la ville correspond à celle sélectionnée
    const citiesMatch =
      city === "Toutes_les_villes" || car.locations["fr"].includes(city);

    // Retourne true si les deux critères sont remplis, sinon false
    return citiesMatch && categoriesMatch;
  });

  // Pour chaque voiture filtrée, crée une carte d'affichage
  filtered.forEach((car) => {
    // Crée un nouvel élément div pour la carte
    const card = document.createElement("div");
    card.className = "card";

    // Remplie le contenu HTML de la carte avec les informations de la voiture
    card.innerHTML = `
      <div class="card_image">
        <img src="assets/images/${car.image}" alt="${car.name}">
      </div>
      <div class="card_content">
        <h3 class="${language === "ar" ? "rtl" : "ltr"}">${car.name}</h3>
        <p class="${language === "ar" ? "rtl" : "ltr"}">${
      car.description[language]
    }</p>
        <div class="locations ${language === "ar" ? "rtl" : "ltr"}">
          <span class="available">${translations[language]["disponible"]}</span>
          <span class="carlocations">${car.locations[language]}</span>
        </div>
        <div class="price ${language === "ar" ? "rtlprice" : "ltrprice"}">
          <span class="priceValue" data-original-value="${
            car.price
          }" data-currency="EUR">
            ${car.price} EUR
          </span><span class="perday">/jour</span>

        </div>
        <div class="btn_container">
          <button class="reserver_btn" id="${car.name.replace(
            /[- ]/g,
            "_"
          )}">Réserver</button>
          <button class="model" id="${car.name.replace(
            /[- ]/g,
            "_"
          )}"><i class="fas fa-cube"></i><span class="modeltext">Vue 3D</span></button>
        </div>
      </div>
    `;

    // Ajoute la carte au conteneur
    cardContainer.appendChild(card);
    // Ajoute l'effet 3D à la carte
    add3Deffect(card);
  });

  // Si la devise sélectionnée n'est pas l'Euro, met à jour les prix
  if (currenciesSelect.value !== "EUR") {
    updatePrice(currenciesSelect.value);
  }

  // Si la devise sélectionnée dans la barre latérale n'est pas l'Euro, met à jour les prix
  if (sidebarCurrencies.value !== "EUR") {
    updatePrice(sidebarCurrencies.value);
  }
}

//fonction qui ajoute l'effet 3d a la carte
function add3Deffect(card) {
  // Ajoute un écouteur d'événement pour détecter les mouvements de la souris sur la carte
  card.addEventListener("mousemove", (e) => {
    // Récupère les dimensions et la position de la carte
    const rect = card.getBoundingClientRect();
    // Calcule la position de la souris par rapport à la carte
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Détermine le centre de la carte
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calcule l'angle de rotation selon l'axe X en fonction de la position verticale de la souris
    const rotateX = (y - centerY) / 10;
    // Calcule l'angle de rotation selon l'axe Y en fonction de la position horizontale de la souris
    const rotateY = (x - centerX) / 10;
    // Applique la transformation 3D à la carte en fonction des angles calculés
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  // Réinitialise la transformation quand la souris quitte la carte
  card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

//premier appel pour afficher toutes les voitures
displayCars();

// Active visuellement le bouton de catégorie marqué comme sélectionné par défaut qui est "All".
document
  .querySelector('.category-btn[data-default="true"]')
  .classList.add("active");

// Gère le clic sur chaque bouton de catégorie : met à jour l'apparence active, récupère la ville et la langue sélectionnées,
// puis affiche les voitures filtrées selon la nouvelle catégorie choisie.
categoriesSelect.forEach((button) => {
  button.addEventListener("click", () => {
    categoriesSelect.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const city = citiesSelect.value;
    const category = button.getAttribute("data-original-value");
    displayCars(city, category, languagesSelect.value);
  });
});

// Lorsqu'une ville est sélectionnée, récupère la catégorie et la langue actuelles, puis met à jour l'affichage des voitures filtrées.
citiesSelect.addEventListener("change", (e) => {
  const city = e.target.value;
  const category = document
    .querySelector(".category-btn.active")
    .getAttribute("data-original-value");
  displayCars(city, category, languagesSelect.value);
});

let exchangeRates = {};

async function fetchCurrenciesRates() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await response.json();
    exchangeRates = data.rates || {};
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
  }
}

async function convert(amount, toCurrency) {
  if (!exchangeRates[toCurrency]) return null;
  return (amount * exchangeRates[toCurrency]).toFixed(2);
}

// Met à jour tous les prix affichés en les convertissant vers la devise choisie à l'aide de la fonction convert().
async function updatePrice(toCurrency) {
  const priceElements = document.querySelectorAll(".priceValue");

  for (const price of priceElements) {
    const originalPrice = parseFloat(price.getAttribute("data-original-value"));
    const converted = await convert(originalPrice, toCurrency);
    if (converted) {
      price.textContent = `${converted} ${toCurrency}`;
    } else {
      price.textContent = "Conversion failed";
    }
  }
}

// Lors du changement de devise dans la liste déroulante principale, on met à jour la devise sélectionnée dans la sidebar, les prix affichés, et on recharge les voitures selon les filtres actuels.
document.getElementById("currencies").addEventListener("change", async (e) => {
  const toCurrency = e.target.value;
  sidebarCurrencies.value = toCurrency;
  await updatePrice(toCurrency);
});

// Lors du changement de devise dans la liste déroulante de la barre laterale, on met à jour la devise sélectionnée dans le menu pricipal, les prix affichés, et on recharge les voitures selon les filtres actuels.
document.getElementById("currencies1").addEventListener("change", async (e) => {
  const toCurrency = e.target.value;
  currenciesSelect.value = toCurrency;
  await updatePrice(toCurrency);
});

//fonction qui affiche les cartes apres application de filtres (barre de recherche)
async function searchCars(cars, searchValue, language) {
  // Vide le conteneur de cartes avant d'ajouter les nouvelles
  cardContainer.innerHTML = "";

  // Filtre les voitures selon la valeur de recherche (insensible à la casse)
  const filtered = cars.filter((car) =>
    car.name.toUpperCase().includes(searchValue.toUpperCase())
  );

  // Pour chaque voiture filtrée, on crée dynamiquement une carte HTML
  filtered.forEach((car) => {
    // Création de l'élément HTML principal pour la carte
    const card = document.createElement("div");
    card.className = "card";

    // Remplissage du contenu HTML de la carte avec les données de la voiture
    card.innerHTML = `
      <div class="card_image">
        <img src="/assets/images/${car.image}" alt="${car.name}">
      </div>
      <div class="card_content">
        <h3 class="${language === "ar" ? "rtl" : "ltr"}">${car.name}</h3>
        <p class="${language === "ar" ? "rtl" : "ltr"}">${
      car.description[languagesSelect.value]
    }</p>
        <div class="locations ${language === "ar" ? "rtl" : "ltr"}">
          <span class="available">${translations[language]["disponible"]}</span>
          <span class="carlocations">${car.locations[language]}</span>
        </div>
        <div class="price ${language === "ar" ? "rtlprice" : "ltrprice"}">
          <span class="priceValue" data-original-value="${
            car.price
          }" data-currency="EUR">
            ${car.price} EUR
          </span><span class="perday">/jour</span>
        </div>
        <div class="btn_container">
          <button class="reserver_btn" id="${car.name.replace(
            /[- ]/g,
            "_"
          )}">Réserver</button>
          <button class="model" id="${car.name.replace(
            /[- ]/g,
            "_"
          )}"><i class="fas fa-cube"></i> <span class="modeltext">Vue 3D</span></button>
        </div>
      </div>
    `;

    // Ajoute la carte générée dans le conteneur principal
    cardContainer.appendChild(card);

    // Applique un effet 3D interactif sur la carte
    add3Deffect(card);
  });

  // Si une autre devise que l’euro est sélectionnée, on met à jour les prix affichés
  if (currenciesSelect.value !== "EUR") {
    updatePrice(currenciesSelect.value);
  }
  if (sidebarCurrencies.value !== "EUR") {
    updatePrice(sidebarCurrencies.value);
  }
}

searchEl.addEventListener("keyup", () => {
  // Lorsqu'on tape dans la barre de recherche, on enlève la classe "active" de tous les boutons de catégorie
  categoriesSelect.forEach((category) => {
    category.classList.remove("active");
  });

  // On remet la catégorie par défaut comme sélectionnée (all)
  document
    .querySelector('.category-btn[data-default="true"]')
    .classList.add("active");

  // On réinitialise la ville sélectionnée à "Toutes_les_villes"
  citiesSelect.value = "Toutes_les_villes";

  // On lance la fonction de recherche avec la valeur actuelle du champ de recherche et la langue sélectionnée
  searchCars(searchEl.value, languagesSelect.value);
});

function updateLanguage(language) {
  if (!language) return;

  localStorage.setItem("language", language);

  //declarer les elements a changer dans la page
  const home = document.querySelector(".home");
  const cars = document.querySelector(".cars");
  const about = document.querySelector(".about");
  const fleet = document.getElementById("fleet");
  const allCities = document.querySelector(".all");
  const casa = document.querySelector(".casa");
  const marrakech = document.querySelector(".marrakech");
  const tanger = document.querySelector(".tanger");
  const rabat = document.querySelector(".rabat");
  const search = document.querySelector(".search");
  const allCategories = document.getElementById("allCategories");
  const hypercar = document.getElementById("hypercar");
  const luxury = document.getElementById("luxury");
  const electric = document.getElementById("electric");
  const sport = document.getElementById("sport");
  const contact = document.querySelector(".contact");
  const homesidebar = document.querySelector(".home1");
  const carssidebar = document.querySelector(".cars1");
  const aboutsidebar = document.querySelector(".about1");
  const contactsidebar = document.querySelector(".contact1");

  //changer les elements de la page
  contact.textContent = translations[language]["contact"];
  home.textContent = translations[language]["acceuil"];
  cars.textContent = translations[language]["voitures"];
  about.textContent = translations[language]["apropos"];
  fleet.textContent = translations[language]["notreflotte"];
  allCities.textContent = translations[language]["touteslesvilles"];
  casa.textContent = translations[language]["casablanca"];
  marrakech.textContent = translations[language]["marrakech"];
  tanger.textContent = translations[language]["tanger"];
  rabat.textContent = translations[language]["rabat"];
  search.placeholder = translations[language]["placeholder"];
  allCategories.textContent = translations[language]["tout"];
  hypercar.textContent = translations[language]["hypercar"];
  luxury.textContent = translations[language]["luxe"];
  electric.textContent = translations[language]["electrique"];
  sport.textContent = translations[language]["sport"];
  homesidebar.textContent = translations[language]["acceuil"];
  carssidebar.textContent = translations[language]["voitures"];
  aboutsidebar.textContent = translations[language]["apropos"];
  contactsidebar.textContent = translations[language]["contact"];

  //attendre 50ms avant de changer ces elements puisque les voitures sont chargees dynamiquement
  setTimeout(() => {
    document.querySelectorAll(".available").forEach((availableEl) => {
      availableEl.textContent = translations[language]["disponible"];
    });
  }, 50);
  setTimeout(() => {
    document.querySelectorAll(".perday").forEach((perdayEl) => {
      perdayEl.textContent = translations[language]["perday"];
    });
  }, 50);
  setTimeout(() => {
    document.querySelectorAll(".reserver_btn").forEach((reserver) => {
      reserver.textContent = translations[language]["reserver"];
    });
  }, 50);
  setTimeout(() => {
    document.querySelectorAll(".modeltext").forEach((model) => {
      model.textContent = translations[language]["vue3d"];
    });
  }, 50);
}

//changer la langue a partir de la barre laterale
document.getElementById("languages1").addEventListener("change", (e) => {
  //Obtenir la valeur de la langue
  const language = e.target.value;

  //changer la valeur du selecteur du menu principal a cette nouvelle langue
  languagesSelectSidebar.value = language;
  languagesSelect.value = language;

  //appel de la fonction updateLanguage pour modifier la langue du texte de la page entiere
  updateLanguage(language);

  const city = citiesSelect.value;
  const category = document
    .querySelector(".category-btn.active")
    .getAttribute("data-original-value");
  displayCars(city, category, language);
});

//changer la langue a partir du menu principal
document.getElementById("languages").addEventListener("change", (e) => {
  //Obtenir la valeur de la langue
  const language = e.target.value;

  //changer la valeur du selecteur de la barre laterale a cette nouvelle langue
  languagesSelectSidebar.value = language;
  languagesSelect.value = language;

  //appel de la fonction updateLanguage pour modifier la langue du texte de la page entiere
  updateLanguage(language);

  const city = citiesSelect.value;
  const category = document
    .querySelector(".category-btn.active")
    .getAttribute("data-original-value");
  displayCars(city, category, language);
});

function open3D(id) {
  window.open(`carviewer.html?model=${encodeURIComponent(id)}.glb`, "_blank");
}

//evenement pour gerer l'ouverture et la fermeture du model 3d
document.body.addEventListener("click", (e) => {
  // Récupère le bouton "model" le plus proche de l'élément déclencheur
  const modelbtn = e.target.closest(".model");

  // Si un bouton modèle (modelbtn) est trouvé
  if (modelbtn) {
    // Ouvrir le modèle 3D avec le chemin du fichier basé sur l'id
    const id = modelbtn.getAttribute("id");
    open3D(id);
  }
});

// Ajouter un écouteur d'événement sur le clic dans le corps du document
document.body.addEventListener("click", (e) => {
  // Vérifier si l'élément cliqué est un bouton de réservation
  const reserverBtn = e.target.closest(".reserver_btn");
  if (reserverBtn) {
    // Récupérer l'attribut id du bouton de réservation
    const id = reserverBtn.getAttribute("id");
    // Sauvegarder l'id dans le stockage local (localStorage)
    localStorage.setItem("id", id);
    // Ajouter une classe fade-out au corps du document pour une animation de transition
    document.body.classList.add("fade-out");
    // Après 500ms, rediriger vers la page 'formulaire.html'
    setTimeout(() => {
      window.location.href = "formulaire.html";
    }, 500);
  }
});

// ---- Initialize App ----
async function init() {
  const cars = await getcars();
  const savedLang = localStorage.getItem("language") || "fr";
  const savedCurrency = localStorage.getItem("currency") || "EUR";
  await fetchCurrenciesRates();
  updateLanguage(savedLang);

  currenciesSelect.value = savedCurrency;
  sidebarCurrencies.value = savedCurrency;

  const city = citiesSelect.value;
  const category =
    document.querySelector(".category-btn.active")?.dataset.originalValue ||
    "All";
  await displayCars(cars, city, category, savedLang);

  if (savedCurrency !== "EUR") {
    await updatePrice(savedCurrency);
  }

  // Set selects
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;

  // ---- Event listeners ----
  document.getElementById("sidebar").addEventListener("click", () => {
    document.querySelector(".sidebar").style.display = "flex";
  });
  document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".sidebar").style.display = "none";
  });

  categoriesSelect.forEach((button) => {
    button.addEventListener("click", () => {
      categoriesSelect.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const city = citiesSelect.value;
      const category = button.dataset.originalValue;
      displayCars(cars, city, category, languagesSelect.value);
    });
  });

  citiesSelect.addEventListener("change", (e) => {
    const city = e.target.value;
    const category = document.querySelector(".category-btn.active").dataset
      .originalValue;
    displayCars(cars, city, category, languagesSelect.value);
  });

  searchEl.addEventListener("keyup", () => {
    categoriesSelect.forEach((category) => category.classList.remove("active"));
    document
      .querySelector('.category-btn[data-default="true"]')
      .classList.add("active");
    citiesSelect.value = "Toutes_les_villes";
    searchCars(cars, searchEl.value, languagesSelect.value);
  });

  // Language change events
  function handleLangChange(newLang) {
    updateLanguage(newLang);
    languagesSelect.value = newLang;
    languagesSelectSidebar.value = newLang;
    const city = citiesSelect.value;
    const category = document.querySelector(".category-btn.active").dataset
      .originalValue;
    displayCars(cars, city, category, newLang);
  }

  languagesSelect.addEventListener("change", (e) =>
    handleLangChange(e.target.value)
  );
  languagesSelectSidebar.addEventListener("change", (e) =>
    handleLangChange(e.target.value)
  );

  // Currency
  currenciesSelect.addEventListener("change", (e) => {
    sidebarCurrencies.value = e.target.value;
    localStorage.setItem("currency", e.target.value);
    updatePrice(e.target.value);
  });
  sidebarCurrencies.addEventListener("change", (e) => {
    currenciesSelect.value = e.target.value;
    localStorage.setItem("currency", e.target.value);
    updatePrice(e.target.value);
  });

  // Reservation and 3D model buttons
  document.body.addEventListener("click", (e) => {
    const modelbtn = e.target.closest(".model");
    const closebtn = e.target.closest(".close-btn");
    const reserverBtn = e.target.closest(".reserver_btn");

    if (modelbtn) {
      const id = modelbtn.id;
      open3D(id);
    }
    if (closebtn) close3D();
    if (reserverBtn) {
      const id = reserverBtn.id;
      localStorage.setItem("id", id);
      document.body.classList.add("fade-out");
      setTimeout(() => (window.location.href = "formulaire.html"), 500);
    }
  });
}

// ---- Start App ----
init();
