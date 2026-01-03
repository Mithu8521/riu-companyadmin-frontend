import React from "react";
import "./Renewable.css"; // Import your CSS file here
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const Renewable = ({ consumption, notGenerated, maxConsumption }) => {
  // Calculate total renewable
  const totalEmission = consumption + notGenerated;

  // Calculate the width percentages for each section of the bar
  const totalWidth = 100; // 100% width of the bar
  const filledWidth = (consumption / maxConsumption) * totalWidth;
  const notGeneratedWidth = (notGenerated / maxConsumption) * totalWidth;
  const remainingWidth = totalWidth - (filledWidth + notGeneratedWidth);

  const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
  );

  return (
    <div className="renewable-bar-container">
      <div className="renewable-bar-header">
        Renewable and None Renewable Sources.
      </div>
      <div className="renewable-bar-labels">
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(maxConsumption / 5 / 10) * 10}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(((maxConsumption / 5) * 2) / 10) * 10}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(((maxConsumption / 5) * 3) / 10) * 10}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(((maxConsumption / 5) * 4) / 10) * 10}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(maxConsumption / 10) * 10}
        </span>
      </div>
      <div className="renewable-bar-dotted-line"></div>

      <div className="renewable-bar" style={{ border: "none" }}>
        <OverlayTrigger
          placement="top"
          overlay={renderTooltip(`Renewable: ${consumption} GJ`)}
        >
          <div
            className="renewable-bar-filled"
            style={{ width: `${filledWidth}%`, backgroundColor: "#11546f", display: "flex", justifyContent: "center", alignItems: 'center', color: "white" }}
          >
            {consumption}
          </div>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={renderTooltip(`Non-Renewable: ${notGenerated} GJ`)}
        >
          <div
            className="renewable-bar-not-generated"
            style={{
              width: `${notGeneratedWidth}%`,
              backgroundColor: "#83bbd5",
              display: "flex", justifyContent: "center", alignItems: 'center', color: "white"
            }}
          >
            {notGenerated}
          </div>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={renderTooltip(`Remaining: ${remainingWidth}%`)}
        >
          <div
            className="renewable-bar-remaining"
            style={{
              width: `${remainingWidth}%`,
              backgroundColor: "lightgray",
              display: "flex", justifyContent: "center", alignItems: 'center', color: "white"
            }}
          >
            {remainingWidth}
          </div>
        </OverlayTrigger>
      </div>
      <div
        className="renewable-bar-legends"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div className="legend-item" style={{ width: "20%" }}>
          <div
            className="legend-color"
            style={{ backgroundColor: "#11546f" }}
          ></div>
          <span>Renewable</span>
        </div>
        <div className="legend-item" style={{ width: "30%" }}>
          <div
            className="legend-color"
            style={{ backgroundColor: "#83bbd5" }}
          ></div>
          <span>Non-Renewable</span>
        </div>
      </div>
    </div>
  );
};

export default Renewable;
