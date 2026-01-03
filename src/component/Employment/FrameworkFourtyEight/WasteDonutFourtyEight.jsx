

import React from 'react';
import Chart from 'react-apexcharts';
import img from "../../../img/no.png"

const WasteDonutFourtyEight = ({ brief }) => {
  // Function to extract and sum category values from the brief for the two categories
  const getCategorySums = (categoryKey) => {
    let totalForCategory = 0;
    Object.keys(brief?.time || {}).forEach((loc) => {
      const categoryValues = brief.time[loc][categoryKey];
      if (categoryValues) {
        totalForCategory += categoryValues.reduce((acc, value) => acc + value, 0);
      }
    });
    return totalForCategory;
  };

  // The two specific categories
  const categories = [
    'Total e-waste disposed',
    'Total metal scraps disposed',
  ];

  const categoryValues = categories.map((category) => getCategorySums(category));

  const options = {
    labels: categories,
    colors: ['#FF7F50', '#87CEEB'],
    legend: {
      position: 'bottom',
    },
  };

  const series = categoryValues;

  // Check if all series values are zero
  const allValuesZero = series.every(value => value === 0);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ height: "10%", fontSize: "20px", fontWeight: 600, color: "#011627" }}>
        Waste Disposed
      </div>
      <div style={{ height: "90%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {allValuesZero ? (
          <div style={{ height: "100%", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center' }}>

            <img src={img} style={{ height: "170px", width: "170px" }} />



          </div>
        ) : (
          <div style={{ width: "70%", height: "100%" }}>
            {<Chart options={options} series={series} type="donut" width="380" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteDonutFourtyEight;
