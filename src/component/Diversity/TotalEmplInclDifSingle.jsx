import React, { useState, useEffect } from "react";
import right from "../../img/Vector 1.svg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TotalEmplInclDifSingle = ({ empInclDif }) => {
  const [isPermanent, setIsPermanent] = useState(true);
  const [employeeData, setEmployeeData] = useState({
    males: 0,
    females: 0,
    others: 0,
    maxConsumption: 0,
  });

  useEffect(() => {
    let totalMales = 0;
    let totalFemales = 0;
    let totalOthers = 0;
    let maxConsumption = 1000; // Adjust if needed

    empInclDif.forEach((item) => {
      const answers = item.answer || [[], []];
      const selectedData = isPermanent ? answers[0] : answers[1];

      if (selectedData.length === 3) {
        const males = parseInt(selectedData[0], 10) || 0;
        const females = parseInt(selectedData[1], 10) || 0;
        const others = parseInt(selectedData[2], 10) || 0;

        totalMales += males;
        totalFemales += females;
        totalOthers += others;
      }
    });

    // Set the maximum consumption to the sum of all categories
    maxConsumption = totalMales + totalFemales + totalOthers;

    setEmployeeData({
      males: totalMales,
      females: totalFemales,
      others: totalOthers,
      maxConsumption: maxConsumption,
    });
  }, [empInclDif, isPermanent]);

  const { males, females, others, maxConsumption } = employeeData;

  const totalWidth = 100;
  const malesWidth = (males / maxConsumption) * totalWidth;
  const femalesWidth = (females / maxConsumption) * totalWidth;
  const othersWidth = (others / maxConsumption) * totalWidth;

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="water-withdrawn-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="water-withdrawn-header">
          Total Employees Including Differently Abled
        </div>

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span
                style={{ fontSize: "30px", marginBottom: "25%" }}
                className="toggle-arrow"
              >
                {
                  <img
                    src={right}
                    style={{
                      transform: isPermanent
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                    }}
                    alt="Arrow"
                  />
                }
              </span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>
      </div>

      <div className="water-withdrawn-bar-labels">
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round(maxConsumption / 5)}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round((maxConsumption / 5) * 2)}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round((maxConsumption / 5) * 3)}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>
          {Math.round((maxConsumption / 5) * 4)}
        </span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{Math.round(maxConsumption)}</span>
      </div>
      <div className="water-withdrawn-bar-dotted-line"></div>

      <div className="water-withdrawn-bars">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{`Males: ${males}`}</Tooltip>}
        >
          <div
            className="water-withdrawn-bar"
            style={{
              backgroundColor: "rgba(28, 28, 28, 0.05)",
              border: "none",
              marginBottom: "2%",
            }}
          >
            <div
              className="water-withdrawn-bar-filled"
              style={{
                width: `${malesWidth}%`,
                backgroundColor: "#11564f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {males}{" "}
            </div>
          </div>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{`Females: ${females}`}</Tooltip>}
        >
          <div
            className="water-withdrawn-bar"
            style={{
              backgroundColor: "rgba(28, 28, 28, 0.05)",
              border: "none",
              marginBottom: "2%",
            }}
          >
            <div
              className="water-withdrawn-bar-not-generated"
              style={{
                width: `${femalesWidth}%`, backgroundColor: "#6fa8dc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {females}
            </div>
          </div>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{`Others: ${others}`}</Tooltip>}
        >
          <div
            className="water-withdrawn-bar"
            style={{
              backgroundColor: "rgba(28, 28, 28, 0.05)",
              border: "none",
              marginBottom: "2%",
            }}
          >
            <div
              className="water-withdrawn-bar-remaining"
              style={{
                width: `${othersWidth}%`, backgroundColor: "#9CDFE3", display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              {others}

            </div>
          </div>
        </OverlayTrigger>
      </div>
      <div
        className="legend-container"
        style={{
          marginTop: "10px",
          marginLeft: "0px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="legend-item">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#11564f",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            ></span>
            Males
          </div>
          <div className="legend-item">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#6fa8dc",
                marginRight: "5px",
              }}
            ></span>
            Females
          </div>
          <div className="legend-item">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                borderRadius: "50%",
                height: "12px",
                backgroundColor: "#9CDFE3",
                marginRight: "5px",
              }}
            ></span>
            Others
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalEmplInclDifSingle;
