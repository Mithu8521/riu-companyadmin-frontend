import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { sweetAlert } from "../../../utils/UniversalFunction";
import Swal from "sweetalert2";
import { getStartingMonth } from "../../../utils/PeriodCalculationUtils";
import { LocationField } from "../../CarbonFootPrinting/common/FormComponents";


const questionData = {
  289: "Total Diesel consumed within the operational boundary of the company* (in Liters)",
  292: "Total LPG consumed within the operational boundary of the company*  (in Kgs)",
  293: "Total Petrol consumed within the operational boundary of the company*  (in Liters)",
  295: "Total PNG consumed within the operational boundary of the company*  (in SCM)",
  391: "Total Groundwater consumption* ( in KL)",
  603: "Total Groundwater Bill* (in Rs.)",
  392: "Total Water Bill (in Rs.)",
  393: "Total wastewater generated* ( in KLD)",
  394: "Total Wastewater treated(STP/ETP)* ( in KL)",
  395: "Total treated water reused(Flushing/CT etc.)* (in KL)",
  396: "Water recycling/reuse percentage* ",
  399: "Total cost for STP treatment*(in Rs.)",
  400: "Total non-hazardous solid waste generation (black category general waste)* (Kg)",
  401: "Total non-hazardous waste sent to landfil(construction waste/other waste to landfill)* (Kg)",
  402: "Total packaging waste (Non-Plastic-Cardboard waste) generated* (Kg)",
  404: "Total packaging waste (Plastic) generated* (Kg)",
  408: "Total food waste generated/Kitchen Waste* (Kgs)",
  409: "Total biomedical waste generated* (Kg)",
  410: "Total biomedical waste disposal Bill* (in Rs.)",
  412: "Total e-waste generated* (Kg)",
  417: "Total Petrol cost* (in Rs.)",
  418: "Total Diesel cost* (in Rs.)",
  419: "Total PNG cost* (in Rs.)",
  426: "Total electricity consumption (Captive Power Plant - Natural Gas)*  (in KWh)",
  597: "Total electricity (Captive Power Plant - Natural Gas) Bill*  (in Rs.)",
  428: "Total Electricity consumption through DG*  (in KWh)",
  429: "Total electricity consumption from Renewable energy (via PPA)*  (in KWh)",
  598: "Total electricity from Renewable energy (via PPA) Bill*  (in Rs.)",
  430: "Total electricity consumption from Renewable energy (rooftop solar)*  (in KWh)",
  431: "Total Electricity Bill *(in Rs.)",
  432: "Current employees by Gender (in %) Male",
  433: "Current employees by Gender (in %) Female",
  434: "Employees less than 30 years of age (%)",
  435: "Employees between 30-50 years of age (%)",
  436: "Employees more than 50 years of age (%)",
  437: "Manpower turnover rate(FTE atrition rate) in %",
  438: "Average training hours per employee (in Hours)",
  439: "Number of Mock Drills ",
  440: "Fire Safety Audits",
  441: "Number of Safety Trainings",
  442: "Number of Safety Committee Meetings",
  443: "Fatalities (Number of cases)",
  444: "High-consequence injuries (Number of cases)",
  445: "Recordable injuries (Number of cases)",
  446: "Recordable work-related ill health cases (Number of cases)",
  447: "Number of Environmental Incidents",
  450: "Total LPG cost* (in Rs.)",
  468: "Total electricity consumption (GRID electricity)* (in KWh)",
  596: "Total GRID electricity Bill* (in Rs.)",
  469: "Total Tanker Water Consumption* (in KL)",
  594: "Total Tanker Water Bill* (in Rs.)",
  // 470: "Total water consumption limit as per Consent to Operate*( in KLD)",
  471: "Total groundwater consumption limit as per CGWA NOC* ( in KLD)",
  472: "Number of deviations reported in terms of water consumption with respect to CTO limit* ",
  473: "Number of deviations reported in terms of water consumption with respect to CGWA limit* ",
  474: "Total surface water consumption (this includes municipal supply water)* ( in KL)",
  595: "Total Surface Water Bill (this includes municipal supply water)* ( in Rs.)",
  475: "Zero Liquid Discharge (ZLD)*(Yes/No)",
  485: "How many deviations observed in ambient air quality report appeared* ",
  486: "Total number of significant deviations reported in the environmental monitoring reports with respect to applicable regulatory standard or permits* ",
  487: "Number of deviations observed in ambient air quality report* ",
  488: "Number of deviations observed in ambient noise level report* ",
  489: "Number of deviations  observed in air emissions reports (stacks) appeared*",
  490: "Number of deviations observed in air emissions reports (Diesel Generator)* ",
  491: "Number of deviations observed in drinking water quality report* ",
  492: "Number of deviations observed in treated wastewater quality report* ",
  493: "Number of deviations observed in groundwater quality report for waste sector*",
  494: "Number of deviations observed in soil quality report for waste sector",
  501: "Number of  New hires by Gender Male",
  502: "Number of New hires by Gender Female ",
  503: "Number of New hires by age groups (30-50) ",
  504: "Number of New hires by age groups (>50)",
  507: "Testing and Certification of Lift(No. of lifts/No. of tests)",
  512: "Total Nitrous Oxide (N₂O) consumed within the operational boundary of the company*  (in Liters)",
  513: "Total Carbon Dioxide (CO₂) consumed within the operational boundary of the company*  (in Kgs)",
  514: "Total Entonox consumed within the operational boundary of the company*  (in Kgs)",
  515: "Total Desflurane consumed within the operational boundary of the company*  (in ml)",
  516: "Total Isoflurane consumed within the operational boundary of the company*  (in ml)",
  517: "Total Sevoflurane consumed within the operational boundary of the company*  (in ml)",
  518: "Total R-134A consumed within the operational boundary of the company*  (in Kgs)",
  519: "Total R-22 consumed within the operational boundary of the company*  (in Kgs)",
  520: "Total R-407C consumed within the operational boundary of the company*  (in Kgs)",
  521: "Total R-32 consumed within the operational boundary of the company*  (in Kgs)",
  522: "Total R-410A consumed within the operational boundary of the company*  (in Kgs)",
  523: "Total Sevitrue consumed within the operational boundary of the company*  (in ml)",
  524: "Total Suprane consumed within the operational boundary of the company*  (in ml)",
  526: "Total Sevorane consumed within the operational boundary of the company*  (in ml)",
  527: "Total Water consumption (Ground water+municipal supply water+tanker water)*( in KL)",
  528: "Total Electrical Consumption(Total of all above sources of Electricity Consumed)*  in KWh",
  531: "Number of New hires by age groups (<30) ",
  545: "Total packaging waste (Non-Plastic-Paper waste) generated* (Kg)",
  546: "Total iron waste generated * (Kg)",
  547: "Total Aluminum waste generated * (Kg)",
  548: "Total Copper waste generated * (Kg)",
  549: "Total food waste converted to manure through organic waste converter (OWC)* (Kgs)",
  550: "Total waste oil generated (cooking oil/Lubricationg oil) in Ltrs",
  551: "Total spent formalin solution disposed in Ltrs",
  552: "Total number of employees (FTE)",
  448: "Number of IP days",
  582: "% of occupancy",
  583: "Total approved beds",
  584: "Total operating beds",
  585: "Total built up area (sq.ft)",
  586: "Total number of contract employees",
  587: "Total number of outsource employees",
  589: "Total CO2 extinguishers used within the operational boundary of the company*  (in Kgs)"
};

