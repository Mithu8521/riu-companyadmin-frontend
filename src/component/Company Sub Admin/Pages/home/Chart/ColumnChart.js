import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "react-apexcharts";

const ColumnChart = (props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },

    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",

        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      // title: {
      //   text: 'Column View',
      // },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });
  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
      if (props?.chartData?.series) {
        const newChartData = { ...props.chartData };
        const numColumns = props?.chartData.series.length;
        const columnWidth = parseInt(
          props?.chartData.options.plotOptions.bar.columnWidth
        );
        const categories = props?.chartData.options.xaxis.categories.length;
        console.log(numColumns, categories,)
        if (numColumns * categories < 22 && numColumns > 5) {
          newChartData.options.plotOptions.bar.columnWidth = "30px";

          setChartData(newChartData);
        } else if (numColumns * categories < 100 && numColumns > 3) {
          newChartData.options.plotOptions.bar.columnWidth = "53%";

          setChartData(newChartData);
        } else {
          newChartData.options.plotOptions.bar.columnWidth = "30px";

          setChartData(newChartData);
        }

        if (chartRef.current) {
          chartRef.current.style.width =
            numColumns * columnWidth * categories > 820
              ? `${numColumns * columnWidth * categories}px`
              : "820px";
        }
      }
    }
  }, [props]);

  return (
    <div style={{ overflowX: "auto", width: "100%", minWidth: "100%" }}>
      <div ref={chartRef}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={435}
        />
      </div>
    </div>
  );
};

export default ColumnChart;
