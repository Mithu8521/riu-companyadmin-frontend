/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { authenticationService } from "../../../../_services/authentication";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import config from "../../../../config/config.json";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
const currentUser = authenticationService.currentUserValue;

export default class SocialTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,
      firstQuestion:
        "Do your suppliers recognise and report human rights violations?",
      secondQuestion:
        "Do your suppliers implement career management & training?",
      thirdQuestion:
        "Do your suppliers have strategies for employee engagement?",
      fourthQuestion:
        "Do your suppliers encourage diversity and inclusion?",
      fifthQuestion:
        "Do your suppliers maintain records and report about employee health & safety?",

      firstAnswer: "",
      secondAnswer: "",
      thirdAnswer: "",
      fourthAnswer: "",
      fifthAnswer: "",
      isEditableOrNot: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);

  }



  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    let answers = [
      this.state.firstAnswer,
      this.state.secondAnswer,
      this.state.thirdAnswer,
      this.state.fourthAnswer,
      this.state.fifthAnswer,
    ];
    let questions = [
      this.state.firstQuestion,
      this.state.secondQuestion,
      this.state.thirdQuestion,
      this.state.fourthQuestion,
      this.state.fifthQuestion,
    ];
    let type = "socialTopic";

    axios
      .post(
        config.API_URL + "addSupplierDetail",
        {
          questions,
          answers,
          type,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data.message)
        setTimeout(() => {
          const newLocal = "/Governance_Topics";
          this.props.history.push(newLocal);
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message)
        }
      });
  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(
      config.API_URL + "getSupplierDetailsForTopics",
      { headers },
      {
        type: "socialTopic",
        current_role: localStorage.getItem("role"),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          let finalAnswer = [];
          if (result.socialTopic.length > 0) {
            finalAnswer = JSON.parse(result.socialTopic[0]?.answer);
          } else {
            finalAnswer[0] = undefined;
          }
          this.setState({
            isLoaded: true,
            firstAnswer:
              finalAnswer[0]?.answer === undefined
                ? ""
                : finalAnswer[0].answer,
            secondAnswer:
              finalAnswer[1]?.answer === undefined
                ? ""
                : finalAnswer[1].answer,
            thirdAnswer:
              finalAnswer[2]?.answer === undefined
                ? ""
                : finalAnswer[2].answer,
            fourthAnswer:
              finalAnswer[3]?.answer === undefined
                ? ""
                : finalAnswer[3].answer,
            fifthAnswer:
              finalAnswer[4]?.answer === undefined
                ? ""
                : finalAnswer[4].answer,
            isEditableOrNot: result?.insertOrUpdate,
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
    const { isEditableOrNot } = this.state;
    let role = JSON.parse(localStorage.getItem("currentUser")).data.role;
    return (
      <div>
        {/* <div className="row setup-content" id="step-10"> */}
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        <div className="main_wrapper">
          <div className="tabs-top">
            <ul>
              <li>
                <NavLink to="/Environmental_Topics">
                  Environmental Topics
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="activee">
                  Social Topics
                </NavLink>
              </li>
              <li>
                <NavLink to="/Governance_Topics">Governance Topics</NavLink>
              </li>
              <li>
                <NavLink to="/Business_Models">Business Models</NavLink>
              </li>
            </ul>
          </div>
          <div className="inner_wraapper pt-0">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="Introduction framwork_2">
                        <div className="col-md-12">
                          <form onSubmit={this.handleSubmit}>
                            <div className="four_box_text">
                              <div className="Environmental">
                                <h4 className="Environmental_text font-heading">
                                  Social Topics
                                </h4>
                              </div>
                              <div className="home_risckq">
                                <div className="row">
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase">
                                        {this.state.firstQuestion}
                                      </label>
                                      <textarea
                                        className="form-control text_w"
                                        rows="3"
                                        name="firstAnswer"
                                        onChange={this.handleChange}
                                        defaultValue={this.state.firstAnswer}
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase">
                                        {this.state.secondQuestion}
                                      </label>
                                      <textarea
                                        className="form-control text_w"
                                        rows="3"
                                        name="secondAnswer"
                                        onChange={this.handleChange}
                                        defaultValue={this.state.secondAnswer}
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase">
                                        {this.state.thirdQuestion}
                                      </label>
                                      <textarea
                                        className="form-control text_w"
                                        rows="3"
                                        name="thirdAnswer"
                                        onChange={this.handleChange}
                                        defaultValue={this.state.thirdAnswer}
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase">
                                        {this.state.fourthQuestion}
                                      </label>
                                      <textarea
                                        className="form-control text_w"
                                        rows="3"
                                        name="fourthAnswer"
                                        onChange={this.handleChange}
                                        defaultValue={this.state.fourthAnswer}
                                      ></textarea>
                                    </div>
                                  </div>
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase">
                                        {this.state.fifthQuestion}
                                      </label>
                                      <br />
                                      <textarea
                                        className="form-control text_w"
                                        rows="3"
                                        name="fifthAnswer"
                                        onChange={this.handleChange}
                                        defaultValue={this.state.fifthAnswer}
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                                {/* <hr className="imact_yum px-2"/> */}
                              </div>
                            </div>
                            <div className="global_link mx-0">
                              <div className="save_global">
                                <span className="">
                                  <a
                                    className="link_bal_next"
                                    onClick={this.goToPreviousPath}
                                  >
                                    Back
                                  </a>
                                </span>

                                <span className="global_link">
                                  {isEditableOrNot && (
                                    <button
                                      className="new_button_style"
                                      type="submit"
                                    >
                                      Next
                                    </button>
                                  )}
                                  {!isEditableOrNot &&
                                    role === "company_sub_admin" && (
                                      <NavLink
                                        className="new_button_style"
                                        to={"/Governance_Topics"}
                                      >
                                        Next
                                      </NavLink>
                                    )}
                                </span>
                              </div>
                            </div>
                          </form>
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
