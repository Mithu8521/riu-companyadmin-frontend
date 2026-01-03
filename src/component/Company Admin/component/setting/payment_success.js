import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import PaymentSuccessful from "../../../../img/payment-successful.png";
import "./working_progress.css";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class paymentSuccessful extends Component {
  constructor(props) {
    localStorage.setItem("subscriptionAuth", JSON.stringify(200));
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      invoiceId: "",
      sessionId: window.location.href.split('/').pop(),
    };
  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.API_URL + `paymentSuccess?session_id=${this.state.sessionId}&current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            dataa: result.data,
            customerData: result.customerData,
            invoiceId: result.data.id,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    (function () {
      var lastCompletedSlide = 0,
        slides = [
          ...document.querySelectorAll(
            "[data-progress-bar-component] [data-progress-bar-step]"
          ),
        ],
        numberOfSlides = slides.length,
        classes = {
          completed: "is-complete",
          readyForAnimation: "is-ready-for-animation",
        };

      function next() {
        if (lastCompletedSlide === numberOfSlides) return;
        slides[lastCompletedSlide].classList.add(classes.completed);
        lastCompletedSlide++;
      }

      function previous() {
        if (lastCompletedSlide === 0) return;
        slides[lastCompletedSlide - 1].classList.remove(classes.completed);
        lastCompletedSlide--;
      }

      function addReadyForAnimationClass() {
        setTimeout(function () {
          [
            ...document.querySelectorAll("[data-progress-bar-component]"),
          ].forEach(function (component) {
            component.classList.add(classes.readyForAnimation);
          });
        }, 1000);
      }

      function addEventListeners() {
        document.addEventListener("click", function (event) {
          if ("next" in event.target.dataset) {
            next();
          }
          if ("previous" in event.target.dataset) {
            previous();
          }
        });
      }

      function init() {
        addEventListeners();
        addReadyForAnimationClass();
      }

      document.addEventListener("DOMContentLoaded", init);
    })();
  }
  render() {
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
                      <div className="frameworks framwork_2">
                        <div className="text-image">
                          <div className="row">
                            <div className="col-md-6 col-xs-12">
                              <div className="text-successFul">
                                <h4>Payment Successful</h4>
                                <p>
                                  Your Order was successfully processed, your
                                  order id <b>No: {this.state.invoiceId}</b>
                                </p>
                                <p>Check your email for reciept</p>
                                <div className="d-flex flex-column">
                                  <div className="col-md-12">
                                    <div className=" my-4">
                                      <div className="heading text-head">
                                        <span>Payment Selected</span>
                                        <span>Payment Recieved</span>
                                        <span>Processing Report</span>
                                      </div>
                                      <div className="progresses">
                                        <div className="steps">

                                          <span>
                                            <i className="fa fa-check"></i>
                                          </span>
                                        </div>
                                        <span className="line1"></span>
                                        <div className="steps">

                                          <span>
                                            <i className="fa fa-check"></i>
                                          </span>
                                        </div>
                                        <span className="line"></span>
                                        <div className="steps">

                                          <span className="font-weight-bold">
                                            <i className="fa fa-check"></i>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="global_link m-0">
                                  <NavLink
                                    className="page_width link_bal_next mx-3"
                                    to={"/"}
                                  >
                                    Back Home
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xs-12">
                              <div className="image_r">
                                <img
                                  className=""
                                  src={PaymentSuccessful}
                                  alt=""
                                />
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
