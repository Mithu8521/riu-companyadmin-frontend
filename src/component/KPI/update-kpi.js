import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { KpiService } from "../../_services/admin/global-controls/kpiService";
import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import { topicService } from "../../_services/admin/global-controls/topicService";
import axios from "axios";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
export const EditKpis = () => {
  const location = useLocation();
  var currentLocation = window.location.pathname;
  let parts = currentLocation.split("/");
  let path = parts[2];
  const [title, setTitle] = useState(location?.state?.item?.title);
  const [frameworks, setFrameworks] = useState("");
  const [framework, setFramework] = useState(
    location?.state?.item?.framework_id
  );
  const [topic, setTopic] = useState(location?.state?.item?.topic_id);
  // const [KPIType, setKPIType] = useState(
  //   location?.state?.item?.is_mandatory === "YES" ? "Mandatory" : "Voluntary"
  // );
  const [topics, setTopics] = useState();
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const handleChangeFramework = (value) => {
    setFramework(value);
    getTopics(value);
  };

  // useEffect(() => {
  //   if (topics) {
  //     setTopic(topics[0]?.id);
  //     if (topics[0]?.is_mendatory === "YES") setKPIType("Mandatory");
  //     else setKPIType("Voluntary");
  //   }
  // }, [topics]);

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
  const callApi = async () => {
    // let response = await frameworkService.getFrameworks("TOPIC");
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "TOPIC" },
      "GET"
    );
    if (isSuccess) {
      setFrameworks(data?.data);
      // getTopics(framework);
    }
    // setFrameworks(response?.data);
    // getTopics(framework);
    // console.log(response?.data,"response?.data")
  };

  useEffect(() => {
    callApi();
    getTopics(framework);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.framework_id = framework;
    obj.title = title;
    obj.topic_id = topic;
    obj.topic_kpi_id = location?.state?.item?.topic_kpi_id;
    obj.id = location?.state?.item?.id;
    // obj.is_mandatory = KPIType === "Mandatory" ? "YES" : "NO";
    const { isSuccess } = await apiCall(
      `${config.API_URL}updateKpi`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      window.location.href = config.baseURL + "/#/kpi";
    }
    // KpiService.updateKPI(obj);
  };

  // const getKPIByID = async () => {
  //   let data = await KpiService.getKPIByID(path)
  //   // setTitle(data.data.title)
  // }

  // console.log(location, "location");
  return (
    <div>
      <Sidebar dataFromParent={location.pathname} />
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
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="question"
                                          className="mb-2"
                                        >
                                          Framework
                                        </label>
                                        <input
                                          className="form-control input-height"
                                          id="exampleInputPassword1"
                                          name="framework"
                                          required
                                          readOnly
                                          value={location?.state?.item?.framework_title}
                                        />
                                        {/* <select
                                          name="tab_name"
                                          id=""
                                          className="select_one industrylist"
                                          value={framework}
                                          onChange={(e) =>
                                            handleChangeFramework(
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option disabled selected>
                                            Select Framework
                                          </option>
                                          {frameworks &&
                                            frameworks.map((item, key) => (
                                              <option
                                                key={key}
                                                value={item?.id}
                                              >
                                                {item.title}
                                              </option>
                                            ))}
                                        </select> */}
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label
                                          htmlFor="question"
                                          className="mb-2"
                                        >
                                          Topic
                                        </label>
                                        <input
                                          className="form-control input-height"
                                          id="exampleInputPassword1"
                                          name="topic"
                                          required
                                          readOnly
                                          value={location?.state?.item?.topic_title}
                                        />
                                        {/* <select
                                          name="tab_name"
                                          id=""
                                          className="select_one industrylist"
                                          value={topic}
                                          onChange={(e) => {
                                            setTopic(e.target.value);
                                            // console.log(
                                            //   "topicvalue",
                                            //   e.target.value
                                            // );
                                            // topics &&
                                            // topics?.filter(
                                            //   (elem) => elem.id === topic
                                            // ).is_mendatory === "YES"
                                            //   ? setKPIType("Mandatory")
                                            //   : setKPIType("Voluntary");
                                          }}
                                        >
                                          <option disabled selected>
                                            Select Topic
                                          </option>
                                          {topics &&
                                            topics?.map((item, key) => (
                                              <option
                                                key={key}
                                                value={item?.id}
                                              >
                                                {item.title}
                                              </option>
                                            ))}
                                        </select> */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
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
                                        defaultValue={title}
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
                                    UPDATE{" "}
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
