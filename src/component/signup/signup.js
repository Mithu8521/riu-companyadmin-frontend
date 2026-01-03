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
import EyeCross from "../../img/eye-icon-cross.png";
import Eye from "../../img/eye-icon.png";
import Hint from "../../img/question.png";
import LoginImages from "../../img/login-image.jpg";
import {
  checkPasswordValidation,
  isValidEmail,
} from "../../utils/UniversalFunction";
import { apiCall } from "../../_services/apiCall";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Payment from "./payment";
import { Country, State, City } from "country-state-city";
import AddLocationAutoComplete from "../Settings/AddLocationAutoComplete";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const baseURL = config.baseURL;

export default class signup extends Component {
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
      profileUrl: null,
      paymentPageShow: false,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        country: "IN",
        businessNumber: "",
        position: "",
        password: "",
        privacy: "1",
        userCategory: "",
        role: "company",
        register_company_name: "",
        companyIndustry: "",
        privacyPolicy: "",
        invitationCountry: "",
        frequency: "",
      },
      address: "",
      selectedLocation: {
        area: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      loader: false,
      addressLocation: "",
      invitation: false,
      type: "password",
      passwordValidation: false,
      passwordValidationMessage: "",
      emailvalidation: false,
      emailvalidationMessage: "",
      submitted: false,
      industryId: "",
      no_of_users: "",
      captchaIsVerified: false,
      reference_id: "",
      url_location: this.props.location,
      countryCode: "",
      companyId: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
    this.showHide = this.showHide.bind(this);
    this.getSubIndustry = this.getSubIndustry.bind(this);
    this.handleChangeForCompanyIndustry =
      this.handleChangeForCompanyIndustry.bind(this);
    this.handleChangeForUser = this.handleChangeForUser.bind(this);
  }

  // const sourceChange = (selectedLoca) => {
  //   handleSourceChangeHandler(selectedLoca);
  // };
  handleAddressChange = (newAddress) => {
    this.setState({ address: newAddress });
  };

  handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const addressComponents = results[0].address_components;
      const localityIndex = addressComponents.findIndex((component) =>
        component.types.includes("locality")
      );
      const area = addressComponents
        .slice(0, localityIndex)
        .map((component) => component.long_name)
        .join(", ");
      const city =
        addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name || "";

      const state =
        addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const country =
        addressComponents.find((component) =>
          component.types.includes("country")
        )?.long_name || "";
      const zipCode =
        addressComponents.find((component) =>
          component.types.includes("postal_code")
        )?.long_name || "";

      this.setState({
        address: area,
        selectedLocation: {
          area,
          city,
          state,
          country,
          zipCode,
        },
      });

      // You can do something with the selected location data here
    } catch (error) {
      console.error("Error selecting location", error);
    }
  };

  handleManualInputChange = (field, value) => {
    this.setState((prevState) => ({
      selectedLocation: {
        ...prevState.selectedLocation,
        [field]: value,
      },
    }));
    this.handleSourceChangeHandler({
      ...this.state.selectedLocation,
      [field]: value,
    });
  };

  // Set initial state using selectedLocation from props
  getSubIndustry(id) {
    fetch(
      config.BASE_URL +
      `getIndustriesOfCategoryId/?id=${id}&current_role=${localStorage.getItem(
        "role"
      )}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            companyIndustry: result.companyIndustry,
          });
        },

        (error2) => {
          this.setState({
            isLoaded2: true,
            error2,
          });
        }
      );
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password",
    });
  }

  handleVerification(e) {
    this.setState({
      captchaIsVerified: true,
    });
  }
  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
    if (name === "industrytype") {
      this.getSubIndustry(value);
    }
    if (name === "password") {
      let condition = checkPasswordValidation(value);
      if (condition === true) {
        this.setState({
          passwordValidation: true,
          passwordValidationMessage: "",
        });
      } else {
        this.setState({
          passwordValidation: false,
          passwordValidationMessage: condition,
        });
      }
    }
    if (name === "email") {
      let condition = isValidEmail(value);
      if (condition === true) {
        this.setState({
          emailValidation: true,
          emailValidationMessage: "",
        });
      } else {
        this.setState({
          emailValidation: false,
          emailValidationMessage: "Please check email format",
        });
      }
    }
  }

  handleChangeForCompanyIndustry(event) {
    const value = event.target.value?.split("-");
    let industryId = value[0];
    let industryTitle = value[1];
    this.setState({
      industryId: industryId,
      company_industry: industryTitle,
    });
  }

  handleChangeForUser(event) {
    let no_of_users = event.target.value;
    this.setState({
      no_of_users: no_of_users,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true, loader: true });
    const {
      user,
      passwordValidation,
      emailValidation,
      captchaIsVerified,
      countryCode,
    } = this.state;
    if (
      user.firstName &&
      user.lastName &&
      user.email &&
      user.businessNumber &&
      user.position &&
      user.password
    ) {
      let referenceData = window.localStorage.getItem("reference");
      axios
        .post(config.AUTH_API_URL_COMPANY + "signup", {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          user_type_code: "company",
          register_company_name: user.register_company_name,
          country: "IN",
          business_number: user.businessNumber,
          position: user.position,
          password: user.password,
          frequency: user.frequency,
          source: this.state.selectedLocation,
          profile_picture: this.state.profileUrl,
          // privacy: user.privacy,
          userCategory: user.userCategory,
          company_industry: this.state.company_industry,
          company_industry_id: Number(this.state.industryId),
          request_id: this.state.reference_id,
          current_role: localStorage.getItem("role"),
        })
        .then((response) => {
          this.setState({
            loader: true,
            paymentPageShow: true,
            companyId: response?.data?.company_id,
          });
          let setResponse = {};
          setResponse.data = response.data;
          setResponse.data.role = response.data.user_type_code;
        })
        .catch(function (error) {
          if (error.response) {
            this.setState({
              loader: true,
            });
            sweetAlert("error", error.response.data.message);
          }
        });
    } else {
      sweetAlert("error", "Please fill all input");
    }
  }
  onFileChange = (event) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${event.target.files[0]?.name}`;
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("fileName", fileName);
    formData.append("filePath", "yasil/");

    var requestOptions = {
      header: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    fetch(
      `${config.AUTH_API_URL_COMPANY
      }uploadFile?current_role=${localStorage.getItem("role")}`,
      requestOptions
    )
      .then((response) => response.text())
      .then(async (result) => {
        let url = JSON.parse(result);
        this.setState({
          profileUrl: url?.url,
        });
        // this.uploadProfilePicture(url?.url);
      })
      .catch((error) => console.log("error", error));
  };
  async componentDidMount() {
    const url = window.location.href;
    const regex = /\/company_invite\/(.+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const paramValue = match[1];
      this.setState({ reference_id: paramValue });
      let body = {
        request_id: paramValue,
      };

      const { isSuccess, data } = await apiCall(
        config.BASE_URL + "getInvitationDetails",
        {},
        body,
        "GET"
      );
      if (isSuccess) {
        this.setState({
          invitation: true,
        });
        const country = this?.state?.items?.find(
          (country) => country?.iso === data?.data[0]?.country_code
        );
        this.setState({
          user: {
            email: data?.data[0]?.email,
            register_company_name: data?.data[0]?.company_name,
            country: data?.data[0]?.country_code,
            invitationCountry: country?.name,
          },
        });
      }
    } else {
      this.setState({
        invitation: false,
      });
    }

    const {
      isSuccess: isSuccessForTitle,
      data: TitleOrPositions,
      error: error2,
    } = await apiCall(config.BASE_URL + "getTitleOrPositions", {}, {}, "GET");
    if (isSuccessForTitle) {
      this.setState({
        isLoaded3: true,
        titleOrPositionsItems: TitleOrPositions.titleOrPositions,
      });
    }
    const {
      isSuccess: isSuccessForIndustry,
      data: Industry,
      error: error3,
    } = await apiCall(config.BASE_URL + "getIndustryCategories", {}, {}, "GET");
    if (isSuccessForIndustry) {
      this.setState({
        isLoaded2: true,
        industry_Category: Industry.industry_Category,
      });
    }
    this.videoRef.autoplay = true;
  }
  render() {
    const { address, selectedLocation } = this.state;
    const { user, submitted, type } = this.state;
    const { items, companyIndustry, titleOrPositionsItems, industry_Category } =
      this.state;
    return (
      <div>
        <Row>
          <Col md={7} className="sm-d-none" style={{ overflow: "hidden" }}>
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
          <Col md={5} style={{ overflow: "auto" }}>
            {this.state.paymentPageShow ? (
              <section className="login">
                <div className="login_part signup_middle">
                  <div className="sing_log p-1 mt-5">
                    <Payment
                      dataResult={this?.state?.user?.password}
                      companyId={this?.state?.companyId}
                    />
                  </div>
                </div>
              </section>
            ) : (
              <section className="login">
                <div className="login_part signup_middle">
                  <div className="sing_log mt-5">
                    <div className="sing_one">
                      <img src={logo} alt="logo" className="w-50" />
                    </div>
                    <form name="form">
                      <div className="text_sing">
                        <p className="faster_oval">Set Up Your Business</p>
                      </div>
                      <div className="ster_form">
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
                                  className="form-control input-height"
                                  required
                                  placeholder="Enter Company name"
                                  id="register_company_name"
                                  type="text"
                                  name="register_company_name"
                                  value={user.register_company_name}
                                  onChange={this.handleChange}
                                  readOnly={this.state.invitation}
                                />
                                {submitted && !user?.register_company_name && (
                                  <div className="help-block">
                                    Company Name is required
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className={
                                    "form-group fg" +
                                    (submitted && !user.firstName
                                      ? " has-error"
                                      : "")
                                  }
                                >
                                  <label className="st_name" htmlFor="name">
                                    First Name
                                  </label>
                                  <input
                                    className="form-control input-height"
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
                                    (submitted && !user.lastName
                                      ? " has-error"
                                      : "")
                                  }
                                >
                                  <label className="st_name" htmlFor="name">
                                    Last Name
                                  </label>
                                  <input
                                    className="form-control input-height"
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
                            <div className="">
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
                                  className="form-control input-height"
                                  id="email"
                                  type="email"
                                  name="email"
                                  value={user.email}
                                  autoComplete="off"
                                  placeholder="Enter Email Address"
                                  onChange={this.handleChange}
                                  readOnly={this.state.invitation}
                                />
                                {this.state.emailValidation === false && (
                                  <div className="help-block">
                                    {this.state.emailValidationMessage}
                                  </div>
                                )}
                                {submitted && !user.email && (
                                  <div className="help-block">
                                    Email is required
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="">
                              <div
                                className={
                                  "form-group fg eye-frame" +
                                  (submitted && !user.password
                                    ? " has-error"
                                    : "")
                                }
                              >
                                <label className="st_name" htmlFor="name">
                                  Password&nbsp;
                                  <span data-tip data-for="registerTip">
                                    <img src={Hint} alt="" srcSet="" />
                                  </span>
                                </label>
                                <ReactTooltip
                                  id="registerTip"
                                  place="top"
                                  effect="solid"
                                >
                                  <h6>Password Must :</h6>
                                  <ul>
                                    <li>
                                      Have at least one lower case character
                                    </li>
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
                                  className="form-control input-height"
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
                                  <div className="help-block">
                                    Password is required
                                  </div>
                                )}
                                <span
                                  className="eye-under"
                                  style={{ top: "54px" }}
                                  onClick={this.showHide}
                                >
                                  {this.state.type === "input" ? (
                                    <img src={EyeCross} alt="" srcSet="" />
                                  ) : (
                                    <img src={Eye} alt="" srcSet="" />
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="">
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !user.country ? " has-error" : "")
                            }
                          >
                            <label className="st_name" htmlFor="name">
                              Main Country Of Operations
                            </label>
                            {this.state?.user?.invitationCountry ? (
                              <input
                                className="form-control input-height"
                                id="country"
                                name="country"
                                type="text"
                                value={this.state?.user?.invitationCountry}
                                readOnly={this.state.invitation}
                              />
                            ) : (
                              <select
                                id="country"
                                name="country"
                                required
                                className="form-control input-height"
                                value={this.state.countryCode}
                                onChange={(e) =>
                                  this.setState({ countryCode: e.target.value })
                                }
                              >
                                <option className="bold" value="1">
                                  Select Country
                                </option>
                                {Country.getAllCountries().map((country, i) => (
                                  <option value={country.isoCode}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            )}

                            {submitted &&
                              !this.state?.countryCode &&
                              !this.state.invitation && (
                                <div className="help-block">
                                  Country Name is required
                                </div>
                              )}
                          </div>
                        </div> */}

                        <div className="form_sign">
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !user.addressLocation)
                            }
                          >
                            <label className="st_name" htmlFor="name">
                              Location (Address)
                            </label>
                            {/* <AddLocationAutoComplete
                              handleSourceChangeHandler={
                                this.handleSourceChangeHandler
                              }
                            /> */}
                            <PlacesAutocomplete
                              value={address}
                              onChange={this.handleAddressChange}
                              onSelect={this.handleSelect}
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                              }) => (
                                <div>
                                  <input
                                    {...getInputProps({
                                      placeholder: "Type your Area...",
                                      className:
                                        "location-search-input form-control input-height",
                                    })}
                                  />

                                  <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion) => (
                                      <div
                                        {...getSuggestionItemProps(suggestion)}
                                        key={suggestion.placeId}
                                      >
                                        {suggestion.description}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </PlacesAutocomplete>

                            {/* Display individual address fields with input fields for manual entry */}
                            <div>
                              {/* <div className={"form-group fg"}>
                                <label className="st_name" htmlFor="name">
                                  Area
                                </label>
                                <input
                                  className="form-control input-height"
                                  type="text"
                                  placeholder="Auto fill Area"
                                  readOnly
                                  value={selectedLocation.area}
                                  onChange={(e) => this.handleManualInputChange("area", e.target.value)}
                                />
                              </div> */}
                              <Row>
                                <Col md={6}>
                                  <div className={"form-group fg"}>
                                    <label className="st_name" htmlFor="name">
                                      City
                                    </label>
                                    <input
                                      className="form-control input-height"
                                      type="text"
                                      placeholder="Auto fill City"
                                      value={selectedLocation.city}
                                      readOnly
                                      onChange={(e) =>
                                        this.handleManualInputChange(
                                          "city",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className={"form-group fg"}>
                                    <label className="st_name" htmlFor="name">
                                      State
                                    </label>
                                    <input
                                      className="form-control input-height"
                                      type="text"
                                      placeholder="Auto fill State"
                                      value={selectedLocation.state}
                                      readOnly
                                      onChange={(e) =>
                                        this.handleManualInputChange(
                                          "state",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className={"form-group fg"}>
                                    <label className="st_name" htmlFor="name">
                                      Country
                                    </label>
                                    <input
                                      className="form-control input-height"
                                      type="text"
                                      placeholder="Auto fill Country"
                                      value={selectedLocation.country}
                                      readOnly
                                      onChange={(e) =>
                                        this.handleManualInputChange(
                                          "country",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className={"form-group fg"}>
                                    <label className="st_name" htmlFor="name">
                                      Zip Code
                                    </label>
                                    <input
                                      className="form-control input-height"
                                      type="text"
                                      placeholder="Auto fill Zip Code"
                                      value={selectedLocation.zipCode}
                                      readOnly
                                      onChange={(e) =>
                                        this.handleManualInputChange(
                                          "zipCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div className="">
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
                                className="form-control input-height"
                                name="businessNumber"
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
                          <div className="">
                            <div
                              className={
                                "form-group fg" +
                                (submitted && !user?.frequency
                                  ? " has-error"
                                  : "")
                              }
                            >
                              <label className="st_name" htmlFor="name">
                                Select Frequency
                              </label>
                              <select
                                id="frequency"
                                name="frequency"
                                className="form-control input-height"
                                value={user?.frequency}
                                onChange={this.handleChange}
                              >
                                <option className="bold">
                                  Select Frequency
                                </option>
                                <option value="MONTHLY">MONTHLY</option>
                                <option value="QUATERLY">QUARTERLY</option>
                                <option value="HALF_YEARLY">HALF YEARLY</option>
                                <option value="YEARLY">YEARLY</option>
                              </select>
                              {submitted && !user?.frequency && (
                                <div className="help-block">
                                  Frequency is required
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="">
                            <div
                              className={
                                "form-group fg" +
                                (submitted && !user.industrytype
                                  ? " has-error"
                                  : "")
                              }
                            >
                              <label className="st_name" htmlFor="name">
                                Company Industry
                              </label>
                              <select
                                className="form-control input-height"
                                name="industrytype"
                                id="industrytype"
                                placeholder="Select Industry Type"
                                onChange={this.handleChange}
                              >
                                <option value="">
                                  Please Select Company Industry
                                </option>
                                {industry_Category?.length > 0 &&
                                  industry_Category?.map((item, key) => (
                                    <option key={key} value={item?.id}>
                                      {item?.name}
                                    </option>
                                  ))}
                              </select>
                              <label className="st_name" htmlFor="name">
                                Sector Type
                              </label>
                              <select
                                className="form-control input-height"
                                name="industryId"
                                id="industryId"
                                placeholder="Select Sector Type"
                                onChange={(e) =>
                                  this.handleChangeForCompanyIndustry(e)
                                }
                              >
                                <option value="" disabled selected>
                                  Please Select Sector Type
                                </option>
                                {companyIndustry.length > 0 &&
                                  companyIndustry?.map((item, key) => (
                                    <option
                                      key={key}
                                      value={item.industryId + "-" + item.title}
                                    >
                                      {item.title}
                                    </option>
                                  ))}
                              </select>
                              {submitted && !user.industrytype && (
                                <div className="help-block">
                                  Company is required
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="">
                            <div
                              className={
                                "form-group fg" +
                                (submitted && !user.position
                                  ? " has-error"
                                  : "")
                              }
                            >
                              <label className="st_name" htmlFor="name">
                                Title or Position
                              </label>
                              <select
                                id="position"
                                name="position"
                                className="form-control input-height"
                                value={user.position}
                                onChange={this.handleChange}
                              >
                                <option className="bold">
                                  Select Title Position
                                </option>
                                {titleOrPositionsItems.length > 0 &&
                                  titleOrPositionsItems.map(
                                    (titleOrPositionsItem) => (
                                      <option key={titleOrPositionsItem.id}>
                                        {titleOrPositionsItem.title}
                                      </option>
                                    )
                                  )}
                              </select>
                              {submitted && !user.position && (
                                <div className="help-block">
                                  Title or Position is required
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !user.position ? " has-error" : "")
                            }
                          >
                            <label className="st_name" htmlFor="profile">
                              Upload Profile Picture
                            </label>
                            <div>
                              <input
                                className="w-100"
                                type="file"
                                name="uploadImage"
                                accept=".jpg, .png"
                                // data-id={id}
                                onChange={this.onFileChange}
                              />
                            </div>
                          </div>
                          <div className="my-3 text">
                            <input
                              type="checkbox"
                              name="privacyPolicy"
                              onChange={(e) => {
                                if (this.state.user.privacyPolicy) {
                                  this.setState({
                                    user: {
                                      ...user,
                                      privacyPolicy: "",
                                    },
                                  });
                                } else {
                                  this.setState({
                                    user: {
                                      ...user,
                                      privacyPolicy: e.target.value,
                                    },
                                  });
                                }
                              }}
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
                          <div className="btns-group view_bottoma mt-3">
                            {this.state.loader ? (
                              <Button
                                variant="info"
                                className="w-100 p-3"
                                disabled
                              >
                                <Spinner animation="border" /> Saving...
                              </Button>
                            ) : (
                              <Button
                                className="btn btn-prev"
                                variant="secondary"
                                onClick={(e) => this.handleSubmit(e)}
                                disabled={
                                  !user.privacyPolicy ||
                                  !user.password ||
                                  !user.firstName ||
                                  !user.lastName ||
                                  !user.register_company_name ||
                                  !user.businessNumber ||
                                  !user.email
                                }
                              >
                                Next
                              </Button>
                            )}
                          </div>
                          <div className="global d-flex align-items-center justify-content-center mt-3">
                            If you are already registered then,&nbsp;&nbsp;
                            <NavLink className="login-btn" to="/login">
                              Login Here
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
