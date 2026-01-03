import React, { Component } from "react";
import "./companies.css";
import { NavLink } from "react-router-dom";

export default class Companies_tabbing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: "",
      uri: "",
    };
  }
  componentDidMount() {
    let urlArr = window.location.pathname.split("/");
    this.setState({
      uuid: urlArr[urlArr.length - 2],
      uri: urlArr[urlArr.length - 1],
    });
  }

  render() {
    return (
      <div>
        <div className="tabs-top my-0">
          <ul>
            <li>
              <NavLink
                className={this.state.uri === "details" ? "activee" : ""}
                to={`/admin/companies/${this.state.uuid}/details`}
              >
                Company Details
              </NavLink>
            </li>
            <li>
              <NavLink
                className={this.state.uri === "modules" ? "activee" : ""}
                to={`/admin/companies/${this.state.uuid}/modules`}
              >
                Modules
              </NavLink>
            </li>
            <li>
              <NavLink
                className={this.state.uri === "sub-admin" ? "activee" : ""}
                to={`/admin/companies/${this.state.uuid}/sub-admin`}
              >
                Sub Admins
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/companies/${this.state.uuid}/billing-details`}
                className={
                  this.state.uri === "billing-details" ? "activee" : ""
                }
              >
                Billing Details
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
