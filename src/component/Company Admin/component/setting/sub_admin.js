/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { Component, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import config from "../../../../config/config.json";
import axios from "axios";
import Edit from "../../../../img/edit.png";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./working_progress.css";
import { authenticationService } from "../../../../_services/authentication";
import { apiCall } from "../../../../_services/apiCall";
import { PermissionMenuContext } from "../../../../contextApi/permissionBasedMenuContext";
import Multiselect from "multiselect-react-dropdown";

export default class SettingSubAdmin extends Component {
  constructor(props) {
    super(props);
    this.multiselectRef = React.createRef();
    this.state = {
      activeModal: "",
      showModal: false,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      isValidMobile: false,
      status: "",
      submitted: false,
      limit: 100,
      skip: 0,
      startDate: "",
      endDate: "",
      totalCount: 0,
      meterData: [],
      list: [],
      perPage: 10,
      page: 0,
      pages: 0,
      userRole: [],
      role_id: "",
      role_name: "",
      source_ids: "",
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.onRemoveSourceHandler = this.onRemoveSourceHandler.bind(this);
    this.onSelectSourceHandler = this.onSelectSourceHandler.bind(this);
  }

  getMeterIdData = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getMeterId`,
      //?company_id=${localStorage.getItem("user_temp_id")}
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({ meterData: data?.data });
    }
  };
  getUserRole = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getRoles`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({ userRole: data?.data });
    }
  };
  onRemoveSourceHandler = (removedItem) => {
    const updatedSelectedId = this.state?.source_ids.filter(
      (item) => item !== removedItem[0].id
    );
    this.setState({ source_ids: updatedSelectedId });
  };

  onSelectSourceHandler = (selectedItems) => {
    const selectedItemValues = selectedItems.map((item) => item.id);
    this.setState({ source_ids: selectedItemValues });
  };
  async componentDidMount() {
    await this.serverRequest();
    await this.getUserRole();
    await this.getMeterIdData();
  }
  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }
  handleStatusChange(event) {
    const target = event?.target;
    const value = target.checked ? true : false;
    const name = target.name;

    this.setState({
      [name]: value,
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
  handleMobileChange = (event) => {
    const { name, value } = event.target;

    // Remove any non-digit characters from the input value
    const cleanedValue = value.replace(/\D/g, "");

    // Validate the input value against the Indian mobile number pattern
    const isValidMobile = /^[6-9]\d{0,9}$/.test(cleanedValue);

    this.setState({
      [name]: cleanedValue,
      isValidMobile: isValidMobile || cleanedValue === "",
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ submitted: true });

    const { firstName, lastName, email, mobile, role_id, source_ids } = this.state;
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };
    const { isSuccess, data } = await apiCall(
      config.API_URL + "createSubUser",
      {},
      {
        email: email,
        mobile: mobile,
        first_name: firstName,
        last_name: lastName,
        role_id: role_id,
        source_ids: source_ids
      },
      "POST"
    );
    if (isSuccess) {
      setTimeout(() => {
        this.handleCloseModal();
        this.setState({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          role_id: "",
          submitted: false,
        });
        this.serverRequest();
        this.setState({ submitted: false });
      }, 1000);
    }
    // {
    //   axios
    //     .post(
    //       config.API_URL + "createSubUser",
    //       {
    //         email: email,
    //         mobile: mobile,
    //         first_name: firstName,
    //         last_name: lastName,
    //         role_id:role_id
    //       },
    //       { headers }
    //     )
    //     .then((response) => {
    //       this.serverRequest();
    //       Swal.fire({
    //         icon: "success",
    //         title: response.data.message,
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //       setTimeout(() => {
    //         this.handleCloseModal();
    //         this.setState({
    //           firstName: "",
    //           lastName: "",
    //           email: "",
    //           mobile: "",
    //           role_id:'',
    //           submitted: false,
    //         });
    //         this.setState({ submitted: false });
    //       }, 1000);
    //     })
    //     .catch(function (error) {
    //       if (error.response) {
    //         Swal.fire({
    //           icon: "error",
    //           title: error.response.data.message,
    //           showConfirmButton: false,
    //           timer: 1000,
    //         });
    //       }
    //     });
  };
  handleUpdate = async (event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ submitted: true });
    const { firstName, lastName, email, mobile, status, id, role_id } =
      this.state;
    const { isSuccess, data } = await apiCall(
      config.API_URL + "updateSubUser",
      {},
      {
        email: email,
        mobile_number: mobile,
        first_name: firstName,
        last_name: lastName,
        status: status,
        id: id,
        role_id: role_id,
      },
      "POST"
    );
    if (isSuccess) {
      setTimeout(() => {
        this.handleCloseModal();
        this.setState({ submitted: false });
        this.serverRequest();
      }, 1000);
    }
    // axios
    //   .post(
    //     config.API_URL + "updateSubUser",
    //     {
    //       email: email,
    //       mobile_number: mobile,
    //       first_name: firstName,
    //       last_name: lastName,
    //       status: status,
    //       id: id,
    //       role_id:role_id
    //     },
    //     { headers }
    //   )
    //   .then((response) => {
    //     this.serverRequest();
    //     Swal.fire({
    //       icon: "success",
    //       title: response.data.message,
    //       showConfirmButton: false,
    //       timer: 1000,
    //     });
    //     setTimeout(() => {
    //       this.handleCloseModal();
    //       this.handleUpdate();
    //       this.setState({ submitted: false });
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
  };

  async serverRequest() {
    // console.log("Hello", "subuser");
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };
    const { isSuccess, data, error } = await apiCall(
      config.API_URL + `getSubUsers`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({
        isLoaded: true,
        totalCount: data.totalCount,
        items: data.data,
        list: data.data,
        pages: Math.floor(data?.data?.length / this.state.perPage),
      });
    } else {
      this.setState({
        isLoaded: true,
        error,
      });
    }
    // fetch(config.API_URL + `getSubUsers`, { headers })
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       console.log(result, "SubAdmin Data");
    //       this.setState({
    //         isLoaded: true,
    //         totalCount: result.totalCount,
    //         items: result.data,
    //         list: result.data,
    //         pages: Math.floor(result?.data?.length / this.state.perPage),
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error,
    //       });
    //     }
    //   );
  }

  handlePageClick = (event) => {
    let page = event.selected;
    this.setState({ page });
  };

  render() {
    const { page, perPage, list } = this.state;
    let items = list?.slice(page * perPage, (page + 1) * perPage);
    let ii = 0;
    let weathers =
      items.map((item, key) => {
        return (
          <tr key={ii++}>
            <td>{key + 1}</td>
            <td>{item?.first_name}</td>
            <td>{item?.last_name}</td>
            <td>{item?.email}</td>
            <td>{item?.mobile_number}</td>
            <td>{item?.role_name}</td>

            <td>{item.status === true ? "Active" : "Inactive"}</td>
            <PermissionMenuContext.Consumer>
              {({ userPermissionList }) =>
                userPermissionList.includes("UPDATE SUB USER") && (
                  <td>
                    <button
                      className="non_underline_link bold view_c border-none"
                      style={{ background: "none" }}
                      onClick={() => {
                        this.handleOpenModal("update");
                        this.setState({
                          id: item?.id,
                          firstName: item?.first_name,
                          lastName: item?.last_name,
                          email: item?.email,
                          mobile: item?.mobile_number,
                          status: item?.status,
                          role_id: item?.role_id,
                          role_name: item.role_name,
                          submitted: false,
                        });
                      }}
                    >
                      <img src={Edit} alt="" />
                    </button>
                  </td>
                )
              }
            </PermissionMenuContext.Consumer>
          </tr>
        );
      }) || "";
    return (
      <PermissionMenuContext.Consumer>
        {({ userPermissionList }) => (
          <div>
            <Header />
            <Sidebar dataFromParent={this.props.location.pathname} />

            <div className="main_wrapper">
              <div className="inner_wraapper pt-0">
                <div className="container-fluid">
                  <section className="d_text">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="question_type_filter">
                            <NavLink to="/settings">My Profile</NavLink>
                            {/*<NavLink to="/Google_2FA">Two Factor Authentication</NavLink>*/}

                            {userPermissionList.includes(
                              "GET ALL SUBSCRIPTION"
                            ) && (
                                <NavLink to="/Setting_Billing">Billing</NavLink>
                              )}
                            <NavLink
                              to="/sub_accounts"
                              className="selected_question_type"
                            >
                              Sub Accounts
                            </NavLink>
                            {userPermissionList.includes("CREATE_METER_ID") && (
                              <NavLink to="/generator">Generator</NavLink>
                            )}
                          </div>
                          <div className="Introduction framwork_2">
                            <section className="forms">
                              <div className="row">
                                <div className="col-md-12">
                                  {userPermissionList.includes(
                                    "UPDATE SUB USER"
                                  ) && (
                                      <>
                                        <div className="d-flex align-items-center justify-content-between">
                                          <div className="heading">
                                            <h4>Sub-User's Details</h4>
                                          </div>
                                          <div className="directly p-0">
                                            <button
                                              className="new_button_style"
                                              variant="none"
                                              onClick={() =>
                                                this.handleOpenModal("login")
                                              }
                                            >
                                              Add new Sub User
                                            </button>
                                          </div>
                                        </div>
                                        <hr className="line"></hr>
                                      </>
                                    )}

                                  <div className="table_f">
                                    <Table striped bordered hover size="sm">
                                      <thead>
                                        <tr className="heading_color">
                                          <th style={{ width: "5%" }}>S No.</th>
                                          <th>First Name</th>
                                          <th>Last Name</th>
                                          <th>Email</th>
                                          <th>Mobile</th>
                                          <th>Role Name</th>

                                          <th>Status</th>
                                          {userPermissionList.includes(
                                            "CREATE SUB USER"
                                          ) && <th>Edit</th>}
                                        </tr>
                                      </thead>
                                      <tbody>{weathers}</tbody>
                                    </Table>
                                    <div className="Page navigation example"></div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <Modal
                              animation={true}
                              size="md"
                              className="modal_box"
                              shadow-lg="border"
                              show={
                                this.state.showModal &&
                                this.state.activeModal === "login"
                              }
                            >
                              <div className="modal-lg">
                                <Modal.Header className="justify-content-between">
                                  <Modal.Title>
                                    <div className="pb3">
                                      <h4>Add New Sub Accounts</h4>
                                    </div>
                                  </Modal.Title>
                                  <Button
                                    variant="outline-dark"
                                    onClick={this.handleCloseModal}
                                  >
                                    <i className="fa fa-times"></i>
                                  </Button>
                                </Modal.Header>
                                <div className="modal-body">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="forms">
                                        <div className="form-group">
                                          <label
                                            htmlFor="firstName"
                                            className="form-label fw-bold"
                                          >
                                            Enter sub-user's information
                                          </label>

                                          <div className="row">
                                            <div className="col-lg-6 col-xs-6">
                                              <div className="form-group pb-3">
                                                <input
                                                  className="select_one industrylist"
                                                  aria-expanded="false"
                                                  placeholder="First Name"
                                                  value={this.state.firstName}
                                                  name="firstName"
                                                  type="text"
                                                  onChange={this.handleChange}
                                                />
                                                {this.state.submitted &&
                                                  !this.state.firstName && (
                                                    <div className="help-block">
                                                      First name is required
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="col-lg-6 col-xs-6">
                                              <div className="form-group pb-3">
                                                <input
                                                  className="select_one industrylist"
                                                  aria-expanded="false"
                                                  placeholder="Last Name"
                                                  value={this.state.lastName}
                                                  name="lastName"
                                                  type="text"
                                                  onChange={this.handleChange}
                                                />
                                                {this.state.submitted &&
                                                  !this.state.lastName && (
                                                    <div className="help-block">
                                                      Last name is required
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="col-lg-6 col-xs-6">
                                              <div className="form-group pb-3">
                                                <input
                                                  className="select_one industrylist"
                                                  aria-expanded="false"
                                                  placeholder="Email"
                                                  value={this.state.email}
                                                  name="email"
                                                  type="email"
                                                  onChange={this.handleChange}
                                                />
                                                {this.state.submitted &&
                                                  !this.state.email && (
                                                    <div className="help-block">
                                                      Email is required
                                                    </div>
                                                  )}
                                              </div>
                                            </div>

                                            <div className="col-lg-6 col-xs-6">
                                              <div className="form-group">
                                                <input
                                                  className="form-control"
                                                  aria-expanded="false"
                                                  placeholder="Mobile"
                                                  style={{ height: "42px" }}
                                                  value={this.state.mobile}
                                                  name="mobile"
                                                  type="tel"
                                                  onChange={
                                                    this.handleMobileChange
                                                  }
                                                />
                                                {this.state.submitted &&
                                                  !this.state.mobile && (
                                                    <div className="help-block">
                                                      Mobile number is required
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="col-lg-12 col-xs-12">
                                              <div className="form-group pb-3">
                                                <select
                                                  value={this.state.role_id}
                                                  className="select_one industrylist"
                                                  onChange={(e) => {
                                                    this.setState({
                                                      role_id: e.target.value,
                                                    });
                                                  }}
                                                >
                                                  <option value="">
                                                    select user role
                                                  </option>
                                                  {this.state.userRole.length >
                                                    0 &&
                                                    this.state.userRole?.map(
                                                      (data, index) => {
                                                        return (
                                                          <option
                                                            key={index}
                                                            value={data?.id}
                                                          >
                                                            {
                                                              data?.role_display_name
                                                            }
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                </select>
                                              </div>
                                            </div>
                                            {this.state.role_id === "12" && <div className="col-lg-12 col-xs-12">
                                              <div className="form-group pb-3">
                                                <select
                                                  value={this.state.source_ids}
                                                  className="select_one industrylist"
                                                  onChange={(e) => {
                                                    this.setState({
                                                      source_ids: [Number(e.target.value)],
                                                    });
                                                  }}
                                                >
                                                  <option value="">
                                                    Select Source
                                                  </option>
                                                  {this.state.meterData.length >
                                                    0 &&
                                                    this.state.meterData?.map(
                                                      (data, index) => {
                                                        return (
                                                          <option
                                                            key={index}
                                                            value={data?.id}
                                                          >
                                                            {
                                                              data?.process
                                                            }
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                </select>
                                              </div>
                                            </div>}
                                            {this.state.role_id === "7" && <div className="col-lg-12 col-xs-12">
                                              <div className="form-group pb-3">
                                                <label>Select Source</label>
                                                <Multiselect
                                                  placeholder="Select Source"
                                                  displayValue="process"
                                                  className="multi_select_dropdown w-100"
                                                  options={this.state.meterData}
                                                  ref={this.multiselectRef}
                                                  onRemove={
                                                    this.onRemoveSourceHandler
                                                  }
                                                  onSelect={
                                                    this.onSelectSourceHandler
                                                  }
                                                />
                                              </div>
                                            </div>}
                                          </div>
                                        </div>
                                        <div className="cenlr text-end pt-5">
                                          <button
                                            className="new_button_style mx-3"
                                            onClick={() =>
                                              this.setState({
                                                firstName: "",
                                                lastName: "",
                                                email: "",
                                                mobile: "",
                                                submitted: false,
                                              })
                                            }
                                          >
                                            CANCEL
                                          </button>
                                          <button
                                            className="new_button_style"
                                            onClick={this.handleSubmit}
                                          >
                                            SUBMIT
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal>
                            <Modal
                              animation={true}
                              size="md"
                              className="modal_box"
                              shadow-lg="border"
                              show={
                                this.state.showModal &&
                                this.state.activeModal === "update"
                              }
                            >
                              <div className="modal-lg">
                                <Modal.Header className="d-flex align-itrms-center justify-content-between">
                                  <Modal.Title>
                                    <div className="pb3">
                                      <h4>Update User Information</h4>
                                    </div>
                                  </Modal.Title>
                                  <Button
                                    variant="outline-dark"
                                    onClick={this.handleCloseModal}
                                  >
                                    <i className="fa fa-times"></i>
                                  </Button>
                                </Modal.Header>
                                <div className="modal-body vekp pt-0">
                                  <div className="forms">
                                    <div className="form-group">
                                      <label
                                        htmlFor="firstName"
                                        className="form-label fw-bold"
                                      >
                                        Enter updated information
                                      </label>
                                      <Row>
                                        <Col md={6}>
                                          <input
                                            className="select_one my-3"
                                            aria-expanded="false"
                                            placeholder="First Name"
                                            value={this.state.firstName}
                                            name="firstName"
                                            type="text"
                                            onChange={this.handleChange}
                                          />
                                          {this.state.submitted &&
                                            !this.state.firstName && (
                                              <div className="help-block">
                                                First name is required
                                              </div>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                          <input
                                            className="select_one my-3"
                                            aria-expanded="false"
                                            placeholder="Last Name"
                                            value={this.state.lastName}
                                            name="lastName"
                                            type="text"
                                            onChange={this.handleChange}
                                          />
                                          {this.state.submitted &&
                                            !this.state.lastName && (
                                              <div className="help-block">
                                                Last name is required
                                              </div>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                          <input
                                            className="select_one my-3"
                                            aria-expanded="false"
                                            placeholder="Email"
                                            value={this.state.email}
                                            name="email"
                                            type="email"
                                            onChange={this.handleChange}
                                          />
                                          {this.state.submitted &&
                                            !this.state.email && (
                                              <div className="help-block">
                                                Email is required
                                              </div>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                          <input
                                            className="select_one my-3"
                                            aria-expanded="false"
                                            placeholder="Mobile"
                                            value={this.state.mobile}
                                            name="mobile"
                                            type="tel"
                                            onChange={(event) => {
                                              const { name, value } =
                                                event.target;

                                              // Remove any non-digit characters from the input value
                                              const cleanedValue =
                                                value.replace(/\D/g, "");

                                              // Validate the input value against the Indian mobile number pattern
                                              const isValidMobile =
                                                /^[6-9]\d{0,9}$/.test(
                                                  cleanedValue
                                                );

                                              if (
                                                isValidMobile ||
                                                cleanedValue === ""
                                              ) {
                                                this.setState({
                                                  [name]: cleanedValue,
                                                  isValidMobile: isValidMobile,
                                                });
                                              }
                                            }}
                                          />
                                          {this.state.submitted &&
                                            !this.state.mobile && (
                                              <div className="help-block">
                                                Mobile number is required
                                              </div>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                          <select
                                            className="select_one my-3"
                                            aria-expanded="false"
                                            value={this.state.status}
                                            name="status"
                                            type="text"
                                            onChange={this.handleChange}
                                          >
                                            <option value={true}>Active</option>
                                            <option value={false}>
                                              Inactive
                                            </option>
                                          </select>
                                        </Col>
                                        <Col md={6}>
                                          <select
                                            value={this.state.role_id}
                                            className="select_one industrylist my-3"
                                            onChange={(e) => {

                                              this.setState({
                                                role_id: e.target.value,
                                              });
                                            }}
                                          >
                                            <option value="">
                                              select user role
                                            </option>
                                            {this.state.userRole.length > 0 &&
                                              this.state.userRole?.map(
                                                (data, index) => {
                                                  return (
                                                    <option
                                                      key={index}
                                                      value={data?.id}
                                                    >
                                                      {data?.role_display_name}
                                                    </option>
                                                  );
                                                }
                                              )}
                                          </select>
                                        </Col>
                                      </Row>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-end">
                                      <button
                                        className="new_button_style mx-3"
                                        onClick={() =>
                                          this.setState({
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            mobile: "",
                                            submitted: false,
                                          })
                                        }
                                      >
                                        CANCEL
                                      </button>
                                      <button
                                        className="new_button_style"
                                        onClick={this.handleUpdate}
                                      >
                                        UPDATE
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal>
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
    );
  }
}
