// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes

let gpsData = [];

// Read and parse the CSV file
fs.createReadStream(path.join(__dirname, 'gps-data.csv'))
  .pipe(csv())
  .on('data', (row) => {
    gpsData.push({
      EquipmentId: row.EquipmentId,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      speed: parseFloat(row.speed),
      odometer: parseFloat(row['odometer reading']),
      eventDate: parseInt(row.eventDate, 10),
      eventGeneratedTime: parseInt(row.eventGeneratedTime, 10)
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// Serve the HTML file at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get GPS data
app.get('/api/gps-data', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); // Add CORS header
  res.json(gpsData);
});

app.listen(port, () => {
  console.log(`Server is running on https://vehicle-stoppage-visualizer.onrender.com/`);
});

