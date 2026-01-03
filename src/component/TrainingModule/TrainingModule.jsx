import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import Welcome from "./components/Welcome";
import TrainingCatalogue from "./components/TrainingCatalogue";
import TrainingDetails from "./components/TrainingDetails";

const TrainingModule = (props) => {
  const [financeObjct, setFinanceObjct] = useState();
  const [updateCheck, setUpdateCheck] = useState(Math.random());
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState(0);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div
        style={{
          flex: sidebarExpanded ? "0 0 21%" : "0 0 60px",
          position: "sticky",
          top: 0,
          zIndex: 999,
          transition: "flex 0.3s ease",
        }}
      >
        <Sidebar
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>

        <div className="main_wrapper p-3">
          <div
            className="w-100"
            style={{
              paddingRight: "2.5%",
              marginLeft: "2%",
            }}
          ></div>
          <div className="w-100 p-4 ">
            <Welcome
              setFinancialYearId={setFinancialYearId}
              financialYearId={financialYearId}
            />
            <TrainingCatalogue
              updateCheck={updateCheck}
              setUpdateCheck={setUpdateCheck}
              financialYearId={financialYearId}
            />
            <TrainingDetails
              type="REGISTERED"
              updateCheck={updateCheck}
              setUpdateCheck={setUpdateCheck}
              financialYearId={financialYearId}
            />
            <TrainingDetails
              type="COMPLETED"
              updateCheck={updateCheck}
              setUpdateCheck={setUpdateCheck}
              financialYearId={financialYearId}
            />
            <TrainingDetails
              type="NOT_COMPLETED"
              updateCheck={updateCheck}
              setUpdateCheck={setUpdateCheck}
              financialYearId={financialYearId}
            />
            <TrainingDetails
              type="HISTORY"
              updateCheck={updateCheck}
              setUpdateCheck={setUpdateCheck}
              financialYearId={financialYearId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingModule;
