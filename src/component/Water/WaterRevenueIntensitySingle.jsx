import React from 'react';
// import './WaterRevenueIntensity.css'; // Import your CSS file here

const WaterRevenueIntensitySinglee = ({ consumption, notGenerated, maxConsumption }) => {
  // Calculate total renewable
  const totalEmission = consumption + notGenerated;

  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const filledWidth = (consumption / maxConsumption) * totalWidth;
  const notGeneratedWidth = (notGenerated / maxConsumption) * totalWidth;
  const remainingWidth = totalWidth - (filledWidth + notGeneratedWidth);

  return (
    <div className="renewable-bar-container">
      <div className="renewable-bar-header">
        Renewable and None Renewable Sources.
      </div>
      <div className="renewable-bar-labels">
        <span style={{ fontSize: "11px" }}>0</span>
        <span style={{ fontSize: "11px" }}>{maxConsumption / 5}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 2}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 3}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 4}</span>
        <span style={{ fontSize: "11px" }}>{maxConsumption}</span>
      </div>
      <div className="renewable-bar-dotted-line"></div>

      <div className="renewable-bar">
        <div
          className="renewable-bar-filled"
          style={{ width: `${filledWidth}%`, backgroundColor: 'green' }}
        />
        <div
          className="renewable-bar-not-generated"
          style={{ width: `${notGeneratedWidth}%`, backgroundColor: 'orange' }}
        />
        <div
          className="renewable-bar-remaining"
          style={{ width: `${remainingWidth}%`, backgroundColor: 'lightgray' }}
        />
      </div>
    </div>
  );
};

export default WaterRevenueIntensitySinglee;
