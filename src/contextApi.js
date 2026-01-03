import React from "react";
import { useState } from "react";

export const DataContext = React.createContext();

export const ContextDataProvider = ({ children }) => {
  const [selectedFrameworkData, setSelectedFrameworkData] = useState([]);
  const [selectedTopicsData, setSelectedTopicsData] = useState([]);
  const [SelectedKpiData, setSelectedKpiData] = useState([]);
  const [selectedKpiMappingData, setSelectedKpiMappingData] = useState([]);
  const [selectedFrameworkMappingData, setSelectedFrameworkMappingData] = useState([]);
  const [slectedTopicsMappingData, setSelectedTopicMappingData] = useState([]);


  return (
    <DataContext.Provider
      value={{
        selectedFrameworkData,
        setSelectedFrameworkData,
        selectedTopicsData,
        setSelectedTopicsData,
        SelectedKpiData,
        setSelectedKpiData,
        selectedKpiMappingData,
        setSelectedKpiMappingData,
        selectedFrameworkMappingData,
        setSelectedFrameworkMappingData,
        slectedTopicsMappingData,
        setSelectedTopicMappingData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
