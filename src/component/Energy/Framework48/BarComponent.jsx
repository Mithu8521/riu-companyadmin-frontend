import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select"; // Import React Select
import { components } from "react-select";

const BarComponent = ({ brief ,type}) => {
  const [totalSum, setTotalSum] = useState(0);
  const [legendSums, setLegendSums] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]); // For storing selected products
  const maxProducts = 5; // Maximum number of products that can be selected

  const memoizedBrief = useMemo(
    () => brief,
    [
      /* dependencies */
    ]
  );

  // Define a color map for the legends
  const colorMap = [
    "#83BBD5", // Color for M1
    "#11546f", // Color for M2
    "#65b1b6", // Color for M3
    "#f1c40f", // Color for M4
    "#8e44ad", // Color for M5
    // Add more colors as needed
  ];

  // Extract the list of product options from the brief data
  const productOptions = useMemo(() => {
    // Get the first available location key (like M1, M2, etc.)
    const firstLocationKey = Object.keys(memoizedBrief?.location || {})[0];
    // If a valid location kebriefy is found, generate product options
    if (firstLocationKey) {
      return Object.keys(memoizedBrief.location[firstLocationKey] || {}).map(
        (product) => ({
          label: product,
          value: product,
        })
      );
    }

    // Return an empty array if no location key is found
    return [];
  }, [memoizedBrief]);

  // Set initial selected products to the first five products only once
  useEffect(() => {
    if (productOptions.length > 0) {
      const initialProducts = productOptions
        .slice(0, maxProducts)
        .map((item) => item.value);
      setSelectedProducts((prevSelected) => {
        // Only update if the current selection is different
        return prevSelected.length === 0 ? initialProducts : prevSelected;
      });
    }
  }, [productOptions]);
  // Function to calculate the total sum for each legend (key)
  useEffect(() => {
    if (brief && brief.time) {
      let filteredKeys = Object.values(brief.time);
      if (type === "FUEL") {
        filteredKeys  = filteredKeys.map(obj => {
          const filteredObj = {};
          Object.keys(obj).forEach(key => {
              if ([
                "Petrol",
                "PNG",
                "LPG",
                "CNG",
                "Diesel",
              ].includes(key)) {
                  filteredObj[key] = obj[key];
              }
          });
          return filteredObj;
      });
      } else if (type === "ELE") {

        filteredKeys  = filteredKeys.map(obj => {
          const filteredObj = {};
          Object.keys(obj).forEach(key => {
              if ([
                "Electricity Power plant (Captive Power Plant - Natural Gas)",
                "GRID electricity",
              ].includes(key)) {
                  filteredObj[key] = obj[key];
              }
          });
          return filteredObj;
      });
      } else if (type === "REW") {
 
        filteredKeys  = filteredKeys.map(obj => {
          const filteredObj = {};
          Object.keys(obj).forEach(key => {
              if ([
                "Total electricity consumption from Renewable energy (rooftop solar)",
                "Total electricity consumption from Renewable energy (via PPA)",
              ].includes(key)) {
                  filteredObj[key] = obj[key];
              }
          });
          return filteredObj;
      });
      }

      const locationData = filteredKeys;

      // Initialize an object to hold the sums for each legend (key)
      const legendTotals = {};

      // Loop through each time object (M1, M2, etc.)
      locationData.forEach((time) => {
        for (const key in time) {
          if (time.hasOwnProperty(key)) {
            const valueArray = time[key];
            const value = Array.isArray(valueArray) ? (valueArray.reduce((acc, curr) => acc + curr, 0)).toFixed(2) : 0;
            legendTotals[key] = Number(Number((legendTotals[key] || 0) + Number(value)).toFixed(2));

          }
        }
      });

      // Update the state only if it has changed
      // if (JSON.stringify(legendTotals) !== JSON.stringify(legendSums)) {
        setLegendSums(legendTotals);
      // }
    }
  }, [brief]);
  const adjustAndRoundTotalSum = (totalSum) => {
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    // Handle values less than 1 (same logic as before)
    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200; // Round to nearest 0.005
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100; // Round to nearest 0.01
      } else {
        return Math.ceil(totalSum * 2) / 2; // Round to nearest 0.5
      }
    }

    // For values greater than or equal to 1, round based on the defined thresholds
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to the next threshold
      }
    }

    // If no threshold is applicable, return the value as is (e.g., for values below 10)
    return totalSum;
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const selectedTotal = Object.keys(legendSums)
        .filter((key) => selectedProducts.includes(key))
        .reduce((sum, key) => sum + (legendSums[key] || 0), 0);

      if (selectedTotal !== totalSum) {
        setTotalSum(adjustAndRoundTotalSum(selectedTotal));
      }
    } else {
      // If no products are selected, set totalSum to the sum of all products
      const total = Object.values(legendSums).reduce(
        (sum, val) => sum + val,
        0
      );
      if (total !== totalSum) {
        setTotalSum(adjustAndRoundTotalSum(total));
      }
    }
  }, [selectedProducts, legendSums]);

  // Filter the legendSums to only include selected products
  const filteredLegendSums = selectedProducts.length
    ? Object.fromEntries(
        Object.entries(legendSums).filter(([key]) =>
          selectedProducts.includes(key)
        )
      )
    : legendSums; // If no products are selected, show all

  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div
            style={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #3f88a5",
                borderRadius: "2px",
                backgroundColor: isSelected ? "transparent" : "transparent",
                marginRight: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Tick mark when selected */}
              {isSelected && (
                <span style={{ color: "white", fontSize: "14px" }}>✔</span>
              )}
            </div>
          </div>

          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 300 }}>
              {data.label}
            </div>
          </div>
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
        {/* Placeholder or selected value */}
        {(!value || value.length === 0) && (
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
            {/* {placeholder} */}
          </div>
        )}
        {/* Display only the first selected product */}
        {value && value.length > 0 && (
          <div
            style={{
              color: "#3f88a5",
              marginLeft: "5px",
              fontSize: "12px",
              width: "70%",
            }}
          >
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;
  return (
    <div className="renewable-bar-container">
      <div
        className="renewable-bar-header"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            height: "10%",
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          Product Wise{" "}
            {type === "FUEL"
              ? "Fuel"
              : type === "ELE"
              ? "Electricity"
              : type === "REW"
              ? "Renewable"
              : ""}{" "}Energy Consumption
        </div>
        <div style={{ marginBottom: "10px", width: "45%" }}>
          <Select
            isMulti
            options={productOptions}
            value={productOptions.filter((option) =>
              selectedProducts.includes(option.value)
            )}
            onChange={(selected) => {
              const selectedValues = selected.map((item) => item.value);

              if (selectedValues.length < 1) {
                alert("You must select at least one product.");
              } else if (selectedValues.length <= maxProducts) {
                setSelectedProducts(selectedValues);
              } else {
                alert(`You can only select up to ${maxProducts} products.`);
              }
            }}
            placeholder={`Select products`}
            hideSelectedOptions={false} // Keep selected options in the dropdown
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator, // Hides the clear button
            }}
            closeMenuOnSelect={false} // Prevent dropdown from closing
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100, // Ensure the menu appears above other elements
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#3f88a5", // Change color of the dropdown arrow
                padding: "0 10px", // Adjust padding for the indicator
                fontSize: "20px", // Increase the font size of the indicator
                minHeight: "20px", // Set a minimum height for the indicator
                minWidth: "20px", // Set a minimum width for the indicator
              }),
              placeholder: (base) => ({
                ...base,
                position: "absolute", // Ensure the placeholder doesn't shift with input
                top: "50%",
                transform: "translateY(-50%)", // Vertically center the placeholder
                pointerEvents: "none", // Disable interaction on the placeholder
              }),
              multiValue: (base) => ({
                ...base,
                background: "transparent",
                border: "2px solid #3f88a5",
                borderRadius: "10px",
                marginTop: "0.5em",
              }),
              option: (provided, state) => ({
                ...provided,

                backgroundColor: state.isSelected
                  ? "transparent" // Selected option background color
                  : state.isFocused
                  ? "white" // Focused option background color
                  : "white", // Default option background color
                color: state.isSelected ? "black" : "black", // Text color based on state
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      {/* Multi-select dropdown for selecting products */}

      <div className="renewable-bar-labels" style={{ marginTop: "-2%" }}>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          0
        </span>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          {(totalSum / 5 / 10) * 10}
        </span>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          {(((totalSum / 5) * 2) / 10) * 10}
        </span>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          {(((totalSum / 5) * 3) / 10) * 10}
        </span>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          {(((totalSum / 5) * 4) / 10) * 10}
        </span>
        <span
          style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
        >
          {(totalSum / 10) * 10}
        </span>
      </div>
      <div className="renewable-bar-dotted-line"></div>

      <div className="renewable-bar" style={{ display: "flex", width: "100%" }}>
        {/* Dividing the bar according to the filtered legend sums */}
        {Object.keys(filteredLegendSums).map((legend, index) => {
          const legendValue = filteredLegendSums[legend];
          if (legendValue === 0) {
            return null;
          }
          const widthPercentage = (legendValue / totalSum) * 100;

          // Only return the div if widthPercentage is greater than 0
          if (widthPercentage > 0) {
            return (
              <div
                key={legend}
                style={{
                  width: `${widthPercentage}%`,
                  backgroundColor: colorMap[index % colorMap.length], // Get color based on index
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 400,
                  position: "relative", // Allow absolute positioning inside the bar
                }}
                title={`${legend}: ${legendValue} GJ`} // Tooltip to show the legend and its value
              >
                <div
                  style={{
                    position: "absolute", // Position the data label inside the bar
                    top: "50%", // Vertically center the label
                    left: "50%", // Horizontally center the label
                    transform: "translate(-50%, -50%)", // Adjust for perfect centering
                    fontSize: "10px", // Smaller font size for the label
                    fontWeight: 600,
                  }}
                >
                  {legendValue} GJ
                </div>
              </div>
            );
          }
          return null; // Return null if widthPercentage is 0
        })}
      </div>

      <div
        className="unit"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "3%",
          marginBottom: "1%",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 400,
            height: "100%",
            padding: "0%",
          }}
        >
          (in GJ)
        </div>
      </div>

      <div
        className="renewable-legends-container"
        style={{
          display: "flex",
          flexWrap: "wrap", // Allow wrapping of legends
          width: "100%",
        }}
      >
        {Object.keys(filteredLegendSums).map((legend, index) => (
          <div
            key={legend}
            className="legend-item"
            style={{
              width: "25%",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              marginRight: "0%",
            }}
          >
            <div
              style={{
                width: "10%",
                display: "flex",
                marginRight: "1%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: colorMap[index % colorMap.length], // Match the color used in the bar
                }}
              ></div>
            </div>

            <div
              style={{
                width: "90%",
                display: "flex",
                alignItems: "flex-start",
                fontSize: "12px",
                justifyContent: "flex-start",
              }}
            >
              {legend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarComponent;
