/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import image11 from "../../../../img/11.png";
import image12 from "../../../../img/12.png";
import image13 from "../../../../img/13.png";
import image14 from "../../../../img/14.png";
import image15 from "../../../../img/15.png";
import image16 from "../../../../img/16.png";
import image17 from "../../../../img/17.png";
import image18 from "../../../../img/18.png";
import image19 from "../../../../img/19.png";
import "./training.css";

export default class continuing_professional_development_detail extends Component {
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
                                <h5 className="motor">
                                  Continuing Professional Development
                                </h5>
                                <div className="input-group input-field mb-3">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-search"></i>
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image11} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image12} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image13} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image14} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image15} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image16} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image17} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image18} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
                                  </div>
                                </div>
                                <div className="col-md-4 cl-xs-12">
                                  <div className="card_1">
                                    <NavLink to="/image_detail">
                                      <img classname="" src={image19} alt="" />
                                      <p>
                                        Commonly used in the graphic, print, and
                                        publishing industries
                                      </p>
                                    </NavLink>
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
