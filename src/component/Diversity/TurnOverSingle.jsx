import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import right from "../../img/Vector 1.svg";

const TurnoverRateChart = () => {
  const [selectedCategory, setSelectedCategory] = useState('permanent'); // Default category selection
  const [isPermanent, setIsPermanent] = useState(true)

  const dataOptions = {
    permanent: {
      series: [40, 30, 30], // Example data for Male, Female, Others in permanent category
      labels: ['Male', 'Female', 'Others'],
    },
    nonPermanent: {
      series: [25, 50, 25], // Example data for Male, Female, Others in non-permanent category
      labels: ['Male', 'Female', 'Others'],
    },
  };

  const options = {
    chart: {
      type: 'donut',
    },
    labels: dataOptions[selectedCategory].labels,
    colors: ['#1E90FF', '#FF6347', '#32CD32'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="water-withdrawn-header">
          Turn Over Rate
        </div>

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span
                style={{ fontSize: "30px", marginBottom: "25%" }}
                className="toggle-arrow"
              >
                {
                  <img
                    src={right}
                    style={{
                      transform: isPermanent
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                    }}
                    alt="Arrow"
                  />
                }
              </span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>
      </div>
      <div className="chart-container">
        <Chart options={options} series={dataOptions[selectedCategory].series} type="donut" height="350" />
      </div>
    </div>
  );
};

export default TurnoverRateChart;
