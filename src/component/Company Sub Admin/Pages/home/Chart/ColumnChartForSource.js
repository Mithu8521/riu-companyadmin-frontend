import React, { useEffect, useState, useRef } from 'react';
import Chart from 'react-apexcharts';

const CustomBarChart = (props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    series: [{
      name: 'PRODUCT A',
      data: [44, 55, 41, 67, 22, 43, 21, 49]
    }, {
      name: 'PRODUCT B',
      data: [13, 23, 20, 8, 13, 27, 33, 12]
    }, {
      name: 'PRODUCT C',
      data: [11, 17, 15, 15, 21, 14, 15, 13]
    }],
    options: {
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%',
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false // Disable the export menu
        }
      },
      colors: ['#59A8AE', '#5A7782', '#B6E0F1', '#A6B1B5', '#A4D2B1'],
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      xaxis: {
        categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'],
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50
      },
      plotOptions: {
        bar: {
          columnWidth: '30px' // Custom column width
        }
      }
    }
  });
  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
      if (props?.chartData?.series) {
        const newChartData = { ...props.chartData };
        newChartData.options.colors = ['#59A8AE', '#5A7782', '#B6E0F1', '#A6B1B5', '#A4D2B1'];
        const numColumns = props?.chartData.series.length;
        const columnWidth = parseInt(
          props?.chartData.options.plotOptions.bar.columnWidth
        );
        const categories = props?.chartData.options.xaxis.categories.length;
        newChartData.options.chart.toolbar = { show: false };

        newChartData.options.plotOptions.bar.columnWidth = "35px";
        newChartData.options.yaxis = {
          min: 0,
          max: 100,
          tickAmount: 4,
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
            style: {
              colors: '#7B91B0' // Set the color for y-axis labels
            }
          },

        };

        newChartData.options.xaxis.labels = {
          style: {
            colors: '#7B91B0' // Set the color for x-axis labels
          }
        };

        setChartData(newChartData);

        if (chartRef.current) {
          chartRef.current.style.width =
            numColumns * columnWidth * categories > 820
              ? `${numColumns * columnWidth * categories}px`
              : "100%";
        }
      }
    }
  }, [props]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%', marginBottom: "-50px", overflow: "auto" }}>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default CustomBarChart;

