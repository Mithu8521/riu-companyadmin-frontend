// // import React, { useEffect, useState } from 'react';
// // import Chart from 'react-apexcharts';
// // import './DonutChart.css';
// // import ReactApexChart from 'react-apexcharts';

// // const WaterDonutChart = ({ timePeriodValues, waterType, title }) => {
// //   const waterSeries = [
// //     "Surface Water",
// //     "Ground Water",
// //     "Third Party Water",
// //     "Municipal Water",
// //     "Seawater / Desalinated Water",
// //     "Others",
// //   ];

// //   const [chartOptions, setChartOptions] = useState({});
// //   const [chartSeries, setChartSeries] = useState([]);
// //   const [totalConsumption, setTotalConsumption] = useState(0);
// //   const [totalLabel, setTotalLabel] = useState("0 KL");

// //   useEffect(() => {
// //     if (!Array.isArray(waterType) || waterType.length === 0) {
// //       // If waterType is not an array or is empty, set the chart to an empty state
// //       setChartSeries([]);
// //       setTotalConsumption(0);
// //       setTotalLabel("0 KL");
// //       return;
// //     }

// //     // Aggregate the values with necessary checks
// //     const aggregatedValues = waterSeries.map((_, index) =>
// //       waterType.reduce((acc, obj) => {
// //         const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
// //         return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
// //       }, 0)
// //     );

// //     // Calculate total consumption
// //     const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
// //     setTotalConsumption(total);

// //     // Calculate percentages with necessary checks
// //     const percentages = total > 0
// //       ? aggregatedValues.map((value) => (value / total) * 100)
// //       : [];

// //     // Update the chart series
// //     setChartSeries(percentages);
// //     setTotalLabel(`${total.toFixed(2)} KL`);

// //     // Update the chart options
// //     setChartOptions({
// //       chart: {
// //         type: "donut",
// //       },
// //       plotOptions: {
// //         pie: {
// //           donut: {
// //             size: "55%",
// //             labels: {
// //               show: true,
// //               name: {
// //                 show: true,
// //               },
// //               value: {
// //                 show: true,
// //                 fontSize: "16px",
// //                 fontWeight: "bold",
// //                 color: "#333",
// //                 formatter: (val) => `${parseFloat(val).toFixed(2)}%`,
// //               },
// //               total: {
// //                 show: false,
// //                 showAlways: false,
// //                 fontSize: "24px",
// //                 fontWeight: "bold",
// //                 color: "#333",
// //                 formatter: () => totalLabel, 
// //               },
// //             },
// //           },
// //         },
// //       },
// //       stroke: {
// //         show: false,
// //       },
// //       tooltip: {
// //         enabled: true,
// //       },
// //       dataLabels: {
// //         enabled: true,
// //       },
// //       legend: {
// //         show: false,
// //         position: "bottom",
// //       },
// //       responsive: [
// //         {
// //           breakpoint: 480,
// //           options: {
// //             chart: {
// //               width: 200,
// //             },
// //           },
// //         },
// //       ],
// //       colors: [
// //         "#2a6478",
// //         "#C1DDEA",
// //         "#3abec7",
// //         "#deeff8",
// //         "#2980B9",
// //         "#27AE60",
// //       ],
// //       labels: waterSeries,
// //     });
// //   }, [waterType, timePeriodValues]);

// //   return (
// //     <div className="donut-chart-container">
// //       <div className="donut-chart-title" style={{ height: "10%" , justifyContent:"space-between"}}>

// //        <div>{title}</div> 
// //         <div style={{fontSize:"15px", fontWeight:"lighter"}}>
// //             Total : - {totalConsumption}
// //         </div>
// //       </div>
// //       <div
// //         style={{
// //           display: "flex",
// //           alignContent: "center",
// //           justifyItems: "center",
// //           justifyContent: "center",
// //           height: "90%",
// //         }}
// //       >
// //         <ReactApexChart
// //           options={chartOptions}
// //           series={chartSeries}
// //           type="donut"
// //           height={"100%"}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default WaterDonutChart;


// import React, { useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import './DonutChart.css';
// import ReactApexChart from 'react-apexcharts';
// import { Row,Col } from 'react-bootstrap';

// const WaterDonutChart = ({ timePeriodValues, waterType, title }) => {
//   const waterSeries = [
//     "Surface Water",
//     "Ground Water",
//     "Third Party Water",
//     "Municipal Water",
//     "Seawater / Desalinated Water",
//     "Others",
//   ];

//   const [chartOptions, setChartOptions] = useState({});
//   const [chartSeries, setChartSeries] = useState([]);
//   const [totalConsumption, setTotalConsumption] = useState(0);
//   const [totalLabel, setTotalLabel] = useState("0 KL");

//   useEffect(() => {
//     if (!Array.isArray(waterType) || waterType.length === 0) {
//       setChartSeries([]);
//       setTotalConsumption(0);
//       setTotalLabel("0 KL");
//       return;
//     }

//     const aggregatedValues = waterSeries.map((_, index) =>
//       waterType.reduce((acc, obj) => {
//         const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
//         return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
//       }, 0)
//     );

//     const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
//     setTotalConsumption(total);

//     const percentages = total > 0
//       ? aggregatedValues.map((value) => (value / total) * 100)
//       : [];

