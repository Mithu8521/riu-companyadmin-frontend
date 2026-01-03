import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./accordioncomponent.css";
import "react-datepicker/dist/react-datepicker.css";
import MainAccordComponent from "./MainAccordComponent";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button, Form } from "react-bootstrap";
import NoDataFound from "../../../img/no.png";
import Loader from "../../loader/Loader";

const AccordionComponent = ({
  getAuditListing,
  sourceData,
  currentUserId,
  menu,
  apiData,
  financeObject,
  moduleName,
  moduleData,
  allModuleData,
  startingMonth,
  assignedTo,
  correctModuleId,
  units,
  selectedQuestions,
  setSelectedQuestions,
  selectedFrameworks,
  dueDateOverrides,
  getDueDateOverrides,
  periodLockData,
  activeIndex,
  setActiveIndex
}) => {
  const [documents, setDocuments] = useState();
  const [scheduledDueDate, setScheduledDueDate] = useState([]);
  const [allSourceOptions, setAllSourceOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("");
  const [error, setError] = useState("");

  const handleCalendarOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const isMounted = useRef(true);

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadScheduledNotifications = async (setSelectedFinancialYearId) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}scheduledNotifications`,
        {},
        {
          financialYearId: setSelectedFinancialYearId,
        },
        "GET"
      );

      if (isSuccess && data) {
        setScheduledDueDate(data.data || []);
      }
    } catch (error) {
      console.error("Error loading scheduled notifications:", error);
    } finally {
          }
  };

  // Fetch documents data without dependency checks initially
  const getDocuments = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents`,
        {},
        {
          financialYearId: financeObject
        },
        "GET"
      );
      if (isSuccess && data?.documents) {
        setDocuments(data.documents.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {}));
      } else {
        console.error("Failed to fetch documents:", data);
        setError("Failed to fetch documents. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("An error occurred while fetching documents.");
    }
  };

  useEffect(() => {
    setActiveIndex(null);
    getDocuments();
  }, [correctModuleId, financeObject]);

  useEffect(() => {
    // loading = false when moduleData is an array (empty or filled)
    const isArrayLoaded = Array.isArray(moduleData);

    setLoading(!isArrayLoaded);
  }, [moduleData]);

  useEffect(() => {
    if (sourceData) {
      const locationArray = sourceData?.reverse().map((item) => ({
        id: item.id,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
        unitCode: item?.unitCode,
        subLocation: item?.subLocation,
      }));
      if (locationArray && locationArray.length) {
        // Flatten the options to include parent and sublocations
        const flattened = [];
        locationArray.forEach((parent) => {
          const parentLabel = parent?.unitCode || parent?.location;
          
          // Add parent option
          flattened.push({
            id: parent.id,
            name: parentLabel,
            unitCode: parent.unitCode,
            location: parent.location,
            isParent: true,
            parentId: parent.id,
            subLocationId: null,
            value: parent.id,
            label: parentLabel
          });

          // Add sublocation options if they exist
          if (parent.subLocation && parent.subLocation.length > 0) {
            parent.subLocation.forEach((sub) => {
              flattened.push({
                id: `${parent.id}-${sub.id}`,
                name: `${parentLabel} - ${sub.subLocation}`,
                unitCode: parent.unitCode,
                location: parent.location,
                isParent: false,
                parentId: parent.id,
                subLocationId: sub.id,
                subLocationName: sub.subLocation,
                value: `${parent.id}-${sub.id}`,
                label: `${parentLabel} - ${sub.subLocation}`,
              });
            });
          }
        });

        setAllSourceOptions(flattened);
      }
    }
  }, [sourceData]);


  useEffect(() => {
    if (financeObject) {
      loadScheduledNotifications(financeObject);
    }
  }, [financeObject]);

  const acceptAllQuestion = async () => {
    if (financeObject) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}validateAllAnswers`,
        {},
        { financialYearId: financeObject },
        "POST"
      );
      if (isSuccess) {
        // Handle success case if needed
      }
    }
  };

  // Handle Select All functionality
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked && Array.isArray(allModuleData) && allModuleData.length > 0) {
      const allQuestionIds = allModuleData.map((item) => item.questionId);
      setSelectedQuestions(allQuestionIds);
    } else {
      // Clear all selections
      setSelectedQuestions([]);
    }
  };

  useEffect(() => {
    setSelectAll(false);
    setSelectedQuestions([]);
  }, [moduleName]);

  // Handle range change
  const handleRangeInput = (e) => {
    const input = e.target.value;
    setRange(input);
    // Just store the input, don't apply it yet
    setError("");
  };

  // Apply the range when button is clicked
  const applyRange = () => {
    if (!range) {
      setSelectedQuestions([]);
      return;
    }

    // Split by commas for multiple ranges
    const ranges = range.split(",").map((r) => r.trim());
    const newQuestionIds = [];
    let hasError = false;

    for (const rangeItem of ranges) {
      // Check for single number format
      if (/^\d+$/.test(rangeItem)) {
        const num = parseInt(rangeItem);
        if (num > 0 && num <= (moduleData?.length || 0)) {
          if (moduleData && moduleData[num - 1]?.questionId) {
            newQuestionIds.push(moduleData[num - 1].questionId);
          }
        } else {
          hasError = true;
          setError(`Number ${num} is out of valid question range.`);
          break;
        }
        continue;
      }

      // Check for range format "1-3"
      const rangePattern = /^(\d+)\s*-\s*(\d+)$/;
      const match = rangeItem.match(rangePattern);

      if (!match) {
        hasError = true;
        setError(
          "Please use the correct format: single numbers or ranges (e.g. 1-3,5,7-9)"
        );
        break;
      }

      const low = parseInt(match[1]);
      const high = parseInt(match[2]);

      if (low >= high) {
        hasError = true;
        setError("The lower number must be less than the higher number.");
        break;
      }

      if (low < 1 || high > (moduleData?.length || 0)) {
        hasError = true;
        setError(
          `Range ${low}-${high} is outside valid question range (1-${moduleData?.length || 0
          }).`
        );
        break;
      }

      // Add all question IDs in the range
      for (let i = low - 1; i < high; i++) {
        if (moduleData && moduleData[i]?.questionId) {
          newQuestionIds.push(moduleData[i].questionId);
        }
      }
    }

    if (!hasError) {
      setError("");
      setSelectedQuestions(newQuestionIds);
    }
  };

  return (
    <div
      className="container w-100 my-3"
      style={{ background: "transparent", padding: "0%" }}
    >
      {/* Selection Controls */}
      {menu !== "audit" && <div
        className="selection-controls d-flex justify-content-between align-items-center py-2 px-3 mb-2"
        style={{
          backgroundColor: "#f2f7f9",
          borderRadius: "4px",
        }}
      >
        <div className="d-flex align-items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            style={{
              position: "relative",
              width: "20px",
              height: "20px",
              backgroundColor: selectAll ? "rgb(63, 136, 165)" : "transparent",
              borderRadius: "3px",
              border: selectAll
                ? "1px solid rgb(63, 136, 165)"
                : "1px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "10px",
            }}
          />
          <label
            onClick={() => setSelectAll(!selectAll)}
            style={{ cursor: "pointer", marginBottom: "0" }}
          >
            Select All Questions
          </label>
        </div>
        <div
          style={{ maxWidth: "450px" }}
          className="d-flex align-items-center"
        >
          <span
            style={{
              color: "black",
              fontSize: "16px",
              fontFamily: "Open Sans",
              fontWeight: "400",
              marginRight: "10px",
              whiteSpace: "nowrap",
            }}
          >
            Enter Range:
          </span>
          <div style={{ flex: "1" }}>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="e.g., 1-3,5,7-9"
                value={range}
                style={{
                  border: "1px solid #3F88A5",
                  background: "white",
                  borderColor: "#3F88A5",
                }}
                onChange={handleRangeInput}
              />
              <Button
                style={{
                  backgroundColor: "#3F88A5",
                  color: "white",
                  borderColor: "#3F88A5",
                  marginLeft: "8px",
                }}
                onClick={applyRange}
              >
                Apply
              </Button>
            </div>
            {error && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>}

      <div className="accordion" id="accordionExample">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
              width: "100%",
            }}
          >
            <Loader />
          </div>
        ) : moduleData && moduleData.length > 0 ? (
          moduleData.map((item, index) => (
            <MainAccordComponent
              key={menu === "audit" ? item?.question?.questionId : item?.questionId}
              getAuditListing={getAuditListing}
              allSourceOptions={allSourceOptions}
              currentUserId={currentUserId}
              menu={menu}
              assignedTo={assignedTo}
              apiData={apiData}
              moduleId={correctModuleId}
              documents={documents}
              getDueDateOverrides={getDueDateOverrides}
              dueDateOverrides={dueDateOverrides}
              periodLockData={periodLockData}
              financeObject={financeObject}
              item={item}
              index={index}
              scheduledDueDate={scheduledDueDate}
              activeIndex={activeIndex}
              handleAccordionClick={handleAccordionClick}
              startingMonth={startingMonth}
              handleCalendarOpen={handleCalendarOpen}
              isOpen={isOpen}
              units={units}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              selectedFrameworks={selectedFrameworks}
            />
          ))
        ) : (
          <div className="hstack justify-content-center">
            <img src={NoDataFound} alt="" />
          </div>
        )}

        {/* {moduleData && moduleData.length > 0 && menu === "audit" && (
          <div className="conta">
            <div
              className="w-100"
              style={{ paddingTop: "2%", textAlign: "right" }}
            >
              <Button
                variant="primary"
                className="mr-2 cbn"
                style={{
                  backgroundColor: "#3F88A5",
                  color: "white",
                  paddingRight: "10%",
                  paddingLeft: "10%",
                }}
                onClick={acceptAllQuestion}
              >
                Accept All
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AccordionComponent;
