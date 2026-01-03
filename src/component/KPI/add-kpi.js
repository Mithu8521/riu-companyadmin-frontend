import React, { Component } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import config from "../../config/config.json";
import axios from "axios";
import { sweetAlert } from "../../utils/UniversalFunction";
import "../Sector_Question_Manage/control.css";
import { authenticationService } from "../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

export default class AddKpi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      items: [],
      loading: false,
      companyIndustry: [],
      industry_id: "",
      heading: "",
      tab_name: "",
      uri: "",
      title: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeForQuestionTabURI =
      this.handleChangeForQuestionTabURI.bind(this);
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
    const { industry_id, heading, tab_name, uri, title } = this.state;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "createSectorQuestion",
        {
          industry_id: industry_id,
          heading: heading,
          tab_name: tab_name,
          uri: uri,
          title: title,
          current_role: localStorage.getItem("role"),
        },
        { headers }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      })
      .catch(function (error) {
        if (error.response) {
          sweetAlert("error", error.response.data.message);
        }
      });
  }

  handleChangeForQuestionTabURI(event) {
    let questionTab = event.target[event.target.selectedIndex].title;
    let questionUri = event.target.value;
    this.setState({
      tab_name: questionTab,
      uri: questionUri,
    });
  }

  componentDidMount() {
    fetch(config.API_URL + `getIndustriesOfCategoryId?current_role=${localStorage.getItem("role")}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            companyIndustry: result.companyIndustry,
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
    // const { companyIndustry } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={props.location.pathname} />
        <Header />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="col-sm-12">
                        <div className="color_div_on framwork_2">
                          <div className="business_detail">
                            <div className="">
                              <div className="saved_cards">
                                <form name="form" onSubmit={this.handleSubmit}>
                                  <div className="business_detail">
                                    <div className="heading">
                                      <h4>Add Kpi</h4>
                                    </div>
                                    <hr className="line"></hr>
                                    <div className="row">
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Framework* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select Framework</option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="industryType" className="mb-2" > Select Topic* </label>
                                          <select name="tab_name" id="" className="select_one industrylist" >
                                            <option hidden disabled selected> Select Topic</option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                            <option value="" title=""> </option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-xs-6">
                                        <div className="form-group pb-3">
                                          <label htmlFor="title" className="mb-2" > Kpi Heading </label>
                                          <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Heading or Leave This Options" name="heading" onChange={this.handleChange} />
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="question" className="mb-2" > Kpi Description* </label>
                                        <textarea type="text" className="form-control" id="question" placeholder="Write Kpi title" name="title" onChange={this.handleChange} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="global_link mx-0 my-3">
                                    <button type="submit" className="new_button_style" > ADD NOW </button>
                                  </div>
                                </form>
                              </div>
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
