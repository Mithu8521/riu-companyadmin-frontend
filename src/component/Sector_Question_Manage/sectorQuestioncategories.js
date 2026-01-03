import React, { Component } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import Table from "react-bootstrap/Table";
import config from "../../config/config.json";
import { NavLink } from "react-router-dom";
import "./control.css";
import { authenticationService } from "../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class SectorQuestionCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      items: [],
      loading: false,
      tabList: [],
      industry_id: [],
      tabURI: [],
    };
  }

  componentDidMount() {
    let uri = window.location.pathname.split("/");
    let id = uri[2];
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(config.API_URL + `getquestiontabfromindustry/${id}?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            tabList: result.tabList,
            tabURI: result.tabURI,
            industry_id: result.industry_id,
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
    const { tabURI, industry_id } = this.state;
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
                                <h4>Question Tabs</h4>
                              </div>
                              <hr className="line"></hr>
                              <div className="saved_cards">
                                <div className="business_detail mb-4">
                                  <div className="heading">
                                    <div className="heading_wth_text"></div>
                                  </div>
                                </div>
                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "5%" }}>Sr.</th>
                                        <th>Sector Question Tabs</th>
                                        <th style={{ width: "5%" }}>VIEW </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tabURI.map((item, key) => (
                                        <tr key={key}>
                                          <td>{key + 1}</td>
                                          <td>{item}</td>
                                          <td>
                                            <NavLink
                                              className="non_underline_link bold view_c"
                                              to={"/sector_questions" + item + "/" + industry_id + "/question_lists"}
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>
                                              {/* <button className="zoho_view_button_next">
                                                View
                                              </button> */}
                                            </NavLink>
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
