/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import image16 from "../../../../img/image 16.png";
import image17 from "../../../../img/image 17.png";
import image18 from "../../../../img/image 18.png";
import "./training.css";
import SlickSlider from "../../../Slider/slickSlider";
import { authenticationService } from "../../../../_services/authentication";
import config from "../../../../config/config.json";
import { Button, Modal } from "semantic-ui-react";
import { ExternalLink } from 'react-external-link';
const currentUser = authenticationService.currentUserValue;

export default class training extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      items: [],
      title: [],
      video_link: [],
    };
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }
  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password"
    });
  }

  onClose() {
    this.setState({
      setOpen: false
    });
  }
  setOpen(event) {
    this.setState({
      setOpen: true
    });
  }

  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(config.API_URL + `blogs?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: false,
            items: data?.result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
          });
        }
      );

    let uri = window.location.pathname.split("/");
    let category = uri[1];
    fetch(config.API_URL + `getIntroductionVideosbyLink/${category}?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            title: (result.introductionVideo.length > 0) ? result.introductionVideo[0].title : '',
            video_link: (result.introductionVideo.length > 0) ? result.introductionVideo[0].video_link : '',
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

  render() {
    const { items, title, video_link } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introductionweq">
                        <div className="text_Parts">
                          <h5 className="governance_head font-heading"> Training
                            {/* <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span> */}
                          </h5>
                          <div className="text_ntroduction">
                            <p className=" regularly_ava">
                              Our training section is updated regularly with education about new features on the platform, industry events, webinars and articles and unique opportunities available exclusively to our members.
                            </p>
                          </div>
                          <Modal open={this.state.setOpen} className="iframe_modal">
                            <Modal.Header>{title}</Modal.Header>
                            <div className="video_esg">
                              <iframe src={video_link} frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"></iframe>
                            </div>
                            <Modal.Actions>
                              <Button className="mx-3" onClick={() => this.onClose(false)}>
                                Close
                              </Button>
                            </Modal.Actions>
                          </Modal>
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="row_two_tte">
                                <div className="color_div_main">
                                  <div className="three_box">
                                    <div className="row">
                                      <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                        {/* <!-- Card --> */}
                                        <ExternalLink
                                          href="https://lms.zais.tech/dashboard/"
                                          className="card_anchor"
                                        >
                                          <article className="card animated fadeInUp">
                                            <div className="card-block image">
                                              <h6 className="text-muted">
                                                Academy
                                              </h6>
                                            </div>
                                            <div className="four_box">
                                              <img
                                                className="imagev_icon"
                                                src={image16}
                                                alt=""
                                              />
                                            </div>
                                            <div className="card-block">
                                              <div className="text_bill">
                                                <p className="card-text card_white">
                                                  New to the platform?
                                                </p>
                                                <p className="card-text card_white">
                                                  Get started with our Introductory video Courses.
                                                </p>
                                              </div>
                                            </div>
                                          </article>
                                        </ExternalLink>
                                        {/* <!-- .end Card --> */}
                                      </div>
                                      <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                        {/* <!-- Card --> */}
                                        <NavLink
                                          to="/coaching_form"
                                          className="card_anchor"
                                        >
                                          <article className="card animated fadeInUp op">
                                            <div className="card-block image">
                                              <h6 className="text-muted">
                                                Coaching
                                              </h6>
                                            </div>
                                            <div className="four_box">
                                              <img
                                                className="imagev_icon"
                                                src={image17}
                                                alt=""
                                              />
                                            </div>
                                            <div className="card-block">
                                              <div className="text_bill">
                                                <p className="card-text card_white">
                                                  Find your coach accelerate your learning reporting.
                                                </p>
                                                {/* <!--  <p className="card-text">Find your coach and<br> accelerate your learning<br> and reporting.</p> --> */}
                                              </div>
                                            </div>
                                          </article>
                                        </NavLink>
                                        {/* <!-- .end Card --> */}
                                      </div>
                                      <div className="col-xxl-4 col-lg-6 col-md-12 col-12">
                                        {/* <!-- Card --> */}
                                        <ExternalLink
                                          href="https://lms.zais.tech/dashboard/"
                                          className="card_anchor"
                                        >
                                          <article className="card animated fadeInUp oplo">
                                            <div className="card-block image">
                                              <h6 className="text-muted">
                                                Continuing Professional Development
                                              </h6>
                                            </div>
                                            <div className="four_box">
                                              <img
                                                className="imagev_icon"
                                                src={image18}
                                                alt=""
                                              />
                                            </div>
                                            <div className="card-block">
                                              <div className="text_bill">
                                                <p className="card-text card_white">
                                                  See content exclusively for our members
                                                </p>
                                              </div>
                                            </div>
                                          </article>
                                        </ExternalLink>
                                        {/* <!-- .end Card --> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- secord_two --> */}
                  <div className="redlop">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="Introductionweqw">
                          <div className="text_Parts">
                            <div className="text_ntroduction">
                              <h4 className="ticels font-heading">Media</h4>
                            </div>
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="row_two_tte">
                                  <div className="color_div_main">
                                    <div className="three_boxio">
                                      {/* <!-- slider --> */}
                                      <SlickSlider itemss={items} />
                                      <br />
                                      {/* <!-- slider --> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
