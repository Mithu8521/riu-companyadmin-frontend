// import "./esg_reporting_pie.css";
import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { NavLink } from "react-router-dom";

export default class SupplierKpi extends Component {
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
                        <form name="form" onSubmit={this.handleSubmit}>
                          <h5 className="frame">
                            Please select which Supplier Kpi you have used in the past:
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
                        </form>
                        <hr className="Ethics my-3" />
                        <div className="global_link mt-4">
                          <span className="global_link">
                            <button className="link_bal_next" onClick={this.goToPreviousPath} > Back </button>
                          </span>
                          <span className="global_link">
                            <NavLink className="new_button_style" to={"/supplier_management/question_list"} > Next </NavLink>
                          </span>
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
