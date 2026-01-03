import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import AddSubAdmin from "./component/Login/addSubAdmin";
import {
  AuditProvider,
} from "./component/sidebar/sidebar";
import Invite from "./component/signup/invite";
import Privacy from "./component/signup/privacy";
import SuperSubAdminInvite from "./component/signup/SuperSubAdminInvite";
// import sector_question from "./component/Company Sub Admin/Pages/sector_question/sector_question";
import governance from "./component/Company Sub Admin/Pages/governance/governance";
import governance_fast from "./component/Company Sub Admin/Pages/governance/governance_fast";
import sustainable from "./component/Company Sub Admin/Pages/sustainable/sustainable";
import sustainable_submissions from "./component/Company Sub Admin/Pages/sustainable/sustainable-second";
import companies from "./component/Group_Admin/companies";
// import supplier from "./component/Company Sub Admin/Pages/supplier/supplier";
// import supplier_fast from "./component/Company Sub Admin/Pages/supplier/supplier_fast";
// import carbon_footprint from "./component/Company Sub Admin/Pages/carbon_footprint/carbon_footerprint";
import carbon_footprint_detail from "./component/Company Sub Admin/Pages/carbon_footprint/carbon_footprint_detail";
import carbon_footprint_tabbing from "./component/Company Sub Admin/Pages/carbon_footprint/carbon_footprint_tabbing";
import result from "./component/Company Sub Admin/Pages/carbon_footprint/result";
// import board_skills from "./component/Company Sub Admin/Pages/board_skills/board_skills";
import board_skills_detail from "./component/Company Sub Admin/Pages/board_skills/board_skills_detail";
// import management from "./component/Company Sub Admin/Pages/management/management";
import Checkout from "./component/Company Admin/component/setting/payment_success";
import EsgReportingPie from "./component/Company Admin/esg_repoting/esg_reporting_kpi";
import setting from "./component/Company Admin/Setting/setting";
import analytics from "./component/Company Sub Admin/Pages/analytics/analytics";
import esg_products from "./component/Company Sub Admin/Pages/esg_products/esg_products";
import managementDetail from "./component/Company Sub Admin/Pages/management/management_detail";
import news from "./component/Company Sub Admin/Pages/news/news";
import supplier_details from "./component/Company Sub Admin/Pages/supplier/supplier_detail";
import supplier_form from "./component/Company Sub Admin/Pages/supplier/supplier_form";
import RegisterdSupplierManagement from "./component/Company Sub Admin/Pages/supplier_management/RegisterdSupplierManagement";
import supplier_management_form from "./component/Company Sub Admin/Pages/supplier_management/supplier_management_form";
import supplier_management_option from "./component/Company Sub Admin/Pages/supplier_management/supplier_management_option";
import download_report from "./component/Company Sub Admin/Pages/sustainable/download_report";
import continuing_professional_development_detail from "./component/Company Sub Admin/Pages/training/continuing_professional_development";

import invoice from "./component/Company Admin/Setting/invoice";
import user_detail from "./component/Company Admin/Setting/user_detail";
import coaching_form from "./component/Company Sub Admin/Pages/training/coaching_form";

import BusinessModel from "./component/Company Sub Admin/Component/Sector Questions/Business_Model";
import EnvironmentalCapital from "./component/Company Sub Admin/Component/Sector Questions/Enviornmental_Capital";
import LeadershipGovernance from "./component/Company Sub Admin/Component/Sector Questions/Leadership_&_Governance";

import GovernancePolicies from "./component/Company Sub Admin/Component/Governance/governance";
import SocialPolicies from "./component/Company Sub Admin/Component/Governance/social_policies";
// import CyberTechnology from "./component/Company Sub Admin/Component/Governance/cyber_technology";
// import HealthSafety from "./component/Company Sub Admin/Component/Governance/health_safety_policy";
import EnviornmentalPolicy from "./component/Company Sub Admin/Component/Governance/enviornmental_policy";

