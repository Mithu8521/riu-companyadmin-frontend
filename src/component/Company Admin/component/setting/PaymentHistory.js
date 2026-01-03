/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import Card from "../../../../img/Debit_Cards.png";
import Table from "react-bootstrap/Table";
// import { Pagination, Icon } from "semantic-ui-react";

import config from "../../../../config/config.json";

import { authenticationService } from "../../../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      pageCount: 0,
      list: [],
      totalData: 0,
      perPage: 10,
      page: 0,
      pages: 0,
    };
  }


  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.API_URL + `companyBilling/payment/history?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data,
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
    const { items } = this.state;
    return (
      <>
        <div className="saved_cards">
          <div className="business_detail">
            <div className="heading">
              <h4>Saved Cards</h4>
            </div>
          </div>
          <div className="sub-heading mt-3">
            <p>Please add your card details below for easy transactions.</p>
          </div>

          <div className="img_button">
            <span>
              <img src={Card} />
            </span>
            <span className="cards-de">
              <button type="btn" className="btn btn-primary" disabled>
                +
              </button>
              <span>{/* <p className="add_card">Add Card</p> */}</span>
            </span>
          </div>
        </div>
        <hr className="line mt-5"></hr>
        <div className="saved_cards">
          <div className="business_detail">
            <div className="heading">
              <div className="heading_wth_text">
                <h4 className="mb-3">Payment History</h4>
                <p>
                  Feel free to reach out to us in case of any queries regarding
                  payments.
                </p>
              </div>
              <form>
                <div className="row">
                  <div className="col-md-6 col-xs-12 mb-3">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Date From</label>
                      <input
                        type="date"
                        onChange={(this.handleChange, this.onDateChange)}
                        className="form-control date-picker"
                        name="setStartDate"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 mb-3">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Date To</label>
                      <input
                        type="date"
                        onChange={(this.handleChange, this.onDateChange)}
                        className="form-control date-picker"
                        name="setEndDate"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="table_f">
            <Table striped bordered hover size="sm">
              <thead>
                <tr className="heading_color history">
                  <th>Invoice ID</th>
                  <th>Subscription plan</th>
                  <th>Month</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>

              <tbody className="history">
                <tr>
                  <td>{items.id}</td>
                  <td>{items.title}</td>
                  <td>{items.createdAt}</td>
                  <td>${items.price}</td>
                </tr>
              </tbody>

            </Table>
          </div>
        </div>
      </>
    );
  }
}
