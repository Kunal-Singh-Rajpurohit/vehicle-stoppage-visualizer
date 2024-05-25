// src/App.js
import React, { useState } from 'react';
import MapComponent from './MapComponent';
import './App.css';

function App() {
    const [threshold, setThreshold] = useState(5);

    return (
        <div className="App">
            <h1>Vehicle Stoppage Identification</h1>
            <label>
                Stoppage Threshold (minutes):
                <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    min="1"
                />
            </label>
            <MapComponent stoppageThreshold={threshold} />
        </div>
    );
}

export default App;
