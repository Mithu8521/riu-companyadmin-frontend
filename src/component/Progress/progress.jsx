import React, { useEffect, useRef, useState } from "react";
import config from "../../../src/config/config.json";
import { apiCall } from "../../_services/apiCall";
import defaulted from "../../img/Defaulted.svg";
import due from "../../img/Due.svg";
import done from "../../img/shape.svg";
import updated from "../../img/updated.svg";
import TopComponent from "../DashboardComponents/TopComponent";
import RecentActivity from "../RecentActivity/recentactivity";
import DataProcessing from "../TeamWorkLoad/DataProcessing";
import KPIreporting from "../TeamWorkLoad/KPIreporting";
import OrganizationDataStatusChart from "../TeamWorkLoad/OrganizationDataStatusChart";
import TeamWorkLoad from "../TeamWorkLoad/TeamWorkLoad";
import TeamWorkLoadChecker from "../TeamWorkLoad/TeamWorkLoadChecker";
import TeamWorkLoadMaker from "../TeamWorkLoad/TeamWorkLoadMaker";
import TopicWisedata from "../TeamWorkLoad/TopicWisedata";
import "./progress.css";
import UsersActivity from "../RecentActivity/UserActivity";

const Progress = ({
  fromDate,
  toDate,
  framework,
  timePeriods,
  financialYearId,
  locationOption,
  todaysActivities,
  usersActivity,
}) => {
  const [lastWeekAcitivities, setLastWeekAcitivities] = useState();
  const [teamWorksloadData, setTeamWorksloadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const [permissionList, setPermissionList] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState();
  const [makerVsChecker, setMakerVsChecker] = useState();
  const [orgCheckerOtatusData, setOrgCheckerOtatusData] = useState();
  const [orgMakerOtatusData, setOrgMakerOtatusData] = useState();
  const [topicWiseMapping, setTopicWiseMapping] = useState();
  const icons = {
    Completed: done,
    "In Progress": updated,
    Overdue: due,
    Upcoming: defaulted,
  };

  const lastWeekActivity = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}lastWeekActivity`,
      {},
      {
        fromDate: fromDate,
        toDate: toDate,
        financialYearId: financialYearId,
      },
      "GET"
    );
    if (isSuccess && isMounted.current) {
      setLastWeekAcitivities(data?.data);
    }
  };

  useEffect(() => {
    lastWeekActivity();
  }, []);

  const teamWorkloadProgess = async () => {
    if (fromDate && toDate && financialYearId) {
      const frameworkIds = framework.map((item) => item.value);
      const locationIdsIds =
        locationOption && locationOption.map((item) => item.id);
      const periods = Object.values(timePeriods);
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}teamWorkloadProgess`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId,
          frameworkIds,
          locationIdsIds,
          periods,
        },
        "GET"
      );

      if (isSuccess && isMounted.current) {
        setTeamWorksloadData(data?.data?.teamWorkloadResults);
      }
    }
  };

  const prevDependenciesRef = useRef();
  const areDependenciesEqual = (prev, curr) => {
    return JSON.stringify(prev) === JSON.stringify(curr);
  };

  useEffect(() => {
    const currentDependencies = [
      framework,
      locationOption,
      timePeriods,
      financialYearId,
      fromDate,
    ];
    if (
      (!prevDependenciesRef.current ||
        !areDependenciesEqual(
          prevDependenciesRef.current,
          currentDependencies
        )) &&
      framework?.length &&
      locationOption?.length &&
      financialYearId
    ) {
      teamWorkloadProgess();
      getUserProgressData();
      prevDependenciesRef.current = currentDependencies;
    }
  }, [framework, locationOption, timePeriods, financialYearId, fromDate]);

  const getUserProgressData = async () => {
    const frameworkIds = framework.map((item) => item.value);
    if (fromDate && toDate && financialYearId && frameworkIds.length != 0) {
      setLoading(true);
      const locationIdsIds =
        locationOption && locationOption.map((item) => item.id);
      const periods = Object.values(timePeriods);
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getUserProgressData`,
        {},
        {
          fromDate: fromDate,
          toDate: toDate,
          financialYearId,
          frameworkIds,
          locationIdsIds,
          periods,
        },
        "GET"
      );
      setLoading(false);
      if (isSuccess && isMounted.current) {
        setAssignmentStatus(data?.data?.assignmentStatus);
        setMakerVsChecker(data?.data?.makerVsChecker);
        setOrgCheckerOtatusData(data?.data?.orgCheckerOtatusData);
        setOrgMakerOtatusData(data?.data?.orgMakerOtatusData);
        setTopicWiseMapping(data?.data?.topicWiseMapping);
      }
    }
  };

  // Check if a user has a specific permission
  const hasPermission = (permissionCode) => {
    return permissionList.some(
      (permission) =>
        permission.permissionCode === permissionCode && permission.checked
    );
  };

  useEffect(() => {
    const dashboardMenu = JSON.parse(localStorage.getItem("menu"));
    const dashboardObject = dashboardMenu.find(
      (item) => item.caption === "Dashboard"
    ).permissions;
    setPermissionList(dashboardObject);
  }, []);

  // Prepare all components based on permissions
  const getComponentsWithPermissions = () => {
    const components = [];

    // Checker component
    if (hasPermission("CHECKER") && orgCheckerOtatusData) {
      components.push({
        component: (
          <TeamWorkLoadChecker orgMakerOtatusData={orgCheckerOtatusData} />
        ),
      });
    }

    // Maker component
    if (hasPermission("MAKER") && orgMakerOtatusData) {
      components.push({
        component: (
          <TeamWorkLoadMaker orgMakerOtatusData={orgMakerOtatusData} />
        ),
      });
    }

    // Audit Review component
    if (hasPermission("AUDIT_REVIEW") && teamWorksloadData) {
      components.push({
        component: (
          <TeamWorkLoad user="audit" teamWorkloadData={teamWorksloadData} />
        ),
        className: "secondarycont height-60",
      });
    }

    // Data Processing component
    if (hasPermission("DATA_PROCESSING") && teamWorksloadData) {
      components.push({
        component: (
          <DataProcessing user="user" teamWorkloadData={teamWorksloadData} />
        ),
        className: "secondarycont height-60",
      });
    }

    // Maker vs Checker (KPIreporting) - Full Width
    if (hasPermission("MAKER_VS_CHECKER") && makerVsChecker) {
      components.push({
        component: <KPIreporting makerVsChecker={makerVsChecker} />,
        fullWidth: true,
      });
    }

    // Topic Wise component
    if (hasPermission("TOPIC_PROGRESS") && topicWiseMapping) {
      components.push({
        component: <TopicWisedata topicWiseMapping={topicWiseMapping} />,
        className: "secondarycont height-500",
      });
    }

    // Question Assignment component
    if (hasPermission("QUESTION_ASSIGNED") && assignmentStatus) {
      components.push({
        component: (
          <OrganizationDataStatusChart
            data={assignmentStatus}
            heading="Assigned vs Unassigned Questions Status Distribution"
            reportingUrl="/#/reporting-modules/all-module"
          />
        ),
        className: "secondarycont height-502",
      });
    }

    // Data Owner Log component
    if (hasPermission("DATA_OWNER_LOG")) {
      components.push({
        component: (
          <RecentActivity
            fromDate={fromDate}
            toDate={toDate}
            financialYearId={financialYearId}
            todaysActivities={todaysActivities}
            heading="Data owner's activity log"
          />
        ),
        className: " height-40",
      });
    }

    // Reviewer Log component
    if (hasPermission("REVIEWER_LOG")) {
      components.push({
        component: (
          <RecentActivity
            fromDate={fromDate}
            toDate={toDate}
            financialYearId={financialYearId}
            todaysActivities={[]}
            heading="Reviewer's activity log"
          />
        ),
        className: " height-40",
      });
    }

    // User Log component

    components.push({
      component: (
        <UsersActivity
          fromDate={fromDate}
          toDate={toDate}
          financialYearId={financialYearId}
          usersActivity={usersActivity}
          heading="User's activity log"
        />
      ),
      className: "mt-4 height-40",
      fullWidth: true,
    });

    return components;
  };

  // Render components in pairs
  const renderDashboardComponents = () => {
    const components = getComponentsWithPermissions();
    const rows = [];

    let i = 0;
    while (i < components.length) {
      const currentComponent = components[i];
      const nextComponent =
        i + 1 < components.length ? components[i + 1] : null;

      // Handle full width components
      if (currentComponent.fullWidth) {
        rows.push(
          <div
            key={`row-${i}`}
            className={`d-flex flex-row flex-space-between ${currentComponent.className}`}
          >
            <div className="dashboard-component" style={{ width: "100%" }}>
              {currentComponent.component}
            </div>
          </div>
        );
        i++;
        continue;
      }

      // For components that should be paired
      const className =
        currentComponent.className ||
        (nextComponent ? nextComponent.className : "secondarycont");

      rows.push(
        <div
          key={`row-${i}`}
          className={`d-flex flex-row ${className}`}
          style={{ justifyContent: "flex-start" }}
        >
          <div
            className="dashboard-component"
            style={{ width: "49%", marginRight: nextComponent ? "2%" : "0" }}
          >
            {currentComponent.component}
          </div>
          {nextComponent && (
            <div className="dashboard-component" style={{ width: "49%" }}>
              {nextComponent.component}
            </div>
          )}
        </div>
      );

      // Increment by 2 if we have a pair, otherwise by 1
      i += nextComponent ? 2 : 1;
    }

    return rows;
  };

  return (
    <div className="progress-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {lastWeekAcitivities && (
            <TopComponent
              lastWeekAcitivities={lastWeekAcitivities}
              icons={icons}
            />
          )}

          {/* Render all dashboard components in pairs */}
          {renderDashboardComponents()}
        </>
      )}
    </div>
  );
};

export default Progress;
