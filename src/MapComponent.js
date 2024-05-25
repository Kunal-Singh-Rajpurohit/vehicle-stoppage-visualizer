// src/MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { fetchGPSData } from './api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ stoppageThreshold }) => {
  const [gpsData, setGpsData] = useState([]);
  const [stoppages, setStoppages] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchGPSData();
        setGpsData(data);
        identifyStoppages(data, stoppageThreshold);
      } catch (error) {
        console.error('Error fetching GPS data:', error);
      }
    };
    getData();
  }, [stoppageThreshold]);

  const identifyStoppages = (data, threshold) => {
    let stoppages = [];
    let lastStop = null;
    let stopStartTime = null;

    data.forEach((point, index) => {
      if (point.speed === 0) {
        if (!lastStop) {
          lastStop = point;
          stopStartTime = point.eventGeneratedTime;
        }
      } else {
        if (lastStop) {
          const stopDuration = (point.eventGeneratedTime - stopStartTime) / 60000; // Convert ms to minutes
          if (stopDuration >= threshold) {
            stoppages.push({
              lat: lastStop.latitude,
              lng: lastStop.longitude,
              reachTime: new Date(stopStartTime).toLocaleString(),
              endTime: new Date(point.eventGeneratedTime).toLocaleString(),
              duration: stopDuration.toFixed(2),
            });
          }
          lastStop = null;
        }
      }
    });

    setStoppages(stoppages);
  };

  return (
    <MapContainer center={[12.9294916, 74.9173533]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={gpsData.map(point => [point.latitude, point.longitude])} color="blue" />
      {stoppages.map((stop, idx) => (
        <Marker key={idx} position={[stop.lat, stop.lng]}>
          <Popup>
            <div>
              <strong>Stoppage Information</strong><br />
              Reach Time: {stop.reachTime}<br />
              End Time: {stop.endTime}<br />
              Duration: {stop.duration} minutes
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
