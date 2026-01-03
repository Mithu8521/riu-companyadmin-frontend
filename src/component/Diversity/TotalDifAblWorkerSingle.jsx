import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import right from "../../img/Vector 1.svg";

const TotalDifAbledEmpSingle = ({ workDif }) => {
  const [isPermanent, setIsPermanent] = useState(true);
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });

  const colors = ["#11564f", "#6fa8dc", "#9CDFE3"];

  useEffect(() => {
    let totalMales = 0;
    let totalFemales = 0;
    let totalOthers = 0;

    workDif.forEach((item) => {
      const answers = item.answer || [[], []];
      const selectedData = isPermanent ? answers[0] : answers[1];

      if (selectedData.length === 3) {
        totalMales += parseInt(selectedData[0], 10) || 0;
        totalFemales += parseInt(selectedData[1], 10) || 0;
        totalOthers += parseInt(selectedData[2], 10) || 0;
      }
    });

    setChartData({
      series: [
        { name: 'Males', data: [totalMales] },
        { name: 'Females', data: [totalFemales] },
        { name: 'Others', data: [totalOthers] }
      ],
      categories: ['Males', 'Females', 'Others'] // Ensure categories reflect this
    });
  }, [workDif, isPermanent]);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 8,
        endingShape: 'rounded',
      },
    },
    xaxis: {
      categories: chartData.categories,
    },

    fill: {
      opacity: 1,
      colors: colors,
    },
    legend: {
      show: false, // Hide the default legend
    },
  };

  const toggleData = () => {
    setIsPermanent(!isPermanent);
  };

  return (
    <div className={"container"}>
      <div className="toggle-container" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="water-withdrawn-header">
            Total Differently Abled Employees
          </div>

          <div className="toggle-switch-container">
            <div className="toggle-switch" onClick={toggleData}>
              <div className={`toggle-knob ${isPermanent ? "on" : "off"}`}>
                <span
                  style={{ fontSize: "30px", marginBottom: "25%" }}
                  className="toggle-arrow"
                >
                  {
                    <img
                      src={right}
                      style={{
                        transform: isPermanent
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                      }}
                      alt="Arrow"
                    />
                  }
                </span>
              </div>
            </div>
            <p style={{ fontSize: "10px" }}>
              {isPermanent ? "Permanent" : "Non-Permanent"}
            </p>
          </div>
        </div>
      </div>

      <Chart
        options={chartOptions}
        series={chartData.series}
        type="bar"
        height={350}
      />

      {/* Custom Legend */}
      <div
        className="custom-legend"
        style={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ width: "33%", display: "flex", gap: "10px", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: colors[0],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Males

          </div>

        </div>
        <div style={{ width: "33%", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: colors[1],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Females

          </div>
        </div>
        <div style={{ width: "33%", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: colors[2],
              padding: "5px",
              borderRadius: "50%",
              width: "10%",
              height: "50%"
            }}
          ></div>{" "}
          <div>
            Others

          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalDifAbledEmpSingle;
