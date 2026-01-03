import React from "react";
import noDataImage from "../../../img/no.png"
import Chart from "react-apexcharts";

const EnergyConsumptionChart = ({
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
}) => {
  if (!totalConsumptionRenewable && !totalConsumptionNonRenewable) {
    return (
      <div className='container'>
        <img
          src={noDataImage}
          alt="No Data Available"
          style={{ width: "150px", height: "125px", display: "block", margin: "0 auto" }}
        />
      </div>
    )
  }
  
  // Calculate total energy consumption
  const totalConsumption = totalConsumptionRenewable + totalConsumptionNonRenewable;
  
  // Find the maximum value for y-axis scaling (including the total)
  const maxConsumption = Math.max(totalConsumptionRenewable, totalConsumptionNonRenewable, totalConsumption);
  const yAxisMax = maxConsumption + (maxConsumption * 0.1); // Add 10% to the highest value for better visualization

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split('.');
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    if (rest !== '') {
      lastThree = ',' + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + '.' + x[1] : num;
  };

  const getRoundedMaxAndStep = (yAxisMax) => {
    let roundedMax;
    let step;

    if (yAxisMax === 0) return { roundedMax: 1, step: 1 }; // Handle edge case for 0

    const magnitude = Math.pow(10, Math.floor(Math.log10(yAxisMax)));

    // Determine the step size and tickAmount based on magnitude
    if (yAxisMax <= 10) {
      roundedMax = Math.ceil(yAxisMax);
      step = 1;  // Steps of 1 if the max is <= 10
    } else if (yAxisMax <= 100) {
      roundedMax = Math.ceil(yAxisMax / 10) * 10; // Round up to nearest 10
      step = 10; // Steps of 10 if the max is <= 100
    } else if (yAxisMax <= 1000) {
      roundedMax = Math.ceil(yAxisMax / 100) * 100; // Round up to nearest 100
      step = 100; // Steps of 100 if the max is <= 1000
    } else {
      roundedMax = Math.ceil(yAxisMax / magnitude) * magnitude; // For larger numbers, use the magnitude as step size
      step = magnitude / 2; // Use half the magnitude as step size for more readable intervals
    }

    return { roundedMax, step };
  };

  const yAxisConfig = (yAxisMax) => {
    const { roundedMax, step } = getRoundedMaxAndStep(yAxisMax);

    const tickAmount = Math.floor(roundedMax / step); // Calculate the number of ticks

    return {
      labels: {
        formatter: function (value) {
          if (value >= 1e6) {
            return `${(value / 1e6).toFixed(1)} M`; // Format millions with one decimal
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(1)} K`; // Format thousands with one decimal
          } else {
            return Math.round(value); // Format normal numbers
          }
        },
        style: {
          colors: '#7b91b0',
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
      },
      min: 0,
      max: roundedMax,
      tickAmount: tickAmount,
      title: {
        text: "Emission in tCO2",
        style: {
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'Poppins',
          color: '#7b91b0',
        },
      },
    };
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      marginBottom: '20px',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
        distributed: true,
        dataLabels: {
          position: "top", // place labels above the bars
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        if (val >= 1e6) {
          return `${(val / 1e6).toFixed(1)}M`;
        } else if (val >= 1e3) {
          return `${(val / 1e3).toFixed(1)}K`;
        } else {
          return val;
        }
      },
      offsetY: -20, // Adjust label position above the bar
      style: {
        fontSize: "12px",
        colors: ["#000"], // Dark text for better visibility
        fontWeight: 600,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Scope1", "Scope2", "Total Emission"], // Added Total category
      labels: {
        style: {
          colors: '#7b91b0',
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
      },
    },
    yaxis: yAxisConfig(yAxisMax),
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatNumberWithIndianCommas(val) + " tCO2";
        },
      },
    },
    colors: ["#3F822B", "#808080", "#791E80"], // Green for renewable, gray for non-renewable, blue for total
    grid: {
      strokeDashArray: 3,
    },
    legend: {
      show: false,
    },
  };

  // Chart data with total included
  const chartSeries = [
    {
      name: "Emission",
      data: [
        totalConsumptionRenewable, 
        totalConsumptionNonRenewable, 
        totalConsumption
      ],
    },
  ];

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ fontSize: "18px", fontWeight: 600, height: "10%" }}>
        Emission
      </div>
      <div style={{ height: "90%" }}>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default EnergyConsumptionChart;