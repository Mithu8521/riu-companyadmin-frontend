import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Select, { components } from "react-select";
import no from "../../img/no.png";
import VerticalBarVisualizer from "./VerticalBarVisualizer";
import PieChartVisualizer from "./PieChartVisualizer";
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

// Cleaned up function to use throughout the component
const cleanProductTitle = (title) => {
  if (!title) return "";

  // Special case for specific acronyms
  if (title.startsWith("PF (")) {
    return "PF";
  } 

  if (title.startsWith("ESI (")) {
    return "ESI";
  }

  if (title.startsWith("Others (please")) {
    return "Others";
  }

  if (title.startsWith("Groundwater")) {
    return "Ground Water";
  }

  if (title.startsWith("Surface water")) {
    return "Surface Water";
  }

  if (title.startsWith("Third-party water")) {
    return "Third Party Water";
  }

  if (title.startsWith("Municipal water")) {
    return "Municipal Water";
  }

  if (title.startsWith("Seawater / desalinated water")) {
    return "SeaWater/Desalinated Water ";
  }

  if (title.startsWith("Construction and demolition")) {
    return "Construction and Demolition";
  }

  if (
    title.startsWith(
      "Number of permanent employees who received training on the above topic"
    )
  ) {
    return "Permanent";
  }

  if (
    title.startsWith(
      "Number of other than permanent employees who received training on the above topic"
    )
  ) {
    return "Other than Permanent";
  }

  if (title.startsWith("To Surface water")) {
    return "Surface Water";
  }

  if (title.startsWith("To Groundwater")) {
    return "Ground Water";
  }

  if (title.startsWith("To Sea water")) {
    return "Sea Water";
  }

  if (title.startsWith("Sent to other parties")) {
    return "Sent to other Parties";
  }

  if (title.startsWith("Others")) {
    return "Other";
  }

  if (title.startsWith("Other recovery operations")) {
    return "Other Recovery Operation";
  }

  if (title.startsWith("Energy Consumption through other sources")) {
    return "Energy Consumption from Other Source";
  }

  if (
    title.startsWith(
      "Lost Time Injury Frequency Rate (LTIFR) (per one million-person hours worked)"
    )
  ) {
    return "LTIFR";
  }

  if (title.startsWith("Total Recordable Work-Related Injuries")) {
    return "Work Related Injury";
  }

  if (
    title.startsWith(
      "High Consequence Work-Related Injury or Ill-Health (excluding fatalities)"
    )
  ) {
    return "High Consequence Work Related Injury";
  }

  if (title.startsWith("Filed During the Year")) {
    return "Filed During year";
  }

  if (title.startsWith("Pending Resolution at the End of Year")) {
    return "Pending Resolution at the EOY";
  }

  // Handle other acronyms
  const acronymMatch = title.match(/^([A-Z]{2,})\s*\(/);
  if (acronymMatch) {
    return acronymMatch[1];
  }

  // Remove "Total" from the beginning if present
  let cleanedTitle = title.replace(/^Total\s+/i, "");

  // Remove "Number of" from the beginning if present
  cleanedTitle = cleanedTitle.replace(/^Number\s+of\s+/i, "");

  // Remove everything after and including parenthesis if present
  cleanedTitle = cleanedTitle.split(/\s*\(/)[0].trim();

  // Remove everything after and including asterisk (*) if present
  cleanedTitle = cleanedTitle.split("*")[0].trim();

  return cleanedTitle;
};

const TabularDataCalculator = ({
  graphData,
  title,
  com,
  type,
  unit,
  tab,
  DTYPE,
  indexing,
}) => {
  const [visualizationType, setVisualizationType] = useState("bar");

  // Define colors array
  const colors =
    type === "BIO"
      ? [
          "#FFFF00", // Yellow
          "#FF0000", // Red
          "#FFFFFF", // White
          "#0000FF", // Blue
          "#800080", // Cytotoxic (Purple)
          "#0099C6", // Turquoise Blue (keeping remaining colors)
          "#DD4477", // Rose Pink
          "#66AA00", // Lime Green
          "#B82E2E", // Brick Red
          "#316395", // Navy Blue
        ]
      : [
          "#3366CC", // Rich Blue
          "#DD4477", // Rust Red
          "#FF9900", // Amber Orange
          "#109618", // Forest Green
          "#990099", // Royal Purple
          "#0099C6", // Turquoise Blue
          "#DD4477", // Rose Pink
          "#66AA00", // Lime Green
          "#B82E2E", // Brick Red
          "#316395", // Navy Blue
        ];

  const initializedRef = useRef(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({});
  const [minTargets, setMinTargets] = useState({});
  const [maxTargets, setMaxTargets] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalMinTarget, setTotalMinTarget] = useState(0);
  const [totalMaxTarget, setTotalMaxTarget] = useState(0);
  const [actualSum, setActualSum] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const maxProductsAllowed = 5;

  // Get unit based on data type
  const getUnit = () => {
    return "KL";
  };

  // Fix #2: Memoize recoverySeries with proper dependency check
  const recoverySeries = useMemo(() => {
    if (!graphData || graphData.length === 0) {
      return [];
    }

    try {
      const questionDetails = graphData[0]?.question_details || [];

      if (
        com === "COL" ||
        DTYPE === "PERMANENT" ||
        DTYPE === "OPERMANENT" ||
        DTYPE === "OVERALL" ||
        DTYPE === "TRAINING" ||
        type === "SAFETY" ||
        DTYPE === "COMPLAINTS"
      ) {
        return questionDetails
          .filter(
            (detail) =>
              detail.option_type === "column1" ||
              detail.option_type === "column"
          )
          .map((detail) => detail.option)
          .reverse()
          .slice(0, DTYPE === "COMPLAINTS" ? -1 : undefined);
      } else {
        return questionDetails
          .filter((detail) => detail.option_type === "row")
          .map((detail) => detail.option)
          .reverse();
      }
    } catch (error) {
      console.error("Error processing graphData:", error);
      return [];
    }
  }, [graphData, com, DTYPE, type]);

  // Fix #3: Memoize productOptions with proper error handling and apply title cleaning
  const productOptions = useMemo(() => {
    if (!recoverySeries || recoverySeries.length === 0) {
      return [];
    }
  
    return recoverySeries
      .filter(
        (product) =>
          product !==
          "Has any independent assessment, evaluation, or assurance been carried out by an external agency?"
      )
      .map((product, index) => ({
        value: product,
        label: cleanProductTitle(product), // Clean the title for display
        originalLabel: product,            // Store original label for data matching
        color: colors[index % colors.length],
      }));
  }, [recoverySeries, colors]);
  

  // Fix #4: Only initialize selectedProducts once
  useEffect(() => {
    if (!initializedRef.current && productOptions.length > 0) {
      const firstFiveProducts = productOptions.slice(0, maxProductsAllowed);
      setSelectedProducts(firstFiveProducts);
      initializedRef.current = true;
    }
  }, [productOptions, maxProductsAllowed]);

  // Fix #5: Use a stable reference for product selection comparison
  const selectedProductValues = useMemo(() => {
    return selectedProducts.map((product) => product.value);
  }, [selectedProducts]);

  // Fix #6: Memoize the calculation of aggregated data
  const calculateAggregatedData = useCallback(() => {
    if (
      !selectedProducts ||
      selectedProducts.length === 0 ||
      !graphData ||
      !recoverySeries ||
      recoverySeries.length === 0
    ) {
      return {
        aggregated: {},
        minTargetValues: {},
        maxTargetValues: {},
        sum: 0,
        totalMin: 0,
        totalMax: 0,
        maxProductValue: 0,
      };
    }

    const aggregated = {};
    const minTargetValues = {};
    const maxTargetValues = {};

    // Initialize with selected products
    selectedProducts.forEach((product) => {
      aggregated[product.value] = 0;
      minTargetValues[product.value] = 0;
      maxTargetValues[product.value] = 0;
    });

    try {
      const actualData =
        type === "DIV" ? [graphData[graphData.length - 1]] : graphData;

      actualData.forEach((item) => {
        const answers =
          type === "ENE" || type === "EMI"
            ? Array.isArray(item.energyAndEmission)
              ? item.energyAndEmission
              : []
            : Array.isArray(item.answer)
            ? item.answer
            : [];
        const minTargetData = Array.isArray(item.minTarget)
          ? item.minTarget
          : [];
        const maxTargetData = Array.isArray(item.maxTarget)
          ? item.maxTarget
          : [];
        let result;
        if (DTYPE === "OVERALL") {
          result = answers[0].map((val, idx) => {
            const a = Number(answers[0][idx]);
            const b = Number(answers[1][idx]);
            return isNaN(a) || isNaN(b) ? "NA" : (a + b).toString();
          });
        }

        let dataToIterate;

        if (com === "COL" || DTYPE === "PERMANENT") {
          dataToIterate = answers[0] || [];
        } else if (DTYPE === "OPERMANENT" || DTYPE === "COMPLAINTS") {
          if (DTYPE === "COMPLAINTS") {
            dataToIterate = answers[1].slice(0, 2);
          } else {
            dataToIterate = answers[1] || [];
          }
        } else if (DTYPE === "OVERALL") {
          dataToIterate = result || [];
        } else if (DTYPE === "TRAINING") {
          dataToIterate = answers[indexing] || [];
        } else {
          dataToIterate = answers;
        }

        dataToIterate.forEach((answerArray, index) => {
          if (index >= recoverySeries.length) return;

          const recoveryType = recoverySeries[index];
          if (!recoveryType || !selectedProductValues.includes(recoveryType))
            return;

          let value;

          if (
            (answerArray &&
              (com === "COL" ||
                DTYPE === "PERMANENT" ||
                DTYPE === "OPERMANENT" ||
                DTYPE === "OVERALL" ||
                DTYPE === "COMPLAINTS")) ||
            DTYPE === "TRAINING"
          ) {
            value = String(answerArray || 0).trim();
          } else if (type === "EMI") {
            value = String(answerArray[1]).trim();
          } else if (DTYPE === "PMAINTRAINING") {
            value = String(answerArray[answerArray.length - 1]).trim();
          } else if (DTYPE === "PRIMAINTRAINING") {
            const yesCount = answerArray.filter(
              (item) => typeof item === "string" && item.toLowerCase() === "yes"
            ).length;
            value = String(yesCount).trim();
          } else {
            value = String(answerArray[0]).trim();
          }

          const numericValue =
            !value ||
            value === "NA" ||
            value === "No" ||
            value === "Yes" ||
            value === "" ||
            value === "KWH" ||
            value === "NIL" ||
            value === "Data not available"
              ? 0
              : isNaN(parseFloat(value))
              ? 0
              : parseFloat(value);

          const minTargetValue =
            minTargetData.length > 0 && minTargetData[0]?.length > index
              ? parseFloat(minTargetData[0][index]) || 0
              : 0;

          const maxTargetValue =
            maxTargetData.length > 0 && maxTargetData[0]?.length > index
              ? parseFloat(maxTargetData[0][index]) || 0
              : 0;

          if (aggregated[recoveryType] !== undefined) {
            aggregated[recoveryType] += numericValue;
            minTargetValues[recoveryType] += minTargetValue;
            maxTargetValues[recoveryType] += maxTargetValue;
          }
        });
      });

      const sum = Object.values(aggregated).reduce(
        (total, value) => total + value,
        0
      );
      const totalMin = Object.values(minTargetValues).reduce(
        (total, value) => total + value,
        0
      );
      const totalMax = Object.values(maxTargetValues).reduce(
        (total, value) => total + value,
        0
      );

      // Find max value for scale
      const maxProductValue = Math.max(
        ...Object.values(aggregated),
        ...Object.values(maxTargetValues),
        0
      );

      return {
        aggregated,
        minTargetValues,
        maxTargetValues,
        sum,
        totalMin,
        totalMax,
        maxProductValue,
      };
    } catch (error) {
      console.error("Error calculating aggregated data:", error);
      return {
        aggregated: {},
        minTargetValues: {},
        maxTargetValues: {},
        sum: 0,
        totalMin: 0,
        totalMax: 0,
        maxProductValue: 0,
      };
    }
  }, [
    graphData,
    recoverySeries,
    selectedProducts,
    selectedProductValues,
    type,
    DTYPE,
    com,
  ]);

  // Fix #7: Use a single useEffect for all data calculations to prevent cascading updates
  useEffect(() => {
    const {
      aggregated,
      minTargetValues,
      maxTargetValues,
      sum,
      totalMin,
      totalMax,
      maxProductValue,
    } = calculateAggregatedData();

    const chartMaxValue = Math.max(sum, maxProductValue, totalMax);
    let adjustedMaxValue = adjustAndRoundTotalSum(chartMaxValue);
    adjustedMaxValue = adjustedMaxValue < 4 ? 4 : adjustedMaxValue;

    // Fix #8: Batch state updates to prevent multiple re-renders
    setAggregatedData(aggregated);
    setMinTargets(minTargetValues);
    setMaxTargets(maxTargetValues);
    setActualSum(sum);
    setTotalMinTarget(totalMin);
    setTotalMaxTarget(totalMax);
    setTotalSum(sum);
    setMaxValue(adjustedMaxValue);
  }, [calculateAggregatedData]);

  // Rounding function (no changes needed)
  const adjustAndRoundTotalSum = (totalSum) => {
    const thresholds = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000,
    ];

    if (totalSum < 1) {
      if (totalSum < 0.01) {
        return Math.ceil(totalSum * 200) / 200;
      } else if (totalSum < 0.1) {
        return Math.ceil(totalSum * 100) / 100;
      } else {
        return Math.ceil(totalSum * 2) / 2;
      }
    }

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalSum > thresholds[i]) {
        return Math.ceil(totalSum / thresholds[i]) * thresholds[i];
      }
    }

    return totalSum;
  };

  // Fix #9: Use a stable handler for product selection changes
  const handleProductChange = useCallback(
    (selectedOptions) => {
      if (!selectedOptions || selectedOptions.length === 0) {
        alert("You have to select at least 1 option");
        return;
      }

      if (selectedOptions.length > maxProductsAllowed) {
        alert(`You can only select up to ${maxProductsAllowed} products.`);
        return;
      }

      setSelectedProducts(selectedOptions);
    },
    [maxProductsAllowed]
  );

  // Fix #10: Memoize sorted products with proper dependencies
  const getSortedProductsWithColors = useMemo(() => {
    if (!aggregatedData || Object.keys(aggregatedData).length === 0) {
      return [];
    }

    // Create array of [key, value] pairs
    const entries = Object.entries(aggregatedData);

    // Sort by value in descending order
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

    // For BIO type, use fixed color mapping based on the predefined BIO categories
    if (type === "BIO") {
      // Map of BIO categories to their exact colors
      const bioColorMap = {
        Yellow: "#FFFF00", // Yellow
        Red: "#FF0000", // Red
        White: "#FFFFFF", // White
        Blue: "#0000FF", // Blue
        Cytotoxic: "#800080", // Purple
      };

      // Assign colors based on sorted order
      return sortedEntries.map(([key, value], index) => ({
        value: key,
        label: cleanProductTitle(key), // Clean the product title for display
        color: bioColorMap[key] || "#0099C6",
        dataValue: value, // Include the actual value for reference
      }));
    } else {
      // For non-BIO types, assign colors based on sorted order (largest values get first colors)
      return sortedEntries.map(([key, value], index) => ({
        value: key,
        label: cleanProductTitle(key), // Clean the product title for display
        color: colors[index % colors.length],
        dataValue: value, // Include the actual value for reference
      }));
    }
  }, [aggregatedData, colors, type]);

  // Fix #11: Memoize pie chart data
  const pieData = useMemo(() => {
    if (!aggregatedData || Object.keys(aggregatedData).length === 0) {
      return [];
    }

    const data = [];
    let startAngle = 0;

    // Get sorted products to use their colors
    const sortedProducts = getSortedProductsWithColors;

    // Create a mapping for easy color lookup
    const colorMap = {};
    sortedProducts.forEach((product) => {
      colorMap[product.value] = product.color;
    });

    // Create pie chart data with proper angles - MODIFIED: removed filter to include zero values
    Object.entries(aggregatedData).forEach(([key, value]) => {
      // Calculate percentage based on actualSum (avoid division by zero)
      const percentage = actualSum > 0 ? (value / actualSum) * 100 : 0;
      const angle = percentage > 0 ? (percentage / 100) * 360 : 0;
      const endAngle = startAngle + angle;

      data.push({
        key,
        label: cleanProductTitle(key), // Clean the product title for display
        value,
        percentage,
        color: colorMap[key] || colors[0], // Use mapped color or default
        startAngle,
        endAngle,
      });

      // Only update startAngle if this segment actually takes up space
      if (angle > 0) {
        startAngle = endAngle;
      }
    });

    return data;
  }, [aggregatedData, actualSum, getSortedProductsWithColors, colors]);

  // Check if we have data to display
  const noDataToDisplay = useMemo(() => {
    return actualSum === 0 || Object.keys(aggregatedData).length === 0;
  }, [actualSum, aggregatedData]);

  // Custom components for Select
  // const CustomOption = (props) => {
  //   const { isSelected, data } = props;

  //   return (
  //     <components.Option {...props}>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <div
  //           style={{
  //             width: "20px",
  //             height: "20px",
  //             border: "2px solid #3f88a5",
  //             borderRadius: "2px",
  //             backgroundColor: isSelected ? "transparent" : "transparent",
  //             marginRight: "10px",
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //         >
  //           {isSelected && (
  //             <span style={{ color: "white", fontSize: "14px" }}>✔</span>
  //           )}
  //         </div>
  //         <span style={{ fontSize: "14px", fontWeight: 300 }}>
  //           {data.label}
  //         </span>
  //       </div>
  //     </components.Option>
  //   );
  // };

  const CustomClearIndicator = () => null;
  const CustomMultiValue = () => null;

  // Fix #12: Memoize the filtering logic for Select value
  const selectValue = useMemo(() => {
    if (!productOptions || !selectedProducts || selectedProducts.length === 0) {
      return [];
    }

    // Match selected values with options
    return productOptions.filter((option) =>
      selectedProducts.some((selected) => selected.value === option.value)
    );
  }, [productOptions, selectedProducts]);

  // // No data display
  // if (!graphData || graphData.length === 0) {
  //   return (
  //     <div className="container">
  //       <img
  //         src={no}
  //         alt="No Data Available"
  //         style={{
  //           width: "150px",
  //           height: "125px",
  //           display: "block",
  //           margin: "0 auto",
  //         }}
  //       />
  //     </div>
  //   );
  // }

  // Create the currentTriggerValues object
  const currentTriggerValues = {
    minTriggerValue: totalMinTarget,
    maxTriggerValue: totalMaxTarget,
  };

  return (
    <div
      className="renewable-bar-container"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="renewable-bar-header"
        style={{
          height: "10%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            width: "50%",
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          {title}
        </div>
        <div style={{ width: "40%" }}>
          <Select
            options={productOptions}
            onChange={handleProductChange}
            isMulti
            value={selectValue}
            placeholder={`Select products`}
            hideSelectedOptions={false}
            className=""
            components={{
              Option: CustomOption,
              Control: ({ children, ...props }) => (
                <components.Control {...props}>
                  {(!props.selectProps.value ||
                    props.selectProps.value.length === 0) && (
                    <div
                      style={{
                        color: "#3f88a5",
                        fontWeight: 600,
                        fontSize: "13px",
                        position: "absolute",
                        left: "5px",
                        pointerEvents: "none",
                      }}
                    ></div>
                  )}
                  {props.selectProps.value &&
                    props.selectProps.value.length > 0 && (
                      <div
                        style={{
                          color: "#3f88a5",
                          marginLeft: "5px",
                          fontSize: "12px",
                          width: "70%",
                        }}
                      >
                        {/* Use cleaned labels for display */}
                        {cleanProductTitle(
                          props.selectProps.value[0].originalLabel ||
                            props.selectProps.value[0].label
                        )}
                        {props.selectProps.value.length > 1 &&
                          ` +${props.selectProps.value.length - 1} more`}
                      </div>
                    )}
                  {children}
                </components.Control>
              ),
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator,
            }}
            closeMenuOnSelect={false}
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#3f88a5",
                padding: "0 10px",
                fontSize: "20px",
                minHeight: "20px",
                minWidth: "20px",
              }),
              placeholder: (base) => ({
                ...base,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
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
                  ? "transparent"
                  : state.isFocused
                  ? "white"
                  : "white",
                color: state.isSelected ? "black" : "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      {/* Toggle buttons for bar/pie view */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "40px",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "20px",
            cursor: "pointer",
          }}
          onClick={() => setVisualizationType("bar")}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid #3f88a5",
              backgroundColor:
                visualizationType === "bar" ? "#3f88a5" : "transparent",
              marginRight: "8px",
            }}
          />
          <span>Bar View</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setVisualizationType("pie")}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid #3f88a5",
              backgroundColor:
                visualizationType === "pie" ? "#3f88a5" : "transparent",
              marginRight: "8px",
            }}
          />
          <span>Pie View</span>
        </div>
      </div>

      {/* Visualization area */}
      <div style={{ flex: 1, position: "relative" }}>
        {selectedProducts && selectedProducts.length > 0 ? (
          visualizationType === "pie" ? (
            <PieChartVisualizer
              pieData={pieData}
              noDataToDisplay={noDataToDisplay}
              unit={unit}
              height="350px"
            />
          ) : (
            <VerticalBarVisualizer
              selectedProducts={getSortedProductsWithColors}
              aggregatedData={aggregatedData}
              maxValue={maxValue}
              actualSum={actualSum}
              currentTriggerValues={currentTriggerValues}
              unit={unit}
              height="350px"
              tab={tab}
              minTargets={minTargets}
              maxTargets={maxTargets}
            />
          )
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#666",
            }}
          >
            <div>Please select products to display</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabularDataCalculator;
