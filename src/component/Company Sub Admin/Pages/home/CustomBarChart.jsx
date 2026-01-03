import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const CustomBarChart = ({ options, series, questionIds, selectedCategory }) => {

  const onSelect = (config) => {

    if (config.dataPointIndex === 0) {
      localStorage.setItem('questionIds', questionIds[selectedCategory].
        answeredQuestionIds
      );
      window.location.href = '/#/sector_questions';
    } else if (config.dataPointIndex === 1) {
      localStorage.setItem('questionIds', questionIds[selectedCategory].
        acceptedQuestionIds
      );
      window.location.href = '/#/sector_questions';
    } else if (config.dataPointIndex === 2) {
      localStorage.setItem('questionIds', questionIds[selectedCategory].
        rejectedQuestionIds
      );
      window.location.href = '/#/sector_questions';
    } else if (config.dataPointIndex === 3) {
      localStorage.setItem('questionIds', questionIds[selectedCategory].
        notRespondedQuestionId
      );
      window.location.href = '/#/sector_questions';
    }



  }



  const chartOptions = {
    ...options,
    colors: ["#11546f", "#3F88A5", "#3ABEC7", "#6fa8dc"], // Set the colors
    chart: {
      ...options?.chart,
      width: "100%",
      toolbar: {
        show: false, // Hide the toolbar
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onSelect(config);
        },
      },
    },
    plotOptions: {
      ...options?.plotOptions,
      bar: {
        ...options?.plotOptions.bar,
        columnWidth: "60px", // Set the bar width to 40%

      },
    },
    xaxis: {
      ...options?.xaxis,
      labels: {
        ...options?.xaxis.labels,
        style: {
          ...options?.xaxis.labels.style,
          colors: ["#11546f", "#3F88A5", "#3ABEC7", "#6fa8dc"], // Set the colors for the legend on x-axis
        },
      },
    },
  };
  const seriestemp = [
    {
      name: 'Series 1',
      data: [100, 0, 0, 0]
    }
  ];
  return (
    <div style={{ width: "100%" }}>
      <ReactApexChart options={chartOptions} series={seriestemp} type="bar" height={300} />
    </div>
  );
};

export default CustomBarChart;


