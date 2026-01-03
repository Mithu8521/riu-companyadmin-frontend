import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { useParams } from "react-router-dom";

const ExternaTraineelAttendance = () => {
  const { token } = useParams();
  const [step, setStep] = useState(1); // Step 1: Enter Details, Step 2: Mark Completed
  const [firstName, setFirstName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const handleFetchToken = async () => {
    const result = token.includes("external_register")
      ? token.split("external_register")[0]
      : null;
    const payload = {
      firstName,
      mobileNumber,
      token,
      token: result ? result : token,
    };

    const { isSuccess, data } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}getExternalTrainee`,
      {},
      payload,
      "GET"
    );

    if (isSuccess) {
      setAuthToken(data?.data?.id);
      setStep(2); // Move to Step 2
    } else {
      alert("Failed to fetch token. Please try again.");
    }
  };

  const handleMarkCompleted = async () => {
    if (!authToken) {
      alert("No token available. Please fetch a token first.");
      return;
    }
    const result = token.includes("external_register")
      ? token.split("external_register")[0]
      : null;
    const payload = {
      id: authToken,
      status: "COMPLETED",
      token: result ? result : token,
    };

    const { isSuccess } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}markAttendenceExternalTrainee`,
      {},
      payload,
      "POST"
    );

    if (isSuccess) {
      alert("Marked as completed!");
      setShowModal(false); // Close modal
    } else {
      alert("Failed to mark as completed.");
    }
  };
  
  return (
    <div className="task-page">
      {/* Modal for Steps */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {step === 1 ? (
          <>
            {/* Step 1: Enter Details */}
            <Modal.Header closeButton>
              <Modal.Title>Enter Your Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleFetchToken}>
                Submit
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            {/* Step 2: Mark Completed */}
            <Modal.Header closeButton>
              <Modal.Title>Mark Task as Completed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Click the button below to mark the task as completed.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleMarkCompleted}>
                Mark as Completed
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ExternaTraineelAttendance;
