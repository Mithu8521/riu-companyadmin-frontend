import React from "react";
import ApexCharts from "react-apexcharts";
import { useHistory } from "react-router-dom";

const QuestionStatusBarChart = ({ graphData }) => {
  const history = useHistory();



  if (!graphData) {
    return <div>Loading...121</div>;
  }



  const series = [
    {
      name: "Status",
      data: [Number(graphData?.answered), Number(graphData?.finalAssignQuesionAccpted), Number(graphData?.totalAssignedQuestionForAnswered), Number(graphData?.finalAssignQuesionRejected), Number(graphData?.answerNotResponded)], // Dynamic data
    },
  ];


  const handleBarClick = (index) => {
    switch (index) {
      case 0: // Accepted
        localStorage.setItem(
          "reportingQuestion",
          JSON.stringify(graphData?.finalAssignQuesionAccptedIds)
        );
        history.push("/reporting-modules/all-module");
        break;
      case 1: // Assigned
        localStorage.setItem(
          "reportingQuestion",
          JSON.stringify(graphData?.assignedQuestionIds)
        );
        history.push("/assigned", { questionIds: graphData?.assignedQuestionIds });
        break;
      case 2: // Rejected
        localStorage.setItem(
          "reportingQuestion",
          JSON.stringify(graphData?.finalAssignQuesionRejectedIds)
        );
        history.push("/rejected", { questionIds: graphData?.finalAssignQuesionRejectedIds });
        break;
      case 3: // Not Responded
        localStorage.setItem(
          "reportingQuestion",
          JSON.stringify(graphData?.answerNotRespondedIds)
        );
        history.push("/not-responded", { questionIds: graphData?.answerNotRespondedIds });
        break;
      case 4: // Not Responded
        localStorage.setItem(
          "reportingQuestion",
          JSON.stringify(graphData?.answeredQuestionIds)
        );
        history.push("/not-responded", { questionIds: graphData?.answeredQuestionIds });
        break;
      default:
        break;
    }
  };

  // Chart options
  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      stacked: false,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          handleBarClick(config.dataPointIndex); // Call the click handler
        },
      },
    },
    stroke: {
      colors: ["transparent"],
      width: 10,
    },
    colors: ['#11546f', '#6fa8dc', "#DDB745", "#F27A7A"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',

        distributed: true
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val);
      },
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
      offsetY: -6,
      offsetX: 3,
    },
    xaxis: {
      categories: ['Answered', "Accepted", "Assigned", "Rejected", "Not Responded"],
      labels: {
        style: {
          colors: ['#333'],
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#333'],
          fontSize: '12px',
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: '#E0E0E0',
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="container" style={{ height: "100%" }}>
      <div
        style={{
          color: "#011627",
          fontSize: 22,
          height: "10%",
          paddingLeft: "0px",
          fontFamily: "Open Sans",
          fontWeight: "600",
          paddingTop: "0px",
          marginTop: "0%",
        }}
      >
        My Assigned Question Status
      </div>
      <div className="chart-container" style={{ height: "90%" }}>
        <ApexCharts
          options={options}
          series={series}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default QuestionStatusBarChart;
