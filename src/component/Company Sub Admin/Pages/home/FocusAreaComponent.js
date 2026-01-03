import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { BarChart, ColumnChart } from "./Chart";
import {
  ColumnChartDataForSource,
  BarChartDataForSource,
  ColumnChartDataForQuestionType,
} from "./chartData";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import FilterDashoard from "../../../../img/sector/filter.png";
import Multiselect from "multiselect-react-dropdown";
import ColumnChartForSource from "./Chart/ColumnChartForSource";
import './focusarea.css';

const FocusAreaComponent = ({ fromDate, toDate, financialYearId }) => {
  const [filter, setFilter] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [filterData, setFilterData] = useState();
  const [allZero, setAllZero] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const multiselectRefTracker = useRef();
  const [selectedChartType, setSelectedChartType] = useState("RadioBarChart");
  const [chartType, setChartType] = useState("");
  const [teamWorkloadResults, seTeamWorkloadResults] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const handleFilterClose = () => setFilter(false);

  const myDisclosureProgress = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}sourceProgress`,
      {},
      {
        fromDate: fromDate,
        toDate: toDate,
        financialYearId: financialYearId
      },
      "GET"
    );
    if (isSuccess) {
      const responseData = data?.data?.teamWorkloadResults
        ?.reverse()
        .map((item) => ({
          ...item,
          firstName: `${item?.location?.city}`,
          lastName: ``,
        }));
      seTeamWorkloadResults(responseData);
      const series = await filterFunction(responseData);
      const categories = responseData.map(
        (user) => `${user?.firstName} ${user?.lastName}`
      );
      const allZeroes = series.every((series) =>
        series.data.every((value) => value === 0)
      );
      setAllZero(allZeroes);
      const color = ['#0066cc', '#ff5050', '#33cc33', '#ffff66'];
      const GraphData = await ColumnChartDataForQuestionType(
        series,
        categories,
        true,
        true,
        "percentage",
        color
      );
      setGraphData(GraphData);
      const filter = data?.data?.filter;
      setSelectedLocationId(filter?.locationIds);
      getSource(filter?.locationIds);
      setSelectedStatusId(filter?.Status);
      const filteredArray = getAllStatus.filter((obj) =>
        filter?.Status.includes(obj.id)
      );
      setSelectedStatus(filteredArray);
      // setChartType(filter?.chartType);
    }
  };
  const getSource = async (locationIds) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSource`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const locationArray = data?.data?.reverse().map((item) => ({
        id: item.id,
        location: `${item?.location?.area}, ${item?.location?.city}, ${item?.location?.state}, ${item?.location?.country}, ${item?.location?.zipCode}`,
      }));
      if (!locationArray) {
        setSelectedLocation([]);
        setLocationData([]);
      } else {
        const filteredArray = locationArray.filter((obj) =>
          locationIds.includes(obj.id)
        );
        setSelectedLocation(filteredArray);
        setLocationData(locationArray);
      }

    }
  };
  const getAllStatus = [
    { id: "percentageAccepted", full_name: "Accepted" },
    { id: "percentageRejected", full_name: "Rejected" },
    { id: "percentageAnswered", full_name: "Answered" },
    { id: "percentageUnresponded", full_name: "Not Responded" },
  ];

  const onSelectHandler = (data, type) => {
    const selectedIds = data && data.map(({ id }) => id);
    if (type === "STATUS") {
      setSelectedStatusId(selectedIds || []);
    } else if (type === "LOCATION") {
      setSelectedLocationId(selectedIds || []);
    }
  };

  const onRemoveHandler = (data, type) => {
    if (data && data.length === 0) {
      if (type === "STATUS") {
        setSelectedStatusId([]);
      } else if (type === "LOCATION") {
        setSelectedLocationId([]);
      }
    } else {
      onSelectHandler(data, type);
    }
  };

  const filterFunction = async (teamWorkloadResults) => {
    const mapSeriesData = (results, property) => {
      return results.map((user) => {
        const value = parseFloat(user[property]);
        return !isNaN(value) ? value : null;
      });
    };
    const seriesData = [
      {
        name: "Accepted",
        data: mapSeriesData(teamWorkloadResults, "percentageAccepted"),
      },
      {
        name: "Rejected",
        data: mapSeriesData(teamWorkloadResults, "percentageRejected"),
      },
      {
        name: "Answered",
        data: mapSeriesData(teamWorkloadResults, "percentageAnswered"),
      },
      // {
      //   name: "Responded",
      //   data: mapSeriesData(teamWorkloadResults, "percentageResponded"),
      // },
      {
        name: "Not Responded",
        data: mapSeriesData(teamWorkloadResults, "percentageUnresponded"),
      },
    ];
    return seriesData.filter((series) =>
      series.data.some((val) => val !== null)
    );
  };

  const handleApplyFilter = async () => {
    const filteredArray = teamWorkloadResults.map(
      ({ location, userId, firstName, lastName, ...rest }) => {
        const filteredObject = { location, userId, firstName, lastName };
        selectedStatus.forEach((prop) => {
          filteredObject[prop] = rest[prop];
        });
        return filteredObject;
      }
    );
    let filterData = filteredArray.filter((item) =>
      selectedLocation.includes(item.userId)
    );
    const series = await filterFunction(filterData);
    const renderChart = async () => {
      switch (selectedChartType) {
        case "ColumnChart":
          return (
            <ColumnChartForSource
              chartData={await ColumnChartDataForSource(filterData, series)}
            />
          );
        case "BarChart":
        default:
          return (
            <BarChart
              chartData={await BarChartDataForSource(filterData, series)}
            />
          );
      }
    };
    setChartType(await renderChart());
    setFilter(false);
    handleFilterClose();
  };

  useEffect(() => {
    myDisclosureProgress();
  }, [fromDate, toDate, financialYearId]);
  return (
    <>
      <div className="focusarea" style={{ height: "100%", width: "100%", maxWidth: "101%", overflow: "auto" }}>
        <div style={{ padding: 15, width: "30vw", overflow: "auto", height: "100%" }}>
          <div className="esg_score_title d-flex flex-column" style={{ width: "100%", maxWidth: "101%", overflow: "auto", height: "10%" }}>
            <div style={{
              color: "#011627",
              fontSize: 22,
              height: "100%",
              paddingLeft: "0px",
              fontFamily: "Open Sans",
              fontWeight: "600",
              paddingTop: "0px", marginTop: "0%"
            }}>Location progress</div>
          </div>
          <div className="p-0" style={{ height: "95%" }}>
            <div className="trick" style={{ overflow: "auto", height: "100%" }}>
              {chartType !== "" ? (
                chartType
              ) : (
                <ColumnChartForSource chartData={graphData} height={"100%"} />
              )}
            </div>
          </div>
        </div>

      </div>

    </>
  );
};

export default FocusAreaComponent;
