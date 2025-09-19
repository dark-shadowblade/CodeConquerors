'use client';

import { useState } from 'react';
import Link from 'next/link';
import FilterDropdown from './FilterDropdown';

export default function CriticalStations({ stations, waterLevels }) {
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    severity: ''
  });

  // Get critical stations
  const criticalStations = stations.filter(station => {
    const stationLevels = waterLevels.filter(w => w.station_id === station.id);
    const hasCritical = stationLevels.some(level => level.water_level_m < 11);
    const hasWarning = stationLevels.some(level => level.water_level_m >= 11 && level.water_level_m < 12);
    
    if (filters.severity === 'critical') {
      return hasCritical;
    } else if (filters.severity === 'warning') {
      return hasWarning && !hasCritical;
    }
    return hasCritical || hasWarning;
  });

  // Filter critical stations
  const filteredStations = criticalStations.filter(station => {
    if (filters.state && station.state !== filters.state) return false;
    if (filters.district && station.district !== filters.district) return false;
    return true;
  });

  // Get unique states and districts
  const states = [...new Set(criticalStations.map(station => station.state))].sort();
  const districts = [...new Set(criticalStations.map(station => station.district))].sort();

  // Get districts based on selected state
  const filteredDistricts = filters.state
    ? [...new Set(criticalStations
        .filter(station => station.state === filters.state)
        .map(station => station.district)
      )].sort()
    : districts;

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      district: '',
      severity: ''
    });
  };

  const getLatestWaterLevel = (stationId) => {
    const stationReadings = waterLevels
      .filter(w => w.station_id === stationId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return stationReadings.length > 0 ? stationReadings[0].water_level_m : null;
  };

  const getStatusText = (level) => {
    if (!level) return 'Unknown';
    if (level < 11) return 'Critical';
    if (level < 12) return 'Warning';
    return 'Normal';
  };

  const getStatusColor = (level) => {
    if (!level) return '#666';
    if (level < 11) return '#ff4757';
    if (level < 12) return '#ffa502';
    return '#2ed573';
  };

  return (
    <div>
      <div className="widget-header">
        <h3 className="widget-title">Critical Stations</h3>
        <span className="station-count">
          {filteredStations.length} of {criticalStations.length} stations
        </span>
      </div>

      {/* Filters */}
      <div className="filters-container compact">
        <div className="filter-row">
          <FilterDropdown
            label="State"
            value={filters.state}
            onChange={(value) => handleFilterChange('state', value)}
            options={states.map(state => ({ value: state, label: state }))}
            placeholder="All States"
          />

          <FilterDropdown
            label="District"
            value={filters.district}
            onChange={(value) => handleFilterChange('district', value)}
            options={filteredDistricts.map(district => ({ value: district, label: district }))}
            placeholder="All Districts"
            disabled={!filters.state && filteredDistricts.length > 0}
            hint={!filters.state ? "Select a state first" : null}
          />

          <FilterDropdown
            label="Severity"
            value={filters.severity}
            onChange={(value) => handleFilterChange('severity', value)}
            options={[
              { value: '', label: 'All Severity' },
              { value: 'critical', label: 'Critical Only' },
              { value: 'warning', label: 'Warning Only' }
            ]}
            placeholder="All Severity"
          />

          <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={clearFilters}
              className="clear-filters-btn small"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stations List */}
      <div className="stations-list compact">
        {filteredStations.length === 0 ? (
          <div className="no-stations">
            <p>No critical stations found matching your filters.</p>
          </div>
        ) : (
          filteredStations.map(station => {
            const latestLevel = getLatestWaterLevel(station.id);
            const status = getStatusText(latestLevel);
            const statusColor = getStatusColor(latestLevel);

            return (
              <Link
                key={station.id}
                href={`/station/${station.id}`}
                className="station-item"
              >
                <div className="station-info">
                  <div className="station-name">{station.name}</div>
                  <div className="station-location">{station.district}, {station.state}</div>
                </div>
                <div className="station-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: statusColor, color: 'white' }}
                  >
                    {status}: {latestLevel}m
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="widget-footer">
        <Link href="/stations" className="view-all-link">
          View All Stations →
        </Link>
      </div>
    </div>
  );
}
