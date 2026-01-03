import { authenticationService } from "../../../../_services/authentication";
import Swal from "sweetalert2";
import React, { Component } from "react";
import config from "../../../../config/config.json";
import axios from "axios";
const currentUser = authenticationService.currentUserValue;
export default class Enviornmental_Capital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,
      submissions: {
        firstQuestion:
          "Q: How is the company managing energy consumption and related price and supply risks?",
        secondQuestion:
          "Q: What strategies are in place to increase energy efficiency and manage the company's energy mix?",
        thirdQuestion:
          "Q: How is the company improving materials efficiency and reducing waste in manufacturing, including through recycling?",
        firstAnswer: "",
        secondAnswer: "",
        thirdAnswer: "",
      },
      isCompanySubAdminSubmit: false,
      isCompanyAdminSubmit: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { submissions } = this.state;
    this.setState({
      submissions: {
        ...submissions,
        [name]: value,
      },
    });
  }
  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { submissions } = this.state;
    let postData = {};
    let arrayData = [
      [submissions.firstQuestion, submissions.firstAnswer],
      [submissions.secondQuestion, submissions.secondAnswer],
      [submissions.thirdQuestion, submissions.thirdAnswer],
    ];
    postData.questionsAndAnswers = arrayData;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.OLD_API_URL + "environmentalCapital",
        {
          environmentalCapitalIds: postData,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: response[0].message,
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch(function (error) {
        if (error.response) {
          Swal.fire({
            icon: "error",
            title: error.response[0].message,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(
      config.API_URL +
      `getEnvironmentCapitalAnswers?current_role=${localStorage.getItem(
        "role"
      )}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.answers,
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
    const { submissions, submitted } = this.state;
    return (
      <div>
        <div className="row setup-content" id="#step-9">
          <div className="col-md-12">
            <div className="Capital_op">
              <h4 className="E_capital">Environmental Capital</h4>
            </div>

            <form onSubmit={this.handleSubmit}>
              <div className="manag">
                <div className="heading_h3 mb-3">
                  <span className="gement">Energy Management</span>
                </div>
                <div className="form-floating mt-3">
                  <input
                    type="hidden"
                    name="firstQuestion"
                    onChange={this.handleChange}
                    value={submissions.firstQuestion}
                  />

                  <textarea
                    className="form-control"
                    name="firstAnswer"
                    required
                    placeholder="Leave a comment here"
                    onChange={this.handleChange}
                    in="true"
                  ></textarea>

                  <label htmlFor="floatingTextarea" className="energy">
                    Q: How is the company managing energy consumption and
                    related price and supply risks?
                  </label>
                  {submitted && !submissions.firstAnswer && (
                    <div className="help-block">Field is required</div>
                  )}
                </div>
                <div className="form-floating mt-3">
                  <input
                    type="hidden"
                    name="secondQuestion"
                    onChange={this.handleChange}
                    value={submissions.secondQuestion}
                  />
                  <textarea
                    className="form-control"
                    name="secondAnswer"
                    required
                    placeholder="Leave a comment here"
                    onChange={this.handleChange}
                    value={submissions.secondAnswer}
                  >
                    {submissions.secondAnswer}
                  </textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: What strategies are in place to increase energy
                    efficiency and manage the company's energy mix?
                  </label>
                  {submitted && !submissions.secondAnswer && (
                    <div className="help-block">Field is required</div>
                  )}
                </div>

                <div className="heading_h3 mt-3">
                  <h4 className="Waste">Waste Management</h4>
                </div>
                <div className="form-floating mt-3">
                  <input
                    type="hidden"
                    name="thirdQuestion"
                    onChange={this.handleChange}
                    value={submissions.thirdQuestion}
                  />
                  <textarea
                    className="form-control"
                    name="thirdAnswer"
                    required
                    placeholder="Leave a comment here"
                    onChange={this.handleChange}
                    value={submissions.thirdAnswer}
                  >
                    {submissions.thirdAnswer}
                  </textarea>
                  <label htmlFor="floatingTextarea" className="energy">
                    Q: How is the company improving materials efficiency and
                    reducing waste in manufacturing, including through
                    recycling?
                  </label>
                  {submitted && !submissions.thirdAnswer && (
                    <div className="help-block">Field is required</div>
                  )}
                </div>

                <div className="sve_next">
                  <button className="page_save page_width" type="submit">
                    SAVE AS DRAFT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
