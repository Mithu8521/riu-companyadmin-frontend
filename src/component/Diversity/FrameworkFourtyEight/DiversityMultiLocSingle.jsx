import React from "react";
import Chart from "react-apexcharts";

const DiversityMultiLocSingle = ({
  categories,
  timePeriodValues,
  shortenedCategories,
  brief,
  title
}) => {
  // Check if brief and brief.time exist
  if (!brief || !brief.time) {
    return <p>No data available.</p>;
  }

  const locationPeriod = Object.keys(brief.time); // Assuming these are your locations
  const time = Object.keys(brief.location);

  // Prepare data for the chart based on conditions
  let seriesData = [];

  if (locationPeriod.length > 1 && timePeriodValues.length === 1) {
    // Case 1: Multiple locations and single time period
    locationPeriod.forEach((location) => {
      const locationData = {};
      categories.forEach((category) => {
        if (brief.time[location][category]) {
          // Take the first element of the array for the value
          locationData[category] = Number(brief.time[location][category][0]);
        }
      });
      seriesData.push(locationData);
    });
  } else if (locationPeriod.length === 1 && timePeriodValues.length > 1) {
    // Case 2: Single location and multiple time periods
    time.forEach((timeO) => {
      const locationData = {};
      categories.forEach((category) => {
        if (brief.location[timeO][category]) {
          // Take the first element of the array for the value
          locationData[category] = Number(brief.location[timeO][category][0]);
        }
      });
      seriesData.push(locationData);
    });
  } else if (locationPeriod.length > 1 && timePeriodValues.length > 1) {
    // Case 3: Single location and single time period
    time.forEach((timeO) => {
      const locationData = {};
      categories.forEach((category) => {
        if (brief.location[timeO][category]) {
          // Sum all the elements in the array for the value
          const sumValue = brief.location[timeO][category].reduce(
            (acc, val) => acc + Number(val),
            0
          );
          locationData[category] = sumValue;
        }
      });
      seriesData.push(locationData);
    });
  }

  // Convert seriesData into the format ApexCharts expects
  const series = categories.map((category, index) => ({
    name: category,
    data: seriesData.map((item) => item[category] || 0), // Fallback to 0 if no data
  }));

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      title: "",
      toolbar: { show: false }
    },
    xaxis: {
      categories:
        locationPeriod.length > 1 && timePeriodValues.length === 1
          ? locationPeriod // Using locations as X-axis categories for this condition
          : time, // Using time periods as X-axis categories for the other condition
    },
    yaxis: {
      title: {
        text: 'Percentage', // Title for the Y-axis
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
    title: {
      show: false, // Set title visibility to false
      text: "", // Provide text property for the title
    },
    legend: {
      show: false, // Set legend visibility to false
    },
    fill: {
      opacity: 1,
    },
    colors: [
      "#C6CB8D",
      "#949776",
      "#ABC4B2",
      "#6D8B96",
      "#9CDFE3",
      "#11546f",
      "#587b87",
      "#8CBBCE",
    ],
    dataLabels: {
      enabled: true, // Disable data labels if they interfere
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
          marginBottom: "2%",
        }}
      >
        {title}
      </div>

      <div style={{ height: "70%" }}>
        <Chart
          options={chartOptions}
          series={series}
          type="bar"
          height={"100%"}
        />
      </div>

      {/* Custom Legends Container */}
      <div style={{ marginTop: "20px", width: "100%" }}>
        {shortenedCategories
          .reduce((acc, category, index) => {
            if (index % 3 === 0) acc.push([]); // Start a new row for every three items
            acc[acc.length - 1].push(
              <div
                key={index}
                style={{
                  display: "flex",
                  width: "25%",
                  alignItems: "center",
                  marginRight: "15px",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    backgroundColor: chartOptions.colors[index], // Use corresponding color
                    marginRight: "5px",
                  }}
                />
                <span style={{ fontWeight: 300, fontSize: "12px" }}>
                  {category}
                </span>
              </div>
            );
            return acc;
          }, [])
          .map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {row}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DiversityMultiLocSingle;
