import React, { useState } from "react";
import Chart from "react-apexcharts";
import "./TotalEnergyConsum.css";

const ProductEnergyConsumption = () => {
  const [selectedProduct, setSelectedProduct] = useState("Bituminous coal");

  const data = {
    "Bituminous coal": [2000, 0, 0, 0],
    PNG: [300, 4000, 0, 0],
    CNG: [0, 0, 3000, 0],
    "Range 13": [0, 0, 0, 3500],
  };

  const chartOptions = {
    labels: ["Bituminous coal", "PNG", "CNG", "Range 13"],
    colors: ["#3ABEC7", "#587B87", "#11546f", "#9CDFE3"],
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
            height: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = data[selectedProduct];

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <div className="whitecont" style={{ width: "100%", height: "100%" }}>
      <div
        className="d-flex flex-row flex-space-between w-100"
        style={{ justifyContent: "space-between", height: "10%", marginBottom: "5%" }}
      >
        <div className="ener-title">Product-Wise Energy Consumption</div>
      </div>
      <div
        className="d-flex flex-row flex-space-between w-100"
        style={{ justifyContent: "space-between", height: "15%", marginLeft: "20px", }}
      >
        <select
          className="btn btn-outline-secondary"
          value={selectedProduct}
          color="black"
          onChange={handleProductChange}
          style={{
            marginBottom: "20px",
            borderColor: "#3F88A5",

            textAlign: 'left',
            fontWeight: 600,
            fontSize: "12px",
            borderRadius: "5px",
          }}
        >
          <option value="Bituminous coal">Bituminous coal</option>
          <option value="PNG">PNG</option>
          <option value="CNG">CNG</option>
          <option value="Range 13">Range 13</option>
        </select>

      </div>


      <div className="d-flex flex-column align-items-center" style={{ height: "65%" }}>

        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default ProductEnergyConsumption;
