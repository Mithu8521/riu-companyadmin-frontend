import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import "./Toggle.css";
import right from "../../img/Vector 1.svg"

const EmployeeChart = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  horizontal,
  type,
}) => {
  const [companyFramework, setCompanyFramework] = useState([]);
  const [locations, setLocations] = useState([""]);
  const [periodSelection, setPeriodSelection] = useState([""]);
  const [isPermanent, setIsPermanent] = useState(true);
  const [timeLocation, setTimeLocation] = useState("time");
  const [selectedSubOption, setSelectedSubOption] = useState("Location1");
  const [colors, setColors] = useState([]);
  const colorPalette = [
    "#11546f",
    "#6fa8dc",
    "#9CDFE3",
    "#587B87",
    "#9CDFE3",
    "#FF8C33",
    "#33FFF4",
    "#9DFF33",
    "#FF3333",
    "#3377FF",
    "#FF7F50",
    "#FFD700",
    "#8A2BE2",
    "#D2691E",
    "#00FA9A",
  ];

  const genders = ["Male", "Female", "Others"];
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        columnWidth: "60px",
        borderRadius: 10,
        barHeight: "40%",
      },
    },
    stroke: {
      width: [0, 0, 0, 3, 3],
      curve: "smooth",
    },
    fill: {
      opacity: [1, 1, 1, 0.25, 0.25],
      colors: colorPalette,
    },
    legend: {
      show: false,
      enabled: false,
      position: "top",
      markers: {
        fillColors: colorPalette,
      },
    },
    xaxis: {
      categories: timeLocation === "time" ? periodSelection : locations,
      title: {
        text: undefined, // Removed x-axis title
      },
    },
    colors: colorPalette,
    yaxis: {
      title: {
        text: undefined, // Removed y-axis title
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

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

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  const handleTimeLocationChange = (event) => {
    setTimeLocation(event.target.value);
    setSelectedSubOption(
      timeLocation === "time" ? periodSelection[0] : locations[0]
    );
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
          graphData.filter(
            (item) =>
              item?.questionId ===
              (horizontal
                ? type === "EMPLOYEE"
                  ? 30
                  : 32
                : type === "EMPLOYEE"
                  ? 26
                  : 28)
          );
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
              const obj = locationOption.find(
                (item) => item.unitCode || item.value === location
              );
              const filterData = answer.find(
                (item) =>
                  item.formDate === formDate && item.sourceId === Number(obj.id)
              );

              summary.time[location][0]["data"][k] = isPermanent
                ? filterData.answer[0][0] || 0
                : filterData.answer[1][0] || 0;
              summary.time[location][1]["data"][k] = isPermanent
                ? filterData.answer[0][1] || 0
                : filterData.answer[1][1] || 0;
              summary.time[location][2]["data"][k] = isPermanent
                ? filterData.answer[0][2] || 0
                : filterData.answer[1][2] || 0;
            }
          }

          for (const time in summary.location) {
            const data = summary.location[time];
            for (let k = 0; k < data[0].data.length; k++) {
              let location = locationKey[k];
              const obj = locationOption.find(
                (item) => item.unitCode || item.value === location
              );
              const lowerCaseKey = time;
              const formDate = timePeriods[lowerCaseKey];
              const filterData = answer.find(
                (item) =>
                  item.formDate === formDate && item.sourceId === Number(obj.id)
              );
              summary.location[time][0]["data"][k] = isPermanent
                ? filterData.answer[0][0] || 0
                : filterData.answer[1][0] || 0;
              summary.location[time][1]["data"][k] = isPermanent
                ? filterData.answer[0][1] || 0
                : filterData.answer[1][1] || 0;
              summary.location[time][2]["data"][k] = isPermanent
                ? filterData.answer[0][2] || 0
                : filterData.answer[1][2] || 0;
            }
          }
        }
        setPermanentData(summary);
        setNonPermanentData(summary);
      }
    }
  }, [locationOption, timePeriods, graphData, companyFramework, isPermanent]);
  return (
    <div className="container" style={{ height: "100%" }}>
      <h2 style={{ fontSize: "1em", marginLeft: "1%" }}>
        {horizontal
          ? type === "EMPLOYEE"
            ? "Total Differently Abled Employees"
            : "Total Differently Abled Workers"
          : type === "EMPLOYEE"
            ? "Total Employees Including Differently Abled"
            : "Total Workers Including Differently Abled"}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "13%",
        }}
      >
        {(locations && locations?.length > 1) ? <div className="radio-buttons">
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
        </div> : <div></div>}

        <div className="toggle-switch-container">
          <div className="toggle-switch" onClick={toggleData}>
            <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
              <span
                style={{ fontSize: "30px", marginBottom: "25%" }}
                className="toggle-arrow"
              >
                {<img
                  src={right}
                  style={{ transform: isPermanent ? "rotate(0deg)" : "rotate(180deg)" }}
                  alt="Arrow"
                />}
              </span>
            </div>
          </div>
          <p style={{ fontSize: "10px" }}>
            {isPermanent ? "Permanent" : "Non-Permanent"}
          </p>
        </div>
      </div>

      {(locations && locations?.length > 1) ? <div
        className="radio-buttons"
        style={{ marginTop: "-30px", height: "10%" }}
      >
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
      </div> : <div></div>}

      <div style={{ height: "65%" }}>
        <ReactApexChart
          options={chartOptions}
          series={
            isPermanent
              ? permanentData[timeLocation][selectedSubOption]
              : nonPermanentData[timeLocation][selectedSubOption]
          }
          type="bar"
          height={"100%"}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          height: "10%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {genders.map((gender, index) => (
          <div
            key={gender}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: colorPalette[index],
                borderRadius: "50%", // Make it a circle
              }}
            ></div>
            <span>{gender}</span>
          </div>
        ))}
        <div style={{ fontSize: "12px" }}
        >{"("}Number of Employees{")"}</div>
      </div>
    </div>
  );
};

export default EmployeeChart;
