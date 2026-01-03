import React from "react";
import noDataImage from "../../../img/no.png";

const CombinedBarWaterDynamic = ({ unit, title, timePeriods, matchedDataWater }) => {
  if (!matchedDataWater) {
    return (
      <div className="container">
        <img
          src={noDataImage} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />
      </div>
    );
  }

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return value; // Format normal numbers
    }
  };

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

  // Sum the values for each time period (dynamically based on the timePeriods)
  const totalValuesPerTimePeriod = Object.keys(timePeriods).map((timePeriod, index) => {
    return matchedDataWater[index].question_details.reduce((total, detail, categoryIndex) => {
      // Check if matchedDataWater[index].answer[categoryIndex] is an array
      const answerValue = Array.isArray(matchedDataWater[index].answer[categoryIndex])
        ? Number(matchedDataWater[index].answer[categoryIndex][0]) || 0
        : 0; // Treat as 0 if not an array

      return total + answerValue;
    }, 0);
  });

  const isDecimal = (num) => num % 1 !== 0;

  const adjustAndRoundTotalSum = (totalSum) => {
    // Define the thresholds or rounding steps
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    // Handle values less than 1 (same logic as before)
    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200; // Round to nearest 0.005
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100; // Round to nearest 0.01
      } else {
        return Math.ceil(totalSum * 2) / 2; // Round to nearest 0.5
      }
    }

    // For values greater than or equal to 1, round based on the defined thresholds
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        // Debugging step: log the threshold and the result of rounding up
        console.log(
          `Rounding ${totalSum} up to the next threshold: ${thresholds[i]}`
        );
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to the next threshold
      }
    }

    // If no threshold is applicable, return the value as is (e.g., for values below 10)
    return totalSum;
  };

  // Calculate the total of all time periods combined
  let totalSum = totalValuesPerTimePeriod.reduce((sum, value) => sum + value, 0);

  // Apply rounding logic to the total sum
  totalSum = adjustAndRoundTotalSum(totalSum);

  const percentagePerTimePeriod = totalValuesPerTimePeriod.map((value) =>
    totalSum > 0 ? (value / totalSum) * 100 : 0
  );

  // Define colors for the sections
  const colors = [
    "#88D29E", // First time period (e.g., m1)
    "#3F88A5", // Second time period (e.g., m2)
    "#FF9F1C", // Third time period (e.g., m3)
    "#FF3F34", // Fourth time period (e.g., m4)
    "#6A4C93", // Fifth time period
    "#8CBBCE", // Sixth time period
  ];

  return (
    <div className="container">
      <div style={{ fontSize: "18px", fontWeight: 600, height: "10%", marginBottom: "2%" }}>
        {title}
      </div>

      {/* Check if totalSum is 0 and render the "No Data" image */}
      {totalSum === 0 ? (
        <div style={{ textAlign: "center", marginTop: "1px" }}>
          <img src={noDataImage} alt="No Data" style={{ width: "150px", height: "120px" }} />
        </div>
      ) : (
        <>
          <div className="renewable-bar-labels" style={{ marginTop: "3.5%", paddingLeft: "5%" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{formatValue(totalSum / 5)}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{formatValue((totalSum / 5) * 2)}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{formatValue((totalSum / 5) * 3)}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{formatValue((totalSum / 5) * 4)}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{formatValue(totalSum)}</span>
          </div>
          <div className="renewable-bar-dotted-line"></div>

          <div style={{ display: "flex", height: "90%", flexDirection: "column", width: "100%", marginBottom: "2%" }}>
            <div className="d-flex" style={{ width: "100%", marginBottom: "3%", height: "25%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  margin: "5px 0",
                  height: "100%",
                  backgroundColor: "#f3f3f3",
                  width: "100%",
                }}
              >
                {/* Render each time period as a section of the bar */}
                {percentagePerTimePeriod.map((percentage, index) => (
                  <div
                    key={index}
                    style={{
                      height: "100%",
                      width: `${percentage}%`, // Width based on percentage
                      backgroundColor: colors[index % colors.length],
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 400,
                      position: "relative",
                    }}
                    title={`${Object.keys(timePeriods)[index]}: ${totalValuesPerTimePeriod[index]}`}
                  >
                    {/* Display data value inside the bar */}
                    <span style={{ position: "absolute", fontSize: "12px", fontWeight: 500 }}>
                      {formatValue(totalValuesPerTimePeriod[index])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="unit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "2%",
                marginBottom: "1%",
                marginTop: "-2%",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 400, height: "100%" }}>{`(in ${unit})`}</div>
            </div>

            {/* Dynamic Legend */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                gap: "17px",
                width: "100%",
                overflow: "auto",
              }}
            >
              {Object.keys(timePeriods).map((timePeriod, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: colors[index % colors.length],
                      marginRight: "5px",
                    }}
                  />
                  <div style={{ fontSize: "12px" }}>
                    {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CombinedBarWaterDynamic;
