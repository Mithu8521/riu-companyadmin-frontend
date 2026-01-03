import React, { useState, useEffect } from "react";
import { Tab, Row, Col } from "react-bootstrap";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import MultiSelect from "../CommonComponent/MultiSelect";

const CompareTab = ({
  meterList,
  selectedLocations,
  handleSelectionChange,
  locationOptions,
  financialYear,
  calculateDateRange,
  setcompareLastTimePeriods,
  setcompareCurrentTimePeriods,
  selectedLastYearPeriods,
  setSelectedLastYearPeriods,
  selectedCurrentYearPeriods,
  setSelectedCurrentYearPeriods,
}) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const start = JSON.parse(localStorage.getItem("currentUser")).starting_month;
  const [timePeriodLastOptions, setTimePeriodLastOptions] = useState([]);
  const [timePeriodCurrentOptions, setTimePeriodCurrentOptions] = useState([]);
  const [lastYearFreq, setLastYearFreq] = useState(null);
  const [currentFreq, setCurrentFreq] = useState(null);

  const handlePeriodChange = (
    selectedOptions,
    frequency,
    selectedYear,
    type
  ) => {
    if (selectedOptions.length === 0) {
      selectedOptions = [];
    }

    // setSelectedPeriod(selectedOptions);
    const newTimePeriods = {};
    const year = parseInt(selectedYear.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    selectedOptions.forEach((period) => {
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        const sixMonthLater = (start + 6) % 12;
        const firstMonthName = period.label.split("-")[0].trim();
        const firstMonthIndex = months.indexOf(firstMonthName);
        const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;
        dateRange = calculateDateRange(6, period.value, start, year);
      } else if (frequency === "QUARTERLY") {
        const firstMonthName = period.label.split(" ")[0].trim();
        const firstMonthIndex = months.indexOf(firstMonthName);
        const quarter = Math.floor(firstMonthIndex / 3) + 1;
        dateRange = calculateDateRange(3, period.value, start, year);
      } else if (frequency === "MONTHLY") {
        const firstMonthName = period.label?.split(" ")[0].trim();
        const startIndex = start - 1;
        const firstMonthAbsoluteIndex = months.indexOf(firstMonthName);
        const firstMonthIndex =
          ((firstMonthAbsoluteIndex - startIndex + months.length) %
            months.length) +
          1;

        dateRange = calculateDateRange(1, firstMonthIndex, start, year);

      } else if (frequency === "YEARLY") {
        dateRange = calculateDateRange(12, 1, start, year);
      }
      if (dateRange) {
        newTimePeriods[period?.label] = dateRange?.fromDate;
        if (
          !earliestFromDate ||
          new Date(dateRange.fromDate) < new Date(earliestFromDate)
        ) {
          earliestFromDate = dateRange.fromDate;
        }
        if (
          !latestToDate ||
          new Date(dateRange.toDate) > new Date(latestToDate)
        ) {
          latestToDate = dateRange.toDate;
        }
      }
    });
    if (type === "last") {
      setcompareLastTimePeriods(newTimePeriods);
    } else if ("current") {
      setcompareCurrentTimePeriods(newTimePeriods);
    }
  };

  const getFrequency = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: fId },
      "GET"
    );
    return isSuccess ? data?.data : null;
  };

  const getPeriodsOption = async (frequency) => {
    if (!frequency) return [];

    let options = [];
    if (frequency === "MONTHLY") {
      const orderedMonths =
        start === 1
          ? months
          : [...months.slice(start - 1), ...months.slice(0, start - 1)];

      options = orderedMonths.map((month, index) => ({
        label: month,
        value: ((start + index - 1) % 12) + 1,
      }));
    } else if (frequency === "QUARTERLY") {
      for (let i = start - 1; i < start + 11; i += 3) {
        const quarterStartIndex = i % 12;
        const quarterEndIndex = (i + 3) % 12;
        const quarter = `${months[quarterStartIndex]} - ${months[(quarterEndIndex - 1 + 12) % 12]
          }`;
        options.push({ label: quarter, value: quarter });
      }
    } else if (frequency === "HALF_YEARLY") {
      for (let i = start - 1; i < start + 11; i += 6) {
        const halfStartIndex = i % 12;
        const halfEndIndex = (i + 6) % 12;
        const half = `${months[halfStartIndex]} - ${months[(halfEndIndex - 1 + 12) % 12]
          }`;
        options.push({ label: half, value: half });
      }
    } else if (frequency === "YEARLY") {
      const yearlyStartIndex = start - 1;
      options = [
        {
          label: `${months[yearlyStartIndex]} - ${months[(yearlyStartIndex - 1 + 12) % 12]
            }`,
          value: 1,
        },
      ];
    }

    return options;
  };

  useEffect(() => {
    const fetchFrequencies = async () => {
      if (financialYear.length >= 2) {
        const lastYearFreq = await getFrequency(
          financialYear[financialYear.length - 2].id
        );
        const currentFreq = await getFrequency(
          financialYear[financialYear.length - 1].id
        );
        setLastYearFreq(lastYearFreq);
        setCurrentFreq(currentFreq);
        if (lastYearFreq) {
          const lastYearOptions = await getPeriodsOption(lastYearFreq);
          setTimePeriodLastOptions(lastYearOptions);
        }

        if (currentFreq) {
          const currentYearOptions = await getPeriodsOption(currentFreq);
          setTimePeriodCurrentOptions(currentYearOptions);
        }
      }
    };
    fetchFrequencies();
  }, [financialYear]);

  const getQuarterlyPeriods = (inputArray) => {
    return inputArray.flatMap(({ label, value }) => {
      const [startMonth, endMonth] = label.split(" - "); // Extract start & end month
      const startIndex = months.indexOf(startMonth);
      const endIndex = months.indexOf(endMonth);

      if (startIndex === -1 || endIndex === -1) return []; // Invalid input

      let result = [];
      for (let i = startIndex; i <= endIndex; i += 3) {
        let quarterStart = months[i];
        let quarterEnd = months[Math.min(i + 2, endIndex)];
        result.push({
          label: `${quarterStart} - ${quarterEnd}`,
          value: `${quarterStart} - ${quarterEnd}`,
        });
      }

      return result;
    });
  };
  const handleLastYearPeriodChange = (selectedOptions) => {

    if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
      selectedOptions = selectedOptions;
    }
    else {
      selectedOptions = timePeriodLastOptions.filter(item =>
        selectedOptions.includes(item.value)
      );
    }

    setSelectedLastYearPeriods(selectedOptions);
    handlePeriodChange(
      selectedOptions,
      lastYearFreq,
      financialYear[financialYear.length - 2].financial_year_value,
      "last"
    );
    if (currentFreq === "QUARTERLY") {
      if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
        selectedOptions = selectedOptions;
      }
      else {
        selectedOptions = timePeriodLastOptions.filter(item =>
          selectedOptions.includes(item.value)
        );
      }
      const quarterlyPeriods = getQuarterlyPeriods(selectedOptions);

      setSelectedCurrentYearPeriods(quarterlyPeriods);
      handlePeriodChange(
        quarterlyPeriods,
        currentFreq,
        financialYear[financialYear.length - 1].financial_year_value,
        "current"
      );
    }
  };

  const handleCurrentYearPeriodChange = (selectedOptions) => {
    if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
      selectedOptions = selectedOptions;
    }
    else {
      selectedOptions = timePeriodCurrentOptions.filter(item =>
        selectedOptions.includes(item.value)
      );
    }

    setSelectedCurrentYearPeriods(selectedOptions);
    handlePeriodChange(
      selectedOptions,
      currentFreq,
      financialYear[financialYear.length - 1].financial_year_value,
      "current"
    );
  };
  return (
    <div>
      <div style={{ marginBottom: "1em", color: "#3f88a5", fontWeight: 600 }}>
        Note* Can select all the options in each filter (to compare value).
      </div>
      <Row className="g-0">
        <Col md={4} style={{ marginRight: "5px" }}>
          {financialYear.length >= 2 && timePeriodLastOptions.length > 0 && (
            <MultiSelect
              options={timePeriodLastOptions}
              selectedValues={selectedLastYearPeriods.map(item => item.value)}
              onChange={(selectedOptions) => handleLastYearPeriodChange(selectedOptions)}
              placeholder="Select Period"
              label={`FY - ${financialYear[financialYear.length - 2]?.financial_year_value}`}
              icon="🔍"
              activeTab="abc"
              autoSelectAll={true}
            />
          )}
        </Col>

        <Col md={4} style={{ marginRight: "5px" }}>
          {financialYear.length >= 2 && timePeriodLastOptions.length > 0 && (
            <MultiSelect
              options={timePeriodCurrentOptions}
              selectedValues={selectedCurrentYearPeriods.map(item => item.value)}
              onChange={(selectedOptions) => handleCurrentYearPeriodChange(selectedOptions)}
              placeholder="Select Period"
              label={`FY - ${financialYear[financialYear.length - 1]?.financial_year_value}`}
              icon="🔍"
              activeTab="abc"
              autoSelectAll={true}
            />
          )}
        </Col>
        <Col md={4} style={{ marginRight: "5px" }}>
          {meterList && meterList.length > 1 && (
            <Col md={12} style={{ marginRight: "5px" }}>
              <div className="">
                <MultiSelect
                  options={locationOptions}
                  selectedValues={selectedLocations.map(item => item.value)}
                  onChange={(selectedOptions) => {
                    handleSelectionChange(selectedOptions);
                  }}
                  placeholder={`Select Location`}
                  label={`Location`}
                  icon="🔍"
                  activeTab={'abc'}
                  autoSelectAll={true}
                />
              </div>
            </Col>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CompareTab;
