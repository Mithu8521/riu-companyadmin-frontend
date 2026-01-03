import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "../Diversity/Toggle.css";

const MeasureWellBeingWorker = ({ wellBeingWorker }) => {
  // Data for Permanent Employees
  const [isPermanent, setIsPermanent] = useState(true);
  const [chartData, setChartData] = useState({
    series: [],
    categories: []
  });

  useEffect(() => {
    let totalMales = Array(5).fill(0);
    let totalFemales = Array(5).fill(0);

    wellBeingWorker.forEach(item => {
      const answers = item.answer || [[], [], [], []];
      const selectedMaleData = isPermanent ? answers[0] : answers[2];
      const selectedFemaleData = isPermanent ? answers[1] : answers[3];

      if (selectedMaleData.length === 5) {
        selectedMaleData.forEach((value, index) => {
          totalMales[index] += value === 'NA' ? 0 : parseInt(value, 10) || 0;
        });
      }

      if (selectedFemaleData.length === 5) {
        selectedFemaleData.forEach((value, index) => {
          totalFemales[index] += value === 'NA' ? 0 : parseInt(value, 10) || 0;
        });
      }
    });

    setChartData({
      series: [
        { name: 'Male', data: totalMales, color: "#11546f" },
        { name: 'Female', data: totalFemales, color: "#6fa8dc" },
      ],
      categories: ["Health", "Accidental", "Maternity", "Paternity", "Day Care Facilities"]
    });
  }, [wellBeingWorker, isPermanent]);

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      stacked: false,
    },
    stroke: {
      colors: ["transparent"],
      width: 10
    },
    colors: ['#11546f', '#6fa8dc'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',

        // endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,  // Enable data labels
      formatter: function (val) {  // Format the value to display whole numbers
        return Math.round(val);  // Round to the nearest whole number
      },
      style: {
        fontSize: '12px',
        colors: ['#fff'],  // Set text color to white
      },
      offsetY: -6,
      offsetX: 3,  // Adjust the position of the labels
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: ['#333'],
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#333'],
          fontSize: '12px',
        },
      },
    },
    legend: {
      show: false, // Hide default legend as we are creating a custom one
    },
    grid: {
      borderColor: '#E0E0E0',
    },
    fill: {
      opacity: 1,
    },
  };

  // const options = {
  //   chart: {
  //     height: 350,
  //     type: "bar",
  //     stacked: false, // Set to false for non-stacked bars
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false, // Set to vertical bar chart
  //       columnWidth: "60px", // Adjust bar width for some gap
  //     // Add rounded corners
  //       borderRadiusApplication: 'end', // Rounded corners at the top of the bars
  //       barHeight: '65%', // Further adjust for spacing and shape
  //     },
  //   },
  //   stroke: {
  //     width: [0, 0, 0, 3, 3],
  //     // width:10,
  //     curve: "smooth",
  //   },
  //   fill: {
  //     opacity: [1, 1, 1, 0.25, 0.25],
  //     colors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
  //   },
  //   legend: {
  //     show: false,
  //     enabled: false,
  //     position: "top",
  //     markers: {
  //       fillColors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
  //     },
  //   },
  //   xaxis: {
  // categories: [
  //   "Location 1",
  //   "Location 2",
  //   "Location 3",
  //   "Location 4",
  //   "Location 5",
  // ],
  //   },
  //   yaxis: {
  //     title: {
  //       text: "Total Employees",
  //     },
  //   },
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //   },
  // };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "20%", display: "flex", justifyContent: "space-between", width: "100%" }}>
        <h2 style={{ fontSize: "1em" }}>
          Measures of well-being for Employees
        </h2>

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span className="toggle-arrow">{isPermanent ? "→" : "←"}</span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>

      </div>
      <div style={{ height: "70%" }}>
        <Chart options={chartOptions} series={chartData.series} type="bar" height={"100%"} />

      </div>
      <div style={{ height: "10%", display: "flex", justifyContent: "center" }}>
        {chartData.series.map((s, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", margin: "0 10px" }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: s.color,
                display: "inline-block",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            ></span>
            <span style={{ fontSize: "12px", color: "#333" }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>


    </div>
  );
};

export default MeasureWellBeingWorker;
