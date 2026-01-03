import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { KpiService } from "../../_services/admin/global-controls/kpiService";
// import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
// import { topicService } from "../../_services/admin/global-controls/topicService";
import config from "../../config/config.json";
import axios from "axios";
import { apiCall } from "../../_services/apiCall";
import { Select } from "react-select";

export const CreateKpi = (props) => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [framework, setFramework] = useState();
  const [topic, setTopic] = useState("");
  const [frameworks, setFrameworks] = useState([]);
  // const [entity, setEntity] = useState("");
  const [topics, setTopics] = useState("");
  // const [KPIType, setKPIType] = useState("Select Topic for KPI type");
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("user_temp_id")
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  // let topicRef = useRef(null);

  // useEffect(() => {
  //   if (topics) {
  //     setTopic(topics[0]?.id);
  //     if (topics[0]?.is_mendatory === "YES") setKPIType("Mandatory");
  //     else setKPIType("Voluntary");
  //   }
  // }, [topics]);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    // let response = await frameworkService.getFrameworks();
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "TOPIC" },
      "GET"
    );
    if (isSuccess) {
      setFrameworks(data?.data);
    }
  };

  const handleChangeFramework = (value) => {
    setFramework(value);
    getTopics(value);
  };

  async function getTopics(frameworkId) {
    // let response = await topicService.getTopicsAccordingToFramework(
    //   frameworkId
    // );
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getTopic`,
      {},
      { type: "KPI", framework_id: frameworkId },
      "GET"
    );
    if (isSuccess) {
      setTopics(data?.data);
    }
    // axios.get(`${config.API_URL}getTopic?type=KPI&framework_id=${frameworkId}`,{
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   }
    // }).then((response) =>{
    //   setTopics(response?.data?.data);
    //   // console.log(response?.data?.data,"topic response");
    // }).catch((error) =>{
    //   console.log(error);
    // })
    // setTopics(response?.data);
  }

  console.log(framework, "framework");
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("framework", framework);
    let obj = {};
    obj.title = title;
    obj.framework_id = framework;
    obj.topic_id = topic;
    // obj.is_mandatory = KPIType === "Mandatory" ? "YES" : "NO";
    // obj.entity = entity;
    // obj.company_id = localStorage.getItem("user_temp_id");
    // KpiService.createKpi(obj);
    const { isSuccess } = await apiCall(
      `${config.API_URL}createKpi`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setTitle("");
      window.location.href = config.baseURL + "/#/kpi";
    }
  };
  // console.log(framework,"framework");
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
                              <form name="form" onSubmit={handleSubmit}>
                                <div className="business_detail">
                                  <div className="heading">
                                    <h4>Add Kpi</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    {/* <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="industryType"
                                          className="mb-2"
                                        >
                                          {" "}
                                          Select Entity*{" "}
                                        </label>
                                        <select
                                          name="tab_name"
                                          onChange={(e) =>
                                            setEntity(e.target.value)
                                          }
                                          className="select_one industrylist"
                                        >
                                          <option value="company">
                                            Company
                                          </option>
                                          <option value="supplier">
                                            Supplier
                                          </option>
                                        </select>
                                      </div>
                                    </div> */}
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
                                          value={framework}
                                          onChange={(e) =>
                                            handleChangeFramework(
                                              e.target.value
                                            )
                                          }
                                          className="select_one industrylist"
                                        >
                                          <option selected disabled>
                                            Select Framework
                                          </option>
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
                                          // ref={topicRef}
                                          onChange={(e) => {
                                            setTopic(e.target.value);
                                            // topics &&
                                            // topics?.filter(
                                            //   (elem) => elem.id === topic
                                            // ).is_mendatory === "YES"
                                            //   ? setKPIType("Mandatory")
                                            //   : setKPIType("Voluntary");
                                          }}
                                          className="select_one industrylist"
                                        >
                                          <option selected disabled>
                                            Select Topic
                                          </option>
                                          {topics &&
                                            topics?.map((item, key) => (
                                              <option key={key} value={item.id}>
                                                {item.title}
                                              </option>
                                            ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6 form-group">
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
                                        value={title}
                                        onChange={(e) =>
                                          setTitle(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="col-lg-6 col-xs-6">
                                  <div className="form-group">
                                    <label
                                      htmlFor="questionHeading"
                                      className="mb-2"
                                    >
                                      Topic Type
                                    </label>
                                  
                                    <input
                                      className="form-control input-height"
                                      id="exampleInputPassword1"
                                      name="topic_type"
                                      readOnly
                                      value={KPIType}
                                    />
                                  </div>
                                </div> */}
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="new_button_style"
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
