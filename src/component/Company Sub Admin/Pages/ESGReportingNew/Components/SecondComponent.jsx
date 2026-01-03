import React from "react";
import "./FrameworkSelector.css";
import { useState, useEffect } from "react";

const SecondComponent = ({
  frameworkValue,
  setFrameworkValue,
  selectedFramework,
  setSelectedFramework,
  selectedTopics,
  setSelectedTopics,
  setTopicsData,
  selectedFrameworks,
  setSelectedFrameworks,
  onSelectFrameworkHandler,
  onRemoveFrameworkHandler,
}) => {

  useEffect(() => {
    setSelectedFrameworks(frameworkValue);
  }, [frameworkValue]);

  useEffect(() => {
    setSelectedFrameworks(selectedFramework);
  }, [selectedFramework]);

  const handleRemoveFramework = (framework) => {
    const updatedFrameworks = selectedFrameworks.filter(
      (f) => f.id !== framework.id
    );
    setSelectedFrameworks(updatedFrameworks);
    setSelectedFramework(updatedFrameworks);
    onRemoveFrameworkHandler(updatedFrameworks);
  };
  const handleAddFramework = () => {
    const newFramework = { id: "NEW", title: "New Framework" };
    const updatedFrameworks = [...selectedFrameworks, newFramework];
    setSelectedFrameworks(updatedFrameworks);
    setSelectedFramework(updatedFrameworks);
    setFrameworkValue((prevFrameworks) => [...prevFrameworks, newFramework]);
    onSelectFrameworkHandler(updatedFrameworks);
  };
  return (
    <div className="framework-selector">
      <div className="framework-options">
        {selectedFrameworks?.map((framework) => (
          <div key={framework.id} className="framework-item">
            <span className="framework-label">{framework.title}</span>
            {selectedFrameworks.length > 1 && (
              <button
                className="remove-button"
                onClick={() => handleRemoveFramework(framework)}
              >
                &minus;
              </button>
            )}
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
};

export default SecondComponent;
