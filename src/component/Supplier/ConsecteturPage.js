import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../../component/Company Sub Admin/Pages/esg_reporting/esg_reporting.css";
import "./lorem.css";

export default class ConsecteturPage extends Component {
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
                  <div className="form-group my-3 caret-b">
                    <label for="exampleInputPassword1">
                      Q: Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia des?
                    </label>
                    <span className="caret-d">
                      <i className="fa fa-caret-down"></i>
                    </span>
                    <input
                      type="name"
                      className="form-control"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                    />
                    <div className="dropdown-menu">
                      <NavLink className="dropdown-item py-2" to="#">
                        Option 1
                      </NavLink>
                      <NavLink className="dropdown-item py-2" to="#">
                        Option 2
                      </NavLink>
                      <NavLink className="dropdown-item py-2" to="#">
                        Option 3
                      </NavLink>
                      <NavLink className="dropdown-item py-2" to="#">
                        Option 4
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="global_link mx-0">
                  <button className="link_bal_next page_width">BACK</button>
                  <button className="new_button_style mx-3">NEXT</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
