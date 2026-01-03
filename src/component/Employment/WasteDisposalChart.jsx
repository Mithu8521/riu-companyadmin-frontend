import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { Row, Col } from "react-bootstrap";

const WasteDisposalChart = ({ wasteDisposall }) => {
  const wasteCategories = [
    "Incineration",
    "Landfilling",
    "Other Disposal Operations",
  ];

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalLabel, setTotalLabel] = useState("0 KL");

  useEffect(() => {
    if (!Array.isArray(wasteDisposall) || wasteDisposall.length === 0) {
      setChartSeries([]);
      setTotalConsumption(0);
      setTotalLabel("0 KL");
      return;
    }

    // Aggregate the values with necessary checks
    const aggregatedValues = wasteCategories.map((_, index) =>
      wasteDisposall.reduce((acc, obj) => {
        const value =
          obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
        // Ensure that value is a valid number and not undefined or "NA"
        const parsedValue = value === "NA" || !value ? 0 : parseFloat(value);
        return acc + parsedValue;
      }, 0)
    );

    // Calculate total consumption
    const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
    setTotalConsumption(total);

    // Set the chart series as exact values
    setChartSeries(aggregatedValues);
    setTotalLabel(`${total.toFixed(3)} mT`);

    // Update chart options to display exact values
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
              name: { show: true },
              value: {
                show: true,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                formatter: (val, { seriesIndex }) =>
                  `${aggregatedValues[seriesIndex]?.toFixed(3) || 0} mT`,  // Safely handle undefined values
              },
              total: {
                show: false,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                formatter: () => totalLabel,
              },
            },
          },
        },
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
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, { seriesIndex }) {
          // Display exact value in the chart labels
          return `${aggregatedValues[seriesIndex]?.toFixed(3) || 0} mT`; // Handle undefined values
        },
      },
      legend: {
        show: false, // Custom legend below
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
      labels: wasteCategories,
    });
  }, [wasteDisposall]);




  return (
    <div className="donut-chart-container">
      <div
        className="donut-chart-title"
        style={{
          marginTop: "1%",
          height: "10%",
          justifyContent: "space-between",
        }}
      >
        <div>Total Waste Disposed</div>
        <div style={{ fontSize: "15px", fontWeight: "lighter" }}>
          Total: {totalConsumption} mT
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
          <Col
            md={4}
            key={index}
            style={{ display: "flex", alignItems: "center" }}
          >
            <span
              style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: chartOptions.colors
                  ? chartOptions.colors[index]
                  : "",
                marginRight: "5px",
              }}
            ></span>
            <span style={{ fontSize: "12px" }}>{categoryName}</span>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WasteDisposalChart;
