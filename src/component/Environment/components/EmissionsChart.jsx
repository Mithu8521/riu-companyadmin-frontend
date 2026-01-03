import React from 'react';
import Chart from 'react-apexcharts';
import ChartContainer from './ChartContainer';

const EmissionsChart = ({
  emissionData,
  isLoading,
  companyFramework,
  comparisonMode = false,
  comparisonData = null
}) => {

  // Calculate emission totals from dynamic data
  const calculateEmissionTotals = (data, framework) => {
    if (!data || Object.keys(data).length === 0) {
      return { scope1: 0, scope2: 0, total: 0 };
    }

    if (framework?.includes(1)) {
      // Framework 1 calculation
      const scope1 = data.scope1?.total || 0;
      const scope2 = data.scope2?.total || 0;
      return {
        scope1,
        scope2,
        total: scope1 + scope2
      };
    } else if (framework?.includes(48)) {
      // Framework 48 calculation
      let scope1 = 0;
      let scope2 = 0;

      if (data.scope1?.time) {
        Object.keys(data.scope1.time).forEach(location => {
          Object.keys(data.scope1.time[location]).forEach(emissionType => {
            const values = data.scope1.time[location][emissionType] || [];
            const emissionTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
            scope1 += emissionTotal;
          });
        });
      }

      if (data.scope2?.time) {
        Object.keys(data.scope2.time).forEach(location => {
          Object.keys(data.scope2.time[location]).forEach(emissionType => {
            const values = data.scope2.time[location][emissionType] || [];
            const emissionTotal = values.reduce((sum, val) => sum + (Number(val) || 0), 0);
            scope2 += emissionTotal;
          });
        });
      }

      return { scope1, scope2, total: scope1 + scope2 };
    }

    return { scope1: 0, scope2: 0, total: 0 };
  };

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
      categories: ['Scope 1 Emission', 'Scope 2 Emission', 'Total Emission'],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Emission in tCO2',
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
      colors: comparisonMode ? ['#ef4444', '#dc2626'] : ['#ef4444']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + " tCO2"
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
    }
  };

  // Prepare series data
  let series;

  if (comparisonMode && comparisonData) {
    const currentTotals = calculateEmissionTotals(emissionData, companyFramework);
    const previousTotals = calculateEmissionTotals(comparisonData.emissionData, companyFramework);

    series = [
      {
        name: 'Current Period',
        data: [currentTotals.scope1, currentTotals.scope2, currentTotals.total]
      },
      {
        name: 'Previous Period',
        data: [previousTotals.scope1, previousTotals.scope2, previousTotals.total]
      }
    ];
  } else {
    const totals = calculateEmissionTotals(emissionData, companyFramework);
    series = [{
      name: 'Emission',
      data: [totals.scope1, totals.scope2, totals.total]
    }];
  }

  return (
    <ChartContainer title="Emissions Overview" isLoading={isLoading}>
      <Chart options={chartOptions} series={series} type="bar" height={300} />
    </ChartContainer>
  );
};

export default EmissionsChart;