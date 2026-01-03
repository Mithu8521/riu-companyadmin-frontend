import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
import { useLocation } from "react-router-dom";
// import { companyService } from "../../_services/admin/global-controls/companyService";
// import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import "./framework.css";
// import axios from "axios";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
// import Swal from "sweetalert2";

export const CreateFramework = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [financialYear, setFinancialYear] = useState([]);
  const [financialYearId, setFinancialYearId] = useState("");
  // const [selectedCompany, setSelectedCompany] = useState(0);
  // const [company, setCompany] = useState([]);
  // const [entity, setEntity] = useState("company");
  // const [selectedItems, setSelectedItems] = useState([]);
  // const [showdropdown, setShowDropDown] = useState(false);
  const [token] = useState(JSON.parse(localStorage.getItem("currentUser")));

  // const callApi = async () => {
  //   let response = await companyService.getCompany();
  //   setCompany(response?.data);
  // };
  const [selectedValue, setSelectedValue] = useState('Yes');
  const getFinancialYear = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.ADMIN_API_URL}getFinancialYear`,
      {},
      { type: "SUPER_ADMIN", entity: 2 }
    );

    if (isSuccess) {
      setFinancialYear(data.data);
      if (data?.data?.length == 1) {
        setFinancialYearId(data.data[0].id);

      }
    }
  };
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isSuccess, data } = await apiCall(
      `${config.ADMIN_API_URL}createFramework`,
      {},
      {
        title: title,
        financial_year_id: financialYearId
      },
      "POST"
    );
    if (isSuccess) {
      setTitle("");
      window.location.href = config.baseURL + "/#/frameworks";
    }
    // axios
    //   .post(
    //     `${config.ADMIN_API_URL}createFramework`,
    //     {
    //       // company_id: selectedItems,
    //       // created_by: 1,
    //       title: title,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token?.data?.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     Swal.fire({
    //       icon: "success",
    //       title: response.data.customMessage,
    //       showConfirmButton: true,
    //       timer: 1000
    //     });
    //     // setEntity("");
    //     // setCompany([]);
    //     setTitle("");
    //     // setSelectedItems([]);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     Swal.fire({
    //       icon: "error",
    //       title: error.response.data.customMessage,
    //       showConfirmButton: true,
    //       timer: 1000
    //     });
    //   });
  };
  useEffect(() => {
    getFinancialYear();
  }, []);
  return (
    <div>
      <AdminSidebar dataFromParent={location.pathname} />
      <AdminHeader />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="col-sm-12">
                      <div className="color_div_on framwork_2">
                        <div className="business_detail">
                          <div className="">
                            <div className="saved_cards">
                              <form name="form" onSubmit={handleSubmit}>
                                <div className="business_detail">
                                  {/* <div className="heading">
                                  <h4>Create Framework</h4>
                                </div>
                                <hr className="line"></hr> */}
                                  <div className="row">
                                    {/*<div className="form-group col-6">
                                      <label htmlFor="industryType" className="mb-2">
                                        Select Company
                                      </label>
                                      <div className="dropdown__sectoon">
                                        <div
                                          className="drop__down__menu"
                                          onClick={() => {
                                            setShowDropDown(!showdropdown);
                                            callApi();
                                          }}
                                        >
                                          Select Company Name
                                        </div>
                                        {showdropdown && (
                                          <div className="select__dropdown__wrapper">
                                            <label>
                                              <input
                                                type="checkbox"
                                                style={{ color: "#777777" }}
                                                value={0}
                                                checked={
                                                  selectedItems.length === company.length + 1
                                                }
                                                onChange={(event) => {
                                                  if (event.target.checked) {
                                                    setSelectedItems(
                                                      company.map((item) => item.id)
                                                    );
                                                    setSelectedItems((prevState) => [
                                                      ...prevState,
                                                      0,
                                                    ]);
                                                  } else {
                                                    setSelectedItems([]);
                                                  }
                                                }}
                                              />
                                              All
                                            </label>
                                            {company &&
                                              company?.map((item, key) => {
                                                return (
                                                  <label
                                                    key={key}
                                                    style={{ color: "#777777 !important" }}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      value={item?.id}
                                                      checked={selectedItems.includes(item?.id)}
                                                      onChange={(event) => {
                                                        if (event.target.checked) {
                                                          setSelectedItems([
                                                            ...selectedItems,
                                                            item?.id,
                                                          ]);
                                                        } else {
                                                          setSelectedItems(
                                                            selectedItems.filter(
                                                              (id) => id !== item?.id
                                                            )
                                                          );
                                                        }
                                                      }}
                                                    />
                                                    {item?.register_company_name}
                                                  </label>
                                                );
                                              })}
                                          </div>
                                        )}
                                      </div>
                                            </div>*/}
                                    <div className="d-flex dropdown align-items-center gap-2">
                                      <p className="m-0">Financial Year :</p>
                                      {financialYear &&
                                        financialYear?.length === 1 ? (
                                        <select
                                          className="select_one_all"
                                          onChange={async (e) => {
                                            if (
                                              e.target.value !==
                                              "Select Financial Year"
                                            ) {
                                              setFinancialYearId(
                                                e.target.value
                                              );
                                            } else {
                                              setFinancialYearId("");
                                            }
                                          }}
                                        >
                                          {financialYear?.map((item, key) => (
                                            <option key={key} value={item.id}>
                                              {item.financial_year_value}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <select
                                          className="select_one_all"
                                          onChange={async (e) => {
                                            if (
                                              e.target.value !==
                                              "Select Financial Year"
                                            ) {
                                              setFinancialYearId(
                                                e.target.value
                                              );
                                            } else {
                                              setFinancialYearId("");
                                            }
                                          }}
                                        >
                                          <option>
                                            Select Financial Year
                                          </option>
                                          {financialYear?.map((item, key) => (
                                            <option key={key} value={item.id}>
                                              {item.financial_year_value}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    </div>
                                    <div className="form-group col-12">
                                      <label
                                        htmlFor="question"
                                        className="mb-2"
                                      >
                                        {" "}
                                        Framework{" "}
                                      </label>
                                      <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder="Write Framework title"
                                        value={title}
                                        onChange={(e) =>
                                          setTitle(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                    {/* <div>
                                      <label htmlFor="dropdown">
                                        Select an option:
                                      </label>
                                      <select
                                        id="dropdown"
                                        value={selectedValue}
                                        onChange={handleDropdownChange}
                                      >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </select>
                                      <p>Selected option: {selectedValue}</p>
                                    </div> */}
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button
                                    type="submit"
                                    className="page_width page_save"
                                  >
                                    Save
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
