import React, { useState } from "react";
import FilterIcon from "../../../../../img/Filter.svg"; // Ensure to replace with actual path
import "./TabContent.css"; // Ensure your CSS file contains necessary styles

const TabContent = ({
  handleShowFilter,
  activeTab,
  topicsData,
  contentType,
  onFilterClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showSelected, setShowSelected] = useState(false); // State to toggle between all and selected topics

  const getFilterType = (contentType) => {
    switch (contentType) {
      case "Mandatory Topic":
        return "MTOPIC";
      case "Voluntary Topic":
        return "VTOPIC";
      case "Custom Topic":
        return "CTOPIC";
      case "Mandatory KPI":
        return "MKPI";
      case "Voluntary KPI":
        return "VKPI";
      case "Custom KPI":
        return "CKPI";
      default:
        return "";
    }
  };

  const filterType = getFilterType(contentType);
  // Filter topics based on the search term
  const getFilteredTopics = (topics) => {
    if (!topics) return [];
    return topics.filter((topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get the correct topics based on the active tab
  let topics;
  switch (activeTab) {
    case "mandatory":
      topics = topicsData["mandatory_topics"];
      break;
    case "voluntary":
      topics = topicsData["voluntary_topics"];
      break;
    case "custom":
      topics = topicsData["custom_topics"];
      break;
    default:
      topics = [];
  }

  // Apply search filter
  const filteredTopics = getFilteredTopics(topics);

  // Handle checkbox change
  const handleCheckboxChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div
      className="w-100"
      style={{ backgroundColor: "#F4F7F8", borderRadius: "5px" }}
    >
      <div
        className="d-flex align-items-center justify-content-between mb-3 gap-container"
        style={{ paddingTop: "2%", paddingLeft: "4%", paddingRight: "4%" }}
      >
        <div
          className="d-flex align-items-center justify-content-between gap-container"
          style={{ width: "30%" }}
        >
          <button
            className={`btn ${!showSelected ? "btn-custom-selected" : "btn-custom"
              }`}
            style={{ width: "30%" }}
            onClick={() => setShowSelected(false)}
          >
            All
          </button>
          <button
            className={`btn ${showSelected ? "btn-custom-selected" : "btn-custom"
              }`}
            style={{ width: "60%" }}
            onClick={() => setShowSelected(true)}
          >
            Selected Topics
          </button>
        </div>

        <div
          className="d-flex gap-container"
          style={{ width: "65%", alignItems: "flex-start" }}
        >
          <input
            type="text"
            className="form-control custom-input"
            placeholder={`Search ${activeTab} topics`}
            value={searchTerm}
            style={{ width: "93%" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="filter-icon"
            style={{ padding: "6px", paddingLeft: "8px", paddingRight: "8px" }}
            onClick={() => handleShowFilter(filterType)}
          >
            <img src={FilterIcon} alt="Filter" />
          </div>
        </div>
      </div>

      <div className="topics-list mt-4" style={{ padding: "1% 4%" }}>
        <div className="grid-container">
          {(showSelected ? selectedTopics : filteredTopics).length > 0 ? (
            (showSelected ? selectedTopics : filteredTopics).map(
              (topic, index) => (
                <div className="grid-item" key={index}>
                  <div
                    style={{
                      width: "15%",
                      height: "100%", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => handleCheckboxChange(topic)}
                    />
                  </div>

                  <div style={{ width: "85%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    <label className="topic-label">{topic.title}</label>
                  </div>
                </div>
              )
            )
          ) : (
            <p>No {showSelected ? "selected" : activeTab} topics found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabContent;
