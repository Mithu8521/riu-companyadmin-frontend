import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const HumanRightsGraph = ({ trainingData, trainingDataForPreviousYear, traineeList, financialYear }) => {
  const [chartData, setChartData] = useState({ series: [], options: {} });

  const getCategoryKey = (categoryId) => {
    if (categoryId === 'Permanent Employee') return 'Permanent Employees';
    if (categoryId === 'Permanent Worker') return 'Permanent Workers';
    if (categoryId?.includes('Employee')) return 'Other Employees';
    if (categoryId?.includes('Worker')) return 'Other Workers';
    return null;
  };

  const initializeData = () => ({
    'Permanent Employees': { total: 0, current: new Set(), previous: new Set() },
    'Other Employees': { total: 0, current: new Set(), previous: new Set() },
    'Permanent Workers': { total: 0, current: new Set(), previous: new Set() },
    'Other Workers': { total: 0, current: new Set(), previous: new Set() },
  });

  const calculatePercentages = () => {
    const categoryIdOfHumanRights = 3;
    const data = initializeData();

    // Step 1: Total users by category
    traineeList?.forEach(user => {
      const key = getCategoryKey(user?.categoryId);
      if (key) data[key].total++;
    });

    // Step 2: Current Year Human Rights Attendees
    trainingData?.forEach(training => {
      const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
      if (trainingCategoryIds.includes(categoryIdOfHumanRights)) {
        training.attendantUsers?.forEach(user => {
          const key = getCategoryKey(user?.categoryId);
          if (key) data[key].current.add(user.id || user.employeeId);
        });
      }
    });

    // Step 3: Previous Year Human Rights Attendees
    trainingDataForPreviousYear?.forEach(training => {
      const trainingCategoryIds = (training.categories || []).map(category => category?.id).filter(Boolean);
      if (trainingCategoryIds.includes(categoryIdOfHumanRights)) {
        training.attendantUsers?.forEach(user => {
          const key = getCategoryKey(user?.categoryId);
          if (key) data[key].previous.add(user.id || user.employeeId);
        });
      }
    });

    // Step 4: Convert to percentage arrays
    const categories = Object.keys(data);
    const currentPercent = categories.map(key => {
      const total = data[key].total || 1;
      return Number(((data[key].current.size / total) * 100).toFixed(2));
    });
    const previousPercent = categories.map(key => {
      const total = data[key].total || 1;
      return Number(((data[key].previous.size / total) * 100).toFixed(2));
    });

    return { categories, currentPercent, previousPercent };
  };

  useEffect(() => {
    const { categories, currentPercent, previousPercent } = calculatePercentages();

    setChartData({
      series: [
        {
          name: `FY ${financialYear?.[financialYear.length - 2]?.financial_year_value || 'N/A'}`,
          data: previousPercent,
        },
        {
          name: `FY ${financialYear?.[financialYear.length - 1]?.financial_year_value || 'N/A'}`,
          data: currentPercent,
        },
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories,
        },
        title: {
          text: 'Human Rights Training Progress',
          align: 'left',
        },
        dataLabels: {
          enabled: true,
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        legend: {
          position: 'bottom',
        },
        title: {
          text: 'Human Rights Training Progress',
          align: 'left',
        },
        colors: ['#775DD0', '#00E396'],
      },
    });
  }, [trainingData, trainingDataForPreviousYear, traineeList]);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default HumanRightsGraph;
