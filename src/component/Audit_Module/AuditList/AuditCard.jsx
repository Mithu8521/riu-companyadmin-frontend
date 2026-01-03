import React from "react";
import NotAnswered from "../../../img/sector/notAnswer.png";
import Review from "../../../img/sector/reviewing.png";
import Verified from "../../../img/sector/accept.png";
import Reject from "../../../img/sector/decline.png";

const AuditCard = ({ audit_data, index, setAuditAnswer, selectedRow }) => {
  return (
    <tr
      style={{
        backgroundColor:
          selectedRow === audit_data?.questionId ? "#1f9ed1" : "",
      }}
    >
      <td>
        <span>{index}</span>
      </td>
      <td
        onClick={() => {
          setAuditAnswer(audit_data);
        }}
      >
        <span>{audit_data?.title}</span>
      </td>

      <td style={{ width: 42 }}>
        {audit_data?.answer?.status === "IN_VERIFICATION" ? (
          <img
            src={Review}
            alt="In Verification"
            srcSet=""
            style={{ width: "80px" }}
            className="notAnsered_question w-25"
            title="In Verification"
          />
        ) : audit_data?.answer?.status === "ANSWERED" ? (
          <img
            src={Review}
            alt="In Review"
            srcSet=""
            style={{ width: "45%" }}
            title="In Review"
          />
        ) : audit_data?.answer?.status === "ACCEPTED" ? (
          <img
            src={Verified}
            alt="Verified"
            style={{ width: "45%" }}
            srcSet=""
            title="Verified"
          />
        ) : audit_data?.answer?.status === "REJECTED" ? (
          <img
            src={Reject}
            alt="Rejected"
            style={{ width: "45%" }}
            srcSet=""
            title="Rejected"
          />
        ) : (
          <img
            className="notAnsered_question"
            src={NotAnswered}
            alt="Not Answered"
            srcSet=""
            title="Not Answered"
          />
        )}
      </td>
    </tr>
  );
};

export default AuditCard;
