/* eslint-disable jsx-a11y/alt-text */
import Swal from "sweetalert2";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import config from "../../../../config/config.json";
import logo from "../../../../img/learning-logo.png";
import axios from "axios";

import "../../../Login/qrcode.css";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class SmartUp extends Component {
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
    this.enableLearningPlatForm = this.enableLearningPlatForm.bind(this);
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

  enableLearningPlatForm(event) {
    event.preventDefault();
    this.setState({ submitted: true });

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL +
        `company-admin/enableLearningPlatForm?current_role=${localStorage.getItem(
          "role"
        )}`,
        {},
        { headers }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1000,
        });
        setTimeout(() => {
          this.setState({ submitted: false });
          this.serverRequest();
        }, 1000);
      })
      .catch(function (error) {
        if (error.response.status === 500) {
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 1000,
          });
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
          config.API_URL + "company-admin/verifyToken",
          {
            userToken: token,
            current_role: localStorage.getItem("role"),
          },
          { headers }
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1000,
          });

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
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Please fill OTP",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }

  serverRequest() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.API_URL +
      `company-admin/generate-qr-code?current_role=${localStorage.getItem(
        "role"
      )}`,
      { headers }
    )
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
    this.serverRequest();
  }

  render() {
    // const { } = this.state;

    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        <div className="main_wrapper">
          <div className="tabs-top my_profile_menus setting_tab_d">
            <ul>
              <li>
                <NavLink to="/Setting_Profile">My Profile</NavLink>
              </li>
              <li>
                <NavLink to="/Google2FA">Two Factor Authentication</NavLink>
              </li>
              {currentUser.data.role === "company_admin" && (
                <li>
                  <NavLink to="/Setting_Billing">Billing</NavLink>
                </li>
              )}
              {currentUser.data.role === "company_admin" && (
                <li>
                  <NavLink to="/Setting_Sub_Admin">Account Sub Admin</NavLink>
                </li>
              )}
            </ul>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <div className="Introduction framwork_2">
                  <div className="FAverify">
                    <div className="twoFA w-100 ">
                      <div>
                        <div className="FAverify">
                          <div className="twoFA">
                            <div className="sing_one1">
                              <img src={logo} alt="logo" />
                            </div>
                            <div className="text_sing my-4">
                              <h4 className="Account">
                                Welcome to your Learning platform
                              </h4>
                              <p className="faster_oval mt-4">
                                <b>What will you learn next?</b>
                                <br />
                                There's no shortage of content at ESG. Check
                                back most work-days for new lessons on your
                                favorite esg reporting intelligence.
                              </p>
                            </div>
                            {this.state.isActive === 1 && (
                              <div className="ster_form">
                                <div className="view_bottoma mt-4">
                                  <button
                                    type="button"
                                    className="btn btn-primary custom-btn"
                                    onClick={(e) =>
                                      this.enableLearningPlatForm(e)
                                    }
                                  >
                                    Enable For Learning Platform
                                  </button>
                                </div>
                              </div>
                            )}
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
    );
  }
}
