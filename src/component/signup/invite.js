import { sweetAlert } from "../../../src/utils/UniversalFunction";

import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../../img/Zais_logo.png";
import "./signup.css";
import config from "../../config/config.json";
import env from "../../env";
import ReactTooltip from "react-tooltip";

const baseURL = config.baseURL;

export default class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      error2: null,
      isLoaded2: false,
      error3: null,
      isLoaded3: false,
      companyIndustoryItems: [],
      titleOrPositionsItems: [],
      uuid: null,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        password: ""
      },
      type: "password",
      submitted: false,
      captchaIsVerified: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password"
    });
  }

  handleVerification(e) {
    this.setState({
      captchaIsVerified: true
    });
  }

  handleChange(event) {
    let url = window.location.pathname.split("/");
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
    this.setState({ uuid: url.at(-1) });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    const uuid = this.state.uuid;

    if (
      user.firstName &&
      user.lastName &&
      user.email &&
      user.position &&
      user.password
    ) {
      axios
        .post(config.OLD_API_URL + "signupSubAdmin", {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          position: user.position,
          password: user.password,
          uuid: uuid,
          user_type_code: "company",
          company_id: localStorage.getItem('user_temp_id'),
          current_role: localStorage.getItem("role"),
        })
        .then((response) => {
          sweetAlert("success", response.data.message);
          // let setResponse = {};
          // setResponse.data = response.data;
          // setResponse.data.role = response.data.role;
          // localStorage.setItem("currentUser", JSON.stringify(setResponse));
          const pushToRoute = "/#/verify_message";
          // if (setResponse.data.role === "company_sub_admin") {
          //   localStorage.setItem("subscriptionAuth", JSON.stringify(200));
          // }
          setTimeout(() => {
            window.location.href = baseURL + pushToRoute;
          }, 1000);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert("error", error.response.data.message);
          }
        });
    } else {
      sweetAlert("error", "Please fill all input");
    }
  }

  componentDidMount() {
    fetch(config.BASE_URL + `getTitleOrPositions?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded3: true,
            titleOrPositionsItems: result.titleOrPositions
          });
        },
        (error3) => {
          this.setState({
            isLoaded3: true,
            error3
          });
        }
      );
  }

  render() {
    const { user, submitted, type } = this.state;
    const { titleOrPositionsItems } = this.state;
    return (
      <div>
        <section className="login">
          <div className="login_part">
            <div className="sing_log">
              <div className="sing_one">
                <img src={logo} alt="logo" />
              </div>
              <form name="form" onSubmit={this.handleSubmit}>
                <div className="step-forms step-forms-active">
                  <div className="text_sing">
                    <h4 className="Account">Set Up Your User Profile Below</h4>
                    <p className="faster_oval">
                      Please make sure you fill in all onboarding information
                      for quick account approval. Contact us, if you have any
                      questions or need any help.
                    </p>
                  </div>
                  <div className="ster_form mt-4">
                    <div className="make_form">
                      <div className="row">
                        <div className="col-md-6">
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !user.firstName ? " has-error" : "")
                            }
                          >
                            <label className="st_name" htmlFor="name">
                              First Name
                            </label>
                            <input
                              className="form-control name_nf"
                              id="firstName"
                              type="text"
                              name="firstName"
                              placeholder="Enter First Name"
                              value={user.firstName}
                              onChange={this.handleChange}
                            />
                            {submitted && !user.firstName && (
                              <div className="help-block">
                                First Name is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !user.lastName ? " has-error" : "")
                            }
                          >
                            <label className="st_name" htmlFor="name">
                              Last Name
                            </label>
                            <input
                              className="form-control name_nf"
                              id="lastName"
                              type="text"
                              name="lastName"
                              placeholder="Enter Last name"
                              value={user.lastName}
                              onChange={this.handleChange}
                            />
                            {submitted && !user.lastName && (
                              <div className="help-block">
                                Last Name is required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.position ? " has-error" : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          Title or Position
                        </label>
                        <select
                          id="position"
                          name="position"
                          className="form-control select_map"
                          value={user.position}
                          onChange={this.handleChange}
                        >
                          <option className="bold" value="1">
                            Select Title or position
                          </option>
                          {titleOrPositionsItems.map((titleOrPositionsItem) => (
                            <option key={titleOrPositionsItem.id}>
                              {titleOrPositionsItem.title}
                            </option>
                          ))}
                        </select>
                        {submitted && !user.position && (
                          <div className="help-block">
                            Title or Position is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.email ? " has-error" : "")
                        }
                      >
                        <label className="st_name" htmlFor="email">
                          Corporate Email
                        </label>
                        <input
                          className="form-control name_nf"
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Enter Email Address"
                          value={user.email}
                          onChange={this.handleChange}
                        />
                        {submitted && !user.email && (
                          <div className="help-block">Email is required</div>
                        )}
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg eye-frame" +
                          (submitted && !user.password ? " has-error" : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          Password&nbsp;
                          <span data-tip data-for="registerTip">
                            <i
                              className="fa fa-question-circle"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </label>
                        <ReactTooltip
                          id="registerTip"
                          place="top"
                          effect="solid"
                        >
                          <h6>Password Must :</h6>
                          <ul>
                            <li>Have at least one lower case character</li>
                            <li>Have at least one Capital letter</li>
                            <li>Have at least one number</li>
                            <li>Have at least one special character</li>
                            <li>Be at least 8 characters</li>
                            <li>Not be a common password</li>
                          </ul>
                          <h6>
                            For Eg : <b>Password@123</b>
                          </h6>
                        </ReactTooltip>
                        <input
                          className="form-control name_nf"
                          id="password"
                          type={type}
                          name="password"
                          value={user.password}
                          placeholder="Enter Strong password"
                          onChange={this.handleChange}
                        />
                        {submitted && !user.password && (
                          <div className="help-block">Password is required</div>
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
                    <div className="plform">
                      <div className="form-check hompop">
                        <input
                          type="checkbox"
                          name="privacyPolicy"
                          onChange={this.handleChange}
                          required
                        />
                        <label
                          className="form-check-label date_yup"
                          htmlFor="flexCheckDefault"
                        >
                          I have read the&nbsp;
                          <Link to="/privacy_policy" target="_blank">
                            Privacy Policy
                          </Link>
                          &nbsp; &amp; &nbsp;
                          <Link to="/terms_and_conditions" target="_blank">
                            Terms & Conditions
                          </Link>
                          &nbsp; and agree to them.
                        </label>
                      </div>
                    </div>

                    <div className="make_form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="glee">
                            <div className="bacei">
                              <ReCAPTCHA
                                sitekey={env.GOOGLE_RECAPTCHA_SITE_KEY}
                                onChange={(e) => this.handleVerification(e)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="glee">
                            <div className="bacei">
                              {/* <LoadCanvasTemplate reloadText="<img src='https://img.icons8.com/external-becris-lineal-becris/32/000000/external-refresh-mintab-for-ios-becris-lineal-becris.png'/>" /> */}
                            </div>
                          </div>
                        </div>
                        <div className="btns-group view_bottoma mt-5">
                          <button
                            type="submit"
                            value="Submit"
                            id="submit-form"
                            className="btn"
                            onClick={this.doSubmit}
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
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
