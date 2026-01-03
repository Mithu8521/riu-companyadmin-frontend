/* eslint-disable jsx-a11y/anchor-is-valid */
import { NavLink } from "react-router-dom";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import axios from "axios";
import React, { Component } from "react";
import config from "../../../../config/config.json";
import { Button, Modal } from "react-bootstrap";
import { authenticationService } from "../../../../_services/authentication";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import Tick from "../../../../img/tick.png";
import Loader from "../../../loader/Loader";
import DyanamicTabs from "./dyanamicTabs";

const currentUser = authenticationService.currentUserValue;

export default class BusinessModel extends Component {
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
      isEditableOrNot: false,
      show: false,
      close: false,
      esgDataFoundOrNot: false,
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
    childData.forEach((element) => {
      if (element.uri === "/" + uri) {
        nextTab = "/";
        this.setState({
          isNextTab: nextTab,
        });
      }
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
    let businessModelids = {};
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
    businessModelids.data = finalArr;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.OLD_API_URL + `businessModelAndInnovation?`,
        {
          businessModelids: businessModelids,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert('success', response.data[0].message)
        setTimeout(() => {
          const newLocal = "/sector_question_detail";
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
    fetch(config.API_URL + `getBusinessModelAndInnovationAnswers?current_role=${localStorage.getItem("role")}`, { headers })
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
            isEditableOrNot: result.insertOrUpdate,
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

    fetch(config.OLD_API_URL + `esgReportingDataCheck?current_role=${localStorage.getItem("role")}`, {
      headers,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            esgDataFoundOrNot: result.data,
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
    const {
      esgDataFoundOrNot,
      questions,
      isEditableOrNot,
      isQuestionAvailable,
    } = this.state;
    let buttons;
    if (isEditableOrNot && esgDataFoundOrNot) {
      buttons = (
        <button
          style={{
            borderRadius: "8px",
            color: "#ffffff",
          }}
          className="page_save page_width mr-3"
          type="submit"
        >

          GENERATE REPORT
        </button>
      );
    }

    if (!isEditableOrNot && esgDataFoundOrNot) {
      buttons = (
        <a
          style={{
            borderRadius: "8px",
            color: "#ffffff",
            opacity: "0.6",
          }}
          className="page_save page_width mx-3"
        >

          GENERATE REPORT
        </a>
      );
    }

    return (
      <div>
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
                          {/* <div className="row setup-content" id="step-12"> */}
                          <div className="col-md-12">
                            {isQuestionAvailable && (
                              <form onSubmit={this.handleSubmit}>
                                <h4 className="E_capital font-heading">
                                  Business Model & Innovation
                                </h4>
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
                                          className="energy mb-3 font-increase"
                                        >
                                          {item.title}
                                        </label>
                                        <textarea
                                          className="form-control"
                                          name={"answers" + key}
                                          required
                                          placeholder="Leave a Answer here"
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
                                  <div className="global_link mx-0 my-4 three_buttons button_business_modal">
                                    <span className="">
                                      <a
                                        className="link_bal_next mr-3"
                                        onClick={this.goToPreviousPath}
                                      >
                                        Back
                                      </a>
                                    </span>

                                    {buttons}

                                    {esgDataFoundOrNot && (
                                      <a
                                        className="page_save page_width button_disable mr-3"
                                        type="button"
                                      >
                                        Update ESG Reporting
                                      </a>
                                    )}
                                    {!esgDataFoundOrNot && (
                                      <NavLink
                                        to="/esg_reporting"
                                        className="page_save page_width mr-3"
                                        type="button"
                                      >
                                        Update ESG Reporting
                                      </NavLink>
                                    )}
                                  </div>
                                  <Modal
                                    show={this.state.show}
                                    animation={true}
                                    size="md"
                                    className="modal_box"
                                    shadow-lg="border"
                                  >
                                    <div className="modal-lg">
                                      <Modal.Header className="pb-0">
                                        <Button
                                          variant="outline-dark"
                                          onClick={() =>
                                            this.setState({ show: false })
                                          }
                                        >
                                          <i className="fa fa-times"></i>
                                        </Button>
                                      </Modal.Header>
                                      <div className="modal-body vekp pt-0">
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="response">
                                              <span className="mb-3">
                                                <img src={Tick} alt="" />
                                              </span>
                                              <h4>
                                                We have received your
                                                submission!
                                              </h4>
                                              <p className="text-center my-3">
                                                The report will be uploaded
                                                within next 48 hours.
                                              </p>
                                              <p className="red">
                                                *The report is only downloadable
                                                once ESG Reporting section is
                                                complete.
                                              </p>
                                              <div className="global_link d-flex flex-column justify-content-center">
                                                <NavLink
                                                  className="page_save page_width"
                                                  to="/sector_question_detail"
                                                >
                                                  Already Updated!
                                                </NavLink>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>
                                </div>
                              </form>
                            )}
                            {!isQuestionAvailable && (
                              <>
                                <h2>No Questions here</h2>
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
                                    <NavLink
                                      className="new_button_style"
                                      to={"/sector_question_detail"}
                                    >
                                      Next
                                    </NavLink>
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
