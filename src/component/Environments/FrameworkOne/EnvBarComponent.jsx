import img from "../../../img/no.png";
import React, { useEffect, useState } from "react";

const EnvBarComponent = ({
  type,
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
}) => {
  const roundUp = (value) => Math.ceil(value / 10000) * 10000;

  const [rowOptionsWithValues, setRowOptionsWithValues] = useState(() => {
    let options =
      type === "energy"
        ? [
            { value: totalConsumptionRenewable, option: "Renewable" },
            { value: totalConsumptionNonRenewable, option: "Non-Renewable" },
          ]
        : [
            { value: totalConsumptionRenewable, option: "Consumed" },
            { value: totalConsumptionNonRenewable, option: "Discharged" },
          ];

    // Sort by value (ascending)
    return options.sort((a, b) => a.value - b.value);
  });

  useEffect(() => {
    if (totalConsumptionNonRenewable && totalConsumptionRenewable) {
      setRowOptionsWithValues(() => {
        let options =
          type === "energy"
            ? [
                { value: totalConsumptionRenewable, option: "Renewable" },
                {
                  value: totalConsumptionNonRenewable,
                  option: "Non-Renewable",
                },
              ]
            : [
                { value: totalConsumptionRenewable, option: "Consumed" },
                { value: totalConsumptionNonRenewable, option: "Discharged" },
              ];

        // Sort by value (ascending)
        return options.sort((a, b) => a.value - b.value);
      });
    }
  }, [totalConsumptionNonRenewable, totalConsumptionRenewable]);

  if (!totalConsumptionNonRenewable && !totalConsumptionRenewable) {
    return (
      <div className="container">
        <img
          src={img}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  const colors = [
    "#83BBD5",
    "#11546f",
    "#3ABEC7",
    "#3F88A5",
    "#88D29E",
    "#11546f",
  ];

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return value.toLocaleString();
    }
  };

  // Ensure total is rounded up to the next 10,000
  const totalSum = roundUp(
    rowOptionsWithValues.reduce((sum, item) => sum + item.value, 0)
  );

  return (
    <div className="container">
      <div style={{ fontSize: "18px", fontWeight: 600, height: "10%" }}>
        {type === "energy"
          ? "Renewable & Non-Renewable Energy"
          : "Water Consumed and Discharged"}
      </div>

      <div className="renewable-bar-labels" style={{ marginTop: "5%" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ fontSize: "12px", fontWeight: "bold" }}>
            {formatValue((totalSum / 5) * i)}
          </span>
        ))}
      </div>

      <div
        className="renewable-bar-dotted-line"
        style={{ height: "1px", background: "dotted", marginBottom: "10px" }}
      ></div>

      {rowOptionsWithValues.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              height: "30px",
              width: "100%",
              backgroundColor: "#e0e0e0",
              overflow: "hidden",
              marginBottom: "2px",
            }}
          >
            {rowOptionsWithValues.map((item, index) => {
              const widthPercentage = (item.value / totalSum) * 100;
              return (
                <div
                  key={index}
                  title={`${item.option}: ${item.value.toLocaleString()}`}
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: colors[index % colors.length],
                    display: item.value > 0 ? "flex" : "none",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {formatValue(item.value)}
                </div>
              );
            })}
          </div>

          <div
            className="unit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3%",
              marginBottom: "5%",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                height: "100%",
                padding: "0%",
              }}
            >
              {type === "energy" ? "(in GJ)" : "(in KL)"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {rowOptionsWithValues.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "10px",
                  marginBottom: "1%",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    borderRadius: "50%",
                    height: "15px",
                    backgroundColor: colors[index % colors.length],
                    marginRight: "5px",
                  }}
                />
                <span style={{ fontSize: "14px" }}>{item.option}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnvBarComponent;
