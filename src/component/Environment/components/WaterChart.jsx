import React from 'react';
import Chart from 'react-apexcharts';
import ChartContainer from './ChartContainer';

const WaterChart = ({
  waterData,
  isLoading,
  companyFramework,
  comparisonMode = false,
  comparisonData = null
}) => {
  console.log(waterData, "waterDatawaterDatawaterData")
  // Calculate water totals from dynamic data
  const calculateWaterTotals = (data, framework) => {
    if (!data || Object.keys(data).length === 0) {
      return { withdrawal: 0, discharge: 0, consumption: 0, totalWater: 0, treatedWater: 0 };
    }

    if (framework?.includes(1)) {
      // Framework 1 calculation - unchanged
      const withdrawal = data.withdrawal?.total || 0;
      const discharge = data.discharge?.total || 0;
      const consumption = withdrawal - discharge;

      return { withdrawal, discharge, consumption, totalWater: 0, treatedWater: 0 };
    } else if (framework?.includes(48)) {
      // Framework 48 calculation with category-wise totals
      let totalWater = 0;
      let treatedWater = 0;
      let total = 0;

      // Check if categoryWiseTotals are available (new structure)
      if (data.categoryWiseTotals) {
        const periods = Object.keys(data.categoryWiseTotals.totalWater || {});

        periods.forEach(period => {
          totalWater += data.categoryWiseTotals.totalWater?.[period] || 0;
          treatedWater += data.categoryWiseTotals.treatedWater?.[period] || 0;
        });

        total = totalWater + treatedWater;
      } else if (data.time) {
        // Fallback to old calculation method
        const totalWaterTypes = [
          "Total Groundwater consumption* ( in KL)",
          "Total Tanker Water Consumption* (in KL)",
          "Total surface water consumption (this includes municipal supply water)* ( in KL)"
        ];

        const treatedWaterTypes = [
          "Total Wastewater treated(STP/ETP)* ( in KL)"
        ];

        Object.keys(data.time).forEach(location => {
          Object.keys(data.time[location]).forEach(waterType => {
            const values = data.time[location][waterType] || [];
            const waterTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

            if (totalWaterTypes.includes(waterType)) {
              totalWater += waterTotal;
            } else if (treatedWaterTypes.includes(waterType)) {
              treatedWater += waterTotal;
            }
            total += waterTotal;
          });
        });
      }

      return {
        withdrawal: totalWater, // For backward compatibility
        discharge: treatedWater, // For backward compatibility
        consumption: totalWater - treatedWater, // Net water consumption
        totalWater,
        treatedWater
      };
    }

    return { withdrawal: 0, discharge: 0, consumption: 0, totalWater: 0, treatedWater: 0 };
  };

  const getChartConfiguration = (framework) => {
    if (framework?.includes(48)) {
      // Framework 48 - Show 3 categories
      return {
        categories: ['Total Water Consumption', 'Treated Water', 'Net Water Usage'],
        colors: comparisonMode ? ['#0ea5e9', '#10b981', '#8b5cf6'] : ['#0ea5e9', '#10b981', '#8b5cf6'],
        dataExtractor: (totals) => [totals.totalWater, totals.treatedWater, totals.consumption]
      };
    } else {
      // Framework 1 - Show 3 categories (unchanged)
      return {
        categories: ['Water Withdrawal', 'Water Discharged', 'Water Consumption'],
        colors: comparisonMode ? ['#14b8a6', '#0d9488', '#06b6d4'] : ['#14b8a6', '#0d9488', '#06b6d4'],
        dataExtractor: (totals) => [totals.withdrawal, totals.discharge, totals.consumption]
      };
    }
  };

  const config = getChartConfiguration(companyFramework);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: comparisonMode ? '60%' : '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: config.categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        },
        rotate: companyFramework?.includes(48) ? -45 : 0 // Rotate labels for Framework 48
      }
    },
    yaxis: {
      title: {
        text: 'Water in KL',
        style: {
          fontSize: '12px',
          color: '#6b7280'
        }
      },
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
        formatter: (val) => Math.round(val) // no decimals
      }
    },
    fill: {
      opacity: 1,
      colors: comparisonMode ?
        (config.colors.map(color => color + 'CC')) : // Add transparency for comparison mode
        config.colors
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + " KL"
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3
    },
    legend: {
      show: comparisonMode,
      position: 'top',
      horizontalAlign: 'right'
    },
    // Add custom colors for each series in comparison mode
    colors: comparisonMode ? ['#14b8a6', '#0d9488'] : config.colors
  };

  // Prepare series data
  let series;

  if (comparisonMode && comparisonData) {
    const currentTotals = calculateWaterTotals(waterData, companyFramework);
    const previousTotals = calculateWaterTotals(comparisonData.waterData, companyFramework);

    series = [
      {
        name: 'Current Period',
        data: config.dataExtractor(currentTotals)
      },
      {
        name: 'Previous Period',
        data: config.dataExtractor(previousTotals)
      }
    ];
  } else {
    const totals = calculateWaterTotals(waterData, companyFramework);
    series = [{
      name: 'Water',
      data: config.dataExtractor(totals)
    }];
  }

  const getChartTitle = () => {
    if (companyFramework?.includes(48)) {
      return "Water Management Overview";
    }
    return "Water Management Overview";
  };

  return (
    <ChartContainer title={getChartTitle()} isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

export default WaterChart;