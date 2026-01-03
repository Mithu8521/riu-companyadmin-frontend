import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import foot_Logo from "../../img/logol.png";
import head_Logo from "../../img/Zais_logo.png";
import "./common.css";
import "./sidebar.css";

export default class AdminSidebar extends Component {
  render() {
    const company = this.props?.dataFromParent?.split("/");
    return (
      <div>
        <div className="d-flex" id="wrapper">
          {/* <!-- Sidebar--> */}
          <div className="border-end bg-white" id="sidebar-wrapper">
            <div className="sidebar-heading color_xl">
              <div className="logo_text">
                <NavLink to="/dashboard"><img src={head_Logo} alt="" /></NavLink>
              </div>
            </div>
            <div className="list-group list-group-flush">
              <div className="route-dom">
                <ul className="home_icon_img">
                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/dashboard"
                      className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                    >
                      <i className="fal fa-th-large"></i>
                      <span className="home_boom">Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/admin/companies"
                      className={
                        company[2] === "CompaniesTabbingPage"
                          ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                          : company[2] === "ModuleDetail"
                            ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                            : company[2] === "sectorQuestionPage"
                              ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                              : company[2] === "governance"
                                ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                : company[2] === "supplierPage"
                                  ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                  : company[2] === "supplierManagementDetail"
                                    ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                    : company[2] === "sustainablePage"
                                      ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                      : company[2] === "carbonFootprintDetail"
                                        ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                        : company[2] === "boardSkillPage"
                                          ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                          : company[2] === "EsgProduct"
                                            ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                            : company[2] === "GovernanceFast"
                                              ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                              : company[2] === "AdminInvoice"
                                                ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                                                : "list-group-item list-group-item-action list-group-item-light p-3 nop"
                      }
                    >
                      <i className="fal fa-file-chart-line"></i>
                      <span className="home_boom">Companies</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/Zoho-Form"
                      className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                    >
                      <i className="fal fa-file-chart-line"></i>
                      <span className="home_boom">ZOHO FORM</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/admin/sub-admins"
                      a="true"
                      className={
                        company[2] === "UserDetail"
                          ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                          : company[2] === "StatusDetail"
                            ? "active list-group-item list-group-item-action list-group-item-light p-3 nop"
                            : "list-group-item list-group-item-action list-group-item-light p-3 nop"
                      }
                    >
                      <i className="far fa-building"></i>
                      <span className="home_boom">ESG Sub Admins</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/admin/Revenue"
                      className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                    >
                      <i className="far fa-user-cog"></i>
                      <span className="home_boom">Revenue</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/admin/Activities"
                      className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                    >
                      <i className="far fa-chart-line"></i>
                      <span className="home_boom">Activities</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      activeClassName="active"
                      to="/admin/Setting-Detail"
                      className="list-group-item list-group-item-action list-group-item-light p-3 nop"
                    >
                      <i className="fal fa-file-chart-line"></i>
                      <span className="home_boom">Settings</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="slill_bord">
              <img src={foot_Logo} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
