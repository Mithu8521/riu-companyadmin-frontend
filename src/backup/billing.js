/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Moment from "react-moment";
import GlobalPlanFeatureComponent from "../setting/globalPlanFeature";
import "react-datepicker/dist/react-datepicker.css";
import { Pagination, Icon, Container, Divider } from "semantic-ui-react";
import "./billing.css";
import config from "../../../../config/config.json";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import Razorpay from "razorpay";
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
    // this.getGlobalSubscriptionPlan = this.getGlobalSubscriptionPlan.bind(this);
    // this.calluuid = this.calluuid.bind(this);
    // this.cancelSubscription = this.cancelSubscription.bind(this);
  }

  setStartDate = (date) => {
    this.startDate = { date: new Date() };
  };

  async getProfileData(role_id) {
    // const headers = {
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   Accept: "application/json",
    // };
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
      // this.calluuid(this.state.uuid);
      this.serverRequest(this.state.uuid);
      this.getGlobalSubscriptionPlan(this.state.users);
    } else {
      this.setState({
        isLoaded2: true,
        error,
      });
    }
    // fetch(config.API_URL + "getProfileData", { headers })
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       this.setState({
    //         isLoaded2: true,
    //         uuid: result.user[0]?.id,
    //         users: result.user[0]?.no_of_users
    //       });
    //       this.calluuid(this.state.uuid);
    //       this.serverRequest(this.state.uuid);
    //       this.getGlobalSubscriptionPlan(this.state.users)

    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded2: true,
    //         error,
    //       });
    //     }
    //   );
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
    // const requestOptions = {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     "Content-Type": "application/json",
    //   },
    // };
    // let parms = `company/${uuid}/modules/billingDetails/getAllUserSubscriptions?skip=${skip}&limit=${limit}&startDate=${setStartDate}&endDate=${setEndDate}`;
    // fetch(config.ADMIN_API_URL + parms, requestOptions)
    //   .then((res) => res.json())
    //   .then(
    //     (data) => {
    //       console.log(data,"billing");
    //       this.setState({
    //         pageCount: Math.ceil(data.length / this.state.perPage),
    //         totalData: data.data.totalCount,
    //         items3: data.data.items,
    //         uuid1:  (data.data.items.length > 0) ? data.data.items[0].uuid : '',
    //         expire: data.data.expire
    //       });
    //     },
    //     (error) => {}
    //   );
  }

  // cancelSubscription(event){
  //   event.preventDefault();
  //   this.setState({ submitted: true });
  //   let subscriptionId = event.target.getAttribute("data-subscriptionid");
  //   let userSubscriptionId = event.target.getAttribute("data-userSubscriptionId");
  //   console.log("subscriptionId",subscriptionId)

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       subscriptionId: subscriptionId,
  //       userSubscriptionId:userSubscriptionId
  //     }),
  //   };

  //   fetch(
  //     config.API_URL + `cancelSubscription`,
  //     requestOptions
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         sweetAlert("success", result.message);
  //         setTimeout(() => {
  //           this.serverRequest();
  //         }, 1000);
  //       },
  //       (error) => {
  //         sweetAlert("error", "Something Went wrong");
  //         setTimeout(() => {
  //           this.serverRequest();
  //         }, 1000);
  //       }
  //     );
  // }
  // calluuid(uuid) {
  //   const headers = {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     Accept: "application/json",
  //   };
  //   console.log(uuid,"uuid");
  //   fetch(config.API_URL + `getSpecificSubscriptionPlans/${uuid}`, { headers })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           isLoaded: true,
  //           items1: result.plans,
  //           message: result.message,
  //         });
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error,
  //         });
  //       }
  //     );
  // }
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
  // const handleClose = () => setShow(false);
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
          // callback_url: "http://127.0.0.1:3001/#/Setting_Billing",
          handler: (response) => {
            this.upgradePlanPaymentDone(response.razorpay_order_id);
            // ...
          },
          // handler: function (response) {
          //   this.paymentDone(response.razorpay_order_id)
          //   // alert(response.razorpay_payment_id);
          //   // alert(response.razorpay_order_id);
          //   // alert(response.razorpay_signature);
          // },
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
        config.API_URL + ` `,
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
          // callback_url: "http://127.0.0.1:3001/#/Setting_Billing",
          handler: (response) => {
            this.paymentDone(response.razorpay_order_id);
            // ...
          },
          // handler: function (response) {
          //   this.paymentDone(response.razorpay_order_id)
          //   // alert(response.razorpay_payment_id);
          //   // alert(response.razorpay_order_id);
          //   // alert(response.razorpay_signature);
          // },
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

      // const currentPlan = data.data.map()
      // console.log("current plan",data.data)
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
    // fetch(config.API_URL + `getAllSubscription?subscription_type=All`, { headers })
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       console.log(result,"result");
    //       this.setState({
    //         isLoaded: true,
    //         items: result?.data,
    //         message1: result.message,
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
                                    {/* <div className="heading text-center">
                                      <h4> Subscription Plan </h4>
                                    </div> */}
                                    <div className="sub-heading">
                                      <p className="m-0">
                                        <strong>{message}</strong>
                                      </p>
                                    </div>

                                    <Row>
                                      {/* <Col md={4}>
                                            
                                            <div className="pricing-table purple">
                                              <div className="pricing-label">
                                                Fixed Price
                                              </div>
                                              <h2>BasicPack 2020</h2>
                                              <h5>Made for starters</h5>
                                              <div className="pricing-features">
                                                <div className="feature">
                                                  Bandwith<span>50 GB</span>
                                                </div>
                                                <div className="feature">
                                                  Add-On Domains
                                                  <span>10</span>
                                                </div>
                                                <div className="feature">
                                                  SSD Storage
                                                  <span>250 GB</span>
                                                </div>
                                                <div className="feature">
                                                  Mail Adresses<span>25</span>
                                                </div>
                                                <div className="feature">
                                                  Support
                                                  <span>Only Mail</span>
                                                </div>
                                              </div>
                                              <div className="price-tag">
                                                <span className="symbol">
                                                  $
                                                </span>
                                                <span className="amount">
                                                  7.99
                                                </span>
                                                <span className="after">
                                                  /month
                                                </span>
                                              </div>
                                              <a
                                                className="price-button"
                                                href="#"
                                              >
                                                Get Started
                                              </a>
                                            </div>
                                          </Col> */}
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
                                                    {/* <Col md={6}>
                                                        <div>
                                                          Amount :{" "}
                                                          <span>
                                                            {
                                                              item?.payment_amount
                                                            }
                                                            /-
                                                          </span>
                                                        </div>
                                                      </Col> */}
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
                                                {/* <div className="feature">
                                                  Price :
                                                  <span> {item?.price}/-</span>
                                                </div> */}

                                                <hr style={{ margin: "0" }} />
                                                {/* <div className="feature">
                                                  Type :
                                                  <span>
                                                    {" "}
                                                    {item?.renewal_type}
                                                  </span>
                                                </div>
                                                <div className="feature">
                                                  Validity :
                                                  <span> {item?.validity}</span>
                                                </div> */}
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
                                      {/* <Col md={4}>
                                            <div className="pricing-table red">
                                              <div className="pricing-label">
                                                Fixed Price
                                              </div>
                                              <h2>ProsPack 2020</h2>
                                              <h5>
                                                Made for
                                                professionals/agencies
                                              </h5>
                                              <div className="pricing-features">
                                                <div className="feature">
                                                  Bandwith<span>250 GB</span>
                                                </div>
                                                <div className="feature">
                                                  Add-On Domains
                                                  <span>50</span>
                                                </div>
                                                <div className="feature">
                                                  SSD Storage<span>1 TB</span>
                                                </div>
                                                <div className="feature">
                                                  Mail Adresses<span>75</span>
                                                </div>
                                                <div className="feature">
                                                  Support<span>7/24</span>
                                                </div>
                                              </div>
                                              <div className="price-tag">
                                                <span className="symbol">
                                                  $
                                                </span>
                                                <span className="amount">
                                                  12.99
                                                </span>
                                                <span className="after">
                                                  /month
                                                </span>
                                              </div>
                                              <a
                                                className="price-button"
                                                href="#"
                                              >
                                                Get Started
                                              </a>
                                            </div>
                                          </Col> */}
                                    </Row>
                                    <div className="cards">
                                      <div className="row justify-content-center">
                                        <div className="col-lg-12 col-xs-12 subscription_box">
                                          {items &&
                                            items?.map((item, key) => (
                                              <div key={key} className="mx-4">
                                                {/* <div className="card-1">
                                                  <span className="tag">
                                                    {item.title}
                                                  </span>
                                                  {item?.payment_amount && (
                                                    <>
                                                    
                                                      <div
                                                        className="d-flex justify-content-center align-items-baseline mt-3"
                                                        style={{ gap: "20px" }}
                                                      >
                                                     
                                                        <h4 className="green">
                                                          {item?.payment_amount}
                                                          /-
                                                        </h4>
                                                        <h4
                                                          className="text-decoration-line-through red"
                                                          style={{
                                                            fontSize: "15px",
                                                          }}
                                                        >
                                                          {item?.price}/-
                                                        </h4>
                                                      </div>
                                                      <div className="d-flex justify-content-center">
                                                      
                                                        <h5 className="justify-content-center d-flex mb-4 mt-2">
                                                          (
                                                          {(Number(
                                                            item?.price -
                                                              item?.payment_amount
                                                          ) *
                                                            100) /
                                                            Number(item?.price)}
                                                          % Discount)
                                                        </h5>
                                                      </div>
                                                    </>
                                                  )}

                                                  {!item?.payment_amount && (
                                                    <h4>{item?.price}/</h4>
                                                  )}
                                                  <h6>
                                                    <b>Features Included:</b>
                                                  </h6>

                                                  <div className="data_card-2 pb-4">
                                                    <ul className="planFeatures">
                                                      <h6>
                                                        <b>
                                                          Type :{" "}
                                                          {item?.renewal_type}
                                                        </b>
                                                      </h6>
                                                      <h6>
                                                        validity :{" "}
                                                        {item?.validity}
                                                      </h6>

                                                   
                                                    </ul>
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
                                                </div> */}

                                                {/* {item.isSubscribe === true &&
                                                  item.userPlanActive ===
                                                    true && (
                                                    <div className="current-plan text-center">
                                                      <div className="btn-b">
                                                        <button
                                                          id="checkout-and-portal-button"
                                                          type="submit"
                                                          className="new_button_style m-3"
                                                          data-subscriptionId={
                                                            JSON.parse(
                                                              item?.rawData
                                                            )?.subscription
                                                          }
                                                          data-userSubscriptionId={
                                                            item.userSubscriptionId
                                                          }
                                                          onClick={(e) =>
                                                            this.cancelSubscription(
                                                              e
                                                            )
                                                          }
                                                        >
                                                          Cancel Plan
                                                        </button>
                                                        <p>
                                                          Your Current Plan
                                                          <br />
                                                          Ends On: &nbsp;
                                                          <Moment
                                                            format="DD MMM YYYY"
                                                            withTitle
                                                          >
                                                            {item.updated_at}
                                                          </Moment>{" "}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  )} */}
                                                {item ? (
                                                  <div className="global_link w-100 btn-d subbutton">
                                                    {/* <form
                                                      action={`${config.BASE_URL}api/v1/create-checkout-session`}
                                                      method="POST"
                                                    >
                                       
                                                      <input
                                                        type="hidden"
                                                        name="lookup_key"
                                                        value={item?.price_key}
                                                      />
                                                      <input
                                                        type="hidden"
                                                        name="email"
                                                        value=""
                                                      />
                                                    </form> */}
                                                    {/* {
                                                       item?.status ==
                                                       "PAYMENT_DONE"&& 
                                                       (
                                                        <div className="current-plan text-center">
                                                          <div className="btn-b">
                                                            <button
                                                              id="checkout-and-portal-button"
                                                              type="submit"
                                                              className="new_button_style m-3"
                                                              data-subscriptionId={
                                                                JSON.parse(
                                                                  item?.rawData
                                                                )?.subscription
                                                              }
                                                              data-userSubscriptionId={
                                                                item.userSubscriptionId
                                                              }
                                                              onClick={(e) =>
                                                                this.cancelSubscription(
                                                                  e
                                                                )
                                                              }
                                                            >
                                                              Cancel Plan
                                                            </button>
                                                            <p>
                                                              Your Current Plan
                                                              <br />
                                                              Ends On: &nbsp;
                                                              <Moment
                                                                format="DD MMM YYYY"
                                                                withTitle
                                                              >
                                                                {
                                                                  item.updated_at
                                                                }
                                                              </Moment>{" "}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      )} */}

                                                    {/* {item?.auto_renewal == "1" &&
                                                    item?.status ==
                                                      "PAYMENT_DONE" ? (
                                                      <button
                                                        id="checkout-and-portal-button"
                                                        onClick={(e) =>
                                                          this.cancelPlane()
                                                        }
                                                        className="new_button_style"
                                                      >
                                                        Cancel
                                                      </button>
                                                    ) : (
                                                      <button
                                                        id="checkout-and-portal-button"
                                                        onClick={(e) =>
                                                          this.paymentHandler(
                                                            item,
                                                            e
                                                          )
                                                        }
                                                        className="new_button_style"
                                                      >
                                                        Select Plan
                                                      </button>
                                                    )} */}

                                                    {/* {item?.auto_renewal ==
                                                      "1" &&
                                                    item?.status ==
                                                      "PAYMENT_DONE" ? (
                                                      <button
                                                        id="checkout-and-portal-button"
                                                        onClick={(e) =>
                                                          this.cancelPlane()
                                                        }
                                                        className="new_button_style"
                                                      >
                                                        Cancel
                                                      </button>
                                                    ) : (
                                                      this.state.currentPlan.toString()
                                                        ?.length > 0 &&
                                                      item?.price >
                                                        this.state
                                                          .currentPlan && (
                                                        <button
                                                          id="checkout-and-portal-button"
                                                          onClick={(e) =>
                                                            this.upgradePlanPayment(
                                                              item
                                                            )
                                                          }
                                                          className="new_button_style"
                                                        >
                                                          Upgrad Plan
                                                        </button>
                                                      )
                                                    )}

                                                    {this.state.currentPlan
                                                      ?.length == 0 &&
                                                      item?.is_invitable ==
                                                        1 && (
                                                        <button
                                                          id="checkout-and-portal-button"
                                                          onClick={(e) =>
                                                            this.paymentHandler(
                                                              item,
                                                              e
                                                            )
                                                          }
                                                          className="new_button_style"
                                                        >
                                                          Make Payment
                                                        </button>
                                                      )} */}
                                                  </div>
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
                                    {/* <div className="sub-heading">
                                      <p>
                                        <strong>{message}</strong>
                                      </p>
                                    </div> */}
                                    {/* <div className="cards">
                                      <div className="row justify-content-center">
                                        <div className="col-lg-12 col-xs-12 my-3 subscription_box">
                                          {items1?.length > 0 &&
                                            items?.map((item, key) => (
                                              <div
                                                key={key}
                                                className="mx-4"
                                              >
                                                <div className="card-1">
                                                  <span className="tag">
                                                    {item?.title} Plan
                                                  </span>
                                                  <h4>
                                                    ${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                                              <span>{item.tier}</span>
                                                  </h4>
                                                  <h6>
                                                    <b>Features Included:</b>
                                                  </h6>
                                                  <div className="data_card-2 pb-4">
                                                    <ul className="planFeatures">
                                                      <GlobalPlanFeatureComponent
                                                items={JSON.parse(item.metaData.split(
                                                  ","
                                                ))}
                                              />
                                                    </ul>
                                                  </div>
                                                </div>
                                                {item.isSubscribe === true &&
                                                  item.userPlanActive ===
                                                    true && (
                                                    <div className="current-plan text-center">
                                                      <div className="btn-b">
                                                        <button
                                                          id="checkout-and-portal-button"
                                                          type="submit"
                                                          className="new_button_style m-3"
                                                          data-subscriptionId={
                                                            JSON.parse(
                                                              item?.rawData
                                                            )?.subscription
                                                          }
                                                          data-userSubscriptionId={
                                                            item.userSubscriptionId
                                                          }
                                                          onClick={(e) =>
                                                            this.cancelSubscription(
                                                              e
                                                            )
                                                          }
                                                        >
                                                          Cancel Plan
                                                          
                                                        </button>
                                                        <p>Your Current Plan</p>

                                                        <p>
                                                          Ends On: &nbsp;
                                                          {expire.map(
                                                            (data, key) => (
                                                              <span key={key}>
                                                                {data}
                                                              </span>
                                                            )
                                                          )}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  )}
                                                {item.isSubscribe === true &&
                                                  item.userPlanActive ===
                                                    false && (
                                                    <div className="global_link w-100 btn-d subbutton">
                                                      <form
                                                        action={`${config.BASE_URL}api/v1/create-checkout-session`}
                                                        method="POST"
                                                      >
                                                        <input
                                                          type="hidden"
                                                          name="lookup_key"
                                                          value={item.price_key}
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="email"
                                                          value={localStorage.getItem(
                                                            "user_temp_email"
                                                          )}
                                                        />
                                                        <button
                                                          id="checkout-and-portal-button"
                                                          className="new_button_style"
                                                        >
                                                          Select Plan
                                                        </button>
                                                      </form>
                                                    </div>
                                                  )}
                                                {item.isSubscribe === false && (
                                                  <div className="global_link w-100 btn-d subbutton">
                                                    <form
                                                      action={`${config.BASE_URL}api/v1/create-checkout-session`}
                                                      method="POST"
                                                    >
                                                      <input
                                                        type="hidden"
                                                        name="lookup_key"
                                                        value={item.price_key}
                                                      />
                                                      <input
                                                        type="hidden"
                                                        name="email"
                                                        value={localStorage.getItem(
                                                          "user_temp_email"
                                                        )}
                                                      />
                                                      <button
                                                        id="checkout-and-portal-button"
                                                        className="new_button_style"
                                                      >
                                                        Select Plan
                                                      </button>
                                                    </form>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div> */}
                                    {/* <div className="hello" /> */}

                                    {/* <hr className="line mt-5"></hr>
                                <div className="refer">
                                  <div className="business_detail">
                                    <div className="heading">
                                      <h4>Refer a Business</h4>
                                    </div>
                                  </div>
                                  <div className="sub-heading mt-3"> */}
                                    {/* <h5> Add the below text and functionality.</h5><br/> */}
                                    {/* <p>
                                      Refer a business to RIU and get the
                                      following credit against your next
                                      invoice.
                                    </p>
                                  </div>
                                  <ul className="refer-list">
                                    <li>
                                      1 - 5 (per successful lead):{" "}
                                      <span className="price">$150</span>
                                    </li>
                                    <li>
                                      6 - 20 (per successful lead):{" "}
                                      <span className="price">$250</span>
                                    </li>
                                    <li>
                                      21+ (per successful lead):{" "}
                                      <span className="price">$500</span>
                                    </li>
                                  </ul>
                                  <a href="#">
                                    <button
                                      className="new_button_style"
                                      type="submit"
                                    >
                                      Refer Now
                                    </button>
                                  </a>
                                </div> */}
                                    {/* <hr className="line mt-5"></hr> */}
                                    {/* <div className="col-sm-12">
                                  <div className="business_detail">
                                    <div className="saved_cards">
                                      <div className="business_detail">
                                        <div className="heading">
                                          <div className="heading_wth_text"></div>
                                          <form>
                                            <div className="row">
                                              <div className="col-md-6 col-xs-12 mb-3">
                                                <div className="form-group">
                                                  <label htmlFor="exampleInputEmail1">
                                                    Date From
                                                  </label>
                                                  <input
                                                    type="date"
                                                    onChange={
                                                      (this.handleChange,
                                                      this.onDateChange)
                                                    }
                                                    className="form-control date-picker"
                                                    name="setStartDate"
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-md-6 col-xs-12 mb-3">
                                                <div className="form-group">
                                                  <label htmlFor="exampleInputEmail1">
                                                    Date To
                                                  </label>
                                                  <input
                                                    type="date"
                                                    onChange={
                                                      (this.handleChange,
                                                      this.onDateChange)
                                                    }
                                                    className="form-control date-picker"
                                                    name="setEndDate"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                      </div>

                                      <div className="table_f">
                                        <Table striped bordered hover size="sm">
                                          <thead>
                                            <tr className="heading_color">
                                              <th>INVOICE ID</th>
                                              <th>SUBSCRIPTION PLAN</th>
                                              <th>MONTH</th>
                                              <th>AMOUNT PAID</th>
                                              <th>INVOICE</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {items3.map((item, key) => (
                                              <tr key={key}>
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>
                                                <td>
                                                  {" "}
                                                  <Moment
                                                    format="MMM YYYY"
                                                    withTitle
                                                  >
                                                    {items[0]?.created_a
                                                      t}
                                                  </Moment>
                                                </td>
                                                <td>${item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>
                                                  <NavLink
                                                    to={`/details/${uuid1}/invoice`}
                                                    className="table-tag"
                                                  >
                                                    <span>
                                                      <i className="fa fa-eye"></i>
                                                    </span>
                                                    View
                                                  </NavLink>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </Table>
                                        <Pagination
                                          className="mx-auto pagination"
                                          defaultActivePage={1}
                                          onPageChange={this.pageChange}
                                          ellipsisItem={{
                                            content: (
                                              <Icon name="ellipsis horizontal" />
                                            ),
                                            icon: true,
                                          }}
                                          firstItem={{
                                            content: (
                                              <Icon name="angle double left" />
                                            ),
                                            icon: true,
                                          }}
                                          lastItem={{
                                            content: (
                                              <Icon name="angle double right" />
                                            ),
                                            icon: true,
                                          }}
                                          prevItem={{
                                            content: <Icon name="angle left" />,
                                            icon: true,
                                          }}
                                          nextItem={{
                                            content: (
                                              <Icon name="angle right" />
                                            ),
                                            icon: true,
                                          }}
                                          totalPages={Math.ceil(
                                            this.state.totalData /
                                              this.state.limit
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div> */}
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
