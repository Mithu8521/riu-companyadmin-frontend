import React, { useState } from "react";
import { Frameworks } from "./Frameworks";
import { Topics } from "../Topics/Topic";
import { Kpis } from "../KPI/Kpis";
import GlobalControlFinancialYear from "../Control/GlobalControlFinancialYear";
import AdminSidebar from "../../../sidebar/sidebar";
import AdminHeader from "../../../header/header";
import { useLocation } from "react-router-dom";
import { SectorQuestionFrameworkWise } from "../../../Sector_Question_Manage/sectorQuestionindustrywise";

export const FrameworkTopicKpiTabs = (props) => {
  const [data, setData] = useState(props.data);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("financial");
  const [viewQuestionList, setViewQuestionList] = useState({});
  const [addQuestionList, setAddQuestionList] = useState({});
  const [activeFramework, setActiveFramework] = useState(false);

  const [activeTopic, setActiveTopic] = useState(false);
  const [activeAddQuestionData, setActiveAddQuestionData] = useState(false);
  const [activeQuestionList, setActiveQuestionList] = useState(false);
  const [currentTopicData, setCurrentTopicData] = useState({});
  const [currentAddFrameworkQuestionData, setCurrentAddFrameworkQuestionData] =
    useState({});
  const [currentAddTopicQuestionData, setCurrentAddTopicQuestionData] =
    useState({});

  const [activeKPI, setActiveKPI] = useState(false);
  const [currentKPIData, setCurrentKPIData] = useState({});

  const handleFrameworkChangeHandler = (data, tabId) => {
    if (tabId !== "supplierquestionList") {
      setActiveFramework(true);
    }
    setActiveTab(tabId);
    setData(data);
  };

  const handleTopicChangeHandler = (data, finalYearData, tabId) => {
    setViewQuestionList({ frameworkId: data?.id });
    setAddQuestionList({ frameworkTitle: data?.frameworkTitle });
    setActiveTopic(true);
    setActiveTab(tabId);
    setCurrentTopicData(data);
    setData(finalYearData);
    setCurrentAddFrameworkQuestionData(data);
  };

  const handleAddFrameworkQuestionChangeHandler = (data) => {
    setActiveAddQuestionData(true);
    setCurrentAddFrameworkQuestionData(data);
  };

  const handleActiveQuestionListHandler = (data) => {
    // setActiveQuestionList(true);
    // setCurrentAddFrameworkQuestionData(data);
  };

  const handleAddTopicQuestionChangeHandler = (data, framworkData) => {
    setActiveAddQuestionData(true);
    framworkData["topic_id"] = data.id;
    setCurrentAddFrameworkQuestionData(framworkData);
  };

  const handleAddKpiQuestionChangeHandler = (data, topicData, tabId) => {
    setViewQuestionList((prevData) => ({ ...prevData, kpiId: data.id }));
    setAddQuestionList((prevData) => ({
      ...prevData,
      kpiTitle: data.kpiTitle,
    }));
    setActiveAddQuestionData(true);
    setActiveTab(tabId);
    topicData["kpi_id"] = data.id;
    setCurrentAddFrameworkQuestionData(topicData);
    setCurrentAddTopicQuestionData(data);
  };

  const handleKPIChangeHandler = (
    data,
    finalYearData,
    frameworkData,
    tabId
  ) => {
    frameworkData["topic_id"] = data.id;
    setViewQuestionList((prevData) => ({ ...prevData, topicId: data.id }));
    setAddQuestionList((prevData) => ({
      ...prevData,
      topicTitle: data.topicTitle,
    }));
    setCurrentAddFrameworkQuestionData(frameworkData);
    setActiveTab(tabId);
    setActiveKPI(true);
    setCurrentKPIData(data);
    setData(finalYearData);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFrameworkTabClose = (event, tabId) => {
    event.stopPropagation();
    if (activeTab === tabId) {
      setActiveTab("financial");
      setActiveFramework(false);
      setActiveTopic(false);
      setActiveKPI(false);
    }
  };

  const handleTopicTabClose = (event, tabId) => {
    event.stopPropagation();
    if (activeTab === tabId) {
      setActiveTab("framework");
      setActiveTopic(false);
      setActiveKPI(false);
    }
  };

  const handleKpiTabClose = (event, tabId) => {
    event.stopPropagation();
    if (activeTab === tabId) {
      setActiveTab("topic");
      setActiveKPI(false);
    }
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div style={{ flex: "0 0 21%", position: "sticky", top: 0, zIndex: 999 }}>
        <AdminSidebar dataFromParent={location.pathname} />
      </div>
      <div style={{ flex: "1 1 79%" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <AdminHeader />
        </div>
        <div className="main_wrapper">
          <div className="inner_wraapper px-3 pt-3">
            <div className="color_div_on framwork_2">
              <div className="tab-container">
                <div className="tab-menu mb-2 d-flex align-items-center justify-content-between tab__bg">
                  <ul>
                    {/* --------------- Financial Year Tab ----------------------- */}

                    <li>
                      <div
                        className={`tab-a ${activeTab === "financial" ? "active-a" : ""
                          }`}
                        onClick={() => handleTabClick("financial")}
                        data-id="financial"
                      >
                        Financial Year
                      </div>
                    </li>

                    {/* --------------- Framework Tab ----------------------- */}

                    <li>
                      <div
                        className={`tab-a ${activeTab === "framework"
                          ? "active-a"
                          : "" ||
                          (activeFramework === true ? "d-block" : "d-none")
                          }`}
                        onClick={() => handleTabClick("framework")}
                        data-id="framework"
                      >
                        Framework
                        <span
                          className="close_tab_cell"
                          title="Close Framework"
                          onClick={(e) => handleFrameworkTabClose(e, "framework")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </span>
                      </div>
                    </li>

                    {/* --------------- Topic Tab ----------------------- */}

                    <li>
                      <div
                        className={`tab-a ${(activeTab === "topic" ? "active-a" : "") ||
                          (activeTopic === true ? "d-block" : "d-none")
                          }`}
                        onClick={() => handleTabClick("topic")}
                        data-id="topic"
                      >
                        Topic{" "}
                        <span
                          className="close_tab_cell"
                          title="Close Topic"
                          onClick={(e) => handleTopicTabClose(e, "topic")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </span>
                      </div>
                    </li>

                    {/* --------------- KPI Tab ----------------------- */}

                    <li>
                      <div
                        className={`tab-a ${(activeTab === "kpi" ? "active-a" : "") ||
                          (activeKPI === true ? "d-block" : "d-none")
                          }`}
                        onClick={() => handleTabClick("kpi")}
                        data-id="kpi"
                      >
                        KPI{" "}
                        <span
                          className="close_tab_cell"
                          title="Close Kpi"
                          onClick={(e) => handleKpiTabClose(e, "kpi")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </span>
                      </div>
                    </li>

                    {/* --------------- Add Question Tab ----------------------- */}

                    {/* --------------- Question List Tab ----------------------- */}
                    <li>
                      <div
                        className={`tab-a ${(activeTab === "supplierquestionList"
                          ? "active-a"
                          : "") ||
                          (activeQuestionList === true ? "d-block" : "d-none")
                          }`}
                        onClick={() => handleTabClick("supplierquestionList")}
                        data-id="supplierquestionList"
                      >
                        Question List
                        <span
                          className="close_tab_cell"
                          title="Close Question"
                          onClick={(e) =>
                            handleKpiTabClose(e, "supplierquestionList")
                          }
                        >
                          <i className="fas fa-times-circle"></i>
                        </span>
                      </div>
                    </li>
                    <li>
                      <div
                        className={`tab-a ${(activeTab === "questionList" ? "active-a" : "") ||
                          (activeQuestionList === true ? "d-block" : "d-none")
                          }`}
                        onClick={() => handleTabClick("questionList")}
                        data-id="questionList"
                      >
                        Question List
                        <span
                          className="close_tab_cell"
                          title="Close Question"
                          onClick={(e) => handleKpiTabClose(e, "questionList")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </span>
                      </div>
                    </li>
                  </ul>
                  <div className="financial__year_value hstack">
                    <p className="m-0">
                      <strong>
                        {data && data?.country_name} &nbsp;&nbsp;
                        {data && data?.financial_year_value}
                      </strong>
                    </p>
                    <div className="px-1">
                      <input
                        type="search"
                        className="form-control w-100"
                        placeholder="Search.."
                        name="search"
                      />
                    </div>
                  </div>
                </div>

                {/* --------------- Financial Year Tab ----------------------- */}
                {activeTab === "financial" && (
                  <div
                    className="tab"
                    data-id="financial"
                    style={{
                      display: activeTab === "financial" ? "block" : "none",
                    }}
                  >
                    <GlobalControlFinancialYear
                      handleFrameworkChangeHandler={handleFrameworkChangeHandler}
                    />
                  </div>
                )}

                {/* --------------- Framework Tab ----------------------- */}
                {activeTab === "framework" && (
                  <div
                    className="tab"
                    data-id="framework"
                    style={{
                      display: activeTab === "framework" ? "block" : "none",
                    }}
                  >
                    <Frameworks
                      financial_year_id={data}
                      handleTopicChangeHandler={handleTopicChangeHandler}
                      handleAddFrameworkQuestionChangeHandler={
                        handleAddFrameworkQuestionChangeHandler
                      }
                    />
                  </div>
                )}
                {/* --------------- Topic Tab ----------------------- */}
                {activeTab === "topic" && (
                  <div
                    className="tab"
                    data-id="topic"
                    style={{ display: activeTab === "topic" ? "block" : "none" }}
                  >
                    <Topics
                      frameworkData={currentTopicData}
                      financial_year_id={data}
                      addQuestionList={addQuestionList}
                      handleKPIChangeHandler={handleKPIChangeHandler}
                      handleAddTopicQuestionChangeHandler={
                        handleAddTopicQuestionChangeHandler
                      }
                    />
                  </div>
                )}
                {/* --------------- KPI Tab ----------------------- */}
                {activeTab === "kpi" && (
                  <div
                    className="tab"
                    data-id="kpi"
                    style={{ display: activeTab === "kpi" ? "block" : "none" }}
                  >
                    <Kpis
                      topicData={currentKPIData}
                      addQuestionList={addQuestionList}
                      currentAddFrameworkQuestionData={
                        currentAddFrameworkQuestionData
                      }
                      handleAddKpiQuestionChangeHandler={
                        handleAddKpiQuestionChangeHandler
                      }
                    />
                  </div>
                )}

                {/* --------------- Question List Tab ----------------------- */}

                {activeTab === "questionList" && (
                  <div
                    className="tab"
                    data-id="questionList"
                    style={{
                      display: activeTab === "questionList" ? "block" : "none",
                    }}
                  >
                    <SectorQuestionFrameworkWise
                      financial_year_id={data}
                      viewQuestionList={viewQuestionList}
                      addQuestionList={addQuestionList}
                      currentFrameworkData={currentAddFrameworkQuestionData}
                      handleActiveQuestionListHandler={
                        handleActiveQuestionListHandler
                      }
                    />
                  </div>
                )}

                {activeTab === "supplierquestionList" && (
                  <div
                    className="tab"
                    data-id="supplierquestionList"
                    style={{
                      display:
                        activeTab === "supplierquestionList" ? "block" : "none",
                    }}
                  >
                    <SectorQuestionFrameworkWise
                      module="SUPPLIER_QUESTION_LIST"
                      financial_year_id={data}
                      viewQuestionList={viewQuestionList}
                      addQuestionList={addQuestionList}
                      currentFrameworkData={currentAddFrameworkQuestionData}
                      handleActiveQuestionListHandler={
                        handleActiveQuestionListHandler
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
