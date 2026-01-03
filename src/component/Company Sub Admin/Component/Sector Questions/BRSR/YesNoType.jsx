import React from "react";

function YesNoType({ title, answer, note, notApplicable }) {
  if (notApplicable == 1) {
    return (
      <div
        style={{
          color: "#3F88A5",
          fontSize: "18px",
          fontFamily: "Open Sans",
          fontWeight: "600",
          wordWrap: "break-word",
          marginBottom: "10px"
        }}
      >
        Not Applicable
      </div>
    );
  }
  let parsedAnswer = { answer: answer, details: "", weblink: "" };
  try {
    parsedAnswer = JSON.parse(answer);
  } catch (e) {
    console.error("Failed to parse answer:", e);
  }
  const { answer: yesNoAnswer, details, weblink } = parsedAnswer;

  const trimDetails = (details) => {
    if (details.toLowerCase().startsWith("yes.")) {
      return details.slice(4).trim();
    } else if (details.toLowerCase().startsWith("no.")) {
      return details.slice(3).trim();
    }
    return details;
  };
  const trimmedDetails = details ? trimDetails(details) : "";

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div>
      <div
        style={{
          color: "#3F88A5",
          fontSize: "18px",
          fontFamily: "Open Sans",
          fontWeight: "600",
          wordWrap: "break-word",
        }}
      >
        {capitalizeFirstLetter(yesNoAnswer)}
      </div>
      <div
        style={{
          color: "#3F88A5",
          fontSize: "12px",
          fontFamily: "Open Sans",
          fontWeight: "800",
          wordWrap: "break-word",
        }}
      >
        Details:-
        <span
          style={{
            color: "#3F88A5",
            fontSize: "12px",
            fontFamily: "Open Sans",
            fontWeight: "600",
            wordWrap: "break-word",
            display: "inline",
            marginLeft: "5px", // Optional: Add some space between "Details:-" and trimmedDetails
          }}
        >
          {trimmedDetails}
        </span>
      </div>

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
}

export default YesNoType;
