import React from "react";

const BioMedicalTable = ({
  biomedicalData,
  loading,
  selectedMonth,
  getLocationData,
  findSourceData,
  sourceLabels,
  sourceIds,
  selectedSourceIds,
  financialYear,
  financialYearId,
}) => {
  // Bio Medical Waste categories with enhanced colors
  const bioMedicalCategories = [
    { key: "yellow", name: "Yellow", color: "#FFD700", bgColor: "#FFF9C4" },
    { key: "red", name: "Red", color: "#F44336", bgColor: "#FFEBEE" },
    { key: "white", name: "White", color: "#9E9E9E", bgColor: "#F5F5F5" },
    { key: "blue", name: "Blue", color: "#2196F3", bgColor: "#E3F2FD" },
    { key: "cytotoxic", name: "Cytotoxic", color: "#9C27B0", bgColor: "#F3E5F5" },
  ];

  // Biomedical data functions
  const getBiomedicalValue = (sourceId, wasteTypeIndex, valueType) => {
    const sourceData = findSourceData(sourceId, biomedicalData, selectedMonth);

    if (!sourceData) return "Submission Pending";

    try {
      let value;
      switch (valueType) {
        case "actual":
          value = sourceData.answer?.[0]?.[wasteTypeIndex];
          break;
        case "min":
          value = sourceData.minTarget?.[0]?.[wasteTypeIndex];
          break;
        case "max":
          value = sourceData.maxTarget?.[0]?.[wasteTypeIndex];
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

  // Get intensity data for a specific source
  const getIntensityData = (sourceId) => {
    const sourceData = findSourceData(sourceId, biomedicalData, selectedMonth);
    return sourceData?.intensityData || [];
  };

  // Calculate total waste for all categories
  const calculateTotalWaste = (sourceId, valueType) => {
    let total = 0;
    let hasValidData = false;
    let allPending = true;

    for (let i = 0; i < bioMedicalCategories.length; i++) {
      const value = getBiomedicalValue(sourceId, i, valueType);
      
      if (value !== "Submission Pending") {
        allPending = false;
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          total += numValue;
          hasValidData = true;
        }
      }
    }

    if (allPending) return "Submission Pending";
    if (!hasValidData) return "Submission Pending";
    
    return total;
  };

  // Calculate intensity metric (Total Waste / Intensity Answer)
  const calculateIntensityMetric = (sourceId, intensityAnswer, valueType) => {
    const totalWaste = calculateTotalWaste(sourceId, valueType);
    
    if (totalWaste === "Submission Pending" || !intensityAnswer) {
      return "Submission Pending";
    }

    const answerNum = parseFloat(intensityAnswer);
    if (isNaN(answerNum) || answerNum === 0) {
      return "Submission Pending";
    }

    return totalWaste / answerNum;
  };

  const calculateDifference = (sourceId, wasteTypeIndex) => {
    const actual = getBiomedicalValue(sourceId, wasteTypeIndex, "actual");
    const max = getBiomedicalValue(sourceId, wasteTypeIndex, "max");

    if (actual === "Submission Pending" || max === "Submission Pending")
      return "Submission Pending";

    const actualNum = parseFloat(actual);
    const maxNum = parseFloat(max);

    if (isNaN(actualNum) || isNaN(maxNum)) return "Submission Pending";

    return actualNum - maxNum;
  };

  // Calculate difference for calculated rows (Total Waste and Intensity metrics)
  const calculateCalculatedDifference = (actualValue, maxValue) => {
    if (actualValue === "Submission Pending" || maxValue === "Submission Pending") {
      return "Submission Pending";
    }

    const actualNum = parseFloat(actualValue);
    const maxNum = parseFloat(maxValue);

    if (isNaN(actualNum) || isNaN(maxNum)) {
      return "Submission Pending";
    }

    return actualNum - maxNum;
  };

  const getRemark = (sourceId, wasteTypeIndex) => {
    const difference = calculateDifference(sourceId, wasteTypeIndex);

    if (difference === "Submission Pending") return "Submission Pending";

    return difference <= 0 ? "Within Limit" : "Exceeding Limit";
  };

  // Get remark for calculated rows
  const getCalculatedRemark = (difference) => {
    if (difference === "Submission Pending") return "Submission Pending";
    return difference <= 0 ? "Within Limit" : "Exceeding Limit";
  };

  // Export function
  const exportToExcel = () => {
    const locationData = getLocationData();
    const exportData = [];

    exportData.push([
      "Location",
      "Waste Type",
      "Min Trigger Value",
      "Max Trigger Value",
      "Actual Value",
      "Difference",
      "Remark",
    ]);

    locationData.forEach((location) => {
      // Regular categories
      bioMedicalCategories.forEach((category, categoryIndex) => {
        const minValue = getBiomedicalValue(location.id, categoryIndex, "min");
        const maxValue = getBiomedicalValue(location.id, categoryIndex, "max");
        const actualValue = getBiomedicalValue(
          location.id,
          categoryIndex,
          "actual"
        );
        const difference = calculateDifference(location.id, categoryIndex);
        const remark = getRemark(location.id, categoryIndex);

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

      // Total Waste row
      const totalActual = calculateTotalWaste(location.id, "actual");
      const totalMin = calculateTotalWaste(location.id, "min");
      const totalMax = calculateTotalWaste(location.id, "max");
      const totalDiff = calculateCalculatedDifference(totalActual, totalMax);
      const totalRemark = getCalculatedRemark(totalDiff);

      exportData.push([
        location.name,
        "Total Biomedical Waste",
        totalMin === "Submission Pending" ? totalMin : totalMin.toFixed(2),
        totalMax === "Submission Pending" ? totalMax : totalMax.toFixed(2),
        totalActual === "Submission Pending" ? totalActual : totalActual.toFixed(2),
        totalDiff === "Submission Pending" ? totalDiff : totalDiff.toFixed(2),
        totalRemark,
      ]);

      // Intensity data rows
      const intensityData = getIntensityData(location.id);
      intensityData.forEach((intensity) => {
        const intensityActual = calculateIntensityMetric(
          location.id,
          intensity.answer,
          "actual"
        );
        const intensityMin = calculateIntensityMetric(
          location.id,
          intensity.minTarget,
          "min"
        );
        const intensityMax = calculateIntensityMetric(
          location.id,
          intensity.maxTarget,
          "max"
        );
        const intensityDiff = calculateCalculatedDifference(intensityActual, intensityMax);
        const intensityRemark = getCalculatedRemark(intensityDiff);

        exportData.push([
          location.name,
          `Total Biomedical Waste Per ${intensity.title}`,
          intensityMin === "Submission Pending" ? intensityMin : intensityMin.toFixed(2),
          intensityMax === "Submission Pending" ? intensityMax : intensityMax.toFixed(2),
          intensityActual === "Submission Pending" ? intensityActual : intensityActual.toFixed(2),
          intensityDiff === "Submission Pending" ? intensityDiff : intensityDiff.toFixed(2),
          intensityRemark,
        ]);
      });
    });

    const csvContent = exportData
      .map((row) =>
        row
          .map((cell) => {
            if (typeof cell === "string") {
              const trimmed = cell.trim();
              return trimmed.includes(",") ? `"${trimmed}"` : trimmed;
            }
            return cell;
          })
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

      const filename = `Biomedical_Waste_Report_${yearText}_${locationText}_${monthText}_${currentDate}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderBioMedicalTable = () => {
    const locationData = getLocationData();

    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            Loading biomedical data...
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                  minWidth: "200px",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  🗂️ Waste Type
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
                  <span>📉 Min Trigger Value</span>
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
                  <span>📈 Max Trigger Value</span>
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
                  <span>📊 Actual Value</span>
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
            {locationData.map((location, locationIndex) => {
              const intensityData = getIntensityData(location.id);
              
              return (
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
                            "linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)",
                          fontWeight: "700",
                          textAlign: "center",
                          color: "#2d5016",
                          fontSize: "16px",
                          borderTop:
                            locationIndex > 0 ? "3px solid #e0e7ff" : "none",
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
                  
                  {/* Regular waste categories */}
                  {bioMedicalCategories.map((category, categoryIndex) => {
                    const difference = calculateDifference(
                      location.id,
                      categoryIndex
                    );
                    const remark = getRemark(location.id, categoryIndex);
                    return (
                      <tr
                        key={`${location.id}-${categoryIndex}`}
                        style={{
                          backgroundColor:
                            categoryIndex % 2 === 0 ? "#fafbff" : "#fff",
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
                            {getBiomedicalValue(
                              location.id,
                              categoryIndex,
                              "min"
                            )}
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
                            {getBiomedicalValue(
                              location.id,
                              categoryIndex,
                              "max"
                            )}
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
                            {typeof getBiomedicalValue(
                              location.id,
                              categoryIndex,
                              "actual"
                            ) === "number"
                              ? getBiomedicalValue(
                                location.id,
                                categoryIndex,
                                "actual"
                              ).toFixed(2)
                              : getBiomedicalValue(
                                location.id,
                                categoryIndex,
                                "actual"
                              )}
                          </div>
                        </td>
                        {category.key !== "cytotoxic" ? (
                          <>
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
                                  border: `2px solid ${difference === "Submission Pending"
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
                                  border: `2px solid ${remark === "Submission Pending"
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
                          </>
                        ) : (
                          <></>
                        )}
                      </tr>
                    );
                  })}

                  {/* Total Waste Row */}
                  <tr
                    style={{
                      backgroundColor: "#fff7ed",
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
                      {bioMedicalCategories.length + 1}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "700",
                        borderBottom: "1px solid #e5e7eb",
                        background: "#fed7aa",
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
                            backgroundColor: "#f97316",
                            borderRadius: "50%",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            border: "2px solid #fff",
                          }}
                        ></div>
                        <span style={{ color: "#9a3412" }}>Total Biomedical Waste</span>
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
                          fontWeight: "700",
                          color: "#475569",
                        }}
                      >
                        {typeof calculateTotalWaste(location.id, "min") === "number"
                          ? calculateTotalWaste(location.id, "min").toFixed(2)
                          : calculateTotalWaste(location.id, "min")}
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
                          fontWeight: "700",
                          color: "#475569",
                        }}
                      >
                        {typeof calculateTotalWaste(location.id, "max") === "number"
                          ? calculateTotalWaste(location.id, "max").toFixed(2)
                          : calculateTotalWaste(location.id, "max")}
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
                          fontWeight: "700",
                          color: "#0369a1",
                        }}
                      >
                        {typeof calculateTotalWaste(location.id, "actual") === "number"
                          ? calculateTotalWaste(location.id, "actual").toFixed(2)
                          : calculateTotalWaste(location.id, "actual")}
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
                            calculateCalculatedDifference(
                              calculateTotalWaste(location.id, "actual"),
                              calculateTotalWaste(location.id, "max")
                            ) === "Submission Pending"
                              ? "#f3f4f6"
                              : calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              ) > 0
                                ? "#fef2f2"
                                : "#f0fdf4",
                          border: `2px solid ${calculateCalculatedDifference(
                              calculateTotalWaste(location.id, "actual"),
                              calculateTotalWaste(location.id, "max")
                            ) === "Submission Pending"
                              ? "#d1d5db"
                              : calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              ) > 0
                                ? "#fca5a5"
                                : "#86efac"
                            }`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          color:
                            calculateCalculatedDifference(
                              calculateTotalWaste(location.id, "actual"),
                              calculateTotalWaste(location.id, "max")
                            ) === "Submission Pending"
                              ? "#6b7280"
                              : calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              ) > 0
                                ? "#dc2626"
                                : "#16a34a",
                        }}
                      >
                        {typeof calculateCalculatedDifference(
                          calculateTotalWaste(location.id, "actual"),
                          calculateTotalWaste(location.id, "max")
                        ) === "number"
                          ? calculateCalculatedDifference(
                            calculateTotalWaste(location.id, "actual"),
                            calculateTotalWaste(location.id, "max")
                          ).toFixed(2)
                          : calculateCalculatedDifference(
                            calculateTotalWaste(location.id, "actual"),
                            calculateTotalWaste(location.id, "max")
                          )}
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
                            getCalculatedRemark(
                              calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              )
                            ) === "Submission Pending"
                              ? "#f3f4f6"
                              : getCalculatedRemark(
                                calculateCalculatedDifference(
                                  calculateTotalWaste(location.id, "actual"),
                                  calculateTotalWaste(location.id, "max")
                                )
                              ) === "Within Limit"
                                ? "#ecfdf5"
                                : "#fef2f2",
                          border: `2px solid ${getCalculatedRemark(
                              calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              )
                            ) === "Submission Pending"
                              ? "#d1d5db"
                              : getCalculatedRemark(
                                calculateCalculatedDifference(
                                  calculateTotalWaste(location.id, "actual"),
                                  calculateTotalWaste(location.id, "max")
                                )
                              ) === "Within Limit"
                                ? "#22c55e"
                                : "#ef4444"
                            }`,
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "700",
                          color:
                            getCalculatedRemark(
                              calculateCalculatedDifference(
                                calculateTotalWaste(location.id, "actual"),
                                calculateTotalWaste(location.id, "max")
                              )
                            ) === "Submission Pending"
                              ? "#6b7280"
                              : getCalculatedRemark(
                                calculateCalculatedDifference(
                                  calculateTotalWaste(location.id, "actual"),
                                  calculateTotalWaste(location.id, "max")
                                )
                              ) === "Within Limit"
                                ? "#15803d"
                                : "#dc2626",
                        }}
                      >
                        {getCalculatedRemark(
                          calculateCalculatedDifference(
                            calculateTotalWaste(location.id, "actual"),
                            calculateTotalWaste(location.id, "max")
                          )
                        ) === "Within Limit"
                          ? "✅ "
                          : getCalculatedRemark(
                            calculateCalculatedDifference(
                              calculateTotalWaste(location.id, "actual"),
                              calculateTotalWaste(location.id, "max")
                            )
                          ) === "Exceeding Limit"
                            ? "⚠️ "
                            : "⏳ "}
                        {getCalculatedRemark(
                          calculateCalculatedDifference(
                            calculateTotalWaste(location.id, "actual"),
                            calculateTotalWaste(location.id, "max")
                          )
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Intensity Data Rows */}
                  {intensityData.map((intensity, intensityIndex) => {
                    const intensityActual = calculateIntensityMetric(
                      location.id,
                      intensity.answer,
                      "actual"
                    );
                    const intensityMin = calculateIntensityMetric(
                      location.id,
                      intensity.minTarget,
                      "min"
                    );
                    const intensityMax = calculateIntensityMetric(
                      location.id,
                      intensity.maxTarget,
                      "max"
                    );
                    const intensityDiff = calculateCalculatedDifference(
                      intensityActual,
                      intensityMax
                    );
                    const intensityRemark = getCalculatedRemark(intensityDiff);

                    return (
                      <tr
                        key={`${location.id}-intensity-${intensityIndex}`}
                        style={{
                          backgroundColor: "#fef3c7",
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
                          {bioMedicalCategories.length + 2 + intensityIndex}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "700",
                            borderBottom: "1px solid #e5e7eb",
                            background: "#fde68a",
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
                                backgroundColor: "#eab308",
                                borderRadius: "50%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                border: "2px solid #fff",
                              }}
                            ></div>
                            <span style={{ color: "#713f12" }}>
                              Total Biomedical Waste Per {intensity.title}
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
                              fontWeight: "700",
                              color: "#475569",
                            }}
                          >
                            {typeof intensityMin === "number"
                              ? intensityMin.toFixed(2)
                              : intensityMin}
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
                              fontWeight: "700",
                              color: "#475569",
                            }}
                          >
                            {typeof intensityMax === "number"
                              ? intensityMax.toFixed(2)
                              : intensityMax}
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
                              fontWeight: "700",
                              color: "#0369a1",
                            }}
                          >
                            {typeof intensityActual === "number"
                              ? intensityActual.toFixed(2)
                              : intensityActual}
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
                                intensityDiff === "Submission Pending"
                                  ? "#f3f4f6"
                                  : intensityDiff > 0
                                    ? "#fef2f2"
                                    : "#f0fdf4",
                              border: `2px solid ${intensityDiff === "Submission Pending"
                                  ? "#d1d5db"
                                  : intensityDiff > 0
                                    ? "#fca5a5"
                                    : "#86efac"
                                }`,
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "700",
                              color:
                                intensityDiff === "Submission Pending"
                                  ? "#6b7280"
                                  : intensityDiff > 0
                                    ? "#dc2626"
                                    : "#16a34a",
                            }}
                          >
                            {typeof intensityDiff === "number"
                              ? intensityDiff.toFixed(2)
                              : intensityDiff}
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
                                intensityRemark === "Submission Pending"
                                  ? "#f3f4f6"
                                  : intensityRemark === "Within Limit"
                                    ? "#ecfdf5"
                                    : "#fef2f2",
                              border: `2px solid ${intensityRemark === "Submission Pending"
                                  ? "#d1d5db"
                                  : intensityRemark === "Within Limit"
                                    ? "#22c55e"
                                    : "#ef4444"
                                }`,
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "700",
                              color:
                                intensityRemark === "Submission Pending"
                                  ? "#6b7280"
                                  : intensityRemark === "Within Limit"
                                    ? "#15803d"
                                    : "#dc2626",
                            }}
                          >
                            {intensityRemark === "Within Limit"
                              ? "✅ "
                              : intensityRemark === "Exceeding Limit"
                                ? "⚠️ "
                                : "⏳ "}
                            {intensityRemark}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
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
            🧬 Bio Medical Waste Management
          </h3>
          <p
            style={{
              margin: "0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Monitor and track biomedical waste across all locations
          </p>
        </div>
        <button
          onClick={exportToExcel}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.3)";
          }}
        >
          <span>📊</span>
          Export to Excel
        </button>
      </div>
      {renderBioMedicalTable()}
    </div>
  );
};

export default BioMedicalTable;