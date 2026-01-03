import React from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./suuplierManagement.css";
const MySwal = withReactContent(Swal);

export default function SupplierManagementFrameworkList(props) {
  const openFeedbackPopup = () => {
    MySwal.fire({
      // icon: "success",
      title: "success",
      title: (
        <div>
          <div className="heading">Feedback</div>
          <div className="message__section">
            <div className="receive__message__wrapper">ujhbjgjj</div>
            <div className="send__message__wrapper">
              <div className="messageWrapper">jhjkhbujhbbgjh</div>
            </div>
            <div className="receive__message__wrapper">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore
            </div>
            <div className="send__message__wrapper">
              <div className="messageWrapper">
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat
              </div>
            </div>
            <div className="receive__message__wrapper">
              Duis aute irure dolor in reprehenderit in voluptate
            </div>
            <div className="send__message__wrapper">
              <div className="messageWrapper">
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat
              </div>
            </div>
          </div>
        </div>
      ),
    });
  };
  const openLogPopup = () => {
    MySwal.fire({
      // icon: "success",
      title: "success",
      title: (
        <div>
          <div className="heading">Logs</div>
          <div className="message__section">
            <Table striped bordered hover size="sm" className="table__styling">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Feedback/Comment</th>
                  <th>Updated date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>vhgrybh</td>
                  <td>08/09/2023</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>vhgrybh</td>
                  <td>08/09/2023</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>vhgrybh</td>
                  <td>08/09/2023</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>vhgrybh</td>
                  <td>08/09/2023</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      ),
    });
  };
  return (
    <div>
      <Sidebar dataFromParent={props.location.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="color_div_on framwork_2">
                      <div className="table_f manage-detail admin-risk-table table-responsive">
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr className="heading_color">
                              <th>Id</th>
                              <th>Framework</th>
                              <th>Response</th>
                              <th>Complan Score</th>
                              <th>Feedback</th>
                              <th>Logs</th>
                              <th></th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Framework</td>
                              <td>jj nhjfb </td>
                              <th>IDENTIFIED RISK</th>
                              <th>
                                <button
                                  style={{
                                    cursor: "pointer",
                                    color: "#1f9ed1",
                                    textDecoration: "underline",
                                    border: "none",
                                    background: "none",
                                  }}
                                  onClick={openFeedbackPopup}
                                >
                                  feedback
                                </button>
                              </th>
                              <th>
                                <img
                                  src="/image/logs__icon.png"
                                  style={{ width: "20px", heigh: "20px" }}
                                />
                              </th>
                              <th>
                                <NavLink to="/supplier_management">
                                  <img
                                    src="/image/back__arrow__icon.png"
                                    style={{ width: "20px", heigh: "20px" }}
                                  />
                                </NavLink>
                              </th>
                              <th>
                                <NavLink to="/supplier_management/question_list">
                                  view
                                </NavLink>
                              </th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Framework</td>
                              <td>jj nhjfb </td>
                              <th>complan score</th>
                              <th>
                                {" "}
                                <button
                                  style={{
                                    cursor: "pointer",
                                    color: "#1f9ed1",
                                    textDecoration: "underline",
                                    border: "none",
                                    background: "none",
                                  }}
                                  onClick={openFeedbackPopup}
                                >
                                  feedback
                                </button>
                              </th>
                              <th>
                                <img
                                  src="/image/logs__icon.png"
                                  style={{ width: "20px", heigh: "20px" }}
                                />
                              </th>
                              <th>
                                <NavLink to="/supplier_management">
                                  <img
                                    src="/image/back__arrow__icon.png"
                                    style={{ width: "20px", heigh: "20px" }}
                                  />
                                </NavLink>
                              </th>
                              <th>
                                <NavLink to="/supplier_management/question_list">
                                  view
                                </NavLink>
                              </th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Framework</td>
                              <td>jj nhjfb </td>
                              <th>IDENTIFIED RISK</th>
                              <th>
                                {" "}
                                <button
                                  style={{
                                    cursor: "pointer",
                                    color: "#1f9ed1",
                                    textDecoration: "underline",
                                    border: "none",
                                    background: "none",
                                  }}
                                  onClick={openFeedbackPopup}
                                >
                                  feedback
                                </button>
                              </th>
                              <th
                                onClick={openLogPopup}
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  src="/image/logs__icon.png"
                                  style={{ width: "20px", heigh: "20px" }}
                                />
                              </th>
                              <th>
                                <NavLink to="/supplier_management">
                                  <img
                                    src="/image/back__arrow__icon.png"
                                    style={{ width: "20px", heigh: "20px" }}
                                  />
                                </NavLink>
                              </th>
                              <th>
                                <NavLink to="/supplier_management/question_list">
                                  view
                                </NavLink>
                              </th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Framework</td>
                              <td>jj nhjfb </td>
                              <th>IDENTIFIED RISK</th>
                              <th>
                                {" "}
                                <button
                                  style={{
                                    cursor: "pointer",
                                    color: "#1f9ed1",
                                    textDecoration: "underline",
                                    border: "none",
                                    background: "none",
                                  }}
                                  onClick={openFeedbackPopup}
                                >
                                  feedback
                                </button>
                              </th>
                              <th>
                                <img
                                  src="/image/logs__icon.png"
                                  style={{ width: "20px", heigh: "20px" }}
                                />
                              </th>
                              <th>
                                <NavLink to="/supplier_management">
                                  <img
                                    src="/image/back__arrow__icon.png"
                                    style={{ width: "20px", heigh: "20px" }}
                                  />
                                </NavLink>
                              </th>
                              <th>
                                <NavLink to="/supplier_management/question_list">
                                  view
                                </NavLink>
                              </th>
                            </tr>
                          </tbody>
                        </Table>
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
