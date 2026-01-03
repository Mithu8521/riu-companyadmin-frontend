import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
import { useLocation } from "react-router-dom";
import "../../../Sector_Question_Manage/control.css";
// import { topicService } from '../../_services/admin/global-controls/topicService';
// import { frameworkService } from '../../_services/admin/global-controls/frameworkService';
import config from "../../../../../src/config/config.json";
import { apiCall } from "../../../../_services/apiCall";

// import { companyService } from '../../_services/admin/global-controls/companyService';
// import config from "../../config/config.json";
// const axios = require("axios");

export const EditTopic = () => {
  // var currentLocation = window.location.pathname;
  // let parts = currentLocation.split("/");
  // let path = parts[2];
  const location = useLocation();
  const [data] = useState(location?.state?.item);
  // const [title, setTitle] = useState("");
  // const [topicMappingId, setTopicMappingId] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [framework, setFramework] = useState(data?.framework_id);
  const [topic, setTopic] = useState(data?.title);
  const [topicType, setTopicType] = useState(
    location?.state?.item?.is_mendatory === "YES" ? "Mandatory" : "Voluntary"
  );
  // const [selectedCompany,setSelectedCompany] = useState(0);
  // const [entity, setEntity] = useState(data?.entity);
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.id = data.id;
    obj.title = topic;
    obj.framework_id = framework;
    obj.framework_topic_id = data.framework_topic_id;
    obj.is_mendatory = topicType === "Mandatory" ? "YES" : "NO";
    // topicService.updateTopic(obj)
    const { isSuccess } = await apiCall(`${config.ADMIN_API_URL}updateTopic`, {}, obj, "POST");
    if (isSuccess) {
      window.location.href = config.baseURL + `/#/topics`;
    }

  }
  const callApi = async () => {
    // let response = await companyService.getCompany();
    // setCompany(response?.data);
    // let framworkresponse = await frameworkService.getFrameworks("TOPIC");
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getFramework`, {}, { type: "TOPIC" }, "GET");
    setFrameworks(data?.data);
  };

  //   const handleEntityChange = async (e) => {
  //   axios
  //     .get(`${config.ADMIN_API_URL}getFramework`, {
  //       params: {
  //         type:"ADD_DATA_AVAILABLE"
  //       },
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

  //   const getTopicByID = async () => {
  //     let data = await topicService.getTopicByID(path)
  //     setTitle(data.data[0].title)
  //     setFramework(data.data[0].framework_id)
  //   setSelectedCompany(data.data[0].company_id)
  //   setTopicMappingId(data.data[0].topic_mapping_id)
  // }

  // const handleCompanyChange=async(e)=>{
  //   let val=e.target.value
  //   setSelectedCompany(val)
  //   if(val==0){
  //     let response = await frameworkService.getFrameworks();
  //     setFrameworks(response?.data);
  //   }
  //   else{
  //     let response = await frameworkService.getFrameworksAccordingToCompany(val);
  //     setFrameworks(response?.data);
  //   }
  // }

  useEffect(() => {
    // getTopicByID();
    callApi();
    // handleEntityChange();
  }, []);
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
                                    <h4>Update Topics</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">

                                    <div className="col-lg-6 col-xs-6 mt-3">
                                      <div className="form-group pb-3">
                                        <label htmlFor="industryType" className="mb-2" > Framework* </label>
                                        <input
                                          className="form-control input-height"
                                          id="exampleInputPassword1"
                                          name="framework"
                                          required
                                          readOnly
                                          value={location?.state?.item?.framework_title}
                                        />
                                        {/* <select name="tab_name" onChange={(e) => {setFramework(e.target.value)} } value={framework} className="select_one industrylist" required>
                                          <option value="">Select Framework</option>
                                          {frameworks && frameworks.map((item, key) => (
                                            <option key={key}  value={item.id}>{item?.title}</option>
                                          ))}
                                        </select> */}
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6 mt-3">
                                      <div className="form-group">
                                        <label htmlFor="questionHeading" className="mb-2" >
                                          Topic
                                        </label>
                                        <input type="text" className="form-control py-3" id=" questionHeading" value={topic} placeholder="Enter Framework Heading" name="heading" onChange={(e) => setTopic(e.target.value)} />
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
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button type="submit" className="page_width page_save" >
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
  )
}
