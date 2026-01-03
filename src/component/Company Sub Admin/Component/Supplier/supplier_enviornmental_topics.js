/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";

import { authenticationService } from "../../../../_services/authentication";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import config from "../../../../config/config.json";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { MutlipleSelect } from "./MutlipleSelect";
const currentUser = authenticationService.currentUserValue;
export default class EnviornmentalTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      answers: [],
      submitted: false,
      firstQuestion:
        "Are your suppliers in an industry with high GHG Emissions?",
      secondQuestion:
        "Do your suppliers track, publish and manage their energy requirements?",
      thirdQuestion:
        "Do your suppliers track, publish and manage their water requirements?",
      fourthQuestion:
        "Are your suppliers in an industry that engages with chemical & hazardous material management?",
      fifthQuestion:
        "Do your suppliers track, publish and manage the waste generated?",
      sixthQuestion:
        "Are your suppliers involved in any other ecological impact?",
      firstAnswer: "",
      secondAnswer: "",
      thirdAnswer: "",
      fourthAnswer: "",
      fifthAnswer: "",
      sixthAnswer: "",
      hideShow: "",
      hideValue: "",
      sixthAnswerAdd: "",
      isEditableOrNot: false,
      isSelect: false,
      checked: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
    this.calculateArr = this.calculateArr.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }
  handleCallback = (childData) => {
    this.calculateArr(childData);
  };

  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleChange3(e) {
    let selectedValue = e.target.value
    let finalResult = (selectedValue === 'yes') ? true : false;
    this.setState({
      checked: finalResult
    });
  }

  handleChange2(event) {
    this.setState({ sixthAnswer: event });
  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  calculateArr(string) {
    this.setState({ sixthAnswerAdd: string });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    let finalSixAnswer = (this.state.checked === false) ? [] : this.state.sixthAnswerAdd;
    let answers = [
      this.state.firstAnswer,
      this.state.secondAnswer,
      this.state.thirdAnswer,
      this.state.fourthAnswer,
      this.state.fifthAnswer,
      finalSixAnswer,
    ];
    let questions = [
      this.state.firstQuestion,
      this.state.secondQuestion,
      this.state.thirdQuestion,
      this.state.fourthQuestion,
      this.state.fifthQuestion,
      this.state.sixthQuestion,
    ];
    let type = "environmentalTopic";

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
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          const newLocal = "/Social_Topics";
          this.props.history.push(newLocal);
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
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
        type: "environmentalTopic",
        current_role: localStorage.getItem("role"),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          let finalAnswer = [];
          if (result.environmentalTopic.length > 0) {
            finalAnswer = JSON.parse(result.environmentalTopic[0]?.answer);
          } else {
            finalAnswer[0] = undefined;
          }
          this.calculateArr(finalAnswer[5]?.answer === undefined ? [] : (finalAnswer[5]?.answer.length > 0) ? finalAnswer[5]?.answer : []);
          this.setState({
            isLoaded: true,
            firstAnswer:
              finalAnswer[0]?.answer === undefined ? "" : finalAnswer[0].answer,
            secondAnswer:
              finalAnswer[1]?.answer === undefined ? "" : finalAnswer[1].answer,
            thirdAnswer:
              finalAnswer[2]?.answer === undefined ? "" : finalAnswer[2].answer,
            fourthAnswer:
              finalAnswer[3]?.answer === undefined ? "" : finalAnswer[3].answer,
            fifthAnswer:
              finalAnswer[4]?.answer === undefined ? "" : finalAnswer[4].answer,
            sixthAnswer:
              finalAnswer[5]?.answer === undefined ? "" : finalAnswer[5].answer,
            checked: finalAnswer[5]?.answer === undefined ? false : (finalAnswer[5]?.answer.length > 0) ? true : false,
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
    const { sixthAnswer, isSelect, isEditableOrNot, checked } = this.state;
    const options = [
      { value: "Water", label: "Water" },
      { value: "Soil", label: "Soil" },
      { value: "Forests", label: "Forests" },
      { value: "Biodiversity", label: "Biodiversity" },
    ];
    let role = JSON.parse(localStorage.getItem("currentUser")).data.role;

    const sixthAnswercheckbox = checked ? (
      <div>
        {sixthAnswer.length > 0 && (
          <MutlipleSelect
            parentCallback={this.handleCallback}
            sixthAnswer={sixthAnswer}
            options={options}
          />
        )}
        {sixthAnswer.length === 0 && !isSelect && (
          <MutlipleSelect
            parentCallback={this.handleCallback}
            sixthAnswer={sixthAnswer}
            options={options}
          />
        )}
      </div>
    ) : (
      ""
    );

    return (
      <div>
        {/* <div className="row setup-content" id="step-9"> */}
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        <div className="main_wrapper">
          <div className="tabs-top">
            <ul>
              <li>
                <NavLink to="#" className="activee">
                  Environmental Topics
                </NavLink>
              </li>
              <li>
                <NavLink to="/Social_Topics">Social Topics</NavLink>
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
                                  Environmental Topics
                                </h4>
                              </div>
                              <div className="home_risckq">
                                <div className="row">
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase mb-2">
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
                                      <label className="nature_one fw-bold font-increase mb-2">
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
                                      <label className="nature_one fw-bold font-increase mb-2">
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
                                      <label className="nature_one fw-bold font-increase mb-2">
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
                                      <label className="nature_one fw-bold font-increase mb-2">
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
                                  <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                    <div className="form-group bop">
                                      <label className="nature_one fw-bold font-increase mb-2">
                                        {this.state.sixthQuestion}
                                      </label>
                                      <br />

                                      <div>
                                        <select
                                          className="form-control"
                                          checked={this.state.checked}
                                          onChange={this.handleChange3}
                                          type="checkbox"
                                        >
                                          <option value={""}>Select suppliers involved</option>
                                          <option value={'yes'}>Yes</option>
                                          <option value={'no'}>No</option>
                                        </select>
                                      </div>
                                      <br />
                                      {sixthAnswercheckbox}
                                    </div>
                                  </div>
                                </div>
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
                                        to={"/Social_Topics"}
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
