import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faChild,
  faCoffee,
  faChartBar,
  faTint,
  faBookOpen,
  faSyncAlt,
  faChartLine,
  faBox,
  faCity,
  faHistory,
  faGlobe,
  faFish,
  faTree,
  faWheelchair,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import {
  faAccessibleIcon,
  faDropbox,
} from "@fortawesome/free-brands-svg-icons";
import "./sustainable.css";

export default class download_report extends Component {
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
                      <div className="governance">
                        <div className="text_Parts">
                          <h6 className="back_Introdu">Introduction</h6>
                          <div className="text_interlinked">
                            <p className="interlinked">
                              The <strong>Sustainable Development Goals</strong>
                              (SDGs) are a collection of 17 interlinked global
                              goals designed to be a "blueprint to achieve a
                              better and more sustainable future for all”. The
                              SDGs were set up in 2015 by the United Nations
                              General Assembly and are intended to be achieved
                              by the year 2030. They are included in a UN
                              Resolution called the
                              <strong>2030 Agenda.</strong>
                            </p>
                            <p className="towards my-3">
                              Not all of the Goals require a response - Only the
                              ones which you feel your business can have a
                              positive impact towards…
                            </p>
                          </div>
                          <div className="addres">
                            <p className="addres_p">
                              <span className="finan">
                                <i className="fas fa-quote-left"></i>
                              </span>
                              As CEOs, we want to create long term value to
                              shareholders by delivering solid returns for
                              shareholders AND by operating a sustainable
                              business model that addresses the long term goals
                              of (the) society, as provided for in the SDG
                              roadmap. At the same time, data on responsible
                              business and sustainability is proliferating,
                              enabling companies to better understand their
                              impact and implement responsible strategies. What
                              we seek is a general framework for companies to
                              demonstrate their long term sustainability; a
                              framework that integrates financial metrics along
                              with relevant non financial criteria such as ESG
                              considerations, gender equality, compensation
                              practices, supply chain management, and other
                              activities..
                            </p>
                            <p className="Brian">
                              - Brian Moynihan, Chairman and CEO Bank of America
                            </p>
                          </div>
                          <div className="text_Parts">
                            <div className="text_ntroion">
                              <button
                                className="next_page_one"
                                title="The Report will be uploaded within next 48 hours"
                                data-toggle="tooltip"
                                data-placement="top"
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
                      </div>
                      <div className="requirem mt-3">
                        <div className="home_help">
                          <div className="of_America">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faLightbulb}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Sustainable Development Goal
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <p className="Developme">
                                      Sustainable <br />
                                      Development Goal
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <p className="can_bus">
                                    Can you business make a positive impact towards this goal?
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <p className="omne impa">Response</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_one">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faChild}
                                      />
                                    </p>
                                    <p className="demons_te">No Poverty</p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">No Poverty</h5>
                                    <p className="Developme">
                                      Access to basic human needs of health, education and sanitation
                                      {/* <br /> needs of health, education,
                                      <br /> sanitation */}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oneq">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faCoffee}
                                      />
                                    </p>
                                    <p className="demons_te">Zero Hunger</p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">Zero Hunger</h5>
                                    <p className="Developme">
                                      Providing food and humanitarian
                                      <br /> relief, establishing sustainable
                                      food <br />
                                      production
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onew">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faChartBar}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Good Health and Well-being
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Good Health and Well-being
                                    </h5>
                                    <p className="Developme">
                                      Better, more accessible health systems to
                                      <br /> increase life-expectancy
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onet">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faBookOpen}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Quality Education
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Quality Education
                                    </h5>
                                    <p className="Developme">
                                      Inclusive education to enable upward
                                      <br /> social mobility and end poverty
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onep">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faAccessibleIcon}
                                      />
                                    </p>
                                    <p className="demons_te">Gender Equality</p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Gender Equality
                                    </h5>
                                    <p className="Developme">
                                      Education regardless of gender,
                                      <br /> advancement of equality laws,
                                      fairer
                                      <br /> representation of women
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oney">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faTint}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Clean Water and Sanitation
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Clean Water and Sanitation
                                    </h5>
                                    <p className="Developme">
                                      Improving access for billions of <br />
                                      people who lack these basic
                                      <br /> facilities
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oneu">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faSyncAlt}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Affordable and Clean Energy
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Affordable and Clean Energy
                                    </h5>
                                    <p className="Developme">
                                      Access to renewable, safe
                                      <br /> and widely available energy <br />
                                      sources for all
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onea">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faChartLine}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Decent Work and Economic Growth
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Decent Work and Economic Growth
                                    </h5>
                                    <p className="Developme">
                                      Creating jobs for all to improve living
                                      <br />
                                      standards, providing sustainable economic
                                      <br /> growth
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onen">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faBox}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Reduced Inequalities
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Reduced Inequalities
                                    </h5>
                                    <p className="Developme">
                                      Reducing income and other inequalities,
                                      <br /> within and between countries
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onei">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faDropbox}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Reduced Inequalities
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Reduced Inequalities
                                    </h5>
                                    <p className="Developme">
                                      Reducing income and other inequalities,
                                      <br /> within and between countries
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oneb">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faCity}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Sustainable Cities and Communities
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Sustainable Cities and Communities
                                    </h5>
                                    <p className="Developme">
                                      Making cities safe, inclusive, resilient
                                      and <br />
                                      sustainable
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oneop">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faHistory}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Responsible Consumption and Production
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Responsible Consumption Production
                                    </h5>
                                    <p className="Developme">
                                      Reversing current consumption trends
                                      <br /> and promoting a more sustainable
                                      future
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onemo">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faGlobe}
                                      />
                                    </p>
                                    <p className="demons_te">Climate Action</p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">Climate Action</h5>
                                    <p className="Developme">
                                      Regulating and reducing emissions and
                                      <br />
                                      .promoting renewable energy
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_oneon">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faFish}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Life Below Water
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Life Below Water
                                    </h5>
                                    <p className="Developme">
                                      Conservation, promoting marine diversity
                                      and
                                      <br /> regulating fishing practices
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onenm">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faTree}
                                      />
                                    </p>
                                    <p className="demons_te">Life on Land</p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">Life on Land</h5>
                                    <p className="Developme">
                                      Reversing man-made deforestation and
                                      <br /> desertification to sustain all life
                                      on earth
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onecm">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faWheelchair}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Peace, Justice and Strong Institutions
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Peace, Justice and Strong Institutions
                                    </h5>
                                    <p className="Developme">
                                      Inclusive societies, strong institutions
                                      and
                                      <br /> equal access to justice
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="human" />
                          </div>
                          <div className="of_Americat">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="chairamw">
                                  <div className="image_icon_onegl">
                                    <p className="demons">
                                      <FontAwesomeIcon
                                        className="far"
                                        icon={faBullseye}
                                      />
                                    </p>
                                    <p className="demons_te">
                                      Partnerships for the Goals
                                    </p>
                                  </div>
                                  <div className="image_text">
                                    <h5 className="Pove_rty">
                                      Partnerships for the Goals
                                    </h5>
                                    <p className="Developme">
                                      Revitalise strong global partnerships for sustainable development
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="impa">
                                  <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="chairam">
                                  <div className="omne">
                                    <div className="input-group">
                                      <textarea
                                        className="form-control nopel"
                                        rows="6"
                                      ></textarea>
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
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
