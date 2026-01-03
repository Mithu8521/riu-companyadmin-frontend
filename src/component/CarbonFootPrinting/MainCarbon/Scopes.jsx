"use client";
import { useState, useMemo, useEffect } from "react";
import FilterSection from "./components/FilterSection";
import EmissionEntriesList from "./components/EmissionEntriesList";
import EmissionEntryModal from "./components/EmissionEntryModal";
import { useEmissionData } from "./hooks/useEmissionData";
import { useFilters } from "./hooks/useFilters";
import {
  FiPlus,
  FiActivity,
  FiTrendingUp,
  FiBarChart,
  FiFilter,
  FiZap
} from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import SummaryComponent from "./components/SummaryComponent";

const Scopes = ({ scopeType }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Custom hooks for data management
  const {
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYearOptions,
    locationOptions,
    timePeriodOptions,
    emissionEntries,
    setEmissionEntries,
    handleSubmitData,
    updateEmissionEntry,
    scopeData,
    ghgProtocol,
    protocol,
    setScopeType,
    scope3Categories,
    defraScope3Activities,
    identifier,
    scope2Categories
  } = useEmissionData();

  const {
    selectedFilterCategory,
    setSelectedFilterCategory,
    selectedFilterScope3Categories,
    setSelectedFilterScope3Categories,
    selectedFilterDefraScope3Activities,
    setSelectedFilterDefraScope3Activities,
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    filteredEmissionEntries,
    handleFilterApply,
    handleFilterReset,
  } = useFilters(emissionEntries);

const labelMapping = {
  defra_scope2: "Electricity Emissions",
  defra_evs_scope2: "Electric Vehicles",
  ipcc_scope2: "Electricity Emissions",
};

const formatLabel = (key) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const getIcon = (key) => {
  if (key.includes("ev")) return <FiTrendingUp className="w-4 h-4" />;
  if (key.includes("ipcc")) return <FiZap className="w-4 h-4" />;
  if (key.includes("electricity") || key.includes("scope2")) return <FiActivity className="w-4 h-4" />;
  return <FiBarChart className="w-4 h-4" />;
};
  // Dynamically generate categories from scopeData with better labeling and styling
  const categories = useMemo(() => {
    // If no data available, return default categories based on scope type
    if (scopeData ) {
      if (scopeType === 'SCOPE1') {
        return [
          {
            id: "stationary",
            label: "Stationary Combustion",
            icon: <FiActivity className="w-4 h-4" />,
            gradient: "from-slate-500 via-slate-600 to-slate-700",
            bgColor: "bg-slate-50",
            textColor: "text-slate-700",
            borderColor: "border-slate-200",
          },
          {
            id: "mobile",
            label: "Mobile Combustion",
            icon: <FiTrendingUp className="w-4 h-4" />,
            gradient: "from-slate-500 via-slate-600 to-slate-700",
            bgColor: "bg-slate-50",
            textColor: "text-slate-700",
            borderColor: "border-slate-200",
          },
          {
            id: "fugitive",
            label: "Fugitive Emissions",
            icon: <FiBarChart className="w-4 h-4" />,
            gradient: "from-slate-500 via-slate-600 to-slate-700",
            bgColor: "bg-slate-50",
            textColor: "text-slate-700",
            borderColor: "border-slate-200",
          },
        ];
      } else if (scopeType === 'SCOPE2') {
    if (scope2Categories && typeof scope2Categories === "object") {
      return Object.keys(scope2Categories).map((key) => ({
        id: key,
        label: labelMapping[key] || formatLabel(key),
        icon: getIcon(key),
        gradient: "from-slate-500 via-slate-600 to-slate-700",
        bgColor: "bg-slate-50",
        textColor: "text-slate-700",
        borderColor: "border-slate-200",
      }));
    }
      }
      return [];
    }

    return [];
  }, [scopeData, scopeType,scope2Categories]);

  // Handler functions
  const handleAddNewEntry = () => {
    setShowNewEntryModal(true);
  };

  const handleCloseModal = () => {
    // Remove any temporary new entries when closing modal
    setEmissionEntries((prev) => prev.filter((entry) => !entry.isNew));
    setShowNewEntryModal(false);
  };

  const handleModalSubmit = async (entry) => {
    const success = await handleSubmitData(entry);
    if (success !== false) {
      // If submission was successful
      handleCloseModal();
    }
  };

  const handleFilterModalApply = () => {
    handleFilterApply();
    setShowFilterModal(false);
  };

  const handleFilterModalReset = () => {
    handleFilterReset();
    setShowFilterModal(false);
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      (selectedLocation && selectedLocation.length > 0) ||
      (selectedFilterPeriod && selectedFilterPeriod.length > 0) ||
      (selectedFilterCategory && selectedFilterCategory.length > 0)
    );
  }, [
    selectedLocation,
    selectedFilterPeriod,
    selectedFilterCategory,
  ]);

  useEffect(() => {
    setScopeType(scopeType);
  }, [scopeType]);

  // Get total entries count (excluding new temporary entries)
  const totalEntries = useMemo(() => {
    return emissionEntries.filter((entry) => !entry.isNew).length;
  }, [emissionEntries]);

  const filteredEntriesCount = useMemo(() => {
    return filteredEmissionEntries.filter((entry) => !entry.isNew).length;
  }, [filteredEmissionEntries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="d-flex flex-row mainclass relative z-10"
        style={{
          height: "100vh",
          overflow: "hidden",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Main Content */}
        <div
          style={{
            flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
            transition: "flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}

          {/* Main Container */}
          <div className="container-fluid" style={{ padding: "2rem 1.5rem" }}>
            {/* Page Header */}
            <div className="mb-1">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-3">
                    <div>
                      <h3
                        className="mb-1"
                        style={{
                          fontSize: "2rem",
                          fontWeight: "500",
                          background:
                            "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {scopeType} Emissions - {protocol}
                      </h3>
                      <div className="d-flex align-items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full me-2 animate-pulse"></div>
                        <p
                          className="mb-0"
                          style={{
                            color: "#64748b",
                            fontSize: "1.1rem",
                            fontWeight: "500",
                          }}
                        >
                          Track and manage direct greenhouse gas emissions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddNewEntry}
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    height: "54px",
                    minWidth: "180px",
                    padding: "0 28px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    border: "none",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0px) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  <FiPlus className="me-2 relative z-10" size={20} />
                  <span className="relative z-10">Add New Entry</span>
                </Button>
              </div>
            </div>

            {/* Main Card */}
            <div
              className="card border-0 rounded-4 overflow-hidden mb-5 shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                position: "relative",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/30 pointer-events-none"></div>

              <div
                className="card-body position-relative"
                style={{ padding: "2.5rem" }}
              >
                {/* Summary Component */}
                <div className="mb-5">
                  <SummaryComponent
                    data={
                      filteredEmissionEntries.length > 0
                        ? filteredEmissionEntries.filter(
                            (entry) => !entry.isNew
                          )
                        : emissionEntries.filter((entry) => !entry.isNew)
                    }
                    selectedScope={scopeType}
                    scope3Categories={scope3Categories}
                    scopeData={scopeData}
                    ghgProtocol={ghgProtocol}
                    scope2Categories={scope2Categories}
                  />
                </div>

                {/* Emission Entries Section */}
                {selectedFinancialYear && (
                  <div style={{ marginTop: "2rem" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h3
                          className="mb-2"
                          style={{
                            fontWeight: "700",
                            background:
                              "linear-gradient(135deg, #64748b 0%, #7494a7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: "1.75rem",
                            letterSpacing: "-0.025em",
                          }}
                        >
                          Emission Data Entries
                        </h3>
                        {hasActiveFilters &&
                          filteredEntriesCount !== totalEntries && (
                            <div className="d-flex align-items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full me-2"></div>
                              <span
                                style={{
                                  fontSize: "0.95rem",
                                  color: "#64748b",
                                  fontWeight: "500",
                                }}
                              >
                                {filteredEntriesCount} of {totalEntries} entries
                                found
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Filter Button */}
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowFilterModal(true)}
                        className="shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                        style={{
                          height: "48px",
                          minWidth: "140px",
                          padding: "0 20px",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                          border: "2px solid #7494a7",
                          borderRadius: "12px",
                          color: "#7494a7",
                          background: "rgba(255, 255, 255, 0.8)",
                          
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(135deg, #7494a7, #3c8dbb)";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "#3c8dbb";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.8)";
                          e.currentTarget.style.color = "#7494a7";
                          e.currentTarget.style.borderColor = "#7494a7";
                        }}
                      >
                        <FiFilter
                          className="me-2"
                          size={18}
                          style={{
                            color: "#7494a7",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                        <span>Filter Data</span>
                      </Button>
                    </div>

                    {scopeData && Object.keys(scopeData).length > 0 && (
                      <div className="mt-4">
                        <EmissionEntriesList
                          identifier={identifier}
                          emissionEntries={emissionEntries}
                          filteredEmissionEntries={filteredEmissionEntries}
                          updateEmissionEntry={updateEmissionEntry}
                          handleSubmitData={handleSubmitData}
                          locationOptions={locationOptions}
                          financialYearOptions={financialYearOptions}
                          timePeriodOptions={timePeriodOptions}
                          categories={categories}
                          scopeData={scopeData}
                          scope3Categories={scope3Categories}
                          selectedFinancialYear={selectedFinancialYear}
                          setSelectedFinancialYear={setSelectedFinancialYear}
                          ghgProtocol={ghgProtocol}
                          scopeType={scopeType}
                          protocol={protocol}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* No Financial Year Selected */}
                {!selectedFinancialYear && (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center animate-float"
                        style={{
                          width: "64px",
                          height: "64px",
                          background:
                            "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                          borderRadius: "50%",
                          color: "#64748b",
                        }}
                      >
                        📊
                      </div>
                    </div>

                    <h4
                      className="mb-2"
                      style={{
                        color: "#475569",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                      }}
                    >
                      Select Financial Year
                    </h4>

                    <p
                      className="mb-0"
                      style={{
                        color: "#64748b",
                        fontSize: "1rem",
                        maxWidth: "400px",
                        margin: "0 auto",
                      }}
                    >
                      Choose a financial year from the filter section above to
                      view and manage emission entries.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          size="xl"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              border: "none",
              borderRadius: "0.75rem 0.75rem 0 0",
              padding: "1.5rem 2rem",
            }}
          >
            <Modal.Title
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.025em",
              }}
            >
              <div className="d-flex align-items-center">
                <FiFilter
                  className="me-2"
                  size={24}
                  style={{
                    color: "#7494a7",
                    width: "24px",
                    height: "24px",
                  }}
                />
                <span>Filter Emission Data</span>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <FilterSection
              selectedScope={scopeType}
              selectedFinancialYear={selectedFinancialYear}
              setSelectedFinancialYear={setSelectedFinancialYear}
              financialYearOptions={financialYearOptions}
              selectedFilterCategory={selectedFilterCategory}
              setSelectedFilterCategory={setSelectedFilterCategory}
              selectedFilterScope3Categories={selectedFilterScope3Categories}
              setSelectedFilterScope3Categories={setSelectedFilterScope3Categories}
              selectedFilterDefraScope3Activities={selectedFilterDefraScope3Activities}
              setSelectedFilterDefraScope3Activities={setSelectedFilterDefraScope3Activities}
              categories={categories}
              scope3Categories={scope3Categories}
              defraScope3Activities={defraScope3Activities}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locationOptions={locationOptions}
              selectedFilterPeriod={selectedFilterPeriod}
              setSelectedFilterPeriod={setSelectedFilterPeriod}
              timePeriodOptions={timePeriodOptions}
              handleFilterApply={handleFilterModalApply}
              handleFilterReset={handleFilterModalReset}
              activeTab={0}
              isModal={true}
            />
          </Modal.Body>
        </Modal>

        {/* New Entry Modal */}
        <EmissionEntryModal
          ghgProtocol={ghgProtocol}
          show={showNewEntryModal}
          onHide={handleCloseModal}
          onSubmit={handleModalSubmit}
          locationOptions={locationOptions}
          timePeriodOptions={timePeriodOptions}
          emissionEntries={emissionEntries}
          updateEmissionEntry={updateEmissionEntry}
          categories={categories}
          financialYearOptions={financialYearOptions}
          selectedFinancialYear={selectedFinancialYear}
          setSelectedFinancialYear={setSelectedFinancialYear}
          scopeData={scopeData}
          selectedScope={scopeType}
          protocol={protocol}
          scope3Categories={scope3Categories}
          identifier={identifier}
        />
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gradient-text {
          background: linear-gradient(135deg, #7494a7 0%, #3c8dbb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modal-content {
          border-radius: 0.75rem;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header .btn-close {
          font-size: 1.2rem;
          opacity: 0.6;
        }

        .modal-header .btn-close:hover {
          opacity: 1;
        }

        .w-2 {
          width: 0.5rem;
        }
        .h-2 {
          height: 0.5rem;
        }
        .w-4 {
          width: 1rem;
        }
        .h-4 {
          height: 1rem;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Scopes;