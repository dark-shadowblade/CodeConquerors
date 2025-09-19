'use client';

import Link from 'next/link';

export default function AlertsWidget({ stations, waterLevels }) {
  const criticalStations = stations.filter(station => {
    const stationLevels = waterLevels.filter(w => w.station_id === station.id);
    return stationLevels.some(level => level.water_level_m < 11);
  }).slice(0, 5); // Show only top 5

  return (
    <div>
      <div className="widget-header">
        <h3 className="widget-title">Recent Alerts</h3>
        <Link href="/alerts" className="view-all-link">
          View All →
        </Link>
      </div>
      
      {criticalStations.length === 0 ? (
        <div className="no-alerts">
          No critical alerts at this time
        </div>
      ) : (
        <div className="alerts-container">
          {criticalStations.map(station => {
            const latestReading = waterLevels
              .filter(w => w.station_id === station.id)
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
            
            return (
              <Link
                key={station.id}
                href={`/station/${station.id}`}
                className="alert-item-link"
              >
                <div className="alert-item">
                  <div className="alert-title">⚠️ {station.name}</div>
                  <div className="alert-detail">
                    Water level: {latestReading.water_level_m}m
                  </div>
                  <div className="alert-time">
                    Last updated: {new Date(latestReading.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
