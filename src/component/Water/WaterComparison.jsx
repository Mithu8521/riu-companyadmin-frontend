import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const WaterComparison = ({ brief, type }) => {
  const [selectedOption, setSelectedOption] = useState("time");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTime, setSelectedTime] = useState("Apr");

  const locations = brief && brief.time ? Object.keys(brief.time) : [];
  const time = brief && brief.location ? Object.keys(brief.location) : [];

  useEffect(() => {
    if (selectedOption === "time") {
      if (locations.length > 0 && (!selectedLocation || !locations.includes(selectedLocation))) {
        setSelectedLocation(locations[0]);
      }
    } else {
      if (time.length > 0 && (!selectedTime || !time.includes(selectedTime))) {
        setSelectedTime(time[0]);
      }
    }
  }, [selectedOption, brief, locations, time, selectedLocation, selectedTime]);

  if (!brief || !brief.time || !brief.location) {
    return <p>No data available.</p>;
  }

  const originalCategories =
    type === "COMS"
      ? [
          "Total Groundwater consumption* ( in KL)",
          "Total Tanker Water Consumption* (in KL)",
          "Total surface water consumption (this includes municipal supply water)* ( in KL)",
        ]
      : ["Total Wastewater treated(STP/ETP)* ( in KL)"];

  const displayCategories = originalCategories.map(category => {
    return category
      .replace(/^Total\s+/i, '')
      .replace(/\*\s*\(\s*in\s*KL\s*\)$/i, '')
      .replace(/\*\s*\(\s*in\s*KL\s*\)/, '')
      .trim();
  });

  let seriesData = [];
  let xAxisCategories = [];

  if (selectedOption === "time" && selectedLocation) {
    const selectedLocationData = brief.time[selectedLocation];

    if (!selectedLocationData) {
      return <p>No data available for selected location.</p>;
    }

    xAxisCategories = Object.keys(brief.location);

    seriesData = originalCategories.map((category, index) => {
      if (!selectedLocationData[category]) {
        return {
          name: displayCategories[index],
          data: Array(xAxisCategories.length).fill(0),
        };
      }

      let dataValues;
      if (Array.isArray(selectedLocationData[category])) {
        dataValues = [...selectedLocationData[category]];
        while (dataValues.length < xAxisCategories.length) {
          dataValues.push(0);
        }
        dataValues = dataValues.slice(0, xAxisCategories.length);
      } else {
        dataValues = Array(xAxisCategories.length).fill(selectedLocationData[category] || 0);
      }

      return {
        name: displayCategories[index],
        data: dataValues,
      };
    });
  } else if (selectedOption === "location" && selectedTime) {
    const selectedTimeData = brief.location[selectedTime];

    if (!selectedTimeData) {
      return <p>No data available for selected time period.</p>;
    }

    xAxisCategories = Object.keys(brief.time);

    seriesData = originalCategories.map((category, index) => {
      if (!selectedTimeData[category]) {
        return {
          name: displayCategories[index],
          data: Array(xAxisCategories.length).fill(0),
        };
      }

      if (
        typeof selectedTimeData[category] === "object" &&
        !Array.isArray(selectedTimeData[category])
      ) {
        const dataArray = xAxisCategories.map(
          (loc) => selectedTimeData[category][loc] || 0
        );

        return {
          name: displayCategories[index],
          data: dataArray,
        };
      } else if (Array.isArray(selectedTimeData[category])) {
        const dataArray = [...selectedTimeData[category]];
        while (dataArray.length < xAxisCategories.length) {
          dataArray.push(0);
        }

        return {
          name: displayCategories[index],
          data: dataArray.slice(0, xAxisCategories.length),
        };
      } else {
        return {
          name: displayCategories[index],
          data: Array(xAxisCategories.length).fill(selectedTimeData[category] || 0),
        };
      }
    });
  }

  const chartColors = ["#96D9D9", "#5630C6", "#8BAF9C"];

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "normal",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
        endingShape: "flat",
        dataLabels: {
          position: "center",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontWeight: "bold",
      },
      formatter: function (val) {
        return val ? val.toFixed(1) : "0.0";
      },
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0",
      strokeDashArray: 5,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: xAxisCategories,
      position: "bottom",
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    yaxis: {
      title: {
        text: "",
        style: {
          fontWeight: "bold",
        },
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    colors: chartColors.slice(0, seriesData.length),
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 10,
      markers: {
        width: 12,
        height: 12,
        radius: 2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      showForSingleSeries: true,
      showForNullSeries: true,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className="container" style={{ width: "100%" }}>
      <div
        style={{
          height: "8%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
        }}
      >
        Product Wise{" "}
        {type === "COMS"
          ? "Water Consumption"
          : type === "TREAT"
          ? "Treated Water"
          : ""}{" "}
      </div>
      <div style={{ marginBottom: "2%" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            value="time"
            checked={selectedOption === "time"}
            onChange={() => setSelectedOption("time")}
            style={{ marginRight: "5px" }}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="location"
            checked={selectedOption === "location"}
            onChange={() => setSelectedOption("location")}
            style={{ marginRight: "5px" }}
          />
          Location
        </label>
      </div>

      {selectedOption === "time" && (
        <div style={{ marginBottom: "2%" }}>
          {locations.map((location) => (
            <label key={location} style={{ marginRight: "15px" }}>
              <input
                type="radio"
                value={location}
                checked={selectedLocation === location}
                onChange={() => setSelectedLocation(location)}
                style={{ marginRight: "5px" }}
              />
              {location}
            </label>
          ))}
        </div>
      )}

      {selectedOption === "location" && (
        <div style={{ marginBottom: "2%" }}>
          {time.map((t) => (
            <label key={t} style={{ marginRight: "15px" }}>
              <input
                type="radio"
                value={t}
                checked={selectedTime === t}
                onChange={() => setSelectedTime(t)}
                style={{ marginRight: "5px" }}
              />
              {t}
            </label>
          ))}
        </div>
      )}

      {seriesData.length > 0 && xAxisCategories.length > 0 && (
        <div style={{ height: "400px" }}>
          <Chart
            options={chartOptions}
            series={seriesData}
            type="bar"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default WaterComparison;