/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";

import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../../sidebar/common.css";

export default class AuditSupplierQuestionListing extends Component {
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} Defaults="0" />

        <div className="main_wrapper">
          <div className="tabs-top audit_tabs">
            <ul>
              <li>
                <NavLink to="/audit_question_listing">Company</NavLink>
              </li>
              <li>
                <NavLink to="/audit_supplier" className="activee">
                  Supplier
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
                      <div className="Introduction framwork_2">
                        <section className="forms">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="business_detail">
                                <div className="heading">
                                  <h4>Supplier Audit Question Listing</h4>
                                  {/* <div className="form-group has-search one">
                                        <span className="fa fa-search form-control-feedback audit_line_height"></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Company Name"
                                            name="search"
                                            onChange={(e) =>
                                            this.applyGlobalSearch(e)
                                            }
                                        />
                                    </div> */}
                                </div>
                                <hr className="line"></hr>
                              </div>

                              <div className="table_f">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th>Sr.</th>
                                      <th>Question List</th>
                                      <th>Purpose</th>
                                      <th>Recieve Date</th>
                                      <th style={{ width: "5%" }}>View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Question List 1</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </NavLink>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>Question List 2</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </NavLink>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>Question List 3</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </NavLink>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>4</td>
                                      <td>Question List 4</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </NavLink>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>5</td>
                                      <td>Question List 5</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
                                        </NavLink>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>6</td>
                                      <td>Question List 6</td>
                                      <td>For Servey</td>
                                      <td>12-July-2022</td>
                                      <td>
                                        <NavLink
                                          className="non_underline_link bold view_c"
                                          to="/audit_supplier_question"
                                        >
                                          <i className="fas fa-eye"></i>
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
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
