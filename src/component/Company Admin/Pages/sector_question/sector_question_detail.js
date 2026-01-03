import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

export default class sector_question_detail extends Component {
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
                      <div className="Introduction framwork_2">
                        <div className="text_Parts">
                          <div className="text_ntroion">
                            <h5 className="Intro">Introduction</h5>
                            <p className="critical">
                              The Auto Parts industry is made of companies that
                              specialize in manufacturing parts or accessories
                              for a motor vehicle and selling them to original
                              equipment manufacturers. These vehicle parts that
                              are manufactured and assembled include: exhaust
                              systems, hybrid systems, rearview mirrors, tires,
                              catalytic converters, and aluminum wheels. The
                              reported sector of the Auto Parts industry only
                              includes companies that supply parts directly to
                              original equipment manufacturers.
                            </p>
                            <button
                              className="next_page_one"
                              title="The Report will be uploaded within next 48 hours"
                              data-toggle="tooltip"
                              type="button"
                            >
                              <span className="Download_r">
                                <i className="fa fa-download"></i>
                              </span>
                              Download Report
                            </button>
                            <button className="re-submit mx-3" type="button">
                              Re-submit responses
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="frameworks framwork_2">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_capital">
                                Environmental Capital
                              </h4>
                              <div className="manag">
                                <div className="heading_h3 mb-3">
                                  <span className="gement">
                                    Energy Management
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: How is the company managing energy
                                  consumption and related price and supply
                                  risks?
                                </h3>
                                <p className="sumption">
                                  There are many variations of passages of Lorem
                                  Ipsum available, but the majority have
                                  suffered alteration in some form, by injected
                                  humour, or randomised words which don't look
                                  even slightly believable. If you are going to
                                  use a passage of Lorem Ipsum, you need to be
                                  sure there isn't anything embarrassing hidden
                                  in the middle of text.
                                </p>
                                <hr className="related" />
                              </div>
                              <div className="managq">
                                <h3 className="energy">
                                  Q: What strategies are in place to increase
                                  energy efficiency and manage the company's
                                  energy mix?
                                </h3>
                                <p className="sumption">
                                  There are many variations of passages of Lorem
                                  Ipsum available, but the majority have
                                  suffered alteration in some form, by injected
                                  humour, or randomised words which don't look
                                  even slightly believable. If you are going to
                                  use a passage of Lorem Ipsum, you need to be
                                  sure there isn't anything embarrassing hidden
                                  in the middle of text.
                                </p>
                                <hr className="related mt-3" />
                              </div>
                              <div className="managw">
                                <div className="heading_h3 mb-3">
                                  <span className="gement">
                                    Waste Management
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: How is the company improving materials
                                  efficiency and reducing waste in
                                  manufacturing, including through recycling?
                                </h3>
                                <p className="sumption">
                                  There are many variations of passages of Lorem
                                  Ipsum available, but the majority have
                                  suffered alteration in some form, by injected
                                  humour, or randomised words which don't look
                                  even slightly believable. If you are going to
                                  use a passage of Lorem Ipsum, you need to be
                                  sure there isn't anything embarrassing hidden
                                  in the middle of text.
                                </p>
                                <hr className="related mt-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="frameworks framwork_2">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_capital">Social Capital</h4>
                              <div className="manag">
                                <div className="heading_h3 mb-3">
                                  <span className="gement">Product Safety</span>
                                </div>
                                <h3 className="energy">
                                  Q: What is the company's exposure to product
                                  safety-related risks and how does it manage
                                  these risks?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="frameworks framwork_2">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_capital">
                                Leadership & Governance
                              </h4>
                              <div className="manag">
                                <div className="heading_h3 mb-3">
                                  <span className="gement">
                                    Competitive Behavior
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: To what anti-competitive behavior
                                  regulations is the company subject? How does
                                  the company ensure compliance with these
                                  regulations?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="frameworks framwork_2">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_capital">
                                Business Model & Innovation
                              </h4>
                              <div className="manag">
                                <div className="heading_h3 mb-3">
                                  <span className="gement gement2">
                                    Design for Fuel Efficiency
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: How does the company identify and manage
                                  opportunities for fuel efficient or
                                  emissions-reducing products?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
                              </div>
                              <div className="manag">
                                <div className="heading_h3 mb-3 mt-3">
                                  <span className="gement gement2">
                                    Materials Sourcing
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: What is the company's exposure to risks or
                                  potential disruptions in the supply chain
                                  arising from the use of critical materials,
                                  and how is the company managing these risks?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
                              </div>
                              <div className="manag">
                                <div className="heading_h3 mb-3 mt-3">
                                  <span className="gement gement2">
                                    Materials Efficiency
                                  </span>
                                </div>
                                <h3 className="energy">
                                  Q: How does the company incorporate recycled
                                  or remanufactured materials into its
                                  manufacturing process?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
                              </div>
                              <div className="manag">
                                <h3 className="energy">
                                  Q: How is the company improving the
                                  recyclability and reusability of its products?
                                </h3>
                                <p className="sumption">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat. Duis aute irure dolor
                                  in reprehenderit in voluptate velit esse
                                  cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non
                                  proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </p>
                                <hr className="related" />
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
