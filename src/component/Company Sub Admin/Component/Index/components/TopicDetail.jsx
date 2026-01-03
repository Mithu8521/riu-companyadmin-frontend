import { useState } from "react";
import Table from "react-bootstrap/Table";
import StatusIndicator from "./StatusIndicator";
import { InputGroup, Modal, Button } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import * as XLSX from 'xlsx';
import { getPeriod, getStartingMonth } from "../../../../CarbonFootPrinting/utils/PeriodCalculationUtils";

const TopicDetailComponent = ({ topicData, answers, documents, groupedTopicsData, activeTabName, selectedIndicatorType, financialYearOptions, timePeriodOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowDocuments = (documents) => {
    setSelectedDocuments(documents);
    setShowDocumentsModal(true);
  };

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
    setSelectedDocuments([]);
  };

  const handleShowQuestions = (item) => {
    setSelectedQuestions(item.indexDetails?.questionDataDetails || []);
    setModalTitle(item.title || 'Question Details');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestions([]);
    setModalTitle('');
  };

  const splitString = (str, length) => {
    if (!str) return "";
    const regex = new RegExp(`(.{1,${length}})`, "g");
    return str.match(regex)?.join("\n") || str;
  };

  const getPadding = (title) => {
    if (!title) return "12px";
    const words = title.split(" ");
    return words.length > 6 ? "20px" : "12px";
  };

  const filteredByStatus = selectedOptions.length === 0
    ? topicData
    : topicData.filter((item) => {
      const foundData = answers?.find(
        (data) => data.questionId === item.id
      );
      return foundData ? selectedOptions.includes(foundData.status) : false;
    });

  const filteredTopicData = filteredByStatus.filter((item) =>
    item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themeColor = "rgb(63, 136, 165)";
  const lightTheme = "rgba(63, 136, 165, 0.1)";
  const ultraLightTheme = "rgba(63, 136, 165, 0.05)";

  const formatDataForExcel = (data, topicName) => {
    return data.map((item, index) => {
      const owners = item.indexDetails?.dataOwnerDetails?.map(
        (d) => `${d.first_name} ${d.last_name ?? ""}`.trim()
      );
      const uniqueOwners = owners ? [...new Set(owners)] : [];

      const checkers = item.indexDetails?.dataCheckerDetails?.map(
        (d) => `${d.first_name} ${d.last_name ?? ""}`.trim()
      );
      const uniqueCheckers = checkers ? [...new Set(checkers)] : [];

      const designations = item.indexDetails?.dataOwnerDetails?.map(
        (d) => d.designation || "No Department"
      );
      const uniqueDesignations = designations ? [...new Set(designations)] : [];

      const foundData = answers?.find((data) => data.questionId === item.id);
      const status = foundData ? foundData.status : "No Status";

      let proofDocuments = [];
      if (item.questionType === "tabular_question") {
        proofDocuments = foundData?.combinedAnswers?.[0]?.proofDocument ?? [];
      } else {
        proofDocuments = foundData?.proofDocument ?? [];
      }
      const proofDocIds = Array.isArray(proofDocuments)
        ? proofDocuments.flatMap((obj) => Object.keys(obj))
        : [];
      const proofDocumentUrls = proofDocIds
        .map((id) => documents?.[id]?.fileMetadata?.url)
        .filter(Boolean)
        .join(", ");

      const questionDetails = item.indexDetails?.questionDataDetails?.map(
        (q) => q.title || "No Title"
      ).join("\n") || "No Question Details";

      return {
        "Sr. No.": item?.report_id || (index + 1),
        "Question Heading": item?.title || "No Title",
        "Department": uniqueDesignations.length > 0 ? uniqueDesignations.join(", ") : "No Department",
        "Data Owner": uniqueOwners.length > 0 ? uniqueOwners.join(", ") : "No Owner Assigned",
        "Data Checker": uniqueCheckers.length > 0 ? uniqueCheckers.join(", ") : "No Checker Assigned",
        "Status": status,
        "Proof Document Links": proofDocumentUrls || "No Documents",
        "Question Details": questionDetails
      };
    });
  };

  const downloadCurrentTopicExcel = () => {
    if (!filteredTopicData || filteredTopicData.length === 0) {
      alert("No data available to download");
      return;
    }

    const excelData = formatDataForExcel(filteredTopicData, activeTabName || "Current Topic");
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    ws['!cols'] = [
      { wch: 8 }, { wch: 40 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 50 }, { wch: 50 }
    ];

    Object.keys(ws).forEach((cell) => {
      if (cell[0] !== "!") {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.alignment = { wrapText: true, vertical: "top", horizontal: "left" };
      }
    });

    XLSX.utils.book_append_sheet(wb, ws, activeTabName || "Current Topic");
    XLSX.writeFile(wb, `${activeTabName || 'Current_Topic'}_Report.xlsx`);
  };

  const downloadAllTopicsExcel = () => {
    if (!groupedTopicsData || Object.keys(groupedTopicsData).length === 0) {
      alert("No data available to download");
      return;
    }

    const wb = XLSX.utils.book_new();

    Object.keys(groupedTopicsData).forEach((topicName) => {
      const topicData = groupedTopicsData[topicName];

      const filteredTopicData = topicData.filter(item => {
        if (selectedIndicatorType === "Leadership Indicators") {
          return item.heading === "Leadership Indicators";
        } else {
          return item.heading !== "Leadership Indicators";
        }
      });

      if (filteredTopicData.length > 0) {
        const excelData = formatDataForExcel(filteredTopicData, topicName);
        const ws = XLSX.utils.json_to_sheet(excelData);

        ws['!cols'] = [
          { wch: 15 }, { wch: 8 }, { wch: 40 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 30 }
        ];

        Object.keys(ws).forEach((cell) => {
          if (cell[0] !== "!") {
            if (!ws[cell].s) ws[cell].s = {};
            ws[cell].s.alignment = { wrapText: true, vertical: "top", horizontal: "left" };
          }
        });

        const sanitizedName = (topicName || "")
          .replace(/[\\\/\?\*\[\]:]/g, "_")
          .substring(0, 31);

        XLSX.utils.book_append_sheet(wb, ws, sanitizedName);
      }
    });

    if (wb.SheetNames.length === 0) {
      alert(`No data available for ${selectedIndicatorType}`);
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const indicatorTypeSuffix = (selectedIndicatorType ?? "").replace(/\s+/g, "_");
    XLSX.writeFile(wb, `All_Topics_${indicatorTypeSuffix}_Report_${currentDate}.xlsx`);
  };

  const headerCellStyle = {
    padding: "16px 12px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Montserrat', sans-serif",
    color: "rgb(63, 136, 165)",
    backgroundColor: "white",
    border: "none",
    borderBottom: "1px solid rgba(63, 136, 165, 0.1)",
    textAlign: "left",
    whiteSpace: "nowrap"
  };

  const bodyCellStyle = {
    padding: "12px",
    fontSize: "13px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#374151",
    border: "none",
    borderBottom: "1px solid rgba(63, 136, 165, 0.05)",
    verticalAlign: "middle"
  };

  return (
    <>
      <div style={{
        width: "100%",
        maxWidth: "100%",
        padding: "24px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${lightTheme}`,
      }}>
        <div style={{
          marginBottom: "24px",
          padding: "20px",
          background: `linear-gradient(135deg, ${themeColor} 0%, rgba(63, 136, 165, 0.8) 100%)`,
          borderRadius: "12px",
          color: "white"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{
                margin: "0 0 8px 0",
                fontSize: "24px",
                fontWeight: "700",
                fontFamily: "'Montserrat', sans-serif"
              }}>
                Topic Details
              </h2>
              <p style={{
                margin: 0,
                fontSize: "14px",
                opacity: "0.9",
                fontFamily: "'Montserrat', sans-serif"
              }}>
                Manage and track your questionnaire responses
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={downloadCurrentTopicExcel} style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "500",
                fontFamily: "'Montserrat', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                Download Current Topic
              </button>

              <button onClick={downloadAllTopicsExcel} style={{
                padding: "8px 16px",
                backgroundColor: "white",
                color: themeColor,
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "'Montserrat', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                Download All Topics
              </button>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: "20px", position: "relative" }}>
          <InputGroup style={{
            backgroundColor: "white",
            border: `2px solid ${lightTheme}`,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease"
          }}>
            <FormControl
              placeholder="Search questions by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                backgroundColor: "white",
                border: "none",
                fontSize: "14px",
                fontFamily: "'Montserrat', sans-serif",
                padding: "12px 16px",
                outline: "none",
                boxShadow: "none"
              }}
            />
          </InputGroup>
        </div>

        <div style={{
          width: "100%",
          height: "70vh",
          overflow: "auto",
          borderRadius: "12px",
          border: `1px solid ${lightTheme}`,
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}>
          <Table style={{
            width: "100%",
            maxWidth: "100%",
            margin: 0,
            backgroundColor: "white"
          }} className="table-hover">
            <thead style={{
              position: "sticky",
              top: 0,
              background: `linear-gradient(135deg, ${ultraLightTheme} 0%, white 100%)`,
              zIndex: 10,
              borderBottom: `2px solid ${lightTheme}`
            }}>
              <tr>
                <th style={headerCellStyle}>#</th>
                <th style={{ ...headerCellStyle, minWidth: "200px" }}>Question Heading</th>
                <th style={headerCellStyle}>Department</th>
                <th style={headerCellStyle}>Data Owner</th>
                <th style={headerCellStyle}>Data Checker</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Evidence</th>
                <th style={headerCellStyle}>Reporting Question</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopicData.map((item, index) => {
                const foundData = answers?.find((data) => data.questionId == item.id);
                let proofDocuments = [];
                if (item.questionType === "tabular_question") {
                  proofDocuments = foundData?.combinedAnswers?.[0]?.proofDocument ?? [];
                } else {
                  proofDocuments = foundData?.proofDocument ?? [];
                }
                const proofDocIds = Array.isArray(proofDocuments)
                  ? proofDocuments.flatMap((obj) => Object.keys(obj))
                  : [];
                const matchedUrls = proofDocIds
                  .map((id) => documents?.[id]?.fileMetadata)
                  .filter(Boolean);

                return (
                  <tr key={index} style={{
                    transition: "all 0.2s ease",
                    backgroundColor: index % 2 === 0 ? "white" : ultraLightTheme
                  }}>
                    <td style={bodyCellStyle}>
                      <span style={{
                        backgroundColor: lightTheme,
                        color: themeColor,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {item?.report_id}
                      </span>
                    </td>
                    <td style={{
                      ...bodyCellStyle,
                      paddingTop: getPadding(item?.title),
                      paddingBottom: getPadding(item?.title),
                      maxWidth: "250px"
                    }}>
                      <div style={{
                        padding: "8px 12px",
                        background: "linear-gradient(135deg, #7db3cf 0%, #5ba0c2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "500",
                        lineHeight: "1.4",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        boxShadow: "0 2px 4px rgba(125, 179, 207, 0.25)"
                      }}>
                        {item?.title || "No Title"}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 12px",
                        backgroundColor: ultraLightTheme,
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}>
                        {(() => {
                          const designations = item.indexDetails?.dataOwnerDetails?.map(
                            (d) => d.designation || "No Department"
                          );
                          const uniqueDesignations = designations ? [...new Set(designations)] : [];
                          return uniqueDesignations.length > 0 ? uniqueDesignations.join(", ") : "No Department";
                        })()}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                        {(() => {
                          const owners = item.indexDetails?.dataOwnerDetails?.map(
                            (d) => `${d.first_name} ${d.last_name ?? ""}`.trim()
                          );
                          const uniqueOwners = owners ? [...new Set(owners)] : [];

                          return uniqueOwners.length > 0
                            ? uniqueOwners.map((owner, idx) => (
                              <div key={idx} style={{
                                padding: "6px 12px",
                                background: "linear-gradient(135deg, #7db3cf 0%, #5ba0c2 100%)",
                                color: "white",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "500",
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(125, 179, 207, 0.25)"
                              }}>
                                {owner}
                              </div>
                            ))
                            : <div style={{
                              padding: "6px 12px",
                              background: "linear-gradient(135deg, #f0f6f9 0%, #e6f2f7 100%)",
                              color: "#4a6b7a",
                              border: "1px solid #d0e3ea",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "400",
                              textAlign: "center",
                              fontStyle: "italic"
                            }}>
                              No Owner Assigned
                            </div>;
                        })()}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                        {(() => {
                          const checkers = item.indexDetails?.dataCheckerDetails?.map(
                            (d) => `${d.first_name} ${d.last_name ?? ""}`.trim()
                          );
                          const uniqueCheckers = checkers ? [...new Set(checkers)] : [];

                          return uniqueCheckers.length > 0
                            ? uniqueCheckers.map((checker, idx) => (
                              <div key={idx} style={{
                                padding: "6px 12px",
                                background: "linear-gradient(135deg, #7db3cf 0%, #5ba0c2 100%)",
                                color: "white",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "500",
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(125, 179, 207, 0.25)"
                              }}>
                                {checker}
                              </div>
                            ))
                            : <div style={{
                              padding: "6px 12px",
                              background: "linear-gradient(135deg, #f0f6f9 0%, #e6f2f7 100%)",
                              color: "#4a6b7a",
                              border: "1px solid #d0e3ea",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "400",
                              textAlign: "center",
                              fontStyle: "italic"
                            }}>
                              No Checker Assigned
                            </div>;
                        })()}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      {(() => {
                        const questionStatuses = item.indexDetails?.questionDataDetails?.map(q => q.status) || [];

                        let questionStatus = 'Not Answered';
                        if (questionStatuses.length > 0) {
                          if (questionStatuses.every(s => s === 'Accepted')) {
                            questionStatus = 'Accepted';
                          } else if (questionStatuses.every(s => s === 'Rejected')) {
                            questionStatus = 'Rejected';
                          } else {
                            questionStatus = 'Answered';
                          }
                        }

                        return <StatusIndicator status={questionStatus} />;
                      })()}
                    </td>
                    <td style={bodyCellStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {matchedUrls.length > 0 ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              padding: "4px 10px",
                              backgroundColor: lightTheme,
                              color: themeColor,
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}>
                              {matchedUrls.length} {matchedUrls.length === 1 ? 'Doc' : 'Docs'}
                            </span>
                            <button
                              onClick={() => handleShowDocuments(matchedUrls)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                backgroundColor: themeColor,
                                color: "white",
                                transition: "all 0.2s ease",
                                fontSize: "11px",
                                fontWeight: "500"
                              }}
                              title="View All Documents"
                            >
                              View All
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#6B7280", fontSize: "12px", fontStyle: "italic" }}>
                            No Evidence
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        onClick={() => handleShowQuestions(item)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          backgroundColor: lightTheme,
                          color: themeColor,
                          transition: "all 0.2s ease",
                          fontSize: "11px",
                          fontWeight: "500"
                        }}
                        title="View Question Details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: themeColor, color: "white", border: "none" }}>
          <Modal.Title style={{ fontSize: "18px", fontWeight: "600", fontFamily: "'Montserrat', sans-serif" }}>
            Question Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8fafc", maxHeight: "60vh", overflowY: "auto" }}>
          {selectedQuestions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedQuestions.map((question, index) => {
                const getStatusStyle = (status) => {
                  switch (status) {
                    case 'Accepted':
                      return { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
                    case 'Rejected':
                      return { backgroundColor: "#fee2e2", color: "#dc2626", borderColor: "#fecaca" };
                    case 'Answered':
                      return { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" };
                    case 'Not Answered':
                      return { backgroundColor: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" };
                    default:
                      return { backgroundColor: ultraLightTheme, color: themeColor, borderColor: lightTheme };
                  }
                };

                const statusStyle = getStatusStyle(question.status);

                return (
                  <div key={index} style={{
                    padding: "16px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: `1px solid ${lightTheme}`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: themeColor,
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        flexShrink: 0,
                        marginTop: "2px"
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h6 style={{
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          lineHeight: "1.4",
                          fontFamily: "'Montserrat', sans-serif"
                        }}>
                          {question.title || "No Title Available"}
                        </h6>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          {question.moduleName && (
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 8px",
                              backgroundColor: ultraLightTheme,
                              color: themeColor,
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "500"
                            }}>
                              {question.moduleName}
                            </div>
                          )}
                          {question.frequency !=='CUSTOM' && question?.status && (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "3px 8px",
                                backgroundColor: statusStyle.backgroundColor,
                                color: statusStyle.color,
                                border: `1px solid ${statusStyle.borderColor}`,
                                borderRadius: "12px",
                                fontSize: "10px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {question.status.replace(/_/g, " ")}
                            </div>
                          )}
                          {console.log(question.frequency==='CUSTOM',"questionquestionquestion")}
                          {question.frequency==='CUSTOM' && question.answerDataMatches?.map((item, answerIndex) => {
                            let periodLabel = null;
                            if (item?.fromDate && item?.toDate) {
                              const financialYear = financialYearOptions?.find(
                                fy => fy.value == item.financialYearId
                              );
                              const period = getPeriod(
                                item.fromDate,
                                item.toDate,
                                financialYear?.label,
                                getStartingMonth()
                              );
                              const timePeriod = timePeriodOptions?.find(
                                option => option.value == period
                              );
                              periodLabel = timePeriod?.label;
                            }

                            return (
                              <div
                                key={answerIndex}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                  width: "100%",
                                  marginTop: answerIndex > 0 ? "8px" : "0",
                                }}
                              >
                                {periodLabel && (
                                  <div
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "2px 8px",
                                      backgroundColor: ultraLightTheme,
                                      color: themeColor,
                                      borderRadius: "4px",
                                      fontSize: "11px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {periodLabel}
                                  </div>
                                )}

                                {item?.status && (
                                  <div
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "3px 8px",
                                      backgroundColor: statusStyle.backgroundColor,
                                      color: statusStyle.color,
                                      border: `1px solid ${statusStyle.borderColor}`,
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    {item.status.replace(/_/g, " ")}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6B7280", fontSize: "14px", fontStyle: "italic" }}>
              No questions available for this item.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "white", borderTop: `1px solid ${lightTheme}`, padding: "16px 20px" }}>
          <Button variant="outline-secondary" onClick={handleCloseModal} style={{
            borderColor: themeColor,
            color: themeColor,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            padding: "8px 20px"
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDocumentsModal} onHide={handleCloseDocumentsModal} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: themeColor, color: "white", border: "none" }}>
          <Modal.Title style={{ fontSize: "18px", fontWeight: "600", fontFamily: "'Montserrat', sans-serif" }}>
            Evidence Documents ({selectedDocuments.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8fafc", maxHeight: "60vh", overflowY: "auto" }}>
          {selectedDocuments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedDocuments.map((item, index) => (
                <div key={index} style={{
                  padding: "16px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: `1px solid ${lightTheme}`,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: lightTheme,
                      color: themeColor,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0
                    }}>
                      📄
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h6 style={{
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        fontFamily: "'Montserrat', sans-serif"
                      }}>
                        {item?.fileName}
                      </h6>
                    </div>
                  </div>
                  <a
                    href={item?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: themeColor,
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      fontFamily: "'Montserrat', sans-serif",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#6B7280",
              fontSize: "14px",
              fontStyle: "italic"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              No documents available.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{
          backgroundColor: "white",
          borderTop: `1px solid ${lightTheme}`,
          padding: "16px 20px"
        }}>
          <Button
            variant="outline-secondary"
            onClick={handleCloseDocumentsModal}
            style={{
              borderColor: themeColor,
              color: themeColor,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "500",
              padding: "8px 20px"
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TopicDetailComponent;