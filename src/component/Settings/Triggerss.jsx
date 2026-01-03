import React, { useState, useEffect } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";

const Triggers = () => {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [frameworkIds, setFrameworkIds] = useState([]);
  const [questions, setQuestions] = useState({});
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [triggerValues, setTriggerValues] = useState({});
  const [triggerValue, setTriggerValue] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [identifier, setIdentifier] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [apiData, setApiData] = useState();

  const getFrequency = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: selectedFinancialYear },
      "GET"
    );
    if (isSuccess) {
      setIdentifier(data.data);
    }
  };

  // Fetch Financial Years and set the latest one by default
  const getFinancialYears = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearsData');
      
      if (storedData) {
        // Use data from local storage
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData);
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id); // Auto-select last value
        }
      } else {
        // Call API if data not found in local storage
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        
        if (isSuccess && data?.data.length > 0) {
          // Store data in local storage
          localStorage.setItem('financialYearsData', JSON.stringify(data.data));
          
          // Set state with API response
          setFinancialYears(data.data);
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id); // Auto-select last value
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  // Fetch Locations
  const getSource = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch Categories
  const getUnitCategory = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getUnitCatagory`,
        {},
        { type: "ALL" },
        "GET"
      );

      if (isSuccess) {
        const filteredCategories = data.data.filter((item) => item.id !== 1); // Remove id === 1
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Framework Data
  const fetchFrameworkApi = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
        {},
        { type: "ALL" }
      );
      if (isSuccess) {
        setFrameworkIds(data?.data.map((item) => item.id));
        return data?.data.map((item) => item.id);
      }
    } catch (error) {
      console.error("Error fetching framework data:", error);
    }
  };

  // Updated Save Data function to match the CreateSetTargetDataQuestionDto structure
  const saveTriggerData = async (questionId) => {
    // Get current selected month value from triggerValue
    const currentValues = triggerValue[questionId] || {};

    if (
      !selectedFinancialYear ||
      !selectedLocation ||
      !currentValues.minTriggerValue ||
      !currentValues.maxTriggerValue
    ) {
      console.error("Missing required fields for saving trigger data");
      return;
    }

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveTriggerData`,
        {},
        {
          questionId,
          questionTitle: "ABC", // Get actual title if available
          financialYearId: selectedFinancialYear,
          sourceId: Number(selectedLocation),
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          unit: currentValues.unit || "",
          minTrigger: currentValues.minTriggerValue || undefined,
          maxTrigger: currentValues.maxTriggerValue || undefined,
          questionType: "quantitative_trends",
        },
        "POST"
      );
      if (isSuccess) {
        getSavedTriggerValues();
        console.log(
          `Successfully saved trigger values for question ${questionId}`
        );
      }
    } catch (error) {
      console.error("Error saving trigger data:", error);
    }
  };

  // Get saved trigger values when financial year, location, or category changes
  const getSavedTriggerValues = async () => {
    if (!selectedFinancialYear || !selectedLocation) {
      return;
    }

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTriggerValues`,
        {},
        {
          financialYearId: selectedFinancialYear,
          sourceId: Number(selectedLocation),
        },
        "GET"
      );

      if (isSuccess && data?.data) {
        const formattedTriggerValues = {};

        data.data.forEach((item) => {
          const { questionId, minTargetData, maxTargetData, unit, fromDate } =
            item;
          const monthValue = parseInt(fromDate.split("-")[1], 10);
          const key = `${questionId}-${monthValue}`;
          if (!formattedTriggerValues[questionId]) {
            formattedTriggerValues[questionId] = {};
          }
          if (!formattedTriggerValues[questionId][key]) {
            formattedTriggerValues[questionId][key] = {
              unit: unit || "",
              monthValue: monthValue || "",
            };
          }

          if (minTargetData !== undefined) {
            formattedTriggerValues[questionId][key].minTriggerValue =
              minTargetData;
          }

          if (maxTargetData !== undefined) {
            formattedTriggerValues[questionId][key].maxTriggerValue =
              maxTargetData;
          }
        });

        setTriggerValues(formattedTriggerValues);
      }
    } catch (error) {
      console.error("Error fetching saved trigger values:", error);
    }
  };

  const getTargetQuestionAnswer = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getTargetQuestionAnswer`,
      {},
      { financialYearId: selectedFinancialYear },
      "GET"
    );
    if (isSuccess) {
      setApiData(data.answers);
    }
  };

  useEffect(() => {
    if (selectedFinancialYear) {
      getTargetQuestionAnswer();
    }
  }, [selectedFinancialYear]);

  // Load saved trigger values when financial year, location, or category changes
  useEffect(() => {
    getSavedTriggerValues();
  }, [selectedFinancialYear, selectedLocation, selectedCategory]);

  // Fetch Reporting Questions Based on Selected Financial Year
  const getReportingQuestions = async () => {
    try {
      if (!selectedFinancialYear) return;
      const frameworkIds = await fetchFrameworkApi();
      if (!frameworkIds?.length) return;

      if (frameworkIds.includes(48)) {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
          {},
          { financialYearId: selectedFinancialYear, frameworkIds },
          "GET"
        );

        if (response.isSuccess) {
          const data = response.data;
          const groupedByModuleName = data.data
            .filter((item) => item.categoryId != 1) // Remove categoryId 1
            .reduce((acc, item) => {
              if (!acc[item.categoryId]) {
                acc[item.categoryId] = [];
              }
              acc[item.categoryId].push(item);
              return acc;
            }, {});

          setQuestions(groupedByModuleName);
        }
      } else {
        const response = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSetTargetQuestion`,
          {},
          {},
          "GET"
        );
        if (response.isSuccess) {
          const dataa = response.data.data;
          setCategories(dataa);
          setQuestions(dataa);
        }
      }
    } catch (error) {
      console.error("Error fetching reporting questions:", error);
    }
  };

  // Handle category selection and set units accordingly
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );
    if (selectedCategory && selectedCategory.units) {
      setUnitOptions(selectedCategory.units);
    }
  };

  // Updated handleChange to handle min and max trigger values
  const handleChange = (questionId, field, value) => {
    // First, get the current monthValue from triggerValue state
    const monthValue = triggerValue[questionId]?.monthValue;

    if (!monthValue) {
      console.error(
        "No month value selected. Please select a frequency first."
      );
      return;
    }

    // Construct the key
    const key = `${questionId}-${monthValue}`;

    // Update triggerValues state
    setTriggerValues((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [key]: {
          ...(prev[questionId]?.[key] || {}),
          [field]: value,
          monthValue: monthValue,
        },
      },
    }));

    // Also update the triggerValue state for the current selection
    setTriggerValue((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));

    // If it's a min/max trigger value or unit change, we'll save after a short delay
    if (
      field === "minTriggerValue" ||
      field === "maxTriggerValue" ||
      field === "unit"
    ) {
      // Debounce the save to avoid too many API calls
      setTimeout(() => {
        if (selectedFinancialYear && selectedLocation) {
          saveTriggerData(questionId);
        } else {
          console.warn("Cannot save trigger value: missing required fields");
        }
      }, 500);
    }
  };

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

  const start = JSON.parse(localStorage.getItem("currentUser")).starting_month;

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
          const quarter = `${months[quarterStartIndex]} - ${
            months[(quarterEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (identifier === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${
            months[(halfEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: half, value: options.length + 1 });
          setTimePeriodOptions(options);
        }
      } else if (identifier === "YEARLY") {
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
  }, [identifier, start]);

  const handlePeriodChange = (questionId, field, value) => {
    const years = financialYears.find(
      (item) => item.id === selectedFinancialYear
    ).financial_year_value;

    const year = parseInt(years.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    let dateRange;

    if (identifier === "HALF_YEARLY") {
      const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary
      const halfYear = sixMonthLater === (value + 1) % 12 ? 2 : 1;
      dateRange = calculateDateRange(6, halfYear, start, year);
    } else if (identifier === "QUARTERLY") {
      const quarter = Math.floor(value / 3) + 1;
      dateRange = calculateDateRange(3, quarter, start, year);
    } else if (identifier === "MONTHLY") {
      const startIndex = start - 1;
      const firstMonthIndex =
        (value - startIndex + months.length) % months.length;
      dateRange = calculateDateRange(1, firstMonthIndex, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }

    if (dateRange) {
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

    // Extracting the last part of fromDate and converting to integer
    const monthValue = parseInt(earliestFromDate.split("-")[1], 10);

    // Constructing the key as "questionId-monthValue"
    const key = `${questionId}-${monthValue}`;

    // Create a new object to avoid state mutation issues
    let newTriggerValue = {};

    if (triggerValues[questionId] && triggerValues[questionId][key]) {
      newTriggerValue[questionId] = triggerValues[questionId][key];
    } else {
      // Initialize with empty values if no data exists for this period
      newTriggerValue[questionId] = {
        unit: "",
        minTriggerValue: "",
        maxTriggerValue: "",
        monthValue: monthValue,
      };
    }

    // Update the triggerValue state with the new object
    setTriggerValue(newTriggerValue);

    // Update frequency in triggerValues state
    setTriggerValues((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [key]: {
          ...(prev[questionId]?.[key] || {}),
          monthValue: monthValue,
          frequency: value,
        },
      },
    }));
  };

  // Updated tabular change handler for min and max values
  const handleTabularChangeChange = (
    questionId,
    rowId,
    columnId,
    key,
    value
  ) => {
    // First, determine if we already have a monthValue from the current selection
    // or get it from the fromDate
    const currentMonthValue =
      triggerValue[questionId]?.monthValue ||
      (fromDate ? parseInt(fromDate.split("-")[1], 10) : null);

    if (!currentMonthValue) {
      console.error(
        "No month value selected. Please select a frequency first."
      );
      return;
    }

    // Construct the composite key
    const compositeKey = `${questionId}-${currentMonthValue}`;

    // For tabular questions, we need to structure data differently to handle rows and columns
    // Make sure we're preserving existing data structure
    setTriggerValues((prev) => {
      const questionValues = prev[questionId] || {};
      const periodValues = questionValues[compositeKey] || {};
      const rowValues = periodValues[rowId] || {};
      const columnValues = rowValues[columnId] || {};

      return {
        ...prev,
        [questionId]: {
          ...questionValues,
          [compositeKey]: {
            ...periodValues,
            monthValue: currentMonthValue, // Store monthValue at this level
            [rowId]: {
              ...rowValues,
              [columnId]: {
                ...columnValues,
                [key]: value,
              },
            },
          },
        },
      };
    });
    console.log(triggerValues[questionId][compositeKey], "dipakksks");
    // If it's a min/max trigger value or unit change, save after a short delay
    if (key === "maxTriggerValue") {
      // Debounce the save to avoid too many API calls
      setTimeout(() => {
        if (selectedFinancialYear && selectedLocation) {
          // For tabular questions, create a special question ID with row and column info
          const tabularQuestionId = `${questionId}_${rowId}_${columnId}`;

          // Get the current values for this specific cell
          // We need to access the nested structure correctly
          const cellValues =
            triggerValues[questionId]?.[compositeKey]?.[rowId]?.[columnId] ||
            {};

          // Create 2D arrays for min and max trigger values
          // Initialize with empty arrays
          const minTriggerArray = [];
          const maxTriggerArray = [];

          // Get the question details to determine the number of rows and columns
          const questionDetails =
            questions[selectedCategory]?.find(
              (q) => q.questionId === questionId
            )?.details || [];
          const rowCount = questionDetails.filter(
            (detail) => detail.option_type === "row"
          ).length;
          const colCount = questionDetails.filter(
            (detail) => detail.option_type === "column"
          ).length;

          // Create 2D arrays with the correct dimensions
          for (let i = 0; i < rowCount; i++) {
            minTriggerArray[i] = Array(colCount).fill("");
            maxTriggerArray[i] = Array(colCount).fill("");
          }

          // Place the current value in the correct position in the 2D array
          if (cellValues.minTriggerValue) {
            minTriggerArray[rowId][columnId] = cellValues.minTriggerValue;
          }

          if (cellValues.maxTriggerValue) {
            maxTriggerArray[rowId][columnId] = cellValues.maxTriggerValue;
          }

          // Create a proper API payload for this specific cell
          const apiPayload = {
            questionId: questionId,
            questionTitle: "ABC", // Get actual title if available
            financialYearId: selectedFinancialYear,
            sourceId: Number(selectedLocation),
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            unit: cellValues.unit || "KG",
            minTrigger: JSON.stringify(minTriggerArray),
            maxTrigger: JSON.stringify(maxTriggerArray),
            questionType: "tabular_question",
            isTabular: true,
            parentQuestionId: questionId,
            rowId,
            columnId,
          };

          // Call API directly without state manipulation
          apiCall(
            `${config.POSTLOGIN_API_URL_COMPANY}saveTriggerData`,
            {},
            apiPayload,
            "POST"
          )
            .then(({ isSuccess }) => {
              if (isSuccess) {
                console.log(
                  `Successfully saved tabular trigger values for question ${tabularQuestionId}`
                );
                // Optionally refresh data after successful save
                getSavedTriggerValues();
              }
            })
            .catch((error) => {
              console.error("Error saving tabular trigger data:", error);
            });
        } else {
          console.warn(
            "Cannot save tabular trigger value: missing required fields"
          );
        }
      }, 5000);
    }
  };

  useEffect(() => {
    getFinancialYears();
    getSource();
    getUnitCategory();
  }, []);

  useEffect(() => {
    if (selectedFinancialYear) {
      getFrequency();
      getReportingQuestions();

      // Reset trigger values when financial year changes
      setTriggerValues({});
    }
  }, [selectedFinancialYear]);

  // Reset trigger values when location changes
  useEffect(() => {
    if (selectedLocation) {
      setTriggerValues({});
    }
  }, [selectedLocation]);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        width: "100%",
        padding: "2rem",
        overflow: "auto",
      }}
    >
      <div
        className="d-flex justify-content-between buttoncont"
        style={{
          marginBottom: "25px",
          width: "71vw",
          overflow: "auto",
          gap: "10px",
        }}
      >
        {/* Financial Year Dropdown */}
        <select
          value={selectedFinancialYear}
          onChange={(e) => setSelectedFinancialYear(e.target.value)}
          className="form-select"
        >
          <option value="">Select Financial Year</option>
          {financialYears.map((year, index) => (
            <option key={index} value={year.id}>
              {year.financial_year_value}
            </option>
          ))}
        </select>

        {/* Location Dropdown */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="form-select"
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location.id}>
              {location?.unitCode ||
                `${location?.location?.area || ""}, ${
                  location?.location?.city || ""
                }, ${location?.location?.state || ""}, ${
                  location?.location?.country || ""
                }`.trim()}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-select"
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.id}>
              {category?.title}
            </option>
          ))}
        </select>
      </div>

      {frameworkIds && frameworkIds.length > 0 && frameworkIds.includes(48)
        ? selectedCategory &&
          questions[selectedCategory] && (
            <div className="questions-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Question Title</th>
                    <th>Frequency</th>
                    <th>Unit</th>
                    <th>Min Trigger Value</th>
                    <th>Max Trigger Value</th>
                  </tr>
                </thead>
                <tbody>
                  {questions[selectedCategory].map((question) =>
                    question.questionType === "tabular_question" ? (
                      <React.Fragment key={question?.questionId}>
                        <tr>
                          <td colSpan="5">
                            <p>
                              <strong>{question.title}</strong>
                            </p>
                          </td>
                        </tr>
                        {/* {console.log(question,'dilipppsss',details)} */}
                        {question.details
                          .slice()
                          .reverse()
                          .filter((detail) => detail.option_type === "row")
                          .map((row, rowIndex) =>
                            question.details
                              .slice()
                              .reverse()
                              .filter(
                                (detail) => detail.option_type === "column"
                              )
                              .map((column, colIndex) => {
                                // Get the current monthValue from triggerValue
                                console.log(
                                  triggerValue[question?.questionId]
                                    ?.monthValue,
                                  "dilipppsss",
                                  triggerValue
                                );
                                const currentMonthValue =
                                  triggerValue[question?.questionId]
                                    ?.monthValue ||
                                  (fromDate
                                    ? parseInt(fromDate.split("-")[1], 10)
                                    : null);

                                // Create the composite key
                                const compositeKey = currentMonthValue
                                  ? `${question?.questionId}-${currentMonthValue}`
                                  : null;

                                // Get the values for this cell from triggerValues based on the nested structure
                                const cellValues = compositeKey
                                  ? triggerValues[question?.questionId]?.[
                                      compositeKey
                                    ]?.[rowIndex]?.[colIndex] || {}
                                  : {};

                                return (
                                  <tr key={`${rowIndex}-${colIndex}`}>
                                    <td>{`${row.option} - ${column.option}`}</td>
                                    <td>
                                      <select
                                        className="form-select"
                                        // value={cellValues.frequency || ""}
                                        onChange={(e) => {
                                          handlePeriodChange(
                                            question?.questionId,
                                            "frequency",
                                            e.target.value
                                          );
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "frequency",
                                            e.target.value
                                          );
                                        }}
                                      >
                                        <option value="">
                                          Select Frequency
                                        </option>
                                        {timePeriodOptions.map(
                                          (option, index) => (
                                            <option
                                              key={index}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        className="form-select"
                                        // value={cellValues.unit || ""}
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "unit",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select Unit</option>
                                        {unitOptions.map((option, index) => (
                                          <option key={index} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter min trigger value"
                                        // value={cellValues.minTriggerValue || ""}
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "minTriggerValue",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter max trigger value"
                                        // value={cellValues.maxTriggerValue || ""}
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "maxTriggerValue",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                      </React.Fragment>
                    ) : (
                      <tr key={question?.questionId}>
                        <td>{question.title}</td>
                        {/* Frequency Dropdown */}
                        <td>
                          <select
                            className="form-select"
                            // value={
                            //   triggerValue?.monthValue || 4
                            // }
                            onChange={(e) =>
                              handlePeriodChange(
                                question?.questionId,
                                "frequency",
                                e.target.value
                              )
                            }
                          >
                            {console.log(timePeriodOptions, "sipakkdw")}
                            <option value="">Select Frequency</option>
                            {timePeriodOptions.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Unit Dropdown */}
                        {console.log(
                          triggerValue,
                          "triggerValue",
                          triggerValue[question?.questionId]
                        )}
                        <td>
                          <select
                            className="form-select"
                            value={
                              triggerValue[question?.questionId]?.unit || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                question?.questionId,
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Unit</option>
                            {unitOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Min Trigger Value Input */}
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter min trigger value"
                            value={
                              triggerValue[question?.questionId]
                                ?.minTriggerValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                question?.questionId,
                                "minTriggerValue",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        {/* Max Trigger Value Input */}
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter max trigger value"
                            value={
                              triggerValue[question?.questionId]
                                ?.maxTriggerValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                question?.questionId,
                                "maxTriggerValue",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )
        : selectedCategory &&
          questions[selectedCategory] && (
            <div className="questions-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Question Title</th>
                    <th>Frequency</th>
                    <th>Unit</th>
                    <th>Min Trigger Value</th>
                    <th>Max Trigger Value</th>
                  </tr>
                </thead>
                <tbody>
                  {questions
                    .find((item) => item.id === Number(selectedCategory))
                    .questions.map((question) =>
                      question.questionType === "tabular_question" ? (
                        <React.Fragment key={question?.questionId}>
                          <tr>
                            <td colSpan="5">
                              <p>
                                <strong>{question.title}</strong>
                              </p>
                            </td>
                          </tr>
                          {question.details
                            .slice()
                            .reverse()
                            .filter((detail) => detail.option_type === "row")
                            .map((row, rowIndex) =>
                              question.details
                                .slice()
                                .reverse()
                                .filter(
                                  (detail) => detail.option_type === "column"
                                )
                                .map((column, colIndex) => (
                                  <tr key={`${rowIndex}-${colIndex}`}>
                                    <td>{`${row.option} - ${column.option}`}</td>
                                    <td>
                                      <select
                                        className="form-select"
                                        value={
                                          triggerValue[question?.questionId]?.[
                                            rowIndex
                                          ]?.[colIndex]?.frequency || ""
                                        }
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "frequency",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">
                                          Select Frequency
                                        </option>
                                        {timePeriodOptions.map(
                                          (option, index) => (
                                            <option
                                              key={index}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        className="form-select"
                                        value={
                                          triggerValue[question?.questionId]?.[
                                            rowIndex
                                          ]?.[colIndex]?.unit || ""
                                        }
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "unit",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select Unit</option>
                                        {unitOptions.map((option, index) => (
                                          <option key={index} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter min trigger value"
                                        value={
                                          triggerValue[question?.questionId]?.[
                                            rowIndex
                                          ]?.[colIndex]?.minTriggerValue || ""
                                        }
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "minTriggerValue",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter max trigger value"
                                        value={
                                          triggerValues[question?.questionId]?.[
                                            rowIndex
                                          ]?.[colIndex]?.maxTriggerValue || ""
                                        }
                                        onChange={(e) =>
                                          handleTabularChangeChange(
                                            question?.questionId,
                                            rowIndex,
                                            colIndex,
                                            "maxTriggerValue",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))
                            )}
                        </React.Fragment>
                      ) : (
                        <tr key={question?.questionId}>
                          <td>
                            <strong>{question.title}</strong>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={
                                triggerValues[question?.questionId]
                                  ?.frequency || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  question?.questionId,
                                  "frequency",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Frequency</option>
                              {timePeriodOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={
                                triggerValues[question?.questionId]?.unit || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  question?.questionId,
                                  "unit",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Unit</option>
                              {unitOptions.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter min trigger value"
                              value={
                                triggerValues[question?.questionId]
                                  ?.minTriggerValue || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  question?.questionId,
                                  "minTriggerValue",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter max trigger value"
                              value={
                                triggerValues[question?.questionId]
                                  ?.maxTriggerValue || ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  question?.questionId,
                                  "maxTriggerValue",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
};

export default Triggers;
