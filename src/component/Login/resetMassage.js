import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../img/Zais_logo.png";
import "../sidebar/common.css";
import { Button, Col, Row } from "react-bootstrap";
import LoginImages from "../../img/login-image.jpg";

export default class ResetMassage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.videoRef.autoplay = true;
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={7}>
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
                  <div className="text_sing">
                    <p className="massage m-0 mt-2">
                      Check your email for the password reset link.
                    </p>
                    <p className="massage m-0">
                      If not received, check your spam folder.
                    </p>
                    <p className="massage m-0 mb-4">
                      If you remember your password, click Login.
                    </p>
                    <NavLink to="/login">
                      <Button className="w-100 p-3" variant="info">
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
