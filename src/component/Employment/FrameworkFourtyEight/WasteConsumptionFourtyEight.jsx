import React from "react";

const WasteConsumptionFourtyEight = ({ brief, type }) => {
  const calculateConsumption = () => {
    let total = 0;
    let count = 0; // Count for calculating average

    if (brief?.location) {
      // Iterate over all time objects
      Object.values(brief.time).forEach((time, timeIndex) => {
        if (time && typeof time === "object") {
          let filteredKeys = Object.keys(time);

          if (type === "GEN") {
            filteredKeys = filteredKeys.filter((key) =>
              ["Manpower turnover rate(FTE atrition rate) in %"].includes(key)
            );
          } else if (type === "DIS") {
            filteredKeys = filteredKeys.filter((key) =>
              ["Total number of employees (FTE)"].includes(key)
            );
          }

          filteredKeys.forEach((key) => {
            let consumption = time[key]; // Get the actual consumption array
            
            // Get corresponding answer array to check if user entered the value
            const timeKeys = Object.keys(brief.time);
            const currentTimeKey = timeKeys[timeIndex];
            const answerArray = brief.answered?.[currentTimeKey]?.[key];

            if (Array.isArray(consumption)) {
              if (type === "GEN") {
                // For GEN (attrition rate), calculate average
                // Only count values where user has entered data
                consumption.forEach((value, index) => {
                  if (answerArray?.[index] === true) {
                    total += value;
                    count++;
                  }
                });
              } else if (type === "DIS") {
                // For DIS (employees):
                // Sum over all locations for this time period
                let countForThisPeriod = 0;
                const sumForThisPeriod = consumption.reduce((acc, curr, index) => {
                  // Only include if user entered the value
                  if (answerArray?.[index] === true) {
                    countForThisPeriod++;
                    return acc + curr;

                  }
                  return acc;
                }, 0);
                
                if (countForThisPeriod > 0) total += (sumForThisPeriod/countForThisPeriod);
              }
            }
          });
        }
      });
    }

    // If type is GEN, calculate average instead of sum
    if (type === "GEN" && count > 0) {
      total = total / count;
    }

    return total.toFixed(2);
  };

  const totalConsumption = calculateConsumption();

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

    return x.length > 1 ? num + "." + x[1] : num;
  };

  // Determine the time period heading based on time period count
  const timePeriodHeading = brief?.time
    ? Object.keys(brief.time).length === 1
      ? Object.keys(brief.time)[0] // Show the key name if there's only one time period
      : "Overall" // Show "Overall" if more than one time period
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
         
            {type === "GEN"
              ? "Attrition Rate"
              : type === "DIS"
              ? "Full Time Employees"
              : ""}{" "}
            {type === "GEN" ? "(%)" : ""}
          </div>
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
              {`${formatNumberWithIndianCommas(totalConsumption)}`}
              {type === "GEN" ? "%" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteConsumptionFourtyEight;