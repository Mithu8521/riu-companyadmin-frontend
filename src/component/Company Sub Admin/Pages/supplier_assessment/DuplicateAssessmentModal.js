import React, { useState, useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import AddQuestionAssessment from "./addQuestionAssessment";

const DuplicateAssessmentModal = ({
  show,
  handleClose2,
}) => {
  const multiselectRefTracker = useRef();
  const [assessmentValue, setAssessmentValue] = useState([]);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    // setShow (false)
    setShow1(true)
  };
  return (
    <>
      <Modal show={show} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Previous Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Select Previous Assessment</Form.Label>
          <Multiselect
            displayValue="title"
            options={assessmentValue}
            ref={multiselectRefTracker}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info"> Import </Button>
          <Button variant="info" onClick={handleShow1}> Add Assessment </Button>
        </Modal.Footer>
      </Modal>

      {show1 && (
        <AddQuestionAssessment
          show={show1}
          handleClose1={handleClose1}
        />
      )}
    </>
  );
};

export default DuplicateAssessmentModal;
