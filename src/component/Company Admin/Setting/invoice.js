import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import Moment from "react-moment";
import Table from "react-bootstrap/Table";
import "../component/setting/billing.css";
import config from "../../../config/config.json";
import { authenticationService } from "../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      totalAmount: 0,
      skip: 0,
      limit: 10,
      uuid: [],
      setStartDate: null,
      setEndDate: null,
    };
  }

  componentDidMount() {
    let urlArr = window.location.pathname.split("/");
    let uuid = urlArr[urlArr.length - 2];
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    let parms = `revenue/${uuid}?current_role=${localStorage.getItem("role")}`;
    fetch(config.ADMIN_API_URL + parms, requestOptions)
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            items: data?.data,
          });
          let amount = 0;
          data?.data.forEach((element) => {
            amount += element.amount;
          });
          this.setState({
            totalAmount: amount,
          });
        },
        (error) => { }
      );
  }



  render() {
    const { items, totalAmount } = this.state;
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
                      <div className="Introduction framwork_2">
                        <div className="text_Parts">
                          <div className="text_ntroion">
                            <h5 className="Intro">Invoice</h5>
                            <div className="row mt-5">
                              <div className="col-lg-4 col-sm-6 col-xs-12">
                                <div className="address">
                                  <h5>Invoice Date</h5>
                                  <p>
                                    <Moment format="MMM YYYY" withTitle>
                                      {items[0]?.created_at}
                                    </Moment>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-5 col-sm-6 col-xs-12">
                                <div className="address">
                                  <h5>Invoice Number</h5>
                                  <p>{Math.floor(Math.random() * 100000)}</p>
                                </div>
                              </div>
                              <div className="col-lg-3 col-sm-6 col-xs-12">
                                <div className="address">
                                  <h5>Amount Due (USD)</h5>
                                  <p className="amount">$0</p>
                                </div>
                              </div>
                              <hr className="line-hr"></hr>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-xs-12">
                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th>Description</th>
                                        <th>Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(items || []).map((item, key) => (
                                        <tr>
                                          <td>{item.title}</td>
                                          <td>${item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <div className="table_footer">
                              <div className="footer-lable d-flex">
                                <label className="mx-5 font-weight-bold">
                                  Subtotal{" "}
                                </label>
                                <p>${totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") && totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                              </div>
                              <div className="footer-lable d-flex">
                                <label className="mx-5 font-weight-bold">
                                  Tax (6%){" "}
                                </label>
                                <p>$0</p>
                              </div>
                              <div className="footer-lable d-flex">
                                <label className="mx-5 font-weight-bold">
                                  Amount Due (USD){" "}
                                </label>
                                <p>${totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") && totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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