const ExcelUploader = ({ 
  financialYearId, 
  financialYear, 
  dueDateOverrides,
  reportingQuestionsMap
}) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [months, setMonths] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const multiselectRef = useRef();
  const [loading, setLoading] = useState(false);
  const [periodLockData, setPeriodLockData] = useState([]);
  const [scheduledDateData, setScheduledDateData] = useState([]);

  const fetchData = async (financialYearId) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}periods/locked`,
        {},
        { financialYearId },
        "GET"
      );
      if (isSuccess) {
        setPeriodLockData(data?.data)
      } else {
        setPeriodLockData([]);
      }
    } catch (error) {
      setPeriodLockData([]);
    }
  };

  const getReportingAnswer = async (financialYearId, questionId, locationId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getReportingAnswer`,
      {},
      { financialYearId, questionId },
      "GET"
    );
    if (isSuccess) {
      return data?.answers.filter(ans => {
        return locationId === (ans.subLocationId ? `${ans.sourceId}-${ans.subLocationId}` : `${ans.sourceId}`);
      });
    }

    return [];
  };

  const generateTemplate = () => {
    const filePath = "/Standard_Manipal_Template.xlsx";
    const fileName = "Standard_Manipal_Template";

    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });
  };

  useEffect(() => {
    if (financialYearId)
      fetchData(financialYearId)
    loadScheduledNotifications(financialYearId)
  }, [financialYearId]);

  const getLocations = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
        {},
        {},
        "GET"
      );

      if (isSuccess && data?.data) {
        const locationOptions = [];

        data.data.forEach((item) => {
          const subLocations = item.subLocation || [];

          if (subLocations.length > 0) {
            subLocations.forEach((sub) => {
              locationOptions.push({
                id: `${item.id}-${sub.id}`,
                name: `${item.unitCode}-${sub.subLocation}`,
                subLocations: [],
              });
            });
          } else {
            locationOptions.push({
              id: `${item.id}`,
              name: item.unitCode,
              subLocations: [],
            });
          }
        });

        setLocations(locationOptions);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const excelSerialToDate = (serial) => {
    if (typeof serial !== "number") return serial;
    const excelEpoch = new Date(1899, 11, 30);
    const parsedDate = new Date(excelEpoch.getTime() + serial * 86400000);
    return parsedDate.toLocaleDateString("en-US", {
      month: "2-digit",
      year: "numeric",
    });
  };

  const loadScheduledNotifications = async (financialYearId) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}scheduledNotifications`,
        {},
        {
          financialYearId: financialYearId,
          questionType: 'custom'
        },
        "GET"
      );
      if (isSuccess && data) {
        setScheduledDateData(data.data)
      }
    } catch (error) {
      console.error("Error loading scheduled notifications:", error);
    } finally {
    }
  };

  const getMinDueDateForAllQuestions = (setDueDate, sourceId, fromDate, toDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let standardDueDate = setDueDate ? new Date(setDueDate) : null;
    if (!standardDueDate) return null;

    standardDueDate.setHours(0, 0, 0, 0);

    // ✅ If standard due date is still valid, no need to check overrides
    if (standardDueDate >= today) {
      return standardDueDate;
    }

    // ✅ Skip if required parameters missing
    if (!sourceId || !fromDate || !toDate) {
      return standardDueDate;
    }

    let minOverridenDueDate = null;

    for (const questionId of Object.keys(questionData)) {
      const overrideKey = `${financialYearId}-${sourceId}-${fromDate}-${toDate}-${questionId}`;
      const overrideRequest = dueDateOverrides[overrideKey];
      if (
        overrideRequest &&
        overrideRequest.status?.toUpperCase() === "APPROVED" &&
        overrideRequest.dueDateTime
      ) {
        const dueDate = new Date(overrideRequest.dueDateTime);
        dueDate.setHours(0, 0, 0, 0);
        if (!minOverridenDueDate || dueDate < minOverridenDueDate) {
          minOverridenDueDate = dueDate;
        }
      } else {
        // ❌ Missing or invalid override → cancel the entire override logic
        return standardDueDate;
      }
    }

    // ✅ Only return overridden date if *all* questions had valid approved overrides
    return minOverridenDueDate;
  };


  useEffect(() => {
    const generateMonths = () => {
      const startMonth = getStartingMonth() - 1;
      if (financialYearId) {
        const financialYearValue = financialYear.find(p => p.id === financialYearId).financial_year_value;
        const startYear = financialYearValue.substring(0, 4);
        const monthsArray = [];
        for (let i = 0; i < 12; i++) {
          const date = new Date(startYear, startMonth + i, 1);
          const formattedMonth = date
            .toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })
            .replace(",", "");
          const abbreviatedMonth = date.toLocaleDateString("en-US", {
            month: "short",
          });

          const formatDateKey = (date) => {
            const [year, month] = date.split("-");
            return `${month}/${year}`;
          };

          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const userId = currentUser?.id;
          if (currentUser?.is_head == 1) {
            monthsArray.push({
              name: formattedMonth,
              displayName: abbreviatedMonth,
            });
            continue;
          }

          const crossDate = scheduledDateData.find(
            (p) => formatDateKey(p.periodRecord.fromDate) === formattedMonth
          );
          const period = periodLockData.find(
            (p) => formatDateKey(p.fromDate) === formattedMonth
          );

          let isLocked = false;

          // Check 1: Period Lock
          if (period) {
            // If user not in allowedUsers, it's locked for them
            if (!period?.allowedUsers?.includes(userId)) {
              isLocked = true;
            }
          }

          // Check 2: Due Date Expired Lock
          if (crossDate) {
            const fixedDate = getMinDueDateForAllQuestions(crossDate?.fixedDate, selectedLocation, crossDate?.periodRecord?.fromDate, crossDate?.periodRecord?.toDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (fixedDate && fixedDate <= today) {
              isLocked = true;
            }
          }

          // Add month only if not locked
          if (!isLocked) {
            monthsArray.push({
              name: formattedMonth,
              displayName: abbreviatedMonth,
            });
          }
        }
        setMonths(monthsArray);
      }
    };
    getLocations();
    if (selectedLocation) {
      generateMonths();
    }
  }, [financialYearId, periodLockData, scheduledDateData, selectedLocation]);

  // Add the handleSave function
  const handleSave = async () => {
    // Validation
    if (!selectedLocation) {
      sweetAlert("error", "Please select a location");
      return;
    }

    if (selectedMonths.length === 0) {
      sweetAlert("error", "Please select at least one month");
      return;
    }

    if (!selectedFile) {
      sweetAlert("error", "Please upload an Excel file");
      return;
    }

    // Trigger the file processing
    await processSelectedFile();
  };


  const processSelectedFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length === 0) {
          sweetAlert("error", "Excel file is empty");
          setLoading(false);
          return;
        }

        let headers = jsonData[2] || [];
        headers = headers.map((col) => excelSerialToDate(col));

        const selectedMonthNames = selectedMonths.map((m) => m.name);

        let extractedData = [];
        for (let i = 3; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[1]) continue;

          let kpiData = {
            question: row[1],
            data: {},
          };
          for (let j = 3; j < headers.length; j++) {
            if (headers[j] && selectedMonthNames.includes(headers[j])) {
              kpiData.data[headers[j]] = row[j];
            }
          }

          extractedData.push(kpiData);
        }

        await generatePayload(extractedData, selectedMonthNames, questionData);
      } catch (error) {
        console.error("Error processing file:", error);
        sweetAlert("error", "Error processing Excel file");
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      sweetAlert("error", "Please select a valid Excel file (.xlsx or .xls)");
      event.target.value = '';
      return;
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      sweetAlert("error", "File size must be less than 10MB");
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const safeYesNo = (value) => {
    if (value === null || value === undefined) return value;
    
    let v = String(value).trim();
    
    // 3. "NA"
    if (v.toLowerCase() === "na") return "NA";

    // 4. Yes / No normalization
    const lower = v.toLowerCase();
    if (["yes", "y"].includes(lower)) return "Yes";
    if (["no", "n"].includes(lower)) return "No";

    throw new Error(`Invalid value '${value}'.<br><br>Value must be a 'NA', 'Yes', 'No', 'Y' or 'N'.`);
  }

  const safeString = (value) => {
    if (value === null || value === undefined) return value;
    
    let v = String(value).trim();
    
    // 3. "NA"
    if (v.toLowerCase() === "na") return "NA";

    return v;
  }

  const safeFixed = (value, multiplier = 1, decimals = 2) => {
    if (value === null || value === undefined) return value;

    let v = String(value).trim();

    // 1. Remove trailing %
    if (v.endsWith("%")) {
      v = v.slice(0, -1).trim();
    }

    // 2. Remove commas
    v = v.replace(/,/g, "");

    // 3. "NA"
    if (v.toLowerCase() === "na") return "NA";

    // 5. Numeric check
    const num = Number(v);
    if (isNaN(num)) {
      throw new Error(`Invalid value '${value}'.<br><br>Value must be a valid 'Number' or  'NA'.`);
    }

    const finalValue = num * multiplier;

    // 6. If number is an integer → return without decimals
    if (Number.isInteger(finalValue)) {
      return String(finalValue);
    }

    // Else keep decimals
    return finalValue.toFixed(decimals);
  };

  const getDataByQuestionAndMonth = (question, month, dataArray, defaultValue) => {
    const entry = dataArray.find((item) => item.question === question);
    if (entry) {
      if (!entry?.data?.[month]) return safeFixed(defaultValue);
      return safeFixed(entry.data[month]);
    }

    throw new Error('Invalid question: ${question}');
  };

  const generatePayload = async (
    extractedData,
    selectedMonthNames,
    questionData
  ) => {
    if (!selectedLocation) {
      console.warn("No location selected.");
      return;
    }

    try {
      for (const item of extractedData) {
        const questionId = Object.keys(questionData).find((key) =>
          questionData[key]
            .toLowerCase()
            .replace(/\s+/g, "") === item.question.toLowerCase().replace(/\s+/g, "")
        );

        const reportingQuestion = reportingQuestionsMap?.[questionId];
        if (!questionId || !reportingQuestion) {
          console.warn(`No questionId found for: ${item.question}`);
          continue;
        }

        // Skip Water Bill and Electricity Bill Post FY 2024-2025
        if ([392, 431].includes(Number(questionId)) && financialYearId !== 30) {
          console.info("Total Water Bill and Total Electricity Bill must be auto calculated, skipping...");
          continue;
        }

        // Skip Water Bill Breakdown and Electricity Bill Breakdown for FY 2024-2025
        if ([594, 595, 596, 597, 598, 603].includes(Number(questionId)) && financialYearId === 30) {
          console.info("Skipping Water Bill Breakdown and Electricity Bill Breakdown for FY 2024-2025");
          continue;
        }

        let existingAnswers = [];
        if (Number(questionId) === 409) {
          existingAnswers = await getReportingAnswer(financialYearId, Number(questionId), selectedLocation);
        }

        for (const month of selectedMonthNames) {
          // Extract year and month from "MM/YYYY"
          const [mm, yyyy] = month.split("/").map(Number);
          const fromDate = `${yyyy}-${String(mm).padStart(2, "0")}`;

          // Calculate next month for toDate
          let nextMonth = mm + 1;
          let nextYear = yyyy;
          if (nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
          }
          const toDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;

          if (item.data[month] !== undefined || Number(questionId) === 409) {
            let answer = [[""]]; // Default answer
            let readingValue;
            if (Number(questionId) === 409) {
              let existingAnswer;
              try {
                existingAnswer = existingAnswers.find(ans => ans.fromDate === fromDate && ans.toDate === toDate);
                existingAnswer = JSON.parse(existingAnswer?.answer);
                existingAnswer = [existingAnswer[0].map(val => isNaN(Number(val)) ? null : Number(val))];
              } catch (err) {
                console.warn('Error parsing answer', existingAnswers);
              }
              answer = [[
                getDataByQuestionAndMonth("Yellow in (Kg)", month, extractedData, existingAnswer?.[0]?.[0]),
                getDataByQuestionAndMonth("Red (Kg)", month, extractedData, existingAnswer?.[0]?.[1]),
                getDataByQuestionAndMonth("White (Kg)", month, extractedData, existingAnswer?.[0]?.[2]),
                getDataByQuestionAndMonth("Blue (Kg)", month, extractedData, existingAnswer?.[0]?.[3]),
                getDataByQuestionAndMonth("Cytotoxic (kgs)", month, extractedData, existingAnswer?.[0]?.[4]),
              ]];
              if (!existingAnswer && answer[0].every(ans => ans == null)) {
                console.log('No answer for biomedical waste for month', month, ', skipping...');
                continue;
              }
            } else if (reportingQuestion.questionType === 'quantitative_trends') {
              readingValue = safeFixed(item?.data[month]);
            } else if (reportingQuestion.questionType === 'yes_no'){
              readingValue = safeYesNo(item?.data[month]);
            } else {
              readingValue = safeString(item?.data[month]);
            }

            // Parse selectedLocation into sourceId and subLocationId
            let sourceId = null;
            let subLocationId = null;

            if (selectedLocation && selectedLocation.includes("-")) {
              const [source, sub] = selectedLocation.split("-").map(Number);
              sourceId = source;
              subLocationId = sub;
            } else {
              sourceId = Number(selectedLocation);
              subLocationId = null;
            }

            let payload = {
              questionId: Number(questionId),
              moduleId: reportingQuestion.moduleId,
              questionType: reportingQuestion.questionType,
              questionTitle: item.question,
              fromDate: fromDate,
              toDate: toDate,
              frequency: reportingQuestion.frequency,
              readingValue,
              unit: reportingQuestion.questionType === 'quantitative_trends' ? reportingQuestion?.['details']?.[0]?.['option'] ?? 'Number' : '',
              sourceId: sourceId,
              subLocationId: subLocationId,
              notApplicable: readingValue === "NA",
              financialYearId: financialYearId,
              current_role: "company",
              note: [[""]],
              proofDocument: [[]],
              comment: [[]],
              answer: reportingQuestion.questionType === 'tabular_question'
                ? JSON.stringify(answer)
                : reportingQuestion.questionType === 'yes_no'
                  ? JSON.stringify({
                    answer: readingValue,
                  })
                  : reportingQuestion.questionType === 'quantitative_trends'
                    ? JSON.stringify({
                      questionId: Number(questionId),
                      moduleId: reportingQuestion.moduleId,
                      questionType: reportingQuestion.questionType,
                      questionTitle: item.question,
                      fromDate: fromDate,
                      toDate: toDate,
                      frequency: reportingQuestion.frequency,
                      readingValue: readingValue,
                      unit: reportingQuestion?.['details']?.[0]?.['option'] ?? 'Number',
                    })
                    : readingValue,
            };

            await handleSubmit(payload);
          }
        }
      }

      // Reset form after successful upload
      setSelectedLocation("");
      setSelectedMonths([]);
      setSelectedFile(null);
      setModalOpen(false);
      sweetAlert("success", "Your Data successfully Uploaded");

    } catch (error) {
      console.error("Error in generatePayload:", error);
      Swal.fire({
        title: "Error uploading data",
        html: error?.message || String(error),
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,   // user must click OK
        allowEscapeKey: false,      // can't close with ESC
        allowEnterKey: true,        // allow pressing Enter to click OK
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}saveAnswerReportingQuestions`,
        {},
        payload,
        "POST"
      );

      if (isSuccess) {
        console.log("Payload submitted successfully:", payload, data);
      } else {
        console.warn("Failed to submit payload.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Button
        style={{
          backgroundColor: "#3F88A5",
          border: "none",
          borderRadius: "4px",
          height: "37px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => setModalOpen(true)}
      >
        Upload
      </Button>

      {/* Modal for Selecting Location and Uploading File */}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark fs-4">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            Select Location & Upload Data
          </Modal.Title>
        </Modal.Header>
        {/* ⚠️ Info Banner */}
        <Alert
          variant="warning"
          className="mx-4 mt-3 mb-0 py-2 d-flex align-items-center"
          style={{
            backgroundColor: "#fff3cd",
            borderColor: "#ffeeba",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
          If any month isn’t visible, check with admin that the period isn’t locked.
          If it’s unlocked, request an override.
        </Alert>
        <Modal.Body className="px-4 py-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted fs-5">Uploading your file...</p>
              <div
                className="progress mx-auto"
                style={{ width: "60%", height: "6px" }}
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  role="progressbar"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          ) : (
            <Form>
              <Alert variant="info" className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={generateTemplate}
                  >
                    Download Template
                  </Button>
                </div>
              </Alert>
              <div className="mb-4">
                <LocationField
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  options={locations.map(loc => ({value: loc.id, label: loc.name}))}
                  required={true}
                  levelName="Choose a Location"
                />
              </div>

              {/* Month Selection */}
              <div className="mb-4">
                <Form.Group controlId="monthSelect">
                  <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    Select Month(s)
                  </Form.Label>
                  <div className="position-relative">
                    <Multiselect
                      placeholder={
                        selectedLocation
                          ? "Choose months to analyze"
                          : "Select a location first"
                      }
                      displayValue="displayName"
                      options={months}
                      selectedValues={selectedMonths}
                      onRemove={setSelectedMonths}
                      onSelect={setSelectedMonths}
                      showCheckbox
                      ref={multiselectRef}
                      disable={!selectedLocation} // 👈 disables the component
                      style={{
                        chips: {
                          background: "#3F88A5",
                          borderRadius: "20px",
                          padding: "4px 12px",
                          margin: "2px",
                          fontSize: "14px",
                        },
                        searchBox: {
                          border: selectedLocation ? "2px solid #e3f2fd" : "2px solid #f8d7da",
                          background: selectedLocation ? "white" : "#f8d7da",
                          borderRadius: "12px",
                          padding: "8px 16px",
                          fontSize: "16px",
                          minHeight: "48px",
                          opacity: selectedLocation ? 1 : 0.6,
                          cursor: selectedLocation ? "text" : "not-allowed",
                        },
                        option: {
                          padding: "12px 16px",
                          fontSize: "15px",
                        },
                        optionContainer: {
                          borderRadius: "12px",
                          border: "1px solid #e0e0e0",
                          marginTop: "4px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    />
                  </div>

                  {/* 👇 Message for guidance */}
                  {!selectedLocation && (
                    <div className="text-danger mt-2 fw-medium">
                      Please select a location first to choose months.
                    </div>
                  )}
                </Form.Group>
              </div>

              {/* File Upload */}
              <div className="mb-3">
                <Form.Group controlId="fileUpload">
                  <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                    <i className="bi bi-cloud-upload me-2 text-primary"></i>
                    Upload Excel File
                  </Form.Label>
                  <div
                    className="upload-area border-2 border-dashed rounded-3 p-4 text-center position-relative"
                    style={{
                      borderColor: "#3F88A5",
                      backgroundColor: "#f8fcff",
                      transition: "all 0.3s ease",
                      minHeight: "120px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "#2196F3";
                      e.currentTarget.style.backgroundColor = "#e3f2fd";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = "#3F88A5";
                      e.currentTarget.style.backgroundColor = "#f8fcff";
                    }}
                  >
                    <i className="bi bi-file-earmark-excel text-success fs-1 mb-2"></i>
                    <p className="text-muted mb-2">
                      <strong>Drag & drop</strong> your Excel file here, or
                      <span className="text-primary ms-1">browse</span>
                    </p>
                    <small className="text-muted">
                      Supports .xlsx and .xls files
                    </small>
                    {selectedFile && (
                      <div className="mt-2">
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Selected: {selectedFile.name}
                        </small>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="position-absolute w-100 h-100 opacity-0"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </Form.Group>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <div className="w-100 d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setModalOpen(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-3 fw-semibold"
              style={{
                borderColor: "#dee2e6",
                color: "#6c757d",
                transition: "all 0.3s ease",
              }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={
                !selectedLocation || selectedMonths.length === 0 || !selectedFile || loading
              }
              className="px-4 py-2 rounded-3 fw-semibold shadow-sm"
              style={{
                backgroundColor: "#3F88A5",
                border: "none",
                transition: "all 0.3s ease",
                opacity:
                  !selectedLocation || selectedMonths.length === 0 || !selectedFile || loading
                    ? 0.6
                    : 1,
              }}
            >
              <i className="bi bi-save me-1"></i>
              Save & Upload
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExcelUploader;