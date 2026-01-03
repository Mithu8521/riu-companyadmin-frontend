import React from "react";

import { Container, Form, Row, Col } from "react-bootstrap";

const QualitativeAnswer = ({ answer, item }) => {
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

  const note = formatNote(
    item?.matchingAuditors[0]?.auditDetail[0]?.answer?.note
  );

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

  return (
    <Form>
      {/* Answer Section */}
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
              value={answer}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Note Section */}
      {note && (
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
                  value={note}
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

export default QualitativeAnswer;
