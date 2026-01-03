import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./carbon_footprint.css";
import Iframe from "react-iframe";
import { Button, Modal } from "semantic-ui-react";
import AssignSubAdminComponent from "../SmallComponents/assignSubAdmin";
import { authenticationService } from "../../../../_services/authentication";
import { ExternalLink } from "react-external-link";
import config from "../../../../config/config.json";
const currentUser = authenticationService.currentUserValue;
export default class carbon_footprint extends Component {
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
            error2
          });
        }
      );
  }
  render() {
    const { title, video_link } = this.state;
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
                    <div className="col-md-12">
                      <div className="requirem">
                        <div className="text_Parts">
                          <div className="">
                            <div className="d-flex justify-content-between mb-3">
                              <h5 className="governance_head font-heading">
                                Introduction
                                {/* <span
                                  className="icon_hitn"
                                  onClick={(e) => this.setOpen(e)}
                                >
                                  {" "}
                                  <i className="fas fa-video"></i>
                                </span> */}
                              </h5>
                              <div className="form_x mb-3">
                                {currentUser.data.role === "company_admin" && (
                                  <AssignSubAdminComponent tableName="carbon_footprint" />
                                )}
                              </div>
                            </div>
                            <Modal
                              open={this.state.setOpen}
                              className="feedback2 feedback3 iframe_modal"
                            >
                              <Modal.Header>{title}</Modal.Header>
                              <div className="video_esg">
                                <Iframe
                                  src={video_link}
                                  allowfullscreen="true"
                                  webkitallowfullscreen="true"
                                  mozallowfullscreen="true"
                                />
                              </div>
                              <Modal.Actions>
                                <Button
                                  className="mx-3"
                                  onClick={() => this.onClose(false)}
                                >
                                  Close
                                </Button>
                              </Modal.Actions>
                            </Modal>
                            <p className="footprint_text">
                              A carbon footprint estimates the total output of
                              greenhouse gas (GHG) emissions caused by an
                              organisation, event, product or person.
                            </p>
                            <p className="footprint_text_one">
                              Calculating your carbon footprint helps set a
                              baseline. Following this up with annual
                              measurements provides you with a consistent and
                              accurate picture of your business. Understanding
                              your carbon footprint will help you understand the
                              activities that result in carbon emissions and
                              then take action to reduce them. In addition to
                              helping the environment, managing your carbon
                              emissions can help you save money, cut
                              reputational risk and create new business
                              opportunities.
                            </p>
                            <div className="I_need_no">
                              <h4 className="I_need">
                                What information do I need?
                              </h4>
                              <p className="need_text">
                                The essential data required includes:
                              </p>
                              <p className="facilities">
                                <span className="facilities_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Energy, gas and water – facilities or energy
                                teams usually hold this information. However,
                                the finance department also has access to this
                                through invoices.
                              </p>
                              <p className="facilities">
                                <span className="facilities_icon">
                                  <i className="fal fa-chevron-right"></i>
                                </span>
                                Business travel – This includes staff travel and
                                commuting.
                              </p>
                              <ul className="whomevr">
                                <li>
                                  Air travel information collected from whomever
                                  books travel for your business.
                                </li>
                                <li>
                                  Employee commuting can get calculated through
                                  a staff survey (you may have to estimate
                                  emissions on average per full-time employee).
                                </li>
                              </ul>
                              <h4 className="calculate">
                                How do I calculate my footprint?
                              </h4>
                              <p className="data_is">
                                Next up, you need to select the appropriate
                                emission factor for each emission source to
                                calculate the tonnes of CO2 emitted (tCO2e). It
                                is also imperative to ensure that your data is
                                for a consistent time. If you are calculating an
                                annual footprint, all data must be for similar
                                boundaries.
                              </p>
                              <div className="stent border_box p-3">
                                <div className="stent_one">
                                  <div className="stent_table">
                                    <h4 className="scope">Scope</h4>
                                  </div>
                                  <div className="stent_table_one">
                                    <h4 className="scope">Emission Type</h4>
                                  </div>
                                  <div className="stent_table_two">
                                    <h4 className="scope">Definition</h4>
                                  </div>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_one">
                                  <div className="stent_table">
                                    <h4 className="scope">Scope 1</h4>
                                  </div>
                                  <div className="stent_table_one">
                                    <p className="ghg">Direct Emissions</p>
                                  </div>
                                  <div className="stent_table_two">
                                    <p className="ghg">
                                      GHG emissions directly from operations
                                      that are owned or controlled by the
                                      reporting company
                                    </p>
                                  </div>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_one">
                                  <div className="stent_table">
                                    <h4 className="scope">Scope 2</h4>
                                  </div>
                                  <div className="stent_table_one">
                                    <p className="ghg">Indirect Emissions</p>
                                  </div>
                                  <div className="stent_table_two">
                                    <p className="ghg">
                                      Indirect GHG emissions from the generation
                                      of purchased or acquired electricity,
                                      steam, heating, or cooling consumed by the
                                      reporting company
                                    </p>
                                  </div>
                                </div>
                                <hr className="scope_gelop" />
                                <div className="stent_one">
                                  <div className="stent_table">
                                    <h4 className="scope">Scope 3</h4>
                                  </div>
                                  <div className="stent_table_one">
                                    <p className="ghg"></p>
                                  </div>
                                  <div className="stent_table_two">
                                    <p className="ghg">
                                      All indirect emissions (not included in
                                      scope 2) that occur in the value chain of
                                      the reporting company, including both
                                      upstream and downstream emissions
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="sve_next_one d-flex">
                            <button
                              className="page_save page_width"
                              type="button"
                            >
                              <NavLink to="/carbon_footprint_tabbing">
                                Next
                              </NavLink>
                            </button>
                            <div className="ganerate_p">
                              <button
                                className="next_page_one"
                                title="The Report will be uploaded within next 48 hours"
                                data-toggle="tooltip"
                                data-placement="top"
                                type="button"
                              >
                                <span className="Download_r">
                                  <i className="fa fa-download"></i>
                                </span>
                                Download Guide
                              </button>
                              <span>
                                For instructions on how to complete your <br />
                                footprint download our guide
                              </span>
                            </div> */}
                          <div className="global_link align-items-start mx-0 my-3">
                            <NavLink
                              className="new_button_style"
                              type="button"
                              to="/Scope_1_Emissions"
                            >
                              NEXT
                            </NavLink>

                            <span className="bc-text">
                              <div className="meettable">
                                <ExternalLink
                                  href="https://esgri.com/wp-content/uploads/2022/09/Carbon-Footprint-Guide-1.pdf"
                                  target="_blank"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  className="link_bal_next page_width m-0"
                                  type="button"
                                >
                                  <span className="Download_r">
                                    <i className="fa fa-download"></i>
                                  </span>
                                  Download Guide
                                </ExternalLink>
                              </div>
                              <span className="my-2 text-center">
                                For instructions on how to complete your <br />
                                footprint download our guide
                              </span>
                            </span>
                            <span className="bc-text">
                              <div className="meettable">
                                <ExternalLink
                                  href="https://res.cloudinary.com/dmklsntsw/raw/upload/v1667221633/Carbon_Inventory_List_cxifo1.xlsx"
                                  target="_blank"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  className="link_bal_next1 page_width m-0"
                                  type="button"
                                >
                                  <span className="Download_r">
                                    <i className="fa fa-download"></i>
                                  </span>
                                  Carbon Inventory
                                </ExternalLink>
                              </div>
                            </span>
                            <span className="bc-text">
                              <div className="meettable">
                                <ExternalLink
                                  href="https://res.cloudinary.com/dmklsntsw/raw/upload/v1667450925/ghg_emissions_calculation_tool_wf7n7h.xlsx"
                                  target="_blank"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  className="link_bal_next page_width m-0"
                                  type="button"
                                >
                                  <span className="Download_r">
                                    <i className="fa fa-download"></i>
                                  </span>
                                  GHG Protocol Calculator
                                </ExternalLink>
                              </div>
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
