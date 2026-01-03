import React, {useState, useEffect} from "react";
import { Form, Row, Col, Dropdown } from "react-bootstrap";


const YesNoComponent = ({
  isReadOnly,
  menu,
  edit,
  setAnswer,
  currentQuestion,
  matchedAnswer,
  handleDoubleClick
}) => {
  const isAudit = (menu === 'audit');
  const [response, setResponse] = useState();
  const [showWeblink, setShowWeblink] = useState(false);
  const [showNote, setShowNote] = useState(currentQuestion?.applicableNote);

  const [note, setNote] = useState(matchedAnswer?.note || []);
  const [answerObject, setAnswerObject] = useState({ answer: "" });
  const [error, setError] = useState("");
  const [dynamicInputs, setDynamicInputs] = useState(
    currentQuestion?.details.reduce((acc, detail) => {
      acc[detail.option_type] = matchedAnswer?.[detail.option_type] || "";
      return acc;
    }, {})
  );

  const initializeAnswer = () => {
    if (currentQuestion && currentQuestion.questionId) {
      if (matchedAnswer) {
        try {
          // Log the value before parsing

          // Safely parse the JSON data
          let parsedAnswer;
          try {
            parsedAnswer = JSON.parse(matchedAnswer.answer);
          } catch (error) {
            throw error; // Rethrow to catch in the outer block
          }

          // Update state with parsed data
          setAnswerObject(parsedAnswer);
          setResponse(parsedAnswer?.answer);

          if (parsedAnswer?.answer === "Yes") {
            setShowWeblink(true);
          }

          setNote((prevState) => {
            if (typeof matchedAnswer.note === "string") {
              return [[matchedAnswer.note]]; // Wrap the string in a 2D array
            }
            if (
              Array.isArray(matchedAnswer.note) &&
              Array.isArray(matchedAnswer.note[0])
            ) {
              return matchedAnswer.note; // Use it as is
            }
            return [[""]]; // Return an empty 2D array if not string or 2D array
          });

          setAnswer((prevState) => ({
            ...prevState,
            answer: matchedAnswer.answer || "",
            note: (() => {
              if (typeof matchedAnswer.note === "string") {
                return [[matchedAnswer.note]]; // Wrap the string in a 2D array
              }
              if (
                Array.isArray(matchedAnswer.note) &&
                Array.isArray(matchedAnswer.note[0])
              ) {
                return matchedAnswer.note; // Use it as is
              }
              return [[""]]; // Return an empty 2D array if not string or 2D array
            })(),
          }));
        } catch (error) { }
      } else {
        setResponse();
        setAnswer((prevState) => ({
          ...prevState,
          answer: "{}",
          note: [[""]],
        }));

        setNote([[""]]);
      }
    }
  };

  useEffect(() => {
    initializeAnswer();
  }, [matchedAnswer, currentQuestion]);

  const handleResponseSelect = (key) => {
    setResponse(key);
    setShowWeblink(key === "Yes");
    const updatedAnswerObject = {
      ...answerObject,
      answer: key
    };
    setAnswerObject(updatedAnswerObject);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answer: JSON.stringify(updatedAnswerObject)
    }))
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote([[newNote]]);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      note: [[newNote]],
    }));
  };

  const handleDynamicInputChange = (id, value, optionType) => {
    setDynamicInputs((prevState) => ({
      ...prevState,
      [optionType]: value,
    }));
    if (optionType === "weblink") {
      // Regex for validating URL
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // Protocol
        "((([a-zA-Z0-9$\\-_@.&+!*(),]|[a-zA-Z0-9-])+\\.)+[a-zA-Z]{2,6})" + // Domain name
        "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // Port and path
        "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // Query string
        "(\\#[-a-zA-Z0-9_]*)?$" // Fragment locator
      );

      // Validate the weblink
      if (urlPattern.test(value)) {
        setError(""); // Clear error message
        setDynamicInputs((prevState) => ({
          ...prevState,
          [optionType]: value,
        }));
        const updatedAnswerObject = {
          ...answerObject,
          [optionType]: value
        }
        setAnswerObject(updatedAnswerObject);
        setAnswer((prevAnswer) => ({
          ...prevAnswer,
          answer: JSON.stringify(updatedAnswerObject)
        }));
      } else {
        setError("Please enter a valid URL.");
      }
    } else {
      // Default handling for other types
      setDynamicInputs((prevState) => ({
        ...prevState,
        [optionType]: value,
      }));
      const updatedAnswerObject = {
        ...answerObject,
        [optionType]: value
      }
      setAnswerObject(updatedAnswerObject);
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        answer: JSON.stringify(updatedAnswerObject)
      }));
    }
  };

  const renderDynamicInput = (detail) => {
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
              as="textarea"
              value={detail.option || ""}
              readOnly
              style={{ backgroundColor: "#Dfebef" }}
              onDoubleClick={() => handleDoubleClick(detail.option)}
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
              as="textarea"
              value={answerObject[detail?.option_type]}
              onDoubleClick={() =>
                handleDoubleClick(answerObject[detail?.option_type])
              }
              readOnly={!edit || isReadOnly}
              onChange={(e) =>
                handleDynamicInputChange(
                  detail?.detail_id,
                  e.target.value,
                  detail?.option_type
                )
              }
              style={{ backgroundColor: "#Dfebef" }}
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
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
              as="textarea"
              type="text"
              value={answerObject[detail?.option_type]}
              onDoubleClick={() =>
                handleDoubleClick(answerObject[detail?.option_type])
              }
              readOnly={!edit || isReadOnly}
              onChange={(e) =>
                handleDynamicInputChange(
                  detail?.detail_id,
                  e.target.value,
                  detail?.option_type
                )
              }
              style={{ backgroundColor: "#Dfebef" }}
            />
          </Form.Group>
        );
    }
  };

  return (
    <>
      <Row>
        {currentQuestion?.details
          ?.slice()
          .reverse()
          .slice(0, 1)
          .map((detail) => {
            return (
              <Col md={12} style={{ marginTop: "10px" }} key={detail.detail_id}>
                {renderDynamicInput(detail)}
              </Col>
            );
          })}
      </Row>
      <Row>
        <Col md={3}>
          <Form.Group controlId="formInput10">
            <Form.Label className="custom-label">Response</Form.Label>
            <div className="select-wrapper">
              <Dropdown onSelect={handleResponseSelect}>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  style={{
                    backgroundColor: "#Dfebef",
                    color: "black",
                    borderColor: "white",
                    width: "100%",
                  }}
                  readOnly={!edit || isReadOnly}
                >
                  <span style={{ marginRight: "65%" }}>
                    {response || "Select"}
                  </span>
                </Dropdown.Toggle>

                {edit && !isReadOnly && (
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Yes">Yes</Dropdown.Item>
                      <Dropdown.Item eventKey="No">No</Dropdown.Item>
                    </Dropdown.Menu>
                  )}
              </Dropdown>
            </div>
          </Form.Group>
        </Col>

        {!showWeblink && (
          <Col md={12}>
            <Form.Group controlId="formInput14">
              <Form.Label className="custom-label">Note</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#Dfebef" }}
                type="text"
                as="textarea"
                value={note?.[0]?.[0]}
                onChange={handleNoteChange}
                onDoubleClick={() => handleDoubleClick(note)}
                readOnly={!edit || isReadOnly}
              />
            </Form.Group>
          </Col>
        )}

        {showWeblink &&
          currentQuestion?.details
            ?.slice()
            .reverse()
            .slice(1)
            .map((detail) => {
              return (
                <Row key={detail.detail_id}>
                  <Col md={6} style={{ marginTop: "10px" }}>
                    {renderDynamicInput(detail)}
                  </Col>
                </Row>
              );
            })}
      </Row>
      {showWeblink && (
        <Row>
          {showNote && (
            <Col md={12}>
              <Form.Group controlId="formInput14">
                <Form.Label className="custom-label">Note</Form.Label>
                <Form.Control
                  style={{ backgroundColor: "#Dfebef" }}
                  type="text"
                  as="textarea"
                  value={note[0][0]}
                  onChange={handleNoteChange}
                  onDoubleClick={() => handleDoubleClick(note)}
                  readOnly={!edit || isReadOnly}
                />
              </Form.Group>
            </Col>
          )}
        </Row>
      )}

    </>
  );
};

export default YesNoComponent;
