import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { Form } from "react-bootstrap";
import { useState } from "react";

const colorPalette = [
  "#FF7F50",
  "#8A2BE2",
  "#ABC4B2",
  "#587B87",
  "#9CDFE3",
  "#FF8C33",
  "#C6CB8D",
  "#858862",
  "#FF3333",
  "#3377FF",
  "#FF7F50",
  "#FFD700",
  "#8A2BE2",
  "#D2691E",
  "#00FA9A",
];

const TotalWasteGeneratedByLoc = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
}) => {
  const [locations, setLocations] = useState([""]);
  const [quarters, setQuarters] = useState([""]);
  const [view, setView] = useState("time");
  const [selection, setSelection] = useState("Q1");
  const [colors, setColors] = useState([]);
  const [companyFramework, setCompanyFramework] = useState([]);
  const [data, setData] = useState({
    time: {
      "Location 1": {
        groundWater: [2000, 1800, 1600, 1400],
        normalWater: [1500, 1300, 1200, 1000],
        hardWater: [500, 600, 700, 800],
      },
      "Location 2": {
        groundWater: [1900, 1700, 1500, 1300],
        normalWater: [1600, 1400, 1200, 1100],
        hardWater: [600, 700, 800, 900],
      },
      "Location 3": {
        groundWater: [1800, 1600, 1400, 1200],
        normalWater: [1700, 1500, 1300, 1100],
        hardWater: [700, 800, 900, 1000],
      },
      "Location 4": {
        groundWater: [1700, 1500, 1300, 1100],
        normalWater: [1800, 1600, 1400, 1200],
        hardWater: [800, 900, 1000, 1100],
      },
      "Location 5": {
        groundWater: [1600, 1400, 1200, 1000],
        normalWater: [1900, 1700, 1500, 1300],
        hardWater: [900, 1000, 1100, 1200],
      },
    },
    location: {
      Q1: {
        groundWater: [2000, 1500, 1000, 1200, 1300],
        normalWater: [1500, 1200, 1100, 1000, 1400],
        hardWater: [500, 800, 900, 800, 1200],
      },
      Q2: {
        groundWater: [1800, 1600, 1100, 1200, 1300],
        normalWater: [1600, 1300, 1200, 1100, 1400],
        hardWater: [600, 700, 800, 600, 1100],
      },
      Q3: {
        groundWater: [1900, 1700, 1200, 1300, 1400],
        normalWater: [1700, 1400, 1300, 1200, 1500],
        hardWater: [700, 800, 900, 700, 1300],
      },
      Q4: {
        groundWater: [2000, 1800, 1300, 1400, 1500],
        normalWater: [1800, 1500, 1400, 1300, 1600],
        hardWater: [800, 900, 1000, 800, 1400],
      },
    },
    location: {
      "Location 1": {
        groundWater: [2000, 1800, 1600, 1400],
        normalWater: [1500, 1300, 1200, 1000],
        hardWater: [500, 600, 700, 800],
      },
      "Location 2": {
        groundWater: [1900, 1700, 1500, 1300],
        normalWater: [1600, 1400, 1200, 1100],
        hardWater: [600, 700, 800, 900],
      },
      "Location 3": {
        groundWater: [1800, 1600, 1400, 1200],
        normalWater: [1700, 1500, 1300, 1100],
        hardWater: [700, 800, 900, 1000],
      },
      "Location 4": {
        groundWater: [1700, 1500, 1300, 1100],
        normalWater: [1800, 1600, 1400, 1200],
        hardWater: [800, 900, 1000, 1100],
      },
      "Location 5": {
        groundWater: [1600, 1400, 1200, 1000],
        normalWater: [1900, 1700, 1500, 1300],
        hardWater: [900, 1000, 1100, 1200],
      },
    },
  });
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 350,
      type: "area",
      stacked: false,
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    stroke: {
      curve: "smooth",
      width: 2, // Adjust the stroke width for the outline
    },
    xaxis: {
      categories: view === "time" ? quarters : locations,
      type: "category",
      labels: {
        style: {
          fontSize: "8px", // Increase font size if needed
          colors: "#000000", // Set to black or another visible color
        },
        trim: false, // Avoid trimming long labels
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return Math.round(value); // Rounds the value to an integer
        },
        style: {
          fontSize: "8px", // Reduces the font size for the y-axis labels
          colors: "#A9A9A9", // Set the y-axis label text color to grey
        },
      },
    },
    fill: {
      type: "none", // Only show the outline, no fill
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    legend: {
      show: false, // Hides the legend
    },
  });
  const [chartSeries, setChartSeries] = useState([
    {
      name: "Ground Water",
      data:
        view === "time"
          ? data.time[selection]?.groundWater || []
          : data.location[selection]?.groundWater || [],
    },
    {
      name: "Normal Water",
      data:
        view === "time"
          ? data.time[selection]?.normalWater || []
          : data.location[selection]?.normalWater || [],
    },
    {
      name: "Hard Water",
      data:
        view === "time"
          ? data.time[selection]?.hardWater || []
          : data.location[selection]?.hardWater || [],
    },
  ]);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);
    // Reset selection based on the new view
    setSelection(newView === "time" ? quarters[0] : locations[0]);
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

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
  useEffect(() => {
    if (frameworkValue && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  useEffect(() => {
    const dataType =
      view === "time" ? data.time[selection] : data.location[selection];

    const waterTypes = dataType ? Object.keys(dataType) : [];

    const parameters = dataType ? Object.keys(dataType) : [];

    // Map parameters to colors based on their index
    const colors = parameters.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );
    setColors(colors);

    const newChartSeries = waterTypes.map((waterType) => ({
      name: waterType
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      data: dataType?.[waterType] || [],
    }));

    setChartSeries(newChartSeries);
    setChartOptions((prevState) => {
      return {
        ...prevState,
        xaxis: {
          categories: view === "time" ? quarters : locations,
          type: "category",
          labels: {
            style: {
              fontSize: "8px", // Increase font size if needed
              colors: "#000000", // Set to black or another visible color
            },
            trim: false, // Avoid trimming long labels
          },
        },
        colors: colors,
      };
    });
  }, [view, selection, data]);

  useEffect(() => {
    if (companyFramework && companyFramework.length) {
      if (companyFramework.includes(1)) {
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

        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode || location.value] = {
              Plastic: new Array(transformedKeys.length).fill(0),
              "E-waste": new Array(transformedKeys.length).fill(0),
              Biomedical: new Array(transformedKeys.length).fill(0),
              "Construction and demolition": new Array(
                transformedKeys.length
              ).fill(0),
              Battery: new Array(transformedKeys.length).fill(0),
              Radioactive: new Array(transformedKeys.length).fill(0),
              "Other hazardous wastes": new Array(transformedKeys.length).fill(
                0
              ),
              "Other non-hazardous wastes": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });

        locationOption.forEach((location) => {
          transformedKeys.forEach((time) => {
            summary.location[time] = {
              Plastic: new Array(locationOption.length).fill(0),
              "E-waste": new Array(locationOption.length).fill(0),
              Biomedical: new Array(locationOption.length).fill(0),
              "Construction and demolition": new Array(
                locationOption.length
              ).fill(0),
              Battery: new Array(locationOption.length).fill(0),
              Radioactive: new Array(locationOption.length).fill(0),
              "Other hazardous wastes": new Array(locationOption.length).fill(
                0
              ),
              "Other non-hazardous wastes": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });

        const answer =
          graphData &&
          graphData.length &&
          graphData.filter((item) => item?.questionId === 458);
        if (answer && answer.length) {
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
            let i = 0;
            for (const key in data) {
              for (let k = 0; k < summary.time[location][key].length; k++) {
                let time = timeKey[k];
                const obj = locationOption.find(
                  (item) => item.unitCode || item.value === location
                );
                const lowerCaseKey = time;
                const formDate = timePeriods[lowerCaseKey];
                const filterData = answer.find(
                  (item) =>
                    item.formDate === formDate &&
                    item.sourceId === Number(obj.id)
                );
                summary.time[location][key][k] = filterData.answer[0][i] || 0;
              }
              i++;
            }
          }
          for (const time in summary.location) {
            const data = summary.location[time];
            let i = 0;
            for (const key in data) {
              for (let k = 0; k < summary.location[time][key].length; k++) {
                let location = locationKey[k];
                const obj = locationOption.find(
                  (item) => item.unitCode || item.value === location
                );
                const lowerCaseKey = time;
                const formDate = timePeriods[lowerCaseKey];
                const filterData = answer.find(
                  (item) =>
                    item.formDate === formDate && item.sourceId === obj.id
                );
                summary.location[time][key][k] = filterData.answer[0][i] || 0;
              }
              i++;
            }
          }
        }
        setData({
          time: summary.time,
          location: summary.location,
        });
      }
    } else {
      if (companyFramework && companyFramework.length) {
        if (companyFramework.includes(1)) {
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

          transformedKeys.forEach((quarter) => {
            locationOption.forEach((location) => {
              summary.time[location?.unitCode || location.value] = {
                "Surface water": new Array(transformedKeys.length).fill(0),
                Groundwater: new Array(transformedKeys.length).fill(0),
                "Third-party water": new Array(transformedKeys.length).fill(0),
                "Municipal water": new Array(transformedKeys.length).fill(0),
                "Seawater / desalinated water": new Array(
                  transformedKeys.length
                ).fill(0),
              };
            });
          });

          locationOption.forEach((location) => {
            transformedKeys.forEach((time) => {
              summary.location[time] = {
                "Surface water": new Array(locationOption.length).fill(0),
                Groundwater: new Array(locationOption.length).fill(0),
                "Third-party water": new Array(locationOption.length).fill(0),
                "Municipal water": new Array(locationOption.length).fill(0),
                "Seawater / desalinated water": new Array(
                  locationOption.length
                ).fill(0),
              };
            });
          });

          const answer =
            graphData &&
            graphData.length &&
            graphData.filter((item) => item?.questionId === 301);
          if (answer && answer.length) {
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
              let i = 0;
              for (const key in data) {
                for (let k = 0; k < summary.time[location][key].length; k++) {
                  let time = timeKey[k];
                  const obj = locationOption.find(
                    (item) => item.unitCode || item.value === location
                  );
                  const lowerCaseKey = time;
                  const formDate = timePeriods[lowerCaseKey];
                  const filterData = answer.find(
                    (item) =>
                      item.formDate === formDate &&
                      item.sourceId === Number(obj.id)
                  );
                  summary.time[location][key][k] = filterData.answer[i][0] || 0;
                }
                i++;
              }
            }
            for (const time in summary.location) {
              const data = summary.location[time];
              let i = 0;
              for (const key in data) {
                for (let k = 0; k < summary.location[time][key].length; k++) {
                  let location = locationKey[k];
                  const obj = locationOption.find(
                    (item) => item.unitCode || item.value === location
                  );
                  const lowerCaseKey = time;
                  const formDate = timePeriods[lowerCaseKey];
                  const filterData = answer.find(
                    (item) =>
                      item.formDate === formDate && item.sourceId === obj.id
                  );
                  summary.location[time][key][k] = filterData.answer[i][0] || 0;
                }
                i++;
              }
            }
          }
          setData({
            time: summary.time,
            location: summary.location,
          });
        }
      } else {
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
              "Total Groundwater consumption* ( in KL)": new Array(locationOption.length).fill(
                0
              ),
              "Total Tanker Water Consumption* (in KL)": new Array(locationOption.length).fill(
                0
              ),
            };
          });
        });

        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode] = {
              "Total Groundwater consumption* ( in KL)": new Array(transformedKeys.length).fill(
                0
              ),
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
          (item) => item?.questionId === 391 || item?.questionId === 469
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
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.time[location][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }

        for (const time in summary.location) {
          const data = summary.location[time];
          for (const key in data) {
            for (let k = 0; k < summary.location[time][key].length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = convertedData.find(
                (item) =>
                  item.title === key &&
                  item.formDate === formDate &&
                  item.sourceId === obj.id
              );
              summary.location[time][key][k] =
                Number(filterData?.answer?.readingValue) || 0;
            }
          }
        }

        setData({
          time: summary.time,
          location: summary.location,
        });
      }
    }
  }, [locationOption, timePeriods, graphData, companyFramework]);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div className="header" style={{ height: "10%" }}>
        <div className="title">Total Waste Generated By Type</div>
      </div>
      <div
        className="chart-container"
        style={{ marginTop: "-2%", height: "90%" }}
      >
        {location === 1 && (
          <Chart options={options} series={series} type="bar" height={"100%"} />
        )}
        {location >= 1 && (
          <div style={{ height: "100%" }}>
            {(locations && locations?.length > 1) ? <div
              className="radio-group horizontal"
              style={{
                display: "flex",
                height: "5%",
                flexDirection: "row",
                marginTop: "1%",
                marginLeft: "2%",
              }}
            >
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
            </div> : <></>}
            {(locations && locations?.length > 1) ? <div
              className="radio-group horizontal"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "5%",
                overflow: "auto",
                marginLeft: "2%",
                marginTop: "1%",
              }}
            >
              {view === "time"
                ? locations.map((q) => (
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
                : quarters.map((loc) => (
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
            </div> : <></>}
            <div
              className="chart-container"
              style={{ height: (locations && locations?.length > 1) ? "70%" : "80%", width: "100%" }}
            >
             { chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 &&  <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={"100%"}
                width={"100%"}
              />}
            </div>
            <div className="legend-container" style={{ height: "10%" }}>
              {chartOptions.colors &&
                chartOptions.colors.length > 0 &&
                chartOptions.colors.map((color, index) => (
                  <div className="legend-item" key={index}>
                    <div
                      className="legend-color-box"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="legend-text">{chartSeries[index]?.name}</span>
                  </div>
                ))}
              <div style={{ fontSize: "16px" }}>{"("}in Tons{")"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalWasteGeneratedByLoc;
