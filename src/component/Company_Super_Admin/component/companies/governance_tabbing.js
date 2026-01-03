import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../../../Company Sub Admin/Component/Sector Questions/tabbing.css";

export default class GovernanceTabbing extends Component {
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
      uuid: urlArr[urlArr.length - 3],
      uri: urlArr[urlArr.length - 1],
    });
  }
  render() {
    return (
      <div>
        <div className="steps-step ste-steps">
          <div className="tabs-top">
            <ul>
              <li>
                <NavLink
                  to={`/admin/companies/${this.state.uuid}/governance/governance-policy`}
                  className={
                    this.state.uri === "governance-policy"
                      ? "activee active"
                      : ""
                  }
                >
                  Governance Policies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/admin/companies/${this.state.uuid}/governance/social-policy`}
                  className={
                    this.state.uri === "social-policy" ? "activee active" : ""
                  }
                >
                  Social Policies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/admin/companies/${this.state.uuid}/governance/cyber-and-policy`}
                  className={
                    this.state.uri === "cyber-and-policy"
                      ? "activee active"
                      : ""
                  }
                >
                  Cyber & Technology
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/admin/companies/${this.state.uuid}/governance/health-and-safety-policy`}
                  className={
                    this.state.uri === "health-and-safety-policy"
                      ? "activee active"
                      : ""
                  }
                >
                  Health and Safety Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/admin/companies/${this.state.uuid}/governance/environmental-policy`}
                  className={
                    this.state.uri === "environmental-policy"
                      ? "activee active"
                      : ""
                  }
                >
                  Enviornmental Policy
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
