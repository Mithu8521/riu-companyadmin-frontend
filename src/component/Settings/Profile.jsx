/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import { ROLE_ID_MAPPING } from "../../_constants/constants";
import { Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProfilePicContext } from "../../contextApi/profileContext";
import { history } from "../../_helpers/history";
import { authenticationService } from "../../_services/authentication";

const ProfilePics =
  "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png";
const baseURL = config.baseURL;

export default class Profile extends Component {
  static contextType = ProfilePicContext;
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      editMode: false,
      isLoaded: false,
      loading: false,
      firstName: "",
      lastName: "",
      location: "",
      resetPasswordEmail: "",
      email: "",
      type: "password",
      type1: "password",
      passwordMatch: false,
      businessNumber: "",
      sectorofInterests: "",
      userCategory: "",
      register_company_name: "",
      main_country_of_operations: "",
      company_industry: "",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsSBgd6D0Z4z-80aTULxvtHFwQ9ayNTYqmcQ&usqp=CAU",
      position: "",
      no_of_users: "",
      password: "",
      confirmPassword: "",
      id: "",
      allCountriesItems: [],
      permissionMenu: [],
      titleOrPositionsItems: [],
      showChangePasswordPopup: false,
      headOfficeFalse: false,
      headOfficeTrue: false,
    };
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    this.handleUpdatPosition = this.handleUpdatPosition.bind(this);
    this.showHide = this.showHide.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleChangePasswordClose = () => {
    this.setState({
      showChangePasswordPopup: false,
      password: "",
      confirmPassword: "",
      passwordMatch: false,
    });
  };
  AudienceOptions = [
    { label: "Permanent Employee", value: "EMPLOYEES_PERMANENT" },
    { label: "Other than Permanent Employee", value: "EMPLOYEES_TEMPORARY" },
    { label: "Permanent Worker", value: "WORKERS_PERMANENT" },
    { label: "Other than Permanent Worker", value: "WORKERS_TEMPORARY" },
    { label: "KMP", value: "KMP" },
    { label: "BOD", value: "BOD" },
    { label: "Customer", value: "CUSTOMERS" },
    { label: "Supplier", value: "SUPPLIERS" },
    { label: "Distributor", value: "DISTRIBUTORS" },
  ];

  handleChangePasswordShow = () => {
    this.setState({ showChangePasswordPopup: true });
  };
  // setContextValue = (newValue) => {
  //   this.context.setValue(newValue);
  // };
  async uploadProfilePicture(url) {
    const body = {
      filename: url,
    };
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}uploadProfilePictureOrAttachment`,
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      let beforeThis = data.data.split(":")[0];
      // this.setContextValue(data?.data);
      // setProfilePicture();
      this.setState({
        logo: beforeThis != "https" ? ProfilePics : data?.data,
      });
    }
  }

  handleFileUpload = async (formData) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.AUTH_API_URL_COMPANY}uploadFile?current_role=${localStorage.getItem("role")}`,
        {},
        formData,
        "POST"
      );

      if (isSuccess && data?.data?.url) {
        this.uploadProfilePicture(data.data.url);
      } else {
        console.error('No url found for uploaded profile picture');
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  onFileChange = (event) => {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${event.target.files[0]?.name}`;
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("fileName", fileName);
    formData.append("filePath", "yasil/");
    this.handleFileUpload(formData);
  };

  async handleConfirmPassword(e, password) {
    if (password === "password") {
      this.setState({ password: e.target.value });
    } else {
      this.setState({ confirmPassword: e.target.value });
    }
    if (this.state.confirmPassword) {
      const camparevallue =
        password === "password"
          ? this.state.confirmPassword
          : this.state.password;
      if (camparevallue === e.target.value) {
        this.setState({ passwordMatch: true });
      } else {
        this.setState({ passwordMatch: false });
      }
    }
    if (password !== "password") {
      if (this.state.password === e.target.value) {
        this.setState({ passwordMatch: true });
      } else {
        this.setState({ passwordMatch: false });
      }
    }
  }
  logout() {
    authenticationService.logout();
    history.push("/#/");
    localStorage.clear();
    window.location.reload();
  }
  async handlePasswordChange() {
    this.setState({ loading: true });
    if (this.state.passwordMatch) {
      const { isSuccess, data } = await apiCall(
        config.POSTLOGIN_API_URL_COMPANY + "changePassword",
        {},
        {
          password: this.state.password,
        },
        "POST"
      );
      this.setState({ loading: false });
      if (isSuccess) {
        this.logout();
      }
    }
  }
  async updateProfileForUser(data) {
    const { isSuccess } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + "updateUserProfile",
      {},
      {
        data,
      },
      "POST"
    );
    if (isSuccess) {
    }
  }
  async handleUpdateProfile(event) {
    const inputValue = event.target.value;
    const spaceIndex = inputValue.indexOf(" ");
    if (spaceIndex !== -1) {
      this.setState({
        firstName: inputValue.slice(0, spaceIndex),
        lastName: inputValue.slice(spaceIndex + 1),
      });
      this.updateProfileForUser({
        firstName: inputValue.slice(0, spaceIndex),
        lastName: inputValue.slice(spaceIndex + 1),
      });
    } else {
      this.setState({
        firstName: inputValue,
        lastName: "",
      });
      this.updateProfileForUser({
        firstName: inputValue,
        lastName: "",
      });
    }
  }
  async handleUpdatPosition(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    const body = {
      [name]: value,
    };
    this.updateProfileForUser({
      [name]: value,
    });
  }

  async getPosition() {
    const { isSuccess, data, error } = await apiCall(
      config.BASE_URL + "getTitleOrPositions",
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({
        titleOrPositionsItems: data.titleOrPositions,
      });
    }
  }

  async componentDidMount() {
    const userId = Number(localStorage.getItem("user_temp_id"));
    const { isSuccess, data, error } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY
      }getProfileData?userId=${userId}&role_id=${ROLE_ID_MAPPING[localStorage.getItem("role")]
      }`
    );
    let beforeThis = data?.user?.profile_picture?.split(":")[0];
    if (isSuccess) {
      const headOfficeTrue = data?.user?.Location.filter(
        (location) => location.head_Office === true
      );
      const headOfficeFalse = data?.user?.Location.filter(
        (location) => location.head_Office === false
      );
      this.setState({
        isLoaded2: true,
        id: data.user?.id,
        headOfficeTrue: headOfficeTrue.length > 0,
        headOfficeFalse: headOfficeFalse.length > 0,
        firstName: data.user?.first_name,
        lastName: data.user?.last_name,
        email: data.user?.email,
        location: data.user?.Location,
        country: data.user?.country,
        businessNumber: data.user?.business_number,
        category: data.user?.categoryId,
        department: data.user?.departmentId,
        businessUnit: data.user?.businessUnit,
        division: data.user?.division,
        sectorofInterests: data.user?.sectorofInterests,
        userCategory: data.user?.user_category,
        register_company_name: data.user?.register_company_name,
        main_country_of_operations: data.user?.country,
        company_industry: data.user?.company_industry,
        logo:
          data.user?.profile_picture === null && beforeThis != "https"
            ? ProfilePics
            : data.user?.profile_picture,
        position: data.user?.position,
        no_of_users: data.user?.no_of_users,
      });
    } else {
      this.setState({
        isLoaded2: true,
        error,
      });
    }

    this.getPosition();
    const settingsMenu = JSON.parse(localStorage.getItem("menu"));
    const settingsObject = settingsMenu.find(
      (item) => item.caption === "Settings"
    );
    const settingsSubMenu = settingsObject ? settingsObject.sub_menu : [];
    const list = settingsSubMenu.find(
      (item) => item.caption === "Profile Management"
    )?.permissions;
    this.setState({
      permissionMenu: list,
    });
  }

  showHide = (password) => {
    if (password === "password") {
      this.setState((prevState) => ({
        type: prevState.type === "input" ? "password" : "input",
      }));
    } else {
      this.setState((prevState) => ({
        type1: prevState.type1 === "input" ? "password" : "input",
      }));
    }
  };
  handleEditClick() {
    // Toggle the edit mode
    console.log(this.state.editMode);
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
    }));
  }
  render() {
    const {
      firstName,
      lastName,
      businessNumber,
      category,
      department,
      businessUnit,
      division,
      register_company_name,
      company_industry,
      position,
      location,
      id,
      permissionMenu,
    } = this.state;

    return (
      <div className="main-body">
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            paddingLeft: "2rem",
            paddingRight: "2rem",

            height: "85vh",
            width: "100%",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              className="card border-0"
              style={{
                width: "85%",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center text-center">
                  <div
                    className="upload_image"
                    style={{ height: "30vh", width: "30vh", border: "none" }}
                  >
                    <img
                      className="file-upload-image"
                      style={{ height: "30vh", width: "30vh" }}
                      src={
                        this.state.logo
                          ? this.state.logo.replace(
                            "https://riu-bucket.s3.ap-south-1.amazonaws.com",
                            "https://copyadatafromawstoazure.blob.core.windows.net/uploads/uploads"
                          )
                          : (
                            <Skeleton
                              circle
                              height="100%"
                              containerClassName="avatar-skeleton"
                            />
                          )
                      }

                      alt="your image"
                    />
                    <input
                      type="file"
                      name="uploadImage"
                      data-id={id}
                      onChange={(event) => {
                        // Check if the user has permission to update the profile picture
                        if (
                          permissionMenu.some(
                            (permission) =>
                              permission.permissionCode === "UPDATE_PROFILE_PICTURE" &&
                              permission.checked
                          )
                        ) {
                          this.onFileChange(event); // Call the file change handler
                        } else {
                          console.warn("Permission denied to update profile picture");
                        }
                      }}
                      title="Change Image"
                    />
                  </div>

                  <div
                    className="mt-3"
                    style={{ textAlign: "left", marginLeft: "5%" }}
                  >
                    <div>
                    <h4
                      className="m-0 "
                      style={{ marginLeft: "0px", paddingLeft: "0px" }}
                    >
                      <input
                        type="text"
                        style={{
                          border: "none",
                          textAlign: "left",
                          color: "#11546f",
                          fontWeight: "bold",
                          fontSize: "24px",
                          marginBottom: "1%",
                          padding: "0",
                        }}
                        value={firstName + " " + lastName}
                        onChange={
                          permissionMenu.some(
                            (permission) =>
                              permission.permissionCode === "UPDATE_NAME" &&
                              permission.checked
                          )
                            ? this.handleUpdateProfile
                            : () => { }
                        }
                      // readOnly={!editMode}
                      />
                      {/* <i
                        className="fas fa-pen-square"
                        title="Edit Name"
                        onClick={this.handleEditClick}
                      ></i> */}
                    </h4>
                    </div>
                   
                    <p className="text-secondary m-0 edit_section_box_detail">
                      <input
                        type="text"
                        style={{
                          border: "none",
                          // textAlign: "center",
                          fontSize: "16px",
                          padding: "0",
                        }}
                        value={position}
                        readOnly
                      />
                      {/* <select
                        style={{
                          border: "none",
                          textAlign: "center",
                          padding: "0",
                        }}
                        className="form-control input-height"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="position"
                        value={position}
                        onChange={this.handleUpdatPosition}
                      >
                        <option value="" disabled>
                          Please Select Title or Position
                        </option>
                        {this.state.titleOrPositionsItems.map((item, key) => (
                          <option key={key} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-pen-square" title="Edit Designation"></i> */}
                    </p>
                    <p className="font-size-sm">{this.state.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="directly" style={{ width: "15%" }}>
              {permissionMenu.some(
                (permission) =>
                  permission.permissionCode === "CHANGE_PASSWORD" &&
                  permission.checked
              ) && (
                  <button
                    className=""
                    style={{
                      border: "2px solid #3F88A5",
                      color: "#3F88A5",
                      padding: "10px 20px",
                      background: "white",
                      borderRadius: "7px",
                      marginTop: "40%",
                    }}
                    onClick={this.handleChangePasswordShow}
                  >
                    Change Password
                  </button>
                )}
            </div>
          </div>
          <Row>
            <Col md={12}>
              <div className="card border-0">
                <div className="card-body">
                  <form name="form">
                    <Row className="align-items-center">
                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          className="form-control input-height"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Company Name"
                          style={{
                            background: "white",
                            overflow: "auto",
                            border: "1px solid #3f88a5", 
                            borderRadius: "8px"
                          }}
                          name="register_company_name"
                          value={register_company_name}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          className="form-control input-height"
                          aria-describedby="emailHelp"
                          style={{
                            background: "white",
                            overflow: "auto",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          name="main_country_of_operations"
                          value={"India"}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Business Number
                        </label>
                        <input
                          type="tel"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          placeholder="businessNumber"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          maxLength={9}
                          name="businessNumber"
                          value={businessNumber}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Category
                        </label>
                        <input
                          type="tel"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          placeholder="Category"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          maxLength={9}
                          name="category"
                          value={this.AudienceOptions.find(option => option.value === category)?.label || category}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Department
                        </label>
                        <input
                          type="tel"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          placeholder="Department"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          maxLength={9}
                          name="department"
                          value={department}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Business Unit
                        </label>
                        <input
                          type="tel"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          placeholder="Business Unit"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          maxLength={9}
                          name="businessUnit"
                          value={businessUnit}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Division
                        </label>
                        <input
                          type="tel"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          placeholder="Division"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          maxLength={9}
                          name="division"
                          value={division}
                          readOnly
                        />
                      </Col>

                      <Col md={4} className="text-secondary mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          style={{
                            color: "#11546f",
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                          }}
                        >
                          Industry
                        </label>
                        <input
                          type="text"
                          className="form-control input-height"
                          id="exampleInputPassword1"
                          aria-describedby="emailHelp"
                          style={{
                            background: "white",
                            border: "1px solid #3f88a5",
                            borderRadius: "8px"
                          }}
                          name="company_industry"
                          value={company_industry}
                          readOnly
                        />
                      </Col>

                      {this.state.headOfficeTrue && (
                        <Col sm={12}>
                          <div
                            style={{
                              color: "#11546f",
                              fontSize: "24px",
                              fontWeight: "bold",
                              marginBottom: "15px",
                            }}
                          >
                            Corporate Headquarters Address{" "}
                          </div>

                          {location &&
                            location.map((location) => {
                              return (
                                <>
                                  {location?.head_Office === true ? (
                                    <>
                                      <input
                                        type="text"
                                        className="form-control input-height"
                                        id="exampleInputPassword1"
                                        aria-describedby="emailHelp"
                                        style={{
                                          background: "white",
                                          border: "1px solid #3f88a5",
                                          borderRadius: "8px"
                                        }}
                                        name="company_industry"
                                        value={
                                          JSON.parse(location.location).area +
                                          ", " +
                                          JSON.parse(location.location).city +
                                          ", " +
                                          JSON.parse(location.location).state +
                                          ", " +
                                          JSON.parse(location.location).country +
                                          ", " +
                                          JSON.parse(location.location).zipCode
                                        }
                                        readOnly
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            })}
                        </Col>
                      )}

                      {this.state.headOfficeFalse && (
                        <Col sm={12}>
                          <Table bordered striped hover>
                            <thead>
                              <tr style={{ background: "#ccc" }}>
                                <th>Sr.</th>
                                <th>
                                  <b>Regional Office Address </b>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {location &&
                                location.map((location, index) => {
                                  return (
                                    <tr>
                                      {location?.head_Office === false ? (
                                        <>
                                          <td>{index}</td>
                                          <td>
                                            {JSON.parse(location.location).area +
                                              ", " +
                                              JSON.parse(location.location).city +
                                              ", " +
                                              JSON.parse(location.location).state +
                                              ", " +
                                              JSON.parse(location.location).country +
                                              ", " +
                                              JSON.parse(location.location).zipCode}
                                          </td>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </Table>
                        </Col>
                      )}
                    </Row>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Modal
          show={this.state.showChangePasswordPopup}
          onHide={this.handleChangePasswordClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Form.Label>Reset Password</Form.Label>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mx-3">
              <Form.Group
                as={Col}
                md="12"
                className="mb-3"
                controlId="validationCustom01"
                style={{ position: "relative" }}
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={this.state.type}
                  className="form-control name_nf"
                  id="exampleInputPassword1"
                  placeholder="Enter password for Change"
                  name="password"
                  value={this.state.password}
                  required
                  onChange={(e) => this.handleConfirmPassword(e, "password")}
                // onChange={(e) =>
                //   this.setState({ password: e.target.value })
                // }
                />
                <div className="eye-under">
                  <span onClick={() => this.showHide("password")}>
                    {this.state.type === "input" ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </span>
                </div>
              </Form.Group>

              <Form.Group
                as={Col}
                md="12"
                className="mb-3"
                controlId="validationCustom01"
                style={{ position: "relative" }}
              >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  className="form-control name_nf"
                  type={this.state.type1}
                  required
                  name="confirmPassword"
                  placeholder="Enter Confirm Password"
                  value={this.state.confirmPassword}
                  onChange={(e) => this.handleConfirmPassword(e, "conPassword")}
                />
                {this.state.confirmPassword &&
                  (this.state.passwordMatch ? (
                    <div className="green" mt-2>
                      The password and confirmation password match successfully
                    </div>
                  ) : (
                    <div className="red mt-2">Passwords do not match</div>
                  ))}
                  
                <div className="eye-under">
                  <span onClick={() => this.showHide("confirmPassword")}>
                    {this.state.type1 === "input" ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </span>
                </div>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="new_button_style__reject"
              onClick={this.handleChangePasswordClose}
            >
              Cancel
            </button>
            {this.state?.loading ? (
              <button className="new_button_style" disabled>
                <Spinner animation="border" /> Updating...
              </button>
            ) : (
              <button
                type="submit"
                className="new_button_style"
                disabled={!this.state.passwordMatch}
                onClick={this.handlePasswordChange}
              >
                <b>Update Password</b>
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
