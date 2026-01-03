import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Tabbing from "../../Component/Sector Questions/tabbing";
import "./sector_question_fast.css";

export default class home extends Component {
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
                      <div className="strp_progess">
                        <div className="hol_rell">
                          <div className="steps-form">
                            <div className="steps-row setup-panel"></div>
                          </div>
                        </div>
                      </div>
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          {/* <!-- //start tabs -->
                                                    <!-- Steps form --> */}
                          <div className="color_div_step div-color">
                            <div className="include">
                              {/* <!-- Stepper --> */}
                              <Tabbing />
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
