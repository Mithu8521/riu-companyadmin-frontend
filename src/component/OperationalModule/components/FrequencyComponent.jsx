import React, { useState, useEffect } from "react";
import { Form, Dropdown, Button, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import HistoryAnswerModal from "./HistoryAnswerModal";
import CustomOption from "../../Company Sub Admin/Component/ESGDownload/CustomOption";

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

const FrequencyComponent = ({
  sourceData,
  answer,
  setAnswer,
  startingMonth,
  item,
  handlePeriodSelect,
  selectedPeriod,
  financialYear,
  setFromDate,
  setToDate,
  assignedToDetails,
  currentUserId,
  matchingAuditors,
  menu,
  setSourceChange,
  historyAnswer,
  questionType,
}) => {
  const [timePeriod, setTimePeriod] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const start = JSON.parse(localStorage.getItem("currentUser")).starting_month;
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handlePeriodChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      selectedOptions = [];
    }

    setTimePeriod(selectedOptions);
    const year = parseInt(financialYear?.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    let dateRange;
    let value = selectedOptions.value;

    if (item.answerFrequency === "HALF_YEARLY") {
      dateRange = calculateDateRange(6, value, start, year);
    } else if (item.answerFrequency === "QUARTERLY") {
      dateRange = calculateDateRange(3, value, start, year);
    } else if (item.answerFrequency === "MONTHLY") {
      const firstMonthName = selectedOptions.label?.split(" ")[0].trim();
      const startIndex = start - 1;
      const firstMonthAbsoluteIndex = months.indexOf(firstMonthName);
      const firstMonthIndex =
        ((firstMonthAbsoluteIndex - startIndex + months.length) %
          months.length) +
        1; 
      dateRange = calculateDateRange(1, firstMonthIndex, start, year);
    } else if (item.answerFrequency === "YEARLY") {
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
  };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  


  const [meterList, setMeterList] = useState([]);
  const formatDate = (year, month) => {
    const formattedMonth = month.toString().padStart(2, "0"); // Ensure two digits for the month
    return `${year}-${formattedMonth}`;
  };

  useEffect(() => {
    if (sourceData) {
      const locationArray = sourceData?.reverse().map((item) => ({
        id: item.id,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
        unitCode: item?.unitCode,
      }));
      if (locationArray && locationArray.length) {
        setMeterList(locationArray);

        setSourceChange(locationArray[0]?.id);
        setAnswer((prevAnswer) => ({
          ...prevAnswer,
          sourceId: locationArray[0]?.id,
        }));
      }
    }
  }, [sourceData]);

  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value, placeholder } = selectProps;

    // Function to render the label based on conditions
    const renderLabel = () => {
      if (value && value.length > 0) {
        const label = value[0].label;
        if (label.includes(",")) {
          const words = label?.split(",").map((word) => word.trim());
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

  // After setTimePeriodOptions(...)
  useEffect(() => {
    if (timePeriodOptions.length && !timePeriod?.length) {
      const currentMonth = new Date().getMonth() + 1;
      if (item.answerFrequency === "MONTHLY") {
        const defaultOption = timePeriodOptions.find(
          (opt) => opt.value === currentMonth
        );
        if (defaultOption) {
          setTimePeriod([defaultOption]);
          handlePeriodChange(defaultOption);
        }
      } else if (item.answerFrequency === "QUARTERLY") {
        const currentQ = Math.ceil(currentMonth / 3);
        if (timePeriodOptions[currentQ - 1]) {
          setTimePeriod([timePeriodOptions[currentQ - 1]]);
          handlePeriodChange(timePeriodOptions[currentQ - 1]);
        }
      }
    }
  }, [timePeriodOptions]);

  useEffect(() => {
    if (item.answerFrequency) {
      let options = [];
      if (item.answerFrequency === "MONTHLY") {
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
      } else if (item.answerFrequency === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${
            months[(quarterEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (item.answerFrequency === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${
            months[(halfEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: half, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (item.answerFrequency === "YEARLY") {
        const yearlyStartIndex = start - 1;
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${
              months[(yearlyStartIndex - 1 + 12) % 12]
            }`,
            value: 1,
          },
        ];
        setTimePeriodOptions(options);
      }
    }
  }, [item, start]);

  const calculateMonthYear = (baseYear, baseMonth, monthOffset) => {
    const adjustedMonth = ((baseMonth - 1 + monthOffset) % 12) + 1;
    const yearOffset = Math.floor((baseMonth - 1 + monthOffset) / 12);
    const adjustedYear = baseYear + yearOffset;
    return { year: adjustedYear, month: adjustedMonth };
  };

  const calculateDates = (period) => {
    const [startYear, endYear] =
      financialYear && financialYear?.split("-").map(Number);
    let baseYear = startYear;
    let baseMonth = startingMonth;

    let fromDate, toDate; // Declare variables to store fromDate and toDate

    switch (period) {
      // Monthly cases
      case "M1":
        const m1 = calculateMonthYear(baseYear, baseMonth, 0);
        fromDate = formatDate(m1.year, m1.month);
        toDate = formatDate(m1.year, m1.month + 1);
        break;

      case "M2":
        const m2 = calculateMonthYear(baseYear, baseMonth, 1);
        fromDate = formatDate(m2.year, m2.month);
        toDate = formatDate(m2.year, m2.month + 1);
        break;

      case "M3":
        const m3 = calculateMonthYear(baseYear, baseMonth, 2);
        fromDate = formatDate(m3.year, m3.month);
        toDate = formatDate(m3.year, m3.month + 1);
        break;

      case "M4":
        const m4 = calculateMonthYear(baseYear, baseMonth, 3);
        fromDate = formatDate(m4.year, m4.month);
        toDate = formatDate(m4.year, m4.month + 1);
        break;

      case "M5":
        const m5 = calculateMonthYear(baseYear, baseMonth, 4);
        fromDate = formatDate(m5.year, m5.month);
        toDate = formatDate(m5.year, m5.month + 1);
        break;

      case "M6":
        const m6 = calculateMonthYear(baseYear, baseMonth, 5);
        fromDate = formatDate(m6.year, m6.month);
        toDate = formatDate(m6.year, m6.month + 1);
        break;

      case "M7":
        const m7 = calculateMonthYear(baseYear, baseMonth, 6);
        fromDate = formatDate(m7.year, m7.month);
        toDate = formatDate(m7.year, m7.month + 1);
        break;

      case "M8":
        const m8 = calculateMonthYear(baseYear, baseMonth, 7);
        fromDate = formatDate(m8.year, m8.month);
        toDate = formatDate(m8.year, m8.month + 1);
        break;

      case "M9":
        const m9 = calculateMonthYear(baseYear, baseMonth, 8);
        fromDate = formatDate(m9.year, m9.month);
        toDate = formatDate(m9.year, m9.month + 1);
        break;

      case "M10":
        const m10 = calculateMonthYear(baseYear, baseMonth, 9);
        fromDate = formatDate(m10.year, m10.month);
        toDate = formatDate(m10.year, m10.month + 1);
        break;

      case "M11":
        const m11 = calculateMonthYear(baseYear, baseMonth, 10);
        fromDate = formatDate(m11.year, m11.month);
        toDate = formatDate(m11.year, m11.month + 1);
        break;

      case "M12":
        const m12 = calculateMonthYear(baseYear, baseMonth, 11);
        fromDate = formatDate(m12.year, m12.month);
        toDate = formatDate(m12.year, m12.month + 1);
        break;

      // Quarterly cases
      case "Q1":
        fromDate = formatDate(baseYear, baseMonth);
        toDate = formatDate(
          baseMonth + 3 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 3 > 12 ? baseMonth + 3 - 12 : baseMonth + 3
        );
        break;

      case "Q2":
        fromDate = formatDate(
          baseMonth + 3 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 3 > 12 ? baseMonth + 3 - 12 : baseMonth + 3
        );
        toDate = formatDate(
          baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
        );
        break;

      case "Q3":
        fromDate = formatDate(
          baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
        );
        toDate = formatDate(
          baseMonth + 9 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 9 > 12 ? baseMonth + 9 - 12 : baseMonth + 9
        );
        break;

      case "Q4":
        fromDate = formatDate(
          baseMonth + 9 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 9 > 12 ? baseMonth + 9 - 12 : baseMonth + 9
        );
        toDate = formatDate(
          baseYear + 1,
          baseMonth === 1 ? 1 : ((baseMonth - 1 + 12) % 12) + 1
        );
        break;

      // Half-yearly cases
      case "H1":
        fromDate = formatDate(baseYear, baseMonth);
        toDate = formatDate(
          baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
        );
        break;

      case "H2":
        fromDate = formatDate(
          baseMonth + 6 > 12 ? baseYear + 1 : baseYear,
          baseMonth + 6 > 12 ? baseMonth + 6 - 12 : baseMonth + 6
        );
        toDate = formatDate(
          baseYear + 1,
          baseMonth === 1 ? 1 : ((baseMonth - 1 + 12) % 12) + 1
        );
        break;

      // Yearly case
      case "Y1":
        fromDate = formatDate(baseYear, baseMonth);
        toDate = formatDate(baseYear + 1, baseMonth);
        break;

      default:
        fromDate = "";
        toDate = "";
        break;
    }
    return { fromDate, toDate };
  };

  useEffect(() => {
    if (selectedPeriod && financialYear) {
      const { fromDate, toDate } = calculateDates(selectedPeriod);

      // Only update the state if the values have changed
      setFromDate((prev) => (prev !== fromDate ? fromDate : prev));
      setToDate((prev) => (prev !== toDate ? toDate : prev));
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        fromDate:
          prevAnswer.fromDate !== fromDate ? fromDate : prevAnswer.fromDate,
        toDate: prevAnswer.toDate !== toDate ? toDate : prevAnswer.toDate,
      }));
    }
  }, [selectedPeriod]);

  const handleHistoryClose = () => setShowHistoryModal(false);

  return (
    <>
      <div style={{ width: "30%" }}>
        <div className="d-flex">
          <div className="mx-1">
            <Form.Group controlId="formInput10">
              <Form.Label className="custom-label">
                Reporting Period Selection
              </Form.Label>
              <div className="select-wrapper">
                {item?.frequency === "ONE_TIME" ||
                item?.frequency === "EVERY_FY" ? (
                  <Form.Control
                    type="text"
                    value={
                      item?.frequency === "ONE_TIME"
                        ? "One Time"
                        : item?.frequency === "EVERY_FY"
                        ? "Every Financial Year"
                        : item?.frequency
                    }
                    readOnly
                    style={{
                      backgroundColor: "#Dfebef",
                      color: "black",
                    }}
                  />
                ) : item?.frequency === "CUSTOM" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      alignItems: "flex-start",
                    }}
                  >
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
                      closeMenuOnSelect={true} // Prevent dropdown from closing
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
                  </div>
                ) : null}
              </div>
            </Form.Group>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          textAlign: "right",
          marginTop: "25px",
        }}
      >
        <Button
          variant=""
          style={{
            padding: "8px 30px",
            marginRight: 0,
            backgroundColor: "transparent",
            borderRadius: "5px",
            borderColor: "#3F88A5",
            fontSize: "14px",
            fontFamily: "Open Sans",
            fontWeight: "700",
          }}
          onClick={() => setShowHistoryModal(true)}
        >
          History
        </Button>
      </div>

      <HistoryAnswerModal
        showHistoryModal={showHistoryModal}
        handleHistoryClose={handleHistoryClose}
        historyAnswer={historyAnswer}
        question={item}
      />
    </>
  );
};

export default FrequencyComponent;
