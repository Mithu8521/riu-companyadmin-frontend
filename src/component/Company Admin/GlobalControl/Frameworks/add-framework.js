import React, { useState, useEffect } from "react";
import AdminSidebar from "../sidebar/admin_sidebar";
import AdminHeader from "../header/admin_header";
import config from "../../config/config.json";
import axios from "axios";
import { sweetAlert } from "../../utils/UniversalFunction";
import "../Sector_Question_Manage/control.css";
import { authenticationService } from "../../_services/authentication";
const currentUser = authenticationService.currentUserValue;

const AddFramework = () => {
  const [login, setLogin] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companyIndustry, setCompanyIndustry] = useState([]);
  const [industry_id, setIndustryId] = useState("");
  const [heading, setHeading] = useState("");
  const [tab_name, setTabName] = useState("");
  const [uri, setUri] = useState("");
  const [title, setTitle] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "industry_id":
        setIndustryId(value);
        break;
      case "heading":
        setHeading(value);
        break;
      case "tab_name":
        setTabName(value);
        break;
      case "uri":
        setUri(value);
        break;
      case "title":
        setTitle(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    const { industry_id, heading, tab_name, uri, title } = this.state;
    const headers = {
      Authorization: `Bearer ${currentUser.data.token}`,
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
  };

  const handleChangeForQuestionTabURI = (event) => {
    let questionTab = event.target[event.target.selectedIndex].title;
    let questionUri = event.target.value;
    this.setState({
      tab_name: questionTab,
      uri: questionUri,
    });
  };

  useEffect(() => {
    fetch(config.API_URL + "getIndustriesOfCategoryId")
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
  }, []);

  return (
    <div>
      <AdminSidebar dataFromParent={window.location.pathname} />
      <AdminHeader />
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
                              <form name="form" onSubmit={handleSubmit}>
                                <div className="business_detail">
                                  <div className="heading">
                                    <h4>Add Framework</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    <div className="col-lg-12 col-xs-12">
                                      <div className="form-group pb-3">
                                        <label htmlFor="title" className="mb-2">
                                          Framework Heading
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control py-3"
                                          id="title"
                                          placeholder="Enter Question Heading or Leave This Options"
                                          name="heading"
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <label
                                        htmlFor="question"
                                        className="mb-2"
                                      >
                                        Framework Description*
                                      </label>
                                      <textarea
                                        type="text"
                                        className="form-control"
                                        id="question"
                                        placeholder="Write Framework title"
                                        name="title"
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="page_width page_save"
                                  >
                                    ADD NOW
                                  </button>
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
};

export default AddFramework;
