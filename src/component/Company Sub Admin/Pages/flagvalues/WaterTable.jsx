import React from "react";

const WaterTable = ({
  waterData,
  loading,
  selectedMonth,
  getLocationData,
  sourceLabels,
  findSourceData,
  sourceIds,
  selectedSourceIds,
  financialYear,
  financialYearId,
  hasFramework48,
}) => {
  const waterCategories = hasFramework48
    ? [
        {
          key: "ground water consumption",
          name: "Ground Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "tanker water consumption",
          name: "Tanker Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "surface water consumption",
          name: "Surface Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "consumption",
          name: "Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "wastewater",
          name: "Wastewater Treated (STP/ETP)",
          color: "#00BCD4",
          bgColor: "#E0F7FA",
        },
      ]
    : [
        {
          key: "ground water consumption",
          name: "Ground Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "tanker water consumption",
          name: "Tanker Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "surface water consumption",
          name: "Surface Water Consumption",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "consumption",
          name: "Water withdrawal",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
        {
          key: "discharge",
          name: "Water Discharge",
          color: "#2196F3",
          bgColor: "#E3F2FD",
        },
      ];

  // Water data functions
  const getWaterValue = (sourceId, categoryIndex, valueType) => {
    const sourceData = findSourceData(sourceId, waterData, selectedMonth);

    if (!sourceData) return "Submission Pending";

    try {
      let value;
      switch (valueType) {
        case "actual":
          value = sourceData.answer?.[0]?.[categoryIndex];
          break;
        case "min":
          value = sourceData.minTarget?.[0]?.[categoryIndex];
          break;
        case "max":
          value = sourceData.maxTarget?.[0]?.[categoryIndex];
          break;
        default:
          return "Submission Pending";
      }

      return value !== undefined && value !== null
        ? value
        : "Submission Pending";
    } catch (error) {
      return "Submission Pending";
    }
  };

  // Intensity data functions
  const getIntensityData = (sourceId) => {
    const sourceData = findSourceData(sourceId, waterData, selectedMonth);
    return sourceData?.intensityData || [];
  };

  const getIntensityValue = (intensityItem, valueType) => {
    try {
      let value;
      switch (valueType) {
        case "actual":
          value = intensityItem?.answer;
          break;
        case "min":
          value = intensityItem?.minTarget;
          break;
        case "max":
          value = intensityItem?.maxTarget;
          break;
        default:
          return "Submission Pending";
      }

      return value !== undefined && value !== null
        ? value
        : "Submission Pending";
    } catch (error) {
      return "Submission Pending";
    }
  };

  const calculateIntensityValue = (sourceId, intensityItem) => {
    try {
      // Get water consumption value (index 3)
      const waterConsumption = getWaterValue(sourceId, 3, "actual");
      const intensityAnswer = intensityItem?.answer;

      if (
        waterConsumption === "Submission Pending" ||
        !intensityAnswer ||
        intensityAnswer === "Submission Pending"
      ) {
        return "Submission Pending";
      }

      const waterConsumptionNum = parseFloat(waterConsumption);
      const intensityAnswerNum = parseFloat(intensityAnswer);

      if (
        isNaN(waterConsumptionNum) ||
        isNaN(intensityAnswerNum) ||
        intensityAnswerNum === 0
      ) {
        return "Submission Pending";
      }

      return waterConsumptionNum / intensityAnswerNum;
    } catch (error) {
      return "Submission Pending";
    }
  };

  const calculateIntensityMinTarget = (sourceId, intensityItem) => {
    try {
      // Get water consumption value (index 3)
      const waterConsumption = getWaterValue(sourceId, 3, "actual");
      const minTarget = intensityItem?.minTarget;

      if (
        waterConsumption === "Submission Pending" ||
        !minTarget ||
        minTarget === null
      ) {
        return "Submission Pending";
      }

      const waterConsumptionNum = parseFloat(waterConsumption);
      const minTargetNum = parseFloat(minTarget);

      if (isNaN(waterConsumptionNum) || isNaN(minTargetNum)) {
        return "Submission Pending";
      }

      return minTargetNum;
    } catch (error) {
      return "Submission Pending";
    }
  };

  const calculateIntensityMaxTarget = (sourceId, intensityItem) => {
    try {
      // Get water consumption value (index 3)
      const waterConsumption = getWaterValue(sourceId, 3, "actual");
      const maxTarget = intensityItem?.maxTarget;

      if (
        waterConsumption === "Submission Pending" ||
        !maxTarget ||
        maxTarget === null
      ) {
        return "Submission Pending";
      }

      const waterConsumptionNum = parseFloat(waterConsumption);
      const maxTargetNum = parseFloat(maxTarget);

      if (isNaN(waterConsumptionNum) || isNaN(maxTargetNum)) {
        return "Submission Pending";
      }

      return maxTargetNum;
    } catch (error) {
      return "Submission Pending";
    }
  };

  const calculateIntensityDifference = (sourceId, intensityItem) => {
    try {
      const actual = calculateIntensityValue(sourceId, intensityItem);
      const maxTarget = calculateIntensityMaxTarget(sourceId, intensityItem);

      if (
        actual === "Submission Pending" ||
        maxTarget === "Submission Pending"
      ) {
        return "Submission Pending";
      }

      const actualNum = parseFloat(actual);
      const maxNum = parseFloat(maxTarget);

      if (isNaN(actualNum) || isNaN(maxNum)) {
        return "Submission Pending";
      }

      return actualNum - maxNum;
    } catch (error) {
      return "Submission Pending";
    }
  };

  const getIntensityRemark = (sourceId, intensityItem) => {
    try {
      const difference = calculateIntensityDifference(sourceId, intensityItem);

      if (difference === "Submission Pending") {
        return "Submission Pending";
      }

      return difference <= 0 ? "Within Limit" : "Exceeding Limit";
    } catch (error) {
      return "Submission Pending";
    }
  };

  const calculateWaterDifference = (sourceId, categoryIndex) => {
    const actual = getWaterValue(sourceId, categoryIndex, "actual");
    const max = getWaterValue(sourceId, categoryIndex, "max");

    if (actual === "Submission Pending" || max === "Submission Pending")
      return "Submission Pending";

    const actualNum = parseFloat(actual);
    const maxNum = parseFloat(max);

    if (isNaN(actualNum) || isNaN(maxNum)) return "Submission Pending";

    // Formula: Difference = Actual - Max
    // Positive difference means exceeding limit, negative means within limit
    return actualNum - maxNum;
  };

  const getWaterRemark = (sourceId, categoryIndex) => {
    const difference = calculateWaterDifference(sourceId, categoryIndex);

    if (difference === "Submission Pending") return "Submission Pending";

    // Logic:
    // - If difference <= 0: Actual is within Max limit (Good!)
    // - If difference > 0: Actual exceeds Max limit (Bad!)
    return difference <= 0 ? "Within Limit" : "Exceeding Limit";
  };

  const exportWaterToExcel = () => {
    const locationData = getLocationData();
    const exportData = [];

    exportData.push([
      "Location",
      "Category",
      "Min Trigger Value",
      "Max Trigger Value",
      "Actual Value",
      "Difference",
      "Remark",
    ]);

    locationData.forEach((location) => {
      waterCategories.forEach((category, categoryIndex) => {
        const minValue = getWaterValue(location.id, categoryIndex, "min");
        const maxValue = getWaterValue(location.id, categoryIndex, "max");
        const actualValue = getWaterValue(location.id, categoryIndex, "actual");
        const difference = calculateWaterDifference(location.id, categoryIndex);
        const remark = getWaterRemark(location.id, categoryIndex);

        exportData.push([
          location.name,
          category.name,
          minValue,
          maxValue,
          actualValue,
          difference === "Submission Pending"
            ? difference
            : difference.toFixed(2),
          remark,
        ]);
      });

      // Add intensity data rows
      const intensityData = getIntensityData(location.id);
      intensityData.forEach((intensityItem) => {
        const categoryName = `Water Consumption Per ${intensityItem.title}`;
        const minValue = calculateIntensityMinTarget(location.id, intensityItem);
        const maxValue = calculateIntensityMaxTarget(location.id, intensityItem);
        const actualValue = calculateIntensityValue(location.id, intensityItem);
        const difference = calculateIntensityDifference(location.id, intensityItem);
        const remark = getIntensityRemark(location.id, intensityItem);

        exportData.push([
          location.name,
          categoryName,
          minValue === "Submission Pending" ? minValue : minValue.toFixed(2),
          maxValue === "Submission Pending" ? maxValue : maxValue.toFixed(2),
          actualValue === "Submission Pending" ? actualValue : actualValue.toFixed(2),
          difference === "Submission Pending" ? difference : difference.toFixed(2),
          remark,
        ]);
      });
    });

    const csvContent = exportData
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
      const locationText =
        selectedSourceIds.length === 0 ||
        selectedSourceIds.length === sourceIds.length
          ? "All_Locations"
          : selectedSourceIds.length === 1
          ? sourceLabels[selectedSourceIds[0]] || "Unknown_Location"
          : "Multiple_Locations";
      const monthText = selectedMonth
        ? selectedMonth.replace("-", "_")
        : "All_Months";

      const filename = `Water_Management_Report_${yearText}_${locationText}_${monthText}_${currentDate}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Render Water Management table
  const renderWaterTable = () => {
    const locationData = getLocationData();

    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <div style={{ fontSize: "18px", fontWeight: "500", color: "#fff" }}>
            Loading water data...
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          overflowX: "auto",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                color: "#fff",
              }}
            >
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "50px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "left",
                  minWidth: "250px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  💧 Water Category
                </div>
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "130px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>📉 Min Trigger Value (KL)</span>                 
                </div>
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "130px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>📈 Max Trigger Value (KL)</span>
                </div>
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "120px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>📊 Actual Value (KL)</span>
                </div>
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "110px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>⚖️ Difference</span>
                  <span style={{ fontSize: "12px", opacity: "0.8" }}>(KL)</span>
                </div>
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>💬 Remark</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {locationData.map((location, locationIndex) => (
              <React.Fragment key={location.id}>
                {sourceIds && sourceIds.length === 1 ? (
                  <></>
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "16px 12px",
                        background:
                          "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)",
                        fontWeight: "700",
                        textAlign: "center",
                        color: "#064e3b",
                        fontSize: "16px",
                        borderTop:
                          locationIndex > 0 ? "3px solid #e0f2fe" : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        📍 {location.name}
                      </div>
                    </td>
                  </tr>
                )}
                {waterCategories.map((category, categoryIndex) => {
                  const difference = calculateWaterDifference(
                    location.id,
                    categoryIndex
                  );
                  const remark = getWaterRemark(location.id, categoryIndex);

                  return (
                    <tr
                      key={`${location.id}-${categoryIndex}`}
                      style={{
                        backgroundColor:
                          categoryIndex % 2 === 0 ? "#f0fdfa" : "#fff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          fontWeight: "600",
                          color: "#6b7280",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {categoryIndex + 1}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          background: category.bgColor,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              backgroundColor: category.color,
                              borderRadius: "50%",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              border: "2px solid #fff",
                            }}
                          ></div>
                          <span style={{ color: "#374151" }}>
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#475569",
                          }}
                        >
                          {getWaterValue(location.id, categoryIndex, "min")}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#475569",
                          }}
                        >
                          {getWaterValue(location.id, categoryIndex, "max")}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f0f9ff",
                            border: "2px solid #0ea5e9",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#0369a1",
                          }}
                        >
                          {getWaterValue(location.id, categoryIndex, "actual")}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              difference === "Submission Pending"
                                ? "#f3f4f6"
                                : difference > 0
                                ? "#fef2f2"
                                : "#f0fdf4",
                            border: `2px solid ${
                              difference === "Submission Pending"
                                ? "#d1d5db"
                                : difference > 0
                                ? "#fca5a5"
                                : "#86efac"
                            }`,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color:
                              difference === "Submission Pending"
                                ? "#6b7280"
                                : difference > 0
                                ? "#dc2626"
                                : "#16a34a",
                          }}
                        >
                          {difference === "Submission Pending"
                            ? "Submission Pending"
                            : difference.toFixed(2)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              remark === "Submission Pending"
                                ? "#f3f4f6"
                                : remark === "Within Limit"
                                ? "#ecfdf5"
                                : "#fef2f2",
                            border: `2px solid ${
                              remark === "Submission Pending"
                                ? "#d1d5db"
                                : remark === "Within Limit"
                                ? "#22c55e"
                                : "#ef4444"
                            }`,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color:
                              remark === "Submission Pending"
                                ? "#6b7280"
                                : remark === "Within Limit"
                                ? "#15803d"
                                : "#dc2626",
                          }}
                        >
                          {remark === "Within Limit"
                            ? "✅ "
                            : remark === "Exceeding Limit"
                            ? "⚠️ "
                            : "⏳ "}
                          {remark}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {/* Intensity Data Rows */}
                {getIntensityData(location.id).map((intensityItem, intensityIndex) => {
                  const rowNumber = waterCategories.length + intensityIndex + 1;
                  const actualValue = calculateIntensityValue(location.id, intensityItem);
                  const minValue = calculateIntensityMinTarget(location.id, intensityItem);
                  const maxValue = calculateIntensityMaxTarget(location.id, intensityItem);
                  const difference = calculateIntensityDifference(location.id, intensityItem);
                  const remark = getIntensityRemark(location.id, intensityItem);

                  return (
                    <tr
                      key={`${location.id}-intensity-${intensityItem.qId}`}
                      style={{
                        backgroundColor: "#fff5f5",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          fontWeight: "600",
                          color: "#6b7280",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {rowNumber}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          borderBottom: "1px solid #e5e7eb",
                          background: "#fef3c7",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              backgroundColor: "#f59e0b",
                              borderRadius: "50%",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              border: "2px solid #fff",
                            }}
                          ></div>
                          <span style={{ color: "#374151" }}>
                            Water Consumption Per {intensityItem.title}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#475569",
                          }}
                        >
                          {minValue === "Submission Pending" 
                            ? minValue 
                            : parseFloat(minValue).toFixed(2)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f8fafc",
                            border: "2px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#475569",
                          }}
                        >
                          {maxValue === "Submission Pending" 
                            ? maxValue 
                            : parseFloat(maxValue).toFixed(2)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#fef3c7",
                            border: "2px solid #f59e0b",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#92400e",
                          }}
                        >
                          {actualValue === "Submission Pending" 
                            ? actualValue 
                            : parseFloat(actualValue).toFixed(2)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              difference === "Submission Pending"
                                ? "#f3f4f6"
                                : difference > 0
                                ? "#fef2f2"
                                : "#f0fdf4",
                            border: `2px solid ${
                              difference === "Submission Pending"
                                ? "#d1d5db"
                                : difference > 0
                                ? "#fca5a5"
                                : "#86efac"
                            }`,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color:
                              difference === "Submission Pending"
                                ? "#6b7280"
                                : difference > 0
                                ? "#dc2626"
                                : "#16a34a",
                          }}
                        >
                          {difference === "Submission Pending"
                            ? "Submission Pending"
                            : parseFloat(difference).toFixed(2)}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              remark === "Submission Pending"
                                ? "#f3f4f6"
                                : remark === "Within Limit"
                                ? "#ecfdf5"
                                : "#fef2f2",
                            border: `2px solid ${
                              remark === "Submission Pending"
                                ? "#d1d5db"
                                : remark === "Within Limit"
                                ? "#22c55e"
                                : "#ef4444"
                            }`,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color:
                              remark === "Submission Pending"
                                ? "#6b7280"
                                : remark === "Within Limit"
                                ? "#15803d"
                                : "#dc2626",
                          }}
                        >
                          {remark === "Within Limit"
                            ? "✅ "
                            : remark === "Exceeding Limit"
                            ? "⚠️ "
                            : "⏳ "}
                          {remark}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "0 8px",
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
            💧 Water Management
          </h3>
          <p
            style={{
              margin: "0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Monitor water consumption and wastewater treatment across all
            locations
          </p>
        </div>
        <button
          onClick={exportWaterToExcel}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 16px rgba(8, 145, 178, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(8, 145, 178, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 16px rgba(8, 145, 178, 0.3)";
          }}
        >
          <span>📊</span>
          Export to Excel
        </button>
      </div>
      {renderWaterTable()}
    </div>
  );
};

export default WaterTable;