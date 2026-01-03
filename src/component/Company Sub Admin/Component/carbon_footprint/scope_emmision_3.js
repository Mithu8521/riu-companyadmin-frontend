/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { authenticationService } from "../../../../_services/authentication";
import { Image } from "react-bootstrap";
import CarbonFootprint from "../../../../img/carbon_footprint.jpg";
import config from "../../../../config/config.json";

const currentUser = authenticationService.currentUserValue;

export default class ScopeEmission3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,

      travel: "",
      employeeCommuting: "",
      waste: "",
      purchasedGoods: "",
      capitalGoods: "",
      upstreamAndDownstream: "",
      Investments: "",
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
        config.OLD_API_URL + "scope3Emission",
        {
          travel: this.state.travel,
          employeeCommuting: this.state.employeeCommuting,
          waste: this.state.waste,
          purchasedGoods: this.state.purchasedGoods,
          capitalGoods: this.state.capitalGoods,
          upstreamAndDownstream: this.state.upstreamAndDownstream,
          Investments: this.state.Investments,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          const newLocal = "/result";
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

    fetch(
      config.API_URL +
      `carbonFootPrintThirdAnswerApi?current_role=${localStorage.getItem(
        "role"
      )}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            travel: data.result?.travel,
            employeeCommuting: data.result?.employeeCommuting,
            waste: data.result?.waste,
            purchasedGoods: data.result?.purchasedGoods,
            capitalGoods: data.result?.capitalGoods,
            upstreamAndDownstream: data.result?.upstreamAndDownstream,
            Investments: data.result?.Investments,
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
                <NavLink to="#">Scope 2 Emissions</NavLink>
              </li>
              <li>
                <NavLink to="#" className="activee">
                  Scope 3 Emissions
                </NavLink>
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
                          <p>
                            Greenhouse gas emissions are measured as kilotonnes
                            of carbon dioxide equivalence (CO2-e). The following
                            fields contain the summary of your business's
                            emissions following our guide.
                          </p>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                          {/* <div className="row setup-content" id="step-110"> */}
                          <div className="row carbon_img">
                            <div className="col-xxl-6 col-md-6 col-12">
                              <div className="Capital_op mt-0">
                                <h4 className="E_Emis font-heading">
                                  Scope 3 Emissions
                                </h4>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Travel
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="travel"
                                    placeholder="Co2-e"
                                    onChange={this.handleChange}
                                    value={this.state.travel}
                                  />
                                  {/* {this.state.travel + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.travel && (
                                      <div className="help-block">
                                        Travel is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Employee Commuting
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="employeeCommuting"
                                    onChange={this.handleChange}
                                    value={this.state.employeeCommuting}
                                  />
                                  {/* {this.state.employeeCommuting + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.employeeCommuting && (
                                      <div className="help-block">
                                        Employee Commuting is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Waste
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    name="waste"
                                    placeholder="Co2-e"
                                    onChange={this.handleChange}
                                    value={this.state.waste}
                                  />
                                  {/* {this.state.waste + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.waste && (
                                      <div className="help-block">
                                        Waste is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Purchased Goods & Services
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="purchasedGoods"
                                    onChange={this.handleChange}
                                    value={this.state.purchasedGoods}
                                  />
                                  {/* {this.state.purchasedGoods + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.purchasedGoods && (
                                      <div className="help-block">
                                        Purchased Goods & Services is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Capital Goods
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="capitalGoods"
                                    onChange={this.handleChange}
                                    value={this.state.capitalGoods}
                                  />
                                  {/* {this.state.capitalGoods + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.capitalGoods && (
                                      <div className="help-block">
                                        Capital Goods is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Upstream and Downstream Transportation &
                                    Distribution
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="upstreamAndDownstream"
                                    onChange={this.handleChange}
                                    value={this.state.upstreamAndDownstream}
                                  />
                                  {/* {this.state.upstreamAndDownstream + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.upstreamAndDownstream && (
                                      <div className="help-block">
                                        Upstream and Downstream Transportation &
                                        Distribution is required
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="emiss_input">
                                <div className="form-group vbn">
                                  <label className="text_blod fw-bold font-increase">
                                    Investments
                                  </label>
                                  <input
                                    className="form-control text_het"
                                    rows="3"
                                    type="number"
                                    placeholder="Co2-e"
                                    name="Investments"
                                    onChange={this.handleChange}
                                    value={this.state.Investments}
                                  />
                                  {/* {this.state.Investments + " CO2-e"} */}
                                  {this.state.submitted &&
                                    !this.state.Investments && (
                                      <div className="help-block">
                                        Investments is required
                                      </div>
                                    )}
                                </div>
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
                                  {!isEditableOrNot && (
                                    <NavLink
                                      className="new_button_style"
                                      to={"/result"}
                                    >
                                      Next
                                    </NavLink>
                                  )}
                                  {isEditableOrNot && (
                                    <button
                                      className="new_button_style"
                                      type="submit"
                                    >
                                      Next
                                    </button>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="col-xxl-6 col-md-6 col-12">
                              <div className="carbon_footerprint_css">
                                <Image
                                  className="img-fluid"
                                  src={CarbonFootprint}
                                />
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
