import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap"; // Import Tooltip and OverlayTrigger

// Import Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

const TotalEmissionGeneratedSingle = ({ consumption, notGenerated }) => {
  // Calculate the total energy and round it to the nearest whole number
  let totalEnergy = consumption + notGenerated;
  totalEnergy = Math.round(totalEnergy); // Round to the nearest whole number

  // Define the tooltip content
  const renderTooltip = (props) => (
    <Tooltip id="energy-bar-tooltip" {...props}>
      <div>
        <strong>Scope 1 (Consumption):</strong> {consumption.toFixed(2)} tCO2
      </div>
      <div>
        <strong>Scope 2 (Not Generated):</strong> {notGenerated.toFixed(2)} tCO2
      </div>
      <div>
        <strong>Total Emission:</strong> {totalEnergy} GJ
      </div>
    </Tooltip>
  );

  // Calculate the width percentages for consumption and notGenerated
  const consumptionWidth = (consumption / totalEnergy) * 100;
  const notGeneratedWidth = (notGenerated / totalEnergy) * 100;

  return (
    <div className="energy-bar-container">
      <div className="energy-bar-header">Total Emission Generated</div>

      {/* Energy Bar Labels */}
      <div className="energy-bar-labels">
        <span>{0}</span>
        <span>{Math.round((1 / 5) * totalEnergy)}</span>
        <span>{Math.round((2 / 5) * totalEnergy)}</span>
        <span>{Math.round((3 / 5) * totalEnergy)}</span>
        <span>{Math.round((4 / 5) * totalEnergy)}</span>
        <span>{totalEnergy}</span>
      </div>
      <div className="energy-bar-dotted-line"></div>

      {/* Energy Bar with Tooltip */}
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        <div
          className="energy-bar"
          style={{ display: "flex", width: "100%", height: "30px" }}
        >
          <div
            className="energy-bar-filled-consumption"
            style={{
              width: `${consumptionWidth}%`,
              backgroundColor: "#4CAF50", // Green color for Scope 1 (Consumption)
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              height: "100%",
            }}
          >
            {consumption.toFixed(2)} tCO2
          </div>
          <div
            className="energy-bar-filled-notGenerated"
            style={{
              width: `${notGeneratedWidth}%`,
              backgroundColor: "#1abc9c", // Yellow color for Scope 2 (Not Generated)
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              height: "100%",
            }}
          >
            {notGenerated.toFixed(2)} tCO2
          </div>
        </div>
      </OverlayTrigger>

      {/* Legend below the graph */}
      <div
        className="energy-bar-legend"
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "30px" }}
        >
          {/* Square color for Scope 1 */}
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#4CAF50",
              marginRight: "10px",
            }}
          ></div>
          <span>Scope 1</span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Square color for Scope 2 */}
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#1abc9c",
              marginRight: "10px",
            }}
          ></div>
          <span>Scope 2</span>
        </div>
      </div>
    </div>
  );
};

export default TotalEmissionGeneratedSingle;
