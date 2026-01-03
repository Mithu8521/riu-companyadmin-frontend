import React from 'react'
import { Route } from "react-router-dom";
import FrameworkList from './component/SupplierModule/Pages/private/quotionare/FrameworkList'
import DashboardOr from './component/SupplierModule/Pages/private/Dashboard/dashboard';
import AuditSubAdmin from './component/SupplierModule/Pages/private/Audit/audit'
// import AuditListing from './component/SupplierModule/Pages/private/Audit/companies'
// import Audithistory from './component/SupplierModule/Pages/private/Audit/audithistory'
import SupplierCompany from './component/SupplierModule/Pages/private/quotionare/companies'
import CompanyDetail from './component/SupplierModule/Pages/private/quotionare/CompanyDetail'
import Addquestion from './component/SupplierModule/Pages/Quesstion/add-question';
import QuestionList from './component/SupplierModule/Pages/Quesstion/question-list';
import QuestionListView from './component/SupplierModule/Pages/Quesstion/questionView';
import CompletedQuestion from './component/SupplierModule/Pages/private/Audit/CompletedQuestion';
import AuditList from './component/Audit_Module/AuditList/index';

export default function SupplierRoute(props) {
  return (
    <div> <h1> Hello</h1>
      {/* <Route exact path="/home" component= {DashboardOr}/>
    <Route exact path="/frameworklist" component={FrameworkList}/>
    <Route exact path="/AddSubAdmin" component={AuditSubAdmin}/>
    <Route exact path="/audit-listing" component={Audit_List}/>
    <Route exact path="/audit-history" component={Audit_List}/>
    <Route exact path="/supplierCompany" component={SupplierCompany}/>
    <Route exact path="/supplierCompany/companyDetail" component={CompanyDetail}/>
    <Route exact path="/add_question" component={Addquestion}/>
    <Route exact path="/question-list" component={QuestionList}/>
    <Route exact path="/question-list-view" component={QuestionListView}/>
    <Route exact path="/copleted_question" component={CompletedQuestion}/> */}
    </div>
  )
}
