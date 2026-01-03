import React, { useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { NavLink } from 'react-router-dom';
import AssignSubWorker from "../Assign/subworker";
// import NumericInput from 'react-numeric-input';
import { Form, InputGroup } from 'react-bootstrap';
import QuestionTypeTabSection from "../private/Audit/QuestionTypeTabSection";
export default function QuestionList(props) {
  const [questionType, setQuestionType] = useState("All");
  return (
    <div>
      <Sidebar dataFromParent={props.location.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-12">
                      <div className="color_div_on framwork_2">
                        <div className="business_detail">
                          <div className="">
                            <div className="saved_cards">
                              <div className="business_detail">nidhikni
                                <div className="heading">
                                  <h4>Framework 1</h4>
                                  <AssignSubWorker />
                                </div>
                                <hr className="line"></hr>
                                <div className="row">
                                  <QuestionTypeTabSection questionType={questionType} setQuestionType={setQuestionType} />
                                  <div className="col-lg-12 col-xs-12">
                                    <div className="form-group">
                                      <h6 htmlFor="title" className="question_fit" >
                                        Question No. 1
                                        <span className="Font_flex_var" >Assign to: Roop Chandra</span>
                                      </h6>
                                      {/* <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Title (Max 500 Words)" name="title" value="SXFGOHJSDFGHSD" /> */}
                                      <p>What is Lorem Ipsum?</p>
                                    </div>
                                  </div>
                                  <div className="form-group py-3">
                                    <h6 htmlFor="question" className="question_fit" >
                                      Answer <span style={{ color: "red" }}>*</span>
                                    </h6>
                                    <div className="Quantative_Sector">
                                      <div className="Quantative_Sector_one">
                                        <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                          <p className="Quantative_Title">DIESEL</p>
                                          <div>
                                            <input className="p-2 opacity-50" type="date" id="" name="" />
                                            <span className="px-2"> to</span>
                                            <input className="p-2 opacity-50" type="date" id="" name="" />
                                          </div>
                                        </div>
                                        <hr></hr>
                                        <p className="energy">Source</p>
                                        <Form.Select aria-label="Default select example p-5" className="mb-3">
                                          <option hidden>Please Select the Source</option>
                                          <option value="1">One</option>
                                          <option value="2">Two</option>
                                          <option value="3">Three</option>
                                        </Form.Select>
                                        <p className="energy">Process</p>
                                        <Form.Select aria-label="Default select example" className="mb-3">
                                          <option hidden>Please Select the Process</option>
                                          <option value="1">One</option>
                                          <option value="2">Two</option>
                                          <option value="3">Three</option>
                                        </Form.Select>
                                        <p className="energy">Reading value</p>
                                        <InputGroup className="mb-3">
                                          <Form.Control style={{ width: "70%" }} aria-label="first_input" />
                                          <select name="tab_name" id="" className="select_one industrylist" style={{ width: "30%" }}>
                                            <option hidden disabled selected> Select Value</option>
                                            <option value="" title=""> kiloleter (kl)</option>
                                            <option value="" title=""> kiloleter (kl)</option>
                                            <option value="" title=""> kiloleter (kl)</option>
                                            <option value="" title=""> kiloleter (kl)</option>
                                          </select>
                                        </InputGroup>
                                        <p className="energy">Note</p>
                                        <Form.Control className="mb-3" as="textarea" placeholder="Leave a Note here" style={{ height: '100px' }} />
                                        <p className="energy">Attachment</p>
                                        <Form.Group controlId="formFile" className="mb-3">
                                          <Form.Control type="file" />
                                        </Form.Group>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12 col-xs-12">
                                    <div className="form-group">
                                      <h6 htmlFor="title" className="question_fit" >
                                        Question No. 2
                                        <span className="Font_flex_var" >Assign to: Roop Chandra Syana</span>
                                      </h6>
                                      {/* <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Title (Max 500 Words)" name="title" value="SXFGOHJSDFGHSD" /> */}
                                      <p>What is Lorem Ipsum?</p>
                                    </div>
                                  </div>
                                  <div className="form-group py-3">
                                    <h6 htmlFor="question" className="question_fit" >
                                      Answer <span style={{ color: "red" }}>*</span>
                                    </h6>
                                    <textarea type="text" className="form-control" id="description" placeholder="Write Answer (Max 5000 Words)" name="description" />
                                    <p className="energy">Attachment</p>
                                    <Form.Group controlId="formFile" className="mb-3">
                                      <Form.Control type="file" />
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12 col-xs-12">
                                    <div className="form-group">
                                      <h6 htmlFor="title" className="question_fit" >
                                        Question No. 3
                                        <span className="Font_flex_var" >Assign to: Roop Chandra Syana</span>
                                      </h6>
                                      {/* <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Title (Max 500 Words)" name="title" value="SXFGOHJSDFGHSD" /> */}
                                      <p>What is Lorem Ipsum?</p>
                                    </div>
                                  </div>
                                  <div className="form-group py-3">
                                    <h6 htmlFor="question" className="question_fit" >
                                      Answer <span style={{ color: "red" }}>*</span>
                                    </h6>
                                    <textarea type="text" className="form-control" id="description" placeholder="Write Answer (Max 5000 Words)" name="description" />
                                    <p className="energy">Attachment</p>
                                    <Form.Group controlId="formFile" className="mb-3">
                                      <Form.Control type="file" />
                                    </Form.Group>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12 col-xs-12">
                                    <div className="form-group">
                                      <h6 htmlFor="title" className="question_fit" >
                                        Question No. 4
                                        <span className="Font_flex_var" >Assign to: Roop Chandra</span>
                                      </h6>
                                      {/* <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Title (Max 500 Words)" name="title" value="SXFGOHJSDFGHSD" /> */}
                                      <p>What is Lorem Ipsum?</p>
                                    </div>
                                  </div>
                                  <div className="form-group py-3">
                                    <h6 htmlFor="question" className="question_fit" >
                                      Answer <span style={{ color: "red" }}>*</span>
                                    </h6>
                                    <textarea type="text" className="form-control" id="description" placeholder="Write Answer (Max 5000 Words)" name="description" />
                                    <p className="energy">Attachment</p>
                                    <Form.Group controlId="formFile" className="mb-3">
                                      <Form.Control type="file" />
                                    </Form.Group>
                                  </div>
                                </div>
                              </div>
                              <div className="global_link mx-0 my-3">
                                <NavLink type="submit" className="new_button_style button_navLink" to="/question-list-view" >
                                  Submit
                                </NavLink>
                              </div>
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
    </div>
  );
}