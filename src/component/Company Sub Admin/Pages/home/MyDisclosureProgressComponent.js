import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { ColumnChart } from "./Chart";
import { ColumnChartDataForQuestionType } from "./chartData";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import FilterDashoard from "../../../../img/sector/filter.png";
import Multiselect from "multiselect-react-dropdown";

const MyDisclosureProgressComponent = () => {
  const [filter, setFilter] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState([]);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState([]);
  const [Framework, setFramework] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState();
  const [chartType, setChartType] = useState("");
  const [allZero, setAllZero] = useState(false);
  const multiselectRef = useRef(null);
  const handleFilterClose = () => setFilter(false);

  const myDisclosureProgress = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}myDisclosureProgress`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const responseData = data.data;
      const allZeroes = responseData?.series.every((series) =>
        series.data.every((value) => value === 0)
      );
      setAllZero(allZeroes);
      const GraphData = await ColumnChartDataForQuestionType(
        responseData?.series,
        responseData?.categories,
        false,
        true
      );
      setGraphData(GraphData);
      setFramework(responseData?.frameworkOptions);
      setSelectedFrameworkId(responseData?.filter?.frameworkIds);
      const filteredArray = responseData?.frameworkOptions.filter((obj) =>
        responseData?.filter?.frameworkIds.includes(obj.id)
      );
      setSelectedFramework(filteredArray);
    }
  };
  const onSelectHandler = (data) => {
    const selectedIds = data && data.map(({ id }) => id);
    setSelectedFrameworkId(selectedIds || []);
    setSelectedFramework(data || []);
  };

  const onRemoveHandler = (data, type) => {
    if (data && data.length === 0) {
      setSelectedFrameworkId([]);
      setSelectedFramework([]);
    } else {
      onSelectHandler(data);
    }
  };
  const handleApplyFilter = async () => { };

  useEffect(() => {
    myDisclosureProgress();
  }, []);
  return (
    <>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className="esg_score_title d-flex align-items-center justify-content-between">
            <h5>
              <b>My Disclosure Progress</b>
            </h5>
            {!allZero && (
              <button
                onClick={() => {
                  setFilter(true);
                }}
                className="new_button_style"
              >
                <i
                  className="fas fa-filter"
                  title="My Disclosure Progress Filter"
                ></i>
              </button>
            )}
          </div>
          <div className="p-0">
            <div className="main_text">
              {chartType !== "" ? (
                chartType
              ) : (
                <ColumnChart chartData={graphData} />
              )}
            </div>
          </div>
        </div>
      </Col>
      <Modal size="md" show={filter} onHide={handleFilterClose}>
        <Modal.Header closeButton>
          <Form.Label className="align-items-center m-0">
            <strong>My Disclosure Progress Filter</strong>
          </Form.Label>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Framework Name</Form.Label>
            <Multiselect
              placeholder="Select Framework"
              displayValue="title"
              className="multi_select_dropdown w-100"
              options={Framework}
              selectedValues={selectedFramework}
              ref={multiselectRef}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem);
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formChartType">
            <Form.Label>Select Chart Type</Form.Label>
            <Form.Select
              aria-label="Select Chart Type"
              onChange={(e) => setSelectedChartType(e.target.value)}
              value={selectedChartType}
            >
              <option value="ColumnChart">Column Chart</option>
              <option value="BarChart">Bar Chart</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style" onClick={handleApplyFilter}>
            Apply
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyDisclosureProgressComponent;
