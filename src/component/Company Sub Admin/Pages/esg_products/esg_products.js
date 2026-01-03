/* eslint-disable jsx-a11y/iframe-has-title */
import { sweetAlert } from '../../../../utils/UniversalFunction';
import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

import config from "../../../../config/config.json";
import axios from "axios";
import { Button, Modal } from "semantic-ui-react";

import { authenticationService } from "../../../../_services/authentication";
// import AssignSubAdminComponent from "../SmallComponents/assignSubAdmin";
const currentUser = authenticationService.currentUserValue;

export default class esg_products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      error: null,
      isLoaded: false,
      isLoaded2: false,
      isLoaded3: false,
      items: [],
      answersss: [],
      // selectedUser: [],
      questionsFirst: [],
      questionsSecond: [],
      title: [],
      video_link: [],

      answers: [],
      submitted: false,

      selectedInductry: null,
      selected: [],
      selected2: [],
      selectedUser: [],
      selectedUser2: [],
      isCompanySubAdminSubmit: false,
      isCompanyAdminSubmit: false,
      isEditableOrNot: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
    const { selectedUser, selectedUser2, selectedInductry } = this.state;
    let checkFrameworksUsed = selectedUser.length === 0;
    let checkEnvironment = selectedUser2.length === 0;
    let checkselectedInductry = selectedInductry === "";

    if (checkFrameworksUsed) {
      sweetAlert('error', 'Target Industry you have used at least one checkbox required');
    } else if (checkEnvironment) {
      sweetAlert('error', 'Financial Products at least one checkbox required');
    } else if (checkselectedInductry) {
      sweetAlert('error', 'Selected Industry required');
    } else {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };
      axios
        .post(
          config.OLD_API_URL + "esgProducts",
          {
            targerInductry: this.state.selectedUser,
            selectedInductry: selectedInductry,
            financialProducts: this.state.selectedUser2,
            current_role: localStorage.getItem("role"),
          },
          { headers }
        )
        .then((response) => {
          sweetAlert('success', response.data.message);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert('error', error.response.data.message);
          }
        });
    }
  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    //   Get Answers Api
    fetch(config.API_URL + `getEsgProductAnswerApi?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded3: true,
            selectedInductry:
              result.answers[0]?.selectedInductry === undefined
                ? ""
                : result.answers[0]?.selectedInductry,
            selectedUser:
              result.answers[0]?.targetIndustry.split(",") === undefined
                ? []
                : result.answers[0]?.targetIndustry.split(","),
            selectedUser2:
              result.answers[0]?.financialProducts.split(",") === undefined
                ? []
                : result.answers[0]?.financialProducts.split(","),
            isEditableOrNot: result?.insertOrUpdate,
          });
          //answersss  answersss[0]?.frameworksUsed.split(",")
        },
        (error) => {
          this.setState({
            isLoaded3: true,
            error,
          });
        }
      );

    fetch(config.API_URL + `getEsgProductQuestions?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            questionsFirst: result.targerInductry,
            questionsSecond: result.financialProducts,
          });
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );

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

  handleMultiSelect = (e, data) => {
    // debugger
    const { checked } = e.target;
    if (checked) {
      this.setState({
        selectedUser: [...this.state.selectedUser, data],
      });
    } else {
      let tempuser = this.state.selectedUser?.filter(
        (item) => Number(item) !== Number(data)
      );
      this.setState({
        selectedUser: tempuser,
      });
    }
  };
  handleMultiSelect2 = (e, data) => {
    // debugger
    const { checked } = e.target;
    if (checked) {
      this.setState({
        selectedUser2: [...this.state.selectedUser2, data],
      });
    } else {
      let tempuser2 = this.state.selectedUser2?.filter(
        (item2) => Number(item2) !== Number(data)
      );
      this.setState({
        selectedUser2: tempuser2,
      });
    }
  };

  render() {
    const {
      title,
      video_link,
      questionsFirst,
      questionsSecond,
      selectedUser,
      selectedUser2,
      isEditableOrNot
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
                    <form name="form" onSubmit={this.handleSubmit}>
                      <div className="col-sm-12">
                        <div className="Introductionwe">
                          {/* <div className="d-flex justify-content-between mb-3">
                            <h5 className="governance_head font-heading"> Introduction 
                            <span className='icon_hitn' onClick={(e) => this.setOpen(e)}> <i className="fas fa-video"></i></span>
                            </h5>
                            <div className="form_x mb-3">
                              {currentUser.data.role === "company_admin" && (
                                <AssignSubAdminComponent tableName="esg_products" />
                              )}
                            </div>
                          </div> */}
                          <div className="row">
                            {/* <div className="col-xxl-12 col-lg-12 col-md-12 col-12 text_Parts">
                              <div className="">
                                <p className="products_ava">
                                    Improved ESG performance can introduce a new range of products available to you and your business. Our goal is to not only help you on your ESG strategy and reporting journey but to realise as much benefit by being a part of our ESG community.
                                </p>
                              </div>
                              <div className="our_esg">
                                <h4 className="esg_reali mt-3">
                                    Select any of the below-mentioned products, and we will inform you:
                                </h4>
                                <p className="suppl">
                                    1. If your business has the potential to be a supplier to other organisations on our platform.
                                </p>
                                <p className="suppl mt-2">
                                    2. About any new products or services that are available to your business due to your ESG commitments.
                                </p>
                              </div>
                            </div> */}
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
                          <div className="keep_onel">
                            <div className="report">
                              <h4 className="frameje">Your target industry :</h4>
                            </div>
                            <div className="fremove mt-4">
                              <div className="border_box p-3 mb-3">
                                <div className="row">
                                  {questionsFirst.map((item, key) => (
                                    <div className="col-md-6" key={key}>
                                      <div className="form-check form-check-inline clobal_check input-padding">
                                        <input
                                          className="form-check-input input_one"
                                          type="checkbox"
                                          onChange={(e) =>
                                            this.handleMultiSelect(e, item.id)
                                          }
                                          checked={selectedUser?.some(
                                            (frameworkiuse) =>
                                              Number(frameworkiuse) === item.id
                                          )}
                                          id={"frameworks" + (key + 1)}
                                        />
                                        <label
                                          className="form-check-label label_one"
                                          htmlFor="inlineCheckbox1999"
                                        >
                                          {item.description}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="form_fe">
                                <label className="rellp" htmlFor="email">
                                  Please provide a detailed explanation of how you can provide goods and/or services to your selected industries:
                                </label>
                                <textarea
                                  className="form-control bellpo"
                                  id="exampleFormControlTextarea1"
                                  name="selectedInductry"
                                  onChange={this.handleChange}
                                  defaultValue={this.state.selectedInductry}
                                  rows="3"
                                ></textarea>
                              </div>
                              <div className="e_inter">
                                <div className="eointer">
                                  <h4 className="lease_uop mb-3">
                                    Please select if you have an interest in receiving information from ESG and/or Impact Financial Product providers regarding the following products:
                                  </h4>
                                  <div className="selecti">
                                    <div className="border_box p-3 mb-3">
                                      <div className="row">
                                        {questionsSecond.map((item, key) => (
                                          <div className="col-md-6" key={key}>
                                            <div className="form-check form-check-inline clobal_check input-padding">
                                              <input
                                                className="form-check-input input_one"
                                                type="checkbox"
                                                onChange={(e) =>
                                                  this.handleMultiSelect2(
                                                    e,
                                                    item.id
                                                  )
                                                }
                                                checked={selectedUser2?.some(
                                                  (frameworkiuse) =>
                                                    Number(frameworkiuse) ===
                                                    item.id
                                                )}
                                                id={"frameworks" + (key + 1)}
                                              />
                                              <label
                                                className="form-check-label label_one"
                                                htmlFor="inlineCheckbox1999"
                                              >
                                                {item.description}
                                              </label>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {isEditableOrNot && (
                                      <div className="global_link mx-0">
                                        <button
                                          className="link_bal_next page_width"
                                          type="submit"
                                        >
                                          SUBMIT APPLICATION
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
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
