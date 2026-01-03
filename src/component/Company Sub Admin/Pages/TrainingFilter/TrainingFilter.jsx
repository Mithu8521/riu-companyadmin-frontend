import React, { useState, useEffect, useRef } from "react";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import MultiSelect from "../../Component/CommonComponent/MultiSelect";
import SearchBar from "../../Component/CommonComponent/SearchBar";
import TrainingTable from "./TrainingTable";
import TraineeTable from "./TraineeTable";
import { getStartingMonth } from "../../../../utils/PeriodCalculationUtils";

const FilterSection = ({
  financialYear,
  financialYearId,
  onFinancialYearChange,
  selectedCategories,
  setSelectedCategories,
  selectedPrinciples,
  setSelectedPrinciples,
  selectedModes,
  setSelectedModes,
  selectedStatuses,
  setSelectedStatuses,
  selectedFacilitators,
  setSelectedFacilitators,
  selectedTrainers,
  setSelectedTrainers,
  dateRange,
  setDateRange,
  categoryOptions,
  principleOptions,
  modeOptions,
  statusOptions,
  facilitatorOptions,
  trainerOptions,
  onClearFilters,
  activeTab,
}) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.95)",
      
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#1f2937",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        🎯 Training Filters
      </h3>
      <button
        onClick={onClearFilters}
        style={{
          background:
            activeTab === "training"
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.2s ease",
          boxShadow:
            activeTab === "training"
              ? "0 4px 16px rgba(99, 102, 241, 0.3)"
              : " #79bdd8 0px 4px 16px",
        }}
      >
        🗑️ Clear All Filters
      </button>
    </div>

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "end",
    width: "100%",
    gap: "12px",
    minWidth: 0,   
  }}
>
  {/* Financial Year */}
  <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
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
      onChange={onFinancialYearChange}
    >
      <option value="">Select Financial Year</option>
      {Array.isArray(financialYear) &&
        financialYear.map((item) => (
          <option key={item.id} value={item.id}>
            {item.financial_year_value || item.name || `Year ${item.id}`}
          </option>
        ))}
    </select>
  </div>

  {/* Category */}
  <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
    <MultiSelect
      options={categoryOptions}
      selectedValues={selectedCategories}
      onChange={setSelectedCategories}
      placeholder="Select Categories"
      label="Category"
      icon="🏷️"
      activeTab={activeTab}
    />
  </div>

  <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
    <MultiSelect
      options={principleOptions}
      selectedValues={selectedPrinciples}
      onChange={setSelectedPrinciples}
      placeholder="Select Principles"
      label="Principle"
      icon="⚖️"
      activeTab={activeTab}
    />
  </div>

  {/* Facilitator */}
  <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
    <MultiSelect
      options={facilitatorOptions}
      selectedValues={selectedFacilitators}
      onChange={setSelectedFacilitators}
      placeholder="Select Facilitators"
      label="Facilitator"
      icon="🏢"
      activeTab={activeTab}
    />
  </div>

  {/* Trainer */}
  <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
    <MultiSelect
      options={trainerOptions}
      selectedValues={selectedTrainers}
      onChange={setSelectedTrainers}
      placeholder="Select Trainers"
      label="Trainer"
      icon="👨‍🏫"
      activeTab={activeTab}
    />
  </div>

  {/* Date Range */}
  <div style={{ flex: "1 1 400px", minWidth: "400px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "6px",
        fontWeight: "700",
        color: "#374151",
        fontSize: "14px",
      }}
    >
      
      📅 Date Range
    </label>
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        type="date"
        value={dateRange.from || ""}
        onChange={(e) => {
          const value = e.target.value;
          setDateRange((prev) => ({ ...prev, from: value }));
        }}
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          fontSize: "14px",
          flex: 1,
          minWidth: 0,
        }}
      />

      <input
        type="date"
        value={dateRange.to || ""}
        onChange={(e) => {
          const value = e.target.value;
          setDateRange((prev) => ({ ...prev, to: value }));
        }}
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          fontSize: "14px",
          flex: 1,
          minWidth: 0,
        }}
      />
    </div>
  </div>
</div>

  </div>
);

