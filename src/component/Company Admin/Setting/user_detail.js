/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Swal from "sweetalert2";
import React, { Component } from "react";
import { sweetAlert } from '../../../utils/UniversalFunction'
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import config from "../../../config/config.json";
import axios from "axios";

import { authenticationService } from "../../../_services/authentication";
const baseURL = config.baseURL;
const currentUser = authenticationService.currentUserValue;
const ProfilePics =
  "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png";

export default class user_detail extends Component {
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
      items: [],
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      password: "",
      logo: "",
      submitted: false,
      id: "",
      uuid: "",
      isChecked: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  onFileChange = (event) => {
    let id = event.target.getAttribute("data-id");
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "uploadImage",
      event.target.files[0],
      event.target.files[0].name
    );
    formData.append("id", id);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(config.API_URL + `uploadProfilePictureWIthId?current_role=${localStorage.getItem("role")}`, formData, {
        headers,
      })
      .then((response) => {
        sweetAlert('success', response.data.message)
        this.setState({ logo: response.data.data });
      })
      .catch(function (response) {
        sweetAlert('error', response.data.message)
      });
  };



  deleteUser = (event) => {
    let id = event.target.getAttribute("data-id");
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    Swal.fire({
      title: "Do you want to delete this user?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      // denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            config.API_URL + "deleteUser",
            {
              id: id,
              current_role: localStorage.getItem("role"),
            },
            {
              headers,
            }
          )
          .then((response) => {
            sweetAlert('success', response.data.message)
            const pushToRoute = "/Setting_Sub_Admin";
            setTimeout(() => {
              window.location.href = baseURL + pushToRoute;
            }, 1000);
          })
          .catch(function (response) {
            sweetAlert('error', "User already assigned any module")
          });
      } else if (result.isDenied) {
        sweetAlert('info', "User Safe")
      }
    });
  };

  updateUserStatus = (event) => {
    let id = this.state.id;
    let isChecked = event.target.checked;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    let isActiveVal;
    if (isChecked === true) {
      isActiveVal = 1;
    } else {
      isActiveVal = 0;
    }
    axios.post(`${config.API_URL}updateUserStatus`,
      {
        id: id,
        status: isActiveVal,
        current_role: localStorage.getItem("role"),
      },
      {
        headers
      }
    )
      .then((response) => {
        sweetAlert('success', response.data.message)
        this.setState({ isChecked: isActiveVal === 1 ? true : false });
      })
      .catch(function (response) {
        sweetAlert('error', response.message)
      });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { firstName, lastName, position, id, password, email } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "updateProfileWithId",
        {
          first_name: firstName,
          last_name: lastName,
          position: position,
          password: password,
          email: email,
          id: id,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data.message)
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message)
        }
      });
  }

  componentDidMount() {
    let url = window.location.pathname.split("/");
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "getProfileDataWithId",
        {
          uuid: url.at(-1),
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        this.setState({
          firstName: response.data.user.firstName ?? "",
          lastName: response.data.user.lastName ?? "",
          email: response.data.user.email ?? "",
          position: response.data.user.position ?? "",
          id: response.data.user.id ?? "",
          logo:
            response.data.user.logo === null
              ? ProfilePics
              : config.BASE_URL + response.data.user.logo,
          isChecked: response.data.user.isActive === 1 ? true : false,
        });
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message)
        }
      });
  }

  render() {
    const { firstName, lastName, position, email, id, logo } =
      this.state;

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
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          <div className="color_div_step">
                            <div className="include">
                              <div className="row forms">
                                <div className="heading">
                                  <h4 className="font-heading">Sub Accounts Details</h4>
                                  <div className="text-right index">
                                    {/* <span>
                                      <i className="fa fa-edit mx-3"></i>
                                    </span> */}
                                    {/* <span>
                                      <i
                                        data-id={id}
                                        onClick={this.deleteUser}
                                        className="fas fa-trash mx-3"
                                      ></i>
                                    </span> */}
                                    <div className="impa ml-3">
                                      <label className="switch">
                                        <input type="checkbox" onChange={(e) =>
                                          this.updateUserStatus(e)
                                        } checked={this.state.isChecked} />
                                        <span className="slider round"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <hr className="line mt-3"></hr>
                                <div className="col-md-8 col-xs-12">
                                  <form
                                    name="form"
                                    onSubmit={this.handleSubmit}
                                  >
                                    <div className="business_detail">
                                      <div className="row my-3">
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              First Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="firstName"
                                              onChange={this.handleChange}
                                              value={firstName}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Last Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="lastName"
                                              onChange={this.handleChange}
                                              value={lastName}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Title or Position
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control disableddd"
                                              name="position"
                                              disabled
                                              onChange={this.handleChange}
                                              value={position}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-xs-6">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Corporate Email
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control disableddd"
                                              disabled
                                              name="email"
                                              onChange={this.handleChange}
                                              value={email}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-xs-12">
                                          <div className="form-group pb-3">
                                            <label htmlFor="exampleInputPassword1">
                                              Reset password
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control"
                                              id="exampleInputPassword1"
                                              placeholder="Enter password for Change or leave this field"
                                              name="password"
                                              onChange={this.handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="global_link mx-0">

                                      <a
                                        data-id={id}
                                        onClick={this.deleteUser}
                                        className="link_bal_next delete"
                                      >
                                        Delete
                                      </a>

                                      <button
                                        type="submit"
                                        className="new_button_style mx-3"
                                      >
                                        Save
                                      </button>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    </div>
                                  </form>
                                </div>
                                <div className="col-lg-4 col-xs-12">
                                  <div className="upload_image">
                                    <img
                                      className="file-upload-image"
                                      src={logo}
                                      alt="your image"
                                    />
                                    <input
                                      className=""
                                      type="file"
                                      name="uploadImage"
                                      data-id={id}
                                      onChange={this.onFileChange}
                                    />
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
