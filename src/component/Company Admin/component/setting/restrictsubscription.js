import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { history } from "../../../../_helpers/history";
import "./billing.css";
import GlobalPlanFeatureComponent from "../setting/globalPlanFeature";
import { NavLink, Link } from "react-router-dom";
import config from "../../../../config/config.json"

import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class Restrictsubscription extends Component {
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
      users: [],
      uuid: "",
      email: "",
    };
    this.getProfileData = this.getProfileData.bind(this);
    this.getGlobalSubscriptionPlan = this.getGlobalSubscriptionPlan.bind(this);
    this.calluuid = this.calluuid.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
  }

  setStartDate = (date) => {
    this.startDate = { date: new Date() };
  };

  getProfileData() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(`${config.API_URL}getProfileData?userId=${localStorage.getItem("user_temp_id")}&current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.calculateTime(result.user[0]?.subscriptionExpiredAt, result.user[0]?.isSubscription)
          this.setState({
            isLoaded2: true,
            uuid: result.user[0]?.uuid,
            email: result.user[0]?.email,
            users: result.user[0]?.no_of_users
          });
          this.calluuid(this.state.uuid);
          this.getGlobalSubscriptionPlan(this.state.users)
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );
  }

  calluuid(uuid) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `getSpecificSubscriptionPlans/${uuid}?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items1: result.plans,
            message: result.message,
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

  calculateTime(endDate, isSubscribe) {
    if (isSubscribe === 1) {
      window.location.href = "/home";
    }
  }

  logout() {
    authenticationService.logout();
    history.push("/");
    localStorage.clear();
  }

  getGlobalSubscriptionPlan(users) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `getGlobalPlanForCompanyAdmin/${users}?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.plans,
            message1: result.message,
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
    this.calluuid();
    this.getProfileData();
    this.getGlobalSubscriptionPlan();
  }

  render() {
    const { items, items1, message, message1, email } = this.state;
    return (
      <div>
        <div className="main_wrapper1">
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framworks1">
                        <section className="forms">
                          <div className="row">
                            <div className="col-md-12 col-xs-12">
                              <div className="business_detail">
                                <div className="heading">
                                  <h4>Purchase Subscription Plan for Access</h4>
                                  <div className="logout mt-4">
                                    <Link
                                      onClick={this.logout}
                                      to="/"
                                      className="new_button_style"
                                    >
                                      <i className="fa fa-sign-out"></i>
                                      <span> Logout</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="sub-heading mt-3">
                                  <p>
                                    <strong>{message}</strong>
                                  </p>
                                </div>
                                <div className="cards">
                                  <div className="row justify-content-center">
                                    <div className="col-lg-12 col-xs-12 my-3 subscription_box">
                                      {items1.map((item, key) => (
                                        <div
                                          key={key}
                                          className="mx-4"
                                        // className="col-lg-3 col-xs-12 my-3"
                                        >
                                          <div className="card-1">
                                            <span className="tag">
                                              {item.title} Plan
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
                                          {item.isSubscribe === true && item.userPlanActive === true && (
                                            <div className="current-plan text-center mt-3">
                                              <p>Your Current Plan</p>
                                              <div className="btn-b">
                                                <NavLink
                                                  to="#"
                                                  type="btn"
                                                  className=""
                                                  data-subscriptionId={JSON.parse(item?.rawData)?.subscription}
                                                  data-userSubscriptionId={item.userSubscriptionId}
                                                  onClick={(e) => this.cancelSubscription(e)}
                                                >
                                                  CANCEL SUBSCRIPTION
                                                </NavLink>
                                              </div>
                                            </div>
                                          )}
                                          {item.isSubscribe === false && (
                                            <div className="global_link w-100 btn-d subbutton">
                                              <form
                                                action={`${config.BASE_URL}api/v1/create-checkout-session?current_role=${localStorage.getItem("role")}`}
                                                method="POST"
                                              >
                                                {/* Add a hidden field with the lookup_key of your Price */}
                                                <input
                                                  type="hidden"
                                                  name="lookup_key"
                                                  value={item.price_key}
                                                />
                                                <input
                                                  type="hidden"
                                                  name="email"
                                                  value={email}
                                                />
                                                <button
                                                  id="checkout-and-portal-button"
                                                  type="submit"
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
                                </div>
                                <div className="sub-heading mt-3">
                                  <p>
                                    <strong>{message1}</strong>
                                  </p>
                                </div>
                                <div className="cards">
                                  <div className="row justify-content-center">
                                    <div className="col-lg-12 col-xs-12 my-3 subscription_box">
                                      {items.map((item, key) => (
                                        <div
                                          key={key}
                                          className="mx-4"
                                        // className="col-lg-3 col-xs-12 my-3"
                                        >
                                          <div className="card-1">
                                            <span className="tag">
                                              {item.title} Plan
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
                                          {item.isSubscribe === true && item.userPlanActive === true && (
                                            <div className="current-plan text-center mt-3">
                                              <p>Your Current Plan</p>
                                              <div className="btn-b">
                                                <NavLink
                                                  to="#"
                                                  type="btn"
                                                  className=""
                                                  data-subscriptionId={JSON.parse(item?.rawData)?.subscription}
                                                  data-userSubscriptionId={item.userSubscriptionId}
                                                  onClick={(e) => this.cancelSubscription(e)}
                                                >
                                                  CANCEL SUBSCRIPTION
                                                </NavLink>
                                              </div>
                                            </div>
                                          )}
                                          {item.isSubscribe === true && item.userPlanActive === false && (
                                            <div className="global_link w-100 btn-d subbutton">
                                              <form
                                                action={`${config.BASE_URL}api/v1/create-checkout-session?current_role=${localStorage.getItem("role")}`}
                                                method="POST"
                                              >
                                                {/* Add a hidden field with the lookup_key of your Price */}
                                                <input
                                                  type="hidden"
                                                  name="lookup_key"
                                                  value={item.price_key}
                                                />
                                                <input
                                                  type="hidden"
                                                  name="email"
                                                  value={email}
                                                />
                                                <button
                                                  id="checkout-and-portal-button"
                                                  type="submit"
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
                                                action={`${config.BASE_URL}api/v1/create-checkout-session?current_role=${localStorage.getItem("role")}`}
                                                method="POST"
                                              >
                                                {/* Add a hidden field with the lookup_key of your Price */}
                                                <input
                                                  type="hidden"
                                                  name="lookup_key"
                                                  value={item.price_key}
                                                />
                                                <input
                                                  type="hidden"
                                                  name="email"
                                                  value={email}
                                                />
                                                <button
                                                  id="checkout-and-portal-button"
                                                  type="submit"
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
      </div>
    );
  }
}
