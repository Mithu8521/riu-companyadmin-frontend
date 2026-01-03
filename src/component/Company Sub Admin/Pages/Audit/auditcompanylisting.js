/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Col, Row } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
import View from '../../../../img/view.png'
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "../../../sidebar/common.css";
import "./audit_section.css";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";

export default class AuditHistoryListing extends Component {
  state = {
    financialYear: [],
    financialYearId: "",
    auditData: [],
    noDataAvailable: false,
  };

  getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFinancialYear`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      this.setState({ financialYear: data.data });
      if (data?.data?.length === 1) {
        this.setState({ financialYearId: data?.data[0]?.id });
        await this.fetchAuditData(data?.data[0]?.id);
      }
    }
  };

  handleFinancialYearChange = async (e) => {
    this.setState({ auditData: [], noDataAvailable: false });
    if (e.target.value !== "Select Financial Year") {
      const fId = e.target.value;
      this.setState({ financialYearId: fId });
      await this.fetchAuditData(fId);
    }
  };
  fetchAuditData = async (fId) => {
    // const authValue = JSON.parse(localStorage.getItem("currentUser"));
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getAuditListing`,
      {},
      { financial_year_id: fId, questionnaire_type: "SQ" },
      "GET"
    );
    if (isSuccess) {
      if (data?.data.length > 0) this.setState({ auditData: data.data });
      else {
        this.setState({ noDataAvailable: true, auditData: data.data });
      }
    }
  };
  componentDidMount = () => {
    // this.getFinancialYear();
    const { location } = this.props;
  };
  render() {
    return (
      <div>
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} Defaults="0" />

        <div className="main_wrapper">
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="question_type_filter">
                    <NavLink
                      to="/audit_question_listing"
                      className="selected_question_type"
                    >
                      Company
                    </NavLink>
                    {/*<NavLink to="/audit_supplier">Supplier</NavLink>*/}
                  </div>
                  <Row>
                    <Col md={12}>
                      <div className="Introduction py-2 px-4">
                        <section className="forms">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex">
                              <label htmlFor="industryType" className="d-flex align-items-center"> Questionnaire Type :- </label>
                              <select name="tab_name" onChange={this.ok} className="select_one_all industrylist">
                                {/* <option>Select Questionnaire Type</option> */}
                                <option>Sector Question</option>
                                {/* <option>Supplier Assessment</option> */}
                              </select>
                            </div>
                            <div className="d-flex">
                              <label htmlFor="industryType" className="d-flex align-items-center"> Financial Year :- </label>
                              {this.state.financialYear && this.state.financialYear?.length === 1 ? (
                                <select
                                  name="tab_name"
                                  onChange={this.handleFinancialYearChange}
                                  className="select_one_all industrylist"
                                >

                                  {this.state.financialYear?.map(
                                    (item, key) => (
                                      <option key={key} value={item.id}>
                                        {item.financial_year_value}
                                      </option>
                                    )
                                  )}
                                </select>
                              ) : (
                                <select
                                  name="tab_name"
                                  onChange={this.handleFinancialYearChange}
                                  className="select_one_all industrylist"
                                >
                                  <option>Select Financial Year</option>
                                  {this.state.financialYear?.map(
                                    (item, key) => (
                                      <option key={key} value={item.id}>
                                        {item.financial_year_value}
                                      </option>
                                    )
                                  )}
                                </select>
                              )}
                            </div>
                          </div>
                        </section>
                      </div>
                      {this.state.auditData?.length > 0 ? (
                        <>
                          <div className="Introduction py-2 px-4 mt-4">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="business_detail">
                                  <div className="heading">
                                    <h4 className="mt-2 bg-red mb-2">Company Audit Question Listing</h4>
                                  </div>
                                </div>
                                {/* <hr className="line" /> */}
                              </div>
                              <div className="table_f">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th style={{ width: "5%" }}>S No.</th>
                                      <th>User</th>
                                      <th>Company</th>
                                      <th>Question Count</th>
                                      <th>Date</th>
                                      <th style={{ width: "5%" }}>View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.auditData?.map(
                                      (item, key) => (
                                        <tr key={key + 1}>
                                          <td>{key + 1}</td>
                                          <td>{item?.name}</td>
                                          <td>
                                            {item?.register_company_name}
                                          </td>
                                          <td>{item?.question_count}</td>
                                          <td>{item?.date}</td>
                                          <td>
                                            <NavLink
                                              className="non_underline_link bold view_c"
                                              to={{
                                                pathname: "/audit",
                                                state: { item: item },
                                              }}
                                            >
                                              <img src={View} alt="" srcSet="" />
                                            </NavLink>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                  {/*<tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Question List 1</td>
                                      <td>
                                        <NavLink className="non_underline_link bold view_c" to="/audit"><i className="fas fa-eye"></i></NavLink>
                                    </td>
                                    </tr>
                                </tbody>*/}
                                </Table>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : this.state.noDataAvailable ? (
                        <>
                          {" "}
                          <hr className="line" />
                          <div className="row">
                            <div className="col-md-12">
                              <div className="business_detail">
                                <div className="heading align-items-center justify-content-center">
                                  <h4> No Questionnaire Found</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </div>
              </section>
            </div>
          </div>
        </div >
      </div >
    );
  }
}
