import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const WaterRecycledMultiLoc = ({ brief }) => {
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


  const categories = ["Water recycling/reuse percentage",];



  let seriesData = [];
  let xAxisCategories = [];

  if (selectedOption === "time" && selectedLocation) {
    // When time is selected, and a location (l1, l2, etc.) is selected

    const selectedLocationData = brief.time[selectedLocation]; // Data for the selected location

    const timePeriods = selectedLocationData[categories[0]].length; // Number of months (time periods)
    xAxisCategories = Object.keys(brief.location);


    // Prepare series data for each category
    // Assuming selectedLocationData is the selected location data for the location
    const timePeriodsLength = xAxisCategories.length; // Assuming all categories have the same number of time periods
    // Assuming all categories have the same number of time periods

    // Prepare series data for each category
    seriesData = categories.map((category) => {
      return {
        name: category,
        data: selectedLocationData[category] || Array(timePeriodsLength).fill(0),
      };
    });



  } else if (selectedOption === "location" && selectedTime) {
    // When time is selected, and a location (l1, l2, etc.) is selected

    const selectedTimeData = brief.location[selectedTime]; // Data for the selected time period
    const selectedLocationData = brief.location[selectedTime]; // Data for the selected location

    xAxisCategories = Object.keys(brief.time);
    const locationLength = xAxisCategories.length; // Use the length of the keys for locations



    // Prepare series data for each category
    // Assuming selectedLocationData is the selected location data for the location

    // Prepare series data for each category
    seriesData = categories.map((category) => {


      const dataArray = Array.from(
        { length: locationLength },
        (_, index) => {
          const value =
            (selectedTimeData[category] &&
              selectedTimeData[category][index]) ||
            0;

          // Log the value for each location

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
      toolbar: {
        show: false, // This removes the toolbar with download options
      },
    },
    dataLabels: { enabled: true },
    xaxis: {
      categories: xAxisCategories,

    },
    // grid: {
    //   show: true,
    //   borderColor: '#e0e0e0', // Light grey color for the grid lines
    //   strokeDashArray: 5, // Makes the grid lines dotted
    //   xaxis: {
    //     lines: {
    //       show: true, // Display grid lines along the x-axis
    //     },
    //   },
    // },
    yaxis: {
      title: {
        text: '', // Title for the Y-axis
        style: {
          fontSize: '14px', // You can customize font size here
          fontWeight: 'bold', // Customize font weight
        },
      },

    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#C6CB8D", "#949776", "#ABC4B2", "#6D8B96"], // Custom colors
    legend: {
      show: true, // Display legends
      position: 'bottom', // Left-align the legends
      horizontalAlign: 'left', // Align horizontally to the left
      markers: {
        width: 12,
        height: 12,
        radius: 12, // Makes the markers circular
      },
      itemMargin: {
        horizontal: 10, // Adds space between legend items
      },
      labels: {
        useSeriesColors: true, // Use the series colors for the legend labels
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
        Water Recycling Percentage
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
          <Chart
            options={chartOptions}
            series={seriesData}
            type="bar"
            height={"100%"}
          />

        </div>
      )}
    </div>
  );
};

export default WaterRecycledMultiLoc;
