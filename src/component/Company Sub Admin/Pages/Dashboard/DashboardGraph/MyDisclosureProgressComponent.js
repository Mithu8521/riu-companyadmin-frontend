import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { apiCall } from '../../../../../_services/apiCall';
import config from '../../../../../config/config.json';
import { useHistory } from 'react-router-dom';

const MyDisclosureProgressComponent = () => {
  const history = useHistory();
  const [graphData, setGraphData] = useState({});
  const [hoveredData, setHoveredData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [centerPercentage, setCenterPercentage] = useState(null);

  const overAllStatusOverview = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}overAllStatusOverview`,
      {},
      {},
      'GET'
    );

    if (isSuccess) {
      setGraphData(data?.data);
      setSelectedCategory(Object.keys(data?.data)[2]);
    }
  };
  const myDisclosureProgress = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}frameworkProgress`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setSelectedCategory(data?.data?.frameworkOptions[0].title)
      setGraphData(data?.data);

      // let frameworkOptions = data?.data?.frameworkOptions;
      // setFramework(frameworkOptions);
      // const GraphData = await RadioBarChartData(data?.data?.categories, data?.data?.series);
      // setRadioBarGraphData(GraphData);
      // const filter = data?.data?.filter;   
      // setSelectedFramework(filter?.frameworkIds);
    }
  };
  useEffect(() => {
    // overAllStatusOverview();
    myDisclosureProgress();
  }, []);

  const getCategoryData = (category) => {
    if (!graphData[category]) {
      return [];
    }

    return [
      graphData[category]?.answered ? graphData[category]?.answered : 0,
      graphData[category]?.accepted ? graphData[category]?.accepted : 0,
      graphData[category]?.rejected ? graphData[category]?.rejected : 0,
      graphData[category]?.notResponded ? graphData[category]?.notResponded : 0,
    ];
  };

  const getOptions = (category) => {
    const seriesData = graphData.series;
    const allZeroes = seriesData.every(value => value === 0);

    const options = {
      chart: {
        width: 480,
        type: 'donut',
      },
      labels: graphData.categories,

      ...(allZeroes ? { colors: ['#e9ecef'] } : {}),

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            enabled: false,
          },
        },
      },
      dataLabels: {
        enabled: !allZeroes,
        formatter: function () {
          return centerPercentage !== null ? `${parseFloat(centerPercentage).toFixed(2).replace(/\.?0+$/, '')}%` : '';
        },
        offsetY: -10,
        style: {
          fontSize: '18px',
        },
      },
      tooltip: {
        enabled: !allZeroes,
        y: {
          formatter: function (value) {
            setCenterPercentage(value);
            return `${parseFloat(value).toFixed(2).replace(/\.?0+$/, '')}%`;
          },
        },
      },
      // plotOptions: {
      //   pie: {
      //     donut: {
      //       size: '50%',
      //     },
      //   },
      // },

      events: {
        dataPointSelection: (event, chartContext, opts) => {
          const selectedLabel = chartContext.w.config.labels[opts.dataPointIndex];
          const selectedData = graphData[category][selectedLabel.toLowerCase()];
          setHoveredData(selectedData);
          history.push('/esg_reporting');
        },
      },
    };

    // Remove legend if all zeroes
    if (!allZeroes) {
      options.legend = {
        display: true,
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 0,
        style: {
          right: '5px',
          top: '77px', // Adjust this value as needed
        },
      };
    }

    return {
      series: allZeroes ? [1] : seriesData,
      options: options,
    };
  };




  const handleCheckboxChange = (category) => {
    setSelectedCategory(category);
    setCenterPercentage(null);
  };



  return (
    <>
      <div className="canvas-con-inner">
        {graphData.frameworkOptions && graphData.frameworkOptions.length && graphData.frameworkOptions.map((category, index) => {
          if (category.title === 'BRSR') {
            return (
              <div key={index}>
                <input
                  type="radio"
                  id={`checkbox-${category.title}`}
                  checked={selectedCategory === category.title}
                  onChange={() => handleCheckboxChange(category.title)}
                />
                <label className="fs-5" htmlFor={`checkbox-${category.title}`}>{category.title}</label>
                <div className='graph_data'>
                  {selectedCategory === category.title && (
                    <ReactApexChart
                      options={getOptions(category.title).options}
                      series={getOptions(category.title).series}
                      type="donut"
                      width={470}
                    />
                  )}
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <h6>{centerPercentage !== null ? `${parseFloat(centerPercentage).toFixed(2).replace(/\.?0+$/, '')}%` : ''}</h6>

    </>
  );
};

export default MyDisclosureProgressComponent;
