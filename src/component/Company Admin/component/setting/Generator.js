import React, { useEffect, useState } from "react"
import Sidebar from "../../../sidebar/sidebar"
import Header from "../../../header/header"
import { NavLink, useLocation } from "react-router-dom"
import { authenticationService } from "../../../../_services/authentication"
import config from "../../../../config/config.json"
import { Table } from "react-bootstrap"
import swal from "sweetalert"
import axios from "axios"
import "./working_progress.css"
import { PermissionMenuContext } from "../../../../contextApi/permissionBasedMenuContext"
import view from '../../../../img/view.png'
import Delete from '../../../../img/delete.png'

const baseURL = config.baseURL
const currentUser = authenticationService.currentUserValue
export default function Generator(props) {
  const location = useLocation()
  const [meterDataList, setMeterDataList] = useState()
  const [processDataList, setProcessDataList] = useState()
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  )

  const callApi = () => {
    axios
      .get(
        `${config.API_URL}getMeterId?current_role=${localStorage.getItem("role")}`,
        //company_id=${localStorage.getItem("user_temp_id")}&
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setMeterDataList(response?.data?.data)
      })
      .catch((error) => {
      })
  }
  const callApiForProcess = () => {
    axios
      .get(
        `${config.API_URL}getProcessId?company_id=${localStorage.getItem(
          "user_temp_id"
        )}&current_role=${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setProcessDataList(response?.data?.data)
      })
      .catch((error) => {
      })
  }
  const deleteMeter = (id) => {
    axios
      .post(
        `${config.API_URL}deleteMeterId`,
        {
          id: id,
          current_role: localStorage.getItem("role"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        callApi()
        swal({
          icon: "success",
          title: "Success",
          text: response.data.customMessage,
          timer: 2000,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const deleteProcess = (id) => {
    axios
      .post(
        `${config.API_URL}deleteProcessId`,
        {
          id: id,
          current_role: localStorage.getItem("role"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        callApiForProcess()
        swal({
          icon: "success",
          title: "Success",
          text: response.data.customMessage,
          timer: 2000,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    callApi()
    callApiForProcess()
  }, [])


  return (
    <PermissionMenuContext.Consumer>
      {({ userPermissionList }) => (
        <div>
          <Header />
          <Sidebar dataFromParent={props.location.pathname} />
          <div className="main_wrapper">
            <div className="inner_wraapper pt-0">
              <div className="container-fluid">
                <section className="d_text">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="question_type_filter">
                          <NavLink to="/settings">My Profile</NavLink>
                          {/*<NavLink to="/Google_2FA">Two Factor Authentication</NavLink>*/}
                          {userPermissionList.includes("GET ALL SUBSCRIPTION") && (
                            <NavLink to="/Setting_Billing">Billing</NavLink>
                          )}
                          {userPermissionList.includes("CREATE SUB USER") && (
                            <NavLink to="/sub_accounts">Sub Accounts</NavLink>
                          )}
                          <NavLink to="/generator" className="selected_question_type">
                            Generator
                          </NavLink>
                        </div>
                        <div className="Introduction framwork_2">
                          <section className="forms">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="">
                                  {userPermissionList.includes(
                                    "CREATE_METER_ID"
                                  ) && (
                                      <div className="d-flex align-items-center justify-content-between">
                                        <div className="heading">
                                          <h4>Source List</h4>
                                        </div>
                                        <div className="directly p-0">
                                          <NavLink
                                            className="non_underline_link bold"
                                            to="/generator/create"
                                          >
                                            <button
                                              className="new_button_style"
                                              variant="none"
                                            >
                                              ADD SOURCE
                                            </button>
                                          </NavLink>
                                        </div>
                                      </div>
                                    )}
                                  <hr className="line"></hr>
                                </div>

                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th style={{ width: "5%" }}>S No.</th>
                                        {/* <th>Source ID</th> */}
                                        <th>Source</th>
                                        {/* <th>Unit</th> */}
                                        {userPermissionList.includes(
                                          "UPDATE_METER_ID"
                                        ) && (
                                            <th style={{ width: "5%" }}>Edit </th>
                                          )}
                                        {userPermissionList.includes(
                                          "DELETE_METER_ID"
                                        ) && (
                                            <th style={{ width: "5%" }}>
                                              Delete{" "}
                                            </th>
                                          )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {meterDataList &&
                                        meterDataList.map((data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td>{index + 1}</td>
                                              {/* <td>{data?.meter_id}</td> */}
                                              <th>{data?.process}</th>
                                              {/* <td>{data?.unit}</td> */}
                                              {userPermissionList.includes(
                                                "UPDATE_METER_ID"
                                              ) && (
                                                  <td>
                                                    {data?.is_editable == "1" && (
                                                      <NavLink
                                                        className="non_underline_link bold view_c"
                                                        to={{
                                                          pathname: `/generator/${data?.id}/update_meter`,
                                                          state: {
                                                            item: data,
                                                          },
                                                        }}
                                                      >
                                                        <img src={view} alt="" />
                                                      </NavLink>
                                                    )}
                                                  </td>
                                                )}
                                              {userPermissionList.includes(
                                                "DELETE_METER_ID"
                                              ) &&
                                                data?.is_editable == "1" && (
                                                  <td className="red view_c">
                                                    {data?.is_editable && (
                                                      <div
                                                        onClick={() => {
                                                          deleteMeter(data?.id)
                                                        }}
                                                      >
                                                        <img src={Delete} alt="" />
                                                      </div>
                                                    )}
                                                  </td>
                                                )}
                                            </tr>
                                          )
                                        })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                        <div className="Introduction framwork_2 mt-4">
                          <section className="forms">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="">
                                  {userPermissionList.includes(
                                    "CREATE_METER_ID"
                                  ) && (
                                      <div className="d-flex align-items-center justify-content-between">
                                        <div className="heading">
                                          <h2>Process List</h2>
                                        </div>
                                        <div className="directly p-0">
                                          <NavLink
                                            className="non_underline_link bold"
                                            to="/generator/create_process"
                                          >
                                            <button
                                              className="new_button_style"
                                              variant="none"
                                            >
                                              ADD PROCESS
                                            </button>
                                          </NavLink>
                                        </div>
                                      </div>
                                    )}
                                  <hr className="line"></hr>
                                </div>

                                <div className="table_f">
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr className="heading_color">
                                        <th>Sr.</th>
                                        {/* <th>Source ID</th> */}
                                        <th>Process</th>
                                        {/* <th>Unit</th> */}
                                        {userPermissionList.includes(
                                          "UPDATE_METER_ID"
                                        ) && (
                                            <th style={{ width: "5%" }}>Edit </th>
                                          )}
                                        {userPermissionList.includes(
                                          "DELETE_METER_ID"
                                        ) && (
                                            <th style={{ width: "5%" }}>
                                              Delete{" "}
                                            </th>
                                          )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {processDataList &&
                                        processDataList.map((data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td>{index + 1}</td>
                                              {/* <td>{data?.meter_id}</td> */}
                                              <th>{data?.process}</th>
                                              {/* <td>{data?.unit}</td> */}
                                              {/* {userPermissionList.includes(
                                                "UPDATE_METER_ID"
                                              ) && ( */}
                                              <td style={{ width: "5%" }}>
                                                {data?.is_editable == "1" && (
                                                  <NavLink
                                                    className="non_underline_link bold view_c"
                                                    to={{
                                                      pathname: `/generator/${data?.id}/update_process`,
                                                      state: {
                                                        item: data,
                                                      },
                                                    }}
                                                  >
                                                    <img src={view} alt="" />
                                                  </NavLink>
                                                )}
                                              </td>
                                              {/* )}
                                              {userPermissionList.includes(
                                                "DELETE_METER_ID"
                                              ) &&
                                                data?.is_editable == "1" && ( */}
                                              <td
                                                className="red view_c"
                                                style={{ width: "5%" }}
                                              >
                                                {data?.is_editable && (
                                                  <div
                                                    onClick={() => {
                                                      deleteProcess(data?.id)
                                                    }}
                                                  >
                                                    <img src={Delete} alt="" />
                                                  </div>
                                                )}
                                              </td>
                                              {/* )} */}
                                            </tr>
                                          )
                                        })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </PermissionMenuContext.Consumer>
  )
}
