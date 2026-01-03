import React, { Component } from 'react';
import logo from "../../img/Zais_logo.png";
import './common.css';
import './sign.css'

export default class
    sign_egs extends Component {
    render() {
        return (
            <div>
                <section className="login">
                    <div className="login_part">
                        <div className="sing_log">
                            <div className="sing_one">
                                <img src={logo} />
                            </div>
                            <div className="text_sing">
                                <h4 className="Account">Create An Account Below</h4>
                                <p className="faster_oval">Please make sure you feel all informations for faster approval. Feel free to contact us incase you experience any issue</p>
                            </div>
                            <div className="ster_form">
                                <div className="make_form">
                                    <div className="form-group fg">
                                        <label className="st_name" for="name">Title or Position</label>
                                        <input className="form-control name_nf" id="name" type="text" name="Name" />
                                    </div>
                                </div>
                                <div className="make_form">
                                    <div className="form-group fg">
                                        <label className="st_name" for="name">Corporate Email</label>
                                        <input className="form-control name_nf" id="name" type="Email" name="Name" />
                                    </div>
                                </div>
                                <div className="make_form">
                                    <div className="form-group fg">
                                        <label className="st_name" for="name">Password</label>
                                        <input className="form-control name_nf" id="name" type="password" name="Name" />
                                    </div>
                                </div>
                                <div className="plform">
                                    <div className="form-check hompop">
                                        <input className="form-check-input deckle" type="checkbox" value="" id="flexCheckDefault" />
                                        <label className="form-check-label date_yup" for="flexCheckDefault">
                                            I agree to the platform data privacy consent, terms and conditions
                                        </label>
                                    </div>
                                </div>
                                <div className="make_form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group fg">
                                                <label className="st_name" for="name">Type the text</label>
                                                <input className="form-control name_nf" id="name" type="text" name="Name" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="glee">
                                                <div className="bacei">
                                                    <span className="number_dex">beeci</span>
                                                    <span className="number_dex">
                                                        <span className="refree"><i className="far fa-redo-alt"></i></span>
                                                        <span className="refree"><i className="fas fa-headphones-alt"></i></span>
                                                        <span className="refree"><i className="fal fa-info-circle"></i></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="view_bottoma">
                                    <a href="#">Submit</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}