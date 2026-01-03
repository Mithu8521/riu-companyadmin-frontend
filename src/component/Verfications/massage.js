import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../img/Zais_logo.png";
import "../sidebar/common.css";
import { BehaviorSubject } from "rxjs";
import { Button, Col, Row } from "react-bootstrap";
import LoginImages from "../../img/login-image.jpg";

export default class Massage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleLoginClick = () => {
    let currentUserSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    localStorage.removeItem("currentUser");
    currentUserSubject.next(null);
  };

  componentDidMount() {
    this.videoRef.autoplay = true;
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={7} style={{ overflow: "hidden" }}>
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
          <Col md={5}>
            <section className="login">
              <div className="login_part">
                <div className="sing_log">
                  <div className="sing_one">
                    <img src={logo} alt="logo" className="w-50" />
                  </div>
                  <div className="text_sing mb-4">
                    <h4 className="Account m-0">Verify your email address</h4>
                    <p>
                      <b>
                        We've sent your login credentials to the email you
                        provided during registration.
                      </b>
                    </p>
                    <p>
                      If you're already verified, simply click the Login button.
                    </p>
                    <NavLink to="/login">
                      <Button
                        type="submit"
                        className="w-100 p-3"
                        variant="info"
                        onClick={this.handleLoginClick}
                      >
                        <b>Login</b>
                      </Button>
                    </NavLink>
                  </div>
                </div>
              </div>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}