import BusinessModelTopics from "./component/Company Sub Admin/Component/Supplier/business_model";
import GovernanceTopics from "./component/Company Sub Admin/Component/Supplier/governance_topics";
import EnviornmentalTopics from "./component/Company Sub Admin/Component/Supplier/supplier_enviornmental_topics";
import SocialTopics from "./component/Company Sub Admin/Component/Supplier/supplier_social_topics";

import ScopeEmission1 from "./component/Company Sub Admin/Component/carbon_footprint/scope_emmision_1";
import ScopeEmission2 from "./component/Company Sub Admin/Component/carbon_footprint/scope_emmision_2";
import ScopeEmission3 from "./component/Company Sub Admin/Component/carbon_footprint/scope_emmision_3";

// import SettingProfile from "./component/Company Admin/component/setting/Settings";
import SettingBilling from "./component/Company Admin/component/setting/billing";
import SettingSubAdmin from "./component/Company Admin/component/setting/sub_admin";
import Settings from "./component/Settings";

// import AuditHistory from "./component/Company Sub Admin/Pages/Audit/auditHistory";
// import AuditHistoryListing from "./component/Company Sub Admin/Pages/Audit/auditHistoryListing";

import Google2FA from "./component/Company Admin/component/setting/google2FA";

// import SupplierManagement from "./component/Company_Super_Admin/supplier-management/supplier_management";

import Introduction from "./component/Supplier/introduction";
import supplierForm from "./component/Supplier/supplierForm";
import SupplierQuestionDetail from "./component/Supplier/SupplierQuestionDetail";

