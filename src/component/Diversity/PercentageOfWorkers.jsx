import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const PercentageOfWorkersReceivingMoreThanMinimumWages = () => {
  // Initial data for the donut chart
  const [data, setData] = useState({
    permanent: [60, 25, 15], // Example data for permanent workers
    nonPermanent: [50, 30, 20], // Example data for non-permanent workers
  });

  const [selectedType, setSelectedType] = useState('permanent'); // Default to permanent

  const handleCheckboxChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Inner donut chart options
  const innerOptions = {
    chart: {
      type: "donut",
      height: 350,
      offsetY: 0,
      offsetX: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%", // Size of the outer donut (controls the width)
        },
      },
      radialBar: {
        hollow: {
          size: "100%", // Size of the hollow area to create a thick donut
        },
        track: {
          background: "#e0e0e0",
          strokeWidth: "20%",
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: data[selectedType], // Use the selected data
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    legend: {
      show: false, // Hides the legend for the inner donut
    },
  };

  // Outer donut chart options
  const outerOptions = {
    chart: {
      type: "donut",
      height: 350,
      offsetY: 0,
      offsetX: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "90%", // Size of the outer donut (controls the width)
        },
      },
      radialBar: {
        hollow: {
          size: "20%", // Size of the hollow area to create a thinner donut
        },
        track: {
          background: "#f0f0f0",
          strokeWidth: "50%",
        },
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: data[selectedType], // Use the selected data
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    legend: {
      show: false, // Hides the legend for the outer donut
    },
  };

  return (
    <div className="container" style={{ position: "relative" }}>
      <div className="header">
        <div className="title">Percentage Of Workers Receiving More Than Minimum Wages</div>
      </div>
      <div className="checkbox-container" style={{ marginTop: "20px" }}>
        <label>
          <input
            type="radio"
            value="permanent"
            checked={selectedType === 'permanent'}
            onChange={handleCheckboxChange}
          />
          Permanent Employees
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            value="nonPermanent"
            checked={selectedType === 'nonPermanent'}
            onChange={handleCheckboxChange}
          />
          Non-Permanent Employees
        </label>
      </div>
      <div className="chart-container" style={{ marginTop: "-2%", height: "80%", position: "relative", marginTop: "5%", marginLeft: "15%" }}>
        <div id="outer-donut" style={{ position: "absolute", top: 0, left: 0, height: "100%" }}>
          <ReactApexChart
            options={outerOptions}
            series={outerOptions.series}
            type="donut"
            height={"100%"}
            width={"100%"}
          />
        </div>
        <div id="inner-donut" style={{ position: "absolute", top: 15, left: 15, height: "100%" }}>
          <ReactApexChart
            options={innerOptions}
            series={innerOptions.series}
            type="donut"
            height={"90%"}
            width={"90%"}
          />
        </div>
      </div>
    </div>
  );
};

export default PercentageOfWorkersReceivingMoreThanMinimumWages;
