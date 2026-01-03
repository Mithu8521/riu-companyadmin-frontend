/* eslint-disable jsx-a11y/anchor-is-valid */
import { sweetAlert } from "../../../src/utils/UniversalFunction";
import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../img/Zais_logo.png";
import $ from "jquery";
import "./signup.css";
import config from "../../config/config.json";
import ReCAPTCHA from "react-google-recaptcha";
import env from "../../env";
import ReactTooltip from "react-tooltip";
import { setStore } from "../../utils/UniversalFunction";
import { Country, State, City } from "country-state-city";

import {
  checkPasswordValidation,
  isValidEmail
} from "../../utils/UniversalFunction";
const baseURL = config.baseURL;

export default class CompanyInvite extends Component {
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
      industry_Category: [],
      company_industry: "",
      companyIndustry: [],
      items: [],
      user: {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        businessNumber: "",
        position: "",
        password: "",
        privacy: "1",
        userCategory: "",
        register_company_name: "",
        companyIndustry: "",
        privacyPolicy: ""
      },
      type: "password",
      passwordValidation: false,
      passwordValidationMessage: "",
      emailvalidation: false,
      emailvalidationMessage: "",
      submitted: false,
      industryId: "",
      no_of_users: "",
      captchaIsVerified: false,
      reference: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
    this.showHide = this.showHide.bind(this);
    this.getSubIndustry = this.getSubIndustry.bind(this);
    this.handleChangeForCompanyIndustry =
      this.handleChangeForCompanyIndustry.bind(this);
    this.handleChangeForUser = this.handleChangeForUser.bind(this);
  }

  getSubIndustry(id) {
    fetch(config.API_URL + `getIndustriesOfCategoryId/${id}?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            companyIndustry: result.companyIndustry
          });
        },

        (error2) => {
          this.setState({
            isLoaded2: true,
            error2
          });
        }
      );
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
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
    if (name === "industrytype") {
      this.getSubIndustry(value);
    }
    if (name === "password") {
      let condition = checkPasswordValidation(value);
      if (condition === true) {
        this.setState({
          passwordValidation: true,
          passwordValidationMessage: ""
        });
      } else {
        this.setState({
          passwordValidation: false,
          passwordValidationMessage: condition
        });
      }
    }
    if (name === "email") {
      let condition = isValidEmail(value);
      if (condition === true) {
        this.setState({
          emailValidation: true,
          emailValidationMessage: ""
        });
      } else {
        this.setState({
          emailValidation: false,
          emailValidationMessage: "Please check email format"
        });
      }
    }
  }

  handleChangeForCompanyIndustry(event) {
    let industryId = event.target.value;
    let industryTitle = event.target[event.target.selectedIndex].title;
    this.setState({
      industryId: industryId,
      company_industry: industryTitle
    });
  }

  handleChangeForUser(event) {
    let no_of_users = event.target.value;
    this.setState({
      no_of_users: no_of_users
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { user, passwordValidation, emailValidation, captchaIsVerified } =
      this.state;
    if (
      user.firstName &&
      user.lastName &&
      user.email &&
      user.country &&
      user.businessNumber &&
      user.position &&
      user.password &&
      passwordValidation &&
      emailValidation &&
      user.privacy &&
      user.userCategory &&
      user.register_company_name &&
      captchaIsVerified &&
      user.privacyPolicy
    ) {
      // let referenceData = window.localStorage.getItem('reference');
      axios
        .post(config.OLD_API_URL + "signup", {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          businessNumber: user.businessNumber,
          position: user.position,
          password: user.password,
          privacy: user.privacy,
          userCategory: user.userCategory,
          register_company_name: user.register_company_name,
          no_of_users: this.state.no_of_users,
          company_industry: this.state.company_industry,
          industryId: this.state.industryId,
          token: captchaIsVerified,
          current_role: localStorage.getItem("role"),
          // reference:referenceData
        })
        .then((response) => {
          sweetAlert("success", response.data.message);
          // let setResponse = {};
          // setResponse.data = response.data;
          // setResponse.data.role = response.data.role;
          // localStorage.setItem("currentUser", JSON.stringify(setResponse));
          const pushToRoute = "/#/verify_message";
          // let finalLink = "";
          // if(response.data.link){
          //   finalLink = response.data.link;
          //   setStore('reference',"");
          // }else{
          //   finalLink = baseURL + pushToRoute;
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

    let string = window.location.href.split("/").pop();
    let finalReference = string === "signup" ? "" : string;
    setStore("reference", finalReference);
    this.setState({
      reference: finalReference
    });
    $(document).ready(function () {
      const prevBtns = document.querySelectorAll(".btn-prev");
      const nextBtns = document.querySelectorAll(".btn-next");
      const formSteps = document.querySelectorAll(".step-forms");
      let formStepsNum = 0;

      nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          formStepsNum++;
          updateFormSteps();
        });
      });

      prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          formStepsNum--;
          updateFormSteps();
        });
      });

      function updateFormSteps() {
        formSteps.forEach((formStep) => {
          formStep.classList.contains("step-forms-active") &&
            formStep.classList.remove("step-forms-active");
        });

        formSteps[formStepsNum].classList.add("step-forms-active");
      }
    });

    // fetch(config.BASE_URL + "getAllCountries")
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded: true,
    //         items: result.countries
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error
    //       });
    //     }
    //   );

    fetch(config.API_URL + `getTitleOrPositions?current_role=${localStorage.getItem("role")}`)
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

    fetch(config.API_URL + `getIndustryCategories?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            industry_Category: result.industry_Category
          });
        },

        (error2) => {
          this.setState({
            isLoaded2: true,
            error2
          });
        }
      );
  }

  render() {
    const { user, submitted, type } = this.state;
    const { items, companyIndustry, titleOrPositionsItems, industry_Category } =
      this.state;
    return (
      <div>
        <section className="login">
          <div className="login_part signup_middle">
            <div className="sing_log">
              <div className="sing_one mb-3">
                <img src={logo} alt="logo" />
              </div>
              <form name="form" onSubmit={this.handleSubmit}>
                <div className="step-forms step-forms-active">
                  <div className="text_sing mb-4">
                    <h4 className="Account">Set Up Your Business</h4>
                    <p className="faster_oval">
                      Please make sure you fill in all onboarding information
                      for quick account approval. Contact us, if you have any
                      questions or need any help.
                    </p>
                  </div>
                  <div className="ster_form">
                    <div className="make_form">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form_sign">
                            <div
                              className={
                                "form-group fg" +
                                (submitted && !user.register_company_name
                                  ? " has-error"
                                  : "")
                              }
                            >
                              <label className="st_name" htmlFor="name">
                                Company Name
                              </label>
                              <input
                                className="form-control name_nf select_map"
                                required
                                placeholder="Enter Company name"
                                id="register_company_name"
                                type="text"
                                name="register_company_name"
                                value={user.register_company_name}
                                onChange={this.handleChange}
                              />
                              {submitted && !user.register_company_name && (
                                <div className="help-block">
                                  Company Name is required
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.country ? " has-error" : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          Main Country Of Operations
                        </label>

                        {/* <select
                          id="country"
                          name="country"
                          required
                          className="form-control select_map"
                          value={user.country}
                          onChange={this.handleChange}
                        >
                          <option className="bold" value="1">
                            Select Country
                          </option>
                          {items.map((item) => (
                            <option key={item.id}>{item.name}</option>
                          ))}
                        </select> */}

                        <select
                          name="company_country"
                          id="country"
                          placeholder="Select Country Name"
                          val
                          className="form-control select_map"
                          // value={user.country}
                          onChange={this.handleChange}
                          required
                          title="Please Select Country Name"
                        >
                          <option className="bold" value="1">
                            Select Country
                          </option>
                          {Country.getAllCountries().map((country, i) => (
                            <option>{country.name}</option>
                          ))}
                        </select>

                        {submitted && !user.country && (
                          <div className="help-block">
                            Country Name is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.businessNumber
                            ? " has-error"
                            : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          Business Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Enter business number"
                          className="form-control name_nf select_map"
                          name="businessNumber"
                          maxLength="11"
                          id="businessNumber"
                          value={user.businessNumbindustryIder}
                          onChange={this.handleChange}
                        />
                        {submitted && !user.businessNumber && (
                          <div className="help-block">
                            Business Number is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.company_industry
                            ? " has-error"
                            : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          Company Industry
                        </label>
                        <select
                          className="form-control name_nf select_map"
                          name="industrytype"
                          id="industrytype"
                          placeholder="Select Industry Type"
                          onChange={this.handleChange}
                        >
                          <option value="" disabled selected>
                            Please Select Industry Type
                          </option>
                          {industry_Category.map((item) => (
                            <option value={item.id}>{item.name}</option>
                          ))}
                        </select>

                        <select
                          name="industryTitle"
                          id="industryId"
                          placeholder="Select Company Industry"
                          onChange={(e) =>
                            this.handleChangeForCompanyIndustry(e)
                          }
                          className="form-control name_nf select_map my-3"
                        >
                          <option value="" disabled selected>
                            Please Select Company Industry
                          </option>
                          {companyIndustry.map((item) => (
                            <option value={item.industryId} title={item.title}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                        {submitted && !user.company_industry && (
                          <div className="help-block">Company is required</div>
                        )}
                      </div>
                    </div>
                    <div className="make_form">
                      <div
                        className={
                          "form-group fg" +
                          (submitted && !user.userCategory ? " has-error" : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          User Category
                        </label>
                        <select
                          id="userCategory"
                          required
                          name="userCategory"
                          className="form-control select_map"
                          value={user.userCategory}
                          onChange={this.handleChange}
                        >
                          <option className="bold" value="1">
                            Select category
                          </option>
                          <option>Business Account</option>
                          <option>Partner</option>
                        </select>
                        {submitted && !user.userCategory && (
                          <div className="help-block">
                            User Category is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3 text">
                      <input
                        type="checkbox"
                        name="privacyPolicy"
                        onChange={this.handleChange}
                        required
                      />
                      <span className="p-2">
                        I have read the&nbsp;
                        <Link to="/privacy_policy" target="_blank">
                          Privacy Policy
                        </Link>
                        &nbsp; &amp; &nbsp;
                        <Link to="/terms_and_conditions" target="_blank">
                          Terms & Conditions
                        </Link>
                        &nbsp; and agree to them.
                      </span>
                    </div>
                    <div className="view_bottoma">
                      {user.userCategory &&
                        user.register_company_name &&
                        user.businessNumber &&
                        user.privacyPolicy &&
                        user.country ? (
                        <a className="btn btn-next width-50 ml-auto">Next</a>
                      ) : (
                        <a className="btn btn-next width-50 ml-auto disabledd disabled-link">
                          Next
                        </a>
                      )}
                    </div>
                    <div className="global d-flex justify-content-center my-3">
                      If you are already register then,&nbsp;&nbsp;
                      <NavLink className="login-btn" to="/">
                        Login now
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="step-forms">
                  <div className="text_sing mb-4">
                    <h4 className="Account">Set Up Your User Profile Below</h4>
                    <p className="faster_oval">
                      Please make sure you fill in all onboarding information
                      for quick account approval. Contact us, if you have any
                      questions or need any help.
                    </p>
                  </div>
                  <div className="ster_form">
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
                              placeholder="Enter Last Name"
                              name="lastName"
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
                          <option className="bold">
                            Select Title Position
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
                          (submitted && !this.state.no_of_users
                            ? " has-error"
                            : "")
                        }
                      >
                        <label className="st_name" htmlFor="name">
                          No. of users
                        </label>
                        <select
                          id="no_of_users"
                          required
                          name="no_of_users"
                          className="form-control select_map"
                          value={this.state.no_of_users}
                          onChange={this.handleChangeForUser}
                        >
                          <option>Select no. of users</option>
                          <option value="1-5">1 to 5</option>
                          <option value="6-20">6 to 20</option>
                          <option value="21+">21+</option>
                        </select>
                        {submitted && !this.state.no_of_users && (
                          <div className="help-block">
                            No of Users is required
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
                          value={user.email}
                          placeholder="Enter Email Address"
                          onChange={this.handleChange}
                        />
                        {this.state.emailValidation === false && (
                          <div className="help-block">
                            {this.state.emailValidationMessage}
                          </div>
                        )}
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
                          placeholder="Enter Strong Password"
                          value={user.password}
                          onChange={this.handleChange}
                        />
                        {this.state.passwordValidation === false && (
                          <div className="help-block">
                            {this.state.passwordValidationMessage}
                          </div>
                        )}
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
                        <div className="btns-group view_bottoma mt-5">
                          <a href="#" className="btn btn-prev">
                            Previous
                          </a>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {user.firstName &&
                            user.lastName &&
                            user.position &&
                            user.email &&
                            user.password ? (
                            <span
                              type="submit"
                              value="Submit"
                              className="new_button_style d-block"
                              onClick={(e) => this.handleSubmit(e)}
                            >
                              Register
                            </span>
                          ) : (
                            <button
                              type="submit"
                              value="Submit"
                              id="submit-form"
                              className="btn btn-prev disabledd"
                              disabled
                            >
                              Register
                            </button>
                          )}
                        </div>
                        <div className="global d-flex justify-content-center my-3">
                          If you are already register then,&nbsp;&nbsp;
                          <NavLink className="login-btn" to="/">
                            Login now
                          </NavLink>
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
