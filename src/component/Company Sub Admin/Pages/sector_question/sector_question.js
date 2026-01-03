/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { Button, Modal } from "react-bootstrap";
import "./sector_question_fast.css";
import AssignSubAdminComponent from "../SmallComponents/assignSubAdmin";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      industryDescription: [],
      title: [],
      video_link: [],
    };
    this.getIndustryDescriptionByID =
      this.getIndustryDescriptionByID.bind(this);
    this.getProfileData = this.getProfileData.bind(this);
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
      type: this.state.type === "password" ? "input" : "password",
    });
  }

  onClose() {
    this.setState({
      setOpen: false,
    });
  }
  setOpen(event) {
    this.setState({
      setOpen: true,
    });
  }

  getProfileData() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      `${config.API_URL}getProfileData?userId=${localStorage.getItem(
        "user_temp_id"
      )}&current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            id: result.user[0]?.id,
          });
          this.getIndustryDescriptionByID(this.state.id);
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );
  }

  getIndustryDescriptionByID(id) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.API_URL +
      `getIndustryDescriptionByID/${id}?current_role=${localStorage.getItem(
        "role"
      )}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            industryDescription: result.IndustryDescription,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    this.getProfileData();
    this.getIndustryDescriptionByID();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(
      config.API_URL +
      `getIndustryDescription?current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            description:
              result?.description?.description === null
                ? "Description not found"
                : result?.description?.description,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    let uri = window.location.pathname.split("/");
    let category = uri[1];
    fetch(
      config.API_URL +
      `getIntroductionVideosbyLink/${category}?current_role=${localStorage.getItem(
        "role"
      )}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            title:
              result.introductionVideo.length > 0
                ? result.introductionVideo[0].title
                : "",
            video_link:
              result.introductionVideo.length > 0
                ? result.introductionVideo[0].video_link
                : "",
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
    const { title, video_link } = this.state;
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
                      <div className="color_div_on framwork_2">
                        <div className="text_Parts">
                          <div className="text_Description">
                            <div className="esg-reporting mb-3">
                              <h5 className="motor font-heading">
                                Introduction
                                {/* <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span> */}
                              </h5>
                              {currentUser.data.role === "company_admin" && (
                                <div className="form_x mb-3">
                                  <AssignSubAdminComponent tableName="sector_question" />
                                </div>
                              )}
                            </div>
                            <div className="row">
                              <div className="col-xxl-12 col-lg-12 col-md-12 col-12">
                                <p className="specialize">
                                  {this.state.description}
                                  {this.state.industryDescription}
                                </p>
                              </div>
                              <Modal
                                open={this.state.setOpen}
                                className="feedback2 feedback3 iframe_modal"
                              >
                                <Modal.Header>{title}</Modal.Header>
                                <div className="video_esg">
                                  <iframe
                                    src={video_link}
                                    frameborder="0"
                                    webkitallowfullscreen="true"
                                    mozallowfullscreen="true"
                                    allowfullscreen="true"
                                  ></iframe>
                                </div>
                                <Modal.Actions>
                                  <Button
                                    className="mx-3"
                                    onClick={() => this.onClose(false)}
                                  >
                                    Close
                                  </Button>
                                </Modal.Actions>
                              </Modal>
                            </div>
                          </div>
                          <div className="directly p-0 mt-4">
                            <NavLink
                              className="link_bal_next"
                              to="/Social_Capital"
                            >
                              Next
                            </NavLink>
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
