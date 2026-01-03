import { dark } from "@material-ui/core/styles/createPalette";

export const ColumnChartDataForQuestionType = async (
  series,
  categories,
  stacked,
  enabled,
  unit,
  color
) => {

  const onSelect = (data) => {
    const questionIds = [data?.questionId];
    localStorage.setItem('questionIds', questionIds);
    window.location.href = '/#/sector_questions';
  };
  const allZeroes = series.every(series => series.data.every(value => value === 0));

  let chartSeries;
  if (allZeroes) {
    chartSeries = series.map(({ name }) => ({
      name: name,
      data: [1]
    }));
  } else {
    chartSeries = series;
  }
  const chartData = {
    series: chartSeries,
    options: {
      ...(allZeroes ? { colors: ['#e9ecef'] } : { colors: color }),
      chart: {
        toolbar: {
          show: true,
          download: true
        },
        type: allZeroes ? "line" : "bar",
        height: 350,
        stacked: allZeroes ? false : stacked,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const seriesIndex = config.seriesIndex;
            onSelect(series[seriesIndex]);
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '54.%',

          // dataLabels: {
          //   position: 'top', // top, center, bottom
          // },
        },
      },
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },

      yaxis: {
        title: {
          text: unit ? unit : "Pecentage",
        },
      },
      fill: {
        opacity: 1,
      },

      tooltip: {

        y: {
          formatter: function (val) {
            return `${val} ${unit ? unit : "Percentage"}`;
          },
        },
        enabled: allZeroes ? false : true,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "left",
      },
    },
  };
  return chartData;
};


export const ColumnChartDataForQuestionTypess = async (
  series,
  categories,
  stacked,
  enabled,
  unit
) => {

  const onSelect = (data) => {
    const questionIds = [data?.questionId];
    localStorage.setItem('questionIds', questionIds);
    window.location.href = '/#/sector_questions';

  };
  const allZeroes = series.every(series => series.data.every(value => value === 0));

  let chartSeries;
  if (allZeroes) {
    chartSeries = series.map(({ name }) => ({
      name: name,
      data: [1]
    }));
  } else {
    chartSeries = series;
  }
  const chartData = {
    series: chartSeries,
    options: {
      ...(allZeroes ? { colors: ['#e9ecef'] } : {}),
      chart: {
        toolbar: {
          show: true,
          download: true
        },
        type: allZeroes ? "line" : "bar",
        height: 350,
        stacked: allZeroes ? false : stacked,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const seriesIndex = config.seriesIndex;
            onSelect(series[seriesIndex]);
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      dataLabels: {
        enabled: allZeroes ? false : enabled,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '46%',

          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },

      yaxis: {
        title: {
          text: unit ? unit : "Pecentage",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " " + unit;
          },
        },
        x: { show: false },
        enabled: allZeroes ? false : true,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "left",
      },
    },
  };
  return chartData;
};
export const RadioBarChartData = async (level, series, color, questionsIds, disableToolbar) => {
  const onSelect = (index) => {
    const questionId = questionsIds[index];
    localStorage.setItem('questionIds', questionId);
    window.location.href = '/#/sector_questions';
  };
  const chartData = {
    series: series,
    options: {
      chart: {
        height: 1000,
        type: "radialBar",
        toolbar: {
          show: !disableToolbar,
          download: !disableToolbar
        },
        offsetY: -10,
        margin: {
          bottom: 10
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const seriesIndex = config.dataPointIndex;
            onSelect(seriesIndex);
          },
        },
      },
      colors: color,
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: '20%',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,

            }
          },
          track: {
            strokeWidth: '90%',
          },
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: false,
              // label: "",
              formatter: function (w) {
                return (
                  (w.globals.series.reduce((a, b) => a + b, 0) / 1).toFixed(0) +
                  "%"
                );
              },
            },

          },
        },
      },
      labels: level,
      legend: {
        show: true,
        position: "bottom",
        offsetY: -27,
      },

    },
  };
  return chartData;
};

