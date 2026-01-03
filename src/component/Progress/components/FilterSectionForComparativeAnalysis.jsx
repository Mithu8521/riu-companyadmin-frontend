import { useEffect } from "react";
import { LocationField, LocationFields } from "../../CarbonFootPrinting/common/FormComponents";
import MultiSelect from "../../Company Sub Admin/Component/CommonComponent/MultiSelect";

const FilterSectionForComparativeAnalysis = ({
  financialYearOptions,
  selectedFinancialYears,
  setSelectedFinancialYears,

  frameworkOptions,
  selectedFrameworks,
  setSelectedFrameworks,

  primaryLocationOptions,
  selectedPrimaryLocation,
  setSelectedPrimaryLocation,

  compareLocationOptions,
  selectedCompareLocation,
  setSelectedCompareLocation,

  onClearFilters,
  activeTab = "esg",
}) => {

  return (
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
      {/* Header */}
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
          📊 Comparative Analysis
        </h3>
        <button
          onClick={onClearFilters}
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s ease",
            boxShadow: "0px 4px 16px rgba(121, 189, 216, 0.3)",
          }}
        >
          🗑️ Clear All Filters
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Financial Year */}
        <div style={{ flex: "1 1 22%", minWidth: "200px" }}>
          <MultiSelect
            options={financialYearOptions}
            selectedValues={selectedFinancialYears}
            onChange={setSelectedFinancialYears}
            placeholder="Select Financial Years"
            label="Financial Year"
            icon="📅"
            activeTab={activeTab}
          />
        </div>

        {/* Framework */}
        <div style={{ flex: "1 1 22%", minWidth: "200px" }}>
          <MultiSelect
            options={frameworkOptions}
            selectedValues={selectedFrameworks}
            onChange={setSelectedFrameworks}
            placeholder="Select Frameworks"
            label="Framework"
            icon="📋"
            activeTab={activeTab}
          />
        </div>

        <div style={{ flex: "1 1 22%", minWidth: "200px" }}>
          <LocationField
            value={selectedPrimaryLocation}
            onChange={setSelectedPrimaryLocation}
            options={primaryLocationOptions
              .map((item) =>
                item?.id
                  ? {
                    value: String(item.id),
                    label:
                      item.unitCode ||
                      `${item?.location?.area || ""}, ${item?.location?.city || ""}`.trim(),
                  }
                  : null
              )
              .filter(Boolean)}

            required={false}
            levelName="Primary Location"
          />
        </div>

        {/* Compare Location */}
        <div style={{ flex: "1 1 22%", minWidth: "200px" }}>
          <LocationField
            value={selectedCompareLocation}
            onChange={setSelectedCompareLocation}
            options={compareLocationOptions
              .map((item) =>
                item?.id
                  ? {
                    value: String(item.id),
                    label:
                      item.unitCode ||
                      `${item?.location?.area || ""}, ${item?.location?.city || ""}`.trim(),
                  }
                  : null
              )
              .filter(Boolean)}
            required={false}
            levelName="Compare With Location"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSectionForComparativeAnalysis;
