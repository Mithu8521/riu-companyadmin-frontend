import "./esg_reporting_pie.css";
import { authenticationService } from "../../../_services/authentication";
import config from "../../../config/config.json";
import React, { Component } from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { NavLink } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import enviornment from "../../../../src/img/graph/enviornment.png";
import EnviornmentHover from "../../../../src/img/graph/enviornment_hover.png";
import SocialCapital from "../../../../src/img/graph/SocialCapital.png";
import SocialCapitalHover from "../../../../src/img/graph/socialCapital_hover.png";
import LeadershipGovernance from "../../../../src/img/graph/Leadership&Governance.png";
import LeadershipGovernanceHover from "../../../../src/img/graph/LeadershipGovernance_hover.png";
import HumanCapital from "../../../../src/img/graph/HumanCapital.png";
import HumanCapitalHover from "../../../../src/img/graph/HumanCapitalHover.png";
import BusinessModel from "../../../../src/img/graph/BusinessModalInnovation.png";
import BusinessModelHover from "../../../../src/img/graph/BusinessModelHover.png";
import CyberDigital from "../../../../src/img/graph/CyberAndDigital.png";
import CyberDigitalHover from "../../../../src/img/graph/CyberDigitalHover.png";

const currentUser = authenticationService.currentUserValue;

