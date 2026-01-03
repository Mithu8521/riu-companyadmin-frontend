"use client";
import Header from "../../header/header";
import Sidebar from "../../sidebar/sidebar";
import { useState } from "react";
import Scopes from "./Scopes";

const MainScope = (props) => {
  console.log(props,"propsprops")
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          flex: sidebarExpanded ? "0 0 21%" : "0 0 60px",
          position: "sticky",
          top: 0,
          zIndex: 999,
          transition: "flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: sidebarExpanded
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            : "none",
        }}
      >
        <Sidebar
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle}
        />
      </div>
      <div
        style={{
          flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "100vh",
          overflowY: "auto",
          backgroundColor: "#f1f5f9",
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            background: "rgba(255, 255, 255, 0.95)",
            
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <Header />
        </div>
        <Scopes scopeType = {props.scopeType}/>
      </div>
    </div>
  );
};

export default MainScope;
