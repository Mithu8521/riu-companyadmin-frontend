import React from "react";
import Chart from "react-apexcharts"; // Import the ApexCharts component

const DiversityMultiLoc = ({
  horizontal,
  title,
  timePeriods,
  matchedDataWaste,
}) => {
  // Extract categories dynamically based on the specified condition
  const categories = matchedDataWaste.reduce((acc, item) => {
    if (item.question_details) {
      // Check for 'column1' first
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "column1")
        .map((detail) => detail.option);

      // If no 'column1' found, check for 'column'
      if (filteredOptions.length === 0) {
        filteredOptions = item.question_details
          .filter((detail) => detail.option_type === "column")
          .map((detail) => detail.option);
      }

      return acc.concat(filteredOptions);
    }
    return acc;
  }, []);

  // Remove duplicates
  const uniqueCategories = [...new Set(categories)].reverse();

  // Prepare data for each category (reversing axis logic)
  const seriesData = uniqueCategories.map((category, categoryIndex) => {
    const categoryData = Object.keys(timePeriods).map(
      (timePeriod, timeIndex) => {
        // Find the corresponding object for this time period (H1, H2, etc.)
        const currentTimePeriodData = matchedDataWaste[timeIndex];

        if (currentTimePeriodData && currentTimePeriodData.question_details) {
          // Find the detail that matches the category
          const matchedDetail = currentTimePeriodData.question_details.find(
            (detail) => detail.option === category
          );
          // Extract the answer value from the correct answer array
          if (
            matchedDetail &&
            currentTimePeriodData.answer &&
            currentTimePeriodData.answer[0]
          ) {
            const answerValue = currentTimePeriodData.answer[0][categoryIndex]; // Use the correct index for the category
            return answerValue !== undefined ? answerValue : 0;
          }
        }
        return 0; // Default to 0 if no data is found
      }
    );

    return {
      name: category, // Each category will now be a series
      data: categoryData, // Data for each time period (H1, H2, etc.)
    };
  });

  const categoryNameMap = {
    "Number of Males": "Males",
    "Number of Females": "Females",
    Others: "Others",
    // Add more mappings as necessary
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true, // Enable data labels
      style: {
        fontSize: "12px", // Set the font size for the data labels
        fontWeight: "bold", // Set the font weight for the data labels
        colors: ["#fff"], // Set the color of the data labels (white in this case)
      },
      background: {
        enabled: true, // Enable background for the labels
        foreColor: "#000", // Set background color for data labels
        padding: 4, // Padding inside the label
        borderRadius: 2, // Rounded corners
      },
      formatter: function (val, { seriesIndex, dataPointIndex, w }) {
        // Make sure val is a number before we process it
        if (isNaN(val)) return ""; // Hide NaN values
  
        // Sum all values in the current series (stacked bar logic)
        const sum = w.config.series[seriesIndex].data.reduce((acc, val) => acc + (Number(val) || 0), 0);
  
        // Hide the total label for the stacked bar if it matches the sum
        return val === sum ? "" : val;
      },
      // Disable total label on top of the stacked bar group
      dropShadow: {
        enabled: false,
      },
      // Remove total (summed) value for each group if it’s considered a "total" in some case
      // By default, total is not being displayed with the current configuration
    },
    xaxis: {
      categories: Object.keys(timePeriods).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      ),
      position: horizontal ? "top" : "bottom",
      title: {
        text: horizontal ? "Number of individuals" : "", // Title for the X-axis if horizontal
        style: {
          fontSize: "14px", // Customize font size
          fontWeight: "bold", // Customize font weight
        },
        offsetX: 0, // Center horizontally
        offsetY: 225, // Position the title at the bottom
      },
    },
    yaxis: {
      title: {
        text: horizontal ? "" : "Number of individuals", // Title for the Y-axis if not horizontal
        style: {
          fontSize: "14px", // Customize font size
          fontWeight: "bold", // Customize font weight
        },
        offsetX: 0, // Center horizontally
        offsetY: 0, // Position the title at the bottom
      },
    },
    plotOptions: {
      bar: {
        horizontal: horizontal, // Make the bars horizontal
        columnWidth: "60px",
        barHeight: horizontal ? "35%" : "100%",
        columnHeight: horizontal ? "35%" : "100%",
      },
    },
    fill: {
      opacity: 1,
    },
    
    colors: [
      "#6fa8dc",
      "#ffa9d0",
      "#cccccc",
      "#6fa8dc",
      "#ffa9d0",
      "#cccccc",
      "#6fa8dc",
      "#ffa9d0",
      "#cccccc",
      "#6fa8dc",
      "#ffa9d0",
    ],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center", // Align legend horizontally
      itemMargin: {
        horizontal: 10, // Space between items
        vertical: 10, // Space between rows
      },
      markers: {
        width: 12, // Marker width
        height: 12, // Marker height
        radius: 12, // Makes the markers circular
        offsetX: 0, // Horizontal offset (optional)
        offsetY: 0, // Vertical offset (optional)
      },

      // Set max rows for legend
      onItemClick: {
        toggleDataSeries: true, // Toggle visibility of series
      },
      itemStyle: {
        fontSize: "12px", // Adjust font size for legend items if needed
      },
      formatter: function (val) {
        return categoryNameMap[val] || val; // Shorten the name if it exists in the map, else show original
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
          marginBottom: "2%",
        }}
      >
        {title}{" "}
      </div>
      <div style={{ height: "90%" }}>
         { seriesData.length > 0 && chartOptions.xaxis.categories.length > 0 && <Chart
                 options={chartOptions}
                 series={seriesData}
                 type="bar"
                 height={"100%"}
               />}
      </div>
    </div>
  );
};

export default DiversityMultiLoc;
