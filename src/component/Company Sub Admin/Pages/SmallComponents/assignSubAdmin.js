/* eslint-disable jsx-a11y/anchor-is-valid */
import { sweetAlert } from '../../../../utils/UniversalFunction';
import e1 from "../../../../img/e1.png";
import React, { Component } from "react";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import axios from "axios";
const currentUser = authenticationService.currentUserValue;

export default class AssignSubAdminComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selectedName: null,
      assignedUserId: this.props.assignedUserId,
      removeHeading: this.props.removeHeader ?? false,
      id: this.props.idd ?? false,
      submitted: false,
      selected: "",
      dueDate: "",
      items: [],
      filteredData: [],
      tableName: this.props.tableName,
    };

    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }



  search(event) {
    const target = event.target;
    const value = target.value.toLowerCase();
    const filtered = this.state.items.filter((entry) =>
      Object.values(entry).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value)
      )
    );
    this.setState({ filteredData: filtered });
  }

  handleChange(event) {
    const target = event.target;
    const namee = event.target.getAttribute("data-name");
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
      selectedName: namee,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { selected, dueDate, tableName, id } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "assignSubAdmin",
        {
          assigned_user_id: selected,
          dueDate: dueDate,
          tableName: tableName,
          id: id,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    fetch(config.OLD_API_URL + `getCompanySubAdmin?limit=100&skip=0&current_role=${localStorage.getItem("role")}`, {
      headers,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data,
            options: [],
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    //   Get Answers Api
    axios
      .post(
        config.API_URL + "getAssignedUserId",
        {
          tableName: this.state.tableName,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        let assignUserId = "";
        if (response.data.data.length > 0) {
          assignUserId = response.data.data[0]?.company_sub_admin_id;
        }
        this.setState({
          assignedUserId: assignUserId,
        });
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.message);
        }
      });
  }

  render() {
    const {
      items,
      selectedName,
      filteredData,
      selected,
      dueDate,
      submitted,
      assignedUserId,
      removeHeading,
    } = this.state;

    let fullName = items
      .filter((e) => e.id === assignedUserId)
      .map((e) => e.firstName + " " + e.lastName);

    let finalArray = [];
    finalArray = filteredData.length > 0 ? filteredData : items;
    return (
      <>
        <div className="input-group">
          <div className="d-flex dropdown">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Assigned To:
            </label>
            <input
              className="btn btn-secondary dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              placeholder={selectedName != null ? selectedName : fullName[0]}
            />

            <div
              className="dropdown-menu border-0 shadow"
              aria-labelledby="dropdownMenuLink"
            >
              <div className="d-head">
                <div className="mb-3">
                  {removeHeading === false && (
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Assigned To:
                    </label>
                  )}
                  <input
                    type="text"
                    className="form-control mt-2"
                    onKeyDown={this.search}
                    id="exampleFormControlInput1"
                    placeholder="Search here"
                  />
                </div>
              </div>
              <ul>
                {finalArray.map((item, key) => (
                  <li key={key}>
                    <a className="dropdown-item py-2 px-0">
                      <div className="form-check check-form d-flex">
                        <div className="form-d">
                          <img src={e1} alt="" />
                          <label
                            className="form-check-label name-bandhu"
                            htmlFor="exampleRadios1"
                          >
                            {item.firstName + " " + item.lastName}
                          </label>
                        </div>
                        <input
                          className="form-check-input"
                          onChange={this.handleChange}
                          type="radio"
                          // value={selected}
                          name="selected"
                          id="exampleRadios1"
                          data-name={item.firstName + " " + item.lastName}
                          value={item.id}
                        />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="d-foot mt-2">
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    onChange={this.handleChange}
                    className="form-control mt-2"
                    id="exampleFormControlInput1"
                    placeholder="John Cooper"
                  />
                </div>
                {submitted && !dueDate && !selected && (
                  <div className="help-block">
                    Please choose at least one user and Choose Due date
                  </div>
                )}
                {dueDate && selected && (
                  <>
                    <div className="global_link d-flex justify-content-center align-items-center mx-0">
                      <button
                        onClick={this.handleSubmit}
                        className="page_save page_width"
                        type="submit"
                      >
                        Assign
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
