import React, { useState, useEffect } from "react";
import { Form, Placeholder, Table } from "react-bootstrap";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import viewFramework from "../../../../img/sector/viewFramework.png";
import addQuestion from "../../../../img/sector/addQuestion.png";

const GlobalControlFinancialYear = (props) => {
  const { handleFrameworkChangeHandler } = props;
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [financialYearData, setFinancialYearData] = useState([]);
  const [financialYear, setFinancialYear] = useState("India");
  const [data, setData] = useState("");

  useEffect(() => {
    getFinancialYearData();
  }, [selectedCountry]);

  const getFinancialYearData = async (tmpIsoCode) => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    const userId = JSON.parse(localStorage.getItem("user_temp_id"));
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      const parsedData = JSON.parse(storedData);
      setFinancialYearData(parsedData);
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        { userId: userId }
      );
      
      if (isSuccess) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data?.data));
        
        // Set state with the API response
        setFinancialYearData(data?.data);
      }
    }
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setFinancialYear(countryName);
  };

  const handleClickComponent = (data, activeTab) => {
    setData(data);
    handleFrameworkChangeHandler(data, activeTab);
  };

  return (
    <div>
      <div className="business_detail">
        <div className="hstack justify-content-between">
          <h6>
            <strong> Global Control & Manage</strong>
          </h6>
          <div className="hstack gap-3 mb-2">
            <Form.Label className="w-75 m-0">
              <div style={{ whiteSpace: "nowrap" }}>Selected Country :</div>{" "}
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {/* {countriesData.map((country, index) => (
                <option key={index}>{country.name}</option>
              ))} */}
              <option value="">India</option>
            </Form.Control>
          </div>
          <div className="heading mb-2">
            <Form.Control
              type="text"
              disabled
              value={financialYear}
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="saved_cards border-top">
        <div className="table_f table-responsive mt-2 fianncial_year_table_hight">
          <Table striped bordered className="mb-0">
            <thead>
              <tr className="fixed_tr_section">
                <th style={{ width: 55 }}>Sr</th>
                <th>Financial Year</th>
                <th style={{ width: 70, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {financialYearData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Placeholder animation="glow">
                      {item.financial_year_value}
                    </Placeholder>
                  </td>
                  <td className="d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center gap-3 action__image">
                      <div
                        onClick={(e) =>
                          handleClickComponent(item, "supplierquestionList")
                        }
                      >
                        <img
                          className="w-100"
                          style={{ cursor: "pointer" }}
                          src={addQuestion}
                          alt="Add Assessment Question"
                          title="Add Assessment Question"
                        />
                      </div>
                      <div
                        onClick={(e) => handleClickComponent(item, "framework")}
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={viewFramework}
                          alt="View Framework"
                          title="View Framework"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default GlobalControlFinancialYear;
