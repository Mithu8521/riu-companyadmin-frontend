import React, { useState, useEffect } from "react";
import Select, { components } from "react-select"
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const TabularQuestionTrigger = ({

  getTargetQuestionAnswer,




  locationOption, fromDate, toDate, financialYearId, apiMatch, question, locationOptions, selectedLocations, handleSelectionChange, CustomOption, CustomControl, CustomMultiValue, CustomClearIndicator, timePeriodOptions, timePeriod, handlePeriodChange }) => {

  const initialize2DArray = (data) => {
    // Initialize an empty object to track column counts per row
    let columnCounts = {};

    // Iterate through data to determine maximum columns for each row
    data.forEach((item) => {
      if (item.optionType.startsWith("column")) {
        let rowNumber = parseInt(item.optionType.replace("column", ""));
        columnCounts[rowNumber] = (columnCounts[rowNumber] || 0) + 1;
      }
    });

    // Find maximum columns from columnCounts
    let maxColumns = Math.max(...Object.values(columnCounts));

    // Initialize an empty 2D array
    let result = [];

    // Create each row with the determined number of columns
    for (let i = 0; i < Object.keys(columnCounts).length; i++) {
      let row = new Array(maxColumns).fill("");
      result.push(row);
    }

    return result;
  };
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [targetValues, setTargetValues] = useState(
    () => initialize2DArray(question.details)
  );


  useEffect(() => {
    if (apiMatch && apiMatch.targetData) {
      try {
        const parsedData = JSON.parse(apiMatch.targetData);
        setTargetValues(parsedData);
      } catch (error) {
        console.error("Error parsing apiMatch.targetData:", error);
      }
    }
    else {
      setTargetValues(
        Array(question.details.filter((detail) => detail.optionType === "row").length)
          .fill()
          .map(() => Array(question.details.filter((detail) => detail.optionType === "column").length).fill(""))
      );
    }
  }, [apiMatch]);
  const rows = question.details
    .filter((detail) => detail.optionType === "row")
    .reverse();

  const genericColumns = question.details.filter(
    (detail) => detail.optionType === "column"
  );

  const currentRowColumns = question.details
    .filter(
      (detail) =>
        detail.optionType === "column" ||
        detail.optionType === `column${currentRowIndex + 1}`
    )
    .reverse();

  const handleNextRow = () => {
    if (currentRowIndex < rows.length - 1) {
      setCurrentRowIndex((prev) => prev + 1);
    }
  };

  const handlePreviousRow = () => {
    if (currentRowIndex > 0) {
      setCurrentRowIndex((prev) => prev - 1);
    }
  };
  const handleInputChange = (colIndex, value) => {
    setTargetValues((prev) => {
      const updated = [...prev];
      updated[currentRowIndex][colIndex] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}saveSetTargetQuestion`,
      {},
      {
        financialYearId: financialYearId,
        questionId: question.questionId,
        questionTitle: question.title,
        unit: "Number",
        sourceId: locationOption.value,
        fromDate: fromDate,
        toDate: toDate,
        answer:
          Array.isArray(targetValues) &&
            targetValues.length === 1 &&
            Array.isArray(targetValues[0]) &&
            targetValues[0].length === 0
            ? apiMatch?.targetData
            : JSON.stringify(targetValues),
        questionType: question.questionType,
      },
      "POST"
    );
    if (isSuccess) {
      getTargetQuestionAnswer()

    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Select
          isClearable={false}
          options={locationOptions}
          value={selectedLocations}
          onChange={(selectedOptions) => {
            if (selectedOptions.length < 1) {
              alert("Please select at least one option."); // Alert for minimum selection
            } else if (selectedOptions.length > 5) {
              alert("You can select a maximum of 5 options."); // Alert for maximum selection
            } else {
              handleSelectionChange(selectedOptions); // Handle selection change if valid
            }
          }}
          components={{
            Option: CustomOption,
            Control: CustomControl,
            MultiValue: CustomMultiValue,
            ClearIndicator: CustomClearIndicator,
          }}
          closeMenuOnSelect={false} // Prevent dropdown from closing
          styles={{
            container: (base) => ({
              ...base,
              width: "100%", // Make the container occupy 100% width
            }),
            control: (base) => ({
              ...base,
              container: (base) => ({
                ...base,
                width: "100%", // Make the container occupy 100% width
              }),
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

        <Select
          options={timePeriodOptions}
          value={timePeriod}
          onChange={(selectedOptions) => {
            handlePeriodChange(selectedOptions);
          }}
          components={{
            Option: CustomOption,
            Control: CustomControl,
            MultiValue: CustomMultiValue,
            ClearIndicator: CustomClearIndicator,
          }}
          closeMenuOnSelect={false} // Prevent dropdown from closing
          styles={{
            container: (base) => ({
              ...base,
              width: "100%", // Make the container occupy 100% width
            }),
            control: (base) => ({
              ...base,
              border: "2px solid #3f88a5",
              borderRadius: "10px",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 100, // Ensure the menu a ppears above other elements
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

      {/* Grid for Columns and Input Fields */}
      {rows[currentRowIndex]?.option !== "one" && rows[currentRowIndex]?.option !== "1" && <div style={{ border: "2px solid #3f88a5", padding: "10px 20px", borderRadius: "10px", fontSize: "16px", fontWeight: 600, width: "33%", marginBottom: "25px" }}>
        {rows[currentRowIndex]?.option}
      </div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {currentRowColumns
          .filter(column => column.option !== "one") // Exclude columns where option is "one"
          .map((column, index) => (
            <React.Fragment key={index}>
              {/* Column Name */}
              <div style={{ fontWeight: 400, textAlign: "center" }}>
                {column.option}
              </div>
              {/* Input Field */}
              <input
                type="text"
                placeholder="Enter target"
                value={targetValues[currentRowIndex][index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              />
            </React.Fragment>
          ))}

      </div>

      {/* Navigation Buttons */}
      {rows.length > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
          <button
            onClick={handlePreviousRow}
            disabled={currentRowIndex === 0}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor: currentRowIndex === 0 ? "#ccc" : "#3f88a5",
              color: "#fff",
              borderRadius: "4px",
              cursor: currentRowIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNextRow}
            disabled={currentRowIndex === rows.length - 1}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor:
                currentRowIndex === rows.length - 1 ? "#ccc" : "#3F88A5",
              color: "#fff",
              borderRadius: "4px",
              cursor:
                currentRowIndex === rows.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3f88a5",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default TabularQuestionTrigger;
