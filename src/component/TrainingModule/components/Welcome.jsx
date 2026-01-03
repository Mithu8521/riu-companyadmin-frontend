import React, { useEffect, useState } from 'react'
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
function Welcome({setFinancialYearId,financialYearId}) {
  const [financialYear, setFinancialYear] = useState([]);


  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      const reversedData = [...parsedData].reverse();
      setFinancialYear(reversedData);
      
      if (reversedData.length) {
        setFinancialYearId(reversedData[0].id); // First item in reversed array is the last item of original
      }
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );
      
      if (isSuccess) {
        // Store the original (non-reversed) response in local storage
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Reverse the array for display purposes
        const reversedData = [...data.data].reverse();
        setFinancialYear(reversedData);
        
        if (reversedData.length) {
          setFinancialYearId(reversedData[0].id);
        }
      }
    }
  };

  useEffect(() => {
    getFinancialYear();
  }, []);
  // Inline CSS styles
const headerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "15px",
  marginBottom: "1em",
  marginRight: "3vw"
};
const headerTitleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
};
const createButtonStyle = {
  backgroundColor: "#3F88A5",
  color: "white",
  borderRadius: "22px",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
};
  return (
    <div className='text-center ' >
      <div style={headerContainerStyle}>
          <div style={headerTitleStyle}>Trainee Portal</div>
          <div>
            <select
              className="sector-question-select"
              value={
                financialYearId ||
                (financialYear.length > 0
                  ? financialYear[financialYear.length - 1].id
                  : "")
              }
              onChange={async (e) => {
                setFinancialYearId(e.target.value);
              }}
            >
              <option value={0}>Select Financial Year</option>
              {financialYear?.map((item, key) => (
                <option key={key} value={item.id}>
                  {item.financial_year_value}
                </option>
              ))}
            </select>
          </div>
        </div>
    </div>
  )
}

export default Welcome
