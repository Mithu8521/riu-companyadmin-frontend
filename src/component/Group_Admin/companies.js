/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { Component } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import config from "../../config/config.json";
import Table from "react-bootstrap/Table";
import { authenticationService } from "../../_services/authentication";
import "./companies.css";
import { apiCall } from "../../_services/apiCall";

import { Button, Col, Modal, Row } from "react-bootstrap";
// import ToggleSwitch from "./toggleSwitch";

const currentUser = authenticationService.currentUserValue;
const numInstances = 1;
export default class companies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      country: false,
      industry: false,
      update: false,
      category: false,
      activeModal: "",
      showModal: false,
      paymentTrue: true,
      email: "",
      companyName: "",
      submitted: false,
      items: [],
      items1: [],
      companyData: [],
      broker: [],
      loading: false,
      totalRows: 0,
      currentPage: 1,
      skip: 0,
      startDate: "",
      endDate: "",
      limit: 100,
      countryFilter: "",
      industryFilter: "",
      categoryFilter: "",
      orderByName: "id",
      orderByValue: "DESC",
      search: "",
      pageCount: 0,
      totalData: 0,
      totalData1: 0,
      countriesList: [],
      industryList: [],
      searchKey: "",
      plan_id: "",
      discount: "",
      brokerId: "",
      companyId: "",
      compData: [],
      userType: "",
      userRole: "",
      data1: [],
      frameworks: [],
      finYear: "",
      selectedIds: [],
      selectedFinIds: [],
      updateType: "",
      status: "",
      chargeValue: "",
      chargeType: "",
      invoiceCharge: "",
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.applySorting = this.applySorting.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.onPaymentHandler = this.paymentHandler.bind(this);
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
    this.setState({ email: "" });
    this.setState({ plan_id: "" });
    this.setState({ discount: "" });
    this.setState({ companyName: "" });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { email, plan_id, discount, brokerId, companyName } = this.state;
    let body = {
      email: email,
      plan_id: plan_id,
      discount: discount,
      company_name: companyName,
    };
    if (email) {
      const { isSuccess, data } = await apiCall(
        config.API_URL + "api/v1/sendInviteForCompany",
        {},
        body,
        "POST"
      );
      if (isSuccess) {
        setTimeout(() => {
          this.handleCloseModal();
          this.setState({ email: "", plan_id: "" });
          this.setState({ submitted: false });
        }, 1000);
        this.getInvitedCompany();
      }
    }
  }
  async handleSwitch(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { companyId, compData } = this.state;
    if (companyId) {
      const { isSuccess, data } = await apiCall(
        config.ADMIN_API_URL + "loginGroupAdminAsCompany",
        {},
        {
          assisted_company_id: companyId,
        },
        "GET"
      );
      if (isSuccess) {
        this.setState({ compData: data.data });
        window.open(
          config.baseCompanyUrl +
          `#/sign_in/${data.data?.company_id}/${data.data?.token}`,
          "_blank"
        );
        setTimeout(() => {
          this.handleCloseModal();
          this.setState({ submitted: false });
        }, 2000);
      }
    }
  }
  applyFilter(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      [name]: value,
    });
  }

  applyGlobalSearch(e) {
    let value = e.target.value;
    this.setState({
      searchKey: value,
    });
    setTimeout(() => {
      this.serverRequest();
    }, 200);
  }

  applySorting(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState({
      orderByName: name,
      orderByValue: value,
    });
  }

  clearFilter(e) {
    let name = e.target.name;
    this.setState({
      [name]: "",
      orderByName: "id",
      orderByValue: "DESC",
    });
    setTimeout(() => {
      this.serverRequest();
    }, 500);
  }
  async updateInvitationStatus(emailId, status) {
    let body = {
      email: emailId,
      status: status,
    };
    const { isSuccess, data } = await apiCall(
      config.ADMIN_API_URL + "updateInvitationStatus",
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      this.getInvitedCompany();
    }
  }
  async getInvitedCompany() {
    const { isSuccess, data } = await apiCall(
      config.ADMIN_API_URL + "getInvitationDetails",
      {},
      {}
    );

    if (isSuccess) {
      this.setState({
        companyData: data?.data,
      });
    }
  }
  async serverRequest() {
    const {
      skip,
      limit,
      countryFilter,
      industryFilter,
      categoryFilter,
      orderByName,
      orderByValue,
      searchKey,
      showModal,
    } = this.state;

    if (showModal === true) {
      this.setState({
        showModal: false,
      });
    }

    const role = localStorage.getItem("role");
    let userType = "";
    if (role === "group_admin") {
      userType = "assisted_company";
    } else {
      userType = "company";
    }

    let body = {
      limit: limit,
      offset: skip,
      country: countryFilter,
      industry: industryFilter,
      category: categoryFilter,
      orderByName: orderByName,
      orderByValue: orderByValue,
      search: searchKey,
      userTypeCode: userType,
    };
    this.getInvitedCompany();
    const { isSuccess, data } = await apiCall(
      config.ADMIN_API_URL + "company",
      {},
      body
    );
    if (isSuccess) {
      this.setState({
        pageCount: Math.ceil(data.length / this.state.perPage),
        totalData: data?.count,
        items1: data?.data,
      });
    }
  }

  pageChange(e, data) {
    let page = data?.activePage;
    let pageNo = page === 1 ? 0 : (page - 1) * this.state.limit;
    this.setState({
      skip: pageNo,
    });
    this.serverRequest();
  }

  exportCSV(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.data.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: this.state.setStartDate,
        endDate: this.state.setEndDate,
      }),
    };

    fetch(config.ADMIN_API_URL + `company/export`, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          let url = config.BASE_URL + result?.data;
          window.open(url, "_blank");
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  async getAllSubscription() {
    const getLocalData = JSON.parse(localStorage.getItem("currentUser"));
    const getRole = getLocalData !== null ? getLocalData.data.role : "";
    let params = { subscription_type: "Invite" };
    const { isSuccess, data } = await apiCall(
      config.ADMIN_API_URL + "getAllSubscription",
      {},
      params,
      "GET"
    );
    if (isSuccess) {
      this.setState({
        items: data.data,
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
  }
  getFrameworks = async () => {
    let obj = {};
    obj.assisted_company_id = this.state.data1.id;
    const { isSuccess, data } = await apiCall(
      `${config.ADMIN_API_URL}getFrameworkForAssistedCompany`,
      {},
      obj,
      "GET"
    );
    if (isSuccess) {
      this.setState({ frameworks: data.data });
    }
  };
  callAPI = async (item) => {
    let obj = {};
    if (this.state.data1.user_type_code != "company") {
      obj.assisted_company_id = this.state.data1.id;
      const { isSuccess: isSuccess1, data: framework } = await apiCall(
        `${config.ADMIN_API_URL}getFrameworkForAssistedCompany`,
        {},
        obj,
        "GET"
      );
      if (isSuccess1) {
        this.setState({ frameworks: framework.data });
        const filteredIds = framework.data
          .filter((item) => item.status === 1)
          .map((item) => item.id);
        this.setState({ selectedIds: filteredIds });
      }
    }
    let obj1 = {};
    obj1.assisted_company_id = this.state.data1.id;
    obj1.financial_year_code = "APR-MAR";
    const { isSuccess, data } = await apiCall(
      `${config.ADMIN_API_URL}getFinancialYearForAssistedCompany`,
      {},
      obj1,
      "GET"
    );
    if (isSuccess) {
      this.setState({ finYear: data.data });
      const filteredIds = data.data
        .filter((item) => item.status === 1)
        .map((item) => item.id);
      this.setState({ selectedFinIds: filteredIds });
    }
  };
  handleRowSelect = (id) => {
    this.setState((prevState) => {
      const { selectedIds } = prevState;
      const index = selectedIds.indexOf(id);
      const updatedIds = [...selectedIds];

      if (index > -1) {
        updatedIds.splice(index, 1);
      } else {
        updatedIds.push(id);
      }

      return { selectedIds: updatedIds };
    });
  };
  handleRowSelectFinancial = (id) => {
    this.setState((prevState) => {
      const { selectedFinIds } = prevState;
      const index = selectedFinIds.indexOf(id);
      const updatedIds = [...selectedFinIds];

      if (index > -1) {
        updatedIds.splice(index, 1);
      } else {
        updatedIds.push(id);
      }
      return { selectedFinIds: updatedIds };
    });
  };
  frameworkSubmit = async (event) => {
    event.preventDefault();
    const { selectedIds, data1 } = this.state;
    if (selectedIds.length > 0) {
      let obj = {};
      obj.assisted_company_id = data1.id;
      obj.framework_ids = selectedIds;
      const { isSuccess } = await apiCall(
        `${config.ADMIN_API_URL}updateAssistedCompanyFrameworks`,
        {},
        obj,
        "POST"
      );
      if (isSuccess) {
        this.serverRequest();
      }
    }
  };
  async paymentDone(id) {
    {
      const { isSuccess, data, error } = await apiCall(
        config.ADMIN_API_URL + `paymentDone`,
        {},
        { orderId: id },
        "POST"
      );

      if (isSuccess) {
        this.setState({ showModal: false });
        this.setState({ paymentTrue: false });
        // paymentTrue
        // console.log("succes");
      }
    }
  }
  async paymentHandler() {
    const { selectedFinIds, invoiceCharge, data1 } = this.state;
    let obj = {};
    obj.company_id = data1.id;
    obj.financial_year_id = selectedFinIds;
    obj.price = invoiceCharge;
    const { isSuccess, data, error } = await apiCall(
      `${config.ADMIN_API_URL}generateOrderId`,
      {},
      obj,
      "GET"
    );
    if (isSuccess) {
      console.log("dipajk", isSuccess, data, error);
      const options = {
        key: "rzp_test_hCHVIASrXD6OsD",
        amount: "80",
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.data.orderId,
        // callback_url: "http://127.0.0.1:3001/#/Setting_Billing",
        handler: (response) => {
          this.paymentDone(response.razorpay_order_id);
          // ...
        },

        // prefill: {
        //   name: "Gaurav Kumar",
        //   email: "gaurav.kumar@example.com",
        //   contact: "9000090000",
        // },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    }
  }
  financialSubmit = async (event) => {
    event.preventDefault();
    const { selectedFinIds, invoiceCharge, data1 } = this.state;
    let obj = {};
    obj.company_id = data1.id;
    obj.financial_year_id = selectedFinIds;
    obj.price = invoiceCharge;
    const { isSuccess } = await apiCall(
      `${config.ADMIN_API_URL}assignFinancialYear`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      this.serverRequest();
    }
  };
  statusSubmit = async (event) => {
    event.preventDefault();
    let obj = {};
    obj.company_id = this.state.data1.id;
    obj.status = this.state.status;
    const { isSuccess } = await apiCall(
      `${config.ADMIN_API_URL}updateCompanyStatus`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      this.serverRequest();
    }
  };

  async componentDidMount() {
    const chargeType = localStorage.getItem("chargeType");
    if (chargeType === "FIXED") {
      this.setState({ chargeValue: localStorage.getItem("chargeValue") });
      this.setState({ invoiceCharge: localStorage.getItem("chargeValue") });
    }
    if (chargeType === "PERCENT") {
      this.setState({ chargeValue: localStorage.getItem("chargeValue") });
    }
    this.setState({ chargeType: localStorage.getItem("chargeType") });
    const role = localStorage.getItem("role");
    if (role == "group_admin") {
      this.setState({ userType: "assisted_company" });
    } else {
      this.setState({ userType: "company" });
    }
    if (role === "super_admin") {
      this.setState({ userRole: "super_admin" });
    }
    this.setState({ items: [] });
    this.serverRequest();
    this.getAllSubscription();
    if (role === "super_admin") {
      const { isSuccess, data } = await apiCall(
        config.ADMIN_API_URL + "getBrokers",
        {},
        {},
        "GET"
      );
      if (isSuccess) {
        this.setState({
          pageCount1: Math.ceil(data.length / this.state.perPage),
          totalData1: data?.count,
          broker: data?.data,
        });
      }
    }
  }

  render() {
    const {
      items,
      items1,
      broker,
      countriesList,
      industryList,
      compData,
      companyData,
    } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="color_div_on framwork_2">
              <div className="business_detail">
                <div className="table_f table-responsive">
                  <div className="heading d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="m-0"> Registered Companies </h4>
                      <span className="global_link m-0">
                        <button
                          className="link_bal_next page_width white"
                          onClick={() => this.handleOpenModal("login")}
                        >
                          INVITE NEW COMPANY
                        </button>
                      </span>
                    </div>
                    <hr className="line" />
                    <input
                      type="search"
                      className="form-control w-25"
                      placeholder="Search Company, Category, Industry &amp; Business Number"
                      name="search"
                      onChange={(e) => this.applyGlobalSearch(e)}
                    />
                  </div>

                  <Table striped bordered style={{ textWrap: "nowrap" }}>
                    <thead>
                      <tr className="heading_color">
                        <th>Sr. No</th>
                        <th>Company Name</th>
                        <th>Country</th>
                        <th>Business Number</th>
                        <th>Industry</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items1?.map((item, key) => (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{item?.register_company_name}</td>
                          <td>{item?.country}</td>
                          <td>{item?.business_number}</td>
                          <td>{item?.company_industry}</td>
                          {/* <td>
                            {[...Array(numInstances)].map((_, index) => (
                              <ToggleSwitch key={index} />
                            ))}
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Modal
                    animation={true}
                    size="md"
                    className="modal_box"
                    shadow-lg="border"
                    show={
                      this.state.showModal && this.state.activeModal === "login"
                    }
                  >
                    <div className="modal-lg">
                      <Modal.Header className="d-flex align-items-center justify-content-between">
                        <Modal.Title className="">
                          <h4 className="m-0"> Invite New Company </h4>
                        </Modal.Title>
                        <Button
                          variant="outline-dark"
                          onClick={this.handleCloseModal}
                        >
                          <i className="fa fa-times"></i>
                        </Button>
                      </Modal.Header>
                      <div className="modal-body">
                        <Row>
                          <Col md={12}>
                            <form name="form" onSubmit={this.handleSubmit}>
                              <Row>
                                <Col md={6}>
                                  <input
                                    className="form-control"
                                    type="email"
                                    aria-expanded="false"
                                    placeholder="Email"
                                    value={this.state.email}
                                    name="email"
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
                                    className="form-control"
                                    type="text"
                                    aria-expanded="false"
                                    placeholder="Enter Company Name"
                                    value={this.state.companyName}
                                    name="companyName"
                                    onChange={this.handleChange}
                                  />
                                  {this.state.submitted &&
                                    !this.state.companyName && (
                                      <div className="help-block">
                                        Company Name is required
                                      </div>
                                    )}
                                </Col>
                                <Col md={6}>
                                  <select
                                    className="form-control"
                                    aria-expanded="false"
                                    name="plan_id"
                                    value={this.state.plan_id}
                                    onChange={(event) => {
                                      this.handleChange(event);
                                      this.setState({
                                        plan_id: event.target.value,
                                      });
                                    }}
                                  >
                                    <option>
                                      Select Subscription Plan
                                    </option>
                                    {this.state?.items?.map((option) => (
                                      <option
                                        key={option?.id}
                                        value={option?.id}
                                      >
                                        {option?.title +
                                          ";  Price:- " +
                                          option?.price +
                                          " Rs."}
                                      </option>
                                    ))}
                                  </select>
                                  {this.state.submitted &&
                                    this.state.plan_id?.length === 0 && (
                                      <div className="help-block">
                                        Subscription Plan is required
                                      </div>
                                    )}
                                </Col>
                                <Col md={6}>
                                  <input
                                    className="form-control"
                                    type=""
                                    aria-expanded="false"
                                    placeholder="Discount"
                                    value={this.state.discount}
                                    name="discount"
                                    onChange={(event) => {
                                      let val = parseInt(
                                        event.target.value
                                      );
                                      if (
                                        val <= 100 ||
                                        event.target.value === ""
                                      ) {
                                        this.handleChange(event);
                                      }
                                    }}
                                    max={100}
                                    onBlur={(event) => {
                                      if (event.target.value === "") {
                                        this.setState({
                                          discount: 0,
                                        });
                                      }
                                    }}
                                    pattern="\d+"
                                  />
                                  {this.state.submitted &&
                                    !this.state.discount && (
                                      <div className="help-block">
                                        Discount is required
                                      </div>
                                    )}
                                </Col>
                                <Col md={6}>
                                  {this.state.broker.length > 0 &&
                                    this.state.userRole ===
                                    "super_admin" && (
                                      <select
                                        className="form-control"
                                        aria-expanded="false"
                                        name="brokerId"
                                        value={this.state.brokerId}
                                        onChange={(event) => {
                                          this.handleChange(event);
                                          this.setState({
                                            brokerId: event.target.value,
                                          });
                                        }}
                                      >
                                        {" "}
                                        <option>Select Broker</option>
                                        {broker?.map((option) => (
                                          <option
                                            key={option?.id}
                                            value={option?.id}
                                          >
                                            {option?.first_name}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                </Col>
                              </Row>
                              <button className="link_bal_next page_width white">
                                SEND
                              </button>
                            </form>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
