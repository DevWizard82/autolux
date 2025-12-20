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

  // ===== HERO BUTTONS =====
  document.querySelectorAll("a[href='#featured']").forEach((el) => {
    el.textContent = translations[language]["discover_more"];
  });

  document.querySelectorAll("a[href='cars.html']").forEach((el) => {
    if (el.classList.contains("btn-glow"))
      el.textContent = translations[language]["view_fleet"];
  });

  // ===== ABOUT SECTION =====
  const aboutBadge = document.querySelector("#about span.text-luxury-gold");
  const aboutTitle = document.querySelector("#about h2");
  const aboutParagraphs = document.querySelectorAll("#about p");
  const ourStory = document.querySelector("#about a span");

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

  document.querySelectorAll(".card-hover a").forEach((btn) => {
    btn.textContent = translations[language]["reserve_now"];
  });

  const fullCollection = document.querySelector(
    "#featured a.inline-block span.relative"
  );
  if (fullCollection)
    fullCollection.textContent = translations[language]["view_full_collection"];

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

  document.querySelectorAll("footer a").forEach((link) => {
    if (link.textContent.includes("Privacy"))
      link.textContent = translations[language]["privacy"];
    if (link.textContent.includes("Terms"))
      link.textContent = translations[language]["terms"];
  });
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

// 3. Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function toggleMenu() {
  mobileMenu.classList.toggle("translate-x-full");
  document.body.classList.toggle("overflow-hidden");
}
mobileMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);

// 4. USER AUTH & AVATAR LOGIC (CRITICAL)
document.addEventListener("DOMContentLoaded", () => {
  updateNavbarUser();
});

function updateNavbarUser() {
  // Retrieve user data
  const token = localStorage.getItem("token");
  const firstname = localStorage.getItem("first_name") || "Client";
  const lastname = localStorage.getItem("last_name") || "";
  const email = localStorage.getItem("email") || "user@autolux.ma";

  // Select DOM Elements
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navUserInfo = document.getElementById("nav-user-info");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");
  const mobileUserInfo = document.getElementById("mobile-user-info");

  // Logic
  if (token) {
    // --- USER IS LOGGED IN ---

    // 1. Hide Login Buttons
    if (navLoginBtn) navLoginBtn.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";

    // 2. Prepare Avatar Data
    const initials = (firstname[0] + (lastname[0] || "")).toUpperCase();
    const fullName = `${firstname} ${lastname}`.trim();

    // 3. HTML Structure for Avatar + Dropdown
    const avatarHTML = `
            <button class="custom-avatar-btn" title="${fullName}">
                ${initials}
            </button>
            <div class="glass-dropdown">
                <div class="dropdown-header">
                    <p class="dropdown-name">${fullName}</p>
                    <p class="dropdown-email">${email}</p>
                </div>
                <div class="dropdown-body">
                    <button class="dropdown-item">
                        <i class="fa-solid fa-user"></i> Profile
                    </button>
                    <button class="dropdown-item">
                        <i class="fa-solid fa-gear"></i> Settings
                    </button>
                    <button class="dropdown-item logout" onclick="handleLogout()">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
          `;

    // 4. Inject into Desktop Navbar
    if (navUserInfo) {
      navUserInfo.classList.remove("hidden");
      navUserInfo.classList.add("flex");
      navUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(navUserInfo);
    }

    // 5. Inject into Mobile Menu
    if (mobileUserInfo) {
      mobileUserInfo.classList.remove("hidden");
      mobileUserInfo.classList.add("flex");
      mobileUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(mobileUserInfo);
    }
  } else {
    // --- USER IS GUEST ---
    if (navLoginBtn) navLoginBtn.style.display = "block";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
    if (navUserInfo) navUserInfo.classList.add("hidden");
    if (mobileUserInfo) mobileUserInfo.classList.add("hidden");
  }
}

// Helper to handle Dropdown Toggling
function setupDropdownListeners(container) {
  const btn = container.querySelector(".custom-avatar-btn");
  const dropdown = container.querySelector(".glass-dropdown");

  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close any other open dropdowns first
      document.querySelectorAll(".glass-dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  }
}

// Handle Logout
window.handleLogout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("email");
  window.location.reload(); // Refresh page to reset UI
};

// Close Dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".custom-avatar-btn") &&
    !e.target.closest(".glass-dropdown")
  ) {
    document.querySelectorAll(".glass-dropdown").forEach((d) => {
      d.classList.remove("active");
    });
  }
});
