import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./Toggle.css";

const TotalDifWorkIncAb = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
}) => {
  const [companyFramework, setCompanyFramework] = useState([]);
  const [locations, setLocations] = useState([""]);
  const [periodSelection, setPeriodSelection] = useState([""]);
  const [isPermanent, setIsPermanent] = useState(true);
  const [timeLocation, setTimeLocation] = useState("time");
  const [selectedSubOption, setSelectedSubOption] = useState("Location1");

  const [permanentData, setPermanentData] = useState({
    time: {
      Location1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
    },
    location: {
      H1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
    },
  });

  const [nonPermanentData, setNonPermanentData] = useState({
    time: {
      Location1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
    },
    location: {
      H1: [
        { name: "Male", data: [18, 15, 12, 18, 18] },
        { name: "Female", data: [10, 8, 15, 12, 10] },
        { name: "Others", data: [5, 3, 8, 5, 6] },
      ],
    },
  });



  const options = {
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
      },
    },
    stroke: {
      width: [0, 0, 0, 3, 3],
      curve: "smooth",
    },
    fill: {
      opacity: [1, 1, 1, 0.25, 0.25],
      colors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
    },
    legend: {
      show: false,
      enabled: false,
      position: "top",
      markers: {
        fillColors: ["#3A60E6", "#E95757", "#7CC3C3", "#B0B0B0", "#B2D47E"],
      },
    },
    xaxis: {
      categories: timeLocation === "time" ? periodSelection : locations,
    },
    yaxis: {
      title: {
        text: "Total Employees",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  const handleTimeLocationChange = (event) => {
    setTimeLocation(event.target.value);
    setSelectedSubOption(timeLocation === "time" ? periodSelection[0] : locations[0]);
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

        setSelectedSubOption(
          timeLocation === "time" ? valuesArray[0] : transformedKeys[0]
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
          graphData.filter((item) => item?.questionId === 28);
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

              summary.time[location][0]["data"][k] = isPermanent ? filterData.answer[0][0] || 0 : filterData.answer[1][0] || 0;
              summary.time[location][1]["data"][k] = isPermanent ? filterData.answer[0][1] || 0 : filterData.answer[1][1] || 0;
              summary.time[location][2]["data"][k] = isPermanent ? filterData.answer[0][2] || 0 : filterData.answer[1][2] || 0;
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
              summary.location[time][0]["data"][k] = isPermanent ? filterData.answer[0][0] || 0 : filterData.answer[1][0] || 0;
              summary.location[time][1]["data"][k] = isPermanent ? filterData.answer[0][1] || 0 : filterData.answer[1][1] || 0;
              summary.location[time][2]["data"][k] = isPermanent ? filterData.answer[0][2] || 0 : filterData.answer[1][2] || 0;
            }
          }
        }
        setPermanentData(summary);
        setNonPermanentData(summary);
      }
    }
  }, [locationOption, timePeriods, graphData, companyFramework, isPermanent]);
  return (
    <div className="container">
      <h2 style={{ fontSize: "1em" }}>
        Total Workers Including Differently Abled
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="time"
              checked={timeLocation === "time"}
              onChange={handleTimeLocationChange}
            />{" "}
            Time
          </label>
          <label>
            <input
              type="radio"
              value="location"
              checked={timeLocation === "location"}
              onChange={handleTimeLocationChange}
            />{" "}
            Location
          </label>
        </div>

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

      <div className="radio-buttons" style={{ marginTop: "-30px" }}>
        {timeLocation === "time"
          ? locations.map((quarter) => (
            <label key={quarter}>
              <input
                type="radio"
                value={quarter}
                checked={selectedSubOption === quarter}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />{" "}
              {quarter}
            </label>
          ))
          : periodSelection.map((location) => (
            <label key={location}>
              <input
                type="radio"
                value={location}
                checked={selectedSubOption === location}
                onChange={(e) => setSelectedSubOption(e.target.value)}
              />{" "}
              {location}
            </label>
          ))}
      </div>

      <Chart
        options={options}
        series={
          isPermanent
            ? permanentData[timeLocation][selectedSubOption]
            : nonPermanentData[timeLocation][selectedSubOption]
        }
        type="bar"
        height={300}
      />
    </div>
  );
};

export default TotalDifWorkIncAb;
