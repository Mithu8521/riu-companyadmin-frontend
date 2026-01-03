import React, { useState, useEffect } from "react";
import "./tabs.css";
import Progress from "../Progress/progress";
import Emission from "../Emission/emission";
import Water from "../Water/Water";
import Waste from "../Waste/waste";
import Diversity from "../Diversity/Diversity";
import Safety from "../Safety/Safety";
import Training from "../Training/Training";
import Environment from "../Environment/environment";
import TrainingOverview from "../TrainingOverview/trainingOverview";
import TraineeOverview from "../TraineeOverviev/TraineeOverview";
import Employment from "../Employment/employment";
import IntensityDashboard from "../IntensityDashboard/IntensityDashboard";
import TrainingDashboard from "../Training/training-dashboard/TrainingDashboard";
import ESGProgressDashboard from "../Progress/ESGProgressDashboard";
import ESGEnvironmentDashboard from "../Environment/environment";
import Occupancy from "../Occupancy/occupancy";
import Energy from "../Energy/energy";
import AIGraph from "../AIDashboard/AIGraph";
import CustomGraph from "../CustomDashboard /CustomGraph";
import HealthSafety from "../Company Sub Admin/Component/Governance/health_safety_policy";
// import AIEnergy from "../AIDashboard/AIGraph";

// Import AI Dashboard components for all tabs
// import AIProgress from "../AIDashboard/AIProgress/AIProgress";
// import AIEnvironment from "../AIDashboard/AIEnvironment/AIEnvironment";
// import AIEmission from "../AIDashboard/AIEmission/AIEmission";
// import AIWater from "../AIDashboard/AIWater/AIWater";
// import AIWaste from "../AIDashboard/AIWaste/AIWaste";
// import AIIntensity from "../AIDashboard/AIIntensity/AIIntensity";
// import AIDiversity from "../AIDashboard/AIDiversity/AIDiversity";
// import AIEmployment from "../AIDashboard/AIEmployment/AIEmployment";
// import AIOccupancy from "../AIDashboard/AIOccupancy/AIOccupancy";
// import AISafety from "../AIDashboard/AISafety/AISafety";
// import AITraining from "../AIDashboard/AITraining/AITraining";
// import AITrainingOverview from "../AIDashboard/AITrainingOverview/AITrainingOverview";
// import AITraineeOverview from "../AIDashboard/AITraineeOverview/AITraineeOverview";

