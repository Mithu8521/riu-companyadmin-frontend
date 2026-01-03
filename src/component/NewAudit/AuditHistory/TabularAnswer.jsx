import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";

export const TabularAnswer = ({ item }) => {
  console.log(item);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  // Filter rows from details
  const rows = item.question.details
    .slice()
    .reverse()
    .filter((detail) => detail.option_type === "row");

  // Set columns to render
  const [columnsToRender, setColumnsToRender] = useState([]);
  const allColumns = item.question.details
    .slice()
    .reverse()
    .filter((detail) => detail.option_type.toLowerCase() === "column");

  // Update columns to render whenever currentRowIndex or item changes
  useEffect(() => {
    const pageColumnType = `column${
      currentRowIndex + 1 > 0 ? currentRowIndex + 1 : ""
    }`;

    const hasOnlyGeneralColumn = allColumns.every(
      (col) => col.option_type.toLowerCase() === "column"
    );

    const updatedFilteredColumns = hasOnlyGeneralColumn
      ? allColumns
      : allColumns.filter(
          (col) =>
            col.option_type.toLowerCase() === pageColumnType.toLowerCase()
        );

    setColumnsToRender(updatedFilteredColumns);
  }, [currentRowIndex, item]);

  // Handle Next and Previous navigation
  const handleNext = () => {
    if (currentRowIndex < rows.length - 1) {
      setCurrentRowIndex(currentRowIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentRowIndex > 0) {
      setCurrentRowIndex(currentRowIndex - 1);
    }
  };

  const answerData =
    item.matchingAuditors[0]?.auditDetail[0]?.answer.answer || [];

  // Parse the JSON string into a 2D array of strings
  const processAnswerData = (data) => {
    // Check if data is an empty string
    if (data === "") {
      return [];
    }

    // Check if data is a string and needs parsing
    if (typeof data === "string") {
      try {
        // Parse the JSON string into a 2D array of strings
        const parsedData = JSON.parse(data);
        return parsedData;
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return [];
      }
    } else if (Array.isArray(data)) {
      // Return the data as is
      return data;
    } else {
      return [];
    }
  };

  const numericalData = processAnswerData(answerData);

  const notApplicable =
    item.matchingAuditors[0]?.auditDetail[0]?.answer.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
        <Form.Group controlId={`form`}>
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            as="textarea"
            readOnly
            value={"Not Applicable"}
          />
        </Form.Group>
      </Container>
    );
  }

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

  const note = formatNote(
    item?.matchingAuditors[0]?.auditDetail[0]?.answer?.note,
    numRows
  );

  return (
    <Container className="" style={{ paddingTop: "0px" }}>
      {/* Display Current Row with Columns */}
      <Form>
        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group controlId={`form`}>
              <p
                style={{
                  backgroundColor: "rgb(55 141 169)",
                  padding: "10px",
                  borderRadius: "5px", // Optional: adds border radius for rounded corners
                  color: "#fff", // Optional: makes the text white for better contrast
                  wordWrap: "break-word", // Ensures long words break to fit the width
                }}
              >
                {item?.title}
              </p>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group controlId={`form`}>
              <Form.Label>Attribute</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#Dfebef" }}
                type="text"
                // as="textarea"
                readOnly
                value={
                  rows[currentRowIndex]?.option === "one" ||
                  rows[currentRowIndex]?.option === 1 ||
                  rows[currentRowIndex]?.option === "1"
                    ? item.question.title
                    : rows[currentRowIndex]?.option || ""
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {columnsToRender.reverse().map((column, index) => (
            <Col
              key={index}
              md={6}
              className="mb-3"
              style={{ marginRight: "0px" }}
            >
              <Form.Group controlId={`form-${column.option}`}>
                <Form.Label style={{ fontSize: "12px" }}>
                  {column.option}
                </Form.Label>
                <Form.Control
                  style={{ backgroundColor: "#Dfebef" }}
                  type="text"
                  // as="textarea"
                  readOnly
                  value={numericalData[currentRowIndex]?.[index] || ""}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        {note && (
          <>
            <Row className="mb-1">
              <Col xs={12}>
                <Form.Group controlId="formNoteLabel">
                  <Form.Label
                    style={{
                      color: "black",
                      fontSize: "12px",
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
                    // as="textarea"
                    readOnly
                    value={note[currentRowIndex][0]}
                    style={{
                      backgroundColor: "#Dfebef",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

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
