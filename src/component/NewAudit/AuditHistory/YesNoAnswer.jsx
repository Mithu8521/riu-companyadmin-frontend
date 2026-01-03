import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";

const YesNoAnswer = ({ item }) => {
  const [answerObject, setAnswerObject] = useState();

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

  const renderDynamicInput = (detail) => {
    let parsedAnswer;
    try {
      parsedAnswer = JSON.parse(
        item.matchingAuditors[0]?.auditDetail[0].answer.answer
      );
    } catch (error) {
      throw error; // Rethrow to catch in the outer block
    }

    switch (detail?.option_type) {
      case "attibutes":
        return (
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
              //   onDoubleClick={() => handleDoubleClick(detail.option)}
            />
          </Form.Group>
        );
      case "weblink":
        return (
          <Form.Group
            controlId={`weblink_${detail.detail_id}`}
            key={detail.detail_id}
          >
            <Form.Label className="custom-label">{detail?.option}</Form.Label>
            <Form.Control
              type="text"
              value={answerObject[detail?.option_type]}
              //   onDoubleClick={() =>
              //     handleDoubleClick(answerObject[detail?.option_type])
              //   }
              readOnly
              style={{ backgroundColor: "#Dfebef" }}
            />
          </Form.Group>
        );
      default:
        return (
          <Form.Group
            controlId={`details_${detail?.detail_id}`}
            key={detail.detail_id}
          >
            <Form.Label className="custom-label">{detail.option}</Form.Label>
            <Form.Control
              type="text"
              value={parsedAnswer[detail?.option_type]}
              //   onDoubleClick={() =>
              //     handleDoubleClick(answerObject[detail?.option_type])
              //   }
              readOnly
              style={{ backgroundColor: "#Dfebef" }}
            />
          </Form.Group>
        );
    }
  };

  // useEffect(()=>{

  const notApplicable =
    item.matchingAuditors[0]?.auditDetail[0]?.answer.notApplicable;

  if (notApplicable) {
    return (
      <Container className="">
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
        <Form.Group controlId={`form`}>
          <Form.Label>Response</Form.Label>
          <Form.Control
            style={{ backgroundColor: "#Dfebef" }}
            type="text"
            readOnly
            value={"Not Applicable"}
          />
        </Form.Group>
      </Container>
    );
  }
  // },[answerObject])
  return (
    <Form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      ></div>
      <Row>
        {item?.question?.details
          ?.slice()
          .reverse()

          .map((detail) => {
            return (
              <Col md={12} style={{ marginTop: "10px" }}>
                {renderDynamicInput(detail)}
              </Col>
            );
          })}
      </Row>
      <Row>
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
      </Row>
    </Form>
  );
};

export default YesNoAnswer;
