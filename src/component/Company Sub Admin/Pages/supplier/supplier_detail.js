import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./supplier_details.css";

import { authenticationService } from "../../../../_services/authentication";
import { sweetAlert } from '../../../../utils/UniversalFunction';
import config from "../../../../config/config.json";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { saveAs } from "file-saver";
import { MutlipleSelect } from "../../Component/Supplier/MutlipleSelect";
const currentUser = authenticationService.currentUserValue;

export default class supplier_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      isLoaded2: false,
      items: [],
      answers: [],
      submitted: false,
      supplyChainFirstQuestion:
        "What is the current nature of relationships between our company and our suppliers?",
      supplyChainSecondQuestion:
        "To what extent does our company audit our supply chains?",
      supplyChainThirdQuestion:
        "Which existing supply chain policies are in place?",
      supplyChainFourthQuestion:
        "How many tiers are there in your supply chain?",
      supplyChainFifthQuestion:
        "What is the transparency level of your supplier?",

      environmentalTopicFirstAnswer: "",
      environmentalTopicSecondAnswer: "",
      environmentalTopicThirdAnswer: "",
      environmentalTopicFourthAnswer: "",
      environmentalTopicFifthAnswer: "",
      environmentalTopicSixthAnswer: "",

      socialTopicFirstAnswer: "",
      socialTopicSecondAnswer: "",
      socialTopicThirdAnswer: "",
      socialTopicFourthAnswer: "",
      socialTopicFifthAnswer: "",

      governanceTopicFirstAnswer: "",
      governanceTopicSecondAnswer: "",
      governanceTopicThirdAnswer: "",
      governanceTopicFourthAnswer: "",
      governanceTopicFifthAnswer: "",

      businessModelFirstAnswer: "",
      businessModelSecondAnswer: "",
      businessModelThirdAnswer: "",
      businessModelFourthAnswer: "",
      businessModelFifthAnswer: "",
      businessModelSixthAnswer: "",
      businessModelSeventhAnswer: "",
    };
    this.handleCallback = this.handleCallback.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
  }


  handleCallback = (childData) => {
  };

  showAlert = () => {
    sweetAlert('info', "The Report will be uploaded within next 48 hours");
  };

  exportCSV(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "downloadReport",
        {
          section_name: 'supplier',
          sub_section: 'supplier',
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        let url = config.BASE_URL + response?.data?.data?.file;
        if (response?.data?.data?.file) {
          saveAs(
            url,
            url
          );
        } else {
          this.showAlert()
        }
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert('error', error.response.data.message);
        }
      });

  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.API_URL + `getSupplierDetails?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            supplyChainFirstAnswer:
              result.data[0]?.currentNature === undefined
                ? ""
                : result.data[0]?.currentNature,
            supplyChainSecondAnswer:
              result.data[0]?.extent === undefined
                ? ""
                : result.data[0]?.extent,
            supplyChainThirdAnswer:
              result.data[0]?.existingSupply === undefined
                ? ""
                : result.data[0]?.existingSupply,
            supplyChainFourthAnswer:
              result.data[0]?.tiers === undefined ? "" : result.data[0]?.tiers,
            supplyChainFifthAnswer:
              result.data[0]?.transparencyLevel === undefined
                ? ""
                : result.data[0]?.transparencyLevel,
          });
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );

    fetch(
      config.API_URL + "getSupplierDetailsForTopics",
      { headers },
      {
        type: "currentNature",
        current_role: localStorage.getItem("role"),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          let finalAnswerForEnvironment = [];
          let finalAnswerForSocialTopic = [];
          let finalAnswerForGovernanceTopic = [];
          let finalAnswerForBusinessModel = [];


          if (result.businessModel.length > 0) {
            finalAnswerForBusinessModel = JSON.parse(result.businessModel[0]?.answer);
          } else {
            finalAnswerForBusinessModel[0] = undefined;
          }

          if (result.governanceTopic.length > 0) {
            finalAnswerForGovernanceTopic = JSON.parse(result.governanceTopic[0]?.answer);
          } else {
            finalAnswerForGovernanceTopic[0] = undefined;
          }

          if (result.environmentalTopic.length > 0) {
            finalAnswerForEnvironment = JSON.parse(result.environmentalTopic[0]?.answer);
          } else {
            finalAnswerForEnvironment[0] = undefined;
          }


          if (result.socialTopic.length > 0) {
            finalAnswerForSocialTopic = JSON.parse(result.socialTopic[0]?.answer);
          } else {
            finalAnswerForSocialTopic[0] = undefined;
          }

          this.setState({
            isLoaded: true,
            environmentalTopicFirstAnswer:
              finalAnswerForEnvironment[0]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[0].answer,
            environmentalTopicSecondAnswer:
              finalAnswerForEnvironment[1]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[1].answer,
            environmentalTopicThirdAnswer:
              finalAnswerForEnvironment[2]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[2].answer,
            environmentalTopicFourthAnswer:
              finalAnswerForEnvironment[3]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[3].answer,
            environmentalTopicFifthAnswer:
              finalAnswerForEnvironment[4]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[4].answer,
            environmentalTopicSixthAnswer:
              finalAnswerForEnvironment[5]?.answer === undefined
                ? ""
                : finalAnswerForEnvironment[5].answer,

            socialTopicFirstAnswer:
              finalAnswerForSocialTopic[0]?.answer === undefined
                ? ""
                : finalAnswerForSocialTopic[0].answer,
            socialTopicSecondAnswer:
              finalAnswerForSocialTopic[1]?.answer === undefined
                ? ""
                : finalAnswerForSocialTopic[1].answer,
            socialTopicThirdAnswer:
              finalAnswerForSocialTopic[2]?.answer === undefined
                ? ""
                : finalAnswerForSocialTopic[2].answer,
            socialTopicFourthAnswer:
              finalAnswerForSocialTopic[3]?.answer === undefined
                ? ""
                : finalAnswerForSocialTopic[3].answer,
            socialTopicFifthAnswer:
              finalAnswerForSocialTopic[4]?.answer === undefined
                ? ""
                : finalAnswerForSocialTopic[4].answer,

            governanceTopicFirstAnswer:
              finalAnswerForGovernanceTopic[0]?.answer === undefined
                ? ""
                : finalAnswerForGovernanceTopic[0].answer,
            governanceTopicSecondAnswer:
              finalAnswerForGovernanceTopic[1]?.answer === undefined
                ? ""
                : finalAnswerForGovernanceTopic[1].answer,
            governanceTopicThirdAnswer:
              finalAnswerForGovernanceTopic[2]?.answer === undefined
                ? ""
                : finalAnswerForGovernanceTopic[2].answer,
            governanceTopicFourthAnswer:
              finalAnswerForGovernanceTopic[3]?.answer === undefined
                ? ""
                : finalAnswerForGovernanceTopic[3].answer,
            governanceTopicFifthAnswer:
              finalAnswerForGovernanceTopic[4]?.answer === undefined
                ? ""
                : finalAnswerForGovernanceTopic[4].answer,

            businessModelFirstAnswer:
              finalAnswerForBusinessModel[0]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[0].answer,
            businessModelSecondAnswer:
              finalAnswerForBusinessModel[1]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[1].answer,
            businessModelThirdAnswer:
              finalAnswerForBusinessModel[2]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[2].answer,
            businessModelFourthAnswer:
              finalAnswerForBusinessModel[3]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[3].answer,
            businessModelFifthAnswer:
              finalAnswerForBusinessModel[4]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[4].answer,
            businessModelSixthAnswer:
              finalAnswerForBusinessModel[5]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[5].answer,
            businessModelSeventhAnswer:
              finalAnswerForBusinessModel[6]?.answer === undefined
                ? ""
                : finalAnswerForBusinessModel[6].answer,
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
                      <div className="governance pb-5">
                        <div className="text_Parts">
                          <div className="text_governance">
                            <h5 className="governance_head">Introduction</h5>
                            <p className="suppliers_p">
                              Today, an estimate of 80% of global trade passes
                              through supply chains. Outsourcing production to
                              suppliers in countries with a cost advantage can
                              deliver significant economic benefits, but also
                              introduce a range of reputational and operational
                              risks.
                            </p>
                            <p className="suppliers_t">
                              An appropriate supply chain management system
                              involves measurement, verification and reporting
                              against these risks. Codes of conduct in supplier
                              contracts and incentive structures can improve
                              awareness and eventually performance. Furthermore,
                              collaboration with industry peers, civil society
                              and regulatory authorities is also important to
                              effectively manage existing and emerging ESG
                              supply chain risks.
                            </p>
                            <div className="Identified">
                              <h4 className="Identified_text">
                                Identified ESG risks in supply chains
                              </h4>
                              <p className="chains">
                                Traditional key considerations in supply chains
                                include technical quality, cost effectiveness,
                                speed of delivery and reliability. However,
                                sustainability factors are increasingly gaining
                                importance.
                              </p>
                            </div>
                          </div>
                          <div className="reviewed">
                            <div className="reviewed_ones">
                              <h4 className="include_h">Examples include:</h4>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Environmental pollution
                              </p>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Shortages of raw material and natural resources
                              </p>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Workforce health and safety incidents
                              </p>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Labour disputes
                              </p>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Corruption and bribery
                              </p>
                              <p className="policy">
                                <span className="policy_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Geopolitical considerations
                              </p>
                            </div>
                          </div>

                          <div className="global_link download_report">
                            <button
                              onClick={this.exportCSV}
                              className="next_page_one"
                              title="The Report will be uploaded within next 48 hours"
                              data-toggle="tooltip"
                              data-placement="top"
                              type="button"
                            >
                              <span className="Download_r">
                                <i className="fa fa-download"></i>
                              </span>
                              Download Report
                            </button>
                            <NavLink className="" to="/suppliers_fast">
                              <button
                                className="re-submit mx-3"
                                type="button"
                              >
                                Re-submit responses
                              </button>
                            </NavLink>


                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="governance pb-5">
                        <div className="text_Parts">
                          <div className="back_doll">
                            <div className="supply_chain">
                              <h4 className="critical_h">
                                Good supply chain management involves four
                                critical management components:
                              </h4>
                            </div>
                            <div className="google_sup">
                              <div className="sup_can">
                                <div className="four_div">
                                  <div className="four_text">
                                    <h4 className="as_usual">
                                      Fit for purpose
                                    </h4>
                                    <p className="operating_m">
                                      Are the actions you're undertaking fit for
                                      purpose, adapted to the recipients and
                                      prioritised to meet our supplier
                                      management strategy?
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 2 --> */}
                                <div className="four_div">
                                  <div className="four_text_one">
                                    <h4 className="as_usual">
                                      Business-as-usual
                                    </h4>
                                    <p className="operating_m">
                                      Can managment of suppliers and supplier
                                      ESG risks be embedded into your operating
                                      model and management controls?
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 3 --> */}
                                <div className="four_div">
                                  <div className="four_text_two">
                                    <h4 className="as_usual">
                                      A balanced approach
                                    </h4>
                                    <p className="operating_m">
                                      Do not disincentivise partners or
                                      suppliers to do
                                      <br /> business with our organisation.
                                    </p>
                                  </div>
                                </div>
                                {/* <!-- 4 --> */}
                                <div className="four_div">
                                  <div className="four_text_there">
                                    <h4 className="as_usual">
                                      Risk based due-dilligence
                                    </h4>
                                    <p className="operating_m">
                                      Undertaking activities in countries
                                      considered 'high-risk modern slavery
                                      geographies'
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Buying high-risk goods & services
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Engaging with high-risk sectors
                                    </p>
                                    <p className="high_risk">
                                      <span className="high_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Engaging in vulnerable populations
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="home_risck pb-0">
                            <div className="row">
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one fw-bold">
                                    {this.state.supplyChainFirstQuestion}
                                  </label>
                                  <textarea
                                    readOnly
                                    className="form-control text_w"
                                    defaultValue={
                                      this.state.supplyChainFirstAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one fw-bold">
                                    {this.state.supplyChainSecondQuestion}
                                  </label>
                                  <textarea
                                    readOnly
                                    className="form-control text_w"
                                    defaultValue={
                                      this.state.supplyChainSecondAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one fw-bold">
                                    {this.state.supplyChainThirdQuestion}
                                  </label>
                                  <textarea
                                    readOnly
                                    className="form-control text_w"
                                    defaultValue={
                                      this.state.supplyChainThirdAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one fw-bold">
                                    {this.state.supplyChainFourthQuestion}
                                  </label>
                                  <textarea
                                    readOnly
                                    className="form-control text_w"
                                    defaultValue={
                                      this.state.supplyChainFourthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one fw-bold">
                                    {this.state.supplyChainFifthQuestion}
                                  </label>
                                  <br />
                                  <select
                                    readOnly
                                    className="select_one"
                                    value={this.state.supplyChainFifthAnswer}
                                  >
                                    <option>
                                      {this.state.supplyChainFifthAnswer}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="governance pb-0">
                        <div className="four_box_text">
                          <div className="Environmental">
                            <h4 className="Environmental_text">
                              Environmental Topics
                            </h4>
                          </div>
                          <div className="home_risckq">
                            <div className="row">
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers in an industry with high
                                    GHG Emissions?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.environmentalTopicFirstAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier track, report, and manage
                                    their Energy Management?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.environmentalTopicSecondAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier track, report, and manage
                                    their Water Management?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.environmentalTopicThirdAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers in an industry that
                                    engages with Chemical & Hazardous Material
                                    Management?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.environmentalTopicFourthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier track, report, and manage
                                    their Waste Management?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.environmentalTopicFifthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers involved in any Other
                                    Ecological impact?
                                  </label>
                                  <br />
                                  {this.state.environmentalTopicSixthAnswer.length > 0 && (
                                    <MutlipleSelect parentCallback={this.handleCallback} sixthAnswer={this.state.environmentalTopicSixthAnswer} options={this.state.environmentalTopicSixthAnswer} />
                                  )}
                                </div>
                              </div>
                            </div>
                            <hr className="imact_yum m-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="governance pb-0">
                        <div className="four_box_text">
                          <div className="Environmental">
                            <h4 className="Environmental_text">
                              Social Topics
                            </h4>
                          </div>
                          <div className="home_risckq">
                            <div className="row">
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier recognise and report
                                    Human Rights Management?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.socialTopicFirstAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers implementing Career
                                    Management & Training?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.socialTopicSecondAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier have strategies for
                                    Employee Engagement?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.socialTopicThirdAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier employee with Diversity
                                    and Inclusion?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.socialTopicFourthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers maintaining and reporting
                                    their Employee Health & Safety?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.socialTopicFifthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <hr className="imact_yum m-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="governance pb-0 pt-2">
                        <div className="four_box_text">
                          <div className="Environmental">
                            <h4 className="Environmental_text">
                              Governance Topics
                            </h4>
                          </div>
                          <div className="home_risckq">
                            <div className="row">
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier uphold Business Ethics?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.governanceTopicFirstAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier engage in Competitive
                                    Business?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.governanceTopicSecondAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>

                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier have policies regarding
                                    the Management Of The Legal And Regulatory
                                    Environment?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.governanceTopicThirdAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers in an industry that has a
                                    Relationship With Local Authorities And
                                    Communities?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.governanceTopicFourthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <hr className="imact_yum m-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="governance pb-0 pt-2">
                        <div className="four_box_text">
                          <div className="Environmental">
                            <h4 className="Environmental_text">
                              Business Model
                            </h4>
                          </div>
                          <div className="home_risckq">
                            <div className="row">
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier have Product Quality &
                                    Safety testing?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelFirstAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Does your supplier have Product End-of-life
                                    disposing methods?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelSecondAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers engaging in Selling
                                    Practices?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelThirdAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Do your suppliers have Procurement
                                    Management?
                                  </label>
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelFourthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Are your suppliers in an industry with high
                                    Customer Satisfaction?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelFifthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Do your suppliers report Environmental,
                                    Human, & Social Practices?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelSixthAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="form-group bop">
                                  <label className="nature_one">
                                    Do your suppliers have Business Model
                                    Resilience?
                                  </label>
                                  <br />
                                  <textarea
                                    className="form-control text_w"
                                    readOnly
                                    defaultValue={
                                      this.state.businessModelSeventhAnswer
                                    }
                                    rows="3"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <hr className="imact_yum" />
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
