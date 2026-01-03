import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
// import { topicService } from '../../_services/admin/global-controls/topicService';
// import { frameworkService } from '../../_services/admin/global-controls/frameworkService';
// import axios from 'axios';
import config from "../../config/config.json";
// import config from "../../../src/config/config.json";
import { apiCall } from "../../_services/apiCall";

export const CreateTopic = (props) => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  // const [topicType, setTopicType] = useState("Mandatory");
  const [framework, setFramework] = useState("");
  const [frameworks, setFrameworks] = useState("");
  // const [entity,setEntity] = useState("");
  // const [companyId,setCompanyId] = useState(localStorage.getItem('user_temp_id'));
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

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
    // axios.get(`${config.API_URL}getFramework?type=TOPIC`,{
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   }
    // }).then((response) =>{
    //     setFrameworks(response?.data?.data);
    // }).catch((error) =>{
    //   console.log(error);
    // })
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.title = title;
    obj.framework_id = parseInt(framework);
    // obj.is_mendatory = topicType === "Mandatory" ? "YES" : "NO";
    // obj.entity=entity;
    // obj.company_id = localStorage.getItem('user_temp_id');
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}createTopic`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setTitle("");
      window.location.href = config.baseURL + "/#/topics";
    }
  };
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
                                    <h4>Add Topic</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    {/* <div className="col-lg-6 col-xs-6">
                                      <div className="form-group pb-3">
                                        <label htmlFor="industryType" className="mb-2" > Select Entity* </label>
                                        <select name="tab_name" onChange={(e) => setEntity(e.target.value)} className="select_one industrylist" >
                                          <option value="company">Company</option>
                                          <option value="supplier">Supplier</option>
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
                                          onChange={(e) =>
                                            setFramework(e.target.value)
                                          }
                                          className="select_one industrylist"
                                        >
                                          <option>Select Framework</option>
                                          {frameworks &&
                                            frameworks?.map((item, key) => (
                                              <option key={key} value={item.id}>
                                                {item.title}
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
                                          placeholder="topic title"
                                          defaultValue={title}
                                          onChange={(e) =>
                                            setTitle(e.target.value)
                                          }
                                          required
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
