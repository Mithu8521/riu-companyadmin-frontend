import React, { useState, useEffect } from 'react';

const WasteRecoveredSingle = ({ wasteRecovered }) => {
  const recoverySeries = ["Re-cycled", "Re-used", "Other Recovery Options"];
  const colors = ['#8EC6C5', '#30B0B7', '#576D7A']; // Define colors for each category

  const [aggregatedData, setAggregatedData] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    // Initialize an object to store the aggregated values
    const aggregated = recoverySeries.reduce((acc, recoveryType) => {
      acc[recoveryType] = 0; // Initialize each recovery type with 0
      return acc;
    }, {});

    // Aggregate values from wasteRecovered
    wasteRecovered.forEach(item => {
      const answers = item.answer && Array.isArray(item.answer) && Array.isArray(item.answer[0]) ? item.answer[0] : [];
      answers.forEach((value, index) => {
        if (recoverySeries[index]) {
          const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
          aggregated[recoverySeries[index]] += numericValue;
        }
      });
    });

    // Calculate total sum
    const sum = Object.values(aggregated).reduce((total, value) => total + value, 0);

    setAggregatedData(aggregated);
    setTotalSum(sum);
  }, [wasteRecovered]);

  return (
    <div className="renewable-bar-container">
      <div className="renewable-bar-header">
        Waste Recovered
      </div>
      <div className="renewable-bar-labels">
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{totalSum / 5}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 2}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 3}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 4}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{totalSum}</span>
      </div>
      <div className="renewable-bar-dotted-line"></div>

      <div className="renewable-bar">
        {recoverySeries.map((recoveryType, index) => {
          const value = aggregatedData[recoveryType] || 0;
          const widthPercentage = totalSum > 0 ? (value / totalSum) * 100 : 0;
          const barColor = colors[index % colors.length]; // Use color based on index

          return (
            <div
              className="renewable-bar-section"
              key={index}
              title={`${recoveryType}: ${value.toFixed(2)} mT`}
              style={{ width: `${widthPercentage}%`, backgroundColor: barColor, display: 'inline-block', fontSize: "12px", color: "white", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {value}
            </div>
          );
        })}
      </div>
      <div className="renewable-legends" style={{ display: "flex", gap: '20px', width: "100%", marginTop: "5%" }}>
        {recoverySeries.map((recoveryType, index) => {
          const barColor = colors[index % colors.length]; // Use color based on index
          const value = aggregatedData[recoveryType] || 0;

          return (
            <div className="renewable-legend" key={index} style={{ display: "flex", width: "33%" }}>
              <div
                className="renewable-legend-color"
                style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: "50%", backgroundColor: barColor, marginRight: '10px' }}
              />
              <div style={{ fontSize: "12px" }}>{recoveryType} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WasteRecoveredSingle;
