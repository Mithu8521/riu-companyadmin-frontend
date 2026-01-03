import React from "react";

const ShowTotalValue = ({
  timePeriodValues,
  brief,
  timePeriods,
  type
}) => {


  const calculateTotalConsumption = () => {
    let total = 0;

    if (brief?.location) {
      // Iterate over all location objects
      Object.values(brief.time).forEach((time) => {
        if (time && typeof time === "object") {
          // Sum the first element of every consumption type in each location
          total += Object.values(time).reduce((sum, consumption) => {
            return sum + (Array.isArray(consumption) && consumption.length ? consumption[0] : 0);
          }, 0);
        }
      });
    }

    return total.toFixed(2);
  };

  const totalEnergyConsumption = calculateTotalConsumption();

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split('.');
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    if (rest !== '') {
      lastThree = ',' + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + '.' + x[1] : num; // Just format the number without manipulating the input string
  };



  // Determine the time period heading based on location count
  const timePeriodHeading = brief?.time
    ? Object.keys(brief.time).length === 1
      ? Object.keys(brief.time)[0] // Show the key name if there's only one location
      : "Combined" // Show "Combined" if more than one location
    : "";

  return (
    <div className="container my-2" style={{ width: "100%" }}>
      <div style={{ display: "flex", width: "100%" }}>
        <div className="energy-card-content" style={{ width: "70%" }}>
          <h4 className="energy-period" style={{ marginTop: "0px" }}>
            {timePeriodHeading.charAt(0).toUpperCase() + timePeriodHeading.slice(1)}
          </h4>
          <div className="energy-value">Overall Water Consumption</div>
          {/* <div className="energy-value">Consumption</div> */}
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
              {`${formatNumberWithIndianCommas(totalEnergyConsumption)} KL`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTotalValue;
