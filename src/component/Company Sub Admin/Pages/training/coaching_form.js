/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

export default class coaching_form extends Component {
  constructor(props) {
    super(props);


    this.goToPreviousPath = this.goToPreviousPath.bind(this);
  }
  goToPreviousPath() {
    window.history.back();
  }
  render() {
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introductionweq">
                        <div className="text_Parts">
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="d-flex justify-content-between">
                                <h6 className="back_quninti back_quninti_2">
                                  <a className="back_text" href="#" onClick={this.goToPreviousPath}>
                                    <span className="step_icon">
                                      <i className="far fa-long-arrow-alt-left"></i>
                                    </span>
                                    Back
                                  </a>
                                </h6>
                                {/* <h6 className="back_quninti back_quninti_2">
                                  <a className="back_text" href="#">
                                    <span className="step_icon"></span>Next
                                    <i className="far fa-long-arrow-alt-right"></i>
                                  </a>
                                </h6> */}
                              </div>
                              <div className="d-flex justify-content-between mt-5">
                                <h5 className="motor">Coaching</h5>
                              </div>
                              <div className="col-md-12 col-xs-12">
                                <h6 className="mt-5">
                                  Fill out the following form for us to find the
                                  best consultant help:
                                </h6>
                                <div className="form_start">
                                  <form>
                                    <div className="form-group my-3">
                                      <label for="exampleFormControlSelect1">
                                        I need help with
                                      </label>
                                      <select
                                        className="form-control select_t"
                                        id="exampleFormControlSelect1"
                                      >
                                        <option>ESG Reporting</option>
                                        <option>Sector Question</option>
                                        <option>Governance</option>
                                        <option>Suppliers</option>
                                        <option>Supplier Management</option>
                                        <option>SDG's</option>
                                        <option>Carbon Footprint</option>
                                        <option>Board Skills</option>
                                        <option>ESG Products</option>
                                      </select>
                                    </div>

                                    <div className="form-group">
                                      <label for="exampleFormControlTextarea1">
                                        Please provide a detailed explanation of
                                        the help you are looking for
                                      </label>
                                      <textarea
                                        className="form-control mt-3"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                      ></textarea>
                                    </div>
                                    <div className="sve_next">
                                      <button
                                        className="page_save page_width"
                                        type="button"
                                      >
                                        SAVE AS DRAFT
                                      </button>
                                      {/* <button
                                        className="page_save_green page_width"
                                        type="button"
                                      >
                                        <span>
                                          <i className="fa fa-check"></i>
                                        </span>
                                        DRAFT SAVED
                                      </button> */}
                                    </div>
                                  </form>
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
}
