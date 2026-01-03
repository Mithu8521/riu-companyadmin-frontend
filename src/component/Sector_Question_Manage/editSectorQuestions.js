import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useLocation } from "react-router-dom";
import "../Sector_Question_Manage/control.css";
import { sectorQuestionService } from "../../_services/admin/global-controls/sectorQuestionService";

export const EditSectorQuestions = () => {
  var currentLocation = window.location.pathname;
  let parts = currentLocation.split("/");
  let path = parts[2];
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    let obj = {};
    obj.uuid = path;
    obj.title = title;
    obj.heading = heading;
    sectorQuestionService.updateTopic(obj)
  }

  const getQuestionByID = async () => {
    let data = await sectorQuestionService.getQuestionByID(path)
    setTitle(data.data.title)
    setHeading(data.data.heading)
  }

  useEffect(() => {
    getQuestionByID();
  }, []);
  return (
    <div>
      <Sidebar dataFromParent={location.pathname} />
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
                                    <h4>Update Sector Question</h4>
                                  </div>
                                  <hr className="line"></hr>
                                  <div className="row">
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group">
                                        <label htmlFor="questionHeading" className="mb-2" >
                                          Question Heading
                                        </label>
                                        <input type="text" className="form-control py-3" id=" questionHeading" value={heading} placeholder="Enter Sector Question Heading" name="heading" onChange={(e) => setHeading(e.target.value)} />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-xs-6">
                                      <div className="form-group">
                                        <label htmlFor="questionTitle" className="mb-2" >
                                          Question Title
                                        </label>
                                        <input type="text" className="form-control py-3" id=" questionTitle" value={title} placeholder="Enter Sector Question Title" name="Title" onChange={(e) => setTitle(e.target.value)} />
                                      </div>
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
