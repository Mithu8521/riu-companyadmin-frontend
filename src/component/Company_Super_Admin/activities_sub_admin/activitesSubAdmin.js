import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { authenticationService } from "../../../_services/authentication";
import '../activities_sub_admin/activitiesSubAdmin.css';
import config from "../../../config/config.json";
const currentUser = authenticationService.currentUserValue;

export default class activitiesSubAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      totalCompanies: 0,
      totalUsers: 0,
      totalSuppliers: 0,
      subAdmins: [],
    };
  }
  componentDidMount() {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(config.ADMIN_API_URL + `getTotalCount?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            totalCompanies: data.totalCompany,
            totalUsers: data.totalUsers,
            totalSuppliers: data.totalSuppliers,
            subAdmins: data.subAdmins.rows,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
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
                          <div className="activities-sub-notifocation">
                            <h4>Today</h4>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <h4>Yesterday</h4>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
                            <div className="user-changes">
                              <div className="wrap-user">
                                <span>MS</span>
                                <p>Margo Corn has changed policies in Company super Admin</p>
                              </div>
                              <span>2 mint</span>
                            </div>
                            <div className="hr"></div>
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
