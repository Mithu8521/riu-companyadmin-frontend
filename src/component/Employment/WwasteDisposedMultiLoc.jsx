import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const colorPalette = [
  "#C6CB8D",
  "#858862",
  "#ABC4B2",
  "#587B87",
  "#9CDFE3",
  "#FF8C33",
  "#C6CB8D",
  "#858862",
  "#FF3333",
  "#3377FF",
  "#FF7F50",
  "#FFD700",
  "#8A2BE2",
  "#D2691E",
  "#00FA9A",
];

const WasteDisposedMulti = ({
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
}) => {
  const [locations, setLocations] = useState([""]);
  const [quarters, setQuarters] = useState([""]);
  const [view, setView] = useState("time");
  const [selection, setSelection] = useState("M1");
  const [colors, setColors] = useState([]);
  const [companyFramework, setCompanyFramework] = useState([]);
  const [selectedOption, setSelectedOption] = useState("time");
  const [selectedCategory, setSelectedCategory] = useState("Q1");

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },

    xaxis: {
      title: {
        text: undefined,
      },
      categories: selectedOption === "location" ? locations : quarters,

    },
    yaxis: {
      title: {
        text: undefined, // Hide the Y axis title as shown in the design
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      formatter: function (seriesName, opts) {
        // Check if it's the last legend item
        if (opts.w.globals.seriesNames.length - 1 === opts.seriesIndex) {
          return `${seriesName} (in metric tons)`; // Append your unit text
        }
        return seriesName;
      }
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '40%', // Reduce the bar width (default is '70%')
        borderRadius: 4, // Add border radius
      },
    },
  });
  const [data, setData] = useState({
    time: {
      "Location 1": {
        groundWater: [2000, 1800, 1600, 1400],
        normalWater: [1500, 1300, 1200, 1000],
        hardWater: [500, 600, 700, 800],
      },
      "Location 2": {
        groundWater: [1900, 1700, 1500, 1300],
        normalWater: [1600, 1400, 1200, 1100],
        hardWater: [600, 700, 800, 900],
      },
      "Location 3": {
        groundWater: [1800, 1600, 1400, 1200],
        normalWater: [1700, 1500, 1300, 1100],
        hardWater: [700, 800, 900, 1000],
      },
      "Location 4": {
        groundWater: [1700, 1500, 1300, 1100],
        normalWater: [1800, 1600, 1400, 1200],
        hardWater: [800, 900, 1000, 1100],
      },
      "Location 5": {
        groundWater: [1600, 1400, 1200, 1000],
        normalWater: [1900, 1700, 1500, 1300],
        hardWater: [900, 1000, 1100, 1200],
      },
    },
    location: {
      Q1: {
        groundWater: [2000, 1500, 1000, 1200, 1300],
        normalWater: [1500, 1200, 1100, 1000, 1400],
        hardWater: [500, 800, 900, 800, 1200],
      },
      Q2: {
        groundWater: [1800, 1600, 1100, 1200, 1300],
        normalWater: [1600, 1300, 1200, 1100, 1400],
        hardWater: [600, 700, 800, 600, 1100],
      },
      Q3: {
        groundWater: [1900, 1700, 1200, 1300, 1400],
        normalWater: [1700, 1400, 1300, 1200, 1500],
        hardWater: [700, 800, 900, 700, 1300],
      },
      Q4: {
        groundWater: [2000, 1800, 1300, 1400, 1500],
        normalWater: [1800, 1500, 1400, 1300, 1600],
        hardWater: [800, 900, 1000, 800, 1400],
      },
    },
  });

  const categories = selectedOption === "time" ? locations : quarters;

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },

    xaxis: {
      categories: selectedOption === "location" ? locations : quarters,
      title: {
        text: selectedOption === "location" ? "location" : "time",
      },
    },
    yaxis: {
      title: {
        text: undefined, // Hide the Y axis title as shown in the design
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ["#3F88A5", "#587B87", "#8DA7BE", "#BCCCDC"], // Customize the colors
  };
  const [series, setSeries] = useState([
    {
      name: "Composting",
      data:
        selectedOption === "Location"
          ? [400, 430, 448, 470] // Example data for Locations when 'Location' is selected
          : [1200, 900, 600, 300], // Example data for Quarters when 'Time' is selected
    },
    {
      name: "Recycling",
      data:
        selectedOption === "Location"
          ? [300, 350, 400, 380] // Example data for Locations when 'Location' is selected
          : [1000, 800, 500, 200], // Example data for Quarters when 'Time' is selected
    },
    {
      name: "Incinerations",
      data:
        selectedOption === "Location"
          ? [200, 220, 270, 250] // Example data for Locations when 'Location' is selected
          : [800, 600, 400, 100], // Example data for Quarters when 'Time' is selected
    },
    {
      name: "Landfill",
      data:
        selectedOption === "Location"
          ? [100, 150, 200, 150] // Example data for Locations when 'Location' is selected
          : [600, 400, 300, 100], // Example data for Quarters when 'Time' is selected
    },
  ]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setView(event.target.value);
    setSelectedCategory("Q1"); // Reset category selection on option change
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelection(event.target.value);
  };

  useEffect(() => {
    if (selectedOption === "time") {
      if (locations) {
        setSelectedCategory(locations[0]);
      } else {
        setSelectedCategory(quarters[0]);
      }
    }
  }, [selectedOption]);

  function convertMixedData(mixedArray) {
    return mixedArray.map((data) => {
      if (Array.isArray(data.answer) && Array.isArray(data.answer[0])) {
        const flattenedAnswer = data.answer.flat();
        const summedValue = flattenedAnswer.reduce(
          (sum, value) => sum + (parseFloat(value) || 0),
          0
        );

        return {
          questionId: data.questionId,
          sourceId: data.sourceId,
          answer: {
            process: 1,
            readingValue: summedValue.toString(),
            unit: "KG",
          },
          title: data.title,
          question_details: data.question_details,
          formDate: data.formDate,
          toDate: data.toDate,
        };
      } else {
        return {
          ...data,
          answer: {
            ...data.answer,
            readingValue: data?.answer?.readingValue || "0",
          },
        };
      }
    });
  }

  useEffect(() => {
    if (frameworkValue && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);
  useEffect(() => {
    const dataType =
      view === "time" ? data.time[selection] : data.location[selection];
    const waterTypes = dataType ? Object.keys(dataType) : [];
    const colors = waterTypes.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );
    setColors(colors);
    const newChartSeries = waterTypes.map((waterType) => ({
      name: waterType
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      data: dataType?.[waterType] || [],
    }));

    setSeries(newChartSeries);
    setChartOptions((prevState) => {
      return {
        ...prevState,
        xaxis: {
          categories: selectedOption === "location" ? locations : quarters,
          title: {
            text: selectedOption === "location" ? "location" : "time",
          },
        },
        colors: colors,
      };
    });
  }, [view, selection, data]);

  useEffect(() => {
    if (companyFramework && companyFramework.length) {
      if (companyFramework.includes(1)) {
        const valuesArray = locationOption
          ? locationOption.map((item) => item.unitCode || item.value)
          : [];

        const transformedKeys = Object.keys(timePeriods).map((key) =>
          key
        );

        setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
        setQuarters(transformedKeys);
        setLocations(valuesArray);
        const summary = {
          time: {},
          location: {},
        };

        transformedKeys.forEach((quarter) => {
          locationOption.forEach((location) => {
            summary.time[location?.unitCode || location.value] = {
              Incineration: new Array(transformedKeys.length).fill(0),
              Landfilling: new Array(transformedKeys.length).fill(0),
              "Other disposal operations": new Array(
                transformedKeys.length
              ).fill(0),
            };
          });
        });

        locationOption.forEach((location) => {
          transformedKeys.forEach((time) => {
            summary.location[time] = {
              Incineration: new Array(locationOption.length).fill(0),
              Landfilling: new Array(locationOption.length).fill(0),
              "Other disposal operations": new Array(
                locationOption.length
              ).fill(0),
            };
          });
        });

        const answer =
          graphData &&
          graphData.length &&
          graphData.filter((item) => item?.questionId === 460);
        if (answer && answer.length) {
          const timeKey = [];
          const locationKey = [];

          for (const period in summary.location) {
            timeKey.push(period);
          }

          for (const period in summary.time) {
            locationKey.push(period);
          }

          for (const location in summary.time) {
            const data = summary.time[location];
            let i = 0;
            for (const key in data) {
              for (let k = 0; k < summary.time[location][key].length; k++) {
                let time = timeKey[k];
                const obj = locationOption.find(
                  (item) => item.unitCode || item.value === location
                );
                const lowerCaseKey = time;
                const formDate = timePeriods[lowerCaseKey];
                const filterData = answer.find(
                  (item) =>
                    item.formDate === formDate &&
                    item.sourceId === Number(obj.id)
                );
                summary.time[location][key][k] = filterData.answer[0][i] || 0;
              }
              i++;
            }
          }
          for (const time in summary.location) {
            const data = summary.location[time];
            let i = 0;
            for (const key in data) {
              for (let k = 0; k < summary.location[time][key].length; k++) {
                let location = locationKey[k];
                const obj = locationOption.find(
                  (item) => item.unitCode || item.value === location
                );
                const lowerCaseKey = time;
                const formDate = timePeriods[lowerCaseKey];
                const filterData = answer.find(
                  (item) =>
                    item.formDate === formDate && item.sourceId === obj.id
                );
                summary.location[time][key][k] = filterData.answer[0][i] || 0;
              }
              i++;
            }
          }
        }
        setData({
          time: summary.time,
          location: summary.location,
        });
      }
    } else {
      const valuesArray = locationOption
        ? locationOption.map((item) => item.unitCode || item.value)
        : [];

      const transformedKeys = Object.keys(timePeriods).map((key) =>
        key.toUpperCase()
      );

      setSelection(view === "time" ? valuesArray[0] : transformedKeys[0]);
      setSelectedCategory(
        view === "time" ? valuesArray[0] : transformedKeys[0]
      );
      setQuarters(transformedKeys);
      setLocations(valuesArray);

      const summary = {
        time: {},
        location: {},
      };

      locationOption.forEach((location) => {
        transformedKeys.forEach((quarter) => {
          summary.location[quarter] = {
            "Total metal scraps disposed": new Array(
              locationOption.length
            ).fill(0),
            "Total e-waste disposed": new Array(locationOption.length).fill(0),
          };
        });
      });

      transformedKeys.forEach((quarter) => {
        locationOption.forEach((location) => {
          summary.time[location?.unitCode] = {
            "Total metal scraps disposed": new Array(
              transformedKeys.length
            ).fill(0),
            "Total e-waste disposed": new Array(transformedKeys.length).fill(0),
          };
        });
      });

      const filteredData = graphData.filter(
        (item) => item?.questionId === 406 || item?.questionId === 413
      );
      const convertedData = convertMixedData(filteredData);
      const timeKey = [];
      const locationKey = [];

      for (const period in summary.location) {
        timeKey.push(period);
      }

      for (const period in summary.time) {
        locationKey.push(period);
      }

      for (const location in summary.time) {
        const data = summary.time[location];
        for (const key in data) {
          // Log the key
          for (let k = 0; k < summary.time[location][key].length; k++) {
            let time = timeKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            const lowerCaseKey = time;
            const formDate = timePeriods[lowerCaseKey];
            const filterData = convertedData.find(
              (item) =>
                item.title === key &&
                item.formDate === formDate &&
                item.sourceId === obj.id
            );
            summary.time[location][key][k] =
              Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }
      for (const time in summary.location) {
        const data = summary.location[time];
        for (const key in data) {
          // Log the key
          for (let k = 0; k < summary.location[time][key].length; k++) {
            let location = locationKey[k];
            const obj = locationOption.find(
              (item) => item.unitCode === location
            );
            const lowerCaseKey = time;
            const formDate = timePeriods[lowerCaseKey];
            const filterData = convertedData.find(
              (item) =>
                item.title === key &&
                item.formDate === formDate &&
                item.sourceId === obj.id
            );
            summary.location[time][key][k] =
              Number(filterData?.answer?.readingValue) || 0;
          }
        }
      }

      setData({
        time: summary.time,
        location: summary.location,
      });
    }
  }, [locationOption, timePeriods, graphData, companyFramework]);

  return (
    <div className="container" style={{ height: "100%" }}>
      <div style={{ height: "10%" }}>
        <div className="header">
          <div className="title">Waste Disposed</div>
        </div>

      </div>
      {(locations && locations?.length > 1) ? <div style={{ marginTop: "1%", marginLeft: "1.5%", height: "5%" }}>
        <label>
          <input
            type="radio"
            value="time"
            checked={selectedOption === "time"}
            onChange={handleOptionChange}
          />
          Time
        </label>
        <label>
          <input
            type="radio"
            value="location"
            checked={selectedOption === "location"}
            onChange={handleOptionChange}
          />
          Location
        </label>
      </div> : <></>}
      {(locations && locations?.length > 1) ? <div style={{ marginTop: "1%", marginLeft: "1.5%", height: "5%" }}>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="radio"
              value={category}
              checked={selectedCategory === category}
              onChange={handleCategoryChange}
            />
            {category}
          </label>
        ))}
      </div> : <></>}
      <div id="chart" style={{ height: (locations && locations?.length > 1) ? "75%" : "85%" }}>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={"100%"}
        />
      </div>
    </div>
  );
};

export default WasteDisposedMulti;
