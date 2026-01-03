import React, { useEffect, useState, useRef } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import config from "../../../../config/config.json";
import Multiselect from "multiselect-react-dropdown";
import "./SectorQuestion.css";
import Swal from "sweetalert2";
import { apiCall } from "../../../../_services/apiCall";
import DatePicker from "react-datepicker";
import ConvertDate from "../../../../utils/ConvertDate";
import { NavLink } from "react-router-dom";

export default function ReassignUser({
  questions,
  financialYearId,
  show,
  onHide,
  tabType,
  companyEsgData,
  handleAssignedDetails,
}) {
  const [menuList, setMenuList] = useState([]);
  const [frameworkValue, setFrameworkValue] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [kpisData, setKpisData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const multiselectRef = useRef(null);
  const [selectedId, setSelectedId] = useState([]);
  const [dataId, setDataId] = useState();
  const [questionNumber, setQuestionNumber] = useState();
  const multiselectRefTracker = useRef();
  const [error, setError] = useState("");
  const [showOnlyHeadOffice, setShowOnlyHeadOffice] = useState(true);
  const [dueDate, setDueDate] = useState(new Date());
  const userId = JSON.parse(localStorage.getItem("user_temp_id"));
  const current_role = localStorage.getItem("role");
  const current_user_type_code = "company";
  const [selectedFrameworkId, setSelectedFrameworkId] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState([]);
  const [selectedDesignationId, setSelectedDesignationId] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [selectedKpiId, setSelectedKpiId] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState([]);
  const [managementListValue, setManagementListValue] = useState("");
  const [assignToMe, setAssignToMe] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const headOffice = currentUser?.head_office;

  const onRemoveHandler = (removedItem) => {
    console.log("dipak", removedItem);
    const updatedSelectedId = [...selectedId]; // Create a copy of the selectedId array
    const indexToRemove = updatedSelectedId.findIndex(
      (item) => item === removedItem[0]?.userId
    );

    if (indexToRemove !== -1) {
      updatedSelectedId.splice(indexToRemove, 1); // Remove the item at the found index
      setSelectedId(updatedSelectedId);
    }
    console.log("dipak", updatedSelectedId);
  };

  const onSelectHandler = (selectedItems) => {
    const selectedItemValues = selectedItems.map((item) => item.userId);
    setSelectedId(selectedItemValues);
  };

  useEffect(() => {
    // current_user_type_code === "company" && getSubUser();
    const settingsMenu = JSON.parse(localStorage.getItem("menu")).find(
      (item) => item?.url === "sector_questions"
    );
    setPermissionList(settingsMenu?.permissions);
  }, []);

  useEffect(
    () => {
      current_user_type_code === "company" && getSubUser();
      current_role === "SUPPLIER" && getDataAdminSupplierWise();
    },
    [
      // selectedName
    ]
  );

  const handleSelectChange = (selectedOption) => {
    setSelectedUserId([selectedOption]);
  };

  const getDataAdminSupplierWise = () => {
    axios
      .get(
        `${config.API_URL
        }getSupplierDataAdmins?current_role=${localStorage.getItem("role")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        let modified_response = response?.data?.data.map((response) => {
          return {
            ...response,
            full_name: `${response?.first_name} ${response?.last_name}`,
          };
        });
        setMenuList(modified_response);
      })
      .catch((error) => { });
  };

  const getSubUser = async (desigantionIds) => {
    if (desigantionIds && desigantionIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSubUserBasedOnRoleId`,
        {},
        { roleId: desigantionIds[0] },
        "GET"
      );
      if (isSuccess) {
        if (data?.data && data?.data?.length === 0) {
          setMenuList(data?.data);
        } else {
          const filteredData = showOnlyHeadOffice
            ? data?.data.filter((entry) => entry.haveHeadOffice === true)
            : data?.data;
          let modified_response = filteredData.map((response) => {
            return {
              ...response,
              full_name: `${response?.firstName} ${response?.lastName}(${response?.designation} )`,
            };
          });
          setMenuList(modified_response);
        }
      }
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
      if (
        data?.data?.customKpi?.length === 0 &&
        data?.data?.mandatoryKpi?.length === 0 &&
        data?.data?.voluntaryKpi?.length === 0
      ) {
        setKpisData([]);
      } else {
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
        console.log(data.data);
        setKpisData(filteredKpiValue);
      }
    }
  };
  const getSectorQuestion = async () => {
    axios
      .get(
        `${config.POSTLOGIN_API_URL_COMPANY}getSectorQuestion?type=CUSTOM&financialYearId=${financialYearId}&questionnaireType=SQ&frameworkIds=[${selectedFrameworkId}]&topicIds=[${selectedTopicId}]&kpiIds=[${selectedKpiId}]`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        const responseData = response.data.data;
        const idArray = [];

        for (let i = 0; i < responseData.length; i++) {
          idArray.push(responseData[i].id);
        }

        setQuestionNumber(idArray);
      })
      .catch((error) => {
        console.log(error);
      });
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
      if (
        data?.data &&
        data?.data?.length > 0 &&
        companyEsgData.frameworkId?.length > 0
      ) {
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
    }
  };

  const findData = (str) => {
    const strArray = str.trim().split(",");
    let questionIndexes = [];
    let questionsId = [];
    for (let char of strArray) {
      if (Number.isNaN(Number(char))) {
        const newStrArray = (char && char.split("-")) || [];
        if (newStrArray.length === 2) {
          const firstChar = newStrArray[0];
          const secChar = newStrArray[1];
          if (
            Number.isNaN(Number(firstChar)) ||
            Number.isNaN(Number(secChar))
          ) {
            setError("Please enter a valid string. 1, 2, 3-5, 4");
            break;
          } else {
            if (+secChar > +firstChar) {
              let newArray = [];
              for (let i = firstChar; i <= secChar; i++) {
                newArray.push(i - 1);
              }
              questionIndexes = [...questionIndexes, ...newArray];
            } else {
              setError(
                "Please enter a valid string. range should be in increamenatl mode 1-4"
              );
              break;
            }
          }
        } else {
          setError("Please enter a valid range. 1, 2, 4-6, 7");
          break;
        }
      } else {
        questionIndexes.push(+char - 1);
      }
    }
    if (questionIndexes.length > 0) {
      const values = questions.map((data, index) => {
        const dataMatch = questionIndexes.some((value) => value == index);

        if (dataMatch) {
          const questionType = data?.questionType;
          if (
            questionType === "tabular_question" ||
            questionType === "quantitative_trends"
          ) {
            setShowOnlyHeadOffice(false);
          }

          tabType === "AUDIT"
            ? questionsId.push(data?.questionId)
            : questionsId.push(data?.id);
        }
      });

      setQuestionNumber(questionsId);
    }
  };

  const changeHandler = (e) => {
    setDataId(e.target.value);
    findData(e.target.value);
  };

  const assignAuditor = async (e) => {
    e.preventDefault();

    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}assignedQuestionToAuditor`,
      {},
      {
        financialYearId: 6,
        assignedToIds: selectedUserId,
        questionIds: questionNumber,
        moduleType: "SQ",
        questionnaireType: "CA",
      },
      "POST"
    );

    if (isSuccess) {
      onHide();
    }
  };

  const saveHandler = async (e) => {
    e.preventDefault();
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}assignedQuestionToUser`,
      {},
      {
        financialYearId: Number(financialYearId),
        assignedToIds: assignToMe ? [currentUserId] : selectedUserId,
        questionIds: questionNumber,
        moduleType: "SQ",
        questionnaireType: "CA",
        // sourceIds: selectedLocationId,
        dueDate: ConvertDate(dueDate),
      },
      "POST"
    );

    if (isSuccess) {
      handleAssignedDetails();
      onHide();
    }
  };

  const deleteHanlder = () => {
    const dataValue = {
      data: {
        assigned_ids: selectedId,
        questions: questionNumber,
      },
      financial_year_id: financialYearId,
    };

    axios
      .delete(
        `${config.API_URL
        }deleteQuestionCompanySubAdminWise?current_role=${localStorage.getItem(
          "role"
        )}`,
        {
          data: dataValue,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // fetchquestionApi();
        Swal.fire({
          icon: "success",
          title: "success",
          text: response?.data?.data?.message,
          timer: 1000,
        });
        onHide();
      });
  };

  const onSelectMultiHandler = (data, questionnaireType) => {
    const selectedMappingIds =
      questionnaireType === "USER"
        ? data && data.map(({ userId }) => userId)
        : data && data.map(({ id }) => id);
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
    }
  };

  const onRemoveMultiHandler = (data, questionnaireType) => {
    onSelectMultiHandler(data, questionnaireType);
  };

  const getSource = async () => {
    console.log("oprationalModule1");

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

  const getDesignation = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getMasterData`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      const nonAuditorRoles = data?.data.filter(
        (role) => role.onlyauditor !== true
      );
      setManagementListValue(nonAuditorRoles?.reverse());
    }
  };
  const checkboxChangeHandler = () => {
    setAssignToMe((prevAssignToMe) => !prevAssignToMe);
    setSelectedFrameworkId([]);
    setSelectedDesignationId([]);
  };

  useEffect(() => {
    if (show === true) {
      getDesignation();
      getSource();
      fetchFrameworkApi();
    }
  }, [show]);
  useEffect(() => {
    if (selectedUserId.length > 0) {
      getSectorQuestion();
    }
  }, [selectedUserId]);
  useEffect(() => {
    if (selectedDesignationId && selectedDesignationId?.length > 0) {
      getSubUser(selectedDesignationId);
    }
  }, [selectedDesignationId]);
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Assign Questions to User</Form.Label>
          </Modal.Title>
        </Modal.Header>
        {tabType === "AUDIT" ? (
          <Modal.Body>
            <>
              <Row>
                <label>Range</label>
                <div>
                  <input
                    className="w-100"
                    placeholder="1-8,10"
                    value={dataId}
                    onChange={changeHandler}
                    level="Range"
                  />
                </div>
              </Row>
            </>

            {!assignToMe && questionNumber && questionNumber?.length > 0 && (
              <Row className="mt-3">
                <label>Select User</label>
                <Multiselect
                  placeholder={"Assign User"}
                  displayValue="full_name"
                  options={menuList}
                  ref={multiselectRef}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "USER");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "USER");
                  }}
                />
              </Row>
            )}
          </Modal.Body>
        ) : (
          <Modal.Body>
            {selectedFrameworkId && selectedFrameworkId?.length === 0 && (
              <>
                <Row>
                  <label>Range</label>
                  <div>
                    <input
                      className="w-100"
                      placeholder="1-8,10"
                      value={dataId}
                      onChange={changeHandler}
                      level="Range"
                    />
                  </div>
                  {headOffice && (
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          checked={assignToMe}
                          className="me-2"
                          onChange={checkboxChangeHandler}
                        />
                        Assign to me
                      </label>
                    </div>
                  )}
                </Row>
              </>
            )}
            {dataId === undefined && selectedFrameworkId?.length === 0 && (
              <hr className="hr-text" data-content="Or" />
            )}
            {!dataId && (
              <Col md={12} className="mt-2">
                <div>
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
            )}
            {selectedFrameworkId && selectedFrameworkId?.length > 0 && (
              <Col md={12} className="mt-2">
                <div>
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
                {headOffice && (
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={assignToMe}
                        className="me-2"
                        onChange={checkboxChangeHandler}
                      />
                      Assign to me
                    </label>
                  </div>
                )}
              </Col>
            )}
            {selectedTopicId &&
              selectedTopicId?.length > 0 &&
              kpisData &&
              kpisData?.length > 0 && (
                <Col md={12} className="mt-2">
                  <div>
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
              )}
            {!assignToMe &&
              (dataId ||
                (selectedFrameworkId && selectedFrameworkId?.length > 0)) && (
                <Row className="mt-3">
                  <label>Select Role</label>
                  <Multiselect
                    displayValue="role_name"
                    options={managementListValue}
                    // selectedValues={selectedFramework}
                    ref={multiselectRefTracker}
                    onRemove={(e) => {
                      onRemoveMultiHandler(e, "ROLE");
                    }}
                    onSelect={(e) => {
                      onSelectMultiHandler(e, "ROLE");
                    }}
                  />
                </Row>
              )}
            {!assignToMe &&
              selectedDesignationId &&
              selectedDesignationId?.length > 0 && (
                <Row className="mt-3">
                  <label>Select User</label>
                  {showOnlyHeadOffice ? (
                    <div className="form-group pb-3">
                      <select
                        className="select_one industrylist"
                        onChange={(e) => handleSelectChange(e.target.value)}
                      >
                        <option value="">Select User</option>
                        {menuList?.length > 0 &&
                          menuList?.map((data, index) => {
                            return (
                              <option key={index} value={data?.userId}>
                                {data?.full_name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  ) : (
                    <Multiselect
                      placeholder={"Assign User"}
                      displayValue="full_name"
                      options={menuList}
                      ref={multiselectRef}
                      onRemove={(e) => {
                        onRemoveMultiHandler(e, "USER");
                      }}
                      onSelect={(e) => {
                        onSelectMultiHandler(e, "USER");
                      }}
                    />
                  )}
                </Row>
              )}

            {/* {selectedUserId && selectedUserId?.length > 0 && (
            <Row className="mt-3">
              <label>Select location</label>
              <Multiselect
                placeholder={"select location"}
                displayValue="location"
                options={locationData}
                ref={multiselectRef}
                onRemove={(e) => {
                  onRemoveMultiHandler(e, "LOCATION");
                }}
                onSelect={(e) => {
                  onSelectMultiHandler(e, "LOCATION");
                }}
              />
            </Row>
          )} */}

            {headOffice &&
              (assignToMe ||
                (selectedUserId && selectedUserId?.length > 0)) && (
                <Row className="mt-3">
                  <label>Select Due Date</label>
                  <DatePicker
                    selected={dueDate}
                    onChange={(e) => {
                      setDueDate(e);
                    }}
                    className="form-control date-picker-input"
                    required
                    minDate={new Date()}
                  />
                </Row>
              )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <NavLink to={"/"} className="me-4">
            Clear
          </NavLink>
          <button
            className="new_button_style"
            onClick={tabType === "AUDIT" ? assignAuditor : saveHandler}
          >
            Save
          </button>
          {/* {permissionList?.includes("DELETE_ASSIGNED_QUESTION") && ( */}
          {/* <Button variant="danger" onClick={deleteHanlder}>
            Delete
          </Button> */}
          {/* )} */}
        </Modal.Footer>
      </Modal>
    </>
  );
}
