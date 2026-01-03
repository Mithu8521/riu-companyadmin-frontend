// import React, { useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
// import ReactApexChart from 'react-apexcharts';
// import { Row, Col } from 'react-bootstrap';

// const WasteDonutChart = ({ timePeriodValues, matchedDataWaste, title }) => {
//   const wasteCategories = ["Incineration", "Landfilling", "Other Disposal Operations"];

//   const [chartOptions, setChartOptions] = useState({});
//   const [chartSeries, setChartSeries] = useState([]);
//   const [totalConsumption, setTotalConsumption] = useState(0);
//   const [totalLabel, setTotalLabel] = useState("0 KL");

//   useEffect(() => {
//     if (!Array.isArray(matchedDataWaste) || matchedDataWaste.length === 0) {
//       // If matchedDataWaste is not an array or is empty, set the chart to an empty state
//       setChartSeries([]);
//       setTotalConsumption(0);
//       setTotalLabel("0 KL");
//       return;
//     }

//     // Aggregate the values with necessary checks
//     const aggregatedValues = wasteCategories.map((_, index) =>
//       matchedDataWaste.reduce((acc, obj) => {
//         const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
//         return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
//       }, 0)
//     );

//     // Calculate total consumption
//     const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
//     setTotalConsumption(total);

//     // Calculate percentages with necessary checks
//     const percentages = total > 0
//       ? aggregatedValues.map((value) => (value / total) * 100)
//       : [];

//     // Update the chart series
//     setChartSeries(percentages);
//     setTotalLabel(`${total.toFixed(3)} KL`);

//     // Update the chart options
//     setChartOptions({
//       chart: {
//         type: "donut",
//       },
//       plotOptions: {
//         pie: {
//           donut: {
//             size: "65%",
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
//                 formatter: (val) => `${parseFloat(val).toFixed(3)}%`,
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
//       },
//       dataLabels: {
//         enabled: true,
//       },
//       legend: {
//         show: false, // Hide the default legend
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
//       labels: wasteCategories,
//     });
//   }, [matchedDataWaste, timePeriodValues]);

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
//         {wasteCategories.map((categoryName, index) => (
//           <Col md={4} key={index} style={{ display: "flex", alignItems: "center" }}>
//             <span style={{
//               display: "inline-block",
//               width: "15px",
//               height: "15px",
//               borderRadius: "50%",
//               backgroundColor: chartOptions.colors ? chartOptions.colors[index] : "",
//               marginRight: "5px"
//             }}></span>
//             <span style={{ fontSize: "12px" }}>{categoryName}</span>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default WasteDonutChart;


import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Row, Col } from 'react-bootstrap';

const WasteDonutChart = ({ matchedDataWaste, title }) => {
  const wasteCategories = ["Incineration", "Landfilling", "Other Disposal Operations"];

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalLabel, setTotalLabel] = useState("0 KL");

  useEffect(() => {
    if (!Array.isArray(matchedDataWaste) || matchedDataWaste.length === 0) {
      // If matchedDataWaste is not an array or is empty, set the chart to an empty state
      setChartSeries([]);
      setTotalConsumption(0);
      setTotalLabel("0 mT");
      return;
    }

    // Aggregate the values with necessary checks
    const aggregatedValues = wasteCategories.map((_, index) =>
      matchedDataWaste.reduce((acc, obj) => {
        const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
        return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
      }, 0)
    );

    // Calculate total consumption
    const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
    setTotalConsumption(total);

    // Update the chart series with actual values
    setChartSeries(aggregatedValues);
    setTotalLabel(`${total.toFixed(3)} mT`);

    // Update the chart options
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
              },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                formatter: (val, { seriesIndex }) =>
                  `${aggregatedValues[seriesIndex]?.toFixed(3) || 0} mT`,  // Show value in KL
              },
              total: {
                show: false,
                showAlways: false,
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
          formatter: function (value, { seriesIndex }) {
            // Show the exact value in mT
            return `${aggregatedValues[seriesIndex]?.toFixed(3) || 0} mT`; // Handle undefined values
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        show: false, // Hide the default legend
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
      dataLabels: {
        enabled: true,
        formatter: function (val, { seriesIndex }) {
          // Display exact value in the chart labels
          return `${aggregatedValues[seriesIndex]?.toFixed(3) || 0} mT`; // Handle undefined values
        },
      },
      colors: [
        "#2a6478",
        "#C1DDEA",
        "#3abec7",
        "#deeff8",
        "#2980B9",
        "#27AE60",
      ],
      labels: wasteCategories,
    });
  }, [matchedDataWaste]);

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-title" style={{ height: "10%", justifyContent: "space-between" }}>
        <div>{title}</div>
        <div style={{ fontSize: "15px", fontWeight: "lighter" }}>
          Total: {totalConsumption.toFixed(3)} mT
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
        {wasteCategories.map((categoryName, index) => (
          <Col md={4} key={index} style={{ display: "flex", alignItems: "center" }}>
            <span style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: chartOptions.colors ? chartOptions.colors[index] : "",
              marginRight: "5px"
            }}></span>
            <span style={{ fontSize: "12px" }}>{categoryName}</span>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WasteDonutChart;

