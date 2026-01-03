import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const CoverageGraph = ({ traineeList, trainingData, trainingDataForPreviousYear,financialYear }) => {
  const [chartData, setChartData] = useState({ series: [], options: {} });

  const categorizeEmployee = (user) => {
    const category = user?.categoryId?.toLowerCase();
    if (!category) return '';
    if (category.includes('worker')) return 'Worker';
    return 'Employee';
  };

  const buildAnalysis = (data, traineeList) => {
    const total = {
      Employees: traineeList.filter(user =>
        user?.categoryId?.toLowerCase()
          .includes('employee','bod','kmp')
      ),
      Workers: traineeList.filter(user =>
        user?.categoryId?.toLowerCase().includes('worker')
      )
    };

    const analysis = {
      'Employee Health & Safety': { attended: new Set(), total: total.Employees.length },
      'Employee Skill Development': { attended: new Set(), total: total.Employees.length },
      'Worker Health & Safety': { attended: new Set(), total: total.Workers.length },
      'Worker Skill Development': { attended: new Set(), total: total.Workers.length }
    };

    data.forEach(training => {
      const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
      if (!trainingCategoryIds.includes(1) && !trainingCategoryIds.includes(2)) return;

      training.attendantUsers?.forEach(user => {
        const group = categorizeEmployee(user);
        if (trainingCategoryIds.includes(1)) {
          const key = `${group} Health & Safety`;
          if (analysis[key]) analysis[key].attended.add(user.employeeId);
        }

        if (trainingCategoryIds.includes(2)) {
          const key = `${group} Skill Development`;
          if (analysis[key]) analysis[key].attended.add(user.employeeId);
        }
      });
    });

    // Return final percentage
    return Object.entries(analysis).reduce((acc, [key, value]) => {
      acc[key] = value.total > 0 ? Number(((value.attended.size / value.total) * 100).toFixed(2)) : 0;
      return acc;
    }, {});
  };

  const coverageCurrent = useMemo(() => buildAnalysis(trainingData, traineeList), [trainingData, traineeList]);
  const coveragePrevious = useMemo(() => buildAnalysis(trainingDataForPreviousYear, traineeList), [trainingDataForPreviousYear, traineeList]);

  useEffect(() => {
    const categories = [
      'Employee Health & Safety',
      'Employee Skill Development',
      'Worker Health & Safety',
      'Worker Skill Development'
    ];

    const series = [
      {
        name: `FY ${financialYear?.[financialYear.length - 2]?.financial_year_value || 'N/A'}`,
        data: categories.map(cat => coveragePrevious[cat] || 0)
      },
      {
        name: `FY ${financialYear?.[financialYear.length - 1]?.financial_year_value || 'N/A'}`,
        data: categories.map(cat => coverageCurrent[cat] || 0)
      }
    ];

    const options = {
      chart: { type: 'bar', height: 350 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: val => `${val}%`
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories
      },
      yaxis: {
        title: {
          text: 'Coverage (%)'
        },
        max: 100
      },
      fill: {
        opacity: 1
      },
        title: {
          text: 'Year-over-Year Training Progress',
          align: 'left',
        },
      tooltip: {
        y: {
          formatter: val => `${val}%`
        }
      },
      legend: {
        position: 'bottom'
      },
      colors: ['#8B7DFF', '#76D7A1']
    };

    setChartData({ series, options });
  }, [coverageCurrent, coveragePrevious]);

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default CoverageGraph;
