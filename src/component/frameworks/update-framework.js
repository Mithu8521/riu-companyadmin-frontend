import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useLocation } from "react-router-dom";
import "../Sector_Question_Manage/control.css";
import { frameworkService } from '../../_services/admin/global-controls/frameworkService';
import { apiCall } from "../../_services/apiCall";
import config from "../../../src/config/config.json";

export const EditFramework = (props) => {
  var currentLocation = window.location.pathname;
  let parts = currentLocation.split("/");
  let path = parts[2];
  const location = useLocation();
  const [title, setTitle] = useState(location?.state?.item?.title);
  // const [entity,setEntity] = useState(location?.state?.item?.entity);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.id = location?.state?.item?.id;
    obj.title = title;
    obj.company_id = location?.state?.item?.company_id;
    // obj.entity= entity;
    obj.framework_mapping_id = location?.state?.item?.framework_mapping_id;
    const { isSuccess } = await apiCall(`${config.API_URL}updateFramework`, {}, obj, "POST");
    if (isSuccess) {
      window.location.href = config.baseURL + "/#/frameworks"
    }
    // frameworkService.updateFramework(obj);
  }

  // const getFrameworkByID = async () => {
  // let data = await frameworkService.getFrameworkByID(path)
  // setTitle(data.data.title)
  // }

  // useEffect(() => {
  //   getFrameworkByID();
  // }, []);

  return (
    <div>

      <Sidebar dataFromParent={props.location.pathname} />
      <Header />
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
                                  <div className="row">
                                    {/* <div className="form-group col-6">
                                  <label htmlFor="question"  className="mb-2" > Entity </label>
                                    <select
                                      onChange={(e)=>{
                                        setEntity(e.target.value)
                                      }}
                                      name="entity"
                                      value={
                                        entity
                                      }
                                      className="select_one"
                                    >
                                      <option value="">Select Entity</option>
                                      <option value="company">Company</option>
                                      <option value="supplier">Supplier</option>
                                    </select>
                                  </div> */}
                                    <div className="form-group col-12">
                                      <label htmlFor="questionHeading" className="mb-2" >
                                        Framework Heading
                                      </label>
                                      <input type="text" className="form-control py-3" id=" questionHeading" value={title} placeholder="Enter Framework Heading" name="heading" onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button type="submit" className="new_button_style" >
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
