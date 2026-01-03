import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Modal, Button, Row, Col, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import StatusWithTooltip from "./StatusWithToolTip";

// Define styles object
const styles = {
  header: {
    borderBottom: "1px solid #dee2e6",
    padding: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "500",
  },
  closeButton: {
    color: "#6c757d",
    padding: "0.375rem 0.75rem",
  },
  body: {
    padding: "0rem 1rem",
    overflowY: "auto", // Add scrolling for long content
    maxHeight: "70vh", // Limit maximum height
  },
  footer: {
    borderTop: "1px solid #dee2e6",
    padding: "1rem",
  },
  saveButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  accordionHeader: {
    backgroundColor: "#BFD7E0",
    color: "black",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.7rem 1rem",
    width: "100%",
    position: "relative",
    cursor: "pointer", // Show it's clickable
    userSelect: "none", // Prevent text selection
  },
  accordionBody: {
    padding: "1rem",
    backgroundColor: "#f7f7f7", // Light background for content
  },
};

// Separated TabularQuestion component with performance optimizations
const TabularQuestion = ({ item, answer }) => {
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const componentMounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      componentMounted.current = false;
    };
  }, []);

  // Filter rows from details
  const rows = useMemo(() => {
    if (!item?.details) return [];
    return item.details
      .slice()
      .reverse()
      .filter((detail) => detail.option_type === "row");
  }, [item?.details]);

  // Get all columns
  const allColumns = useMemo(() => {
    if (!item?.details) return [];
    return item.details
      .slice()
      .reverse()
      .filter((detail) => detail.option_type.toLowerCase().includes("column"));
  }, [item?.details]);

  // Set columns to render
  const [columnsToRender, setColumnsToRender] = useState([]);

  // Update columns to render whenever currentRowIndex or item changes
  useEffect(() => {
    if (!componentMounted.current) return;

    // Get the column type based on the row index (column1 for first row, column2 for second, etc.)
    const pageColumnType = `column${currentRowIndex + 1}`;

    // Check if there are any specific column types (column1, column2, etc.)
    const hasSpecificColumns = allColumns.some(
      (col) =>
        col.option_type.toLowerCase().startsWith("column") &&
        col.option_type.toLowerCase() !== "column"
    );

    // If there are specific columns, use the corresponding ones for the current row
    // Otherwise, use generic "column" type for all rows
    let updatedFilteredColumns;

    if (hasSpecificColumns) {
      updatedFilteredColumns = allColumns.filter(
        (col) => col.option_type.toLowerCase() === pageColumnType.toLowerCase()
      );

      // If no specific columns found for this row, check for generic "column" type
      if (updatedFilteredColumns.length === 0) {
        updatedFilteredColumns = allColumns.filter(
          (col) => col.option_type.toLowerCase() === "column"
        );
      }
    } else {
      // Use all columns if they're generic
      updatedFilteredColumns = allColumns;
    }

    setColumnsToRender(updatedFilteredColumns);
  }, [currentRowIndex, allColumns]);

  // Handle Next and Previous navigation - memoized to prevent recreating on every render
  const handleNext = useCallback(() => {
    if (currentRowIndex < rows.length - 1) {
      setCurrentRowIndex((prev) => prev + 1);
    }
  }, [currentRowIndex, rows.length]);

  const handlePrevious = useCallback(() => {
    if (currentRowIndex > 0) {
      setCurrentRowIndex((prev) => prev - 1);
    }
  }, [currentRowIndex]);

  // Empty default data
  const answerData = answer?.answer || [];

  // Process answer data - memoized to prevent recalculation
  const processAnswerData = useCallback((data) => {
    if (data === "") return [];

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return [];
      }
    } else if (Array.isArray(data)) {
      return data;
    }
    return [];
  }, []);

  const formatNote = (note, numRows) => {
    if (typeof note === "string") {
      // If note is an empty string, return an empty 2D array with the same number of rows
      return note.trim() === ""
        ? Array(numRows).fill([""])
        : Array(numRows).fill([note]);
    } else if (Array.isArray(note)) {
      // If note is a 1D array, wrap it inside another array to make it 2D and match the number of rows
      if (!Array.isArray(note[0])) {
        return Array(numRows).fill(note);
      }
      // If note is already a 2D array, return it as is if it matches the number of rows
      return note.length === numRows ? note : Array(numRows).fill([""]);
    } else {
      // Default to an empty 2D array with the same number of rows
      return Array(numRows).fill([""]);
    }
  };
  const numRows = rows.length;

  const note = formatNote(answer?.note, numRows);
  const numericalData = useMemo(
    () => processAnswerData(answerData),
    [answerData, processAnswerData]
  );
  const notApplicable = answer?.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
        <Form.Group controlId="form">
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            as="textarea"
            readOnly
            value="Not Applicable"
          />
        </Form.Group>
      </Container>
    );
  }

  return (
    <Container className="" style={{ paddingTop: "0px" }}>
      {/* Display Current Row with Columns */}
      <Form>
        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group controlId="form">
              <Form.Label>Attribute</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#Dfebef" }}
                type="text"
                readOnly
                value={
                  rows[currentRowIndex]?.option === "one" ||
                  rows[currentRowIndex]?.option === 1 ||
                  rows[currentRowIndex]?.option === "1"
                    ? item.question?.title || ""
                    : rows[currentRowIndex]?.option || ""
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {columnsToRender.map((column, index) => (
            <Col
              key={`column-${index}-${column.option}`}
              md={6}
              // className="mb-3"
              style={{ marginRight: "0px" }}
            >
              <Form.Group controlId={`form-${column.option}`}>
                <Form.Label style={{ fontSize: "12px" }}>
                  {column.option}
                </Form.Label>
                <Form.Control
                  style={{ backgroundColor: "#Dfebef" }}
                  type="text"
                  readOnly
                  value={numericalData[currentRowIndex]?.[index] || ""}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group controlId="formNote">
              <Form.Label style={{ fontSize: "12px" }}>Note</Form.Label>
              <Form.Control
                readOnly
                value={note[currentRowIndex][0]}
                style={{
                  backgroundColor: "#Dfebef",
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Navigation Buttons */}
        <Row className="text-center">
          <Col>
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentRowIndex === 0}
              className="me-2"
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentRowIndex === rows.length - 1}
            >
              Next
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

// Memoize the TabularQuestion component to prevent unnecessary re-renders
const MemoizedTabularQuestion = React.memo(TabularQuestion);

// CommonTypeQuestion component for qualitative, quantitative, and quantitative_trends
const CommonTypeQuestion = ({ item, answer }) => {
  // Process note formatting to handle different possible data structures
  const formatNote = (note) => {
    if (typeof note === "string") {
      // If note is an empty string, return an empty 2D array
      return note.trim() === "" ? [[""]] : [[note]];
    } else if (Array.isArray(note)) {
      // If note is a 1D array, wrap it inside another array to make it 2D
      return Array.isArray(note[0]) ? note : [note];
    } else {
      // Default to an empty 2D array if note is neither string nor array
      return [[""]];
    }
  };

  // Format the note properly
  const formattedNote = formatNote(answer?.note);

  // Check if the answer is marked as not applicable
  const notApplicable = answer?.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
        <Form.Group controlId="form">
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            as="textarea"
            readOnly
            value="Not Applicable"
          />
        </Form.Group>
      </Container>
    );
  }

  return (
    <Form>
      {/* Answer Section */}
      <Row className="mb-3">
        <Col xs={12}>
          <Form.Group controlId="formAnswer">
            <Form.Label
              style={{
                fontSize: "14px",
                fontFamily: "Open Sans",
                wordWrap: "break-word",
              }}
            >
              Response
            </Form.Label>
            <Form.Control
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              as="textarea"
              readOnly
              value={answer?.answer || ""}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Note Section - only display if there's content */}
      {formattedNote && formattedNote[0] && formattedNote[0][0] && (
        <>
          <Row className="mb-1">
            <Col xs={12}>
              <Form.Group controlId="formNoteLabel">
                <Form.Label
                  style={{
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Open Sans",
                  }}
                >
                  Note
                </Form.Label>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group controlId="formNote">
                <Form.Control
                  as="textarea"
                  readOnly
                  value={formattedNote[0][0] || ""}
                  style={{
                    backgroundColor: "#Dfebef",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

const TrendsTypeQuestion = ({ item, answer }) => {
  // Process note formatting to handle different possible data structures
  const formatNote = (note) => {
    if (typeof note === "string") {
      // If note is an empty string, return an empty 2D array
      return note.trim() === "" ? [[""]] : [[note]];
    } else if (Array.isArray(note)) {
      // If note is a 1D array, wrap it inside another array to make it 2D
      return Array.isArray(note[0]) ? note : [note];
    } else {
      // Default to an empty 2D array if note is neither string nor array
      return [[""]];
    }
  };

  // Format the note properly
  const formattedNote = formatNote(answer?.note);

  // Check if the answer is marked as not applicable
  const notApplicable = answer?.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
        <Form.Group controlId="form">
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            as="textarea"
            readOnly
            value="Not Applicable"
          />
        </Form.Group>
      </Container>
    );
  }
  return (
    <Form>
      {/* Answer Section */}
      <Row className="mb-3">
        <Col xs={12}>
          <Form.Group controlId="formAnswer">
            <Form.Label
              style={{
                fontSize: "14px",
                fontFamily: "Open Sans",
                wordWrap: "break-word",
              }}
            >
              Response
            </Form.Label>
            <Form.Control
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              as="textarea"
              readOnly
              value={(() => {
                try {
                  return JSON.parse(answer?.answer)?.readingValue || "";
                } catch (e) {
                  return "";
                }
              })()}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Note Section - only display if there's content */}
      {formattedNote && formattedNote[0] && formattedNote[0][0] && (
        <>
          <Row className="mb-1">
            <Col xs={12}>
              <Form.Group controlId="formNoteLabel">
                <Form.Label
                  style={{
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Open Sans",
                  }}
                >
                  Note
                </Form.Label>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group controlId="formNote">
                <Form.Control
                  as="textarea"
                  readOnly
                  value={formattedNote[0][0] || ""}
                  style={{
                    backgroundColor: "#Dfebef",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

// YesNoAnswer component
const YesNoAnswer = ({ item, answer }) => {
  // Process note formatting to handle different possible data structures
  const formatNote = (note) => {
    if (typeof note === "string") {
      return note.trim() === "" ? "" : note;
    } else if (Array.isArray(note)) {
      return Array.isArray(note[0]) ? note[0][0] || "" : note[0] || "";
    } else {
      return "";
    }
  };

  // Format the note properly
  const formattedNote = formatNote(answer?.note);

  // Process the answer to handle different data formats
  const parseAnswerData = () => {
    try {
      if (!answer?.answer) return {};

      if (typeof answer.answer === "string") {
        try {
          return JSON.parse(answer.answer);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return {};
        }
      } else if (typeof answer.answer === "object") {
        return answer.answer;
      }
      return {};
    } catch (error) {
      console.error("Error processing answer data:", error);
      return {};
    }
  };

  const answerData = parseAnswerData();

  // Check if the answer is marked as not applicable
  const notApplicable = answer?.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
        <Form.Group controlId="form">
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            readOnly
            value="Not Applicable"
          />
        </Form.Group>
      </Container>
    );
  }

  // Render dynamic input fields based on the detail type
  const renderDynamicInput = (detail) => {
    if (!detail) return null;

    switch (detail.option_type) {
      case "attibutes":
      case "attributes": // Handle potential typo in the original code
        return (
          <>
            <Form.Group
              controlId={`attributes_${detail.detail_id}`}
              key={detail.detail_id}
            >
              <Form.Label className="custom-label">Attributes</Form.Label>
              <Form.Control
                type="text"
                value={detail.option || ""}
                readOnly
                style={{ backgroundColor: "#Dfebef" }}
              />
            </Form.Group>
            <Form.Group
              controlId={`attributes_${detail.detail_id}`}
              key={detail.detail_id}
            >
              <Form.Label className="custom-label">Response</Form.Label>
              <Form.Control
                type="text"
                value={answerData["answer"] || ""}
                readOnly
                style={{ backgroundColor: "#Dfebef" }}
              />
            </Form.Group>
          </>
        );
      case "weblink":
        return (
          <Form.Group
            controlId={`weblink_${detail.detail_id}`}
            key={detail.detail_id}
          >
            <Form.Label className="custom-label">
              {detail.option || "Link"}
            </Form.Label>
            <Form.Control
              type="text"
              value={answerData[detail.option_type] || ""}
              readOnly
              style={{ backgroundColor: "#Dfebef" }}
            />
          </Form.Group>
        );
      default:
        return (
          <Form.Group
            controlId={`details_${detail.detail_id}`}
            key={detail.detail_id}
          >
            <Form.Label className="custom-label">
              {detail.option || ""}
            </Form.Label>
            <Form.Control
              type="text"
              value={answerData[detail.option_type] || ""}
              readOnly
              style={{ backgroundColor: "#Dfebef" }}
            />
          </Form.Group>
        );
    }
  };

  return (
    <Form>
      <Row>
        {item?.details && Array.isArray(item.details) ? (
          item.details
            .slice()
            .reverse()
            .map((detail) => (
              <Col md={12} key={detail.detail_id} style={{ marginTop: "10px" }}>
                {renderDynamicInput(detail)}
              </Col>
            ))
        ) : (
          <Col md={12}>
            <p>No details available</p>
          </Col>
        )}
      </Row>

      {/* Note Section - only display if there's content */}
      {formattedNote && (
        <>
          <Row className="mb-1">
            <Col xs={12}>
              <Form.Group controlId="formNoteLabel">
                <Form.Label
                  style={{
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Open Sans",
                  }}
                >
                  Note
                </Form.Label>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group controlId="formNote">
                <Form.Control
                  readOnly
                  value={formattedNote}
                  style={{
                    backgroundColor: "#Dfebef",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

const HistoryAnswerModal = ({
  showHistoryModal,
  handleHistoryClose,
  historyAnswer,
  question,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [answer, setAnswer] = useState(null);

  const accordionRefs = useRef({});

  // Add a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset active index when modal is closed
  useEffect(() => {
    if (!showHistoryModal) {
      setActiveIndex(null);
    }
  }, [showHistoryModal]);

  // Debounced accordion click handler
  const handleAccordionClick = useCallback((index, answer) => {
    if (!isMounted.current) return;
    setAnswer(answer);
    setActiveIndex((prevIndex) => {
      return prevIndex === index ? null : index;
    });
  }, []);

  // Memoized render function to prevent re-calculation
  const renderQuestionType = useCallback((item, answer) => {
    if (!item) return <p>No question data available</p>;

    switch (item?.questionType) {
      case "tabular_question":
        return <MemoizedTabularQuestion item={item} answer={answer} />;
      case "qualitative":
        return <CommonTypeQuestion item={item} answer={answer} />;
      case "quantitative":
        return <CommonTypeQuestion item={item} answer={answer} />;
      case "quantitative_trends":
        return <TrendsTypeQuestion item={item} answer={answer} />;
      case "yes_no":
        return <YesNoAnswer item={item} answer={answer} />;
      // Other cases would go here
      default:
        return (
          <p>Unknown question type: {item.questionType || "not specified"}</p>
        );
    }
  }, []);

  // Only render the modal when it's shown to save resources
  if (!showHistoryModal) return null;

  return (
    <Modal
      show={showHistoryModal}
      onHide={handleHistoryClose}
      size="xl"
      centered
      backdrop="static"
      className="blur-background-modal"
    >
      <Modal.Header style={styles.header}>
        <Modal.Title style={styles.title}>
          {question?.title || "History"}
        </Modal.Title>
        <Button
          variant="link"
          onClick={handleHistoryClose}
          style={styles.closeButton}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Modal.Header>

      <Modal.Body style={styles.body}>
        {Array.isArray(historyAnswer) && historyAnswer.length > 0 ? (
          historyAnswer.map((item, index) => (
            <div
              className="accordion-item my-3"
              key={`accordion-${index}`}
              ref={(el) => (accordionRefs.current[index] = el)}
            >
              <h2 className="accordion-header" id={`heading${index}`}>
                <div
                  className="accordion-button"
                  style={styles.accordionHeader}
                  onClick={() => handleAccordionClick(index, item)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`collapse${index}`}
                  data-testid={`accordion-header-${index}`}
                >
                  {/* Title section */}
                  <div style={{ flex: "0 0 60%" }}>
                    <span style={{ color: "black", marginBottom: "10px" }}>
                      {index + 1}.{" "}
                      {item.createdAt
                        ? `Answered: ${new Date(
                            item.answerDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </span>
                  </div>

                  {/* Status and toggle button section */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    {/* Status tooltip */}
                    <div style={{ marginRight: "15px" }}>
                      <StatusWithTooltip status={item.status || ""} />
                    </div>

                    {/* Plus/minus button */}
                    <div style={{ marginLeft: "10px" }}>
                      <span
                        className="btn btn-sm btn-outline-secondary"
                        style={{
                          fontWeight: "bold",
                          border: "1.5px solid",
                          borderColor: "grey",
                          padding: "0.25rem 0.5rem",
                          minWidth: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {activeIndex === index ? "-" : "+"}
                      </span>
                    </div>
                  </div>
                </div>
              </h2>

              {/* Fixed accordion collapse section */}
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${
                  activeIndex === index ? "show" : ""
                }`}
                aria-labelledby={`heading${index}`}
                data-testid={`accordion-content-${index}`}
              >
                <div className="accordion-body" style={styles.accordionBody}>
                  {/* Only render content when this section is active */}
                  {activeIndex === index && (
                    <div className="accordion-content">
                      {renderQuestionType(question, answer)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No history data available</p>
        )}
      </Modal.Body>
      <style jsx>{`
        /* Custom styling for modal backdrop blur */
        .blur-background-modal .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }

        /* Make sure accordion is clickable */
        .accordion-button {
          cursor: pointer;
        }

        /* Ensure the collapsed content is hidden properly */
        .accordion-collapse.collapse:not(.show) {
          display: none;
        }

        /* Add transition for smooth opening/closing */
        .accordion-collapse {
          transition: height 0.3s ease;
        }
      `}</style>
    </Modal>
  );
};

// Export both individual components and the main modal
export { CommonTypeQuestion, YesNoAnswer, TabularQuestion };
export default React.memo(HistoryAnswerModal);
