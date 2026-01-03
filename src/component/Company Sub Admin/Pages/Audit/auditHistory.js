import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../Pages/management/management.css";
import { Form } from "react-bootstrap";
import "../../../sidebar/common.css";
import { Button, Modal } from "react-bootstrap";

export default class AuditHistory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      selectedUser: props.location,
      show: false,
      close: false,
    };
  }
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        {/* <Loader /> */}
        <div className="main_wrapper">
          <div className="inner_wraapper pt-5">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <div className="col-md-12">
                          <div className="Environmental audit_enviornmental">
                            <h4 className="Environmental_text">
                              Audit History
                            </h4>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12">
                          <Form>
                            <div className="heading_h3 mt-3">
                              <span className="gement">
                                Customer Privacy &amp; Technology Standards
                              </span>
                            </div>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q1. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q2. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q3. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q4. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q5. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 form_audit_d"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="energy mb-3 font-increase">
                                Q6. What is the company's strategy to secure
                                customer's personal health information records
                                and other personally identifiable information?
                              </Form.Label>
                              <div className="attachment_with_icons">
                                <span>
                                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 34C7.6109 34 0 26.3891 0 17C0 7.6109 7.6109 0 17 0C26.3891 0 34 7.6109 34 17C34 26.3891 26.3891 34 17 34ZM17 30.6C20.6069 30.6 24.0662 29.1671 26.6167 26.6167C29.1671 24.0662 30.6 20.6069 30.6 17C30.6 13.3931 29.1671 9.93384 26.6167 7.38335C24.0662 4.83285 20.6069 3.4 17 3.4C13.3931 3.4 9.93384 4.83285 7.38335 7.38335C4.83285 9.93384 3.4 13.3931 3.4 17C3.4 20.6069 4.83285 24.0662 7.38335 26.6167C9.93384 29.1671 13.3931 30.6 17 30.6Z" fill="#A7ACC8"></path><path d="M22.6 16.75H22.35V17V22.1944H11.65V17V16.75H11.4H10H9.75V17V23.2222C9.75 23.4868 9.84435 23.7452 10.0192 23.9394C10.1948 24.1346 10.439 24.25 10.7 24.25H23.3C23.561 24.25 23.8052 24.1346 23.9808 23.9394C24.1556 23.7452 24.25 23.4868 24.25 23.2222V17V16.75H24H22.6ZM12.8 14.9167H16.05V20.1111V20.3611H16.3H17.7H17.95V20.1111V14.9167H21.2H21.7613L21.3858 14.4994L17.1858 9.83276L17 9.62629L16.8142 9.83276L12.6142 14.4994L12.2387 14.9167H12.8Z" fill="#A7ACC8" stroke="#A7ACC8" stroke-width="0.5"></path></svg>
                                </span>
                                <span className="icon_with_function">
                                  <NavLink to="#">
                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 17C0.5 7.8873 7.8873 0.5 17 0.5C26.1127 0.5 33.5 7.8873 33.5 17V28.6667L33.5 28.7251C33.5 29.2979 33.5001 29.8239 33.4604 30.262C33.4175 30.7356 33.3188 31.2516 33.0311 31.75C32.7239 32.2821 32.2821 32.7239 31.75 33.0311C31.2516 33.3188 30.7356 33.4175 30.262 33.4604C29.8239 33.5001 29.2979 33.5 28.7251 33.5L28.6667 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17ZM17 3.5C9.54416 3.5 3.5 9.54416 3.5 17C3.5 24.4558 9.54416 30.5 17 30.5H28.6667C29.3174 30.5 29.7051 30.4986 29.9912 30.4726C30.164 30.457 30.236 30.4365 30.2558 30.4296C30.3273 30.387 30.387 30.3273 30.4296 30.2558C30.4365 30.236 30.457 30.164 30.4726 29.9912C30.4986 29.7051 30.5 29.3174 30.5 28.6667V17C30.5 9.54416 24.4558 3.5 17 3.5ZM30.4272 30.2618C30.4272 30.2617 30.4277 30.2602 30.429 30.2576C30.4279 30.2606 30.4273 30.2619 30.4272 30.2618ZM30.2618 30.4272C30.2619 30.4272 30.2606 30.4279 30.2576 30.429C30.2602 30.4277 30.2617 30.4272 30.2618 30.4272ZM9.5 15C9.5 14.1716 10.1716 13.5 11 13.5H23C23.8284 13.5 24.5 14.1716 24.5 15C24.5 15.8284 23.8284 16.5 23 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15ZM17 21.5C16.1716 21.5 15.5 22.1716 15.5 23C15.5 23.8284 16.1716 24.5 17 24.5H23C23.8284 24.5 24.5 23.8284 24.5 23C24.5 22.1716 23.8284 21.5 23 21.5H17Z" fill="#1f9ed1"></path><defs><linearGradient id="paint0_linear_1_206" x1="11" y1="2.5" x2="36" y2="45.5" gradientUnits="userSpaceOnUse"><stop stop-color="#233076"></stop><stop offset="1" stop-color="#3BABD6"></stop></linearGradient></defs></svg>
                                  </NavLink>
                                  <div className="toast-header border-none">
                                    <button type="button" className="new_button_style1 close" data-dismiss="toast" aria-label="Close">
                                      <span data-id="411" aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            </Form.Group>
                          </Form>
                          <div className="button_audit global_link">
                            <NavLink to="/audit_companies_nodata" className="link_bal_next disabled" aria-disabled="true">Complete</NavLink>
                            <button className="page_save page_width mx-3" variant="none" onClick={() => this.setState({ show: true })} > Add Remark </button>
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

        {/* Modal */}
        <Modal show={this.state.show} animation={true} size="md" className="modal_box" shadow-lg="border" >
          <div className="modal-lg">
            <Modal.Header className="pb-0">
              <Button variant="outline-dark" onClick={() => this.setState({ show: false })} >
                <i className="fa fa-times"></i>
              </Button>
            </Modal.Header>
            <div className="modal-body vekp pt-0">
              <div className="row">
                <div className="col-md-12">
                  <div className="response">
                    <h4>Add Remarks</h4>
                    <div className="form-group audit-re">
                      <label for="message-text" className="col-form-label">Please submit your remarks here</label>
                      <textarea className="form-control" id="message-text"></textarea>
                    </div>
                    <div className="global_link">
                      <NavLink className="page_save page_width" to={"sector_questions"} > Submit </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
