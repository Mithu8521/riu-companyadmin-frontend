/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

export default class supplier_management extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
                      <form name="form" onSubmit={this.handleSubmit}>
                        <div className="Below_demo mt-4">
                          <div className="text_Parts">
                            <div className="text_ntroion">
                              <h5 className="frame">
                                Please select which ESG reporting frameworks you have used in the past:
                              </h5>
                              <div className="Global">
                                <div className="row">
                                  <div className="col-sm-12 col-xs-12">
                                    <div className="border_box p-3">
                                      <div className="wel_fel">
                                        <div className="row">
                                          <div className="col-xxl-6 col-lg-6 col-md-12 col-12" >
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Global Reporting Index (GRI) </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-xxl-6 col-lg-6 col-md-12 col-12" >
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Carbon Disclosure Project (CDP) </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="col-sm-12">
                            <div className="Below_demo">
                              <div className="text_Parts">
                                <div className="text_Below_one">
                                  <p className="Below">
                                    Please select framework's Topics you have used in the past:
                                  </p>
                                  <div className="border_box p-3">
                                    <div className="Below_text">
                                      <div className="row">
                                        <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                          <div className="better_dic">
                                            <div className="golp"></div>
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Global Reporting Index (GRI) </label>
                                              </div>
                                            </div>
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Carbon Disclosure Project (CDP) </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                          <div className="better_dic">
                                            <div className="golp"></div>
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Global Reporting Index (GRI) </label>
                                              </div>
                                            </div>
                                            <div className="Global_text"  >
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                                <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Carbon Disclosure Project (CDP) </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                          <div className="Global_text"  >
                                            <div className="form-check form-check-inline clobal_check input-padding">
                                              <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                              <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Global Reporting Index (GRI) </label>
                                            </div>
                                          </div>
                                          <div className="Global_text"  >
                                            <div className="form-check form-check-inline clobal_check input-padding">
                                              <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                              <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Carbon Disclosure Project (CDP) </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <hr className="Ethics my-3" />
                                  <div className="global_link mt-4">
                                    <span className="global_link">
                                      <NavLink className="link_bal_next" onClick={this.goToPreviousPath}> Back </NavLink>
                                    </span>
                                    <span className="global_link">
                                      <NavLink className="new_button_style" to={"/supplier_management_kpi"} > Next </NavLink>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
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
