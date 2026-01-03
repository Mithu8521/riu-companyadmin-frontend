import React, { useEffect, useState } from "react";
import img from "../../../img/no.png";
import Chart from "react-apexcharts";

const SingleLocMultTimeBar = ({
  title,
  timePeriods,
  unit,
  timePeriodValues,
  locationOption,
  brief,
}) => {
  const [chartOptions, setChartOptions] = useState(null);
  const [series, setSeries] = useState([]);

  const categories =
    title === "Total Water Consumption"
      ? ["Total Groundwater consumption* ( in KL)", "Total Tanker Water Consumption* (in KL)",'Total surface water consumption (this includes municipal supply water']
      : title === "Total Water Treated"
        ? ["Total treated water reused(Flushing/CT etc.)* (in KL) "]
        : title === "Total Waste Generated"
          ? [
            "Total non-hazardous solid waste generation (black category general waste)* (kg)",
            "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
            "Total packaging waste (Plastic) generated* (Kg)",
            "Total plastic packaging waste generated ",
            "Total food waste generated/Kitchen Waste* (Kgs)",
            "Total e-waste generated",
            "Total hazardous waste (spent oil/lubricants etc)",
          ]
          : title === "Total Waste Disposed"
            ? ["Total e-waste disposed", "Total metal scraps disposed"]
            : []; // Default to an empty array or set a different default

  useEffect(() => {
    const locationPeriod = Object.keys(brief.time); // Assuming these are your locations
    const time = Object.keys(brief.location);

    let seriesData = [];

    if (locationPeriod.length > 1 && timePeriodValues.length === 1) {
      // Case 1: Multiple locations and single time period
      locationPeriod.forEach((location) => {
        let totalSum = 0;
        categories.forEach((category) => {
          if (brief.time[location][category]) {
            totalSum += Number(brief.time[location][category][0] || 0);
          }
        });
        seriesData.push({ name: location, data: [totalSum] });
      });
    } else if (locationPeriod.length === 1 && timePeriodValues.length > 1) {
      // Case 2: Single location and multiple time periods
      time.forEach((timeO) => {
        let totalSum = 0;
        categories.forEach((category) => {
          if (brief.location[timeO][category]) {
            totalSum += Number(brief.location[timeO][category][0] || 0);
          }
        });
        seriesData.push({ name: timeO, data: [totalSum] });
      });
    } else if (locationPeriod.length > 1 && timePeriodValues.length > 1) {
      // Case 3: Multiple locations and multiple time periods
      time.forEach((timeO) => {
        let totalSum = 0;
        categories.forEach((category) => {
          if (brief.location[timeO][category]) {
            const sumValue = brief.location[timeO][category].reduce(
              (acc, val) => acc + Number(val || 0),
              0
            );
            totalSum += sumValue;
          }
        });
        seriesData.push({ name: timeO, data: [totalSum] });
      });
    }

    setSeries(seriesData);

    const options = {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: false,
        },
        margin: {
          left: -10,
          right: 0,
          top: 0,
          bottom: 0,
        },
        padding: { left: -10, right: -10, top: 0, bottom: 0 },
      },
      grid: {
        show: true,
        borderColor: "#90A4AE",
        strokeDashArray: 0,
        position: "back",
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        row: {
          colors: undefined,
          opacity: 0.5,
        },
        column: {
          colors: undefined,
          opacity: 0.5,
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      xaxis: {
        categories: ["Total Water Consumption"], // These categories will be hidden
        title: {
          text: `(In ${unit})`,  // Dynamically display unitName in X-axis title
          style: {
            fontSize: "14px",
            fontWeight: "bold",
          },
          offsetY: -10, // Adjust vertical positioning of the title
        },
        labels: {
          show: true,
          offsetY: -55,
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        labels: {
          show: false,
          align: "center",
          style: {
            fontSize: "12px",
            fontWeight: 500,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "60%",
          columnWidth: "40%",
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        "#9CDFE3",
        "#11546f",
        "#ABC4B2",
        "#6D8B96",
        "#9CDFE3",
        "#11546f",
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const totalSum = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
          return `${totalSum}`;
        },
        style: {
          fontSize: "12px",
          colors: ["#fff"],
          fontWeight: 500,
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 2,
          opacity: 0.4,
        },
      },
      title: {
        show: false,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
      },
    };

    setChartOptions(options);
  }, [brief, locationOption, timePeriods]);

  const allValuesZero = series.every((item) =>
    item.data.every((value) => value === 0)
  );

  if (!brief || !brief.time) {
    return <p>No data available.</p>;
  }

  return (
    <div className="container">
      <div
        style={{
          height: "10%",
          fontSize: "20px",
          fontWeight: 600,
          color: "#011627",
        }}
      >
        {title}
      </div>

      <div style={{ height: "90%", width: "100%" }}>
        {allValuesZero ? (
          <div style={{ height: "100%", width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <img src={img} style={{ height: "110px", width: "140px" }} />
          </div>
        ) : (
          chartOptions && (
            <Chart
              options={chartOptions}
              series={series}
              type="bar"
              height={"100%"}
              width={"100%"}
            />
          )
        )}
      </div>
    </div>
  );
};

export default SingleLocMultTimeBar;