export const ColumnChartData = async (level, series) => {
  const chartData = {

    series: series,
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          download: true
        },
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: ['#33cc33', '#0066cc', '#ff5050', '#ffff66'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,

          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: level,
        labels: {
          style: {
            colors: ['#33cc33', '#0066cc', '#ff5050', '#ffff66'],
            fontSize: '12px'
          }
        }
      }
    },
  }
  return chartData;
};
export const ColumnChartDataForTraining = async (level, series, color, unit, percentagedata, maximum) => {
  const chartData = {

    series: series,
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          download: true
        },
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: color,
      plotOptions: {
        bar: {
          columnWidth: '70px',
          distributed: true,
          borderRadius: 10,
          borderRadiusApplication: 'around', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        horizontal: false,
        columnWidth: '70px',

        formatter: function (val) {
          return percentagedata ? percentagedata[val] + "%" : val + unit;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: color
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return percentagedata ? val + " " + "(" + percentagedata[val] + "%)" : val + unit;
          }
        }
      },

      yaxis: maximum ? {
        title: {
          text: unit ? unit : "Pecentage",
        },
        min: 0,
        max: maximum + 5
      } : {
        title: {
          text: unit ? unit : "Pecentage",
        }
      },
      xaxis: {
        categories: level,
        labels: {
          style: {
            colors: color,
            fontSize: '12px'
          }
        }
      }
    },
  }
  return chartData;
};
export const ColumnChartDataForSource = async (teamWorkloadResults, series) => {
  const chartData = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          download: true
        },
        zoom: {
          enabled: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      dataLabels: {
        enabled: false, // Disable data labels
      },
      plotOptions: {
        bar: {
          horizontal: false,

          // dataLabels: {
          //   enabled: false,
          // },

          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      xaxis: {
        categories: teamWorkloadResults.map(
          (user) => `${user?.firstName} ${user?.lastName}`
        ),
      },
      yaxis: {
        labels: {
          formatter: (value) => `${value}%`, // Display percentages on the y-axis
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "bottom",
        offsetY: 40,
      },
      tooltip: {
        y: {
          formatter: (value) => `${value}%`, // Display percentages in the tooltip
        },
      },
    },
  };

  return chartData;
};
export const BarChartDataForQuestionType = async (series, categories, unit) => {
  const chartData = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 430,
        stacked: true,
        toolbar: {
          show: true,
          download: true
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: false,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: categories,
        title: {
          text: unit ? unit : "Pecentage",
        },
      },
      // yaxis: {
      //   title: {
      //     text: unit,
      //   },
      // },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " " + unit;
          },
        },
        x: { show: false },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "left",
      },
    },
  };
  return chartData;
};
export const BarChartDataForSource = async (
  teamWorkloadResults,
  filteredSeries
) => {
  const chartData = {
    series: filteredSeries,
    options: {
      chart: {
        type: "bar",
        height: 500,
        stacked: true,
        toolbar: {
          show: true,
          download: true
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },

      xaxis: {
        categories: teamWorkloadResults.map(
          (user) => `${user?.firstName} ${user?.lastName}`
        ),
      },
      yaxis: {
        labels: {
          formatter: (value) => `${value}`,
        },
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    },
  };

  return chartData;
};
export const BarChartData = async (level, series) => {
  const chartData = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 500,
        toolbar: {
          show: true,
          download: true
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "45%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      // title: {
      //   text: "Bar View",
      // },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: level,
        title: {
          text: "% (Percentage)",
        },
      },
    },
  };
  return chartData;
};
export const PieChartData = async (series, level, type, unit, color, questionIds) => {
  const onSelect = () => {
    localStorage.setItem('questionIds', questionIds);
    window.location.href = '/#/sector_questions';
  };
  const chartData = {
    series: series,
    options: {
      chart: {
        width: 380,
        type: type,
        toolbar: {
          show: true,
          download: true
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            onSelect();
          },
        },
      },
      colors: color,
      labels: level,
      legend: {
        show: false
      },
      stroke: {
        curve: 'straight'
      },
      plotOptions: {
        bar: {
          columnWidth: '70px',
          barWidth: '26%',
          endingShape: 'rounded'
        },
      },
      yaxis: {
        title: {
          text: unit ? unit : "Pecentage",
        },
      },



      tooltip: {

        y: {
          formatter: function (val) {
            return `${val} ${unit ? unit : "Percentage"}`;
          },
        },
        // enabled: allZeroes ? false: true, 
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false,
            position: 'bottom'
          }
        }
      }]
    },

  };
  return chartData;
};
export const ProductsPieChartData = async (series, level, type, unit, color, questionIds, differentBar, opacity, percentagedata, stacked, dataLevel, ofsetY, percentageShow, gaps, numberouter, grouped, notAllRadious) => {
  const onSelect = () => {
    localStorage.setItem('questionIds', questionIds);
    window.location.href = '/#/sector_questions';
  };
  const allZero = series.every(value => value === 0);
  const sum = typeof series[0] !== 'object' && series.reduce((acc, value) => {
    if (typeof value !== 'object') {
      return acc + value;
    } else {
      return acc;
    }
  }, 0);
  if (grouped) {

  }
  const seriess = typeof series[0] !== 'object' && allZero ? series.map(value => 10) : series;
  const colors = allZero ? ['#e9ecef'] : color;
  const calculatePercentage = (values) => {
    if (values) {
      const val = Number(values);
      if (!isNaN(val)) {
        const roundedVal = Number(Math.round(val));
        return percentagedata[roundedVal];
      }
    }
    return undefined; // Or handle this case appropriately
  };
  const chartData = {
    series: seriess,
    options: {
      chart: {
        width: 380,
        type: 'pie', // Update this to 'bar' if you are creating a bar chart
        stacked: stacked,
        toolbar: {
          show: true,
          download: true
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            onSelect();
          },
        },
      },
      labels: !differentBar ? level : {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
      },
      fill: {
        type: 'solid',
        opacity: opacity || [1, 1, 1, 1, 1, 1, 1, 1, 1],
      },
      stroke: gaps ? {
        show: true,
        curve: 'smooth',
        width: 5,
        colors: ['transparent'],
        dashArray: Array(20).fill(0)
      } : {
        show: true,
        curve: 'smooth',
        width: 5,
        dashArray: Array(20).fill(0)
      },
      colors: colors,

      dataLabels: numberouter ? {
        enabled: percentagedata || dataLevel ? true : (allZero || sum == 0) ? stacked ? true : false : true,
        formatter: function (val) {
          const values = ((val * sum) / 100).toFixed(2);
          return percentagedata ? percentagedata[val] + "%" : stacked || dataLevel ? !percentageShow ? val : val + "%" : values;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: color
        }
      } : {
        enabled: percentagedata || dataLevel ? true : (allZero || sum == 0) ? stacked ? true : false : true,
        formatter: function (val) {
          const values = ((val * sum) / 100).toFixed(2);
          // return percentagedata[val];
          return grouped ? percentagedata[val] + "%" : ((type === 'pie' || type === 'donut') && percentagedata) ? calculatePercentage(values) + "%" : percentagedata ? Number(percentagedata[val]).toFixed(2) + "%" : stacked || dataLevel ? !percentageShow ? val : val + "%" : values;
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: true,
            position: "",
            horizontalAlign: "left",
          }
        }
      }],
      yaxis: {
        title: {
          text: unit ? unit : "Percentage",
        },

        // min: 0,
        // max: math5
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return percentagedata ? val + " (" + Number(percentagedata[val]).toFixed(2) + "%)" : val + " " + unit;
          },
        },
      },
      plotOptions: {
        bar: {

          horizontal: false,
          columnWidth: grouped ? `${series.length * 60}px` : '70px',
          borderRadius: 10,
          borderRadiusApplication: 'end', // 'around', 'end'
          // borderRadiusWhenStacked: notAllRadious ? 'last':'all', // 'all', 'last'
          borderRadiusWhenStacked: 'last',

          dataLabels: {
            total: {
              enabled: grouped ? false : true,
              formatter: function (val) {
                if (val === 0) {
                  return; // Do not display the label if the total is zero
                }
                return val.toFixed(0); // Format the total to 2 decimal places
              },
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            },
            position: stacked ? 'center' : 'top', // top, center, bottom
          },
        },
        pie: {
          customScale: 1,
        },
      },
    }
  };
  return chartData;
};


