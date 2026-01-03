import React from "react";
import "./EnergyConsumption.css";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const EnergyConsumptionBar = ({ sectorQuestionAnswerDataForGraph }) => {
  // Calculate the width of the filled portion of the bar based on consumption
  const filledWidth = (1 / 1) * 100;

  const renewableEnergy = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[1]["answer"])[4][0]
  );
  const nonRenewableEnergy = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[1]["answer"])[9][0]
  );

  const totalEnergy = renewableEnergy + nonRenewableEnergy;

  return (
    <div className="energy-bar-container">
      <div className="energy-bar-header">Total Energy Consumption (in GJ)</div>
      <div className="energy-bar-labels">
        <span>{0}</span>
        <span>{Math.round(((1 / 5) * totalEnergy) / 100) * 100}</span>
        <span>{Math.round(((2 / 5) * totalEnergy) / 100) * 100}</span>
        <span>{Math.round(((3 / 5) * totalEnergy) / 100) * 100}</span>
        <span>{Math.round(((4 / 5) * totalEnergy) / 100) * 100}</span>
        <span>{Math.round(((5 / 5) * totalEnergy) / 100) * 100}</span>
      </div>
      <div className="energy-bar-dotted-line"></div>

      <div className="energy-bar">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip">
              {totalEnergy}
            </Tooltip>
          }
        >
          <div
            className="energy-bar-filled"
            style={{ width: `${filledWidth}%`, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}
          >
            {totalEnergy}
          </div>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default EnergyConsumptionBar;
