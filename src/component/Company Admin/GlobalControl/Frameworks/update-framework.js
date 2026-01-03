import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
import { useLocation } from "react-router-dom";
import "../../../Sector_Question_Manage/control.css";
import { frameworkService } from '../../../../_services/admin/global-controls/frameworkService';
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
// import { companyService } from '../../_services/admin/global-controls/companyService';

export const EditFramework = () => {
  // var currentLocation = window.location.pathname;
  // let parts = currentLocation.split("/");
  // let path = parts[2];
  const location = useLocation();
  const [data] = useState(location?.state?.item);
  const [title, setTitle] = useState(data?.title);
  // const [selectedCompany, setSelectedCompany] = useState(0);
  // const [company, setCompany] = useState([]);
  // const [entity, setEntity] = useState(data?.entity);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.id = data.id;
    obj.title = title;
    // obj.entity = entity;
    // frameworkService.updateFramework(obj);
    const { isSuccess } = await apiCall(`${config.ADMIN_API_URL}updateFramework`, {}, obj, "POST");
    if (isSuccess) {
      window.location.href = config.baseURL + `/#/frameworks`;
    }
  }
  // const getCompanyData = async () => {
  //   let response = await companyService.getCompany();
  //   setCompany(response?.data);
  // };
  // const getFrameworkByID = async () => {
  //   let data = await frameworkService.getFrameworkByID(path)
  //   setTitle(data.data[0].title)
  //   setSelectedCompany(data.data[0].company_id)
  //   setFrameworkMappingId(data.data[0].framework_mapping_id)
  // }


  // const handleCompanyChange = async (e) => {
  //   let val = e.target.value
  //   setSelectedCompany(val)
  // }


  useEffect(() => {
    // getFrameworkByID();
    // getCompanyData()
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
                                  <div className="heading">
                                    <h4>Update Framework</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="form-group">
                                    <label htmlFor="questionHeading" className="mb-2" >
                                      Framework Heading
                                    </label>
                                    <input type="text" className="form-control py-3" id=" questionHeading" value={title} placeholder="Enter Framework Heading" name="heading" onChange={(e) => setTitle(e.target.value)} />
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button type="submit" className="page_width page_save" >
                                    UPDATE NOW
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
  )
}
