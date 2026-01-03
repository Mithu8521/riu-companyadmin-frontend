import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DiversityPieChart = ({
  categories,
  timePeriodValues,
  shortenedCategories,
  brief,
  title
}) => {
  console.log(brief,"xzccdscsxsdcsdfc")
  // State for pie chart data
  const [pieData, setPieData] = useState([]);
  const [pieLabels, setPieLabels] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);

  useEffect(() => {
    // Check if brief and brief.time exist
    if (!brief || !brief.time) {
      setDataAvailable(false);
      return;
    }

    // Get the values from brief.time
    let filteredKeys = Object.values(brief.time);
    const currentTypeProducts = categories || [];
    
    // Filter data based on type
    filteredKeys = filteredKeys.map(obj => {
      const filteredObj = {};
      Object.keys(obj).forEach(key => {
        if (currentTypeProducts.includes(key)) {
          filteredObj[key] = obj[key];
        }
      });
      return filteredObj;
    });

    const locationData = filteredKeys;
    const categoryTotals = {}; // Sum of percentages for each category
    const categoryCount = {}; // Count of values for each category (for averaging)

    // Loop through each time object
    locationData.forEach((time) => {
      for (const key in time) {
        if (time.hasOwnProperty(key)) {
          const valueArray = time[key];
          
          // Only process if it's an array with values
          if (Array.isArray(valueArray) && valueArray.length > 0) {
            // Sum the percentage values in the array
            const value = valueArray.reduce((acc, curr) => acc + Number(curr), 0).toFixed(2);
            
            // Initialize if not already
            if (!categoryTotals[key]) {
              categoryTotals[key] = 0;
              categoryCount[key] = 0;
            }
            
            // Add to total
            categoryTotals[key] = Number(Number(categoryTotals[key]) + Number(value));
            
            // Increment count (we're counting the time periods that have this category)
            categoryCount[key]++;
          }
        }
      }
    });

    // Calculate average percentages
    const averagePercentages = {};
    for (const key in categoryTotals) {
      if (categoryCount[key] > 0) {
        // Calculate average and round to 2 decimal places
        averagePercentages[key] = Number((categoryTotals[key] / categoryCount[key]).toFixed(2));
      }
    }

    // Convert averagePercentages to series data
    const labels = Object.keys(averagePercentages);
    const data = Object.values(averagePercentages);
    
    // Now we need to ensure these values sum to 100% for the pie chart
    const totalValue = data.reduce((acc, curr) => acc + curr, 0);
    
    // Normalize to make the total 100%
    const normalizedData = data.map(value => 
      totalValue > 0 ? Number(((value / totalValue) * 100).toFixed(2)) : 0
    );
    
    setPieLabels(labels);
    setPieData(normalizedData);
    setDataAvailable(true);
  }, [brief, categories]);

  if (!dataAvailable) {
    return <p>No data available.</p>;
  }

  const chartOptions = {
    chart: {
      type: "pie",
      toolbar: { show: false }
    },
    labels: pieLabels,
    title: {
      show: false,
      text: ""
    },
    legend: {
      show: false,
    },
    colors: [
      "#6fa8dc",
      "#ffa9d0",
      "#cccccc",
      "#6D8B96",
      "#9CDFE3",
      "#11546f",
      "#587b87",
      "#8CBBCE",
    ],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value.toFixed(1) + "%";
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
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
          series={pieData}
          type="pie"
          height={"100%"}
        />
      </div>

      {/* Modified Legend Container - Centered single line with scroll */}
      <div 
        style={{ 
          marginTop: "20px", 
          width: "100%", 
          overflowX: "auto", // Add horizontal scroll
          whiteSpace: "nowrap", // Keep all items in a single line
          padding: "5px 0",
          textAlign: "center" // Center the legend container
        }}
      >
        <div style={{ 
          display: "inline-flex",
          justifyContent: "center" // Center the items within the container
        }}>
          {shortenedCategories.map((category, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
                whiteSpace: "nowrap"
              }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: chartOptions.colors[index % chartOptions.colors.length],
                  marginRight: "5px",
                  borderRadius: "0"
                }}
              />
              <span style={{ fontWeight: 300, fontSize: "12px" }}>
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiversityPieChart;