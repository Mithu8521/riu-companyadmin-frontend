import Swal from "sweetalert2";
import React, { Component } from "react";
import axios from "axios";
import logo from "../../img/Zais_logo.png";
import "../sidebar/common.css";
import config from "../../config/config.json";
import { authenticationService } from "../../_services/authentication";
export default class EmailVerification extends Component {
  constructor(props) {
    super(props);
    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      this.props.history.push("/home");
    }

    this.serverRequest = this.serverRequest.bind(this);
  }

  serverRequest() {
    let token = document.URL.split("/").pop();
    if (token) {
      axios
        .post(config.API_URL + "#/email/verfy/token", {
          token: token,
          current_role: localStorage.getItem("role"),
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: true,
            timer: 2000
          });

          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        })
        .catch(function (error) {
          if (error.response) {
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: true,
              timer: 2000
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Please fill all input",
        showConfirmButton: true,
        timer: 1000
      });
    }
  }
  componentDidMount() {
    if (authenticationService.currentUserValue) {
      this.props.history.push("/home");
    }
    this.serverRequest();
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
              <div className="text_sing mb-4">
                <p className="faster_oval"></p>
                <h4 className="Account">Verifing.....</h4>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
