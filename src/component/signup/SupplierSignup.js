import React, { useEffect, useState } from 'react'
import {
  checkPasswordValidation,
  isValidEmail
} from "../../utils/UniversalFunction";
import { NavLink, Link, useLocation } from "react-router-dom";
import { sweetAlert } from "../../../src/utils/UniversalFunction";
import axios from "axios";
import logo from "../../img/Zais_logo.png";
import config from "../../config/config.json";
import { setStore } from "../../utils/UniversalFunction";
import ReactTooltip from "react-tooltip";
import { apiCall } from "../../_services/apiCall";
const baseURL = config.baseURL;

export default function SupplierSignup(props) {
  const [registerCompanyName, setRegisterCompanyName] = useState();
  const { location } = useLocation();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [type, setType] = useState("password");
  const [country, setCountry] = useState();
  const [allCountryData, setAllCounteryData] = useState([]);
  const [titleOrPositionsData, setTitleOrPositionsData] = useState([]);
  const [industryCategoriesData, setIndustryCategoriesData] = useState([]);
  const [industriesOfCategoryIdData, setIndustriesOfCategoryIdData] = useState([]);
  const [error, setError] = useState();
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [inviteData, setInviteData] = useState();
  const [emailvalidation, setEmailvalidation] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [submitted, setSubmited] = useState(false);
  const [businessNumber, setBussinessNumber] = useState();
  const [industry_Category, setIndustry_Category] = useState();
  const [companyIndustryId, setCopmanyIndustryId] = useState();
  const [conpanyIndusrtyTitle, setCompanyIndustryTitle] = useState();
  // const [position,setPosition] = useState();
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [reference_id, setreference_id] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [mobile, setMobile] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    findRedrenceId();
    getAllIndustryCategory();
    GetSupplierInvitationDetails();
  }, []);

  const GetSupplierInvitationDetails = async () => {
    const parts = props.location?.pathname?.split('/');

    const { isSuccess, data } = await apiCall(
      `${config.BASE_URL}getSupplierInvitationDetails`,
      {},
      {
        request_id: parts[2],
      }
    );
    if (isSuccess) {
      setInviteData(data?.data[0]?.invite_data)
      setFirstName(data?.data[0]?.invite_data?.first_name)
      setLastName(data?.data[0]?.invite_data?.last_name)
      setRegisterCompanyName(data?.data[0]?.invite_data?.company_name)
      setMobile(data?.data[0]?.invite_data?.mobile)
      setEmail(data?.data[0]?.invite_data?.email)
      setCompanyIndustryTitle(data?.data[0]?.invite_data?.company_industry)
    }

  };


  const findRedrenceId = () => {
    const parts = props.location?.pathname?.split('/');
    setreference_id(parts[2]);

  }
  const getSubIndustry = (id) => {
    fetch(config.BASE_URL + `getIndustriesOfCategoryId/?id=${id}&current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIndustriesOfCategoryIdData(result.companyIndustry);
        },

        (error2) => {
          setError(error2)
        }
      );
  }
  const showHide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this?.setState({
      type: this?.state?.type === "password" ? "input" : "password"
    });
  }


  const getAllIndustryCategory = () => {
    fetch(config.BASE_URL + `getIndustryCategories?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIndustryCategoriesData(result.industry_Category);

        },

        (error2) => {
          setError(error2);
        }
      );
  }
  const emailValidationHandler = (e) => {
    setEmail(e.target.value);
    let condition = isValidEmail(e.target.value);
    if (condition === true) {
      setEmailvalidation(true);
      setEmailValidationMessage('');

    } else {
      setEmailvalidation(false);
      setEmailValidationMessage('Please check email format');
    }
  }

  const handleIndustryCategory = (e) => {
    getSubIndustry(e.target.value);
  }

  const handleChangeForCompanyIndustry = (e) => {
    const value = e.target.value?.split('-');
    setCopmanyIndustryId(value[0]);
    setCompanyIndustryTitle(value[1]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmited(true);
    if (
      firstName &&
      lastName &&
      email &&
      mobile &&
      password
    ) {
      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL}signup`,
        {},
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          register_company_name: registerCompanyName,
          password: password,
          company_industry: conpanyIndusrtyTitle,
          company_industry_id: companyIndustryId,
          request_id: reference_id,
          business_number: businessNumber,
          country: "IN",
          user_type_code: "supplier",
          position: "position",
          source: source,
        },
        "POST"
      )
      if (isSuccess) {
        const pushToRoute = "/#/verify_message";
        let finalLink = "";
        if (data.link) {
          finalLink = data.link;
          setStore("reference", "");
        } else {
          finalLink = baseURL + pushToRoute;
        }
        setTimeout(() => {
          window.location.href = pushToRoute;
        }, 2000);
      }
      //   axios
      //     .post(config.AUTH_API_URL + "signupSupplier", {
      //       first_name: firstName,
      //       last_name: lastName,
      //       email: email,
      //       company_name:registerCompanyName,
      //       password: password,
      //       company_industry: conpanyIndusrtyTitle,
      //       company_industry_id: companyIndustryId,
      //       request_id:reference_id,
      //       mobile:mobile
      //     })
      //     .then((response) => {
      //       sweetAlert("success", response.data.message);
      //       console.log(response);
      //       let setResponse = {};
      //       setResponse.data = response.data;
      //       const pushToRoute = "/#/verify_message";
      //       let finalLink = "";
      //       if (response.data.link) {
      //         finalLink = response.data.link;
      //         setStore("reference", "");
      //       } else {
      //         finalLink = baseURL + pushToRoute;
      //       }
      //       setTimeout(() => {
      //         window.location.href = pushToRoute;
      //       }, 2000);
      //     })
      //     .catch(function (error) {
      //       console.log(error)
      //       if (error.response) {
      //         sweetAlert("error", error.response.data.message);
      //       }
      //     });
      // } else {
      //   sweetAlert("error", "Please fill all input");
    }
  }

  const passwordValidationHandler = (e) => {
    if (e.target.name === "password") {
      let condition = checkPasswordValidation(e.target.value);
      if (condition === true) {
        setPasswordValidation(true);
        setPasswordValidationMessage('');
      } else {

        setPasswordValidation(false);
        setPasswordValidationMessage(condition);
      }
    }
  }
  return (
    <div>
      <section className="login">
        <div className="login_part signup_middle">
          <div className="sing_log">
            <div className="sing_one mb-3">
              <img src={logo} alt="logo" />
            </div>
            <form name="form">
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
                            (submitted && !registerCompanyName
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
                            id="registerCompanyName"
                            type="text"
                            name="registerCompanyName"
                            value={registerCompanyName}
                            onChange={(e) => {
                              setRegisterCompanyName(e.target.value);
                            }}
                          />
                          {submitted && !registerCompanyName && (
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
                              (submitted && !firstName ? " has-error" : "")
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
                              value={firstName}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                              }}
                            />
                            {submitted && !firstName && (
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
                              (submitted && !lastName ? " has-error" : "")
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
                              value={lastName}
                              onChange={(e) => {
                                setLastName(e.target.value)
                              }}
                            />
                            {submitted && !lastName && (
                              <div className="help-block">
                                Last Name is required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="make_form">
                        <div
                          className={
                            "form-group fg" +
                            (submitted && !email ? " has-error" : "")
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
                            value={email}
                            readOnly
                            autocomplete="off"
                            placeholder="Enter Email Address"
                            onChange={(e) => {
                              emailValidationHandler(e)
                            }}
                          />
                          {emailvalidation === false && (
                            <div className="help-block">
                              {emailValidationMessage}
                            </div>
                          )}
                          {submitted && !email && (
                            <div className="help-block">Email is required</div>
                          )}
                        </div>
                      </div>

                      <div className="make_form">
                        <div
                          className={
                            "form-group fg eye-frame" +
                            (submitted && !password ? " has-error" : "")
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
                            value={password}
                            onChange={(e) => {
                              passwordValidationHandler(e);
                              setPassword(e.target.value)
                            }}
                          />
                          {passwordValidation === false && (
                            <div className="help-block">
                              {passwordValidationMessage}
                            </div>
                          )}
                          {submitted && !password && (
                            <div className="help-block">Password is required</div>
                          )}
                          <span className="eye-under" onClick={showHide}>
                            {type === "input" ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div className="make_form">
                  <div
                    className={
                      "form-group fg" +
                      (submitted && !businessNumber
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
                      name="business"
                      id="business"
                      value={businessNumber}
                      onChange={(e) => {
                        setBussinessNumber(e.target.value)
                      }}
                    />
                    {submitted && !businessNumber && (
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
                      (submitted && !mobile
                        ? " has-error"
                        : "")
                    }
                  >
                    <label className="st_name" htmlFor="name">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter business number"
                      className="form-control name_nf select_map"
                      name="mobile"
                      maxLength="10"
                      id="mobile"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value)
                      }}
                    />
                    {submitted && !mobile && (
                      <div className="help-block">
                        Mobile Number is required
                      </div>
                    )}
                  </div>
                </div>
                <div className="form_sign">
                  <div
                    className={
                      "form-group fg" +
                      (submitted && !source ? " has-error" : "")
                    }
                  >
                    <label className="st_name" htmlFor="name">
                      Source
                    </label>
                    <input
                      className="form-control input-height"
                      required
                      placeholder="Enter Source Name"
                      id="source"
                      type="text"
                      name="source"
                      value={source}
                      onChange={(e) => {
                        setSource(e.target.value)
                      }}
                    // readOnly={this.state.invitation}
                    />
                    {submitted && !source && (
                      <div className="help-block">
                        Source is required
                      </div>
                    )}
                  </div>
                </div>
                <div className="make_form">
                  <div
                    className={
                      "form-group fg" +
                      (submitted && !companyIndustryId
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
                      onChange={(e) => {
                        handleIndustryCategory(e)
                      }}
                    >
                      <option value="">
                        Please Select Industry Type
                      </option>
                      {industryCategoriesData?.length > 0 && industryCategoriesData?.map((item) => (
                        <option value={item?.id}>{item?.name}</option>
                      ))}
                    </select>

                    <select
                      name="industryId"
                      id="industryId"
                      placeholder="Select Company Industry"
                      onChange={(e) =>
                        handleChangeForCompanyIndustry(e)
                      }
                      className="form-control name_nf select_map my-3"
                    >
                      <option value="" disabled selected>
                        Please Select Company Industry
                      </option>

                      {industriesOfCategoryIdData.length > 0 && industriesOfCategoryIdData?.map((item) => (
                        <option value={item.industryId + '-' + item.title}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    {submitted && !companyIndustryId && (
                      <div className="help-block">Company is required</div>
                    )}
                  </div>
                </div>
                {/* <div className="make_form">
                          <div
                            className={
                              "form-group fg" +
                              (submitted && !industryCategoriesData ? " has-error" : "")
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
                              value={conpanyIndusrtyTitle}
                              onChange={(e) =>{
                                setCompanyIndustryTitle(e.target.value)
                              }}
                            />
                            {submitted && !conpanyIndusrtyTitle && (
                              <div className="help-block">
                                Company Name is required
                              </div>
                            )}
                          </div>
                        </div> */}

                <div className="mb-3 text">
                  <input
                    type="checkbox"
                    name="privacyPolicy"
                    onChange={(e) => {
                      setPrivacyPolicy(e.target.value)
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
                  <button
                    type="submit"
                    value="Submit"
                    id="submit-form"
                    className="btn btn-prev"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Register
                  </button>
                </div>
                <div className="global d-flex justify-content-center my-3">
                  If you are already registered then,&nbsp;&nbsp;
                  <NavLink className="login-btn" to="/login">
                    Login Here
                  </NavLink>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
