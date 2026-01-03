import React from "react";
import ReactApexChart from "react-apexcharts";

const WaterAreaComponent = ({ timePeriods, matchedWaterDis }) => {
  // Extract unique categories dynamically based on the specified condition
  const categories = matchedWaterDis.reduce((acc, item) => {
    if (item.question_details) {
      let filteredOptions = item.question_details
        .filter((detail) => detail.option_type === "row")
        .map((detail) => detail.option)
        .reverse();

      return acc.concat(filteredOptions);
    }
    return acc;
  }, []);

  // Remove duplicates to get unique categories (water types)
  const uniqueCategories = [...new Set(categories)];

  // Prepare data for each category (water types) over all time periods
  const seriesData = uniqueCategories.map((category, categoryIndex) => {
    const valuesForTimePeriods = Object.keys(timePeriods).map((timePeriod, timeIndex) => {
      const timePeriodData = matchedWaterDis[timeIndex];
      if (timePeriodData && timePeriodData.question_details) {
        const matchedDetail = timePeriodData.question_details.find(
          (detail) => detail.option === category
        );
        if (
          matchedDetail &&
          timePeriodData.answer &&
          timePeriodData.answer[0]
        ) {
          const answerValue = timePeriodData.answer[categoryIndex][0];
          return answerValue !== undefined && answerValue !== "NA" ? Number(answerValue) : 0;
        }
      }
      return 0; // Default to 0 if no data is found
    });

    return {
      name: category, // The water category becomes the series name
      data: valuesForTimePeriods,
    };
  });

  // Colors for each category
  const colors = ["#6D8B96", "#ABC4B2", "#9CDFE3", "#C6CB8D", "#949776"];

  // ApexCharts setup
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: Object.keys(timePeriods),
      title: {
        text: '', // Hides the x-axis title
      },
      tickPlacement: 'on', // Keep ticks on the data points but add padding manually
      rangePadding: {
        left: 10, // Adds small padding to the left of the x-axis
        right: 10, // Adds small padding to the right of the x-axis
      },
    },
    yaxis: {
      title: {
        text: 'Water Discharged (in KL)', // Title for the Y-axis
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} KL`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
    colors: colors, // Use the predefined colors for water categories
    legend: {
      show: false, // Hide default legend
    },
  };

  return (
    <div className="container">
      <div style={{ fontSize: "18px", fontWeight: 600, height: "10%" }}>
        Total Water Discharged (in KL)
      </div>
      <div style={{ height: "80%" }}>
        {seriesData.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={seriesData}
            type="area"
            height={"100%"}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* Custom Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",

          flexWrap: "wrap",
        }}
      >
        {uniqueCategories.map((category, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: colors[index % colors.length],
                marginRight: "10px",
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: 400 }}>
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterAreaComponent;
