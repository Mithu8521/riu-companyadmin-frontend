import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const LocationWiseGraph = ({ source, locations }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    // Ensure source is a valid array before processing
    if (!Array.isArray(source)) return;

    const locationMap = {};

    source.forEach(training => {
      const locId = training.locationId || 1;
      const unit = locations.find(u => u.id === locId);
      const loc = unit ? (unit.unitCode || unit.location.city) : null;

      if (!locationMap[loc]) {
        locationMap[loc] = {
          programCount: 0,
          totalAccepted: 0,
          totalAttended: 0,
        };
      }

      locationMap[loc].programCount += 1;
      locationMap[loc].totalAccepted += Array.isArray(training.acceptedUsers)
        ? training.acceptedUsers.length
        : 0;
      locationMap[loc].totalAttended += Array.isArray(training.attendantUsers)
        ? training.attendantUsers.length
        : 0;
    });

    let categories = Object.keys(locationMap);
    if (categories.length === 0) return;

    const programCounts = categories.map(loc => locationMap[loc].programCount);
    const totalParticipants = categories.map(loc => locationMap[loc].totalAccepted);
    const completionRates = categories.map(loc => {
      const { totalAccepted, totalAttended } = locationMap[loc];
      return totalAccepted > 0 ? Number(((totalAttended / totalAccepted) * 100).toFixed(2)) : 0;
    });

    setChartData({
      series: [
        {
          name: 'Programs',
          type: 'column',
          data: programCounts,
        },
        {
          name: 'Total Participants',
          type: 'column',
          data: totalParticipants,
        },
        {
          name: 'Completion Rate (%)',
          type: 'line',
          data: completionRates,
        },
      ],
      options: {
        chart: {
          height: 550,
          type: 'line',
          stacked: false,
          foreColor: '#333',
          fontFamily: 'inherit',
          dropShadow: { enabled: false },
          parentHeightOffset: 0, // <-- KEY
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
        },
        title: {
          text: 'Training Summary by Location',
          align: 'left',
        },
        xaxis: {
          categories,
          title: {
            text: 'Locations',
          },
        },
        yaxis: [
          {
            seriesName: 'Programs',
            axisTicks: { show: true },
            axisBorder: { show: true, color: '#008FFB' },
            labels: { style: { colors: '#008FFB' } },
            title: {
              text: 'Programs',
              style: { color: '#008FFB' },
            },
          },
          {
            seriesName: 'Total Participants',
            opposite: true,
            axisTicks: { show: true },
            axisBorder: { show: true, color: '#00E396' },
            labels: { style: { colors: '#00E396' } },
            title: {
              text: 'Total Participants',
              style: { color: '#00E396' },
            },
          },
          {
            seriesName: 'Completion Rate (%)',
            opposite: true,
            axisTicks: { show: true },
            axisBorder: { show: true, color: '#FEB019' },
            labels: { style: { colors: '#FEB019' } },
            title: {
              text: 'Completion Rate (%)',
              style: { color: '#FEB019' },
            },
          },
        ],

        tooltip: {
          shared: true,
          intersect: false,
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40,
        },
        grid: {
          padding: {
            bottom: 0, // 🔑
          },
        },
      },
    });
  }, [source]);

  return (
    <div id="chart">
      {chartData.series.length > 0 && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={550}
        />
      )}
    </div>
  );
};

export default LocationWiseGraph;
