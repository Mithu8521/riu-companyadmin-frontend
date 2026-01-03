import React from "react";
import SuperAdminRoute from "./_routes/superAdminRoutes";
import SubAdminRoute from "./_routes/superSubAdminRoutes";
import CompanyAdminRoute from "./App";
import CompanySubAdminRoute from "./_routes/companySubAdminRoutes";
import PublicRoutes from "./_routes/PublicRoute";
const AuthorizationContext = React.createContext();

const Routes = () => {
  const getLocalData = JSON.parse(localStorage.getItem("currentUser"));
  const getRole = getLocalData !== null ? getLocalData.data.role : "";
  return (
    <AuthorizationContext.Provider value={getRole}>
      {(() => {
        let superAdminConditions =
          getRole == "super_admin" && localStorage.getItem("token") !== undefined;
        let subAdminConditions =
          getRole == "sub_admin" && localStorage.getItem("token") !== undefined;
        let companyAdminConditions =
          getRole == "company_admin" && localStorage.getItem("token") !== undefined;
        let companySubAdminConditions =
          getRole == "company_sub_admin" && localStorage.getItem("token") !== undefined;
        if (superAdminConditions) {
          return <SuperAdminRoute />;
        } else if (subAdminConditions) {
          return <SubAdminRoute />;
        } else if (companyAdminConditions) {
          return <CompanyAdminRoute />;
        } else if (companySubAdminConditions) {
          return <CompanySubAdminRoute />;
        } else {
          return <PublicRoutes />;
        }
      })()}
    </AuthorizationContext.Provider>
  );
};

export default Routes;
