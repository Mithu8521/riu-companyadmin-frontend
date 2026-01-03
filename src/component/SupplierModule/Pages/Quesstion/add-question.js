import React from "react";
import Sidebar from "../../../sidebar/sidebar";
import Header from "../../../header/header";

export default function Addquestion() {
    return (
        <div>
            <Sidebar />
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
                                                            <div className="business_detail">
                                                                <div className="heading">
                                                                    <h4>Add Question</h4>
                                                                </div>
                                                                <hr className="line"></hr>

                                                                <div className="row">
                                                                    <div className="col-lg-12 col-xs-12">
                                                                        <div className="form-group">
                                                                            <label htmlFor="title" className="mb-2" >
                                                                                Question Title*
                                                                            </label>
                                                                            <input type="text" className="form-control py-3" id="title" placeholder="Enter Question Title (Max 500 Words)" name="title" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group py-3">
                                                                        <label htmlFor="question" className="mb-2" >
                                                                            Questions Description*
                                                                        </label>
                                                                        <textarea type="text" className="form-control" id="description" placeholder="Write Question Description (Max 5000 Words)" name="description" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="global_link mx-0 my-3">
                                                                <button type="submit" className="new_button_style" >
                                                                    ADD NOW
                                                                </button>
                                                            </div>
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
}