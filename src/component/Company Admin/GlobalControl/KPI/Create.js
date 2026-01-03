import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
// import { KpiService } from "../../_services/admin/global-controls/kpiService";
// import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
// import { companyService } from '../../_services/admin/global-controls/companyService';
// import { topicService } from "../../_services/admin/global-controls/topicService";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
// import config from "../../config/config.json";
// const axios = require("axios");
export const CreateKpi = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [framework, setFramework] = useState("");
  const [topic, setTopic] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [topics, setTopics] = useState("");
  // const [selectedCompany,setSelectedCompany] = useState(0);
  // const [entity, setEntity] = useState("");
  // const [company,setCompany] = useState([]);
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));


  // const getCompanyData = async () => {
  //   let response = await companyService.getCompany();
  //   setCompany(response?.data);
  // };
  const callApi = async () => {
    // let response = await frameworkService.getFrameworks("TOPIC");
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getFramework`, {}, { type: "TOPIC" }, "GET");
    if (isSuccess) {
      setFrameworks(data.data);
    }
  };
  const handleChangeFramework = (value) => {
    value = value.split("-")
    // setFramework(value[0]);
    getTopics(value[0]);
  };

  async function getTopics(frameworkId) {
    // let response = await topicService.getTopicsAccordingToFramework("KPI",
    //   frameworkId
    // );
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getTopic`, {}, { type: "KPI", framework_id: frameworkId }, "GET");
    if (isSuccess) {
      setFramework(frameworkId);
      setTopics(data?.data);
    }
  }

  useEffect(() => {
    callApi();
    // getTopics();
    // handleEntityChange(entity)
    // getCompanyData()
  }, []);

  // const handleEntityChange=async(e)=>{
  //   let val = e;
  //   setEntity(val);
  //   axios
  //     .get(`${config.ADMIN_API_URL}getFramework`, {
  //       params: {
  //         type:"ADD_DATA_AVAILABLE",
  //         entity: val
  //       },
  //       headers: {
  //         'Authorization': 'Bearer ' + currentUser?.data?.token,
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
    // console.log("framework", framework);
    let obj = {};
    obj.title = title;
    obj.topic_id = topic;
    obj.framework_id = framework;
    // KpiService.createKpi(obj);
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}createKpi`, {}, obj, "POST");
    if (isSuccess) {
      setTitle("");
      // setEntity("");
      setTopics("");
      setFrameworks("");
      window.location.href = config.baseURL + "/#/kpi"
    }
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
                                    <h4>Add Kpi</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    {/*<div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                      <label htmlFor="industryType" className="mb-2" > Select Entity </label>
                                        <select name="tab_name" onChange={(e) => handleEntityChange(e.target.value)} className="select_one industrylist" >
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
                                            handleChangeFramework(
                                              e.target.value
                                            )
                                          }
                                          className="select_one industrylist"
                                          required
                                        >
                                          <option value="">Select Framework</option>
                                          {frameworks &&
                                            frameworks.map((item, key) => (
                                              <option key={key} value={`${item.id}-${item.framework_mapping_id}`}>
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

                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
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
                                          value={title} onChange={(e) => setTitle(e.target.value)} required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="page_width page_save"
                                  >
                                    {" "}
                                    ADD NOW{" "}
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
