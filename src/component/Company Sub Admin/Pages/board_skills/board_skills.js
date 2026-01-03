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

export default class board_skills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      condition: false,
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
                                <p className="suppliers_gover">
                                  It is good governance for a company to create a skills matrix concerning its board of directors. A skills matrix identifies the skills, knowledge, experience and capabilities desired of the board, enabling it to meet the current and future challenges of the entity. The creation of a board skills matrix is an opportunity for considered reflection and productive discussion on how the board of directors gets constituted currently and how it believes it should best be constituted in the future to align with the entity’s strategic objectives.
                                </p>
                                <div className="bord_enb mt-4">
                                  <h4 className="exis_skills">
                                    Identifying the existing skills on the board
                                  </h4>
                                </div>
                                <div className="mt-3">
                                  <div className="Assessment_ones">
                                    <h4 className="ident">
                                      A skills matrix identifies:
                                    </h4>
                                    <p className="experience_and">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      The current skills, knowledge, experience and capabilities of the board, and
                                    </p>
                                    <p className="experience_and">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Any gaps in skills or competencies that can be addressed in future director appointments.
                                    </p>
                                    <p className="experience_and">
                                      A company needs to consider possible approaches undertaken to identify the existing skills and competencies on the board.
                                    </p>
                                  </div>
                                </div>
                                <div className="Assessment_two">
                                  <div className="Assessment_ones">
                                    <h4 className="ssess_h">
                                      These may include the following:
                                    </h4>
                                    <p className="experience_and">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      With the chair’s assistance, the company secretary may review the competencies and experience of each board member, with the chair making an initial assessment of the existing skills for review by the board.
                                    </p>
                                    <p className="experience_and">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Each director may be supplied with a questionnaire asking them to self-assess and identify their competencies, skills and experience.
                                    </p>
                                    <p className="experience_and">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      The nomination committee may review and assess the competencies and skills of each board member, either following completion of a questionnaire by each director or by some other method. The nomination committee could be charged with ongoing oversight of the process of board composition and renewal.
                                    </p>
                                  </div>
                                </div>
                                <div className="global_link mt-4">
                                  <NavLink
                                    to="/board_skills_detail"
                                    className="link_bal_next"
                                  >
                                    NEXT
                                  </NavLink>
                                </div>
                              </div>
                              <Modal open={this.state.setOpen} className="feedback2 feedback3 iframe_modal">
                                <Modal.Header>{title}</Modal.Header>
                                <div className="video_esg">
                                  <iframe src={video_link}></iframe>
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
