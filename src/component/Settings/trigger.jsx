import React from "react";
import { useState, useEffect } from "react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import EnergyAccordion from "./energyaccordion";

const Trigger = () => {
  const [activebtnTab, setActivebtnTab] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const [data, setData] = useState();

  const getSetTargetQuestion = async () => {
    try {
      const response = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSetTargetQuestion`,
        {},
        {},
        "GET"
      );
      if (response.isSuccess) {
        const dataa = response.data.data;
        setData(dataa);

        if (dataa && dataa.length > 0) {
          setSelectedQuestions(dataa[0].questions || []);
          setSelectedItem(dataa[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getSetTargetQuestion();
  }, []);

  const renderContent = () => {
    switch (activebtnTab) {
      case 0:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 1:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 2:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 3:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 4:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 5:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 6:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 7:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 8:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 9:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      case 10:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 11:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 12:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 13:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 14:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 15:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );
      case 16:
        return (
          <EnergyAccordion item={selectedItem} questions={selectedQuestions} />
        );

      default:
        return <div>Select a module to view its content</div>;
    }
  };

  useEffect(() => {
    renderContent();
  }, [selectedQuestions]);
  const handleTabClick = (index, item, questions) => {
    setSelectedQuestions(questions);
    setSelectedItem(item);
    setActivebtnTab(index);
    // Set questions for the selected module
  };
  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        width: "100%",
        padding: "2rem",
        overflow: "auto"
      }}
    >
      <div
        className="d-flex justify-content-between buttoncont"
        style={{ marginBottom: "25px", width: "71vw", overflow: "auto", gap: "10px" }}

      >
        {data &&
          data.length &&
          data.map((item, index) => {
            // Helper function to filter out "Module" and "Management" from the module name
            const formatModuleName = (name) => {
              return name
                .split(" ")
                .filter((word) => word !== "Module" && word !== "Management")
                .join(" ");
            };

            return (
              <button
                key={index}
                className={`btn button ${activebtnTab === index ? "activebtn" : ""
                  }`}
                onClick={() => handleTabClick(index, item, item.questions)}
                style={{ width: "15%" }}
              >
                {formatModuleName(item.moduleName)}
              </button>
            );
          })}
      </div>
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default Trigger;
