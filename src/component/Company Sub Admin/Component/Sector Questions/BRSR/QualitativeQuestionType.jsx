import React from "react";

const QualitativeQuestionType = ({ title, answer, note }) => {
  return (
    <div>
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
        {answer}
      </div>
      {note && (
        <>
          <div
            style={{
              color: "black",
              fontSize: "16px",
              fontFamily: "Open Sans",
              fontWeight: "600",
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

export default QualitativeQuestionType;
