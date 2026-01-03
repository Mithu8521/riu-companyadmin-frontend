import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Row, Col } from 'react-bootstrap';

const WwaterWithdrawalSingle = ({ timePeriodValues, waterType, title }) => {
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

    // Aggregate the values for each water type
    const aggregatedValues = waterSeries.map((_, index) =>
      waterType.reduce((acc, obj) => {
        const value = obj.answer && Array.isArray(obj.answer) && obj.answer[index]?.[0];
        return acc + (value === "NA" || !value ? 0 : parseFloat(value || 0));
      }, 0)
    );

    // Calculate the total consumption
    const total = aggregatedValues.reduce((sum, value) => sum + value, 0);
    setTotalConsumption(total);
    setTotalLabel(`${total.toFixed(2)} KL`);

    // Update chart series and options
    setChartSeries(aggregatedValues);
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
                show: false,
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
                },
              },
              total: {
                show: false, // Hide total value if not needed
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
          formatter: (val) => `${parseFloat(val).toFixed(2)} KL`, // Show exact value
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
          alignItems: "center",
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

export default WwaterWithdrawalSingle;
