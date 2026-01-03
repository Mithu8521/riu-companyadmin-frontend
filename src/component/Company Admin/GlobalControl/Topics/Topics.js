import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../sidebar/admin_sidebar";
import AdminHeader from "../header/admin_header";
import Table from "react-bootstrap/Table";
import "../Sector_Question_Manage/control.css";
import { NavLink, useLocation } from "react-router-dom";
import { topicService } from "../../_services/admin/global-controls/topicService";
import { PermissionContext } from "../../context/PermissionContext";
import { apiCall } from "../../_services/apiCall";
import config from "../../../src/config/config.json";

export const Topics = () => {
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const { permissions } = useContext(PermissionContext);

  const callApi = async () => {
    // let response = await topicService.getTopics("ALL")
    // console.log(response,"res");
    const { isSuccess, data } = await apiCall(`${config.ADMIN_API_URL}getTopic`, {}, { type: "ALL" }, "GET")
    setTopics(data?.data);
  };

  const deleteTopic = async (e, item) => {
    let obj = {};
    obj.framework_id = item?.framework_id;
    obj.id = item?.id;
    obj.framework_topic_id = item?.framework_topic_id;
    // await topicService.deleteTopic(obj)
    await apiCall(`${config.ADMIN_API_URL}deleteTopic`, {}, obj, "POST")
    callApi()
  }

  useEffect(() => {
    callApi();
  }, []);
  // console.log(topics,"topics")
  return (
    <div>
      <AdminSidebar dataFromParent={location.pathname} />
      <AdminHeader />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="d_text">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="col-sm-12">
                          <div className="color_div_on framwork_2">
                            <div className="business_detail">
                              <div className="saved_cards">
                                <div className="business_detail">
                                  <div className="heading_wth_text">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="heading">
                                        <h4>Topic List</h4>
                                      </div>
                                      <span className="global_link mx-0">
                                        {permissions.includes("TOPIC_CREATE") && (<NavLink
                                          className="non_underline_link bold"
                                          to="/topic/create"
                                        >
                                          <button
                                            className="link_bal_next page_width white"
                                            variant="none"
                                            to="/topic/create"
                                          >
                                            ADD Topic
                                          </button>
                                        </NavLink>)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr className="line" />
                              <div className="table_f">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th style={{ width: "5%" }}>Sr.</th>
                                      <th>Topic</th>
                                      <th>Framework</th>
                                      {permissions.includes("TOPIC_UPDATE") && (<th style={{ width: "5%" }}>Edit </th>)}
                                      {permissions.includes("TOPIC_DELETE") && (<th style={{ width: "5%" }}>Delete </th>)}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topics?.map((item, key) => (
                                      <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item?.framework_title}</td>
                                        {permissions.includes("TOPIC_UPDATE") && (<td>
                                          <NavLink
                                            className="non_underline_link bold view_c"
                                            to={{ pathname: "/topics/" + item?.id + "/update_topic", state: { item: item } }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" /></svg>

                                          </NavLink>
                                        </td>)}
                                        {permissions.includes("TOPIC_DELETE") && (<td className="red" onClick={(e) => deleteTopic(e, item)}>
                                          <NavLink to="#" className="view_c">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM4 18.385L5.763 17H20V5H4v13.385zM13.414 11l2.475 2.475-1.414 1.414L12 12.414 9.525 14.89l-1.414-1.414L10.586 11 8.11 8.525l1.414-1.414L12 9.586l2.475-2.475 1.414 1.414L13.414 11z" /></svg>
                                          </NavLink>
                                        </td>)}
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
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
