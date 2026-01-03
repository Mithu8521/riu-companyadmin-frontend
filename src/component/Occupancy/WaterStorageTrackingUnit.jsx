import React, { useState, useEffect } from 'react';
// import './TotalWaterWithdraw.css'; // Import your CSS file here
import { Tooltip, OverlayTrigger } from 'react-bootstrap';  // Import Tooltip and OverlayTrigger
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap CSS is imported

const WasteGeneratedSingle = ({ matchedDataWaste }) => {
  const wasteSeries = [
    "Plastic",
    "E-Waste",
    "Biomedical",
    "Construction and demolition",
    "Battery",
    "Radioactive",
    "Other hazardous wastes",
    "Other non-hazardous wastes"
  ];

  const colors = [
    "#C6CB8D", // Color for Plastic
    "#6D8B96", // Color for E-Waste
    "#3abec7", // Color for Biomedical
    "#587b87", // Color for Construction and demolition
    "#deeff8", // Color for Battery
    "#F0FF33", // Color for Radioactive
    "#949776", // Color for Other hazardous wastes
    "#ABC4B2"  // Color for Other non-hazardous wastes
  ];

  const [aggregatedWasteData, setAggregatedWasteData] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    // Initialize an object to store the aggregated values
    const aggregated = wasteSeries.reduce((acc, wasteType) => {
      acc[wasteType] = 0; // Initialize each waste type with 0
      return acc;
    }, {});

    // Aggregate values from matchedDataWaste
    let sum = 0;
    matchedDataWaste.forEach(item => {
      const answers = item.answer && Array.isArray(item.answer) && Array.isArray(item.answer[0]) ? item.answer[0] : [];
      answers.forEach((value, index) => {
        if (wasteSeries[index]) {
          const numericValue = value === "NA" || !value ? 0 : parseFloat(value);
          aggregated[wasteSeries[index]] += numericValue;
          sum += numericValue; // Add to total sum
        }
      });
    });

    setAggregatedWasteData(aggregated);
    setTotalSum(sum);
  }, [matchedDataWaste]);

  return (
    <div className="water-withdrawn-container">
      <div className="water-withdrawn-header">
        Waste Generated
      </div>
      <div className="water-withdrawn-bar-labels">
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>0</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{totalSum / 5}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 2}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 3}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{(totalSum / 5) * 4}</span>
        <span style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}>{totalSum}</span>
      </div>
      <div className="water-withdrawn-bar-dotted-line"></div>

      <div className="water-withdrawn-bars">
        {wasteSeries.map((wasteType, index) => {
          const value = aggregatedWasteData[wasteType] || 0;
          const widthPercentage = totalSum > 0 ? (value / totalSum) * 100 : 0;
          const barColor = colors[index % colors.length]; // Use color from colors array

          const renderTooltip = (props) => (
            <Tooltip id={`tooltip-${index}`} {...props}>
              {`${wasteType}: ${value} mT`}
            </Tooltip>
          );

          return (
            <div className="water-withdrawn-bar-container" key={index}>
              <OverlayTrigger
                placement="top"
                overlay={renderTooltip}
              >
                <div className="water-withdrawn-bar" style={{ marginBottom: "2%", backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none" }}>
                  <div
                    className="water-withdrawn-bar-filled"
                    style={{ width: `${widthPercentage}%`, backgroundColor: barColor, display: "flex", alignItems: "center", justifyContent: 'center', fontSize: "10px" }}
                  >
                    {value}
                  </div>
                </div>
              </OverlayTrigger>
            </div>
          );
        })}
      </div>
      <div className="water-withdrawn-legends" style={{ display: "flex", gap: "20px" }} >
        {wasteSeries.map((wasteType, index) => {
          const barColor = colors[index % colors.length]; // Use color from colors array
          return (
            <div className="water-withdrawn-legend" style={{ display: "flex" }} key={index}>
              <div
                className="water-withdrawn-legend-color"
                style={{ display: 'inline-block', width: '20px', borderRadius: "50%", height: '20px', backgroundColor: barColor, marginRight: '10px' }}
              />
              <div style={{ fontSize: "13px" }}>{wasteType}: {aggregatedWasteData[wasteType] || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WasteGeneratedSingle;