export default class esg_reporting_pie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: props.location,
      show: false,
      close: false,
      frameworIsUsedVar: [],
      environmentVar: [],
      socialCapitalVar: [],
      leadershipAndGovernanceVar: [],
      humanCapitalVar: [],
      cyberAndDigitalVar: [],
      businessModelAndInnovationVar: [],
    };
  }
  componentDidMount() {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawData: "10" }),
    };

    fetch(config.API_URL + `getEsgGraphData?current_role=${localStorage.getItem("role")}`, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            frameworIsUsedVar: result.frameworIsUsedVar,
            environmentVar: result.environmentVar,
            socialCapitalVar: result.socialCapitalVar,
            leadershipAndGovernanceVar: result.leadershipAndGovernanceVar,
            humanCapitalVar: result.humanCapitalVar,
            cyberAndDigitalVar: result.cyberAndDigitalVar,
            businessModelAndInnovationVar: result.businessModelAndInnovationVar,
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

  submitApi = (e, data) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `updateEsgFinalData?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          //answersss  answersss[0]?.frameworksUsed.split(",")
        },
        (error) => {
          this.setState({
            isLoaded3: true,
            error,
          });
        }
      );
  };

  render() {
    const {
      environmentVar,
      socialCapitalVar,
      leadershipAndGovernanceVar,
      humanCapitalVar,
      cyberAndDigitalVar,
      businessModelAndInnovationVar,
    } = this.state;
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
                      <div className="color_div_on framwork_2">
                        {/* <div id="chartdiv"></div> */}
                        <div className="chartdiv my-5">
                          {/*className="image1"*/}
                          <div className="">
                            <div className="graph">
                              {/* <span id="enviornment" className="enviornmentt">
                              <img
                                src={enviornment}
                                alt=""
                                className="imgIndex"
                              />
                              <div
                                id="EnviornmentImg"
                                className="div1"
                                // style={{ display: "none" }}
                              >
                                <img src={EnviornmentHover} alt="" />
                                <div className="Data">
                                  <div className="env-l">
                                    <h4>Environment</h4>
                                    {environmentVar.map((item, key) => (
                                      <h6 key={key}>{item.description}</h6>
                                    ))}
                                  </div>x
                                </div>
                              </div>
                            </span> */}
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="chart-de">
                                  <span
                                    id="enviornment"
                                    className="enviornmentt"
                                  >
                                    <img
                                      src={enviornment}
                                      alt=""
                                      className="imgIndex"
                                    />
                                    <div
                                      id="EnviornmentImg"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img src={EnviornmentHover} alt="" />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Environment</h4>
                                      {environmentVar.map((item, key) => (
                                        <h6 key={key}>{item.description}</h6>
                                      ))}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                  <span
                                    id="social_capital"
                                    className="social_capital"
                                  >
                                    <img
                                      src={SocialCapital}
                                      alt=""
                                      className=""
                                    />
                                    <div
                                      id="SocialCapital"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img src={SocialCapitalHover} alt="" />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Social Capital</h4>
                                      {socialCapitalVar.map((item, key) => (
                                        <h6 key={key}>{item.description}</h6>
                                      ))}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                  <span
                                    id="leadership_governance"
                                    className="leadership_governance"
                                  >
                                    <img
                                      src={LeadershipGovernance}
                                      alt=""
                                      className="imgIndex"
                                    />
                                    <div
                                      id="LeadershipGovernance"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img
                                        src={LeadershipGovernanceHover}
                                        alt=""
                                      />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Leadership And Governance</h4>
                                      {leadershipAndGovernanceVar.map(
                                        (item, key) => (
                                          <h6 key={key}>{item.description}</h6>
                                        )
                                      )}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                  <span
                                    id="human_capital"
                                    className="human_capital"
                                  >
                                    <img
                                      src={HumanCapital}
                                      alt=""
                                      className="imgIndex"
                                    />
                                    <div
                                      id="HumanCapital"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img src={HumanCapitalHover} alt="" />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Human Capital</h4>
                                      {humanCapitalVar.map((item, key) => (
                                        <h6 key={key}>{item.description}</h6>
                                      ))}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                  <span
                                    id="bussiness_model"
                                    className="bussiness_model"
                                  >
                                    <img
                                      src={BusinessModel}
                                      alt=""
                                      className="imgIndex"
                                    />
                                    <div
                                      id="BusinessModel"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img src={BusinessModelHover} alt="" />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Business Model And Innovation</h4>
                                      {businessModelAndInnovationVar.map(
                                        (item, key) => (
                                          <h6 key={key}>{item.description}</h6>
                                        )
                                      )}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                  <span
                                    id="cyber_Digital"
                                    className="cyber_Digital"
                                  >
                                    <img
                                      src={CyberDigital}
                                      alt=""
                                      className="imgIndex"
                                    />
                                    <div
                                      id="CyberDigital"
                                      className="div1"
                                      style={{ display: "none" }}
                                    >
                                      <img src={CyberDigitalHover} alt="" />
                                      {/* <div className="Data">
                                    <div className="env-l">
                                      <h4>Cyber And Digital</h4>
                                      {cyberAndDigitalVar.map((item, key) => (
                                        <h6 key={key}>{item.description}</h6>
                                      ))}
                                    </div>
                                  </div> */}
                                    </div>
                                  </span>
                                </div>
                              </div>
                              <div className="col-xxl-6 col-lg-12 col-md-12 col-12">
                                <div className="graph_padding">
                                  <span className="">
                                    {/*className="div2"*/}
                                    <div className="">
                                      <Table bordered className="graphTable">
                                        <tbody>
                                          <tr style={{ color: "#ffffff" }}>
                                            <td style={{ background: "#7bcaab" }}>
                                              <h5 className="mb-4">
                                                <b>Cyber And Digital</b>
                                              </h5>
                                              {cyberAndDigitalVar.map(
                                                (item, key) => (
                                                  <ul>
                                                    <li key={key}>
                                                      {item.description}
                                                    </li>
                                                  </ul>
                                                )
                                              )}
                                            </td>
                                            <td style={{ background: "#233076" }}>
                                              <h5 className="mb-4">
                                                <b>Environment</b>
                                              </h5>
                                              {environmentVar.map((item, key) => (
                                                <ul>
                                                  <li key={key}>
                                                    {item.description}
                                                  </li>
                                                </ul>
                                              ))}
                                            </td>
                                          </tr>
                                          <tr style={{ color: "#ffffff" }}>
                                            <td style={{ background: "#42bfad" }}>
                                              <h5 className="mb-4">
                                                <b>
                                                  Business Model &amp; Innovation
                                                </b>
                                              </h5>
                                              {businessModelAndInnovationVar.map(
                                                (item, key) => (
                                                  <ul>
                                                    <li key={key}>
                                                      {item.description}
                                                    </li>
                                                  </ul>
                                                )
                                              )}
                                            </td>
                                            <td style={{ background: "#19619c" }}>
                                              <h5 className="mb-4">
                                                <b>Social Capital</b>
                                              </h5>
                                              {socialCapitalVar.map(
                                                (item, key) => (
                                                  <ul>
                                                    <li key={key}>
                                                      {item.description}
                                                    </li>
                                                  </ul>
                                                )
                                              )}
                                            </td>
                                          </tr>
                                          <tr style={{ color: "#ffffff" }}>
                                            <td style={{ background: "#05b49d" }}>
                                              <h5 className="mb-4">
                                                <b>Human Capital</b>
                                              </h5>
                                              {humanCapitalVar.map(
                                                (item, key) => (
                                                  <ul>
                                                    <li key={key}>
                                                      {item.description}
                                                    </li>
                                                  </ul>
                                                )
                                              )}
                                            </td>
                                            <td style={{ background: "#41c7ed" }}>
                                              <h5 className="mb-4">
                                                <b>Leadership And Governance</b>
                                              </h5>
                                              {leadershipAndGovernanceVar.map(
                                                (item, key) => (
                                                  <ul>
                                                    <li key={key}>
                                                      {item.description}
                                                    </li>
                                                  </ul>
                                                )
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="save_global global_link">
                          <NavLink
                            to="/esg_reporting"
                            className="link_bal_next"
                            href="ESG_Reporting_two.html"
                          >
                            Edit
                          </NavLink>
                          <button
                            className="page_save page_width mx-3"
                            variant="none"
                            onClick={() => this.setState({ show: true })}
                          >

                            Confirm
                          </button>
                        </div>
                        <Modal
                          show={this.state.show}
                          animation={true}
                          size="md"
                          className="modal_box"
                          shadow-lg="border"
                        >
                          <div className="modal-md">
                            <Modal.Header className="pb-0">
                              {/* <h5 className="modal-title" id="exampleModalLabel"></h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                              <Button
                                variant="outline-dark"
                                onClick={() => this.setState({ show: false })}
                              >
                                <i className="fa fa-times"></i>
                              </Button>
                            </Modal.Header>
                            <div className="modal-body vekp pt-0">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="response">
                                    <h4>Response Saved!</h4>
                                    <p className="text-center my-3">
                                      To download your ESG Risk Report please
                                      complete the Sector Questions and download
                                      at the completion of that module.
                                    </p>
                                    <div className="global_link">
                                      <NavLink
                                        className="page_save page_width"
                                        to={"Social_Capital"}
                                      >
                                        go to sector questions
                                      </NavLink>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal>
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
