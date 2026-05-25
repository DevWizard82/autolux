import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- MOCK FALLBACK DATA FOR STUNNING DEMOS WHEN BACKEND IS DOWN ---
const defaultMockCars = [
  {
    id: 1,
    name: "Porsche 911 GT3",
    make: "Porsche",
    price: 800,
    category: "hypercar",
    image: "ss.png",
    top_speed: 198,
    zero_to_hundred: 3.2,
    engine_code: "4.0L H6",
    description: {
      en: "The track-focused legend. Powered by a naturally aspirated engine that revs all the way to 9,000 RPM, delivering an unparalleled racing experience.",
      fr: "La légende des circuits. Propulsée par un moteur atmosphérique qui monte jusqu'à 9 000 tr/min, offrant une expérience de course inégalée.",
      it: "La leggenda dei circuiti. Spinta da un motore aspirato che sale fino a 9.000 giri/min, offrendo un'esperienza di corsa senza rivali.",
      pt: "A lenda das pistas. Impulsionada por um motor aspirado que sobe até 9.000 RPM, oferecendo uma experiência de corrida inigualável."
    },
    locations: {
      en: "Casablanca, Marrakech, Rabat",
      fr: "Casablanca, Marrakech, Rabat",
      it: "Casablanca, Marrakech, Rabat",
      pt: "Casablanca, Marrakech, Rabat"
    }
  },
  {
    id: 2,
    name: "Rolls-Royce Ghost",
    make: "Rolls-Royce",
    price: 1200,
    category: "luxury",
    image: "luxury_interior.png",
    top_speed: 155,
    zero_to_hundred: 4.8,
    engine_code: "6.75L V12",
    description: {
      en: "An oasis of tranquility and supreme luxury. Handcrafted with the finest materials to offer an exceptionally smooth 'magic carpet' ride.",
      fr: "Un havre de paix et de luxe suprême. Fabriquée à la main avec les matériaux les plus nobles pour offrir une conduite exceptionnellement douce.",
      it: "Un'oasi di pace e lusso supremo. Realizzata a mano con i materiali più pregiati per offrire una guida eccezionalmente fluida.",
      pt: "Um oásis de paz e luxo supremo. Feita à mão com os materiais mais nobres para oferecer uma condução excepcionalmente suave."
    },
    locations: {
      en: "Casablanca, Rabat",
      fr: "Casablanca, Rabat",
      it: "Casablanca, Rabat",
      pt: "Casablanca, Rabat"
    }
  },
  {
    id: 3,
    name: "Mercedes G-Class",
    make: "Mercedes-Benz",
    price: 600,
    category: "sport",
    image: "luxury_interior.png",
    top_speed: 137,
    zero_to_hundred: 4.5,
    engine_code: "4.0L V8",
    description: {
      en: "An iconic luxury SUV combining absolute rugged capability with sophisticated comfort and timeless, imposing design.",
      fr: "Un SUV de luxe emblématique alliant une robustesse absolue à un confort sophistiqué et un design intemporel et imposant.",
      it: "Un SUV di lusso iconico che unisce una robustezza assoluta a un comfort sofisticato e un design intramontabile e imponente.",
      pt: "Um SUV de luxo icônico que combina robustez absoluta com conforto sofisticado e um design atemporal e imponente."
    },
    locations: {
      en: "Casablanca, Tangier, Marrakech",
      fr: "Casablanca, Tanger, Marrakech",
      it: "Casablanca, Tangeri, Marrakech",
      pt: "Casablanca, Tânger, Marrakech"
    }
  },
  {
    id: 4,
    name: "Tesla Model S Plaid",
    make: "Tesla",
    price: 500,
    category: "electric",
    image: "ss.png",
    top_speed: 200,
    zero_to_hundred: 1.99,
    engine_code: "Tri-Motor",
    description: {
      en: "Unmatched electric performance. Accelerates from 0 to 60 mph in under 2 seconds, offering a futuristic cabin and long-range luxury.",
      fr: "Des performances électriques inégalées. Accélère de 0 à 100 km/h en moins de 2 secondes, offrant une cabine futuriste.",
      it: "Prestazioni elettriche senza pari. Accelera da 0 a 100 km/h in meno di 2 secondi, offrendo una cabina futuristica.",
      pt: "Desempenho elétrico incomparável. Acelera de 0 a 100 km/h em menos de 2 segundos, oferecendo uma cabine futurista."
    },
    locations: {
      en: "Casablanca, Rabat",
      fr: "Casablanca, Rabat",
      it: "Casablanca, Rabat",
      pt: "Casablanca, Rabat"
    }
  }
];

// --- CACHING HELPERS ---
function getCachedData(key, fallbackValue = []) {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : fallbackValue;
  } catch (e) {
    return fallbackValue;
  }
}

function setCachedData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write to localStorage cache:", e);
  }
}

