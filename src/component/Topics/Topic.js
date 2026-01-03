import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import Table from "react-bootstrap/Table";
import "../Sector_Question_Manage/control.css";
import { NavLink, useLocation } from "react-router-dom";
import { topicService } from "../../_services/admin/global-controls/topicService";
import { styled } from "@material-ui/core";
import axios from "axios";
import swal from "sweetalert";
import config from '../../config/config.json';
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import { apiCall } from "../../_services/apiCall";

export const Topics = (props) => {
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const { userPermissionList } = useContext(PermissionMenuContext);
  const callApi = async () => {
    let response = await topicService.getTopics("ALL")
    setTopics(response?.data.reverse());
  };
  useEffect(() => {
    callApi();
  }, []);


  const deleteTopic = async (item) => {
    const token = JSON.parse(localStorage.getItem('currentUser'));
    const body = {
      id: item?.id,
      framework_id: item?.framework_id,
      framework_topic_id: item?.framework_topic_id,
    }
    const { isSuccess, data } = await apiCall(`${config.API_URL}deleteTopic`, {}, body, "POST");
    if (isSuccess) {
      callApi();
    }
    // axios
    // .post(
    //   `${config.API_URL}deleteTopic`,
    //   data,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token?.data?.token}`,
    //     }
    //   },
    // ).then((response) =>{
    //   swal({
    //     icon: 'success',  
    //     title: 'Success', 
    //     text: response?.data?.customMessage,
    //     timer: 2000
    //     })
    //   callApi();
    // }).catch((error) =>{
    //   console.log(error,"error");
    // })
  }
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
                              <div className="business_detail mb-4">
                                <div className="heading">
                                  <div className="heading_wth_text">
                                    <div className="d-flex">
                                      <span className="global_link mx-0">
                                        {userPermissionList.includes("TOPIC_CREATE") && (<NavLink
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
                              <div className="table_f">
                                <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr className="heading_color">
                                      <th style={{ width: "5%" }}>Sr.</th>
                                      <th>Topic</th>
                                      <th>Framework</th>
                                      {/* <th>Entity</th> */}
                                      {userPermissionList.includes("TOPIC_UPDATE") && (<th style={{ width: "5%" }}>Edit </th>)}
                                      {userPermissionList.includes("TOPIC_DELETE") && (<th style={{ width: "5%" }}>Delete </th>)}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topics.map((item, key) => (
                                      <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item?.framework_title}</td>
                                        {/* <td>{item.entity}</td> */}
                                        {userPermissionList.includes("TOPIC_UPDATE") && item?.is_editable == "1" && <td>
                                          <NavLink
                                            className="non_underline_link bold view_c"
                                            to={{ pathname: `/topics/${item?.topic_mapping_id}/update_topic`, state: { item: item } }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" /></svg>
                                            {/* <button className="zoho_view_button_next">
                                            View
                                          </button> */}
                                          </NavLink>
                                        </td>}
                                        {userPermissionList.includes("TOPIC_DELETE") && item?.is_editable == "1" && <td
                                          className="red"
                                          onClick={(e) =>
                                            deleteTopic(item)
                                          }
                                        >
                                          <NavLink
                                            to="#"
                                            className="view_c"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              width="24"
                                              height="24"
                                            >
                                              <path
                                                fill="none"
                                                d="M0 0h24v24H0z"
                                              />
                                              <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zM4 18.385L5.763 17H20V5H4v13.385zM13.414 11l2.475 2.475-1.414 1.414L12 12.414 9.525 14.89l-1.414-1.414L10.586 11 8.11 8.525l1.414-1.414L12 9.586l2.475-2.475 1.414 1.414L13.414 11z" />
                                            </svg>
                                          </NavLink>
                                        </td>}
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
