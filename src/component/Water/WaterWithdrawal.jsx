import React, { useEffect } from "react";
import Chart from "react-apexcharts";
// import ApexCharts from 'apexcharts';
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Row, Form } from "react-bootstrap";

const WaterWithdrawal = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
}) => {


  const [view, setView] = useState("time");
  const [selection, setSelection] = useState("Q1");
  const [locations, setLocations] = useState([""]);
  const [quarters, setQuarters] = useState([""]);
  const [data, setData] = useState({
    time: {
      Q1: [10, 20, 30, 40, 50],
      Q2: [15, 25, 35, 45, 55],
      Q3: [20, 30, 40, 50, 60],
      Q4: [25, 35, 45, 55, 65],
    },
    location: {
      "Location 1": [10, 15, 20, 25],
      "Location 2": [20, 25, 30, 35],
      "Location 3": [30, 35, 40, 45],
      "Location 4": [40, 45, 50, 55],
      "Location 5": [50, 55, 60, 65],
    },
  });

  const handleViewChange = (e) => {
    setView(e.target.value);
    setSelection(view === "time" ? quarters[0] : locations[0]);
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: view === "time" ? quarters : locations,
      // categories: quarters
    },
    yaxis: {
      title: {
        text: "Water Withdrawal",
      },
    },
    legend: {
      position: "top",
    },
  };

  const chartSeries = [
    {
      name: view === "time" ? "Quarters" : "Location",
      data:
        view === "location" ? data.time[selection] : data.location[selection],
    },
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
          size: "60%",
        },
      },

      radialBar: {
        hollow: {
          size: "100%",
        },
        track: {
          background: "#e0e0e0",
          strokeWidth: "20%",
        },
        dataLabels: {
          enabled: true,
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
          enabled: true,
          show: false, // Hide data labels for the outer donut
        },
      },
    },
    series: [70, 20, 10], // Dummy series to create the outer donut
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    dataLabels: {
      enabled: true, // Hides the numbers showing on the tracks
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
  function convertTo1DArray(timeData) {
    const result = {};
    for (const [month, values] of Object.entries(timeData)) {
      result[month] = values.map((subArray) => {
        return subArray.reduce((sum, value) => sum + value, 0);
      });
    }

    return result;
  }
  useEffect(() => {
    const valuesArray = locationOption
      ? locationOption.map((item) => item.unitCode || item.value)
      : [];

    const transformedKeys = Object.keys(timePeriods).map((key) =>
      key.toUpperCase()
    );

    setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
    setQuarters(transformedKeys);
    setLocations(valuesArray);


    const summary = {
      time: {},
      location: {},
    };

    locationOption.forEach((location) => {
      transformedKeys.forEach((quarter) => {
        summary.location[quarter] = {
          "Total Groundwater consumption* ( in KL)":
            new Array(locationOption.length).fill(0),
          "Total Tanker Water Consumption* (in KL)": new Array(
            locationOption.length
          ).fill(0),

        };
      });
    });

    transformedKeys.forEach((quarter) => {
      locationOption.forEach((location) => {
        summary.time[location?.unitCode] = {
          "Total Groundwater consumption* ( in KL)":
            new Array(transformedKeys.length).fill(0),
          "Total Tanker Water Consumption* (in KL)": new Array(
            transformedKeys.length
          ).fill(0),

        };
      });
    });
    function convertMixedData(mixedArray) {
      return mixedArray.map((data) => {
        if (Array.isArray(data.answer) && Array.isArray(data.answer[0])) {
          const flattenedAnswer = data.answer.flat();
          const summedValue = flattenedAnswer.reduce(
            (sum, value) => sum + (parseFloat(value) || 0),
            0
          );

          return {
            questionId: data.questionId,
            sourceId: data.sourceId,
            answer: {
              process: 1,
              readingValue: summedValue.toString(),
              unit: "KG",
            },
            title: data.title,
            question_details: data.question_details,
            formDate: data.formDate,
            toDate: data.toDate,
          };
        } else {
          return {
            ...data,
            answer: {
              ...data.answer,
              readingValue: data?.answer?.readingValue || "0",
            },
          };
        }
      });
    }
    const filteredData = graphData.filter(
      (item) =>
        item?.questionId === 391 ||
        item?.questionId === 469
    );
    const convertedData = convertMixedData(filteredData);
    const timeKey = [];
    const locationKey = [];

    for (const period in summary.location) {
      timeKey.push(period);
    }

    for (const period in summary.time) {
      locationKey.push(period);
    }

    for (const location in summary.time) {
      const data = summary.time[location];
      for (const key in data) {

        for (let k = 0; k < summary.time[location][key].length; k++) {
          let time = timeKey[k];
          const obj = locationOption.find((item) => item.unitCode === location);
          const lowerCaseKey = time;
          const formDate = timePeriods[lowerCaseKey];
          const filterData = convertedData.find(
            (item) =>
              item.title === key &&
              item.formDate === formDate &&
              item.sourceId === obj.id
          );
          summary.time[location][key][k] = Number(filterData?.answer?.readingValue) || 0;
        }
      }
    }
    for (const time in summary.location) {
      const data = summary.location[time];
      for (const key in data) {
        for (let k = 0; k < summary.location[time][key].length; k++) {
          let location = locationKey[k];
          const obj = locationOption.find((item) => item.unitCode === location);
          const lowerCaseKey = time;
          const formDate = timePeriods[lowerCaseKey];
          const filterData = convertedData.find(
            (item) =>
              item.title === key &&
              item.formDate === formDate &&
              item.sourceId === obj.id
          );
          summary.location[time][key][k] = Number(filterData?.answer?.readingValue) || 0;
        }
      }
    }

    setData({
      time: summary.time,
      location: summary.location,
    });
  }, [locationOption, timePeriods, graphData]);
  // useEffect(() => {
  //   const valuesArray = locationOption
  //     ? locationOption.map((item) => item.unitCode || item.value)
  //     : [];
  //   const transformedKeys = Object.keys(timePeriods).map((key) =>
  //     key.toUpperCase()
  //   );
  //   setQuarters(transformedKeys);
  //   setLocations(valuesArray);
  //   const timeKeys = Object.values(timePeriods); 

  //   const timeStructure = timeKeys.reduce((acc, date) => {
  //     acc[date] = locationOption.map(() => []); 
  //     return acc;
  //   }, {});

  //   const locationStructure = locationOption.reduce((acc, loc) => {
  //     acc[loc.unitCode] = timeKeys.map(() => []); 
  //     return acc;
  //   }, {});

  //   const summary = {
  //     time: timeStructure,
  //     location: locationStructure,
  //   };

  //   const filteredData = graphData.filter(
  //     (item) => item?.questionId === 391 || item?.questionId === 469
  //   );

  //   filteredData.forEach((item) => {
  //     const { formDate, sourceId } = item;
  //     let readingValue = parseFloat(item.answer.readingValue);

  //     if (isNaN(readingValue)) {
  //       readingValue = 0;
  //     }

  //     const timeIndex = timeKeys.findIndex((date) => formDate.includes(date));

  //     const locationIndex = locationOption.findIndex(
  //       (loc) => loc.id === sourceId
  //     );

  //     const location = locationOption.find((loc) => loc.id === sourceId);

  //     if (location && timeIndex !== -1 && locationIndex !== -1) {
  //       summary.time[timeKeys[timeIndex]][locationIndex].push(readingValue);
  //       summary.location[location?.unitCode][timeIndex].push(readingValue);
  //     }
  //   });

  //   const oneDArrayDataTime = convertTo1DArray(summary.time);
  //   const locationData = convertTo1DArray(summary.location);

  //   const transformedData = Object.fromEntries(
  //     Object.entries(oneDArrayDataTime).map(([date, values]) => {
  //       const newKey = Object.keys(timePeriods)
  //         .find((key) => timePeriods[key] === date)
  //         .toUpperCase();
  //       return [newKey, values];
  //     })
  //   );
  //   setData({
  //     time: transformedData,
  //     location: locationData,
  //   });
  // }, [locationOption, timePeriods, graphData]);

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Water Withdrawal</div>

      {locationOption && locationOption.length === 1 && (
        <div
          className="chart-container"
          style={{
            marginTop: "-2%",
            height: "80%",
            position: "relative",
            marginTop: "5%",
            marginLeft: "15%",
          }}
        >
          <div
            id="outer-donut"
            style={{ position: "absolute", top: 0, left: 0, height: "100%" }}
          >
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
        </div>
      )}
      {locationOption && locationOption.length >= 1 && (
        <div>
          <div
            className="radio-group horizontal"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Form.Check
              style={{ marginRight: "5%" }}
              type="radio"
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
          </div>

          <div
            className="radio-group horizontal"
            style={{
              marginTop: "3%",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              overflow: "auto",
            }}
          >
            {view === "time"
              ? locations.map((q) => (
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
              : quarters.map((loc) => (
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
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: "white",
  borderRadius: "15px",
  width: "100%",
  height: "100%",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  height: "5%",
  marginBottom: "20px",
  textAlign: "left",
};

const chartContainerStyle = {
  display: "flex",
  justifyContent: "center",
  height: "85%",
};

export default WaterWithdrawal;
