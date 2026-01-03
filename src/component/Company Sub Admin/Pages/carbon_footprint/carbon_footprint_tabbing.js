import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import CarbonFootprintTabbing from "../../Component/carbon_footprint/carbon_footprint_tabbing";

export default class carbon_footprint_tabbing extends Component {
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
                          <div className="steps-form"></div>
                        </div>
                      </div>
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          {/* <!-- //start tabs -->
                                                <!-- Steps form --> */}
                          <div className="color_div_carbon mt-50">
                            <div className="include">
                              {/* <!-- Stepper --> */}
                              <CarbonFootprintTabbing />
                              {/* <!-- four -->
                                                                <!-- five --> */}
                            </div>
                          </div>
                          {/* <!-- Steps form -->
                                                    <!-- //end tabs --> */}
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
