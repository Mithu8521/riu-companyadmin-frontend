import React from "react";
import "./Overview.css"; // CSS file for styling
const Overview = ({
  graphData,
  sectorQuestionAnswerDataForGraph,
  timePeriods,
}) => {
  // console.log("time", timePeriods);

  const renewableEnergy = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[1]["answer"])[4][0]
  );
  const nonRenewableEnergy = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[1]["answer"])[9][0]
  );

  const scopeOne = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[0]["answer"])[0][1]
  );

  const scopeTwo = Number(
    JSON.parse(sectorQuestionAnswerDataForGraph[0]["answer"])[1][1]
  );

  const totalEnergy = renewableEnergy + nonRenewableEnergy;

  const totalScope = scopeOne + scopeTwo;

  // Calculate the percentage for each energy type
  const renewableEnergyPercentage = (renewableEnergy / totalEnergy) * 100;
  const nonRenewableEnergyPercentage = (nonRenewableEnergy / totalEnergy) * 100;
  const scopeOnePercent = (scopeOne / totalScope) * 100;
  const scopeTwoPercent = (scopeTwo / totalScope) * 100;


  const filteredData = graphData.filter(item => item.title === "Water withdrawal");

  const timePeriodValues = Object.values(timePeriods);

  const matchedData = filteredData.filter(item => {
    return timePeriodValues.includes(item.formDate);
  });


  const totalSum = matchedData?.reduce((sum, item) => {
    // Ensure item.answer is defined and is a 2D array
    if (Array.isArray(item.answer)) {
      // Limit the iteration to the first 6 elements
      const innerSum = item.answer.slice(0, 6).reduce((innerSum, innerArray) => {
        if (Array.isArray(innerArray) && innerArray[0] != null) {
          return innerSum + Number(innerArray[0]);
        }
        return innerSum;
      }, 0);
      return sum + innerSum;
    }
    return sum;
  }, 0);


  const filteredDataWaste = graphData.filter(item => item.title === "Waste Disposal");

  const matchedDataWaste = filteredDataWaste.filter(item => {
    return timePeriodValues.includes(item.formDate);
  });


  const totalSumWaste = matchedDataWaste.reduce((sum, item) => {
    // Ensure item.answer is defined and is a 2D array
    if (Array.isArray(item.answer)) {
      // Sum every element in the 2D array
      const innerSum = item.answer.reduce((innerSum, innerArray) => {
        // Sum elements in each inner array
        return innerSum + innerArray.reduce((arraySum, value) => {
          return arraySum + (Number(value) || 0); // Convert value to number and handle non-numeric values
        }, 0);
      }, 0);
      return sum + innerSum;
    }
    return sum;
  }, 0);


  const data = [
    {
      title: "Non-Renewable Energy",
      value: `${nonRenewableEnergy} GJ`,
      color: "#6EC1E4",
      progress: `${nonRenewableEnergyPercentage.toFixed(2)}`,
    },
    {
      title: "Renewable Energy",
      value: `${renewableEnergy} GJ`,
      color: "#66C164",
      progress: `${renewableEnergyPercentage.toFixed(2)}`,
    },
    {
      title: "Scope 1 Emission",
      value: `${scopeOne} tCO2e`,
      color: "#A2D9CE",
      progress: `${scopeOnePercent.toFixed(2)}`,
    },
    {
      title: "Scope 2 Emission",
      value: `${scopeTwo} tCO2e`,
      color: "#34495E",
      progress: `${scopeTwoPercent.toFixed(2)}`,
    },
    {
      title: "Water Consumption",
      value: `${totalSum} KL`,
      color: "#5DADE2",
      progress: 100,
    },
    { title: "Waste Disposed", value: `${totalSumWaste} mTon`, color: "#2ECC71", progress: 100 },
  ];
  return (
    <div className="dashboard-overview">
      <div className="header" style={{ marginLeft: "5px" }}>
        <div className="title" style={{ fontWeight: 600 }}>
          Summary of Chosen Location and Time
        </div>
      </div>
      <div className="metrics-container">
        {data.map((item, index) => (
          <div className="metric-card" key={index}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="card-title">{item.title}</div>

              <div className="percentage-value">{item.value}</div>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${item.progress}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="legends-container">
        {data.map((item, index) => (
          <div className="legend-item" key={index}>
            <span
              className="legend-color"
              style={{ backgroundColor: item.color }}
            ></span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Overview;
