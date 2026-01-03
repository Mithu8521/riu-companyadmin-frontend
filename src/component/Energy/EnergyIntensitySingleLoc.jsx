import React from 'react';
// import './EnergyConsumption.css'; // Import your CSS file here

const EnergyIntensitySingleLoc = ({ consumption, maxConsumption }) => {
  // Calculate the width of the filled portion of the bar based on consumption
  const filledWidth = (consumption / maxConsumption) * 100;

  return (
    <div className="energy-bar-container">
      <div className="energy-bar-header">
        Total Energy Consumption
      </div>
      <div className="energy-bar-labels">
        <span>00</span>
        <span>300</span>
        <span>600</span>
        <span>900</span>
        <span>1000</span>
        <span>1200</span>
      </div>
      <div className="energy-bar-dotted-line"></div>

      <div className="energy-bar">
        <div
          className="energy-bar-filled"
          style={{ width: `${filledWidth}%` }}
        />
      </div>

    </div>
  );
};

export default EnergyIntensitySingleLoc;
