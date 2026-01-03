import React, { useEffect, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { ProductsScaterChartData } from "./chartData";
import ProductPieCharts from "./Chart/ProductPieChart";

const TimewiseProductWise = ({ category, data, type, handleApplyFilters, unit, size }) => {
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
                await ProductsScaterChartData(data?.series, data?.categories, unit)
            );
        };
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
                            onClick={(e) => {
                                onFilterOpenHandler(e, category);
                            }}
                            className="new_button_style"
                        >
                            <i
                                className="fas fa-filter"
                                title={`${category} Progress Filter`}
                            ></i>
                        </button>
                    </div>
                    <div className="p-0">
                        <div className="main_text">
                            <ProductPieCharts chartData={currentData} type={"scatter"} size={size} />
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
        </>
    );
};

export default TimewiseProductWise;
