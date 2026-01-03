import React, { useEffect, useState } from 'react';
// import '../Environment/TotalWaterWithdraw.css';

const CompareWaterConsumption = ({ matchedWaterDis }) => {
  const [aggregatedValues, setAggregatedValues] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);

  const waterSeries = [
    "To Surface Water",
    "To Ground Water",
    "To Sea Water",
    "Sent to other parties",
    "Others",
  ];

  // Define an array of colors for the bars
  const colors = [
    '#11546f', // Green
    '#3f88a5', // Orange
    '#79acc0', // Blue
    '#3abec7', // Red
    '#88d29e', // Purple
  ];

  useEffect(() => {
    // Aggregate the values with necessary checks
    const aggregated = waterSeries.map((_, index) =>
      matchedWaterDis.reduce((acc, obj) => {
        const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index] ?
          obj.answer[index].slice(0, 2).reduce((sum, val) => sum + (val === "NA" || !val ? 0 : parseFloat(val)), 0) : 0;
        return acc + value;
      }, 0)
    );

    // Calculate total consumption
    const total = aggregated.reduce((sum, value) => sum + value, 0);
    setTotalConsumption(total);

    // Set the aggregated values to state
    setAggregatedValues(aggregated);
  }, [matchedWaterDis]);

  return (
    <div className="water-withdrawn-container" style={{ height: "100%" }}>
      <div className="water-withdrawn-header" style={{ height: "10%" }}>
        Compare Water Disposed
      </div>
      <div className="emission-bar-labels" style={{ height: "5%" }}>
        <span>{0}</span>
        <span>{((1 / 5) * totalConsumption).toFixed(2)}</span>
        <span>{((2 / 5) * totalConsumption).toFixed(2)}</span>
        <span>{((3 / 5) * totalConsumption).toFixed(2)}</span>
        <span>{((4 / 5) * totalConsumption).toFixed(2)}</span>
        <span>{((5 / 5) * totalConsumption).toFixed(2)}</span>
      </div>
      <div className="emission-bar-dotted-line"></div>
      <div className="water-withdrawn-bars" style={{ height: "70%" }}>
        {aggregatedValues.map((value, index) => {
          const widthPercentage = totalConsumption > 0 ? (value / totalConsumption) * 100 : 0;
          const barColor = colors[index % colors.length]; // Use color based on index
          return (
            <div className="water-withdrawn-bar" style={{ height: '40px', backgroundColor: "rgba(28, 28, 28, 0.05)", border: "none", borderRadius: '4px', marginBottom: '15px', width: '100%' }} key={index}>
              <div
                className="water-withdrawn-bar-filled"
                style={{ width: `${widthPercentage}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }}
              />
            </div>
          );
        })}
      </div>
      <div className="water-withdrawn-legends" style={{ height: "15%", display: "flex", gap: "10px" }}>
        {aggregatedValues.map((_, index) => {
          const barColor = colors[index % colors.length]; // Use color based on index
          return (
            <div className="water-withdrawn-legend" style={{ display: "flex" }} key={index}>
              <div
                className="water-withdrawn-legend-color"
                style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: barColor, marginRight: '10px', borderRadius: "50%" }}
              />
              <div style={{ fontSize: "13px" }}>{waterSeries[index]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompareWaterConsumption;
