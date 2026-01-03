import React from "react";
import { useState, useEffect } from "react";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";

const QuantitativeTrendsType = ({ item, answer, note, title, filterQuestionListAnswer }) => {
  console.log("qua", filterQuestionListAnswer)
  const [meterList, setMeterList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [readingValue, setReadingValue] = useState([]);
  useEffect(() => {

    const tmpReading = filterQuestionListAnswer.find(items => items.id === item.id);
    setReadingValue(tmpReading?.answer)
  }, [item]);
  
  useEffect(() => {
    getSource();
    // getProcess();
  }, []);

  function formatOptionType(optionType) {
    // Convert the string from snake_case to Title Case
    return optionType
      .replace(/_/g, ' ')   // Replace underscores with spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
  }

  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const locationArray = data?.data?.reverse().map((item) => ({
        id: item.id,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      setMeterList(locationArray);
      //console.log("locationArray", locationArray)
    }
  };
  const getLocation = (sourceId) => {
    const matchedLocation = meterList.find((meter) => meter.id === sourceId);
    return matchedLocation ? matchedLocation.location : "Unknown Location";
  };

  const getProcess = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getProcess`,
      {},
      { type: "ALL" },
      "GET"
    );
    if (isSuccess) {
      setProcessList(data?.data?.reverse());
      //console.log("processList", data?.data?.reverse());
    }
  };

  const getProcessName = (processId) => {
    const matchedProcess = processList.find(
      (process) => process.id === processId
    );
    return matchedProcess ? matchedProcess.process : "Unknown Process";
  };

  return (
    <div className="quantitative-trends">

      {Array.isArray(answer) && answer.length > 0 ? (
        answer.map((entry, index) => (
          <div key={index} className="answer-entry">
            {/* <div>
            <strong
              style={{
                color: "#3F88A5",
                fontSize: "12px",
                fontFamily: "Open Sans",
                fontWeight: "700",
                wordWrap: "break-word",
              }}
            >
              {entry === "No Combined" && "No Answer - "}Process:
            </strong>{" "}
            {getProcessName(item?.process)}
          </div> */}
            <div>
              <strong
                style={{
                  color: "#3F88A5",
                  fontSize: "12px",
                  fontFamily: "Open Sans",
                  fontWeight: "700",
                  wordWrap: "break-word",
                }}
              >
                {entry === "No Combined" && "No Answer - "}Reading Value:
              </strong>{" "}
              {readingValue} {" "} {entry?.unit}
            </div>
            {/* <div>
            <strong
              style={{
                color: "#3F88A5",
                fontSize: "12px",
                fontFamily: "Open Sans",
                fontWeight: "700",
                wordWrap: "break-word",
              }}
            >
              {entry === "No Combined" && "No Answer - "}Source:
            </strong>{" "}
            {getLocation(entry?.meter_id)}
          </div> */}
            <hr /> {/* Divider for clarity between entries */}
          </div>
        ))
      ) : (
        <div key={1} className="answer-entry">
          {/* <div>
        <strong
          style={{
            color: "#3F88A5",
            fontSize: "12px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
          Process: {getProcessName(item?.process)}
        </strong>{" "}
        
      </div> */}
          <div>
            <strong
              style={{
                color: "#3F88A5",
                fontSize: "12px",
                fontFamily: "Open Sans",
                fontWeight: "700",
                wordWrap: "break-word",
              }}
            >

              {formatOptionType(item?.question_detail[0]?.option_type)} :  {answer?.reading_value} {"  "} {item?.question_detail[0]?.option}
            </strong>{" "}

          </div>
          {/* <div>
        <strong
          style={{
            color: "#3F88A5",
            fontSize: "12px",
            fontFamily: "Open Sans",
            fontWeight: "700",
            wordWrap: "break-word",
          }}
        >
         Source: {getLocation(answer?.meter_id)}
        </strong>{" "}
        
      </div> */}
          <hr /> {/* Divider for clarity between entries */}
        </div>
      )}
      {note && (
        <>
          <div
            style={{
              color: "black",
              fontSize: "16px",
              fontFamily: "Open Sans",
              fontWeight: "800",
              wordWrap: "break-word",
            }}
          >
            {" "}
            Note{" "}
          </div>

          <div
            style={{
              color: "#3F88A5",
              fontSize: "14px",
              fontFamily: "Open Sans",
              marginBottom: "10px",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            {note}
          </div>
        </>
      )}
    </div>

  );
};

export default QuantitativeTrendsType;
