import React from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../../src/config/config.json";
import { useEffect, useState } from "react";

const AnsweredQuestions = ({ fromDate, toDate, financialYearId }) => {
  const [totalQuestions, setTotalQuestions] = useState([]);
  const getCompanyQuestionsCategoryWise = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getCompanyQuestionsCategoryWise`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId: financialYearId,
        },
        "GET"
      );
      if (response.isSuccess) {
        const data = response.data?.data;
        let totalAssignedQuestions = 0;
        let totalQuestions = 0;
        Object.keys(data).forEach((key) => {
          totalAssignedQuestions += data[key]?.assignedQuestion?.length;
          totalQuestions += data[key]?.totalQuestion?.length;
        });
        setTotalQuestions(totalQuestions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if ((fromDate && toDate && financialYearId)) {
      getCompanyQuestionsCategoryWise();
    }
  }, [fromDate, toDate, financialYearId]);
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          backgroundColor: "green",
          width: "10px",
          height: "10px",
          marginRight: "10px",
          borderRadius: 3,
        }}
      ></div>
      <span
        style={{
          color: "#1C1C1C",
          fontSize: 16,
          fontFamily: "Open Sans",
          fontWeight: "600",
        }}
      >
        Assigned Questions
      </span>
      <div
        style={{
          marginLeft: "auto",
          background: "#E2EAFD",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          display: "inline-flex",
          paddingLeft: 23,
          paddingRight: 23,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <span style={{ color: "#0057A7" }}>
          {" "}
          {totalQuestions}/{totalQuestions}
        </span>

        {/* <span style={{ color: "#0057A7" }}> {assignedQuestions}/{totalQuestions}</span> */}
      </div>
    </div>
  );
};

export default AnsweredQuestions;
