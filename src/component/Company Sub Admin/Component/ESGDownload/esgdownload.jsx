import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Form, Modal, Tabs, Tab, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import "./esg.css";
import { generateReport } from "../Reporting/brsr_report";
import CustomOption from "./CustomOption";
import MultiSelect from "../CommonComponent/MultiSelect";
import { LocationField, PeriodsField } from "../../../CarbonFootPrinting/common/FormComponents";

const CompareTab = lazy(() => import("./compareToPreviousYear"));

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

const Esgdownload = ({
  setFinancialYearId,
  setShow,
  financialYear,
  frameworkValue,
  setFinancialYear,
  setTimePeriods,
  currentTab,
  keyTab,
  setKeyTab,
  setLocationOption,
  setFramework,
  framework,
  downloadPdf,
  setFromDate,
  setToDate,
  show,
  handleClose,
  financialYearId,
  setcompareLastTimePeriods,
  setcompareCurrentTimePeriods,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const start = JSON.parse(localStorage.getItem("currentUser"))?.starting_month || null;

  const [selectedPeriod, setSelectedPeriod] = useState([]);
  const [meterList, setMeterList] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [timePeriodOptions, setTimePeriodOptions] = useState([]);
  const [frequency, setFrequency] = useState(currentUser?.frequency);
  const [permissionList, setPermissionList] = useState([]);
  useEffect(() => {
    const dashboardMenu = JSON.parse(localStorage.getItem("menu"));
    const dashboardObject = dashboardMenu.find(
      (item) => item.caption === "Dashboard"
    ).permissions;
    setPermissionList(dashboardObject);
  }, []);
  const [selectedLastYearPeriods, setSelectedLastYearPeriods] = useState(
    Object.keys(compareLastTimePeriods).map((key) => ({
      label: key,
      value: key,
    }))
  );
  const [selectedCurrentYearPeriods, setSelectedCurrentYearPeriods] = useState(
    Object.keys(compareTCurrentimePeriods).map((key) => ({
      label: key,
      value: key,
    }))
  );
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleBRSRDownload = () => {
    const url =
      "https://riu-bucket.s3.ap-south-1.amazonaws.com/uploads/Business%20responsibility%20and%20sustainability%20report.pdfBusiness%20responsibility%20and%20sustainability%20report.pdf";
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Opens in a new tab
    link.download = url.split("/").pop();
    document.body.appendChild(link); // Append to body
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const handleBRSRGudeLineDownload = () => {
    const url =
      "https://riu-bucket.s3.ap-south-1.amazonaws.com/uploads/Business%20responsibility%20and%20sustainability%20reporting%20by%20listed%20entitiesAnnexure2_p.PDFBusiness%20responsibility%20and%20sustainability%20reporting%20by%20listed%20entitiesAnnexure2_p.PDF";
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Opens in a new tab
    link.download = url.split("/").pop();
    document.body.appendChild(link); // Append to body
    link.click();
    document.body.removeChild(link); // Clean up
  };

  useEffect(() => {
    getFinancialYear();
    getSource();
  }, []);

  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');

    if (storedData) {
      // Data exists in local storage, parse and use it
      const data = JSON.parse(storedData);
      if (isMounted.current) {
        setFinancialYear(data);
        const lastEntry = data[data.length - 1];
        setSelectedYear(lastEntry.financial_year_value);
        setFinancialYearId(lastEntry.id);
        getFrequency(lastEntry.id);
      }
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {},
        "GET"
      );

      if (isSuccess && isMounted.current) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));

        // Set state with the API response
        setFinancialYear(data.data);
        const lastEntry = data.data[data.data.length - 1];
        setSelectedYear(lastEntry.financial_year_value);
        setFinancialYearId(lastEntry.id);
        getFrequency(lastEntry.id);
      }
    }
  };

  const getSource = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess && isMounted.current) {
      const locationArray = data?.data.map((item) => ({
        id: item.id,
        unitCode: item?.unitCode,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      setMeterList(locationArray);
    }
  };

  const getFrequency = async (fId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFrequency`,
      {},
      { financialYearId: fId },
      "GET"
    );
    if (isSuccess && isMounted.current) {
      setFrequency(data?.data);
    }
  };

  useEffect(() => {
    if (meterList.length > 1 && selectedLocations.length === 0) {
      const firstLocation = {
        value: meterList[1].unitCode || meterList[1].location,
        label: meterList[1].unitCode || meterList[1].location,
        unitCode: meterList[1].unitCode,
        id: meterList[1].id,
      };
      setSelectedLocations([firstLocation]);
      setLocationOption([firstLocation]);
      if (keyTab === "combinedAll") {
        const allLocations = meterList.map((meter) => ({
          value: meter.unitCode || meter.location,
          label: meter.unitCode || meter.location,
          unitCode: meter.unitCode,
          id: meter.id,
        }));
        setSelectedLocations(allLocations);
        setLocationOption(allLocations);
      }
    } else if (meterList.length > 0 && selectedLocations.length === 0) {
      const firstLocation = {
        value: meterList[0].unitCode || meterList[0].location,
        label: meterList[0].unitCode || meterList[0].location,
        unitCode: meterList[0].unitCode,
        id: meterList[0].id,
      };
      setSelectedLocations([firstLocation]);
      setLocationOption([firstLocation]);
      if (keyTab === "combinedAll") {
        const allLocations = meterList.map((meter) => ({
          value: meter.unitCode || meter.location,
          label: meter.unitCode || meter.location,
          unitCode: meter.unitCode,
          id: meter.id,
        }));
        setSelectedLocations(allLocations);
        setLocationOption(allLocations);
      }
    }

    if (selectedPeriod.length > 0) {
      const firstPeriod = selectedPeriod[0];
      setSelectedPeriod([firstPeriod]);
      handlePeriodChange([firstPeriod]);
      if (keyTab === "combinedAll") {
        setSelectedPeriod(timePeriodOptions);
        handlePeriodChange(timePeriodOptions);
      }
    }
  }, [meterList]);

  const handleSelectionChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      // If all options are deselected (including "All"), clear the selection
      setLocationOption([]);
      setSelectedLocations([]);
    } else {
      if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
        selectedOptions = selectedOptions;
      }
      else {
        selectedOptions = locationOptions.filter(item =>
          selectedOptions.includes(item.value)
        );
      }

      // Otherwise, just set the selected options normally
      setLocationOption(selectedOptions);
      setSelectedLocations(selectedOptions);
    }
  };

  const handleLocationChangeSingle = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      setLocationOption([]);
      setSelectedLocations([]);
    } else {
      selectedOptions = locationOptions.filter((item) => item.value === selectedOptions);
      setLocationOption(selectedOptions);
      setSelectedLocations(selectedOptions);
    }
  };

  useEffect(() => {
    if (financialYearId) getFrequency(financialYearId);
  }, [financialYearId]);

  useEffect(() => {
    if (frequency) {
      let options = [];
      if (frequency === "MONTHLY") {
        const options =
          start === 1
            ? months
            : [...months.slice(start - 1), ...months.slice(0, start - 1)];

        // Map options to { label, value } format
        const formattedOptions = options.map((month, index) => ({
          label: month,
          value: ((start + index - 1) % 12) + 1, // Ensures values cycle correctly from 1 to 12
        }));

        setTimePeriodOptions(formattedOptions);
        setSelectedPeriod(formattedOptions[0]);
        handlePeriodChangeSingle(formattedOptions[0]);
      } else if (frequency === "QUARTERLY") {
        for (let i = start - 1; i < start + 11; i += 3) {
          const quarterStartIndex = i % 12;
          const quarterEndIndex = (i + 3) % 12;
          const quarter = `${months[quarterStartIndex]} - ${months[(quarterEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: quarter, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
        setSelectedPeriod(options[0]);
        handlePeriodChangeSingle(options[0]);
      } else if (frequency === "HALF_YEARLY") {
        for (let i = start - 1; i < start + 11; i += 6) {
          const halfStartIndex = i % 12;
          const halfEndIndex = (i + 6) % 12;
          const half = `${months[halfStartIndex]} - ${months[(halfEndIndex - 1 + 12) % 12]
            }`;
          options.push({ label: half, value: options.length + 1 });
        }
        setTimePeriodOptions(options);
        setSelectedPeriod(options[0]);
        handlePeriodChangeSingle(options[0]);
      } else if (frequency === "YEARLY") {
        const yearlyStartIndex = start - 1;
        options = [
          {
            label: `${months[yearlyStartIndex]} - ${months[(yearlyStartIndex - 1 + 12) % 12]
              }`,
            value: 1,
          },
        ];
        setTimePeriodOptions(options);
      }
    }
  }, [frequency, start]);

  useEffect(() => {
    if (timePeriodOptions) handlePeriodChangeSingle(timePeriodOptions[0]);
  }, [timePeriodOptions, financialYearId]);

  useEffect(() => {
    if (keyTab === "individual") {
      setSelectedLocations((prevState) => {
        return prevState.length > 0 ? [prevState[0]] : [];
      });
      setLocationOption((prevState) => {
        return prevState.length > 0 ? [prevState[0]] : [];
      });
      // const periodOptionsForFrequency = periodOptions[frequency] || [];
      if (
        // periodOptionsForFrequency.length > 0 &&
        selectedPeriod.length > 0
      ) {
        const firstPeriod = selectedPeriod[0];
        setSelectedPeriod(firstPeriod);
        handlePeriodChangeSingle(firstPeriod);
      }
    }
  }, [keyTab]);

  const calculateDateRange = (type, period, startingMonth, year) => {
    const startMonth = ((startingMonth - 1 + (period - 1) * type) % 12) + 1;

    const startYear =
      year + Math.floor((startingMonth - 1 + (period - 1) * type) / 12);
    const endMonth = ((startMonth - 1 + type) % 12) + 1;
    const endYear = startYear + Math.floor((startMonth - 1 + type) / 12);

    const formatDate = (month, year) =>
      `${year}-${month < 10 ? `0${month}` : month}`;

    return {
      fromDate: formatDate(startMonth, startYear),
      toDate: formatDate(endMonth, endYear),
    };
  };

  const handleYearChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = financialYear.find(
      (year) => year.financial_year_value === selectedValue
    );
    setSelectedYear(selectedValue);
    setFinancialYearId(selectedOption?.id || "");
  };


  const handlePeriodChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      selectedOptions = [];
    }

    if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
      selectedOptions = selectedOptions;
    }
    else {
      selectedOptions = timePeriodOptions.filter(item =>
        selectedOptions.includes(item.value)
      );
    }

    setSelectedPeriod(selectedOptions);
    const newTimePeriods = {};
    const year = parseInt(selectedYear.split("-")[0]);

    let earliestFromDate = null;
    let latestToDate = null;

    selectedOptions.forEach((period) => {
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

        // Extract the first month from the selectedOption
        const firstMonthName = period?.label?.split("-")[0].trim(); // Assuming `label` contains something like "Apr - Jun"

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Check if the 6 months later month and first month match the condition
        const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;

        dateRange = calculateDateRange(6, period.value, start, year);
      } else if (frequency === "QUARTERLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = period?.label?.split(" ")[0].trim();

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Determine the quarter based on the start month and the selectedOption first month
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
    setFromDate(earliestFromDate);
    setToDate(latestToDate);
    setTimePeriods(newTimePeriods);
  };

  const handlePeriodChangeSingle = (selectedOption) => {
    // Check if the selected option is valid
    if (selectedYear) {
      if (!selectedOption) {
        setSelectedPeriod([]); // Clear selection if no option is selected
        setFromDate(null);
        setToDate(null);
        setTimePeriods({});
        return;
      }
      if (typeof selectedOption === "object" && selectedOption !== null) {
        selectedOption = selectedOption;
      } else if (typeof selectedOption === "number") {
        selectedOption = timePeriodOptions.filter(item => item.value === selectedOption);
        selectedOption = selectedOption[0];
      } else {
        selectedOption = [];
      }
      setSelectedPeriod([selectedOption]); // Set the selected period as an array

      const newTimePeriods = {};
      const year = parseInt(selectedYear.split("-")[0]);
      let dateRange;

      if (frequency === "HALF_YEARLY") {
        const sixMonthLater = (start + 6) % 12; // Wrap around December if necessary

        // Extract the first month from the selectedOption
        const firstMonthName = selectedOption.label.split("-")[0].trim(); // Assuming `label` contains something like "Apr - Jun"

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Check if the 6 months later month and first month match the condition
        const halfYear = sixMonthLater === (firstMonthIndex + 1) % 12 ? 2 : 1;

        dateRange = calculateDateRange(6, selectedOption.value, start, year);
      } else if (frequency === "QUARTERLY") {
        // Extract the first month from the selectedOption
        const firstMonthName = selectedOption.label.split(" ")[0].trim();

        // Find the index of the first month from the months array
        const firstMonthIndex = months.indexOf(firstMonthName);

        // Determine the quarter based on the start month and the selectedOption first month
        const quarter = Math.floor(firstMonthIndex / 3) + 1;

        dateRange = calculateDateRange(3, selectedOption.value, start, year);
      } else if (frequency === "MONTHLY") {
       const firstMonthName = selectedOption.label?.split(" ")[0].trim();
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
        newTimePeriods[selectedOption.value] = dateRange.fromDate;

        setFromDate(dateRange.fromDate);
        setToDate(dateRange.toDate);
      } else {
        setFromDate(null);
        setToDate(null);
      }

      setTimePeriods(newTimePeriods);
    }
  };

  // Add the "All" option to the dynamically generated options
  const locationOptions = [
    ...meterList.map((item) => ({
      value: item?.unitCode || item.location,
      label: item?.unitCode || item.location,
      unitCode: item?.unitCode,
      id: item?.id,
    })),
  ];

  const frameworkOptions = [
    ...frameworkValue.map((framework) => ({
      label: framework.title,
      value: framework.id,
    })),
  ];

  useEffect(() => {
    // Filter out "All" from frameworkOptions before setting the state
    let filteredFrameworkOptions;

    if (keyTab === "individual") {
      filteredFrameworkOptions = frameworkOptions;
    } else {
      filteredFrameworkOptions = frameworkOptions;
    }

    // Only update framework if the options are different
    setFramework(filteredFrameworkOptions);
    if (keyTab === "combinedAll") {
      const allLocations = meterList.map((meter) => ({
        value: meter.unitCode || meter.location,
        label: meter.unitCode || meter.location,
        unitCode: meter.unitCode,
        id: meter.id,
      }));
      setSelectedLocations(allLocations);
      setLocationOption(allLocations);
      setSelectedPeriod(timePeriodOptions);
      handlePeriodChange(timePeriodOptions);
    } else if (keyTab === "compareToYear") {
      const limitedLocations = selectedLocations.length > 5
        ? selectedLocations.slice(0, 5)
        : selectedLocations;

      const limitedPeriods = selectedPeriod.length > 5
        ? selectedPeriod.slice(0, 5)
        : selectedPeriod;

      setSelectedLocations(limitedLocations);
      setLocationOption(limitedLocations);
      setSelectedPeriod(limitedPeriods);
      handlePeriodChange(limitedPeriods);
    } else {
      const firstLocation = {
        value: meterList[0]?.unitCode || meterList[0]?.location,
        label: meterList[0]?.unitCode || meterList[0]?.location,
        unitCode: meterList[0]?.unitCode,
        id: meterList[0]?.id,
      };
      setSelectedLocations([firstLocation]);
      setLocationOption([firstLocation]);
      const firstPeriod = selectedPeriod[0];
      setSelectedPeriod([firstPeriod]);
      handlePeriodChange([firstPeriod]);
    }
  }, [keyTab, frameworkValue]);

  const handleFrameworkChange = (selectedOptions) => {
    if (selectedOptions.length === 0) {
      setFramework([]);
    } else {
      if (typeof selectedOptions[0] === "object" && selectedOptions[0] !== null) {
        selectedOptions = selectedOptions;
      }
      else {
        selectedOptions = frameworkOptions.filter(item =>
          selectedOptions.includes(item.value)
        );
      }
      setFramework(selectedOptions);
    }
  };
  const [companyId, setCompanyId] = useState();
  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    const currentUser = localStorage.getItem("tmpcurrentUser");
    if (currentUser) {
      setCompanyId(String(JSON.parse(currentUser).data.user.dataValues.company_id));
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCloseFilter = () => setShowFilter(false);
  return (
    <div style={{ width: "100%" }}>
      <div className="color_div_Current mb-3">
        <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
          <div className="d-flex justify-content-start" style={{ flex: "1" }}>
            {permissionList.some(
              (permission) =>
                permission.permissionCode === "DOWNLOAD_ESG_REPORT" &&
                permission.checked
            ) ? (
              <div className="color_rent mb-0">
                <button
                  onClick={() => setShow(true)}
                  className="esg_button_style"
                >
                  Download Report
                  <i className="fa fa-download" style={{ marginLeft: "8px" }}></i>
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="d-flex justify-content-center" style={{ flex: "1" }}>
            <div className="color_rent mb-0">
              <Form.Select
                className="esg_text2"
                onChange={handleYearChange}
                value={selectedYear}
                style={{ padding: ".5rem 2.25rem .5rem .75rem" }}
              >
                {financialYear.map((year) => (
                  <option key={year.id} value={year.financial_year_value}>
                    FY - {"           "}
                    {year.financial_year_value}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className="d-flex justify-content-end" style={{ flex: "1" }}>
            <div className="color_rent mb-0">
              <button
                onClick={() => setShowFilter(true)}
                className="esg_button_style"
              >
                Filter
                <i className="fa fa-filter" style={{ marginLeft: "8px" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <label className="align-items-center">ESG REPORT</label>
        </Modal.Header>
        <Modal.Body>
          <p>DOWNLOAD YOUR REQUIRED REPORT BELOW</p>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              display: "flex",

              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ width: "40%" }}>
              <button
                onClick={handleBRSRDownload}
                className="new_button_style"
                style={{ width: "100%", fontSize: "10px" }}
              >
                BRSR Report Format
              </button>
            </div>
            <div style={{ width: "40%" }}>
              <button
                onClick={handleBRSRGudeLineDownload}
                className="new_button_style"
                style={{ width: "100%", fontSize: "10px" }}
              >
                BRSR Guideline
              </button>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "40%" }}>
              <button
                className="new_button_style"
                style={{ width: "100%", fontSize: "10px" }}
                onClick={() => downloadPdf("WORD")}
                disabled={companyId != "362"}
              >
                DOWNLOAD ESG REPORT (Word Documents)
              </button>
            </div>
            <div style={{ width: "40%" }}>
              <button
                className="new_button_style"
                style={{ width: "100%", fontSize: "10px" }}
                onClick={() => downloadPdf("PDF")}
                disabled={companyId != "362"}
              >
                DOWNLOAD ESG REPORT (PDF)
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showFilter} onHide={handleCloseFilter}>
        <Modal.Header closeButton>
          <div
            style={{ color: "#3f88a5", fontSize: "24px", fontWeight: "bold" }}
          >
            Filters
          </div>
        </Modal.Header>
        <Modal.Body style={{ height: "60vh" }}>
          {currentTab !== 0 ? (
            <Tabs
              defaultActiveKey={keyTab}
              id="filter-tabs"
              className="mb-3 custom-tabs"
              onSelect={(k) => setKeyTab(k)}
            >
              {/* Combined All */}
              <Tab
                eventKey="combinedAll"
                style={{}}
                tabClassName="custom-tab-esg"
                title="Combined All"
              >
                <div
                  style={{
                    marginBottom: "1em",
                    color: "#3f88a5",
                    fontWeight: 600,
                  }}
                >
                  Note* Can select all the options in each filter (to see
                  combined value).
                </div>

                <Row className="g-0">
                  <Col md={4} style={{ marginRight: "5px" }}>
                    <div className="">
                      {(frequency === "HALF_YEARLY" || frequency === "QUARTERLY" || frequency === "MONTHLY" || frequency === "YEARLY") && (
                        <MultiSelect
                          options={timePeriodOptions}
                          selectedValues={selectedPeriod.map(item => item.value)}
                          onChange={(selectedOptions) => handlePeriodChange(selectedOptions)}
                          placeholder={`Select Period`}
                          label={`Period`}
                          icon="🔍"
                          activeTab={'abc'}
                          autoSelectAll={true}
                        />
                      )}
                    </div>
                  </Col>
                  {meterList && meterList.length > 1 && (
                    <Col md={4} style={{ marginRight: "5px" }}>
                      <div className=" ">
                        <MultiSelect
                          options={locationOptions}
                          selectedValues={selectedLocations.map(item => item.value)}
                          onChange={(selectedOptions) => handleSelectionChange(selectedOptions)}
                          placeholder={`Select Location`}
                          label={`Location`}
                          icon="🔍"
                          activeTab={'abc'}
                          autoSelectAll={true}
                        />
                      </div>
                    </Col>
                  )}
                  {frameworkOptions && frameworkOptions.length > 2 && (
                    <Col md={4}>
                      <div className="">
                        <MultiSelect
                          options={frameworkOptions}
                          selectedValues={framework.map(item => item.value)}
                          onChange={(selectedOptions) => handleFrameworkChange(selectedOptions)}
                          placeholder={`Select Framework`}
                          label={`Framework`}
                          icon="🔍"
                          activeTab={'abc'}
                          autoSelectAll={true}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
              </Tab>
              {/* Combined Tab */}
              {meterList && meterList.length > 1 && (
                <Tab
                  eventKey="combined"
                  style={{}}
                  tabClassName="custom-tab-esg"
                  title="Combined"
                >
                  <div
                    style={{
                      marginBottom: "1em",
                      color: "#3f88a5",
                      fontWeight: 600,
                    }}
                  >
                    Note* Can select all the options in each filter (to see
                    combined value).
                  </div>

                  <Row className="g-0">
                    <Col md={4} style={{ marginRight: "5px" }}>
                      <div className="">
                        {(frequency === "HALF_YEARLY" || frequency === "QUARTERLY" || frequency === "MONTHLY" || frequency === "YEARLY") && (
                          <MultiSelect
                            options={timePeriodOptions}
                            selectedValues={selectedPeriod.map(item => item.value)}
                            onChange={(selectedOptions) => {
                              if (selectedOptions.length > 5) {
                                alert("You can select a maximum of 5 options.");
                              } else {
                                handlePeriodChange(selectedOptions);
                              }
                            }}
                            placeholder={`Select Period`}
                            label={`Period`}
                            icon="🔍"
                            activeTab={'abc'}
                            autoSelectAll={true}
                          />
                        )}
                      </div>
                    </Col>
                    {meterList && meterList.length > 1 && (
                      <Col md={5} style={{ marginRight: "5px" }}>
                        <div className=" ">
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
                    {frameworkOptions && frameworkOptions.length > 2 && (
                      <Col md={4}>
                        <div className="">
                          <MultiSelect
                            options={frameworkOptions}
                            selectedValues={framework.map(item => item.value)}
                            onChange={(selectedOptions) => {
                              if (selectedOptions.length <= 5) {
                                handleFrameworkChange(selectedOptions);
                              }
                            }}
                            placeholder={`Select Framework`}
                            label={`Framework`}
                            icon="🔍"
                            activeTab={'abc'}
                            autoSelectAll={true}
                          />
                        </div>
                      </Col>
                    )}
                  </Row>
                </Tab>
              )}
              {/* Compare Tab */}
              <Tab
                eventKey="compare"
                style={{}}
                tabClassName="custom-tab-esg"
                title="Compare"
              >
                <div
                  style={{
                    marginBottom: "1em",
                    color: "#3f88a5",
                    fontWeight: 600,
                  }}
                >
                  Note* Can select all the options in each filter (to compare
                  value).
                </div>

                <Row className="g-0">
                  <Col md={4} style={{ marginRight: "5px" }}>
                    <div className="">
                      {(frequency === "HALF_YEARLY" || frequency === "QUARTERLY" || frequency === "MONTHLY" || frequency === "YEARLY") && (
                        <MultiSelect
                          options={timePeriodOptions}
                          selectedValues={selectedPeriod.map(item => item.value)}
                          onChange={(selectedOptions) => {
                              handlePeriodChange(selectedOptions);
                          }}
                          placeholder={`Select Period`}
                          label={`Period`}
                          icon="🔍"
                          activeTab={'abc'}
                          autoSelectAll={true}
                        />
                      )}
                    </div>
                  </Col>
                  {meterList && meterList.length > 1 && (
                    <Col md={5} style={{ marginRight: "5px" }}>
                      <div className=" ">
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
                  {frameworkOptions && frameworkOptions.length > 2 && (
                    <Col md={4}>
                      <div className="">
                        <MultiSelect
                          options={frameworkOptions}
                          selectedValues={framework.map(item => item.value)}
                          onChange={(selectedOptions) => {
                            if (selectedOptions.length <= 5) {
                              handleFrameworkChange(selectedOptions);
                            }
                          }}
                          placeholder={`Select Framework`}
                          label={`Framework`}
                          icon="🔍"
                          activeTab={'abc'}
                          autoSelectAll={true}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
              </Tab>

              {/* Individual Tab */}
              <Tab
                eventKey="individual"
                style={{}}
                tabClassName="custom-tab-esg"
                title="Individual"
              >
                <div
                  style={{
                    marginBottom: "1em",
                    color: "#3f88a5",
                    fontWeight: 600,
                  }}
                >
                  Note* Can select only one option in each filter.
                </div>

                <Row className="g-0">
                  <Col md={4} style={{ marginRight: "5px" }}>
                    <div className="">
                      {(frequency === "HALF_YEARLY" || frequency === "QUARTERLY" || frequency === "MONTHLY" || frequency === "YEARLY") && (
                        <PeriodsField
                          value={selectedPeriod?.[0]?.value || ""}
                          onChange={(selectedOptions) => {
                            handlePeriodChangeSingle(selectedOptions); // Handle selection change if valid
                          }}
                          options={timePeriodOptions || []}
                          required={true}
                          disabled={false}
                        />
                      )}
                    </div>
                  </Col>
                  {meterList && meterList.length > 1 && (
                    <Col md={5} style={{ marginRight: "5px" }}>
                      <div className=" ">
                        <LocationField
                          value={selectedLocations?.[0]?.value || ""}
                          onChange={(selectedOptions) => {
                            handleLocationChangeSingle(selectedOptions); // Handle selection change if valid
                          }}
                          options={locationOptions || []}
                          required={true}
                          disabled={false}
                        />
                      </div>
                    </Col>
                  )}
               
                </Row>
              </Tab>

              {currentTab !== 1 && (
                <Tab
                  eventKey="compareToYear"
                  style={{}}
                  tabClassName="custom-tab-esg"
                  title="Compare To Previous Year"
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <CompareTab
                      eventKey="compareToYear"
                      frequency={frequency}
                      selectedPeriod={selectedPeriod}
                      handlePeriodChange={handlePeriodChange}
                      timePeriodOptions={timePeriodOptions}
                      meterList={meterList}
                      selectedLocations={selectedLocations}
                      handleSelectionChange={handleSelectionChange}
                      locationOptions={locationOptions}
                      frameworkOptions={frameworkOptions}
                      setSelectedLocations={setSelectedLocations}
                      framework={framework}
                      handleFrameworkChange={handleFrameworkChange}
                
                      financialYear={financialYear}
                      calculateDateRange={calculateDateRange}
                      setcompareLastTimePeriods={setcompareLastTimePeriods}
                      setcompareCurrentTimePeriods={
                        setcompareCurrentTimePeriods
                      }
                      compareLastTimePeriods={compareLastTimePeriods}
                      compareTCurrentimePeriods={compareTCurrentimePeriods}
                      selectedLastYearPeriods={selectedLastYearPeriods}
                      setSelectedLastYearPeriods={setSelectedLastYearPeriods}
                      selectedCurrentYearPeriods={selectedCurrentYearPeriods}
                      setSelectedCurrentYearPeriods={
                        setSelectedCurrentYearPeriods
                      }
                    />
                  </Suspense>
                </Tab>
              )}
            </Tabs>
          ) : (
            <>
              <Row className="g-0">
                <Col md={4} style={{ marginRight: "5px" }}>
                  <div className="">
                    {(frequency === "HALF_YEARLY" || frequency === "QUARTERLY" || frequency === "MONTHLY" || frequency === "YEARLY") && (
                      <MultiSelect
                        options={timePeriodOptions}
                        selectedValues={selectedPeriod.map(item => item.value)}
                        onChange={(selectedOptions) => handlePeriodChange(selectedOptions)}
                        placeholder={`Select Period`}
                        label={`Period`}
                        icon="🔍"
                        activeTab={'abc'}
                        autoSelectAll={true}
                      />
                    )}
                  </div>
                </Col>
                {meterList && meterList.length > 1 && (
                  <Col md={4} style={{ marginRight: "5px" }}>
                    <div className=" ">
                      <MultiSelect
                        options={locationOptions}
                        selectedValues={selectedLocations.map(item => item.value)}
                        onChange={(selectedOptions) => handleSelectionChange(selectedOptions)}
                        placeholder={`Select Location`}
                        label={`Location`}
                        icon="🔍"
                        activeTab={'abc'}
                        autoSelectAll={true}
                      />
                    </div>
                  </Col>
                )}
                {frameworkOptions && frameworkOptions.length > 2 && (
                  <Col md={4}>
                    <div className="">
                      <MultiSelect
                        options={frameworkOptions}
                        selectedValues={framework.map(item => item.value)}
                        onChange={(selectedOptions) => handleFrameworkChange(selectedOptions)}
                        placeholder={`Select Framework`}
                        label={`Framework`}
                        icon="🔍"
                        activeTab={'abc'}
                        autoSelectAll={true}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button>
            SAVE
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Esgdownload;
