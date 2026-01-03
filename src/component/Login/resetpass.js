import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { apiCall } from "../../_services/apiCall";
import logo from "../../img/Zais_logo.png";
import config from "../../config/config.json";
import env from "../../env";
import "./login.css";

export default class ResetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLoginMethod: "email",
      user: {
        email: "",
        employeeId: "",
      },
      submitted: false,
      captchaIsVerified: false,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      user: {
        ...this.state.user,
        [name]: value,
      },
    });
  }

  handleVerification() {
    this.setState({
      captchaIsVerified: true,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true, loading: true });

    const { user, selectedLoginMethod } = this.state;
    const identifier = user[selectedLoginMethod];

    if (!identifier) {
      this.setState({ loading: false });
      return;
    }

    const payload =
      selectedLoginMethod === "email"
        ? { email: user.email }
        : { employeeId: user.employeeId };

    const { isSuccess } = await apiCall(
      config.AUTH_API_URL_COMPANY + "resetPassword",
      {},
      payload,
      "POST"
    );

    this.setState({ loading: false });

    if (isSuccess) {
      setTimeout(() => {
        this.props.history.push("/reset_massage");
      }, 1000);
    }
  }

  render() {
    const { user, submitted, selectedLoginMethod, loading } = this.state;

    return (
      <div>
        <Row>
          <Col md={7}>
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

                  <label className="st_name mb-3 mt-3">
                    Please enter your registered Email or Employee ID to reset your RIU password.
                  </label>

                  <div className="d-flex gap-3 mb-3">
                    <Button
                      variant={selectedLoginMethod === 'email' ? 'primary' : 'outline-primary'}
                      className="flex-fill"
                      onClick={() =>
                        this.setState({
                          selectedLoginMethod: "email",
                          user: { email: "", employeeId: "" },
                        })
                      }
                      type="button"
                    >
                      📧 Email ID
                    </Button>
                    <Button
                      variant={selectedLoginMethod === 'employeeId' ? 'primary' : 'outline-primary'}
                      className="flex-fill"
                      onClick={() =>
                        this.setState({
                          selectedLoginMethod: "employeeId",
                          user: { email: "", employeeId: "" },
                        })
                      }
                      type="button"
                    >
                      🆔 Employee ID
                    </Button>
                  </div>

                  <form name="form" onSubmit={this.handleSubmit}>
                    <div className="ster_form">
                      <div className="make_form">
                        <div className="form_sign">
                          <div className="form-group fg">
                            <label className="st_name">
                              {selectedLoginMethod === "email"
                                ? "Email"
                                : "Employee ID"}
                            </label>
                            <input
                              className="form-control mb-3 p-3"
                              type="text"
                              name={selectedLoginMethod}
                              placeholder={`Enter your ${selectedLoginMethod}`}
                              value={user[selectedLoginMethod]}
                              onChange={this.handleChange}
                            />
                            {submitted && !user[selectedLoginMethod] && (
                              <div className="help-block text-danger">
                                {selectedLoginMethod === "email"
                                  ? "Email"
                                  : "Employee ID"}{" "}
                                is required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Optional Captcha */}
                      {/* <div className="make_form">
                        <ReCAPTCHA
                          sitekey={env.GOOGLE_RECAPTCHA_SITE_KEY}
                          onChange={this.handleVerification}
                        />
                      </div> */}

                      <div className="row my-4">
                        <div className="col-md-6">
                          <NavLink to="/Login">
                            <Button variant="info" className="w-100 p-3">
                              <b>Back to Login</b>
                            </Button>
                          </NavLink>
                        </div>
                        <div className="col-md-6">
                          {loading ? (
                            <Button variant="info" className="w-100 p-3" disabled>
                              <Spinner animation="border" /> Sending...
                            </Button>
                          ) : user[selectedLoginMethod] ? (
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
                        </div>
                      </div>
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
