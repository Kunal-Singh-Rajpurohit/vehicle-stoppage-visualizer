// src/api.js
import axios from 'axios';

export const fetchGPSData = async () => {
    const response = await axios.get('https://vehicle-stoppage-visualizer.onrender.com/api/gps-data');
    return response.data;
};

// api.js or wherever you handle API requests
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchData = async () => {
  const response = await fetch(`${backendUrl}/api/your-endpoint`);
  const data = await response.json();
  return data;
};
