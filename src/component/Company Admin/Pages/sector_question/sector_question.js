import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

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
                      <div className="color_div_on">
                        <div className="text_Parts">
                          <div className="text_Description">
                            <h5 className="motor">Description</h5>
                            <p className="specialize">
                              The Auto Parts industry is made of companies that
                              specialize in manufacturing parts or accessories
                              for a motor vehicle and selling them to original
                              equipment manufacturers. rearview mirrors, tires,
                              catalytic converters, and aluminum wheels. The
                              SASB reported sector of the Auto Parts industry
                              only includes companies that supply parts directly
                              to original equipment manufacturers.
                            </p>
                          </div>
                          <div className="directly">
                            <NavLink
                              className="directly_link"
                              to="/sector_question_fast"
                            >
                              Next
                            </NavLink>
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
