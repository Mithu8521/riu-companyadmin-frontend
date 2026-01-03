import { useEffect, useState, useRef } from "react";
import { Form, Col, Row, Dropdown, Modal, Button } from "react-bootstrap";


import "./Row.css";

const RowComponent = ({
  isReadOnly,
  menu,
  handleNoteChange,
  edit,
  rowIndex,
  columns,
  heading,
  note,
  rowData,
  currentQuestion,
  handleInputChange,
  updatedRows,
  initialRadioValue,
  emissionData,
  handleDoubleClick
}) => {
  const isAudit = (menu === 'audit');
  const [errors, setErrors] = useState({});
  const [coll, setColl] = useState(columns);
  const [data, setData] = useState(rowData);
  const [columnsToRender, setColumnsToRender] = useState([]);

  const [radioValue, setRadioValue] = useState(initialRadioValue);

  useEffect(() => {
    setData(rowData);
  }, [rowData]);

  useEffect(() => {
    setRadioValue(initialRadioValue);
  }, [initialRadioValue]);

  useEffect(() => {
    setColl(columns);
    const pageColumnType = `column${rowIndex + 1 > 0 ? rowIndex + 1 : ""}`;
    const hasOnlyGeneralColumn = columns.every(
      (col) => col.option_type.toLowerCase() === "column"
    );

    let filteredColumns;

    if (hasOnlyGeneralColumn) {
      // If columns only have "column", use all as default
      filteredColumns = columns;
    } else {
      // Otherwise, filter based on the specific column type
      filteredColumns = columns.filter((col) => {
        return col.option_type.toLowerCase() === pageColumnType.toLowerCase();
      });
    }

    // Set the filtered columns to render
    setColumnsToRender(filteredColumns);
  }, [columns, updatedRows]);

  const handleChange = (colId, value) => {
    let isTemp = true;
    let errorMessage = "";

    const col = coll[colId];
    const colOption = col.option.toLowerCase();

    // Validate email
    if (["email", "email id", "email address"].includes(colOption)) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        isTemp = false;
        errorMessage = "Please enter a valid email address.";
      }
    }

    // Validate number
    if (["number"].includes(colOption)) {
      const numberPattern = /^[0-9]+$/;
      if (!numberPattern.test(value)) {
        isTemp = false;
        errorMessage = "Please enter a valid number.";
      }
    }

    // Validate phone number
    if (["phone number", "phone no", "phone no."].includes(colOption)) {
      const phoneNumberPattern = /^[0-9]{10}$/;
      if (!phoneNumberPattern.test(value)) {
        isTemp = false;
        errorMessage = "Please enter a valid 10-digit phone number.";
      }
    }

    // Update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${rowIndex}-${colId}`]: isTemp ? "" : errorMessage,
    }));

    // Update rowData state for the specific column
    handleInputChange(rowIndex, colId, value);
  };

  // Handle percentage input change
  const handlePercentageChange = (colId, value) => {
    let finalValue = value;

    // Allow "NIL" as a valid input
    if (value !== "NIL") {
      // Check if "N", "NI", or "NIL" is being typed and allow it
      if (value === "N" || value === "NI" || value === "NIL") {
        finalValue = value;
      } else {
        // Remove non-numeric characters except for a single decimal point
        const sanitizedValue = value.replace(/[^\d.]/g, "");

        // Ensure there's only one decimal point
        finalValue =
          sanitizedValue.split(".").length > 2
            ? sanitizedValue.split(".").slice(0, 2).join("")
            : sanitizedValue;
      }
    }

    handleChange(colId, finalValue);
  };

  const handleRadioChange = (value, colId, otherColId) => {
    setRadioValue(value);
    handleChange(colId, value);
    handleChange(otherColId, ""); // Set the other option to an empty string
  };

  useEffect(() => {
    setData(rowData);
  }, [rowData]);

  return (
    <>
      <Row>
        {heading && heading?.length ? (
          <Col md={12}>
            <Form.Group controlId={`formInput-${rowIndex}-entity`}>
              <Form.Label className="custom-label">Question</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  lineHeight: "1",
                  minHeight: "40px", // Set a minimum height (adjust as necessary)
                  overflowY: "auto", // Allow vertical scroll if content exceeds maxHeight
                  resize: "vertical", // Prevent resizing, or use "vertical" to allow only vertical resizing
                }}
                type="textarea"
                value={heading[0]?.option || ""}
                onDoubleClick={() => handleDoubleClick(heading[0]?.option)}
                readOnly
              />
            </Form.Group>
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Row>
        {data && data?.option !== "1" && data?.option !== "one" ? (
          <Col md={12}>
            <Form.Group controlId={`formInput-${rowIndex}-entity`}>
              <Form.Label className="custom-label">Attribute</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  lineHeight: "1",
                  minHeight: "40px", // Set a minimum height (adjust as necessary)
                  overflowY: "auto", // Allow vertical scroll if content exceeds maxHeight
                  resize: "vertical", // Prevent resizing, or use "vertical" to allow only vertical resizing
                }}
                as="textarea"
                type="text"
                value={data?.option || ""}
                onDoubleClick={() => handleDoubleClick(data?.option)}
                readOnly
              />
            </Form.Group>
          </Col>
        ) : (
          <></>
        )}
      </Row>
      <Row>
        {columnsToRender?.map((col, index) => {
          const colOptionLower = col.option.toLowerCase(); // Convert to lowercase for a case-insensitive match
          const isEmail = ["email", "email id", "email address"].includes(
            colOptionLower
          );
          // const isNumber = ["number", "phone number", "phone no"].includes(
          //   colOptionLower
          // );
          const isYesOrNo =
            colOptionLower.includes("(yes/no)") ||
            data?.option.includes("Yes/No");
          const isPercentage =
            colOptionLower.includes("%age") ||
            colOptionLower.includes("%") ||
            colOptionLower.includes("percentage");

          const isRadioOption1 =
            col.option ===
            "Disclosures under this report made on a standalone basis (i.e. only for the entity).";
          const isRadioOption2 =
            col.option ===
            "On a consolidated basis (i.e. for the entity & all the entities which form a part of its consolidated financial statements, taken together)";

          if (isRadioOption1 || isRadioOption2) {
            return (
              <Col key={col.detail_id} md={12}>
                <Form.Group
                  controlId={`formInput-${rowIndex}-${col.detail_id}`}
                >
                  <Form.Check
                    type="radio"
                    id={`radio-${rowIndex}-${index}`}
                    name={`radio-${rowIndex}`}
                    label={
                      <span
                        className="custom-radio-label"
                        style={{
                          color: "rgba(0,0,0,0.70)",
                          fontSize: "12px",
                          fontFamily: "Open Sans",
                          fontWeight: 400,
                          wordWrap: "break-word",
                        }}
                      >
                        {col.option}
                      </span>
                    }
                    checked={radioValue === col.option}
                    onChange={() =>
                      handleRadioChange(
                        col.option,
                        index,
                        isRadioOption1 ? index + 1 : index - 1
                      )
                    }
                    readOnly={!edit || isReadOnly}
                  />
                </Form.Group>
              </Col>
            );
          }

          return (
            <Col
              key={col.detail_id}
              md={
                // isYesOrNo ? 3 :
                col.option.replace(/\(Yes\/No\)/g, "").length > 200 ? 12 : 6
                // mdValue
              }
            >
              <Form.Group controlId={`formInput-${rowIndex}-${col.detail_id}`}>
                <Form.Label className="custom-label">
                  {col.option.replace(/\(Yes\/No\)/g, "")}
                </Form.Label>

                {isYesOrNo ? (
                  <div className="select-wrapper">
                    <Dropdown
                      onSelect={(eventKey) => handleChange(index, eventKey)}
                      placeholder="Select Yes/No"
                    >
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
                        <span style={{ marginRight: "85%" }}>
                          {updatedRows?.[rowIndex]?.[index] ?? "Select "}
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
                ) : isPercentage ? (
                  <div className="input-percentage-wrapper">
                    <Form.Control
                      style={{
                        backgroundColor: "#Dfebef",
                        lineHeight: "1",
                        minHeight: "40px", // Set a minimum height (adjust as necessary)
                        overflowY: "auto", // Allow vertical scroll if content exceeds maxHeight
                        resize: "vertical", // Prevent resizing, or use "vertical" to allow only vertical resizing
                      }}
                      type="text"
                      as="textarea"
                      value={updatedRows?.[rowIndex]?.[index] ?? ""}
                      onChange={(e) =>
                        handlePercentageChange(index, e.target.value)
                      }
                      readOnly={!edit || isReadOnly}
                    />
                    <span className="percentage-sign">%</span>
                  </div>
                ) : (
                  <>
                    <Form.Control
                      style={{
                        backgroundColor: "#Dfebef",
                        height: "auto", // Auto height based on content

                        lineHeight: "1",
                        minHeight: "40px", // Set a minimum height (adjust as necessary)
                        overflowY: "auto", // Allow vertical scroll if content exceeds maxHeight
                        resize: "vertical", // Prevent resizing, or use "vertical" to allow only vertical resizing
                      }}
                      type={isEmail ? "email" : "text"}
                      as="textarea"
                      // type={isEmail ? "email" : isNumber ? "tel" : "text"}
                      value={updatedRows?.[rowIndex]?.[index] || ""}
                      onDoubleClick={() =>
                        handleDoubleClick(updatedRows?.[rowIndex]?.[index])
                      }
                      onChange={(e) => handleChange(index, e.target.value)}
                      placeholder=" "
                      readOnly={!edit || isReadOnly}
                    />
                    {errors[`${rowIndex}-${index}`] && (
                      <Form.Text className="text-danger">
                        {errors[`${rowIndex}-${index}`]}
                      </Form.Text>
                    )}
                  </>
                )}
              </Form.Group>
            </Col>
          );
        })}
      </Row>

      {emissionData &&
      (currentQuestion?.questionId === 451 || currentQuestion?.questionId === 452) ? (
        emissionData[rowIndex] && emissionData[rowIndex].length === 2 ? (
          <Row>
            <Col md={6}>
              <Form.Group controlId={`formInput-${rowIndex}-male`}>
                <Form.Label className="custom-label">Energy</Form.Label>
                <Form.Control
                  style={{
                    backgroundColor: "#Dfebef",
                    lineHeight: "1",
                    minHeight: "40px",
                    overflowY: "auto",
                    resize: "vertical",
                  }}
                  as="textarea"
                  type="text"
                  value={emissionData[rowIndex][0] + " GJ"}
                  readOnly
                />
              </Form.Group>
            </Col>
            {currentQuestion?.questionId === 452 ? (
              <Col md={6}>
                <Form.Group controlId={`formInput-${rowIndex}-female`}>
                  <Form.Label className="custom-label">Emission</Form.Label>
                  <Form.Control
                    style={{
                      backgroundColor: "#Dfebef",
                      lineHeight: "1",
                      minHeight: "40px",
                      overflowY: "auto",
                      resize: "vertical",
                    }}
                    as="textarea"
                    type="text"
                    value={emissionData[rowIndex][1] + " tCO2"}
                    readOnly
                  />
                </Form.Group>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        ) : null
      ) : null}

      {currentQuestion?.questionId == 46 || currentQuestion?.questionId == 48 ? (
        <Row>
          <Col md={6}>
            <Form.Group controlId={`formInput-${rowIndex}-male`}>
              <Form.Label className="custom-label">
                Male Trigger Value
              </Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  lineHeight: "1",
                  minHeight: "40px",
                  overflowY: "auto",
                  resize: "vertical",
                }}
                as="textarea"
                type="text"
                value={"12%"}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId={`formInput-${rowIndex}-female`}>
              <Form.Label className="custom-label">
                Female Trigger Value
              </Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  lineHeight: "1",
                  minHeight: "40px",
                  overflowY: "auto",
                  resize: "vertical",
                }}
                as="textarea"
                type="text"
                value={"12%"}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <></>
      )}

      {currentQuestion?.applicableNote === 1 && (
        <Row>
          <Col md={12}>
            <Form.Group controlId="formInput12">
              <Form.Label className="custom-label">Note</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  lineHeight: "1",
                  minHeight: "40px", // Set a minimum height (adjust as necessary)
                  overflowY: "auto", // Allow vertical scroll if content exceeds maxHeight
                  resize: "vertical", // Prevent resizing, or use "vertical" to allow only vertical resizing
                }}
                type="text"
                as="textarea"
                value={note && !/^(\s*,\s*)+$/.test(note) ? note : ""}
                onDoubleClick={() => handleDoubleClick(note)}
                onChange={handleNoteChange}
                readOnly={!edit || isReadOnly}
              />
            </Form.Group>
          </Col>
        </Row>
      )} 
    </>
  );
};

export default RowComponent;
