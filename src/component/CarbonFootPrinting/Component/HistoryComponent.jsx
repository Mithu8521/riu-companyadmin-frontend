import React from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import the FontAwesome back icon
import { Col, Form, Button } from "react-bootstrap";
import down from "../../../img/DownArrow.svg";
const HistoryComponent = ({ handleHistoryClick }) => {
  const historyData = [
    {
      id: 1,
      date: "25/06/2024",
      assessedBy: "Ganesh M B",
      questions: "Fuels",
      remarks: "write the remark here",
    },
    {
      id: 2,
      date: "25/06/2024",
      assessedBy: "Ganesh M B",
      questions: "Bio-Energy",
      remarks: "write the remark here",
    },
    {
      id: 3,
      date: "25/06/2024",
      assessedBy: "Ganesh M B",
      questions: "Bio-Energy",
      remarks: "write the remark here",
    },
    {
      id: 4,
      date: "25/06/2024",
      assessedBy: "Ganesh M B",
      questions: "Fuels",
      remarks: "write the remark here",
    },
  ];

  const handleBackClick = () => {
    // Add your back navigation logic here
    handleHistoryClick();
  };

  return (
    <div>
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <FaArrowLeft
          onClick={handleBackClick}
          style={{ width: "16px", height: "16px" }}
          className="mr-2"
        />
      </div>

      {/* Dropdown and Table */}
      <div
        style={{ justifyContent: "space-between" }}
        className="d-flex w-100 items-center mb-4"
      >
        <Col style={{ marginRight: "0px" }} md={2}>
          <Form.Group controlId={`typeSelect-${0}`}>
            <Form.Label>Financial Year</Form.Label>

            {/* Wrapper with position: relative */}
            <div style={{ position: "relative" }}>
              {/* Form Control */}
              <Form.Control
                style={{
                  backgroundColor: "#dfebf0",
                  paddingRight: "30px",
                }} // Extra padding for arrow
                as="select"
              >
                <option>FY 2023-2024</option>
              </Form.Control>

              {/* Down Arrow SVG */}
              <img
                src={down} // Replace with the actual path to your SVG
                alt="Down arrow"
                style={{
                  position: "absolute",
                  right: "10px", // Adjust the arrow's position
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none", // Prevent interaction with the image
                  width: "16px", // Adjust the size of the arrow
                  height: "16px",
                }}
              />
            </div>
          </Form.Group>
        </Col>
        <Col style={{ marginRight: "0px" }} md={2}>
          <Form.Group controlId={`typeSelect-${0}`}>
            <Form.Label>Select Period</Form.Label>

            {/* Wrapper with position: relative */}
            <div style={{ position: "relative" }}>
              {/* Form Control */}
              <Form.Control
                style={{
                  backgroundColor: "#dfebf0",
                  paddingRight: "30px",
                }} // Extra padding for arrow
                as="select"
              >
                <option>Select Period</option>
                <option>H1</option>
                <option>H2</option>
              </Form.Control>

              {/* Down Arrow SVG */}
              <img
                src={down} // Replace with the actual path to your SVG
                alt="Down arrow"
                style={{
                  position: "absolute",
                  right: "10px", // Adjust the arrow's position
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none", // Prevent interaction with the image
                  width: "16px", // Adjust the size of the arrow
                  height: "16px",
                }}
              />
            </div>
          </Form.Group>
        </Col>
      </div>

      <div className="container mx-auto p-4">
        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse ">
            <thead>
              <tr className="bg-blue-100">
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">#</th>
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">Assessment Date</th>
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">Assessed By</th>
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">
                  Assessed Questions
                </th>
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">Remarks</th>
                <th style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }} className="p-2">{item.id}</td>
                  <td className="p-2" style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }}>{item.date}</td>
                  <td className="p-2" style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }}>
                    {item.assessedBy}
                  </td>
                  <td className="p-2" style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }}>
                    {item.questions}
                  </td>
                  <td className="p-2" style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }}>
                    {item.remarks}
                  </td>
                  <td className="p-2" style={{ paddingBottom: "5px", borderBottom: "2px solid #83BBD5", textAlign: 'center', color: "#11546f", fontWeight: 600, fontSize: "14px" }}>
                    <Button variant="primary"
                      className="w-30"
                      style={{ fontSize: "16px" }} >
                      View Answer
                    </Button >
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryComponent;
