import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import Loader from "../loader/Loader";
import NoDataFound from "../../img/no.png";
import edit from "./edit.png";
import deletee from "./delete.png";

const DesignationManagement = (props) => {
  const { tab, userPermissionList } = props;
  console.log(userPermissionList, "DesignationManagement");
  const [showSkelton, setshowSkelton] = useState(false);
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const handleShowAddDesignation = () => setShowAddDesignation(true);
  const [selectedId, setSelectedId] = useState(null);
  const [designationName, setDesignationName] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [filterListValue, setFilterListValue] = useState([]);
  const [isError, setIsError] = useState(false);
  const [mode, setMode] = useState("create");
  const [deleteDesignationPopup, setDeleteDesignationPopup] = useState(false);
  const closeDeleteDesignationPopup = () => setDeleteDesignationPopup(false);

  const showDeleteDesignationPopup = (id) => {
    setSelectedId(id);
    setDeleteDesignationPopup(true);
  };

  const handleShowEditDesignation = (id, designation) => {
    setMode("edit");
    setSelectedId(id);
    setDesignationName(designation);
    setShowAddDesignation(true);
  };

  const handleCloseAddDesignation = (id) => {
    setMode("create");
    setIsError(false);
    setShowAddDesignation(false);
  };

  const setDesignationTitle = (e) => {
    const inputValue = e.target.value;
    const isDuplicate = originalData.some(
      (data) => data.designation === inputValue
    );
    if (isDuplicate) {
      // setDesignationName(inputValue);
      setIsError(true);
    } else {
      setDesignationName(inputValue);
      setIsError(false);
    }
  };
  const createDesignation = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createDesignation`,
      {},
      { designation: designationName },
      "POST"
    );
    if (isSuccess) {
      getDesignation();
      setDesignationName("");
      handleCloseAddDesignation();
    }
  };

  const updateDesignation = async (e) => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updateDesignation`,
      {},
      { designation: designationName, id: selectedId },
      "POST"
    );
    if (isSuccess) {
      getDesignation();
      setDesignationName("");
      handleCloseAddDesignation();
    }
  };
  const deleteDesignation = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `deleteDesignation`,
      {},
      { id: selectedId },
      "POST"
    );
    if (isSuccess) {
      getDesignation();
      closeDeleteDesignationPopup();
    }
  };

  const getDesignation = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getDesignation`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      const reversedData = data?.data?.reverse();
      setOriginalData(reversedData);
      setFilterListValue(reversedData);
    }
  };

  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === "") {
      setFilterListValue([...originalData]);
    } else {
      const filteredResult = originalData.filter((item) =>
        item.designation.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterListValue(filteredResult);
    }
  };

  useEffect(() => {
    getDesignation();
  }, [tab]);

  return (
    <div>
      <div className="Introduction" style={{ background: "white", borderRadius: "15px", padding: "2rem" }}>
        <div className="d-flex align-items-center justify-content-between">
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
                  permission.permissionCode === "CREATE" && permission.checked
              ) && (
                  <div>
                    <button
                      className=""
                      onClick={handleShowAddDesignation}
                      style={{
                        background: "#3F8AA5",
                        border: "none",
                        padding: "10px 30px",
                        borderRadius: "5px",
                        color: "white",
                      }}
                    >
                      Add Designation
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
        {filterListValue && filterListValue?.length > 0 ?
          (
            <div className="table_setting">
              <Table striped bordered>
                <thead style={{ border: "none" }}>
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
                      width: "56vw",
                      fontWeight: 600,
                    }}>Designation </th>
                    <th style={{
                      border: "none",
                      color: "#11546f",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}>Action</th>
                  </tr>
                </thead>
              </Table>

              {!showSkelton ? (
                <div style={{ width: "100%" }}>
                  {filterListValue && filterListValue?.length > 0 ? (
                    filterListValue?.map((item, key) => (
                      <div style={{ display: "flex", width: "100%", padding: "20px 0px", borderBottom: "2px solid #3f8aa5 " }} key={key}>
                        <div style={{
                          width: "6%",
                          color: "#3f8aa5",
                          fontSize: "16px",
                        }}>{key + 1}</div>
                        <div style={{
                          width: "79%",
                          color: "#3f8aa5",
                          fontSize: "16px",
                        }}>{item?.designation}</div>
                        <div style={{
                          display: "flex",
                          gap: "10px",
                          width: "15%",
                        }}>
                          {userPermissionList.some(
                            (permission) =>
                              permission.permissionCode === "EDIT" &&
                              permission.checked
                          ) && (
                            <>
                                <img
                                  src={edit}
                                  onClick={() =>
                                    item?.is_deletable &&     handleShowEditDesignation(
                                      item?.id,
                                      item?.designation
                                    )
                                  }
                                  style={{
                                    cursor: item?.is_deletable ? "pointer" : "not-allowed",
                                    opacity: item?.is_deletable ? 1 : 0.5,
                                  }}
                                />
                            </>
                              
                            )}
                          &nbsp;&nbsp;
                          {userPermissionList.some(
                            (permission) =>
                              permission.permissionCode === "DELETE" &&
                              permission.checked
                          ) && (
                            <>
                              <img
                                src={deletee}
                                onClick={() =>
                                  item?.is_deletable && showDeleteDesignationPopup(item?.id)
                                }
                                style={{
                                  cursor: item?.is_deletable ? "pointer" : "not-allowed",
                                  opacity: item?.is_deletable ? 1 : 0.5,
                                }}
                              />
                            </>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <tr>
                      <td>--</td>
                      <td>No Data Found</td>
                      <td>--</td>
                    </tr>
                  )}
                </div>
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
      {/* Add/Edit Designation ------------------- */}
      <Modal show={showAddDesignation} onHide={handleCloseAddDesignation}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>
              {mode === "create" ? "Create" : "Update"} Designation
            </Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Designation Name"
            defaultValue={mode === "create" ? "" : designationName}
            onChange={(e) => setDesignationTitle(e)}
          />
          <span style={{ color: "red" }}>
            {isError && "This Designation Already Exist."}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            type="submit"
            disabled={isError || (designationName === "" ? true : false)}
            onClick={mode === "create" ? createDesignation : updateDesignation}
          >
            {mode === "create" ? "Create Designation" : "Update Designation"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteDesignationPopup} onHide={closeDeleteDesignationPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Confirmation</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            type="submit"
            onClick={() => deleteDesignation()}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DesignationManagement;
