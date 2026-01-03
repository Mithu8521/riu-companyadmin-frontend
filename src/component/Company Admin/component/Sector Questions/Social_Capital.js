import React, { Component } from "react";

export default class social_capital extends Component {
  render() {
    return (
      <div>
        <div className="row setup-content" id="step-10">
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
              <h4 className="E_capital">Social Capital</h4>
              <div className="heading_h3 mb-3">
                <span className="gement">Product Safety</span>
              </div>
              <div className="form-floating">
                <textarea
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea"
                ></textarea>
                <label htmlFor="floatingTextarea" className="energy">
                  Q: What is the company's exposure to product safety-related
                  risks and how does it manage these risks?
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
