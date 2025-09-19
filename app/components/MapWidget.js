'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Fix Leaflet marker icons and create custom colored icons
delete L.Icon.Default.prototype._getIconUrl;

// Create custom colored icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Icon colors based on water level status
const getIconColor = (waterLevel) => {
  if (waterLevel < 11) return '#ff4757'; // Red for critical
  if (waterLevel < 12) return '#ffa502'; // Orange for warning
  return '#2ed573'; // Green for normal
};

export default function MapWidget({ stations, waterLevels }) {
  // Get latest water level for each station
  const getLatestWaterLevel = (stationId) => {
    const stationReadings = waterLevels
      .filter(w => w.station_id === stationId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return stationReadings.length > 0 ? stationReadings[0].water_level_m : null;
  };

  // Calculate trend (up/down/stable)
  const getWaterTrend = (stationId) => {
    const stationReadings = waterLevels
      .filter(w => w.station_id === stationId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 2); // Get last two readings
    
    if (stationReadings.length < 2) return 'stable';
    
    const diff = stationReadings[0].water_level_m - stationReadings[1].water_level_m;
    
    if (diff > 0.1) return 'up';
    if (diff < -0.1) return 'down';
    return 'stable';
  };

  return (
    <MapContainer
      center={[19.8762, 75.3433]}
      zoom={6}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      {stations.map(station => {
        const latestLevel = getLatestWaterLevel(station.id);
        const trend = getWaterTrend(station.id);
        const iconColor = latestLevel ? getIconColor(latestLevel) : '#666';
        
        return (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={createCustomIcon(iconColor)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {station.name}
                </h4>
                <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                  {station.district}, {station.state}
                </p>
                
                {latestLevel && (
                  <div style={{ margin: '0 0 12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold' }}>Water Level:</span>
                      <span style={{ 
                        color: getIconColor(latestLevel),
                        fontWeight: 'bold'
                      }}>
                        {latestLevel}m
                      </span>
                      <span style={{ 
                        color: trend === 'up' ? '#ff4757' : trend === 'down' ? '#2ed573' : '#666',
                        fontSize: '14px'
                      }}>
                        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#888',
                      marginTop: '4px'
                    }}>
                      Last updated: {waterLevels
                        .filter(w => w.station_id === station.id)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
                        .timestamp.split(' ')[0]}
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/station/${station.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    backgroundColor: '#0077cc',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}
                >
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
