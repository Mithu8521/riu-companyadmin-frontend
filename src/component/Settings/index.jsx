import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import "./settings.module.css";
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./settings.module.css";
import Profile from "./Profile";
import Billing from "./Billing";
import SubUsers from "./SubUsers";
import Generator from "./Generator";
import AccessManagement from "./AccessManagement";
import LocationManagement from "./Location";
import FlowCharts from "../flow_charts/FlowCharts";
import DesignationManagement from "./DesignationManagement";
import QuestionFrequency from "./QuestionFrequency";
import Unit from "./Unit";
// import Trigger from "./trigger";
import Emission from "./Emission";
import OrgCharts from "./OrgChart";
import OrgChart from "./OrgChart";
import Triggers from "./Triggers";
import GHGProtocol from "./GHGProtocol";
import EmailNotificationsAndDueDate from "./EmailNotificationsAndDueDate";
import LockQuestion from "./LockQuestion";

const Settings = (props) => {
  const [tab, setTab] = useState("profile");
  const [menuList, setMenuList] = useState([]);

  const isMounted = useRef(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [companyId, setCompanyId] = useState();

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component unmounts
    const currentUser = localStorage.getItem("tmpcurrentUser");
    if (currentUser) {
      setCompanyId(String(JSON.parse(currentUser).data.user.dataValues.company_id));
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const renderUI = () => {
    switch (activebtnTab) {
      case 0:
        return (
          menuList.some((item) => item.caption === "Profile Management") && (
            <Profile
              userPermissionList={
                menuList.find((item) => item.caption === "Profile Management")
                  ?.permissions
              }
              tab="profile"
            />
          )
        );
      case 1:
        return (
          menuList.some((item) => item.caption === "Billing Management") && (
            <Billing
              tab="billing"
              userPermissionList={
                menuList.find((item) => item.caption === "Billing Management")
                  ?.permissions
              }
            />
          )
        );

      case 15:
        return (
          menuList.some((item) => item.caption === "Lock Question") && (
            <LockQuestion />
          )
        );

      case 2:
        return (
          menuList.some((item) => item.caption === "User Management") && (
            <SubUsers
              tab="subaccounts"
              userPermissionList={
                menuList.find((item) => item.caption === "User Management")
                  ?.permissions
              }
            />
          )
        );

      case 3:
        return (
          menuList.some((item) => item.caption === "Location Management") && (
            <LocationManagement
              tab="location"
              userPermissionList={
                menuList.find((item) => item.caption === "Location Management")
                  ?.permissions
              }
            />
          )
        );
      case 4:
        return (
          menuList.some((item) => item.caption === "Process Management") && (
            <Generator
              tab="process"
              userPermissionList={
                menuList.find((item) => item.caption === "Process Management")
                  ?.permissions
              }
            />
          )
        );
      case 5:
        return (
          menuList.some((item) => item.caption === "Permission Management") && (
            <AccessManagement
              tab="permission"
              userPermissionList={
                menuList.find(
                  (item) => item.caption === "Permission Management"
                )?.permissions
              }
            />
          )
        );
      case 6:
        return (
          menuList.some((item) => item.caption === "Create Org Chart") && (
            <FlowCharts
              tab="chart"
              userPermissionList={
                menuList.find((item) => item.caption === "Create Org Chart")
                  ?.permissions
              }
            />
          )
        );

      case 7:
        return (
          menuList.some(
            (item) => item.caption === "Designation Management"
          ) && (
            <DesignationManagement
              tab="designation"
              userPermissionList={
                menuList.find(
                  (item) => item.caption === "Designation Management"
                )?.permissions
              }
            />
          )
        );

      case 8:
        return (
          menuList.some((item) => item.caption === "Question Frequency") && (
            <QuestionFrequency
              tab="frequency"
              userPermissionList={
                menuList.find((item) => item.caption === "Question Frequency")
                  ?.permissions
              }
            />
          )
        );

      case 13:
        return (
          menuList.some((item) => item.caption === "Question Frequency") && (
            <EmailNotificationsAndDueDate
            />
          )
        );

      case 9:
        return (

          <GHGProtocol
            tab="gwp"
            userPermissionList={
              menuList.find((item) => item.caption === "GHG Setup")
                ?.permissions
            }
          />

        );

      case 10:
        return (
          menuList.some((item) => item.caption === "Trigger") && <Triggers />
        );
      case 11:
        return <Emission />;
      case 12:
        return (
          <Unit
            tab="unit"
            userPermissionList={
              menuList.find((item) => item.caption === "Unit")?.permissions
            }
          />
        );


      default:
        return null;
    }
  };
  const [activebtnTab, setactivebtnTab] = useState(0);

  const handleTabClick = (index) => {
    setactivebtnTab(index);
  };

  useEffect(() => {
    const settingsMenu = JSON.parse(localStorage.getItem("menu"));
    const settingsObject = settingsMenu.find(
      (item) => item.caption === "Settings"
    );
    const settingsSubMenu = settingsObject ? settingsObject.sub_menu : [];
    if (isMounted.current) {
      setMenuList(settingsSubMenu);
    }
  }, [tab]);

  return (
    <PermissionMenuContext.Consumer>
      {() => (
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
            <div
              className="main_wrapper"
              style={{ width: sidebarExpanded ? "79vw" : "calc(100%)" }}
            >
              <div
                className="inner_wraapper px-3 pt-3 scroll-container w-100"
                style={{ width: "100%" }}
              >
                <div
                  className="d-flex justify-content-start buttoncont"
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
                  {menuList.some(
                    (item) => item.caption === "Profile Management"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 0 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(0)}
                        style={{ margin: "0 5px" }}
                      >
                        Profile
                      </button>
                    )}
                  {menuList.some(
                    (item) => item.caption === "Billing Management"
                  ) && companyId && companyId !== "345" && (
                      <button
                        className={`btn button ${activebtnTab === 1 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(1)}
                        style={{ margin: "0 5px" }}
                      >
                        Billing
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Lock Question"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 15 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(15)}
                        style={{ margin: "0 5px" }}
                      >
                        Lock Question
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "User Management"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 2 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(2)}
                        style={{ margin: "0 5px" }}
                      >
                        User
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Designation Management"
                  ) && (
                    <button
                      className={`btn button ${
                        activebtnTab === 7 ? "activebtn" : ""
                      }`}
                      onClick={() => handleTabClick(7)}
                      style={{ margin: "0 5px" }}
                    >
                      Designation
                    </button>
                  )}

                  {menuList.some(
                    (item) => item.caption === "Location Management"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 3 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(3)}
                        style={{ margin: "0 5px" }}
                      >
                        Location
                      </button>
                    )}

                  {/* {menuList.some(
                    (item) => item.caption === "Process Management"
                  ) && (
                    <button
                      className={`btn button ${
                        activebtnTab === 4 ? "activebtn" : ""
                      }`}
                      onClick={() => handleTabClick(4)}
                    >
                      Process
                    </button>
                  )} */}
                  {menuList.some(
                    (item) => item.caption === "Permission Management"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 5 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(5)}
                        style={{ margin: "0 5px" }}
                      >
                        Permission
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Create Org Chart"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 6 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(6)}
                        style={{ margin: "0 5px" }}
                      >
                        Chart
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Question Frequency"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 8 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(8)}
                        style={{ margin: "0 5px" }}
                      >
                        Frequency
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "GHG Setup"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 9 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(9)}
                        style={{ margin: "0 5px" }}
                      >
                        GHG Setup
                      </button>
                    )}
                  {menuList.some(
                    (item) => item.caption === "Question Frequency"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 13 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(13)}
                        style={{ margin: "0 5px" }}
                      >
                        Email Notifications
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Unit"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 12 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(12)}
                        style={{ margin: "0 5px" }}
                      >
                        Unit
                      </button>
                    )}


                  {menuList.some(
                    (item) => item.caption === "Emission"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 11 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(11)}
                        style={{ margin: "0 5px" }}
                      >
                        Emission
                      </button>
                    )}

                  {menuList.some(
                    (item) => item.caption === "Trigger"
                  ) && (
                      <button
                        className={`btn button ${activebtnTab === 10 ? "activebtn" : ""
                          }`}
                        onClick={() => handleTabClick(10)}
                        style={{ margin: "0 5px" }}
                      >
                        Trigger
                      </button>
                    )}
                </div>
                {renderUI()}
              </div>
            </div>
          </div>
        </div>
      )}
    </PermissionMenuContext.Consumer>
  );
};

export default Settings;
