import React, { useState } from "react";
// import { Image } from "react-bootstrap";
import Sidebar from "../../../../sidebar/sidebar";
import Header from "../../../../header/header";
import { Form, Accordion, InputGroup, Button, Modal, Row, Col } from 'react-bootstrap';
// import "../../Common.css";
import NumericInput from "react-numeric-input";
import QuestionTypeTabSection from "./QuestionTypeTabSection";
import "./SectorQuestion.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import './audit_section.css';
import { NavLink } from "react-router-dom";

const MySwal = withReactContent(Swal);

export default function AuditSubAdmin(props) {
  const [show, setShow] = useState(false);
  const acceptPopup = () => {
    MySwal.fire({
      icon: "info",
      title: "Add Remarks",
      title: (
        <div className="remarks__popup__wrapper">
          <h1>Add Remarks</h1>
          <textarea placeholder="Please enter remarks" rows={4}></textarea>
          <button className="new_button_style">submit</button>
        </div>
      ),
    });
  };
  const rejectQuestion = () => {
    MySwal.fire({
      icon: "error",
      title: "Add Remarks",
      title: (
        <div className="remarks__popup__wrapper">
          <h1>Reject Remarks</h1>
          <textarea placeholder="Please enter remarks" rows={4}></textarea>
          <button className="new_button_style">submit</button>
        </div>
      ),
    });
  };
  const [questionType, setQuestionType] = useState("All");
  return (
    <div>
      <Sidebar dataFromParent={props.location.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper pt-4">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="Introduction framwork_2">
                      <div className="col-md-12">
                        <div className="heading">
                          <h4 className="E_capital font-heading">
                            Sector Questions
                          </h4>
                        </div>
                        <hr></hr>
                        <div>
                          <QuestionTypeTabSection
                            questionType={questionType}
                            setQuestionType={setQuestionType}
                          />
                          <div className="form-group">
                            <Accordion defaultActiveKey={["0"]} alwaysOpen>
                              {/* for Qualititive */}
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                  1. What is Lorem Ipsum? <br></br>
                                  <span className="Font_flex_var">
                                    Assign to: Roop Chandra Syana
                                  </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div
                                    className="row "
                                    style={{
                                      alignItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="col-md-10">
                                      <textarea
                                        className="form-control mb-3"
                                        name="answers"
                                        required
                                        placeholder="Leave a Answer here"
                                      ></textarea>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="attachment_with_icons">
                                        <span>
                                          <div className="file file--upload">
                                            <label for="input-file">
                                              <svg
                                                width="34"
                                                height="34"
                                                viewBox="0 0 34 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ cursor: "pointer" }}
                                              >
                                                <path
                                                  d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                  fill="#A7ACC8"
                                                ></path>
                                                <path
                                                  d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                  fill="#A7ACC8"
                                                  stroke="#A7ACC8"
                                                  stroke-width="0.5"
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
                                    </div>
                                  </div>
                                  <div className="action__button__section">
                                    <Button onClick={acceptPopup} className="new_button_style">Accept</Button>
                                    <Button onClick={rejectQuestion} variant="danger">Reject</Button>
                                    {/* <button>Add Remarks</button> */}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>

                              {/* for Yes Or No */}
                              <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                  {" "}
                                  2. What is Lorem Ipsum? <br></br>
                                  <span className="Font_flex_var">
                                    Assign to: Roop Chandra
                                  </span>{" "}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div
                                    className="row "
                                    style={{
                                      alignItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="col-md-10">
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
                                              className="mb-3"
                                              type={type}
                                              id={`inline-${type}-1`}
                                            />
                                            <br></br>
                                            <Form.Check
                                              inline
                                              label="No"
                                              name="group1"
                                              type={type}
                                              id={`inline-${type}-2`}
                                            />
                                          </div>
                                        ))}
                                      </Form>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="attachment_with_icons">
                                        <span>
                                          <a
                                            href="null"
                                            target="_blank"
                                            download=""
                                            style={{
                                              color: "green",
                                              cursor: "pointer",
                                              position: "relative",
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
                                                stroke-width="0.5"
                                              ></path>
                                            </svg>
                                          </a>
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
                                        DownLoad Attatchment
                                      </span>
                                    </div>
                                  </div>
                                  <div className="action__button__section">
                                    <Button onClick={acceptPopup} className="new_button_style">Accept</Button>
                                    <Button onClick={rejectQuestion} variant="danger">Reject</Button>
                                    {/* <button>Add Remarks</button> */}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>

                              {/* For Quantitative Trands */}
                              <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                  {" "}
                                  3. What is Lorem Ipsum? <br></br>
                                  <span className="Font_flex_var">
                                    Assign to: Roop Chandra Syana
                                  </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div
                                    className="row "
                                    style={{
                                      alignItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="col-md-10">
                                      <div className="Quantative_Sector">
                                        <div className="Quantative_Sector_one">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <p className="Quantative_Title">
                                              Diesel
                                            </p>
                                            <div>
                                              <input
                                                className="p-2 opacity-50"
                                                type="date"
                                                id=""
                                                name=""
                                              />
                                              <span className="px-2"> to</span>
                                              <input
                                                className="p-2 opacity-50"
                                                type="date"
                                                id=""
                                                name=""
                                              />
                                            </div>
                                          </div>
                                          <hr></hr>
                                          <p className="energy">Source</p>
                                          <Form.Select
                                            aria-label="Default select example p-5"
                                            className="mb-3"
                                          >
                                            <option hidden>
                                              Please Select the Source
                                            </option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                          </Form.Select>
                                          <p className="energy">Process</p>
                                          <Form.Select
                                            aria-label="Default select example"
                                            className="mb-3"
                                          >
                                            <option hidden>
                                              Please Select the Process
                                            </option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                          </Form.Select>
                                          <p className="energy">
                                            Reading value
                                          </p>
                                          <InputGroup className="mb-3">
                                            <Form.Control
                                              style={{ width: "70%" }}
                                              aria-label="first_input"
                                              type="number"
                                            />
                                            <Form.Control
                                              style={{ width: "30%" }}
                                              aria-label="Last_input"
                                              value={"kiloleter (kl)"}
                                            />
                                          </InputGroup>
                                          <p className="energy">Note</p>
                                          <Form.Control
                                            className="mb-3"
                                            as="textarea"
                                            placeholder="Leave a Note here"
                                            style={{ height: "100px" }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="attachment_with_icons">
                                        <span>
                                          <a
                                            href="null"
                                            target="_blank"
                                            download=""
                                            style={{
                                              color: "green",
                                              cursor: "pointer",
                                              position: "relative",
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
                                                stroke-width="0.5"
                                              ></path>
                                            </svg>
                                          </a>
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
                                        DownLoad Attatchment
                                      </span>
                                    </div>
                                  </div>
                                  <div className="action__button__section">
                                    <Button onClick={acceptPopup} className="new_button_style">Accept</Button>
                                    <Button onClick={rejectQuestion} variant="danger">Reject</Button>
                                    {/* <button>Add Remarks</button> */}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>

                              {/* For Quantitative */}
                              <Accordion.Item eventKey="3">
                                <Accordion.Header>
                                  4. What is Lorem Ipsum? <br></br>
                                  <span className="Font_flex_var">
                                    Assign to: Roop Chandra
                                  </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <div
                                    className="row "
                                    style={{
                                      alignItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="col-md-10 mb-5">
                                      <NumericInput className="p-2 " />
                                    </div>
                                    <div className="col-md-2">
                                      <div className="attachment_with_icons">
                                        <span>
                                          <div className="file file--upload">
                                            <label for="input-file">
                                              <svg
                                                width="34"
                                                height="34"
                                                viewBox="0 0 34 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ cursor: "pointer" }}
                                              >
                                                <path
                                                  d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                  fill="#A7ACC8"
                                                ></path>
                                                <path
                                                  d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                  fill="#A7ACC8"
                                                  stroke="#A7ACC8"
                                                  stroke-width="0.5"
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
                                    </div>
                                  </div>
                                  <div className="action__button__section">
                                    <Button onClick={acceptPopup} className="new_button_style">Accept</Button>
                                    <Button onClick={rejectQuestion} variant="danger">Reject</Button>
                                    {/* <button>Add Remarks</button> */}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                            <div className="button_audit global_link">
                              <NavLink to="/audit_companies_nodata" className="link_bal_next">Complete</NavLink>
                              <button className="page_save page_width mx-3" variant="none" onClick={() => setShow(true)} > Add Remark </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Modal show={show} animation={true} size="md" className="modal_box" shadow-lg="border" >
        <div className="modal-lg">
          <Modal.Header className="pb-0">
            <Button variant="outline-dark" onClick={() => setShow(false)} >
              <i className="fa fa-times"></i>
            </Button>
          </Modal.Header>
          <div className="modal-body vekp pt-0">
            <div className="row">
              <div className="col-md-12">
                <div className="response">
                  <h4>Add Remarks</h4>
                  <div className="form-group audit-re">
                    <label for="message-text" className="col-form-label">Please submit your outcome here</label>
                    <textarea className="form-control" id="message-text"></textarea>
                  </div>
                  <div className="form-group audit-re">
                    <label for="message-text" className="col-form-label">Please submit your remarks here</label>
                    <textarea className="form-control" id="message-text"></textarea>
                  </div>
                  <div className="global_link">
                    <NavLink className="page_save page_width" to={"audit_history_listing"} > Submit </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
