import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { sweetAlert } from '../../utils/UniversalFunction'
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import Table from "react-bootstrap/Table";
import "../Sector_Question_Manage/control.css";
import config from "../../config/config.json";
import { NavLink } from "react-router-dom";
import { authenticationService } from "../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class Kpi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      items: [],
      loading: false,
      companyIndustry: [],
    };
    this.removeIndustry = this.removeIndustry.bind(this);
  }
  removeIndustry(id) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    Swal.fire({
      title: "Do you want to delete this kpi?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            config.API_URL + `deleteIndustry/${id}`, requestOptions,
            {
              id: id,
              current_role: localStorage.getItem("role"),
            }
          )
          .then(() => {
            sweetAlert('success', "Delete successful");
            this.setState({ status: 'Delete successful' });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch(function (response) {
            sweetAlert('error', "Delete Unsuccessful");
          });
      } else if (result.isDenied) {
        sweetAlert('info', "Industry Details Safe");
      }
    });
  }
  componentDidMount() {
    fetch(config.API_URL + `getIndustriesOfCategoryId?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            companyIndustry: result.companyIndustry,
          });
        },

        (error2) => {
          this.setState({
            isLoaded2: true,
            error2,
          });
        }
      );
  }

  render() {
    const { companyIndustry } = this.state;
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
                              {/* <div className="heading">
                                <h4>Question : Industry Wise</h4>
                              </div>
                              <hr className="line"></hr> */}
                              <div className="saved_cards">
                                <div className="business_detail mb-4">
                                  <div className="heading">
                                    <div className="heading_wth_text">
                                      <div className="d-flex">
                                        <span className="global_link mx-0">
                                          <NavLink
                                            className="non_underline_link bold"
                                            to="/kpi/create"
                                          >
                                            <button
                                              className="new_button_style"
                                              variant="none"
                                              to="/kpi/create"
                                            >
                                              ADD Kpi
                                            </button>
                                          </NavLink>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "5%" }}>Sr.</th>
                                        <th>Framework</th>
                                        <th>Topic</th>
                                        <th>Kpi</th>
                                        <th style={{ width: "5%" }}>Edit </th>
                                        <th style={{ width: "5%" }}>DELETE </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {companyIndustry.map((item, key) => (
                                        <tr key={key}>
                                          <td>{key + 1}</td>
                                          <td>{item.name}</td>
                                          <td>{item.name}</td>
                                          <td>{item.title}</td>
                                          <td>
                                            <NavLink
                                              className="non_underline_link bold view_c"
                                              to={"/kpi/" + item.industryId + "/update_kpi"}
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" /></svg>
                                              {/* <button className="zoho_view_button_next">
                                                View
                                              </button> */}
                                            </NavLink>
                                          </td>
                                          <td className="red view_c" onClick={() => this.removeIndustry(item.industryId)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM4 18.385L5.763 17H20V5H4v13.385zM13.414 11l2.475 2.475-1.414 1.414L12 12.414 9.525 14.89l-1.414-1.414L10.586 11 8.11 8.525l1.414-1.414L12 9.586l2.475-2.475 1.414 1.414L13.414 11z" /></svg>
                                            {/* <button className="zoho_delete_button_next">
                                              Delete
                                            </button> */}
                                          </td>
                                        </tr>
                                      ))}
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
