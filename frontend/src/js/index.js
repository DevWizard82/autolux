//importer l'objet translations
import { translations } from "./translations.js";
import { getArrivals } from "./api.js";

//declarer les selecteurs de langues
let languagesSelect = document.getElementById("languages");
let languagesSelectSidebar = document.getElementById("languages1");

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "fr";
  updateLanguage(savedLang);
  languagesSelect.value = savedLang;
  languagesSelectSidebar.value = savedLang;
  loadLatestArrivals(savedLang);
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
  const navFleet = document.querySelectorAll("nav a[href*='cars.html']");
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

  // ===== HERO BUTTONS =====
  document.querySelectorAll("a[href='#featured']").forEach((el) => {
    el.textContent = translations[language]["discover_more"];
  });

  // ===== ABOUT SECTION =====
  const aboutBadge = document.querySelector("#about span.text-luxury-gold");
  const aboutTitle = document.querySelector("#about h2");
  const aboutParagraphs = document.querySelectorAll("#about p");
  const ourStory = document.querySelector("#about a span");
  document.getElementById("book_now").textContent =
    translations[language]["booknow"];

  if (aboutBadge)
    aboutBadge.textContent = translations[language]["about_badge"];

  if (aboutTitle)
    aboutTitle.innerHTML = `
      ${translations[language]["about_title"]
        .split(" ")
        .slice(0, 2)
        .join(" ")} <br />
      <span class="text-gradient">${translations[language]["about_title"]
        .split(" ")
        .slice(2)
        .join(" ")}</span>
    `;

  if (aboutParagraphs[0])
    aboutParagraphs[0].textContent = translations[language]["about_p1"];

  if (aboutParagraphs[1])
    aboutParagraphs[1].textContent = translations[language]["about_p2"];

  if (ourStory) ourStory.textContent = translations[language]["our_story"];

  // ===== FEATURED =====
  const featuredBadge = document.querySelector("#featured span");
  const featuredTitle = document.querySelector("#featured h2");

  if (featuredBadge)
    featuredBadge.textContent = translations[language]["exclusive_selection"];

  if (featuredTitle)
    featuredTitle.textContent = translations[language]["royal_fleet"];

  const cta = document.querySelector(".cta-full-collection");
  if (cta) {
    cta.textContent = translations[language]["view_full_collection"];
  }

  // ===== SERVICES =====
  const why = document.querySelector("#services span");
  const serviceTitle = document.querySelector("#services h2");

  if (why) why.textContent = translations[language]["why_autolux"];

  if (serviceTitle)
    serviceTitle.innerHTML = `
      ${translations[language]["concierge_service"]
        .split(" ")
        .slice(0, 2)
        .join(" ")} <br />
      ${translations[language]["concierge_service"]
        .split(" ")
        .slice(2)
        .join(" ")}
    `;

  const serviceTitles = document.querySelectorAll("#services h4");
  const serviceDescs = document.querySelectorAll("#services p");

  if (serviceTitles[0])
    serviceTitles[0].textContent = translations[language]["pristine_title"];
  if (serviceDescs[0])
    serviceDescs[0].textContent = translations[language]["pristine_desc"];

  if (serviceTitles[1])
    serviceTitles[1].textContent = translations[language]["airport_title"];
  if (serviceDescs[1])
    serviceDescs[1].textContent = translations[language]["airport_desc"];

  if (serviceTitles[2])
    serviceTitles[2].textContent = translations[language]["flexible_title"];
  if (serviceDescs[2])
    serviceDescs[2].textContent = translations[language]["flexible_desc"];

  // ===== CTA =====
  const ctaTitle = document.querySelector("section h2.text-5xl");
  const ctaText = document.querySelector("section p.text-xl");
  const ctaButtons = document.querySelectorAll("a[href='contact.html']");

  if (ctaTitle) ctaTitle.textContent = translations[language]["begin_journey"];

  if (ctaText) ctaText.textContent = translations[language]["begin_text"];

  ctaButtons.forEach((btn, index) => {
    btn.textContent =
      index === 0
        ? translations[language]["book_now"]
        : translations[language]["contact_concierge"];
  });

  // ===== FOOTER =====
  const footerDesc = document.querySelector("footer p.text-gray-500");
  if (footerDesc)
    footerDesc.textContent = translations[language]["footer_desc"];

  document.querySelectorAll("footer h4").forEach((h4, index) => {
    if (index === 0)
      h4.childNodes[0].textContent = translations[language]["explore"];
    if (index === 1)
      h4.childNodes[0].textContent = translations[language]["visit_us"];
  });

  document.getElementById("view_fleet").textContent =
    translations[language]["view_fleet"];

  document.getElementById("fleet_footer").innerHTML = `
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${translations[language]["fleet"]}
  `;

  document.getElementById("services_footer").innerHTML = `
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${translations[language]["services"]}
  `;

  document.getElementById("about_footer").innerHTML = `
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${translations[language]["about"]}
  `;

  document.getElementById("contact_footer").innerHTML = `
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${translations[language]["contact"]}
  `;

  loadLatestArrivals(language);
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

// 2. Scroll Animations (Reveal)
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

async function loadLatestArrivals(language) {
  const container = document.getElementById("arrivals-container");

  try {
    const cars = await getArrivals();

    container.innerHTML = cars
      .map(
        (car, index) => `
          <div class="card-hover group relative bg-luxury-navy/30 rounded-xl overflow-hidden border border-white/5 hover:border-luxury-gold/30 reveal" 
               style="transition-delay: ${index * 100}ms">
            <div class="relative h-64 overflow-hidden">
              <img src="/assets/images/${car.image}" alt="${
          car.name
        }" class="card-img w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
              <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-luxury-gold text-xs font-bold border border-luxury-gold/20">
                $${car.price} <span class="day"> / Day</span>
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-serif text-white mb-2"> ${car.name}</h3>
              <p class="text-gray-500 text-sm mb-6 line-clamp-2">${
                car.description[language]
              }</p>

              <div class="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mb-8">
                <div class="text-center">
                  <i class="fas fa-tachometer-alt mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${
                    car.top_speed
                  } MPH</span>
                </div>
                <div class="text-center border-l border-white/5">
                  <i class="fas fa-stopwatch mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${
                    car.zero_to_hundred
                  }s</span>
                </div>
                <div class="text-center border-l border-white/5">
                  <i class="fas fa-gas-pump mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${
                    car.engine_code
                  }</span>
                </div>
              </div>

              <a href="cars.html?id=${
                car.id
              }" class="block w-full text-center py-3.5 rounded-lg bg-white/5 text-white hover:bg-gradient-luxury hover:text-black transition-all duration-300 uppercase text-xs tracking-widest font-bold reserve_now">
                Reserve Now
              </a>
            </div>
          </div>
        `
      )
      .join("");

    container.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    document.querySelectorAll(".reserve_now").forEach((el) => {
      el.textContent = translations[language]["reserve_now"];
    });
    document.querySelectorAll(".day").forEach((el) => {
      const str = translations[language]["perday"];
      el.textContent = str.replace("/", "/ ");
    });
  } catch (error) {
    console.error("Error loading arrivals:", error);
    container.innerHTML = `<p class="text-white text-center col-span-full">Failed to load the fleet. Please try again later.</p>`;
  }
}