const TrainingManagement = () => {
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(null);
  const [trainingData, setTrainingData] = useState([]);
  const [traineeData, setTraineeData] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [activeTab, setActiveTab] = useState("training");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedFacilitators, setSelectedFacilitators] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Filter options
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [principleOptions, setPrincipleOptions] = useState([]);
  const [modeOptions, setModeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [facilitatorOptions, setFacilitatorOptions] = useState([]);
  const [trainerOptions, setTrainerOptions] = useState([]);

  const isMounted = useRef(true);

  // Load Financial Years
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
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading financial years:", error);
    }
  };

  const getFinancialYearRange = (fId, financialYearList) => {
    const yearId = fId ;
    const startMonthIdx = getStartingMonth() - 1;
  
    // Find matching year object
    const finYearObj = Array.isArray(financialYearList)
      ? financialYearList.find((fy) => fy.id == yearId)
      : null;
  
    if (!finYearObj?.financial_year_value) {
      console.warn("⚠️ Financial year not found for id:", yearId);
      return; // stop here, don’t set NaN dates
    }
  
    const [startY, endY] = finYearObj.financial_year_value.split("-").map(Number);
  
    if (isNaN(startY) || isNaN(endY)) {
      console.error("⚠️ Invalid financial year value:", finYearObj.financial_year_value);
      return;
    }
  
    // startMonthIdx is 0-based (0 = Jan, 11 = Dec)
    const startMonth = startMonthIdx;
    const endMonth = (startMonth + 11) % 12;
  
    const fromDate = new Date(startY, startMonth, 1);
    const toDate = new Date(endY, endMonth + 1, 0);
  
    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
  
    return {
      startDate: formatDate(fromDate),
      endDate: formatDate(toDate),
    };
  };

  // Get Training Data and Extract Trainee Data
  const getTrainingData = async (fId, status = 1) => {
    const yearId = fId || financialYearId;
    const financialYearDatas = await getFinancialYearRange(yearId, financialYear);
    if (!yearId) return;

    setLoading(true);
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAllTrainingDataForFilter`,
        {},
        { financialYearId: yearId, status,financialYearStartDate: financialYearDatas?.startDate, financialYearEndDate: financialYearDatas?.endDate },
        "GET"
      );

      if (isSuccess && data?.data) {
        const tmpData = data.data.length ? data.data.reverse() : [];
        setTrainingData(tmpData);

        // Format training data
        const formattedTrainingData = tmpData.map((item) => ({
          item,
          id: item.id,
          fromDate: new Date(item.fromDate).toLocaleDateString(),
          toDate: new Date(item.toDate).toLocaleDateString(),
          fromTime: item.fromTime,
          toTime: item.toTime,
          trainer: item?.trainers,
          title: item.trainingTitle,
          mode: item.modeOfTraining,
          mappingUser: item.userId,
          description: item.description,
          trainingFacilitator: item.trainingFacilitator,
          status: item.status || "Active",
          totalParticipants: item.totalParticipants || 0,
          completedParticipants: item.completedParticipants || 0,
          rawFromDate: item.fromDate,
          rawToDate: item.toDate,
          categories: item.categories,
          acceptedUsers: item.acceptedUsers,
          attendantUsers: item.attendantUsers,
          counts: item.counts,
          trainers: item.trainers,
        }));
        setFilteredTrainings(formattedTrainingData);

        // Extract trainee data from attendantUsers
        const traineeMap = new Map();

        tmpData.forEach((training) => {
          if (
            training.attendantUsers &&
            Array.isArray(training.attendantUsers)
          ) {
            training.attendantUsers.forEach((user) => {
              const traineeKey = user.id || user.employeeId;

              if (!traineeMap.has(traineeKey)) {
                traineeMap.set(traineeKey, {
                  id: user.id,
                  employeeName: `${user.first_name || ""} ${
                    user.last_name || ""
                    }`.trim(),
                  email: user.email || "N/A",
                  employeeId: user.employeeId,
                  companyName: user.register_company_name,
                  categoryId: user.categoryId,
                  gender: user.gender || "N/A",
                  departmentId: user.departmentId || "N/A",
                  trainings: [],
                  categories: [],
                  topics: [],
                  principles: [],
                  facilitators: [],
                  trainersWorkedWith: [],
                  trainingDates: [],
                });
              }

              const trainee = traineeMap.get(traineeKey);

              // Add training
              if (
                training.trainingTitle &&
                !trainee.trainings.includes(training.trainingTitle)
              ) {
                trainee.trainings.push(training.trainingTitle);
              }

              if (training.categories && Array.isArray(training.categories)) {
                training.categories.forEach((category) => {
                  if (category?.title && !trainee.categories.includes(category.title)) {
                    trainee.categories.push(category.title);
                  }
                });
              }

              // Add facilitator
              if (
                training.trainingFacilitator &&
                !trainee.facilitators.includes(training.trainingFacilitator)
              ) {
                trainee.facilitators.push(training.trainingFacilitator);
              }

              // Add trainers
              if (training.trainers && Array.isArray(training.trainers)) {
                training.trainers.forEach((trainer) => {
                  if (
                    trainer.name &&
                    !trainee.trainersWorkedWith.includes(trainer.name)
                  ) {
                    trainee.trainersWorkedWith.push(trainer.name);
                  }
                });
              }

              // Add training dates
              if (
                training.fromDate &&
                !trainee.trainingDates.includes(training.fromDate)
              ) {
                trainee.trainingDates.push(training.fromDate);
              }

              // Add topics
              if (training.topics && Array.isArray(training.topics)) {
                training.topics.forEach((topic) => {
                  if (topic.topic && !trainee.topics.includes(topic.topic)) {
                    trainee.topics.push(topic.topic);
                  }
                });
              }

              // Add principles
              if (training.principles && Array.isArray(training.principles)) {
                training.principles.forEach((principle) => {
                  if (
                    principle.title &&
                    !trainee.principles.includes(principle.title)
                  ) {
                    trainee.principles.push(principle.title);
                  }
                });
              }
            });
          }
        });

        const traineeArray = Array.from(traineeMap.values());
        setTraineeData(traineeArray);
        setFilteredTrainees(traineeArray);

        // Extract filter options
        extractFilterOptions(tmpData, traineeArray);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract Filter Options
  const extractFilterOptions = (trainings, trainees) => {
    // Extract unique categories with counts
    const categoryCount = {};
    trainings.forEach((t) => {
      (t.categories || []).forEach(c => {
        if (c?.title) {
          categoryCount[c.title] =
            (categoryCount[c.title] || 0) + 1;
        }
      });
    });
    const categories = Object.keys(categoryCount);
    setCategoryOptions(
      categories.map((cat) => ({
        value: cat,
        label: cat,
        count: categoryCount[cat],
      }))
    );

    // Extract unique principles with counts
    const principleCount = {};
    trainings.forEach((t) => {
      (t.principles || []).forEach(p => {
        if (p?.title) {
          principleCount[p.title] =
            (principleCount[p.title] || 0) + 1;
        }
      });
    });
    const principles = Object.keys(principleCount);
    setPrincipleOptions(
      principles.map((p) => ({
        value: p,
        label: p,
        count: principleCount[p],
      }))
    );

    // Extract unique modes with counts
    const modeCount = {};
    trainings.forEach((t) => {
      if (t.modeOfTraining) {
        modeCount[t.modeOfTraining] = (modeCount[t.modeOfTraining] || 0) + 1;
      }
    });
    const modes = Object.keys(modeCount);
    setModeOptions(
      modes.map((mode) => ({
        value: mode,
        label: mode,
        count: modeCount[mode],
      }))
    );

    // Extract unique facilitators with counts
    const facilitatorCount = {};
    trainings.forEach((t) => {
      if (t.trainingFacilitator) {
        facilitatorCount[t.trainingFacilitator] =
          (facilitatorCount[t.trainingFacilitator] || 0) + 1;
      }
    });
    const facilitators = Object.keys(facilitatorCount);
    setFacilitatorOptions(
      facilitators.map((fac) => ({
        value: fac,
        label: fac,
        count: facilitatorCount[fac],
      }))
    );

    // Extract unique trainers with counts
    const trainerCount = {};
    trainings.forEach((t) => {
      if (t.trainers && Array.isArray(t.trainers)) {
        t.trainers.forEach((trainer) => {
          if (trainer.name) {
            trainerCount[trainer.name] = (trainerCount[trainer.name] || 0) + 1;
          }
        });
      }
    });
    const trainers = Object.keys(trainerCount);
    setTrainerOptions(
      trainers.map((trainer) => ({
        value: trainer,
        label: trainer,
        count: trainerCount[trainer],
      }))
    );

    // Extract unique statuses with counts
    const statusCount = {};
    trainings.forEach((t) => {
      const status =
        t.status === 1
          ? "Active"
          : t.status === 0
            ? "Inactive"
            : t.status || "Active";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    const statuses = Object.keys(statusCount);
    setStatusOptions(
      statuses.map((status) => ({
        value: status,
        label: status,
        count: statusCount[status],
      }))
    );
  };

  // Apply Training Filters
  const applyTrainingFilters = () => {
    let filtered = [...trainingData];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        (t.categories || []).some(c => selectedCategories.includes(c?.title))
      );
    }

    if (selectedPrinciples.length > 0) {
      filtered = filtered.filter((t) =>
        (t.principles || []).some(p => selectedPrinciples.includes(p?.title))
      );
    }

    if (selectedFacilitators.length > 0) {
      filtered = filtered.filter((t) =>
        selectedFacilitators.includes(t.trainingFacilitator)
      );
    }

    if (selectedTrainers.length > 0) {
      filtered = filtered.filter((t) => {
        if (!t.trainers || !Array.isArray(t.trainers)) return false;
        const trainerNames = t.trainers.map((trainer) => trainer.name);
        return selectedTrainers.some((selectedTrainer) =>
          trainerNames.includes(selectedTrainer)
        );
      });
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((t) => {
        const itemDate = new Date(t.fromDate);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        if (fromDate && toDate) {
          return itemDate >= fromDate && itemDate <= toDate;
        } else if (fromDate) {
          return itemDate >= fromDate;
        } else if (toDate) {
          return itemDate <= toDate;
        }
        return true;
      });
    }
    console.log(filtered);

    setFilteredTrainings(filtered);
  };

  // Apply Trainee Filters
  const applyTraineeFilters = () => {
    let filtered = [...traineeData];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        (t.categories || []).some((cat) => selectedCategories.includes(cat))
      );
    }

    if (selectedPrinciples.length > 0) {
      filtered = filtered.filter((t) =>
        (t.principles || []).some((p) => selectedPrinciples.includes(p))
      );
    }

    if (selectedFacilitators.length > 0) {
      filtered = filtered.filter((t) =>
        t.facilitators?.some((fac) => selectedFacilitators.includes(fac))
      );
    }

    if (selectedTrainers.length > 0) {
      filtered = filtered.filter((t) =>
        t.trainersWorkedWith?.some((trainer) =>
          selectedTrainers.includes(trainer)
        )
      );
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((t) => {
        if (!t.trainingDates || t.trainingDates.length === 0) return false;

        return t.trainingDates.some((dateStr) => {
          const itemDate = new Date(dateStr);
          const fromDate = dateRange.from ? new Date(dateRange.from) : null;
          const toDate = dateRange.to ? new Date(dateRange.to) : null;

          if (fromDate && toDate) {
            return itemDate >= fromDate && itemDate <= toDate;
          } else if (fromDate) {
            return itemDate >= fromDate;
          } else if (toDate) {
            return itemDate <= toDate;
          }
          return true;
        });
      });
    }

    setFilteredTrainees(filtered);
  };

  // Clear All Filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPrinciples([]);
    setSelectedModes([]);
    setSelectedStatuses([]);
    setSelectedFacilitators([]);
    setSelectedTrainers([]);
    setDateRange({ from: "", to: "" });
    setSearchTerm("");

    // Reset to original data based on active tab
    if (activeTab === "training") {
      const formattedData = trainingData.map((item) => ({
        item,
        id: item.id,
        fromDate: new Date(item.fromDate).toLocaleDateString(),
        toDate: new Date(item.toDate).toLocaleDateString(),
        fromTime: item.fromTime,
        toTime: item.toTime,
        trainer: item?.trainers,
        title: item.trainingTitle,
        mode: item.modeOfTraining,
        mappingUser: item.userId,
        description: item.description,
        trainingFacilitator: item.trainingFacilitator,
        status: item.status || "Active",
        totalParticipants: item.totalParticipants || 0,
        completedParticipants: item.completedParticipants || 0,
        rawFromDate: item.fromDate,
        rawToDate: item.toDate,
        categories: item.categories,
        principles: item.principles,
        acceptedUsers: item.acceptedUsers,
        attendantUsers: item.attendantUsers,
        counts: item.counts,
        trainers: item.trainers,
      }));
      setFilteredTrainings(formattedData);
    } else {
      setFilteredTrainees(traineeData);
    }
  };

  // Handle Financial Year Change
  const handleFinancialYearChange = (event) => {
    const newFinancialYearId = event.target.value;
    if (!newFinancialYearId) {
      setFinancialYearId(null);
      return;
    }
    const parsedId = parseInt(newFinancialYearId);
    setFinancialYearId(parsedId);
  };

  // Handle Tab Change
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchTerm("");
  };

  // Export Functions
  const exportTrainingToExcel = () => {
    const exportData = [];

    exportData.push([
      "Training Title",
      "Training Topic",
      "Categories",
      "Principles",
      "From Date",
      "To Date",
      "Facilitator",
      "Trainers",
      "Mode",
      "Registered Count",
      "Attended Count",
    ]);

    filteredTrainings.forEach((training) => {
      const trainers =
        training.trainers && Array.isArray(training.trainers)
          ? training.trainers.map((t) => t.name).join(", ")
          : "N/A";

      exportData.push([
        training.trainingTitle || "N/A",
        training.topics.map(item => item.topic).join(", "),
        (training.categories || []).map(item => item.title).join(", "),
        training.principles.map(item => item.title).join(", "),
        training.fromDate || "N/A",
        training.toDate || "N/A",
        training.trainingFacilitator || "N/A",
        trainers,
        training.mode || "N/A",
        training.counts?.acceptedCount || 0,
        training.counts?.attendantCount || 0,
      ]);
    });

    downloadCSV(exportData, "Training_Report");
  };

  const exportTraineeToExcel = () => {
    const exportData = [];

    exportData.push([
      "Name",
      "Email",
      "Employee ID",
      "Category",
      "Gender",
      "Company Name",
      "Department",
      "Training Count",
      "Training Names",
      "Category Count",
      "Category Names",
      "Topic Count",
      "Topic Names",
      "Principle Count",
      "Principle Names",
    ]);

    filteredTrainees.forEach((trainee) => {
      exportData.push([
        trainee.employeeName || "N/A",
        trainee.email || "N/A",
        trainee.employeeId || "N/A",
        trainee.categoryId || "N/A",
        trainee.gender || "N/A",
        trainee.companyName || "N/A",
        trainee.departmentId || "N/A",
        trainee.trainings?.length || 0,
        trainee.trainings?.join(", ") || "None",
        trainee.categories?.length || 0,
        trainee.categories?.join(", ") || "None",
        trainee.topics?.length || 0,
        trainee.topics?.join(", ") || "None",
        trainee.principles?.length || 0,
        trainee.principles?.join(", ") || "None",
      ]);
    });

    downloadCSV(exportData, "Trainee_Report");
  };

  const downloadCSV = (data, filename) => {
    const csvContent = data
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const currentDate = new Date().toISOString().split("T")[0];
      const selectedYear = financialYear.find(
        (year) => year.id === financialYearId
      );
      const yearText = selectedYear
        ? selectedYear.financial_year_value
        : "Unknown";

      const finalFilename = `${filename}_${yearText}_${currentDate}.csv`;
      link.setAttribute("download", finalFilename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Effects
  useEffect(() => {
    loadFinancialYears();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (financialYearId) {
      getTrainingData(financialYearId);
    }
  }, [financialYearId]);

  useEffect(() => {
    if (activeTab === "training") {
      applyTrainingFilters();
    } else {
      applyTraineeFilters();
    }
  }, [
    selectedCategories,
    selectedPrinciples,
    selectedModes,
    selectedStatuses,
    selectedFacilitators,
    selectedTrainers,
    dateRange,
    trainingData,
    traineeData,
    activeTab,
  ]);

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
        `}
      </style>

      {/* Filters Section */}
      <FilterSection
        financialYear={financialYear}
        financialYearId={financialYearId}
        onFinancialYearChange={handleFinancialYearChange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedPrinciples={selectedPrinciples}
        setSelectedPrinciples={setSelectedPrinciples}
        selectedModes={selectedModes}
        setSelectedModes={setSelectedModes}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedFacilitators={selectedFacilitators}
        setSelectedFacilitators={setSelectedFacilitators}
        selectedTrainers={selectedTrainers}
        setSelectedTrainers={setSelectedTrainers}
        dateRange={dateRange}
        setDateRange={setDateRange}
        categoryOptions={categoryOptions}
        principleOptions={principleOptions}
        modeOptions={modeOptions}
        statusOptions={statusOptions}
        facilitatorOptions={facilitatorOptions}
        trainerOptions={trainerOptions}
        onClearFilters={clearAllFilters}
        activeTab={activeTab}
      />

      {/* Main Content with Tabs */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          overflow: "hidden",
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            top: 0,
            background: "white",
          }}
        >
          <button
            style={{
              padding: "20px 32px",
              border: "none",
              background:
                activeTab === "training"
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "transparent",
              color: activeTab === "training" ? "#fff" : "#6b7280",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "0",
              transition: "all 0.3s ease",
              flex: "1",
            }}
            onClick={() => handleTabChange("training")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              🎯 Training-wise Data
            </div>
          </button>
          <button
            style={{
              padding: "20px 32px",
              border: "none",
              background:
                activeTab === "trainee"
                  ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                  : "transparent",
              color: activeTab === "trainee" ? "#fff" : "#6b7280",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              borderRadius: "0",
              transition: "all 0.3s ease",
              flex: "1",
            }}
            onClick={() => handleTabChange("trainee")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              👥 Trainee-wise Data
            </div>
          </button>
        </div>

        <div
          style={{
            padding: "32px",
            flex: 1,
            overflowY: "auto",
            background:
              activeTab === "training"
                ? "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)"
                : "linear-gradient(135deg, #f0fcff 0%, #ecfbff 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              gap: "20px",
              flexWrap: "wrap",
              top: 0,
              zIndex: 90,
              background:
                activeTab === "training"
                  ? "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)"
                  : "linear-gradient(135deg, #f0fcff 0%, #ecfbff 100%)",
              paddingBottom: "16px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#1f2937",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {activeTab === "training"
                  ? "🎯 Training Management"
                  : "👥 Trainee Management"}
              </h3>
              <p
                style={{
                  margin: "0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {activeTab === "training"
                  ? "Monitor and track all training programs across the organization"
                  : "Track individual employee training progress and completion status"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={
                  activeTab === "training"
                    ? "Search trainings..."
                    : "Search trainees..."
                }
                icon="🔍"
              />

              <button
                onClick={
                  activeTab === "training"
                    ? exportTrainingToExcel
                    : exportTraineeToExcel
                }
                style={{
                  padding: "12px 24px",
                  background:
                    activeTab === "training"
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow:
                    activeTab === "training"
                      ? "0 4px 16px rgba(99, 102, 241, 0.3)"
                      : " #79bdd8 0px 4px 16px",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <span>📊</span>
                Export to Excel
              </button>
            </div>
          </div>

          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "14px", color: "#374151" }}>
              <strong>
                {activeTab === "training"
                  ? filteredTrainings.length
                  : filteredTrainees.length}
              </strong>{" "}
              {activeTab === "training" ? "trainings" : "trainees"} found out of{" "}
              <strong>
                {activeTab === "training"
                  ? trainingData.length
                  : traineeData.length}
              </strong>{" "}
              total
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Active Filters:{" "}
              {[
                selectedCategories.length > 0 &&
                `${selectedCategories.length} Categories`,
                selectedModes.length > 0 && `${selectedModes.length} Modes`,
                selectedStatuses.length > 0 &&
                `${selectedStatuses.length} Statuses`,
                selectedFacilitators.length > 0 &&
                `${selectedFacilitators.length} Facilitators`,
                selectedTrainers.length > 0 &&
                `${selectedTrainers.length} Trainers`,
                (dateRange.from || dateRange.to) && "Date Range",
                searchTerm && "Search Term",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </div>
          </div>

          {activeTab === "training" ? (
            <TrainingTable
              trainings={filteredTrainings}
              searchTerm={searchTerm}
              loading={loading}
            />
          ) : (
            <TraineeTable
              trainees={filteredTrainees}
              searchTerm={searchTerm}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingManagement;
