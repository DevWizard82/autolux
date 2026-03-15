import axios from "axios";

export const BASE_URL = import.meta.env.PROD
  ? "https://autolux-production.up.railway.app"
  : "http://localhost:3000";

export async function getcars() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cars`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching cars:", err);
    return [];
  }
}

export async function getmodels() {
  try {
    const response = await axios.get(`${BASE_URL}/api/models`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching models:", err);
    return [];
  }
}

export async function getCarTrims(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/trims/${modelname}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getCarsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/carscount`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch cars count:", err);
    return [];
  }
}

export async function getClientsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/clientscount`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch clients count:", err);
    return [];
  }
}

export async function getRentalsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/rentalscount`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch rentals count:", err);
    return [];
  }
}

export async function getLocationsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations/count`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch locations count:", err);
    return 0;
  }
}

export async function getRevenue() {
  try {
    const response = await axios.get(`${BASE_URL}/api/revenue`);
    return response.data.data[0].sum;
  } catch (err) {
    console.error("Failed to fetch this year's revenue:", err);
    return [];
  }
}

export async function getAvailableCars() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cars/available`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch available cars:", err);
    return [];
  }
}

export async function getClientsList() {
  const res = await fetch(`${BASE_URL}/api/clients`);
  return await res.json();
}

export async function getFleetList() {
  const res = await fetch(`${BASE_URL}/api/fleet`);
  return await res.json();
}

export async function getCarBody(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/body/${modelname}`,
    );
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getCarStrip(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/strip/${modelname}`,
    );
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getAvailableColors(carId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/colors/${carId}`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch car colors:", err);
    return [];
  }
}

export async function getTypes(carId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/types/${carId}`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch car types:", err);
    return [];
  }
}

export async function getColors(carId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/colors/${carId}`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch car types:", err);
    return [];
  }
}

export async function getArrivals() {
  try {
    const response = await axios.get(`${BASE_URL}/api/arrivals`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch latest arrivals:", err);
    return [];
  }
}

export async function getLocations() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch showroom locations:", err);
    return [];
  }
}

export async function getCities() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cities`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch showroom cities:", err);
    return [];
  }
}

export async function getGroupedLocations() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations/grouped`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch grouped locations:", err);
    return [];
  }
}

export const getRentalsList = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/rentals`);
  return res.json();
};

export const getLocationsList = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/locations`);
    return await res.json();
  } catch (err) {
    console.error("Fetch locations error", err);
    return { data: [] };
  }
};

export const getModelsList = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/models`);
    return await res.json();
  } catch (err) {
    console.error("Fetch models error", err);
    return { data: [] };
  }
};
