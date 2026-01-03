import React, { Component } from 'react';

export default class Leadership_Governance extends Component {
    render() {
        return (
            <div>
                <div className="row setup-content" id="step-11">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between">
                            <h6 className="back_quninti back_quninti_2"><a className="back_text" href="#"><span className="step_icon"><i className="far fa-long-arrow-alt-left"></i></span>Back</a></h6>
                            <h6 className="back_quninti back_quninti_2"><a className="back_text" href="#"><span className="step_icon"></span>Next<i className="far fa-long-arrow-alt-right"></i></a></h6>
                        </div>
                        <div className="Capital_op">
                            <h4 className="E_capital">Leadership & Governance</h4>
                            <div className="heading_h3 mb-3">
                                <span className="gement">Competitive Behavior</span>
                            </div>
                            <div className="form-floating">
                                <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                                <label htmlFor="floatingTextarea" className="energy">Q: To what anti-competitive behavior regulations is the company subject? How does the company ensure compliance with these regulations?</label>
                            </div>
                            <div className="sve_next">
                                <button className="page_save page_width" type="button">SAVE AS DRAFT</button>
                                <button className="page_save_green page_width" type="button">
                                    <span><i className="fa fa-check"></i></span>
                                    DRAFT SAVED
                                </button>
                            </div>
                            {/* <div className="manag">
                                <h3 className="energy">Q: To what anti-competitive behavior regulations is the company subject? How does the company ensure compliance with these regulations?</h3>
                                <p className="sumption">The company managing energy consumption</p>
                                <hr className="related"/>
                            </div> */}
                        </div>
                        {/* <div className="sve_next">
                            <button className="page_save" type="button">Save</button>
                            <button className="btn btn-indigo btn-rounded nextBtn float-right next_page" type="button">Next</button>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}
