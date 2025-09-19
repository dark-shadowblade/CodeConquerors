'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapWidget = dynamic(() => import('./MapWidget'), { ssr: false });
const KeyDataWidget = dynamic(() => import('./KeyDataWidget'), { ssr: false });
const AlertsWidget = dynamic(() => import('./AlertsWidget'), { ssr: false });

export default function DashboardWidgets({ searchQuery }) {
  const [stations, setStations] = useState([]);
  const [waterLevels, setWaterLevels] = useState([]);

  useEffect(() => {
    fetch('/data/stations.json')
      .then(res => res.json())
      .then(setStations);
    fetch('/data/waterlevels.json')
      .then(res => res.json())
      .then(setWaterLevels);
  }, []);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="widget-grid">
      <div className="widget map-widget">
        <h3 className="widget-title">Station Map</h3>
        <div className="map-container">
          <MapWidget stations={filteredStations} waterLevels={waterLevels} />
        </div>
      </div>

      <div className="widget">
        <KeyDataWidget 
          stations={stations} 
          waterLevels={waterLevels} 
        />
      </div>

      <div className="widget">
        <AlertsWidget 
          stations={stations} 
          waterLevels={waterLevels} 
        />
      </div>
    </div>
  );
}
