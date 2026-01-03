import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class DyanamicTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      tabs: [],
      pathName: window.location.pathname,
    };
  }
  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.API_URL + `getSectorQuestionTabsApi?current_role=${localStorage.getItem("role")}`, {
      headers,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            tabs: result.tabs,
          });
          this.props.parentCallback(result.tabs);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { tabs, pathName } = this.state;

    let data = (
      <ul>
        {tabs.map((value, index) => {
          return (
            <li key={index}>
              <NavLink
                className={pathName === value.uri ? "activee" : ""}
                to={value.uri}
              >
                {value.tab_name.replaceAll("_", " ")}
              </NavLink>
            </li>
          );
        })}
      </ul>
    );

    return (
      <div>
        <div className="tabs-top">
          {data}
        </div>
      </div>
    );
  }
}