function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function normalizeCar(car) {
  const defaultDesc = {
    en: "Exclusive high-performance automobile.",
    fr: "Automobile exclusive de haute performance.",
    it: "Automobile esclusiva ad alte prestazioni.",
    pt: "Automóvel exclusivo de alta performance."
  };
  const defaultLocs = {
    en: "Casablanca, Marrakech",
    fr: "Casablanca, Marrakech",
    it: "Casablanca, Marrakech",
    pt: "Casablanca, Marrakech"
  };

  return {
    ...car,
    id: car.id || Math.floor(Math.random() * 100000),
    name: car.name || "Luxury Sedan",
    make: car.make || "Premium",
    price: car.price || 400,
    category: (car.category || "luxury").toLowerCase(),
    image: car.image || "ss.png",
    top_speed: car.top_speed || 180,
    zero_to_hundred: car.zero_to_hundred || 4.0,
    engine_code: car.engine_code || "V6 Turbo",
    description: safeParseJSON(car.description, defaultDesc),
    locations: safeParseJSON(car.locations, defaultLocs)
  };
}

// --- API ACTIONS WITH ROBUST CACHING & NORMALIZATION ---

export async function getcars() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cars`);
    const normalized = (response.data.data || []).map(normalizeCar);
    setCachedData("cached_cars", normalized);
    return normalized;
  } catch (err) {
    console.error("Error fetching cars, falling back to cache/mock data:", err);
    const cached = getCachedData("cached_cars");
    return cached.length > 0 ? cached : defaultMockCars.map(normalizeCar);
  }
}

export async function getmodels() {
  try {
    const response = await axios.get(`${BASE_URL}/api/models`);
    const data = response.data.data || [];
    setCachedData("cached_models", data);
    return data;
  } catch (err) {
    console.error("Error fetching models, falling back to cache:", err);
    return getCachedData("cached_models", []);
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
    const cachedCars = getCachedData("cached_cars");
    return cachedCars.length > 0 ? cachedCars.length : defaultMockCars.length;
  }
}

export async function getClientsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/clientscount`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch clients count:", err);
    return 12; // Static elegant fallback
  }
}

export async function getRentalsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/rentalscount`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch rentals count:", err);
    return 8; // Static elegant fallback
  }
}

export async function getLocationsCount() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations/count`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch locations count:", err);
    return 4; // Static elegant fallback
  }
}

export async function getRevenue() {
  try {
    const response = await axios.get(`${BASE_URL}/api/revenue`);
    return response.data.data[0].sum;
  } catch (err) {
    console.error("Failed to fetch this year's revenue:", err);
    return 15400; // Elegant static fallback
  }
}

export async function getAvailableCars() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cars/available`);
    return response.data.data[0].count;
  } catch (err) {
    console.error("Failed to fetch available cars:", err);
    const cachedCars = getCachedData("cached_cars");
    return cachedCars.length > 0 ? cachedCars.length - 1 : defaultMockCars.length - 1;
  }
}

export async function getClientsList() {
  try {
    const res = await fetch(`${BASE_URL}/api/clients`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch clients list:", err);
    return [];
  }
}

export async function getFleetList() {
  try {
    const res = await fetch(`${BASE_URL}/api/fleet`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch fleet list:", err);
    return [];
  }
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
    const normalized = (response.data.data || []).map(normalizeCar);
    setCachedData("cached_arrivals", normalized);
    return normalized;
  } catch (err) {
    console.error("Failed to fetch latest arrivals, falling back to cache/mock data:", err);
    const cached = getCachedData("cached_arrivals");
    return cached.length > 0 ? cached : defaultMockCars.slice(0, 3).map(normalizeCar);
  }
}

export async function getLocations() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations`);
    const data = response.data.data || [];
    setCachedData("cached_locations", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch showroom locations, falling back to cache:", err);
    const cached = getCachedData("cached_locations");
    return cached.length > 0 ? cached : [
      { id: 1, city_name: "Casablanca", map_embed_url: "https://www.google.com/maps/embed" },
      { id: 2, city_name: "Marrakech", map_embed_url: "https://www.google.com/maps/embed" },
      { id: 3, city_name: "Rabat", map_embed_url: "https://www.google.com/maps/embed" },
      { id: 4, city_name: "Tangier", map_embed_url: "https://www.google.com/maps/embed" }
    ];
  }
}

export async function getCities() {
  try {
    const response = await axios.get(`${BASE_URL}/api/cities`);
    const data = response.data.data || [];
    setCachedData("cached_cities", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch showroom cities, falling back to cache:", err);
    const cached = getCachedData("cached_cities");
    return cached.length > 0 ? cached : [
      { city_name: "Casablanca" },
      { city_name: "Marrakech" },
      { city_name: "Rabat" },
      { city_name: "Tangier" }
    ];
  }
}

export async function getGroupedLocations() {
  try {
    const response = await axios.get(`${BASE_URL}/api/locations/grouped`);
    const data = response.data.data || [];
    setCachedData("cached_grouped_locations", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch grouped locations, falling back to cache:", err);
    const cached = getCachedData("cached_grouped_locations");
    return cached.length > 0 ? cached : [
      {
        city_name: "Casablanca",
        locations: [{ id: 1, map_embed_url: "https://www.google.com/maps/embed" }]
      },
      {
        city_name: "Marrakech",
        locations: [{ id: 2, map_embed_url: "https://www.google.com/maps/embed" }]
      }
    ];
  }
}

export const getRentalsList = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/rentals`);
    return await res.json();
  } catch (err) {
    console.error("Fetch rentals error", err);
    return [];
  }
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
