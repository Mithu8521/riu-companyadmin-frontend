import React from "react";
import { Table, Modal, Button, Row, Col, Form } from "react-bootstrap";
import "./TabularQuestionType.css";
import { useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

const TabularQuestionType = ({
  title,
  answer,
  item,
  documents,
  question_detail,
  note,
  menu,
  combinedAnswers,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  const handleDoubleClick = (text) => {
    setFullText(text);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);


  const rows = question_detail?.filter(
    (detail) => detail.option_type === "row"
  ) || [
      { id: 1, option: "Row 1" },
      { id: 2, option: "Row 2" },
      { id: 3, option: "Row 3" },
    ];
  const columns = question_detail?.filter(
    (detail) => detail.option_type === "column"
  ) || [{ id: 1, option: "Column 1" },
  { id: 2, option: "Column 2" },
  { id: 3, option: "Column 3" },]

  const FullTextModal = ({ show, handleClose, fullText }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Full Text</Modal.Title>
      </Modal.Header>
      <Modal.Body>{fullText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
  const handleFileDownload = (url) => {
    const replacedUrl = url.replace(
      "https://riu-bucket.s3.ap-south-1.amazonaws.com",
      "https://copyadatafromawstoazure.blob.core.windows.net/uploads"
    );
    const link = document.createElement("a");
    link.href = replacedUrl;
    link.target = "_blank"; // Opens in a new tab
    link.download = replacedUrl.split("/").pop();
    document.body.appendChild(link); // Append to body
    link.click();
    document.body.removeChild(link); // Clean up
  };
  const wrapTextWithLineBreaks = (text, wordsPerLine) => {
    if (!text) return "";
    const words = text.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(" "));
    }
    return lines.join("<br />");
  };
  const itemHeight = "6vh"; // Adjust height as per design

  const inputStyle = {
    height: itemHeight,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    backgroundColor: "white",
    borderRadius: "5px",
  };

  // Process documents for the document grid
  const processDocuments = () => {
    // Normalize proofDocument into an array
    const proofDocs = [...new Set((combinedAnswers[0]?.proofDocument ?? []).flatMap(obj =>
        Object.keys(obj).map(key => documents?.[key]?.fileMetadata?.url || null)
      )
      .filter(Boolean))];

    // Filter documents based on search term
    return proofDocs.filter(doc => {
      if (!doc) return false;
      
      const docSegments = doc.split("/");
      const docFileName = decodeURIComponent(docSegments[docSegments.length - 1]);
      return docFileName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const filteredDocs = processDocuments();

  // Styles for the document grid
  const documentGridContainerStyle = {
    width: "100%",
    padding: "10px",
    marginLeft: "0px",
    marginTop: menu !== "audit" ? "0%" : "3%",
  };

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  };

  const documentGridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "0"
  };

  const documentColStyle = {
    flex: "0 0 calc(33.333% - 7px)",
    maxWidth: "calc(33.333% - 7px)",
    marginBottom: "10px",
    boxSizing: "border-box"
  };

  const documentItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6f2f5",
    borderRadius: "4px",
    padding: "8px 16px",
    height: "40px",
    overflow: "hidden"
  };

  return (
    <div
      className="tabular-question w-100"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <Table
        bordered
        hover
        responsive="sm"
        className="custom-table"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <thead
          style={{
            borderRight: "none",
            borderLeft: "none",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <tr style={{ borderRight: "none", borderLeft: "none", background: "#F4F7F8" }}>
            {/* Empty header cell for row labels */}
            <th
              className="header-celll"
              style={{
                border: "2px solid #83BBD5",
                borderTopLeftRadius: "10px",
                paddingTop: "15px",
                verticalAlign: "top",
                textAlign: "left",
              }}
            >
              <div>#</div>
            </th>
            {(menu === 'audit' ? [...columns].reverse() : columns)?.map((column, index) => (
              <th
                key={column?.id}
                style={{
                  borderRight: "2px solid #83BBD5",
                  borderLeft: "none",
                  verticalAlign: "top",
                  textAlign: "left",
                  borderTop: "2px solid #83BBD5",
                  borderTopRightRadius: index === columns.length - 1 ? "10px" : "0px"
                }}
                className="header-celll"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: wrapTextWithLineBreaks(column?.option, 5),
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingTop: "5px",
                    alignItems: "flex-start",
                  }}
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          style={{
            borderRight: "none",
            borderLeft: "none",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {rows.map((row, rowIndex) => (
            <tr
              key={row?.id}
              style={{ borderRight: "none", borderLeft: "none", background: "#F4F7F8", borderRight: "2px solid #83BBD5", }}
            >
              <td
                className="row-label"
                style={{ borderRight: "2px solid #83BBD5", borderLeft: "2px solid #83BBD5" }}
              >
                {row?.option}
              </td>
              {columns?.map((column, colIndex) => {
                let cellText;
                if (menu === "audit") {
                  cellText =
                    combinedAnswers !== "No Combined" &&
                      combinedAnswers[rowIndex] &&
                      combinedAnswers[rowIndex][colIndex] !== undefined
                      ? combinedAnswers[rowIndex][colIndex]
                      : "";
                } else {
                  cellText =
                    combinedAnswers !== "No Combined" &&
                      combinedAnswers[0]?.answer[rowIndex] &&
                      combinedAnswers[0]?.answer[rowIndex][colIndex] !== undefined
                      ? combinedAnswers[0]?.answer[rowIndex][colIndex]
                      : "";
                }

                const displayText =
                  (cellText ? cellText : " ").length > 100
                    ? cellText.substring(0, 100) + "..."
                    : cellText ;

                return (
                  <td
                    key={column?.id}
                    style={{
                      borderRight: "2px solid #83BBD5",
                      borderLeft: "none",
                      cursor: "pointer",
                    }}
                    className="data-cell"
                    onDoubleClick={() => handleDoubleClick(cellText)}
                  >
                    {displayText}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      {note && (
        <>
          <div
            style={{
              color: "black",
              fontSize: "14px",
              fontFamily: "Open Sans",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {" "}
            Note{" "}
          </div>

          <div
            style={{
              color: "#3F88A5",
              fontSize: "10px",
              fontFamily: "Open Sans",
              marginBottom: "10px",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {note}
          </div>
        </>
      )}

      {/* Document Grid with Search */}
      {filteredDocs.length > 0 && (
        <div style={documentGridContainerStyle}>
          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "14px"
              }}
            />
          </div>
          
          {/* Document Grid */}
          <div style={documentGridStyle}>
            {filteredDocs.map((rawUrl, index) => {
              let cleanedUrl = rawUrl;
              // Handle URLs that might still have quotes
              if (typeof cleanedUrl === 'string') {
                cleanedUrl = cleanedUrl.replace(/^["'\s]+|["'\s]+$/g, '');
              }
              
              const urlParts = cleanedUrl.split(".pdf");

              if (urlParts.length > 2) {
                cleanedUrl = urlParts[0] + ".pdf";
              }

              const docSegments = cleanedUrl.split("/");
              const docFileName = decodeURIComponent(docSegments[docSegments.length - 1]);

              return (
                <div key={index} style={documentColStyle}>
                  <div style={documentItemStyle}>
                    <span
                      style={{
                        flexGrow: 1,
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={docFileName}
                    >
                      {docFileName}
                    </span>

                    <IoDownloadOutline
                      style={{
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                        color: "#333",
                        flexShrink: 0
                      }}
                      onClick={() => handleFileDownload(rawUrl)}
                      title="Download File"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* No results message (when filtered to zero) */}
          {filteredDocs.length === 0 && searchTerm.length > 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "#6c757d" }}>
              No documents found matching your search.
            </div>
          )}
        </div>
      )}
      
      <FullTextModal
        show={showModal}
        handleClose={handleClose}
        fullText={fullText}
      />
    </div>
  );
};

export default TabularQuestionType;