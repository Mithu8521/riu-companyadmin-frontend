import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import Table from "react-bootstrap/Table";
import "../Sector_Question_Manage/control.css";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import { API_URL } from "../../config/config.json";
import axios from "axios";
import swal from "sweetalert";
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import { apiCall } from "../../_services/apiCall";
import config from "../../../src/config/config.json";
import { Button, Modal } from "react-bootstrap";

export const Frameworks = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [frameworks, setFrameworks] = useState([]);
  const [showEditModal, setEditShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mappingId, setMappingId] = useState(null);
  const [item, setItem] = useState(null);
  const { userPermissionList } = useContext(PermissionMenuContext);
  var currentLocation = window.location.pathname;
  let parts = currentLocation.split("/");
  let path = parts[2];
  const callApi = async () => {
    // let response = await frameworkService.getFrameworks("ALL");
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getFramework`,
      {},
      { type: "ALL" },
      "GET"
    );
    if (isSuccess) {
      setFrameworks(data?.data);
    }
  };
  const deleteFramework = async (fid) => {
    // const token = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(token,"njhnj");
    // const data ={
    //   id:fid,
    //   // company_id:cid,
    //   // framework_mapping_id:framework_mapping_id
    // }
    const { isSuccess, data } = await apiCall(
      `${API_URL}deleteFramework`,
      {},
      { id: fid },
      "POST"
    );
    if (isSuccess) {
      callApi();
    }
    // axios
    // .post(
    //   `${API_URL}deleteFramework`,
    //   data,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  };
  const handleClick = (item) => {
    setEditShowModal(true);
    setItem(item);
  };

  const handleYes = () => {
    if (item && item.framework_mapping_id) {
      history.push({
        pathname: `/frameworks/${item.framework_mapping_id}/update_framework`,
        state: { item: item },
      });
    }
    setEditShowModal(false);
  };

  const handleNo = () => {
    setEditShowModal(false);
  };
  const handleDeleteClick = (mappingId) => {
    setShowModal(true);
    setMappingId(mappingId);
  };

  const handleYesClick = () => {
    deleteFramework(mappingId);
    setShowModal(false);
  };

  const handleNoClick = () => {
    setShowModal(false);
  };
  useEffect(() => {
    callApi();
  }, []);
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
                    <div className="color_div_on framwork_2">
                      <div className="business_detail">
                        <div className="saved_cards">
                          <div className="business_detail">
                            <div className="heading_wth_text">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="heading">
                                  <h4>Framework List</h4>
                                </div>
                                <span className="global_link mx-0">
                                  {userPermissionList.includes(
                                    "FRAMEWORK_CREATE"
                                  ) && (
                                      <NavLink
                                        className="non_underline_link bold"
                                        to="/framework/create"
                                      >
                                        <button
                                          className="new_button_style"
                                          variant="none"
                                          to="/framework/create"
                                        >
                                          ADD Framework
                                        </button>
                                      </NavLink>
                                    )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <hr className="line" />
                          <div className="table_f">
                            <Table striped bordered hover size="sm">
                              <thead>
                                <tr className="heading_color">
                                  <th style={{ width: "5%" }}>Sr.</th>
                                  <th>Framework</th>
                                  {/* <th>Entity</th> */}
                                  {userPermissionList.includes(
                                    "FRAMEWORK_UPDATE"
                                  ) && (
                                      <th style={{ width: "5%" }}>Edit </th>
                                    )}
                                  {userPermissionList.includes(
                                    "FRAMEWORK_DELETE"
                                  ) && (
                                      <th style={{ width: "5%" }}>Delete </th>
                                    )}
                                </tr>
                              </thead>
                              <tbody>
                                {frameworks.map((item, key) => (
                                  <tr key={key}>
                                    {console.log(item, "vbhfvbgh item")}
                                    <td>{key + 1}</td>
                                    <td>{item.title}</td>
                                    {/* <td>{item.entity}</td> */}
                                    {item?.is_editable ? (
                                      <>
                                        {userPermissionList.includes(
                                          "FRAMEWORK_UPDATE"
                                        ) && item?.can_edit === 1 && item?.is_editable == 1 && (
                                            <td>
                                              {/* <NavLink
                                              className="non_underline_link bold view_c"
                                              onClick={(e) =>
                                                handleClick(
                                                  item                                                    
                                                )
                                              }
                                            
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
                                                <path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" />
                                              </svg>
                                            </NavLink> */}
                                              <NavLink
                                                className="non_underline_link bold view_c"
                                                to={{
                                                  pathname: `/frameworks/${item?.framework_mapping_id}/update_framework`,
                                                  state: { item: item },
                                                }}
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
                                                  <path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" />
                                                </svg>
                                              </NavLink>
                                            </td>
                                          )}
                                        {userPermissionList.includes(
                                          "FRAMEWORK_DELETE"
                                        ) && item?.can_edit === 1 && item?.is_editable == 1 && (
                                            <td
                                              className="red"
                                              onClick={(e) =>
                                                handleDeleteClick(
                                                  item?.id,
                                                  item?.company_id
                                                )
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
                                            </td>
                                          )}
                                      </>
                                    ) : (
                                      <>
                                        <td></td>
                                        <td></td>
                                      </>
                                    )}
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
            </section>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal show={showModal} onHide={handleNoClick}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to delete ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleNoClick}>
              No
            </Button>
            <Button variant="primary" onClick={handleYesClick}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showEditModal && (
        <Modal show={showModal} onHide={handleNoClick}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to Edit ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleNo}>
              No
            </Button>
            <Button variant="primary" onClick={handleYes}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
