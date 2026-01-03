import React, { useEffect, useState } from "react";

const WasteConsumptionFourtyEight = ({
  timePeriodValues,
  brief,
  timePeriods,
  type,
}) => {
  const calculateTotalConsumption = () => {
    let total = 0;

    if (brief?.location) {
      // Iterate over all location objects
      Object.values(brief.time).forEach((time) => {
        if (time && typeof time === "object") {
          let filteredKeys = Object.keys(time);

          if (type === "NONHAZ") {
            filteredKeys = filteredKeys.filter((key) =>
              [
                "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
                "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
                "Total packaging waste (Plastic) generated* (Kg)",
                "Total food waste generated/Kitchen Waste* (Kgs)",
              ].includes(key)
            );
          } else if (type === "HAZ") {
            filteredKeys = filteredKeys.filter((key) =>
              [
                "Total e-waste generated* (Kg)",
                "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
                "Total spent formalin solution disposed in Ltrs",
              ].includes(key)
            );
          }

          total += filteredKeys.reduce((sum, key) => {
            let consumption = time[key]; // Get the actual consumption array
            return (
              sum +
              (Array.isArray(consumption)
                ? consumption.reduce((acc, curr) => acc + curr, 0)
                : 0)
            );
          }, 0);
        }
      });
    }

    return total.toFixed(2);
  };

  const totalEnergyConsumption = calculateTotalConsumption();

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split(".");
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    if (rest !== "") {
      lastThree = "," + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + "." + x[1] : num; // Just format the number without manipulating the input string
  };

  // Determine the time period heading based on location count
  const timePeriodHeading = brief?.time
    ? Object.keys(brief.time).length === 1
      ? Object.keys(brief.time)[0] // Show the key name if there's only one location
      : "Overall" // Show "Combined" if more than one location
    : "";

  return (
    <div className="container" style={{ width: "100%" }}>
      <div style={{ display: "flex", width: "100%" }}>
        <div className="energy-card-content" style={{ width: "70%" }}>
          <h4 className="energy-period" style={{ marginTop: "0px" }}>
            {timePeriodHeading.charAt(0).toUpperCase() +
              timePeriodHeading.slice(1)}
          </h4>
          <div className="energy-value">
          
            {type === "NONHAZ"
              ? "Non-hazardous waste"
              : type === "HAZ"
              ? "Hazardous waste"
              : type === "BIO"
              ? "Bio medical Waste"
              : ""}{" "}
          </div>

          {/* <div className="energy-value">Ganerated</div> */}
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="energy-value-box"
            style={{
              background: "#e2eafd",
              width: "100%",
              height: "8vh",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="energy-value"
              style={{ color: "#0057a7", fontSize: "20px", fontWeight: 600 }}
            >
              {`${formatNumberWithIndianCommas(totalEnergyConsumption)} KG`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteConsumptionFourtyEight;
