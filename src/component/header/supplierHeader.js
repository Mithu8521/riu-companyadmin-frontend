import React, { Component } from "react";
import head_Logo from "../../img/logo.png";
import { authenticationService } from "../../_services/authentication";
import { history } from "../../_helpers/history";
import "./header.css";
export default class supplierHeader extends Component {
  logout() {
    authenticationService.logout();
    history.push("/");
  }
  render() {
    return (
      <div>
        <div className="d-flex" id="wrapper">
          <div id="page-content-wrapper2">
            <nav className="navbar navbar-expand-lg  border-bottom navclassName background2">
              <div className="sidebar-heading color_xl">
                <div className="logo_text">
                  <img src={head_Logo} alt="" />
                </div>
              </div>
              <div className="container-fluid">
                <div className="deahbord" id="sidebarToggle">
                  <h4>Dashboard</h4>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
