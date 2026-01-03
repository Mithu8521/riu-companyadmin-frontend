import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FilterIcon from "../../../../../img/sector/filter.png";
import { Button, Col, Form, Row } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { apiCall } from "../../../../../_services/apiCall";
import config from "../../../../../config/config.json";

function SectorQuestionFilter(props) {
  const { companyEsgData, handleFilterHandler } = props;
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [kpisData, setKpisData] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [locationData, setLocationData] = useState([]);
  const [userData, setUserData] = useState([]);
  const multiselectRefTracker = useRef();
  const [show, setShow] = useState(false);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState([]);
  const [selectedDesignationId, setSelectedDesignationId] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [selectedKpiId, setSelectedKpiId] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getSubUser = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSubUser`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const userArray = data?.data?.reverse().map((item) => ({
        id: item.userId,
        role: `${item?.role}, ${item?.firstName}, ${item?.lastName}`,
      }));
      setUserData(userArray);
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
  const getKpiData = async (mandatoryIds, valentryIds, customIds) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getKpi`,
      {},
      {
        type: "ESG",
        voluntaryTopicsId: valentryIds,
        mandatoryTopicsId: mandatoryIds,
        customTopicsId: customIds,
      },
      "GET"
    );
    if (isSuccess) {
      const kpiIds = data?.data.mandatoryKpi
        .concat(data?.data.voluntaryKpi)
        .concat(data?.data.customKpi);
      const kpiId = companyEsgData.mandatoryKpiId
        .concat(companyEsgData.voluntaryKpiId)
        .concat(companyEsgData.customKpiId);
      const filteredKpiValue = kpiIds.filter((obj) => {
        return kpiId.find((value) => {
          return value === obj.id;
        });
      });
      setKpisData(filteredKpiValue);
    }
  };
  const fetchTopicData = async (frameworkIds) => {
    if (frameworkIds && frameworkIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getTopic`,
        {},
        { type: "ESG", frameworkIds }
      );

      if (isSuccess) {
        const topicIdsFromApi = [
          ...(data?.data.mandatory_topics || []),
          ...(data?.data.voluntary_topics || []),
          ...(data?.data.custom_topics || []),
        ];

        const filteredTopicValue = topicIdsFromApi.filter((obj) =>
          companyEsgData.mandatoryTopicsId
            .concat(companyEsgData.voluntaryTopicsId)
            .concat(companyEsgData.customTopicsId)
            .includes(obj.id)
        );

        const mapTopicIds = (type) =>
          filteredTopicValue
            .filter((item) => item.is_mendatory === type)
            .map((item) => item.id);

        const topicIds = {
          mandatory: mapTopicIds("YES"),
          valentry: mapTopicIds("NO"),
          custom: mapTopicIds("NEITHER"),
        };

        setTopicsData(filteredTopicValue);

        if (filteredTopicValue.length > 0) {
          getKpiData(topicIds.mandatory, topicIds.valentry, topicIds.custom);
        }
      }
    }
  };

  const fetchFrameworkApi = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getFramework`,
      {},
      { type: "ALL", userId: JSON.parse(localStorage.getItem("user_temp_id")) }
    );
    if (isSuccess) {
      const filteredFrameValue = data.data.filter((obj) => {
        return companyEsgData.frameworkId.find((value) => {
          return value === obj.id;
        });
      });
      if (filteredFrameValue && filteredFrameValue.length > 0) {
        setFrameworkValue(filteredFrameValue);
        let idArray = filteredFrameValue.map((item) => item.id);
        fetchTopicData(idArray);
      }
    }
  };

  const onSelectMultiHandler = (data, questionnaireType) => {
    const selectedMappingIds = data && data.map(({ id }) => id)
    if (questionnaireType === "FRAMEWORK") {
      setSelectedFrameworkId(selectedMappingIds || []);
      fetchTopicData(selectedMappingIds);
    } else if (questionnaireType === "TOPIC") {
      setSelectedTopicId(selectedMappingIds || []);
    } else if (questionnaireType === "ROLE") {
      setSelectedDesignationId(selectedMappingIds || []);
    } else if (questionnaireType === "USER") {
      setSelectedUserId(selectedMappingIds || []);
    } else if (questionnaireType === "KPI") {
      setSelectedKpiId(selectedMappingIds || []);
    } else if (questionnaireType === "LOCATION") {
      setSelectedLocationId(selectedMappingIds || []);
    } else if (questionnaireType === "STATUS") {
      setSelectedStatusId(selectedMappingIds || []);
    }
  };

  const onRemoveMultiHandler = (data, questionnaireType) => {
    onSelectMultiHandler(data, questionnaireType);
  };
  const statusData = [
    { id: 1, location: "Assign" },
    { id: 2, location: "Un-Assigned" },
    { id: 3, location: "Accepted" },
    { id: 4, location: "Rejected" }
  ];

  const applyFilter = () => {
    handleFilterHandler(
      selectedFrameworkId,
      selectedTopicId,
      selectedKpiId,
      selectedDesignationId,
      selectedUserId,
      selectedLocationId,
      fromDate,
      toDate,
      selectedStatusId
    );
  };
  useEffect(() => {
    if (show === true) {
      getSource();
      getSubUser();
      fetchFrameworkApi();
    }
  }, [show]);

  return (
    <>
      <img onClick={handleShow} src={FilterIcon} alt="" srcSet="" />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>Filter</div>
              <div className="d-flex align-items-center gap-3 mx-3">
                <p style={{ fontSize: 12 }} className="m-0">
                  From
                </p>
                <input
                  type="date"
                  style={{ fontSize: 12, padding: 5 }}
                  name=""
                  id=""
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min="2023-04-01"
                  max="2024-03-30"
                />
                <p style={{ fontSize: 12 }} className="m-0">
                  To
                </p>
                <input
                  type="date"
                  style={{ fontSize: 12, padding: 5 }}
                  name=""
                  id=""
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min="2023-04-01"
                  max="2024-03-30"
                />
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Question No.</Form.Label>
                <br />
                <input
                  className="w-100 h-25"
                  style={{ padding: 9 }}
                  type="text"
                  name=""
                  id=""
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Status</Form.Label>
                <Multiselect
                  displayValue="location"
                  options={statusData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, 'STATUS');
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, 'STATUS');
                  }}
                />
              </div>
            </Col>
            <div className="overRight__orModule">
              <hr />
              <p>or</p>
            </div>
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Role</Form.Label>
                <Multiselect
                  displayValue="role"
                  options={userData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    // onRemoveFrameworkHandler(e);
                  }}
                  onSelect={(e) => {
                    // onSelectFrameworkHandler(e);
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on User</Form.Label>
                <Multiselect
                  displayValue="role"
                  options={userData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "USER");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "USER");
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Source</Form.Label>
                <Multiselect
                  displayValue="location"
                  options={locationData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "LOCATION");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "LOCATION");
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Status</Form.Label>
                <Multiselect
                  displayValue="location"
                  options={statusData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, 'STATUS');
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, 'STATUS');
                  }}
                />
              </div>
            </Col>
            <Col md={12}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Framework</Form.Label>
                <Multiselect
                  displayValue="title"
                  options={frameworkValue}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "FRAMEWORK");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "FRAMEWORK");
                  }}
                />
              </div>
            </Col>
            <Col md={12}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Topic</Form.Label>
                <Multiselect
                  displayValue="title"
                  options={topicsData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "TOPIC");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "TOPIC");
                  }}
                />
              </div>
            </Col>
            <Col md={12}>
              <div className="mb-3">
                <Form.Label className="m-0">Based on Kpi</Form.Label>
                <Multiselect
                  displayValue="title"
                  options={kpisData}
                  // selectedValues={selectedFramework}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "KPI");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "KPI");
                  }}
                />
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={applyFilter}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SectorQuestionFilter;
