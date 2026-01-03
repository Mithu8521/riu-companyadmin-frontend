import React from 'react';
import Chart from 'react-apexcharts';
import ChartContainer from './ChartContainer';

const EnergyChart = ({
  energyData,
  isLoading,
  companyFramework,
  comparisonMode = false,
  comparisonData = null,
}) => {
  const unit = companyFramework?.includes(48) ? 'kWh' : 'GJ';
  const calculateEnergyTotals = (data, framework) => {
    if (!data || Object.keys(data).length === 0) {
      return { renewable: 0, nonRenewable: 0, fuel: 0, electricity: 0, total: 0 };
    }

    if (framework?.includes(1)) {
      const renewable = data.renewable?.total || 0;
      const nonRenewable = data.nonRenewable?.total || 0;
      return {
        renewable,
        nonRenewable,
        total: renewable + nonRenewable
      };
    } else if (framework?.includes(48)) {
      let electricity = 0;
      let renewable = 0;
      let total = 0;

      if (data.categoryWiseTotals) {
        const periods = Object.keys(data.categoryWiseTotals.fuel || {});

        periods.forEach(period => {
          electricity += data.categoryWiseTotals.electricity?.[period] || 0;
          renewable += data.categoryWiseTotals.renewable?.[period] || 0;
        });

        total = electricity + renewable;
      } else if (data.time) {
        const electricityTypes = [
          "GRID electricity",
          "Electricity Power plant (Captive Power Plant - Natural Gas)",
          "Electricity consumption through DG"
        ];

        const renewableTypes = [
          'Electricity consumption from Renewable energy (via PPA)',
          'Electricity consumption from Renewable energy (rooftop solar)'
        ];

        Object.keys(data.time).forEach(location => {
          Object.keys(data.time[location]).forEach(fuelType => {
            const values = data.time[location][fuelType] || [];
            const fuelTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

            if (renewableTypes.includes(fuelType)) {
              renewable += fuelTotal;
            } else if (electricityTypes.includes(fuelType)) {
              electricity += fuelTotal;
            }
            total += fuelTotal;
          });
        });
      }

      return {
        renewable,
        nonRenewable: electricity, // Combined for backward compatibility
        electricity,
        total
      };
    }

    return { renewable: 0, nonRenewable: 0, fuel: 0, electricity: 0, total: 0 };
  };

  const getChartConfiguration = (framework) => {
    if (framework?.includes(48)) {
      // Framework 48 - Show 4 categories
      return {
        categories: ['Electricity', 'Renewable Energy', 'Total Energy Consumption'],
        colors: comparisonMode ? ['#dc2626', '#f59e0b', '#10b981', '#3b82f6'] : ['#dc2626', '#f59e0b', '#10b981', '#3b82f6'],
        dataExtractor: (totals) => [totals.electricity, totals.renewable, totals.total]
      };
    } else {
      // Framework 1 - Show 3 categories
      return {
        categories: ['Renewable Energy', 'Non-Renewable Energy', 'Total Energy Consumption'],
        colors: comparisonMode ? ['#10b981', '#dc2626', '#3b82f6'] : ['#10b981', '#dc2626', '#3b82f6'],
        dataExtractor: (totals) => [totals.renewable, totals.nonRenewable, totals.total]
      };
    }
  };

  const config = getChartConfiguration(companyFramework);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: comparisonMode ? '60%' : '55%',
        borderRadius: 4
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: config.categories,
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
        rotate: companyFramework?.includes(48) ? -45 : 0
      }
    },
    yaxis: {
      title: {
        text: `Energy in ${unit}`,
        style: { fontSize: '12px', color: '#6b7280' }
      },
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
        formatter: (val) => Math.round(val) // no decimals
      }
    },
    fill: {
      opacity: 1,
      colors: comparisonMode ?
        (config.colors.map(color => color + 'CC')) :
        config.colors
    },
    tooltip: {
      y: {
        formatter: (val) => Number(val).toFixed(2)
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
    colors: comparisonMode ? ['#3b82f6', '#1e40af'] : config.colors
  };

  let series;

  if (comparisonMode && comparisonData) {
    const currentTotals = calculateEnergyTotals(energyData, companyFramework);
    const previousTotals = calculateEnergyTotals(comparisonData.energyData, companyFramework);

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
    const totals = calculateEnergyTotals(energyData, companyFramework);
    series = [
      {
        name: 'Energy',
        data: config.dataExtractor(totals)
      }
    ];
  }

  // Generate title based on framework
  const getChartTitle = () => {
    if (companyFramework?.includes(48)) {
      return "Electricity Consumption Overview";
    }
    return "Energy Consumption Overview";
  };

  return (
    <ChartContainer title={getChartTitle()} isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />

    </ChartContainer>
  );
};

export default EnergyChart;