'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AlertsList() {
  const [stations, setStations] = useState([]);
  const [waterLevels, setWaterLevels] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    state: '',
    district: '',
    search: ''
  });

  useEffect(() => {
    fetch('/data/stations.json')
      .then(res => res.json())
      .then(setStations);
    fetch('/data/waterlevels.json')
      .then(res => res.json())
      .then(setWaterLevels);
  }, []);

  useEffect(() => {
    // Get only critical stations (water level < 11)
    const criticalStations = stations.filter(station => {
      const stationLevels = waterLevels.filter(w => w.station_id === station.id);
      return stationLevels.some(level => level.water_level_m < 11);
    });

    // Apply filters
    let result = criticalStations.filter(station => {
      if (filters.state && station.state !== filters.state) return false;
      if (filters.district && station.district !== filters.district) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return station.name.toLowerCase().includes(searchTerm) ||
               station.district.toLowerCase().includes(searchTerm) ||
               station.state.toLowerCase().includes(searchTerm);
      }
      return true;
    });

    setFilteredStations(result);
  }, [stations, waterLevels, filters]);

  const getLatestWaterLevel = (stationId) => {
    const stationReadings = waterLevels
      .filter(w => w.station_id === stationId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return stationReadings.length > 0 ? stationReadings[0].water_level_m : null;
  };

  const states = [...new Set(stations.map(station => station.state))].sort();
  const districts = [...new Set(stations.map(station => station.district))].sort();

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
      search: ''
    });
  };

  const appliedFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="stations-container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="page-header">
        <h1>Critical Stations</h1>
        <div className="header-actions">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-btn"
          >
            <span>🔍 Filters</span>
            {appliedFiltersCount > 0 && (
              <span className="filter-count">{appliedFiltersCount}</span>
            )}
          </button>
        </div>
      </div>

      <p style={{ color: '#666', marginBottom: '2rem' }}>
        {filteredStations.length} critical stations found
      </p>

      {/* Filter Sidebar - Only State and District for critical stations */}
      <div className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button onClick={() => setShowFilters(false)} className="close-filters">
            ×
          </button>
        </div>

        <div className="filter-content">
          {/* State Filter */}
          <div className="filter-section">
            <h4>State</h4>
            <div className="filter-options">
              {states.map(state => (
                <label key={state} className="filter-option">
                  <input
                    type="radio"
                    name="state"
                    value={state}
                    checked={filters.state === state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  />
                  <span>{state}</span>
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="state"
                  value=""
                  checked={filters.state === ''}
                  onChange={(e) => handleFilterChange('state', '')}
                />
                <span>All States</span>
              </label>
            </div>
          </div>

          {/* District Filter */}
          <div className="filter-section">
            <h4>District</h4>
            <div className="filter-options">
              {districts.map(district => (
                <label key={district} className="filter-option">
                  <input
                    type="radio"
                    name="district"
                    value={district}
                    checked={filters.district === district}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                  />
                  <span>{district}</span>
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="district"
                    value=""
                  checked={filters.district === ''}
                  onChange={(e) => handleFilterChange('district', '')}
                />
                <span>All Districts</span>
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
            <button onClick={() => setShowFilters(false)} className="apply-filters-btn">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when filters are open */}
      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* Stations Grid */}
      <div className="stations-grid">
        {filteredStations.length === 0 ? (
          <div className="no-stations">
            <p>No critical stations found matching your filters.</p>
            <button onClick={clearFilters} className="clear-filters-btn primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredStations.map(station => {
            const latestLevel = getLatestWaterLevel(station.id);

            return (
              <Link
                key={station.id}
                href={`/station/${station.id}`}
                className="station-card critical"
              >
                <div className="station-header">
                  <div>
                    <h3 className="station-name">{station.name}</h3>
                    <p className="station-location">
                      {station.district}, {station.state}
                    </p>
                  </div>
                  <span className="station-status status-critical">
                    Critical
                  </span>
                </div>

                <div className="station-details">
                  <div className="detail-item">
                    <div className="detail-value" style={{ color: '#ff4757' }}>
                      {latestLevel ? `${latestLevel}m` : 'N/A'}
                    </div>
                    <div className="detail-label">Current Level</div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-value">
                      {waterLevels.filter(w => w.station_id === station.id).length}
                    </div>
                    <div className="detail-label">Readings</div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
