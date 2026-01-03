import React, { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import Chart from "react-apexcharts"; // Assuming you are using ApexCharts
import Select, { components } from "react-select"; // Import react-select

const YearWiseStacked = ({ title }) => {
  const [energy, setEnergy] = useState(null); // Initially set to null
  const [chartSeries, setChartSeries] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    "Renewable",
    "NonRenewable",
  ]); // Default to both products
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false, // Disable the three-line menu (toolbar)
      },
      stackType: "normal",
    },
    tooltip: {
      enabled: false, // Disable tooltip
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: 0,
      style: {
        fontSize: "8px",
        colors: ["#fff"], // White text inside bars
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: ["2023-24", "2024-25"], // The years you want to display
      title: {
        text: "Year",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      labels: {
        style: {
          colors: "#7b91b0",
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    yaxis: {
      title: {
        text: "Energy (GJ)",
        style: {
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "Arial",
          color: "#011627",
        },
      },
      min: 0, // Ensure no negative values
      labels: {
        style: {
          colors: ["#7b91b0"],
          fontSize: "12px",
          fontFamily: "Poppins",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} GJ`; // Display value with GJ unit
        },
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
  });

  const getEnergyEmissionComparison = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getEnergyEmissionComparison`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setEnergy(data?.data); // Set energy data when received
    }
  };

  useEffect(() => {
    getEnergyEmissionComparison();
  }, []);

  // Generate chart series data based on the selected products
  useEffect(() => {
    if (energy) { // Ensure data is available before trying to map
      const series = selectedProducts.map((product) => {
        const dataForProduct = ["2023-24", "2024-25"].map((year) => {
          if (energy[year]) {
            // Get the energy data for each year and selected product
            const productIndex = product === "Renewable" ? 0 : 1; // 0 for Renewable, 1 for NonRenewable
            return energy[year].reduce(
              (sum, item) => sum + item.energy[productIndex],
              0
            ); // Sum up energy values for each year
          }
          return 0; // Return 0 if the year data is not available
        });

        return {
          name: product,
          data: dataForProduct,
          color: product === "Renewable" ? "#83bbd5" : "#11546f", // Assign colors based on product
        };
      });

      setChartSeries(series); // Set the series for the chart
    }
  }, [selectedProducts, energy]); // Only run when energy or selectedProducts change

  // Handle product selection change
  const handleProductChange = (selected) => {
    if (selected.length === 0) {
      alert("You must select at least one product");
      return;
    }
    if (selected.length > 2) {
      alert("You can only select up to 2 products");
      return;
    }
    setSelectedProducts(selected.map((item) => item.value)); // Update selected products state
  };

  const CustomOption = (props) => {
    const { isSelected, data } = props;
    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #3f88a5",
              borderRadius: "2px",
              marginRight: "10px",
            }}
          >
            {isSelected && (
              <span style={{ color: "white", fontSize: "14px" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "14px", fontWeight: 300 }}>
            {data.label}
          </span>
        </div>
      </components.Option>
    );
  };

  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value, placeholder } = selectProps;

    return (
      <components.Control {...props}>
        {!value || value.length === 0 ? (
          <div
            style={{
              color: "#3f88a5",
              fontWeight: 600,
              fontSize: "13px",
              position: "absolute",
              left: "5px",
              pointerEvents: "none",
            }}
          >
            {placeholder}
          </div>
        ) : (
          <div style={{ color: "#3f88a5", marginLeft: "5px" }}>
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}
        {props.children}
      </components.Control>
    );
  };

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          height: "10%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "40%",
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          {title}
        </div>

        <div style={{ width: "35%" }}>
          <Select
            isMulti
            options={[
              { label: "Renewable", value: "Renewable" },
              { label: "NonRenewable", value: "NonRenewable" },
            ]}
            value={selectedProducts.map((product) => ({
              label: product,
              value: product,
            }))}
            onChange={handleProductChange}
            placeholder="Select Products"
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
            }}
            closeMenuOnSelect={false} // Prevent dropdown from closing
          />
        </div>
      </div>

      <div style={{ height: "85%", marginTop: "5%" }}>
        {energy ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={"100%"}
          />
        ) : (
          <div>Loading...</div> // Show a loading message while data is fetching
        )}
      </div>
    </div>
  );
};

export default YearWiseStacked;