export const ProductsScaterChartData = async (series, level, unit) => {
  // const seriesWithGap = series.map(serie => [{name: '', data: []}, ...serie]);

  const chartData = {
    series: series,
    options: {
      chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        },
        toolbar: {
          show: true,
          download: true
        },
      },
      xaxis: {
        categories: [''].concat(level),
      },
      yaxis: {
        title: {
          text: unit ? unit : "Pecentage",
        },
      },


      tooltip: {

        y: {
          formatter: function (val) {
            return `${val} ${unit ? unit : "Percentage"}`;
          },
        },
        // enabled: allZeroes ? false: true, 
      },
      // yaxis: {
      //   min: 200, 
      //   // tickAmount: 3, 
      //   labels: {
      //     formatter: function (value) {
      //       return value; // Keep labels as they are
      //     }
      //   }
      // },
      yaxis: {
        tickAmount: 3
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "left",
      },
    },
  };
  return chartData;
};
export const LineChartData = async (series, level, unit) => {
  const chartData = {
    series: series,
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: true,
          download: true
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 5,
        dashArray: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      title: {
        title: {
          text: '',
          align: 'left',
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '70px' // Adjust the column width as needed
        }
      },
      yaxis: {
        title: {
          text: unit ? unit : "Pecentage",
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val
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
      animations: {
        enabled: true, // Enable animations
        easing: 'linear', // Animation easing type
        dynamicAnimation: {
          speed: 1000 // Speed of dynamic animations
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: level,
      },
    },
  };

  return chartData;
};









