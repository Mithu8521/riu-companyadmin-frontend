import React, { useEffect, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { ProductsPieChartData, ColumnChartDataForTraining } from "./chartData";
import ProductPieCharts from "./Chart/ProductPieChart";

const DifferentColumnCharts = ({ category, data, type, handleApplyFilters, size }) => {
  const frequency = JSON.parse(localStorage.getItem("currentUser")).frequency;
  const [filter, setFilter] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [selectedTimeLine, setSelectedTimeLine] = useState(null);
  const handleFilterClose = () => setFilter(false);
  const onFilterOpenHandler = (e, type) => {
    e.preventDefault();
    setFilter(true);
  };


  const handleApplyFilter = async () => {
    const filterData = {
      timeLine: selectedTimeLine,
      locationIds: [],
      questionIds: [],
      chartType: "PieChart",
    };
    handleApplyFilters(category, filterData, type);
    handleFilterClose();
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentData(
        await ColumnChartDataForTraining(data?.categories, data.series, data?.color, data?.unit, data?.datas, data?.maximum)
      );
    };
    fetchData();
  }, [data]);

  // useEffect(() => {
  //   const fetchData = async () => {

  //     const filteredData = data.series
  //     .map((value, index) => (value !== 0 ? { value, category: data?.categories[index], color: data?.color[index] } : null))
  //     .filter(item => item !== null);

  //   const filteredCategories = filteredData.map(item => item.category);
  //   const filteredSeriesData = filteredData.map(item => item.value);
  //   const filteredColors = filteredData.map(item => item.color);

  //   // Determine the maximum value
  //   const maximum = Math.max(...filteredSeriesData);

  //   const chartData = {
  //     categories: filteredCategories,
  //     series: [{ data: filteredSeriesData }],
  //     direct: true,
  //     graphType: "bar",
  //     filter: false,
  //     datas:data?.datas,
  //     unit: data?.unit,
  //     color: filteredColors,
  //     maximum: maximum
  //   };

  //     setCurrentData(await ColumnChartDataForTraining(chartData.categories, chartData.series, chartData.color, chartData.unit, chartData.datas, chartData.maximum));
  //   };
  //   fetchData();
  // }, [data]);
  return (
    <div className="container" style={{ height: "100%" }}>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className=" d-flex align-items-center justify-content-between">
            <h5 className="m-0">
              <b>{category}</b>
            </h5>
          </div>
          <div className="p-0">
            <div className="main_text">
              <ProductPieCharts chartData={currentData} type='bar' size={size} />
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
            <Form.Label>Select Time Line</Form.Label>
            <Form.Select
              aria-label="Select Chart Type"
              onChange={(e) => setSelectedTimeLine(e.target.value)}
              value={selectedTimeLine}
            >
              <option value="Q1">FY 2023-24(Q1)</option>
              <option value="Q2">FY 2023-24(Q2)</option>
              <option value="Q3">FY 2023-24(Q3)</option>
              <option value="Q4">FY 2023-24(Q4)</option>
              <option value="H1">FY 2023-24(H1)</option>
              <option value="H2">FY 2023-24(H2)</option>
              <option value="Y">FY 2023-24(Y)</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style" onClick={handleApplyFilter}>
            Apply
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DifferentColumnCharts;
