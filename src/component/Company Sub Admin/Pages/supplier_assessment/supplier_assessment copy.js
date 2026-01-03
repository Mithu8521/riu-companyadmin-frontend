import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { useLocation } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./supplier_assessment.css";
import Table from "react-bootstrap/Table";
import View from "../../../../img/view.png";
import Duplicate from "../../../../img/duplicate.png";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import swal from "sweetalert";
import CreateAssessmentModal from "./CreateAssessmentModal";
import DuplicateAssessmentModal from "./DuplicateAssessmentModal";
import AssignAssessmentModal from "./AssignAssessmentModal";

export default function Supplier_assessment(props) {
  const location = useLocation();

  const [assessmentList, setAssessmentList] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [financialYearId, setFinancialYearId] = useState("");
  const [duplicateAssessmentId, setDuplicateAssessmentId] = useState("");
  const [duplicateAssessmentTitle, setDuplicateAssessmentTitle] = useState("");

  const handleClose = () => setShow(false);
  const handleClose1 = () => setShow1(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => {
    setShow1(true);
  };

  const fetchSupplierAssessment = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}fetchSupplierAssessment`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const responseData = data.data;
      setAssessmentList(responseData);
    }
  };

  useEffect(() => {
    fetchSupplierAssessment();
  }, []);

  const handleShow2 = (e, id, title) => {
    setDuplicateAssessmentTitle(title);
    setDuplicateAssessmentId(id);
    setShow2(true);
  };

  const createDuplicateAssessment = async (duplicateAssessmentId) => {
    const { isSuccess, data, error } = await apiCall(
      `${config.API_URL}duplicateAssesment`,
      {},
      {
        assessment_id: duplicateAssessmentId,
        financial_year_id: financialYearId,
      },
      "POST"
    );

    if (isSuccess) {
      setShow2(false);
      fetchSupplierAssessment();
      swal({
        icon: "success",
        title: "Successfully Created Assessment!",
        timer: 1000,
      });
    }
    if (error) {
      setShow2(false);
      swal({
        icon: "error",
        title: "Error",
        timer: 1000,
      });
    }
  };

  const assignAssessment = async (values, supplierIDValues) => {
    const assessment_ids = values.map((value) => value.id);

    const { isSuccess, data, error } = await apiCall(
      `${config.API_URL}assignAssessmentToSupplier`,
      {},
      {
        supplier_id: supplierIDValues,
        assessment_ids: assessment_ids,
      },
      "POST"
    );

    if (isSuccess) {
      setShow(false);
      fetchSupplierAssessment();
      swal({
        icon: "success",
        title: "Successfully Created Assessment!",
        timer: 1000,
      });
    }
    if (error) {
      setShow(false);
      swal({
        icon: "error",
        title: "Error",
        timer: 1000,
      });
    }
  };

  const handleCreateButtonClick = async () => {
    const { isSuccess, data, error } = await apiCall(
      `${config.API_URL}createAssessment`,
      {},
      {
        title: assessmentTitle,
        financial_year_id: financialYearId,
      },
      "POST"
    );

    if (isSuccess) {
      setShow(false);
      fetchSupplierAssessment();
      swal({
        icon: "success",
        title: "Successfully Created Assessment!",
        timer: 1000,
      });
    }
    if (error) {
      setShow(false);
      swal({
        icon: "error",
        title: "Error",
        timer: 1000,
      });
    }
  };

  const fetchSupplierAssessmentQuestions = async (e, index, assessment_id) => {
    e.preventDefault();
    props.history.push(
      `/supplier_assessment/assessement_detail/${assessment_id}`
    );
  };

  // const handleChange = useCallback((date) => {
  //   console.log(date);
  // }, []);

  return (
    <div>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <Container fluid className="mt-2">
        <Row>
          <Col>
            <div className="main_wrapper" style={{ minHeight: "auto" }}>
              <div className="Introduction p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Supplier Assesment List</h4>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="new_button_style mx-2"
                      onClick={handleShow1}
                    >
                      Assign Assessment
                    </button>
                    <button
                      className="new_button_style w-50"
                      onClick={handleShow}
                    >
                      New Supplier Assessment
                    </button>
                  </div>
                </div>
                <hr className="mt-2" style={{ color: "rgba(0, 0, 0, 0.27)" }} />
                <div>
                  <div className="table_f manage-detail admin-risk-table table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr className="heading_color">
                          <th style={{ width: 55 }}>ID</th>
                          <th scope="col">Assessment Name</th>
                          <th scope="col">Date</th>
                          <th style={{ width: 155 }} scope="col">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessmentList.map((assessment, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{assessment.title}</td>
                            <td>{assessment.year}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="none"
                                  onClick={(e) => {
                                    fetchSupplierAssessmentQuestions(
                                      e,
                                      index + 1,
                                      assessment.id
                                    );
                                  }}
                                  className="non_underline_link bold view_c viewAssess"
                                >
                                  <img
                                    src={View}
                                    alt=""
                                    srcSet=""
                                    title="View"
                                  />
                                </Button>
                                <Button
                                  onClick={(e) =>
                                    handleShow2(
                                      e,
                                      assessment.id,
                                      assessment.title
                                    )
                                  }
                                  variant="none"
                                  className="non_underline_link bold view_c editAssess"
                                >
                                  <img
                                    src={Duplicate}
                                    alt=""
                                    srcSet=""
                                    title="Duplicate"
                                  />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
                {show && (
                  <CreateAssessmentModal
                    show={show}
                    handleClose={handleClose}
                    assessmentTitle={assessmentTitle}
                    setAssessmentTitle={setAssessmentTitle}
                    handleCreateButtonClick={handleCreateButtonClick}
                    setFinancialYearId={setFinancialYearId}
                  />
                )}
                {show2 && (
                  <DuplicateAssessmentModal
                    show={show2}
                    handleClose2={handleClose2}
                    duplicateAssessmentTitle={duplicateAssessmentTitle}
                    createDuplicateAssessment={createDuplicateAssessment}
                    setFinancialYearId={setFinancialYearId}
                    duplicateAssessmentId={duplicateAssessmentId}
                  />
                )}
                {show1 && (
                  <AssignAssessmentModal
                    show={show1}
                    handleClose1={handleClose1}
                    assessmentList={assessmentList}
                    assignAssessment={assignAssessment}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
