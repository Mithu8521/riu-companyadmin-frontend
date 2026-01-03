import React, { Component } from "react";
import "./login.css";
import logo from "../../img/Zais_logo.png";
import "../sidebar/common.css";
export default class signup extends Component {
  render() {
    return (
      <div>
        <section className="login">
          <div className="login_part">
            <div className="sing_log">
              <div className="sing_one">
                <img src={logo} alt="logo" />
              </div>
              <div className="text_sing">
                <h4 className="Account">Register Sub Admin</h4>
              </div>
              <form name="form">
                <div className="ster_form">
                  <div className="make_form">
                    <div className="row">
                      <div className="col-lg-12 col-xs-12">
                        <div className="login_bt form_sign">
                          <div className="form-group fg">
                            <label className="st_name" htmlFor="name">
                              Name
                            </label>
                            <input
                              className="form-control name_nf"
                              type="text"
                              name="name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xs-12">
                        <div className="login_bt form_sign">
                          <div className="form-group fg">
                            <label className="st_name" htmlFor="name">
                              Email
                            </label>
                            <input
                              className="form-control name_nf"
                              type="text"
                              name="email"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xs-12">
                        <div className="form_sign">
                          <div
                            className={
                              "form-group fg"

                            }
                          >
                            <label className="st_name" htmlFor="name">
                              Password
                            </label>
                            <input
                              className="form-control name_nf"
                              type="password"
                              name="password"
                            />

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="view_bottoma">
                    <button type="submit" value="Submit" className="btn">
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
