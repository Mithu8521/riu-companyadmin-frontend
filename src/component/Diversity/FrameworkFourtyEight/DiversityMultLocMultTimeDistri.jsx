import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const DiversityMultiLocMultTimeDistri = ({ brief,categories,categoryMapping,title }) => {
  const [selectedOption, setSelectedOption] = useState("time"); // 'time' or 'location'
  const [selectedLocation, setSelectedLocation] = useState(""); // To track the selected location
  const [selectedTime, setSelectedTime] = useState("");

  const locations = brief ? Object.keys(brief.time) : [];
  const time = brief ? Object.keys(brief.location) : [];

  useEffect(() => {
    if (selectedOption === "time") {
      if (locations.length > 0) {
        setSelectedLocation(locations[0]);
      }
    } else {
      if (time.length > 0) {
        setSelectedTime(time[0]);
      }
    }
  }, [selectedOption, brief]);

  // Check if brief and brief.time exist
  if (!brief || !brief.time) {
    return <p>No data available.</p>;
  }


  let seriesData = [];
  let xAxisCategories = [];

  if (selectedOption === "time" && selectedLocation) {
    const selectedLocationData = brief.time[selectedLocation]; // Data for the selected location
    xAxisCategories = Object.keys(brief.location);

    const timePeriodsLength = xAxisCategories.length; // Assuming all categories have the same number of time periods

    seriesData = categories.map((category) => {
      const mappedCategory = categoryMapping.find(
        (cat) => cat.fullName === category
      );
      return {
        name: mappedCategory ? mappedCategory.shortName : category, // Use short name if available
        data:
          selectedLocationData[category] || Array(timePeriodsLength).fill(0),
      };
    });
  } else if (selectedOption === "location" && selectedTime) {
    const selectedTimeData = brief.location[selectedTime]; // Data for the selected time period
    xAxisCategories = Object.keys(brief.time);

    const locationLength = xAxisCategories.length; // Use the length of the keys for locations

    seriesData = categories.map((category) => {
      const mappedCategory = categoryMapping.find(
        (cat) => cat.fullName === category
      );
      return {
        name: mappedCategory ? mappedCategory.shortName : category, // Use short name if available
        data: Array.from(
          { length: locationLength },
          (_, index) =>
            (selectedTimeData[category] && selectedTimeData[category][index]) ||
            0
        ),
      };
    });
  }

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false, // This removes the toolbar with download options
      },
    },
    dataLabels: { enabled: true },
    xaxis: {
      categories: xAxisCategories,
      labels: {
        offsetY: -0, // Move Y-axis labels up
      }, // Time periods like ['Month 1', 'Month 2']
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0", // Light grey color for the grid lines
      strokeDashArray: 5, // Makes the grid lines dotted
      xaxis: {
        lines: {
          show: false, // Display grid lines along the x-axis
        },
      },
    },
    yaxis: {
      title: {
        text: "------------------ in % ------------------", // Title for the Y-axis
        style: {
          fontSize: "14px", // You can customize font size here
          fontWeight: "bold", // Customize font weight
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "30%",
        columnWidth: "60px",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#96D9D9", "#5630C6", "#ABC4B2", "#6D8B96"], // Custom colors
    legend: {
      show: true,
      markers: {
        width: 12, // Custom legend marker width
        height: 12, // Custom legend marker height

        borderRadius: 12, // Keep circular markers
      },
      position: "bottom", // Adjust as necessary (top, right, bottom, left)
      horizontalAlign: "center", // Align legend items in the center
      itemMargin: {
        horizontal: 10, // Space between legend items
        vertical: 0, // Vertical space (if needed)
      },
      formatter: function (seriesName, opts) {
        return `<div style="display: flex; align-items: center;">
                 
                  <span style="color: #7b91b0;">${seriesName}</span>
                </div>`;
      },
    },
  };

  return (
    <div className="container">
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
        }}
      >
        {title}
      </div>
      <div style={{ marginBottom: "2%" }}>
        <label>
          <input
            type="radio"
            value="time"
            checked={selectedOption === "time"}
            onChange={() => setSelectedOption("time")}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="location"
            checked={selectedOption === "location"}
            onChange={() => setSelectedOption("location")}
          />
          Location
        </label>
      </div>

      {selectedOption === "time" && (
        <div style={{ marginBottom: "2%" }}>
          {locations.map((location) => (
            <label key={location}>
              <input
                type="radio"
                value={location}
                checked={selectedLocation === location}
                onChange={() => setSelectedLocation(location)}
              />
              {location}
            </label>
          ))}
        </div>
      )}

      {selectedOption === "location" && (
        <div style={{ marginBottom: "2%" }}>
          {time.map((time) => (
            <label key={time}>
              <input
                type="radio"
                value={time}
                checked={selectedTime === time}
                onChange={() => setSelectedTime(time)}
              />
              {time}
            </label>
          ))}
        </div>
      )}

      {seriesData.length > 0 && (
        <div style={{ height: "75%" }}>
           { seriesData.length > 0 && chartOptions.xaxis.categories.length > 0 && <Chart
                   options={chartOptions}
                   series={seriesData}
                   type="bar"
                   height={"100%"}
                 />}
        </div>
      )}
    </div>
  );
};

export default DiversityMultiLocMultTimeDistri;
