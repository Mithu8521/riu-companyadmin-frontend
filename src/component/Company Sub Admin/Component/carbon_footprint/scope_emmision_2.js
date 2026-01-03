/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import axios from "axios";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import { authenticationService } from "../../../../_services/authentication";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { Image } from 'react-bootstrap';
import CarbonFootprint from '../../../../img/carbon_footprint.jpg';
import config from "../../../../config/config.json";

const currentUser = authenticationService.currentUserValue;

export default class ScopeEmission2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,

      electricityConsumption: "",
      greenPower: "",
      someGreenPower: "",
      market: "",
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
        config.OLD_API_URL + "scope2Emission",
        {
          electricityConsumption: this.state.electricityConsumption,
          greenPower: this.state.greenPower,
          someGreenPower: this.state.someGreenPower,
          market: this.state.market,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          const newLocal = "/Scope_3_Emissions";
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

    fetch(config.API_URL + `carbonFootPrintSecondAnswerApi?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            electricityConsumption: data.result?.electricityConsumption,
            greenPower: data.result?.greenPower,
            someGreenPower: data.result?.someGreenPower,
            market: data.result?.market,
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
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />

        <div className="main_wrapper">
          <div className="tabs-top">
            <ul>
              <li>
                <NavLink to="#">Scope 1 Emissions</NavLink>
              </li>
              <li>
                <NavLink to="#" className="activee">
                  Scope 2 Emissions
                </NavLink>
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
                        <div className="heading scope_em">
                          <p>Greenhouse gas emissions are measured as kilotonnes of carbon dioxide equivalence (CO2-e). The following fields contain the summary of your business's emissions following our guide.</p>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                          {/* <div className="row setup-content" id="step-11"> */}
                          <div className="row carbon_img">
                            <div className="col-xxl-6 col-md-6 col-12">
                              <div className="Capital_op mt-0">
                                <h4 className="E_Emis font-heading">Scope 2 Emissions</h4>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Electricity Consumption Type
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="electricityConsumption"
                                    onChange={this.handleChange}
                                    placeholder="Co2-e"
                                    value={this.state.electricityConsumption}
                                  />
                                  {/* {this.state.electricityConsumption + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.electricityConsumption && (
                                      <div className="help-block">
                                        Electricity Consumption is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Green Power 100%
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    name="greenPower"
                                    placeholder="Co2-e"
                                    type="number"
                                    onChange={this.handleChange}
                                    value={this.state.greenPower}
                                  />
                                  {/* {this.state.greenPower + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.greenPower && (
                                      <div className="help-block">
                                        Green Power is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Some Green Power
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="someGreenPower"
                                    placeholder="Co2-e"
                                    onChange={this.handleChange}
                                    value={this.state.someGreenPower}
                                  />
                                  {/* {this.state.someGreenPower + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.someGreenPower && (
                                      <div className="help-block">
                                        Some Green Power is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="form-group vbn">
                                <label className="text_blod fw-bold font-increase">Market</label>
                                <input
                                  className="form-control text_het"
                                  rows="3"
                                  type="number"
                                  name="market"
                                  placeholder="Co2-e"
                                  onChange={this.handleChange}
                                  value={this.state.market}
                                />
                                {/* {this.state.market + " CO2-e"} */}
                                {this.state.submitted && !this.state.market && (
                                  <div className="help-block">
                                    market is required
                                  </div>
                                )}
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
                                  {!isEditableOrNot && (
                                    <NavLink
                                      className="new_button_style"
                                      to={"/Scope_3_Emissions"}
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
