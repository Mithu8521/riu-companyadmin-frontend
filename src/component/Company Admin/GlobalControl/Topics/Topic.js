import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "../../../Sector_Question_Manage/control.css";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { Modal } from "react-bootstrap";
import CreateSectorQuestionModal from "../../../Sector_Question_Manage/CreateSectorQuestionModal";
import viewQuestion from "../../../../img/sector/viewQuestion.png";
import addQuestion from "../../../../img/sector/addQuestion.png";
import viewKpi from "../../../../img/sector/viewKpi.png";
import edit from "../../../../img/sector/edit.png";
import Delete from "../../../../img/sector/delete.png";

export const Topics = (props) => {
  const {
    frameworkData,
    financial_year_id,
    addQuestionList,
    handleKPIChangeHandler,
    handleAddTopicQuestionChangeHandler,
  } = props;
  const [topics, setTopics] = useState([]);
  const [menulist, setMenuList] = useState([]);
  const [upadteTopic, setUpadteTopic] = useState(false);
  const [addTopic, setAddTopic] = useState(false);
  const closeUpdateFrameworkPopup = () => setUpadteTopic(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("create");
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [currentTopicData, setCurrentTopicData] = useState(null);
  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const handleCloseAddQuestionPopup = () => setShowAddQuestionPopup(false);

  const handleShowAddQuestionPopup = (currentTopicData) => {
    addQuestionList["topicTitle"] = currentTopicData.topicTitle;
    setCurrentTopicData(currentTopicData);
    setShowAddQuestionPopup(true);
  };
  const showAddTopicPopup = () => {
    setAddTopic(true);
    setMode("create");
  };
  const showUpdateTopicPopup = (currentTopicId) => {
    setCurrentTopicId(currentTopicId);
    setMode("edit");
    setAddTopic(true);
  };
  const closeAddTopicPopup = () => {
    setMode("create");
    setAddTopic(false);
  };
  const createTopic = async () => {
    let obj = {};
    obj.type = "CUSTOM";
    obj.topicTitle = title;
    obj.frameworkId = frameworkData?.id;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}createCustomTopic`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setTitle("");
      setTopics(data?.data?.reverse());
      closeAddTopicPopup();
    }
  };
  const callApi = async (id) => {
    if (frameworkData?.id) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getCustomTopicByFrameworkId`,
        {},
        { type: "CUSTOM", frameworkId: frameworkData?.id },
        "GET"
      );
      if (isSuccess) {
        setTopics(data?.data?.reverse());
      }
    }
  };
  const topicUpdate = async () => {
    let obj = {};
    obj.frameworkId = frameworkData?.id;
    obj.type = "CUSTOM";
    obj.topicId = currentTopicId;
    obj.topicTitle = title;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}updateCustomTopic`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setTopics(data?.data?.reverse());
      closeUpdateFrameworkPopup();
    }
  };
  const deleteTopic = async (topicId) => {
    const body = {
      topicId: topicId,
    };
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}deleteCustomTopic`,
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      callApi();
    }
  };
  const handleClickKPIComponent = (KPIComponentData, activetab) => {
    handleKPIChangeHandler(
      KPIComponentData,
      financial_year_id,
      frameworkData,
      activetab
    );
  };

  const handleClickAddTopicQuestionComponent = (addQuestionCopmonentData) => {
    handleAddTopicQuestionChangeHandler(
      addQuestionCopmonentData,
      frameworkData
    );
  };

  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "global_controls"
    );
    setMenuList(settingsMenu?.permissions);
    if (props.frameworkData.id) {
      callApi(props.frameworkData.id);
    }
  }, [props.frameworkData.id]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="heading hstack">
          <h4 className="m-0">{frameworkData.frameworkTitle}</h4>
          <span className="global_link mx-0">
            {/* {menulist?.includes("TOPIC_CREATE") && ( */}
            <>
              <div
                onClick={showAddTopicPopup}
                className="mx-3 add_framework_control"
              >
                <i className="fas fa-plus-square fs-lg" title="Add Topic"></i>
                &nbsp;&nbsp;
              </div>
              {/* <NavLink className="non_underline_link bold" to="/topic/create">
                  <div className="mx-3 add_framework_control" to="/topic/create">
                    <i className="fas fa-plus-square fs-lg" title="Add Topic"></i>&nbsp;&nbsp;
                  </div>
                </NavLink> */}
            </>
            {/* )} */}
          </span>
        </div>
      </div>
      <div className="table_f border-top mt-2 auto_scroll_by_design">
        <Table striped bordered className="mt-2 mb-0">
          <thead>
            <tr className="fixed_tr_section">
              <th style={{ width: 50 }}>Sr.</th>
              <th>Topic</th>
              <th style={{ width: 150, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          {topics && topics?.length > 0 ? (
            <tbody>
              {topics?.map((item, key) => (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{item.topicTitle}</td>
                  <td className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center gap-3 action__image">
                      <div onClick={() => handleShowAddQuestionPopup(item)}>
                        <img
                          style={{ cursor: "pointer" }}
                          src={addQuestion}
                          alt="Add Question"
                          title="Add Question"
                        />
                      </div>
                      <div
                        onClick={(e) =>
                          handleClickKPIComponent(item, "questionList")
                        }
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={viewQuestion}
                          alt="View Question"
                          title="View Question"
                        />
                      </div>
                      <div
                        onClick={(e) => handleClickKPIComponent(item, "kpi")}
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={viewKpi}
                          alt="View KPI"
                          title="View KPI"
                        />
                      </div>
                      {item?.isDeletable && (
                        <>
                          {/* {menulist?.includes("TOPIC_UPDATE") && ( */}
                          <div onClick={(e) => showUpdateTopicPopup(item?.id)}>
                            <img
                              style={{ cursor: "pointer" }}
                              src={edit}
                              alt="Edit Topic"
                              title="Edit Topic"
                            />
                          </div>
                          {/* )}
                        {menulist?.includes("TOPIC_DELETE") && ( */}
                          <div onClick={(e) => deleteTopic(item?.id)}>
                            <img
                              style={{ cursor: "pointer" }}
                              src={Delete}
                              alt="Delete Topic"
                              title="Delete Topic"
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

      <Modal show={addTopic} onHide={closeAddTopicPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {mode === "create" ? "Create" : "Update"} Topic
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            type="text"
            required
            placeholder={
              mode === "create" ? "Create Topic Title" : "Update Topic Title"
            }
            onChange={(e) => setTitle(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          {/* <button
            className="new_button_style__reject"
            onClick={closeAddTopicPopup}
          >
            Cancel
          </button> */}
          <button
            className="new_button_style "
            type="submit"
            onClick={mode === "create" ? createTopic : topicUpdate}
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ------------ Add Question --------- */}
      <Modal
        show={showAddQuestionPopup}
        onHide={handleCloseAddQuestionPopup}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <CreateSectorQuestionModal
              currentTopicData={currentTopicData}
              addQuestionList={addQuestionList}
              frameworkData={frameworkData}
            />
          </div>
        </Modal.Body>
        <Modal.Footer style={{ height: 65 }}> </Modal.Footer>
      </Modal>
    </div>
  );
};
