import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import img from "../../img/no.png";

const SeparateWaterMultTimeMultTime = ({
  compareLastTimePeriods,
  locationOption,
  compareTCurrentimePeriods,
  graphData,
  financialYear,
}) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatValue(val);
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["green"], // White text inside the box
        
      },
      background: {
        enabled: true,
        foreColor: "white",  // Text color inside the box

        padding: 4,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: function ({ seriesIndex }) {
          return seriesIndex === 0 ? "#28a745" : "#dc3545"; // Green for actual, Red for expected
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.7,
        },
      },
    },
    
    stroke: {
      show: true,
      width: [2, 4],
      colors: ["#791E80", "#ff0000"], // Blue for Actual, Red for Trigger
      curve: "straight", // Makes the line chart straight
    },
    xaxis: {
      categories: [],
      title: {
        text: "Time Periods",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: "#7b91b0",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    yaxis: {
      title: {
        text: "Water (KL)",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
        formatter: (value) => formatValue(value),
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
    colors: ["#791E80", "#ff0000"], // Blue for Actual, Red for Trigger
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
  });
  

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    } else {
      return Math.round(value);
    }
  };

  const formatNumberWithIndianCommas = (number) => {
    const x = number.toString().split(".");
    let num = x[0];
    let lastThree = num.slice(-3);
    const rest = num.slice(0, -3);

    if (rest !== "") {
      lastThree = "," + lastThree;
      const result = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      num = result + lastThree;
    } else {
      num = lastThree;
    }

    return x.length > 1 ? num + "." + x[1] : num;
  };

  const getTotalEnergyForPeriod = (fromDate) => {
    console.log(fromDate);
    return graphData
      .filter((data) => data.formDate === fromDate)
      .map((data) => {
        return data.answer.reduce((innerSum, energyPair) => {
          const value = Number(energyPair[0]);
          const unit = energyPair[1];
  
          // Check if the unit is 'liter' or 'liters' and adjust the value
          const adjustedValue = (unit === "liter" || unit === "liters") 
                                ? value / 1000 
                                : value;
  
          // Only add if the value is a valid number
          return innerSum + (isNaN(adjustedValue) || adjustedValue === "" ? 0 : adjustedValue);
        }, 0);
      })
      .reduce((accum, curr) => accum + curr, 0);
  };
  

  const getTotalTargetEnergyForPeriod = (fromDate) => {
    return graphData
      .filter((data) => data.formDate === fromDate)
      .map((data) =>
        (data.targetData || [])
          .flat()
          .reduce((sum, value) => {
            const numValue = Number(value);
            return sum + (isNaN(numValue) || value === "" ? 0 : numValue);
          }, 0)
      )
      .reduce((accum, curr) => accum + curr, 0);
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      const categories = [
        ...Object.keys(compareLastTimePeriods).map(
          (period) =>
            `${financialYear[financialYear.length - 2]?.financial_year_value} (${period})`
        ),
        ...Object.keys(compareTCurrentimePeriods).map(
          (period) =>
            `${financialYear[financialYear.length - 1]?.financial_year_value} (${period})`
        ),
      ];

      const tmpCategories = [
        ...Object.keys(compareLastTimePeriods),
        ...Object.keys(compareTCurrentimePeriods),
      ];

      const getMappedPeriod = (displayPeriod) => {
        return (
          compareLastTimePeriods?.[displayPeriod] ||
          compareTCurrentimePeriods?.[displayPeriod] ||
          displayPeriod
        );
      };

      const energyData = tmpCategories.map((displayPeriod) => {
        const actualPeriod = getMappedPeriod(displayPeriod);
        return getTotalEnergyForPeriod(actualPeriod);
      });

      const energyTargetData = tmpCategories.map((displayPeriod) => {
        const actualPeriod = getMappedPeriod(displayPeriod);
        // return getTotalTargetEnergyForPeriod(actualPeriod) / 2;
        return 0;
      });

      const series = [
        {
          name: "Actual",
          type: "column",
          data: energyData,
        },
        {
          name: "Trigger",
          type: "line",
          data: energyTargetData,
        },
      ];

      setChartSeries(series);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: categories,
        },
      }));
    }
  }, [compareLastTimePeriods, compareTCurrentimePeriods, graphData, financialYear]);

  if (!graphData || graphData.length === 0) {
    return (
      <div className="container">
        <img
          src={img}
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

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
        }}
      >
        Period-wise Water Withdrawal
      </div>
      <div style={{ height: "90%" }}>
        {chartSeries.length > 0 && chartOptions.xaxis.categories.length > 0 &&<Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={"100%"}
        />}
      </div>
    </div>
  );
};

export default SeparateWaterMultTimeMultTime;
