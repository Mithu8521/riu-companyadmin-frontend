import React, { useState, useEffect, useRef } from "react";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import BioMedicalTable from "./BioMedicalTable";
import WaterTable from "./WaterTable";
import MultiSelect from "../../Component/CommonComponent/MultiSelect";

const DateShow = () => {
  const [sourceLabels, setUserLabels] = useState({});
  const [sourceIds, setSourceIds] = useState([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState([]); // Changed to array for multiselect
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [months, setMonths] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const hasFramework48 = currentUser?.frameworkData?.some(
    (item) => item.id === 48
  );

  const [activeTab, setActiveTab] = useState(
    hasFramework48 ? "bioMedical" : "water"
  );

  const [biomedicalData, setBiomedicalData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  

  // Generate months array based on financial year data
  const generateMonthsFromFinancialYear = (financialYearData) => {
    if (!financialYearData || !financialYearData.financial_year_value) {
      return [];
    }

    const yearMatch =
      financialYearData.financial_year_value.match(/(\d{4})-(\d{4})/);
    if (!yearMatch) {
      return [];
    }

    const startYear = parseInt(yearMatch[1]);
    const endYear = parseInt(yearMatch[2]);

    const monthsArray = [];

    for (let month = 4; month <= 12; month++) {
      const monthName = new Date(startYear, month - 1, 1).toLocaleString(
        "default",
        { month: "short" }
      );
      monthsArray.push({
        month: month,
        year: startYear,
        name: monthName,
        value: `${startYear}-${month.toString().padStart(2, "0")}`,
        fullName: `${monthName} ${startYear}`,
      });
    }

    for (let month = 1; month <= 3; month++) {
      const monthName = new Date(endYear, month - 1, 1).toLocaleString(
        "default",
        { month: "short" }
      );
      monthsArray.push({
        month: month,
        year: endYear,
        name: monthName,
        value: `${endYear}-${month.toString().padStart(2, "0")}`,
        fullName: `${monthName} ${endYear}`,
      });
    }

    return monthsArray;
  };

  const getLocationData = () => {
    const normalizeId = (id) => {
      // If id is a composite key (contains hyphen), keep it as string
      if (typeof id === 'string' && id.includes('-')) {
        return id;
      }
      // Otherwise, convert to number for proper matching with backend data
      return typeof id === 'string' ? parseInt(id) : id;
    };

    if (selectedSourceIds.length === 0 || selectedSourceIds.length === sourceIds.length) {
      // If no selection or all selected, return all locations
      return sourceIds.map((id) => ({
        id: normalizeId(id),
        name: sourceLabels[id] || `Location ${id}`,
      }));
    } else {
      // Return only selected locations
      return selectedSourceIds.map((id) => ({
        id: normalizeId(id), // Convert back to proper type for backend matching
        name: sourceLabels[id] || `Location ${id}`,
      }));
    }
  };

  // 🔹 Common helper to find source/sub-location data (NO DUPLICATION)
const findSourceData = (sourceId, dataArray, month) => {
  // Case 1: Sublocation (composite id like "20-1")
  if (typeof sourceId === "string" && sourceId.includes("-")) {
    const [mainId, subId] = sourceId.split("-").map(Number);

    return dataArray.find(
      (item) =>
        item.sourceId === mainId &&
        item.subLocationId === subId &&
        item.fromDate == month
    );
  }

  // Case 2: Main location
  const numericId = Number(sourceId);

  return dataArray.find(
    (item) =>
      item.sourceId === numericId &&
      item.subLocationId === null &&
      item.fromDate == month
  );
};



  // Prepare location options for MultiSelect component
  const getLocationOptions = () => {
    const options = sourceIds.map((id) => ({
      value: id.toString(),
      label: sourceLabels[id] || `Location ${id}`,
      count: 1, // You can modify this if you have actual counts
    }));
    return options;
  };

  // API functions
  const getBiomedicalData = async () => {
    if (!financialYearId) return;

    setLoading(true);
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getBiomedicalData`,
        {},
        {
          financialYearId,
        },
        "GET"
      );

      if (isSuccess && data?.data && Array.isArray(data.data)) {
        setBiomedicalData(data.data);
      } else {
        setBiomedicalData([]);
      }
    } catch (error) {
      console.error("Error fetching biomedical data:", error);
      setBiomedicalData([]);
    } finally {
      setLoading(false);
    }
  };

  const getWaterData = async () => {
    if (!financialYearId) return;

    setLoading(true);
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getWaterData`,
        {},
        {
          financialYearId,
        },
        "GET"
      );

      if (isSuccess && data?.data && Array.isArray(data.data)) {
        setWaterData(data.data);
      } else {
        setWaterData([]);
      }
    } catch (error) {
      console.error("Error fetching water data:", error);
      setWaterData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocations = async () => {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
          {},
          {},
          "GET"
        );

        if (isSuccess && data?.data && Array.isArray(data.data)) {
          const labels = {};
          const ids = [];

          // Single loop to build both labels and IDs
          data.data.forEach((item) => {
            if (item.id) {
              // Build main location label
              const { area, city, state, country, zipCode } =
                item?.location || {};

              const tmplocationParts = [
                area,
                city,
                state,
                country,
                zipCode,
              ].filter(Boolean);
              const tmplocation = tmplocationParts.length
                ? tmplocationParts.join(", ")
                : null;

              labels[item.id] =
                item.unitCode || tmplocation || `Location ${item.id}`;

              // Add main location ID (convert to string for consistency with composite keys)
              ids.push(item.id.toString());

              // Process sublocations if they exist
              if (
                item.subLocation &&
                Array.isArray(item.subLocation) &&
                item.subLocation.length > 0
              ) {
                item.subLocation.forEach((location) => {
                  if (location.id && location.subLocation) {
                    const key = `${item.id}-${location.id}`;
                    // Add sublocation label
                    labels[key] = `${
                      item.unitCode || item.name || "Location"
                    } - ${location.subLocation}`;
                    // Add sublocation ID
                    ids.push(key);
                  }
                });
              }
            }
          });

          setUserLabels(labels);
          setSourceIds(ids);
        }
      } catch (error) {
        console.error("Error fetching source labels:", error);
      }
    };

    getLocations();
    loadFinancialYears();
  }, []);

  // Load data when filters change
  useEffect(() => {
    // Only fetch data if we have both financialYearId AND sourceIds loaded
    if (financialYearId && sourceIds.length > 0) {
      if (activeTab === "bioMedical") {
        getBiomedicalData();
      } else if (activeTab === "water") {
        getWaterData();
      }
    }
  }, [financialYearId, activeTab, sourceIds]);

  const loadFinancialYears = async () => {
    try {
      const storedData = localStorage.getItem("financialYearData");
      let financialYearData = null;

      if (storedData && isMounted.current) {
        try {
          financialYearData = JSON.parse(storedData);
        } catch (parseError) {
          console.error(
            "Error parsing stored financial year data:",
            parseError
          );
          localStorage.removeItem("financialYearData");
        }
      }

      if (financialYearData) {
        setFinancialYear(financialYearData);

        if (Array.isArray(financialYearData) && financialYearData.length > 0) {
          const latestYear = financialYearData[financialYearData.length - 1];
          if (latestYear && latestYear.id) {
            setFinancialYearId(latestYear.id);
            updateMonthsFromFinancialYear(latestYear);
            const generatedMonths = generateMonthsFromFinancialYear(latestYear);
            if (generatedMonths.length > 0) {
              setSelectedMonth(generatedMonths[0].value);
            }
          }
        }
      } else {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {},
          "GET"
        );

        if (isSuccess && data?.data && isMounted.current) {
          localStorage.setItem("financialYearData", JSON.stringify(data.data));
          setFinancialYear(data.data);

          if (Array.isArray(data.data) && data.data.length > 0) {
            const latestYear = data.data[data.data.length - 1];
            if (latestYear && latestYear.id) {
              setFinancialYearId(latestYear.id);
              updateMonthsFromFinancialYear(latestYear);
              const generatedMonths =
                generateMonthsFromFinancialYear(latestYear);
              if (generatedMonths.length > 0) {
                setSelectedMonth(generatedMonths[0].value);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading financial years:", error);
    }
  };

  const updateMonthsFromFinancialYear = (financialYearData) => {
    const generatedMonths = generateMonthsFromFinancialYear(financialYearData);
    setMonths(generatedMonths);
    if (generatedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(generatedMonths[0].value);
    }
  };

  const handleFinancialYearChange = (event) => {
    const newFinancialYearId = event.target.value;

    if (!newFinancialYearId) {
      setFinancialYearId(null);
      setMonths([]);
      setSelectedMonth(null);
      return;
    }

    const parsedId = parseInt(newFinancialYearId);
    setFinancialYearId(parsedId);

    const selectedYear = financialYear.find((year) => year.id === parsedId);
    if (selectedYear) {
      updateMonthsFromFinancialYear(selectedYear);
      const generatedMonths = generateMonthsFromFinancialYear(selectedYear);
      if (generatedMonths.length > 0) {
        setSelectedMonth(generatedMonths[0].value);
      }
    } else {
      setMonths([]);
      setSelectedMonth(null);
    }
  };

  // Updated multiselect location handler for MultiSelect component
  const handleLocationChange = (selectedValues) => {
    setSelectedSourceIds(selectedValues);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth || null);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .filter-card {
            background: rgba(255, 255, 255, 0.95);
            
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
          }
          
          .filter-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          }
          
          .tab-button {
            position: relative;
            overflow: hidden;
          }
          
          .tab-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .tab-button:hover::before {
            left: 100%;
          }
        `}
      </style>

      <div
        className="filter-card"
        style={{
          marginBottom: "24px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: "200px", flex: "1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "700",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              📅 Financial Year
            </label>
            <select
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                width: "100%",
                fontSize: "14px",
                background: "#fff",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              value={financialYearId || ""}
              onChange={handleFinancialYearChange}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            >
              <option value="">Select Financial Year</option>
              {Array.isArray(financialYear) &&
                financialYear.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.financial_year_value ||
                      item.name ||
                      `Year ${item.id}`}
                  </option>
                ))}
            </select>
          </div>

          {sourceIds && sourceIds.length === 1 ? (
            <></>
          ) : (
            <MultiSelect
              options={getLocationOptions()}
              selectedValues={selectedSourceIds}
              onChange={handleLocationChange}
              placeholder="Select Locations..."
              label="Location"
              icon="📍"
              activeTab={activeTab}
            />
          )}

          <div style={{ minWidth: "180px", flex: "1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "700",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              🗓️ Month
            </label>
            <select
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                width: "100%",
                fontSize: "14px",
                background:
                  !financialYearId || months.length === 0 ? "#f9fafb" : "#fff",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                cursor:
                  !financialYearId || months.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
              value={selectedMonth || ""}
              onChange={handleMonthChange}
              disabled={!financialYearId || months.length === 0}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            >
              <option value="">Select Month</option>
              {months.map((monthItem) => (
                <option key={monthItem.value} value={monthItem.value}>
                  {monthItem.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {hasFramework48 && (
            <button
              style={{
                padding: "20px 32px",
                border: "none",
                background:
                  activeTab === "bioMedical"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                color: activeTab === "bioMedical" ? "#fff" : "#6b7280",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "0",
                transition: "all 0.3s ease",
                flex: "1",
              }}
              onClick={() => handleTabChange("bioMedical")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                🧬 Bio Medical Waste
              </div>
            </button>
          )}
          <button
            style={{
              padding: "20px 32px",
              border: "none",
              background:
                activeTab === "water"
                  ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                  : "transparent",
              color: activeTab === "water" ? "#fff" : "#6b7280",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "0",
              transition: "all 0.3s ease",
              flex: "1",
            }}
            onClick={() => handleTabChange("water")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              💧 Water Management
            </div>
          </button>
        </div>

        <div
          style={{
            padding: "32px",
            minHeight: "400px",
            background:
              activeTab === "bioMedical"
                ? "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)"
                : "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)",
          }}
        >
          {activeTab === "bioMedical" && hasFramework48 && (
            <BioMedicalTable
              biomedicalData={biomedicalData}
              loading={loading}
              selectedMonth={selectedMonth}
              getLocationData={getLocationData}
              sourceLabels={sourceLabels}
              findSourceData={findSourceData} 
              sourceIds={sourceIds}
              selectedSourceIds={selectedSourceIds}
              financialYear={financialYear}
              financialYearId={financialYearId}
            />
          )}

          {activeTab === "water" && (
            <WaterTable
              waterData={waterData}
              loading={loading}
              selectedMonth={selectedMonth}
              getLocationData={getLocationData}
              sourceLabels={sourceLabels}
              findSourceData={findSourceData} 
              sourceIds={sourceIds}
              selectedSourceIds={selectedSourceIds}
              financialYear={financialYear}
              financialYearId={financialYearId}
              hasFramework48={hasFramework48}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateShow;