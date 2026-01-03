import React, { useState, useEffect } from "react";
import config from "../../config/config.json";
import { Button, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./working_progress.css";
import { apiCall } from "../../_services/apiCall";
import Loader from "../loader/Loader";
import edit from "./edit.png";
import deletee from "./delete.png";
import add from "./add.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const LocationManagement = ({ tab, userPermissionList }) => {
  const [unitName, setUnitName] = useState("");
  const [meterDataList, setMeterDataList] = useState([]);
  const [filterListValue, setFilterListValue] = useState([]);
  const [headOfficeTrueCount, setHeadOfficeTrueCount] = useState([]);
  const [headOfficeFalseCount, setHeadOfficeFalseCount] = useState([]);
  const [address, setAddress] = useState("");
  const [showSkelton, setshowSkelton] = useState(false);
  const [mode, setMode] = useState("create");
  const [showAddLocation, setAddLocationShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [deleteLocationPopup, setDeleteLocationPopup] = useState(false);
  const [unitLocationPopup, setUnitLocationPopup] = useState(false);
  const [confirmUnitPopup, setConfirmUnitPopup] = useState(false);
  const closeDeleteLocationPopup = () => setDeleteLocationPopup(false);
  const closeUnitLocationPopup = () => {
    setUnitLocationPopup(false);
    setUnitName("");
  };
  const closeConfirmUnitPopup = () => setConfirmUnitPopup(false);
  const closeUnitLocationDataPopup = () => setUnitLocationDataPopup(false);
  const [unitLocationDataPopup, setUnitLocationDataPopup] = useState(false);
  const [unitData, setUnitData] = useState([]);

  const handleAddUnit = async () => {
    if (unitName.trim()) {
      setSpinner(true);
      const { isSuccess, data, error } = await apiCall(
        config.POSTLOGIN_API_URL_COMPANY + `createSubLocation`,
        {},
        {
          subLocation: unitName,
          locationId: selectedId,
        },
        "POST"
      );
      setSpinner(false);
      if (isSuccess) {
        getSource();
        setUnitName("");
        closeConfirmUnitPopup();
        closeUnitLocationPopup();
      }
    }
  };

  const handleConfirmUnit = () => {
    if (unitName.trim()) {
      setConfirmUnitPopup(true);
    }
  };

  const handleImageClick = async (data) => {
    setUnitData(data);
    setUnitLocationDataPopup(true);
  };

  const showUnitLocationPopup = (id) => {
    setSelectedId(id);
    setUnitLocationPopup(true);
  };

  const showDeleteLocationPopup = (id) => {
    setSelectedId(id);
    setDeleteLocationPopup(true);
  };

  const handleAddLocationShow = () => {
    setMode("create");
    setAddLocationShow(true);
  };

  const handleEditLocationShow = (id, location) => {
    setMode("edit");
    setSelectedId(id);
    setAddress(location.area);
    setSelectedLocation(location);
    setAddLocationShow(true);
  };

  const handleClose = () => {
    setMode("create");
    setAddLocationShow(false);
  };

  const [selectedLocation, setSelectedLocation] = useState({
    area: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [selectedUnitCode, setSelectedUnitCode] = useState();

  const userId = JSON.parse(localStorage.getItem("user_temp_id"));

  const createSource = async (id, e) => {
    setSpinner(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createSource`,
      {},
      {
        location: JSON.stringify(selectedLocation),
        unitCode: selectedUnitCode
      },
      "POST"
    );
    setSpinner(false);
    if (isSuccess) {
      getSource();
      setAddress("");
      setSelectedLocation({
        area: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
      handleClose();
    }
  };

  const getSource = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      setMeterDataList(data?.data?.reverse());
      setFilterListValue(data?.data);
      const headOfficeTrueCount =
        data?.data?.filter((item) => item.head_Office === true) || [];
      const headOfficeFalseCount =
        data?.data?.filter((item) => item.head_Office === false) || [];
      setHeadOfficeTrueCount(headOfficeTrueCount);
      setHeadOfficeFalseCount(headOfficeFalseCount);
    }
  };

  const updateSource = async (e) => {
    setSpinner(true);
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updateSource`,
      {},
      {
        location: JSON.stringify(selectedLocation),
        id: selectedId,
      },
      "POST"
    );
    setSpinner(false);
    if (isSuccess) {
      getSource();
      setAddress("");
      handleClose();
      setSelectedLocation({
        area: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });
      handleClose();
    }
  };
  const deleteSource = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `deleteSource`,
      {},
      { id: selectedId },
      "POST"
    );
    if (isSuccess) {
      getSource();
      closeDeleteLocationPopup();
    }
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const addressComponents = results[0].address_components;
      const localityIndex = addressComponents.findIndex((component) =>
        component.types.includes("locality")
      );
      const area = addressComponents
        .slice(0, localityIndex)
        .map((component) => component.long_name)
        .join(", ");
      const city =
        addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name || "";

      const state =
        addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const country =
        addressComponents.find((component) =>
          component.types.includes("country")
        )?.long_name || "";
      const zipCode =
        addressComponents.find((component) =>
          component.types.includes("postal_code")
        )?.long_name || "";
      setAddress(area);
      setSelectedLocation({
        area,
        city,
        state,
        country,
        zipCode,
      });
    } catch (error) {
      console.error("Error selecting location", error);
    }
  };
  const handleManualInputChange = (field, value) => {
    setSelectedLocation((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (trimmedSearchTerm === "") {
      setFilterListValue([...meterDataList]);
    } else {
      const filteredResult = meterDataList.filter((item) => {
        const lowerCaseCompanyName = (item.company_name || "").toLowerCase();
        const location = item.location || {};
        if (location && typeof location === "object") {
          return (
            lowerCaseCompanyName.includes(trimmedSearchTerm) ||
            (location.area || "").toLowerCase().includes(trimmedSearchTerm) ||
            (location.city || "").toLowerCase().includes(trimmedSearchTerm) ||
            (location.state || "").toLowerCase().includes(trimmedSearchTerm) ||
            (location.country || "")
              .toLowerCase()
              .includes(trimmedSearchTerm) ||
            (location.zipCode || "").toLowerCase().includes(trimmedSearchTerm)
          );
        }
        return false;
      });
      setFilterListValue(filteredResult);
    }
  };

  useEffect(() => {
    getSource();
  }, [tab]);
  return (
    <>
      <div
        className="Introduction framwork_2"
        style={{ background: "white", borderRadius: "15px" }}
      >
        <section
          className="forms"
          style={{ background: "white", borderRadius: "15px", padding: "2rem" }}
        >
          <div
            className="d-flex w-100 align-items-center justify-content-between"
            style={{ marginBottom: "50px" }}
          >
            <div className="w-100 d-flex justify-content-between">
              <div style={{ width: "85%" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <span
                    className="search-icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#3f8aa5",
                      pointerEvents: "none",
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </span>

                  <input
                    type="search"
                    className="w-100"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #3f8aa5",
                      padding: "10px 30px 10px 35px",
                    }}
                    placeholder="Search"
                    name="search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {userPermissionList.some(
                (permission) =>
                  permission.permissionCode === "CREATE" && permission.checked
              ) && (
                <div>
                  <button
                    className=""
                    onClick={handleAddLocationShow}
                    style={{
                      background: "#3F8AA5",
                      border: "none",
                      padding: "10px 30px",
                      borderRadius: "5px",
                      color: "white",
                    }}
                  >
                    Add Location
                  </button>
                </div>
              )}
            </div>
          </div>
          {!showSkelton && headOfficeTrueCount.length ? (
            <div className="table_setting">
              <Table striped bordered style={{ tableLayout: "fixed", width: "100%" }}>
                <thead style={{ border: "none" }}>
                  <tr
                    className="fixed_tr_section"
                    style={{
                      border: "none",
                      borderBottom: "2px solid #83BBD5",
                    }}
                  >
                    <th
                      style={{
                        width: "6%",
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      #
                    </th>

                    <th
                      style={{
                        width: "64%",
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Corporate Headquarters Address
                    </th>
                    <th
                      style={{
                        width: "20%",
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Unit Code
                    </th>
                    <th
                      style={{
                        width: "10%",
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
              </Table>
              {!showSkelton ? (
                <div style={{ width: "100%" }}>
                  {filterListValue && filterListValue?.length > 0 ? (
                    filterListValue?.map((data, key) => {
                      return (
                        data &&
                        data?.head_Office === true && (
                          <div
                            key={key}
                            style={{ display: "flex", width: "100%" }}
                          >
                            <div
                              style={{
                                width: "6%",
                                color: "#3f8aa5",
                                fontSize: "16px",
                              }}
                            >
                              1
                            </div>
                            <div
                              style={{
                                width: "64%",
                                color: "#3f8aa5",
                                fontSize: "16px",
                              }}
                            >
                              {data.location.area}, {data.location.city},{" "}
                              {data.location.state}, {data.location.country} -{" "}
                              {data.location.zipCode}
                            </div>
                            <div
                              style={{
                                width: "20%",
                                color: "#3f8aa5",
                                fontSize: "16px",
                              }}
                            >
                              {data.unitCode}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                width: "10%",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={add}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  showUnitLocationPopup(data?.id);
                                }}
                              />
                               {data?.subLocation.length ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          borderRadius: "50%",
                                          height: "40px",
                                          width: "40px",
                                          background: "#E6F1F7",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                          transition: "transform 0.3s ease",
                                        }}
                                        onClick={() =>
                                          handleImageClick(data?.subLocation)
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          style={{
                                            fontSize: "20px",
                                            color: "#000",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ) : <></>}
                            </div>
                          </div>
                        )
                      );
                    })
                  ) : (
                    <tr>
                      <td>--</td>
                      <td>No Data Found</td>
                      <td>--</td>
                    </tr>
                  )}
                </div>
              ) : (
                <Loader />
              )}
              <hr className="line" style={{ color: " #83BBD5" }} />
              {filterListValue &&
              filterListValue?.length > 0 &&
              headOfficeFalseCount.length ? (
                <div className="">
                  <Table striped bordered style={{ tableLayout: "fixed", width: "100%" }}>
                    <thead style={{ border: "none" }}>
                      <tr
                        className="fixed_tr_section"
                        style={{
                          border: "none",
                          borderBottom: "2px solid #83BBD5",
                        }}
                      >
                        <th
                          style={{
                            width: "6%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          #
                        </th>

                        <th
                          style={{
                            width: "64%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Regional Office Address
                        </th>
                        <th
                          style={{
                            width: "20%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Unit Code
                        </th>
                        <th
                          style={{
                            width: "10%",
                            border: "none",
                            color: "#11546f",
                            fontSize: "18px",
                            fontWeight: 600,
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                  </Table>

                  {!showSkelton ? (
                    <div style={{ width: "100%" }}>
                      {filterListValue && filterListValue?.length > 0 ? (
                        filterListValue?.map((data, key) => {
                          return (
                            data &&
                            data?.head_Office === false && (
                              <div
                                key={key}
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  padding: "20px 0px",
                                  borderBottom: "1px solid #83BBD5",
                                }}
                              >
                                <div
                                  style={{
                                    width: "6%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                  }}
                                >
                                  {key + 1}
                                </div>
                                <div
                                  style={{
                                    width: "64%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                  }}
                                >
                                  {data.location.area}, {data.location.city},{" "}
                                  {data.location.state}, {data.location.country}{" "}
                                  - {data.location.zipCode}
                                </div>
                                <div
                                  style={{
                                    width: "20%",
                                    color: "#3f8aa5",
                                    fontSize: "16px",
                                  }}
                                >
                                  {data.unitCode}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    width: "10%",
                                    alignItems: "center",
                                  }}
                                >
                                  {data?.is_deletable &&
                                    userPermissionList.some(
                                      (permission) =>
                                        permission.permissionCode === "EDIT" &&
                                        permission.checked
                                    ) && (
                                      <img
                                        src={edit}
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleEditLocationShow(
                                            data?.id,
                                            data?.location
                                          )
                                        }
                                      />
                                    )}
                                  {data?.is_deletable &&
                                    userPermissionList.some(
                                      (permission) =>
                                        permission.permissionCode ===
                                          "DELETE" && permission.checked
                                    ) && (
                                      <img
                                        src={deletee}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          showDeleteLocationPopup(data?.id);
                                        }}
                                      />
                                    )}
                                  <img
                                    src={add}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      showUnitLocationPopup(data?.id);
                                    }}
                                  />
                                  {data?.subLocation.length ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          borderRadius: "50%",
                                          height: "40px",
                                          width: "40px",
                                          background: "#E6F1F7",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                          transition: "transform 0.3s ease",
                                        }}
                                        onClick={() =>
                                          handleImageClick(data?.subLocation)
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          style={{
                                            fontSize: "20px",
                                            color: "#000",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ) : <></>}
                                </div>
                              </div>
                            )
                          );
                        })
                      ) : (
                        <tr>
                          <td>--</td>
                          <td>No Data Found</td>
                          <td>--</td>
                        </tr>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div className="hstack justify-content-center">
                  <img src={""} alt="" srcSet="" />
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </section>
      </div>
      {/* Add Location ---------------------- */}
      <Modal show={showAddLocation} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>
              {mode === "create" ? "Create" : "Update"} Address
            </Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <input
                      {...getInputProps({
                        placeholder: "Type your location... *",
                        className: "location-search-input w-100 mb-2 ",
                      })}
                      style={{ padding: "10px 20px" }}
                      required
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => (
                        <div
                          {...getSuggestionItemProps(suggestion)}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </Col>
            <Col md={6}>
              <input
                className="w-100 mb-2"
                placeholder="Enter City"
                type="text"
                readOnly
                style={{ padding: "10px 20px" }}
                value={selectedLocation.city}
                onChange={(e) =>
                  handleManualInputChange("city", e.target.value)
                }
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                className="w-100 mb-2"
                style={{ padding: "10px 20px" }}
                placeholder="Enter State"
                readOnly
                value={selectedLocation.state}
                onChange={(e) =>
                  handleManualInputChange("state", e.target.value)
                }
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                className="w-100 mb-2"
                style={{ padding: "10px 20px" }}
                placeholder="Enter Country"
                readOnly
                value={selectedLocation.country}
                onChange={(e) =>
                  handleManualInputChange("country", e.target.value)
                }
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                className="w-100 mb-2"
                style={{ padding: "10px 20px" }}
                placeholder="Enter Zip Code"
                readOnly
                value={selectedLocation.zipCode}
                onChange={(e) =>
                  handleManualInputChange("zipCode", e.target.value)
                }
              />
            </Col>
            <Col md={12}>
              <input
                type="text"
                className="w-100 mb-2"
                style={{ padding: "10px 20px" }}
                placeholder="Enter Unit Code"
                value={selectedUnitCode}
                onChange={(e) =>
                  setSelectedUnitCode(e.target.value)
                }
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {spinner ? (
            <button className="new_button_style" disabled>
              <Spinner animation="border" />{" "}
              {mode === "create" ? "Creating" : "Updating"}
            </button>
          ) : (
            <button
              className="new_button_style"
              disabled={!selectedLocation.zipCode}
              type="submit"
              onClick={mode === "create" ? createSource : updateSource}
            >
              {mode === "create" ? "Create Location" : "Update Location"}
            </button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={deleteLocationPopup} onHide={closeDeleteLocationPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Confirmation</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            type="submit"
            onClick={() => deleteSource()}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
      
      {/* Add Unit Location Modal */}
      <Modal show={unitLocationPopup} onHide={closeUnitLocationPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Add Unit Location</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="unitLocation">
            <Form.Control
              type="text"
              placeholder="Enter unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUnitLocationPopup}>
            Cancel
          </Button>
          <button
            className="new_button_style"
            disabled={!unitName.trim()}
            type="button"
            onClick={handleConfirmUnit}
          >
            Review
          </button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Adding Unit */}
      <Modal show={confirmUnitPopup} onHide={closeConfirmUnitPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Confirm Unit Addition</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to add the unit "{unitName}"?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            closeConfirmUnitPopup();
          }}>
            Go Back
          </Button>
          {spinner ? (
            <button className="new_button_style" disabled>
              <Spinner animation="border" /> Saving
            </button>
          ) : (
            <button
              className="new_button_style"
              type="submit"
              onClick={handleAddUnit}
            >
              Confirm & Save
            </button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={unitLocationDataPopup} onHide={closeUnitLocationDataPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Unit Location</Form.Label>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {unitData?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Unit Name</th>
                </tr>
              </thead>
              <tbody>
                {unitData.map((unit, index) => (
                  <tr key={unit.id}>
                    <td>{index + 1}</td>
                    <td>{unit?.subLocation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No data available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeUnitLocationDataPopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LocationManagement;