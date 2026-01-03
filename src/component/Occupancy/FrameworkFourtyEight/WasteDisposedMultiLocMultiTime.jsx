import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const WasteDisposedMultiLocMultiTime = ({ brief }) => {
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

  }, [selectedOption, brief])

  // Check if brief and brief.time exist
  if (!brief || !brief.time) {
    return <p>No data available.</p>;
  }

  const categories = [
    'Total e-waste disposed',
    'Total metal scraps disposed',
  ];

  const nameMap = {
    'Total e-waste disposed': "E-waste",
    'Total metal scraps disposed': "Metal",

  };


  let seriesData = [];
  let xAxisCategories = [];

  if (selectedOption === "time" && selectedLocation) {
    // When time is selected, and a location (l1, l2, etc.) is selected

    const selectedLocationData = brief.time[selectedLocation]; // Data for the selected location

    const timePeriods = selectedLocationData[categories[0]].length; // Number of months (time periods)
    xAxisCategories = Object.keys(brief.location);


    // Prepare series data for each category
    // Assuming selectedLocationData is the selected location data for the location
    const timePeriodsLength = selectedLocationData[categories[0]]?.length || 0; // Assuming all categories have the same number of time periods

    // Prepare series data for each category
    seriesData = categories.map((category) => {


      const dataArray = Array.from(
        { length: timePeriodsLength },
        (_, index) => {
          const value =
            (selectedLocationData[category] &&
              selectedLocationData[category][index]) ||
            0;

          // Log the value for each time period

          return value;
        }
      );

      // Log the generated array for this category

      return {
        name: category,
        data: dataArray,
      };
    });



  } else if (selectedOption === "location" && selectedTime) {
    // When time is selected, and a location (l1, l2, etc.) is selected

    const selectedLocationData = brief.location[selectedTime]; // Data for the selected location

    const timePeriods = selectedLocationData[categories[0]].length; // Number of months (time periods)
    xAxisCategories = Object.keys(brief.time);


    // Prepare series data for each category
    // Assuming selectedLocationData is the selected location data for the location
    const timePeriodsLength = selectedLocationData[categories[0]]?.length || 0; // Assuming all categories have the same number of time periods

    // Prepare series data for each category
    seriesData = categories.map((category) => {


      const dataArray = Array.from(
        { length: timePeriodsLength },
        (_, index) => {
          const value =
            (selectedLocationData[category] &&
              selectedLocationData[category][index]) ||
            0;

          // Log the value for each time period

          return value;
        }
      );

      // Log the generated array for this category

      return {
        name: category,
        data: dataArray,
      };
    });




  }

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    xaxis: {
      categories: xAxisCategories, // Time periods like ['Month 1', 'Month 2']
    },
    yaxis: {
      title: {
        text: 'Waste in MT', // Title for the Y-axis
        style: {
          fontSize: '14px', // You can customize font size here
          fontWeight: 'bold', // Customize font weight
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px"
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#C6CB8D", "#949776", "#ABC4B2", "#6D8B96"], // Custom colors
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
        Total Waste Disposed
      </div>
      <div>
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
        <div>

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
        <div>

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
        <div style={{ height: "80%" }}>
         { seriesData.length > 0 && chartOptions.xaxis.categories.length > 0 &&  <Chart
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

export default WasteDisposedMultiLocMultiTime;
