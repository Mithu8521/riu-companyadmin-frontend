import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/sidebar'
import Header from "../header/header"
import config from "../../config/config.json"
import { apiCall } from '../../_services/apiCall'
import Welcome from './components/Welcome'
import TrainingTable from './components/TrainingTable'
import Resedule from './components/Resedule'

const TraineeeModule = (props) => {
  const [financeObjct, setFinanceObjct] = useState();
     const [sidebarExpanded, setSidebarExpanded] = useState(true);
    
    const handleSidebarToggle = (isOpen) => {
      setSidebarExpanded(isOpen);
    };
    const getFinancialYear = async () => {
      // Check if data exists in local storage
      const storedData = localStorage.getItem('financialYearData');
      
      if (storedData) {
        // Data exists in local storage, parse and use it
        const parsedData = JSON.parse(storedData);
        const lastEntry = parsedData[parsedData.length - 1];
        setFinanceObjct(lastEntry.id);
        return lastEntry.id;
      } else {
        // Data not in local storage, call API
        const { isSuccess, data } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
          {},
          {}
        );
        
        if (isSuccess) {
          // Store the response in local storage for future use
          localStorage.setItem('financialYearData', JSON.stringify(data.data));
          
          // Set state and return value
          setFinanceObjct(data.data[data.data.length - 1].id);
          return data.data[data.data.length - 1].id;
        }
      }
    };

  useEffect(() => {
    getFinancialYear()

  }, [])

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
 <div
        style={{
         flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999,transition: "flex 0.3s ease"
        }}
      >
        <Sidebar
        
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle} 
        />
      </div>

      {/* Main Content */}
      <div style={{flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease" , minHeight: "100vh", overflowY: "auto" }}>
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
          >
          </div>
          <div className="w-100 p-4 ">
            {/* <Welcome /> */}
            <TrainingTable />
            {/* <Resedule/> */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default TraineeeModule
