import axios from "axios";

const BASE_URL = "http://localhost:3000";

export async function getcars() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cars`);
    return response.data;
  } catch (err) {
    console.error("Error fetching cars:", err);
    return [];
  }
}

export async function getmodels() {
  try {
    const response = await axios.get(`${BASE_URL}/api/models`);
    return response.data;
  } catch (err) {
    console.error("Error fetching models:", err);
    return [];
  }
}

export async function getCarTrims(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/trims/${modelname}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getCarBody(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/body/${modelname}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getCarStrip(modelname) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/car-parts/strip/${modelname}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch car parts:", err);
    return [];
  }
}

export async function getAvailableColors(carId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/colors/${carId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch car colors:", err);
    return [];
  }
}
