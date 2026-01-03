import React from 'react';
import './TotalEmissionGenerated.css'; // Import your CSS file here

const ProgressTowardsESG = ({ consumption, maxConsumption }) => {
  // Calculate the width of the filled portion of the bar based on consumption
  const filledWidth = (consumption / maxConsumption) * 100;

  return (
    <div className="emission-bar-container">
      <div className="emission-bar-header">
        Green Procurement Rate
      </div>
      <div className="emission-bar-labels">
        <span>00</span>
        <span>300</span>
        <span>600</span>
        <span>900</span>
        <span>1000</span>
        <span>1200</span>
      </div>
      <div className="emission-bar-dotted-line"></div>

      <div className="emission-bar">
        <div
          className="emission-bar-filled"
          style={{ width: `${filledWidth}%` }}
        />
      </div>

    </div>
  );
};

export default ProgressTowardsESG;
