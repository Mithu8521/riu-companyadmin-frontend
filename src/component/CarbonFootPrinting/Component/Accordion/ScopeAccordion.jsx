import React, { useState } from "react";
import ScopeFrequency from "./ScopeFrequency";
import HistoryComponent from "../HistoryComponent";
import down from "../../../../img/DownArrow.svg";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Modal,
  ButtonGroup,
} from "react-bootstrap";
import pin from "../../../../img/pin.svg";
import close from "../../../../img/Close.svg";
import { FiUpload, FiDownload } from "react-icons/fi"; // Icons for upload and download
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Icons for back and next

const ScopeAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [singleItem, setSingleItem] = useState(null);

  const item = {
    title:
      "Combustion of fuels in owned or controlled stationary equipment such as boilers, furnaces, burners, turbines, heaters, incinerators, engines, flares, etc.",
  };
  const assignedToDetails = {
    assignedByDetails: [{ first_name: "Shamik" }],
    assignedToDetails: [{ first_name: "Shamik" }],
  };
  const handleTitle = (item) => {
    setSingleItem(item);
  };
  const user = {};
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

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [forms, setForms] = useState([{}]); // Initial form

  const handleAddForm = () => {
    setForms([...forms, {}]); // Add a new form
  };

  const handleRemoveForm = (index) => {
    const updatedForms = forms.filter((_, i) => i !== index);
    setForms(updatedForms);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const [showHistory, setShowHistory] = useState(false);

  // Function to handle the history button click
  const handleHistoryClick = () => {
    setShowHistory(!showHistory); // Set state to show the history component
  };

  // If showHistory is true, render the history component instead of the main component
  if (showHistory) {
    return <HistoryComponent handleHistoryClick={handleHistoryClick} />;
  }
  return (
    <div
      className="container w-100 my-3"
      style={{ background: "transparent", padding: "0%" }}
    >
      <div className="accordion" id="accordionExample">
        <div className="accordion-item my-3" key={0}>
          <h2 className="accordion-header" id={`heading${0}`}>
            <button
              className="accordion-button d-flex justify-content-between align-items-center"
              type="button"
              style={{
                backgroundColor: "#BFD7E0",
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.7rem 1rem",
              }}
              onClick={() => {
                handleAccordionClick(0);
                handleTitle(item);
                //   handleApplicableCheck(item);
              }}
              // onClick={() => handleAccordionClick(index);handleTitle()}
              aria-expanded={activeIndex === 0}
              aria-controls={`collapse${0}`}
            >
              <div style={{ flex: "0 0 90%" }}>
                <span style={{ color: "black", marginBottom: "10px" }}>
                  {0 + 1}. {item.title.replace(/\b(Yes|No)\b/g, "")}
                </span>
                {assignedToDetails?.assignedToDetails && (
                  <div style={{ color: "grey", fontSize: "12px" }}>
                    {"Assigned To :- "}
                    {assignedToDetails.assignedToDetails
                      .map((detail) => detail?.first_name)
                      .filter((name) => name) // Filter out any undefined or null names
                      .join(", ")}
                  </div>
                )}
              </div>

              <div
                style={{
                  flex: "0 0 10%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span
                  className="btn btn-sm btn-outline-secondary "
                  style={{
                    fontWeight: "bold",
                    border: "1.5px solid",
                    borderColor: "grey",
                    padding: "0.4%",
                    marginRight: "0.75rem",
                    paddingLeft: "7%",
                    paddingRight: "7%",
                  }}
                >
                  {activeIndex === 0 ? "-" : "+"}
                </span>
              </div>
            </button>
          </h2>
          <div
            id={`collapse${0}`}
            className={`accordion-collapse collapse ${activeIndex === 0 ? "show" : ""
              }`}
            aria-labelledby={`heading${0}`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div
                className=""
                style={{
                  background: "#E3EBED",
                  height: "40px",
                  width: "107%",
                  marginTop: "-4%",
                  marginLeft: "-4.5%",
                }}
              ></div>

              <div className="p-3 ">
                <div></div>
                <div
                  style={{
                    border: "1px solid grey",
                    padding: "5px 15px 20px 15px",
                    borderRadius: "10px",
                    marginTop: "2%",
                    display: "flex",
                    justifyContent: "space-between", // This will space out the child divs
                    alignItems: "center", // This will vertically align the child divs in the middle
                  }}
                >
                  <ScopeFrequency handleHistoryClick={handleHistoryClick} />
                </div>
                <div
                  style={{
                    border: "1px solid grey",
                    padding: "5px 15px 20px 15px",
                    borderRadius: "10px",
                    marginTop: "2%",
                  }}
                >
                  <Form>
                    {/* First Row with 5 input texts */}
                    <Row className="mb-3">
                      <Col className="col-20">
                        <Form.Group controlId="formInput1">
                          <Form.Label className="custom-label">
                            Assigned By
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={
                              assignedToDetails?.assignedByDetails?.[0]
                                ?.first_name || ""
                            }
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col className="col-20">
                        <Form.Group controlId="formInput2">
                          <Form.Label className="custom-label">
                            Assigned To
                          </Form.Label>
                          <Form.Control
                            as="select"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={"Dipak"}

                            readOnly
                          >
                            {assignedToDetails?.assignedToDetails?.map(
                              (detail, index) => (
                                <option key={index} value={detail?.first_name}>
                                  {detail?.first_name}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="col-20">
                        <Form.Group controlId="formInput3">
                          <Form.Label className="custom-label">
                            Assign Date
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={
                              assignedToDetails?.createdAt
                                ? new Date(
                                  assignedToDetails.createdAt
                                ).toLocaleDateString("en-GB")
                                : ""
                            }
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col className="col-20">
                        <Form.Group controlId="formInput4">
                          <Form.Label className="custom-label">
                            Due Date
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={
                              assignedToDetails?.dueDate
                                ? new Date(
                                  assignedToDetails.dueDate
                                ).toLocaleDateString("en-GB")
                                : ""
                            }
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col className="col-20">
                        <Form.Group controlId="formInput5">
                          <Form.Label className="custom-label">
                            Answered Date
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={
                              assignedToDetails?.updatedAt
                                ? new Date(
                                  assignedToDetails.updatedAt
                                ).toLocaleDateString("en-GB")
                                : ""
                            }
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Second Row with 4 input texts */}

                    {/* {auditorRemark &&
                ansId &&
                auditorRemark.map((user) => { */}
                    {/* Find the matching auditor object for this user */}
                    {/* const auditorObject = mappedUserData?.find((auditor) => { */}

                    {/* //   console.log(user) */}
                    {/* //   // Log each auditor being checked */}

                    {/* //   return auditor?.id?.toString() === user?.id?.toString(); */}
                    {/* // }); */}

                    {/* //   return ( */}
                    <Row className="mb-3" key={user.id}>
                      <Col>
                        <Form.Group controlId={`formInput6-${user.id}`}>
                          <Form.Label className="custom-label">
                            Audited By
                          </Form.Label>
                          <Form.Control
                            type="text"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={user?.firstName || ""}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`formInput7-${user.id}`}>
                          <Form.Label className="custom-label">
                            Audited Date
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={
                              user
                                ? new Date(
                                  user?.auditedDate
                                ).toLocaleDateString()
                                : ""
                            }
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`formInput8-${user.id}`}>
                          <Form.Label className="custom-label">
                            Question Status
                          </Form.Label>
                          <Form.Control
                            type="text"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={user?.status || "Accepted"}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group controlId={`formInput9-${user.id}`}>
                          <Form.Label className="custom-label">
                            Auditor Remark
                          </Form.Label>
                          <Form.Control
                            type="text"
                            style={{ backgroundColor: "#BFD7E0" }}
                            value={user?.remark || ""}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* //   ); */}
                    {/* // })} */}
                  </Form>
                </div>

                <div
                  style={{
                    border: "1px solid grey",
                    padding: "5px 15px 20px 15px",
                    borderRadius: "10px",
                    marginTop: "2%",
                  }}
                >
                  <div className="container mt-4">
                    {forms.map((form, index) => (
                      <div
                        key={index}
                        className="border rounded p-4 mb-4 position-relative"
                      >
                        <div
                          className="position-absolute "
                          style={{ right: "5px", top: "5px" }}
                          onClick={() => handleRemoveForm(index)}
                        >
                          <img src={close} />{" "}
                        </div>
                        <Row className="mb-3">
                          <Col style={{ marginRight: "0px" }} md={3}>
                            <Form.Group controlId={`typeSelect-${index}`}>
                              <Form.Label>Type</Form.Label>

                              {/* Wrapper with position: relative */}
                              <div style={{ position: "relative" }}>
                                {/* Form Control */}
                                <Form.Control
                                  style={{
                                    backgroundColor: "#dfebf0",
                                    paddingRight: "30px",
                                  }} // Extra padding for arrow
                                  as="select"
                                >
                                  <option>Select Fuel Type</option>
                                  <option>Type 1</option>
                                  <option>Type 2</option>
                                </Form.Control>

                                {/* Down Arrow SVG */}
                                <img
                                  src={down} // Replace with the actual path to your SVG
                                  alt="Down arrow"
                                  style={{
                                    position: "absolute",
                                    right: "10px", // Adjust the arrow's position
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none", // Prevent interaction with the image
                                    width: "16px", // Adjust the size of the arrow
                                    height: "16px",
                                  }}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col style={{ marginRight: "0px" }} md={3}>
                            <Form.Group controlId={`fuelSelect-${index}`}>
                              <Form.Label>Fuel</Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  style={{ backgroundColor: "#dfebf0" }}
                                  as="select"
                                >
                                  <option>Select Fuel</option>
                                  <option>Fuel 1</option>
                                  <option>Fuel 2</option>
                                </Form.Control>
                                <img
                                  src={down} // Replace with the actual path to your SVG
                                  alt="Down arrow"
                                  style={{
                                    position: "absolute",
                                    right: "10px", // Adjust the arrow's position
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none", // Prevent interaction with the image
                                    width: "16px", // Adjust the size of the arrow
                                    height: "16px",
                                  }}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col style={{ marginRight: "0px" }} md={3}>
                            <Form.Group controlId={`unitSelect-${index}`}>
                              <Form.Label>Unit</Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  style={{ backgroundColor: "#dfebf0" }}
                                  as="select"
                                >
                                  <option>Select Unit</option>
                                  <option>Unit 1</option>
                                  <option>Unit 2</option>
                                </Form.Control>

                                <img
                                  src={down} // Replace with the actual path to your SVG
                                  alt="Down arrow"
                                  style={{
                                    position: "absolute",
                                    right: "10px", // Adjust the arrow's position
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none", // Prevent interaction with the image
                                    width: "16px", // Adjust the size of the arrow
                                    height: "16px",
                                  }}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                          <Col style={{ marginRight: "0px" }} md={3}>
                            <Form.Group controlId={`readingValue-${index}`}>
                              <Form.Label>Reading Value</Form.Label>
                              <Form.Control
                                type="text"
                                style={{ backgroundColor: "#dfebf0" }}
                                placeholder="Enter Reading Value"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col style={{ marginRight: "0px" }} md={12}>
                            <Form.Group controlId={`description-${index}`}>
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                as="textarea"
                                style={{ backgroundColor: "#dfebf0" }}
                                rows={1}
                                placeholder="Enter Description Over Here"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={12} style={{ marginRight: "0px" }}>
                            <Form.Group controlId={`note-${index}`}>
                              <Form.Label>Note</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={1}
                                style={{ backgroundColor: "#dfebf0" }}
                                placeholder="Note"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group
                          controlId="formFile"
                          className="custom-file-upload"
                          style={{ marginBottom: "5%" }}
                        >
                          <Form.Label className="custom-label">
                            Upload a file
                          </Form.Label>
                          <div className="file-upload-wrapper">
                            <label className="upload-btn">
                              <div style={{ height: "12px", width: "12px" }}>
                                <FiUpload height={"12px"} width={"12px"} />
                              </div>
                              <span>Upload a file</span>
                              <Form.Control
                                style={{ display: "none" }} // Hide the default file input
                                onClick={() => handleShow()}
                              />
                            </label>
                          </div>
                        </Form.Group>

                        {/* <>
            {filteredDocs && filteredDocs.length > 0 && (
              <Row
                style={{
                  backgroundColor: "#DFEBEF",
                  width: "100%",
                  borderRadius: "8px",
                  marginLeft: "0px",
                  marginTop: menu !== "audit" ? "0%" : "3%",
                }}
              >
                {filteredDocs && filteredDocs.length > 0 && (
                  <Row
                    style={{
                      backgroundColor: "#DFEBEF",
                      width: "100%",
                      padding: "20px",
                      borderRadius: "8px",
                      marginLeft: "0px",
                    }}
                  >
                    {filteredDocs.map((url, index) => {
                      const docSegments = url.split("/");
                      const docFileName =
                        docSegments.length > 1
                          ? docSegments[docSegments.length - 2] ===
                            docSegments[docSegments.length - 1]
                            ? docSegments[docSegments.length - 1]
                            : docSegments[docSegments.length - 1]
                          : url;

                      let commentText = "";
                      if (
                        filteredComments.length > 0 &&
                        index < filteredComments.length
                      ) {
                        commentText =
                          filteredComments[index] !== 0
                            ? filteredComments[index]
                            : "";
                      } else {
                        console.log(
                          "No valid comment found for the given index."
                        );
                      }

                      return (
                        <Row key={index} style={{}}>
                          <Col md={6}>
                            <div style={inputStyle}>
                              <span
                                style={{
                                  marginLeft: 10,
                                  marginRight: 10,
                                  wordBreak: "break-all",
                                  flexGrow: 1,
                                  fontSize: "12px",
                                  maxWidth: "70%",
                                }}
                                title={docFileName}
                              >
                                {decodeURIComponent(docFileName).slice(0, 50)}
                              </span>

                              <IoDownloadOutline
                                style={{
                                  marginLeft: 10,
                                  cursor: "pointer",
                                  height: "20px",
                                  width: "20px",
                                  color: "black",
                                }}
                                onClick={() => handleFileDownload(url)}
                                title="Download File"
                              />

                              {!(
                                menu === "audit" ||
                                (assignedToDetails?.assignedTo?.length > 0 &&
                                  !assignedToDetails?.assignedTo?.some(
                                    (id) => parseInt(id, 10) === currentUserId
                                  ))
                              ) && (
                                <RiDeleteBinLine
                                  style={{
                                    cursor: "pointer",
                                    height: "20px",
                                    width: "20px",
                                    color: "black",
                                    marginLeft: "1rem",
                                  }}
                                  onClick={() => handleDeleteClick(url)}
                                  title="Remove File"
                                />
                              )}
                            </div>
                          </Col>

                          <Col md={6} style={{ marginLeft: "1.8rem" }}>
                            <div style={inputStyle}>
                              <Form.Control
                                type="text"
                                defaultValue={commentText}
                                readOnly={
                                  menu === "audit" ||
                                  (assignedToDetails?.assignedTo?.length > 0 &&
                                    !assignedToDetails?.assignedTo?.some(
                                      (id) => parseInt(id, 10) === currentUserId
                                    )) ||
                                  (check && isEditable) ||
                                  (assignedToDetails?.dueDate &&
                                    new Date(
                                      assignedToDetails.dueDate
                                    ).setHours(0, 0, 0, 0) <
                                      new Date().setHours(0, 0, 0, 0))
                                }
                                placeholder="No Comment"
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  border: "none",
                                  borderRadius: "5px",
                                  border: "1.5px solid #3F88A5",
                                  borderColor: "#3F88A5",
                                  background: "#DFEBEF",
                                  backgroundColor: "#DFEBEF",
                                  paddingLeft: "10px",
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                  </Row>
                )}
              </Row>
            )}

            <DetailModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              data={showData}
            />
            <Modal show={showModal} onHide={cancelDelete} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this file?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </> */}

                        <Row>
                          <Col style={{ marginRight: "0px" }} md={2}>
                            <Button
                              variant="outline-secondary"
                              className="w-100"
                              style={{
                                padding: "13px 25px",
                                fontWeight: 500,
                                fontSize: "16px",
                                border: "1px solid #3F88A5",
                              }}
                            >
                              Clear
                            </Button>
                          </Col>
                          <Col md={2} style={{ marginRight: "0px" }}>
                            <Button
                              variant="primary"
                              className="w-100"
                              style={{ fontSize: "16px" }}
                            >
                              Submit
                            </Button>
                          </Col>
                          <Col md={6} style={{ marginRight: "0px" }}></Col>
                          <Col md={2} style={{ marginRight: "0px" }}>
                            <Button
                              variant="outline-secondary"
                              className="w-100"
                              style={{
                                padding: "13px 25px",
                                fontWeight: 500,
                                fontSize: "16px",
                                border: "1px solid #3F88A5",
                              }}
                              onClick={handleAddForm}
                            >
                              + Add
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      {/* Left Side: Upload and Download Buttons */}


                      <Button
                        variant="primary"
                        style={{ fontSize: "16px", display: "flex" }}
                      >
                        <FiDownload
                          style={{
                            height: "20px",
                            width: "20px",
                            marginRight: "5px",
                          }}
                        />{" "}
                        Download
                      </Button>
                      {/* Right Side: Back and Next Buttons */}
                    </div>
                  </div>
                </div>
              </div>
              <Modal show={show} onHide={handleClose} size="md" centered>
                <Modal.Header style={{
                  borderBottom: "none",
                }}
                  closeButton>
                  <Modal.Title>
                    <div
                      style={{
                        width: "150px",

                        fontSize: "20px",
                        display: "inline-block",
                        fontFamily: "Open Sans",
                        color: "#3f88a5",
                        textAlign: "left",
                      }}
                    >
                      Import Files
                    </div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  {/* File Drop Zone */}
                  <div
                    style={{
                      border: "1px solid #3F88A5",
                      borderRadius: "5px",
                      padding: "30px",
                      textAlign: "center",
                      color: "#7b7b7b",
                    }}
                  >
                    <p style={{ fontSize: "16px", color: "#000" }}>
                      Drop The Files Here
                    </p>
                    <p style={{ fontSize: "16px", color: "#000" }}> Or</p>
                    <Button
                      variant="outline-secondary"
                      className=""
                      style={{
                        padding: "10px 15px",
                        width: "20%",
                        fontWeight: 500,
                        fontSize: "16px",
                        border: "1px solid #3F88A5",
                      }}
                    >
                      Browse
                    </Button>
                  </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none" }}>
                  <div
                    style={{
                      justifyContent: "space-between",
                    }}
                    className="d-flex w-100"
                  >
                    <Button
                      variant="outline-secondary"
                      className="w-30"
                      style={{
                        padding: "13px 25px",
                        fontWeight: 500,
                        fontSize: "16px",
                        border: "1px solid #3F88A5",
                      }}
                      onClick={handleClose}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      className="w-30"
                      style={{ fontSize: "16px" }}
                      onClick={handleClose}
                    >
                      Save
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeAccordion;
