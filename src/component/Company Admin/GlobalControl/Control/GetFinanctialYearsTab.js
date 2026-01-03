import React, { Component } from "react";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import { PermissionContext } from "../../../../context/PermissionContext";
import { authenticationService } from "../../../../_services/authentication";
import { Form } from "react-bootstrap";
export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      items: [],
      loading: false,
      menuList: [],
    };
  }

  componentDidMount() {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "global_controls"
    );
    this.setState({ menuList: settingsMenu?.permissions });
  }

  render() {
    return (
      <PermissionContext.Consumer>
        {({ permissions }) => (
          <div>
            <AdminSidebar dataFromParent={this.props.location.pathname} />
            <AdminHeader />
            <div className="main_wrapper">
              <div className="inner_wraapper">
                <div className="color_div_on framwork_2 mb-2">
                  <div className="business_detail">
                    <div className="d-flex align-items-center justify-content-between bb-2">
                      <div className="heading">
                        <h4>Global Control & Manage</h4>
                      </div>
                      <div>
                        <Form.Control
                          as="select"
                          value={selectedCountry}
                          onChange={handleCountryChange}
                        >
                          {countriesData &&
                            countriesData.map((country, index) => (
                              <option key={index}>{country.name}</option>
                            ))}
                        </Form.Control>
                      </div>
                      <div>
                        <Form.Select aria-label="Default select example">
                          <option>Financial Year End Date</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </Form.Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="color_div_on framwork_2">
                  <div className="business_detail">
                    <div className="saved_cards">
                      <div className="table_f table-responsive">
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr className="heading_color">
                              <th>Global Controls</th>
                              <th style={{ width: "5%" }}>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.menuList?.includes() && (
                              <tr>
                                <td>Manage Industry Lists & Industry Type</td>
                                <td>
                                  <NavLink
                                    className="non_underline_link bold view_c"
                                    to="/industry_categories"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </NavLink>
                                </td>
                              </tr>
                            )}
                            {this.state.menuList?.includes(
                              "FRAMEWORK_UPDATE",
                              "FRAMEWORK_VIEW",
                              "FRAMEWORK_DELETE",
                              "FRAMEWORK_CREATE"
                            ) && (
                                <tr>
                                  <td>Manage Frameworks</td>
                                  <td>
                                    <NavLink
                                      className="non_underline_link bold view_c"
                                      to="/frameworks"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </NavLink>
                                  </td>
                                </tr>
                              )}
                            {this.state.menuList?.includes(
                              "TOPIC_CREATE",
                              "TOPIC_UPDATE",
                              "TOPIC_VIEW",
                              "TOPIC_DELETE"
                            ) && (
                                <tr>
                                  <td>Manage Topics</td>
                                  <td>
                                    <NavLink
                                      className="non_underline_link bold view_c"
                                      to="/topics"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </NavLink>
                                  </td>
                                </tr>
                              )}
                            {this.state.menuList?.includes(
                              "KPI_UPDATE",
                              "KPI_VIEW",
                              "KPI_DELETE",
                              "KPI_CREATE"
                            ) && (
                                <tr>
                                  <td>Manage KPIs</td>
                                  <td>
                                    <NavLink
                                      className="non_underline_link bold view_c"
                                      to="/kpi"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </NavLink>
                                  </td>
                                </tr>
                              )}
                            {this.state.menuList?.includes(
                              "SECTOR_QUESTIONS_VIEW"
                            ) && (
                                <tr>
                                  <td>Manage Sector Questions</td>
                                  <td>
                                    <NavLink
                                      className="non_underline_link bold view_c"
                                      to="/questions_framework_wise"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </NavLink>
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PermissionContext.Consumer>
    );
  }
}
