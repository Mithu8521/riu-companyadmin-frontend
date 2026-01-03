import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
// import { KpiService } from "../../_services/admin/global-controls/kpiService";
// import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import { topicService } from "../../../../_services/admin/global-controls/topicService";
// import { companyService } from '../../_services/admin/global-controls/companyService';
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
// const axios = require("axios");

export const EditKpis = () => {
  const location = useLocation();
  // var currentLocation = window.location.pathname;
  // let parts = currentLocation.split("/");
  // let path = parts[2];
  const [data] = useState(location?.state?.item);
  const [title, setTitle] = useState(data?.title);
  const [framework, setFramework] = useState(data?.framework_id);
  const [topic, setTopic] = useState(data?.topic_title);
  // const [kpiMappingId, setKpiMappingId] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [topics, setTopics] = useState("");
  // const [selectedCompany,setSelectedCompany] = useState(0);
  // const [entity,setEntity] = useState("company");
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // const callApi = async () => {
  // let fresponse = await frameworkService.getFrameworks();
  //   setFrameworks(fresponse?.data);
  // };?  
  // const handleChangeFramework = (value) => {
  //   value=value.split("-")
  //   setFramework(value[0]);
  //   getTopics(value[1]);
  // };

  const handleEntityChange = async (e) => {
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getFramework`, {}, { type: "TOPIC" }, "GET");
    if (isSuccess) {
      setFrameworks(data?.data);
    }
    // axios
    // .get(`${config.ADMIN_API_URL}getFramework`, {
    //   params: {
    //     type:"ADD_DATA_AVAILABLE"
    //   },
    //   headers: {
    //     'Authorization': 'Bearer ' + currentUser?.data?.token,
    //     'Content-Type': 'application/json'
    //   },
    // })
    // .then((response) => {
    //   setFrameworks(response?.data?.data);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }

  async function getTopics(frameworkId) {
    if (frameworkId) {
      const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getTopic`, {}, { type: "KPI", framework_id: frameworkId }, "GET");
      if (isSuccess) {
        setTopics(data?.data);
      }
    }
  }
  useEffect(() => {
    // getKPIByID();
    // callApi();
    handleEntityChange();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.id = data.id;
    obj.title = title;
    obj.framework_id = framework;
    obj.topic_id = data.topic_id;
    obj.topic_kpi_id = data.topic_kpi_id;
    // KpiService.updateKPI(obj);
    const { isSuccess } = await apiCall(`${config.ADMIN_API_URL}updateKPI`, {}, obj, "POST");
    if (isSuccess) {
      window.location.href = config.baseURL + `/#/kpi`;
    }
  };

  // const getKPIByID = async () => {
  //   let data = await KpiService.getKPIByID(path)
  //   setTitle(data.data[0].title)
  //   setFramework(data.data[0].framework_id)
  //   setTopic(data.data[0].topic_id)
  //   setKpiMappingId(data.data[0].kpi_mapping_id)
  //   // getTopics(data.data[0].framework_id);
  // }
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
                                    <h4>UPDATE KPI</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
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
                                          onChange={(e) => {
                                            setFramework(
                                              e.target.value
                                            );
                                            getTopics(e.target.value);
                                          }}
                                          value={framework}
                                          className="select_one industrylist"
                                          required
                                        >
                                          <option value="">Select Framework</option>
                                          {frameworks &&
                                            frameworks.map((item, key) => (
                                              <option key={key} value={item.id}>
                                                {item.title}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          Select Topic
                                        </label>
                                        <select
                                          name="tab_name"
                                          onChange={(e) =>
                                            setTopic(e.target.value)
                                          }
                                          value={topic}
                                          className="select_one industrylist"
                                          required
                                        >
                                          <option value="">Select Topic</option>
                                          {topics &&
                                            topics.map((item, key) => (
                                              <option key={key} value={item.id}>
                                                {item.title}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="form-group">
                                      <label
                                        htmlFor="question"
                                        className="mb-2"
                                      >
                                        Kpi Title
                                      </label>
                                      <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Write Kpi title"
                                        onChange={(e) => setTitle(e.target.value)} value={title}
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="page_width page_save"
                                  >
                                    {" "}
                                    UPDATE NOW{" "}
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
