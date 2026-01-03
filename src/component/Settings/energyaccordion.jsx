import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import TabularQuestionTrigger from "./Components/TabularQuestionTrigger";
import CustomOption from "../Company Sub Admin/Component/ESGDownload/CustomOption";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function EnergyAccordion({ item, questions }) {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [timePeriod, setTimePeriod] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState();
  const [error, setError] = useState(false);
  const [financialYear, setFinancialYear] = useState(null);
  const [target, setTarget] = useState("");
  const [meterList, setMeterList] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [financialYearId, setFinancialYearId] = useState();
  const [locationOption, setLocationOption] = useState([]);
  const [identifier, setIdentifier] = useState();
  const [fromDate, setFromDate] = useState("");
  const [apiData, setApiData] = useState("");

  const [toDate, setToDate] = useState("");

  const start = JSON.parse(localStorage.getItem("currentUser")).starting_month;

  const handleSelectionChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      // If all options are deselected (including "All"), clear the selection
      setLocationOption([]);
      setSelectedLocations([]);
    } else {
      // Otherwise, just set the selected options normally
      setLocationOption(selectedOptions);
      setSelectedLocations(selectedOptions);
    }
  };

  const [timePeriodOptions, setTimePeriodOptions] = useState([]);

  useEffect(() => {
    getFinancialYear();
    getSource();
  }, []);

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      const options = parsedData.map((year) => ({
        label: year.financial_year_value,
        value: year.id,
      }));
      
      setFinancialYear(options);
      const lastEntry = options[options.length - 1];
      setSelectedYear(lastEntry.label); // Set initial value
      setFinancialYearId(lastEntry.value); // Set ID for last entry
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {},
        "GET"
      );
      
      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        const options = data.data.map((year) => ({
          label: year.financial_year_value,
          value: year.id,
        }));
        
        setFinancialYear(options);
        const lastEntry = options[options.length - 1];
        setSelectedYear(lastEntry.label); // Set initial value
        setFinancialYearId(lastEntry.value); // Set ID for last entry
      }
    }
  };

  const getFrequency = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: financialYearId },
      "GET"
    );
    if (isSuccess) {
      setIdentifier(data.data);
    }
  };

  const getTargetQuestionAnswer = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTargetQuestionAnswer`,
      {},
      { financialYearId: financialYearId },
      "GET"
    );
    if (isSuccess) {
      setApiData(data.answers);
    }
  };
  useEffect(() => {
    if (financialYearId) {
      getFrequency();
      getTargetQuestionAnswer();
    }
  }, [financialYearId]);

  useEffect(() => {
    if (identifier) {
      let options = [];
      if (identifier === "MONTHLY") {
        const options =
          start === 1
            ? months
            : [...months.slice(start - 1), ...months.slice(0, start - 1)];

        // Map options to { label, value } format
        const formattedOptions = options.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1, // Ensures values cycle correctly from 1 to 12
        }));

        setTimePeriodOptions(formattedOptions); // Update state
      } else if (identifier === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${months[(quarterEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (identifier === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${months[(halfEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: half, value: options.length + 1 });
          setTimePeriodOptions(options);
        }
      } else if (identifier === "YEARLY") {
        const yearlyStartIndex = start - 1;
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${months[(yearlyStartIndex - 1 + 12) % 12]
              }`,
            value: 1,
          },
        ];
        setTimePeriodOptions(options);
      }
    }
  }, [identifier, start]);
  
  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const locationArray = data?.data?.reverse().map((item) => ({
        id: item.id,
        unitCode: item?.unitCode,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      setMeterList(locationArray);
    }
  };

  const handleSave = async (question, apiMatch) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}saveSetTargetQuestion`,
      {},
      {
        financialYearId: financialYearId,
        questionId: question.questionId,
        questionTitle: question.title,
        unit: question?.details[0]?.option || "kg",

        sourceId: locationOption.value,
        fromDate: fromDate,
        toDate: toDate,
        answer: target === "" ? apiMatch?.targetData : target,
        questionType: question.questionType,
      },
      "POST"
    );
    if (isSuccess) {
      getTargetQuestionAnswer()
    }
  };

  const locationOptions = [
    ...meterList.map((item) => ({
      value: item.id,
      label: item.location,
      unitCode: item?.unitCode,
      id: item?.id,
    })),
  ];

  // const handleSave = () => {
  //   // Add save logic here
  //   console.log("hellloo save", fromDate, toDate, financialYearId, selectedLocations, target);
  // };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };



  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value, placeholder } = selectProps;

    // Function to render the label based on conditions
    const renderLabel = () => {
      if (value && value.length > 0) {
        const label = value[0].label;
        if (label.includes(",")) {
          const words = label.split(",").map((word) => word.trim());
          const secondWord = words[1] || ""; // Get the second word or an empty string if it doesn't exist
          const fourthLastWord = words[words.length - 4] || ""; // Get the fourth last word or an empty string if it doesn't exist
          return `${secondWord}, ${fourthLastWord}`.trim(); // Return the formatted label
        } else {
          return label; // Return the label as is
        }
      }
      return ""; // Return an empty string if no value
    };

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
          ></div>
        )}
        {/* Display the processed selected value */}
        {value && value.length > 0 && (
          <div style={{ color: "#3f88a5", marginLeft: "5px" }}>
            {renderLabel()} {/* Call the renderLabel function */}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  const handlePeriodChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      selectedOptions = [];
    }

    setTimePeriod(selectedOptions);
    const year = parseInt(selectedYear.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    let dateRange;

    if (identifier === "HALF_YEARLY") {
      const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

      // Extract the first month from the selectedOption
      const firstMonthName = selectedOptions.label.split("-")[0].trim(); // Assuming `label` contains something like "Apr - Jun"

      // Find the index of the first month from the months array
      const firstMonthIndex = months.indexOf(firstMonthName);

      // Check if the 6 months later month and first month match the condition
      const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;

      dateRange = calculateDateRange(6, halfYear, start, year);
    } else if (identifier === "QUARTERLY") {
      // Extract the first month from the selectedOption
      const firstMonthName = selectedOptions.label.split(" ")[0].trim();

      // Find the index of the first month from the months array
      const firstMonthIndex = months.indexOf(firstMonthName);

      // Determine the quarter based on the start month and the selectedOption first month
      const quarter = Math.floor(firstMonthIndex / 3) + 1;

      dateRange = calculateDateRange(3, quarter, start, year);
    } else if (identifier === "MONTHLY") {
      // Extract the first month from the selectedOption
      const firstMonthName = selectedOptions.label.split(" ")[0].trim();

      // Find the index of the starting month (start - 1 since arrays are 0-indexed)
      const startIndex = start - 1;

      // Find the index of the first month name in the months array
      const firstMonthAbsoluteIndex = months.indexOf(firstMonthName);

      // Calculate the relative index from the start
      const firstMonthIndex =
        ((firstMonthAbsoluteIndex - startIndex + months.length) %
          months.length) +
        1; // Add 1 to make it 1-based index

      dateRange = calculateDateRange(1, firstMonthIndex, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }

    if (dateRange) {
      // Update earliest and latest dates
      if (
        !earliestFromDate ||
        new Date(dateRange.fromDate) < new Date(earliestFromDate)
      ) {
        earliestFromDate = dateRange.fromDate;
      }
      if (
        !latestToDate ||
        new Date(dateRange.toDate) > new Date(latestToDate)
      ) {
        latestToDate = dateRange.toDate;
      }
    }

    setFromDate(earliestFromDate);
    setToDate(latestToDate);
    // setTimePeriods(newTimePeriods);
  };

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by question title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "70%",
            padding: "10px",
            border: "2px solid #3f88a5",
            borderRadius: "10px",
          }}
        />

        {/* Financial Year Select */}
        {financialYearId && selectedYear && (
          <Select
            options={financialYear} // Options from the API
            value={financialYear.find(
              (option) => option.value === financialYearId
            )} // Find the selected option based on selectedYear
            onChange={(selectedOption) => {
              setSelectedYear(selectedOption.label); // Update selectedYear with the selected option's value
              setFinancialYearId(selectedOption.value); // Set financialYearId based on the selected option
            }}
            styles={{
              container: (base) => ({
                ...base,
                width: "30%",
                padding: "10px", // Set container width to 30%
              }),
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
                padding: " 10px",
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
        )}
      </div>
      {questions &&
        questions.length &&
        questions &&
        apiData &&
        questions
          .filter((question) => {
            console.log("Current Question:", question); // Log each question object
            return (
              searchTerm === "" ||
              (question?.title &&
                question.title.toLowerCase().includes(searchTerm.toLowerCase()))
            );
          })
          .map((question, index) => {
            const apiMatch = apiData.find(
              (data) =>
                data.questionId === question.questionId &&
                data.fromDate === fromDate &&
                data.sourceId === (selectedLocations?.value || "")
            );
            console.log("klo", apiMatch, apiData);

            return (
              <div
                key={question.questionId}
                className="accordion-item"
                style={{ marginBottom: "25px" }}
              >
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion(index)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "#bfd7e0",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    padding: "20px 30px",
                  }}
                >
                  <div style={{ fontSize: "18px" }}>{question.title}</div>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ cursor: "pointer" }}>
                      {activeAccordion === index ? "-" : "+"}
                    </div>
                  </div>
                </div>
                {activeAccordion === index && (
                  <>
                    {question.questionType !== "tabular_question" ? (
                      // Code to render if questionType is NOT "tabular_question"
                      <>
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "20px",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem",
                          }}
                        >
                          {/* Time Period Select */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "30%",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{ fontSize: "20px", marginBottom: "5px" }}
                            >
                              Select Time Period
                            </div>
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
                            {error && !timePeriod && (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                Please select a time period.
                              </div>
                            )}
                          </div>

                          {/* Location Select */}
                          {meterList && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "30%",
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "20px",
                                  marginBottom: "5px",
                                }}
                              >
                                Select Location
                              </div>
                              <Select
                                isClearable={false}
                                options={locationOptions}
                                value={selectedLocations}
                                onChange={(selectedOptions) => {
                                  if (selectedOptions.length < 1) {
                                    alert("Please select at least one option."); // Alert for minimum selection
                                  } else if (selectedOptions.length > 5) {
                                    alert(
                                      "You can select a maximum of 5 options."
                                    ); // Alert for maximum selection
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
                              {error && !selectedLocations && (
                                <div
                                  style={{
                                    color: "red",
                                    fontSize: "14px",
                                    marginTop: "5px",
                                  }}
                                >
                                  Please select at least one location.
                                </div>
                              )}
                            </div>
                          )}

                          {/* Target Input */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "30%",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{ fontSize: "20px", marginBottom: "5px" }}
                            >
                              Target
                            </div>
                            <input
                              type="number"
                              value={
                                target !== undefined && target !== ""
                                  ? target
                                  : apiMatch?.targetData || ""
                              }
                              onChange={(e) => {
                                // Update the target state when the input changes
                                setTarget(e.target.value);
                              }}
                              placeholder="Enter The Number"
                              style={{
                                padding: "8px",
                                border: "1px solid #cbd5e0",
                                borderRadius: "4px",
                                width: "100%",
                                border: "1px solid #3f88a5",
                                borderRadius: "10px",
                              }}
                            />
                            {error && !target && target.trim() === "" && (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                Please input a value.
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0px 1rem",
                          }}
                        >
                          <button
                            style={{
                              marginTop: "10px",
                              backgroundColor: "white",
                              color: "#3f88a5",
                              padding: "8px 30px",
                              border: "1px solid #3f88a5",
                              borderRadius: "4px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#3f88a5",
                              color: "white",
                              padding: "8px 30px",
                              border: "none",
                              borderRadius: "4px",
                            }}
                            onClick={() => {
                              // Check if any required fields are empty
                              if (
                                !selectedLocations ||
                                !fromDate ||
                                !toDate ||
                                (!apiMatch?.targetData && target.trim() === "")
                              ) {
                                // alert("Please fill out all fields (Target, Location, and Time Period) before saving.");
                                setError(true);
                              } else {
                                // Call the save handler if all fields are valid
                                handleSave(question, apiMatch);
                              }
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      // Code to render if questionType is "tabular_question"
                      <TabularQuestionTrigger
                        getTargetQuestionAnswer={
                          getTargetQuestionAnswer

                        }



                        handlePeriodChange={handlePeriodChange} locationOption={locationOption} apiMatch={apiMatch} CustomOption={CustomOption} timePeriod={timePeriod} timePeriodOptions={timePeriodOptions} CustomClearIndicator={CustomClearIndicator} CustomMultiValue={CustomMultiValue} CustomControl={CustomControl} handleSelectionChange={handleSelectionChange} selectedLocations={selectedLocations} locationOptions={locationOptions} question={question} financialYearId={financialYearId} fromDate={fromDate} toDate={toDate} />
                    )}
                  </>
                )}
              </div>
            );
          })}
    </div>
  );
}

export default EnergyAccordion;
