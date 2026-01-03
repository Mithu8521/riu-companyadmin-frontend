import { useLocation, useHistory } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import { NavLink } from "react-router-dom";
import config from "../../../../config/config.json";
import {
  Form,
  Accordion,
  InputGroup,
  Button,
  Modal,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../../header/header";
import "../../../sidebar/common.css";
import { useEffect, useState } from "react";
import { apiCall } from "../../../../_services/apiCall";
import TebularInputCard from "../../Component/Sector Questions/TebularInputCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import TebularInputCardAnswer from "../../Component/Sector Questions/TabularInputCardAnswer";
import view from '../../../../img/eye-icon.png'
import "bootstrap/dist/css/bootstrap.min.css";
export const AuditHistoryListingQuestions = (props) => {
  if (!props.location.state) {
    props.history.push("/audit_history_listing");
  }
  const [auditData, setAuditData] = useState([]);
  const history = useHistory();
  const [Data, setData] = useState("");
  const [show, setShow] = useState(false);
  const [historyModalShow, setHistoryModalShow] = useState(false);
  const [outcomeData, setOutcomeData] = useState("");
  const [remarkData, setRemarkData] = useState("");
  const [questionDetails, setquestionDetails] = useState("");
  const [historyData, setHistoryData] = useState("");
  const authValue = JSON.parse(localStorage.getItem("currentUser"));
  const [user_Is_head, setCopmanyIShead] = useState(authValue?.is_head);
  const location = useLocation();
  const handleClose = () => setHistoryModalShow(false);
  const getAuditHistory = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}auditHistory`,
      {},
      {
        questionnaire_type: "SQ",
        financial_year_id: props?.location?.state?.financialYearId,
        framework_id: props?.location?.state?.framework_id,
      },
      "GET"
    );

    if (isSuccess) {
      setAuditData(data?.data?.questionData[location.state.framework_id]);
    }
  };
  const saveSubmission = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}saveSubmission`,
      {},
      {
        questionnaire_type: "SQ",
        financial_year_id: location.state.financialYearId,
        framework_id: location.state.framework_id,
        outcome: outcomeData,
        remark: remarkData,
      },
      "POST"
    );
    if (isSuccess) {
      history.push("/audit_history_listing");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const historyModal = async (id, qId) => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}auditQuestionHistory`,
      {},
      {
        questionnaire_type: "SQ",
        financial_year_id: location.state.financialYearId,
        question_id: qId?.question_id,
      }
    );
    if (isSuccess) {
      setquestionDetails(qId?.question_detail);
      setHistoryData(data?.data);
    }
    setHistoryModalShow(true);
  };
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  // const handleDateChange = (value) => {
  //   setData(value);
  // };
  useEffect(() => {
    if (props.location.state) {
      getAuditHistory();
    }
  }, []);
  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  return (
    <>
      <Sidebar dataFromParent={props.location.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="Introduction framwork_2">
                      <div className="col-md-12">
                        <div className="heading">
                          <h4 className="Environmental_text">Audit History</h4>
                        </div>
                        <hr></hr>
                        <div className="col-md-12">
                          {auditData?.length > 0 ? (
                            <>
                              <Accordion>
                                {auditData?.map((item, index) => {
                                  let AccordionItemComponent;
                                  if (item.questionType === "qualitative") {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                              {" "}
                                              {index +
                                                1 +
                                                ". " +
                                                item.title}{" "}
                                            </div>
                                          </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          <Row className="align-items-end mb-4">
                                            <Col md="12">
                                              <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div>
                                                  {" "}
                                                  {item?.answered_by_email && (
                                                    <div>
                                                      {" "}
                                                      ANS By :-{" "}
                                                      {
                                                        item?.answered_by_email
                                                      }{" "}
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="new_button_style">
                                                  <a
                                                    onClick={(e) =>
                                                      historyModal(e, item)
                                                    }
                                                  >
                                                    View History
                                                  </a>
                                                </div>
                                              </div>
                                              <textarea
                                                type="text"
                                                className="form-control form_height m-0"
                                                placeholder="answer"
                                                value={item.answer}
                                                readOnly
                                              ></textarea>
                                            </Col>
                                          </Row>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  } else if (item.questionType === "yes_no") {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          {index + 1 + ". " + item.title}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          <div className="d-flex align-items-center justify-content-between">
                                            {item?.answered_by_email && (
                                              <div className="responce_side_cass">
                                                {" "}
                                                ANS By :-{" "}
                                                {item?.answered_by_email}{" "}
                                              </div>
                                            )}
                                            <div className="responce_side_cass">
                                              <a
                                                onClick={(e) =>
                                                  historyModal(e, item)
                                                }
                                              >
                                                <img style={{ width: '20px' }} src={view} alt="" srcSet="" /> <span style={{ color: "#333" }}>History</span>
                                              </a>
                                            </div>
                                          </div>
                                          <Row style={{ alignItems: "center" }}>
                                            <Col md="12">
                                              <Form>
                                                {["radio"].map((type) => (
                                                  <div
                                                    key={`inline-${type}`}
                                                    className="mb-3"
                                                  >
                                                    <Form.Check
                                                      inline
                                                      label="Yes"
                                                      name="group1"
                                                      checked={
                                                        item.answer === "yes"
                                                      }
                                                      className="mb-3"
                                                      type={type}
                                                      id={`inline-${type}-1`}
                                                    />
                                                    <br></br>
                                                    <Form.Check
                                                      inline
                                                      label="No"
                                                      checked={
                                                        item.answer === "no"
                                                      }
                                                      name="group1"
                                                      type={type}
                                                      id={`inline-${type}-2`}
                                                    />
                                                  </div>
                                                ))}
                                              </Form>
                                            </Col>
                                          </Row>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  } else if (
                                    item.questionType === "quantitative_trends"
                                  ) {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          {index + 1 + ". " + item.title}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                              {" "}
                                              {item?.answered_by_email && (
                                                <div>
                                                  {" "}
                                                  ANS By :-{" "}
                                                  {item?.answered_by_email}{" "}
                                                </div>
                                              )}
                                            </div>
                                            <div className="responce_side_cass">
                                              <a
                                                onClick={(e) =>
                                                  historyModal(e, item)
                                                }
                                              >
                                                <img style={{ width: '20px' }} src={view} alt="" srcSet="" /> <span style={{ color: "#333" }}>History</span>
                                              </a>
                                            </div>
                                          </div>
                                          <Row>
                                            {(item?.answer).map((ans, key) => (
                                              <Col key={key} lg={6}>
                                                <div
                                                  className="Quantative_Sector_one"
                                                  key={key}
                                                >
                                                  <Col md={6}>
                                                    <div
                                                      className="d-flex justify-content-between align-items-center"
                                                      style={{ gap: "5px" }}
                                                    >
                                                      <p className="Quantative_Title m-0">
                                                        {" "}
                                                        From{" "}
                                                      </p>
                                                      <div className="d-flex ml-3">
                                                        <DatePicker
                                                          selected={
                                                            ans.from_date
                                                              ? new Date(
                                                                ans.from_date
                                                              )
                                                              : null
                                                          }
                                                          showMonthYearPicker
                                                          dateFormat="MM/yyyy"
                                                          className="form-control date-picker-input"
                                                          readOnly
                                                        />
                                                      </div>

                                                      <div className="Quantative_Title">
                                                        {" "}
                                                        to{" "}
                                                      </div>
                                                      <div>
                                                        <DatePicker
                                                          selected={
                                                            ans.to_date
                                                              ? new Date(
                                                                ans.to_date
                                                              )
                                                              : null
                                                          }
                                                          showMonthYearPicker
                                                          dateFormat="MM/yyyy"
                                                          className="form-control date-picker-input"
                                                          readOnly
                                                        />
                                                      </div>
                                                    </div>
                                                  </Col>
                                                  <hr></hr>
                                                  <p className="energy">
                                                    Source
                                                  </p>

                                                  <Form.Control
                                                    type="text"
                                                    readOnly
                                                    value={ans.source}
                                                    className="mb-3"
                                                  />
                                                  <p className="energy">
                                                    Process
                                                  </p>

                                                  <Form.Control
                                                    type="text"
                                                    readOnly
                                                    value={ans.process}
                                                    className="mb-3"
                                                  />
                                                  <p className="energy">
                                                    Reading value
                                                  </p>
                                                  <InputGroup className="mb-3">
                                                    <Form.Control
                                                      type="number"
                                                      style={{
                                                        width: "70%",
                                                      }}
                                                      value={ans.reading_value}
                                                      aria-label="first_input"
                                                    />
                                                    <select
                                                      name="tab_name"
                                                      id=""
                                                      className="select_one industrylist"
                                                      value={ans.reading_value}
                                                      style={{
                                                        width: "30%",
                                                      }}
                                                    >
                                                      <option
                                                        hidden
                                                        disabled
                                                        defaultValue=""
                                                      >
                                                        Select Value
                                                      </option>
                                                      {item.question_detail?.map(
                                                        (ques, key) => (
                                                          <option
                                                            key={key}
                                                            value={ques.option}
                                                          >
                                                            {ques.option}
                                                          </option>
                                                        )
                                                      )}
                                                      {/* Add other options here */}
                                                    </select>
                                                  </InputGroup>
                                                  <p className="energy">Note</p>
                                                  <Form.Control
                                                    className="mb-3"
                                                    as="textarea"
                                                    placeholder="Leave a Note here"
                                                    value={ans.note}
                                                    style={{
                                                      height: "100px",
                                                    }}
                                                  />
                                                </div>
                                              </Col>
                                            ))}
                                          </Row>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  } else if (
                                    item?.questionType === "tabular_question"
                                  ) {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          {index + 1 + ". " + item.title}
                                        </Accordion.Header>

                                        <Accordion.Body>
                                          <div className="d-flex align-items-center justify-content-end mb-3">
                                            {item?.answered_by_email && (
                                              <div className="responce_side_cass">
                                                {" "}
                                                ANS By :-{" "}
                                                {item?.answered_by_email}{" "}
                                              </div>
                                            )}
                                            <div className="responce_side_cass">
                                              <a
                                                onClick={(e) =>
                                                  historyModal(e, item)
                                                }
                                              >
                                                <img style={{ width: '20px' }} src={view} alt="" srcSet="" /> <span style={{ color: "#333" }}>History</span>
                                              </a>
                                            </div>
                                          </div>
                                          <Row style={{ alignItems: "center" }}>
                                            {user_Is_head == 1 ? (
                                              <TebularInputCardAnswer
                                                item={item}
                                                combinedAnswers={
                                                  item?.combined_answers
                                                }
                                                userIsHead={1}
                                                userIsHistory={1}
                                              />
                                            ) : (
                                              <TebularInputCard
                                                item={item}
                                                value={item.answer}
                                              />
                                            )}

                                            {/* <Col md="2">
                                          <div className="attachment_with_icons">
                                            <span>
                                              <div className="file file--upload">
                                                <label htmlFor="input-file">
                                                  <svg
                                                    width="34"
                                                    height="34"
                                                    viewBox="0 0 34 34"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <path
                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                      fill="#A7ACC8"
                                                    ></path>
                                                    <path
                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                      fill="#A7ACC8"
                                                      stroke="#A7ACC8"
                                                      strokeWidth="0.5"
                                                    ></path>
                                                  </svg>
                                                </label>
                                                <input
                                                  id="input-file"
                                                  type="file"
                                                  style={{ display: "none" }}
                                                />
                                              </div>
                                            </span>
                                          </div>
                                          <span
                                            className="Font_flex_var m-0"
                                            style={{ fontSize: "9px" }}
                                          >
                                            Upload Attatchment
                                          </span>
                                        </Col> */}
                                            {/* <Col md="2">
                                              <div className="view_history_btn">
                                                <a
                                                  onClick={(e) =>
                                                    historyModal(e, item)
                                                  }
                                                >
                                                  View History
                                                </a>
                                              </div>
                                            </Col> */}
                                          </Row>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  } else if (
                                    item.questionType === "quantitative"
                                  ) {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          {index + 1 + ". " + item.title}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          {item?.answered_by_email && (
                                            <div className="responce_side_cass">
                                              {" "}
                                              ANS By :-{" "}
                                              {item?.answered_by_email}{" "}
                                            </div>
                                          )}
                                          <Row style={{ alignItems: "center" }}>
                                            <Col md="2">
                                              <input
                                                className="form-control mb-3"
                                                name="answers"
                                                type="number"
                                                value={item.answer}
                                              ></input>
                                            </Col>
                                            <Col md="2">
                                              <div className="responce_side_cass">
                                                <a
                                                  onClick={(e) =>
                                                    historyModal(e, item)
                                                  }
                                                >
                                                  <img style={{ width: '20px' }} src={view} alt="" srcSet="" /> <span style={{ color: "#333" }}>History</span>
                                                </a>
                                              </div>
                                            </Col>
                                          </Row>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  }
                                  return AccordionItemComponent;
                                })}
                              </Accordion>
                            </>
                          ) : (
                            "No Question Available in History"
                          )}
                        </div>
                        {!location?.state?.outcome && auditData?.length > 0 ? (
                          <button
                            className="new_button_style mt-5"
                            onClick={handleShow1}
                          >
                            {" "}
                            Confirm Audit{" "}
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <Modal show={historyModalShow} onHide={handleClose} size="lg">
          <Modal.Header
            closeButton
            className="history-style"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <Modal.Title> History</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="historybody-style"
            style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
          >
            {historyData &&
              historyData.map((historyItem, key) => (
                <>
                  {historyItem?.questionType === "quantitative" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        {historyItem?.email && (
                          <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                        )}
                        {historyItem?.answered_at && (
                          <div className="responce_side_cass">
                            Answered At :-{" "}
                            {new Date(
                              historyItem?.answered_at
                            ).toLocaleString()}
                          </div>
                        )}
                        {historyItem?.remark && (
                          <div className="responce_side_cass">Auditor Remark :- {historyItem?.remark}</div>
                        )}
                      </div>
                      <Row>
                        <Col md="2">
                          <input
                            className="form-control mb-3"
                            name="answers"
                            type="number"
                            value={historyItem?.answer}
                          />
                        </Col>
                      </Row>

                      {historyItem?.history &&
                        historyItem?.history.map((historyItemData, key) => (
                          <>
                            <div className="d-flex justify-content-between align-items-center">
                              {historyItem?.email && (
                                <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                              )}
                              {historyItemData?.answered_at && (
                                <div className="responce_side_cass">
                                  Answered At :-{" "}
                                  {new Date(
                                    historyItemData?.answered_at
                                  ).toLocaleString()}
                                </div>
                              )}
                              {historyItemData?.remark && (
                                <div className="responce_side_cass">
                                  Auditor Remark :- {historyItemData?.remark}
                                </div>
                              )}
                            </div>
                            <Row>
                              <Col md="2">
                                <input
                                  className="form-control mb-3"
                                  name="answers"
                                  type="number"
                                  value={historyItemData.answer}
                                />
                              </Col>
                            </Row>
                          </>
                        ))}
                    </>
                  )}
                  {historyItem?.questionType === "qualitative" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        {historyItem?.email && (
                          <div className="responce_side_cass">ANS By : {historyItem?.email}</div>
                        )}
                        {historyItem?.answered_at && (
                          <div className="responce_side_cass">
                            Answered At :{" "}
                            {new Date(
                              historyItem?.answered_at
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                      {historyItem?.remark && (
                        <div className="responce_side_cass">Auditor Remark : {historyItem?.remark}</div>
                      )}
                      <Row>
                        <Col md="12">
                          <textarea
                            type="text"
                            className="form-control form_height"
                            placeholder="answer"
                            value={historyItem?.answer}
                            readOnly
                          ></textarea>
                        </Col>
                      </Row>

                      {historyItem?.history &&
                        historyItem?.history.map((historyItemData, key) => (
                          <>
                            <div className="d-flex">
                              {historyItem?.email && (
                                <div className="responce_side_cass">ANS By : {historyItem?.email}</div>
                              )}
                              {historyItemData?.answered_at && (
                                <div className="responce_side_cass ms-auto">
                                  Answered At :{" "}
                                  {new Date(
                                    historyItemData?.answered_at
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                            {historyItemData?.remark && (
                              <div className="responce_side_cass">
                                Auditor Remark : {historyItemData?.remark}
                              </div>
                            )}
                            <Row>
                              <Col md="12">
                                <textarea
                                  type="text"
                                  className="form-control form_height"
                                  placeholder="answer"
                                  value={historyItemData?.answer}
                                  readOnly
                                ></textarea>
                              </Col>
                            </Row>
                          </>
                        ))}
                    </>
                  )}
                  {historyItem?.questionType === "yes_no" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        {historyItem?.email && (
                          <div className="responce_side_cass">ANS By : {historyItem?.email}</div>
                        )}
                        {historyItem?.answered_at && (
                          <div className="responce_side_cass">
                            Answered At :{" "}
                            {new Date(
                              historyItem?.answered_at
                            ).toLocaleString()}
                          </div>
                        )}
                        {historyItem?.remark && (
                          <div className="responce_side_cass">Auditor Remark : {historyItem?.remark}</div>
                        )}
                      </div>
                      <Row className="justify-content-between d-flex align-items-center">
                        <Col md="10">
                          <Form>
                            {["radio"].map((type) => (
                              <div key={`inline-${type}`} className="mb-3">
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="group1"
                                  checked={historyItem?.answer === "yes"}
                                  type={type}
                                  id={`inline-${type}-1`}
                                /><br></br>
                                <Form.Check
                                  inline
                                  label="No"
                                  checked={historyItem?.answer === "no"}
                                  name="group1"
                                  type={type}
                                  id={`inline-${type}-2`}
                                />
                              </div>
                            ))}
                          </Form>
                        </Col>
                      </Row>

                      {historyItem?.history &&
                        historyItem?.history.map((historyItemData, key) => (
                          <>
                            <div className="d-flex justify-content-between align-items-center">
                              {historyItem?.email && (
                                <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                              )}
                              {historyItemData?.answered_at && (
                                <div className="responce_side_cass">
                                  Answered At :-{" "}
                                  {new Date(
                                    historyItemData?.answered_at
                                  ).toLocaleString()}
                                </div>
                              )}
                              {historyItemData?.remark && (
                                <div className="responce_side_cass">
                                  Auditor Remark :- {historyItemData?.remark}
                                </div>
                              )}
                            </div>
                            <Row className="justify-content-between d-flex align-items-center">
                              <Col md="10">
                                <Form>
                                  {["radio"].map((type) => (
                                    <div
                                      key={`inline-${type}`}
                                      className="mb-3"
                                    >
                                      <Form.Check
                                        inline
                                        label="Yes"
                                        name="group1"
                                        checked={
                                          historyItemData?.answer === "yes"
                                        }
                                        type={type}
                                        id={`inline-${type}-1`}
                                      />
                                      <br></br>
                                      <Form.Check
                                        inline
                                        label="No"
                                        checked={
                                          historyItemData?.answer === "no"
                                        }
                                        name="group1"
                                        type={type}
                                        id={`inline-${type}-2`}
                                      />
                                    </div>
                                  ))}
                                </Form>
                              </Col>
                            </Row>
                          </>
                        ))}
                    </>
                  )}
                  {historyItem.questionType === "quantitative_trends" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        {historyItem?.email && (
                          <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                        )}
                        {historyItem?.answered_at && (
                          <div className="responce_side_cass">
                            Answered At :-{" "}
                            {new Date(
                              historyItem?.answered_at
                            ).toLocaleString()}
                          </div>
                        )}
                        {historyItem?.remark && (
                          <div className="responce_side_cass">Auditor Remark :- {historyItem?.remark}</div>
                        )}
                      </div>

                      <Row>
                        {(historyItem?.answer).map((ans, key) => (
                          <Col key={key} lg={6}>
                            <div className="Quantative_Sector_one" key={key}>
                              <div
                                className="d-flex"
                                style={{
                                  justifyContent: "space-between",
                                }}
                              >
                                <p className="Quantative_Title">From</p>
                                <div className="d-flex ml-3">
                                  <div className="d-flex">
                                    <DatePicker
                                      selected={
                                        ans.from_date
                                          ? new Date(ans.from_date)
                                          : null
                                      }
                                      showMonthYearPicker
                                      dateFormat="MM/yyyy"
                                      className="form-control date-picker-input"
                                      readOnly
                                    />
                                    <div className="px-2">to</div>
                                  </div>
                                  <div
                                    className="flex-item"
                                    style={{
                                      flex: "1",
                                    }}
                                  >
                                    <DatePicker
                                      selected={
                                        ans.to_date
                                          ? new Date(ans.to_date)
                                          : null
                                      }
                                      showMonthYearPicker
                                      dateFormat="MM/yyyy"
                                      className="form-control date-picker-input"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                              <hr></hr>
                              <p className="energy">Source</p>

                              <Form.Control
                                type="text"
                                readOnly
                                value={ans.source}
                                className="mb-3"
                              />
                              <p className="energy">Process</p>

                              <Form.Control
                                type="text"
                                readOnly
                                value={ans.process}
                                className="mb-3"
                              />
                              <p className="energy">Reading value</p>
                              <InputGroup className="mb-3">
                                <Form.Control
                                  type="number"
                                  style={{
                                    width: "70%",
                                  }}
                                  value={ans.reading_value}
                                  aria-label="first_input"
                                  readOnly
                                />
                              </InputGroup>
                              <p className="energy">Note</p>
                              <Form.Control
                                className="mb-3"
                                as="textarea"
                                placeholder="Leave a Note here"
                                value={ans.note}
                                style={{
                                  height: "100px",
                                }}
                                readOnly
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>

                      {historyItem?.history &&
                        historyItem?.history.map((historyItemData, key) => (
                          <>
                            <div className="d-flex">
                              {historyItem?.email && (
                                <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                              )}
                              {historyItemData?.answered_at && (
                                <div className="responce_side_cass ms-auto">
                                  Answered At :-{" "}
                                  {new Date(
                                    historyItemData?.answered_at
                                  ).toLocaleString()}
                                </div>
                              )}
                              {historyItemData?.remark && (
                                <div className="responce_side_cass">
                                  Auditor Remark :- {historyItemData?.remark}
                                </div>
                              )}
                            </div>
                            <Row>
                              {(historyItemData?.answer).map((ans, key) => (
                                <Col key={key} lg={6}>
                                  <div
                                    className="Quantative_Sector_one"
                                    key={key}
                                  >
                                    <div className="d-flex justify-content-between">
                                      <p className="Quantative_Title">From</p>
                                      <div className="d-flex ml-3">
                                        <div className="d-flex">
                                          <DatePicker
                                            selected={
                                              ans.from_date
                                                ? new Date(ans.from_date)
                                                : null
                                            }
                                            showMonthYearPicker
                                            dateFormat="MM/yyyy"
                                            className="form-control date-picker-input"
                                            readOnly
                                          />
                                          <div className="px-2">to</div>
                                        </div>
                                        <div
                                          className="flex-item"
                                          style={{
                                            flex: "1",
                                          }}
                                        >
                                          <DatePicker
                                            selected={
                                              ans.to_date
                                                ? new Date(ans.to_date)
                                                : null
                                            }
                                            showMonthYearPicker
                                            dateFormat="MM/yyyy"
                                            className="form-control date-picker-input"
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <hr></hr>
                                    <p className="energy">Source</p>

                                    <Form.Control
                                      type="text"
                                      readOnly
                                      value={ans.source}
                                      className="mb-3"
                                    />
                                    <p className="energy">Process</p>

                                    <Form.Control
                                      type="text"
                                      readOnly
                                      value={ans.process}
                                      className="mb-3"
                                    />
                                    <p className="energy">Reading value</p>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        type="number"
                                        style={{
                                          width: "70%",
                                        }}
                                        value={ans.reading_value}
                                        aria-label="first_input"
                                        readOnly
                                      />
                                    </InputGroup>
                                    <p className="energy">Note</p>
                                    <Form.Control
                                      className="mb-3"
                                      as="textarea"
                                      placeholder="Leave a Note here"
                                      value={ans.note}
                                      style={{
                                        height: "100px",
                                      }}
                                      readOnly
                                    />
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </>
                        ))}
                    </>
                  )}
                  {historyItem.questionType === "tabular_question" && (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        {historyItem?.email && (
                          <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                        )}
                        {historyItem?.answered_at && (
                          <div className="responce_side_cass">
                            Answered At :-{" "}
                            {new Date(
                              historyItem?.answered_at
                            ).toLocaleString()}
                          </div>
                        )}
                        {historyItem?.remark && (
                          <div className="responce_side_cass">Auditor Remark :- {historyItem?.remark}</div>
                        )}
                      </div>
                      <Row className="justify-content-center d-flex align-items-center">
                        <TebularInputCard
                          item={{
                            ...historyItem,
                            question_detail: questionDetails,
                          }}
                          value={historyItem.answer}
                        />
                      </Row>

                      <div className="row">
                        <div className="col-6"></div>
                        <div className="col-6"></div>

                        <div className="col-6"></div>
                        <div className="col-6"></div>

                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col"></div>
                      </div>

                      {historyItem?.history &&
                        historyItem?.history.map((historyItemData, key) => (
                          <>
                            <div className="d-flex justify-content-between align-items-center">
                              {historyItem?.email && (
                                <div className="responce_side_cass">ANS By :- {historyItem?.email}</div>
                              )}
                              {historyItemData?.answered_at && (
                                <div className="responce_side_cass">
                                  Answered At :-{" "}
                                  {new Date(
                                    historyItemData?.answered_at
                                  ).toLocaleString()}
                                </div>
                              )}
                              {historyItemData?.remark && (
                                <div className="responce_side_cass">
                                  Auditor Remark :- {historyItemData?.remark}
                                </div>
                              )}
                            </div>
                            <Row className="justify-content-center d-flex align-items-center">
                              <TebularInputCard
                                item={{
                                  ...historyItemData,
                                  question_detail: questionDetails,
                                }}
                                value={historyItemData?.answer}
                              />
                            </Row>
                          </>
                        ))}
                    </>
                  )}
                </>
              ))}
          </Modal.Body>
        </Modal>
        <Modal show={show1} onHide={handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Audit Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label for="message-text">Please submit your outcome here </label>
            <Form.Control
              as="textarea"
              style={{ height: "50px" }}
              id="message-text"
              onChange={(e) => {
                setOutcomeData(e.target.value);
              }}
            />
            <br />
            <label for="message-text">Please submit your Remark here </label>
            <Form.Control
              as="textarea"
              style={{ height: "50px" }}
              id="message-text"
              onChange={(e) => {
                setRemarkData(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="new-button-style"
              disabled={!outcomeData && !remarkData}
              onClick={() => {
                saveSubmission();
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        {/* <Modal
          show={show}
          animation={true}
          className="modal_box"
          shadow-lg="border"
          centered
        >
          <Modal.Header className="pb-0">
            <Button variant="outline-dark" onClick={() => setShow(false)}>
              <i className="fa fa-times"></i>
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="form-group audit-re">
                <label for="message-text" className="col-form-label">
                  Please submit your outcome here
                </label>
                <input
                  onChange={(e) => {
                    setOutcomeData(e.target.value);
                  }}
                  style={{ minHeight: "50px" }}
                  className="form-control"
                  id="message-text"
                ></input>
              </div>
              <div className="form-group audit-re">
                <label for="message-text" className="col-form-label">
                  Please submit your Remark here
                </label>
                <input
                  onChange={(e) => {
                    setRemarkData(e.target.value);
                  }}
                  style={{ minHeight: "50px" }}
                  className="form-control"
                  id="message-text"
                ></input>
              </div>
              <div className="col-md-12">
                <div className="response">
                  <div className="save_global global_link">
                    <button
                      className="page_save page_width mx-3"
                      variant="none"
                      disabled={!outcomeData && !remarkData} onClick={() => { saveSubmission(); }}
                    >
                      {" "}
                      Confirm{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <div className="modal-body vekp pt-0"></div>
        </Modal> */}
      </div>
      {/* <Modal
        show={show}
        animation={true}
        size="md"
        className="modal_box"
        shadow-lg="border"
      >
        <div className="modal-lg">
          <Modal.Header className="pb-0">
            <Button variant="outline-dark" onClick={() => setShow(false)}>
              <i className="fa fa-times"></i>
            </Button>
          </Modal.Header>
          <div className="modal-body vekp pt-0">
            <div className="row">
              <div className="col-md-12">
                <div className="response">
                  <h4>Add Remarks</h4>
                  <div className="form-group audit-re">
                    <label for="message-text" className="col-form-label">
                      Please submit your outcome here
                    </label>
                    <textarea className="form-control" id="message-text"></textarea>
                  </div>
                  <div className="form-group audit-re">
                    <label for="message-text" className="col-form-label">
                      Please submit your remarks here
                    </label>
                    <textarea className="form-control" id="message-text"></textarea>
                  </div>
                  <div className="global_link">
                    <NavLink
                      className="page_save page_width"
                      to={"audit_history_listing"}
                    >
                      {" "}
                      Submit{" "}
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal> */}
    </>
  );
};
