import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import "../../../Sector_Question_Manage/control.css";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import { authenticationService } from "../../../../_services/authentication";
import viewTopic from "../../../../img/sector/ViewTopics.png";
import edit from "../../../../img/sector/edit.png";
import Delete from "../../../../img/sector/delete.png";

export const Frameworks = (props) => {
  const { financial_year_id, handleTopicChangeHandler } = props;

  const [frameworks, setFrameworks] = useState([]);
  const [menulist, setMenuList] = useState([]);
  const [addFramework, setAddFramework] = useState(false);
  const [deleteFrameworkPopup, setDeleteFrameworkPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentFrameworkId, setCurrentFrameworkId] = useState(null);
  const closeAddFrameworkPopup = () => setAddFramework(false);
  const closeDeleteFrameworkPopup = () => setDeleteFrameworkPopup(false);
  const [mode, setMode] = useState("create");
  const [frameWorkTitle, setFrameworkTitle] = useState("");

  const showAddFrameworkPopup = () => {
    setAddFramework(true);
    setMode("create");
  };

  const showDeleteFrameworkPopup = (currentFrameworkId) => {
    setCurrentFrameworkId(currentFrameworkId);
    setDeleteFrameworkPopup(true);
  };

  const getFrameWorkTitle = (e) => {
    const inputValue = e.target.value;
    const isDuplicate = frameworks.some(
      (framework) => framework.frameworkTitle === inputValue
    );
    if (isDuplicate) {
      setIsError(true);
    } else {
      setFrameworkTitle(inputValue);
      setIsError(false);
    }
  };

  const showUpdateFrameworkPopup = (currentFrameworkId) => {
    setCurrentFrameworkId(currentFrameworkId);
    setAddFramework(true);
    setMode("edit");
  };

  const handleFrameworkSubmit = async (e) => {
    e.preventDefault();
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}createCustomFramework`,
      {},
      {
        frameworkTitle: frameWorkTitle,
        financialYearId: financial_year_id?.id,
        type: "CUSTOM",
      },
      "POST"
    );
    if (isSuccess) {
      setFrameworks(data?.data?.reverse());
      closeAddFrameworkPopup();
    }
  };

  const callApi = async () => {
    if (financial_year_id?.id) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getCustomFramework`,
        {},
        {
          type: "CUSTOM",
          companyId: Number(JSON.parse(localStorage.getItem("user_temp_id"))),
        },
        "GET"
      );
      if (isSuccess) {
        setFrameworks(data?.data?.reverse());
      }
    }
  };

  const deleteFramework = async () => {
    let obj = {};
    obj.frameworkId = currentFrameworkId;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}deleteCustomFramework`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setCurrentFrameworkId(null);
      closeDeleteFrameworkPopup();
      callApi();
    }
  };

  const frameworkUpdate = async () => {
    let obj = {};
    obj.type = "CUSTOM";
    obj.frameworkId = currentFrameworkId;
    obj.frameworkTitle = frameWorkTitle;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}updateCustomFramework`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setFrameworks(data?.data?.reverse());
      setCurrentFrameworkId(null);
      closeAddFrameworkPopup();
    }
  };

  const handleClickTopicComponent = (topicComponentData, activeTab) => {
    handleTopicChangeHandler(topicComponentData, financial_year_id, activeTab);
  };

  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "global_controls"
    );
    setMenuList(settingsMenu?.permissions);
    callApi();
  }, [props]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="heading hstack">
          <h4 className="m-0">
            <strong>Framework List</strong>
          </h4>
          {/* {menulist?.includes("FRAMEWORK_CREATE") && ( */}
          <div
            onClick={showAddFrameworkPopup}
            className="mx-3 add_framework_control"
          >
            <i className="fas fa-plus-square fs-lg" title="Add Framework"></i>
            &nbsp;&nbsp;
          </div>
          {/* )} */}
        </div>
      </div>
      <div className="table_f border-top mt-2 auto_scroll_by_design">
        <Table striped bordered className="mt-2 mb-0">
          <thead>
            <tr className="fixed_tr_section">
              <th style={{ width: 50 }}>Sr.</th>
              <th>Framework</th>
              <th style={{ width: 100, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          {frameworks && frameworks?.length > 0 ? (
            <tbody>
              {frameworks &&
                frameworks?.map((item, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{item?.frameworkTitle}</td>
                    <td className="d-flex align-items-center justify-content-center">
                      <div className="d-flex align-items-center gap-3 action__image">
                        <div
                          onClick={(e) =>
                            handleClickTopicComponent(item, "topic")
                          }
                        >
                          <img
                            style={{ cursor: "pointer" }}
                            src={viewTopic}
                            alt="View Topic"
                            title="View Topic"
                          />
                        </div>
                        {item?.isDeletable && (
                          <>
                            {/* {menulist?.includes("FRAMEWORK_UPDATE") && ( */}
                            <div
                              onClick={(e) => showUpdateFrameworkPopup(item.id)}
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                src={edit}
                                alt="Edit Framework"
                                title="Edit Framework"
                              />
                            </div>
                            {/* )}
                            {menulist?.includes("FRAMEWORK_DELETE") && ( */}
                            <div
                              onClick={(e) =>
                                showDeleteFrameworkPopup(item?.id)
                              }
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                src={Delete}
                                alt="Delete Framework"
                                title="Delete Framework"
                              />
                            </div>
                            {/* )} */}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>--</td>
                <td>No Data Found</td>
                <td>--</td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>

      {/* ------------ Add And Edit Framework --------- */}
      <Modal show={addFramework} onHide={closeAddFrameworkPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            {mode === "create" ? "Create" : "Update"} Framework
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            type="text"
            required
            placeholder={
              mode === "create"
                ? "Create Framework Title"
                : "Update Framework Title"
            }
            onChange={(e) => getFrameWorkTitle(e)}
          />
          <span style={{ color: "red" }}>
            {isError && "This Framework Already Exist."}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button
            disabled={isError}
            className="new_button_style"
            type="submit"
            onClick={
              mode === "create" ? handleFrameworkSubmit : frameworkUpdate
            }
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteFrameworkPopup} onHide={closeDeleteFrameworkPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            type="submit"
            onClick={deleteFramework}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
