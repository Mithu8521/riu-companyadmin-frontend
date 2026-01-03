import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FilterIcon from "../../../../../img/sector/filter.png";
import Multiselect from "multiselect-react-dropdown";
import { Form, Row, Col, Button } from "react-bootstrap";
import config from "../../../../../config/config.json";
import { apiCall } from "../../../../../_services/apiCall";
import swal from "sweetalert";
import { USER_TYPE_CODE_MAPPING } from "../../../../../_constants/constants";

function AuditListingFilter({
  setSelectedFinancialYear,
  setSelectedSupplier,
  status,
  setStatus,
  update,
  setUpdate,
  questionnaire,
  setQuestionnaire,
  findQuestionIds,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [financialYear, setFinancialYear] = useState([
    { id: "", financial_year_value: "" },
  ]);
  const [suppliers, setSuppliers] = useState([
    {
      company_industry: "",
      email: "",
      first_name: "",
      id: "",
      last_name: "",
      mobile_number: null,
      register_company_name: "",
    },
  ]);

  const setCheckedQuestionnaire = (checkedStatus, name) => {
    let Questionnaires = [];

    if (checkedStatus === true) {
      Questionnaires = [...questionnaire, name];
      Questionnaires = [...new Set(Questionnaires)];
      setQuestionnaire(Questionnaires);
    }

    if (checkedStatus === false) {
      Questionnaires = [...questionnaire];
      Questionnaires = Questionnaires.filter(
        (Questionnaire) => Questionnaire !== name
      );
      Questionnaires = [...new Set(Questionnaires)];
      setQuestionnaire(Questionnaires);
    }
  };

  const setCheckedUpdate = (checkedStatus, name) => {
    let updates = [];

    if (checkedStatus === true) {
      updates = [...update, name];
      updates = [...new Set(updates)];
      setUpdate(updates);
    }

    if (checkedStatus === false) {
      updates = [...update];
      updates = updates.filter((update) => update !== name);
      updates = [...new Set(updates)];
      setUpdate(updates);
    }
  };

  const setCheckedStatus = (checkedStatus, name) => {
    let statuses = [];

    if (checkedStatus === true) {
      statuses = [...status, name];
      statuses = [...new Set(statuses)];
      setStatus(statuses);
    }

    if (checkedStatus === false) {
      statuses = [...status];
      statuses = statuses.filter((status) => status !== name);
      statuses = [...new Set(statuses)];
      setStatus(statuses);
    }
  };

  //   const user_type = JSON.parse(
  //     localStorage.getItem("currentUser")
  //   ).user_type_code;
  const role = localStorage.getItem("role");
  const user_type_code = USER_TYPE_CODE_MAPPING[role];

  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFinancialYear`,
      {},
      { type: user_type_code, current_role: localStorage.getItem("role") }
    );

    if (isSuccess) {
      setFinancialYear(data.data);
    }
  };

  useEffect(() => {
    // getFinancialYear();
  }, []);

  useEffect(() => {
    if (user_type_code === "supplier") {
      getSupplierEntities();
    }
    if (user_type_code === "company") {
      getCompanySuppliers();
    }
  }, []);

  const getCompanySuppliers = async () => {
    const { isSuccess, error, data } = await apiCall(
      `${config.API_URL}getMappedSuppliers`
    );

    if (isSuccess) {
      setSuppliers(data?.data);
    }

    if (error) {
      swal({
        title: "Could not get suppliers of company.",
        text: "",
        icon: "error",
        button: "OK",
      });
    }
  };

  const getSupplierEntities = async () => {
    const { isSuccess, error, data } = await apiCall(
      `${config.API_URL}getSupplierEntities`,
      {},
      { supplier_id: JSON.parse(localStorage.getItem("currentUser")).id }
    );

    if (isSuccess) {
    }

    if (error) {
      swal({
        title: "Could not get companies of supplier.",
        text: "",
        icon: "error",
        button: "OK",
      });
    }
  };
  return (
    <>
      <button className="new_button_style_white" onClick={handleShow}>
        <i className="fas fa-filter"></i>
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>Filter</div>
              <div className="d-flex align-items-center gap-3 mx-3">
                <p style={{ fontSize: 12 }} className="m-0">
                  Answer From
                </p>
                <input
                  type="date"
                  style={{ fontSize: 12, padding: 5 }}
                  name=""
                  id=""
                />
                <p style={{ fontSize: 12 }} className="m-0">
                  To
                </p>
                <input
                  type="date"
                  style={{ fontSize: 12, padding: 5 }}
                  name=""
                  id=""
                />
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  {user_type_code === "company" && (
                    <>
                      <Form.Label className="m-0 p-0">
                        Choose Organization
                      </Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                          <option value={supplier.id}>
                            {supplier.register_company_name}
                          </option>
                        ))}
                      </Form.Select>
                    </>
                  )}
                  {user_type_code === "supplier" && (
                    <>
                      <Form.Label className="m-0 p-0">
                        Choose Company
                      </Form.Label>
                      <Form.Select aria-label="Default select example"></Form.Select>
                    </>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <Form.Label className="m-0 p-0">
                    Choose Financial Year
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => {
                      setSelectedFinancialYear([e.target.value]);
                    }}
                  >
                    {financialYear.map((yeardata) => (
                      <option value={yeardata.id}>
                        {yeardata.financial_year_value}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label className="m-0 p-0">Status</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option
                    value="accepted"
                    onChange={(e) =>
                      setCheckedStatus(e.target.checked, e.target.name)
                    }
                  >
                    Accepted
                  </option>
                  <option
                    value="Rejected"
                    onChange={(e) =>
                      setCheckedStatus(e.target.checked, e.target.name)
                    }
                  >
                    Rejected
                  </option>
                  <option
                    value="in_verification"
                    onChange={(e) =>
                      setCheckedStatus(e.target.checked, e.target.name)
                    }
                  >
                    IN VERIFICATION
                  </option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="m-0 p-0">Update Type</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option
                    value="Answered"
                    onChange={(e) =>
                      setCheckedUpdate(e.target.checked, e.target.name)
                    }
                  >
                    Answered
                  </option>
                  <option
                    value="Updated"
                    onChange={(e) =>
                      setCheckedUpdate(e.target.checked, e.target.name)
                    }
                  >
                    Updated
                  </option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="m-0 p-0">Questionnaire Type</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option
                    value="SQ"
                    onChange={(e) =>
                      setCheckedQuestionnaire(e.target.checked, e.target.name)
                    }
                  >
                    Sector Questions
                  </option>
                  <option
                    value="SA"
                    onChange={(e) =>
                      setCheckedQuestionnaire(e.target.checked, e.target.name)
                    }
                  >
                    Supplier Assessment
                  </option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="m-0 p-0">Question Ids</Form.Label>
                <input
                  className="w-100"
                  style={{ height: 33 }}
                  placeholder="1-8,10"
                  level="Range"
                  id="questionRange"
                />
              </Col>
              <Col md={12}>
                <Form.Label className="mt-3 m-0 p-0">Framework</Form.Label>
                <Multiselect
                  displayValue="key"
                  onKeyPressFn={function noRefCheck() { }}
                  onRemove={function noRefCheck() { }}
                  onSearch={function noRefCheck() { }}
                  onSelect={function noRefCheck() { }}
                  options={[
                    {
                      cat: "Group 1",
                      key: "Framework 1",
                    },
                    {
                      cat: "Group 1",
                      key: "Framework 2",
                    },
                    {
                      cat: "Group 1",
                      key: "Framework 3",
                    },
                    {
                      cat: "Group 2",
                      key: "Framework 4",
                    },
                    {
                      cat: "Group 2",
                      key: "Framework 5",
                    },
                    {
                      cat: "Group 2",
                      key: "Framework 6",
                    },
                    {
                      cat: "Group 2",
                      key: "Framework 7",
                    },
                  ]}
                  showCheckbox
                />
              </Col>
              <Col md={12}>
                <Form.Label className="mt-3 m-0 p-0">Focus Area</Form.Label>
                <Multiselect
                  displayValue="key"
                  onKeyPressFn={function noRefCheck() { }}
                  onRemove={function noRefCheck() { }}
                  onSearch={function noRefCheck() { }}
                  onSelect={function noRefCheck() { }}
                  options={[
                    {
                      cat: "Group 1",
                      key: "Topic 1",
                    },
                    {
                      cat: "Group 1",
                      key: "Topic 2",
                    },
                    {
                      cat: "Group 1",
                      key: "Topic 3",
                    },
                    {
                      cat: "Group 2",
                      key: "Topic 4",
                    },
                    {
                      cat: "Group 2",
                      key: "Topic 5",
                    },
                    {
                      cat: "Group 2",
                      key: "Topic 6",
                    },
                    {
                      cat: "Group 2",
                      key: "Topic 7",
                    },
                  ]}
                  showCheckbox
                />
              </Col>
              <Col md={12}>
                <Form.Label className="mt-3 m-0 p-0">Kpi</Form.Label>
                <Multiselect
                  displayValue="key"
                  onKeyPressFn={function noRefCheck() { }}
                  onRemove={function noRefCheck() { }}
                  onSearch={function noRefCheck() { }}
                  onSelect={function noRefCheck() { }}
                  options={[
                    {
                      cat: "Group 1",
                      key: "Kpi 1",
                    },
                    {
                      cat: "Group 1",
                      key: "Kpi 2",
                    },
                    {
                      cat: "Group 1",
                      key: "Kpi 3",
                    },
                    {
                      cat: "Group 2",
                      key: "Kpi 4",
                    },
                    {
                      cat: "Group 2",
                      key: "Kpi 5",
                    },
                    {
                      cat: "Group 2",
                      key: "Kpi 6",
                    },
                    {
                      cat: "Group 2",
                      key: "Kpi 7",
                    },
                  ]}
                  showCheckbox
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            onClick={(e) => {
              findQuestionIds(document.getElementById("questionRange").value);
            }}
          >
            Apply
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AuditListingFilter;
