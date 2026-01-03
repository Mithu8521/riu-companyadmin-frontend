import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';  // Import Tooltip and OverlayTrigger

// Import Bootstrap CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';

const TotalWaterWithdrawnSingle = ({ consumption, notGenerated, maxConsumption }) => {
  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const withdrawnWidth = (consumption / maxConsumption) * totalWidth;
  const notWithdrawnWidth = (notGenerated / maxConsumption) * totalWidth;

  // Define the tooltip content
  const renderTooltipWithdrawn = (props) => (
    <Tooltip id="water-withdrawn-tooltip" {...props}>
      {`Scope 2: ${consumption.toFixed(2)} tCO2e`}
    </Tooltip>
  );

  const renderTooltipNotWithdrawn = (props) => (
    <Tooltip id="water-not-withdrawn-tooltip" {...props}>
      {`Scope 1: ${notGenerated.toFixed(2)} tCO2e`}
    </Tooltip>
  );

  return (
    <div className="water-withdrawn-container">
      <div className="water-withdrawn-header">
        Scope 1 and Scope 2 Comparison
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
        <OverlayTrigger
          placement="top"
          overlay={renderTooltipWithdrawn}
        >
          <div className="water-withdrawn-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none" }}>
            <div
              className="water-withdrawn-bar-filled"
              style={{ width: `${withdrawnWidth}%`, backgroundColor: '#3ABEC7', borderTopRightRadius: "10px", borderBottomRightRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}
            >
              {consumption}
            </div>
          </div>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={renderTooltipNotWithdrawn}
        >
          <div className="water-withdrawn-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none" }}>
            <div
              className="water-withdrawn-bar-not-generated"
              style={{ width: `${notWithdrawnWidth}%`, backgroundColor: '#11546f', borderTopRightRadius: "10px", borderBottomRightRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}
            >
              {notGenerated}
            </div>
          </div>
        </OverlayTrigger>
      </div>

      <div className="water-withdrawn-legend" style={{ display: "flex", gap: "10%" }}>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{
              backgroundColor: "#3ABEC7",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "8px",
              borderRadius: "50%",
            }}
          ></span>
          <span className="legend-label">Scope 1</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-color"
            style={{
              backgroundColor: "#11546f",
              display: "inline-block",
              width: "15px",
              height: "15px",
              marginRight: "8px",
              borderRadius: "50%",
            }}
          ></span>
          <span className="legend-label">Scope 2</span>
        </div>
      </div>
    </div>
  );
};

export default TotalWaterWithdrawnSingle;
