import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "../../Company Admin/Setting/setting.css";
import CompaniesTabbing from "../companies/companies_tabbing";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import config from "../../../config/config.json";
const baseURL = config.baseURL;

export default class CompaniesModule extends Component {
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
    const { uuid } = this.state;
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
                    <CompaniesTabbing />
                    <div className="col-sm-12">
                      <div className="strp_progess">
                        <div className="hol_rell">
                          <div className="steps-form">
                            <div className="steps-row setup-panel"></div>
                          </div>
                        </div>
                      </div>
                      <div className="SVG Stepper">
                        <div className="stepperr_design">
                          <div className="color_div_step my-3">
                            <div className="include">
                              <section className="forms">
                                <div className="row">
                                  <div className="col-md-12 col-xs-12">
                                    <div className="table_f">
                                      <Table striped bordered hover size="sm">
                                        <thead>
                                          <tr className="heading_color">
                                            <th>MODULE</th>
                                            <th style={{ width: "20%" }}>
                                              RESPONSES
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-file-chart-line mx-3" />
                                              </span>
                                              ESG REPORTING
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/esg-reporting`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-cog mx-3" />
                                              </span>
                                              SECTOR QUESTIONS
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/sector-question`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-building mx-3" />
                                              </span>
                                              GOVERNANCE
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/governance/governance-policy`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="far fa-user-cog mx-3" />
                                              </span>
                                              SUPPLIERS
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/supplier`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-file-chart-line mx-3" />
                                              </span>
                                              SUPPLIER MANAGEMENT
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/supplier-management`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-leaf mx-3" />
                                              </span>
                                              SDG's
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/sustainable`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-shoe-prints mx-3" />
                                              </span>
                                              CARBON FOOTPRINT
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/carbon-footprint`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="far fa-clipboard mx-3" />
                                              </span>
                                              BOARD SKILLS
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/board-skills`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <span>
                                                <i className="fal fa-archive mx-3" />
                                              </span>
                                              ESG PRODUCTS
                                            </td>
                                            <td>
                                              <NavLink
                                                to={`/admin/companies/${uuid}/modules/esg-products`}
                                                className="table-tag"
                                              >
                                                <span>
                                                  <i className="fa fa-eye"></i>
                                                </span>
                                                View
                                              </NavLink>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </section>
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
