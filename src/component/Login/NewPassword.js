import { sweetAlert } from "../../../src/utils/UniversalFunction";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import logo from "../../img/Zais_logo.png";
import "./login.css";
import "../sidebar/common.css";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import LoginImages from "../../img/login-image.jpg";
import { Button, Col, Row, Spinner } from "react-bootstrap";

export default class NewPassword extends Component {
  constructor(props) {
    super(props);
    // redirect to home if already logged in

    this.state = {
      user: {
        password: "",
        confirmPassword: "",
      },
      type: "password",
      type1: "password",
      submitted: false,
      loading: false,
      passwordMatch: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showHide = this.showHide.bind(this);
    this.showHide1 = this.showHide1.bind(this);
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password",
    });
  }

  showHide1(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type1: this.state.type1 === "password" ? "input" : "password",
    });
  }

  handleChange(event, password) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
    if (user.confirmPassword) {
      const camparevallue =
        password === "password" ? user.confirmPassword : user.password;
      if (camparevallue === value) {
        this.setState({ passwordMatch: true });
      } else {
        this.setState({ passwordMatch: false });
      }
    }
    if (password !== "password") {
      if (user.password === value) {
        this.setState({ passwordMatch: true });
      } else {
        this.setState({ passwordMatch: false });
      }
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    let checkBothPasswordSameOrNot = user.password === user.confirmPassword;
    if (checkBothPasswordSameOrNot) {
      this.setState({ loading: true });
      if (user.password) {
        const { isSuccess, data } = await apiCall(
          config.AUTH_API_URL_COMPANY + "verifyPasswordResetToken",
          {},
          {
            token: window.location.href.split("/").pop(),
            password: user.password,
          },
          "POST"
        );
        this.setState({ loading: false });
        if (isSuccess) {
          setTimeout(() => {
            window.location.href = config.baseURL + "/#/Login";
          }, 1000);
        }
        //   axios
        //     .post(config.API_URL + "token/verfy", {
        //       token: window.location.href.split("/").pop(),
        //       password: user.password,
        //     })
        //     .then((response) => {
        //       sweetAlert("success", response.data.message);
        //       setTimeout(() => {
        //         window.location.href = config.baseURL + "/Login";
        //       }, 1000);
        //     })
        //     .catch(function (error) {
        //       if (error.response) {
        //         sweetAlert("error", error.response.data.message);
        //       }
        //     });
        // } else {
        //   sweetAlert("error", "Please fill Password");
        // }
      } else {
      }
    } else {
      sweetAlert(
        "error",
        "Your password or confirm password not matched please check and try again later..!"
      );
    }
  }

  componentDidMount() {
    this.videoRef.autoplay = true;
  }

  render() {
    const { user, submitted, type, type1 } = this.state;
    return (
      <div>
        <Row>
          <Col md={7}>
            {/* <div className="login-left-panel">
              <img src={LoginImages} alt="" />
            </div> */}
            <video
              ref={(ref) => (this.videoRef = ref)}
              autoPlay
              loop
              muted
              className="video-background"
            >
              <source
                src="https://riu-bucket.s3.ap-south-1.amazonaws.com/f6.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </Col>
          <Col md={5}>
            <section className="login">
              <div className="login_part">
                <div className="sing_log">
                  <div className="sing_one">
                    <img src={logo} alt="logo" />
                  </div>
                  <div className="text_sing">
                    <p className="faster_oval">Reset Your Password</p>
                  </div>
                  <form name="form" onSubmit={this.handleSubmit}>
                    <div className="ster_form">
                      <div className="login_bt form_sign password-eye">
                        <div className="form-group fg">
                          <label className="st_name" htmlFor="name">
                            Password
                          </label>
                          <input
                            className="form-control name_nf"
                            type={type1}
                            name="password"
                            placeholder="Enter New Password"
                            value={user.password}
                            onChange={(e) => this.handleChange(e, "password")}
                          />
                          {submitted && !user.password && (
                            <div className="help-block">
                              New Password is required
                            </div>
                          )}
                          <span className="eye-under" onClick={this.showHide1}>
                            {this.state.type1 === "input" ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        </div>

                        <div className="form-group fg eye-frame">
                          <label className="st_name" htmlFor="name">
                            Confirm Password
                          </label>
                          <input
                            className="form-control name_nf"
                            type={type}
                            name="confirmPassword"
                            placeholder="Enter Confirm Password"
                            value={user.confirmPassword}
                            onChange={(e) =>
                              this.handleChange(e, "conPassword")
                            }
                          />
                          {user.confirmPassword &&
                            (this.state.passwordMatch ? (
                              <div className="green" mt-2>
                                Password Matched
                              </div>
                            ) : (
                              <div className="red mt-2">
                                Confirm Password is Matched
                              </div>
                            ))}
                          {submitted && !user.confirmPassword && (
                            <div className="help-block">
                              Conform Password is required
                            </div>
                          )}
                          <span className="eye-under" onClick={this.showHide}>
                            {this.state.type === "input" ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        </div>
                      </div>
                      <Row>
                        <Col md={6}>
                          {/* <div className="view_bottoma">
                            {user.password && user.confirmPassword ? (
                              <button
                                type="submit"
                                value="Submit"
                                className="btn"
                                style={{ fontSize: "11px" , fontWeight:"bold", fontSize:"12px"}}
                              >
                                Reset
                              </button>
                            ) : (
                              <button
                                type="submit"
                                disabled
                                value="Submit"
                                className="btn button_color"
                                style={{ fontSize: "11px" , fontWeight:"bold", fontSize:"12px"}}
                              >
                                Reset
                              </button>
                            )}
                          </div> */}
                          {this.state?.loading ? (
                            <Button
                              variant="info"
                              className="w-100 p-3"
                              disabled
                            >
                              <Spinner animation="border" /> Resetting...
                            </Button>
                          ) : user.password && user.confirmPassword ? (
                            <Button
                              type="submit"
                              className="w-100 p-3"
                              variant="info"
                            >
                              <b>Reset</b>
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              className="w-100 p-3"
                              disabled
                            >
                              <b>Reset</b>
                            </Button>
                          )}
                        </Col>
                        <Col md={6}>
                          <NavLink to="/Login">
                            <Button variant="info" className="w-100 p-3">
                              <b> Back to Login</b>
                            </Button>
                          </NavLink>
                        </Col>
                      </Row>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}