import Cyber_Digital from "./component/Company Sub Admin/Component/Sector Questions/Cyber_digital";
import Human_Capital from "./component/Company Sub Admin/Component/Sector Questions/Human_capital";
// import EnviornmentalPolicyTabbing from "./component/Company_Super_Admin/component/companies/enviornmental_policy";
import Restrictsubscription from "./component/Company Admin/component/setting/restrictsubscription";
import SmartUp from "./component/Company Admin/component/setting/SmartUp";
import EsgReportingKpi from "./component/Company Admin/esg_repoting/esg_reporting_kpi";
import esgReportingSummary from "./component/Company Admin/esg_repoting/esg_reporting_summary";
import OtherPolicies from "./component/Company Sub Admin/Component/Governance/other_policy";
import SupplierKpi from "./component/Company Sub Admin/Pages/supplier_management/supplier_kpi";
import ResetMassage from "./component/Login/resetMassage";
import CompanyInvite from "./component/signup/company_invite";
import Terms from "./component/signup/terms";
// import { SupplierManagement } from "./component/Company Sub Admin/Pages/supplier_management/SupplierManagementp";
import { CreateFramework } from "./component/frameworks/Create";
import { Frameworks } from "./component/frameworks/Frameworks";
import { EditFramework } from "./component/frameworks/update-framework";
import { CreateKpi } from "./component/KPI/Create";
import { Kpis } from "./component/KPI/Kpis";
import { EditKpis } from "./component/KPI/update-kpi";
import { CreateSectorQuestion } from "./component/Sector_Question_Manage/CreateSectorQuestion";
import { CreateTopic } from "./component/Topics/Create";
import { Topics } from "./component/Topics/Topic";
import { EditTopic } from "./component/Topics/update-topic";
// import { SectorQuestionFrameworkWise } from "./component/Sector_Question_Manage/sectorQuestionindustrywise";
import CreateMeter from "./component/Company Admin/component/setting/CreateMeter";
import CreateProcess from "./component/Company Admin/component/setting/CreateProcess";
import EditMeter from "./component/Company Admin/component/setting/EditMeter";
import EditProcess from "./component/Company Admin/component/setting/EditProcess";
import Generator from "./component/Company Admin/component/setting/Generator";
import AssessmentDetail from "./component/Company Sub Admin/Pages/supplier_assessment/createNewAssessment";
import Supplier_assessment from "./component/Company Sub Admin/Pages/supplier_assessment/supplier_assessment";
import SupplierManagementFrameworkList from "./component/Company Sub Admin/Pages/supplier_management/SupplierManagementFrameworkList";
import SupplierQuestionList from "./component/Company Sub Admin/Pages/supplier_management/SupplierQuestionList";
import { authenticationService } from "./_services/authentication";
import AuditFramework from "./component/Audit_Module/AuditHistory/AuditFramework";
import ViewAnswerHistory from "./component/Audit_Module/AuditHistory/ViewAnswerHistory";
import AuditDetails from "./component/Audit_Module/AuditList/AuditDetails";
import AuditList from "./component/Audit_Module/AuditList/index";
import { FrameworkTopicKpiTabs } from "./component/Company Admin/GlobalControl/Frameworks/FrameworkTopicKpiTabs";
import Index from "./component/Company Sub Admin/Component/Index";
import SectorQuestionNew from "./component/Company Sub Admin/Component/Sector Questions/SectorQuestionNew";
import Dashboard from "./component/Company Sub Admin/Pages/Dashboard/Dashboard";
import EsgReporting from "./component/Company Sub Admin/Pages/ESGReportingNew/EsgReporting";
import GetQuestionByImport from "./component/Company Sub Admin/Pages/supplier_assessment/GetQuestionByImport";
import SupplierAssessmentQuestionList from "./component/Company Sub Admin/Pages/supplier_assessment/supplier_assessment_question_list";
import InvitedSupplierManagement from "./component/Company Sub Admin/Pages/supplier_management/InvitedSupplierManagement";
import NewAuditHistory from "./component/NewAudit/AuditHistory/AuditHistory";
import NewAuditList from "./component/NewAudit/AuditHistory/NewAuditList";
import OperationalModule from "./component/OperationalModule/OperationalModule";
import SupplierSignup from "./component/signup/SupplierSignup";
import TraineeeModule from "./component/TraineeModule/TraineeeModule";
import TrainingModule from "./component/TrainingModule/TrainingModule";
import TrainingOverview from "./component/TrainingOverview/trainingOverview";
import ComplianceReporting from "./component/Company Sub Admin/Component/ComplianceReporting/compliance-reporting";
import Flagvalues from "./component/Company Sub Admin/Pages/flagvalues/flagvalues";
import TrainingTilter from "./component/Company Sub Admin/Pages/TrainingFilter/TrainingFilter";
import Intensity from "./component/Company Sub Admin/Component/Intensity/intensity";
import MainScope from "./component/CarbonFootPrinting/MainCarbon/MainScope";
import BRSRReportPage from "./component/Company Sub Admin/Component/Sector Questions/BRSR/BRSRReportPage";
import RequestApproval from "./component/Company Sub Admin/Component/RequestApproval/requestApproval";
import DocumentManagement from "./component/Documents/DocumentManagement";

