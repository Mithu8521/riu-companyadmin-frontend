import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const LeadershipRolesChart = (locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  type) => {
  const [selectedCriteria, setSelectedCriteria] = useState("time");
  const [companyFramework, setCompanyFramework] = useState([]);
  const [locations, setLocations] = useState([""]);
  const [periodSelection, setPeriodSelection] = useState([""]);
  const [selectedOption, setSelectedOption] = useState('Location1');
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { type: "bar", stacked: false },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      stroke: { width: [0, 0, 3, 2] }, // Set stroke for line and area charts
      xaxis: {
        categories: ["Q1", "Q2", "Q3", "Q4"],
      },
      colors: ["#E91E63", "#00ACC1", "#8BC34A", "#FF9800"],
    },
  });

  const [dataSets, setDataSets] = useState({
    time: {
      Location1: [
        { name: "Female", type: "bar", data: [150, 200, 250, 300] },
        { name: "Minorities", type: "bar", data: [80, 120, 180, 220] },
        { name: "Board Of Directors", type: "area", data: [50, 60, 70, 90] }, // Area chart
        { name: "Other Roles", type: "line", data: [30, 50, 70, 80] }, // Line chart
      ],

    },
    location: {
      H1: [
        { name: "Female", type: "bar", data: [200, 220, 240, 260] },
        { name: "Minorities", type: "bar", data: [100, 130, 160, 190] },
        { name: "Board Of Directors", type: "area", data: [70, 80, 90, 110] },
        { name: "Other Roles", type: "line", data: [50, 70, 90, 110] },
      ],
    },
  });

  const handleCriteriaChange = (e) => {
    setSelectedCriteria(e.target.value);
    setSelectedOption(null);
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);
    setChartData({
      ...chartData,
      series: dataSets[selectedCriteria][option],
    });
  };


  useEffect(() => {
    if (frameworkValue && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  useEffect(() => {
    if (companyFramework && companyFramework.length) {
      if (companyFramework.includes(1)) {
        const valuesArray = locationOption
          ? locationOption.map((item) => item.unitCode || item.value)
          : [];

        const transformedKeys = Object.keys(timePeriods).map((key) =>
          key.toUpperCase()
        );

        setSelectedOption(
          selectedCriteria === "time" ? valuesArray[0] : transformedKeys[0]
        );
        setPeriodSelection(transformedKeys);
        setLocations(valuesArray);
        const summary = {
          time: {},
          location: {},
        };

        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode || location.value] = [
              { name: "Male", data: new Array(transformedKeys.length).fill(0) },
              {
                name: "Female",
                data: new Array(transformedKeys.length).fill(0),
              },
              {
                name: "Others",
                data: new Array(transformedKeys.length).fill(0),
              },
            ];
          });
        });

        locationOption.forEach((location) => {
          transformedKeys.forEach((time) => {
            summary.location[time] = [
              { name: "Male", data: new Array(locationOption.length).fill(0) },
              {
                name: "Female",
                data: new Array(locationOption.length).fill(0),
              },
              {
                name: "Others",
                data: new Array(locationOption.length).fill(0),
              },
            ];
          });
        });

        const answer =
          graphData &&
          graphData.length &&
          graphData.filter((item) => item?.questionId === 42);
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
            for (let k = 0; k < data[0].data.length; k++) {
              let time = timeKey[k];
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const obj = locationOption.find((item) => item.unitCode || item.value === location);
              const filterData = answer.find(
                (item) =>
                  item.formDate === formDate &&
                  item.sourceId === Number(obj.id)
              );

              summary.time[location][0]["data"][k] = filterData.answer[0][0] || 0;
              summary.time[location][1]["data"][k] = filterData.answer[0][1] || 0;
              summary.time[location][2]["data"][k] = filterData.answer[0][2] || 0;
            }
          }

          for (const time in summary.location) {
            const data = summary.location[time];
            for (let k = 0; k < data[0].data.length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find((item) => item.unitCode || item.value === location);
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = answer.find(
                (item) =>
                  item.formDate === formDate &&
                  item.sourceId === Number(obj.id)
              );
              summary.location[time][0]["data"][k] = filterData.answer[0][0] || 0;
              summary.location[time][1]["data"][k] = filterData.answer[0][1] || 0;
              summary.location[time][2]["data"][k] = filterData.answer[0][2] || 0;
            }
          }
        }
        setDataSets(summary);
      }
    }
  }, [locationOption, timePeriods, graphData, companyFramework]);

  return (
    <div className="container">
      <h2 style={{ fontSize: "1em" }}>
        Diversity in Leadership
      </h2>

      <div className="radio-buttons">
        <label>
          <input
            type="radio"
            value="time"
            checked={selectedCriteria === "time"}
            onChange={handleCriteriaChange}
          />{" "}
          Time
        </label>
        <label>
          <input
            type="radio"
            value="location"
            checked={selectedCriteria === "location"}
            onChange={handleCriteriaChange}
          />{" "}
          Location
        </label>
      </div>






      <div className="radio-buttons" style={{ marginTop: "-30px" }}>
        {selectedCriteria === "time"
          ? locations.map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedOption === quarter}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              {quarter}
            </label>
          ))
          : periodSelection.map((location) => (
            <label key={location}>
              <input
                type="radio"
                value={location}
                checked={selectedOption === location}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              {location}
            </label>
          ))}
      </div>
      {selectedOption && (
        <div>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={300}
          />
        </div>
      )}
    </div>
  );
};

export default LeadershipRolesChart;
