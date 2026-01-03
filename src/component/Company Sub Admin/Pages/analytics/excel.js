import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const downloadExcel = (processedData, columns, sourceLabels) => {
    const workbook = XLSX.utils.book_new(); // Create a new workbook

    // Group data by location (sourceId)
    const groupedBySource = processedData.reduce((acc, item) => {
        const sourceId = item.sourceId;
        if (!acc[sourceId]) {
            acc[sourceId] = [];
        }
        acc[sourceId].push(item);
        return acc;
    }, {});

    // Create a new worksheet for each sourceId (Location)
    Object.keys(groupedBySource).forEach((sourceId) => {
        const sourceData = groupedBySource[sourceId];
        const sheetData = sourceData.map((item) => {
            const row = { Question: item.title.replace(/<br>/g, "\n") }; // Replace <br> with \n
            columns.forEach((col) => {
                const value = item.values[col] || "-";
                row[col] = typeof value === "string" ? value.replace(/<br>/g, "\n") : value; // Replace <br> in cell values
            });
            return row;
        });

        // Create a worksheet for the location
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const sourceLabel = sourceLabels[sourceId] || `Location ${sourceId}`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sourceLabel); // Add the worksheet with the location name
    });

    // Trigger the download of the Excel file
    XLSX.writeFile(workbook, "processed_data_by_location.xlsx");
};

const Excel = ({ data, allQuestions }) => {
    const [processedData, setProcessedData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [groupedModules, setGroupedModules] = useState({}); // State to store grouped modules

    const fixedColumns = [
        "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024",
        "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
    ];

    const dateMap = {
        "2024-04": "Apr 2024",
        "2024-05": "May 2024",
        "2024-06": "Jun 2024",
        "2024-07": "Jul 2024",
        "2024-08": "Aug 2024",
        "2024-09": "Sep 2024",
        "2024-10": "Oct 2024",
        "2024-11": "Nov 2024",
        "2024-12": "Dec 2024",
        "2025-01": "Jan 2025",
        "2025-02": "Feb 2025",
        "2025-03": "Mar 2025",
    };

    useEffect(() => {
        const processData = () => {
            const newData = [];

            allQuestions.forEach((question) => {
                const { questionId, title, moduleName, questionType, details } = question;
                const questionData = {
                    questionId,
                    title,
                    moduleName,
                    values: {},
                };

                // Initialize all fixed columns with "No Answer"
                fixedColumns.forEach((col) => {
                    questionData.values[col] = "No Answer";
                });

                // Process actual data
                data.forEach((item) => {
                    if (item?.questionId === questionId) {
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
                            value = formatValue(parsedAnswer);
                        }

                        const dateKey = dateMap[fromDate]; // Convert "04-2024" → "Apr 2024"
                        if (dateKey) {
                            questionData.values[dateKey] = value;
                        }
                    }
                });

                newData.push(questionData);
            });

            setProcessedData(newData);
            setColumns(fixedColumns); // Use fixed date columns
        };

        processData();
    }, [data, allQuestions]);

    useEffect(() => {
        const groupQuestionsByModule = () => {
            const moduleGroups = {};

            processedData.forEach((questionData) => {
                const { moduleName, questionId, title, values } = questionData;

                // If the moduleName is not already a key in the moduleGroups object, create it
                if (!moduleGroups[moduleName]) {
                    moduleGroups[moduleName] = [];
                }

                // Add the question to the respective module's array
                moduleGroups[moduleName].push({
                    questionId,
                    title,
                    values,
                });
            });

            setGroupedModules(moduleGroups); // Store the grouped data
        };

        groupQuestionsByModule();
    }, [processedData]);

    const formatValue = (data) => {
        if (Array.isArray(data)) {
            return data
                .map((item) => {
                    if (Array.isArray(item)) {
                        return formatValue(item);
                    } else if (item === null || item === undefined || item === "") {
                        return "-";
                    } else {
                        const parsed = parseFloat(item);
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
                return data.readingValue;
            }
        }
        return "-";
    };

    const headerStyle = {
        background: "#f1f1f1",
        textAlign: "center",
        fontWeight: "bold",
        padding: "8px",
        border: "1px solid #ddd",
    };

    const cellStyle = {
        padding: "8px",
        border: "1px solid #ddd",
    };

    return (
        <div
            style={{
                overflowX: "auto",
                padding: "16px",
                background: "#f9fafc",
                borderRadius: "12px",
            }}
        >
            <button
                onClick={() => downloadExcel(processedData, columns, {})}
                disabled={processedData.length === 0 || columns.length === 0}
                style={{
                    marginBottom: "12px",
                    padding: "8px 16px",
                    background: processedData.length === 0 ? "#ccc" : "#2a9d8f",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Download Excel
            </button>

            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontFamily: "Roboto, sans-serif",
                    tableLayout: "fixed", // Ensures fixed layout for consistent column widths
                }}
            >
                <thead>
                    <tr>
                        <th style={{ ...headerStyle, width: "5%" }}>#</th>
                        <th style={{ ...headerStyle, width: "40%" }}>Question</th>
                        {columns.map((col) => (
                            <th key={col} style={{ ...headerStyle, width: "15%" }}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedModules).map((moduleName) => (
                        <>
                            {/* Render the module header */}
                            <tr
                                key={`${moduleName}-header`}
                                style={{ background: "#f1f5f9" }}
                            >
                                <td
                                    colSpan={columns.length + 2}
                                    style={{
                                        ...cellStyle,
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        color: "#2a4c32",
                                        textAlign: "center",
                                        background: "#d8f3dc",
                                    }}
                                >
                                    {moduleName}
                                </td>
                            </tr>

                            {/* Render each question in the module */}
                            {groupedModules[moduleName].map((questionData, index) => (
                                <tr key={questionData.questionId}>
                                    <td
                                        style={{
                                            ...cellStyle,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            width: "5%", // Fixed width for question number
                                        }}
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        style={{
                                            ...cellStyle,
                                            color: "#1d3b1d",
                                            fontWeight: "bold",
                                            width: "40%", // Fixed width for question column
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: questionData.title || "-",
                                        }}
                                    ></td>
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            style={{
                                                ...cellStyle,
                                                background: "#fff",
                                                color: "#000000",
                                                textAlign: "right",
                                                width: "15%", // Fixed width for other data columns
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: questionData.values[col] ?? "-",
                                            }}
                                        ></td>
                                    ))}
                                </tr>
                            ))}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Excel;
