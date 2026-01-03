/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import axios from "axios";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import { authenticationService } from "../../../../_services/authentication";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import config from "../../../../config/config.json";
import { Image } from 'react-bootstrap';
import CarbonFootprint from '../../../../img/carbon_footprint.jpg';

const currentUser = authenticationService.currentUserValue;

export default class ScopeEmission1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,

      buildingConsumption: "",
      transportConsumption: "",
      refrigerants: "",
      additionalInformation: "",
      isEditableOrNot: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
  }

  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    axios
      .post(
        config.OLD_API_URL + "scope1Emission",
        {
          buildingConsumption: this.state.buildingConsumption,
          transportConsumption: this.state.transportConsumption,
          refrigerants: this.state.refrigerants,
          additionalInformation: this.state.additionalInformation,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          const newLocal = "/Scope_2_Emissions";
          this.props.history.push(newLocal);
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });

  }

  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(config.API_URL + `carbonFootPrintAnswerApi?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            environmentalPolicyData: data.result,
            buildingConsumption: data.result?.buildingConsumption,
            transportConsumption: data.result?.transportConsumption,
            refrigerants: data.result?.refrigerants,
            additionalInformation: data.result?.additionalInformation,
            isEditableOrNot: data?.insertOrUpdate,
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

  render() {
    const { isEditableOrNot } = this.state;
    let role = JSON.parse(localStorage.getItem("currentUser")).data.role;
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />

        <div className="main_wrapper">
          <div className="tabs-top">
            <ul>
              <li>
                <NavLink to="#" className="activee">
                  Scope 1 Emissions
                </NavLink>
              </li>
              <li>
                <NavLink to="#">Scope 2 Emissions</NavLink>
              </li>
              <li>
                <NavLink to="#">Scope 3 Emissions</NavLink>
              </li>
            </ul>
          </div>
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2 pad_70">
                        <form onSubmit={this.handleSubmit}>
                          <div className="heading scope_em">
                            <p>Greenhouse gas emissions are measured as kilotonnes of carbon dioxide equivalence (CO2-e). The following fields contain the summary of your business's emissions following our guide.</p>
                          </div>
                          <div className="row setup-content carbon_img" id="step-10">
                            <div className="col-xxl-6 col-md-6 col-12">
                              <div className="Capital_op mt-0">
                                <h4 className="E_Emis font-heading">Scope 1 Emissions </h4>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Building Consumption
                                  </label>

                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="buildingConsumption"
                                    onChange={this.handleChange}
                                    placeholder="Co2-e"
                                    value={this.state.buildingConsumption}
                                  />
                                  {/* {this.state.buildingConsumption + " CO2-e"} */}
                                  {/* {this.state.submitted &&
                                    !this.state.buildingConsumption && (
                                      <div className="help-block">
                                        Building Consumption is required
                                      </div>
                                    )} */}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Transport Consumption
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="transportConsumption"
                                    onChange={this.handleChange}
                                    value={this.state.transportConsumption}
                                  />
                                  {/* {this.state.transportConsumption + " CO2-e"} */}
                                  {/* {this.state.submitted &&
                                    !this.state.transportConsumption && (
                                      <div className="help-block">
                                        Transport Consumption is required
                                      </div>
                                    )} */}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Refrigerants
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="refrigerants"
                                    placeholder="Co2-e"
                                    onChange={this.handleChange}
                                    value={this.state.refrigerants}
                                  />
                                  {/* {this.state.refrigerants + " CO2-e"} */}
                                  {/* {this.state.submitted &&
                                    !this.state.refrigerants && (
                                      <div className="help-block">
                                        Refrigerants Consumption is required
                                      </div>
                                    )} */}
                                </div>
                              </div>
                              <div className="form-group vbn">
                                <label className="text_blod fw-bold font-increase">
                                  Additional Information
                                </label>
                                <input
                                  className="form-control text_het"
                                  rows="3"
                                  type="number"
                                  placeholder="Co2-e"
                                  name="additionalInformation"
                                  onChange={this.handleChange}
                                  defaultValue={
                                    this.state.additionalInformation
                                  }
                                />
                                {/* {this.state.additionalInformation + " CO2-e"} */}
                                {/* {this.state.submitted &&
                                  !this.state.additionalInformation && (
                                    <div className="help-block">
                                      Additional Consumption is required
                                    </div>
                                  )} */}
                              </div>
                              <div className="global_link mt-4">
                                <span className="">
                                  <a
                                    className="link_bal_next"
                                    onClick={this.goToPreviousPath}
                                  >
                                    Back
                                  </a>
                                </span>
                                <span className="global_link">
                                  {isEditableOrNot && (
                                    <button
                                      className="new_button_style"
                                      type="submit"
                                    >
                                      Next
                                    </button>
                                  )}
                                  {!isEditableOrNot &&
                                    role === "company_sub_admin" && (
                                      <NavLink
                                        className="new_button_style"
                                        to={"/Scope_2_Emissions"}
                                      >
                                        Next
                                      </NavLink>
                                    )}
                                </span>
                              </div>
                            </div>
                            <div className="col-xxl-6 col-md-6 col-12">
                              <div className="carbon_footerprint_css">
                                <Image className="img-fluid" src={CarbonFootprint} />
                              </div>
                            </div>
                          </div>
                        </form>
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
