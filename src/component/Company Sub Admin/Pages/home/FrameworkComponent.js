


import React, { useEffect, useState, useRef } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import ApexCharts from "react-apexcharts";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";

const FrameworkComponent = ({ fromDate, toDate, financialYearId, framework, timePeriods, locationOption }) => {


  const [stackedBarData, setStackedBarData] = useState([]);

  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    const frameworkIds = framework.map(item => item.value);
    const locationIdsIds = locationOption && locationOption.map(item => item.id);
    const periods = Object.values(timePeriods);

    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}frameworkProgress`,
      {},
      { fromDate: fromDate, toDate: toDate, financialYearId, frameworkIds, locationIdsIds, periods },
      "GET"
    );

    if (isSuccess && isMounted.current) {
      const frameworkData = data?.data;
      const series = {
        name: 'Value',
        data: [
          frameworkData.answered.length,
          frameworkData.notAnswered.length,
          frameworkData.finalAccepted.length,
          frameworkData.finalRejected.length
        ]
      }
      setStackedBarData([series]);
    }
  };


  useEffect(() => {
    if (framework && framework.length && financialYearId && locationOption && locationOption.length) {
      fetchData();
    }
  }, [framework, locationOption, timePeriods, financialYearId]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      stackType: 'normal',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true,
        columnWidth: '30%',

      },
    },
    xaxis: {
      categories: ['Answered', 'Unanswered', 'Accepted', 'Rejected'],
      title: {
        text: '',
      },
      labels: {
        style: {
          colors: '#000',
        },
      },
    },
    yaxis: {
      title: {
        text: '', // Remove y-axis title
      },
      labels: {
        style: {
          colors: '#D3D3D3', // Light gray color for y-axis labels
        },
      },
    },
    legend: {
      position: 'bottom', // Place legend at the bottom
      horizontalAlign: 'center', // Center-align legend horizontally
      itemMargin: {

        horizontal: 10, // Add space between legend items
      },
      offsetY: 0, // Add margin-top (adjust as needed)
    },
    fill: {
      opacity: 1,
    },
    colors: ['#DDC272', '#AE6666', '#11546f', '#F27A7A'],
    dataLabels: {
      enabled: true, // Enable data labels for better visibility
    },
  };



  const chartSeries = stackedBarData.map(f => ({
    name: f.name,
    data: f.data
  }));


  return (
    <>
      <Col md={12} style={{ height: "100%" }}>
        <div className="bg-white framework" style={{ height: "100%" }}>
          <div className="frameworkHeader" style={{ height: "5%" }}>
            My Disclosure Progress
          </div>
          <div className="p-1" style={{ height: "95%" }}>
            {stackedBarData.length > 0 && (
              <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={"100%"}
              />
            )}
          </div>
        </div>
      </Col>

    </>
  );
};

export default FrameworkComponent;
