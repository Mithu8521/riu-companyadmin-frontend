import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Table from "react-bootstrap/Table";
import config from "../../../config/config.json";
const baseURL = config.baseURL;

export default class SubAdminPage extends Component {
  render() {
    return (
      <div>
        <section className="forms">
          <div className="row">
            <div className="col-md-12">
              <div className="business_detail">
                <div className="heading">
                  <h4>Business Details</h4>
                  <div className="directly p-0">
                    <NavLink
                      className="directly_link"
                      to="/sector_question_fast"
                    >
                      Add new sub-admin
                    </NavLink>
                  </div>
                </div>
                <hr className="line"></hr>
              </div>

              <div className="table_f">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr className="heading_color">
                      <th>ID</th>
                      <th>SUB-ADMIN NAME</th>
                      <th>EMAIL</th>
                      <th>TITLE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Ralph Edwards</td>
                      <td>deanna.curtis@example.com</td>
                      <td>Software Tester</td>
                      <td>
                        <NavLink to="/user_detail" className="red">

                          Inactive
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Eleanor Pena</td>
                      <td>sara.cruz@example.com</td>
                      <td>Software Manager</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Cameron Williamson</td>
                      <td>nevaeh.simmons@example.com</td>
                      <td>Team Leader</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Guy Hawkins</td>
                      <td>willie.jennings@example.com</td>
                      <td>UI/UX Designer</td>
                      <td>
                        <NavLink to="/user_detail" className="red">

                          Inactive
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Ronald Richards</td>
                      <td>tim.jennings@example.com</td>
                      <td>Team Leader</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Bessie Cooper</td>
                      <td>debbie.baker@example.com</td>
                      <td>Software Manager</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>Marvin McKinney</td>
                      <td>dolores.chambers@example.com</td>
                      <td>Ethical Hacker</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>Eleanor Pena</td>
                      <td>sara.cruz@example.com</td>
                      <td>Software Manager</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>Ronald Richards</td>
                      <td>tim.jennings@example.com</td>
                      <td>Team Leader</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>Bessie Cooper</td>
                      <td>debbie.baker@example.com</td>
                      <td>Software Manager</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>Basic</td>
                      <td>Jan 2021</td>
                      <td>$2,410</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td>Ronald Richards</td>
                      <td>tim.jennings@example.com</td>
                      <td>Team Leader</td>
                      <td>
                        <NavLink to="/user_detail" className="green">

                          Active
                        </NavLink>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <div className="pagination_billing justify-content-end">
                  <ul>
                    <li className="justify-align-left">
                      <NavLink to="">
                        <span>
                          <i className="fal fa-arrow-left mx-3"></i>
                        </span>
                        Back
                      </NavLink>
                    </li>
                    <li className="justify-align-center">
                      <NavLink to="">Showing 1-10 of 1023</NavLink>
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
        </section>
      </div>
    );
  }
}
