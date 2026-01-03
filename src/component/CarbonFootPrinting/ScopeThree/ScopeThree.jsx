import React from "react";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import { useState, useEffect } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button, Col, Form, Row } from "react-bootstrap";
import down from "../../../img/DownArrow.svg";
import { FiUpload } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Scope = (props) => {
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(""); // New State for Financial Year
  const [financialYears, setFinancialYears] = useState([]); // Store Financial Years
  const [selectedLocation, setSelectedLocation] = useState("");
  const [identifier, setIdentifier] = useState();
  const [locations, setLocations] = useState([]);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [financeObjct, setFinanceObjct] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [startingMonth, setStartingMonth] = useState();
  const [activebtnTab, setactivebtnTab] = useState(0);
  const [carbonEmissionData, setCarbonEmissionData] = useState([]);
  const [fuelEmissionData, setFuelEmissionData] = useState(null);
  const [emissionField, setEmissionField] = useState(null);
  const [emissionFields, setEmissionFields] = useState(null);


  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const [fuelForms, setFuelForms] = useState([
    {
      id: crypto.randomUUID(),
      selectedFuel: "",
      selectedSubtype: "",
      readingValue: "",
      emissionValue: "",
    },
  ]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedForms = [...fuelForms];
    updatedForms[index][name] = value;

    if (name === "selectedFuel") {
      const fuel = fuelEmissionData?.fuelTypes?.find((f) => f.value === value);
      updatedForms[index].selectedFuel = fuel || "";
      updatedForms[index].selectedSubtype = ""; // Reset subtype
    }

    if (name === "selectedSubtype") {
      const subtype = updatedForms[index].selectedFuel?.fuelSubtypes?.find(
        (s) => s.value === value
      );
      updatedForms[index].selectedSubtype = subtype || "";
    }

    setFuelForms(updatedForms);
  };

  const handleReadingChange = (index, event) => {
    const updatedForms = [...fuelForms];
    updatedForms[index].readingValue = event.target.value;
    updatedForms[index].emissionValue = (
      event.target.value * fuelForms[index].selectedSubtype?.emissionFactor
    ).toFixed(2);
    setFuelForms(updatedForms);
  };

  const addFuelForm = () => {
    setFuelForms([
      ...fuelForms,
      {
        id: crypto.randomUUID(),
        selectedFuel: "",
        selectedSubtype: "",
        readingValue: "",
        emissionValue: "",
      },
    ]);
  };

  const getFrequency = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: selectedFinancialYear },
      "GET"
    );
    if (isSuccess) {
      setIdentifier(data.data);
    }
  };
  // Fetch Financial Years and set the latest one by default
  const getFinancialYears = async () => {
    try {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearsData');
      
      if (storedData) {
        // Use data from local storage
        const parsedData = JSON.parse(storedData);
        if (parsedData.length > 0) {
          setFinancialYears(parsedData);
          setSelectedFinancialYear(parsedData[parsedData.length - 1]?.id); // Auto-select last value
        }
      } else {
        // Call API if data not found in local storage
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        
        if (isSuccess && data?.data.length > 0) {
          // Store data in local storage
          localStorage.setItem('financialYearsData', JSON.stringify(data.data));
          
          // Set state with API response
          setFinancialYears(data.data);
          setSelectedFinancialYear(data.data[data.data.length - 1]?.id); // Auto-select last value
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  // Fetch Locations
  const getSource = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const extractScopeNumber = () => {
    const url = window.location.href;
    const parts = url.split("/");
    return parts[parts.length - 1].split("-")[1];
  };
  const getCarbonEmissionData = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getCarbonScopeWiseEmissionData`,
      {},
      { scope: extractScopeNumber() }
    );

    if (isSuccess) {
      setCarbonEmissionData(data.data);
      // setFuelEmissionData(data.data[0]);
    }
  };

  const getCarbonScopeWiseField = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getCarbonScopeWiseField`,
      {},
      { scope: extractScopeNumber() }
    );

    if (isSuccess) {
      setEmissionField(data.data);
    }
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const start = JSON.parse(localStorage.getItem("currentUser")).starting_month;

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;
    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  };

  useEffect(() => {
    if (identifier) {
      let options = [];
      if (identifier === "MONTHLY") {
        const options =
          start === 1
            ? months
            : [...months.slice(start - 1), ...months.slice(0, start - 1)];

        // Map options to { label, value } format
        const formattedOptions = options.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1, // Ensures values cycle correctly from 1 to 12
        }));

        setTimePeriodOptions(formattedOptions); // Update state
      } else if (identifier === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${
            months[(quarterEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
      } else if (identifier === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${
            months[(halfEndIndex - 1 + 12) % 12]
          }`;
          options.push({ label: half, value: options.length + 1 });
          setTimePeriodOptions(options);
        }
      } else if (identifier === "YEARLY") {
        const yearlyStartIndex = start - 1;
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${
              months[(yearlyStartIndex - 1 + 12) % 12]
            }`,
            value: 1,
          },
        ];
        setTimePeriodOptions(options);
      }
    }
  }, [identifier, start]);

  const handlePeriodChange = (questionId, field, value) => {
    const years = financialYears.find(
      (item) => item.id === selectedFinancialYear
    ).financial_year_value;

    const year = parseInt(years.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    let dateRange;

    if (identifier === "HALF_YEARLY") {
      const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

      const halfYear = sixMonthLater === (value + 1) % 12 ? 2 : 1;

      dateRange = calculateDateRange(6, halfYear, start, year);
    } else if (identifier === "QUARTERLY") {
      const quarter = Math.floor(value / 3) + 1;

      dateRange = calculateDateRange(3, quarter, start, year);
    } else if (identifier === "MONTHLY") {
      const startIndex = start - 1;
      const firstMonthIndex =
        (value - startIndex + months.length) % months.length;
      dateRange = calculateDateRange(1, firstMonthIndex, start, year);
    } else if (identifier === "YEARLY") {
      dateRange = calculateDateRange(12, 1, start, year);
    }
    if (dateRange) {
      // newTimePeriods[period?.label] = dateRange?.fromDate;

      if (
        !earliestFromDate ||
        new Date(dateRange.fromDate) < new Date(earliestFromDate)
      ) {
        earliestFromDate = dateRange.fromDate;
      }
      if (
        !latestToDate ||
        new Date(dateRange.toDate) > new Date(latestToDate)
      ) {
        latestToDate = dateRange.toDate;
      }
    }

    setFromDate(earliestFromDate);
    setToDate(latestToDate);
  };

  useEffect(() => {
    getFinancialYears();
    getSource();
  }, []);

  useEffect(() => {
    if (selectedFinancialYear) {
      getFrequency();
    }
  }, [selectedFinancialYear]);

  useEffect(() => {
    setStartingMonth(
      JSON.parse(localStorage.getItem("currentUser")).starting_month
    );
    setCurrentUserId(JSON.parse(localStorage.getItem("currentUser")).id);
    getCarbonScopeWiseField();
    getCarbonEmissionData();
  }, []);

  const handleTabClick = (index, key) => {
    console.log(emissionField,emissionField[key])

    setactivebtnTab(index);
    // console.log(value);
    setFuelEmissionData(carbonEmissionData[key]);
    setEmissionFields(emissionField[key]);    
    console.log(emissionField[key])
  };

  const handleRemoveFuel = (id) => {
    setFuelForms((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <div
        style={{
         flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999,transition: "flex 0.3s ease"
        }}
      >
        <Sidebar
          financeObjct={financeObjct}
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle} 
        />
      </div>

      {/* Main Content */}
      <div style={{flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease" , minHeight: "100vh", overflowY: "auto" }}>
        {/* Sticky Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            background: "white",
          }}
        >
          <Header />
        </div>

        {/* Button Container */}
        <div
          style={{
            marginBottom: "5px",
            padding: "25px",
            paddingBottom: "0px",
            paddingLeft: "3%",
          }}
        >
          <div
            className="d-flex buttoncont"
            style={{
              marginBottom: "5px",
              gap: "10px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
              paddingBottom: "5px",
            }}
          >
            {Object.keys(carbonEmissionData).map((key, index) => (
              <button
                key={key}
                className={`btn button ${
                  activebtnTab === index ? " activebtn" : ""
                }`}
                onClick={() => handleTabClick(index,key)} // Pass key's value
                style={{
                  borderRadius: "8px",
                  textAlign: "left",
                  fontSize: "16px",
                  flexShrink: 0, // Prevent buttons from shrinking
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            border: "1px solid grey",
            // padding: "5px 15px 20px 15px",
            borderRadius: "10px",
            margin: "25px 25px 0px 3%",
          }}
        >
          <div
            style={{
              margin: "15px",
              // width: "71vw",
              overflow: "auto",
              gap: "10px",
            }}
          >
            <div
              className="container rounded p-4 position-relative shadow mb-2"
              style={{ border: "1px solid #73767a" }}
            >
              <Row>
                <Col style={{ marginRight: "0px" }} md={4}>
                  <Form.Group controlId={`typeSelect-${1}`}>
                    <div style={{ position: "relative" }}>
                      {/* Form Control */}
                      <Form.Control
                        // style={{ backgroundColor: "#dfebf0" }}
                        as="select"
                        value={selectedFinancialYear}
                        onChange={(e) =>
                          setSelectedFinancialYear(e.target.value)
                        }
                      >
                        <option value="">Select Financial Year</option>
                        {financialYears.map((year, index) => (
                          <option key={index} value={year.id}>
                            {year.financial_year_value}
                          </option>
                        ))}
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
                <Col style={{ marginRight: "0px" }} md={4}>
                  <Form.Group controlId={`typeSelect-${2}`}>
                    <div style={{ position: "relative" }}>
                      {/* Form Control */}
                      <Form.Control
                        // style={{ backgroundColor: "#dfebf0" }}
                        as="select"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      >
                        <option value="">Select Location</option>
                        {locations.map((location, index) => (
                          <option key={index} value={location.id}>
                            {location?.unitCode ||
                              `${location?.location?.area || ""}, ${
                                location?.location?.city || ""
                              }, ${location?.location?.state || ""}, ${
                                location?.location?.country || ""
                              }`.trim()}
                          </option>
                        ))}
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
                <Col style={{ marginRight: "0px" }} md={4}>
                  <Form.Group controlId={`typeSelect-${3}`}>
                    <div style={{ position: "relative" }}>
                      {/* Form Control */}
                      <Form.Control
                        // style={{ backgroundColor: "#dfebf0" }}
                        as="select"
                        value={selectedLocation}
                        onChange={(e) =>
                          handlePeriodChange("frequency", e.target.value)
                        }
                      >
                        <option value="">Select Frequency</option>
                        {timePeriodOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
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
              </Row>
            </div>

            <div>
              {fuelForms.map((form, index) => (
                <div
                  key={index}
                  className="container rounded p-4 position-relative shadow mb-2"
                  style={{ border: "1px solid #73767a" }}
                >
                     <Row className="mb-3">
                     {Object.entries(emissionFields || {}).map(([label, config], index) => (
      // {Object.entries(emissionFields).map(([label, config], index) => (
        <Col md={3} key={index}>
          <Form.Group controlId={`formField-${index}`}>
            <Form.Label>{label}</Form.Label>
            <div style={{ position: "relative" }}>
              {config.type === "dropdown" ? (
                <Form.Control
                  as="select"
                  style={{ backgroundColor: "#dfebf0" }}
                  name={label}
                  // value={formData[label] || ""}
                  onChange={handleChange}
                >
                  <option value="">Select {label}</option>
                  {config.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  style={{ backgroundColor: "#dfebf0" }}
                  placeholder={`Enter ${label}`}
                  name={label}
                  // value={formData[label] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          </Form.Group>
        </Col>
      ))}
    </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group controlId={`description-${index}`}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          style={{ backgroundColor: "#dfebf0" }}
                          rows={1}
                          placeholder="Enter Description Over Here"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group
                    controlId="formFile"
                    className="custom-file-upload"
                  >
                    <Form.Label className="custom-label">
                      Upload a file
                    </Form.Label>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="file-upload-wrapper">
                        <label className="upload-btn d-flex align-items-center">
                          <div style={{ height: "12px", width: "12px" }}>
                            <FiUpload height={"12px"} width={"12px"} />
                          </div>
                          <span>Upload a file</span>
                          <Form.Control style={{ display: "none" }} />
                        </label>
                      </div>
                      <Button
                        variant="primary"
                        className="ms-2 p-2"
                        onClick={() => handleRemoveFuel(form.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              ))}

              {/* Add Another Fuel Button */}
              <Button
                variant="primary"
                className="mx-4 mt-1"
                onClick={addFuelForm}
              >
                Add Another Fuel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope;
