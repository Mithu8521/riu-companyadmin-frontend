import React from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../../../sidebar/sidebar"
import Header from "../../../../header/header";
import Table from "react-bootstrap/Table";


export default function SupplierCompany(props) {
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
                                                        <div className="heading">
                                                            <h4>Company Listing</h4>
                                                            <div className="form-group has-search one">
                                                                <span className="fa fa-search form-control-feedback"></span>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Search Company Name"
                                                                    name="search"
                                                                    onChange={(e) =>
                                                                        this.applyGlobalSearch(e)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr className="line"></hr>
                                                        <div className="saved_cards">
                                                            <div className="table_f">
                                                                <Table striped bordered hover size="sm">
                                                                    <thead>
                                                                        <tr className="heading_color">
                                                                            <th style={{ width: "5%" }}>ID.</th>
                                                                            <th>COMPANY NAME</th>
                                                                            {/* <th>COUNTRY</th> */}
                                                                            <th>BUSINESS NUMBER</th>
                                                                            <th>INDUSTRY</th>
                                                                            {/* <th>CATEGORY</th> */}
                                                                            <th>STATUS</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>1</td>
                                                                            <td><NavLink to="/supplierCompany/companyDetail"><b>Company Admin Testing</b></NavLink></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>2</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>3</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>4</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>5</td>
                                                                            <td><b>Company Admin Testing</b></td>

                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>6</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>7</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>8</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>9</td>
                                                                            <td><b>Company Admin Testing</b></td>
                                                                            {/* <td>Afghanistan</td> */}
                                                                            <td>23534</td>
                                                                            <td>Apparel, Accessories & Footwear</td>
                                                                            {/* <td>Business Account</td> */}
                                                                            <td>
                                                                                <NavLink className="non_underline_link bold view_c" to="/frameworklist" >
                                                                                    non_underline_link bold view_c
                                                                                </NavLink>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
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