import React, { useEffect, useState, useRef } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import config from "../../../../config/config.json";
import Multiselect from "multiselect-react-dropdown";
import "./SectorQuestion.css";
import { apiCall } from "../../../../_services/apiCall";
import DatePicker from "react-datepicker";
import ConvertDate from "../../../../utils/ConvertDate";
import { NavLink } from "react-router-dom";

export default function ReAssignQuestions({
  usersId,
  financialYearId,
  reassignShow,
  onHide,
  tabType,
  handleAssignedDetails,
  type,
}) {
  const [menuList, setMenuList] = useState([]);
  const [unAssignedUserList, setUnAssignedUserList] = useState([]);
  const [assignQuestionList, setAssignQuestionList] = useState([]);
  const multiselectRef = useRef(null);
  const [dataId, setDataId] = useState();
  const [questionNumber, setQuestionNumber] = useState();
  const multiselectRefTracker = useRef();
  const userRef = useRef();
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
  const [reAssignUserId, setReAssignUserId] = useState();
  const [selectedReRoleId, setSelectedReroleId] = useState([]);
  const [managementListValue, setManagementListValue] = useState([]);
  const [assignToMe, setAssignToMe] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const headOffice = currentUser?.head_office;

  useEffect(
    () => {
      current_user_type_code === "company" && getSubUser();
      current_role === "SUPPLIER" && getDataAdminSupplierWise();
    },
    [
      // selectedName
    ]
  );

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

  const getSubUsers = async (desigantionIds) => {
    if (desigantionIds && desigantionIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getSubUserBasedOnRoleIds`,
        {},
        { roleIds: desigantionIds },
        "GET"
      );
      if (isSuccess) {
        if (data?.data && data?.data?.length === 0) {
          setUnAssignedUserList(data?.data);
        } else {
          //   const filteredData = showOnlyHeadOffice
          //     ? data?.data.filter((entry) => entry.haveHeadOffice === true)
          //     : data?.data;
          let modified_response = data?.data.map((response) => {
            return {
              ...response,
              full_name: `${response?.firstName} ${response?.lastName}(${response?.designation} )`,
            };
          });
          setUnAssignedUserList(modified_response);
        }
      }
    }
  };
  const getAssignedSectorQuestion = async (userIds) => {
    if (userIds && userIds.length > 0) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getAssignedQuestionDetails`,
        {},
        { userId: userIds },
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
      const values = assignQuestionList.map((data, index) => {
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
      `${config.POSTLOGIN_API_URL_COMPANY}reassignedQuestionToUser`,
      {},
      {
        financialYearId: Number(financialYearId),
        reAssignedToIds: reAssignUserId,
        assignedToIds: assignToMe ? [currentUserId] : selectedUserId,
        questionIds: questionNumber,
        moduleType: "SQ",
        questionnaireType: "CA",
        dueDate: ConvertDate(dueDate),
      },
      "POST"
    );

    if (isSuccess) {
      onHide();
    }
  };

  const onSelectMultiHandler = (data, questionnaireType) => {
    const selectedMappingIds =
      questionnaireType === "USER"
        ? data && data.map(({ userId }) => userId)
        : data && data.map(({ id }) => id);
    if (questionnaireType === "FRAMEWORK") {
      setSelectedFrameworkId(selectedMappingIds || []);
    } else if (questionnaireType === "TOPIC") {
      setSelectedTopicId(selectedMappingIds || []);
    } else if (questionnaireType === "ROLE") {
      setSelectedDesignationId(selectedMappingIds || []);
    } else if (questionnaireType === "REUSER") {
      setSelectedUserId(selectedMappingIds || []);
      getAssignedSectorQuestion(selectedMappingIds);
    } else if (questionnaireType === "KPI") {
      setSelectedKpiId(selectedMappingIds || []);
    } else if (questionnaireType === "LOCATION") {
      setSelectedReroleId(selectedMappingIds || []);
    } else if (questionnaireType === "REROLE") {
      setSelectedReroleId(selectedMappingIds || []);
    } else if (questionnaireType === "USER") {
      setSelectedUserId(selectedMappingIds || []);
    }
  };

  const onRemoveMultiHandler = (data, questionnaireType) => {
    onSelectMultiHandler(data, questionnaireType);
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

  const getAssignedQuestion = async (id) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAssignedQuestionDetails`,
      {},
      { userId: id, financialYearId: financialYearId },
      "GET"
    );
    if (isSuccess) {
      if (data?.data?.data === undefined) {
        setAssignQuestionList([]);
        setQuestionNumber([]);
      } else {
        setAssignQuestionList(data?.data?.data);
        const idArray = [];
        for (let i = 0; i < data?.data?.data.length; i++) {
          idArray.push(data?.data?.data[i].id);
        }
        setQuestionNumber(idArray);
      }
    }
  };

  const handleUsers = async (id) => {
    setReAssignUserId(id);
    getAssignedQuestion(id);
  };

  const checkboxChangeHandler = () => {
    setAssignToMe((prevAssignToMe) => !prevAssignToMe);
    setSelectedFrameworkId([]);
    setSelectedDesignationId([]);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedUserId([selectedOption]);
  };

  useEffect(() => {
    if (reassignShow === true) {
      getDesignation();
    }
  }, [reassignShow]);

  useEffect(() => {
    if (type === "USERID") {
      getAssignedQuestion(usersId);
      setReAssignUserId(usersId);
    }
  }, [type]);

  useEffect(() => {
    if (selectedDesignationId && selectedDesignationId?.length > 0) {
      getSubUser(selectedDesignationId);
    }
  }, [selectedDesignationId]);

  useEffect(() => {
    if (selectedReRoleId && selectedReRoleId?.length > 0) {
      getSubUsers(selectedReRoleId);
    }
  }, [selectedReRoleId]);
  return (
    <>
      <Modal
        show={reassignShow}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Reassign Questions to User</Form.Label>
          </Modal.Title>
        </Modal.Header>
        {tabType === "AUDIT" ? (
          <Modal.Body>
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
            {!assignToMe && questionNumber && questionNumber?.length > 0 && (
              <div className="mt-3">
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
              </div>
            )}
          </Modal.Body>
        ) : (
          <Modal.Body>
            {type != "USERID" && (
              <div className="mb-3">
                <label>Select Role</label>
                <Multiselect
                  displayValue="role_name"
                  options={managementListValue}
                  ref={multiselectRefTracker}
                  onRemove={(e) => {
                    onRemoveMultiHandler(e, "REROLE");
                  }}
                  onSelect={(e) => {
                    onSelectMultiHandler(e, "REROLE");
                  }}
                />
              </div>
            )}
            {unAssignedUserList?.length > 0 && (
              <div className="mb-3">
                <label>Select User</label>
                <select
                  className="select___year"
                  style={{ height: 45 }}
                  ref={userRef}
                  placeholder="select user"
                  onChange={(e) => handleUsers(e.target.value)}
                >
                  <option value="">Select User</option>
                  {unAssignedUserList.map((data) => (
                    <option key={data.userId} value={data.userId}>
                      {data.full_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {assignQuestionList && assignQuestionList?.length > 0 && (
              <div className="mb-3">
                <label>Question List</label>
                <div style={{ height: 217, overflow: "auto" }}>
                  <Table striped hover bordered className="m-0">
                    <tbody>
                      <tr className="fixed_tr_section">
                        <td style={{ width: 55 }}>Sr No</td>
                        <td>Question</td>
                      </tr>
                      {assignQuestionList.map((question, index) => (
                        <tr key={question.id}>
                          <td>{index + 1}</td>
                          <td>{question?.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
            {assignQuestionList && assignQuestionList?.length > 0 && (
              <>
                <div className="mb-3">
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
                </div>
                <div className="mb-3">
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
                </div>
              </>
            )}
            {assignQuestionList && assignQuestionList?.length > 0 && (
              <>
                <hr />
                <div className="mb-3">
                  <label>Select Role</label>
                  <Multiselect
                    displayValue="role_name"
                    options={managementListValue}
                    ref={multiselectRefTracker}
                    onRemove={(e) => {
                      onRemoveMultiHandler(e, "ROLE");
                    }}
                    onSelect={(e) => {
                      onSelectMultiHandler(e, "ROLE");
                    }}
                  />
                </div>
              </>
            )}
            {!assignToMe &&
              selectedDesignationId &&
              selectedDesignationId?.length > 0 && (
                <div className="mb-3">
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
                </div>
              )}
            {headOffice &&
              (assignToMe ||
                (selectedUserId && selectedUserId?.length > 0)) && (
                <div className="mb-3">
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
                </div>
              )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <NavLink to={"#"} className="me-4">
            Clear
          </NavLink>
          <button
            className="new_button_style"
            onClick={tabType === "AUDIT" ? assignAuditor : saveHandler}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
