import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";

const AssignAssessmentModal = ({
  show,
  handleClose1,
  assessmentList,
  assignAssessment,
}) => {
  const [supplierList, setSupplierList] = useState("");
  const [selectedAssessmentOptions, setSelectedAssessmentOptions] = useState();
  const supplierIDRef = useRef();

  useEffect(() => {
    getMappedSuppliers();
  }, []);

  const getMappedSuppliers = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getMappedSuppliers`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const responseData = data.data;
      setSupplierList(responseData);
    }
  };

  return (
    <Modal show={show} onHide={handleClose1}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {supplierList && (
          <div className="mb-3">
            <Form.Label>Select Supplier</Form.Label>
            <Form.Select
              style={{ height: 40 }}
              aria-label="Default select example"
              ref={supplierIDRef}
            >
              <option>Select Supplier</option>
              {supplierList.map((supplier) => (
                <option value={supplier.id}>
                  {supplier.first_name + " " + supplier.last_name}
                </option>
              ))}
            </Form.Select>
            {/* <Multiselect
              displayValue="key"
              options={supplierList.map((supplier) => ({
                cat: supplier.id,
                key: supplier.first_name + " " + supplier.last_name,
              }))}
              showCheckbox={false}
            /> */}
          </div>
        )}

        <Form.Label>Select Assessment</Form.Label>

        <Multiselect
          displayValue="titleNyear"
          options={assessmentList.map((assessment) => ({
            id: assessment.id,
            titleNyear:
              assessment.title + "(" + assessment.financial_year_value + ")",
          }))}
          showCheckbox={true}
          // ref={assessmentInputRef}
          onSelect={(e) => setSelectedAssessmentOptions(e)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="new_button_style"
          onClick={() => {
            assignAssessment(selectedAssessmentOptions, supplierIDRef.current.value);
          }}
        >
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignAssessmentModal;
