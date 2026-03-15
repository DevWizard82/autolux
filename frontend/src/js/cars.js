import { getcars } from "./api.js";

import { translations } from "./translations.js";

const cardContainer = document.getElementById("card-container");
const citiesSelect = document.getElementById("cities");
const categoriesSelect = document.querySelectorAll(".category-btn");
const currenciesSelect = document.getElementById("currencies");
const sidebarCurrencies = document.getElementById("currencies1");
const searchEl = document.getElementById("search");
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

async function displayCars(
  cars,
  city = "Toutes_les_villes",
  category = "All",
  language = "fr",
) {
  cardContainer.innerHTML = "";

  language = localStorage.getItem("language") || "fr";

  if (!cars || !Array.isArray(cars)) {
    console.error("Invalid 'cars' array passed to displayCars:", cars);
    cardContainer.innerHTML = "<p>Aucune voiture trouvée.</p>";
    return;
  }

  const filtered = cars.filter((car) => {
    const categoriesMatch =
      category === "All" || car.category === category.toLowerCase();
    const citiesMatch =
      city === "Toutes_les_villes" || car.locations["fr"].includes(city);

    return citiesMatch && categoriesMatch;
  });

  filtered.forEach((car) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <div class="card_image" onclick="openCarModal(${JSON.stringify(car).replace(/"/g, "&quot;")}, '${language}')">
    <img src="assets/images/${car.image}" alt="${car.name}">
    <div class="image_overlay"><i class="fas fa-expand"></i></div>
  </div>
  <div class="card_content">
    <h3 class="${language === "ar" ? "rtl" : "ltr"}">${car.name}</h3>
    <p class="${language === "ar" ? "rtl" : "ltr"}">${car.description[language]}</p>
    <div class="locations ${language === "ar" ? "rtl" : "ltr"}">
      <span class="available">${translations[language]["disponible"]}</span>
      <span class="carlocations">${car.locations[language]}</span>
    </div>
    <div class="price ${language === "ar" ? "rtlprice" : "ltrprice"}">
      <span class="priceValue" data-original-value="${car.price}" data-currency="EUR">
        ${car.price} EUR
      </span><span class="perday">/jour</span>
    </div>
    <div class="btn_container">
      <button class="reserver_btn" data-id="${car.id}" id="${car.name.replace(/[- ]/g, "_")}">Réserver</button>
    </div>
  </div>
`;

    cardContainer.appendChild(card);
    add3Deffect(card);
  });

  if (currenciesSelect.value !== "EUR") {
    updatePrice(currenciesSelect.value);
  }

  if (sidebarCurrencies.value !== "EUR") {
    updatePrice(sidebarCurrencies.value);
  }
}

function add3Deffect(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (x - centerX) / 10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

document
  .querySelector('.category-btn[data-default="true"]')
  .classList.add("active");

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

document.getElementById("currencies").addEventListener("change", async (e) => {
  const toCurrency = e.target.value;
  sidebarCurrencies.value = toCurrency;
  await updatePrice(toCurrency);
});

document.getElementById("currencies1").addEventListener("change", async (e) => {
  const toCurrency = e.target.value;
  currenciesSelect.value = toCurrency;
  await updatePrice(toCurrency);
});

async function searchCars(cars, searchValue, language) {
  cardContainer.innerHTML = "";

  const filtered = cars.filter((car) =>
    car.name.toUpperCase().includes(searchValue.toUpperCase()),
  );
  filtered.forEach((car) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <div class="card_image" onclick="openCarModal(${JSON.stringify(car).replace(/"/g, "&quot;")}, '${language}')">
    <img src="assets/images/${car.image}" alt="${car.name}">
    <div class="image_overlay"><i class="fas fa-expand"></i></div>
  </div>
  <div class="card_content">
    <h3 class="${language === "ar" ? "rtl" : "ltr"}">${car.name}</h3>
    <p class="${language === "ar" ? "rtl" : "ltr"}">${car.description[language]}</p>
    <div class="locations ${language === "ar" ? "rtl" : "ltr"}">
      <span class="available">${translations[language]["disponible"]}</span>
      <span class="carlocations">${car.locations[language]}</span>
    </div>
    <div class="price ${language === "ar" ? "rtlprice" : "ltrprice"}">
      <span class="priceValue" data-original-value="${car.price}" data-currency="EUR">
        ${car.price} EUR
      </span><span class="perday">/jour</span>
    </div>
    <div class="btn_container">
      <button class="reserver_btn" data-id="${car.id}" id="${car.name.replace(/[- ]/g, "_")}">Réserver</button>
    </div>
  </div>
`;

    cardContainer.appendChild(card);

    add3Deffect(card);
  });

  if (currenciesSelect.value !== "EUR") {
    updatePrice(currenciesSelect.value);
  }
  if (sidebarCurrencies.value !== "EUR") {
    updatePrice(sidebarCurrencies.value);
  }
}

function updateLanguage(language) {
  if (!language) return;

  localStorage.setItem("language", language);

  // NAV

  const navContact = document.querySelectorAll("nav a[href*='contact.html']");

  navContact.forEach(
    (el) => (el.textContent = translations[language]["contact"]),
  );

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
  const navFleet = document.querySelectorAll("a[href*='cars.html']");
  const navAbout = document.querySelectorAll("a[href*='about.html']");
  const navLogin = document.querySelectorAll("a[href*='login.html']");

  //changer les elements de la page
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
  navFleet.forEach((el) => (el.textContent = translations[language]["fleet"]));
  navAbout.forEach((el) => (el.textContent = translations[language]["about"]));
  navLogin.forEach((el) => (el.textContent = translations[language]["login"]));

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

let carId;

document.body.addEventListener("click", (e) => {
  const reserverBtn = e.target.closest(".reserver_btn");
  if (reserverBtn) {
    const id = reserverBtn.getAttribute("id");
    localStorage.setItem("id", id);
    carId = reserverBtn.getAttribute("data-id");
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = `book.html?id=${encodeURIComponent(carId)}`;
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
    handleLangChange(e.target.value),
  );
  languagesSelectSidebar.addEventListener("change", (e) =>
    handleLangChange(e.target.value),
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

  // Reservation buttons
  document.body.addEventListener("click", (e) => {
    const reserverBtn = e.target.closest(".reserver_btn");

    if (reserverBtn) {
      const id = reserverBtn.id;
      localStorage.setItem("id", id);
      carId = reserverBtn.getAttribute("data-id");

      document.body.classList.add("fade-out");
      setTimeout(
        () =>
          (window.location.href = `book.html?id=${encodeURIComponent(carId)}`),
        500,
      );
    }
  });
}

function openCarModal(car, language) {
  document.getElementById("modalCarImage").src = `assets/images/${car.image}`;
  document.getElementById("modalCarName").textContent = car.name;
  document.getElementById("modalCarDesc").textContent =
    car.description[language];
  document.getElementById("modalCarLocations").textContent =
    car.locations[language];
  document.getElementById("modalCarPrice").textContent = `${car.price} EUR`;
  document.getElementById("modalReserverBtn").setAttribute("data-id", car.id);
  document.getElementById("modalReserverBtn").onclick = () => {
    closeCarModal();
    document.getElementById(car.name.replace(/[- ]/g, "_")).click();
  };
  document.getElementById("carModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCarModal(event) {
  if (!event || event.target === document.getElementById("carModal")) {
    document.getElementById("carModal").classList.remove("active");
    document.body.style.overflow = "";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCarModal();
});

// ---- Start App ----
await init();
