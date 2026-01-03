import { FinancialYearField } from "../../CarbonFootPrinting/common/FormComponents";
import MultiSelect from "../../Company Sub Admin/Component/CommonComponent/MultiSelect";

const FilterSection = ({
    financialYear,
    onFinancialYearChange,
    selectedPeriods,
    setSelectedPeriods,
    periodOptions,
    selectedLocations,
    setSelectedLocations,
    locationOptions,
    onClearFilters,
    activeTab = "esg",
    comparisonMode,
    setComparisonMode,
    twoYearComparisonMode,
    setTwoYearComparisonMode,
    firstYearLocation,
    setFirstYearLocation,
    firstYearPeriods,
    setFirstYearPeriods,
    firstFinancialYearId,
    setFirstFinancialYearId,
    secondYearLocation,
    setSecondYearLocation,
    secondYearPeriods,
    setSecondYearPeriods,
    secondFinancialYearId,
    setSecondFinancialYearId,
    secondYearTimePeriodOptions
}) => {
    const handleClearAllFilters = () => {
        if (twoYearComparisonMode) {
            setFirstYearLocation([]);
            setFirstYearPeriods([]);
            setFirstFinancialYearId('');
            setSecondYearLocation([]);
            setSecondYearPeriods([]);
            setSecondFinancialYearId('');
            setTwoYearComparisonMode(false);
        } else {
            setSelectedLocations([]);
        }
        setComparisonMode(false);
        setSelectedPeriods([]);
        onClearFilters?.();
    };

    const hasActiveFilters = () => {
        if (!twoYearComparisonMode) {
            return selectedLocations?.length > 0 || selectedPeriods?.length > 0;
        } else {
            return firstYearLocation?.length > 0 ||
                firstYearPeriods?.length > 0 ||
                secondYearLocation?.length > 0 ||
                secondYearPeriods?.length > 0;
        }
    };

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
                    🎯 Environment Dashboard Filters
                </h3>
                <button
                    onClick={handleClearAllFilters}
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

            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
                {twoYearComparisonMode ? (
                    <>
                        <div style={{
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            padding: "12px",
                            minWidth: "300px"
                        }}>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af", marginBottom: "8px" }}>
                                First Filter
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ minWidth: "200px" }}>
                                    <MultiSelect
                                        options={locationOptions}
                                        selectedValues={firstYearLocation}
                                        onChange={setFirstYearLocation}
                                        placeholder="Select Locations"
                                        label="Location"
                                        icon="📍"
                                        activeTab={activeTab}
                                        compact={true}
                                    />
                                </div>
                                <div style={{ minWidth: "200px" }}>
                                    <MultiSelect
                                        options={periodOptions}
                                        selectedValues={firstYearPeriods}
                                        onChange={setFirstYearPeriods}
                                        placeholder="Select Periods"
                                        label="Period"
                                        icon="📆"
                                        activeTab={activeTab}
                                        compact={true}
                                    />
                                </div>
                                <div style={{ minWidth: "200px" }}>
                                    <FinancialYearField
                                        value={String(firstFinancialYearId)}
                                        onChange={setFirstFinancialYearId}
                                        options={financialYear}
                                        required={false}
                                        compact={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#6b7280" }}>VS</div>

                        <div style={{
                            background: "#f9fafb",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "12px",
                            minWidth: "300px"
                        }}>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Second Filter
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ minWidth: "200px" }}>
                                    <MultiSelect
                                        options={locationOptions}
                                        selectedValues={secondYearLocation}
                                        onChange={setSecondYearLocation}
                                        placeholder="Select Locations"
                                        label="Location"
                                        icon="📍"
                                        activeTab={activeTab}
                                        compact={true}
                                    />
                                </div>
                                <div style={{ minWidth: "200px" }}>
                                    <MultiSelect
                                        options={secondYearTimePeriodOptions}
                                        selectedValues={secondYearPeriods}
                                        onChange={setSecondYearPeriods}
                                        placeholder="Select Periods"
                                        label="Period"
                                        icon="📆"
                                        activeTab={activeTab}
                                        compact={true}
                                    />
                                </div>
                                <div style={{ minWidth: "200px" }}>
                                    <FinancialYearField
                                        value={String(secondFinancialYearId)}
                                        onChange={setSecondFinancialYearId}
                                        options={financialYear}
                                        required={false}
                                        compact={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}

                {/* Comparison Mode Buttons */}
                <button
                    onClick={() => {
                        const newComparisonMode = !comparisonMode;
                        setComparisonMode(newComparisonMode);
                        setTwoYearComparisonMode(false);

                        if (newComparisonMode && financialYear?.length > 0 && firstFinancialYearId) {
                            // find index of current year
                            const currentIndex = financialYear.findIndex(
                                (fy) => fy.value == firstFinancialYearId
                            );

                            if (currentIndex > 0) {
                                // take previous year (index - 1)
                                const prevYear = financialYear[currentIndex - 1];
                                setSecondFinancialYearId(prevYear.value);
                      

                            } else {
                                // no previous year exists
                                setSecondFinancialYearId('');
                            }
                        } else {
                            setSecondFinancialYearId('');
                        }
                    }}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        background: comparisonMode && !twoYearComparisonMode ? "#0891b2" : "#e5e7eb",
                        color: comparisonMode && !twoYearComparisonMode ? "white" : "#374151",
                        transition: "all 0.2s ease"
                    }}
                >
                    {comparisonMode && !twoYearComparisonMode
                        ? "Hide Previous Year"
                        : "Compare with Previous Year"}
                </button>


                <button
                    onClick={() => {
                        setTwoYearComparisonMode(!twoYearComparisonMode);
                        setComparisonMode(false);
                    }}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        background: twoYearComparisonMode ? "#0891b2" : "#e5e7eb",
                        color: twoYearComparisonMode ? "white" : "#374151",
                        transition: "all 0.2s ease"
                    }}
                >
                    {twoYearComparisonMode ? 'Hide Two-Year Compare' : 'Compare Two Years'}
                </button>
            </div>

            {!twoYearComparisonMode && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        alignItems: "start",
                    }}
                >
                 
                     <FinancialYearField
                        value={String(firstFinancialYearId)}
                        onChange={onFinancialYearChange}
                        options={financialYear}
                        required={true}
                    />
                    <MultiSelect
                        options={periodOptions}
                        selectedValues={selectedPeriods}
                        onChange={setSelectedPeriods}
                        placeholder="Select Time Periods"
                        label="Time Period"
                        icon="📆"
                        activeTab={activeTab}
                    />

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
            )}
        </div>
    );
};

export default FilterSection;