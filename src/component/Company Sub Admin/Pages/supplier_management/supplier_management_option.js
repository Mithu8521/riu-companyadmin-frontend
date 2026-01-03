/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { ExternalLink } from "react-external-link";
const currentUser = authenticationService.currentUserValue;

export default class supplier_management_option extends Component {
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
      questions: [],
      answers: [],
      submitted: false,
      setError: false,
      submissions: {
        frameworksUsed: [],
      },
      selected: [],

      selectedUser: [],
      isAssigned: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToPreviousPath = this.goToPreviousPath.bind(this);
  }

  goToPreviousPath() {
    this.props.history.goBack();
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { submissions } = this.state;
    this.setState({
      submissions: {
        ...submissions,
        [name]: value,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectedUser } = this.state;
    if (selectedUser.length > 0) {
      this.setState({
        submitted: true,
        setError: false,
      });
      this.props.history.push({
        pathname: "/supplier_management_form",
        aboutProps: {
          selectedUser: this.state.selectedUser,
        },
      });
    } else {
      this.setState({ setError: true });
    }
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
  componentDidMount() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `getSupplierManagementCriteria?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            questions: result.data,
          });
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "supplier_management" }),
    };

    if (currentUser.data.role === "SUB_ADMIN") {
      fetch(
        config.API_URL + `getSupplierManagementAssignedUser?current_role=${localStorage.getItem("role")}`,
        requestOptions
      )
        .then((res) => res.json())
        .then(
          (result) => {
            if (currentUser.data.role === "SUB_ADMIN") {
              let getStatus = result.data.length > 0 ? true : false;
              if (getStatus === false) {
                this.props.history.push("/supplier_management_detail");
              }
            }
            this.setState({
              isLoaded: true,
              isAssigned: result.data.length > 0 ? true : false,
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

  render() {
    const { questions, selectedUser, submitted, setError } =
      this.state;

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
                      <div className="requirem">
                        <div className="text_Parts">
                          <div className="text_ntroduction">
                            <p className="accountable">
                              As a corporate entity, we hold ourselves accountable to various principles and values that guide decision-making to ensure that we can operate responsibly and ethically. We also expect that these same values and principles get shared by consultants, contractors and workers (employees, contractors, agency and temporary staff) of all goods or services suppliers.
                            </p>
                            <p className="accountable">
                              We believe that suppliers, agents and manufacturers are an extension of us. Thus, it is of utmost importance that guidelines be in place to guarantee sustainable sourcing practices that can promote long-term growth for the environment, social surroundings, our economy and all other stakeholders involved.
                            </p>
                            <p className="accountable">
                              This supplier ESG assessment will outline the minimum standards and requirements for suppliers, agents and manufacturers. It is not only expected that these parties will meet or exceed this assessment process but also that they will implement it into their supply chains. This assessment applies to all of our suppliers and contractors.
                            </p>
                          </div>

                          <div className="text_Parts">
                            <div className="text_criteria">
                              <h5 className="crit mb-0 pb-2">
                                Which of the following criteria would you like
                                to assess?
                              </h5>
                              <form name="form" onSubmit={this.handleSubmit}>
                                <div className="Global">
                                  <div className="border_box p-3">
                                    <div className="row">
                                      <div className="col-sm-12 col-xs-12">
                                        <div className="row">
                                          {questions.map((item, key) => (
                                            <div
                                              key={key}
                                              className="col-xxl-6 col-lg-12 col-md-12 col-12"
                                            >
                                              <div
                                                key={key}
                                                className="Global_text"
                                              >
                                                <div className="form-check form-check-inline cloball_check">
                                                  <input
                                                    className="form-check-input input_one mt-0"
                                                    name="frameworksUsed[]"
                                                    onChange={(e) =>
                                                      this.handleMultiSelect(
                                                        e,
                                                        item.id
                                                      )
                                                    }
                                                    checked={selectedUser?.some(
                                                      (frameworkiuse) =>
                                                        Number(frameworkiuse) ===
                                                        item.id
                                                    )}
                                                    type="checkbox"
                                                    id={"frameworks" + (key + 1)}
                                                  />
                                                  <label
                                                    className="form-check-label label_one"
                                                    htmlFor="inlineCheckbox15"
                                                  >
                                                    {item.title}&nbsp;&nbsp;&nbsp;
                                                    <ExternalLink href={item.guid_link}>
                                                      <i className="far fa-file-pdf iconcolor"></i>
                                                    </ExternalLink>
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {setError && (
                                    <div className="help-block">
                                      At Least One Checkbox is Required
                                    </div>
                                  )}
                                  <div className="global_link mx-0 my-3">
                                    <span className="">
                                      <a
                                        className="link_bal_next"
                                        onClick={this.goToPreviousPath}
                                      >
                                        Back
                                      </a>
                                    </span>
                                    {!submitted && (
                                      <button className="page_save page_width mx-3">
                                        Next
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </form>
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
