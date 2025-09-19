'use client';

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

// Simple linear regression (least squares)
function linearRegression(data) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const sumX = data.reduce((acc, d) => acc + d.x, 0);
  const sumY = data.reduce((acc, d) => acc + d.y, 0);
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0);
  const sumXX = data.reduce((acc, d) => acc + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function TrendAnalysis() {
  const [waterLevels, setWaterLevels] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("/data/stations.json")
      .then((res) => res.json())
      .then(setStations);
    fetch("/data/waterlevels.json")
      .then((res) => res.json())
      .then(setWaterLevels);
  }, []);

  useEffect(() => {
    if (!selectedStation || waterLevels.length === 0) {
      setChartData(null);
      return;
    }

    // Filter readings for selected station, sorted by time
    const readings = waterLevels
      .filter((wl) => wl.station_id === selectedStation)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (readings.length === 0) {
      setChartData(null);
      return;
    }

    // Prepare data for regression (x: index, y: water_level_m)
    const dataPoints = readings.map((r, i) => ({
      x: i,
      y: r.water_level_m,
    }));

    const { slope, intercept } = linearRegression(dataPoints);

    // Predict next 5 readings
    const predicted = Array(5)
      .fill(0)
      .map((_, i) => ({
        x: dataPoints.length + i,
        y: slope * (dataPoints.length + i) + intercept,
      }));

    setChartData({
      labels: [
        ...readings.map((r) =>
          new Date(r.timestamp).toLocaleDateString()
        ),
        ...predicted.map((_, i) => `Next ${i + 1}`),
      ],
      datasets: [
        {
          label: "Historical Water Level",
          data: dataPoints.map((d) => d.y),
          borderColor: "#0077cc",
          backgroundColor: "rgba(0, 119, 204, 0.1)",
          pointRadius: 3,
          tension: 0.2,
        },
        {
          label: "Predicted Trend",
          data: [
            ...Array(dataPoints.length).fill(null),
            ...predicted.map((d) => d.y),
          ],
          borderColor: "#ff4757",
          borderDash: [5, 5],
          backgroundColor: "rgba(255, 71, 87, 0.08)",
          pointRadius: 3,
          tension: 0.2,
        },
      ],
    });
  }, [selectedStation, waterLevels]);

  return (
    <div className="trend-analysis-container">
      <h2 className="trend-title">Water Level Trend Analysis</h2>
      <div className="trend-select-row">
        <label htmlFor="station-select" className="trend-label">Select Station:</label>
        <select
          id="station-select"
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="trend-select"
        >
          <option value="">-- Select --</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.district}, {s.state})
            </option>
          ))}
        </select>
      </div>
      {chartData ? (
        <div className="trend-chart-container">
          <Line data={chartData} />
          <p className="trend-note">
            <span className="trend-dot historical" /> <b>Blue</b>: Observed levels &nbsp; 
            <span className="trend-dot predicted" /> <b>Red</b>: Simple prediction
          </p>
        </div>
      ) : selectedStation ? (
        <div className="trend-empty">
          <p>No water level data available for this station.</p>
        </div>
      ) : (
        <div className="trend-empty">
          <p>Select a station to view trend analysis.</p>
        </div>
      )}
    </div>
  );
}
