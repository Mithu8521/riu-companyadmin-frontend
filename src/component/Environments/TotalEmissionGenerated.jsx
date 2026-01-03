import React from "react";
import "./TotalEmissionGenerated.css"; // Import your CSS file here
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const TotalEmissionGeneratedSingle = ({ totalScope }) => {
  // Calculate the width of the filled portion of the bar based on consumption
  const filledWidth = (1 / 1) * 100;

  return (
    <div className="emission-bar-container">
      <div className="emission-bar-header">Total Emission Generated (in tCO2e)</div>
      <div className="emission-bar-labels">
        <span>{0}</span>
        <span>{Math.round(((1 / 5) * totalScope) / 100) * 100}</span>
        <span>{Math.round(((2 / 5) * totalScope) / 100) * 100}</span>
        <span>{Math.round(((3 / 5) * totalScope) / 100) * 100}</span>
        <span>{Math.round(((4 / 5) * totalScope) / 100) * 100}</span>
        <span>{Math.round(((5 / 5) * totalScope) / 100) * 100}</span>
      </div>
      <div className="emission-bar-dotted-line"></div>

      <div className="emission-bar">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip">
              {totalScope}
            </Tooltip>
          }
        >
          <div
            className="emission-bar-filled"
            style={{ width: `${filledWidth}%`, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}
          >{totalScope}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default TotalEmissionGeneratedSingle;
