/* eslint-disable react/jsx-no-target-blank */
import { sweetAlert } from "../../../../utils/UniversalFunction";
import Moment from "react-moment";
import "moment-timezone";
import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { saveAs } from "file-saver";
import axios from "axios";
import moment from "moment";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./supplier_management.css";
import Table from "react-bootstrap/Table";
import "react-datepicker/dist/react-datepicker.css";
import "./supplier_management.css";
import { Pagination, Icon, Label } from "semantic-ui-react";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { PermissionMenuContext } from "../../../../contextApi/permissionBasedMenuContext";
const BASE_URL = config.BASE_URL;
const currentUser = authenticationService.currentUserValue;

export default class supplier_management_detail extends Component {
  csvLink = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      feeedbackLogs: [],
      submitted: false,
      limit: 10,
      skip: 0,
      startDate: "",
      endDate: "",
      totalCount: 0,
      setStartDate: null,
      setEndDate: null,
      list: [],
      perPage: 5,
      page: 0,
      pages: 0,
      login: false,
      activeModal1: "",
      activeModal: "",
      showModal1: "",
      comments: "",
      csvData: [],
      isEditableOrNot: false,
      suppliers: [],
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal1 = this.handleOpenModal1.bind(this);
    this.handleCloseModal1 = this.handleCloseModal1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
  }

  handleOpenModal1(val) {
    let userid = val.target.getAttribute("user-id");
    let id = val.target.getAttribute("data-id");
    this.setState({ activeModal1: "login" });
    this.setState({ showModal1: true, idd: id, userid: userid });
    console.log("details", userid, id);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.ADMIN_API_URL +
      `getSupplierFeedback/${id}/${userid}?current_role=${localStorage.getItem(
        "role"
      )}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            feeedbackLogs: result.result,
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

  handleCloseModal1() {
    this.setState({ showModal1: false });
    this.setState({ showModal1: "" });
  }

  downloadReport(event) {
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
          section_name: "supplier",
          sub_section: "supplier",
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        let url = config.BASE_URL + response?.data?.data?.file;
        if (response?.data?.data?.file) {
          saveAs(url, url);
        } else {
          this.showAlert();
        }
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  handleOpenModal(val) {
    this.setState({ activeModal: val });
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showModal: "" });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  showAlert = () => {
    sweetAlert("info", "Report will be uploaded within next 48 hours");
  };

  exportCSV(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: this.state.setStartDate,
        endDate: this.state.setEndDate,
      }),
    };

    fetch(
      config.API_URL +
      `company-admin/supplierManagement/exportSupplyChain?current_role=${localStorage.getItem(
        "role"
      )}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            csvLink: result.data,
          });
          let url = BASE_URL + result.data;
          window.open(url, "_blank");
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  pageChange(e, data) {
    let page = data.activePage;
    let pageNo = page === 1 ? 0 : (page - 1) * this.state.limit;
    this.setState({
      skip: pageNo,
    });
    setTimeout(() => {
      this.serverRequest();
    }, 200);
  }

  onDateChange(event) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    let setStartDate = null;
    let setEndDate = null;
    if (this.state.setStartDate === null) {
      if (name === "setStartDate") {
        setStartDate = value;
      }
    } else {
      if (value !== this.state.setStartDate && name === "setStartDate") {
        setStartDate = value;
      } else {
        setStartDate = this.state.setStartDate;
      }
    }

    if (this.state.setEndDate === null) {
      if (name === "setEndDate") {
        setEndDate = value;
      }
    } else {
      if (value !== this.state.setEndDate && name === "setEndDate") {
        setEndDate = value;
      } else {
        setEndDate = this.state.setEndDate;
      }
    }
    if (setStartDate !== null && setEndDate !== null) {
      fetch(
        config.OLD_API_URL +
        `supplyChainRiskManagement?limit=${this.state.limit}&skip=${this.state.skip}&startDate=${setStartDate}&endDate=${setEndDate}&current_role=${localStorage.getItem("role")}`,
        { headers }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              totalCount: result.totalCount,
              items: result.data,
              list: result.data,
              pages: Math.floor(result.data.length / this.state.perPage),
              isEditableOrNot: result?.insertOrUpdate,
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
  }

  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.OLD_API_URL +
      `supplyChainRiskManagement?limit=${this.state.limit}&skip=${this.state.skip}&startDate=${this.state.startDate}&endDate=${this.state.endDate}&current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            totalCount: result.totalCount ?? 0,
            items: result.data,
            list: result.data,
            pages: Math.floor(result.data.length / this.state.perPage),
            isEditableOrNot: result?.insertOrUpdate,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    fetch(config.API_URL + `getMappedSuppliers?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            suppliers: result.data,
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
  handlePageClick = (event) => {
    let page = event.selected;
    this.setState({ page });
  };

  serverRequest() {
    const { skip, limit, startDate, endDate } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.OLD_API_URL +
      `supplyChainRiskManagement?limit=${limit}&skip=${skip}&startDate=${startDate}&endDate=${endDate}&current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            totalCount: result.totalCount,
            items: result.data,
            list: result.data,
            pages: Math.floor(result.data.length / this.state.perPage),
            isEditableOrNot: result?.insertOrUpdate,
          });
        },
        (error) => { }
      );
  }

  render() {
    const { list, feeedbackLogs, suppliers } = this.state;
    let weathers =
      list.map((item, keyss) => {
        return (
          <tr key={keyss}>
            <td>{keyss + 1}</td>
            <td>{item.companyName}</td>
            <td>
              <Moment format="DD/MM/YYYY">{item.createdAt}</Moment>
            </td>
            <td>{item.industry}</td>
            {/* <td>
              {item.followingCriteria}
            </td> */}
            <td>
              <a target="_blank" href={config.BASE_URL + item.response}>
                {item.response && (
                  <button className="btn-link table-tag" variant="none">
                    <span>
                      <i className="fa fa-eye"></i>
                    </span>
                  </button>
                )}
              </a>
            </td>
            <td>
              <span className="red bold center">
                {item.identified_risk === "High" && "High"}
              </span>
              <span className="green bold center">
                {item.identified_risk === "Low" && "Low"}
              </span>
              <span className="bold center">
                {item.identified_risk === "Medium" && "Medium"}
              </span>
            </td>
            <td>
              <div className="global_link" style={{ justifyContent: "center" }}>
                <button
                  className="btn-link table-tag"
                  variant="none"
                  onClick={() => {
                    this.handleOpenModal("login");
                    this.setState({ comments: item.feedback });
                  }}
                >
                  <span>
                    <i className="fa fa-eye"></i>
                  </span>
                </button>
              </div>
            </td>
            <td>
              <NavLink
                to="#"
                data-id={item.id}
                user-id={item.userId}
                onClick={(e) => this.handleOpenModal1(e)}
              >
                <i
                  data-id={item.id}
                  user-id={item.userId}
                  className="fa fa-info center"
                ></i>
              </NavLink>
            </td>
          </tr>
        );
      }) || "";
    return (
      <PermissionMenuContext.Consumer>
        {({ userPermissionList }) => (
          <div>
            <Sidebar dataFromParent={this.props.location.pathname} />
            <Header />
            <div className="main_wrapper">
              <div className="inner_wraapper">

                <div className="row">
                  {userPermissionList.includes("SUPPLIER_MANAGEMENT") && (
                    <div className="col-sm-12">
                      <div className="color_div_on">
                        <div className="text_Parts">
                          {/* <div className="text_Description">
                            <div className="d-flex justify-content-between mb-3">
                              <h5 className="motor font-heading">Introduction</h5>
                              <div className="form_x mb-3">
                                <div className="input-group"></div>
                              </div>
                            </div>
                            <hr></hr>
                            <p>
                              The Supplier ESG Assessment helps you start your journey towards understanding social, environmental and business ethics practices throughout your supply chain.
                            </p>
                            <p>
                              Based on responsible supply chain engagement strategies at leading global businesses, the Supplier ESG Assessment is a proven indicator set that helps you quickly measure supplier performance and identify vast opportunities for supplier improvement.
                            </p>
                            <p>
                              We help you quickly create visibility, access supplier intelligence and accelerate progress toward your goals.
                            </p>
                          </div> */}
                          <div>
                            {/* {this.state.isEditableOrNot && ( */}
                            <NavLink
                              className="non_underline_link bold"
                              to="supplier_management_form"
                            >
                              <button
                                className="new_button_style"
                                variant="none"
                                to="/supplier_management_form"
                              >
                                INVITE SUPPLIER
                              </button>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-sm-12">
                    <div className="color_div_on framwork_2 mt-3">
                      <div className="business_detail">
                        <div className="saved_cards">
                          <div className="business_detail">
                            <div className="heading">
                              <div className="heading_wth_text">
                                <h4> Mapped Suppliers </h4>
                              </div>
                            </div>
                          </div>
                          <hr></hr>
                          <div className="table_f manage-detail admin-risk-table table-responsive">
                            <Table striped bordered hover size="sm">
                              <thead>
                                <tr className="heading_color">
                                  <th>ID</th>
                                  <th scope="col">FULL NAME</th>
                                  <th scope="col">COMPANY NAME</th>
                                  <th scope="col">EMAIL</th>
                                  <th scope="col">INDUSTRY</th>
                                </tr>
                              </thead>
                              <tbody>
                                {suppliers?.map((item, key) => (
                                  <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td>
                                      {item?.first_name +
                                        " " +
                                        item?.last_name}
                                    </td>
                                    <td>{item?.register_company_name}</td>
                                    <td>{item?.email}</td>
                                    <td>{item?.company_industry}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>

                            <div className="Page navigation example">
                              <Pagination
                                className="mx-auto pagination"
                                defaultActivePage={1}
                                onPageChange={this.pageChange}
                                ellipsisItem={{
                                  content: (
                                    <Icon name="ellipsis horizontal" />
                                  ),
                                  icon: true,
                                }}
                                firstItem={{
                                  content: (
                                    <Icon name="angle double left" />
                                  ),
                                  icon: true,
                                }}
                                lastItem={{
                                  content: (
                                    <Icon name="angle double right" />
                                  ),
                                  icon: true,
                                }}
                                prevItem={{
                                  content: <Icon name="angle left" />,
                                  icon: true,
                                }}
                                nextItem={{
                                  content: <Icon name="angle right" />,
                                  icon: true,
                                }}
                                totalPages={Math.ceil(
                                  this.state.totalCount / this.state.limit
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal
                  animation={true}
                  size="md"
                  className="modal_box"
                  shadow-lg="border"
                  show={
                    this.state.showModal && this.state.activeModal === "login"
                  }
                >
                  <div className="modal-lg p-2">
                    <Modal.Header className="pb-0">
                      <Button
                        variant="outline-dark"
                        onClick={this.handleCloseModal}
                      >
                        <i className="fa fa-times"></i>
                      </Button>
                    </Modal.Header>
                    <div className="modal-bodykey={item.id} vekp pt-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="pb3">
                            <h4>Feedback</h4>
                            <div className="mb-3 feedback_comment">
                              {this.state.comments && this.state.comments}
                              {this.state.comments === null && "No Comment"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
                <Modal
                  animation={true}
                  size="md"
                  className="modal_box"
                  shadow-lg="border"
                  show={
                    this.state.showModal1 &&
                    this.state.activeModal1 === "login"
                  }
                >
                  <div className="modal-lg">
                    <Modal.Header className="pb-0">
                      <Button
                        variant="outline-dark"
                        onClick={this.handleCloseModal1}
                      >
                        <i className="fa fa-times"></i>
                      </Button>
                    </Modal.Header>
                    <div className="modal-body vekp pt-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="pb3">
                            <h4>Feedback Logs</h4>
                            <form>
                              <div className="mb-3 p-3">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th>ID</th>
                                      <th>Feedbacks / Comments</th>
                                      <th>Updated date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {feeedbackLogs.map((item, key) => (
                                      <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{item.feedback}</td>
                                        <td>
                                          {moment(item.createdAt)
                                            .utc()
                                            .format("DD-MM-YYYY")}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        )}
      </PermissionMenuContext.Consumer>
    );
  }
}
