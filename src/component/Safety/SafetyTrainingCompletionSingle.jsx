import React, { useState } from 'react';
// import './SafetyTrainingCompletionSingle.css'; // Import your CSS file here
import "../Diversity/Toggle.css";

const SafetyTrainingCompletionSingle = ({ permanentData, nonPermanentData, maxConsumption }) => {
  // Toggle state to switch between Permanent and Non-Permanent data
  const [isPermanent, setIsPermanent] = useState(true);

  // Determine which data to use based on toggle state
  const data = isPermanent ? permanentData : nonPermanentData;
  const { consumption, notGenerated } = data;

  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const filledWidth = (consumption / maxConsumption) * totalWidth;
  const notGeneratedWidth = (notGenerated / maxConsumption) * totalWidth;
  const remainingWidth = totalWidth - (filledWidth + notGeneratedWidth);

  // Toggle between Permanent and Non-Permanent
  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="renewable-bar-container">
      <div style={{ height: "20%", display: "flex", marginBottom: "2%", justifyContent: "space-between", width: "100%" }}>
        <h2 style={{ fontSize: "1em" }}>
          Safety Training Completion Rates: Percentage of Employees Trained Over Time
        </h2>

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span className="toggle-arrow">{isPermanent ? "→" : "←"}</span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>

      </div >

      <div style={{ height: "80%" }}>
        <div className="renewable-bar-labels">
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{maxConsumption / 5}</span>
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(maxConsumption / 5) * 2}</span>
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(maxConsumption / 5) * 3}</span>
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(maxConsumption / 5) * 4}</span>
          <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{maxConsumption}</span>
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


    </div>
  );
};

export default SafetyTrainingCompletionSingle;

// Sample usage of the component with data

const permanentData = {
  consumption: 700,
  notGenerated: 300,
};

const nonPermanentData = {
  consumption: 400,
  notGenerated: 500,
};

const maxConsumption = 1200;

// Usage in a parent component
// <SafetyTrainingCompletionSingle permanentData={permanentData} nonPermanentData={nonPermanentData} maxConsumption={maxConsumption} />
