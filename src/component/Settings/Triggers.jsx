import React, { useState, useEffect } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { handlePeriodChange, generateTimePeriodOptions, getStartingMonth, getPeriod } from "../../utils/PeriodCalculationUtils";


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
  const [originalTriggerValues, setOriginalTriggerValues] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [identifier, setIdentifier] = useState();
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [monthValue, setMonthValue] = useState("");

  const start = getStartingMonth();

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

  const getFinancialYears = async () => {
    try {
      const storedData = localStorage.getItem("financialYearsData");

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData.map(fy => ({label: fy.financial_year_value, value: fy.id})));
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id);
        }
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );

        if (isSuccess && data?.data.length > 0) {
          localStorage.setItem("financialYearsData", JSON.stringify(data.data));
          setFinancialYears(data.data.map(fy => ({label: fy.financial_year_value, value: fy.id})));
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id);
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

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

  const getUnitCategory = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getUnitCatagory`,
        {},
        { type: "ALL" },
        "GET"
      );

      if (isSuccess) {
        const filteredCategories = data.data.filter((item) => item.id !== 1);
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const getSavedTriggerValues = async (questionIds, fromDate, currentMonthValue) => {
    if (!selectedFinancialYear || !selectedLocation || !questionIds || questionIds.length === 0) {
      return;
    }

    try {
      const promises = questionIds.map(questionId =>
        apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getTriggerValues`,
          {},
          {
            financialYearId: selectedFinancialYear,
            sourceId: Number(selectedLocation),
            questionId: Number(questionId),
            fromDate: fromDate,
          },
          "GET"
        )
      );

      const results = await Promise.all(promises);
      const formattedTriggerValues = {};

      results.forEach(response => {
        if (response.isSuccess && response.data?.data) {
          response.data.data.forEach((item) => {
            const {
              questionId,
              minTargetData,
              maxTargetData,
              unit,
              fromDate,
              frequency,
              rowId,
              columnId,
              questionType,
            } = item;

            const compositeKey = `${questionId}-${currentMonthValue}`;

            if (!formattedTriggerValues[questionId]) {
              formattedTriggerValues[questionId] = {};
            }

            if (!formattedTriggerValues[questionId][compositeKey]) {
              formattedTriggerValues[questionId][compositeKey] = {
                currentMonthValue,
                frequency: frequency || "",
                data: questionType === "tabular_question" ? [] : "",
                minTriggerArray: questionType === "tabular_question" ? [] : "",
                maxTriggerArray: questionType === "tabular_question" ? [] : "",
                unit: questionType !== "tabular_question" ? unit || "" : undefined,
                minTriggerValue: questionType !== "tabular_question" ? minTargetData || "" : undefined,
                maxTriggerValue: questionType !== "tabular_question" ? maxTargetData || "" : undefined,
              };
            }

            if (questionType === "tabular_question") {
              const ensureArrayDimensions = (array, rowIdx, colIdx) => {
                if (!array) array = [];
                while (array.length <= rowIdx) {
                  array.push([]);
                }
                while (array[rowIdx].length <= colIdx) {
                  array[rowIdx].push("");
                }
                return array;
              };

              const dataArray = ensureArrayDimensions(
                formattedTriggerValues[questionId][compositeKey].data,
                rowId,
                columnId
              );

              const minArray = ensureArrayDimensions(
                formattedTriggerValues[questionId][compositeKey].minTriggerArray,
                rowId,
                columnId
              );

              const maxArray = ensureArrayDimensions(
                formattedTriggerValues[questionId][compositeKey].maxTriggerArray,
                rowId,
                columnId
              );

              dataArray[rowId][columnId] = unit || "";
              minArray[rowId][columnId] = minTargetData || "";
              maxArray[rowId][columnId] = maxTargetData || "";

              formattedTriggerValues[questionId][compositeKey].data = dataArray;
              formattedTriggerValues[questionId][compositeKey].minTriggerArray = minArray;
              formattedTriggerValues[questionId][compositeKey].maxTriggerArray = maxArray;
            } else {
              formattedTriggerValues[questionId][compositeKey].unit = unit || "";
              formattedTriggerValues[questionId][compositeKey].minTriggerValue = minTargetData || "";
              formattedTriggerValues[questionId][compositeKey].maxTriggerValue = maxTargetData || "";
            }
          });
        }
      });

      setTriggerValues(formattedTriggerValues);
      setOriginalTriggerValues(JSON.parse(JSON.stringify(formattedTriggerValues)));
      console.log("Loaded saved trigger values:", formattedTriggerValues);
    } catch (error) {
      console.error("Error fetching saved trigger values:", error);
    }
  };

  const getReportingQuestions = async () => {
    try {
      if (!selectedFinancialYear) return;
      const frameworkIds = await fetchFrameworkApi();
      if (!frameworkIds?.length) return;

      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getReportingQuestion`,
        {},
        { financialYearId: selectedFinancialYear, frameworkIds },
        "GET"
      );

      if (response.isSuccess) {
        const data = response.data;
        const groupedByModuleName = data.data
          .filter((item) => item.categoryId != 1)
          .reduce((acc, item) => {
            if (!acc[item.categoryId]) {
              acc[item.categoryId] = [];
            }
            acc[item.categoryId].push(item);
            return acc;
          }, {});

        setQuestions(groupedByModuleName);
      }
    } catch (error) {
      console.error("Error fetching reporting questions:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );
    if (selectedCategory && selectedCategory.units) {
      setUnitOptions(selectedCategory.units);
    }
    setMonthValue("");
  };

  useEffect(() => {
    if (identifier && start) {
      setTimePeriodOptions(generateTimePeriodOptions(identifier, start));
    }
  }, [identifier, start]);

  const handleFrequencyChange = async (value) => {

    const {fromDate: earliestFromDate, toDate: latestToDate} = handlePeriodChange(value, selectedFinancialYear, financialYears, identifier, setFromDate, setToDate);

    setMonthValue(value);

    if (selectedCategory && questions[selectedCategory]) {
      const questionIds = questions[selectedCategory].map(q => q.questionId);
      await getSavedTriggerValues(questionIds, earliestFromDate, value);
    }
  };

  const handleSimpleQuestionChange = (questionId, key, value) => {
    const currentMonthValue = monthValue || "";

    if (!currentMonthValue) {
      console.error("No month value selected. Please select a frequency first.");
      return;
    }

    const compositeKey = `${questionId}-${currentMonthValue}`;

    setTriggerValues((prev) => {
      const questionValues = prev[questionId] || {};
      const periodValues = questionValues[compositeKey] || {
        monthValue: currentMonthValue,
        frequency: "",
        unit: "",
        minTriggerValue: "",
        maxTriggerValue: "",
      };

      return {
        ...prev,
        [questionId]: {
          ...questionValues,
          [compositeKey]: {
            ...periodValues,
            [key]: value,
          },
        },
      };
    });
  };

  const handleTabularChangeChange = (questionId, rowId, columnId, key, value) => {
    const currentMonthValue = monthValue || "";

    if (!currentMonthValue) {
      console.error("No month value selected. Please select a frequency first.");
      return;
    }

    const compositeKey = `${questionId}-${currentMonthValue}`;

    setTriggerValues((prev) => {
      const questionValues = prev[questionId] || {};
      const periodValues = questionValues[compositeKey] || {
        monthValue: currentMonthValue,
        frequency: "",
        data: [],
        minTriggerArray: [],
        maxTriggerArray: [],
      };

      if (key === "frequency") {
        return {
          ...prev,
          [questionId]: {
            ...questionValues,
            [compositeKey]: {
              ...periodValues,
              frequency: value,
            },
          },
        };
      }

      const questionDetails =
        questions[selectedCategory]?.find((q) => q.questionId === questionId)
          ?.details ?? [];
      const rowCount = questionDetails.filter(
        (detail) => detail.option_type === "row"
      ).length;
      const colCount = questionDetails.filter(
        (detail) => detail.option_type === "column"
      ).length;

      let newData = periodValues.data?.length
        ? [...periodValues.data.map((row) => [...row])]
        : Array.from({ length: rowCount }, () => Array(colCount).fill(""));

      let updatedMinTriggerArray = periodValues.minTriggerArray?.length
        ? [...periodValues.minTriggerArray.map((row) => [...row])]
        : Array.from({ length: rowCount }, () => Array(colCount).fill(""));

      let updatedMaxTriggerArray = periodValues.maxTriggerArray?.length
        ? [...periodValues.maxTriggerArray.map((row) => [...row])]
        : Array.from({ length: rowCount }, () => Array(colCount).fill(""));

      while (newData.length <= rowId) {
        newData.push(Array(colCount).fill(""));
      }
      while (newData[rowId].length <= columnId) {
        newData[rowId].push("");
      }

      while (updatedMinTriggerArray.length <= rowId) {
        updatedMinTriggerArray.push(Array(colCount).fill(""));
      }
      while (updatedMinTriggerArray[rowId].length <= columnId) {
        updatedMinTriggerArray[rowId].push("");
      }

      while (updatedMaxTriggerArray.length <= rowId) {
        updatedMaxTriggerArray.push(Array(colCount).fill(""));
      }
      while (updatedMaxTriggerArray[rowId].length <= columnId) {
        updatedMaxTriggerArray[rowId].push("");
      }

      if (key === "unit") {
        newData[rowId][columnId] = value;
      } else if (key === "minTriggerValue") {
        updatedMinTriggerArray[rowId][columnId] = value;
      } else if (key === "maxTriggerValue") {
        updatedMaxTriggerArray[rowId][columnId] = value;
      }

      return {
        ...prev,
        [questionId]: {
          ...questionValues,
          [compositeKey]: {
            ...periodValues,
            data: newData,
            minTriggerArray: updatedMinTriggerArray,
            maxTriggerArray: updatedMaxTriggerArray,
          },
        },
      };
    });
  };

  const hasValuesChanged = (questionId, rowId = null, colId = null) => {
    const currentMonthValue = monthValue || "";
    if (!currentMonthValue) return false;

    const compositeKey = `${questionId}-${currentMonthValue}`;
    const currentValues = triggerValues[questionId]?.[compositeKey];
    const originalValues = originalTriggerValues[questionId]?.[compositeKey];

    if (!currentValues) return false;
    if (!originalValues) return true;

    if (rowId !== null && colId !== null) {
      return (
        currentValues.data?.[rowId]?.[colId] !== originalValues.data?.[rowId]?.[colId] ||
        currentValues.minTriggerArray?.[rowId]?.[colId] !== originalValues.minTriggerArray?.[rowId]?.[colId] ||
        currentValues.maxTriggerArray?.[rowId]?.[colId] !== originalValues.maxTriggerArray?.[rowId]?.[colId]
      );
    } else {
      return (
        currentValues.unit !== originalValues.unit ||
        currentValues.minTriggerValue !== originalValues.minTriggerValue ||
        currentValues.maxTriggerValue !== originalValues.maxTriggerValue
      );
    }
  };

  const saveSimpleQuestionData = async (question, questionId) => {
    const currentMonthValue = monthValue || "";

    if (!currentMonthValue) {
      alert("No month value selected. Please select a frequency first.");
      return;
    }

    const compositeKey = `${questionId}-${currentMonthValue}`;
    const questionData = triggerValues[questionId]?.[compositeKey];

    if (!questionData) {
      alert("No data found for this question. Please fill in the values first.");
      return;
    }

    const { unit, minTriggerValue, maxTriggerValue, frequency } = questionData;

    if (
      !selectedFinancialYear ||
      !selectedLocation ||
      !minTriggerValue ||
      !maxTriggerValue ||
      !unit ||
      !fromDate
    ) {
      alert(
        "Please fill all required fields (Financial Year, Location, Frequency, Unit, Min and Max Trigger Values)"
      );
      return;
    }

    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveTriggerData`,
        {},
        {
          questionId,
          questionTitle: question.title || "ABC",
          financialYearId: selectedFinancialYear,
          sourceId: Number(selectedLocation),
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          unit: unit,
          minTrigger: minTriggerValue,
          maxTrigger: maxTriggerValue,
          questionType: question.questionType || "simple_question",
          rowId: 0,
          columnId: 0,
          cellLabel: question.title,
        },
        "POST"
      );

      if (isSuccess) {
        if (selectedCategory && questions[selectedCategory]) {
          const questionIds = questions[selectedCategory].map(q => q.questionId);
          await getSavedTriggerValues(questionIds, fromDate, currentMonthValue);
        }
      }
    } catch (error) {
      console.error("Error saving trigger data:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const saveTriggerData = async (question, questionId, rowId, colId) => {
    const currentMonthValue = monthValue || "";

    if (!currentMonthValue) {
      alert("No month value selected. Please select a frequency first.");
      return;
    }

    const compositeKey = `${questionId}-${currentMonthValue}`;
    const cellData = triggerValues[questionId]?.[compositeKey];

    if (!cellData) {
      alert("No data found for this cell. Please fill in the values first.");
      return;
    }

    const unit = cellData.data?.[rowId]?.[colId] || "";
    const minTriggerValue = cellData.minTriggerArray?.[rowId]?.[colId] || "";
    const maxTriggerValue = cellData.maxTriggerArray?.[rowId]?.[colId] || "";
    const frequency = cellData.frequency || "";

    if (
      !selectedFinancialYear ||
      !selectedLocation ||
      !minTriggerValue ||
      !maxTriggerValue ||
      !unit ||
      !fromDate
    ) {
      alert(
        "Please fill all required fields (Financial Year, Location, Frequency, Unit, Min and Max Trigger Values)"
      );
      return;
    }

    try {
      const rowDetail = question.details
        .slice()
        .reverse()
        .filter((detail) => detail.option_type === "row")[rowId];

      const columnDetail = question.details
        .slice()
        .reverse()
        .filter((detail) => detail.option_type === "column")[colId];

      const cellLabel = `${rowDetail.option} - ${columnDetail.option}`;

      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveTriggerData`,
        {},
        {
          questionId,
          questionTitle: question.title || "ABC",
          financialYearId: selectedFinancialYear,
          sourceId: Number(selectedLocation),
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          unit: unit,
          minTrigger: minTriggerValue,
          maxTrigger: maxTriggerValue,
          questionType: "tabular_question",
          rowId: rowId,
          columnId: colId,
          cellLabel: cellLabel,
        },
        "POST"
      );

      if (isSuccess) {
        await getSavedTriggerValues([questionId], fromDate, currentMonthValue);
      }
    } catch (error) {
      console.error("Error saving trigger data:", error);
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
      setTriggerValues({});
      setOriginalTriggerValues({});
    }
  }, [selectedFinancialYear]);

  useEffect(() => {
    if (selectedLocation) {
      setTriggerValues({});
      setOriginalTriggerValues({});
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
        <select
          value={selectedFinancialYear}
          onChange={(e) => {
            setSelectedFinancialYear(e.target.value);
            setMonthValue("");
          }}
          className="form-select"
        >
          <option value="">Select Financial Year</option>
          {financialYears.map((year, index) => (
            <option key={index} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setMonthValue("");
          }}
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

        <select
          className="form-select"
          value={monthValue || ""}
          onChange={(e) => handleFrequencyChange(e.target.value)}
          disabled={!identifier}
        >
          <option value="">Select Frequency</option>
          {timePeriodOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {frameworkIds && frameworkIds.length > 0 ? (
        selectedCategory &&
        questions[selectedCategory] && (
          <div className="questions-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Question Title</th>
                  <th>Unit</th>
                  <th>Min Trigger Value</th>
                  <th>Max Trigger Value</th>
                  <th>Action</th>
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
                      {question.details
                        .slice()
                        .reverse()
                        .filter((detail) => detail.option_type === "row")
                        .map((row, rowIndex) =>
                          question.details
                            .slice()
                            .reverse()
                            .filter((detail) => detail.option_type === "column")
                            .map((column, colIndex) => {
                              const currentMonthValue = monthValue || "";
                              const compositeKey = currentMonthValue ? `${question?.questionId}-${currentMonthValue}` : null;

                              const cellValues = compositeKey
                                ? {
                                    unit: triggerValues[question?.questionId]?.[compositeKey]?.data?.[rowIndex]?.[colIndex] || "",
                                    minTriggerValue: triggerValues[question?.questionId]?.[compositeKey]?.minTriggerArray?.[rowIndex]?.[colIndex] || "",
                                    maxTriggerValue: triggerValues[question?.questionId]?.[compositeKey]?.maxTriggerArray?.[rowIndex]?.[colIndex] || "",
                                  }
                                : {};

                              const isChanged = hasValuesChanged(question?.questionId, rowIndex, colIndex);

                              return (
                                <tr key={`${rowIndex}-${colIndex}`}>
                                  <td>{`${row.option} - ${column.option}`}</td>
                                  <td>
                                    <select
                                      className="form-select"
                                      value={cellValues.unit}
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
                                      value={cellValues.minTriggerValue}
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
                                      value={cellValues.maxTriggerValue}
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
                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        saveTriggerData(
                                          question,
                                          question?.questionId,
                                          rowIndex,
                                          colIndex
                                        )
                                      }
                                      disabled={!isChanged}
                                    >
                                      Save
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={question?.questionId}>
                      {(() => {
                        const currentMonthValue = monthValue || "";
                        const compositeKey = currentMonthValue ? `${question?.questionId}-${currentMonthValue}` : null;

                        const questionValues = compositeKey
                          ? {
                              unit: triggerValues[question?.questionId]?.[compositeKey]?.unit || "",
                              minTriggerValue: triggerValues[question?.questionId]?.[compositeKey]?.minTriggerValue || "",
                              maxTriggerValue: triggerValues[question?.questionId]?.[compositeKey]?.maxTriggerValue || "",
                            }
                          : {};

                        const isChanged = hasValuesChanged(question?.questionId);

                        return (
                          <tr>
                            <td>{question.title}</td>
                            <td>
                              <select
                                className="form-select"
                                value={questionValues.unit}
                                onChange={(e) =>
                                  handleSimpleQuestionChange(
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
                                value={questionValues.minTriggerValue}
                                onChange={(e) =>
                                  handleSimpleQuestionChange(
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
                                value={questionValues.maxTriggerValue}
                                onChange={(e) =>
                                  handleSimpleQuestionChange(
                                    question?.questionId,
                                    "maxTriggerValue",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  saveSimpleQuestionData(question, question?.questionId)
                                }
                                disabled={!isChanged}
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        );
                      })()}
                    </React.Fragment>
                  )
                )}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Triggers;