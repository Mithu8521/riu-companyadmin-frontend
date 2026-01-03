import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import Esgdownload from "../../Component/ESGDownload/esgdownload";
import TabsComponent from "../../../TabsComponent/tabs";

const Dashboard = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const firstName = currentUser?.first_name;
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const [financialYear, setFinancialYear] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [timePeriods, setTimePeriods] = useState({})
  const [locationOption, setLocationOption] = useState();
  const [framework, setFramework] = useState();
  const [toDate, setToDate] = useState("")
  const [keyTab, setKeyTab] = useState("combinedAll")
  const [currentTab, setCurrentTab] = useState(0)
  const [compareLastTimePeriods, setcompareLastTimePeriods] = useState({})
  const [lastYearGraphData, setLastYearGraphData] = useState('')
  const [compareTCurrentimePeriods, setcompareCurrentTimePeriods] = useState({})
  const isMounted = useRef(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  // const [data,setData] = useState(start)

  useEffect(() => {
    setTimePeriods(compareTCurrentimePeriods)
  }, [compareTCurrentimePeriods]);

  const [financialYearId, setFinancialYearId] = useState("");
  const [graphData, setGraphData] = useState("");
  const [sectorQuestionAnswerDataForGraph, setSectorQuestionAnswerDataForGraph] = useState([]);
  const [permissionGraph, setPermissionGraph] = useState([]);
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [todaysActivities, setTodaysActivities] = useState([]);
  const [energyData, setEnergyData] = useState();
  const [energyTriggerData, setTiggerEnergyData] = useState();
  const [emissionTriggerData, setTiggerEmissionData] = useState();
  const [usersActivity, setUsersActivitys] = useState([]);

  const getTotalTrainingData = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getTotalTrainingData`,
          {},
          { financialYearId },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          // Process data if request was successful
          const updatedData = data?.data
            ?.map((item) => {
              if (!item) return null; // drop null/undefined

              if (item.questionId === 301 || item.questionId === 310) {
                return {
                  ...item,
                  answer: item?.answer?.map((answerItem) => {
                    const value = answerItem?.[0];
                    const unit = answerItem?.[1];

                    if (!isNaN(value) && value !== "No") {
                      return [parseFloat(value) / 1000, unit];
                    } else {
                      return answerItem;
                    }
                  }) ?? [],
                };
              }

              return item;
            })
            .filter(Boolean); // removes nulls

          setGraphData(updatedData); // Set the modified data to state
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };

    const getTotalTrainingDataLastYear = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getTotalTrainingData`,
          {},
          { financialYearId:financialYear[financialYear.length - 2].id },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          // Process data if request was successful
          const updatedData = data?.data
            ?.map((item) => {
              if (!item) return null; // drop null/undefined

              if (item.questionId === 301 || item.questionId === 310) {
                return {
                  ...item,
                  answer: item?.answer?.map((answerItem) => {
                    const value = answerItem?.[0];
                    const unit = answerItem?.[1];

                    if (!isNaN(value) && value !== "No") {
                      return [parseFloat(value) / 1000, unit];
                    } else {
                      return answerItem;
                    }
                  }) ?? [],
                };
              }

              return item;
            })
            .filter(Boolean); // removes nulls

          setLastYearGraphData(updatedData); // Set the modified data to state
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };

  const getTriggerEnvironmentData = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getTriggerEnvironmentData`,
          {},
          { financialYearId },
          "GET"
        );

        if (isSuccess && isMounted.current) {
          setTiggerEnergyData(data?.data?.energyData)
          setTiggerEmissionData(data?.data?.emissionData)
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
      }
    }
  };

  const getTotalEnergyData = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getEnvironmentData`,
          {},
          { financialYearId },
          "GET"
        );

        if (isSuccess) {
          setEnergyData(data?.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
      }
    }
  };



  

  const getPermissionGraphWithAssignedQuestions = async () => {
    if (financialYearId) {
      try {
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getPermissionGraphWithAssignedQuestions`,
          {},
          { financialYearId },
          "GET"
        );

        if (isSuccess) {
          setPermissionGraph(data?.data);
        }
      } catch (error) {
        console.error("Error fetching total training data:", error);
        // Optionally, handle any error states here (e.g., show an error message)
      }
    }
  };

  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL", userId: JSON.parse(localStorage.getItem("user_temp_id")) }
    );
    if (isSuccess && isMounted.current) {

      setFrameworkValue(data?.data);
    }
  };

  const downloadFile = async (pdfFilePath, fileName) => {
    try {
      const response = await fetch(process.env.PUBLIC_URL + pdfFilePath);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
      setShow(false);
    } catch (error) {
      console.error(`Error fetching the PDF file (${fileName}):`, error);
    }
  };

  const downloadPdf = async (type) => {
    const pdfFilePath1 = "/BRSR.pdf";
    const pdfFilePath2 = "/BRSR.docx";
    if (type === 'PDF') {
      await downloadFile(pdfFilePath1, "BRSR.pdf");
    } else {
      await downloadFile(pdfFilePath2, "BRSR.docx");
    }
  };

  const todaysActivity = async () => {
    const locationIds = locationOption
      .filter(item => item.id !== undefined)
      .map(item => item.id);
    if (locationIds.length) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}todaysActivity`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId: financialYearId,
          locationIds
        },
        "GET"
      );
      if (isSuccess) {
        setTodaysActivities((data?.data).reverse());
      }
    }
  };

  const usersActivities = async () => {
    const locationIds = locationOption
      .filter(item => item.id !== undefined)
      .map(item => item.id);
    if (locationIds.length) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}usersActivity`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId: financialYearId,
          locationIds
        },
        "GET"
      );
      if (isSuccess) {
        setUsersActivitys((data?.data));
      }
    }
  };

  useEffect(() => {
    if (fromDate && toDate && financialYearId && locationOption && locationOption.length) {
      todaysActivity();
      usersActivities();
    }
  }, [fromDate, toDate, financialYearId, locationOption]);


  useEffect(() => {
    fetchFrameworkApi();
    getTotalTrainingData();
    getTotalTrainingDataLastYear();
    getTotalEnergyData();
    getTriggerEnvironmentData();
    getPermissionGraphWithAssignedQuestions();
  }, [financialYearId]);

  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };

  return (
    <div className="d-flex flex-row mainclass" style={{ height: "100vh", overflow: "auto" }}>
      <div style={{ flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999, transition: "flex 0.3s ease" }}>
        <Sidebar dataFromParent={props.location.pathname} onSidebarToggle={handleSidebarToggle} />
      </div>
      <div style={{
        flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
        transition: "flex 0.3s ease"
      }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper" style={{ width: sidebarExpanded ? "79vw" : "calc(100%)" }}>
          {/* <div className="inner_wraapper p-1">
            <div className="text-center mb-2">
              <h5 style={{ color: "black", paddingTop: "20px" }}>
                <p className="welcome">Welcome back, {firstName} </p>
              </h5>
              <div style={{ fontSize: "13px" }}>Monitor your report progress here</div>
            </div>
          </div> */}
          <div className="inner_wraapper" style={{ width: "100%", paddingTop: "10px" }}>
            <Esgdownload currentTab={currentTab} setKeyTab={setKeyTab} keyTab={keyTab} framework={framework} frameworkValue={frameworkValue} setFramework={setFramework} setLocationOption={setLocationOption} setTimePeriods={setTimePeriods} setFinancialYearId={setFinancialYearId}
              setFromDate={setFromDate} setToDate={setToDate} financialYear={financialYear} setFinancialYear={setFinancialYear} show={show} handleClose={handleClose} downloadPdf={downloadPdf} downloadFile={downloadFile} setShow={setShow} financialYearId={financialYearId}
              setcompareLastTimePeriods={setcompareLastTimePeriods} setcompareCurrentTimePeriods={setcompareCurrentTimePeriods} compareLastTimePeriods={compareLastTimePeriods} compareTCurrentimePeriods={compareTCurrentimePeriods} />
          </div>
          <div className="tabs w-100 " style={{ width: sidebarExpanded ? "79vw" : "calc(100%)" }}>
            <TabsComponent
              permissionGraph={permissionGraph}
              keyTab={keyTab}
              setCurrentTab={setCurrentTab}
              setKeyTab={setKeyTab}
              emissionTriggerData={emissionTriggerData}
              framework={framework} fromDate={fromDate} toDate={toDate} financialYearId={financialYearId} locationOption={locationOption} timePeriods={timePeriods} graphData={graphData} frameworkValue={frameworkValue} sectorQuestionAnswerDataForGraph={sectorQuestionAnswerDataForGraph}
              todaysActivities={todaysActivities} compareLastTimePeriods={compareLastTimePeriods} compareTCurrentimePeriods={compareTCurrentimePeriods} financialYear={financialYear} energyData={energyData} energyTriggerData={energyTriggerData}
              usersActivity={usersActivity} lastYearGraphData={lastYearGraphData} />
          </div>
        </div>
      </div>
    </div>


  );
};

export default Dashboard;
