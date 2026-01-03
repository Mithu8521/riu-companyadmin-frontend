import React from "react";
import Chart from "react-apexcharts";
import { Row, Col } from "react-bootstrap";
import LegendComponent from "./LegendComponent";

const LocationWiseEmission = () => {
  const options1 = {
    chart: {
      type: "radialBar",
    },
    series: [67, 84, 97, 61],
    plotOptions: {
      radialBar: {
        size: 100, // Adjust the size of the radial bars
        offsetY: 10, // Offset the bars to create space
        hollow: {
          margin: 10, // Margin between the inner and outer circle
          size: "40%",
        },
        track: {
          background: "#f2f2f2",
          strokeWidth: "120%",
          margin: 10,
          width: 50,
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: false,
            label: "TOTAL",
            fontSize: "16px",
            formatter: function (w) {
              // By default this function returns the average of all series. The formatter function allows you to customize this
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            },
          },
        },
      },
    },
    labels: ["TEAM A", "TEAM B", "TEAM C", "TEAM D"],
  };

  return (
    <div style={containerStyle}>
      <div style={{ height: "10%", }}>
        <div
          className="ener-title"
          style={{

            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "left",
            width: "100%",
          }}
        >
          Location Wise Emission
        </div>
      </div>
      <div style={{ height: "85%" }}>
        <Row style={{ height: "100%" }}>
          <Col md={8}>
            <Chart
              options={options1}
              series={options1.series}
              type="radialBar"
              height={"100%"}
            />
          </Col>
          <Col md={4}>
            <div style={{ height: "100%" }}>
              <Row style={{ height: "50%", marginTop: "20%" }}>
                <Col md={6}>
                  <LegendComponent color="#11546f" label="Q1" value="67%" />
                </Col>
                <Col md={6}>
                  <LegendComponent color="#11546f" label="Q1" value="67%" />
                </Col>
              </Row>
              <Row style={{ height: "50%" }}>
                <Col md={6}>
                  <LegendComponent color="#11546f" label="Q1" value="67%" />
                </Col>
                <Col md={6}>
                  <LegendComponent color="#11546f" label="Q1" value="67%" />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "white",
  borderRadius: "15px",
  width: "100%",
  height: "100%",
  padding: "5px",
};

export default LocationWiseEmission;
