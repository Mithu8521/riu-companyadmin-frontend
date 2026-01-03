import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Select, { components } from "react-select";

const WasteGenMultLoc = ({
  timePeriods,
  timePeriodValues,
  locationOption,
  brief,
}) => {
  // Check if brief and brief.time exist

  const locationPeriod = Object.keys(brief.time); // Assuming these are your locations
  const time = Object.keys(brief.location);
  const categories = [
    "Total non-hazardous solid waste generation (black category general waste)* (kg)",
    "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
    "Total packaging waste (Plastic) generated* (Kg)",
    "Total plastic packaging waste generated ",
    "Total food waste generated/Kitchen Waste* (Kgs)",
    "Total e-waste generated",
    "Total hazardous waste (spent oil/lubricants etc)",
  ];

  const categoryMapping = [
    {
      fullName:
        "Total non-hazardous solid waste generation (black category general waste)* (kg)",
      shortName: "Non-hazardous Waste",
    },
    {
      fullName:
        "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (kg)",
      shortName: "Landfill Waste",
    },
    {
      fullName: "Total packaging waste (Plastic) generated* (Kg)",
      shortName: "Non-plastic Waste",
    },
    {
      fullName: "Total plastic packaging waste generated ",
      shortName: "Plastic Waste",
    },
    {
      fullName: "Total food waste generated/Kitchen Waste* (Kgs)",
      shortName: "Food Waste",
    },
    {
      fullName: "Total e-waste generated",
      shortName: "E-waste",
    },
    {
      fullName: "Total hazardous waste (spent oil/lubricants etc)",
      shortName: "Hazardous Waste",
    },
  ];

  // Prepare data for the chart based on conditions

  const colors = [
    "#C6CB8D",
    "#949776",
    "#ABC4B2",
    "#6D8B96",
    "#9CDFE3",
    "#11546f",
    "#587b87",
    "#8CBBCE",
  ];

  const options = categoryMapping.map((cat, index) => ({
    value: cat.fullName, // Original full name used for data handling
    label: cat.shortName,
    color: colors[index],
  }));

  const [selectedCategories, setSelectedCategories] = useState(
    options.slice(0, 5)
  );
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    // Prepare data for the chart based on conditions
    const newSeriesData = [];
    const selectedValues = selectedCategories.map((category) => category.value);

    if (locationPeriod.length > 1 && timePeriodValues.length === 1) {
      // Case 1: Multiple locations and single time period
      locationPeriod.forEach((location) => {
        const locationData = {};
        selectedValues.forEach((category) => {
          if (brief.time[location][category]) {
            locationData[category] = Number(brief.time[location][category][0]);
          }
        });
        newSeriesData.push(locationData);
      });
    } else if (locationPeriod.length === 1 && timePeriodValues.length > 1) {
      // Case 2: Single location and multiple time periods
      time.forEach((timeO) => {
        const locationData = {};
        selectedValues.forEach((category) => {
          if (brief.location[timeO][category]) {
            locationData[category] = Number(brief.location[timeO][category][0]);
          }
        });
        newSeriesData.push(locationData);
      });
    } else if (locationPeriod.length > 1 && timePeriodValues.length > 1) {
      // Case 3: Multiple locations and multiple time periods
      time.forEach((timeO) => {
        const locationData = {};
        selectedValues.forEach((category) => {
          if (brief.location[timeO][category]) {
            const sumValue = brief.location[timeO][category].reduce(
              (acc, val) => acc + Number(val),
              0
            );
            locationData[category] = sumValue;
          }
        });
        newSeriesData.push(locationData);
      });
    }

    // Convert seriesData into the format ApexCharts expects
    const series = selectedValues.map((category) => ({
      name: category,
      data: newSeriesData.map((item) => item[category] || 0), // Fallback to 0 if no data
    }));

    setSeriesData(series);
  }, [selectedCategories, brief]);

  // if (locationPeriod.length > 1 && timePeriodValues.length === 1) {
  //   // Case 1: Multiple locations and single time period
  //   locationPeriod.forEach((location) => {
  //     const locationData = {};
  //     categories.forEach((category) => {
  //       if (brief.time[location][category]) {
  //         // Take the first element of the array for the value
  //         locationData[category] = Number(brief.time[location][category][0]);
  //       }
  //     });
  //     seriesData.push(locationData);
  //   });
  // } else if (locationPeriod.length === 1 && timePeriodValues.length > 1) {
  //   // Case 2: Single location and multiple time periods
  //   time.forEach((timeO) => {
  //     const locationData = {};
  //     categories.forEach((category) => {
  //       if (brief.location[timeO][category]) {
  //         // Take the first element of the array for the value
  //         locationData[category] = Number(brief.location[timeO][category][0]);
  //       }
  //     });
  //     seriesData.push(locationData);
  //   });
  // } else if (locationPeriod.length > 1 && timePeriodValues.length > 1) {
  //   // Case 3: Single location and single time period
  //   time.forEach((timeO) => {
  //     const locationData = {};
  //     categories.forEach((category) => {
  //       if (brief.location[timeO][category]) {
  //         // Sum all the elements in the array for the value
  //         const sumValue = brief.location[timeO][category].reduce(
  //           (acc, val) => acc + Number(val),
  //           0
  //         );
  //         locationData[category] = sumValue;
  //       }
  //     });
  //     seriesData.push(locationData);
  //   });
  // }

  // Convert seriesData into the format ApexCharts expects

  // const series = categories.map((category, index) => ({
  //   name: category,
  //   data: seriesData.map((item) => item[category] || 0), // Fallback to 0 if no data
  // }));

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          const seriesName = w.globals.seriesNames[seriesIndex];

          const category = categoryMapping.find(
            (cat) => cat.fullName === seriesName
          );

          const shortName = category ? category.shortName : seriesName;

          // Return the formatted tooltip value with short name
          return `${shortName}: ${value} mT`;
        },
      },
    },
    legend: {
      show: true, // Show the legend
      position: "bottom", // Position can be 'top', 'bottom', 'left', or 'right'
      horizontalAlign: "center", // Horizontal alignment can be 'left', 'center', or 'right'
      markers: {
        width: 12, // Width of the markers
        height: 12, // Height of the markers
        borderRadius: 12, // Border radius of the markers
      },
      itemMargin: {
        horizontal: 10, // Space between legend items horizontally
        vertical: 5, // Space between legend items vertically
      },
      formatter: (seriesName) => {
        // Find the corresponding shortened name for the series
        const category = categoryMapping.find(
          (cat) => cat.fullName === seriesName
        );
        return category ? category.shortName : seriesName; // Use short name or fallback to full name
      },
    },
    xaxis: {
      categories:
        locationPeriod.length > 1 && timePeriodValues.length === 1
          ? locationPeriod // Using locations as X-axis categories for this condition
          : time, // Using time periods as X-axis categories for the other condition
    },
    yaxis: {
      title: {
        text: "Waste in MT ", // Title for the Y-axis
        style: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60px",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: selectedCategories.map((category) => category.color), // Bind colors to selected categories
    dataLabels: {
      enabled: true,
    },
  };

  if (!brief || !brief.time) {
    return <p>No data available.</p>;
  }

  const CustomOption = (props) => {
    const { isSelected, data } = props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div
            style={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #3f88a5",
                borderRadius: "2px",
                backgroundColor: isSelected ? "transparent" : "transparent",
                marginRight: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Tick mark when selected */}
              {isSelected && (
                <span style={{ color: "white", fontSize: "14px" }}>✔</span>
              )}
            </div>
          </div>

          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 300 }}>
              {data.label}
            </div>
          </div>
        </div>
      </components.Option>
    );
  };

  const CustomMultiValue = () => null;

  const CustomControl = (props) => {
    const { selectProps } = props;
    const { value, placeholder } = selectProps;

    return (
      <components.Control {...props}>
        {/* Placeholder or selected value */}
        {(!value || value.length === 0) && (
          <div
            style={{
              color: "#3f88a5",
              fontWeight: 600,
              fontSize: "13px",
              position: "absolute",
              left: "5px",
              pointerEvents: "none",
            }}
          >
            {/* {placeholder} */}
          </div>
        )}
        {/* Display only the first selected product */}
        {value && value.length > 0 && (
          <div
            style={{
              color: "#3f88a5",
              marginLeft: "5px",
              fontSize: "12px",
              width: "70%",
            }}
          >
            {value[0].label}
            {value.length > 1 && ` +${value.length - 1} more`}
          </div>
        )}

        {/* Ensure you still render the child components like the dropdown indicator and input */}
        {props.children}
      </components.Control>
    );
  };

  const CustomClearIndicator = () => null;

  return (
    <div className="container">
      <div
        style={{
          height: "10%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "45%",
            fontSize: "20px",
            fontWeight: 600,
            color: "#011627",
          }}
        >
          Total Waste Generated
        </div>
        <div style={{ width: "45%" }}>
          <Select
            isMulti
            value={selectedCategories.filter((option) =>
              options.some((opt) => opt.value === option.value)
            )}
            options={options}
            onChange={(selected) => {
              const selectedValues = selected.map((item) => item);

              if (selectedValues.length < 1) {
                alert("You must select at least one product.");
              } else if (selectedValues.length <= 5) {
                setSelectedCategories(selectedValues);
              } else {
                alert(`You can only select up to ${5} products.`);
              }
            }}
            placeholder={`Select products`}
            hideSelectedOptions={false} // Keep selected options in the dropdown
            className=""
            components={{
              Option: CustomOption,
              Control: CustomControl,
              MultiValue: CustomMultiValue,
              ClearIndicator: CustomClearIndicator, // Hides the clear button
            }}
            closeMenuOnSelect={false} // Prevent dropdown from closing
            styles={{
              control: (base) => ({
                ...base,
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100, // Ensure the menu appears above other elements
                border: "2px solid #3f88a5",
                borderRadius: "10px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#3f88a5", // Change color of the dropdown arrow
                padding: "0 10px", // Adjust padding for the indicator
                fontSize: "20px", // Increase the font size of the indicator
                minHeight: "20px", // Set a minimum height for the indicator
                minWidth: "20px", // Set a minimum width for the indicator
              }),
              placeholder: (base) => ({
                ...base,
                position: "absolute", // Ensure the placeholder doesn't shift with input
                top: "50%",
                transform: "translateY(-50%)", // Vertically center the placeholder
                pointerEvents: "none", // Disable interaction on the placeholder
              }),
              multiValue: (base) => ({
                ...base,
                background: "transparent",
                border: "2px solid #3f88a5",
                borderRadius: "10px",
                marginTop: "0.5em",
              }),
              option: (provided, state) => ({
                ...provided,

                backgroundColor: state.isSelected
                  ? "transparent" // Selected option background color
                  : state.isFocused
                  ? "white" // Focused option background color
                  : "white", // Default option background color
                color: state.isSelected ? "black" : "black", // Text color based on state
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      {/* Category Selector */}

      <div style={{ height: "90%" }}>
        {seriesData.length > 0 && chartOptions.xaxis.categories.length > 0 && (
          <Chart
            options={chartOptions}
            series={seriesData}
            type="bar"
            height={"100%"}
          />
        )}
      </div>

      {/* Custom Legends Container */}
    </div>
    // <div className="container">
    //   <div
    //     style={{
    //       height: "10%",
    //       fontSize: "20px",
    //       fontWeight: 600,
    //       color: "#011627",
    //       marginBottom: "2%",
    //     }}
    //   >
    //     Total Waste Generated
    //   </div>

    //   <div style={{ height: "70%" }}>
    //     <Chart
    //       options={chartOptions}
    //       series={series}
    //       type="bar"
    //       height={"100%"}
    //     />
    //   </div>

    //   {/* Custom Legends Container */}
    //   <div style={{ marginTop: "20px", width: "100%" }}>
    //     {shortenedCategories
    //       .reduce((acc, category, index) => {
    //         if (index % 3 === 0) acc.push([]); // Start a new row for every three items
    //         acc[acc.length - 1].push(
    //           <div
    //             key={index}
    //             style={{
    //               display: "flex",
    //               width: "25%",
    //               alignItems: "center",
    //               marginRight: "15px",
    //             }}
    //           >
    //             <div
    //               style={{
    //                 width: "15px",
    //                 height: "15px",
    //                 borderRadius: "50%",
    //                 backgroundColor: chartOptions.colors[index], // Use corresponding color
    //                 marginRight: "5px",
    //               }}
    //             />
    //             <span style={{ fontWeight: 300, fontSize: "12px" }}>
    //               {category}
    //             </span>
    //           </div>
    //         );
    //         return acc;
    //       }, [])
    //       .map((row, rowIndex) => (
    //         <div
    //           key={rowIndex}
    //           style={{
    //             display: "flex",
    //             flexWrap: "wrap",
    //             fontSize: "12px",
    //             marginBottom: "10px",
    //           }}
    //         >
    //           {row}
    //         </div>
    //       ))}
    //   </div>
    // </div>
  );
};

export default WasteGenMultLoc;