//     setChartSeries(percentages);
//     setTotalLabel(`${total.toFixed(2)} KL`);

//     setChartOptions({
//       chart: {
//         type: "donut",
//       },
//       plotOptions: {
//         pie: {
//           donut: {
//             size: "55%",
//             labels: {
//               show: true,
//               name: {
//                 show: true,
//               },
//               value: {
//                 show: true,
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 color: "#333",
//                 formatter: (val) => `${parseFloat(val).toFixed(2)}%`,
//               },
//               total: {
//                 show: false,
//                 showAlways: false,
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 color: "#333",
//                 formatter: () => totalLabel, 
//               },
//             },
//           },
//         },
//       },
//       stroke: {
//         show: false,
//       },
//       tooltip: {
//         enabled: true,
//         y: {
//           formatter: (value) => `${value.toFixed(2)} KL`, // Show value in tooltip
//         },
//       },
//       dataLabels: {
//         enabled: true,
//       },
//       legend: {
//         show: false,
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 200,
//             },
//           },
//         },
//       ],
//       colors: [
//         "#2a6478",
//         "#C1DDEA",
//         "#3abec7",
//         "#deeff8",
//         "#2980B9",
//         "#27AE60",
//       ],
//       labels: waterSeries,
//     });
//   }, [waterType, timePeriodValues]);

//   return (
//     <div className="donut-chart-container">
//       <div className="donut-chart-title" style={{ height: "10%", justifyContent: "space-between" }}>
//         <div>{title}</div>
//         <div style={{ fontSize: "15px", fontWeight: "lighter" }}>
//           Total: {totalConsumption} KL
//         </div>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           alignContent: "center",
//           justifyItems: "center",
//           justifyContent: "center",
//           height: "80%",
//         }}
//       >
//         <ReactApexChart
//           options={chartOptions}
//           series={chartSeries}
//           type="donut"
//           height={"100%"}
//         />
//       </div>
//       <Row className="donut-chart-legend" style={{ marginTop: "0px" }}>
//         {waterSeries.map((seriesName, index) => (
//           <Col md={4} key={index} style={{ display: "flex", alignItems: "center" }}>
//             <span style={{
//               display: "inline-block",
//               width: "15px",
//               height: "15px",
//               borderRadius:"50%",
//               backgroundColor: chartOptions.colors ? chartOptions.colors[index] : "",
//               marginRight: "5px"
//             }}></span>
//             <span style={{fontSize:"12px"}}>{seriesName}</span>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default WaterDonutChart;

import React, { useEffect, useState } from 'react';
import './DonutChart.css';
import ReactApexChart from 'react-apexcharts';
import { Row, Col } from 'react-bootstrap';

const WaterDonutChart = ({ timePeriodValues, waterType, title }) => {
  const waterSeries = [
    "Surface Water",
    "Ground Water",
    "Third Party Water",
    "Municipal Water",
    "Seawater / Desalinated Water",
    "Others",
  ];

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalLabel, setTotalLabel] = useState("0 KL");

  useEffect(() => {
    if (!Array.isArray(waterType) || waterType.length === 0) {
      setChartSeries([]);
      setTotalConsumption(0);
      setTotalLabel("0 KL");
      return;
    }

    const aggregatedValues = waterSeries.map((_, index) =>
      waterType.reduce((acc, obj) => {
        const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
        return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
      }, 0)
    );

    const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
    setTotalConsumption(total);

    // Use aggregatedValues directly for chartSeries
    setChartSeries(aggregatedValues);
    setTotalLabel(`${total.toFixed(2)} KL`);

    setChartOptions({
      chart: {
        type: "donut",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                formatter: (val, opts) => {
                  // Show exact value from the series data
                  const index = opts.seriesIndex;
                  return aggregatedValues[index] ? `${aggregatedValues[index].toFixed(2)} KL` : "0 KL";
                }, // Show exact value with 'KL'
              },
              total: {
                show: false,
                showAlways: true,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                formatter: () => totalLabel,
              },
            },
          },
        },
      },
      stroke: {
        show: false,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (value) => `${parseFloat(value).toFixed(2)} KL`, // Show exact value in tooltip
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
          // Show exact value from the series data
          const index = opts.seriesIndex;
          return aggregatedValues[index] ? `${aggregatedValues[index].toFixed(2)} KL` : "0 KL";
        },
      },
      legend: {
        show: false,
      },
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
      colors: [
        "#2a6478",
        "#C1DDEA",
        "#3abec7",
        "#deeff8",
        "#2980B9",
        "#27AE60",
      ],
      labels: waterSeries,
    });
  }, [waterType, timePeriodValues]);

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-title" style={{ height: "10%", justifyContent: "space-between" }}>
        <div>{title}</div>
        <div style={{ fontSize: "15px", fontWeight: "lighter" }}>
          Total: {totalConsumption.toFixed(2)} KL
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyItems: "center",
          justifyContent: "center",
          height: "80%",
        }}
      >
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={"100%"}
        />
      </div>
      <Row className="donut-chart-legend" style={{ marginTop: "0px" }}>
        {waterSeries.map((seriesName, index) => (
          <Col md={4} key={index} style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: chartOptions.colors ? chartOptions.colors[index] : "",
              marginRight: "5px"
            }}></span>
            <span style={{ fontSize: "12px" }}>{seriesName}</span>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WaterDonutChart;
