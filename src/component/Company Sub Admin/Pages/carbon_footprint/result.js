import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      scopeFirst: [],
      scopeSecond: [],
      scopeThird: [],
    };
  }

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
            scopeFirst: result?.scopeFirst[0],
            scopeSecond: result?.scopeSecond[0],
            scopeThird: result?.scopeThird[0],
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
                      <div className="requirem">
                        <div className="text_Parts">
                          <div className="col-md-12">
                            <div className="Capital_op">
                              <h4 className="E_Emis font-heading">Summary</h4>
                            </div>
                            <div className="stent border_box">
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope</h4>
                                </div>
                                <div className="stent_table_one">
                                  <h4 className="scope">Activity Type</h4>
                                </div>
                                <div className="stent_table_two">
                                  <h4 className="scope">Year: 2021</h4>
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
                                    {scopeFirst?.buildingConsumption && (
                                      scopeFirst?.buildingConsumption
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Transport Consumption</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst?.transportConsumption && (
                                      scopeFirst?.transportConsumption
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Refrigerants</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst?.refrigerants && (
                                      scopeFirst?.refrigerants
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Additional Information</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeFirst?.additionalInformation && (
                                      scopeFirst?.additionalInformation
                                    )}
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
                                      {scopeFirst?.buildingConsumption && (
                                        Number(scopeFirst?.buildingConsumption) +
                                        Number(
                                          scopeFirst.transportConsumption
                                        ) +
                                        Number(scopeFirst.refrigerants) +
                                        Number(
                                          scopeFirst.additionalInformation
                                        )
                                      )} CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <!-- two tsble --> */}
                            <div className="stent border_box mt-5">
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
                                    {scopeSecond?.electricityConsumption && (
                                      scopeSecond?.electricityConsumption
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Green Power 100%</p>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeSecond?.greenPower && (
                                      scopeSecond?.greenPower
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Some Green Power</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeSecond?.someGreenPower && (
                                      scopeSecond?.someGreenPower
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Market</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeSecond?.market && (
                                    scopeSecond?.market
                                  )}</p>
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
                                      {scopeSecond?.electricityConsumption && (
                                        Number(
                                          scopeSecond?.electricityConsumption
                                        ) +
                                        Number(scopeSecond?.greenPower) +
                                        Number(scopeSecond?.someGreenPower) +
                                        Number(scopeSecond?.market)
                                      )} CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <!-- there tsble --> */}
                            <div className="stent border_box mt-5">
                              <div className="stent_one">
                                <div className="stent_table">
                                  <h4 className="scope">Scope 3</h4>
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Travel</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeThird?.travel && (
                                    scopeThird?.travel
                                  )}</p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <div className="stent_table_one">
                                  <p className="ghg">Employee commuting</p>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird?.employeeCommuting && (
                                      scopeThird?.employeeCommuting
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Waste</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">{scopeThird?.waste && (
                                    scopeThird?.waste
                                  )}</p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
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
                                    {scopeThird?.purchasedGoods && (
                                      scopeThird?.purchasedGoods
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Capital goods</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird?.capitalGoods && (
                                      scopeThird?.capitalGoods
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
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
                                    {scopeThird?.upstreamAndDownstream && (
                                      scopeThird?.upstreamAndDownstream
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="stent_one mt-3">
                                <div className="stent_table">
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_table_one">
                                  <p className="ghg">Investments</p>
                                </div>
                                <div className="stent_table_two">
                                  <p className="ghg">
                                    {scopeThird?.Investments && (
                                      scopeThird?.Investments
                                    )}
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
                                      {scopeThird?.travel && (
                                        Number(scopeThird?.travel) +
                                        Number(scopeThird.employeeCommuting) +
                                        Number(scopeThird.waste) +
                                        Number(scopeThird.purchasedGoods) +
                                        Number(scopeThird.capitalGoods) +
                                        Number(
                                          scopeThird.upstreamAndDownstream
                                        ) +
                                        Number(scopeThird.Investments)
                                      )} CO2-e
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="global_link mt-4">
                            <NavLink
                              to="/carbon_footprint_detail"
                              className="new_button_style"
                            >
                              Generate report
                            </NavLink>
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
