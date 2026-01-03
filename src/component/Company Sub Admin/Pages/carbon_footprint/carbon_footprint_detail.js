import { sweetAlert } from '../../../../utils/UniversalFunction';
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import axios from "axios";

import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class carbon_footprint_detail extends Component {
  constructor(props) {
    super(props);

    let today = new Date(),
      date = today.getFullYear();

    this.state = {
      error: null,
      isLoaded: false,
      fullYear: date,
      items: [],
      scopeFirst: [],
      scopeSecond: [],
      scopeThird: [],
    };
    this.downloadReport = this.downloadReport.bind(this);

  }



  downloadReport(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "downloadReport",
        {
          section_name: 'carbon_footprint',
          sub_section: 'carbon_footprint',
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        let url = config.BASE_URL + response?.data?.data?.file;
        if (response?.data?.data?.file) {
          saveAs(
            url,
            url
          );
        } else {
          this.showAlert()
        }
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message)
        }
      });

  }

  showAlert = () => {
    sweetAlert('info', "The Report will be uploaded within next 48 hours");
  };
  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.API_URL + `carbonAnswer?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            scopeFirst: result.scopeFirst[0],
            scopeSecond: result.scopeSecond[0],
            scopeThird: result.scopeThird[0],
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
    const { scopeFirst, scopeSecond, scopeThird } = this.state;

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
                      <div className="color_div_on framwork_2">
                        <div className="text_Parts">
                          <div className="text_Description">
                            <div className="d-flex justify-content-between">
                              <h5 className="motor pb-1 font-heading">Introduction</h5>
                              <div className="form_x mb-3">
                                <div className="input-group">
                                </div>
                              </div>
                            </div>
                            <p>
                              A carbon footprint is an estimate of the total
                              output of greenhouse gas (GHG) emissions caused by
                              an organisation, event, product or person.
                            </p>
                            <p>
                              Calculating your carbon footprint helps set a
                              baseline. Following this up with annual
                              measurements provides you with a consistent and
                              accurate picture across your business.
                              Understanding your carbon footprint will help you
                              understand the activities that result in carbon
                              emissions and then take action to reduce them. As
                              well as helping the environment, managing your
                              carbon emissions can help you save money, cut
                              reputational risk and create new business
                              opportunities.
                            </p>
                          </div>
                          <div className="directly pt-4">
                            <button
                              onClick={this.downloadReport}
                              className="next_page_one"
                              title="The Report will be uploaded within next 48 hours"
                              data-toggle="tooltip"
                              data-placement="top"
                              type="button"
                            >
                              <span className="Download_r">
                                <i className="fa fa-download"></i>
                              </span>
                              Download Report
                            </button>
                            <NavLink
                              className="re-submit mx-3"
                              to={"/carbon_footprint"}
                              type="button"
                            >
                              RE-SUBMIT RESPONSES
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <div className="color_div_on framwork_2 mt-3">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_Emis font-heading">Summary</h4>
                            </div>
                            <div className="stent border_box p-5">
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope</h4>
                                </div>
                                <div className="stent_table_one">
                                  <h4 className="scope">Activity Type</h4>
                                </div>
                                <div className="stent_table_two">
                                  <h4 className="scope">
                                    Year: {this.state.fullYear}
                                  </h4>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 1</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Building Consumption</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst.buildingConsumption}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Transport Consumption</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst.transportConsumption}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Refrigerants</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst.refrigerants}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Additional Information</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst.additionalInformation}
                                  </p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 1 Total</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg"></p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    <strong>
                                      {Number(scopeFirst.buildingConsumption) +
                                        Number(
                                          scopeFirst.transportConsumption
                                        ) +
                                        Number(scopeFirst.refrigerants) +
                                        Number(
                                          scopeFirst.additionalInformation
                                        )}&nbsp;CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <!-- two tsble --> */}
                            <div className="stent border_box p-5">
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 2</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">
                                    Electricity Consumption Type
                                  </p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeSecond.electricityConsumption}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Green Power 100%</p>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeSecond.greenPower}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Some Green Power</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeSecond.someGreenPower}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Market</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeSecond.market}</p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 2 Total</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg"></p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    <strong>
                                      {Number(
                                        scopeSecond.electricityConsumption
                                      ) +
                                        Number(scopeSecond.greenPower) +
                                        Number(scopeSecond.someGreenPower) +
                                        Number(scopeSecond.market)}&nbsp;CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <!-- there tsble --> */}
                            <div className="stent border_box p-5">
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 3</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Travel</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeThird.travel}</p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Employee commuting</p>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird.employeeCommuting}
                                  </p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Waste</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeThird.waste}</p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">
                                    Purchased goods & services
                                  </p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird.purchasedGoods}
                                  </p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Capital goods</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird.capitalGoods}
                                  </p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">
                                    Upstream and downstream <br />
                                    Transportation & Distribution
                                  </p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird.upstreamAndDownstream}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Investments</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird.Investments}
                                  </p>
                                </div>
                              </div>
                              <hr className="scope_gelop" />
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 3 Total</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg"></p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    <strong>
                                      {Number(scopeThird.travel) +
                                        Number(scopeThird.employeeCommuting) +
                                        Number(scopeThird.waste) +
                                        Number(scopeThird.purchasedGoods) +
                                        Number(scopeThird.capitalGoods) +
                                        Number(
                                          scopeThird.upstreamAndDownstream
                                        ) +
                                        Number(scopeThird.Investments)}&nbsp;CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
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
