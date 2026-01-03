import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useLocation } from "react-router-dom";
import "../Sector_Question_Manage/control.css";
import { topicService } from "../../_services/admin/global-controls/topicService";
import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import config from "../../config/config.json";
import axios from "axios";
import { apiCall } from "../../_services/apiCall";

export const EditTopic = () => {
  var currentLocation = window.location.pathname;
  let parts = currentLocation.split("/");
  let path = parts[2];
  const location = useLocation();
  const [title, setTitle] = useState(location?.state?.item?.title);
  // const [topicType, setTopicType] = useState(
  //   location?.state?.item?.is_mendatory === "YES" ? "Mandatory" : "Voluntary"
  // );
  const [framework, setFramework] = useState(
    location?.state?.item?.framework_id
  );
  const [frameworks, setFrameworks] = useState();
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("user_temp_id")
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.id = location?.state?.item?.id;
    obj.title = title;
    obj.framework_id = parseInt(framework);
    obj.framework_topic_id = location?.state?.item?.framework_topic_id;
    // obj.is_mendatory = topicType === "Mandatory" ? "YES" : "NO";
    // topicService.updateTopic(obj)
    const { isSuccess } = await apiCall(
      `${config.API_URL}updateTopic`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      window.location.href = config.baseURL + "/#/topics";
    }
  };

  const callApi = async () => {
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

  useEffect(() => {
    callApi();
  }, []);

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
                                    <h4>Update Topics</h4>
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
                                          Framework*{" "}
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
                                          defaultValue={framework}
                                          onChange={(e) =>
                                            setFramework(e.target.value)
                                          }
                                          className="select_one industrylist"
                                        >
                                          <option>Select Framework</option>
                                          {frameworks &&
                                            frameworks?.map((item, key) => (
                                              <option
                                                key={key}
                                                selected={
                                                  framework === item.id
                                                    ? true
                                                    : false
                                                }
                                                value={item.id}
                                              >
                                                {item.title}
                                              </option>
                                            ))}
                                        </select> */}
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group">
                                        <label
                                          htmlFor="questionHeading"
                                          className="mb-2"
                                        >
                                          Topic Heading
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control py-3"
                                          id=" questionHeading"
                                          defaultValue={title}
                                          placeholder="Enter Framework Heading"
                                          name="heading"
                                          onChange={(e) =>
                                            setTitle(e.target.value)
                                          }
                                        />
                                      </div>
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
                                    <select
                                      className="form-control input-height"
                                      id="exampleInputPassword1"
                                      name="topic_type"
                                      defaultValue={topicType}
                                      onChange={(e) => {
                                        setTopicType(e.target.value);
                                      }}
                                      required
                                      // ref={topicTypeRef}
                                    >
                                      <option value="Mandatory">
                                        Mandatory
                                      </option>
                                      <option value="Voluntary">
                                        Voluntary
                                      </option>
                                    </select>
                                  </div>
                                </div> */}
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="new_button_style"
                                  >
                                    UPDATE
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
