import React from "react";
import ReactApexChart from "react-apexcharts";

const EmployeeDifAbled = () => {
  // Main donut chart with fruit distribution
  const innerOptions = {
    chart: {
      type: "donut",
      height: 350,
      offsetY: 0,
      offsetX: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%", // Size of the outer donut (controls the width)
        },
      },

      radialBar: {
        hollow: {
          size: "100%", // Size of the hollow area to create a thick donut
        },
        track: {
          background: "#e0e0e0",
          strokeWidth: "20%",
        },
        dataLabels: {
          enabled: false,
          name: {
            fontSize: "22px",
            color: "#000",
            offsetY: -10,
          },
          value: {
            fontSize: "16px",
            color: "#000",
            offsetY: 10,
          },
          total: {
            show: false,
            label: "Total",
            formatter: function (w) {
              return 100;
            },
          },
        },
      },
    },
    series: [70, 20, 10], // Distribution data
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    legend: {
      show: false, // Hides the legend for the inner donut
    }, //
  };

  // Outer donut chart options
  const outerOptions = {
    chart: {
      type: "donut",
      height: 350,
      offsetY: 0,
      offsetX: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "90%", // Size of the outer donut (controls the width)
        },
      },
      radialBar: {
        hollow: {
          size: "20%", // Size of the hollow area to create a thinner donut
        },
        track: {
          background: "#f0f0f0",
          strokeWidth: "50%",
        },
        dataLabels: {
          enabled: false,
          show: false, // Hide data labels for the outer donut
        },
      },
    },
    series: [70, 20, 10], // Dummy series to create the outer donut
    labels: ["Apples", "Oranges", "Bananas"],
    colors: ["#FF4560", "#00E396", "#008FFB"],
    legend: {
      show: false, // Hides the legend for the inner donut
    }, //
  };

  return (
    <div className="container" style={{}}>
      <div className="header">
        <div className="title">Workers Including Differently Abled</div>
      </div>
      <div
        className="chart-container"
        style={{ marginTop: "-2%", height: "80%", position: "relative", marginTop: "5%", marginLeft: "15%" }}
      >
        <div id="outer-donut" style={{ position: "absolute", top: 0, left: 0, height: "100%" }}>
          <ReactApexChart
            options={outerOptions}
            series={outerOptions.series}
            type="donut"
            height={"100%"}
            width={"100%"}
          />
        </div>
        <div
          id="inner-donut"
          style={{ position: "absolute", top: 15, left: 15, height: "100%" }}
        >
          <ReactApexChart
            options={innerOptions}
            series={innerOptions.series}
            type="donut"
            height={"90%"}
            width={"90%"}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDifAbled;
