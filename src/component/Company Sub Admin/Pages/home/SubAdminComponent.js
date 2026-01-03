import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import {

  BarChart,
  ColumnChart,
} from "./Chart";

import {

  ColumnChartDataForSource,
  BarChartDataForSource,
  ColumnChartDataForQuestionType,
} from "./chartData";
import config from "../../../../config/config.json";
import { apiCall } from "../../../../_services/apiCall";
import Multiselect from "multiselect-react-dropdown";
import ColumnChartForSource from "./Chart/ColumnChartForSource";

const SubAdminComponent = () => {
  const [filter, setFilter] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [allZero, setAllZero] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const multiselectRefTracker = useRef();
  const [selectedChartType, setSelectedChartType] = useState("RadioBarChart");
  const [chartType, setChartType] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [teamWorkloadResults, seTeamWorkloadResults] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const handleFilterClose = () => setFilter(false);

  const myDisclosureProgress = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}teamWorkloadProgess`,
      {},
      { fromDate: "2023-07", toDate: "2024-01", financialYearId: 6 },
      "GET"
    );
    if (isSuccess) {
      const responseData = data?.data?.teamWorkloadResults;
      seTeamWorkloadResults(responseData);
      const categories = responseData.map((user) => `${user?.firstName}`);
      const series = await filterFunction(responseData.slice(0, 4));
      const allZeroes = series.every((series) =>
        series.data.every((value) => value === 0)
      );
      setAllZero(allZeroes);
      const GraphData = await ColumnChartDataForQuestionType(
        series,
        categories.slice(0, 4),
        true,
        true
      );
      setGraphData(GraphData);
      const filter = data?.data?.filter;
      // setSelectedLocationId(filter?.userIds);
      getSubUser(filter?.userIds);
      setSelectedStatusId(filter?.Status);
      const filteredArray = getAllStatus.filter((obj) =>
        filter?.Status.includes(obj.id)
      );
      setSelectedStatus(filteredArray);
    }
  };

  const getAllStatus = [
    { id: "percentageRejected", full_name: "Rejected" },
    { id: "percentageAccepted", full_name: "Accepted" },
    { id: "percentageAnswered", full_name: "Answered" },
    { id: "percentageUnresponded", full_name: "Not Responded" },
  ];
  const filterFunction = async (teamWorkloadResults) => {
    const mapSeriesData = (results, property) => {
      return results.map((user) => {
        const value = parseFloat(user[property]);
        return !isNaN(value) ? value : null;
      });
    };
    const seriesData = [
      {
        name: "Rejected",
        data: mapSeriesData(teamWorkloadResults, "percentageRejected"),
      },
      {
        name: "Accepted",
        data: mapSeriesData(teamWorkloadResults, "percentageAccepted"),
      },

      {
        name: "Answered",
        data: mapSeriesData(teamWorkloadResults, "percentageAnswered"),
      },
      {
        name: "Not Responded",
        data: mapSeriesData(teamWorkloadResults, "percentageUnresponded"),
      },
    ];
    return seriesData.filter((series) =>
      series.data.some((val) => val !== null)
    );
  };
  const onSelectHandler = (data, type) => {
    const selectedIds =
      type === "USER"
        ? data && data.map(({ userId }) => userId)
        : data && data.map(({ id }) => id);
    if (type === "USER") {
      setSelectedUser(selectedIds || []);
      setSelectedUsers(data);
    } else if (type === "STATUS") {
      setSelectedStatus(selectedIds || []);
    } else if (type === "LOCATION") {
      setSelectedLocation(selectedIds || []);
    }
  };

  const onRemoveHandler = (data, type) => {
    if (data && data.length === 0) {
      setSelectedStatus([]);
    } else {
      onSelectHandler(data, type);
    }
  };

  const handleApplyFilter = async () => {
    const filteredArray = teamWorkloadResults.map(
      ({ email, userId, firstName, lastName, ...rest }) => {
        const filteredObject = { email, userId, firstName, lastName };
        selectedStatus.forEach((prop) => {
          filteredObject[prop] = rest[prop];
        });
        return filteredObject;
      }
    );
    // let filterData = filteredArray.filter(item => selectedLocation.includes(item.userId));
    const series = await filterFunction(filteredArray);
    const renderChart = async () => {
      switch (selectedChartType) {
        case "ColumnChart":
          return (
            <ColumnChartForSource
              chartData={await ColumnChartDataForSource(
                teamWorkloadResults,
                series
              )}
            />
          );
        case "BarChart":
        default:
          return (
            <BarChart
              chartData={await BarChartDataForSource(
                teamWorkloadResults,
                series
              )}
            />
          );
      }
    };
    setChartType(await renderChart());
    setFilter(false);
    handleFilterClose();
  };

  const getSubUser = async (userIds) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSubUser`,
      {},
      "GET"
    );
    if (isSuccess) {
      if (data?.data && data?.data?.length > 0) {
        let modified_response = data?.data.map((response) => {
          return {
            ...response,
            full_name: `${response?.firstName} ${response?.lastName} (${response?.designation}) `,
          };
        });
        setMenuList(modified_response);
        const filteredArray = modified_response.filter((obj) =>
          userIds.includes(obj.userId)
        );
        setSelectedUser(filteredArray);
      }
    }
  };

  const getSource = async () => {
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
      setLocationData(locationArray);
    }
  };

  useEffect(() => {
    myDisclosureProgress();

    getSource();
  }, []);
  return (
    <>
      <Col md={12}>
        <div style={{ padding: 25 }}>
          <div className="esg_score_title d-flex align-items-center justify-content-between">
            <h5 className="m-0">
              <b>User Progress</b>
            </h5>
            {!allZero && (
              <button
                onClick={() => {
                  setFilter(true);
                }}
                className="new_button_style"
              >
                <i className="fas fa-filter" title="User Progress Filter"></i>
              </button>
            )}
          </div>
          <div className="p-0">
            <div className="main_text">
              {chartType !== "" ? (
                chartType
              ) : (
                <ColumnChart chartData={graphData} />
              )}
            </div>
          </div>
        </div>
      </Col>
      <Modal size="md" show={filter} onHide={handleFilterClose}>
        <Modal.Header closeButton>
          <Form.Label className="align-items-center m-0">
            <strong>User Progress Filter</strong>
          </Form.Label>
        </Modal.Header>
        <Modal.Body>
          {/* <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Location</Form.Label>
            <Multiselect
              displayValue="location"
              options={locationData}
              // selectedValues={selectedFramework}
              ref={multiselectRefTracker}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem, "LOCATION");
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems, "LOCATION");
              }}
            />
          </Form.Group> */}
          <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Name</Form.Label>
            <Multiselect
              displayValue="full_name"
              options={menuList}
              selectedValues={selectedUsers}
              ref={multiselectRefTracker}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem, "USER");
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems, "USER");
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStatusType">
            <Form.Label>Select Status Type</Form.Label>
            <Multiselect
              placeholder="Select Status Type"
              displayValue="full_name"
              className="multi_select_dropdown w-100"
              selectedValues={selectedStatus}
              options={getAllStatus}
              ref={multiselectRefTracker}
              onRemove={(removedItem) => {
                onRemoveHandler(removedItem, "STATUS");
              }}
              onSelect={(selectedItems) => {
                onSelectHandler(selectedItems, "STATUS");
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formChartType">
            <Form.Label>Select Chart Type</Form.Label>
            <Form.Select
              aria-label="Select Chart Type"
              onChange={(e) => setSelectedChartType(e.target.value)}
              value={selectedChartType}
            >
              <option value="ColumnChart">Column Chart</option>
              <option value="BarChart">Bar Chart</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="new_button_style" onClick={handleApplyFilter}>
            Apply
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubAdminComponent;
