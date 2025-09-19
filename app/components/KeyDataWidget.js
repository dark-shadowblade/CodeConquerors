'use client';

import Link from 'next/link';

export default function KeyDataWidget({ stations, waterLevels }) {
  const totalStations = stations.length;
  const criticalStations = stations.filter(station => {
    const stationLevels = waterLevels.filter(w => w.station_id === station.id);
    return stationLevels.some(level => level.water_level_m < 11);
  }).length;

  const avgWaterLevel = waterLevels.length > 0 
    ? (waterLevels.reduce((sum, level) => sum + level.water_level_m, 0) / waterLevels.length).toFixed(2)
    : '0.00';

  return (
    <div>
      <h3 className="widget-title">Key Metrics</h3>
      <div className="metrics-grid">
        <Link href="/stations" className="metric-link">
          <div className="metric-card metric-total">
            <div className="metric-value">{totalStations}</div>
            <div className="metric-label">Total Stations</div>
          </div>
        </Link>

        <Link href="/stations?status=critical" className="metric-link">
          <div className="metric-card metric-critical">
            <div className="metric-value">{criticalStations}</div>
            <div className="metric-label">Critical Stations</div>
          </div>
        </Link>

        <div className="metric-card metric-average">
          <div className="metric-value">{avgWaterLevel}m</div>
          <div className="metric-label">Avg Water Level</div>
        </div>
      </div>
    </div>
  );
}
