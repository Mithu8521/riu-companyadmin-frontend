import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const RadioBarChart = (props) => {
  const [chartData, setChartData] = useState({
    series: [10, 10, 10, 10],  // Update these values to reflect the actual data
    options: {
      chart: {
        height: 1000,
        type: "polarArea",
        toolbar: {
          show: false,  // Hide the toolbar
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return 100;
              },
            },
          },
        },
      },
      stroke: {
        show: false,  // Remove the borders
      },
      labels: [
        "Accepted",
        "Rejected",
        "Answered",
        "Not Responded",
      ],
      fill: {
        colors: ["#11546f", "#3ABEC7", "#3F88A5", "#B80000"]  // Update these colors if needed
      },
      tooltip: {
        theme: 'light',  // Set the theme to dark
        style: {
          colors: ["#11546f", "#3ABEC7", "#3F88A5", "#B80000"],  // Set the tooltip colors to match the colors of each area
        },
      },
      legend: {
        position: 'bottom',  // Position the legend at the bottom
        horizontalAlign: 'center',  // Center align the legend
        markers: {
          fillColors: ["#11546f", "#3ABEC7", "#3F88A5", "#B80000"]  // Match these colors with the fill colors
        },
        itemMargin: {
          horizontal: 10,
          vertical: 20  // Add vertical margin to avoid overlapping
        }
      }
    },
  });
  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
    }
  }, [props]);

  return (
    <div id="chart" className="my-4" style={{ height: "100%" }}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="polarArea"
        height={"120%"}
      />
    </div>
  );
};

export default RadioBarChart;
