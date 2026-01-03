import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../Pages/management/management.css";
import NumericInput from "react-numeric-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  Accordion,
  InputGroup,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import "../../../sidebar/common.css";
import "./audit_section.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import TebularInputCard from "../../Component/Sector Questions/TebularInputCard";

const MySwal = withReactContent(Swal);
export default class AuditSubAdmin extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const item = location?.state?.item;

    this.state = {
      selectedUser: props.location,
      show: false,
      showImageModal: false,
      imageUrl: "",
      close: false,
      remarks: "",
      item: item,
      sectorQA: [],
    };
  }

  formatDate(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getSectorQuestionAnswer = async () => {
    const item = this.state.item;
    if (!item) {
      this.props.history.push("/audit_question_listing");
    }

    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getQuestionAnswerForAuditListing`,
      {},
      {
        financial_year_id: item?.financial_year_id,
        user_id: item?.user_id,
        questionnaire_type: "SQ",
        company_id: item?.company_id,
        answer_at: item?.date,
      },
      "GET"
    );
    if (isSuccess) {
      this.setState({ sectorQA: data.data });
    }
  };
  doAudit = async (item, status) => {
    const items = this.state.item;
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}doAudit`,
      {},
      {
        user_id: items?.user_id,
        company_id: this.state.item.company_id,
        financial_year_id: this.state.item.financial_year_id,
        question_id: item.id,
        questionType: item.questionType,
        status: status,
        remark: this.state.remarks,
      },
      "POST"
    );
    if (isSuccess) {
      this.getSectorQuestionAnswer();
      this.setState({ remarks: "" });
    }
  };
  acceptPopup = (item) => {
    const { remarks } = this.state;
    MySwal.fire({
      showConfirmButton: false,
      // icon: "info",
      title: (
        <div className="remarks__popup__wrapper">
          <h1>Add Remarks</h1>
          <textarea
            placeholder="Please enter remarks"
            defaultValue={this.state.remarks}
            onChange={this.handleRemarksChange}
            rows={4}
          ></textarea>
          <div className="text-end">
            <button className="new_button_style" style={{ width: '90px' }} onClick={() => this.doAudit(item, "ACCEPTED")}>submit</button>
          </div>
        </div>
      ),
    });
  };
  handleRemarksChange = (event) => {
    this.setState({ remarks: event.target.value });
  };
  rejectQuestion = (item) => {
    MySwal.fire({
      showConfirmButton: false,

      // icon: "error",
      title: (
        <div className="remarks__popup__wrapper">
          <h1>Reject Remarks</h1>
          <textarea
            defaultValue={this.state.remarks}
            onChange={this.handleRemarksChange}
            placeholder="Please enter remarks"
            rows={4}
          ></textarea>
          <div className="text-end">
            <button className="new_button_style" style={{ width: '90px' }} onClick={() => this.doAudit(item, "REJECTED")}>submit</button>
          </div>
        </div>
      ),
    });
  };

  componentWillMount = () => {
    this.getSectorQuestionAnswer();
  };
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} Defaults="0" />
        {/* <Loader /> */}
        <div className="main_wrapper">
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="question_type_filter">
                    <NavLink
                      to="/audit_question_listing"
                      className="selected_question_type"
                    >
                      Company
                    </NavLink>
                    {/*<NavLink to="/audit_supplier">Supplier</NavLink>*/}
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <div className="col-md-12">
                          <div className="Environmental audit_enviornmental">
                            <h4 className="Environmental_text">
                              Question List
                            </h4>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12">
                          {this.state.sectorQA.length > 0 ? (
                            <>
                              {" "}
                              <Accordion>
                                {this.state.sectorQA?.map((item, index) => {
                                  let AccordionItemComponent;
                                  if (item.questionType === "qualitative") {
                                    AccordionItemComponent = (
                                      <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                      >
                                        <Accordion.Header>
                                          {index + 1 + ". " + item.title}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          <Row
                                            style={{
                                              alignItems: "center",
                                              position: "relative",
                                            }}
                                          >
                                            <Col md="10">
                                              <textarea
                                                type="text"
                                                className="form-control form_height"
                                                placeholder="answer"
                                                value={item.answer}
                                                readOnly
                                              ></textarea>
                                            </Col>
                                            {item.proof_document &&
                                              item.proof_document.startsWith(
                                                "http"
                                              ) && (
                                                <Col md="2">
                                                  <div className="attachment_with_icons">
                                                    <span>
                                                      <button
                                                        style={{
                                                          border: "none",
                                                          background: "none",
                                                        }}
                                                        onClick={() => {
                                                          this.setState({
                                                            showImageModal: true,
                                                            imageUrl:
                                                              item.proof_document,
                                                          });
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          ></path>
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          ></path>
                                                        </svg>
                                                      </button>
                                                      <span
                                                        className="delete_attachment"
                                                        data-id="411"
                                                        aria-hidden="true"
                                                      >
                                                        {" "}
                                                        ×{" "}
                                                      </span>
                                                    </span>
                                                  </div>

                                                  <span
                                                    className="Font_flex_var m-0"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    Download Attatchment
                                                  </span>
                                                </Col>
                                              )}
                                          </Row>
                                          <div className="action__button__section">
                                            <Button
                                              onClick={() =>
                                                this.acceptPopup(item)
                                              }
                                              className="new_button_style"
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                this.rejectQuestion(item)
                                              }
                                              variant="danger"
                                            >
                                              Reject
                                            </Button>
                                            {/* <button>Add Remarks</button> */}
                                          </div>
                                          <div className="border-bottom mt-2" />
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
                                          <Row style={{ alignItems: "center" }}>
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
                                            {item.proof_document &&
                                              item.proof_document.startsWith(
                                                "http"
                                              ) && (
                                                <Col md="2">
                                                  <div className="attachment_with_icons">
                                                    <span>
                                                      <button
                                                        style={{
                                                          border: "none",
                                                          background: "none",
                                                        }}
                                                        onClick={() => {
                                                          this.setState({
                                                            showImageModal: true,
                                                            imageUrl:
                                                              item.proof_document,
                                                          });
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          ></path>
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          ></path>
                                                        </svg>
                                                      </button>
                                                      <span
                                                        className="delete_attachment"
                                                        data-id="411"
                                                        aria-hidden="true"
                                                      >
                                                        {" "}
                                                        ×{" "}
                                                      </span>
                                                    </span>
                                                  </div>

                                                  <span
                                                    className="Font_flex_var m-0"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    Download Attatchment
                                                  </span>
                                                </Col>
                                              )}
                                          </Row>
                                          <div className="action__button__section">
                                            <Button
                                              onClick={() =>
                                                this.acceptPopup(item)
                                              }
                                              className="new_button_style"
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                this.rejectQuestion(item)
                                              }
                                              variant="danger"
                                            >
                                              Reject
                                            </Button>
                                            {/* <button>Add Remarks</button> */}
                                          </div>
                                          <div className="border-bottom mt-2" />
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
                                          <Row>
                                            {item.answer.map((ans, key) => (
                                              <Col key={key} lg={4}>
                                                <div className="Quantative_Sector_one">
                                                  <div className="d-flex align-items-center justify-content-end" style={{ gap: '10px' }} >
                                                    <p className="Quantative_Title m-0"> From </p>
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
                                                    <p className="Quantative_Title m-0"> to </p>
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
                                                  <hr className="line" />
                                                  <p className="energy"> Source </p>
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
                                                      style={{ width: "70%" }}
                                                      value={ans.reading_value}
                                                      aria-label="first_input"
                                                    />
                                                    <select
                                                      name="tab_name"
                                                      id=""
                                                      className="select_one industrylist"
                                                      value={ans.reading_value}
                                                      style={{ width: "30%" }}
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
                                                    as="textarea"
                                                    placeholder="Leave a Note here"
                                                    value={ans.note}
                                                    style={{ height: "100px" }}
                                                  />
                                                </div>
                                                <div className="action__button__section">
                                                  <Button
                                                    onClick={() =>
                                                      this.acceptPopup(item)
                                                    }
                                                    className="new_button_style"
                                                  >
                                                    Accept
                                                  </Button>
                                                  <Button
                                                    onClick={() =>
                                                      this.rejectQuestion(item)
                                                    }
                                                    variant="danger"
                                                  >
                                                    Reject
                                                  </Button>
                                                  {/* <button>Add Remarks</button> */}
                                                </div>
                                              </Col>
                                            ))}
                                            {item.proof_document &&
                                              item.proof_document.startsWith(
                                                "http"
                                              ) && (
                                                <Col md="2">
                                                  <div className="attachment_with_icons">
                                                    <span>
                                                      <button
                                                        style={{
                                                          border: "none",
                                                          background: "none",
                                                        }}
                                                        onClick={() => {
                                                          this.setState({
                                                            showImageModal: true,
                                                            imageUrl:
                                                              item.proof_document,
                                                          });
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          ></path>
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          ></path>
                                                        </svg>
                                                      </button>
                                                      <span
                                                        className="delete_attachment"
                                                        data-id="411"
                                                        aria-hidden="true"
                                                      >
                                                        {" "}
                                                        ×{" "}
                                                      </span>
                                                    </span>
                                                  </div>

                                                  <span
                                                    className="Font_flex_var m-0"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    Download Attatchment
                                                  </span>
                                                </Col>
                                              )}
                                          </Row>

                                          {/* <div className="action__button__section">
                                            <Button
                                              onClick={() =>
                                                this.acceptPopup(item)
                                              }
                                              className="new_button_style"
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                this.rejectQuestion(item)
                                              }
                                              variant="danger"
                                            >
                                              Reject
                                            </Button>
                                           
                                          </div> */}
                                          <div className="border-bottom mt-2" />
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  } else if (
                                    item.questionType === "tabular_question"
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
                                          <Row style={{ alignItems: "center" }}>
                                            <TebularInputCard
                                              item={item}
                                              value={item.answer}
                                            />
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
                                          </Row>
                                          <div className="action__button__section">
                                            <Button
                                              onClick={() =>
                                                this.acceptPopup(item)
                                              }
                                              className="new_button_style"
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                this.rejectQuestion(item)
                                              }
                                              variant="danger"
                                            >
                                              Reject
                                            </Button>
                                            {/* <button>Add Remarks</button> */}
                                          </div>
                                          <div className="border-bottom mt-2" />
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
                                          <Row style={{ alignItems: "center" }}>
                                            <Col md="2">
                                              <input
                                                className="form-control mb-3"
                                                name="answers"
                                                type="number"
                                                value={item.answer}
                                              ></input>
                                            </Col>
                                            {item.proof_document &&
                                              item.proof_document.startsWith(
                                                "http"
                                              ) && (
                                                <Col md="2">
                                                  <div className="attachment_with_icons">
                                                    <span>
                                                      <button
                                                        style={{
                                                          border: "none",
                                                          background: "none",
                                                        }}
                                                        onClick={() => {
                                                          this.setState({
                                                            showImageModal: true,
                                                            imageUrl:
                                                              item.proof_document,
                                                          });
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          ></path>
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          ></path>
                                                        </svg>
                                                      </button>
                                                      <span
                                                        className="delete_attachment"
                                                        data-id="411"
                                                        aria-hidden="true"
                                                      >
                                                        {" "}
                                                        ×{" "}
                                                      </span>
                                                    </span>
                                                  </div>

                                                  <span
                                                    className="Font_flex_var m-0"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    Download Attatchment
                                                  </span>
                                                </Col>
                                              )}
                                          </Row>
                                          <div className="action__button__section">
                                            <Button
                                              onClick={() =>
                                                this.acceptPopup(item)
                                              }
                                              className="new_button_style"
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                this.rejectQuestion(item)
                                              }
                                              variant="danger"
                                            >
                                              Reject
                                            </Button>
                                            {/* <button>Add Remarks</button> */}
                                          </div>
                                          <div className="border-bottom mt-2" />
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    );
                                  }
                                  return AccordionItemComponent;
                                })}
                              </Accordion>
                            </>
                          ) : (
                            "No Question Available to Audit"
                          )}

                          {/* <Form>
                            <div className="heading_h3 mt-3">
                              <span className="gement">
                                Customer Privacy &amp; Technology Standards
                              </span>
                            </div>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q1. What is the company's strategy to secure customer's personal health information records and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                    <div className="toast-header border-none">
                                      <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                      </button>
                                    </div>
                                </span>
                              </div>
                            </Form.Group>
                          </Form> */}
                          {/*<div className="button_audit global_link">
                            <NavLink to="/admin" className="link_bal_next">Complete</NavLink>
                            <button className="page_save page_width mx-3" variant="none" onClick={() => this.setState({ show: true })} > Add Remark </button>
                        </div>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          show={this.state.show}
          animation={true}
          size="md"
          className="modal_box"
          shadow-lg="border"
        >
          <div className="modal-lg">
            <Modal.Header className="pb-0">
              <Button
                variant="outline-dark"
                onClick={() => this.setState({ show: false })}
              >
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
                      <textarea
                        className="form-control"
                        id="message-text"
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="form-group audit-re">
                      <label for="message-text" className="col-form-label">
                        Please submit your remarks here
                      </label>
                      <textarea
                        className="form-control"
                        id="message-text"
                      ></textarea>
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
        </Modal>

        <Modal show={this.state.showImageModal}>
          <div className="modal-lg">
            <Modal.Header className="pb-0">
              <Button
                variant="outline-dark"
                onClick={() => this.setState({ showImageModal: false })}
              >
                <i className="fa fa-times"></i>
              </Button>
            </Modal.Header>
            <div className="modal-body vekp pt-0">
              <img
                src={this.state.imageUrl}
                style={{ width: "100%", height: "auto" }}
              ></img>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
