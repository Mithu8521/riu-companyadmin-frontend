import React, { useRef } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
const CreateAssessmentModal = ({
  show,
  handleClose,
}) => {
  const financialYearRef = useRef();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form.Control required type="text" placeholder="Assessment Title" />
          </Col>
          <Col md={6}>
            <div>
              <select className="select___year" ref={financialYearRef}>
                <option disabled selected> Select Financial Year </option>
                <option > 2023-24  </option>
              </select>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="info"> Create </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAssessmentModal;