export default function AdminRoute() {
  // const initialState = {
  //   menus: JSON.parse(localStorage.getItem("menu")) || [],
  //   role: JSON.parse(localStorage.getItem("role")),
  // };

  //  const {userPermissionList} = createContext(initialState);

  // const { userPermissionList } = useContext(PermissionMenuContext)

  // useEffect(() => {
  //   const { userPermissionList } = useContext(PermissionMenuContext)
  // }, );
  let currentUser = authenticationService.currentUserSubject.getValue();
  const data = authenticationService.currentUser;
  const [userPermissionList, setMenuList] = useState([]);
  useEffect(() => {
    data.subscribe((res) => {
      const menus = res?.data?.menu;

      const permissionsArray = [];
      menus?.forEach((item) => {
        permissionsArray.push(...item.permissions);
        item.sub_menu.forEach((subItem) => {
          permissionsArray.push(...subItem.permissions);
        });
      });
      setMenuList(permissionsArray);
    });
  }, [currentUser]);
  // useEffect(() => {
  //   // data.subscribe((res) => {
  //   const menus = JSON.parse(localStorage.getItem("menu"));
  //   console.log(menus);
  //   const permissionsArray = [];
  //   menus?.forEach((item) => {
  //     permissionsArray.push(item.permissions); // push main menu permissions
  //     item.sub_menu.forEach((subItem) => {
  //       permissionsArray.push(...subItem.permissions); // push sub-menu permissions
  //     });
  //   });
  //   setMenuList(permissionsArray);
  //   // });
  // }, [role]);
  return (
    <div>
      <Route exact path="/home" component={Dashboard}></Route>
      {/* <Route exact path="/home" component={Home}></Route> */}
      {/* <Route exact path="/audit" component={AuditSubAdmin}></Route> */}
      {/* <Route
        exact
        path="/audit_supplier_question"
        component={AuditSuppliersQuestions}
      ></Route> */}
      <Route exact path="/operational_module" component={OperationalModule}></Route>
      <Route
        exact
        path="/supplier_assessment"
        component={Supplier_assessment}
      ></Route>


      <Route
        exact
        path="/supplier_assessment_question_list"
        component={SupplierAssessmentQuestionList}
      ></Route>


      <Route
        exact
        path="/supplier_assessment/assessement_detail/:id"
        component={AssessmentDetail}
      ></Route>

      <Route
        exact
        path="/supplier_assessment/import_question"
        component={GetQuestionByImport}
      />

      <Route exact path="/trainee" component={TrainingModule} />
      <Route exact path="/trainer" component={TraineeeModule} />
      <Route exact path="/training_overview" component={TrainingOverview} />
      <Route
        exact
        path="/carbon-footprinting/scope-1"
        render={(routeProps) => (
          <MainScope {...routeProps} scopeType="SCOPE1" />
        )}
      />

      <Route
        exact
        path="/carbon-footprinting/scope-2"
        render={(routeProps) => (
          <MainScope {...routeProps} scopeType="SCOPE2" />
        )}
      />
      
      <Route
        exact
        path="/carbon-footprinting/scope-3"
        render={(routeProps) => (
          <MainScope {...routeProps} scopeType="SCOPE3" />
        )}
      />

      {/* <Route exact path="/audit_supplier" component={AuditSupplier}></Route> */}
      {/* <Route
        exact
        path="/audit_question_listing"
        component={AuditCompanyListing}
      ></Route> */}
      {/* <Route
        exact
        path="/audit_supplier_question_listing"
        component={AuditSupplierQuestionListing}
      ></Route> */}
      {/* <Route
        exact
        path="/audit_companies_nodata"
        component={AuditCompaniesNoData}
      ></Route> */}
      {/* <Route exact path="/audit_history" component={AuditHistory}></Route> */}
      {/* <Route
        exact
        path="/audit_history_listing"
        component={AuditHistoryListing}
      ></Route> */}
      {/* <Route
        exact
        path="/audit_history_question_listing"
        component={AuditHistoryListingQuestions}
      ></Route> */}
      {/* <Route exact path="/flow_chart" component={FlowCharts}></Route> */}
      <Route exact path="/AddSubAdmin" component={AddSubAdmin}></Route>
      <Route exact path="/privacy_policy" component={Privacy}></Route>
      <Route exact path="/terms_and_conditions" component={Terms}></Route>
      {/* <Route exact path="/sidebar" component={Sidebar}></Route> */}
      {/* <Route exact path="admin/sidebar" component={AdminSidebar}></Route> */}
      {/* <Route exact path="/header" component={Header}></Route> */}
      {/* <Route exact path="admin/header" component={AdminHeader}></Route> */}
      <Route exact path="/invite/:uuid" component={Invite}></Route>
      <Route exact path="/reset_massage" component={ResetMassage}></Route>
      <Route exact path="/trainee_invite/:token" component={SupplierSignup} ></Route>

      <Route
        exact
        path="/SubAdmin/invite/:uuid"
        component={SuperSubAdminInvite}
      ></Route>
      <Route
        exact
        path="/company_invite/:uuid"
        component={CompanyInvite}
      ></Route>

      <Route
        exact
        path="/checkout/:success/:sessionId"
        component={Checkout}
      ></Route>
      {/* <Route exact path="/sector_questions" component={sector_question} ></Route> */}

      <Route
        exact
        path="/Environmental_Capital"
        component={EnvironmentalCapital}
      ></Route>

      {/* <Route exact path="/Social_Capital" component={SocialCapital}></Route> */}
      <Route exact path="/sector_questions" component={SectorQuestionNew}></Route>
      
      <Route path="/brsr-report" component={BRSRReportPage}></Route>

      <Route exact path="/index" component={Index} />
      <Route exact path="/compliance-reporting" component={ComplianceReporting} />

      <Route exact path="/intensity" component={Intensity} />
      <Route exact path="/request-approval" component={RequestApproval} />

      <Route exact path="/documents" component={DocumentManagement} />

      {/* <Route
        exact
        path="/sector_questions/:id/view"
        component={QuestionView}
      ></Route> */}

      <Route
        exact
        path="/Leadership_Governance"
        component={LeadershipGovernance}
      ></Route>

      <Route
        exact
        path="/Business_Model_Innovation"
        component={BusinessModel}
      ></Route>
      <Route exact path="/Cyber_Digital" component={Cyber_Digital}></Route>
      <Route exact path="/Human_Capital" component={Human_Capital}></Route>
      {/* <Route
        exact
        path="/sector_question_fast"
        component={sector_question_fast}
      ></Route>
      <Route
        exact
        path="/sector_question_detail"
        component={sector_question_detail}
      ></Route> */}

      <Route exact path="/sustainable" component={sustainable}></Route>
      <Route
        exact
        path="/sustainable_submissions"
        component={sustainable_submissions}
      ></Route>
      <Route exact path="/esg_reporting" component={EsgReporting}></Route>

      <Route exact path="/governance" component={governance}></Route>
      <Route exact path="/governance_fast" component={governance_fast}></Route>
      {/* <ReportingProvider> */}
      <Route path="/reporting-modules/:moduleName" component={OperationalModule} />

      {/* 
      </ReportingProvider> */}
      <AuditProvider>
        <Route path="/audit-listing/:moduleName" component={NewAuditList} />

      </AuditProvider>
      <Route path="/audit-history" component={NewAuditHistory} />
      {/* <Route exact path="/suppliers" component={supplier}></Route> */}
      {/* <Route exact path="/suppliers_fast" component={supplier_fast}></Route> */}
      {/* <Route
        exact
        path="/supplier_management"
        component={SupplierManagement}
      ></Route> */}
      <Route
        exact
        path="/supplier_management_kpi"
        component={SupplierKpi}
      ></Route>
      {/* <Route exact path="/carbon_footprint" component={carbon_footprint} ></Route> */}
      <Route
        exact
        path="/carbon_footprint_tabbing"
        component={carbon_footprint_tabbing}
      ></Route>
      <Route exact path="/result" component={result}></Route>
      <Route
        exact
        path="/carbon_footprint_detail"
        component={carbon_footprint_detail}
      ></Route>
      {/* <Route exact path="/board_skills" component={board_skills}></Route> */}
      <Route
        exact
        path="/board_skills_detail"
        component={board_skills_detail}
      ></Route>
      {/* <Route exact path="/board_skills" component={board_skills}></Route> */}
      <Route
        exact
        path="/analytics"
        component={analytics}
      ></Route>
      <Route
        exact
        path="/data-analytics"
        component={Flagvalues}
      ></Route>

      <Route
        exact
        path="/training-filter"
        component={TrainingTilter}
      ></Route>

      {/* <Route exact path="/management" component={management}></Route> */}
      <Route
        exact
        path="/management_details"
        component={managementDetail}
      ></Route>
      <Route exact path="/esg_products" component={esg_products}></Route>
      {/* <Route exact path="/training" component={training}></Route> */}

      <Route
        exact
        path="/continuing_professional_development_detail"
        component={continuing_professional_development_detail}
      ></Route>
      <Route exact path="/news" component={news}></Route>
      <Route
        exact
        path="/supplier_details"
        component={supplier_details}
      ></Route>
      <Route exact path="/supplier_form" component={supplier_form}></Route>
      <Route
        exact
        path="/supplier_management_option"
        component={supplier_management_option}
      ></Route>
      {userPermissionList.includes("SUPPLIER_MANAGEMENT") && (
        <Route
          exact
          path="/supplier_management_form"
          component={supplier_management_form}
        ></Route>
      )}

      <Route exact path="/supplier-management" component={RegisterdSupplierManagement}></Route>
      <Route exact path="/invited-suppliers" component={InvitedSupplierManagement}></Route>

      <Route
        exact
        path="/supplier_management_detail/framework_list"
        component={SupplierManagementFrameworkList}
      ></Route>
      <Route
        exact
        path="/supplier_management/question_list"
        component={SupplierQuestionList}
      ></Route>
      <Route exact path="/download_report" component={download_report}></Route>
      <Route exact path="/coaching_form" component={coaching_form}></Route>

      <Route
        exact
        path="/governance_policies"
        component={GovernancePolicies}
      ></Route>

      <Route exact path="/Social_Policies" component={SocialPolicies}></Route>

      {/* <Route exact path="/Cyber_&_Technology" component={CyberTechnology} ></Route>
    <Route exact path="/Health_&_Safety_Policy" component={HealthSafety}></Route> */}

      <Route
        exact
        path="/Environmental_Policy"
        component={EnviornmentalPolicy}
      ></Route>

      <Route
        exact
        path="/Environmental_Topics"
        component={EnviornmentalTopics}
      ></Route>
      <Route exact path="/Social_Topics" component={SocialTopics}></Route>

      <Route
        exact
        path="/Governance_Topics"
        component={GovernanceTopics}
      ></Route>

      <Route exact path="/other_policies" component={OtherPolicies}></Route>

      <Route
        exact
        path="/Business_Models"
        component={BusinessModelTopics}
      ></Route>

      {/* <Route exact path="/Scope_1_Emissions" component={MainScopeOne}></Route> */}

      <Route exact path="/Scope_2_Emissions" component={ScopeEmission2}></Route>

      <Route exact path="/Scope_3_Emissions" component={ScopeEmission3}></Route>

      <Route exact path="/settings" component={Settings}></Route>

      {userPermissionList.includes("GET ALL SUBSCRIPTION") && (
        <Route exact path="/Setting_Billing" component={SettingBilling}></Route>
      )}

      <Route
        exact
        path="/subscription_plan"
        component={Restrictsubscription}
      ></Route>

      {userPermissionList.includes("CREATE SUB USER") && (
        <Route exact path="/sub_accounts" component={SettingSubAdmin}></Route>
      )}
      <Route exact path="/generator" component={Generator}></Route>
      {userPermissionList.includes("CREATE_METER_ID") && (
        <Route exact path="/generator/create" component={CreateMeter}></Route>
      )}
      <Route
        exact
        path="/generator/:id/update_meter"
        component={EditMeter}
      ></Route>
      {userPermissionList.includes("CREATE_METER_ID") && (
        <Route
          exact
          path="/generator/create_process"
          component={CreateProcess}
        ></Route>
      )}
      <Route
        exact
        path="/generator/:id/update_process"
        component={EditProcess}
      ></Route>
      <Route exact path="/Google_2FA" component={Google2FA}></Route>
      <Route exact path="/smartup" component={SmartUp}></Route>

      {/* Company Admin */}
      <Route exact path="/setting" component={setting}></Route>
      <Route
        exact
        path="/esg_reporting_pie"
        component={EsgReportingPie}
      ></Route>

      <Route
        exact
        path="/esg_reporting_kpi/:framework/:topics"
        component={EsgReportingKpi}
      ></Route>
      <Route
        exact
        path="/esg_reporting_kpi"
        component={EsgReportingKpi}
      ></Route>
      <Route
        exact
        path="/esg_reporting_summary"
        component={esgReportingSummary}
      ></Route>

      <Route exact path="/details/:uuid1/invoice" component={invoice}></Route>
      <Route exact path="/sub_accounts/:uuid" component={user_detail}></Route>

      {/* Company Super Admin */}
      <Route
        exact
        path="/supplier/Introduction"
        component={Introduction}
      ></Route>
      <Route
        exact
        path="/supplier/supplierForm"
        component={supplierForm}
      ></Route>
      <Route
        exact
        path="/supplier/SupplierQuestionDetail"
        component={SupplierQuestionDetail}
      ></Route>

      {/* global control */}
      {/* <Route exact path="/global_controls" component={Controls}></Route> */}
      <Route exact path="/global_controls" component={FrameworkTopicKpiTabs}></Route>
      {/* <Route exact path="/sector_questions/:id/questions_tabs" component={SectorQuestionCategories} ></Route>*/}
      {/* <Route
        exact
        path="/questions_framework_wise"
        component={SectorQuestionFrameworkWise}
      ></Route> */}

      {userPermissionList.includes("FRAMEWORK_VIEW") && (
        <Route exact path="/frameworks" component={Frameworks}></Route>
      )}
      {userPermissionList.includes("FRAMEWORK_CREATE") && (
        <Route
          exact
          path="/framework/create"
          component={CreateFramework}
        ></Route>
      )}
      {userPermissionList.includes("FRAMEWORK_UPDATE") && (
        <Route
          exact
          path="/frameworks/:id/update_framework"
          component={EditFramework}
        ></Route>
      )}

      {userPermissionList.includes("TOPIC_VIEW") && (
        <Route exact path="/topics" component={Topics}></Route>
      )}
      {userPermissionList.includes("TOPIC_CREATE") && (
        <Route exact path="/topic/create" component={CreateTopic}></Route>
      )}
      {userPermissionList.includes("TOPIC_UPDATE") && (
        <Route
          exact
          path="/topics/:id/update_topic"
          component={EditTopic}
        ></Route>
      )}

      {userPermissionList.includes("KPI_VIEW") && (
        <Route exact path="/kpi" component={Kpis}></Route>
      )}
      {userPermissionList.includes("KPI_CREATE") && (
        <Route exact path="/kpi/create" component={CreateKpi}></Route>
      )}
      {userPermissionList.includes("KPI_UPDATE") && (
        <Route exact path="/kpi/:id/update_kpi" component={EditKpis}></Route>
      )}

      <Route exact path="/add_sector_questions" component={CreateSectorQuestion}></Route>

      <Route exact path="/audit-listing" component={AuditList} />
      {/* <Route exact path="/audit-history" component={AuditHistory}/> */}
      <Route exact path="/framework-history" component={AuditFramework} />
      <Route exact path="/answer-history" component={ViewAnswerHistory} />

      <Route exact path="/detailed_audit" component={AuditDetails} />
      {userPermissionList?.includes("COMPANIES") && (
        <Route exact path="/companies" component={companies}></Route>
      )}

      {/* <Route
              exact
              path="/add_new_company"
              component={AddNewCompany}
            ></Route> */}
      {/* <Route exact path="/sector_questions/:tab_name/:id/question_lists" component={SectorQuestions} ></Route>
    
          <Route exact path="/sector_questions/:id/update_sector_question" component={EditSectorQuestions} ></Route> */}
    </div>
  );
}
