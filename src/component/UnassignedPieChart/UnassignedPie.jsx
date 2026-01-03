import React from "react";
import Chart from "react-apexcharts";
import "./unass.css";
import { apiCall } from "../../_services/apiCall";
import config from "../../../src/config/config.json";
import { useEffect, useState } from "react";

const UnassignedPie = ({ fromDate, toDate, financialYearId }) => {
  const [pieData, setPieData] = useState([]);
  const [categories, setCategories] = useState([]);

  const getCompanyQuestionsCategoryWise = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getCompanyQuestionsCategoryWise`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId: financialYearId
        },
        "GET"
      );
      if (response.isSuccess) {
        const data = response.data?.data;
        if (data) {
          const categoryToKey = {};
          const categories = Object.keys(data).map((key) => {
            let newCategory;
            if (key === "yes_no") {
              newCategory = "Close Range";
            } else if (key === "tabular_question") {
              newCategory = "Tabular";
            } else {
              newCategory = key.charAt(0).toUpperCase() + key.slice(1);
            }
            categoryToKey[newCategory] = key;
            return newCategory;
          });
          setCategories(categories);

          const unassignedCounts = categories.map((category) => {
            const key = categoryToKey[category];
            const total = data[key]?.totalQuestion.length || 0; // Ensure total is defined
            const unassigned = data[key]?.unassignedQuestion.length || 0; // Ensure unassigned is defined
            return total > 0 ? (unassigned / total) * 100 : 0; // Avoid division by zero
          });
          setPieData(unassignedCounts);
          setPieData(unassignedCounts);
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getCompanyQuestionsCategoryWise();
  }, [fromDate, toDate, financialYearId]);

  const chartOptions = {
    chart: {
      type: "donut",
      height: "160%", // Add height property
    },
    legend: {
      position: "bottom",
    },
    labels: categories, // Add labels here
    colors: ["#59A8AE", "#5A7782", "#B6E0F1", "#A6B1B5", "#A4D2B1"],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val, opts) {
          return `${val}%`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "40%", // Adjust the size of the hole here
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
            height: "130%", // Add height property
          },
        },
      },
    ],
  };

  return (
    <div className="unasscont">
      <div>
        <div
          style={{
            color: "#011627",
            fontSize: 22,
            fontFamily: "Open Sans",
            fontWeight: "600",
          }}
        >
          Unassigned Questions Progress By Category
        </div>
      </div>

      <Chart
        options={chartOptions}
        series={pieData}
        type="donut"
        width="100%"
        height="160%"
      />
    </div>
  );
};

export default UnassignedPie;
