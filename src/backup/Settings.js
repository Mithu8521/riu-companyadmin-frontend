/* eslint-disable jsx-a11y/img-redundant-alt */
import Swal from "sweetalert2"
import React, { Component, useContext, useEffect } from "react"
import config from "../config/config.json"
import axios from "axios"
import { NavLink } from "react-router-dom"
import Sidebar from "../component/sidebar/sidebar"
import Header from "../component/header/header"
import { authenticationService } from "../_services/authentication"
import "./working_progress.css"
import { apiCall } from "../_services/apiCall"
import { PermissionMenuContext } from "../contextApi/permissionBasedMenuContext"
import viewCross from '../../../../img/eye-icon-cross.png'
import view from '../../../../img/eye-icon.png'
import { ROLE_ID_MAPPING } from "../_constants/constants"


const ProfilePics =
  "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png"
const baseURL = config.baseURL
const currentUser = authenticationService.currentUserValue

export default class SettingProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      firstName: "",
      lastName: "",
      email: "",
      businessNumber: "",
      sectorofInterests: "",
      userCategory: "",
      register_company_name: "",
      main_country_of_operations: "",
      company_industry: "",
      logo: "",
      position: "",
      no_of_users: "",
      password: "",
      id: "",
      allCountriesItems: [],
      titleOrPositionsItems: [],
      industryCategoryItems: [],
      authValue: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmit2 = this.handleSubmit2.bind(this)
    this.showHide = this.showHide.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }
  async uploadProfilePicture(url) {
    const body = {
      filename: url
    }
    const { isSuccess, data } = await apiCall(`${config.API_URL}uploadProfilePicture`, {}, body, "POST");
    if (isSuccess) {
      let beforeThis = data.data.split(":")[0];
      this.setState({
        logo:
          beforeThis != "https"
            ? ProfilePics
            : data?.data,

      })
    }

  }

  onFileChange = (event) => {
    const timestamp = new Date().getTime(); // Generate a timestamp
    const fileName = `${timestamp}_${event.target.files[0]?.name}`;
    const formData = new FormData()
    formData.append("file", event.target.files[0],);
    formData.append("fileName", fileName);
    formData.append("filePath", "yasil/");

    var requestOptions = {
      header: {
        "Content-Type": "multipart/form-data", // Set the Content-Type header
      },
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    fetch(`${config.AUTH_API_URL_COMPANY}uploadFile?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((response) => response.text())
      .then(async (result) => {
        let url = JSON.parse(result);
        this.uploadProfilePicture(url?.url)
      })
      .catch((error) => console.log("error", error));
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // }
    // axios
    //   .post(config.API_URL + "uploadProfilePicture", formData, { headers })
    //   .then((response) => {
    //     Swal.fire({
    //       icon: "success",
    //       title: response.data.message,
    //       showConfirmButton: false,
    //       timer: 1000,
    //     })
    //     this.setState({ logo: response.data.data })
    //     setTimeout(() => {
    //       window.location.href = baseURL + "/#/settings"
    //     }, 1000)
    //   })
    //   .catch(function (response) {
    //     Swal.fire({
    //       icon: "error",
    //       title: response.data.message,
    //       showConfirmButton: false,
    //       timer: 1000,
    //     })
    //   })
  }
  //  uploadFile = (files) => {
  //   let tempAnswers = [...answers];
  //   const selectedFile = files.target.files[0];
  //   const timestamp = new Date().getTime(); // Generate a timestamp

  //   const fileName = `${timestamp}_${selectedFile.name}`;
  //   var formdata = new FormData();
  //   formdata.append("file", selectedFile);
  //   formdata.append("fileName", fileName);
  //   formdata.append("filePath", "yasil/");

  //   var requestOptions = {
  //     header: {
  //       "Content-Type": "multipart/form-data", // Set the Content-Type header
  //     },
  //     method: "POST",
  //     body: formdata,
  //     redirect: "follow",
  //   };

  //   fetch("https://zais-documents.sapidblue.in/upload_file", requestOptions)
  //     .then((response) => response.text())
  //     .then(async (result) => {
  //       let index = uploadItem.index;
  //       let item = uploadItem.item;
  //       let url = JSON.parse(result);
  //       console.log(url);
  //       if (tempAnswers.length) {
  //         let check = tempAnswers.findIndex(
  //           (value) => value.question_id == item.id
  //         );
  //         console.log(check);
  //         if (check !== -1) {
  //           tempAnswers[check]["proof_document"] = url?.url;
  //           tempAnswers[check]["status"] = true;

  //           await setAnswers(tempAnswers);
  //         } else {
  //           let tempObj = {
  //             question_id: item?.id,
  //             question_type: item?.questionType,
  //             answer_id: -1,
  //             status: true,
  //             proof_document: url?.url,
  //           };
  //           tempAnswers.push(tempObj);
  //           console.log(tempObj);
  //           await setAnswers(tempAnswers);
  //         }
  //       }
  //     })
  //     .catch((error) => console.log("error", error));
  // };
  async handleSubmit2(event) {
    event.preventDefault()
    this.setState({ submitted: true })
    const {
      firstName,
      lastName,
      email,
      businessNumber,
      userCategory,
      register_company_name,
      main_country_of_operations,
      company_industry,
      position,
      no_of_users,
      password,
    } = this.state
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };
    const body = {
      register_company_name: register_company_name,
      main_country_of_operations: main_country_of_operations,
      business_number: businessNumber,
      company_industry: company_industry,
      user_category: userCategory,
      first_name: firstName,
      last_name: lastName,
      position: position,
      no_of_users: no_of_users,
      email: email,
      password: password,
    }
    const { isSuccess } = await apiCall(
      config.API_URL + "updateProfile",
      {},
      body,
      "POST"
    )
    if (isSuccess) {
      setTimeout(() => {
        window.location.href = baseURL + "/#/settings"
      }, 1000)
    }
    // axios
    //   .post(
    //     config.API_URL + "updateProfile",
    //     {
    //       register_company_name: register_company_name,
    //       main_country_of_operations: main_country_of_operations,
    //       business_number: businessNumber,
    //       company_industry: company_industry,
    //       user_category: userCategory,
    //       first_name: firstName,
    //       last_name: lastName,
    //       position: position,
    //       no_of_users: no_of_users,
    //       email: email,
    //       password: password,
    //     },
    //     { headers }
    //   )
    //   .then((response) => {
    //     Swal.fire({
    //       icon: "success",
    //       title: response.data.message,
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //     setTimeout(() => {
    //       window.location.href = baseURL + "/settings";
    //     }, 1000);
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       Swal.fire({
    //         icon: "error",
    //         title: error.response.data.message,
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //     }
    //   });
  }
  async handleSubmit(event) {
    event.preventDefault()
    this.setState({ submitted: true })
    const { firstName, lastName, position, email, password } = this.state
    const { isSuccess } = await apiCall(
      config.API_URL + "updateProfileForCompanySubAdmin",
      {},
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        position: position,
        password: password,
      },
      "POST"
    )
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };
    if (isSuccess) {
      setTimeout(() => {
        window.location.href = baseURL + "/#/settings"
      }, 1000)
    }
    // axios
    //   .post(
    //     config.API_URL + "updateProfileForCompanySubAdmin",
    //     {
    //       first_name: firstName,
    //       last_name: lastName,
    //       email: email,
    //       position: position,
    //       password: password,
    //     },
    //     { headers }
    //   )
    //   .then((response) => {
    //     Swal.fire({
    //       icon: "success",
    //       title: response.data.message,
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //     setTimeout(() => {
    //       window.location.href = baseURL + "/settings";
    //     }, 1000);
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       Swal.fire({
    //         icon: "error",
    //         title: error.response.data.message,
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //     }
    //   });
  }

  async componentDidMount() {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    this.setState({ authValue });
    const { isSuccess, data, error } = await apiCall(
      `${config.API_URL}getProfileData?userId=${localStorage.getItem(
        "user_temp_id"
      )}&role_id=${ROLE_ID_MAPPING[localStorage.getItem("role")]}`,
    )
    let beforeThis = data?.user[0]?.profile_picture?.split(":")[0];
    if (isSuccess) {
      this.setState({
        isLoaded2: true,
        id: data.user[0]?.id,
        firstName: data.user[0]?.first_name,
        lastName: data.user[0]?.last_name,
        email: data.user[0]?.email,
        country: data.user[0]?.country,
        businessNumber: data.user[0]?.business_number,
        sectorofInterests: data.user[0]?.sectorofInterests,
        userCategory: data.user[0]?.user_category,
        register_company_name: data.user[0]?.register_company_name,
        main_country_of_operations: data.user[0]?.country,
        company_industry: data.user[0]?.company_industry,
        logo:
          data.user[0]?.profile_picture === null && beforeThis != "https"
            ? ProfilePics
            : data.user[0]?.profile_picture,
        position: data.user[0]?.position,
        no_of_users: data.user[0]?.no_of_users,
      })
    } else {
      this.setState({
        isLoaded2: true,
        error,
      })
    }
    const {
      isSuccess: isSuccessForCountries,
      data: allCountries,
      error: error1,
    } = await apiCall(config.BASE_URL + "getAllCountries", {}, {}, "GET")
    if (isSuccessForCountries) {
      this.setState({
        isLoaded: true,
        allCountriesItems: allCountries.countries,
      })
    } else {
      this.setState({
        isLoaded: true,
        error1,
      })
    }
    const {
      isSuccess: isSuccessForTitle,
      data: TitleOrPositions,
      error: error2,
    } = await apiCall(config.BASE_URL + "getTitleOrPositions", {}, {}, "GET")
    if (isSuccessForTitle) {
      this.setState({
        isLoaded3: true,
        titleOrPositionsItems: TitleOrPositions.titleOrPositions,
      })
    } else {
      this.setState({
        isLoaded3: true,
        error2,
      })
    }
    const {
      isSuccess: isSuccessForIndustry,
      data: Industry,
      error: error3,
    } = await apiCall(config.BASE_URL + "getIndustryCategories", {}, {}, "GET")
    if (isSuccessForIndustry) {
      this.setState({
        isLoaded2: true,
        industryCategoryItems: Industry.industry_Category,
      })
    } else {
      this.setState({
        isLoaded2: true,
        error3,
      })
    }
  }

  showHide(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      type: this.state.type === "password" ? "input" : "password",
    })
  }

  render() {
    const {
      firstName,
      lastName,
      businessNumber,
      userCategory,
      register_company_name,
      main_country_of_operations,
      company_industry,
      position,
      no_of_users,
      id,
    } = this.state
    let role = JSON.parse(localStorage.getItem("currentUser"))?.user_type_code
    let isHead = JSON.parse(localStorage.getItem("currentUser")).is_head

    return (
      <PermissionMenuContext.Consumer>
        {({ userPermissionList }) => (
          <div>
            <Header />
            <Sidebar dataFromParent={this.props.location.pathname} />
            {/*  my_profile_menus */}
            <div className="main_wrapper">
              <div className="inner_wraapper pt-0">
                <div className="container-fluid">
                  <section className="d_text">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="question_type_filter">
                            <NavLink to="/" className="selected_question_type">
                              My Profile
                            </NavLink>
                            {/*<NavLink to="/Google_2FA">Two Factor Authentication</NavLink>*/}
                            {userPermissionList.includes("GET ALL SUBSCRIPTION") &&
                              role === "company" && (
                                <NavLink to="/Setting_Billing">Billing</NavLink>
                              )}
                            {userPermissionList.includes("CREATE SUB USER") && this.state.authValue?.hasValidPlan &&
                              role === "company" && (
                                <NavLink to="/sub_accounts">Sub Accounts</NavLink>
                              )}
                            {userPermissionList.includes("CREATE_METER_ID") && this.state.authValue?.hasValidPlan &&
                              role === "company" && (
                                <NavLink to="/generator">Generator</NavLink>
                              )}
                          </div>
                          <div className="main-body">
                            <div className="row">
                              <div className="col-lg-4">
                                <div className="card">
                                  <div className="card-body Introduction">
                                    <div className="d-flex flex-column align-items-center text-center">
                                      <div className="upload_image">
                                        <img className="file-upload-image" src={this.state.logo} alt="your image" />
                                        <input type="file" name="uploadImage" data-id={id} onChange={this.onFileChange} />
                                      </div>
                                      <div className="mt-3">
                                        <h4>{firstName} {lastName}</h4>
                                        <p className="text-secondary mb-1">{position}</p>
                                        <p className="font-size-sm">{this.state.email}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {isHead === 1 ? (
                                <div className="col-lg-8">
                                  <div className="card">
                                    <div className="card-body Introduction">
                                      <form name="form" onSubmit={this.handleSubmit2} >
                                        <div className="row mb-3 align-items-center">
                                          <div className="heading  mb-3">
                                            <h4>Business Details</h4>
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputEmail1">
                                              Company Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height"
                                              id="exampleInputEmail1"
                                              aria-describedby="emailHelp"
                                              placeholder="Company Name"
                                              name="register_company_name"
                                              onChange={this.handleChange}
                                              value={register_company_name}
                                            />
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputEmail1">
                                              Main Country of Operations
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              aria-describedby="emailHelp"
                                              // placeholder="Company Name"
                                              name="main_country_of_operations"
                                              // onChange={this.handleChange}
                                              value={main_country_of_operations}
                                              readOnly
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Business Number
                                            </label>
                                            <input
                                              type="tel"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="businessNumber"
                                              maxLength={9}
                                              name="businessNumber"
                                              onChange={this.handleChange}
                                              value={businessNumber}
                                            />
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Company Industry
                                            </label>
                                            <select
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              name="company_industry"
                                              onChange={this.handleChange}
                                              value={company_industry}
                                            >
                                              <option value="" disabled>
                                                Please Select Industry Type
                                              </option>
                                              {this.state.industryCategoryItems.map(
                                                (item, key) => (
                                                  <option
                                                    key={key}
                                                    value={item.id}
                                                  >
                                                    {item.name}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #d0cfcf' }} ></div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="heading my-3">
                                            <h4>Admin Details </h4>
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              First Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height "
                                              id="exampleInputPassword1"
                                              placeholder="First Name"
                                              name="firstName"
                                              onChange={this.handleChange}
                                              value={firstName}
                                            />
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Last Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="Last Name"
                                              name="lastName"
                                              onChange={this.handleChange}
                                              value={lastName}
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Title or Position
                                            </label>
                                            <select
                                              className="form-control input-height"
                                              id="exampleInputEmail1"
                                              aria-describedby="emailHelp"
                                              name="position"
                                              onChange={this.handleChange}
                                              value={position || ""}
                                              disabled={true}
                                            >
                                              <option value="" disabled>
                                                Please Select Title or Position
                                              </option>
                                              {this.state.titleOrPositionsItems.map(
                                                (item, key) => (
                                                  <option
                                                    key={key}
                                                    value={item.id}
                                                  >
                                                    {item.title}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Corporate Email
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control input-height disableddd"
                                              id="exampleInputPassword1"
                                              placeholder="Corporate Email"
                                              disabled
                                              name="email"
                                              onChange={this.handleChange}
                                              value={this.state.email}
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="col-sm-12 text-secondary" style={{ position: "relative" }}>
                                            <label htmlFor="exampleInputPassword1">
                                              Reset Password
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="Enter password for Change or leave this field"
                                              name="password"
                                              onChange={this.handleChange}
                                            />
                                            <div className="img-eye eye-passwor5d">
                                              <span onClick={this.showHide}>
                                                {this.state.type === "input" ? (
                                                  <img src={viewCross} alt="" srcSet="" />
                                                ) : (
                                                  <img src={view} alt="" srcSet="" />
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {userPermissionList.includes(
                                          "UPDATE PROFILE DATA"
                                        ) && (
                                            <div className="global_link mx-0 my-3">
                                              <button
                                                type="submit"
                                                className="new_button_style"
                                              >
                                                SAVE
                                              </button>
                                            </div>
                                          )}
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="col-lg-8">
                                  <div className="card">
                                    <div className="card-body">
                                      <form name="form" onSubmit={this.handleSubmit} >
                                        <div className="row mb-3 align-items-center">
                                          <div className="heading  mb-3">
                                            <h4>Profile Details</h4>
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              First Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="First Name"
                                              name="firstName"
                                              onChange={this.handleChange}
                                              value={firstName}
                                            />
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Last Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="Last Name"
                                              name="lastName"
                                              onChange={this.handleChange}
                                              value={lastName}
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Title or Position
                                            </label>
                                            <select
                                              className="form-control input-height"
                                              id="exampleInputEmail1"
                                              aria-describedby="emailHelp"
                                              name="position"
                                              onChange={this.handleChange}
                                              value={position || ""}
                                              disabled={true}
                                            >
                                              <option value="" disabled>
                                                Please Select Title or Position
                                              </option>
                                              {this.state.titleOrPositionsItems.map(
                                                (item, key) => (
                                                  <option
                                                    key={key}
                                                    value={item.id}
                                                  >
                                                    {item.title}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                          <div className="col-sm-6 text-secondary">
                                            <label htmlFor="exampleInputPassword1">
                                              Corporate Email
                                            </label>
                                            <input
                                              type="email"
                                              className="form-control input-height disableddd"
                                              id="exampleInputPassword1"
                                              placeholder="Corporate Email"
                                              disabled
                                              name="email"
                                              onChange={this.handleChange}
                                              value={this.state.email}
                                            />
                                          </div>
                                        </div>
                                        <div className="row mb-3 align-items-center">
                                          <div className="col-sm-12 text-secondary" style={{ position: "relative" }}>
                                            <label htmlFor="exampleInputPassword1">
                                              Reset Password
                                            </label>
                                            <input
                                              type="password"
                                              className="form-control input-height"
                                              id="exampleInputPassword1"
                                              placeholder="Enter password for Change or leave this field"
                                              name="password"
                                              onChange={this.handleChange}
                                            />
                                            <div className="img-eye eye-passwor5d">
                                              <span onClick={this.showHide}>
                                                {this.state.type === "input" ? (
                                                  <img src={viewCross} alt="" srcSet="" />
                                                ) : (
                                                  <img src={view} alt="" srcSet="" />
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {userPermissionList.includes(
                                          "UPDATE PROFILE DATA"
                                        ) && (
                                            <div className="global_link mx-0 my-3">
                                              <button
                                                type="submit"
                                                className="new_button_style"
                                              >
                                                SAVE
                                              </button>
                                            </div>
                                          )}
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              )}
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
        )}
      </PermissionMenuContext.Consumer>
    )
  }
}
