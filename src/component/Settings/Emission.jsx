import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import Loader from "../loader/Loader";
import NoDataFound from "../../img/no.png";
import edit from "./edit.png";

const Emission = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [density, setDensity] = useState("");
  const [calorificValue, setCalorificValue] = useState("");
  const [emissionFactor, setEmissionFactor] = useState("");
  const [mode, setMode] = useState("create");

  const handleShowModal = (item = null) => {
    setMode(item ? "edit" : "create");
    setSelectedId(item?.stdId || null);
    setDensity(item.density || item.stdDensity || "");
    setCalorificValue(item.calorificValue || item.stdCalorificValue || "");
    setEmissionFactor(item.emissionFactor || item.stdEmissionFactor || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setDensity("");
    setCalorificValue("");
    setEmissionFactor("");
    setSelectedId(null);
  };

  const updateEmissionData = async () => {
    const payload = {
      questionId: selectedId, // Assuming this is an integer or already a valid number.
      density: parseFloat(density), // Converts `density` to a float (e.g., "2.4" → 2.4).
      calorificValue: parseFloat(calorificValue), // Converts `calorificValue` to a float.
      emissionFactor: parseFloat(emissionFactor), // Converts `emissionFactor` to a float.
    };
    const { isSuccess } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}saveEmissionQuestion`,
      {},
      payload,
      "POST"
    );

    if (isSuccess) {
      fetchEmissionData();
      handleCloseModal();
    }
  };

  const fetchEmissionData = async () => {
    setLoading(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getEmission`,
      {},
      {},
      "GET"
    );

    if (isSuccess) {
      const reversedData = data?.data?.reverse();
      setOriginalData(reversedData);
      setFilteredData(reversedData);
    }
    setLoading(false);
  };

  const handleSearch = (searchTerm) => {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (trimmedTerm === "") {
      setFilteredData([...originalData]);
    } else {
      const filtered = originalData.filter((item) =>
        item.designation.toLowerCase().includes(trimmedTerm)
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchEmissionData();
  }, []);

  return (
    <div className="container" style={{ background: "white", borderRadius: "15px", padding: "2rem" }}>
      <div className="d-flex justify-content-between mb-4">
        <input
          type="search"
          className="form-control w-50"
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : filteredData.length > 0 ? (
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Fuel</th>
              <th>Density</th>
              <th>Calorific Value</th>
              <th>Emission Factor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.stdTitle}</td>
                <td>{item.density || item.stdDensity}</td>
                <td>{item.calorificValue || item.stdCalorificValue}</td>
                <td>{item.emissionFactor || item.stdEmissionFactor}</td>
                <td>
                  <img
                    src={edit}
                    alt="Edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowModal(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">
          <img src={NoDataFound} alt="No Data Found" />
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{mode === "edit" ? "Edit Emission Data" : "Add Emission Data"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Density</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Density"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Calorific Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Calorific Value"
                value={calorificValue}
                onChange={(e) => setCalorificValue(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emission Factor</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Emission Factor"
                value={emissionFactor}
                onChange={(e) => setEmissionFactor(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={updateEmissionData}
            disabled={!density || !calorificValue || !emissionFactor}
          >
            {mode === "edit" ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Emission;
