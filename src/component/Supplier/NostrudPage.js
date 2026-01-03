import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../../component/Company Sub Admin/Pages/esg_reporting/esg_reporting.css";
import "./lorem.css";

export default class NostrudPage extends Component {
  render() {
    return (
      <>
        <section className="d_text">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <div className="text_Parts">
                  <div className="d-flex justify-content-between">
                    <h5 className="motor">Dolor Sit</h5>
                  </div>
                </div>
                <div className="forms">
                  <div className="form-group my-3">
                    <label for="exampleInputPassword1">
                      Q: Aliquip ex ea commodo consequate dolor in voluptate
                      velit esse cillum dolore eu fugiat?
                    </label>
                    <input
                      type="name"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder=""
                    />
                  </div>

                  <div className="form-group my-3">
                    <label for="exampleInputPassword1">
                      Q: Aliquip ex ea commodo consequate dolor in voluptate
                      velit esse cillum dolore eu fugiat?
                    </label>
                    <input
                      type="name"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="global_link mx-0">
                  <button className="link_bal_next page_width">BACK</button>
                  <NavLink
                    to="/supplier/SupplierQuestionDetail"
                    className="page_width page_save mx-3"
                  >
                    SUBMIT
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
