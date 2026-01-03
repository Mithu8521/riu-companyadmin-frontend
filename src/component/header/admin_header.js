/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { authenticationService } from "../../_services/authentication";
import { history } from "../../_helpers/history";
import { Link } from "react-router-dom";
import "./header.css";
const ProfilePics = "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png"
export default class header extends Component {
  constructor(props) {
    super(props);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
  }
  goToPreviousPath() {
    window.history.back();
  }
  logout() {
    authenticationService.logout();
    history.push("/");
    localStorage.clear();
  }
  render() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let fullUrl = window.location.href.split("/");
    let urr = "";
    if (fullUrl[3] !== "user_detail") {
      urr = fullUrl.pop().toUpperCase();
    } else {
      urr = fullUrl[3];
    }
    let finalResult = urr.replaceAll("_", " ");
    if (finalResult === "SUPPLIER FAST") {
      finalResult = "SUPPLIER";
    }
    if (finalResult === "SUSTAINABLE") {
      finalResult = "SUSTAINABLE DEVELOPMENT GOALS";
    }

    if (fullUrl.pop() === 'details') {
      finalResult = "details";
    }

    return (
      <div>
        <div className="d-flex" id="wrapper">
          {/* <!-- Page content wrapper--> */}
          <div id="page-content-wrapper">
            {/* <!-- Top navigation--> */}
            <nav className="navbar navbar-expand-lg  border-bottom navclassName background">
              <div className="container-fluid">
                <div className="deahbord" id="sidebarToggle">
                  <h4 className="back_quninti back_quninti_2">
                    <a className="back_text" href="#">
                      <span className="step_icon">
                        <i
                          onClick={this.goToPreviousPath}
                          className="far fa-long-arrow-left"
                        ></i>
                      </span>
                      {finalResult}
                    </a>
                  </h4>
                </div>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                    <li className="nav-item dropdown text_down">
                      <div className="image_round">
                        <img src={ProfilePics} className="image--coverq" />
                      </div>
                      {/* <a
                        className="nav-link home_drop"
                        id="navbarDropdown"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {currentUser.data.name}
                        <i
                          className="fa fa-caret-down elly"
                          aria-hidden="true"
                        ></i>
                        <p className="text_p">Super Admin</p>
                      </a> */}

                      <div
                        className="dropdown-menu dropdown-menu-end dropdown_menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <Link to="/admin/Setting-Detail?tab=profile" className="dropdown-item">
                          <i className="fa fa-user"></i>
                          <span>My Profile</span>
                        </Link>
                        <Link to="/admin/Setting-Detail?tab=auth" className="dropdown-item">
                          <i className="fa fa-lock"></i>
                          <span>Two Factor Auth</span>
                        </Link>
                        <Link to="/admin/Setting-Detail?tab=subscription" className="dropdown-item">
                          <i className="fa fa-dollar-sign"></i>
                          <span>Subscription</span>
                        </Link>
                        <Link
                          onClick={this.logout}
                          to="/"
                          className="dropdown-item"
                        >
                          <i className="fa fa-sign-out"></i>
                          <span>Logout</span>
                        </Link>

                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            {/* <!-- Page content--> */}
          </div>
          {/* <!-- main --> */}
        </div>
      </div>
    );
  }
}
