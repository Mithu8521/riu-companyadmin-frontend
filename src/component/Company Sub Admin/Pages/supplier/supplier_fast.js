/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

import { authenticationService } from "../../../../_services/authentication";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import config from "../../../../config/config.json";
import axios from "axios";
const currentUser = authenticationService.currentUserValue;

export default class supplier_fast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,
      nextButton: false,
      currentNature: "",
      extent: "",
      existingSupply: "",
      tiers: "",
      transparencyLevel: "",
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
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    if (
      this.state.currentNature &&
      this.state.extent &&
      this.state.existingSupply &&
      this.state.tiers &&
      this.state.transparencyLevel
    ) {
      axios
        .post(
          config.OLD_API_URL + "supplier",
          {
            currentNature: this.state.currentNature,
            extent: this.state.extent,
            existingSupply: this.state.existingSupply,
            tiers: this.state.tiers,
            transparencyLevel: this.state.transparencyLevel,
            current_role: localStorage.getItem("role"),
          },
          { headers }
        )
        .then((response) => {
          this.setState({ nextButton: true });
          sweetAlert('success', response.data[0].message);
          setTimeout(() => {
            const newLocal = "/Environmental_Topics";
            this.props.history.push(newLocal);
          }, 1000);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert('error', error.response.data.message);
          }
        });
    }
  }
  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `getSupplierDetails?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.data.length > 0) {
            this.setState({ nextButton: true });
          }

          this.setState({
            isLoaded: true,
            currentNature:
              result.data[0]?.currentNature === undefined
                ? ""
                : result.data[0]?.currentNature,
            extent:
              result.data[0]?.extent === undefined
                ? ""
                : result.data[0]?.extent,
            existingSupply:
              result.data[0]?.existingSupply === undefined
                ? ""
                : result.data[0]?.existingSupply,
            tiers:
              result.data[0]?.tiers === undefined ? "" : result.data[0]?.tiers,
            transparencyLevel:
              result.data[0]?.transparencyLevel === undefined
                ? ""
                : result.data[0]?.transparencyLevel,
            isEditableOrNot: result?.insertOrUpdate,
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
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="governance">
                        <div className="text_Parts">
                          <div className="back_doll">
                            <div className="d-flex justify-content-between">
                              <h6 className="back_quninti back_quninti_2">
                                {/* <NavLink className="back_text" to="">
                                    <span className="step_icon">
                                        <i className="far fa-long-arrow-alt-left"></i>
                                    </span>
                                    Back
                                    </NavLink> */}
                              </h6>
                              {/* <h6 className="back_quninti back_quninti_2"></h6> */}
                            </div>
                            <div className="supply_chain">
                              <h4 className="critical_h">
                                Good supply chain management involves four
                                critical management components:
                              </h4>
                            </div>
                            <div className="google_sup">
                              <div className="sup_can">
                                <div className="four_div">
                                  <div className="four_text">
                                    <h4 className="as_usual">
                                      Fit for purpose
                                    </h4>
                                    <p className="operating_m">
                                      Are the actions you are undertaking fit for purpose, adapted to the recipients and prioritised to meet your suppliers' management strategy?
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 2 --> */}
                                <div className="four_div">
                                  <div className="four_text_one">
                                    <h4 className="as_usual">
                                      Business-as-usual
                                    </h4>
                                    <p className="operating_m">
                                      Can management of suppliers and suppliers' ESG risks be embedded into your operating model and management controls?
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 3 --> */}
                                <div className="four_div">
                                  <div className="four_text_two">
                                    <h4 className="as_usual">
                                      A balanced approach
                                    </h4>
                                    <p className="operating_m">
                                      Does not disincentivise partners or suppliers to do <br />business with our organisation.
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 4 --> */}
                                <div className="four_div">
                                  <div className="four_text_there">
                                    <h4 className="as_usual">
                                      Risk-based due-diligence
                                    </h4>
                                    <p className="operating_m">
                                      Undertaking activities in countries considered 'high-risk modern slavery geographies'.
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Buying high-risk goods & services
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Engaging with high-risk sectors
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Engaging in vulnerable populations
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <form onSubmit={this.handleSubmit}>
                            <div className="home_risck p-0">
                              <div className="row">
                                <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                  <div className="form-group bop">
                                    <label className="nature_one fw-bold font-increase">
                                      What is the current nature of the relationship between your company and your suppliers?
                                    </label>
                                    <textarea
                                      onChange={this.handleChange}
                                      name="currentNature"
                                      defaultValue={this.state.currentNature}
                                      className="form-control text_w"
                                      rows="3"
                                    ></textarea>
                                    {this.state.submitted &&
                                      !this.state.currentNature && (
                                        <div className="help-block">
                                          Field is required
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                  <div className="form-group bop">
                                    <label className="nature_one fw-bold font-increase">
                                      To what extent does your company audit your supply chains?
                                    </label>
                                    <textarea
                                      onChange={this.handleChange}
                                      name="extent"
                                      defaultValue={this.state.extent}
                                      className="form-control text_w"
                                      rows="3"
                                    ></textarea>
                                    {this.state.submitted &&
                                      !this.state.extent && (
                                        <div className="help-block">
                                          Field is required
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                  <div className="form-group bop">
                                    <label className="nature_one fw-bold font-increase">
                                      Which existing supply chain policies are in place?
                                    </label>
                                    <textarea
                                      onChange={this.handleChange}
                                      name="existingSupply"
                                      defaultValue={this.state.existingSupply}
                                      className="form-control text_w"
                                      rows="3"
                                    ></textarea>
                                    {this.state.submitted &&
                                      !this.state.existingSupply && (
                                        <div className="help-block">
                                          Field is required
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                  <div className="form-group bop">
                                    <label className="nature_one fw-bold font-increase">
                                      How many tiers are there in your supply chain?
                                    </label>
                                    <textarea
                                      onChange={this.handleChange}
                                      name="tiers"
                                      defaultValue={this.state.tiers}
                                      className="form-control text_w"
                                      rows="3"
                                    ></textarea>
                                    {this.state.submitted &&
                                      !this.state.tiers && (
                                        <div className="help-block">
                                          Field is required
                                        </div>
                                      )}
                                  </div>
                                </div>
                                <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                  <div className="form-group bop">
                                    <label className="nature_one fw-bold font-increase">
                                      What is the transparency level of your suppliers?
                                    </label>
                                    <br />
                                    <select
                                      onChange={this.handleChange}
                                      name="transparencyLevel"
                                      value={
                                        this.state.transparencyLevel
                                      }
                                      className="select_one"
                                    >
                                      <option >select</option>
                                      <option value="high">High</option>
                                      <option value="medium">Medium</option>
                                      <option value="low">Low</option>
                                    </select>
                                    {this.state.submitted &&
                                      !this.state.transparencyLevel && (
                                        <div className="help-block">
                                          Field is required
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="save_Governance global_link mx-0">
                              <div className="save_global">
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
                                  {!isEditableOrNot && role === "company_sub_admin" && (
                                    <NavLink
                                      className="new_button_style"
                                      to={"/Environmental_Topics"}
                                    >
                                      Next
                                    </NavLink>
                                  )}
                                </span>
                              </div>
                            </div>
                          </form>
                        </div>
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
