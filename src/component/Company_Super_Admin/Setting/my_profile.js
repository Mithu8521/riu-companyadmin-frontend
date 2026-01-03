import React, { Component } from "react";
import config from "../../../config/config.json";
import axios from "axios";
import Swal from "sweetalert2";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import { authenticationService } from "../../../_services/authentication";
const ProfilePics = "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png"
const baseURL = config.baseURL;
const currentUser = authenticationService.currentUserValue;

export default class MyProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      login: false,
      isLoaded: false,
      firstName: "",
      lastName: "",
      email: "",
      logo: "",
      id: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.serverRequest = this.serverRequest.bind(this);

  }



  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { firstName, lastName, email } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "updateProfile",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data.message);
        setTimeout(() => {
          window.location.href = baseURL + "/admin/Setting-Detail";
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message);
        }
      });
  }

  onFileChange = (event) => {
    // let id = event.target.getAttribute("data-id");
    const formData = new FormData();
    // Update the formData object
    formData.append(
      "uploadImage",
      event.target.files[0],
      event.target.files[0].name
    );

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(config.API_URL + `uploadProfilePicture?current_role=${localStorage.getItem("role")}`, formData, { headers })
      .then((response) => {
        sweetAlert('success', response.data.message);
        this.setState({ logo: response.data.data });
        this.serverRequest()
      })
      .catch(function (response) {
        sweetAlert('error', response.data.message);
      });
  };

  serverRequest() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.ADMIN_API_URL + `settings?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            firstName: data.result[0]?.firstname,
            lastName: data.result[0]?.lastname,
            email: data.result[0]?.email,
            logo:
              data.result1[0]?.logo === null
                ? { ProfilePics }
                : config.BASE_URL + data.result1[0]?.logo,
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
    this.serverRequest()
  }

  render() {
    const { firstName, lastName, email, logo, id } = this.state;
    return (
      <div>
        <section className="forms">
          <div className="row">
            <div className="col-md-8 col-xs-12">
              <form name="form" onSubmit={this.handleSubmit}>
                <div className="business_detail">
                  <div className="heading">
                    <h4>Admin Details</h4>
                  </div>
                  <hr className="line"></hr>

                  <div className="row">
                    <div className="col-lg-6 col-xs-6">
                      <div className="form-group pb-3">
                        <label htmlFor="exampleInputPassword1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="First Name"
                          name="firstName"
                          onChange={this.handleChange}
                          value={firstName}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-xs-6">
                      <div className="form-group pb-3">
                        <label htmlFor="exampleInputPassword1">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Last name"
                          name="lastName"
                          onChange={this.handleChange}
                          value={lastName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group pb-3">
                    <label htmlFor="exampleInputEmail1">Corporate Email</label>
                    <input
                      type="email"
                      className="form-control disableddd"
                      id="exampleInputPassword1"
                      placeholder="Email Address"
                      disabled
                      name="email"
                      onChange={this.handleChange}
                      value={email}
                    />
                  </div>
                </div>
                <div className="global_link mx-0 my-3">
                  <button type="submit" className="new_button_style">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-4 col-xs-12">
              <div className="upload_image">
                <img className="file-upload-image" src={logo} alt="" />
                <input
                  type="file"
                  name="uploadImage"
                  data-id={id}
                  onChange={this.onFileChange}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
