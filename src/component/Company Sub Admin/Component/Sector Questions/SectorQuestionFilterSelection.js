import React, { useState, useEffect, useRef } from "react";
import { Form, Modal, Tabs, Tab, Row, Col, Button,Dropdown } from "react-bootstrap";     
import Select, { components } from "react-select";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import "./SectorQuestionFilterSelection.css";
import CustomOption from "../ESGDownload/CustomOption";
import { useHistory } from "react-router-dom";
import { filter } from "lodash";
import { fileFromPath } from "openai/uploads.mjs";
import DownloadReportModal from "../../../DownloadReport/downloadReport";


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

const SectorQuestionFilterSelection = ({
  setFinancialYearId,
  setShow,
  financialYear,
  frameworkValue,
  setFinancialYear,
  setTimePeriods,
  currentTab,
  keyTab,
  setKeyTab,
  setLocationOption,
  setFramework,
  framework,
  downloadPdf,
  setFromDate,
  setToDate,
  show,
  handleClose,
  financialYearId,
  getSectorQuestionAnswer,
  selectedFramework,
  setSelectedFramework,
  availableSection,
  groupedTopicsData,
  searchTerm,
  answers,
  filterQuestionListAnswer
}) => {
  const history = useHistory();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || null;

  const [selectedPeriod, setSelectedPeriod] = useState([]);
  const [meterList, setMeterList] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [frequency, setFrequency] = useState(currentUser?.frequency);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [frameworks, setFrameworks] = useState([]);

  const getFramework = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
        {},
        { type: "ALL" }
      );
      if (isSuccess && isMounted.current) {
        setFrameworks(data?.data);
        setSelectedFramework(data?.data[0]?.id);
      }
    } catch (error) {
      console.error("Error fetching framework:", error);
      return [];
    }
  };

  useEffect(() => {
    getFinancialYear();
    getSource();
    getFramework();
  }, []);
  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData && isMounted.current) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYear(parsedData);
      const lastEntry = parsedData[parsedData.length - 1];
      setSelectedYear(lastEntry.financial_year_value);
      setFinancialYearId(lastEntry.id);
      getFrequency(lastEntry.id);
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {},
        "GET"
      );
      
      if (isSuccess && isMounted.current) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Set state with the API response
        setFinancialYear(data.data);
        const lastEntry = data.data[data.data.length - 1];
        setSelectedYear(lastEntry.financial_year_value);
        setFinancialYearId(lastEntry.id);
        getFrequency(lastEntry.id);
      }
    }
  };

  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess && isMounted.current) {
      const locationArray = data?.data?.reverse().map((item) => ({
        id: item.id,
        unitCode: item?.unitCode,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      setMeterList(locationArray);
    }
  };

  const getFrequency = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: fId },
      "GET"
    );
    if (isSuccess && isMounted.current) {
      setFrequency(data?.data);
    }
  };

  useEffect(() => {
    if (meterList.length > 1 && selectedLocations.length === 0) {
      const firstLocation = {
        value: meterList[1].unitCode || meterList[1].location,
        label: meterList[1].unitCode || meterList[1].location,
        unitCode: meterList[1].unitCode,
        id: meterList[1].id,
      };
      setSelectedLocations([firstLocation]);
      setLocationOption([firstLocation]);
    } else if (meterList.length > 0 && selectedLocations.length === 0) {
      const firstLocation = {
        value: meterList[0].unitCode || meterList[0].location,
        label: meterList[0].unitCode || meterList[0].location,
        unitCode: meterList[0].unitCode,
        id: meterList[0].id,
      };
      setSelectedLocations([firstLocation]);
      setLocationOption([firstLocation]);
    }


    if (selectedPeriod.length > 0) {
      const firstPeriod = selectedPeriod[0];
      setSelectedPeriod([firstPeriod]);
      handlePeriodChange([firstPeriod]);
    }
  }, [meterList]);

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

  const handleLocationChangeSingle = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      // If no options are selected, clear everything
      setLocationOption([]);
      setSelectedLocations([]);
    } else {
      // Otherwise, just set the selected options normally
      setLocationOption(selectedOptions);
      setSelectedLocations(selectedOptions);
    }
  };

  useEffect(() => {
    if (financialYearId) getFrequency(financialYearId);
  }, [financialYearId]);

  useEffect(() => {
    if (frequency) {
      let options = [];
      if (frequency === "MONTHLY") {
        const options =
          start === 1
            ? months
            : [...months.slice(start - 1), ...months.slice(0, start - 1)];

        // Map options to { label, value } format
        const formattedOptions = options.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1, // Ensures values cycle correctly from 1 to 12
        }));

        setTimePeriodOptions(formattedOptions);
        setSelectedPeriod(formattedOptions[0])
        handlePeriodChangeSingle(formattedOptions[0])

      } else if (frequency === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${months[(quarterEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: quarter, value: quarter });
        }
        setTimePeriodOptions(options);
        setSelectedPeriod(options[0])
        handlePeriodChangeSingle(options[0])



      } else if (frequency === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${months[(halfEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: half, value: half });

        }
        setTimePeriodOptions(options);
        setSelectedPeriod(options[0])
        handlePeriodChangeSingle(options[0])


      } else if (frequency === "YEARLY") {
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
  }, [frequency, start]);

  useEffect(() => {
    if (timePeriodOptions)
      handlePeriodChangeSingle(timePeriodOptions[0])

  }, [timePeriodOptions, financialYearId])

  useEffect(() => {
    if (keyTab === "individual") {
      setSelectedLocations((prevState) => {
        return prevState.length > 0 ? [prevState[0]] : [];
      });
      setLocationOption((prevState) => {
        return prevState.length > 0 ? [prevState[0]] : [];
      });
      // const periodOptionsForFrequency = periodOptions[frequency] || [];
      if (
        // periodOptionsForFrequency.length > 0 &&
        selectedPeriod.length > 0) {
        const firstPeriod = selectedPeriod[0];
        setSelectedPeriod(firstPeriod);
        handlePeriodChangeSingle(firstPeriod);
      }
    }
  }, [keyTab]);

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
  const handleYearChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = financialYear.find(
      (year) => year.financial_year_value === selectedValue
    );
    setSelectedYear(selectedValue);
    setFinancialYearId(selectedOption?.id || "");
  };

  const handlePeriodChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      selectedOptions = [];
    }

    setSelectedPeriod(selectedOptions);
    const newTimePeriods = {};
    const year = parseInt(selectedYear.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    selectedOptions.forEach((period) => {
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

        // Extract the first month from the selectedOption
        const firstMonthName = period.label.split("-")[0].trim(); // Assuming `label` contains something like "Apr - Jun"

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Check if the 6 months later month and first month match the condition
        const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;

        dateRange = calculateDateRange(6, period.value, start, year);
      } else if (frequency === "QUARTERLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = period.label.split(" ")[0].trim();

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Determine the quarter based on the start month and the selectedOption first month
        const quarter = Math.floor(firstMonthIndex / 3) + 1;

        dateRange = calculateDateRange(3, period.value, start, year);
      } else if (frequency === "MONTHLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = period.label.split(" ")[0].trim();

        // Find the index of the starting month (start - 1 since arrays are 0-indexed)
        const startIndex = start - 1;

        // Find the index of the first month name in the months array
        const firstMonthAbsoluteIndex = months.indexOf(firstMonthName);

        // Calculate the relative index from the start
        const firstMonthIndex =
          ((firstMonthAbsoluteIndex - startIndex + months.length) %
            months.length) +
          1; // Add 1 to make it 1-based index

        dateRange = calculateDateRange(1, period.value, start, year);
      } else if (frequency === "YEARLY") {
        dateRange = calculateDateRange(12, 1, start, year);
      }



      if (dateRange) {
        newTimePeriods[period?.label] = dateRange?.fromDate;

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
    });
    setFromDate(earliestFromDate);
    setToDate(latestToDate);
    setTimePeriods(newTimePeriods);
  };

  const handlePeriodChangeSingle = (selectedOption) => {
    // Check if the selected option is valid
    if (selectedYear) {
      if (!selectedOption) {
        setSelectedPeriod([]); // Clear selection if no option is selected
        setFromDate(null);
        setToDate(null);
        setTimePeriods({});
        return;
      }

      setSelectedPeriod([selectedOption]); // Set the selected period as an array

      const newTimePeriods = {};
      const year = parseInt(selectedYear.split("-")[0]);
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

        // Extract the first month from the selectedOption
        const firstMonthName = selectedOption.label.split("-")[0].trim(); // Assuming `label` contains something like "Apr - Jun"

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Check if the 6 months later month and first month match the condition
        const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;

        dateRange = calculateDateRange(6, selectedOption.value, start, year);
      } else if (frequency === "QUARTERLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = selectedOption.label.split(" ")[0].trim();

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Determine the quarter based on the start month and the selectedOption first month
        const quarter = Math.floor(firstMonthIndex / 3) + 1;

        dateRange = calculateDateRange(3, selectedOption.value, start, year);
      } else if (frequency === "MONTHLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = selectedOption.label.split(" ")[0].trim();

        // Find the index of the starting month (start - 1 since arrays are 0-indexed)
        const startIndex = start - 1;

        // Find the index of the first month name in the months array
        const firstMonthAbsoluteIndex = months.indexOf(firstMonthName);

        // Calculate the relative index from the start
        const firstMonthIndex =
          ((firstMonthAbsoluteIndex - startIndex + months.length) %
            months.length) +
          1; // Add 1 to make it 1-based index

        dateRange = calculateDateRange(1, selectedOption.value, start, year);
      } else if (frequency === "YEARLY") {
        dateRange = calculateDateRange(12, 1, start, year);
      }

      if (dateRange) {
        newTimePeriods[selectedOption.value] = dateRange.fromDate;

        setFromDate(dateRange.fromDate);
        setToDate(dateRange.toDate);
      } else {
        setFromDate(null);
        setToDate(null);
      }

      setTimePeriods(newTimePeriods);
    }
  };
  
  const goToBrsrReportPage = () => {
    if (!availableSection || !groupedTopicsData || !answers || !Array.isArray(filterQuestionListAnswer)) return;
    localStorage.setItem("brsrReportData", JSON.stringify({
      availableSection,
      groupedTopicsData,
      searchTerm,
      answers,
      filterQuestionListAnswer
    }));

    history.push("/brsr-report");
  };

  // Add the "All" option to the dynamically generated options
  const locationOptions = [
    ...meterList.map((item) => ({
      value: item?.unitCode || item.location,
      label: item?.unitCode || item.location,
      unitCode: item?.unitCode,
      id: item?.id,
    })),
  ];


  // const CustomOption = (props) => {
  //   const { isSelected, data } = props;

  //   const renderLabel = () => {
  //     if (data.label.includes(",")) {
  //       const words = data.label.split(",").map((word) => word.trim());
  //       const secondWord = words[1] || ""; // Get the second word or an empty string if it doesn't exist
  //       const fourthLastWord = words[words.length - 4] || ""; // Get the fourth last word or an empty string if it doesn't exist

  //       return (
  //         <div>
  //           {secondWord}, {fourthLastWord}{" "}
  //           {/* Render the second and fourth last words */}
  //         </div>
  //       );
  //     } else {
  //       return <div>{data.label}</div>; // Render data.label as is
  //     }
  //   };

  //   return (
  //     <components.Option {...props}>
  //       <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
  //         <div
  //           style={{
  //             width: "20%",
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <div
  //             style={{
  //               width: "20px",
  //               height: "20px",
  //               border: "2px solid #3f88a5",
  //               borderRadius: "2px",
  //               backgroundColor: isSelected ? "transparent" : "transparent",
  //               marginRight: "10px",
  //               display: "flex",
  //               justifyContent: "center",
  //               alignItems: "center",
  //             }}
  //           >
  //             {/* Tick mark when selected */}
  //             {isSelected && (
  //               <span style={{ color: "white", fontSize: "14px" }}>✔</span>
  //             )}
  //           </div>
  //         </div>

  //         <div
  //           style={{
  //             width: "80%",
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "flex-start",
  //             justifyContent: "center",
  //           }}
  //         >
  //           {renderLabel()} {/* Call the renderLabel function */}
  //         </div>
  //       </div>
  //     </components.Option>
  //   );
  // };
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
          >
            {/* {placeholder} */}
          </div>
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

  const handleCloseFilter = () => setShowFilter(false);

  const handleFrameworkChange = (e) => {
    setSelectedFramework(e.target.value);
  };
  return (
    <div style={{ width: "100%" }}>
      <div className="color_div_Current mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="color_rent mb-0">
            <button
              onClick={
                () => setShow(true)
              }
              className="esg_button_style"
            >
              Download Report
              <i className="fa fa-download" style={{ marginLeft: "8px" }}></i>
            </button>
            <button style={{ marginLeft: "8px" }} className="esg_button_style" onClick={goToBrsrReportPage}>Preview BRSR Report</button>
          </div>

          <div className="color_rent mb-0 leftmarg">
            <Form.Select
              className="esg_text2"
              onChange={handleYearChange}
              value={selectedYear}
              style={{ padding: ".5rem 2.25rem .5rem .75rem" }}
            >
              {financialYear.map((year) => (
                <option key={year.id} value={year.financial_year_value}>
                  FY - {"           "}
                  {year.financial_year_value}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="color_rent mb-0 leftmarg">
            <Form.Select
              className="esg_text2"
              onChange={handleFrameworkChange}
              value={selectedFramework}
              style={{ padding: ".5rem 2.25rem .5rem .75rem" }}
            >
              {frameworks.map((framework) => (
                <option key={framework.id} value={framework.id}>
                  {framework.title}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="color_rent mb-0 leftmarg">
            <button
              onClick={() => setShowFilter(true)}
              className="esg_button_style"
            >
              Filter
              <i className="fa fa-filter" style={{ marginLeft: "8px" }}></i>
            </button>
          </div>
        </div>
      </div>

      <Modal size="lg" show={showFilter} onHide={handleCloseFilter}>
        <Modal.Header closeButton>
          <div
            style={{ color: "#3f88a5", fontSize: "24px", fontWeight: "bold" }}
          >
            Filters
          </div>
        </Modal.Header>
        <Modal.Body style={{ height: "40vh" }}>
        <>
              <Row>
                <Col md={4} style={{ marginRight: "5px" }}>
                  <div className="">
                    <div
                      style={{
                        color: " #3f88a5",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Select Frequency
                    </div>
                    {frequency === "HALF_YEARLY" && (
                      <Select
                        isMulti
                        value={selectedPeriod}
                        onChange={(selectedOptions) => {
                          if (selectedOptions.length <= 5) {
                            handlePeriodChange(selectedOptions);
                          }
                        }}
                        options={timePeriodOptions || []}
                        isClearable={false}
                        placeholder="Select Frequency"
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
                    )}
                    {frequency === "QUARTERLY" && (
                      <Select
                        isMulti
                        value={selectedPeriod}
                        onChange={(selectedOptions) => {
                          if (selectedOptions.length <= 5) {
                            handlePeriodChange(selectedOptions);
                          }
                        }}
                        options={timePeriodOptions || []}
                        placeholder="Select Periods"
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
                    )}
                    {frequency === "MONTHLY" && (
                      <Select
                        isMulti
                        value={selectedPeriod}
                        onChange={(selectedOptions) => {
                          if (selectedOptions.length <= 5) {
                            handlePeriodChange(selectedOptions);
                          }
                        }}
                        options={timePeriodOptions || []}
                        placeholder="Select Periods"
                        className=""
                        components={{
                          Option: CustomOption,
                          Control: CustomControl,
                          ClearIndicator: CustomClearIndicator,

                          MultiValue: CustomMultiValue,
                        }}
                        hideSelectedOptions={false} // Keep selected options in the dropdown
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
                    )}
                    {frequency === "YEARLY" && (
                      <Select
                        isMulti
                        value={selectedPeriod}
                        onChange={(selectedOptions) => {
                          if (selectedOptions.length <= 5) {
                            handlePeriodChange(selectedOptions);
                          }
                        }}
                        options={timePeriodOptions || []}
                        placeholder="Select Periods"
                        className=""
                        components={{
                          Option: CustomOption,
                          Control: CustomControl,
                          ClearIndicator: CustomClearIndicator,

                          MultiValue: CustomMultiValue,
                        }}
                        hideSelectedOptions={false} // Keep selected options in the dropdown
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
                    )}
                  </div>
                </Col>
                {meterList && meterList.length > 1 && (
                  <Col md={7} style={{ marginRight: "5px" }}>
                    <div className=" ">
                      <div
                        style={{
                          color: " #3f88a5",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}
                      >
                        Select Locations
                      </div>
                      <Select
                        isMulti
                        isClearable={false}
                        value={selectedLocations}
                        onChange={(selectedOptions) => {
                          if (selectedOptions.length <= 5) {
                            handleSelectionChange(selectedOptions);
                          }
                        }}
                        options={locationOptions || []}
                        placeholder="Select Locations"
                        className=""
                        components={{
                          Option: CustomOption,
                          Control: CustomControl,
                          ClearIndicator: CustomClearIndicator,

                          MultiValue: CustomMultiValue,
                        }}
                        hideSelectedOptions={false} // Keep selected options in the dropdown
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
                  </Col>
                )}
               
              </Row>
            </>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={getSectorQuestionAnswer}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal>
      <DownloadReportModal
        show={show}
        onClose={handleClose}
        financialYears={financialYear}
        frameworks={frameworks}
      />
    </div>
  );
};

export default SectorQuestionFilterSelection;