const TabsComponent = ({
  setCurrentTab,
  fromDate,
  keyTab,
  toDate,
  locationOption,
  timePeriods,
  financialYearId,
  graphData,
  frameworkValue,
  sectorQuestionAnswerDataForGraph,
  framework,
  todaysActivities,
  compareLastTimePeriods,
  compareTCurrentimePeriods,
  financialYear,
  energyData,
  energyTriggerData,
  emissionTriggerData,
  permissionGraph,
  usersActivity,
  lastYearGraphData
}) => {
  const [activebtnTab, setactivebtnTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0); // 0 for Custom, 1 for AI
  const [permissionList, setPermissionList] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [companyFramework, setCompanyFramework] = useState([]);
  const [companyId, setCompanyId] = useState();


  useEffect(() => {
    const dashboardMenu = JSON.parse(localStorage.getItem("menu"));
    const dashboardObject = dashboardMenu.find(
      (item) => item.caption === "Dashboard"
    ).permissions;
    setPermissionList(dashboardObject);

    // Set initial active tab based on user type and permissions
    if (currentUser.userType === "TRAINEE") {
      setactivebtnTab(10);
    } else {
      // Find first available tab based on permissions
      const firstAvailableTab = getFirstAvailableTab();
      setactivebtnTab(firstAvailableTab);
    }
  }, [permissionGraph]);

  useEffect(() => {
    if (Array.isArray(frameworkValue) && frameworkValue.length) {
      const frameworkId = frameworkValue.map((value) => value.id);
      setCompanyFramework(frameworkId);
    }
  }, [frameworkValue]);

  // Helper function to get the first available tab based on permissions
  const getFirstAvailableTab = () => {
    // Always show Progress tab if not TRAINEE
    if (currentUser.userType !== "TRAINEE") {
      return 0;
    }

    // For TRAINEE, show Trainee Overview
    return 11;
  };

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    const currentUser = localStorage.getItem("tmpcurrentUser");
    if (currentUser) {
      setCompanyId(String(JSON.parse(currentUser).data.user.dataValues.company_id));
    }

  }, []);

  // Helper function to check if a tab should be visible based on permissionGraph
  const isTabVisible = (tabName) => {
    if (!permissionGraph) return true; // If permissions not loaded yet, show all tabs

    // Check if the tab has any permissions
    if (permissionGraph[tabName] && permissionGraph[tabName].length > 0) {
      return true;
    }

    // Special cases for tabs not directly in permissionGraph
    if (
      tabName === "Progress" ||
      tabName === "Trainer Overview" ||
      tabName === "Trainee Overview" ||
      tabName === "Intensity"
    ) {
      return true;
    }

    // Check if the tab is in companyFramework
    if (
      tabName === "Training" &&
      companyFramework &&
      companyFramework.includes(1)
    ) {
      return true;
    }

    return false;
  };

  const handleTabClick = (index) => {
    setactivebtnTab(index);
    // Reset sub-tab to Custom Graph when switching main tabs
    setActiveSubTab(0);
  };

  const handleSubTabClick = (subTabIndex) => {
    setActiveSubTab(subTabIndex);
  };

  useEffect(() => {
    setCurrentTab(activebtnTab);
  }, [activebtnTab]);

  // Render sub-tabs component (shown for all tabs)
  const renderSubTabs = () => {
    return (
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "2px solid #e0e0e0",
        paddingBottom: "10px"
      }}>
        <button
          className={`btn button ${activeSubTab === 0 ? "activebtn" : ""}`}
          onClick={() => handleSubTabClick(0)}
          style={{
            padding: "8px 16px",
            fontSize: "14px"
          }}
        >
          Dashboard
        </button>
        <button
          className={`btn button ${activeSubTab === 1 ? "activebtn" : ""}`}
          onClick={() => handleSubTabClick(1)}
          style={{
            padding: "8px 16px",
            fontSize: "14px"
          }}
        >
          Custom Graph
        </button>
        <button
          className={`btn button ${activeSubTab === 2 ? "activebtn" : ""}`}
          onClick={() => handleSubTabClick(2)}
          style={{
            padding: "8px 16px",
            fontSize: "14px"
          }}
        >
          AI Graph
        </button>
      </div>
    );
  };

  const renderUI = () => {
    const commonProps = {
      keyTab,
      locationOption,
      timePeriods,
      financialYearId,
      graphData,
      frameworkValue,
      compareLastTimePeriods,
      compareTCurrentimePeriods,
      financialYear,
      lastYearGraphData
    };

    switch (activebtnTab) {
      case 0: // Progress
        return (
          <div>
            <ESGProgressDashboard
              framework={framework}
              timePeriods={timePeriods}
              fromDate={fromDate}
              toDate={toDate}
              financialYearId={financialYearId}
              locationOption={locationOption}
              todaysActivities={todaysActivities}
              usersActivity={usersActivity}
            />
          </div>
        );

      case 1: // Environment
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <ESGEnvironmentDashboard
                keyTab={keyTab}
                graphData={graphData}
              />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Environment" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Environment" />
            ) : null}
          </div>
        );
      case 2:
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Energy keyTab={keyTab}
                locationOption={locationOption}
                timePeriods={timePeriods}
                financialYearId={financialYearId}
                graphData={graphData}
                frameworkValue={frameworkValue}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
                energyData={energyData}
                energyTriggerData={energyTriggerData} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Energy" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Energy" />
            ) : null}
          </div>
        );

      case 3: // Emission
        return (
          <div>

            {renderSubTabs()}

            {activeSubTab === 0 ? (
              <Emission
                {...commonProps}
                energyData={energyData}
                emissionTriggerData={emissionTriggerData}
              />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Emission" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Emission" />
            ) : null}

          </div>
        );

      case 4: // Water
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Water {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Water" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Water" />
            ) : null}
          </div>
        );

      case 5: // Waste
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Waste {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Waste" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Waste" />
            ) : null}
          </div>
        );

      case 12: // Intensity
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <IntensityDashboard
                keyTab={keyTab}
                locationOption={locationOption}
                timePeriods={timePeriods}
                financialYearId={financialYearId}
                graphData={graphData}
                frameworkValue={frameworkValue}
                compareLastTimePeriods={compareLastTimePeriods}
                compareTCurrentimePeriods={compareTCurrentimePeriods}
                financialYear={financialYear}
              />
            ) : (
              <>
              </>
              // <AIIntensity
              //   keyTab={keyTab}
              //   locationOption={locationOption}
              //   timePeriods={timePeriods}
              //   financialYearId={financialYearId}
              //   graphData={graphData}
              //   frameworkValue={frameworkValue}
              //   compareLastTimePeriods={compareLastTimePeriods}
              //   compareTCurrentimePeriods={compareTCurrentimePeriods}
              //   financialYear={financialYear}
              // />
            )}
          </div>
        );

      case 6: // Diversity
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Diversity {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Diversity" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Diversity" />
            ) : null}
          </div>
        );

      case 7: // Employment
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Employment {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Employment" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Employment" />
            ) : null}
          </div>
        );

      case 15: // Occupancy
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Occupancy {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Occupancy" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Occupancy" />
            ) : null}

          </div>
        );

      case 8: // Safety
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <Safety {...commonProps} />
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="HealthSafety" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Health & Safety" />
            ) : null}
          </div>
        );

      case 9: // Training
        return (
          <div>
            {renderSubTabs()}

            {activeSubTab === 0 ? (
              companyFramework && companyFramework.includes(48) ? (
                <Training
                  keyTab={keyTab}
                  locationOption={locationOption}
                  timePeriods={timePeriods}
                  financialYearId={financialYearId}
                  graphData={graphData}
                  frameworkValue={frameworkValue}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                />
              ) : (
                <TrainingDashboard
                  keyTab={keyTab}
                  locationOption={locationOption}
                  timePeriods={timePeriods}
                  financialYearId={financialYearId}
                  graphData={graphData}
                  frameworkValue={frameworkValue}
                  compareLastTimePeriods={compareLastTimePeriods}
                  compareTCurrentimePeriods={compareTCurrentimePeriods}
                  financialYear={financialYear}
                />
              )
            ) : activeSubTab === 1 ? (
              <CustomGraph tabName="Training" />
            ) : activeSubTab === 2 ? (
              <AIGraph tabName="Training" />
            ) : null}
          </div>
        );

      case 10: // Trainer Overview
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <TrainingOverview
                locationOption={locationOption}
                timePeriods={timePeriods}
                financialYearId={financialYearId}
                graphData={graphData}
                frameworkValue={frameworkValue}
              />
            ) : (
              <>
              </>
              // <AITrainingOverview
              //   locationOption={locationOption}
              //   timePeriods={timePeriods}
              //   financialYearId={financialYearId}
              //   graphData={graphData}
              //   frameworkValue={frameworkValue}
              // />
            )}
          </div>
        );

      case 11: // Trainee Overview
        return (
          <div>
            {renderSubTabs()}
            {activeSubTab === 0 ? (
              <TraineeOverview
                locationOption={locationOption}
                timePeriods={timePeriods}
                financialYearId={financialYearId}
              />
            ) : (
              <>
              </>
              // <AITraineeOverview
              //   locationOption={locationOption}
              //   timePeriods={timePeriods}
              //   financialYearId={financialYearId}
              // />
            )}
          </div>
        );
      
      case 16: // Governance
        return (
          <div>
            <div style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "2px solid #e0e0e0",
              paddingBottom: "10px"
            }}>
              <button
                className={`btn button ${activeSubTab === 1 ? "activebtn" : ""}`}
                onClick={() => handleSubTabClick(1)}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px"
                }}
              >
                Custom Graph
              </button>
            </div>
            <CustomGraph tabName="Governance" />
          </div>
        );

      default:
        return null;
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  };

  const headerStyle = {
    position: "sticky",
  };

  const contentStyle = {
    overflowY: "auto",
    maxHeight: "calc(87vh - 120px)",
    padding: "10px",
    flexGrow: 1,
  };

  // Tab button component with emoji icon
  const TabButton = ({ index, icon, label, isActive, onClick, style = {} }) => (
    <button
      className={`btn button ${isActive ? " activebtn" : ""}`}
      onClick={() => onClick(index)}
      style={{
        margin: "0 5px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...style
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div className="scroll-container w-100">
            <div
              className="d-flex buttoncont"
              style={{
                marginBottom: "25px",
                overflow: "auto",
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "thin",
                scrollbarHeight: "1px",
              }}
            >
              {currentUser && currentUser.userType === "TRAINEE" ? (
                <></>
              ) : (
                <>
                  <TabButton
                    index={0}
                    icon="📊"
                    label="Progress"
                    isActive={activebtnTab === 0}
                    onClick={handleTabClick}
                  />

                  {isTabVisible("Environment") && (
                    <TabButton
                      index={1}
                      icon="🌱"
                      label="Environment"
                      isActive={activebtnTab === 1}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Energy") && (
                    <TabButton
                      index={2}
                      icon="⚡"
                      label="Energy"
                      isActive={activebtnTab === 2}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Emission") && (
                    <TabButton
                      index={3}
                      icon="☁️"
                      label="Emission"
                      isActive={activebtnTab === 3}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Water") && (
                    <TabButton
                      index={4}
                      icon="💧"
                      label="Water"
                      isActive={activebtnTab === 4}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Waste") && (
                    <TabButton
                      index={5}
                      icon="🗑️"
                      label="Waste"
                      isActive={activebtnTab === 5}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Intensity") && (
                    <TabButton
                      index={12}
                      icon="📈"
                      label="Intensity"
                      isActive={activebtnTab === 12}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Diversity") && (
                    <TabButton
                      index={6}
                      icon="👥"
                      label="Diversity"
                      isActive={activebtnTab === 6}
                      onClick={handleTabClick}
                    />
                  )}

                  {isTabVisible("Employment") &&
                    companyFramework &&
                    companyFramework.includes(48) && (
                      <TabButton
                        index={7}
                        icon="💼"
                        label="Employment"
                        isActive={activebtnTab === 7}
                        onClick={handleTabClick}
                      />
                    )}

                  {isTabVisible("Employment") &&
                    companyFramework &&
                    companyFramework.includes(48) && (
                      <TabButton
                        index={15}
                        icon="💼"
                        label="Occupancy"
                        isActive={activebtnTab === 15}
                        onClick={handleTabClick}
                      />
                    )}

                  {isTabVisible("Health & Safety") && (
                    <TabButton
                      index={8}
                      icon="🛡️"
                      label="Health & Safety"
                      isActive={activebtnTab === 8}
                      onClick={handleTabClick}
                    />
                  )}

                  {companyFramework && companyFramework.includes(1) && (
                    <TabButton
                      index={9}
                      icon="🎓"
                      label="Training"
                      isActive={activebtnTab === 9}
                      onClick={handleTabClick}
                    />
                  )}

                  {companyId && companyId !== "351" && <TabButton
                    index={10}
                    icon="👨‍🏫"
                    label="Trainer Overview"
                    isActive={activebtnTab === 10}
                    onClick={handleTabClick}
                  />}
                </>
              )}

              {companyId && companyId !== "351" && <TabButton
                index={11}
                icon="👨‍🎓"
                label="Trainee Overview"
                isActive={activebtnTab === 11}
                onClick={handleTabClick}
              />}

              {companyFramework && companyFramework.includes(1) && (
                <TabButton
                  index={16}
                  icon="⚖️"
                  label="Governance"
                  isActive={activebtnTab === 16}
                  onClick={handleTabClick}
                />
              )}
            </div>
          </div>
          <div style={contentStyle}>{renderUI()}</div>
        </div>
      </div>
    </>
  );
};

export default TabsComponent;