/* eslint-disable jsx-a11y/alt-text */
import Swal from "sweetalert2";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import config from "../../../../config/config.json";
import logo from "../../../../img/google-authenticator-thumb.png";
import axios from "axios";

import "../../../Login/qrcode.css";
import $ from "jquery";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import './working_progress.css';

import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class Google2FA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      secret_key: "",
      activeModal: "",
      token: "",
      showModal: false,
      submitted: false,
      qrImage: "",
      isActive: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.disableAuthentication = this.disableAuthentication.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }

  disableAuthentication(event) {
    event.preventDefault();
    this.setState({ submitted: true });

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + `company-admin/disableAuthentication?current_role=${localStorage.getItem("role")}`,
        { current_role: localStorage.getItem("role") },
        { headers }
      )
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: response.data.message,
          showConfirmButton: false,
          timer: 1000
        })
        setTimeout(() => {
          this.setState({ submitted: false });
          this.serverRequest();
        }, 1000);
      })
      .catch(function (error) {
        if (error.response.status === 500) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
            timer: 1000,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 1000
          })
        }
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { token } = this.state;
    this.setState({
      token,
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });

    const { token } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    if (token) {
      axios
        .post(
          config.API_URL + `company-admin/verifyToken?current_role=${localStorage.getItem("role")}`,
          {
            userToken: token,

          },
          { headers }
        )
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 1000
          })
          setTimeout(() => {
            this.setState({ token: "" });
            this.setState({ submitted: false });
            this.serverRequest();
          }, 1000);
        })
        .catch(function (error) {
          if (error.response.status === 500) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Invalid OTP please check and try again later..",
              timer: 1000,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1000
            })
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Please fill OTP',
        showConfirmButton: false,
        timer: 1000
      })
    }
  }

  serverRequest() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `company-admin/generate-qr-code?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (res) => {
          this.setState({
            qrImage: res.response.qrCode,
            secret_key: res.response.secret,
            isActive: res.response.isActive,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  componentDidMount() {
    $(document).ready(function () {
      var current_fs, next_fs, previous_fs; //fieldsets
      var opacity;
      var current = 1;
      var steps = $("fieldset").length;

      setProgressBar(current);

      $(".next").click(function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li")
          .eq($("fieldset").index(next_fs))
          .addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate(
          { opacity: 0 },
          {
            step: function (now) {
              // for making fielset appear animation
              opacity = 1 - now;

              current_fs.css({
                display: "none",
                position: "relative",
              });
              next_fs.css({ opacity: opacity });
            },
            duration: 500,
          }
        );
        setProgressBar(++current);
      });

      $(".previous").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li")
          .eq($("fieldset").index(current_fs))
          .removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate(
          { opacity: 0 },
          {
            step: function (now) {
              // for making fielset appear animation
              opacity = 1 - now;

              current_fs.css({
                display: "none",
                position: "relative",
              });
              previous_fs.css({ opacity: opacity });
            },
            duration: 500,
          }
        );
        setProgressBar(--current);
      });

      function setProgressBar(curStep) {
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar").css("width", percent + "%");
      }

      $(".submit").click(function () {
        return false;
      });
    });
    this.serverRequest();
  }

  render() {
    const { secret_key } = this.state;

    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />

        <div className="main_wrapper">
          <div className="question_type_filter">
            <NavLink to="/settings">My Profile</NavLink>
            <NavLink to="/Google_2FA" className="selected_question_type">
              Two Factor Authentication
            </NavLink>

            {/* {role === "company" && ( */}
            <NavLink to="/Setting_Billing">Billing</NavLink>
            {/* )} */}
            {/* {role === "company" && ( */}
            <NavLink to="/sub_accounts">Sub Accounts</NavLink>
            {/* )} */}
            {/* {role === "company" && ( */}
            <NavLink to="/generator">Generator</NavLink>
            {/* )} */}

          </div>
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <div className="FAverify">
                          <div className="twoFA w-100 ">
                            <div>
                              <div className="row" style={{ alignItems: "center" }}>
                                <div className="col-md-6">
                                  {/* <div className="FAverify">
                                    <div className="twoFA"> */}
                                  <div className="">
                                    <div className="twoFA">
                                      <div className="sing_one1">
                                        <img src={logo} alt="logo" />
                                      </div>
                                      <div className="text_sing my-4">
                                        <h4 className="Account">2 Step Authentication</h4>
                                        <p className="faster_oval mt-4">
                                          <b>
                                            Protect your account with 2-Step verification
                                          </b>
                                          <br />
                                          Prevent hackers from accessing your account with
                                          an additional layer of security. When you sign
                                          in, 2-Step verification helps make sure your
                                          personal information stays private, safe and
                                          secure.
                                        </p>
                                      </div>
                                      {this.state.isActive === 1 && (
                                        <div className="ster_form">
                                          <div className="view_bottoma mt-4">
                                            <button
                                              type="button"
                                              className="btn"
                                              onClick={(e) =>
                                                this.disableAuthentication(e)
                                              }
                                            >
                                              Disable
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  {this.state.isActive !== 1 && (
                                    // <div id="qractivate" className="FAverify">
                                    //   <div className="twoFA">
                                    <div id="qractivate" className="">
                                      <div className="twoFA">
                                        <div className="pt-4" id="form-step" >
                                          <h2 className="center bold">
                                            Scan the QR Code now for 2 Step Authentication.
                                          </h2>
                                          <form id="msform">
                                            <fieldset>
                                              <div className="form-card">
                                                <div className="sing_one1 sign_two">
                                                  <form
                                                    name="form"
                                                    onSubmit={this.handleSubmit}
                                                  >
                                                    <form name="form">
                                                      <div className="ster_form">
                                                        <div className="make_form">
                                                          <div className="row">
                                                            <div className="col-lg-12 col-xs-12">
                                                              <div className="login_bt form_sign">
                                                                <div className="forms">
                                                                  <h4 className="bold text-center mt-2">
                                                                    Google Authenticator
                                                                  </h4>
                                                                  <div className="text-center qrcode">
                                                                    <label
                                                                      htmlFor="exampleFormControlInput1"
                                                                      className="form-label text-center bold m-2"
                                                                    >
                                                                      Scan the QR Code now for 2 Step Authentication.
                                                                    </label>
                                                                    <div className="sing_one1">
                                                                      <img
                                                                        src={
                                                                          this.state
                                                                            .qrImage
                                                                        }
                                                                        alt="logo"
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <p className="bold text-center m-2">
                                                                    For Manual, add secret
                                                                    key in the google
                                                                    authenticator app
                                                                  </p>
                                                                  <p className="text-center" style={{ overflowWrap: "break-word" }}>
                                                                    <b>Key : </b>
                                                                    {secret_key}
                                                                  </p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </form>
                                                </div>
                                              </div>
                                              {/* <div className="g-button"> */}
                                              <button
                                                type="button"
                                                className="next action-button page_save page_width sub_google" style={{ "float": "initial !important" }}
                                              >
                                                Next
                                              </button>
                                              {/* </div>   */}
                                            </fieldset>
                                            <fieldset>
                                              <form
                                                name="form"
                                                onSubmit={this.handleSubmit}
                                              >
                                                <h4 className="bold center mt-2 mb-4">
                                                  Enter OTP
                                                </h4>
                                                <div className="ster_form">
                                                  <div className="make_form">
                                                    <div className="row">
                                                      <div className="col-lg-12 col-xs-12">
                                                        <div className="login_bt form_sign">
                                                          <div className="form-group fg">
                                                            <input
                                                              className="form-control name_nf"
                                                              type="tel"
                                                              name="token"
                                                              maxLength="6"
                                                              onChange={this.handleChange}
                                                              placeholder="Enter 6 Digits OTP Number"
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </form>
                                              <input
                                                type="button"
                                                name="Verify"
                                                className="action-button"
                                                onClick={this.handleSubmit}
                                                value="Verify"
                                              />
                                              <input
                                                type="button"
                                                name="previous"
                                                className="previous action-button-previous"
                                                value="Previous"
                                              />
                                            </fieldset>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Modal
                              animation={true}
                              size="md"
                              className="modal_box"
                              shadow-lg="border"
                              show={
                                this.state.showModal &&
                                this.state.activeModal === "disable"
                              }
                            >
                              <div className="modal-lg">
                                <Modal.Header className="pb-0">
                                  <Button
                                    variant="outline-dark"
                                    onClick={this.handleCloseModal}
                                  >
                                    <i className="fa fa-times"></i>
                                  </Button>
                                </Modal.Header>
                                <div className="modal-body vekp pt-0">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="pb3">
                                        <h4>Google Authenticator</h4>
                                        <form
                                          name="form"
                                          onSubmit={this.handleSubmit}
                                        >
                                          <form name="form">
                                            <div className="ster_form">
                                              <div className="make_form">
                                                <div className="row">
                                                  <div className="col-lg-12 col-xs-12">
                                                    <div className="login_bt form_sign">
                                                      <div className="form-group fg my-4">
                                                        <label
                                                          className="st_name"
                                                          htmlFor="name"
                                                        >
                                                          OTP
                                                        </label>
                                                        <input
                                                          className="form-control name_nf"
                                                          type="number"
                                                          name="otp"
                                                          placeholder="Enter 6 Digits OTP Number"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="view_bottoma">
                                                <button
                                                  type="submit"
                                                  value="Submit"
                                                  className="btn"
                                                >
                                                  Disable
                                                </button>
                                              </div>
                                            </div>
                                          </form>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal>
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
