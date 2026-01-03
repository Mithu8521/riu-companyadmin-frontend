import React, { useEffect, useState } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config";
import { Modal, Button, Table, Row, Col, Form } from "react-bootstrap";

const Unit = () => {
  const [questionData, setQuestionData] = useState([]);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");

  const handleEditUnit = (questionId, availableUnits) => {
    setEditId(questionId);
    setUnits(availableUnits);
    setSelectedUnit(""); 
    setShowEditUnitModal(true);
  };

  const handleSaveUnit = async () => {
    if (editId) {
      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveUnitCatagory`,
        {},
        {
          catagoryId: editId,
          unit: selectedUnit,
        },
        "POST"
      );
      if (isSuccess) {
        getUnitCatagory();
        setShowEditUnitModal(false);
      }
    }
  };

  const getUnitCatagory = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getUnitCatagory`,
      {},
      {
        type: "ALL",
      },
      "GET"
    );
    if (isSuccess) {
      setQuestionData(data?.data || []);
    }
  };

  useEffect(() => {
    getUnitCatagory();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div className="color_div_on framwork_2 pt-0">
        <div className="business_detail">
          <div className="table-responsive">
            <Row>
              <Col md={12}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionData && questionData.length > 0 ? (
                      questionData.map((question, index) => (
                        <tr key={question.id}>
                          <td>{index + 1}</td>
                          <td>{question.title}</td>
                          <td>{question.unit || "No unit selected"}</td>
                          <td>
                            <Button
                              onClick={() =>
                                handleEditUnit(question.id, question.units)
                              }
                              disabled={!question?.isEditable}
                            >
                              Set Unit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <Modal
                  show={showEditUnitModal}
                  onHide={() => setShowEditUnitModal(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Select Unit</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Select a Unit</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedUnit}
                          onChange={(e) => setSelectedUnit(e.target.value)}
                        >
                          <option value="">Select a Unit</option>
                          {units.map((unit, index) => (
                            <option key={index} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowEditUnitModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveUnit}
                      disabled={!selectedUnit}
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unit;
