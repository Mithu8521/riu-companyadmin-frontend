import Swal from "sweetalert2";
import React, { Component } from "react";
import config from "../../config/config.json";
import logo from "../../img/Zais_logo.png";
import axios from "axios";
import { authenticationService } from "../../_services/authentication";
import { getSubscriptionAuth } from "../../utils/UniversalFunction";
const currentUser = authenticationService.currentUserValue;

export default class OTPVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      activeModal: "",
      otp: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const {
      otp,
    } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "company-admin/verifyOtp",
        {
          token: otp,
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
        localStorage.setItem("2faStatus", JSON.stringify(1));
        setTimeout(() => {
          const subscriptionAuth = getSubscriptionAuth("subscriptionAuth");
          if (subscriptionAuth === false) {
            this.props.history.push("/subscription_plan");
          } else {
            this.props.history.push("/home");
          }
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Application error",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
  }



  render() {
    return (
      <div>
        <section className="login">
          <div className="login_part">
            <div className="sing_log">
              <div className="sing_one">
                <img src={logo} alt="logo" />
              </div>
              <div className="text_sing my-4">
                <h4 className="Account">2FA Verify</h4>
                <p className="faster_oval mt-4">
                  Please fill out your Google Authentication OTP 6 Digits Code below to login to your dashboard
                </p>
              </div>
              <form name="form" >
                <div className="ster_form">
                  <div className="make_form">
                    <div className="row">
                      <div className="col-lg-12 col-xs-12">
                        <div className="login_bt form_sign">
                          <div
                            className=
                            "form-group fg">
                            <label className="st_name" htmlFor="name">
                              OTP
                            </label>
                            <input
                              className="form-control name_nf"
                              type="number"
                              name="otp"
                              onChange={(e) => this.handleChange(e)}
                              placeholder="Enter 6 Digits OTP Number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="view_bottoma">
                    <button type="submit" value="Submit" className="btn" onClick={this.handleSubmit}>
                      Submit
                    </button>
                  </div>
                  <div className="view_bottoma mt-4">
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
