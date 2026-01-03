import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../sidebar/admin_sidebar";
import AdminHeader from "../../../header/admin_header";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import { PermissionContext } from "../../../../context/PermissionContext";
import { authenticationService } from "../../../../_services/authentication";

const ManageAndControls = (props) => {
  const [menuList, setMenuList] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(item => item?.url === "global_controls");
    setMenuList(settingsMenu?.permissions);
  }, []);

  return (
    <PermissionContext.Consumer>
      {({ permissions }) => (
        <div>
          <AdminSidebar dataFromParent={props.location.pathname} />
          <AdminHeader />
          <div className="main_wrapper">
            <div className="inner_wraapper">
              <div className="color_div_on framwork_2">
                <div className="business_detail">
                  {/* <div className="d-flex align-items-center justify-content-between border-bottom mb-2">
                    <div className="heading">
                      <h4 className="mb-2">Global Control & Manage</h4>
                    </div>
                  </div> */}
                  <div className="saved_cards">
                    <div className="table_f table-responsive">
                      <Table bordered striped>
                        <thead>
                          <tr className="heading_color">
                            <th>Global Controls</th>
                            <th style={{ width: "5%" }}>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {menuList?.includes() && (
                            <tr>
                              <td>Manage Industry Lists & Industry Type</td>
                              <td>
                                <NavLink className="non_underline_link bold view_c" to="/industry_categories">
                                  <i className="fas fa-eye"></i>
                                </NavLink>
                              </td>
                            </tr>
                          )}
                          {menuList?.includes("FRAMEWORK_UPDATE", "FRAMEWORK_VIEW", "FRAMEWORK_DELETE", "FRAMEWORK_CREATE") && (<tr>
                            <td>Manage Frameworks</td>
                            <td>
                              <NavLink className="non_underline_link bold view_c" to="/global_controls/manage_global_control/frameworks">
                                <i className="fas fa-eye"></i>
                              </NavLink>
                            </td>
                          </tr>)}
                          {menuList?.includes("TOPIC_CREATE", "TOPIC_UPDATE", "TOPIC_VIEW", "TOPIC_DELETE") && (<tr>
                            <td>Manage Topics</td>
                            <td>
                              <NavLink className="non_underline_link bold view_c" to="/topics">
                                <i className="fas fa-eye"></i>
                              </NavLink>
                            </td>
                          </tr>)}
                          {menuList?.includes("KPI_UPDATE", "KPI_VIEW", "KPI_DELETE", "KPI_CREATE") && (<tr>
                            <td>Manage KPIs</td>
                            <td>
                              <NavLink className="non_underline_link bold view_c" to="/kpi">
                                <i className="fas fa-eye"></i>
                              </NavLink>
                            </td>
                          </tr>)}
                          {menuList?.includes("SECTOR_QUESTIONS_VIEW") && (<tr>
                            <td>Manage Sector Questions</td>
                            <td>
                              <NavLink className="non_underline_link bold view_c" to="/questions_framework_wise">
                                <i className="fas fa-eye"></i>
                              </NavLink>
                            </td>
                          </tr>)}
                          {/* {permissions.includes("KPI_UPDATE") && (<tr>
                          <td>Global Innovative Programmes</td>
                          <td>
                            <NavLink className="non_underline_link bold view_c" to="/innovative_programmes">
                            <i className="fas fa-eye"></i>
                            </NavLink>
                          </td>
                        </tr>)}
                        {menuList?.includes("KPI_UPDATE") && (<tr>
                          <td>Introduction Videos</td>
                          <td>
                            <NavLink className="non_underline_link bold view_c" to="/introduction_videos">
                            <i className="fas fa-eye"></i>
                            </NavLink>
                          </td>
                        </tr>)}
                        {menuList?.includes("KPI_UPDATE") && (<tr>
                          <td>Policies</td>
                          <td>
                            <NavLink className="non_underline_link bold view_c" to="/policies">
                            <i className="fas fa-eye"></i>
                            </NavLink>
                          </td>
                        </tr>)} */}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PermissionContext.Consumer>
  );
};

export default ManageAndControls;
