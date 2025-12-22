import axios from "axios";
import { getcars, getLocations } from "./api.js";

// Check if user is logged in
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const carSelect = document.getElementById("car-select");
const locationSelect = document.getElementById("location");
const pickupDate = document.getElementById("pickup-date");
const returnDate = document.getElementById("return-date");

// Fetch cars from database
async function loadCars() {
  try {
    const cars = await getcars();
    carSelect.innerHTML =
      '<option value="" disabled selected>Choisissez une voiture</option>';
    cars.forEach((car) => {
      const option = document.createElement("option");
      option.value = car.id;
      option.textContent = `${car.name}`;
      carSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des voitures:", error);
    carSelect.innerHTML =
      '<option value="" disabled>Impossible de charger les voitures</option>';
  }
}

// Fetch locations from database
async function loadLocations() {
  try {
    const locations = await getLocations();
    locationSelect.innerHTML =
      '<option value="" disabled selected>Choisissez une ville</option>';
    locations.forEach((loc) => {
      const option = document.createElement("option");
      option.value = loc.city_name;
      option.textContent = loc.city_name;
      locationSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des villes:", error);
    locationSelect.innerHTML =
      '<option value="" disabled>Impossible de charger les villes</option>';
  }
}

// Load data
loadCars();
loadLocations();

// Handle booking submission
const form = document.getElementById("booking-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const car_id = document.getElementById("car-select").value;
  const rental_start = document.getElementById("pickup-date").value;
  const rental_end = document.getElementById("return-date").value;

  if (!car_id || !rental_start || !rental_end) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3000/api/rentals", {
      client_id: parseInt(localStorage.getItem("clientId")),
      car_id: parseInt(car_id),
      rental_start,
      rental_end,
    });

    alert("Réservation confirmée !");
    console.log(res.data);
    form.reset();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.error}`);
    } else {
      alert("Erreur serveur");
    }
  }
});

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
