import { TitleRounded } from "@material-ui/icons";
import React, { useEffect, useState, useMemo } from "react";
import Select, { components } from "react-select";
import no from "../../../img/no.png";

const BarComponentWater = ({ matchedDataWater, title, com }) => {
  const colors = ["#83bbd5", "#11546f", "#65b1b6", "#4a849f", "#86caea"]; // Define colors for each category

  const [selectedProducts, setSelectedProducts] = useState([]);

  const recoverySeries = useMemo(() => {
    if (matchedDataWater) {
      if (com === "non") {
        return (
          matchedDataWater[0]?.question_details
            .filter(
              (detail) =>
                detail.option_type === "row" || detail.option_type === "row"
            )
            // .slice()
            .map((detail) => detail.option)
            .reverse()
        );
      } else {
        return (
          matchedDataWater[0]?.question_details
            .filter(
              (detail) =>
                detail.option_type === "row" || detail.option_type === "row"
            )
            // .slice(1)
            .map((detail) => detail.option)
            .reverse()
        );
      }
    }
  }, [matchedDataWater]);

  const productOptions = useMemo(() => {
    if (recoverySeries) {
      return recoverySeries.map((product, index) => ({
        value: product,
        label: product,
        color: colors[index % colors.length], // Assign a color to each product
      }));
    }
  }, [recoverySeries]);

  // Set selectedProducts to the first 5 options
  useEffect(() => {
    if (productOptions) {
      if (productOptions.length > 0) {
        const firstFiveProducts = productOptions.slice(0, 5);
        const productLabels = firstFiveProducts.map((product) => product.label);
        setSelectedProducts(firstFiveProducts);
      }
    }
  }, [productOptions]);

  const [aggregatedData, setAggregatedData] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const CustomClearIndicator = () => null;

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const aggregated = selectedProducts.reduce((acc, product) => {
        acc[product.value] = 0; // Initialize each product value to 0
        return acc;
      }, {});

      const dataSource = com === "non" ? matchedDataWater : matchedDataWater;

      dataSource.forEach((item) => {
        const answers =
          item.answer && Array.isArray(item.answer) ? item.answer : [];

        answers.forEach((answerArray, index) => {
          const recoveryType = recoverySeries[index];
          const value = answerArray[0]; // First element corresponds to recoverySeries value

          // Apply conditions to check and parse value
          const numericValue =
            value === "NA" ||
            value === "No" ||
            value === "Yes" ||
            value === "" ||
            value === "KWH" ||
            !value
              ? 0
              : parseFloat(value);

          // Only aggregate if the recoveryType is in selectedProducts
          if (
            selectedProducts.some((product) => product.label === recoveryType)
          ) {
            aggregated[recoveryType] += numericValue;
          }
        });
      });

      const sum = Object.values(aggregated).reduce(
        (total, value) => total + value,
        0
      );

      setAggregatedData(aggregated);
      const adjustAndRoundTotalSum = (totalSum) => {
        // Define the thresholds or rounding steps
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
            // Debugging step: log the threshold and the result of rounding up
            console.log(
              `Rounding ${totalSum} up to the next threshold: ${thresholds[i]}`
            );
            return Math.ceil(totalSum / thresholds[i]) * thresholds[i]; // Round up to the next threshold
          }
        }

        // If no threshold is applicable, return the value as is (e.g., for values below 10)
        return totalSum;
      };
      setTotalSum(adjustAndRoundTotalSum(sum));
    }
  }, [selectedProducts]);

  const formatValue = (value) => {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    } else {
      return Math.round(value); // Format normal numbers
    }
  };
  const handleProductChange = (selectedOptions) => {
    if (selectedOptions.length > 5) {
      alert("You can only select up to 5 products.");
      return;
    }

    if (selectedOptions.length < 1) {
      alert("You have to select atleast 1 option");
      return;
    }

    setSelectedProducts(selectedOptions || []);
  };

  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Square Box */}
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
          {/* Option Label */}
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
          <div style={{ color: "#3f88a5", marginLeft: "5px" }}>
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  const roundToSignificantFigures = (num) => {
    if (num === 0) return 0; // If num is 0, return 0

    const exponent = Math.floor(Math.log10(Math.abs(num))); // Get the order of magnitude
    const factor = Math.pow(10, exponent); // Calculate the rounding factor
    const rounded = Math.round(num / factor) * factor; // Round to the nearest significant figure

    return rounded;
  };
  if (!matchedDataWater || matchedDataWater.length === 0) {
    return (
      <div className="container">
        <img
          src={no} // Replace with the actual image path or URL
          alt="No Data Available"
          style={{
            width: "150px",
            height: "125px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }
  return (
    <div className="renewable-bar-container" style={{ height: "100%" }}>
      <div
        className="renewable-bar-header"
        style={{
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {com === "non" ? (
          <div style={{ width: "40%" }}> {title}</div>
        ) : (
          <div style={{ width: "40%" }}> {title}</div>
        )}
        <div style={{ width: "40%" }}>
          <Select
            options={productOptions}
            onChange={handleProductChange}
            isMulti
            value={productOptions.filter((option) =>
              selectedProducts.some(
                (selectedProduct) => selectedProduct.value === option.value
              )
            )}
            placeholder={`Select products`}
            hideSelectedOptions={false} // Keep selected options in the dropdown
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator,
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

      {selectedProducts && selectedProducts.length > 0 && (
        <>
          <div className="renewable-bar-labels" style={{ marginTop: "5%" }}>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue(roundToSignificantFigures(0))}
            </span>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue(roundToSignificantFigures(totalSum / 5))}
            </span>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue(roundToSignificantFigures((totalSum / 5) * 2))}
            </span>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue((totalSum / 5) * 3)}
            </span>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue((totalSum / 5) * 4)}
            </span>
            <span
              style={{ fontSize: "11px", fontWeight: "bold", fontSize: "12px" }}
            >
              {formatValue(roundToSignificantFigures(totalSum))}
            </span>
          </div>
          <div className="renewable-bar-dotted-line"></div>

          <div className="renewable-bar">
            {selectedProducts
              .map((product) => ({
                recoveryType: product.value,
                value: aggregatedData[product.value] || 0,
                color: product.color,
              }))
              .sort((a, b) => a.value - b.value) // Sort in ascending order
              .map(({ recoveryType, value, color }, index) => {
                // Calculate widthPercentage using the raw value
                const widthPercentage =
                  totalSum > 0 ? (value / totalSum) * 100 : 0;

                const barColor = colors[index % colors.length]; // Use color based on index

                const displayRecoveryType =
                  recoveryType === "Seawater / desalinated water"
                    ? "Seawater"
                    : recoveryType === "Sent to other parties"
                    ? "Other Parties"
                    : recoveryType === "Other disposal operations"
                    ? "Other"
                    : recoveryType;

                return (
                  <div
                    className="renewable-bar-section"
                    key={index}
                    title={`${displayRecoveryType}: ${value.toFixed(2)} `}
                    style={{
                      width: `${widthPercentage}%`, // Use raw value for width
                      backgroundColor: color,
                      display: "inline-block",
                      fontSize: "12px",
                      color: "white",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {/* Display value on top of the bar */}
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                     {formatValue(value)}{" "}
                    </span>
                  </div>
                );
              })}
          </div>

          <div
            className="unit"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "5%",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                height: "100%",
                padding: "10%",
              }}
            >
              (in KL)
            </div>
          </div>
          <div
            className="renewable-legends-container"
            style={{ width: "100%", marginTop: "5%", display: "flex" }}
          >
            {selectedProducts
              .map((product) => ({
                recoveryType: product.value,
                value: aggregatedData[product] || 0,
                color: product.color,
              }))
              .sort((a, b) => b.value - a.value) // Sort in descending order
              .map(({ recoveryType, value, color }, index) => {
                const displayRecoveryType =
                  recoveryType === "Energy Consumption through other sources"
                    ? "Other Source"
                    : recoveryType;

                return (
                  <div
                    className="renewable-legend"
                    key={index}
                    style={{ display: "flex", width: "25%" }}
                  >
                    <div
                      style={{
                        width: "20%",
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        className="renewable-legend-color"
                        style={{
                          display: "inline-block",
                          width: "17px",
                          height: "17px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: "10px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        width: "80%",
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        {displayRecoveryType}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default BarComponentWater;
