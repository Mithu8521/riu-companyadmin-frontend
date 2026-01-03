import React, { useState } from 'react'
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useLocation } from "react-router-dom";
import { frameworkService } from '../../_services/admin/global-controls/frameworkService';
import { apiCall } from '../../_services/apiCall';
import config from "../../../src/config/config.json";

export const CreateFramework = (props) => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [entity, setEntity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.title = title;
    // obj.entity=entity
    // frameworkService.createFramework(obj)
    const { isSuccess, data } = await apiCall(`${config.API_URL}createFramework`, {}, obj, "POST");
    if (isSuccess) {
      setTitle("");
      window.location.href = config.baseURL + "/#/frameworks"
    }
  }
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
                                  {/* <div className="heading">
                                  <h4>Create Framework</h4>
                                </div>
                                <hr className="line"></hr> */}
                                  <div className="row">
                                    <div className="form-group col-12">
                                      <label htmlFor="question" className="mb-2" > Framework </label>
                                      <textarea type="text" className="form-control" placeholder="Write Framework title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
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
                                  </div>
                                </div>
                                <div className="global_link mx-0 my-3">
                                  <button type="submit" className="new_button_style" >Save</button>
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
