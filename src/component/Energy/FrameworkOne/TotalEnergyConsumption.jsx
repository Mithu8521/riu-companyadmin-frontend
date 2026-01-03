import React from "react";
import noDataImage from "../../../img/no.png"

const EnergyConsumptionCard = ({
  totalConsumptionRenewable,
  timePeriodValues,
  totalConsumptionNonRenewable,
  timePeriods,
  title
}) => {
  if (!totalConsumptionRenewable && !totalConsumptionNonRenewable) {
    return (
      <div className='container'>
        <img
          src={noDataImage} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{ width: "150px", height: "55px", display: "block", margin: "0 auto" }}
        />

      </div>
    )
  }
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

  return (
    <div className="container" style={{ width: "100%", paddingTop: "2px" }}>
      <div style={{ display: "flex", width: "100%" }}>
        <div className="energy-card-content" style={{ width: "70%" }}>
          <h4 className="energy-period" style={{ marginTop: "0px" }}>
            {timePeriodValues.length > 1
              ? "Overall"
              : Object.keys(timePeriods)[0].charAt(0).toUpperCase() + Object.keys(timePeriods)[0].slice(1)}
          </h4>

          <div className="energy-value">Total {title} Energy</div>
          <div className="energy-value">Consumption </div>
        </div>
        <div style={{ width: "30%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="energy-value-box" style={{ background: "#e2eafd", width: "100%", height: "8vh", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="energy-value" style={{ color: "#0057a7", fontSize: "20px", fontWeight: 600 }}>{`${formatNumberWithIndianCommas(totalConsumptionRenewable + totalConsumptionNonRenewable)
              } GJ`}</div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EnergyConsumptionCard;
