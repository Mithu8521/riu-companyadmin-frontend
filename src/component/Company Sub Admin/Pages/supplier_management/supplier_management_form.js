/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { sweetAlert } from '../../../../utils/UniversalFunction';
import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import config from "../../../../config/config.json";
import "./supplier_management.css";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Pagination, Icon, Label } from "semantic-ui-react";
import { authenticationService } from "../../../../_services/authentication";
import { event } from 'jquery';
import Supplier_details_form from './Supplier_details_form';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
const currentUser = authenticationService.currentUserValue;

export default class supplier_management_form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria: [props.location.aboutProps] ?? [],
      finalIds: [],
      submitted: false,
      csvsubmitted: false,
      firstName: "",
      lastName: "",
      email: "",
      companyName1: "",
      firstName1: "",
      lastName1: "",
      email1: "",
      companyName: "",
      companyIndustory: [],
      industry: "",
      industry1: "",
      industryList: [],
      addNewSupplier: false,
      addNewSupplierButton: true,
      selectedIds: [],
      supplier_name: "",
      industryId: "",
      industryTitle: "",
      supplier: [],
      inviteLen: 1,
      inviteSuppliers: [],
      isOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeForSelect = this.handleChangeForSelect.bind(this);
    this.handleChangeForSelect1 = this.handleChangeForSelect1.bind(this);
    this.applySecondForm = this.applySecondForm.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.handleSubmitForSearch = this.handleSubmitForSearch.bind(this);
    this.supplierSubmit = this.supplierSubmit.bind(this);
    this.formatDateTime = this.formatDateTime.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }
  formatDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const formattedDateTime = dateObj.toLocaleString();
    return formattedDateTime;
  }

  handleRowSelect = (id) => {
    const { selectedIds } = this.state;
    const index = selectedIds.indexOf(id);
    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }

    this.setState({ selectedIds });
    console.log(selectedIds, "selectedIds")
  };
  supplierSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    const {
      selectedIds
    } = this.state;
    if (selectedIds.length > 0) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };
      axios
        .post(
          `${config.API_URL}inviteSupplier`,
          {
            supplier_ids: selectedIds,
            current_role: localStorage.getItem("role"),
          },
          { headers }
        )
        .then((response) => {
          sweetAlert('success', response.data.message);
          setTimeout(() => {
            const newLocal = "/supplier_management_detail";
            this.props.history.push(newLocal);
          }, 1000);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert('error', error.response.data.errorMessage);
          }
        });
    }
    else {
      sweetAlert('error', "Please Select Supplier.");
    }
  };

  handleChangeForSelect(event) {
    const { value, industry } = event;
    this.setState({
      [industry]: value,
    });
  }

  handleChangeForSelect1(event) {
    const { value, industry1 } = event;
    this.setState({
      [industry1]: value,
    });
  }

  applySecondForm() {
    this.setState({
      addNewSupplier: true,
      addNewSupplierButton: false,
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

  updateMessage() {
    sweetAlert('info', "The Document will be uploaded within next 48 hours");
  }

  closeModal() {
    this.setState({ isOpen: false });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const {
      firstName,
      lastName,
      email,
      companyName,
      finalIds,
      industry,
      mobile,
    } = this.state;
    if (firstName && lastName && email && companyName) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };

      //   axios
      //     .post(
      //       `${config.API_URL}inviteSupplier`,
      //       {
      //         first_name:firstName,
      //         last_name:lastName,
      //         email:email,
      //         company_name:companyName,
      //         company_industry:industry.split("-")[0],
      //         company_industry_id:industry.split("-")[1],
      //         mobile:mobile
      //       },
      //       { headers }
      //     )
      //     .then((response) => {
      //       sweetAlert('success',response.data.message);
      //       setTimeout(() => {
      //         const newLocal = "/supplier_management_form";
      //         this.props.history.push(newLocal);
      //       }, 1000);
      //     })
      //     .catch(function (error) {
      //       if (error.response) {
      //         sweetAlert('error',error.response.data.errorMessage);
      //       }
      //     });
      // } 
      // else {
      //   sweetAlert('error',"Please fill all input");
      // }
    }
  }

  handleSubmitForSearch = async (event) => {
    event.preventDefault();
    const { supplier_name } = this.state;

    try {
      const response = await axios.get(
        `${config.BASE_URL}searchSupplier?register_company_name=${supplier_name}&current_role=${localStorage.getItem("role")}`
      );
      const result = response.data;

      this.setState({
        isLoaded2: true,
        supplier: result.data,
        inviteLen: result.data.length
      });
      if (result.data.length === 0) {
        this.setState({
          isOpen: true
        })
      }
    } catch (error) {
      this.setState({
        isLoaded2: true,
        error2: error,
      });
    }
    this.setState({ supplier_name: "" });
  };


  onFileChange = (event) => {
    this.setState({ csvsubmitted: true });
    let topicId = event.target.getAttribute("data-id");
    const formData = new FormData();

    // Update the formData object
    formData.append("csv", event.target.files[0], event.target.files[0].name);
    formData.append("supplier_management_criteria_ids", topicId);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(config.OLD_API_URL + `supplierManagementWithCSV?current_role=${localStorage.getItem("role")}`, formData, {
        headers,
      })
      .then((response) => {
        sweetAlert('success', response.data.message);
        setTimeout(() => {
          const newLocal = "/supplier_management_detail";
          this.props.history.push(newLocal);
        }, 1000);
      })
      .catch(function (response) {
        // sweetAlert('error',response.data.message);
      });
  };

  componentDidMount(id) {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "supplier_management" }),
    };
    if (localStorage.getItem("role") === "SUB_ADMIN") {
      fetch(
        config.API_URL + `getSupplierManagementAssignedUser?current_role=${localStorage.getItem("role")}`,
        requestOptions
      )
        .then((res) => res.json())
        .then(
          (result) => {
            if (localStorage.getItem("role") === "SUB_ADMIN") {
              let getStatus = result.data.length > 0 ? true : false;
              if (getStatus === false) {
                this.props.history.push("/supplier_management_detail");
              }
            }
            this.setState({
              isLoaded: true,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    };

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(
      config.API_URL +
      `getInvitedSuppliers?current_role=${localStorage.getItem("role")}`,
      { headers }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            inviteSuppliers: result.data,
            totalCount: result.totalCount,
            pages: Math.floor(result?.data?.length / this.state.perPage),
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
    // axios
    //   .post(
    //     config.API_URL + "getSupplierManagementCriteriaWithCondition",
    //     { ids: this.state.criteria },
    //     { headers }
    //   );
    // .then((response) => {
    //   this.setState({ finalIds: response.data.data });
    // })
    // .catch((error)=> {
    //   // sweetAlert('error', error.response.data.message);
    // });

    // axios
    // .get(config.API_URL + "getSupplierManagementIndustry", { headers });
    // .then((response) => {
    //   this.setState({ industryList: response.data.data });
    // })
    // .catch((error) => {
    //   sweetAlert('error', error.response.data.message);
    // });    
  };


  render() {
    const {
      firstName,
      lastName,
      email,
      companyName,
      submitted,
      industry,
      companyIndustory,
      mobile,
      supplier,
      inviteLen,
      inviteSuppliers
    } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div classNamTopicse="container-fluid">
                  <div className="row">
                    <div className="col-md-12" >
                      <form name="form">
                        <div className="search__section" style={{ marginBottom: "5px" }}>
                          <div>
                            {/* Additional content can be added here */}
                          </div>
                          <div className="d-flex dropdown align-items-center justify-content-between">
                            <div>
                              <button
                                className='new_button_style'
                                type="submit"
                                onClick={this.handleSubmitForSearch}
                              >
                                Get Supplier
                              </button>

                            </div>
                            <div className='d-flex align-items-center'>
                              <div>Search :</div>
                              <input
                                className='select_one_all '
                                type="text"
                                name="supplier_name"
                                value={this.state.supplier_name}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="col-sm-12">
                      <div className="color_div_on framwork_2 mt-3">
                        <div className="business_detail">
                          <div className="saved_cards">
                            <div className="business_detail">
                              <div className="heading">
                                <div className="heading_wth_text">
                                  <h4>
                                    Invite Suppliers
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <hr></hr>
                            <div className="table_f manage-detail admin-risk-table table-responsive">
                              <Table striped bordered hover size="sm">
                                <thead>
                                  <tr className="heading_color">
                                    <th>ID</th>
                                    <th scope="col">COMPANY NAME</th>
                                    <th scope="col">EMAIL</th>
                                    <th scope="col">REQUEST DATE</th>
                                    <th scope="col">INVITATION STATUS</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inviteSuppliers?.map((item, key) => (
                                    <tr key={key}>
                                      <td>{key + 1}</td>
                                      <td>{item?.company_name}</td>
                                      <td>{item?.email}</td>
                                      <td>{this.formatDateTime(item?.request_date)}</td>
                                      <td><span className="red bold">
                                        {item?.status === 0 &&
                                          "REJECTED"}
                                      </span>
                                        <span className="green bold">
                                          {item?.status === 2 &&
                                            "PENDING"}
                                        </span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>

                              {/* <div className="Page navigation example">
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
                                content: <Icon name="angle double left" />,
                                icon: true,
                              }}
                              lastItem={{
                                content: <Icon name="angle double right" />,
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
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 mt-4">
                      {supplier.length > 0 && (<div className="requirem">
                        <div className="saved_cards">
                          <div className="business_detail">
                            <div className="heading">
                              <div className="heading_wth_text">
                                <h4>
                                  Supplier Management
                                </h4>
                              </div>
                            </div>
                          </div>
                          <hr></hr>
                          <div className="table_f manage-detail admin-risk-table table-responsive">
                            <table className="table table-striped table-bordered table-hover">
                              <thead>
                                <tr className="heading_color">
                                  <th>SELECT</th>
                                  <th>SUPPLIER NAME</th>
                                  <th scope="col">SUPPLIER COMPANY</th>
                                  <th scope="col">EMAIL</th>
                                  <th scope="col">INDUSTRY</th>
                                </tr>
                              </thead>
                              <tbody>
                                {supplier?.map((row) => (
                                  <tr key={row.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={this.state.selectedIds.includes(row.id)}
                                        onChange={() => this.handleRowSelect(row.id)}
                                      />
                                    </td>
                                    <td>{row.first_name + " " + row.last_name}</td>
                                    <td>{row.register_company_name}</td>
                                    <td>{row.email}</td>
                                    <td>{row.company_industry}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                              <button type="submit" className='new_button_style' onClick={this.supplierSubmit}>Submit</button>
                            </div>
                            <div className="Page navigation example">
                            </div>
                          </div>
                        </div>
                      </div>)}
                      {inviteLen == 0 && (<div className="requirem">
                        <Supplier_details_form isOpen={this.state.isOpen} setIsOpen={this.closeModal} />
                      </div>)}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

