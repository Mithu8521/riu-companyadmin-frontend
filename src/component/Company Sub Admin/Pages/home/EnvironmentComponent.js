import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { PieChartData } from "./chartData";
import PieCharts from "./Chart/PieCharts";

const EnvironmentComponent = ({ Heading, type, category, data, color, questionIds }) => {
  const frequency = JSON.parse(localStorage.getItem("currentUser")).frequency;
  const [filter, setFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [headings, setHeadings] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const handleFilterClose = () => setFilter(false);
  const multiselectRefTracker = useRef();
  const onFilterOpenHandler = (e, type) => {
    e.preventDefault();
    setFilter(true);
    setHeadings(type);
  };

  const onSelectHandler = (data, type) => {
    const selectedIds = data && data.map(({ id }) => id);
    if (type === "QUESTION") {
      setSelectedQuestionId(selectedIds || []);
      setSelectedQuestion(data || []);
    } else if (type === "LOCATION") {
      setSelectedLocationId(selectedIds || []);
      setSelectedLocation(data || []);
    }
  };

  const onRemoveHandler = (data, type) => {
    if (data && data.length === 0) {
      if (type === "QUESTION") {
        setSelectedQuestionId([]);
        setSelectedQuestion([]);
      } else if (type === "LOCATION") {
        setSelectedLocationId([]);
        setSelectedLocation([]);
      }
    } else {
      onSelectHandler(data, type);
    }
  };
  const handleApplyFilter = async () => {
    if (selectedChartType === "ColumnChart") {
      const fetchData = async () => {
        setCurrentData(await PieChartData(data?.series, data?.categories, "bar", false));
      };
      fetchData();
    } else if (selectedChartType === "BarChart") {
      const fetchData = async () => {
        setCurrentData(await PieChartData(data?.series, data?.categories, "bar", true));
      };
      fetchData();
    } else if (selectedChartType === "PieChart") {
      const fetchData = async () => {
        setCurrentData(await PieChartData(data?.series, data?.categories, "pie", true));
      };
      fetchData();
    } else if (selectedChartType === "DonutChart") {
      const fetchData = async () => {
        setCurrentData(await PieChartData(data?.series, data?.categories, "donut", true));
      };
      fetchData();

    }

    handleFilterClose();
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentData(await PieChartData(data?.series, data?.categories, type, data?.unit, data?.color, data?.questionIds));
    };
    fetchData();
  }, [data]);
  return (
    <>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className="esg_score_title d-flex align-items-center justify-content-between">
            <h5 className="m-0">
              <b>{Heading}</b>
            </h5>

            {/* <button
              onClick={(e) => {
                onFilterOpenHandler(e,Heading);
              }}
              className="new_button_style"
            >
              <i
                className="fas fa-filter"
                title={`${category} Progress Filter`}
              ></i>
            </button> */}
          </div>
          <div className="p-0">
            <div className="main_text">
              <PieCharts chartData={currentData} type={!selectedChartType ? type : selectedChartType === "ColumnChart" ? "bar" : selectedChartType === "BarChart" ? "bar" : selectedChartType === "PieChart" ? "pie" : selectedChartType === "DonutChart" ? "donut" : type} />
            </div>
          </div>
        </div>
      </Col>
      <Modal size="md" show={filter} onHide={handleFilterClose}>
        <Modal.Header closeButton>
          <Form.Label className="align-items-center m-0">
            <strong>{category} Filter</strong>
          </Form.Label>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formChartType">
            <Form.Label>Select Chart Type</Form.Label>
            <Form.Select
              aria-label="Select Chart Type"
              onChange={(e) => setSelectedChartType(e.target.value)}
              value={selectedChartType}
            >
              {console.log(headings, "headingsheadingsheadingsheadings")}
              {(headings == "Top Waste Disposal Sites" || headings == "Top Water Consuming Sites" || headings == "Top Emissions Contributing Sites" || headings == "Top Energy Consuming Sites") ?
                <>
                  <option value="ColumnChart">Column Chart</option>
                  <option value="BarChart">Bar Chart</option>
                </>
                : (headings == "Renewable And Non-Renewable Energy Mix" || headings == "Scope 1 And Scope 2 Emissions" || headings == "Total Water Withdrawn And Discharged" ||
                  headings == "Waste Disposed By Type") ?
                  <>
                    <option value="PieChart">Pie Chart</option>
                    <option value="DonutChart">Donut Chart</option>
                  </> : <>
                    <option value="ColumnChart">Column Chart</option>
                    <option value="BarChart">Bar Chart</option>
                  </>
              }


            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style" onClick={handleApplyFilter}>Apply</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnvironmentComponent;
