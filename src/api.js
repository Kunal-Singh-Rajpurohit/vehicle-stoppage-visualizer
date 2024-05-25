// src/api.js
import axios from 'axios';

export const fetchGPSData = async () => {
    const response = await axios.get('http://localhost:5000/api/gps-data');
    return response.data;
};
