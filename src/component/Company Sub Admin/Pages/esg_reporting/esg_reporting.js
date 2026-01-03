import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import "./esg_reporting.css";
import Multiselect from "multiselect-react-dropdown";
import config from "../../../../config/config.json";
import { Accordion, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { apiCall } from "../../../../_services/apiCall";
import FilterIcon from "../../../../img/sector/filter.png";

const EsgReportingModule = (props) => {
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [kpisData, setKpisData] = useState([]);
  const [permissionsList, setPermissionList] = useState([]);
  const [esgReportingData, setEsgReportingData] = useState({
    customKpiId: [],
    customTopicsId: [],
    frameworkId: [],
    mandatoryKpiId: [],
    mandatoryTopicsId: [],
    voluntaryKpiId: [],
    voluntaryTopicsId: [],
  });
  const [selectedFramework, setSelectedFramework] = useState([]);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState("");
  const [currentOptionsFilter, setCurrentOptionsFilter] = useState([]);
  const [currentSelectedFilter, setCurrentSelectedFilter] = useState([]);
  const [selectedManFramework, setSelectedManFramework] = useState([]);
  const [selectedValFramework, setSelectedValFramework] = useState([]);
  const [selectedCustomFramework, setSelectedCustomFramework] = useState([]);
  const [selectedManTopic, setManSelectedTopic] = useState([]);
  const [selectedValTopic, setValSelectedTopic] = useState([]);
  const [selectedCusTopic, setCusSelectedTopic] = useState([]);
  const [filterManTopicListValue, setFilterManTopicListValue] = useState([]);
  const [filterValTopicListValue, setFilterValTopicListValue] = useState([]);
  const [filterCusTopicListValue, setFilterCusTopicListValue] = useState([]);
  const [filterSelectedFramework, setFilterSelectedFramework] = useState([]);
  const [filterManKpiListValue, setFilterManKpiListValue] = useState([]);
  const [filterValKpiListValue, setFilterValKpiListValue] = useState([]);
  const [filterCusKpiListValue, setFilterCusKpiListValue] = useState([]);
  const [selectedTopicListValue, setSelectedTopicListValue] = useState([]);
  const [topicKpiValue, setTopicKpiValue] = useState([]);
  const [valueExists, setValueExits] = useState(false);
  const [settingDisabled, setSettingDisabled] = useState(true);
  const [currentOptionsTopicFilter, setCurrentOptionsTopicFilter] = useState(
    []
  );
   const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const [activeMTopic, setActiveMTopic] = useState("");
  const [activeVTopic, setActiveVTopic] = useState("");
  const [activeCTopic, setActiveCTopic] = useState("");
  const [activeMKpi, setActiveMKpi] = useState("");
  const [activeVKpi, setActiveVKpi] = useState("");
  const [activeCKpi, setActiveCKpi] = useState("");

  const [filterType, setFilterType] = useState("");
  const [step, setStep] = useState(1);
  const multiselectRefTracker = useRef();

  const [showFilter, setShowFilter] = useState(false);
  const handleCloseFilter = () => setShowFilter(false);

  const handleShowFilter = async (type) => {
    setSettingDisabled(false);
    setFilterType(type);
    if (type === "MTOPIC") {
      setCurrentOptionsFilter(selectedFramework);
      setCurrentSelectedFilter([]);
    } else if (type === "VTOPIC") {
      setCurrentOptionsFilter(selectedFramework);
      setCurrentSelectedFilter(selectedFramework);
      // if (selectedValFramework && selectedValFramework.length > 0) {
      //   setCurrentSelectedFilter(selectedManFramework);
      // } else {
      //   setCurrentSelectedFilter(selectedFramework);
      // }
    } else if (type === "CTOPIC") {
      setCurrentOptionsFilter(selectedFramework);
      setCurrentSelectedFilter(selectedFramework);
      // if (selectedCustomFramework && selectedCustomFramework.length > 0) {
      //   setCurrentSelectedFilter(selectedManFramework);
      // } else {
      //   setCurrentSelectedFilter(selectedFramework);
      // }
    } else if (type === "MKPI") {
      setCurrentOptionsFilter(frameworkValue);
      setCurrentSelectedFilter(selectedFramework);
      // if (selectedManFramework && selectedManFramework.length > 0) {
      //   setCurrentSelectedFilter(selectedManFramework);
      // } else {
      //   setCurrentSelectedFilter(selectedFramework);
      // }
    } else if (type === "VKPI") {
      setCurrentOptionsFilter(frameworkValue);
      if (selectedManFramework && selectedManFramework.length > 0) {
        setCurrentSelectedFilter(selectedManFramework);
      } else {
        setCurrentSelectedFilter(selectedFramework);
      }
    } else if (type === "CKPI") {
      setCurrentOptionsFilter(frameworkValue);
      if (selectedManFramework && selectedManFramework.length > 0) {
        setCurrentSelectedFilter(selectedManFramework);
      } else {
        setCurrentSelectedFilter(selectedFramework);
      }
    }
    // setCurrentFilter(type)
    setShowFilter(true);
  };
  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
      {},
      { userId: JSON.parse(localStorage.getItem("user_temp_id")) },
      "GET"
    );
    if (isSuccess) {
      setFinancialYear(data.data);

      setFinancialYearId(data?.data[data?.data?.length - 1]?.id);
      await fetchStoredData(data?.data[data?.data?.length - 1]?.id);

    }
  };

  const handleKey = async (type) => {
    if (type === "MTOPIC") {
      setActiveMTopic((prevKey) => (prevKey === "0" ? null : "0"));
    } else if (type === "VTOPIC") {
      setActiveVTopic((prevKey) => (prevKey === "0" ? null : "0"));
    } else if (type === "CTOPIC") {
      setActiveCTopic((prevKey) => (prevKey === "0" ? null : "0"));
    } else if (type === "MKPI") {
      setActiveMKpi((prevKey) => (prevKey === "0" ? null : "0"));
    } else if (type === "VKPI") {
      setActiveVKpi((prevKey) => (prevKey === "0" ? null : "0"));
    } else if (type === "CKPI") {
      setActiveCKpi((prevKey) => (prevKey === "0" ? null : "0"));
    }
  };

  const getKpiData = async (esgData) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getKpi`,
      {},
      {
        type: "ESG",
        voluntaryTopicsId: esgData["voluntaryTopicsId"],
        mandatoryTopicsId: esgData["mandatoryTopicsId"],
      },
      "GET"
    );
    if (isSuccess) {
      if (
        data?.data?.customKpi?.length === 0 &&
        data?.data?.mandatoryKpi?.length === 0 &&
        data?.data?.voluntaryKpi?.length === 0
      ) {
        setKpisData([]);
      } else {
        setKpisData(data?.data);
      }
    }
  };

  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL", userId: JSON.parse(localStorage.getItem("user_temp_id")) }
    );
    if (isSuccess) {
      setFrameworkValue(data?.data);
      return data?.data;
    }
  };

  const fetchTopicData = async (framworkIds) => {
    if (framworkIds && framworkIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTopic`,
        {},
        { type: "ESG", frameworkIds: framworkIds }
      );
      if (isSuccess) {
        const filterSelctedTopics = data?.data;
        setTopicsData(data?.data);
        setFilterManTopicListValue(filterSelctedTopics["mandatory_topics"]);
        let idArray = filterSelctedTopics["mandatory_topics"].map(
          (item) => item.id
        );
        if (valueExists) {
          const uniqueArray = [...new Set([...idArray])];
          const sortedArray = uniqueArray.sort((a, b) => a - b);

          setEsgReportingData({
            ...esgReportingData,
            mandatoryTopicsId: sortedArray,
          });
        }

        setFilterValTopicListValue(filterSelctedTopics["voluntary_topics"]);
        setFilterCusTopicListValue(filterSelctedTopics["custom_topics"]);

        if (filterSelctedTopics.length > 0) {
          getKpiData();
        }
      }
    }
  };

  const fetchFilterTopicData = async (framworkIds) => {
    if (framworkIds && framworkIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTopic`,
        {},
        { type: "ESG", frameworkIds: framworkIds }
      );
      if (isSuccess) {
        const filterSelctedTopics = data?.data;

        if (filterType === "MTOPIC") {
          setCurrentOptionsTopicFilter(filterSelctedTopics["mandatory_topics"]);
        } else if (filterType === "VTOPIC") {
          setCurrentOptionsTopicFilter(filterSelctedTopics["voluntary_topics"]);
        } else if (filterType === "CTOPIC") {
          setCurrentOptionsTopicFilter(filterSelctedTopics["custom_topics"]);
        }
      }
    }
  };

  const getFilterKpiData = async (topicId) => {
    let filterParam;
    if (filterType === "MTOPIC") {
      filterParam = { mandatoryTopicsId: topicId };
    } else if (filterType === "VTOPIC") {
      filterParam = { voluntaryTopicsId: topicId };
    } else if (filterType === "CTOPIC") {
      filterParam = { customTopicsId: topicId };
    }
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getKpi`,
      {},
      {
        type: "ESG",
        ...filterParam,
      },
      "GET"
    );
    if (isSuccess) {
      // setKpisData(data?.data);
    }
  };

  const saveSelectedData = async () => {
    const body = {
      frameworkTopicKpi: JSON.stringify({
        customKpiId: esgReportingData["customKpiId"],
        mandatoryTopicsId: esgReportingData["mandatoryTopicsId"],
        voluntaryTopicsId: esgReportingData["voluntaryTopicsId"],
        mandatoryKpiId: esgReportingData["mandatoryKpiId"],
        voluntaryKpiId: esgReportingData["voluntaryKpiId"],
        customTopicsId: esgReportingData["customTopicsId"],
        frameworkId: selectedFrameworkId,
      }),
      questionnaireType: "SQ",
      financialYearId: Number(financialYearId),
    };
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}saveESGReport`,
      {},
      body,
      "POST"
    );
    if (isSuccess) {
      setSettingDisabled(false);
      const pushToRoute = "/#/sector_questions";
      setTimeout(() => {
        window.location.href = pushToRoute;
      }, 500);
    } else {
    }
  };

  const handleConfirm = () => {
    saveSelectedData();
  };

  const handleFinancialYearChange = async (e) => {
    setSettingDisabled(false);
    if (e.target.value === "Select Financial Year") setFinancialYearId("");
    else {
      const fId = e.target.value;
      setFinancialYearId(fId);
      await fetchStoredData(fId);
    }
  };

  const fetchStoredData = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getESGReport`,
      {},
      { type: "SQ", financial_year_id: fId },
      "GET"
    );
    if (isSuccess) {
      if (data.data.length == 0) {
        setValueExits(true);
        setTopicKpiValue(true);
        setEsgReportingData({
          customKpiId: [],
          customTopicsId: [],
          frameworkId: [],
          mandatoryKpiId: [],
          mandatoryTopicsId: [],
          voluntaryKpiId: [],
          voluntaryTopicsId: [],
        });

        multiselectRefTracker.current.resetSelectedValues();

        setTopicsData([]);
        setSelectedTopics([]);
      } else {
        setTopicKpiValue(false);
        const data1 = data?.data[0]?.frameworkTopicKpi
          ? data?.data[0]?.frameworkTopicKpi
          : {};

        setEsgReportingData(data1);
        getKpiData(data1);

        if (data1 && data1.frameworkId && data1.frameworkId.length > 0) {
          const frameworkValues = await fetchFrameworkApi();
          handleAutoselectedFramework(data1.frameworkId, frameworkValues);
        }
      }
    }
  };

  const handleAutoselectedFramework = (
    selectedFrameworkMapping,
    frameworkValues
  ) => {
    const filteredFrameValue = frameworkValues.filter((obj) => {
      return selectedFrameworkMapping.find((value) => {
        return value === obj.id;
      });
    });
    if (filteredFrameValue && filteredFrameValue.length > 0) {
      setSelectedFramework(filteredFrameValue);
      let idArray = filteredFrameValue.map((item) => item.id);
      setSelectedFrameworkId(idArray);
      fetchTopicData(idArray);
    }
  };

  const onSelectFrameworkHandler = (data) => {
    setSettingDisabled(false);
    const selectedFrameworkMappingIds = data && data.map(({ id }) => id);
    setSelectedFrameworkId(selectedFrameworkMappingIds || []);

    setSelectedFramework(data || []);
    fetchTopicData(selectedFrameworkMappingIds);
  };

  const onRemoveFrameworkHandler = (data) => {
    if (data && data.length === 0) {
      setSelectedFrameworkId([]);
      setSelectedFramework([]);
      setSelectedTopics([]);

      setTopicsData([]);
    } else {
      onSelectFrameworkHandler(data);
      if (selectedTopics && selectedTopics.length > 0) {
        const filteredTopics = selectedTopics.filter((obj) => {
          return data.find((dataObj) => {
            return dataObj.id === obj.id;
          });
        });
        if (filteredTopics && filteredTopics.length > 0) {
          const topicMappingIds = filteredTopics.map(({ id }) => id);
          const topicIds = filteredTopics.map(({ id }) => id);
          setSelectedTopics(topicIds);
        } else {
          setSelectedTopics([]);
        }
      }
    }
  };
  const onSelectFilterHandler = (data) => {
    setSettingDisabled(false);
    const selectedFramework = data && data.map((item) => item);
    setFilterSelectedFramework(selectedFramework);
    if (filterType === "MTOPIC") {
      const selectedFrameworkId =
        selectedFramework && selectedFramework.map((item) => item.id);
      fetchFilterTopicData(selectedFrameworkId);
      setSelectedManFramework(selectedFramework || []);
    } else if (filterType === "VTOPIC") {
      const selectedFrameworkId =
        selectedFramework && selectedFramework.map((item) => item.id);
      fetchFilterTopicData(selectedFrameworkId);
      setSelectedValFramework(selectedFramework || []);
    } else if (filterType === "CTOPIC") {
      const selectedFrameworkId =
        selectedFramework && selectedFramework.map((item) => item.id);
      fetchFilterTopicData(selectedFrameworkId);
      setSelectedCustomFramework(selectedFramework || []);
    } else if (filterType === "MKPI") {
    } else if (filterType === "VKPI") {
    } else if (filterType === "CKPI") {
    }
  };

  const onSelectTopicFilterHandler = (data) => {
    setSettingDisabled(false);
    const selectedTopic = data && data.map((item) => item);
    if (filterType === "MTOPIC") {
      setManSelectedTopic(selectedTopic);
    } else if (filterType === "VTOPIC") {
      setValSelectedTopic(selectedTopic);
    } else if (filterType === "CTOPIC") {
      setCusSelectedTopic(selectedTopic);
    } else if (filterType === "MKPI") {
    } else if (filterType === "VKPI") {
    } else if (filterType === "CKPI") {
    }
  };
  const onApplyFilterHandler = () => {
    if (filterType === "MTOPIC") {
      if (selectedManTopic && selectedManTopic?.length === 0) {
        setFilterManTopicListValue(currentOptionsTopicFilter);
      } else {
        setFilterManTopicListValue(selectedManTopic);
      }
    } else if (filterType === "VTOPIC") {
      if (selectedValTopic && selectedValTopic?.length === 0) {
        setFilterValTopicListValue(currentOptionsTopicFilter);
      } else {
        setFilterValTopicListValue(selectedValTopic);
      }
    } else if (filterType === "CTOPIC") {
      if (selectedCusTopic && selectedCusTopic?.length === 0) {
        setFilterCusTopicListValue(currentOptionsTopicFilter);
      } else {
        setFilterCusTopicListValue(selectedCusTopic);
      }
    } else if (filterType === "MKPI") {
    } else if (filterType === "VKPI") {
    } else if (filterType === "CKPI") {
    }
    setShowFilter(false);
  };

  const onRemoveTopicFilterHandler = (data) => {
    setSettingDisabled(false);
    onSelectTopicFilterHandler(data);
  };
  const onRemoveFilterHandler = (data) => {
    setSettingDisabled(false);
    onSelectFilterHandler(data);
  };

  const onTopicChangeHandler = async (event, topicObj) => {
    setSettingDisabled(false);
    const { id, is_mendatory } = topicObj;
    if (event.target.checked) {
      if (is_mendatory === "YES") {
        esgReportingData["mandatoryTopicsId"].push(id);
      } else if (is_mendatory === "NO") {
        esgReportingData["voluntaryTopicsId"].push(id);
      } else {
        esgReportingData["customTopicsId"].push(id);
      }
    } else {
      if (is_mendatory === "YES") {
        esgReportingData["mandatoryTopicsId"] = esgReportingData[
          "mandatoryTopicsId"
        ].filter((item) => item !== id);
      } else if (is_mendatory === "NO") {
        esgReportingData["voluntaryTopicsId"] = esgReportingData[
          "voluntaryTopicsId"
        ].filter((item) => item !== id);
      } else {
        esgReportingData["customTopicsId"] = esgReportingData[
          "customTopicsId"
        ].filter((item) => item !== id);
      }
    }

    getKpiData(esgReportingData);
  };

  const onKpiChangeHandler = async (event, topicObj) => {
    const { id, is_mendatory } = topicObj;
    setSettingDisabled(false);
    if (event.target.checked) {
      if (is_mendatory === "YES") {
        esgReportingData["mandatoryKpiId"].push(id);
      } else if (is_mendatory === "NO") {
        esgReportingData["voluntaryKpiId"].push(id);
      } else {
        esgReportingData["customKpiId"].push(id);
      }
    } else {
      if (is_mendatory === "YES") {
        esgReportingData["mandatoryKpiId"] = esgReportingData[
          "mandatoryKpiId"
        ].filter((item) => item !== id);
      } else if (is_mendatory === "NO") {
        esgReportingData["voluntaryKpiId"] = esgReportingData[
          "voluntaryKpiId"
        ].filter((item) => item !== id);
      } else {
        esgReportingData["customKpiId"] = esgReportingData[
          "customKpiId"
        ].filter((item) => item !== id);
      }
    }
    getKpiData(esgReportingData);
  };
  const searchManTopics = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === "") {
      setFilterManTopicListValue([...topicsData?.mandatory_topics]);
    } else {
      const filteredResult = topicsData?.mandatory_topics.filter((item) =>
        item.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterManTopicListValue(filteredResult);
    }
  };

  const searchValTopics = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === "") {
      setFilterValTopicListValue([...topicsData?.voluntary_topics]);
    } else {
      const filteredResult = topicsData?.voluntary_topics.filter((item) =>
        item.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterValTopicListValue(filteredResult);
    }
  };

  const searchCustTopics = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === "") {
      setFilterCusTopicListValue([...topicsData?.custom_topics]);
    } else {
      const filteredResult = topicsData?.custom_topics.filter((item) =>
        item.title.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterCusTopicListValue(filteredResult);
    }
  };
  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };
  useEffect(() => {
    fetchFrameworkApi();
    getFinancialYear();
    const esgReportingMenu = JSON.parse(localStorage.getItem("menu")).find(
      (item) => item?.url === "esg_reporting"
    );
    setPermissionList(esgReportingMenu?.permissions);
  }, []);
  return (
    <>
      <div
        className="d-flex flex-row mainclass"
        style={{ height: "100vh", overflow: "auto" }}
      >
            <div
        style={{
         flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999,transition: "flex 0.3s ease"
        }}
      >
        <Sidebar
        
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle} 
        />
      </div>

      {/* Main Content */}
      <div style={{flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease" , minHeight: "100vh", overflowY: "auto" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
            <Header />
          </div>
          <div className="main_wrapper">
            <div className="inner_wraapper p-3">
              {financialYear.length && (
                <div className="bg-white widget-style1 p-3">
                  <div className="hstack justify-content-between pb-2">
                    <h5 className="frame p-0 m-0">
                      Kindly choose the ESG reporting framework you prefer:
                    </h5>
                    {/* {permissionsList &&
                    permissionsList.some(
                      (item) =>
                        item.permissionCode === "SELECTION_OF_FINANCIAL_YEAR" &&
                        item.checked === "true"
                    ) && ( */}
                    <div className="form-group">
                      <label
                        htmlFor="industryType"
                        className="frame align-items-center"
                      >
                        Please Select Financial Year :
                      </label>
                      {financialYear && financialYear?.length === 1 ? (
                        <select
                          name="tab_name"
                          onChange={handleFinancialYearChange}
                          className="select_one_all industrylist"
                        >
                          {financialYear?.map((item, key) => (
                            <option key={key} value={item.id}>
                              {item.financial_year_value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          name="tab_name"
                          value={financialYearId || (financialYear.length > 0 ? financialYear[financialYear.length - 1].id : "")}
                          onChange={handleFinancialYearChange}
                          className="select_one_all industrylist"
                        >
                          <option>Select Financial Year</option>
                          {financialYear?.map((item, key) => (
                            <option key={key} value={item.id}>
                              {item.financial_year_value}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="activity_section h-auto">
                    <Multiselect
                      placeholder={"Select Framework"}
                      displayValue="title"
                      options={frameworkValue}
                      selectedValues={selectedFramework}
                      ref={multiselectRefTracker}
                      onRemove={(e) => {
                        if (frameworkValue.length > 1) {
                          onRemoveFrameworkHandler(e);
                        }
                      }}
                      onSelect={(e) => onSelectFrameworkHandler(e)}
                      className={"react-multiselect-dropdown"}
                    />
                    {selectedFramework.length === 1 && (
                      <style>{`.icon_cancel { display: none; }`}</style>
                    )}
                  </div>
                </div>
              )}
              <br></br>
              {step === "complete" ? (
                <div className="bg-white rounded-lg p-10 flex items-center shadow justify-between"></div>
              ) : (
                <div>
                  <div className="py-10">
                    {step === 1 && (
                      <div>
                        {topicsData &&
                          topicsData["mandatory_topics"]?.length > 0 ? (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeMTopic}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header
                                  onClick={() => handleKey("MTOPIC")}
                                >
                                  Mandatory Topics
                                </Accordion.Header>
                                {activeMTopic && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search Topic Name"
                                      onChange={(e) =>
                                        searchManTopics(e.target.value)
                                      }
                                    />

                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("MTOPIC")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {filterManTopicListValue.length != 0 &&
                                        topicsData["mandatory_topics"].length != 0 ? (
                                        filterManTopicListValue?.map(
                                          (data, index) => {

                                            return (
                                              <Col md={6} key={index}>
                                                <div className="Global_text">
                                                  <div className="form-check form-check-inline clobal_check input-padding">
                                                    <input
                                                      className="form-check-input input_one "
                                                      name="frameworksUsed[]"
                                                      type="checkbox"
                                                      checked={
                                                        esgReportingData[
                                                          "mandatoryTopicsId"
                                                        ]?.length === 0
                                                          ? true
                                                          : esgReportingData[
                                                            "mandatoryTopicsId"
                                                          ].includes(data.id)
                                                      }
                                                      onChange={(e) =>
                                                        onTopicChangeHandler(
                                                          e,
                                                          data
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label label_one"
                                                      htmlFor={"xcfgvldskfjgosdfg"}
                                                    >
                                                      {data?.title}
                                                    </label>
                                                  </div>
                                                </div>
                                              </Col>
                                            );
                                          }
                                        )
                                      ) : (
                                        <div>
                                          <p className="p-2">No Data Found</p>
                                        </div>
                                      )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        ) : (
                          ""
                        )}
                        {topicsData &&
                          topicsData["voluntary_topics"]?.length > 0 ? (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeVTopic}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header
                                  onClick={() => handleKey("VTOPIC")}
                                >
                                  {" "}
                                  Voluntary Topics{" "}
                                </Accordion.Header>
                                {activeVTopic && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search Topic Name"
                                      onChange={(e) =>
                                        searchValTopics(e.target.value)
                                      }
                                    />
                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("VTOPIC")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {filterValTopicListValue?.length != 0 &&
                                        topicsData["voluntary_topics"].length != 0 ? (
                                        filterValTopicListValue?.map(
                                          (data, index) => {
                                            return (
                                              <Col md={6} key={index}>
                                                <div className="Global_text">
                                                  <div className="form-check form-check-inline clobal_check input-padding">
                                                    <input
                                                      className="form-check-input input_one"
                                                      name="frameworksUsed[]"
                                                      type="checkbox"
                                                      defaultChecked={
                                                        esgReportingData[
                                                          "voluntaryTopicsId"
                                                        ]?.length === 0
                                                          ? false
                                                          : esgReportingData[
                                                            "voluntaryTopicsId"
                                                          ].includes(data.id)
                                                      }
                                                      onChange={(e) =>
                                                        onTopicChangeHandler(
                                                          e,
                                                          data
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label label_one"
                                                      htmlFor={"xcfgvldskfjgosdfg"}
                                                    >
                                                      {data?.title}
                                                    </label>
                                                  </div>
                                                </div>
                                              </Col>
                                            );
                                          }
                                        )
                                      ) : (
                                        <div>
                                          <p className="p-2">No Data Found</p>
                                        </div>
                                      )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        ) : (
                          ""
                        )}
                        {topicsData && filterCusTopicListValue?.length > 0 ? (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeCTopic}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header
                                  onClick={() => handleKey("CTOPIC")}
                                >
                                  {" "}
                                  Custom Topics{" "}
                                </Accordion.Header>
                                {activeCTopic && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search Topic Name"
                                      onChange={(e) =>
                                        searchCustTopics(e.target.value)
                                      }
                                    />
                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("CTOPIC")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {topicsData["custom_topics"]?.map(
                                        (data, index) => (
                                          <Col md={6} key={index}>
                                            <div className="Global_text">
                                              <div className="form-check form-check-inline clobal_check input-padding">
                                                <input
                                                  className="form-check-input input_one"
                                                  name="frameworksUsed[]"
                                                  type="checkbox"
                                                  defaultChecked={
                                                    esgReportingData[
                                                      "customTopicsId"
                                                    ]?.length === 0
                                                      ? false
                                                      : esgReportingData[
                                                        "customTopicsId"
                                                      ].includes(data.id)
                                                  }
                                                  onChange={(e) =>
                                                    onTopicChangeHandler(e, data)
                                                  }
                                                />
                                                <label
                                                  className="form-check-label label_one"
                                                  htmlFor={"xcfgvldskfjgosdfg"}
                                                >
                                                  {data?.title}
                                                </label>
                                              </div>
                                            </div>
                                          </Col>
                                        )
                                      )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    {step === 2 && (
                      <div>
                        {kpisData && kpisData["mandatoryKpi"]?.length > 0 && (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeMKpi}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header onClick={() => handleKey("MKPI")}>
                                  Mandatory KPI
                                </Accordion.Header>
                                {activeMKpi && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search KPI Name"
                                    // onChange={(e) =>
                                    //   searchCustTopics(e.target.value)
                                    // }
                                    />
                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("MKPI")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {kpisData &&
                                        kpisData["mandatoryKpi"]?.map(
                                          (data, index) => (
                                            <Col md={6} key={index}>
                                              <div className="Global_text">
                                                <div className="form-check form-check-inline clobal_check input-padding">
                                                  <input
                                                    className="form-check-input input_one"
                                                    name="frameworksUsed[]"
                                                    type="checkbox"
                                                    defaultChecked={
                                                      esgReportingData[
                                                        "mandatoryKpiId"
                                                      ]?.length === 0
                                                        ? true
                                                        : esgReportingData[
                                                          "mandatoryKpiId"
                                                        ].includes(data.id)
                                                    }
                                                    onChange={(e) =>
                                                      onKpiChangeHandler(e, data)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label label_one"
                                                    htmlFor={"xcfgvldskfjgosdfg"}
                                                  >
                                                    {data?.title}
                                                  </label>
                                                </div>
                                              </div>
                                            </Col>
                                          )
                                        )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        )}
                        {kpisData && kpisData["voluntaryKpi"]?.length > 0 && (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeVKpi}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header onClick={() => handleKey("VKPI")}>
                                  Voluntary KPI
                                </Accordion.Header>
                                {activeVKpi && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search KPI Name"
                                    // onChange={(e) =>
                                    //   searchCustTopics(e.target.value)
                                    // }
                                    />
                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("VKPI")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {kpisData &&
                                        kpisData["voluntaryKpi"]?.map(
                                          (data, index) => (
                                            <Col md={6} key={index}>
                                              <div className="Global_text">
                                                <div className="form-check form-check-inline clobal_check input-padding">
                                                  <input
                                                    className="form-check-input input_one"
                                                    name="frameworksUsed[]"
                                                    type="checkbox"
                                                    defaultChecked={
                                                      esgReportingData[
                                                        "voluntaryKpiId"
                                                      ]?.length === 0
                                                        ? false
                                                        : esgReportingData[
                                                          "voluntaryKpiId"
                                                        ].includes(data.id)
                                                    }
                                                    onChange={(e) =>
                                                      onKpiChangeHandler(e, data)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label label_one"
                                                    htmlFor={"xcfgvldskfjgosdfg"}
                                                  >
                                                    {data?.title}
                                                  </label>
                                                </div>
                                              </div>
                                            </Col>
                                          )
                                        )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        )}
                        {kpisData && kpisData["customKpi"]?.length > 0 && (
                          <div className="access__section mb-3">
                            <Accordion activeKey={activeCKpi}>
                              <Accordion.Item
                                eventKey="0"
                                style={{ position: "relative" }}
                              >
                                <Accordion.Header onClick={() => handleKey("CKPI")}>
                                  Custom KPI
                                </Accordion.Header>
                                {activeCKpi && (
                                  <div className="hstack gap-3 filter__search">
                                    <input
                                      type="search"
                                      className="form-control"
                                      placeholder="Search KPI Name"
                                    // onChange={(e) =>
                                    //   searchCustTopics(e.target.value)
                                    // }
                                    />
                                    <div
                                      className="filter_ICOn"
                                      onClick={() => handleShowFilter("CKPI")}
                                    >
                                      <img src={FilterIcon} alt="" srcSet="" />
                                    </div>
                                  </div>
                                )}
                                <Accordion.Body className="p-0">
                                  <div className="border_box">
                                    <Row>
                                      {kpisData &&
                                        kpisData["customKpi"]?.map(
                                          (data, index) => (
                                            <Col md={6} key={index}>
                                              <div className="Global_text">
                                                <div className="form-check form-check-inline clobal_check input-padding">
                                                  <input
                                                    className="form-check-input input_one"
                                                    name="frameworksUsed[]"
                                                    type="checkbox"
                                                    defaultChecked={
                                                      esgReportingData[
                                                        "customKpiId"
                                                      ]?.length === 0
                                                        ? false
                                                        : esgReportingData[
                                                          "customKpiId"
                                                        ].includes(data.id)
                                                    }
                                                    onChange={(e) =>
                                                      onKpiChangeHandler(e, data)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label label_one"
                                                    htmlFor={"xcfgvldskfjgosdfg"}
                                                  >
                                                    {data?.title}
                                                  </label>
                                                </div>
                                              </div>
                                            </Col>
                                          )
                                        )}
                                    </Row>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="fixed bottom-0 left-0 right-0">
                <div className="mx-auto mt-4">
                  <div className="d-flex justify-content-between align-items-center ">
                    <div>
                      {step > 1 && (
                        <div className="global_link">
                          <div className="save_global global_link">
                            <button
                              className="new_button_style__reject"
                              disabled={selectedFramework.length <= 0}
                              onClick={() => setStep(step - 1)}
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {kpisData && kpisData?.length === 0 ? (
                        <div className="global_link">
                          <div className="save_global global_link">
                            <button
                              className="new_button_style"
                              onClick={handleConfirm}
                              disabled={settingDisabled}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="global_link">
                          <div className="save_global global_link">
                            <button
                              className="new_button_style"
                              disabled={selectedFramework.length <= 0}
                              onClick={
                                step < 2 ? () => setStep(step + 1) : handleConfirm
                              }
                            >
                              {step < 2 ? "Next" : "Submit"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={showFilter} onHide={handleCloseFilter}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <Form.Label>Apply Filter</Form.Label>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <Multiselect
                    placeholder={"Select Framework"}
                    displayValue="title"
                    options={currentOptionsFilter}
                    selectedValues={
                      filterType === "MTOPIC"
                        ? selectedManFramework
                        : filterType === "VTOPIC"
                          ? selectedValFramework
                          : filterType === "CTOPIC"
                            ? selectedCustomFramework
                            : []
                    }
                    ref={multiselectRefTracker}
                    onRemove={(e) => {
                      onRemoveFilterHandler(e);
                    }}
                    onSelect={(e) => {
                      onSelectFilterHandler(e);
                    }}
                  />
                </div>
                {currentOptionsTopicFilter &&
                  currentOptionsTopicFilter?.length > 0 && (
                    <Multiselect
                      placeholder={"Select Topic"}
                      displayValue="title"
                      options={currentOptionsTopicFilter}
                      selectedValues={
                        filterType === "MTOPIC"
                          ? selectedManTopic
                          : filterType === "VTOPIC"
                            ? selectedValTopic
                            : filterType === "CTOPIC"
                              ? selectedCusTopic
                              : []
                      }
                      ref={multiselectRefTracker}
                      onRemove={(e) => {
                        onRemoveTopicFilterHandler(e);
                      }}
                      onSelect={(e) => {
                        onSelectTopicFilterHandler(e);
                      }}
                    />
                  )}
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="new_button_style__reject"
                  onClick={handleCloseFilter}
                >
                  Close
                </button>
                <button className="new_button_style" onClick={onApplyFilterHandler}>
                  Apply Filter
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default EsgReportingModule;
