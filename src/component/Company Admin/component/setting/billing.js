/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./billing.css";
import config from "../../../../config/config.json";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./working_progress.css";
import { authenticationService } from "../../../../_services/authentication";
import { apiCall } from "../../../../_services/apiCall";
import { PermissionMenuContext } from "../../../../contextApi/permissionBasedMenuContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
const currentUser = authenticationService.currentUserValue;

export default class SettingBilling extends Component {
  constructor(props) {
    super(props);
    this.startDate = new Date();
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      items1: [],
      message: [],
      message1: [],
      expire: [],
      updradPlanShow: false,
      users: "",
      updradPrice: 0,
      email: "",
      uuid: "",
      items3: [],
      totalRows: 0,
      currentPage: 1,
      skip: 0,
      currentPlan: "",
      limit: 10,
      pageCount: 0,
      perPage: 10,
      currentPlanId: "",
      uuid1: "",
      paymentAmount: "",
      totalData: 0,
      setStartDate: null,
      setEndDate: null,
      authValue: null,
    };
    this.getProfileData = this.getProfileData.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onPaymentHandler = this.paymentHandler.bind(this);
  }

  setStartDate = (date) => {
    this.startDate = { date: new Date() };
  };

  async getProfileData(role_id) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const { isSuccess, data, error } = await apiCall(
      `${config.API_URL}getProfileData?userId=${currentUser?.data?.user_id}${role_id ? `role_id=${role_id}` : ""
      }`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({
        isLoaded2: true,
        uuid: data.user[0]?.id,
        users: data.user[0]?.no_of_users,
      });
      this.serverRequest(this.state.uuid);
      this.getGlobalSubscriptionPlan(this.state.users);
    } else {
      this.setState({
        isLoaded2: true,
        error,
      });
    }
  }

  pageChange(e, data) {
    let page = data.activePage;
    let pageNo = page === 1 ? 0 : (page - 1) * this.state.limit;
    this.setState({
      skip: pageNo,
    });
    this.serverRequest();
  }

  onDateChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    let setStartDate = null;
    let setEndDate = null;
    if (this.state.setStartDate === null) {
      if (name === "setStartDate") {
        setStartDate = value;
      }
    } else {
      if (value !== this.state.setStartDate && name === "setStartDate") {
        setStartDate = value;
      } else {
        setStartDate = this.state.setStartDate;
      }
    }
    if (this.state.setEndDate === null) {
      if (name === "setEndDate") {
        setEndDate = value;
      }
    } else {
      if (value !== this.state.setEndDate && name === "setEndDate") {
        setEndDate = value;
      } else {
        setEndDate = this.state.setEndDate;
      }
    }
    if (setStartDate !== null && setEndDate !== null) {
      setTimeout(() => {
        this.serverRequest();
      }, 500);
    }
  }

  serverRequest(uuids) {
    const { skip, limit, setStartDate, setEndDate } = this.state;
    let uuid = this.state.uuid;
  }
  async paymentDone(id) {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `paymentDone`,
        {},
        { orderId: id },
        "POST"
      );

      if (isSuccess) {
        this.getGlobalSubscriptionPlan();
      }
    }
  }
  async cancelPlane() {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `cancelPlan`,
        {},
        {},
        "POST"
      );

      if (isSuccess) {
        this.getGlobalSubscriptionPlan();
      }
    }
  }
  async upgradePlanPaymentDone(id) {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `upgradePlanPaymentDone`,
        {},
        { orderId: id },
        "POST"
      );

      if (isSuccess) {
        this.getGlobalSubscriptionPlan();
      }
    }
  }
  async handleClose() {
    {
      this.setState({
        updradPlanShow: false,
      });
    }
  }

  async upgradePlan() {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `upgradePlan`,
        {},
        { plan_id: this.state.currentPlanId },
        "GET"
      );
      let id;
      if (isSuccess) {
        {
          this.setState({
            updradPlanShow: false,
          });
        }
        const options = {
          key: "rzp_test_hCHVIASrXD6OsD",
          amount: "80",
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: data.data.orderId,
          handler: (response) => {
            this.upgradePlanPaymentDone(response.razorpay_order_id);
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
  }
  async paymentHandler(item, e) {
    {
      const { isSuccess, data, error } = await apiCall(
        config.API_URL + `generateOrderId`,
        {},
        { plan_id: item.id },
        "GET"
      );
      let id;
      if (isSuccess) {
        const options = {
          key: "rzp_test_hCHVIASrXD6OsD",
          amount: "80",
          currency: "INR",
          name: "Acme Corp",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: data.data.orderId,
          handler: (response) => {
            this.paymentDone(response.razorpay_order_id);
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
  }
  async upgradePlanPayment(item) {
    let price = item?.price - this.state.currentPlan;

    this.setState({
      updradPlanShow: true,
      updradPrice: price,
      currentPlanId: item?.id,
    });
  }
  async getGlobalSubscriptionPlan() {
    const { isSuccess, data, error } = await apiCall(
      config.API_URL + `getAllSubscription`,
      {},
      { subscription_type: "All" },
      "GET"
    );
    if (isSuccess) {
      if (data?.data) {
        for (let i = 0; i < data?.data.length; i++) {
          const item = data?.data[i];
          if (item?.status === "PAYMENT_DONE") {
            this.setState({
              currentPlan: item?.price,
            });
            break;
          }
        }
      }
      this.setState({
        isLoaded: true,
        items: data?.data,
        message1: data.message,
      });
    } else {
      this.setState({
        isLoaded: true,
        error,
      });
    }
  }
  changeDateFormat = (dateString) => {
    const date = new Date(dateString);

    date.setDate(date.getDate() + 1);

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? "0" + day : day}-${month}-${year}`;

    return formattedDate;
  };
  componentDidMount() {
    const authValue = JSON.parse(localStorage.getItem("currentUser"));
    this.setState({ authValue });
    this.getProfileData();
    setTimeout(() => {
      this.serverRequest();
    }, 500);
    this.getGlobalSubscriptionPlan();
  }

  render() {
    const { items, items1, items3, message, message1, uuid1, expire } =
      this.state;
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        <PermissionMenuContext.Consumer>
          {({ userPermissionList }) => (
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
                                <NavLink
                                  to="#"
                                  className="selected_question_type"
                                >
                                  Billing
                                </NavLink>
                              )}
                            {userPermissionList.includes("CREATE SUB USER") &&
                              this.state.authValue?.hasValidPlan && (
                                <NavLink to="/sub_accounts">
                                  Sub Accounts
                                </NavLink>
                              )}
                            {userPermissionList.includes("CREATE_METER_ID") &&
                              this.state.authValue?.hasValidPlan && (
                                <NavLink to="/generator">Generator</NavLink>
                              )}
                          </div>
                          <div className="Introduction framwork_2">
                            <section className="forms">
                              <div className="row">
                                <div className="col-md-12 col-xs-12">
                                  <div className="business_detail">
                                    <div className="sub-heading">
                                      <p className="m-0">
                                        <strong>{message}</strong>
                                      </p>
                                    </div>
                                    <Row>
                                      {items &&
                                        items?.map((item, key) => (
                                          <Col
                                            md={3}
                                            style={{ position: "relative" }}
                                          >
                                            <div className="pricing-table turquoise mb-4">
                                              {item?.payment_amount && (
                                                <div>
                                                  <Row>
                                                    <Col md={12}>
                                                      <div className="badge-overlay">
                                                        <span className="top-right badge">
                                                          {(Number(
                                                            item?.price -
                                                            item?.payment_amount
                                                          ) *
                                                            100) /
                                                            Number(item?.price)}
                                                          % OFF
                                                        </span>
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </div>
                                              )}
                                              <h2>{item?.title}</h2>
                                              <div className="price-tag">
                                                <span className="symbol">
                                                  ₹
                                                </span>
                                                <span className="amount">
                                                  {item?.payment_amount ||
                                                    item?.price}
                                                </span>
                                                <span className="after">
                                                  /{item?.renewal_type}
                                                </span>
                                              </div>
                                              <div className="pricing-features">
                                                <hr style={{ margin: "0" }} />
                                                <div className="feature">
                                                  FrameWork Features :
                                                </div>
                                                <div className="framework_feature">
                                                  <ul>
                                                    {item?.plan_data?.MAPPED_FRAMEWORK?.map(
                                                      (menu) => (
                                                        <li key={menu.id}>
                                                          {menu.title}
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                                <div className="feature">
                                                  Menu Features :
                                                </div>
                                                <div className="framework_feature">
                                                  <ul>
                                                    {item?.plan_data?.MAPPED_MENUS?.map(
                                                      (menu) => (
                                                        <li key={menu.id}>
                                                          {menu.title}
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              </div>

                                              {item?.auto_renewal == "0" &&
                                                item?.status ==
                                                "PAYMENT_DONE" && (
                                                  <p className="fw-bold">
                                                    This cancellation is
                                                    applicable from{" "}
                                                    {this.changeDateFormat(
                                                      item?.valid_till
                                                    )}
                                                  </p>
                                                )}
                                              {item?.auto_renewal == "1" &&
                                                item?.status == "PAYMENT_DONE" ? (
                                                <a
                                                  id="checkout-and-portal-button"
                                                  onClick={(e) =>
                                                    this.cancelPlane()
                                                  }
                                                  className="price-button price-button-concel"
                                                >
                                                  Cancel
                                                </a>
                                              ) : (
                                                this.state.currentPlan.toString()
                                                  ?.length > 0 &&
                                                item?.price >
                                                this.state.currentPlan && (
                                                  <a
                                                    id="checkout-and-portal-button"
                                                    onClick={(e) =>
                                                      this.upgradePlanPayment(
                                                        item
                                                      )
                                                    }
                                                    className="price-button"
                                                  >
                                                    Upgrad Plan
                                                  </a>
                                                )
                                              )}

                                              {this.state.currentPlan?.length ==
                                                0 &&
                                                (item?.is_invitable == 1 ||
                                                  item?.is_invitable == 0) && (
                                                  <a
                                                    className="price-button"
                                                    onClick={(e) =>
                                                      this.paymentHandler(
                                                        item,
                                                        e
                                                      )
                                                    }
                                                  >
                                                    Get Started
                                                  </a>
                                                )}
                                            </div>
                                            <>
                                              <Modal
                                                show={this.state.updradPlanShow}
                                                onHide={() =>
                                                  this.handleClose()
                                                }
                                              >
                                                <Modal.Header closeButton>
                                                  <Modal.Title>
                                                    Confirmation
                                                  </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                  You need to pay $
                                                  {this.state.updradPrice}
                                                </Modal.Body>
                                                <Modal.Footer>
                                                  <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                      this.upgradePlan()
                                                    }
                                                  >
                                                    Pay
                                                  </Button>
                                                </Modal.Footer>
                                              </Modal>
                                            </>
                                          </Col>
                                        ))}
                                    </Row>
                                    <div className="cards">
                                      <div className="row justify-content-center">
                                        <div className="col-lg-12 col-xs-12 subscription_box">
                                          {items &&
                                            items?.map((item, key) => (
                                              <div key={key} className="mx-4">
                                                {item ? (
                                                  <div className="global_link w-100 btn-d subbutton"></div>
                                                ) : (
                                                  false
                                                )}
                                                <>
                                                  <Modal
                                                    show={
                                                      this.state.updradPlanShow
                                                    }
                                                    onHide={() =>
                                                      this.handleClose()
                                                    }
                                                  >
                                                    <Modal.Header closeButton>
                                                      <Modal.Title>
                                                        Confirmation
                                                      </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                      You need to pay $
                                                      {this.state.updradPrice}
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                      <Button
                                                        variant="primary"
                                                        onClick={() =>
                                                          this.upgradePlan()
                                                        }
                                                      >
                                                        Pay
                                                      </Button>
                                                    </Modal.Footer>
                                                  </Modal>
                                                </>
                                              </div>
                                            ))}
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
                  </section>
                </div>
              </div>
            </div>
          )}
        </PermissionMenuContext.Consumer>
      </div>
    );
  }
}
