"use client";
import { useState, useEffect } from "react";
import FilterSection from "./components/FilterSection";
import EmissionEntriesList from "./components/EmissionEntriesList";
import { useFilters } from "./hooks/useFilters";
import {
  FiPlus,
  FiActivity,
  FiTrendingUp,
  FiBarChart,
  FiFilter,
} from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import EmissionDefraEntryModal from "./components/EmissionDefraEntryModal";
import { useEmissionDefraData } from "./hooks/useEmissionDefraData";
import SummaryComponent from "./components/SummaryComponent";

const ScopeOneDefra = (props) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activebtnTab, setactivebtnTab] = useState(0);
  const [carbonEmissionData, setCarbonEmissionData] = useState([]);
  const [fuelEmissionData, setFuelEmissionData] = useState(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const {
    selectedFinancialYear,
    setSelectedFinancialYear,
    financialYears,
    locations,
    timePeriodOptions,
    fuelType,
    fuels,
    mobileFuel,
    mobileLevel1,
    mobileLevel2,
    mobileLevel3,
    transportType,
    allFuelType,
    selectedFuelType,
    setSelectedFuelType,
    emissionEntries,
    setEmissionEntries,
    fromDate,
    toDate,
    identifier,
    selectedNewMobileFuel,
    handleSubmitData,
    handleConsumptionBlur,
    updateEmissionEntry,
    getSubFuelTypes,
    handlePeriodChange,
    createNewModalEntry,
    category,
    setCategory,
    setFuelName,
    stationaryFuel,
    engineTypeOptions,
    scope1Data,
    setSelectedNewTransportType,
    setSelectedNewEngineType,
    setSelectedNewMobileFuel,
    fugitiveFuel,
    setFugitiveFuel,
    setSelectedFugitiveFuel,
    selectedNewFugitiveFuel,
    setSelectedNewFugitiveFuel,
    selectedFinalMobileFuel,
    setSelectedFinalMobileFuel,
    selectedNewMobileFuelForCal,
    finalFuel,
    setSelectedUnit,
  } = useEmissionDefraData();

  const {
    selectedFilterCategory,
    setSelectedFilterCategory,
    selectedLocation,
    setSelectedLocation,
    selectedFilterPeriod,
    setSelectedFilterPeriod,
    filteredEmissionEntries,
    handleFilterApply,
    handleFilterReset,
    selectedStationaryFuelType,
    setSelectedStationaryFuelType,
    stationaryFuelTypes,
    selectedStationaryFuel,
    setSelectedStationaryFuel,
    stationaryFuels,
    selectedMobileLevel1,
    setSelectedMobileLevel1,
    mobileLevel1Options,
    selectedMobileLevel2,
    setSelectedMobileLevel2,
    mobileLevel2Options,
    selectedMobileLevel3,
    setSelectedMobileLevel3,
    mobileLevel3Options,
    selectedMobileFuel,
    setSelectedMobileFuel,
    mobileFuels,
    selectedFugitiveFuel,
    fugitiveFuels,
    fuelError,
    setFuelError,
  } = useFilters(emissionEntries);

  const categories = [
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

  const handleAddNewEntry = () => {
    createNewModalEntry();
    setShowNewEntryModal(true);
  };

  const handleCloseModal = () => {
    setEmissionEntries((prev) => prev.filter((entry) => !entry.isNew));
    setShowNewEntryModal(false);
    setFuelError("");
  };

  const handleModalSubmit = async (entry) => {
    const success = await handleSubmitData(entry);
    if (success !== false) {
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

  const handleTabClick = (index) => {
    setactivebtnTab(index);
    console.log(carbonEmissionData[index]);
    setFuelEmissionData(carbonEmissionData[index]);
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  useEffect(() => {
    if (
      (!selectedCategory || selectedCategory.length === 0) &&
      categories.length > 0
    ) {
      setSelectedCategory([categories[0].id]);
    }
  }, [selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
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
        <div
          style={{
            flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
            transition: "flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div className="container-fluid" style={{ padding: "2rem 1.5rem" }}>
            <div className="mb-1">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-3">
                    <div>
                      <h1
                        className="mb-1"
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: "800",
                          background:
                            "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        Scope 1 Emissions
                      </h1>
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

              {carbonEmissionData.length > 0 && (
                <div className="">
                  <div
                    className="d-flex overflow-auto pb-3"
                    style={{ gap: "0.75rem" }}
                  >
                    {carbonEmissionData.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(index)}
                        className="transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          borderRadius: "16px",
                          padding: "1rem 2rem",
                          border: "none",
                          background:
                            activebtnTab === index
                              ? "linear-gradient(135deg, #7494a7, #3c8dbb)"
                              : "rgba(255, 255, 255, 0.8)",
                          color: activebtnTab === index ? "#ffffff" : "#64748b",
                          
                          boxShadow:
                            activebtnTab === index
                              ? "0 10px 20px -5px rgba(116, 148, 167, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseOver={(e) => {
                          if (activebtnTab !== index) {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.95)";
                            e.currentTarget.style.color = "#334155";
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (activebtnTab !== index) {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.8)";
                            e.currentTarget.style.color = "#64748b";
                            e.currentTarget.style.transform = "translateY(0px)";
                          }
                        }}
                      >
                        {activebtnTab === index && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-full animate-pulse"></div>
                        )}
                        <span className="relative z-10">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                <div className="mb-5">
                  <SummaryComponent
                    data={
                      filteredEmissionEntries.length > 0
                        ? filteredEmissionEntries.filter(
                            (entry) => !entry.isNew
                          )
                        : emissionEntries.filter((entry) => !entry.isNew)
                    }
                  />
                </div>

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
                        {filteredEmissionEntries.length > 0 && (
                          <div className="d-flex align-items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full me-2"></div>
                            <span
                              style={{
                                fontSize: "0.95rem",
                                color: "#64748b",
                                fontWeight: "500",
                              }}
                            >
                              {
                                filteredEmissionEntries.filter(
                                  (entry) => !entry.isNew
                                ).length
                              }{" "}
                              entries found
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
                        <FiFilter className="me-2" size={18} style={{ color: "#7494a7", width: "18px", height: "18px" }}/>
                        <span>Filter Data</span>
                      </Button>
                    </div>

                    {scope1Data && Object.keys(scope1Data).length > 0 && (
                      <div className="mt-4">
                        <EmissionEntriesList
                          emissionEntries={emissionEntries}
                          filteredEmissionEntries={filteredEmissionEntries}
                          updateEmissionEntry={updateEmissionEntry}
                          handleConsumptionBlur={handleConsumptionBlur}
                          handleSubmitData={handleSubmitData}
                          locations={locations}
                          timePeriodOptions={timePeriodOptions}
                          fuelType={fuelType}
                          fuelError={fuelError}
                          setFuelError={setFuelError}
                          categories={categories}
                          mobileFuel={mobileFuel}
                          transportType={transportType}
                          engineTypeOptions={engineTypeOptions}
                          scope1Data={scope1Data}
                          identifier={identifier}
                          fugitiveFuel={fugitiveFuel}
                          selectedFinancialYear={selectedFinancialYear}
                          financialYears={financialYears}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
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
                  style={{ color: "#7494a7", width: "24px", height: "24px" }}
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
            }}
          >
            <FilterSection
              selectedFinancialYear={selectedFinancialYear}
              setSelectedFinancialYear={setSelectedFinancialYear}
              financialYears={financialYears}
              selectedFilterCategory={selectedFilterCategory}
              setSelectedFilterCategory={setSelectedFilterCategory}
              categories={categories}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locations={locations}
              selectedFilterPeriod={selectedFilterPeriod}
              setSelectedFilterPeriod={setSelectedFilterPeriod}
              timePeriodOptions={timePeriodOptions}
              selectedStationaryFuelType={selectedStationaryFuelType}
              setSelectedStationaryFuelType={setSelectedStationaryFuelType}
              stationaryFuelTypes={stationaryFuelTypes}
              selectedStationaryFuel={selectedStationaryFuel}
              setSelectedStationaryFuel={setSelectedStationaryFuel}
              stationaryFuels={stationaryFuels}
              selectedMobileLevel1={selectedMobileLevel1}
              setSelectedMobileLevel1={setSelectedMobileLevel1}
              mobileLevel1Options={mobileLevel1Options}
              selectedMobileLevel2={selectedMobileLevel2}
              setSelectedMobileLevel2={setSelectedMobileLevel2}
              mobileLevel2Options={mobileLevel2Options}
              selectedMobileLevel3={selectedMobileLevel3}
              setSelectedMobileLevel3={setSelectedMobileLevel3}
              mobileLevel3Options={mobileLevel3Options}
              selectedMobileFuel={selectedMobileFuel}
              setSelectedMobileFuel={setSelectedMobileFuel}
              mobileFuels={mobileFuels}
              selectedFugitiveFuel={selectedFugitiveFuel}
              setSelectedFugitiveFuel={setSelectedFugitiveFuel}
              fugitiveFuels={fugitiveFuels}
              handleFilterApply={handleFilterModalApply}
              handleFilterReset={handleFilterModalReset}
              fuelError={fuelError}
              activeTab={activebtnTab}
              hideActionButtons={true}
            />
          </Modal.Body>
          <Modal.Footer
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              border: "none",
              borderRadius: "0 0 0.75rem 0.75rem",
              padding: "1.5rem 2rem",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outline-secondary"
              onClick={handleFilterModalReset}
              style={{
                height: "44px",
                minWidth: "120px",
                fontSize: "0.9rem",
                fontWeight: "600",
                borderRadius: "10px",
                border: "2px solid #6b7280",
                color: "#6b7280",
              }}
            >
              Reset Filters
            </Button>
            <div className="d-flex gap-3">
              <Button
                variant="outline-primary"
                onClick={() => setShowFilterModal(false)}
                style={{
                  height: "44px",
                  minWidth: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "2px solid #7494a7",
                  color: "#7494a7",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFilterModalApply}
                style={{
                  height: "44px",
                  minWidth: "120px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #7494a7, #3c8dbb)",
                }}
              >
                Apply Filters
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        <EmissionDefraEntryModal
          show={showNewEntryModal}
          onHide={handleCloseModal}
          onSubmit={handleModalSubmit}
          locations={locations}
          timePeriodOptions={timePeriodOptions}
          fuelType={fuelType}
          selectedNewMobileFuelForCal={selectedNewMobileFuelForCal}
          fuels={fuels}
          selectedFuelType={selectedFuelType}
          setSelectedFuelType={setSelectedFuelType}
          handlePeriodChange={handlePeriodChange}
          handleConsumptionBlur={handleConsumptionBlur}
          fuelError={fuelError}
          setFuelError={setFuelError}
          emissionEntries={emissionEntries}
          updateEmissionEntry={updateEmissionEntry}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          category={category}
          setCategory={setCategory}
          mobileFuel={mobileFuel}
          mobileLevel1={mobileLevel1}
          mobileLevel2={mobileLevel2}
          mobileLevel3={mobileLevel3}
          transportType={transportType}
          financialYears={financialYears}
          selectedFinancialYear={selectedFinancialYear}
          setSelectedFinancialYear={setSelectedFinancialYear}
          setFuelName={setFuelName}
          stationaryFuel={stationaryFuel}
          setSelectedTransportType={setSelectedNewTransportType}
          selectedMobileFuel={selectedNewMobileFuel}
          setSelectedMobileFuel={setSelectedNewMobileFuel}
          setSelectedEngineType={setSelectedNewEngineType}
          engineTypeOptions={engineTypeOptions}
          identifier={identifier}
          fugitiveFuel={fugitiveFuel}
          setFugitiveFuel={setFugitiveFuel}
          setSelectedFugitiveFuel={setSelectedFugitiveFuel}
          selectedNewFugitiveFuel={selectedNewFugitiveFuel}
          setSelectedNewFugitiveFuel={setSelectedNewFugitiveFuel}
          selectedFinalMobileFuel={selectedFinalMobileFuel}
          setSelectedFinalMobileFuel={setSelectedFinalMobileFuel}
          finalFuel={finalFuel}
          setSelectedUnit={setSelectedUnit}
        />
      </div>

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

        .scroll-shadow {
          background: linear-gradient(90deg, white 30%, rgba(255, 255, 255, 0)),
            linear-gradient(90deg, rgba(255, 255, 255, 0), white 70%);
          background-size: 40px 100%, 40px 100%;
          background-position: 0 0, 100% 0;
          background-repeat: no-repeat;
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
      `}</style>
    </div>
  );
};

export default ScopeOneDefra;
