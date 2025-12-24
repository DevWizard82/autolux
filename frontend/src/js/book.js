import axios from "axios";
import { getcars, getLocations } from "./api.js";

// Check if user is logged in
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const preselectedCarId = params.get("id");

const carSelect = document.getElementById("car-select");
const locationSelect = document.getElementById("location");

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

    if (preselectedCarId) {
      carSelect.value = preselectedCarId;
    }
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
