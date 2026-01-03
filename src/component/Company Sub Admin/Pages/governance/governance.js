/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { Button, Modal } from "semantic-ui-react";
import config from "../../../../config/config.json";

export default class governance extends Component {
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
                              <h5 className="governance_head font-heading">Introduction
                                {/* <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span> */}
                              </h5>
                            </div>
                            <div className="row">
                              <div className="col-xxl-12 col-lg-12 col-md-12 col-12">
                                <p className="governance_p">
                                  Good governance starts with understanding how a business gets run, which policies and procedures are followed and who is accountable. The purpose of this governance module is to provide a comprehensive review of existing administrative and governance policies. This process outlines various policies that can impact your ESG performance as a business. Not all policies are appropriate for each business and may have a different name or title.
                                </p>
                                <div className="reviewed">
                                  <div className="reviewed_ones">
                                    <h4 className="reviewed_h">
                                      Follow the below-mentioned process to understand if a policy should be uploaded and reviewed.
                                    </h4>
                                    <p className="policy">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Determine whether a policy is still needed or if it should be combined with another administrative policy;
                                    </p>
                                    <p className="policy">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Determine whether the purpose and goal of the policy are still being met;
                                    </p>
                                    <p className="policy">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Determine whether changes are required to improve the effectiveness or clarity of the policy and procedures;
                                    </p>

                                    <p className="policy">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Ensure appropriate education, monitoring and review of the policy occurs.
                                    </p>
                                    {/* <p className="policy">
                                      <span className="policy_icon">
                                        <i className="fal fa-chevron-right"></i>
                                      </span>
                                      Ensure appropriate education, monitoring and review of the policy occurs.
                                    </p> */}
                                  </div>
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
                          <div className="succeed border_box p-5">
                            <div className="succeed_text">
                              <p className="succeed_one mt-3">
                                <span className="without_icon">
                                  <i className="fas fa-quote-left"></i>
                                </span>
                                Today, no business can succeed without conforming to financial reporting standards. The same should be true for non-financial reporting, with equivalent levels of governance, assurance, incentives and sanctions for non-compliance.
                              </p>
                              <p className="Mortiz fw-bold">
                                - Bob Moritz, Global Chairman, PwC
                              </p>
                            </div>
                          </div>
                          <div className="save_Governance">
                            <span className="global_link mx-0">
                              <NavLink
                                to="/governance_policies"
                                className="link_bal_next"
                              >
                                next
                              </NavLink>
                            </span>
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
