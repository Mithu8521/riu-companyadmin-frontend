import MultiSelect from "../Company Sub Admin/Component/CommonComponent/MultiSelect";

const FilterSection = ({
    financialYear,
    financialYearId,
    onFinancialYearChange,
    selectedCategories,
    setSelectedCategories,
    categoryOptions,
    selectedPeriods,
    setSelectedPeriods,
    periodOptions,
    selectedLocations,
    setSelectedLocations,
    locationOptions,
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
                : "0px 4px 16px rgba(121, 189, 216, 0.3)",
          }}
        >
          🗑️ Clear All Filters
        </button>
      </div>
  
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Financial Year */}
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
  
        {/* Category Filter */}
        <MultiSelect
          options={categoryOptions}
          selectedValues={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Select Categories"
          label="Category"
          icon="🏷️"
          activeTab={activeTab}
        />
  
        {/* Period Filter */}
        <MultiSelect
          options={periodOptions}
          selectedValues={selectedPeriods}
          onChange={setSelectedPeriods}
          placeholder="Select Periods"
          label="Time Period"
          icon="📊"
          activeTab={activeTab}
        />
  
        {/* Location Filter */}
        <MultiSelect
          options={locationOptions}
          selectedValues={selectedLocations}
          onChange={setSelectedLocations}
          placeholder="Select Locations"
          label="Location"
          icon="📍"
          activeTab={activeTab}
        />
      </div>
    </div>
  );

  export default FilterSection;