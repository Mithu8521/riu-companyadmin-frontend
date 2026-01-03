/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import Swal from "sweetalert2";
import React, { Component } from "react";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import { authenticationService } from "../../../../_services/authentication";
import config from "../../../../config/config.json";
import { NavLink } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../Pages/management/management.css";
// import AssignSubAdminComponent2 from "../../Pages/SmallComponents/assignSubAdmin2";
import AssignSubAdminComponent3 from "../../Pages/SmallComponents/assignSubAdmin3";
import Loader from "../../../loader/Loader";
import PolicyGapFormFieldCard from "./PolicyGapFormFieldCard";
import "./GovernancePlicy.css";
const BASE_URL = config.BASE_URL;
const baseURL = config.baseURL;
const currentUser = authenticationService.currentUserValue;

export default class GovernancePolicies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      governancePolicy: [],
      governanceSubAdminPolicy: [],
      governancePolicyGlobalData: [],
      errorMessage: [],
      policyComment: [],
      feedback: [],
      comment: "",
      policyid: [],
      user_id: "",
      id: "",
      type: "",
      uuid: "",
      setOpen: false,
      setOpen1: false,
      setOpen2: false,
      setOpen3: false,
      setOpen4: false,
      question: "",
      description: "",
      governanceTopicsId: "",
      environmentalAccess: false,
      environmentalAccess1: false,
      environmentalAccess2: false,
      policyGap: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.handleSubmit3 = this.handleSubmit3.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.getProfiledata = this.getProfiledata.bind(this);
    this.getGlobalPolicyData = this.getGlobalPolicyData.bind(this);
    this.getSubAdminPolicyData = this.getSubAdminPolicyData.bind(this);
  }

  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }

  onClose() {
    this.setState({
      setOpen: false,
      errorMessage: [],
    });
  }
  setOpen(e) {
    const idd = e.currentTarget.id;
    const details = e.target.getAttribute("data-value");
    this.setState({
      setOpen: true,
      id: idd,
      description: details,
    });
  }

  onClose1() {
    this.setState({
      setOpen1: false,
    });
  }

  setOpen1(e) {
    this.setState({
      setOpen1: true,
    });
  }

  onClose4() {
    this.setState({
      setOpen4: false,
    });
  }

  setOpen4(e) {
    let feedback = e.currentTarget.id;
    this.setState({
      setOpen4: true,
      feedback: feedback,
    });
  }

  onClose3() {
    this.setState({
      setOpen3: false,
    });
  }

  setOpen3(e) {
    let policyid = e.currentTarget.id;
    this.setState({
      setOpen3: true,
      policyid: policyid,
    });

    let commentor = this.state.user_id;

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(
      config.API_URL +
      `getGovernanceComments/${policyid}/${commentor}?current_role=${localStorage.getItem(
        "role"
      )}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: false,
            policyComment: data.data,
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

  onClose2() {
    this.setState({
      setOpen2: false,
    });
  }

  setOpen2(e) {
    const idd = e.currentTarget.id;
    const details = e.target.getAttribute("data-value");
    this.setState({
      setOpen2: true,
      id: idd,
      question: details || details ? details : "",
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit3 = (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + `sendGovernanceComments`,
        {
          governanceTopicsID: this.state.policyid,
          commentor: this.state.user_id,
          role: localStorage.getItem("role"),
          comment: this.state.comment,
          current_role: localStorage.getItem("role"),
        },
        {
          headers,
        }
      )
      .then((response) => {
        this.onClose();
        sweetAlert("success", response.data.message);
        window.location.href = baseURL + "/governance_policies";
      })
      .catch(function (response) {
        sweetAlert("error", response.data.message);
      });
  };

  handleSubmit2(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { question } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + `updatePolicy/${this.state.id}`,
        {
          type: "governancePolicy",
          question: question,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        window.location.href = baseURL + "/governance_policies";
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  handleSubmit1(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { question } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "addNewSpecificPolicy",
        {
          uuid: this.state.uuid,
          type: "governancePolicy",
          question: question,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        window.location.href = baseURL + "/governance_policies";
      })

      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "submitGovernancePolicyDescription",
        {
          governanceTopicsId: this.state.id,
          description: this.state.description,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        window.location.href = baseURL + "/governance_policies";
      })

      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  deleteUser = (event) => {
    let id = event.target.getAttribute("data-id");
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    Swal.fire({
      title: "Do you want to delete this policy?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            config.API_URL + "removeGovernancePolicy",
            {
              id: id,
              current_role: localStorage.getItem("role"),
            },
            {
              headers,
            }
          )
          .then((response) => {
            this.setState({
              isLoaded: true,
            });
            this.serverRequest();
            this.getGlobalPolicyData();
          })
          .catch(function (response) {
            sweetAlert("error", response.data.message);
          });
      } else if (result.isDenied) {
        sweetAlert("info", "User Safe");
      }
    });
  };

  onFileChange = (event) => {
    let topicId = event.target.getAttribute("data-id");
    const formData = new FormData();
    if (event.target.files[0].name !== undefined) {
      formData.append(
        "uploadImage",
        event.target.files[0],
        event.target.files[0].name
      );
      formData.append("topicId", topicId);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };
      axios
        .post(
          config.API_URL +
          `uploadGovernancePolicy?current_role=${localStorage.getItem(
            "role"
          )}`,
          formData,
          { headers }
        )
        .then((response) => {
          this.setState({
            isLoaded: true,
          });
          this.serverRequest();
          this.getGlobalPolicyData();
        })
        .catch(function (response) {
          sweetAlert("error", response.data.message);
        });
    } else {
      sweetAlert(
        "error",
        "Invalid File Format please check and try again later.."
      );
    }
  };

  serverRequest() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(
      config.API_URL +
      `getGovernanceTopics/${this.state.uuid
      }?current_role=${localStorage.getItem("role")}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: false,
            governancePolicy: data.governancePolicy,
            environmentalAccess: data.governancePolicy_Access,
          });
          console.log("governancePolicy", this.state.governancePolicy);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  getSubAdminPolicyData(user_id) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(
      config.API_URL +
      `getSubAdminPolicyData/${user_id}?current_role=${localStorage.getItem(
        "role"
      )}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: false,
            governanceSubAdminPolicy: data.governancePolicy,
            environmentalAccess2: data.governancePolicy_Access,
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

  getProfiledata() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(
      `${config.API_URL}getProfileData?userId=${localStorage.getItem(
        "user_temp_id"
      )}&current_role=${localStorage.getItem("role")}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            uuid: result.user[0]?.uuid,
            user_id: result.user[0]?.id,
          });
          this.serverRequest(this.state.uuid);
          this.getSubAdminPolicyData(this.state.user_id);
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );
  }

  plolicyGapValue(newValue) {
    this.setState({ policyGap: newValue });
  }
  getGlobalPolicyData() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(
      config.API_URL +
      `getGovernanceGlobalTopics?current_role=${localStorage.getItem(
        "role"
      )}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: false,
            governancePolicyGlobalData: data.governancePolicy,
            environmentalAccess1: data.governancePolicy_Access,
          });
          console.log(
            "governancePolicyGlobalData",
            this.state.governancePolicyGlobalData
          );
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
    this.getProfiledata();
    this.getGlobalPolicyData();
    this.getSubAdminPolicyData();
  }

  render() {
    const {
      policyComment,
      question,
      description,
      governancePolicy,
      governanceSubAdminPolicy,
      governancePolicyGlobalData,
      environmentalAccess,
      environmentalAccess1,
      environmentalAccess2,
    } = this.state;
    return (
      <div>
        {/* <div className="row setup-content" id="step-9"> */}
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        {this.state.isLoaded === true && <Loader />}
        {this.state.isLoaded === false && (
          <div className="main_wrapper">
            <div className="question_type_filter">
              <div>
                <NavLink to="#" className="selected_question_type">
                  Governance Policies
                </NavLink>
              </div>
              <div>
                <NavLink to="/Social_Policies">Social Policies</NavLink>
              </div>
              <div>
                <NavLink to="/Environmental_Policy">
                  Environmental Policy
                </NavLink>
              </div>
              <div>
                <NavLink to="/other_policies">Other Policy</NavLink>
              </div>
            </div>
            <div className="inner_wraapper pt-0">
              <div className="container-fluid">
                <section className="d_text">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="Introduction framwork_2">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-xxl-9 col-lg-7 col-md-12 col-12">
                                <h4 className="E_capital font-heading">
                                  Governance Policies &nbsp;
                                  {currentUser.data.role ===
                                    "company_admin" && (
                                      <span
                                        className="icon_hitn"
                                        onClick={(e) => this.setOpen1(e)}
                                      >
                                        {" "}
                                        <i className="fas fa-plus"></i>
                                      </span>
                                    )}
                                </h4>
                              </div>
                              {currentUser.data.role === "company_admin" && (
                                <div className="col-xxl-3 col-lg-5 col-md-12 col-12 form_x mb-3 bold">
                                  <AssignSubAdminComponent3
                                    tableName="Governance_governancePolicy"
                                    removeHeader={true}
                                  />
                                </div>
                              )}
                            </div>
                            <hr></hr>
                            <Modal
                              animation={true}
                              size="large"
                              shadow-lg="border"
                              open={this.state.setOpen1}
                              className="feedback2 feedback3 iframe_modal height_auto modal_box"
                              show={
                                this.state.showModal &&
                                this.state.activeModal === "login"
                              }
                            >
                              <div className="modal-lg">
                                <Modal.Actions>
                                  <Button
                                    className="mx-3"
                                    onClick={() => this.onClose1(false)}
                                  >
                                    <i className="fa fa-times"></i>
                                  </Button>
                                </Modal.Actions>

                                <div className="modal-body vekp pt-0">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="pb3">
                                        <h4>Add New Policy</h4>
                                        <form
                                          name="form"
                                          onSubmit={this.handleSubmit}
                                        >
                                          <div className="forms">
                                            <div className="form-group mb-3">
                                              <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label fw-bold"
                                              >
                                                Policy Name
                                              </label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                id="question"
                                                required
                                                aria-describedby="question"
                                                placeholder="Enter Policy Name"
                                                name="question"
                                                onChange={this.handleChange}
                                              />
                                            </div>
                                            <div className="cenlr">
                                              <button
                                                className="page_save page_width"
                                                to="#"
                                              >
                                                Add Policy
                                              </button>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal>

                            <Modal
                              open={this.state.setOpen1}
                              className="feedback2 feedback3 iframe_modal height_auto"
                            >
                              <Modal.Header>Add New Policy</Modal.Header>
                              <div className="video_esg">
                                <form name="form" onSubmit={this.handleSubmit1}>
                                  <div className="business_detail">
                                    <div className="container">
                                      <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xs-12">
                                          <div className="form-group policy_div">
                                            <label htmlFor="exampleInputEmail1">
                                              Policy Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="question"
                                              required
                                              aria-describedby="question"
                                              placeholder="Enter Policy Name"
                                              name="question"
                                              onChange={this.handleChange}
                                            />
                                          </div>
                                          <div className="global_link mx-0 my-3">
                                            <button
                                              type="submit"
                                              className="link_bal_next"
                                            >
                                              Add Policy
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <Modal.Actions>
                                <Button
                                  className="mx-3"
                                  onClick={() => this.onClose1(false)}
                                >
                                  Close
                                </Button>
                              </Modal.Actions>
                            </Modal>

                            <Modal
                              open={this.state.setOpen2}
                              className="feedback2 feedback3 iframe_modal height_auto"
                            >
                              <Modal.Header>Update Policy</Modal.Header>
                              <div className="video_esg">
                                <form name="form" onSubmit={this.handleSubmit2}>
                                  <div className="business_detail">
                                    <div className="container">
                                      <div className="row">
                                        <div className="col-lg-12 col-md-12 col-xs-12">
                                          <div className="form-group policy_div">
                                            <label htmlFor="exampleInputEmail1">
                                              Policy Name
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="question"
                                              required
                                              value={question}
                                              aria-describedby="question"
                                              placeholder="Enter Policy Name"
                                              name="question"
                                              onChange={this.handleChange}
                                            />
                                          </div>
                                          <div className="global_link mx-0 my-3">
                                            <button
                                              type="submit"
                                              className="link_bal_next"
                                            >
                                              Update Policy
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <Modal.Actions>
                                <Button
                                  className="mx-3"
                                  onClick={() => this.onClose2(false)}
                                >
                                  Close
                                </Button>
                              </Modal.Actions>
                            </Modal>
                            <form>
                              <div className="Statement">
                                <table>
                                  <thead
                                    style={{
                                      background: "#209ed1",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Policy Name
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Description
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Police Gap Assessment
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Governance Structure
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Implementation Mechanism
                                      </div>{" "}
                                    </th>
                                    <th>
                                      <div style={{ color: "#fff" }}>
                                        Action
                                      </div>
                                    </th>
                                  </thead>
                                  <tbody>
                                    {governancePolicyGlobalData?.map(
                                      (item, key) => (
                                        <tr key={key}>
                                          <td>
                                            <p className="statement_p">
                                              {item.question}
                                            </p>
                                          </td>
                                          <td>
                                            <span
                                              className={
                                                item.description ||
                                                  item.description
                                                  ? "descriptionData"
                                                  : "descriptionData1"
                                              }
                                              data-value={item.description}
                                              id={item.id}
                                              onClick={(e) => this.setOpen(e)}
                                            >
                                              Description
                                            </span>
                                          </td>
                                          <td>
                                            <PolicyGapFormFieldCard
                                              plolicyGapValue={
                                                this.plolicyGapValue
                                              }
                                            />
                                          </td>
                                          <td>
                                            <PolicyGapFormFieldCard
                                              plolicyGapValue={
                                                this.plolicyGapValue
                                              }
                                            />
                                          </td>
                                          <td>
                                            <PolicyGapFormFieldCard
                                              plolicyGapValue={
                                                this.plolicyGapValue
                                              }
                                            />
                                          </td>

                                          <td>
                                            <div className="Statement_two">
                                              <div className="d-flex">
                                                <span className="statement_icon d-flex align-items-center">
                                                  <div className="toast-header border-none">
                                                    {item.docsFile && (
                                                      <>
                                                        {!environmentalAccess1 && (
                                                          <></>
                                                        )}
                                                        {environmentalAccess1 && (
                                                          <button
                                                            type="button"
                                                            className="new_button_style1 close"
                                                            data-dismiss="toast"
                                                            aria-label="Close"
                                                          >
                                                            <span
                                                              data-id={
                                                                item.savedIdd
                                                              }
                                                              onClick={
                                                                this.deleteUser
                                                              }
                                                              aria-hidden="true"
                                                            >
                                                              &times;
                                                            </span>
                                                          </button>
                                                        )}
                                                      </>
                                                    )}
                                                  </div>

                                                  {(() => {
                                                    switch (item.status) {
                                                      case 0:
                                                        return (
                                                          <div className="upload_image2 d-flex align-items-center">
                                                            {item.docsFile && (
                                                              <a
                                                                href={
                                                                  BASE_URL +
                                                                  item.docsFile
                                                                }
                                                                target="_blank"
                                                                download
                                                                style={{
                                                                  color:
                                                                    "green",
                                                                }}
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </a>
                                                            )}
                                                            {!item.docsFile && (
                                                              <i
                                                                title="file not available"
                                                                className=""
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </i>
                                                            )}
                                                            {environmentalAccess1 &&
                                                              item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                                  {/* <input
                                                        type="file"
                                                        name="governancePolicy"
                                                        data-id={item.id}
                                                        onChange={
                                                          this.onFileChange
                                                        }
                                                      /> */}
                                                                </div>
                                                              )}

                                                            {environmentalAccess1 &&
                                                              !item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                  <input
                                                                    type="file"
                                                                    accept=".doc, .docx, .pdf"
                                                                    name="governancePolicy"
                                                                    data-id={
                                                                      item.id
                                                                    }
                                                                    onChange={
                                                                      this
                                                                        .onFileChange
                                                                    }
                                                                  />
                                                                </div>
                                                              )}

                                                            {!environmentalAccess1 && (
                                                              <div className="upload_image2 d-flex align-items-center">
                                                                <i
                                                                  title="Permission denied"
                                                                  className=""
                                                                >
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                </i>
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                      case 1:
                                                        return (
                                                          <div className="upload_image2 d-flex align-items-center">
                                                            {item.docsFile && (
                                                              <a
                                                                href={
                                                                  BASE_URL +
                                                                  item.docsFile
                                                                }
                                                                target="_blank"
                                                                download
                                                                style={{
                                                                  color:
                                                                    "green",
                                                                }}
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </a>
                                                            )}
                                                            {!item.docsFile && (
                                                              <i
                                                                title="file not available"
                                                                className=""
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </i>
                                                            )}
                                                            {environmentalAccess1 &&
                                                              item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                            <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                          </svg> */}
                                                                </div>
                                                              )}
                                                            {environmentalAccess1 &&
                                                              !item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                  <input
                                                                    type="file"
                                                                    name="governancePolicy"
                                                                    data-id={
                                                                      item.id
                                                                    }
                                                                    accept=".doc, .docx, .pdf"
                                                                    onChange={
                                                                      this
                                                                        .onFileChange
                                                                    }
                                                                  />
                                                                </div>
                                                              )}

                                                            {!environmentalAccess1 && (
                                                              <div className="upload_image2 d-flex align-items-center">
                                                                <i
                                                                  title="Permission denied"
                                                                  className=""
                                                                />
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                      case 2:
                                                        return (
                                                          <div className="upload_image2 d-flex align-items-center">
                                                            {item.docsFile && (
                                                              <a
                                                                href={
                                                                  BASE_URL +
                                                                  item.docsFile
                                                                }
                                                                target="_blank"
                                                                download
                                                                style={{
                                                                  color:
                                                                    "green",
                                                                }}
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </a>
                                                            )}
                                                            {!item.docsFile && (
                                                              <i
                                                                title="file not available"
                                                                className=""
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </i>
                                                            )}
                                                            {environmentalAccess1 &&
                                                              item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                            <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                          </svg> */}
                                                                </div>
                                                              )}
                                                            {environmentalAccess1 &&
                                                              !item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                  <input
                                                                    type="file"
                                                                    name="governancePolicy"
                                                                    data-id={
                                                                      item.id
                                                                    }
                                                                    accept=".doc, .docx, .pdf"
                                                                    onChange={
                                                                      this
                                                                        .onFileChange
                                                                    }
                                                                  />
                                                                </div>
                                                              )}

                                                            {!environmentalAccess1 && (
                                                              <div className="upload_image2 d-flex align-items-center">
                                                                <i
                                                                  title="Permission denied"
                                                                  className=""
                                                                />
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                      case 3:
                                                        return (
                                                          <div className="upload_image2 d-flex align-items-center">
                                                            {item.docsFile && (
                                                              <a
                                                                href={
                                                                  BASE_URL +
                                                                  item.docsFile
                                                                }
                                                                target="_blank"
                                                                download
                                                                style={{
                                                                  color:
                                                                    "green",
                                                                }}
                                                              >
                                                                <svg
                                                                  width="34"
                                                                  height="34"
                                                                  viewBox="0 0 34 34"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <path
                                                                    d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                    fill="#A7ACC8"
                                                                  />
                                                                  <path
                                                                    d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                    fill="#A7ACC8"
                                                                    stroke="#A7ACC8"
                                                                    strokeWidth="0.5"
                                                                  />
                                                                </svg>
                                                              </a>
                                                            )}
                                                            {/* {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className="fas fa-arrow-down i-can mx-2"
                                                      />
                                                    )} */}
                                                            {environmentalAccess1 &&
                                                              item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              )}
                                                            {environmentalAccess1 &&
                                                              !item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  <svg
                                                                    width="34"
                                                                    height="34"
                                                                    viewBox="0 0 34 34"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                                      fill="#A7ACC8"
                                                                    />
                                                                    <path
                                                                      d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                                      fill="#A7ACC8"
                                                                      stroke="#A7ACC8"
                                                                      strokeWidth="0.5"
                                                                    />
                                                                  </svg>
                                                                  <input
                                                                    type="file"
                                                                    name="governancePolicy"
                                                                    data-id={
                                                                      item.id
                                                                    }
                                                                    accept=".doc, .docx, .pdf"
                                                                    onChange={
                                                                      this
                                                                        .onFileChange
                                                                    }
                                                                  />
                                                                </div>
                                                              )}

                                                            {!environmentalAccess1 && (
                                                              <div className="upload_image2 d-flex align-items-center">
                                                                <i
                                                                  title="Permission denied"
                                                                  className=""
                                                                />
                                                                {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                      default:
                                                        return (
                                                          <div className="upload_image2 d-flex align-items-center">
                                                            <a
                                                              href={
                                                                BASE_URL +
                                                                item.docsFile
                                                              }
                                                              target="_blank"
                                                              download
                                                              style={{
                                                                color: "green",
                                                              }}
                                                            >
                                                              <svg
                                                                width="34"
                                                                height="34"
                                                                viewBox="0 0 34 34"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                              >
                                                                <path
                                                                  d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                                  fill="#A7ACC8"
                                                                />
                                                                <path
                                                                  d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                                  fill="#A7ACC8"
                                                                  stroke="#A7ACC8"
                                                                  strokeWidth="0.5"
                                                                />
                                                              </svg>
                                                            </a>
                                                            {environmentalAccess1 &&
                                                              item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                                </div>
                                                              )}
                                                            {environmentalAccess1 &&
                                                              !item.docsFile && (
                                                                <div className="upload_image2 d-flex align-items-center">
                                                                  {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                                  {/* <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            accept=".doc, .docx, .pdf"
                                                            data-id={item.id}
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          /> */}
                                                                </div>
                                                              )}

                                                            {!environmentalAccess1 && (
                                                              <div className="upload_image2 d-flex align-items-center">
                                                                <i
                                                                  title="Permission denied"
                                                                  className=""
                                                                />
                                                                {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                              </div>
                                                            )}
                                                          </div>
                                                        );
                                                    }
                                                  })()}
                                                  {/* {currentUser.data.role !=
                                          "company_sub_admin" && (
                                          <div className="input-group  input-fild">
                                            <AssignSubAdminComponent2
                                              tableName="governancePolicy"
                                              removeHeader={true}
                                              assignedUserId={
                                                item.assigned_user_id
                                              }
                                              assignedUserName={
                                                item.assignedUserName
                                              }
                                              idd={item.savedIdd}
                                            />
                                          </div>
                                        )} */}
                                                  <span className="statement_check">
                                                    {(() => {
                                                      switch (item.status) {
                                                        case 0:
                                                          return;
                                                        case 1:
                                                          return (
                                                            <i className="far fa-check-circle"></i>
                                                          );
                                                        case 2:
                                                          return (
                                                            <i
                                                              id={item.feedback}
                                                              onClick={(e) =>
                                                                this.setOpen4(e)
                                                              }
                                                              className="redInfo red far fa-info-circle"
                                                            ></i>
                                                          );
                                                        case 3:
                                                          return;
                                                        default:
                                                          return;
                                                      }
                                                    })()}
                                                  </span>
                                                </span>
                                                <span
                                                  className="commentIcon"
                                                  id={item.id}
                                                  onClick={(e) =>
                                                    this.setOpen3(e)
                                                  }
                                                >
                                                  {" "}
                                                  <i id={item.id} className="">
                                                    <svg
                                                      width="34"
                                                      height="34"
                                                      viewBox="0 0 34 34"
                                                      fill="none"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z"
                                                        fill="#1f9ed1"
                                                      />
                                                      <defs>
                                                        <linearGradient
                                                          id="paint0_linear_1_206"
                                                          x1="11"
                                                          y1="2.5"
                                                          x2="36"
                                                          y2="45.5"
                                                          gradientUnits="userSpaceOnUse"
                                                        >
                                                          <stop stopColor="#233076" />
                                                          <stop
                                                            offset="1"
                                                            stopColor="#3BABD6"
                                                          />
                                                        </linearGradient>
                                                      </defs>
                                                    </svg>
                                                  </i>
                                                </span>
                                              </div>
                                            </div>
                                          </td>
                                          {/* </div> */}
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                                <Modal
                                  open={this.state.setOpen}
                                  className="feedback2 feedback3 iframe_modal"
                                >
                                  <Modal.Header>Description</Modal.Header>

                                  <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-2">
                                      <div className="video_esg">
                                        <textarea
                                          className="form-control box_layout"
                                          name="description"
                                          value={description}
                                          placeholder="Leave a Description here"
                                          onChange={this.handleChange}
                                        >
                                          {description}
                                        </textarea>
                                        <span className="errorMessage">
                                          {this.state.errorMessage}
                                        </span>
                                      </div>
                                    </div>
                                    <Modal.Actions>
                                      <Button className="mx-3" type="submit">
                                        Submit
                                      </Button>
                                      <Button
                                        className="mx-3"
                                        onClick={() => this.onClose(false)}
                                      >
                                        Close
                                      </Button>
                                    </Modal.Actions>
                                  </form>
                                </Modal>
                                <Modal
                                  open={this.state.setOpen3}
                                  className="feedback2 feedback3 iframe_modal"
                                >
                                  <Modal.Header>Comments</Modal.Header>
                                  <form onSubmit={this.handleSubmit3}>
                                    <Modal.Content>
                                      <Modal.Description>
                                        <div className="commentsBox">
                                          {policyComment.map((item, key) => (
                                            <div
                                              className={
                                                item.role === "super_admin"
                                                  ? "sender"
                                                  : "receiver"
                                              }
                                            >
                                              <p
                                                className={
                                                  item.role === "super_admin"
                                                    ? "senderMessage"
                                                    : "receiverMessage"
                                                }
                                              >
                                                {item.comment}
                                                <span className="commentDate">
                                                  {moment(item.createdAt)
                                                    .utc()
                                                    .format("DD-MM-YYYY")}
                                                </span>
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                        <span className="headertitle">
                                          Please enter your comments below
                                        </span>

                                        <div className="form-group commentsBox1">
                                          <textarea
                                            name="comment"
                                            onChange={this.handleChange}
                                            className="form-control"
                                          ></textarea>
                                        </div>
                                      </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                      <Button type="submit"> Send</Button>
                                      <Button
                                        onClick={() => this.onClose3(false)}
                                      >
                                        Cancel
                                      </Button>
                                    </Modal.Actions>
                                  </form>
                                </Modal>
                                <Modal
                                  open={this.state.setOpen4}
                                  className="feedback2 feedback3 iframe_modal"
                                >
                                  <Modal.Header>Feedback</Modal.Header>

                                  <div className="commentsBox">
                                    {this.state.feedback}
                                  </div>
                                  <Modal.Actions>
                                    <Button
                                      onClick={() => this.onClose4(false)}
                                    >
                                      Close
                                    </Button>
                                  </Modal.Actions>
                                </Modal>
                                {governancePolicy.map((item, key) => (
                                  <div className="Statement_one" key={key}>
                                    <div className="Statement_2">
                                      <p className="statement_p">
                                        {item.question}
                                        <span
                                          className="icon_hitn2 descriptionIcon1"
                                          data-value={item.question}
                                          id={item.id}
                                          onClick={(e) => this.setOpen2(e)}
                                        >
                                          {" "}
                                          <i
                                            id={item.id}
                                            data-value={item.question}
                                            className="fas fa-pen-square"
                                          ></i>
                                        </span>
                                        <span
                                          className={
                                            item.description || item.description
                                              ? "descriptionData"
                                              : "descriptionData1"
                                          }
                                          data-value={item.description}
                                          id={item.id}
                                          onClick={(e) => this.setOpen(e)}
                                        >
                                          Description
                                        </span>
                                      </p>
                                    </div>
                                    <div className="Statement_two">
                                      <div className="d-flex">
                                        <div className="toast-header border-none">
                                          {item.docsFile && (
                                            <>
                                              {/* <strong className="mr-auto mr-3 text-format">
                                                <a
                                                  type="button"
                                                  className="new_button_style1 view"
                                                  data-dismiss="toast"
                                                  aria-label="view"
                                                  href={
                                                    BASE_URL + item.docsFile
                                                  }
                                                  target="_blank"
                                                >
                                                  <i className="far fa-eye"></i>
                                                </a>
                                              </strong> */}
                                              {!environmentalAccess && <></>}
                                              {environmentalAccess && (
                                                <button
                                                  type="button"
                                                  className="new_button_style1 close"
                                                  data-dismiss="toast"
                                                  aria-label="Close"
                                                >
                                                  <span
                                                    data-id={item.savedIdd}
                                                    onClick={this.deleteUser}
                                                    aria-hidden="true"
                                                  >
                                                    &times;
                                                  </span>
                                                </button>
                                              )}
                                            </>
                                          )}
                                        </div>

                                        <span className="statement_icon d-flex align-items-center">
                                          {(() => {
                                            switch (item.status) {
                                              case 0:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        {/* <i className="fas fa-download i-can mx-2" /> */}
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                          {/* <input
                                                        type="file"
                                                        name="governancePolicy"
                                                        data-id={item.id}
                                                        onChange={
                                                          this.onFileChange
                                                        }
                                                      /> */}
                                                        </div>
                                                      )}

                                                    {environmentalAccess &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            accept=".doc, .docx, .pdf"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        >
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                        </i>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 1:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 2:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 3:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {/* {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className="fas fa-arrow-down i-can mx-2"
                                                      />
                                                    )} */}
                                                    {environmentalAccess &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                        </div>
                                                      )}
                                                    {environmentalAccess &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              default:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    <a
                                                      href={
                                                        BASE_URL + item.docsFile
                                                      }
                                                      target="_blank"
                                                      download
                                                      style={{
                                                        color: "green",
                                                      }}
                                                    >
                                                      <svg
                                                        width="34"
                                                        height="34"
                                                        viewBox="0 0 34 34"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                          fill="#A7ACC8"
                                                        />
                                                        <path
                                                          d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                          fill="#A7ACC8"
                                                          stroke="#A7ACC8"
                                                          strokeWidth="0.5"
                                                        />
                                                      </svg>
                                                    </a>
                                                    {environmentalAccess &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                          {/* <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            accept=".doc, .docx, .pdf"
                                                            data-id={item.id}
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          /> */}
                                                        </div>
                                                      )}

                                                    {!environmentalAccess && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                            }
                                          })()}
                                          {/* {currentUser.data.role !=
                                          "company_sub_admin" && (
                                          <div className="input-group  input-fild">
                                            <AssignSubAdminComponent2
                                              tableName="governancePolicy"
                                              removeHeader={true}
                                              assignedUserId={
                                                item.assigned_user_id
                                              }
                                              assignedUserName={
                                                item.assignedUserName
                                              }
                                              idd={item.savedIdd}
                                            />
                                          </div>
                                        )} */}
                                          <span className="statement_check">
                                            {(() => {
                                              switch (item.status) {
                                                case 0:
                                                  return;
                                                case 1:
                                                  return (
                                                    <i className="far fa-check-circle"></i>
                                                  );
                                                case 2:
                                                  return (
                                                    <i
                                                      id={item.feedback}
                                                      onClick={(e) =>
                                                        this.setOpen4(e)
                                                      }
                                                      className="redInfo red far fa-info-circle"
                                                    ></i>
                                                  );
                                                case 3:
                                                  return;
                                                default:
                                                  return;
                                              }
                                            })()}
                                          </span>
                                        </span>
                                        <span
                                          className="commentIcon"
                                          id={item.id}
                                          onClick={(e) => this.setOpen3(e)}
                                        >
                                          {" "}
                                          <i id={item.id} className="">
                                            <svg
                                              width="34"
                                              height="34"
                                              viewBox="0 0 34 34"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z"
                                                fill="#1f9ed1"
                                              />
                                              <defs>
                                                <linearGradient
                                                  id="paint0_linear_1_206"
                                                  x1="11"
                                                  y1="2.5"
                                                  x2="36"
                                                  y2="45.5"
                                                  gradientUnits="userSpaceOnUse"
                                                >
                                                  <stop stopColor="#233076" />
                                                  <stop
                                                    offset="1"
                                                    stopColor="#3BABD6"
                                                  />
                                                </linearGradient>
                                              </defs>
                                            </svg>
                                          </i>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {governanceSubAdminPolicy.map((item, key) => (
                                  <div className="Statement_one" key={key}>
                                    <div className="Statement_2">
                                      <p className="statement_p">
                                        {item.question}
                                      </p>
                                    </div>
                                    <div className="Statement_two">
                                      <div className="d-flex">
                                        <div className="toast-header border-none">
                                          {item.docsFile && (
                                            <>
                                              {/* <strong className="mr-auto mr-3 text-format">
                                                <a
                                                  type="button"
                                                  className="new_button_style1 view"
                                                  data-dismiss="toast"
                                                  aria-label="view"
                                                  href={
                                                    BASE_URL + item.docsFile
                                                  }
                                                  target="_blank"
                                                >
                                                  <i className="far fa-eye"></i>
                                                </a>
                                              </strong> */}
                                              {!environmentalAccess2 && <></>}
                                              {environmentalAccess2 && (
                                                <button
                                                  type="button"
                                                  className="new_button_style1 close"
                                                  data-dismiss="toast"
                                                  aria-label="Close"
                                                >
                                                  <span
                                                    data-id={item.savedIdd}
                                                    onClick={this.deleteUser}
                                                    aria-hidden="true"
                                                  >
                                                    &times;
                                                  </span>
                                                </button>
                                              )}
                                            </>
                                          )}
                                        </div>

                                        <span className="statement_icon d-flex align-items-center">
                                          {(() => {
                                            switch (item.status) {
                                              case 0:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        {/* <i className="fas fa-download i-can mx-2" /> */}
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess2 &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                          {/* <input
                                                        type="file"
                                                        name="governancePolicy"
                                                        data-id={item.id}
                                                        onChange={
                                                          this.onFileChange
                                                        }
                                                      /> */}
                                                        </div>
                                                      )}

                                                    {environmentalAccess2 &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            accept=".doc, .docx, .pdf"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess2 && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        >
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                        </i>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 1:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess2 &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess2 &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess2 && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 2:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className=""
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </i>
                                                    )}
                                                    {environmentalAccess2 &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess2 &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess2 && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              case 3:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    {item.docsFile && (
                                                      <a
                                                        href={
                                                          BASE_URL +
                                                          item.docsFile
                                                        }
                                                        target="_blank"
                                                        download
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      >
                                                        <svg
                                                          width="34"
                                                          height="34"
                                                          viewBox="0 0 34 34"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                            fill="#A7ACC8"
                                                          />
                                                          <path
                                                            d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                            fill="#A7ACC8"
                                                            stroke="#A7ACC8"
                                                            strokeWidth="0.5"
                                                          />
                                                        </svg>
                                                      </a>
                                                    )}
                                                    {/* {!item.docsFile && (
                                                      <i
                                                        title="file not available"
                                                        className="fas fa-arrow-down i-can mx-2"
                                                      />
                                                    )} */}
                                                    {environmentalAccess2 &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                        </div>
                                                      )}
                                                    {environmentalAccess2 &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          <svg
                                                            width="34"
                                                            height="34"
                                                            viewBox="0 0 34 34"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z"
                                                              fill="#A7ACC8"
                                                            />
                                                            <path
                                                              d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z"
                                                              fill="#A7ACC8"
                                                              stroke="#A7ACC8"
                                                              strokeWidth="0.5"
                                                            />
                                                          </svg>
                                                          <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            data-id={item.id}
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          />
                                                        </div>
                                                      )}

                                                    {!environmentalAccess2 && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              default:
                                                return (
                                                  <div className="upload_image2 d-flex align-items-center">
                                                    <a
                                                      href={
                                                        BASE_URL + item.docsFile
                                                      }
                                                      target="_blank"
                                                      download
                                                      style={{
                                                        color: "green",
                                                      }}
                                                    >
                                                      <svg
                                                        width="34"
                                                        height="34"
                                                        viewBox="0 0 34 34"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M17 1.48619e-06C26.3891 6.65366e-07 34 7.6109 34 17C34 26.3891 26.3891 34 17 34C7.6109 34 -6.65366e-07 26.3891 -1.48619e-06 17C-2.30701e-06 7.6109 7.6109 2.30701e-06 17 1.48619e-06ZM17 3.4C13.3931 3.4 9.93384 4.83285 7.38334 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6166 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4Z"
                                                          fill="#A7ACC8"
                                                        />
                                                        <path
                                                          d="M11.4 17.25L11.65 17.25L11.65 17L11.65 11.8056L22.35 11.8056L22.35 17L22.35 17.25L22.6 17.25L24 17.25L24.25 17.25L24.25 17L24.25 10.7778C24.25 10.5132 24.1556 10.2548 23.9808 10.0606C23.8052 9.86542 23.561 9.75 23.3 9.75L10.7 9.75C10.439 9.75 10.1948 9.86542 10.0192 10.0606C9.84435 10.2548 9.75 10.5132 9.75 10.7778L9.75 17L9.75 17.25L10 17.25L11.4 17.25ZM21.2 19.0833L17.95 19.0833L17.95 13.8889L17.95 13.6389L17.7 13.6389L16.3 13.6389L16.05 13.6389L16.05 13.8889L16.05 19.0833L12.8 19.0833L12.2387 19.0833L12.6142 19.5006L16.8142 24.1672L17 24.3737L17.1858 24.1672L21.3858 19.5006L21.7613 19.0833L21.2 19.0833Z"
                                                          fill="#A7ACC8"
                                                          stroke="#A7ACC8"
                                                          strokeWidth="0.5"
                                                        />
                                                      </svg>
                                                    </a>
                                                    {environmentalAccess2 &&
                                                      item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                        </div>
                                                      )}
                                                    {environmentalAccess2 &&
                                                      !item.docsFile && (
                                                        <div className="upload_image2 d-flex align-items-center">
                                                          {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                          {/* <input
                                                            type="file"
                                                            name="governancePolicy"
                                                            accept=".doc, .docx, .pdf"
                                                            data-id={item.id}
                                                            onChange={
                                                              this.onFileChange
                                                            }
                                                          /> */}
                                                        </div>
                                                      )}

                                                    {!environmentalAccess2 && (
                                                      <div className="upload_image2 d-flex align-items-center">
                                                        <i
                                                          title="Permission denied"
                                                          className=""
                                                        />
                                                        {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8" />
                                                          <path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" strokeWidth="0.5" />
                                                        </svg> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                            }
                                          })()}
                                          {/* {currentUser.data.role !=
                                          "company_sub_admin" && (
                                          <div className="input-group  input-fild">
                                            <AssignSubAdminComponent2
                                              tableName="governancePolicy"
                                              removeHeader={true}
                                              assignedUserId={
                                                item.assigned_user_id
                                              }
                                              assignedUserName={
                                                item.assignedUserName
                                              }
                                              idd={item.savedIdd}
                                            />
                                          </div>
                                        )} */}
                                          <span className="statement_check">
                                            {(() => {
                                              switch (item.status) {
                                                case 0:
                                                  return;
                                                case 1:
                                                  return (
                                                    <i className="far fa-check-circle"></i>
                                                  );
                                                case 2:
                                                  return (
                                                    <i
                                                      id={item.feedback}
                                                      onClick={(e) =>
                                                        this.setOpen4(e)
                                                      }
                                                      className="redInfo red far fa-info-circle"
                                                    ></i>
                                                  );
                                                case 3:
                                                  return;
                                                default:
                                                  return;
                                              }
                                            })()}
                                          </span>
                                        </span>
                                        <span
                                          className="commentIcon"
                                          id={item.id}
                                          onClick={(e) => this.setOpen3(e)}
                                        >
                                          {" "}
                                          <i id={item.id} className="">
                                            <svg
                                              width="34"
                                              height="34"
                                              viewBox="0 0 34 34"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z"
                                                fill="#1f9ed1"
                                              />
                                              <defs>
                                                <linearGradient
                                                  id="paint0_linear_1_206"
                                                  x1="11"
                                                  y1="2.5"
                                                  x2="36"
                                                  y2="45.5"
                                                  gradientUnits="userSpaceOnUse"
                                                >
                                                  <stop stopColor="#233076" />
                                                  <stop
                                                    offset="1"
                                                    stopColor="#3BABD6"
                                                  />
                                                </linearGradient>
                                              </defs>
                                            </svg>
                                          </i>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="global_link mt-4">
                                <span className="">
                                  <a
                                    className="link_bal_next"
                                    onClick={this.goToPreviousPath}
                                  >
                                    Back
                                  </a>
                                </span>
                                <span className="global_link">
                                  <NavLink
                                    className="page_save page_width"
                                    to={"/Social_Policies"}
                                  >
                                    Next
                                  </NavLink>
                                </span>
                                {/* )} */}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
