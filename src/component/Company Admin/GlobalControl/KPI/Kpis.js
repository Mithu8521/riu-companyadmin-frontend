import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "../../../Sector_Question_Manage/control.css";
import { NavLink } from "react-router-dom";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../../src/config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { Dropdown, Modal } from "react-bootstrap";
import CreateSectorQuestionModal from "../../../Sector_Question_Manage/CreateSectorQuestionModal";
import viewQuestion from "../../../../img/sector/viewQuestion.png";
import addQuestion from "../../../../img/sector/addQuestion.png";
import edit from "../../../../img/sector/edit.png";
import Delete from "../../../../img/sector/delete.png";

export const Kpis = (props) => {
  const {
    topicData,
    addQuestionList,
    currentAddFrameworkQuestionData,
    handleAddKpiQuestionChangeHandler,
  } = props;
  const [kpis, setKpis] = useState([]);
  const [title, setTitle] = useState("");
  const [menulist, setMenuList] = useState([]);
  const [entity, setEntity] = useState("company");
  const [currentKpiData, setCurrentKpikData] = useState(null);
  const [currentKpiId, setCurrentKpiId] = useState(null);
  const [showAddKpiPopup, setShowAddKpiPopup] = useState(false);
  const handleCloseAddKpiPopup = () => setShowAddKpiPopup(false);
  const handleShowAddKpiPopup = () => setShowAddKpiPopup(true);
  const handleCloseAddQuestionPopup = () => setShowAddQuestionPopup(false);
  const [showEditKpiPopup, setShowEditKpiPopup] = useState(false);
  const handleCloseEditKpiPopup = () => setShowEditKpiPopup(false);
  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const handleShowAddQuestionPopup = (currentKpikData) => {
    addQuestionList["kpiTitle"] = currentKpikData?.kpiTitle;
    setCurrentKpikData(currentKpikData);
    setShowAddQuestionPopup(true);
  };
  const handleShowEditKpiPopup = (currentKpiId) => {
    setCurrentKpiId(currentKpiId);
    setShowEditKpiPopup(true);
  };

  const createKpi = async () => {
    let obj = {};
    obj.type = "CUSTOM";
    obj.kpiTitle = title;
    obj.topicId = currentAddFrameworkQuestionData?.topic_id;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}createCustomKpi`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setTitle("");
      setKpis(data?.data?.reverse());
      handleCloseAddKpiPopup();
    }
  };

  const callApi = async () => {
    if (
      currentAddFrameworkQuestionData?.topic_id &&
      currentAddFrameworkQuestionData?.id
    ) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getCustomKpiByTopicId`,
        {},
        { type: "CUSTOM", topicId: currentAddFrameworkQuestionData?.topic_id },
        "GET"
      );
      if (isSuccess) {
        setKpis(data?.data?.reverse());
      }
    }
  };

  const kpiUpdate = async () => {
    let obj = {};
    obj.topicId = currentAddFrameworkQuestionData?.topic_id;
    obj.type = "CUSTOM";
    obj.kpiId = currentKpiId;
    obj.kpiTitle = title;
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}updateCustomKpi`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
      setKpis(data?.data?.reverse());
      handleCloseEditKpiPopup();
    }
  };
  const deleteKPI = async (kpiId) => {
    const body = {
      kpiId: kpiId,
    };
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}deleteCustomKpi`,
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      callApi();
    }
  };

  const handleClickAddKpiQuestionComponent = (
    addQuestionCopmonentData,
    tabId
  ) => {
    handleAddKpiQuestionChangeHandler(
      addQuestionCopmonentData,
      currentAddFrameworkQuestionData,
      tabId
    );
  };

  useEffect(() => {
    if (currentAddFrameworkQuestionData.id) {
      callApi();
    }
  }, [
    currentAddFrameworkQuestionData.id,
    currentAddFrameworkQuestionData?.topic_id,
  ]);

  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "global_controls"
    );
    setMenuList(settingsMenu?.permissions);
    callApi();
  }, []);
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="heading hstack">
          <h4 className="m-0">{topicData.topicTitle}</h4>
          <span className="global_link mx-0">
            <div
              onClick={handleShowAddKpiPopup}
              className="mx-3 add_framework_control"
            >
              <i className="fas fa-plus-square fs-lg" title="Add Kpi"></i>
              &nbsp;&nbsp;
            </div>
          </span>
        </div>
      </div>
      <div className="table_f border-top mt-2 auto_scroll_by_design">
        <Table striped bordered className="mt-2 mb-0">
          <thead>
            <tr className="fixed_tr_section">
              <th style={{ width: 50 }}>Sr.</th>
              <th>Kpi</th>
              <th style={{ width: 120, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          {kpis && kpis?.length > 0 ? (
            <tbody>
              {kpis?.map((item, key) => (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{item.kpiTitle}</td>
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
                          handleClickAddKpiQuestionComponent(
                            item,
                            "questionList"
                          )
                        }
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={viewQuestion}
                          alt="View Question"
                          title="View Question"
                        />
                      </div>
                      {item?.isDeletable && (
                        <>
                          {/* {menulist?.includes("KPI_UPDATE") && ( */}
                          <div
                            onClick={(e) => handleShowEditKpiPopup(item?.id)}
                          >
                            <img
                              style={{ cursor: "pointer" }}
                              src={edit}
                              alt="Edit Topic"
                              title="Edit Topic"
                            />
                          </div>
                          {/* )}
                        {menulist?.includes("KPI_DELETE") && ( */}
                          <div onClick={(e) => deleteKPI(item?.id)}>
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
      {/* ------------ Add Kpi --------- */}
      <Modal show={showAddKpiPopup} onHide={handleCloseAddKpiPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Add Kpi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter Kpi Title"
              name="heading"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <button className="link_bal_next_cancel" onClick={handleCloseAddKpiPopup}>
            Cancel
          </button> */}
          <button
            className="new_button_style"
            type="submit"
            onClick={() => createKpi()}
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>

      {/* ------------ Edit kpi --------- */}
      <Modal show={showEditKpiPopup} onHide={handleCloseEditKpiPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Kpi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter kpi Title"
              name="heading"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <button className="link_bal_next_cancel" onClick={handleCloseEditKpiPopup}>
            Cancel
          </button> */}
          <button
            className="new_button_style"
            type="submit"
            onClick={() => kpiUpdate()}
          >
            Update
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
          <Modal.Title>
            <div className="hstack gap-3">
              <div>Add Question</div>
              <div className="form-group">
                <select
                  name="tab_name"
                  id=""
                  onChange={(e) => setEntity(e.target.value)}
                  className="select_one industrylist"
                >
                  <option>Select Entity *</option>
                  <option value="company">For Company</option>
                  <option value="supplier">For Supplier</option>
                </select>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="over__flows_body_sections">
            <CreateSectorQuestionModal
              addQuestionList={addQuestionList}
              currentAddFrameworkQuestionData={currentAddFrameworkQuestionData}
            />
          </div>
        </Modal.Body>
        <Modal.Footer style={{ height: 65 }}></Modal.Footer>
      </Modal>
    </div>
  );
};
