import React from "react";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import "./teamworkload.css";
import "../ProgressBySector/sectorprogress.css";
import { NavLink } from "react-router-dom";
import no from "../../img/no.png";

const TeamWorkLoad = ({ user, teamWorkloadData }) => {
  const [activeLegend, setActiveLegend] = useState([
    "Approved",
    "rejected",
    "not-responded",
  ]);

  const handleLegendClick = (legendType) => {
    if (activeLegend.includes(legendType)) {
      setActiveLegend(activeLegend.filter((item) => item !== legendType));
    } else {
      setActiveLegend([...activeLegend, legendType]);
    }
  };

  const renderBars = (item) => {
    const isUser = user === "user";
    const bars = [];

    // Handle Accepted for Audit
    if (
      user === "audit" &&
      Number(item?.accepted) > 0 && // Changed from !== 0 to > 0
      activeLegend.includes("Approved")
    ) {
      bars.push(
        <NavLink
          key="Approved"
          onClick={() => {
            localStorage.setItem(
              "reportingQuestion",
              JSON.stringify(item.acceptedQuestionIds)
            );
          }}
          to={{
            pathname: "audit-history",
            state: {
              reportingQuestion: item.acceptedQuestionIds,
              userId: item?.userId,
            },
          }}
          style={{
            display: "block",
            width: `${Number(item?.percentageAccepted)}%`,
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            className="bar accepted"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: "100%",
            }}
          >
            <span className="bar-label">{`${Number(item?.accepted)}`}</span>
          </div>
        </NavLink>
      );
    }

    if (
      user === "audit" &&
      Number(item?.rejected) > 0 && // Changed from !== 0 to > 0
      activeLegend.includes("rejected")
    ) {
      bars.push(
        <NavLink
          key="rejected"
          onClick={() => {
            localStorage.setItem(
              "reportingQuestion",
              JSON.stringify(item.rejectedQuestionIds)
            );
          }}
          to={{
            pathname: "audit-history",
            state: {
              reportingQuestion: item.rejectedQuestionIds,
              userId: item?.userId,
            },
          }}
          style={{
            display: "block",
            width: `${Number(item?.percentageRejected)}%`,
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            className="bar rejected"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: "100%",
            }}
          >
            <span className="bar-label">{`${Number(item?.rejected)}`}</span>
          </div>
        </NavLink>
      );
    }

    // Handle Approved for User
    if (
      isUser &&
      Number(item?.finalAssignQuesionAccpted) > 0 && // Changed from !== 0 to > 0
      activeLegend.includes("Approved")
    ) {
      const total =
        Number(item?.finalAssignQuesionAccpted) +
        Number(item?.finalAssignQuesionRejected) +
        Number(item?.answerNotResponded || 0);

      bars.push(
        <NavLink
          key="Approved"
          onClick={() => {
            localStorage.setItem(
              "reportingQuestion",
              JSON.stringify(item.finalAssignQuesionAccptedIds)
            );
          }}
          to={{
            pathname: isUser
              ? "reporting-modules/all-module"
              : "/audit-listing/all-module",
            state: {
              reportingQuestion: item.finalAssignQuesionAccptedIds,
            },
          }}
          style={{
            display: "block",
            width: `${
              (Number(item?.finalAssignQuesionAccpted) / total) * 100
            }%`,
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            className="bar accepted"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: "100%",
            }}
          >
            <span className="bar-label">{`${Number(
              item?.finalAssignQuesionAccpted
            )}`}</span>
          </div>
        </NavLink>
      );
    }

    // Handle Rejected for User
    if (
      isUser &&
      Number(item?.finalAssignQuesionRejected) > 0 && // Changed from !== 0 to > 0
      activeLegend.includes("rejected")
    ) {
      const total =
        Number(item?.finalAssignQuesionAccpted) +
        Number(item?.finalAssignQuesionRejected) +
        Number(item?.answerNotResponded || 0);

      bars.push(
        <NavLink
          key="rejected"
          onClick={() => {
            localStorage.setItem(
              "reportingQuestion",
              JSON.stringify(item.finalAssignQuesionRejectedIds)
            );
          }}
          to={{
            pathname: isUser
              ? "reporting-modules/all-module"
              : "/audit-listing/all-module",
            state: {
              reportingQuestion: item.finalAssignQuesionRejectedIds,
              userId: item?.userId,
            },
          }}
          style={{
            display: "block",
            width: `${
              (Number(item?.finalAssignQuesionRejected) / total) * 100
            }%`,
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            className="bar rejected"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: "100%",
            }}
          >
            <span className="bar-label">{`${Number(
              item?.finalAssignQuesionRejected
            )}`}</span>
          </div>
        </NavLink>
      );
    }

    // Handle Not Responded (for both user and audit)
    const notRespondedValue = isUser
      ? Number(item?.answerNotResponded || 0)
      : Number(item?.notResponded || 0);

    if (
      notRespondedValue > 0 && // Changed logic to check if > 0
      activeLegend.includes("not-responded")
    ) {
      const total = isUser
        ? Number(item?.finalAssignQuesionAccpted) +
          Number(item?.finalAssignQuesionRejected) +
          Number(item?.answerNotResponded || 0)
        : 100; // For audit, we're using the percentage directly

      bars.push(
        <NavLink
          key="not-responded"
          onClick={() => {
            localStorage.setItem(
              "reportingQuestion",
              JSON.stringify(
                isUser
                  ? item.answerNotRespondedIds
                  : item.auditorNotRespondedIds
              )
            );
          }}
          to={{
            pathname: isUser
              ? "reporting-modules/all-module"
              : "/audit-listing/all-module",
            state: {
              reportingQuestion: isUser
                ? item.answerNotRespondedIds
                : item.auditorNotRespondedIds,
              userId: item?.userId,
            },
          }}
          style={{
            display: "block",
            width: isUser
              ? `${(notRespondedValue / (total || 1)) * 100}%`
              : `${Number(item?.percentageUnresponded)}%`,
            padding: "0px",
            margin: "0px",
          }}
        >
          <div
            className="bar not-responded"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: "100%",
            }}
          >
            <span className="bar-label">{notRespondedValue}</span>
          </div>
        </NavLink>
      );
    }

    return bars;
  };

  return (
    <div
      style={{
        width: "100%",
        background: "white",
        borderRadius: "10px",
        padding: "10px",
        height: "500px",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "white",
          height: "12%",
          display: "flex",
          justifyContent: "center", // horizontally center
          alignItems: "center", // vertically center
        }}
      >
        <div
          style={{
            color: "#011627",
            fontSize: 22,
            fontFamily: "Open Sans",
            fontWeight: "600",
          }}
        >
          {user === "user" ? "Data Processing Dashboard" : "Auditor Work Load"}
        </div>
      </div>

      {teamWorkloadData && teamWorkloadData.length > 0 ? (
        <>
          <div
            style={{ height: "73%" }}
            className="scrollable-table mt-2 scroll-container"
          >
            <Table style={{ height: "95%" }} className="">
              <thead>
                <tr>
                  <th
                    className="name-column"
                    style={{ color: "#96A5B8", fontSize: "16px" }}
                  >
                    Name
                  </th>
                  <th
                    className="progress-column"
                    style={{ color: "#96A5B8", fontSize: "16px" }}
                  >
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="scroll-container">
                {teamWorkloadData.map((item) => {
                  const hasData = item?.totalAssignedQuestionForAudit !== 0;

                  if (hasData) {
                    return (
                      <tr key={item.userId} style={{ padding: "20px 0px" }}>
                        <td
                          className="name-column"
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "16px",
                          }}
                        >
                          {`${item.firstName} ${item.lastName}`}
                        </td>
                        <td className="progress-column">
                          <div
                            className="bar-container"
                            style={{ width: "100%", background: "#C3D4DB" }}
                          >
                            {renderBars(item)}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return null; // Changed from <></> to null for cleaner React code
                })}
              </tbody>
            </Table>
          </div>

          <div
            className="legend"
            style={{
              width: "100%",
              background: "white",
              borderRadius: "10px",
              height: "10%",
            }}
          >
            <div
              className={`legend-item ${
                activeLegend.includes("Approved") ? "active" : ""
              }`}
              onClick={() => handleLegendClick("Approved")}
              style={{ cursor: "pointer" }}
            >
              <div className="legend-color accepted"></div>
              <div className="legend-text">Approved</div>
            </div>
            <div
              className={`legend-item ${
                activeLegend.includes("rejected") ? "active" : ""
              }`}
              onClick={() => handleLegendClick("rejected")}
              style={{ cursor: "pointer" }}
            >
              <div className="legend-color rejected"></div>
              <div className="legend-text">Rejected</div>
            </div>
            <div
              className={`legend-item ${
                activeLegend.includes("not-responded") ? "active" : ""
              }`}
              onClick={() => handleLegendClick("not-responded")}
              style={{ cursor: "pointer" }}
            >
              <div className="legend-color not-responded"></div>
              <div className="legend-text">Not Responded</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <img src={no} height={"150px"} width={"150px"} alt="No data" />
          </div>
        </>
      )}
    </div>
  );
};

export default TeamWorkLoad;
