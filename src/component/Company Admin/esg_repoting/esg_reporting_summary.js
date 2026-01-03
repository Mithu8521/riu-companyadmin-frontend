import "./esg_reporting_pie.css";
import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { NavLink } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export default class esgReportingSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: props.location,
      show: false,
      close: false,
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
                      <div className="color_div_on framwork_2">
                        <h5 className="frame">
                          Your Frameworks Selection are -
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
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> First Framework </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-6 col-lg-6 col-md-12 col-12" >
                                      <div className="Global_text"  >
                                        <div className="form-check form-check-inline clobal_check input-padding">
                                          <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Second Framework </label>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <h5 className="frame">
                          Your Topics Selection are -
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
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> First Topics </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-6 col-lg-6 col-md-12 col-12" >
                                      <div className="Global_text"  >
                                        <div className="form-check form-check-inline clobal_check input-padding">
                                          <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Second Topics </label>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <h5 className="frame">
                          Your Kpi's Selection are -
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
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> First Kpi </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-6 col-lg-6 col-md-12 col-12" >
                                      <div className="Global_text"  >
                                        <div className="form-check form-check-inline clobal_check input-padding">
                                          <input className="form-check-input input_one " name="frameworksUsed[]" type="checkbox" />
                                          <label className="form-check-label label_one" htmlFor={"xcfgvldskfjgosdfg"}> Second Kpi </label>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="save_global global_link mt-4">
                          <NavLink to="/esg_reporting" className="link_bal_next" href="ESG_Reporting_two.html" > Edit </NavLink>
                          <button className="page_save page_width mx-3" variant="none" onClick={() => this.setState({ show: true })} > Confirm </button>
                        </div>
                        <Modal show={this.state.show} animation={true} size="md" className="modal_box" shadow-lg="border" >
                          <div className="modal-md">
                            <Modal.Header>
                              <Button variant="outline-dark" onClick={() => this.setState({ show: false })} >
                                <i className="fa fa-times"></i>
                              </Button>
                            </Modal.Header>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="response">
                                    <h4>Response Saved!</h4>
                                    <p className="text-center my-3"> To download your ESG Risk Report please complete the Sector Questions and download at the completion of that module. </p>
                                    <div className="global_link">
                                      <NavLink className="page_save page_width" to={"sector_questions"} > go to sector questions </NavLink>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal>
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
