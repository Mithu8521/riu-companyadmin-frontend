import React from "react";
import noDataImage from "../../../img/no.png";
import Chart from "react-apexcharts";

const EnergyConsumptionChart = ({
  totalConsumptionRenewable,
  totalConsumptionNonRenewable,
  renewableTiggerValue,
  nonRenewableTiggerValue
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

  const maxConsumption = Math.max(totalConsumptionRenewable, totalConsumptionNonRenewable);
  const yAxisMax = maxConsumption + 10000;

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

    if (yAxisMax === 0) return { roundedMax: 1, step: 1 };

    const magnitude = Math.pow(10, Math.floor(Math.log10(yAxisMax)));

    if (yAxisMax <= 10) {
      roundedMax = Math.ceil(yAxisMax);
      step = 1;
    } else if (yAxisMax <= 100) {
      roundedMax = Math.ceil(yAxisMax / 10) * 10;
      step = 10;
    } else if (yAxisMax <= 1000) {
      roundedMax = Math.ceil(yAxisMax / 100) * 100;
      step = 100;
    } else {
      roundedMax = Math.ceil(yAxisMax / magnitude) * magnitude;
      step = magnitude;
    }

    return { roundedMax, step };
  };

  const yAxisConfig = (yAxisMax) => {
    const { roundedMax, step } = getRoundedMaxAndStep(yAxisMax);

    const tickAmount = Math.ceil(roundedMax / step);

    return {
      labels: {
        formatter: function (value) {
          if (value >= 1e6) {
            return `${(value / 1e6).toFixed(0)} M`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(0)} K`;
          } else {
            return Math.round(value);
          }
        },
        style: {
          colors: '#575757',
          fontSize: '13px',
          fontFamily: 'Poppins',
          fontWeight: 700,
        },
      },
      min: 0,
      max: roundedMax,
      tickAmount: tickAmount,
      title: {
        text: "Energy in GJ",
        style: {
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'Poppins',
          color: '#575757',
        },
      },
    };
  };

  // Get the latest trigger values
  const latestRenewableTrigger = renewableTiggerValue?.[renewableTiggerValue.length - 1];
  const latestNonRenewableTrigger = nonRenewableTiggerValue?.[nonRenewableTiggerValue.length - 1];

  const annotations = {
    yaxis: [
      ...(latestRenewableTrigger
        ? [
            {
              y: latestRenewableTrigger.minTriggerValue,
              borderColor: "#3F822B",
              label: {
                text: "Renewable Min",
                style: {
                  color: "#fff",
                  background: "#3F822B",
                  fontFamily: 'Poppins',
                },
              },
            },
            {
              y: latestRenewableTrigger.maxTriggerValue,
              borderColor: "#3F822B",
              label: {
                text: "Renewable Max",
                style: {
                  color: "#fff",
                  background: "#3F822B",
                  fontFamily: 'Poppins',
                },
              },
            },
          ]
        : []),
      ...(latestNonRenewableTrigger
        ? [
            {
              y: latestNonRenewableTrigger.minTriggerValue,
              borderColor: "#808080",
              label: {
                text: "Non-Renewable Min",
                style: {
                  color: "#fff",
                  background: "#808080",
                  fontFamily: 'Poppins',
                },
              },
            },
            {
              y: latestNonRenewableTrigger.maxTriggerValue,
              borderColor: "#808080",
              label: {
                text: "Non-Renewable Max",
                style: {
                  color: "#fff",
                  background: "#808080",
                  fontFamily: 'Poppins',
                },
              },
            },
          ]
        : []),
    ],
  };

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
          position: "center",
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
      offsetY: -20,
      style: {
        fontSize: "16px",
        colors: ["#fff"],
        fontWeight: 700,
        fontFamily: 'Poppins',
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Renewable Energy", "Non-Renewable Energy"],
      labels: {
        style: {
          colors: '#575757',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'Poppins',
        },
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#78909C',
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: yAxisConfig(yAxisMax),
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatNumberWithIndianCommas(val);
        },
      },
    },
    colors: ["#3F822B", "#808080"],
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 2,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    legend: {
      show: false,
    },
    annotations, // Add dynamic markers here
  };

  const chartSeries = [
    {
      name: "Energy Consumption",
      data: [totalConsumptionRenewable, totalConsumptionNonRenewable],
    },
  ];

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ fontSize: "18px", fontWeight: 600, height: "10%" }}>
        Renewable & Non-Renewable Energy Consumption
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
