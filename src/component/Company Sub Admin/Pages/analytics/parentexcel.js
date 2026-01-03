import React, { useState, useEffect } from "react";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import * as XLSX from "xlsx";
import { Button, Form, Modal } from "react-bootstrap";
import { LocationField } from "../../../CarbonFootPrinting/common/FormComponents";
import MultiSelect from "../../Component/CommonComponent/MultiSelect";

// Utility function to generate dateMap and columns based on financial year
const generateDateMapAndColumns = (financialYearValue) => {
  if (!financialYearValue) return { dateMap: {}, columns: [] };

  // Extract start year from financial year (e.g., "2024-2025" -> 2024)
  const startYear = parseInt(financialYearValue.split('-')[0]);
  const endYear = startYear + 1;

  const dateMap = {};
  const columns = [];

  // Generate months from April of start year to March of end year
  const months = [
    { month: 4, year: startYear, name: 'Apr' },
    { month: 5, year: startYear, name: 'May' },
    { month: 6, year: startYear, name: 'Jun' },
    { month: 7, year: startYear, name: 'Jul' },
    { month: 8, year: startYear, name: 'Aug' },
    { month: 9, year: startYear, name: 'Sep' },
    { month: 10, year: startYear, name: 'Oct' },
    { month: 11, year: startYear, name: 'Nov' },
    { month: 12, year: startYear, name: 'Dec' },
    { month: 1, year: endYear, name: 'Jan' },
    { month: 2, year: endYear, name: 'Feb' },
    { month: 3, year: endYear, name: 'Mar' }
  ];

  months.forEach(({ month, year, name }) => {
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    const value = `${name} ${year}`;
    dateMap[key] = value;
    columns.push(value);
  });

  return { dateMap, columns };
};

const formatValue = (data) => {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (Array.isArray(item)) {
          return formatValue(item);
        } else if (item === null || item === undefined || item === "") {
          return;
        } else {
          return item;
        }
      })
      .join("<br>");
  } else if (typeof data === "object") {
    if (data.hasOwnProperty("readingValue")) {
      const value =
        typeof data.readingValue === "string"
          ? data.readingValue.replace(/,/g, "")
          : String(data.readingValue).replace(/,/g, "");
      return value;
    }
  }
  return "-";
};

