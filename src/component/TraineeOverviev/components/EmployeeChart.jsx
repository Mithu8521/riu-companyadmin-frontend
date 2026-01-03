import React from 'react';
import './HorizontalBarChart.css';

const HorizontalBarChart = () => {
  return (
    <div className="chart-container">
      {/* Scale */}
      <div className="scale" style={{ fontWeight: 'bold' }}>
        <span className="scale-label">00</span>
        <span className="scale-label">2K</span>
        <span className="scale-label">4K</span>
        <span className="scale-label">6K</span>
        <span className="scale-label">8K</span>
        <span className="scale-label">10K</span>
        <span className="scale-label">12K</span>
      </div>

      {/* Bar Chart */}
      <div className="chart">
        <div className="bar invited" style={{ width: '85%' }}>
          <span className="label">8.5K</span>
        </div>
      </div>
      <div className="chart">
        <div className="bar rejected" style={{ width: '50%' }}>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color invited"></span>
          <span className="legend-label">Invited</span>
        </div>
        <div className="legend-item">
          <span className="legend-color rejected"></span>
          <span className="legend-label">Rejected Invite</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
