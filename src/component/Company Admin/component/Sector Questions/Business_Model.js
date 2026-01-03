/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class Business_Model extends Component {
  render() {
    return (
      <div>
        <div className="row setup-content" id="step-12">
          <div className="col-md-12">
            <div className="d-flex justify-content-between">
              <h6 className="back_quninti back_quninti_2">
                <a className="back_text" href="#">
                  <span className="step_icon">
                    <i className="far fa-long-arrow-alt-left"></i>
                  </span>
                  Back
                </a>
              </h6>
              <h6 className="back_quninti back_quninti_2">
                <a className="back_text" href="#">
                  <span className="step_icon"></span>Next
                  <i className="far fa-long-arrow-alt-right"></i>
                </a>
              </h6>
            </div>
            <div className="Capital_op">
              <h4 className="E_capital">Business Model & Innovation</h4>
              <div className="manag">
                <div className="heading_h3 mb-3">
                  <span className="gement gement2">
                    Design for Fuel Efficiency
                  </span>
                </div>
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: How does the company identify and manage opportunities
                    for fuel efficient or emissions-reducing products?
                  </label>
                </div>
                <div className="form-floating mt-3">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: What is the company's exposure to risks or potential
                    disruptions in the supply chain arising from the use of
                    critical materials, and how is the company managing these
                    risks?
                  </label>
                </div>
                <div className="form-floating mt-3">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: How does the company incorporate recycled or
                    remanufactured materials into its manufacturing process?
                  </label>
                </div>
                <div className="form-floating mt-3">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: How is the company improving the recyclability and
                    reusability of its products?
                  </label>
                </div>
                <div className="sve_next">
                  <button className="page_save page_width" type="button">
                    SAVE AS DRAFT
                  </button>
                  <button className="page_save_green page_width" type="button">
                    <span>
                      <i className="fa fa-check"></i>
                    </span>
                    DRAFT SAVED
                  </button>
                  <NavLink
                    to="/sector_question_detail"
                    className="page_save_anchor"
                    type="button"
                  >
                    GENERATE REPORT
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
