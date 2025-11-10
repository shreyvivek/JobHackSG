import axios from "axios";
console.log(" apiSectorTrends.ts loaded");

const API_URL = "http://localhost:8080/api/trends/parsed";

export async function fetchSectorTrends() {
  try {
    const response = await axios.get(API_URL);
    console.log(" SectorTrends.ts loaded successfully");
    return response.data;
  } catch (error) {
    console.error("Error fetching sector trends:", error);
    return [];
  }
}
