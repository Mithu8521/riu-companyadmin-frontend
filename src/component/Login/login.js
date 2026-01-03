// Modified login.js file with Login Method Selection
import { initSocket } from '../header/socketClient.js';
import Swal from "sweetalert2";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./login.css";
import logo from "../../img/Zais_logo.png";
import "../sidebar/common.css";
import config from "../../config/config.json";
import { authenticationService } from "../../_services/authentication";
import { setStore } from "../../utils/UniversalFunction";
import env from "../../env";
import { BehaviorSubject } from "rxjs";
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import { apiCall } from "../../_services/apiCall";
import { Button, Col, Row, Spinner, Form } from "react-bootstrap";
import Eye from "../../img/eye-icon.png";
import EyeCross from "../../img/eye-icon-cross.png";
import LoginImages from "../../img/login-image.jpg";

const baseURL = config.baseURL;

export default class signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLoginMethod: "email", // Default to email login
      user: {
        email: "",
        employeeId: "",
        password: "",
        firstname: "",
        lastname: "",
        isLoggedIn: false,
        userInfo: {
          name: "",
          emailId: "",
        },
      },
      captchaIsVerified: false,
      type: "password",
      submitted: false,
      captchaVerification: false,
      loading: false,
      showOtpVerification: false,
      otp: "",
      otpError: "",
      otpLoading: false,
      verificationData: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handleOtpChange = this.handleOtpChange.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.handleLoginMethodChange = this.handleLoginMethodChange.bind(this);
  }

  static contextType = PermissionMenuContext;

  // Handle login method selection
  handleLoginMethodChange(method) {
    this.setState({
      selectedLoginMethod: method,
      user: {
        ...this.state.user,
        email: "", // Clear email field
        employeeId: "" // Clear employee ID field
      }
    });
  }

  // Validate credentials based on selected login method
  validateCredentials() {
    const { selectedLoginMethod, user } = this.state;

    if (selectedLoginMethod === 'email') {
      if (!user.email || user.email.trim() === '') {
        return { isValid: false, message: 'Please enter your email address' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
      }
    } else {
      if (!user.employeeId || user.employeeId.trim() === '') {
        return { isValid: false, message: 'Please enter your Employee ID' };
      }

      // Validate employee ID format (customize based on your requirements)
      const employeeIdRegex = /^[A-Za-z0-9]{3,20}$/;
      if (!employeeIdRegex.test(user.employeeId)) {
        return { isValid: false, message: 'Please enter a valid Employee ID (3-20 alphanumeric characters)' };
      }
    }

    if (!user.password || user.password.trim() === '') {
      return { isValid: false, message: 'Please enter your password' };
    }

    return { isValid: true };
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password",
    });
  }

  handleVerification() {
    this.setState({
      captchaIsVerified: true,
    });
  }

  logout = (response) => {
    let userInfo = {
      name: "",
      emailId: "",
    };
    this.setState({ userInfo, isLoggedIn: false });
  };

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  handleOtpChange(event) {
    this.setState({
      otp: event.target.value,
      otpError: ""
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ loading: true });

    let currentUserSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem("currentUser"))
    );

    localStorage.removeItem("currentUser");
    currentUserSubject.next(null);

    this.setState({ submitted: true });
    const { user, selectedLoginMethod } = this.state;

    // Validate credentials
    const validation = this.validateCredentials();
    if (!validation.isValid) {
      this.setState({ loading: false });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: validation.message,
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }

    let referenceData = window.localStorage.getItem("reference");
    const result = this.props.match.params?.token?.includes('&')
      ? this.props.match.params?.token?.split('&')[0]
      : this.props.match.params?.token;

    // Prepare login payload based on selected login method
    const loginPayload = {
      password: user.password,
      token: result,
      reference: referenceData,
      userType: 'TRAINEE'
    };

    // Add appropriate field based on selected login method
    if (selectedLoginMethod === 'email') {
      loginPayload.email = user.email.trim();
    } else {
      loginPayload.employeeId = user.employeeId.trim();
    }

    const { isSuccess, data } = await apiCall(
      `${config.AUTH_API_URL_COMPANY}${this.props.match.params?.token ? 'loginTrainee' : 'login'}`,
      {
        Portaltype: "COMPANY",
      },
      loginPayload,
      "POST"
    );

    this.setState({ loading: false });

    if (isSuccess) {
      this.setState({ verificationData: data });

      // Check if 2FA is enabled
      if (data?.twoFaStatus) {
        this.sendOtpRequest(data);
      } else {
        this.completeLogin(data);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: data?.message || "Invalid credentials",
        showConfirmButton: true,
        timer: 3000,
      });
    }
  }

  async sendOtpRequest(data) {
    try {
      this.setState({ otpLoading: true });

      const { selectedLoginMethod, user } = this.state;

      // Prepare OTP payload
      const otpPayload = {
        userId: data?.user?.dataValues?.id
      };

      // Add appropriate identifier field
      if (selectedLoginMethod === 'email') {
        otpPayload.email = user.email.trim();
      } else {
        otpPayload.employeeId = user.employeeId.trim();
      }

      const { isSuccess, data: otpData } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}sendOtp`,
        {},
        otpPayload,
        "POST"
      );

      this.setState({ otpLoading: false });

      if (isSuccess) {
        this.setState({ showOtpVerification: true });

        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: `Please check your ${selectedLoginMethod === 'email' ? 'email' : 'registered contact'} for the OTP`,
          showConfirmButton: true,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to send OTP",
          text: otpData?.message || "Please try again",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      this.setState({ otpLoading: false });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send OTP. Please try again.",
        showConfirmButton: true,
      });
    }
  }

  async verifyOtp() {
    const { otp, verificationData, selectedLoginMethod, user } = this.state;

    if (!otp || otp.length !== 6) {
      this.setState({ otpError: "Please enter a valid 6-digit OTP" });
      return;
    }

    try {
      this.setState({ otpLoading: true });

      // Prepare verification payload
      const verifyPayload = {
        otp: otp,
        userId: verificationData?.user?.dataValues?.id
      };

      // Add appropriate identifier field
      if (selectedLoginMethod === 'email') {
        verifyPayload.email = user.email.trim();
      } else {
        verifyPayload.employeeId = user.employeeId.trim();
      }

      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}verifyOtp`,
        {},
        verifyPayload,
        "POST"
      );

      this.setState({ otpLoading: false });

      if (isSuccess) {
        this.completeLogin(verificationData);
      } else {
        this.setState({ otpError: data?.message || "Invalid OTP" });
      }
    } catch (error) {
      this.setState({
        otpLoading: false,
        otpError: "Failed to verify OTP. Please try again."
      });
    }
  }

  async resendOtp() {
    const { verificationData } = this.state;
    if (verificationData) {
      this.sendOtpRequest(verificationData);
    }
  }

  // inside class methods
