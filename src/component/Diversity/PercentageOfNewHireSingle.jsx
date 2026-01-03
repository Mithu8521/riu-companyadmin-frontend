import React from 'react';
// import './TotalWaterWithdraw.css'; // Import your CSS file here

const PercentageOfNewHireSingle = ({ consumption, notGenerated, maxConsumption }) => {
  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const filledWidth = (consumption / maxConsumption) * totalWidth;
  const notGeneratedWidth = (notGenerated / maxConsumption) * totalWidth;
  const remainingWidth = totalWidth - (filledWidth + notGeneratedWidth);

  return (
    <div className="water-withdrawn-container">
      <div className="water-withdrawn-header">
        Total Water Withdrawn
      </div>
      <div className="water-withdrawn-bar-labels">
        <span style={{ fontSize: "11px" }}>0</span>
        <span style={{ fontSize: "11px" }}>{maxConsumption / 5}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 2}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 3}</span>
        <span style={{ fontSize: "11px" }}>{(maxConsumption / 5) * 4}</span>
        <span style={{ fontSize: "11px" }}>{maxConsumption}</span>
      </div>
      <div className="water-withdrawn-bar-dotted-line"></div>

      <div className="water-withdrawn-bars">
        <div className="water-withdrawn-bar" style={{ marginBottom: "2%" }}>
          <div
            className="water-withdrawn-bar-filled"
            style={{ width: `${filledWidth}%`, backgroundColor: 'green' }}
          />
        </div>
        <div className="water-withdrawn-bar" style={{ marginBottom: "2%" }}>
          <div
            className="water-withdrawn-bar-not-generated"
            style={{ width: `${notGeneratedWidth}%`, backgroundColor: 'orange' }}
          />
        </div>
        <div className="water-withdrawn-bar" style={{ marginBottom: "2%" }}>
          <div
            className="water-withdrawn-bar-remaining"
            style={{ width: `${remainingWidth}%`, backgroundColor: 'lightgray' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PercentageOfNewHireSingle;
