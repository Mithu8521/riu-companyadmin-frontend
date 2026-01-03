import React, { useEffect, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { ProductsPieChartData } from "./chartData";
import ProductPieCharts from "./Chart/ProductPieChart";

const TotalProductWise = ({ category, data, type, handleApplyFilters, size }) => {
  const frequency = JSON.parse(localStorage.getItem("currentUser")).frequency;
  const [filter, setFilter] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [selectedTimeLine, setSelectedTimeLine] = useState(null);
  const handleFilterClose = () => setFilter(false);
  // const onFilterOpenHandler = (e, type) => {
  //   e.preventDefault();
  //   setFilter(true);
  // };

  // const generateOptions = () => {
  //   const fiscalYear = "FY 2023-24";
  //   let options = "";

  //   if (frequency === "MONTHLY") {
  //     options += `
  //       <option value="M1">${fiscalYear}(M1)</option>
  //       <option value="M2">${fiscalYear}(M2)</option>
  //       <option value="M3">${fiscalYear}(M3)</option>
  //       <option value="M4">${fiscalYear}(M4)</option>
  //       <option value="M5">${fiscalYear}(M5)</option>
  //       <option value="M6">${fiscalYear}(M6)</option>
  //       <option value="M7">${fiscalYear}(M7)</option>
  //       <option value="M8">${fiscalYear}(M8)</option>
  //       <option value="M9">${fiscalYear}(M9)</option>
  //       <option value="M10">${fiscalYear}(M10)</option>
  //       <option value="M11">${fiscalYear}(M11)</option>
  //       <option value="M12">${fiscalYear}(M12)</option>      
  //         <option value="Q1">${fiscalYear}(Q1)</option>
  //         <option value="Q2">${fiscalYear}(Q2)</option>
  //         <option value="Q3">${fiscalYear}(Q3)</option>
  //         <option value="Q4">${fiscalYear}(Q4)</option>
  //         <option value="H1">${fiscalYear}(H1)</option>
  //         <option value="H2">${fiscalYear}(H2)</option>
  //         <option value="Y">${fiscalYear}(Y)</option>
  //       `;
  //   } else if (frequency === "QUATERLY") {
  //     options += `
  //       <option value="Q1">${fiscalYear}(Q1)</option>
  //       <option value="Q2">${fiscalYear}(Q2)</option>
  //       <option value="Q3">${fiscalYear}(Q3)</option>
  //       <option value="Q4">${fiscalYear}(Q4)</option>
  //       <option value="H1">${fiscalYear}(H1)</option>
  //       <option value="H2">${fiscalYear}(H2)</option>
  //       <option value="Y">${fiscalYear}(Y)</option>
  //     `;
  //   } else if (frequency === "HALF_YEARLY") {
  //     options += `
  //       <option value="H1">${fiscalYear}(H1)</option>
  //       <option value="H2">${fiscalYear}(H2)</option>
  //       <option value="Y">${fiscalYear}(Y)</option>
  //     `;
  //   } else if (frequency === "YEARLY") {
  //     options += `<option value="Y">${fiscalYear}(Y)</option>`;
  //   }

  //   return options;
  // };
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
        await ProductsPieChartData(data?.direct ? data.series : data?.series[0], data?.categories, data?.graphType ? data?.graphType : "pie", data?.unit, data?.color,
          data?.questionIds, data?.differentBar, data?.opacity, data?.datas, data?.stacked, data?.dataLevel, data?.ofsetY, data?.percentageShow, data?.gaps, data?.numberouter,
          data?.grouped, data?.notAllRadious)
      );
    };
    fetchData();
  }, [data]);
  return (
    <div className="container" style={{ height: "100%" }}>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className=" d-flex align-items-center justify-content-between">
            <h5 className="m-0">
              <b>{category}</b>
            </h5>

            {/* {data?.filter === false ? <></> :<button
              onClick={(e) => {
                onFilterOpenHandler(e, category);
              }}
              className="new_button_style"
            >
              <i
                className="fas fa-filter"
                title={`${category} Progress Filter`}
              ></i>
            </button>} */}
          </div>
          <div className="p-0">
            <div className="main_text">
              <ProductPieCharts chartData={currentData} type={data?.graphType ? data?.graphType : "pie"} size={size} />
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

export default TotalProductWise;
