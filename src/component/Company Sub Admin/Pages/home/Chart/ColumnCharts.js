import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnsChart = (props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
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
        const columnWidth = parseInt(props?.chartData.options.plotOptions.bar.columnWidth);
        const categories = props?.chartData.options.xaxis.categories.length;
        if (numColumns * categories < 50) {
          newChartData.options.plotOptions.bar.columnWidth = "60px";
          setChartData(newChartData);
        } else {
          newChartData.options.plotOptions.bar.columnWidth = "60px";
          setChartData(newChartData);
        }

        console.log(numColumns, columnWidth, categories);
        if (chartRef.current) {
          chartRef.current.style.width = numColumns * columnWidth * categories > 820 ? `${numColumns * columnWidth * categories}px` : '820px';
        }
      }
    }
  }, [props]);


  return (
    <div style={{ overflowX: 'auto', width: '100%', minWidth: '100%' }}>
      <div ref={chartRef}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={420}
        />
      </div>
    </div>
    // <div id="chart">
    //   <ReactApexChart
    //     options={chartData.options}
    //     series={chartData.series}
    //     type="bar"
    //     height={420}
    //   />
    // </div>
  );
};

export default ColumnsChart;
