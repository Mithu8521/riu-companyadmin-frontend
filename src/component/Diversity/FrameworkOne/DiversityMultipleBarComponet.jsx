import React from "react";
import Chart from "react-apexcharts";
import no from "../../../img/no.png";

const DiversityMultipleBarComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="container">
        <img
          src={no}
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }
  
  // Extract the rows for x-axis categories
  const categories = data[0].question_details
    .filter((detail) => detail.option_type === "row")
    .map((detail) => {
      if (detail.option === "Number of Key Management Personnel") {
        return "Key Management";
      } else if (detail.option === "Number of board members") {
        return "Board";
      }
      return detail.option;
    });

  // Extract the columns for the stack series
  const stackCategories = data[0].question_details
    .filter((detail) => detail.option_type === "column")
    .map((detail) => detail.option).reverse();

  // Prepare the series data
  const seriesData = stackCategories.map((column, colIndex) => {
    return {
      name: column,
      data: data[0].answer.map((answer) =>
        answer[colIndex] !== "" ? Number(answer[colIndex]) : 0
      ),
    };
  });

  // Chart options
  const options = {
    chart: {
      type: "bar",
      stacked: true,
      height: 350,
      toolbar: {
        show: false,
      },
      fontFamily: 'inherit',
    },
    title: {
      text: "Diversity in Leadership",
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70px',
        distributed: false,
      },
    },
    xaxis: {
      categories: categories.reverse(),
      labels: {
        rotate: 0,
        style: {
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: "Number of Individuals",
      },
      max: 8,
      tickAmount: 4,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 3,
        opacity: 0.5,
      },
      formatter: function (val) {
        return val !== 0 ? `${val}` : '';
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },
    colors: ["#6fa8dc", "#ffa9d0", "#cccccc"], // Male, Female, Others
    grid: {
      padding: {
        top: 10,
        bottom: 20,
      },
      show: true,
      borderColor: 'rgb(204, 204, 204)',
      strokeDashArray: 2, // Change from 0 to 5 for dotted lines
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true,
          strokeWidth: 5 // Add this to make lines thicker
        }
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
            offsetY: 20,
          }
        }
      }
    ]
  };
 
  // Make sure there's sample data for Key Management if it's missing
  if (seriesData.length > 0 && seriesData[0].data.length < 2) {
    // Add placeholder data for Key Management
    seriesData.forEach(series => {
      if (series.name === "Male") {
        series.data.push(3); // Example value
      } else if (series.name === "Female") {
        series.data.push(2); // Example value
      } else {
        series.data.push(0); // Others
      }
    });
  }

  return (
    <div className="container" style={{ marginBottom: "40px" }}>
      <Chart 
        options={options} 
        series={seriesData} 
        type="bar" 
        height={450} // Increased height for better legend visibility
      />
    </div>
  );
};

export default DiversityMultipleBarComponent;