import React, { useState, useEffect } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { Link, useLocation } from "react-router-dom";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import AddQuestionAssessment from "./addQuestionAssessment";
import QuestionTypeTabSection from "../../Component/Sector Questions/QuestionTypeTabSection";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";

const AssessmentDetail = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [assessmentQuestion, setAssessmentQuestion] = useState("");

  const handleClose = () => setShow(false);
  const handleClose1 = () => setShow1(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);

  useEffect(() => {
    fetchSupplierAssessmentQuestion();
  }, []);

  const fetchSupplierAssessmentQuestion = async () => {
    let paramValue;
    const url = window.location.href;
    const regex = /\/assessement_detail\/(\d+)/;
    const match = url.match(regex);

    console.log(match[1], "nj");
    if (match && match[1]) {
      paramValue = match[1];
    }
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const assessment_id = queryParams.get('id');

    const { isSuccess, data } = await apiCall(
      `${config.API_URL}fetchSupplierAssessmentQuestions`,
      {},
      { assessment_id: paramValue },
      "GET"
    );
    if (isSuccess) {
      const responseData = data.data;
      setAssessmentQuestion(responseData);
      console.log(data.data);
    }
  };

  return (
    <>
      <Sidebar dataFromParent={location?.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <section className="d_text">
            <div className="container-fluid">
              <form name="form">
                {/* <div className="select-reporting-criteria">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="Reporting_heading">
                      <h1> Please Select Financial Year </h1>
                    </div>
                    <div className="d-flex dropdown align-items-center">
                      <p className="m-0"> Financial Year : </p>
                      <select className="select_one_all">
                        <option value="1">2022</option>
                        <option value="1">2023</option>
                      </select>
                    </div>
                  </div>
                </div> */}
              </form>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <span>Loading Questionnaire</span>
                  <Spinner
                    style={{ marginLeft: "13px" }}
                    animation="border"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <Row>
                    <Col md={12}>
                      <div className="select-reporting-criteria">
                        <div className="question_section">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="Reporting_heading">
                              <h1>Assessment Questions </h1>
                            </div>
                            <div className="d-flex">
                              <Link
                                className="new_button_style mx-2 text-center"
                                style={{ color: '#fff' }}
                                to={"/supplier_assessment/import_question"}
                              >
                                Get Question
                              </Link>
                              <button
                                className="new_button_style"
                                onClick={handleShow1}
                              >
                                Add Question
                              </button>
                            </div>
                          </div>
                          <hr
                            className="mt-0"
                            style={{ color: "#00000045" }}
                          ></hr>
                          <QuestionTypeTabSection />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </section>
          <Modal show={show1} onHide={handleClose1} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Add Question Assessment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddQuestionAssessment />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default AssessmentDetail;
