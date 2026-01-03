/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import AssignSubAdminComponent from "../SmallComponents/assignSubAdmin";
import { authenticationService } from "../../../../_services/authentication";
import { Button, Modal } from "semantic-ui-react";
import config from "../../../../config/config.json";

const currentUser = authenticationService.currentUserValue;
export default class supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      description: "",
      title: [],
      video_link: [],
    };
  }
  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }
  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "password" ? "input" : "password"
    });
  }

  onClose() {
    this.setState({
      setOpen: false
    });
  }
  setOpen(event) {
    this.setState({
      setOpen: true
    });
  }
  componentDidMount() {
    let uri = window.location.pathname.split("/");
    let category = uri[1];
    fetch(config.API_URL + `getIntroductionVideosbyLink/${category}?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            title: (result.introductionVideo.length > 0) ? result.introductionVideo[0].title : '',
            video_link: (result.introductionVideo.length > 0) ? result.introductionVideo[0].video_link : '',
          });
        },

        (error2) => {
          this.setState({
            isLoaded2: true,
            error2,
          });
        }
      );
  }
  render() {
    const { title, video_link } = this.state
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
                      <div className="governance">
                        <div className="text_Parts">
                          <div className="text_governance">
                            <div className="d-flex justify-content-between pb-4">
                              <h4 className="governance_head font-heading">Introduction
                                {/* <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span> */}
                              </h4>
                              <div className="form_x mb-3">
                                {currentUser.data.role === "company_admin" && (
                                  <AssignSubAdminComponent tableName="supplier" />
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-xxl-12 col-lg-12 col-md-12 col-12">
                                <p className="suppliers_p">
                                  Today, an estimated 80% of global trade passes through supply chains. Outsourcing production to suppliers in countries with a cost advantage can deliver significant economic benefits and at the same time expose one to various reputational and operational risks.
                                </p>
                                <p className="suppliers_t">
                                  An appropriate supply chain management system involves measurement, verification and reporting against these risks. Codes of conduct in supplier contracts and incentive structures can improve awareness and performance. Furthermore, collaboration with industry peers, civil society and regulatory authorities is significant in effectively managing existing and emerging ESG supply chain risks.
                                </p>
                                <div className="Identified">
                                  <h4 className="Identified_text">
                                    Identified ESG risks in supply chains
                                  </h4>
                                  <p className="chains">
                                    Traditional key considerations in supply chains include technical quality, cost-effectiveness, speed of delivery and reliability. However, sustainability factors are increasingly gaining importance.
                                  </p>
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
                                      Shortages of raw materials and natural resources
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
                                <div className="suppli">
                                  <div className="suppli_one mb-4">
                                    <p className="suppli_two">
                                      Fill in the following report based on your review of all your suppliers.
                                    </p>
                                  </div>
                                </div>
                                <div className="save_Governance">
                                  <span className="global_hell">
                                    <NavLink
                                      className="link_bal_next"
                                      to="/suppliers_fast"
                                    >
                                      Next
                                    </NavLink>
                                  </span>
                                </div>
                              </div>
                              <Modal open={this.state.setOpen} className="feedback2 feedback3 iframe_modal">
                                <Modal.Header>{title}</Modal.Header>
                                <div className="video_esg">
                                  <iframe src={video_link} frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"></iframe>
                                </div>
                                <Modal.Actions>
                                  <Button className="mx-3" onClick={() => this.onClose(false)}>
                                    Close
                                  </Button>
                                </Modal.Actions>
                              </Modal>
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
