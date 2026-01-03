import React, { useEffect, useState } from "react";

const EnergyConsumptionFourtyEight = ({
  timePeriodValues,
  brief,
  timePeriods,
  type,
}) => {
  // Function to get the appropriate unit based on type
  const getUnit = () => {
    if (type === "ELE" || type === "REW") {
      return "kWh";
    }
    return "GJ";
  };

  // Function to convert values if needed
  const convertValue = (value) => {
    if (type === "ELE" || type === "REW") {
      // Multiply by 1000 for ELE and REW types
      return (parseFloat(value * 2500) / 9).toFixed(2);
    }
    return value;
  };

  const calculateTotalConsumption = () => {
    let total = 0;

    if (brief?.location) {
      // Iterate over all location objects
      Object.values(brief.time).forEach((time) => {
        if (time && typeof time === "object") {
          let filteredKeys = Object.keys(time);

          if (type === "FUEL") {
            filteredKeys = filteredKeys.filter((key) =>
              [
                "Petrol",
                "PNG",
                "LPG",
                "CNG",
                "Diesel",
              ].includes(key)
            );
          } else if (type === "ELE") {
            filteredKeys = filteredKeys.filter((key) =>
              [
                "Electricity Power plant (Captive Power Plant - Natural Gas)",
                "GRID electricity",
                "Electricity consumption through DG",
                "Electricity consumption from Renewable energy (via PPA)",
                "Electricity consumption from Renewable energy (rooftop solar)",
              ].includes(key)
            );
          } else if (type === "REW") {
            filteredKeys = filteredKeys.filter((key) =>
              [
                "Electricity consumption from Renewable energy (via PPA)",
                "Electricity consumption from Renewable energy (rooftop solar)",
              ].includes(key)
            );
          }

          total += filteredKeys.reduce((sum, key) => {
            let consumption = time[key]; // Get the actual consumption array
            return sum + (Array.isArray(consumption) ? consumption.reduce((acc, curr) => acc + curr, 0) : 0);
          }, 0);
        }
      });
    }

    // Return the raw total without conversion (we'll convert at display time)
    return total.toFixed(2);
  };

  // Calculate the total energy consumption
  const rawTotalEnergyConsumption = calculateTotalConsumption();
  
  // Convert the value for display if needed
  const totalEnergyConsumption = convertValue(rawTotalEnergyConsumption);

  const formatNumberWithIndianCommas = (number) => {
    // For very large numbers (like kWh values), use k or M notation
    if (type === "ELE" || type === "REW") {
      const num = parseFloat(number);
      if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + "k";
      }
    }

    // Regular Indian comma formatting for smaller numbers
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
            {type === "FUEL"
              ? "Fuel"
              : type === "ELE"
              ? "Electricity"
              : type === "REW"
              ? "Renewable"
              : ""}{" "}
            Energy
          </div>
          <div className="energy-value">Consumption</div>
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
              {`${formatNumberWithIndianCommas(totalEnergyConsumption)} ${getUnit()}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumptionFourtyEight;