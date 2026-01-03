import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import swal from "sweetalert";
import { USER_TYPE_CODE_MAPPING } from "../../_constants/constants";

const AuditFilter = ({
  setSelectedFinancialYear,
  setSelectedSupplier,
  status,
  setStatus,
  update,
  setUpdate,
  questionnaire,
  setQuestionnaire,
  findQuestionIds
}) => {
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
  const role = localStorage.getItem("role");
  const user_type_code = USER_TYPE_CODE_MAPPING[role];


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
      `${config.API_URL}getSupplierEntities`, {}, {
      supplier_id:
        JSON.parse(localStorage.getItem("currentUser")).id
    }
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
    <Form className="m-3">
      <div className="filter_section">
        <h5 className="p-0 mb-3">
          <strong>Filters</strong>
        </h5>
        <div className="mb-3">
          {user_type_code === "company" && (
            <>
              <Form.Label className="m-0 p-0">Choose Supplier</Form.Label>
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
              <Form.Label className="m-0 p-0">Choose Company</Form.Label>
              <Form.Select aria-label="Default select example"></Form.Select>
            </>
          )}
        </div>

        <div>
          <Form.Label className="m-0 p-0">Choose Financial Year</Form.Label>
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

        <div className="mb-3">
          <Form.Label className="m-0 p-0">Status</Form.Label>
          <Row>
            <Col md={4}>
              <Form.Check
                label="Accepted"
                type="checkbox"
                id="accepted"
                name={`"ACCEPTED"`}
                onChange={(e) =>
                  setCheckedStatus(e.target.checked, e.target.name)
                }
              />
            </Col>
            <Col md={4}>
              <Form.Check
                label="Rejected"
                type="checkbox"
                id="rejected"
                name={`"REJECTED"`}
                onChange={(e) =>
                  setCheckedStatus(e.target.checked, e.target.name)
                }
              />
            </Col>
            <Col md={4}>
              <Form.Check
                label="In Verification"
                type="checkbox"
                id="in_verification"
                name={`"IN_VERIFICATION"`}
                onChange={(e) =>
                  setCheckedStatus(e.target.checked, e.target.name)
                }
              />
            </Col>
          </Row>
        </div>

        <div className="mb-3">
          <Form.Label className="m-0 p-0">Update Type</Form.Label>
          <Row>
            <Col md={6}>
              <Form.Check
                label="Answered"
                type="checkbox"
                id="answered"
                name={`"Answered"`}
                onChange={(e) =>
                  setCheckedUpdate(e.target.checked, e.target.name)
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                label="Updated"
                type="checkbox"
                id="updated"
                name={`"Updated"`}
                onChange={(e) =>
                  setCheckedUpdate(e.target.checked, e.target.name)
                }
              />
            </Col>
          </Row>
        </div>

        <div className="mb-3">
          <Form.Label className="m-0 p-0">Questionnaire Type</Form.Label>
          <Row>
            <Col md={6}>
              <Form.Check
                label="Sector Questions"
                type="checkbox"
                id="SQ"
                name={`"SQ"`}
                onChange={(e) =>
                  setCheckedQuestionnaire(e.target.checked, e.target.name)
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                label="Supplier Assessment"
                type="checkbox"
                id="SA"
                name={`"SA"`}
                onChange={(e) =>
                  setCheckedQuestionnaire(e.target.checked, e.target.name)
                }
              />
            </Col>
          </Row>
        </div>

        <div className="mb-3">
          <Form.Label className="m-0 p-0">Question Ids</Form.Label>
          <Row>
            <input
              className="w-100"
              placeholder="1-8,10"
              level="Range"
              id="questionRange"
            />
            <Button
              type={"button"}
              onClick={(e) => {
                findQuestionIds(
                  document.getElementById("questionRange").value
                );
              }}
            >
              {">>"}
            </Button>
          </Row>
        </div>
      </div>
    </Form>
  );
};

export default AuditFilter;
