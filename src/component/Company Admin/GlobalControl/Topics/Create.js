import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
// import { topicService } from "../../_services/admin/global-controls/topicService";
// import {
// frameworkService,
// getFrameworksAccordingToCompany,
// } from "../../_services/admin/global-controls/frameworkService";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../../src/config/config.json";
import { history } from "../../../../_helpers/history";
import { Route, Redirect } from 'react-router-dom';
import { Topics } from "./Topic";

// import { companyService } from "../../_services/admin/global-controls/companyService";
// import config from "../../config/config.json";
// const axios = require("axios");


export const CreateTopic = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [framework, setFramework] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [topicType, setTopicType] = useState("Mandatory");
  // const [selectedCompany, setSelectedCompany] = useState(0);
  // const [entity, setEntity] = useState("");
  // const [company, setCompany] = useState([]);
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));


  const callApi = async () => {
    // let response = await companyService.getCompany();
    // setCompany(response?.data);
    // let framworkresponse = await frameworkService.getFrameworks("TOPIC");
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getFramework`, {}, { type: "TOPIC" }, "GET");
    setFrameworks(data?.data);
  };
  useEffect(() => {
    callApi();
    // handleEntityChange(entity)
  }, []);


  // const handleEntityChange = async (e) => {
  //   let val = e;
  //   setEntity(val);
  //   axios
  //     .get(`${config.ADMIN_API_URL}getFramework`, {
  //       // params: {
  //       //   type:"ADD_DATA_AVAILABLE",
  //       //   entity: val
  //       // },
  //       headers: {
  //         'Authorization': 'Bearer ' + localStorage.getItem("token"),
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     .then((response) => {
  //       setFrameworks(response?.data?.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.title = title;
    obj.framework_id = framework;
    obj.is_mendatory = topicType === "Mandatory" ? "YES" : "NO";
    // topicService.createTopic(obj);
    const { isSuccess } = await apiCall(`${config.ADMIN_API_URL}createTopic`, {}, obj, "POST");
    if (isSuccess) {
      setTitle("");
      //     if(window.location.hash) {
      //       window.history.replaceState( window.location.href, "", config.baseURL+"/#/topics");    
      //  }
      //  return <><Redirect to={{ pathname: '/topics' }} ><Topics/></Redirect></>
      //  window.location.href = config.baseURL+"/topics"
      // history.replace
      window.location.href = config.baseURL + "/#/topics"
      // window.location.replace(
      //   (config.baseURL+"/#/topics").toString().replace("/topic")
      // );
      // history.goBack()
      // console.log("hi",history);
    }
    // setEntity("");
    // setFrameworks("");
  };
  return (
    <div>
      <AdminSidebar dataFromParent={location.pathname} />
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
                                    <h4>Add Topic</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    {/*<div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          {" "}
                                          Select Entity{" "}
                                        </label>
                                        <select
                                          name="tab_name"
                                          onChange={(e) =>
                                            handleEntityChange(e.target.value)
                                          }
                                          className="select_one industrylist"
                                        >
                                        <option>Select Entity</option>
                                        <option  value="company">
                                        Company
                                      </option>
                                          <option  value="supplier">
                                            Supplier
                                          </option>
                                        </select>
                                      </div>
                                        </div>*/}
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          {" "}
                                          Select Framework*{" "}
                                        </label>
                                        <select
                                          name="tab_name"
                                          onChange={(e) =>
                                            setFramework(e.target.value)
                                          }
                                          className="select_one industrylist"
                                          required>
                                          <option value="">Select Framework</option>
                                          {frameworks.length > 0 &&
                                            frameworks?.map((item, key) => (
                                              <option key={key} value={item?.id}>
                                                {item?.title}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group">
                                        <label
                                          htmlFor="question"
                                          className="mb-2"
                                        >
                                          {" "}
                                          Topic{" "}
                                        </label>
                                        <textarea
                                          type="text"
                                          className="form-control"
                                          placeholder="Write Topic title"
                                          value={title}
                                          onChange={(e) =>
                                            setTitle(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-xs-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="questionHeading"
                                      className="mb-2"
                                    >
                                      Topic Type
                                    </label>
                                    <select
                                      className="form-control input-height"
                                      id="exampleInputPassword1"
                                      name="topic_type"
                                      onChange={(e) => setTopicType(e.target.value)}
                                      required
                                    // ref={topicTypeRef}
                                    >
                                      <option value="" disabled>
                                        Please Select Topic Type
                                      </option>
                                      <option value="Mandatory">
                                        Mandatory
                                      </option>
                                      <option value="Voluntary">
                                        Voluntary
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="page_width page_save"
                                  >
                                    {" "}
                                    ADD{" "}
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