completeLogin(data) {
  Swal.fire({
    icon: "success",
    title: "Login Successful",
    text: data.message,
    showConfirmButton: true,
    timer: 1000,
  });

  let setResponse = {};
  setResponse.data = data;

  localStorage.setItem("tmpcurrentUser", JSON.stringify(setResponse));
  localStorage.setItem(
    "token",
    JSON.stringify(data?.token).replaceAll('"', "")
  );
  localStorage.setItem(
    "user_temp_id",
    JSON.stringify(data?.user.dataValues?.company_id)
  );
  localStorage.setItem("role", "company");
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      ...data?.user?.dataValues,
      is_head: data?.is_head,
      hasValidPlan: data.hasValidPlan,
    })
  );
  localStorage.setItem("menu", JSON.stringify(data?.menu));
  authenticationService.currentUserSubject.next(setResponse);

try {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const userId = currentUser?.id;
  if (userId) {
    const s = initSocket(userId); 
    
    s?.emit('addUser'); 
  }
} catch (err) {
  console.warn('Socket init failed on login', err);
}

  let rendarUrl = data?.menu[0]?.url;
  let pushToRoute = "/#/" + rendarUrl;
  let finalLink = baseURL + pushToRoute;

  setTimeout(() => {
    window.location.href = finalLink;
  }, 1000);
}

  // Check if form is valid for submission
  isFormValid() {
    const { selectedLoginMethod, user } = this.state;

    if (selectedLoginMethod === 'email') {
      return user.email && user.password;
    } else {
      return user.employeeId && user.password;
    }
  }

  // Get current identifier value based on selected method
  getCurrentIdentifier() {
    const { selectedLoginMethod, user } = this.state;
    return selectedLoginMethod === 'email' ? user.email : user.employeeId;
  }

  render() {
    const { token } = this.props.match.params;
    const {
      user,
      submitted,
      type,
      showOtpVerification,
      otp,
      otpError,
      otpLoading,
      selectedLoginMethod
    } = this.state;

    return (
      <div>
        <Row>
          <Col md={7} style={{ overflow: "hidden" }}>
            <video
              ref={(ref) => (this.videoRef = ref)}
              autoPlay
              loop
              muted
              className="video-background"
            >
              <source
                src="https://copyadatafromawstoazure.blob.core.windows.net/uploads/f6.mp4"
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
                    <img src={logo} alt="logo" className="w-50" />
                  </div>
                  <p className="text-center">
                    <b>Sign in to gain access</b>
                  </p>

                  {!showOtpVerification ? (
                    // Login Form
                    <form name="form" onSubmit={this.handleSubmit}>
                      <div className="ster_form">
                        {/* Login Method Selection */}
                        <div className="form_sign mb-4">
                          <label className="st_name mb-3">
                            Choose Login Method
                          </label>
                          <div className="d-flex gap-3 mb-3">
                            <Button
                              variant={selectedLoginMethod === 'email' ? 'primary' : 'outline-primary'}
                              className="flex-fill"
                              onClick={() => this.handleLoginMethodChange('email')}
                              type="button"
                            >
                              📧 Email ID
                            </Button>
                            <Button
                              variant={selectedLoginMethod === 'employeeId' ? 'primary' : 'outline-primary'}
                              className="flex-fill"
                              onClick={() => this.handleLoginMethodChange('employeeId')}
                              type="button"
                            >
                              🆔 Employee ID
                            </Button>
                          </div>
                        </div>

                        {/* Conditional Input Field */}
                        <div className="form_sign">
                          <div className="form-group">
                            {selectedLoginMethod === 'email' ? (
                              <>
                                <label className="st_name" htmlFor="email">
                                  Email Address
                                </label>
                                <input
                                  className="form-control mb-3 p-3"
                                  type="email"
                                  name="email"
                                  id="email"
                                  placeholder="Enter your email address"
                                  value={user.email}
                                  onChange={this.handleChange}
                                  autoComplete="email"
                                />
                              </>
                            ) : (
                              <>
                                <label className="st_name" htmlFor="employeeId">
                                  Employee ID
                                </label>
                                <input
                                  className="form-control mb-3 p-3"
                                  type="text"
                                  name="employeeId"
                                  id="employeeId"
                                  placeholder="Enter your Employee ID"
                                  value={user.employeeId}
                                  onChange={this.handleChange}
                                  autoComplete="username"
                                />
                              </>
                            )}
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="form_sign password-eye">
                          <div className="img-eye">
                            <span onClick={this.showHide}>
                              {this.state.type === "input" ? (
                                <img src={EyeCross} alt="Hide password" />
                              ) : (
                                <img src={Eye} alt="Show password" />
                              )}
                            </span>
                          </div>
                          <div className="form-group">
                            <label className="st_name" htmlFor="password">
                              Password
                            </label>
                            <input
                              className="form-control mb-3 p-3"
                              type={type}
                              name="password"
                              id="password"
                              placeholder="Enter your password"
                              value={user.password}
                              onChange={this.handleChange}
                              autoComplete="current-password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <span>
                          Forgot Password?
                          <NavLink to="/ResetPass"> Reset </NavLink>
                        </span>
                      </div>

                      <Row className="my-4">
                        <Col>
                          {this.state.loading ? (
                            <Button variant="info" className="w-100 p-3" disabled>
                              <Spinner animation="border" size="sm" /> Logging in...
                            </Button>
                          ) : this.isFormValid() ? (
                            <Button
                              type="submit"
                              className="w-100 p-3"
                              variant="info"
                            >
                              <b>Login with {selectedLoginMethod === 'email' ? 'Email' : 'Employee ID'}</b>
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              className="w-100 p-3"
                              disabled
                            >
                              <b>Enter Credentials to Login</b>
                            </Button>
                          )}
                        </Col>
                        {token && (
                          <div className='text-center mt-2'>
                            <h5>
                              Don't have an account?
                              <NavLink
                                to={`/trainee_registration/${token}`}
                                style={{ color: "#3F88A5", cursor: 'pointer' }}
                              >
                                Sign Up
                              </NavLink>
                            </h5>
                          </div>
                        )}
                        {this.props.location?.pathname.includes('trainee_login') && (
                          <div className='text-center mt-2'>
                            <h5>
                              Don't have an account?
                              <NavLink
                                to={`/trainee_registration`}
                                style={{ color: "#3F88A5", cursor: 'pointer' }}
                              >
                                Sign Up
                              </NavLink>
                            </h5>
                          </div>
                        )}

                      </Row>
                    </form>
                  ) : (
                    // OTP Verification Form
                    <div>
                      <div className="text-center mb-4">
                        <h4>OTP Verification</h4>
                        <p>
                          We've sent a verification code to your{" "}
                          {selectedLoginMethod === 'email' ? 'email address' : 'registered contact'}
                        </p>
                        <small className="text-muted">
                          <strong>Login Method:</strong> {selectedLoginMethod === 'email' ? 'Email' : 'Employee ID'}
                          <br />
                          <strong>Identifier:</strong> {this.getCurrentIdentifier()}
                        </small>
                      </div>

                      <div className="form-group mb-4">
                        <label className="st_name" htmlFor="otp">
                          Enter 6-digit OTP
                        </label>
                        <input
                          className="form-control mb-2 p-3 text-center"
                          type="text"
                          name="otp"
                          id="otp"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={this.handleOtpChange}
                          maxLength="6"
                          pattern="[0-9]{6}"
                        />
                        {otpError && (
                          <div className="text-danger small">{otpError}</div>
                        )}
                      </div>

                      <Row className="mb-3">
                        <Col>
                          {otpLoading ? (
                            <Button variant="info" className="w-100 p-3" disabled>
                              <Spinner animation="border" size="sm" /> Verifying...
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              className="w-100 p-3"
                              variant="info"
                              onClick={this.verifyOtp}
                              disabled={!otp || otp.length !== 6}
                            >
                              <b>Verify OTP</b>
                            </Button>
                          )}
                        </Col>
                      </Row>

                      <div className="text-center">
                        <p className="mb-2">
                          Didn't receive code?{" "}
                          <span
                            style={{ color: "#3F88A5", cursor: "pointer", textDecoration: "underline" }}
                            onClick={this.resendOtp}
                          >
                            Resend OTP
                          </span>
                        </p>
                        <p>
                          <span
                            style={{ color: "#3F88A5", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => this.setState({
                              showOtpVerification: false,
                              otp: "",
                              otpError: ""
                            })}
                          >
                            ← Back to Login
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}