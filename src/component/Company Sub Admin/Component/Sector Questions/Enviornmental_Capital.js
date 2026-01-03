/* eslint-disable jsx-a11y/anchor-is-valid */
import { authenticationService } from "../../../../_services/authentication";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import React, { Component } from "react";
import config from "../../../../config/config.json";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Loader from "../../../loader/Loader";
import DyanamicTabs from "./dyanamicTabs";

const currentUser = authenticationService.currentUserValue;

export default class EnvironmentalCapital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      answers: [],
      questionId: [],
      submitted: false,
      questions: [],
      isQuestionAvailable: false,
      isCompanySubAdminSubmit: false,
      isCompanyAdminSubmit: false,
      isNextTab: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
    this.handleCallback = this.handleCallback.bind(this);

  }

  handleCallback = (childData) => {
    this.setState({ tabs: childData });
    let uri = window.location.href.split("/").pop();
    let nextTab = "";
    let ii = 0;
    childData.forEach((element) => {
      if (element.uri === "/" + uri) {
        nextTab = childData[ii + 1].uri;
        this.setState({
          isNextTab: nextTab,
        });
      }
      ii++;
    });
  };

  handleChange(id, event, questionId) {
    let answerss = this.state.answers;
    let questionIds = this.state.questionId;
    const target = event.target;
    const value = target.value;
    const questionIdd = questionId;
    answerss[id] = value;
    questionIds[id] = questionIdd;
    this.setState({
      answers: answerss,
      questionId: questionIds,
    });
  }

  goToPreviousPath() {
    this.props.history.goBack();
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    let environmentalCapitalIds = {};
    let finalArr = [];
    let questionIdddd;
    const { answers, questionId } = this.state;
    for (let index = 0; index < answers.length; index++) {
      const element = answers[index];
      questionIdddd = questionId[index];
      let obj = {
        id: questionIdddd,
        answer: element,
      };
      finalArr.push(obj);
    }
    environmentalCapitalIds.data = finalArr;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.OLD_API_URL + "environmentalCapital",
        { environmentalCapitalIds: environmentalCapitalIds },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data[0].message)
        setTimeout(() => {
          const newLocal = this.state.isNextTab;
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
    this.setState({
      isLoaded: true,
    });
    fetch(config.API_URL + `getEnvironmentCapitalAnswers?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          let questionIdddd = [];
          let answerIdddd = [];
          result.questions.forEach((element) => {
            questionIdddd.push(element.id);
            answerIdddd.push(element.answer);
          });
          this.setState({
            isQuestionAvailable: result.questions.length > 0 ? true : false,
            questions: result.questions,
            answers: answerIdddd,
            questionId: questionIdddd,
            isLoaded: false,
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
    const { questions, isCompanySubAdminSubmit, isQuestionAvailable, isNextTab } =
      this.state;
    let role = JSON.parse(localStorage.getItem("currentUser")).data.role;
    return (
      <div>
        {/* <div className="row setup-content" id="#step-9"> */}
        <Header />
        <Sidebar dataFromParent={this.props.location.pathname} />
        {this.state.isLoaded === true && <Loader />}
        {this.state.isLoaded === false && (
          <div className="main_wrapper">
            <DyanamicTabs parentCallback={this.handleCallback} />
            <div className="inner_wraapper pt-0">
              <div className="container-fluid">
                <section className="d_text">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="Introduction framwork_2">
                          <div className="col-md-12">
                            {isQuestionAvailable && (
                              <form onSubmit={this.handleSubmit}>
                                <h4 className="E_capital font-heading font-increase">Environmental Capital</h4>
                                <div className="manag">
                                  {questions.map((item, key) => (
                                    <div key={key}>
                                      <div className="heading_h3 mt-3">
                                        {item.heading && (
                                          <span className="gement">
                                            {item.heading}
                                          </span>
                                        )}
                                      </div>

                                      <div className="form-group">
                                        <label
                                          htmlFor="floatingTextarea"
                                          className="energy mb-3"
                                        >
                                          {item.title}
                                        </label>
                                        <textarea
                                          className="form-control"
                                          name={"answers" + key}
                                          required
                                          placeholder="Leave a comment here"
                                          onChange={(event) =>
                                            this.handleChange(
                                              key,
                                              event,
                                              item.id
                                            )
                                          }
                                          in="true"
                                          defaultValue={item.answer}
                                        ></textarea>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="global_link mt-4">
                                    <span className="">
                                      <a
                                        className="link_bal_next"
                                        onClick={this.goToPreviousPath}
                                      >
                                        Back
                                      </a>
                                    </span>
                                    <span className="global_link">
                                      {isCompanySubAdminSubmit && (
                                        <button
                                          className="new_button_style"
                                          type="submit"
                                        >
                                          Next
                                        </button>
                                      )}
                                      {!isCompanySubAdminSubmit &&
                                        role === "company_sub_admin" && (
                                          <NavLink
                                            className="new_button_style"
                                            to={isNextTab}
                                          >
                                            Next
                                          </NavLink>
                                        )}
                                      {role === "company_admin" && (
                                        <button
                                          className="new_button_style"
                                          type="submit"
                                        >
                                          Next
                                        </button>
                                      )}
                                    </span>
                                    {/* )} */}
                                  </div>
                                </div>
                              </form>
                            )}

                            {!isQuestionAvailable && (
                              <>
                                <h2>No questions here</h2>
                                <div className="global_link mt-4">
                                  <span className="">
                                    <a
                                      className="link_bal_next"
                                      onClick={this.goToPreviousPath}
                                    >
                                      Back
                                    </a>
                                  </span>
                                  <span className="global_link">
                                    {isNextTab && (
                                      <NavLink
                                        className="new_button_style"
                                        to={isNextTab}
                                      >
                                        Next
                                      </NavLink>
                                    )}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
