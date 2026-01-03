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



export default class management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      title: [],
      video_link: [],
      condition: false
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
                            <div className="d-flex justify-content-between mb-3">
                              <h5 className="governance_head font-heading">Introduction
                                {/* <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span> */}
                              </h5>
                              <div className="form_x mb-3">
                                {currentUser.data.role !==
                                  "company_sub_admin" && (
                                    <AssignSubAdminComponent tableName="board_skills" />
                                  )}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xxl-12 col-lg-12 col-md-12 col-12">
                                <div className="bord_enb">
                                  <p>
                                    A range of skills is mandatory for a business’s survival and growth.
                                  </p>
                                </div>
                                <p className="suppliers_gover mt-3">
                                  If you are a <span style={{ fontWeight: "800" }} >small business owner</span>, you will likely be called upon to execute several roles out of necessity. Interestingly, you will find that you are well suited to some positions and can discharge them better than others. For the growth of your business, it becomes imperative that these skills be enhanced and extended. The right mix of people supplements and strengthens your business, so it is vital to get it right. An effective management team assists create a more competent and accomplished company.
                                </p>
                              </div>
                              <Modal open={this.state.setOpen} className="feedback2 feedback3 iframe_modal">
                                <Modal.Header>{title}</Modal.Header>
                                <div className="video_esg">
                                  <iframe src={video_link} allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
                                </div>
                                <Modal.Actions>
                                  <Button className="mx-3" onClick={() => this.onClose(false)}>
                                    Close
                                  </Button>
                                </Modal.Actions>
                              </Modal>
                              <div className="bord_enb mt-4">
                                <p>
                                  For a <span style={{ fontWeight: "800" }} >larger organisation, </span> each management team member can focus on their area of expertise.
                                </p>
                              </div>
                              <div className="mt-3">
                                <div className="Assessment_ones">
                                  <p className="experience_and">
                                    <span className="policy_icon">
                                      <i className="fal fa-chevron-right"></i>
                                    </span>
                                    With the advent of globalisation, the world has become a melting pot of cultures. The movement of people for work has put increasing focus on a diverse workforce necessitating a paradigm shift in the recruitment strategies of a company. It has compelled management teams to embrace Diversity, Equity and Inclusion (DEI) in their ranks because of increased social justice pressure from investors, boards, media and society.
                                  </p>
                                  <p className="experience_and">
                                    <span className="policy_icon">
                                      <i className="fal fa-chevron-right"></i>
                                    </span>
                                    It is good governance for a company to create a skills matrix about its executive leadership team. A skills matrix identifies the skills, knowledge, experience and capabilities desired of an executive leadership group to enable it to meet both the current and future challenges of your business. The creation of a leadership skills matrix is an opportunity for considered reflection and productive discussion on how the leadership team is structured currently and also how it believes it should be best placed in the future to execute our organisational strategy.
                                  </p>
                                  <p className="experience_and">
                                    <span className="policy_icon">
                                      <i className="fal fa-chevron-right"></i>
                                    </span>
                                    Dedicating time annually with your leadership team to cultivate diverse thoughts about the future direction and impacts on the business. Make sure to spend some time with this team to create the ‘head-space’ to work <span className="font-italic">on</span> the business and not <span className="font-italic">in</span> the business.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="global_link mt-4">
                            <NavLink
                              to="/management_details"
                              className="link_bal_next"
                            >
                              NEXT
                            </NavLink>
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
