import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { BarChart, ColumnChart } from "./Chart";
import {
  ColumnChartDataForQuestionType,
  BarChartDataForQuestionType,
  LineChartData,
} from "./chartData";
import FilterDashoard from "../../../../img/sector/filter.png";
import Multiselect from "multiselect-react-dropdown";
import { useHistory } from "react-router-dom";
import LineCharts from "./Chart/LineChart";

const ComapreLineChartComponent = ({
  category,
  data,
  handleApplyFilters,
  type,
  enable,
  unit
}) => {
  const history = useHistory();
  const frequency = JSON.parse(localStorage.getItem("currentUser")).frequency;
  const [filter, setFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [selectedChartType, setSelectedChartType] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [chartType, setChartType] = useState("LineChart");
  const handleFilterClose = () => setFilter(false);
  const multiselectRefTracker = useRef();

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
  const onSelectsdf = () => {

    const data1 = LineChartData(
      data?.series[0],
      data?.categories[0],
      unit,

    );
    return data1;
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
    const filterData = {
      frequency: selectedFrequency,
      locationIds: selectedLocationId,
      questionIds: selectedQuestionId,
      chartType: selectedChartType,
    };
    handleApplyFilters(category, filterData, type);
    handleFilterClose();
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentData(

        await onSelectsdf()
      );
    };
    setSelectedChartType(data?.filterData?.chartType);
    setSelectedFrequency(data?.filterData?.frequency);
    setSelectedLocationId(data?.filterData?.locationIds);
    setSelectedQuestionId(data?.filterData?.questionIds);
    const filteredArray = data?.locationOptions ? data?.locationOptions.filter((obj) =>
      data?.filterData?.locationIds.includes(obj.id)
    ) : [];
    setSelectedLocation(filteredArray);
    const questionArray = data?.questionOptions ? Object.entries(data?.questionOptions).map(
      ([id, name]) => ({ id: parseInt(id), name })
    ) : [];
    const filteredQuestionArray = questionArray.filter((obj) =>
      data?.filterData?.questionIds.includes(obj.id)
    );
    setSelectedQuestion(filteredQuestionArray);
    setQuestionData(questionArray);
    setLocationData(data?.locationOptions);
    fetchData();
  }, [data]);
  return (
    <>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className="esg_score_title d-flex align-items-center justify-content-between">
            <h5 className="m-0">
              <b>{category}</b>
            </h5>

            <button
              onClick={() => {
                setFilter(true);
              }}
              className="new_button_style"
            >
              <i className="fas fa-filter" title={`${category} Progress Filter`}></i>
            </button>

          </div>
          <div className="p-0">
            <div className="main_text">
              <LineCharts chartData={currentData} />
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
            <Form.Label>Select Frequency</Form.Label>
            {frequency === "MONTHLY" ? (
              <Form.Select
                aria-label="Select Chart Type"
                onChange={(e) => setSelectedFrequency(e.target.value)}
                value={selectedFrequency}
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="QUATERLY">QUARTERLY</option>
                <option value="HALF_YEARLY">HALF YEARLY</option>
                <option value="YEARLY">YEARLY</option>
              </Form.Select>
            ) : frequency === "QUATERLY" ? (
              <Form.Select
                aria-label="Select Chart Type"
                onChange={(e) => setSelectedFrequency(e.target.value)}
                value={selectedFrequency}
              >
                <option value="QUATERLY">QUARTERLY</option>
                <option value="HALF_YEARLY">HALF YEARLY</option>
                <option value="YEARLY">YEARLY</option>
              </Form.Select>
            ) : frequency === "HALF_YEARLY" ? (
              <Form.Select
                aria-label="Select Chart Type"
                onChange={(e) => setSelectedFrequency(e.target.value)}
                value={selectedFrequency}
              >
                <option value="HALF_YEARLY">HALF YEARLY</option>
                <option value="YEARLY">YEARLY</option>
              </Form.Select>
            ) : (
              <Form.Select
                aria-label="Select Chart Type"
                onChange={(e) => setSelectedFrequency(e.target.value)}
                value={selectedFrequency}
              >
                <option value="YEARLY">YEARLY</option>
              </Form.Select>
            )}
          </Form.Group>


          <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Location</Form.Label>
            <Multiselect
              displayValue="location"
              options={locationData}
              selectedValues={selectedLocation}
              ref={multiselectRefTracker}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem, "LOCATION");
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems, "LOCATION");
              }}
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Question</Form.Label>
            <Multiselect
              displayValue="name"
              options={questionData}
              selectedValues={selectedQuestion}
              ref={multiselectRefTracker}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem, "QUESTION");
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems, "QUESTION");
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
              <option value="LineChart">Line Chart</option>

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

export default ComapreLineChartComponent;
