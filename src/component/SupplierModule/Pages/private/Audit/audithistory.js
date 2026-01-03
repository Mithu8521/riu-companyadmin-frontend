import React from "react"
import { Table } from "react-bootstrap"
import Header from "../../../../header/header"
import Sidebar from "../../../../sidebar/sidebar"
import { NavLink } from "react-router-dom"

const Audithistory = () => {
  return (
    <div>
      <Sidebar Defaults="0" />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="Introduction framwork_2">
                      <section className="forms">
                        <div
                          className="col-lg-6 col-xs-6"
                          style={{ width: "100%", display: "flex" }}
                        >
                          <div
                            className="form-group pb-3"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <label
                              htmlFor="industryType"
                              className="mb-2"
                              style={{ marginRight: "1px", width: "100%" }}
                            >
                              Questionnaire Type :-
                            </label>
                            <select
                              name="tab_name"
                              onChange={this.ok}
                              className="select_one industrylist"
                              style={{ margin: "auto" }}
                            >
                              {/* <option>Select Questionnaire Type</option> */}
                              <option>Sector Question</option>
                              {/* <option>Supplier Assessment</option> */}
                            </select>
                          </div>
                          <div
                            className="form-group pb-3"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <label
                              htmlFor="industryType"
                              className="mb-2"
                              style={{ marginLeft: "20px", width: "100%" }}
                            >
                              Financial Year :-
                            </label>
                            <select
                              name="tab_name"
                              // onChange={this.handleFinancialYearChange}
                              className="select_one industrylist"
                              style={{ margin: "auto" }}
                            >
                              <option>Select Financial Year</option>
                              {/* {this.state.financialYear?.map((item, key) => (
                                  <option key={key} value={item.id}>
                                    {item.financial_year_value}
                                  </option>
                                ))} */}
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="business_detail">
                              <div className="heading">
                                <h4>Audit History</h4>
                                <div className="form-group has-search one p-0">
                                  <div className="year_input">
                                    {/* <YearPicker onChange={this.handleChange} /> */}
                                  </div>
                                  <div className="search_audit">
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
                                  </div>
                                </div>
                              </div>
                              <hr className="line"></hr>
                            </div>
                            <div className="table_f">
                              <Table striped bordered hover size="sm">
                                <thead>
                                  <tr className="heading_color">
                                    <th style={{ width: "5%" }}>Sr.</th>
                                    <th style={{ width: "15%" }}>
                                      Date/time stamp
                                    </th>
                                    <th style={{ width: "15%" }}>Entity </th>
                                    <th>Outcome</th>
                                    <th>Remark</th>
                                    <th>View</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td>12-July-2022</td>
                                    <td>For Company</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
                                        View
                                      </NavLink>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>2</td>
                                    <td>12-July-2022</td>
                                    <td>For Supplier</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
                                        View
                                      </NavLink>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>3</td>
                                    <td>12-July-2022</td>
                                    <td>For Company</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
                                        View
                                      </NavLink>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>4</td>
                                    <td>12-July-2022</td>
                                    <td>For Supplier</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
                                        View
                                      </NavLink>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>5</td>
                                    <td>12-July-2022</td>
                                    <td>For Supplier</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
                                        View
                                      </NavLink>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>6</td>
                                    <td>12-July-2022</td>
                                    <td>For Company</td>
                                    <td>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry.{" "}
                                    </td>
                                    <td>
                                      It is a long established fact that a
                                      reader will be distracted by the readable
                                      content of a page when looking at its
                                      layout.{" "}
                                    </td>
                                    <td>
                                      <NavLink to="/copleted_question">
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
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Audithistory
