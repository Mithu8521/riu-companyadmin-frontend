import React from "react";
import { NavLink } from 'react-router-dom';
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import AssignSubWorker from "../Assign/subworker";
export default function QuestionListView(props) {
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
                              <div className="business_detail">
                                <div className="heading">
                                  <h4>Summary</h4>
                                  <AssignSubWorker />
                                </div>
                                <hr className="line"></hr>
                                <div className="row">
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
                                    <textarea type="text" className="form-control" id="description" name="description" value="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable." />
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
                                    <textarea type="text" className="form-control" id="description" name="description" value="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s" />

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
                                    <textarea type="text" className="form-control" id="description" name="description" value="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, " />
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
                                    <textarea type="text" className="form-control" id="description" name="description" value="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy." />
                                  </div>
                                </div>
                              </div>
                              <div className="global_link mx-0 my-3 g-10">
                                <NavLink type="submit" className="new_button_style button_navLink" to="/question-list" >
                                  Resubmit
                                </NavLink>
                                <button type="submit" className="new_button_style" >
                                  Submit
                                </button>
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