import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "./supplier_management.css";
import config from "../../../config/config.json";
const baseURL = config.baseURL;

export default class supplier_management extends Component {
  render() {
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
                      <div className="col-sm-12">
                        <div className="color_div_on framwork_2">
                          <div className="business_detail">
                            <div className="">
                              <hr className="line mt-5"></hr>
                              <div className="saved_cards">
                                <div className="business_detail">
                                  <div className="heading">
                                    <div className="heading_wth_text">
                                      <div className="d-flex">
                                        <span className="global_link mx-0">
                                          <NavLink
                                            to="/admin/supplierManagementField"
                                            className="new_button_style"
                                          >
                                            SUPPLIER FORMS
                                          </NavLink>
                                        </span>
                                        <span className="global_link mx-3">
                                          <button className="new_button_style">
                                            <i className="fas fa-download white" />
                                          </button>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="form-group has-search one">
                                      <span className="fa fa-search form-control-feedback"></span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "10%" }}>ID</th>
                                        <th>SUPPLIER NAME</th>
                                        <th>CONTACT NAME </th>
                                        <th>EMAIL</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>1</td>
                                        <td>Reliabilt</td>
                                        <td>Darrell Steward</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            curtis.weaver@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td>Electrolux</td>
                                        <td>Esther Howard</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            dolores.chambers@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td>Black & Decker</td>
                                        <td>Cody Fisher</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            sara.cruz@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td>Rigid</td>
                                        <td>Floyd Miles</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            felicia.reid@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>5</td>
                                        <td>Task Force</td>
                                        <td>Jacob Jones</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            willie.jennings@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>6</td>
                                        <td>Maytag</td>
                                        <td>Kristin Watson</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            michael.mitc@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>7</td>
                                        <td>Bosch</td>
                                        <td>Wade Warren</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            tanya.hill@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>8</td>
                                        <td>Blue Hawk</td>
                                        <td>Courtney Henry</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            nevaeh.simmons@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>9</td>
                                        <td>Electrolux</td>
                                        <td>Ralph Edwards</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            bill.sanders@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>10</td>
                                        <td>Hotpoint</td>
                                        <td>Jane Cooper</td>
                                        <td>
                                          <NavLink
                                            to="/admin/SupplierDetailPage"
                                            className="text"
                                          >
                                            jessica.hanson@example.com
                                          </NavLink>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <div className="pagination_billing justify-content-between">
                                    <ul>
                                      <li>
                                        <NavLink to="">
                                          <span>
                                            <i className="fal fa-arrow-left mx-3"></i>
                                          </span>
                                          Back
                                        </NavLink>
                                      </li>
                                      <li>
                                        <NavLink to="">
                                          Showing 1-10 of 1023
                                        </NavLink>
                                      </li>
                                      <li className="justify-align-right">
                                        <NavLink to="">
                                          Next
                                          <span>
                                            <i className="fal fa-arrow-right mx-3"></i>
                                          </span>
                                        </NavLink>
                                      </li>
                                    </ul>
                                  </div>
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
