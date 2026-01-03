import React, { useState, useEffect } from "react";
import config from "../../config/config.json";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import "./working_progress.css";
import { apiCall } from "../../_services/apiCall";
import Loader from "../loader/Loader";
import NoDataFound from "../../img/no.png";
import edit from "./edit.png";
import deletee from "./delete.png";

const Generator = ({ tab, userPermissionList }) => {
  const [processDataList, setProcessDataList] = useState([]);
  const [filterListValue, setFilterListValue] = useState([]);
  const [showAddProcess, setAddProcessShow] = useState(false);
  const [showSkelton, setshowSkelton] = useState(false);
  const [showLoder, setshowLoder] = useState(false);
  const handleAddProcessShow = () => setAddProcessShow(true);
  const [selectedId, setSelectedId] = useState(null);
  const [processName, setProcessName] = useState("");
  const [isError, setIsError] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user_temp_id"));
  const [mode, setMode] = useState("create");
  const [deleteProcessPopup, setDeleteProcessPopup] = useState(false);
  const closeDeleteProcessPopup = () => setDeleteProcessPopup(false);

  const showDeleteProcessPopup = (id) => {
    setSelectedId(id);
    setDeleteProcessPopup(true);
  };

  const handleAddProcessClose = () => {
    setMode("create");
    setIsError(false);
    setAddProcessShow(false);
  };

  const handleShowEditProcess = (id, process) => {
    setSelectedId(id);
    setMode("edit");
    setProcessName(process);
    setAddProcessShow(true);
  };

  const setProcessTitle = (e) => {
    const inputValue = e.target.value;
    const isDuplicate = processDataList.some(
      (data) => data.process === inputValue
    );
    if (isDuplicate) {
      setIsError(true);
    } else {
      setProcessName(inputValue);
      setIsError(false);
    }
  };

  // Create Access Api ---------------
  const createProcess = async (id, e) => {
    setshowLoder(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createProcess`,
      {},
      { process: processName, created_by: userId },
      "POST"
    );
    setshowLoder(false);
    if (isSuccess) {
      // getProcess();
      setProcessName("");
      handleAddProcessClose();
    }
  };

  // Get Access List Api -----------------------
  const getProcess = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getProcess`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      setProcessDataList(data?.data?.reverse());
      setFilterListValue(data?.data);
    }
  };

  // Edit Access Api -----------------------
  const updateProcess = async (e) => {
    setshowLoder(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updateProcess`,
      {},
      { process: processName, id: selectedId },
      "POST"
    );
    setshowLoder(false);
    if (isSuccess) {
      // getProcess();
      setProcessName("");
      setAddProcessShow(false);
    }
  };

  // Delete Access Api -----------------
  const deleteProcess = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `deleteProcess`,
      {},
      { id: selectedId },
      "POST"
    );
    if (isSuccess) {
      // getProcess();
      closeDeleteProcessPopup();
    }
  };

  // Search Api -----------------------------
  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === "") {
      setFilterListValue([...processDataList]);
    } else {
      const filteredResult = processDataList.filter((item) =>
        item.process.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterListValue(filteredResult);
    }
  };
  useEffect(() => {
    // getProcess();
  }, [tab]);
  return (
    <>
      <div
        className="Introduction framwork_2"
        style={{ background: "white", borderRadius: "15px" }}
      >
        <section
          className="forms"
          style={{ background: "white", borderRadius: "15px", padding: "2rem" }}
        >
          <div className="row" style={{ marginBottom: "50px" }}>
            <div className="col-md-12">
              {/* <div className="d-flex align-items-center justify-content-between">
                <div className="directly p-0 hstack gap-2 justify-content-end">
                  <input
                    type="search"
                    className="form-control w-50"
                    placeholder="Search"
                    name="search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {userPermissionList.some(
                    (permission) =>
                      permission.permissionCode === "CREATE" &&
                      permission.checked
                  ) && (
                    <button
                      className="new_button_style_white"
                      onClick={handleAddProcessShow}
                    >
                      Add Process
                    </button>
                  )}
                </div>
              </div> */}
              <div
                className="d-flex w-100 align-items-center justify-content-between"
                style={{ marginBottom: "50px" }}
              >
                <div className="w-100 d-flex justify-content-between">
                  <div style={{ width: "85%" }}>
                    <div style={{ position: "relative", width: "100%" }}>
                      <span
                        className="search-icon"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          fontSize: "16px",
                          color: "#3f8aa5",
                          pointerEvents: "none", // Make it non-clickable
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </span>

                      <input
                        type="search"
                        className="w-100"
                        style={{
                          borderRadius: "5px",
                          border: "1px solid #3f8aa5",
                          padding: "10px 30px 10px 35px", // Adjust padding to make space for the icon
                        }}
                        placeholder="Search"
                        name="search"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {userPermissionList.some(
                    (permission) =>
                      permission.permissionCode === "CREATE" &&
                      permission.checked
                  ) && (
                      <div>
                        <button
                          className=""
                          onClick={handleAddProcessShow}
                          style={{
                            background: "#3F8AA5",
                            border: "none",
                            padding: "10px 30px",
                            borderRadius: "5px",
                            color: "white",
                          }}
                        >
                          Add Process
                        </button>
                      </div>
                    )}
                </div>
              </div>
              {filterListValue && filterListValue?.length > 0 ? (
                <div className="table_setting">
                  <Table striped bordered hover style={{ marginBottom: "0px" }}>
                    <thead thead style={{ border: "none" }}>
                      <tr className="fixed_tr_section" style={{
                        border: "none",
                        borderBottom: "2px solid #83BBD5",
                      }}>
                        <th style={{
                          width: 60,
                          border: "none",
                          color: "#11546f",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}>#</th>
                        <th style={{
                          border: "none",
                          color: "#11546f",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}>Process</th>
                        <th style={{
                          border: "none",
                          color: "#11546f",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}>
                          Action{" "}
                        </th>
                      </tr>
                    </thead>
                  </Table>

                  {!showSkelton ? (
                    filterListValue && filterListValue?.length > 0 ? (
                      filterListValue.map((data, index) => {
                        return (
                          <div key={index} style={{ display: "flex", width: "100%", paddingBottom: "30px", paddingTop: "30px", borderBottom: "2px solid #83BBD5", }}>
                            <div style={{
                              width: "6%",
                              color: "#3f8aa5",
                              fontSize: "16px",
                            }} >{index + 1}</div >
                            <div style={{
                              width: "84%",
                              color: "#3f8aa5",
                              fontSize: "16px",
                            }}>{data?.process}</div>

                            <div style={{
                              display: "flex",
                              gap: "10px",
                              width: "10%",
                            }}>
                              <>
                                {data?.is_deletable &&
                                  userPermissionList.some(
                                    (permission) =>
                                      permission.permissionCode ===
                                      "EDIT" && permission.checked
                                  ) && (
                                    <div
                                      onClick={() =>
                                        handleShowEditProcess(
                                          data?.id,
                                          data?.process
                                        )
                                      }
                                    >
                                      <img src={edit} />
                                    </div>
                                  )}
                              </>
                              {data?.is_deletable &&
                                userPermissionList.some(
                                  (permission) =>
                                    permission.permissionCode ===
                                    "DELETE" && permission.checked
                                ) && (
                                  <div
                                    onClick={() => {
                                      showDeleteProcessPopup(data?.id);
                                    }}
                                  >
                                    <img src={deletee} />

                                  </div>
                                )}
                            </div>

                          </div>
                        );
                      })
                    ) : (
                      <tr>
                        <td>--</td>
                        <td>No Data Found</td>
                        <td>--</td>
                      </tr>
                    )
                  ) : (
                    <Loader />
                  )}


                </div>
              ) : (
                <div className="hstack justify-content-center">
                  <img src={NoDataFound} alt="" srcSet="" />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Add/Edit Process --------------------- */}
      <Modal show={showAddProcess} onHide={handleAddProcessClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "create" ? "Create" : "Update"} Process
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            type="text"
            defaultValue={mode === "create" ? "" : processName}
            placeholder="Enter Process Name"
            onChange={(e) => setProcessTitle(e)}
          />
          <span style={{ color: "red" }}>
            {isError && "This Process Already Exist."}
          </span>
        </Modal.Body>
        <Modal.Footer>
          {showLoder ? (
            <Button variant="info" disabled>
              <Spinner animation="border" />{" "}
              {mode === "create" ? "Creating" : "Updating"}
            </Button>
          ) : (
            <Button
              variant="info"
              disabled={isError || (processName === "" ? true : false)}
              onClick={mode === "create" ? createProcess : updateProcess}
            >
              {mode === "create" ? "Create Process" : "Update Process"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {/* Delete Process ------------------------ */}
      <Modal show={deleteProcessPopup} onHide={closeDeleteProcessPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            type="submit"
            onClick={() => deleteProcess()}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Generator;
