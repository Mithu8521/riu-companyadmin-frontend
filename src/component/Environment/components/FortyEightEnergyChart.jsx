import React from 'react';
import Chart from 'react-apexcharts';
import ChartContainer from './ChartContainer';

const FortyEightEnergyChart = ({ 
  energyData, 
  isLoading, 
  companyFramework,
  comparisonMode = false,
  comparisonData = null 
}) => {
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
      let fuel = 0;
      let total = 0;

      if (data.categoryWiseTotals) {
        const periods = Object.keys(data.categoryWiseTotals.fuel || {});
        
        periods.forEach(period => {
          fuel += data.categoryWiseTotals.fuel?.[period] || 0;
        });
        
        total = fuel ;
      } else if (data.time) {
        const fuelTypes = [
          "Diesel", "Petrol", "CNG", "PNG", "LPG",
        ];
        
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
          if (fuelTypes.includes(fuelType)) {
              fuel += fuelTotal;
            }
            total += fuelTotal;
          });
        });
      }

      return { 
        fuel,
        total 
      };
    }

    return { renewable: 0, nonRenewable: 0, fuel: 0, electricity: 0, total: 0 };
  };

  const getChartConfiguration = (framework) => {
    if (framework?.includes(48)) {
      // Framework 48 - Show 4 categories
      return {
        categories: ['Fuel','Total Energy Consumption'],
        colors: comparisonMode ? ['#dc2626', '#f59e0b', '#10b981', '#3b82f6'] : ['#dc2626', '#f59e0b', '#10b981', '#3b82f6'],
        dataExtractor: (totals) => [totals.fuel,totals.total]
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
        text: 'Energy in GJ',
        style: { fontSize: '12px', color: '#6b7280' }
      },
      labels: {
        style: { fontSize: '12px', colors: '#6b7280' },
        formatter: (val) => Math.round(val)
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
        formatter: (val) => val.toLocaleString() + " GJ" 
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

  const getChartTitle = () => {
    if (companyFramework?.includes(48)) {
      return "Fuel Energy Consumption Overview";
    }
    return "Energy Consumption Overview";
  };

  return (
    <ChartContainer title={getChartTitle()} isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

export default FortyEightEnergyChart;