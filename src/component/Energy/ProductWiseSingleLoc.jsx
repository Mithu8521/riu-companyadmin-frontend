import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";

const ProductWiseSingleLoc = ({ renElec, renFuel, nonrenElec, nonrenFuel }) => {
  const [selectedCategory, setSelectedCategory] = useState("Fuel");
  const [series, setSeries] = useState([renFuel, nonrenFuel]);

  const [options, setOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Renewable", "Non-Renewable"],
    colors: ["#11546f", "#3abec7"],
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
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' GJ';  // Append 'GJ' unit to the value
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const index = opts.seriesIndex;
        // Access the actual value from the series data
        const value = series[index] ? series[index] : 0;
        return `${value} MJ`; // Show exact value with 'GJ' unit
      },
    }
  });

  const handleCategoryChange = (eventKey) => {
    setSelectedCategory(eventKey);
  };

  useEffect(() => {
    // Update series based on selected category
    const newSeries =
      selectedCategory === "Fuel" ? [renFuel, nonrenFuel] : [renElec, nonrenElec];
    setSeries(newSeries);
  }, [selectedCategory, renElec, renFuel, nonrenElec, nonrenFuel]);

  useEffect(() => {
    // Optionally update options if necessary
    // For example, if you need to update labels based on selectedCategory
    setOptions((prevOptions) => ({
      ...prevOptions,
      labels: selectedCategory === "Fuel" ? ["Renewable Fuel", "Non-Renewable Fuel"] : ["Renewable Electricity", "Non-Renewable Electricity"]
    }));
  }, [series, selectedCategory]);

  return (
    <div className="container">
      <div className="header" style={{ height: "15%" }}>
        <div className="title">Product-Wise Energy Consumption</div>
        <div className="filter">
          <div className="category-filter">
            <DropdownButton
              id="dropdown-basic-button"
              title={selectedCategory}
              onSelect={handleCategoryChange}
            >
              <Dropdown.Item eventKey="Fuel">Fuel</Dropdown.Item>
              <Dropdown.Item eventKey="Electricity">Electricity</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
      <div className="chart-container" style={{ height: "85%" }}>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col md={9} style={{ height: "100%" }}>
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              width="100%"
              height="100%"
            />
          </Col>
          <Col md={3} style={{ justifyContent: "left", alignContent: "center" }}>
            <div
              className="legend-container"
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "45%",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "baseline",
              }}
            >
              <div className="legend-item">
                <span
                  className="legend-color"
                  style={{
                    backgroundColor: "#11546f",
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                ></span>
                <span className="legend-label">Renewable</span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-color"
                  style={{
                    backgroundColor: "#3abec7",
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                ></span>
                <span className="legend-label">Non-Renewable</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductWiseSingleLoc;
