import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import View from '../../../img/view.png'
export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      items: [],
      loading: false,
    }
  }

  componentDidMount() {
  }

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
                              <div className="heading">
                                <h4>Global Control & Manage</h4>
                              </div>
                              <hr className="line"></hr>
                              <div className="saved_cards">
                                <div className="business_detail">
                                  <div className="heading">
                                    <div className="heading_wth_text">
                                      <div className="d-flex">
                                        <span className="global_link mx-0">

                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="table_f table-responsive">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "5%" }}>Sr.</th>
                                        <th>Global Controls</th>
                                        <th style={{ width: "5%" }}>View</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* <tr>
                                        <td>1</td>
                                        <td>Manage Industry Lists & Industry Type</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/industry_categories">
                                          <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr> */}
                                      <tr>
                                        <td>1</td>
                                        <td>Manage Frameworks</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/frameworks">
                                            <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td>Manage Topics</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/topics">
                                            <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td>Manage KPIs</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/kpi">
                                            <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td>Manage Sector Questions</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/questions_framework_wise">
                                            <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      {/* <tr>
                                        <td>6</td>
                                        <td>Global Innovative Programmes</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/innovative_programmes">
                                          <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>7</td>
                                        <td>Introduction Videos</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/introduction_videos">
                                          <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>8</td>
                                        <td>Policies</td>
                                        <td className="d-flex justify-content-center">
                                          <NavLink className="non_underline_link bold view_c" to="/policies">
                                          <img src={View} alt="" srcSet="" />
                                          </NavLink>
                                        </td>
                                      </tr> */}
                                    </tbody>
                                  </Table>
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