const downloadExcel = (allAnswers, columns, sourceLabels, allQuestions, dateMap) => {
  const workbook = XLSX.utils.book_new();

  const groupedBySource = allAnswers.reduce((acc, item) => {
    let sourceId = `${item.sourceId}`;

    if (item.subLocationId) {
      sourceId = `${item.sourceId}-${item.subLocationId}`;
    }
    if (!acc[sourceId]) {
      acc[sourceId] = [];
    }
    acc[sourceId].push(item);
    return acc;
  }, {});

  const sourceIds = sourceLabels.map(label => label.id);

  const filteredGroupedBySource = Object.keys(groupedBySource)
    .filter((sourceId) => sourceIds.includes(sourceId))
    .reduce((acc, sourceId) => {
      acc[sourceId] = groupedBySource[sourceId];
      return acc;
    }, {});

  Object.keys(filteredGroupedBySource).forEach((sourceId) => {
    const sourceData = filteredGroupedBySource[sourceId];
    const sheetData = allQuestions.flatMap((question) => {
      const row = { Question: question?.title.replace(/<br>/g, "\n") || "-" };

      if (question?.questionType === 'tabular_question') {
        const subRows = question.details
          .filter(detail => detail.option_type === "column")
          .reverse()
          .map((detail, i) => {
            const row = {
              Question: `${question?.title.replace(/<br>/g, "\n")} - ${detail.option}` || "-"
            };

            columns.forEach((col) => {
              const datetime = Object.keys(dateMap).find(k => dateMap[k] === col);
              let answer = sourceData.find(item => item?.questionId === question.questionId && datetime === item.fromDate);
              
              if (answer?.notApplicable) {
                row[col] = 'NA';
              } else {
                const parsedAnswer = answer?.answer ? JSON.parse(answer.answer) : undefined;
                row[col] = parsedAnswer?.[0]?.[i];

                if (row[col] == null) {
                  row[col] = "No Answer";
                }
              }
            });

            return row;
          });

        if ([409].includes(question?.questionId)) {
          const totalRow = {
            Question: `${question?.title.replace(/<br>/g, "\n")}` || "-"
          };

          columns.forEach((col) => {
            let isNotApplicable = true;
            subRows.forEach(row => {
              if (row?.[col] !== 'NA') {
                isNotApplicable = false;
              }
            });

            if (isNotApplicable) {
              totalRow[col] = 'NA';
            } else {
              let isNoAnswer = true;
              totalRow[col] = subRows.reduce((acc, row) => {
                if (row[col] != null && row[col] != "No Answer") {
                  isNoAnswer = false;
                }
                const readingValue = Number(row[col] ?? 0);
                if (!isNaN(readingValue)) {
                  acc += readingValue;
                }
                return acc;
              }, 0);
              
              if (isNoAnswer) {
                totalRow[col] = "No Answer"
              }
            }
          });

          return [...subRows, totalRow];
        }

        return subRows;
        
      } else {
        columns.forEach((col) => {
          const datetime = Object.keys(dateMap).find(k => dateMap[k] === col);
          const answer = sourceData.find(item => item?.questionId === question.questionId && datetime === item.fromDate);

          if (!answer) {
            row[col] = "No Answer";
            return;
          }

          let value = "No Answer";

          if (answer?.notApplicable) {
            value = "NA";
          } else if (question?.questionType === "yes_no") {

            try {
              value = JSON.parse(answer?.answer).answer || "Invalid";
            } catch {
              value = "Invalid";
            }
          } else if (answer) {
            const parsedAnswer = answer?.answer ? JSON.parse(answer.answer) : undefined;

            let cleanedValue = formatValue(parsedAnswer);

            if (typeof cleanedValue === 'string' && cleanedValue.includes('<br>') && question?.questionId != 409) {
              value = cleanedValue
                .split('<br>')
                .reverse()
                .map(v => v.trim())
                .find(v => v !== '' && !isNaN(Number(v)));

              if (!value) {
                value = cleanedValue
                  .split('<br>')
                  .reverse()
                  .map(v => v.trim())
                  .find(v => v !== '');
              }
            } else {
              value = cleanedValue;
            }
          }

          row[col] = value;
        });

        return row;
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    worksheet['!cols'] = [{ width: 50 }, ...columns.map(() => ({ width: 15 }))];

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "00B050" }
        },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    const sourceLabel = sourceLabels.find(({ id }) => id === sourceId)?.label;
    XLSX.utils.book_append_sheet(workbook, worksheet, sourceLabel);
  });

  XLSX.writeFile(workbook, "all_locations_data.xlsx");
};

const Excel = ({ data, allQuestions, allAnswers, sourceLabels, selectedModuleName, financialYearId, dateMap, dynamicColumns }) => {
  const [processedData, setProcessedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [groupedModules, setGroupedModules] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAllLocations, setSelectAllLocations] = useState(false);
  const [selectAllPeriods, setSelectAllPeriods] = useState(false);

  const dataByQuestionId = data.reduce((acc, item) => {
    if (!acc[item.questionId]) {
      acc[item.questionId] = [];
    }
    acc[item.questionId].push(item);
    return acc;
  }, {});

  const handleDownload = () => {
    downloadExcel(allAnswers, selectedColumns, selectedSources, allQuestions, dateMap);
    setShowModal(false);
  };

  // Handle Select All Locations
  const handleSelectAllLocations = (checked) => {
    setSelectAllLocations(checked);
    if (checked) {
      const allSources = Object.keys(sourceLabels).map((key) => ({
        id: key,
        label: sourceLabels[key]
      }));
      setSelectedSources(allSources);
    } else {
      setSelectedSources([]);
    }
  };

  // Handle Select All Periods
  const handleSelectAllPeriods = (checked) => {
    setSelectAllPeriods(checked);
    if (checked) {
      setSelectedColumns([...columns]);
    } else {
      setSelectedColumns([]);
    }
  };

  // Update Select All checkboxes when individual items change
  useEffect(() => {
    const totalLocations = Object.keys(sourceLabels).length;
    setSelectAllLocations(totalLocations > 0 && selectedSources.length === totalLocations);
  }, [selectedSources, sourceLabels]);

  useEffect(() => {
    setSelectAllPeriods(columns.length > 0 && selectedColumns.length === columns.length);
  }, [selectedColumns, columns]);

  useEffect(() => {
    const processData = () => {
      setLoading(true);
      let newData = [];

      allQuestions.forEach((question) => {
        const { questionId, title, moduleName, questionType } = question;
        const questionData = {
          questionId,
          title,
          moduleName,
          values: {},
        };

        dynamicColumns.forEach((col) => {
          questionData.values[col] = "No Answer";
        });

        if (question?.questionId === 409) {
          const newTmpData = [];

          const columnDetails = question.details
            .filter(detail => detail.option_type === "column")
            .reverse();

          const totalQuestionData = {
            questionId,
            title,
            moduleName,
            values: {}
          }

          columnDetails.forEach((detail, i) => {
            // Create new object for each column
            let tmpQuestionData = {
              questionId,
              title,
              moduleName,
              values: {},
            };

            const row = {
              Question: `${question?.title.replace(/<br>/g, "\n")} - ${detail.option}` || "-"
            };

            dataByQuestionId[question?.questionId]
              ?.forEach(item => {
                const { fromDate, notApplicable, answer } = item;
                let value = "No Answer";

                tmpQuestionData.moduleName = questionData.moduleName;
                tmpQuestionData.questionId = questionId;

                const parsedAnswer = answer ? JSON.parse(answer) : undefined;
                const dateKey = dateMap[fromDate];

                tmpQuestionData.title = row.Question;

                if (dateKey) {
                  if (notApplicable) {
                    value = "NA";
                    tmpQuestionData.values[dateKey] = value;
                    totalQuestionData.values[dateKey] = value;
                  } else {
                    value = parsedAnswer?.[0]?.[i];
                    tmpQuestionData.values[dateKey] = value;
                    const readingValue = Number(value ?? 0);
                    if (!isNaN(readingValue)) {
                      totalQuestionData.values[dateKey] = (totalQuestionData.values?.[dateKey] ?? 0) + readingValue ;
                    }
                  }
                }
              });

            // Push a fresh object each time
            newTmpData.push(tmpQuestionData);
          });

          newData = [...newData, ...newTmpData, totalQuestionData];
        } else {
          dataByQuestionId[questionId]?.forEach((item) => {
            const { fromDate, notApplicable, answer } = item;
            let value = "No Answer";

            if (notApplicable) {
              value = "NA";
            } else if (questionType === "yes_no") {
              try {
                value = JSON.parse(answer).answer || "Invalid";
              } catch {
                value = "Invalid";
              }
            } else if (answer) {
              const parsedAnswer = JSON.parse(answer);
              let cleanedValue = formatValue(parsedAnswer);

              if (typeof cleanedValue === 'string' && cleanedValue.includes('<br>') && questionId != 409) {
                value = cleanedValue
                  .split('<br>')
                  .reverse()
                  .map(v => v.trim())
                  .find(v => v !== '' && !isNaN(Number(v)));

                if (!value) {
                  value = cleanedValue
                    .split('<br>')
                    .reverse()
                    .map(v => v.trim())
                    .find(v => v !== '');
                }
              } else {
                value = cleanedValue;
              }
            }

            const dateKey = dateMap[fromDate];
            if (dateKey) {
              questionData.values[dateKey] = value;
            }
          });
          newData.push(questionData);
        }
      });

      setProcessedData(newData);
      setColumns(dynamicColumns);
      setLoading(false);
    };

    if (dynamicColumns.length > 0) {
      processData();
    }
  }, [data, allQuestions, dynamicColumns, dateMap]);

  useEffect(() => {
    const groupQuestionsByModule = () => {
      const moduleGroups = {};

      processedData.forEach((questionData) => {
        const { moduleName, questionId, title, values } = questionData;

        if (!moduleGroups[moduleName]) {
          moduleGroups[moduleName] = [];
        }

        moduleGroups[moduleName].push({
          questionId,
          title,
          values,
        });
      });

      setGroupedModules(moduleGroups);
    };

    groupQuestionsByModule();
  }, [processedData]);

  const validateAllLocationAnswers = async () => {
    setLoading(true);
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}validateAllLocationAnswers`,
        {},
        { financialYearId: financialYearId, locationId: selectedModuleName },
        "POST"
      );
      if (isSuccess) {
        console.log("Validation successful");
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        color: "#fff"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid rgba(255,255,255,0.3)",
          borderTop: "4px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }}></div>
        <div style={{ fontSize: "18px", fontWeight: "500" }}>Processing data...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      overflow: "hidden"
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .action-button {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }
          
          .action-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .action-button:hover::before {
            left: 100%;
          }
        `}
      </style>

      {/* Header Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px 32px",
        color: "#fff"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h2 style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: "700"
            }}>
              📊 Data Analytics Dashboard
            </h2>
            <p style={{
              margin: "0",
              fontSize: "14px",
            }}>
              Comprehensive data analysis and reporting system
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)"
              }}
            >
              <span>📥</span>
              Download Excel
            </button>
            {/* <button
              onClick={() => validateAllLocationAnswers()}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)"
              }}
            >
              <span>✅</span>
              Accept Data
            </button> */}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ padding: "24px", overflowX: "auto" }}>
        <div style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          <table style={{
            borderCollapse: "collapse",
            width: "100%",
            fontFamily: "Roboto, sans-serif",
            tableLayout: "fixed",
            background: "#fff"
          }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <th style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  width: "5%",
                  borderRight: "1px solid rgba(255,255,255,0.2)"
                }}>
                  #
                </th>
                <th style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "left",
                  width: "40%",
                  borderRight: "1px solid rgba(255,255,255,0.2)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    📝 Question
                  </div>
                </th>
                {columns.map((col) => (
                  <th key={col} style={{
                    padding: "16px 8px",
                    fontWeight: "600",
                    textAlign: "center",
                    width: "15%",
                    borderRight: "1px solid rgba(255,255,255,0.2)",
                    fontSize: "13px"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <span>📅</span>
                      <span>{col}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedModules).map((moduleName, moduleIndex) => (
                <React.Fragment key={moduleName}>
                  {/* Module Header */}
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      style={{
                        padding: "16px 12px",
                        background: "linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)",
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "#2d5016",
                        textAlign: "center",
                        borderTop: moduleIndex > 0 ? "3px solid #e0e7ff" : "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        🏢 {moduleName}
                      </div>
                    </td>
                  </tr>

                  {/* Questions */}
                  {groupedModules[moduleName].map((questionData, index) => (
                    <tr key={questionData.questionId} style={{
                      backgroundColor: index % 2 === 0 ? "#fafbff" : "#fff",
                      transition: "all 0.2s ease"
                    }}>
                      <td style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb"
                      }}>
                        {index + 1}
                      </td>
                      <td style={{
                        padding: "12px",
                        fontWeight: "500",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#374151",
                        width: "40%"
                      }}
                        dangerouslySetInnerHTML={{
                          __html: questionData.title || "-",
                        }}
                      />
                      {columns.map((col) => {
                        const rawValue = questionData.values[col];
                        const numberValue = parseFloat(rawValue);
                        let displayValue;

                        if (!isNaN(numberValue) && isFinite(numberValue)) {
                          displayValue = Number.isInteger(numberValue)
                            ? numberValue.toString()
                            : numberValue.toFixed(2);
                        } else {
                          displayValue = rawValue ?? "No Answer";
                        }

                        // Style based on value type
                        let cellStyle = {
                          padding: "12px 8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                          width: "15%",
                          fontSize: "13px"
                        };

                        if (displayValue === "No Answer") {
                          cellStyle.background = "#fef2f2";
                          cellStyle.color = "#dc2626";
                          cellStyle.fontWeight = "500";
                        } else if (displayValue === "NA") {
                          cellStyle.background = "#f3f4f6";
                          cellStyle.color = "#6b7280";
                          cellStyle.fontWeight = "500";
                        } else if (!isNaN(numberValue)) {
                          cellStyle.background = "#f0f9ff";
                          cellStyle.color = "#0369a1";
                          cellStyle.fontWeight = "600";
                        } else {
                          cellStyle.background = "#f8fafc";
                          cellStyle.color = "#475569";
                          cellStyle.fontWeight = "500";
                        }

                        return (
                          <td
                            key={col}
                            style={cellStyle}
                            dangerouslySetInnerHTML={{ __html: displayValue }}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff"
        }}>
          <Modal.Header closeButton style={{ border: "none", color: "#fff" }}>
            <Modal.Title style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>⚙️</span>
              Export Configuration
            </Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body style={{ padding: "24px" }}>
          <Form>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {/* Location Selection */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <Form.Label style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📍 Select Locations
                </Form.Label>
                
                {/* Select All Locations Checkbox */}
                <div style={{
                  marginBottom: "12px",
                  padding: "12px",
                  background: "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)",
                  borderRadius: "8px",
                  border: "2px solid #6366f1"
                }}>
                  <Form.Check
                    type="checkbox"
                    label={<strong>Select All Locations</strong>}
                    checked={selectAllLocations}
                    onChange={(e) => handleSelectAllLocations(e.target.checked)}
                    style={{ 
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                  />
                </div>

                <div style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  background: "#f9fafb"
                }}>
                  {Object.keys(sourceLabels).map((sourceId) => (
                    <Form.Check
                      key={sourceId}
                      type="checkbox"
                      label={sourceLabels[sourceId]}
                      value={sourceId}
                      checked={selectedSources.some((item) => item.id === sourceId)}
                      style={{ marginBottom: "8px" }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSources((prev) =>
                          prev.some((item) => item.id === value)
                            ? prev.filter((item) => item.id !== value)
                            : [...prev, { id: value, label: sourceLabels[value] }]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Period Selection */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <Form.Label style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📅 Select Periods
                </Form.Label>
                
                {/* Select All Periods Checkbox */}
                <div style={{
                  marginBottom: "12px",
                  padding: "12px",
                  background: "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)",
                  borderRadius: "8px",
                  border: "2px solid #6366f1"
                }}>
                  <Form.Check
                    type="checkbox"
                    label={<strong>Select All Periods</strong>}
                    checked={selectAllPeriods}
                    onChange={(e) => handleSelectAllPeriods(e.target.checked)}
                    style={{ 
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                  />
                </div>

                <div style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  background: "#f9fafb"
                }}>
                  {columns.map((col, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={col}
                      value={col}
                      checked={selectedColumns.includes(col)}
                      style={{ marginBottom: "8px" }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedColumns((prev) =>
                          prev.includes(value)
                            ? prev.filter((c) => c !== value)
                            : [...prev, value]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: "#f8fafc", border: "none" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            style={{
              borderRadius: "8px",
              padding: "8px 20px",
              fontWeight: "600"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontWeight: "600"
            }}
          >
            📥 Download Excel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Parent component with beautiful design
const ParentExcel = ({ allAnswers, allQuestionsById, sortedQuestions, financialYear, financialYearId, onFinancialYearChange }) => {
  const [sourceLabels, setUserLabels] = useState({});
  const [sourceIds, setSourceIds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterQuestions, setFilterQuestions] = useState(sortedQuestions);


  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [selectedModuleName, setSelectedModuleName] = useState("ALL");
  const [dateMap, setDateMap] = useState({});
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);

  const moduleNames = Array.from(
    new Set(sortedQuestions.map((item) => item.moduleName))
  );

  const moduleNamesWithValue = Array.from(
    new Map(
      sortedQuestions.map((item) => [item.moduleId, { label: item.moduleName, value: item.moduleId }])
    ).values()
  );

  useEffect(() => {
    const filteredQuestions = sortedQuestions.filter(q =>
      selectedModules.includes(q.moduleId)
    );
    setFilterQuestions(filteredQuestions);
  }, [selectedModules])


  useEffect(() => {
    const selectedFinancialYear = financialYear.find(fy => fy.id === financialYearId);
    if (selectedFinancialYear && selectedFinancialYear.financial_year_value) {
      const { dateMap: newDateMap, columns: newColumns } = generateDateMapAndColumns(selectedFinancialYear.financial_year_value);
      setDateMap(newDateMap);
      setDynamicColumns(newColumns);
    }
  }, [financialYearId, financialYear]);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
          {},
          {},
          "GET"
        );

        if (isSuccess && data?.data) {
          setLocations(
            data.data.flatMap(item => {
              const locations = [];

              // main location
              if (item.id) {
                locations.push({
                  value: String(item.id),
                  label: item.unitCode || `${item?.location?.area || ""}, ${item?.location?.city || ""}`.trim()
                });
              }

              // sub locations (if any)
              if (item.subLocation && item.subLocation.length > 0) {
                item.subLocation.forEach(sub => {
                  locations.push({
                    value: `${item.id}-${sub.id}`, // unique key
                    label: `${item.unitCode} - ${sub.subLocation}`
                  });
                });
              }

              return locations;
            })
          );

          const labels = data.data.reduce((acc, item) => {
            if (item.id) {
              if (item.subLocation && item.subLocation.length > 0) {
                item.subLocation.forEach((location) => {
                  const key = `${item.id}-${location.id}`;
                  const value = `${item.unitCode} - ${location.subLocation}`;
                  acc[key] = value;
                });
              }
              acc[item.id] = item.unitCode;
            }
            return acc;
          }, {});
          setUserLabels(labels);
        }
      } catch (error) {
        console.error("Error fetching source labels:", error);
      }
    };
    getLocations();
  }, []);

  useEffect(() => {
    setSourceIds(
      Array.from(
        new Set(
          allAnswers.flatMap((item) => {
            if (sourceLabels[item.sourceId]) {
              return Object.keys(sourceLabels).filter((key) =>
                key.startsWith(item.sourceId.toString())
              );
            }
            return item.sourceId;
          })
        )
      )
    );
  }, [sourceLabels, allAnswers]);

  const filteredData = allAnswers
    .filter((item) => {
      if (!selectedSourceId) return false;

      const currentQuestion = allQuestionsById[item.questionId];
      if (!currentQuestion) return false;

      let matchesSourceId = false;

      if (item.subLocationId) {
        const sourceId = `${item.sourceId}-${item.subLocationId}`;
        matchesSourceId =
          selectedSourceId === "ALL" || sourceId === selectedSourceId;
      } else {
        matchesSourceId =
          selectedSourceId === "ALL" ||
          item.sourceId == selectedSourceId ||
          item.sourceId === selectedSourceId;
      }

      const matchesModuleName =
        selectedModuleName === "ALL" ||
        currentQuestion.moduleName === selectedModuleName;

      if (matchesSourceId && matchesModuleName) {
        item.moduleName = currentQuestion.moduleName;
        return true;
      }
      return false;
    })
    .sort((a, b) => {
      if (selectedModuleName === "ALL") {
        const moduleA = a.moduleName || "";
        const moduleB = b.moduleName || "";
        return moduleA.localeCompare(moduleB);
      }
      return 0;
    });

  const handleFinancialYearChange = (event) => {
    const newFinancialYearId = parseInt(event.target.value);
    onFinancialYearChange(newFinancialYearId);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px"
    }}>
      <style>
        {`
          .filter-card {
            background: rgba(255, 255, 255, 0.95);
            
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
          }
          
          .filter-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          
          .select-style {
            padding: 12px 16px;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            width: 100%;
            font-size: 14px;
            background: #fff;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          
          .select-style:focus {
            border-color: #6366f1;
            outline: none;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }
        `}
      </style>

      {/* Filters Section */}
      <div className="filter-card" style={{
        marginBottom: "24px",
        padding: "24px"
      }}>
        <div style={{
          marginBottom: "16px"
        }}>
          <h3 style={{
            margin: "0 0 8px 0",
            color: "#1f2937",
            fontSize: "20px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            🎛️ Data Filters
          </h3>
          <p style={{
            margin: "0",
            color: "#6b7280",
            fontSize: "14px"
          }}>
            Configure your data selection criteria
          </p>
        </div>

        <div className="d-flex flex-nowrap gap-3 mb-3">
          <div className="flex-fill">
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "700",
              color: "#374151",
              fontSize: "14px"
            }}>
              📅 Financial Year
            </label>
            <select
              className="select-style"
              value={financialYearId || ""}
              onChange={handleFinancialYearChange}
            >
              {financialYear?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-fill">
            <LocationField
              value={selectedSourceId}
              onChange={setSelectedSourceId}
              options={locations}
              required={true}
            />
          </div>
          {moduleNamesWithValue && moduleNamesWithValue.length ? <div className="flex-fill">
            <MultiSelect
              options={moduleNamesWithValue}
              selectedValues={selectedModules}
              onChange={setSelectedModules}
              placeholder="Select Module"
              label="Module"
              icon="🏢"
            />
          </div> : <></>}
        </div>
        {/* Status Indicators */}
        <div style={{
          marginTop: "20px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <div style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>📊</span>
            {filteredData.length} Records Found
          </div>
          <div style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>📅</span>
            {dynamicColumns.length} Periods
          </div>
          <div style={{
            padding: "8px 16px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>🏢</span>
            {selectedModuleName === "ALL" ? moduleNames.length : 1} Module{selectedModuleName === "ALL" ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "16px" }}>
        <Excel
          data={filteredData}
          allQuestions={filterQuestions}
          allAnswers={allAnswers}
          sourceLabels={sourceLabels}
          selectedModuleName={selectedModuleName}
          financialYearId={financialYearId}
          dateMap={dateMap}
          dynamicColumns={dynamicColumns}
        />
      </div>
    </div>
  );
};

export default ParentExcel;