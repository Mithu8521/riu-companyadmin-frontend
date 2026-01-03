import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineCharts = (props) => {
  const [chartData, setChartData] = useState({
    series: [

      {
        "name": "2022-2023(Q1)",
        "data": [
          320,
          350,
          390,
          400,
          320,
          420,
          420,
          450,
          450,
          500,
          490,
          498
        ]
      },
      {
        "name": "2022-2023(Q2)",
        "data": [
          310,
          330,
          350,
          370,
          282,
          400,
          390,
          430,
          420,
          480,
          470,
          462
        ]
      },
      {
        "name": "2022-2023(Q3)",
        "data": [
          300,
          320,
          330,
          350,
          303,
          380,
          370,
          400,
          400,
          460,
          453,
          442
        ]
      },
      {
        "name": "2022-2023(Q4)",
        "data": [
          280,
          310,
          310,
          320,
          272,
          350,
          350,
          350,
          380,
          440,
          413,
          410
        ]
      },
      {
        "name": "2023-2024(Q1)",
        "data": [
          300,
          254,
          300,
          300,
          300,
          350,
          360,
          370,
          370,
          450,
          400,
          330
        ]
      },
      {
        "name": "2023-2024(Q2)",
        "data": [
          290,
          230,
          281,
          280,
          0,
          340,
          330,
          350,
          340,
          430,
          380,
          300
        ]
      },
      {
        "name": "2023-2024(Q3)",
        "data": [
          292,
          210,
          260,
          250,
          250,
          320,
          300,
          330,
          330,
          400,
          350,
          285
        ]
      },
      {
        "name": "2023-2024(Q4)",
        "data": [
          270,
          200,
          240,
          230,
          239,
          310,
          280,
          300,
          320,
          380,
          330,
          265
        ]
      }

    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'Page Statistics',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: [

          "Bituminous Coal",
          "Fuel Oil",
          "Diesel",
          "Biomass Briquettes",
          "Rice Husk",
          "LPG",
          "Petrol",
          "CNG",
          "PNG",
          "Electricity from Grid",
          "On-site Renewable Electricity",
          "Off-site Renewable Electricity"

        ],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)"
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session"
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    },
  });

  useEffect(() => {
    if (props?.chartData) {
      setChartData(props?.chartData);
    }
  }, [props]);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type={props.type}
        height={440}
      />
    </div>
  );
};

export default LineCharts;
