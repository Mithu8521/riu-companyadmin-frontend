import React from "react";
import Chart from "react-apexcharts";
import { Form } from "react-bootstrap";
import { useState } from "react";

const GreenEnergyPurchase = () => {

  const [view, setView] = useState('time');
  const [selection, setSelection] = useState('Q1'); // Initial state set to Q1

  const locations = ['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const data = {
    time: {
      Q1: {
        groundWater: [2000, 1500, 1000, 1200, 1300],
        normalWater: [1500, 1200, 1100, 1000, 1400],
        hardWater: [500, 800, 900, 800, 1200]
      },
      Q2: {
        groundWater: [1800, 1600, 1100, 1200, 1300],
        normalWater: [1600, 1300, 1200, 1100, 1400],
        hardWater: [600, 700, 800, 600, 1100]
      },
      Q3: {
        groundWater: [1900, 1700, 1200, 1300, 1400],
        normalWater: [1700, 1400, 1300, 1200, 1500],
        hardWater: [700, 800, 900, 700, 1300]
      },
      Q4: {
        groundWater: [2000, 1800, 1300, 1400, 1500],
        normalWater: [1800, 1500, 1400, 1300, 1600],
        hardWater: [800, 900, 1000, 800, 1400]
      }
    },
    location: {
      'Location 1': {
        groundWater: [2000, 1800, 1600, 1400],
        normalWater: [1500, 1300, 1200, 1000],
        hardWater: [500, 600, 700, 800]
      },
      'Location 2': {
        groundWater: [1900, 1700, 1500, 1300],
        normalWater: [1600, 1400, 1200, 1100],
        hardWater: [600, 700, 800, 900]
      },
      'Location 3': {
        groundWater: [1800, 1600, 1400, 1200],
        normalWater: [1700, 1500, 1300, 1100],
        hardWater: [700, 800, 900, 1000]
      },
      'Location 4': {
        groundWater: [1700, 1500, 1300, 1100],
        normalWater: [1800, 1600, 1400, 1200],
        hardWater: [800, 900, 1000, 1100]
      },
      'Location 5': {
        groundWater: [1600, 1400, 1200, 1000],
        normalWater: [1900, 1700, 1500, 1300],
        hardWater: [900, 1000, 1100, 1200]
      }
    }
  };



  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);
    // Reset selection based on the new view
    setSelection(newView === 'time' ? quarters[0] : locations[0]);
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const chartOptions = {
    chart: {
      height: 350,
      type: 'area',
      stacked: true
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: view === 'time' ? quarters : locations,
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Water Withdrawal'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    },
    legend: {
      show: false, // Hides the legend
    },
  };

  const chartSeries = [
    {
      name: 'Ground Water',
      data: view === 'time'
        ? data.time[selection]?.groundWater || []
        : data.location[selection]?.groundWater || []
    },
    {
      name: 'Normal Water',
      data: view === 'time'
        ? data.time[selection]?.normalWater || []
        : data.location[selection]?.normalWater || []
    },
    {
      name: 'Hard Water',
      data: view === 'time'
        ? data.time[selection]?.hardWater || []
        : data.location[selection]?.hardWater || []
    }
  ];


  const location = 2;
  const series = [
    {
      name: "Scope 1",
      data: [4000, 3000, 3500, 2500],
    },
    {
      name: "Scope 2",
      data: [3500, 3000, 4000, 3000],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
      },
    },
    xaxis: {
      categories: ["Q4", "Q3", "Q2", "Q1"],
      labels: {
        style: {
          fontSize: "10px",
          fontWeight: "bold",
          colors: "grey",
        },
        offsetY: -130,
        offsetX: -0,
        // Adjusts the offset of the labels
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    colors: ["#3F88A5", "#B0C4DE"],
    legend: {
      show: false, // Hides the legend
    },
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Water Comparison</div>
      </div>
      <div className="chart-container" style={{ marginTop: "-2%" }}>
        {location === 1 && (
          <Chart options={options} series={series} type="bar" height={"100%"} />
        )}
        {location >= 1 && (
          <div>
            {" "}
            <div className="radio-group horizontal" style={
              {
                display: "flex", flexDirection: "row"
              }
            }>
              <Form.Check
                type="radio"
                style={{ marginRight: "5%" }}
                label="Time"
                value="time"
                checked={view === "time"}
                onChange={handleViewChange}
              />
              <Form.Check
                type="radio"
                label="Location"
                value="location"
                checked={view === "location"}
                onChange={handleViewChange}
              />
            </div>{" "}
            <div className="radio-group horizontal" style={
              {
                display: "flex", flexDirection: "row", width: "100%", overflow: "auto"
              }
            }>
              {view === "time"
                ? quarters.map((q) => (
                  <Form.Check
                    key={q}
                    type="radio"
                    style={{ marginRight: "5%" }}
                    label={q}
                    value={q}
                    checked={selection === q}
                    onChange={handleSelectionChange}
                  />
                ))
                : locations.map((loc) => (
                  <Form.Check
                    key={loc}
                    type="radio"
                    label={loc}
                    value={loc}
                    style={{ marginRight: "5%" }}
                    checked={selection === loc}
                    onChange={handleSelectionChange}
                  />
                ))}
            </div>{" "}
            <div className="chart-container">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            </div>{" "}
          </div>
        )}
      </div>
      <div className="legend-container" style={{ marginTop: "-2%" }}>
        {options.colors.map((color, index) => (
          <div className="legend-item" key={index}>
            <div
              className="legend-color-box"
              style={{ backgroundColor: color }}
            ></div>
            <span className="legend-text">{series[index].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GreenEnergyPurchase;
