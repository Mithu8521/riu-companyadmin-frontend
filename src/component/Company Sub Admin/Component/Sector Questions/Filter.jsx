import React, { Component, useEffect, useState, useRef } from "react";
import { apiCall } from "../../../../_services/apiCall";
import Multiselect from "multiselect-react-dropdown";
import { Form, Accordion, Row, Col } from "react-bootstrap";
import config from "../../../../config/config.json";

const Filters = ({ type, fetchData }) => {
  const frameWorkRef = useRef(null);
  const topicRef = useRef(null);
  const kpiRef = useRef(null);
  const [frameworkData, setFrameworkData] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedKpi, setSelectedKpi] = useState([]);
  const getFramework = async () => {
    frameWorkRef?.current?.resetSelectedValues();
    topicRef?.current?.resetSelectedValues();
    kpiRef?.current?.resetSelectedValues();

    setFrameworkData([]);
    setSelectedFrame([]);
    setTopicsData([]);
    setSelectedTopics([]);
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getSectorQuestionFramework`,
      {},
      {
        type: type,
      }
    );
    if (isSuccess) {
      setFrameworkData(data?.data);
    }
  };
  const getKpi = async (topicId) => {
    const frameworkIds = selectedFrame && selectedFrame?.map(({ id }) => id);
    const topicIds = topicId && topicId?.map(({ id }) => id);
    const { isSuccess, data } = await apiCall(
      `${config.API_URL}getSectorQuestionKpi`,
      {},
      {
        type: "QUESTION",
        framework_id: [frameworkIds],
        topic_id: [topicIds],
      }
    );
    if (isSuccess) {
      setKpiData(data?.data);
    }
  };
  const fetchTopicKpi = async (frameWork) => {
    setKpiData([]);
    setSelectedKpi([]);
    if (frameWork.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.API_URL}getSectorQuestionTopic`,
        {},
        {
          type: type === "TOPIC" ? "QUESTION" : "KPI",
          framework_id: [frameWork],
        }
      );
      if (isSuccess) {
        setTopicsData(data?.data);
      }
    }
  };
  const submitHandler = async () => {
    const frameworkIds = selectedFrame && selectedFrame?.map(({ id }) => id);
    const topicIds = selectedTopics && selectedTopics?.map(({ id }) => id);
    const kpiIds = selectedKpi && selectedKpi?.map(({ id }) => id);

    if (type === "QUESTION") {
      fetchData(frameworkIds, [], []);
    }
    if (type === "TOPIC") {
      fetchData(frameworkIds, topicIds, []);
    }
    if (type === "KPI") {
      fetchData(frameworkIds, topicIds, kpiIds);
    }
  };
  const isButtonDisabled = () => {
    if (type === "QUESTION") {
      if (selectedFrame.length > 0) return false;
      else return true;
    }
    if (type === "TOPIC") {
      if (selectedFrame.length > 0 && selectedTopics.length > 0) {
        return false;
      } else {
        return true;
      }
    }
    if (type === "KPI") {
      if (
        selectedFrame.length > 0 &&
        selectedTopics.length > 0 &&
        selectedKpi.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    }
  };
  useEffect(() => {
    setFrameworkData([]);
    setSelectedFrame([]);
    setTopicsData([]);
    setSelectedTopics([]);

    // fetchData([1], [], [])
    getFramework();
  }, [type]);

  return (
    <>
      <Row>
        {type === "QUESTION" ? (
          <Col md={12} className="mb-5">
            <label htmlFor="industryType" className="mb-2">
              {" "}
              Select Framework :
            </label>
            <Multiselect
              placeholder={"Select Framework"}
              displayValue="title"
              style={{ border: "1px solid red" }}
              options={frameworkData}
              // selectedValues={
              //   this.stateframeworkValue
              //     .selectedFramework
              // }
              // ref={this.multiselectRefTracker}
              onRemove={(e) => {
                setSelectedFrame(e || []);
              }}
              onSelect={(e) => {
                setSelectedFrame(e || []);
              }}
            />
          </Col>
        ) : (
          <>
            <Col md={12}>
              <label className="sector_questions_tab"> Framework: </label>
              <Multiselect
                className="mb-4"
                placeholder={"Select Framework"}
                displayValue="title"
                options={frameworkData}
                // selectedValues={
                //   this.stateframeworkValue
                //     .selectedFramework
                // }
                ref={frameWorkRef}
                onRemove={async (e) => {
                  setSelectedFrame(e || []);
                  const frameworkIds = e && e?.map(({ id }) => id);
                  fetchTopicKpi(frameworkIds);
                }}
                onSelect={async (e) => {
                  setSelectedFrame(e || []);

                  const frameworkIds = e && e?.map(({ id }) => id);
                  fetchTopicKpi(frameworkIds);
                }}
              />
              <label className="sector_questions_tab"> Topics:</label>
              <Multiselect
                className="mb-4"
                placeholder={"Select Topics"}
                displayValue="title"
                options={topicsData}
                // selectedValues={
                //   this.stateframeworkValue
                //     .selectedFramework
                // }
                ref={topicRef}
                // ref={this.multiselectRefTracker}
                onRemove={async (e) => {
                  setSelectedTopics(e || []);
                  if (type === "KPI") {
                    getKpi(e);
                  }
                  // fetchTopicKpi(frameworkIds)
                }}
                onSelect={async (e) => {
                  setSelectedTopics(e || []);
                  if (type === "KPI") {
                    getKpi(e);
                  }
                  // fetchTopicKpi(frameworkIds)
                }}
              />
            </Col>
          </>
        )}
        <Col>
          <div className="save_global download_report">
            <button
              className="new_button_style apply-filter-btn"
              onClick={() => {
                let a = isButtonDisabled();

                if (!isButtonDisabled()) {
                  submitHandler();
                }
              }}
            >
              Apply Filter
            </button>
          </div>
        </Col>
      </Row>
      {type === "KPI" ? (
        <Row>
          <Col md={12} className="mb-5">
            <label className="sector_questions_tab"> KPI: </label>
            <Multiselect
              placeholder={"Select Kpi"}
              displayValue="title"
              options={kpiData}
              // selectedValues={
              //   this.stateframeworkValue
              //     .selectedFramework
              // }
              ref={kpiRef}
              // ref={this.multiselectRefTracker}
              onRemove={async (e) => {
                setSelectedKpi(e || []);
              }}
              onSelect={async (e) => {
                setSelectedKpi(e || []);
              }}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}
    </>
  );
};

export default Filters;