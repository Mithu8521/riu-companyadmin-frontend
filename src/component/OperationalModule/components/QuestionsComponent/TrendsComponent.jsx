import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from "react-bootstrap";


const TrendsComponent = ({
  isReadOnly,
  menu,
  edit,
  answer,
  setAnswer,
  currentQuestion,
  unit,
  emissionData,
  matchedAnswer,
  previousMonthMatchedAnswer,
  matchedTargetAnswer,
  handleDoubleClick
}) => {
  const isAudit = (menu === 'audit');
  const [note, setNote] = useState("");
  const [readingValue, setReadingValue] = useState("");
  const [previousMonthReadingValue, setPreviousMonthReadingValue] = useState("");
  const [targetValue, setTargetValue] = useState();

  const initializeAnswer = async () => {
    if (currentQuestion && currentQuestion.questionId) {
      if (matchedAnswer) {
        try {
          const answerObject = JSON.parse(matchedAnswer.answer ?? {});
          // Set the state variables

          // setSelectedUnit(answerObject.unit || "");
          setReadingValue(answerObject?.readingValue);
          setNote((prevState) => {
            // Check if matchedAnswer.note is a string
            if (typeof matchedAnswer.note === "string") {
              return [[matchedAnswer.note]]; // Wrap the string in a 2D array
            }

            // Check if matchedAnswer.note is a 2D array
            if (
              Array.isArray(matchedAnswer.note) &&
              Array.isArray(matchedAnswer.note[0])
            ) {
              return matchedAnswer.note; // Use it as is
            }

            // If matchedAnswer.note is not a string or a 2D array, return an empty 2D array
            return [[""]];
          });
          setAnswer((prevState) => ({
            ...prevState,
            answer: matchedAnswer?.answer ?? JSON.stringify({
              questionId: answer?.questionId,
              moduleId: answer?.moduleId,
              questionType: answer?.questionType,
              questionTitle: answer?.title,
              fromDate: answer?.fromDate,
              toDate: answer?.toDate,
              frequency: answer?.frequency,
              readingValue: '',
            }),
            note: (() => {
              // Check if matchedAnswer.note is a string
              if (typeof matchedAnswer.note === "string") {
                return [[matchedAnswer.note]]; // Wrap the string in a 2D array
              }

              // Check if matchedAnswer.note is a 2D array
              if (
                Array.isArray(matchedAnswer.note) &&
                Array.isArray(matchedAnswer.note[0])
              ) {
                return matchedAnswer.note; // Use it as is
              }

              // If matchedAnswer.note is not a string or a 2D array, return an empty 2D array
              return [[""]];
            })(),
          }));
        } catch (error) {
          console.error("Error parsing matchedAnswer.answer:", error);
        }
      } else {
        setAnswer((prevState) => ({
          ...prevState,
          note: [[""]],
          answer: JSON.stringify({
            questionId: answer?.questionId,
            moduleId: answer?.moduleId,
            questionType: answer?.questionType,
            questionTitle: answer?.title,
            fromDate: answer?.fromDate,
            toDate: answer?.toDate,
            frequency: answer?.frequency,
            readingValue: '',
          })
        }));

        setReadingValue("");
        setNote("");
      }
    }
  };

  const initializePreviousMonthAnswer = () => {
    if (previousMonthMatchedAnswer) {
      const previousMonthAnswerObject = previousMonthMatchedAnswer && JSON.parse(previousMonthMatchedAnswer?.answer);
      setPreviousMonthReadingValue(previousMonthAnswerObject?.readingValue);
    }
  }

  const initializeTarget = () => {
    if (matchedTargetAnswer) {
      setTargetValue(matchedTargetAnswer?.targetData);
    }
  };

  useEffect(() => {
    initializeAnswer();
    initializePreviousMonthAnswer();
    initializeTarget();
  }, [matchedAnswer, previousMonthMatchedAnswer, matchedTargetAnswer]);

  const handleReadingValue = (e) => {
    const value = e.target.value; // Keep it as a string initially

    setReadingValue(value); // Update readingValue as string

    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answer: JSON.stringify({
        questionId: answer?.questionId,
        moduleId: answer?.moduleId,
        questionType: answer?.questionType,
        questionTitle: answer?.title,
        fromDate: answer?.fromDate,
        toDate: answer?.toDate,
        frequency: answer?.frequency,
        readingValue: value,
      }),
    }));
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote([[newNote]]);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      note: [[newNote]],
    }));
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "20px",
      width: "100%",
    },
    text: {
      color: "rgba(0, 0, 0, 0.70)",
      fontSize: "12px",
      fontFamily: "Open Sans",
      fontWeight: 400,
    },
    uploadDiv: {
      width: "100%",
      backgroundColor: "#3F88A5",
      borderRadius: "10px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "white",
      position: "relative",
      border: "2px dashed #3F88A5",
      transition: "background-color 0.3s ease",
    },
    uploadDivHover: {
      backgroundColor: "#30707E", // Darker blue on hover
    },
    icon: {
      position: "absolute",
      right: "10px",
      fontSize: "10px",
      color: "white",
    },
    fileInput: {
      display: "none",
    },
    formGroup: {
      marginBottom: "15px",
    },
  };

  return (
    <>
      <Row>
        <Col md={2}>
          <Form.Group controlId="formInput11" style={styles.formGroup}>
            <Form.Label className="custom-label">Current Value</Form.Label>
            <Form.Control
              readOnly={!edit || isReadOnly}
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              onChange={handleReadingValue}
              value={readingValue}
              onDoubleClick={() => handleDoubleClick(readingValue)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="formInput11" style={styles.formGroup}>
            <Form.Label className="custom-label">Previous Values</Form.Label>
            <Form.Control
              readOnly={true}
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              value={previousMonthReadingValue}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId="formInput11" style={styles.formGroup}>
            <Form.Label className="custom-label">Min Target Value</Form.Label>
            <Form.Control
              readOnly={true}
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              value={''}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="formInput11" style={styles.formGroup}>
            <Form.Label className="custom-label">Max Target Value</Form.Label>
            <Form.Control
              readOnly={true}
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              value={''}
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <div>
            <label className="custom-label">Unit</label>
          </div>
          <select
            style={{
              backgroundColor: "#Dfebef",
              width: "80%",
              margin: "7px",
              height: "37px",
            }}
            disabled
            value={unit?.unit || currentQuestion?.details[0]?.option}
          >
            <option>{unit?.unit || currentQuestion?.details[0]?.option}</option>
          </select>
        </Col>

        {/* <Col md={12}>
          <Form.Group controlId="formInput12" style={styles.formGroup}>
            <Form.Label className="custom-label">Note</Form.Label>
            <Form.Control
              as="textarea"
              readOnly={!edit || isReadOnly}
              style={{ backgroundColor: "#Dfebef" }}
              type="text"
              value={note?.[0]?.[0] ?? ''}
              onChange={handleNoteChange}
              onDoubleClick={() => handleDoubleClick(note)}
            />
          </Form.Group>
        </Col> */}

        {targetValue && (
          <>
            {readingValue > Number(targetValue) && (
              <p className="red-message">Your value has been exceeded</p>
            )}
            {readingValue === Number(targetValue) && (
              <p className="green-message">Goal Achieved.</p>
            )}
          </>
        )}

        {emissionData?.energy?.value ? (
          <Col md={2}>
            <Form.Group controlId="formInput11" style={styles.formGroup}>
              <Form.Label className="custom-label">Energy</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#Dfebef" }}
                type="text"
                value={`${emissionData?.energy?.value} ${emissionData?.energy?.unit}`}
                readOnly
              />
            </Form.Group>
          </Col>
        ) : (
          <></>
        )}
        {emissionData?.emission?.value ? (
          <Col md={2}>
            <Form.Group controlId="formInput11" style={styles.formGroup}>
              <Form.Label className="custom-label">Emission</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#Dfebef" }}
                type="text"
                value={`${emissionData?.emission?.value} ${emissionData?.emission?.unit}`}
                readOnly
              />
            </Form.Group>
          </Col>
        ) : (
          <></>
        )}
      </Row>

    </>
  );
};

export default TrendsComponent;
