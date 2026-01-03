import React from 'react';
import Chart from 'react-apexcharts';
// import ApexCharts from 'apexcharts';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Col, Row, Form } from 'react-bootstrap';

const OnSiteRenew = () => {
  const location = 2

  const [view, setView] = useState('time');
  const [selection, setSelection] = useState('Q1');

  // Sample data
  const locations = ['Location 1', 'Location 2', 'Location 3', 'Location 4', 'Location 5'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const data = {
    time: {
      Q1: [10, 20, 30, 40, 50],
      Q2: [15, 25, 35, 45, 55],
      Q3: [20, 30, 40, 50, 60],
      Q4: [25, 35, 45, 55, 65]
    },
    location: {
      'Location 1': [10, 15, 20, 25],
      'Location 2': [20, 25, 30, 35],
      'Location 3': [30, 35, 40, 45],
      'Location 4': [40, 45, 50, 55],
      'Location 5': [50, 55, 60, 65]
    }
  };

  const handleViewChange = (e) => {
    setView(e.target.value);
    setSelection(view === 'time' ? quarters[0] : locations[0]); // Reset selection based on view
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: view === 'time' ? quarters : locations
      // categories: quarters
    },
    yaxis: {
      title: {
        text: 'Water Withdrawal'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const chartSeries = [
    {
      name: view === 'time' ? 'Quarters' : 'Location',
      data: view === 'location'
        ? data.time[selection]
        : data.location[selection]
    }
  ];

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
          name: {
            fontSize: "22px",
            color: "#000",
            offsetY: -10,
          },
          value: {
            fontSize: "16px",
            color: "#000",
            offsetY: 10,
          },
          total: {
            show: false,
            label: "Total",
            formatter: function (w) {
              return 100;
            },
          },
        },
      },
    },
    series: [70, 20, 10], // Distribution data
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    legend: {
      show: false, // Hides the legend for the inner donut
    }, //
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
          show: false, // Hide data labels for the outer donut
        },
      },
    },
    series: [70, 20, 10], // Dummy series to create the outer donut
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    dataLabels: {
      enabled: false, // Hides the numbers showing on the tracks
    },
    legend: {
      show: true, // Show the legend
      position: "bottom", // Position the legend at the bottom
      horizontalAlign: "center", // Center-align the legend items
      fontSize: "14px", // Set font size for legend text
      markers: {
        width: 10, // Set the width of legend markers
        height: 10, // Set the height of legend markers
      },
      itemMargin: {
        horizontal: 10, // Space between legend items horizontally
        vertical: 5, // Space between legend items vertically
      },
    },
  };


  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Water Withdrawal</div>

      {location === 1 && <div
        className="chart-container"
        style={{ marginTop: "-2%", height: "80%", position: "relative", marginTop: "5%", marginLeft: "15%" }}
      >
        <div id="outer-donut" style={{ position: "absolute", top: 0, left: 0, height: "100%" }}>
          <ReactApexChart
            options={outerOptions}
            series={outerOptions.series}
            type="donut"
            height={"100%"}
            width={"100%"}
          />
        </div>
        <div
          id="inner-donut"
          style={{ position: "absolute", top: 15, left: 37, height: "100%" }}
        >
          <ReactApexChart
            options={innerOptions}
            series={innerOptions.series}
            type="donut"
            height={"75%"}
            width={"75%"}
          />
        </div>
      </div>}
      {
        location >= 1 &&
        <div>
          <div className="radio-group horizontal" style={
            {
              display: "flex", flexDirection: "row"
            }
          }>
            <Form.Check
              style={{ marginRight: "5%" }}
              type="radio"
              label="Time"
              value="time"
              checked={view === 'time'}
              onChange={handleViewChange}
            />
            <Form.Check
              type="radio"
              label="Location"
              value="location"
              checked={view === 'location'}
              onChange={handleViewChange}
            />
          </div>

          <div className="radio-group horizontal" style={
            {
              marginTop: "3%",
              display: "flex", flexDirection: "row",
              width: "100%", overflow: "auto"
            }
          }>
            {view === 'time'
              ? locations.map(q => (
                <Form.Check
                  key={q}
                  style={{ marginRight: "5%" }}
                  type="radio"
                  label={q}
                  value={q}
                  checked={selection === q}
                  onChange={handleSelectionChange}
                />
              ))
              : quarters.map(loc => (
                <Form.Check
                  key={loc}
                  type="radio"
                  label={loc}
                  style={{ marginRight: "5%" }}
                  value={loc}
                  checked={selection === loc}
                  onChange={handleSelectionChange}
                />
              ))}
          </div>

          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
          />
        </div>
      }

    </div>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '15px',
  width: '100%',
  height: '100%',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  height: "5%",
  marginBottom: '20px',
  textAlign: 'left',
};

const chartContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  height: "85%"
};

export default OnSiteRenew;
