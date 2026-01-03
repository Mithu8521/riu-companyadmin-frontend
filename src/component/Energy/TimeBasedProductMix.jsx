import React, { useState } from "react";
import Chart from "react-apexcharts";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import "./TotalEnergyConsum.css";

const TimeBasedProductMix = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const data = {
    "Product 1": [100, 200, 300, 400],
    "Product 2": [150, 250, 350, 450],
    "Product 3": [200, 300, 400, 500],
    "Product 4": [250, 350, 450, 550],
  };

  const productOptions = ["Product 1", "Product 2", "Product 3", "Product 4"];

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["Q1", "Q2", "Q3", "Q4"],
    },
    yaxis: {

    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  const chartSeries = selectedProducts.map((product) => ({
    name: product,
    data: data[product],
  }));

  const handleProductChange = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((item) => item !== product)
        : [...prevSelected, product]
    );
  };

  return (
    <div
      className="whitecont"
      style={{
        width: "100%",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        height: "100%",
        marginLeft: "2%",

      }}
    >
      <div className="d-flex flex-column align-items-center" style={{ height: "100%" }}>
        <div className="w-100 d-flex" style={{ height: "15%", justifyContent: "space-between", marginBottom: "5%" }}>
          <div
            className="ener-title"
            style={{
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            Time-Based Product-Mix
          </div>
          <DropdownButton
            id="dropdown-basic-button"
            title="Select Products"
            style={{ background: "white", borderColor: "#3F88A5", color: "black" }}
            className="mb-3"
          >
            {productOptions.map((product) => (
              <Dropdown.Item
                key={product}
                onClick={() => handleProductChange(product)}
                active={selectedProducts.includes(product)}
              >
                {selectedProducts.includes(product) ? "✓ " : ""}{product}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        <div className="w-100" style={{ height: "80%" }}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeBasedProductMix;
