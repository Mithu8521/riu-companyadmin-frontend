import React, { useEffect, useReducer, useState, useRef } from "react";
import { Button, Dropdown, Modal, Row } from "react-bootstrap";
import axios from "axios";
import config from "../../../../config/config.json";
import AssigneeInputCard from "./AssigneeInputCard";
import Multiselect from "multiselect-react-dropdown";
import "./SectorQuestion.css";
import Swal from "sweetalert2";
import { authenticationService } from "../../../../_services/authentication";
import { apiCall } from "../../../../_services/apiCall";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
export default function AssignSubWorker({
  questions,
  financialYearId,
  fetchquestionApi,
  entity,
  show,
  onHide
}) {
  const [menuList, setMenuList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const multiselectRef = useRef(null);
  const [selectedId, setSelectedId] = useState([]);
  const [dataId, setDataId] = useState();
  const [questionNumber, setQuestionNumber] = useState();
  const [error, setError] = useState("");
  const onRemoveFrameworkHandler = (removedItem) => {
    console.log(removedItem, "removedItem")
    const updatedSelectedId = selectedId.filter(
      (item) => item !== removedItem.value
    );
    setSelectedId(updatedSelectedId);
  };

  const onSelectFrameworkHandler = (selectedItems) => {
    const selectedItemValues = selectedItems.map((item) => item.id);
    setSelectedId(selectedItemValues);
  };
  const [showMultiSelect1, setShowMultiSelect1] = useReducer(
    (show) => !show,
    false
  );

  const [selectedName, setSearchField] = useState("");

  const authValue = JSON.parse(localStorage.getItem("currentUser"));
  const handleChange = (e) => {
    setSearchField(e.target.value);
  };
  useEffect(() => {
    const currentUser = authenticationService?.currentUserSubject?.getValue();
    const settingsMenu = currentUser?.data?.menu?.find(
      (item) => item?.url === "sector_questions"
    );
    setPermissionList(settingsMenu?.permissions);
    getSubAdminCompanyWise();
  }, []);

  useEffect(() => {
    getSubAdminCompanyWise();
  }, [selectedName, entity]);

  const getSubAdminCompanyWise = () => {
    axios
      .get(
        `${config.API_URL}${entity === "company"
          ? `getSubUsers?type=ANSWER&name=${selectedName}&current_role=${localStorage.getItem("role")}`
          : `getMappedSuppliers?current_role=${localStorage.getItem("role")}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${authValue?.data?.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setMenuList(response?.data?.data);
        console.log(response, "assign Response");
      })
      .catch((error) => {
        console.log(error);
      });
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
          questionsId.push(data?.id);
          console.log(data?.id);
        }
      });
      console.log(questionsId, "values");
      setQuestionNumber(questionsId);
    }
  };
  const changeHandler = (e) => {
    setDataId(e.target.value);
    findData(e.target.value);
  };
  const saveHandler = async (e) => {

    e.preventDefault();
    const { isSuccess, data } = await apiCall(`${config.API_URL}saveQuestionCompanySubAdminWise`, {}, {
      financial_year_id: financialYearId,
      data: {
        assigned_ids: selectedId,
        questions: questionNumber,
      },
    }, "POST");
    if (isSuccess) {
      let response = data
      // if (response?.data?.alreadyAssignedQuestions.length > 0) {
      //   let number = [];
      //   let numberlist = response?.data?.data?.alreadyAssignedQuestions?.map(
      //     (data) => {
      //       const questionNumber = questions.findIndex(
      //         (item) => data === item.id
      //       );
      //       number.push(questionNumber + 1);
      //       console.log(number, "number");
      //     }
      //   );
      //   if (number.length > 0) {
      //     Swal.fire({
      //       icon: "success",
      //       title: "success",
      //       text: `Question number ${number} is already assign.`,
      //       timer: 6000,
      //     });
      //   }
      // } else 
      if (response?.data?.invalidIds.length > 0) {
        let number = [];
        response?.data?.data?.invalidIds?.map((data) => {
          const questionNumber = questions.findIndex(
            (item) => data === item.id
          );
          number.push(questionNumber + 1);
          console.log(number, "number");
        });
        // if (number.length > 0) {
        //   MySwal.fire({
        //     icon: "success",
        //     title: "success",
        //     title: (
        //       <div>
        //         Question number {number} is allready assign to another
        //         subadmin.
        //         <div>do you want to assign ?</div>
        //         <button
        //           style={{
        //             width: "100px",
        //             background: "#1f9ed1",
        //             padding: "16px 20px !important",
        //             borderRadius: "4px",
        //             border: "none",
        //             color: "#fff",
        //           }}
        //           onClick={() =>
        //             editHnadler(
        //               response?.data?.data?.invalidIds,
        //               data?.triggerr,
        //               data?.id
        //             )
        //           }
        //         >
        //           Yes
        //         </button>
        //       </div>
        //     ),
        //   });
        // }
      } else {
        Swal.fire({
          icon: "success",
          title: "success",
          text: response?.data?.message,
          timer: 3000,
        });
        onHide();
      }
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
      .delete(`${config.API_URL}deleteQuestionCompanySubAdminWise?current_role=${localStorage.getItem("role")}`, {
        data: dataValue,
        headers: {
          Authorization: `Bearer ${authValue?.data?.token}`,
          "Content-Type": "application/json",
        },
      })
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
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Assign SubWorker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dropdown">
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
            <Row className="mt-3">
              <label>Select Subadmi </label>
              <Multiselect
                placeholder="Assign Subadmin"
                displayValue="first_name"
                className="multi_select_dropdown w-100"
                options={menuList}
                ref={multiselectRef}
                onRemove={(removedItem) => {
                  onRemoveFrameworkHandler(removedItem);
                }}
                onSelect={(selectedItems) => {
                  onSelectFrameworkHandler(selectedItems);
                }}
              />
            </Row>
            {/* <img
          src="./save.png"
          className="action__icon"
          onClick={saveHandler}
        />
        <img
          src="./delete.png"
          className="action__icon"
          onClick={deleteHanlder}
        /> */}
            {/* <Dropdown>
          Assigned To:
          <Dropdown.Toggle variant="" id="dropdown-basic">
            <input
              className="dropdown-toggle select_one_all"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              readOnly
              value={selectedName}
              placeholder="Assign Subadmin"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className="d-head">
              <div className="items">
                <ul className="p-0 m-2">
                  <div
                    data-filter-item
                    className="filterNames"
                    id="filterNames"
                    data-filter-name=""
                  >
                    <input placeholder="Search" value={selectedName} onChange={handleChange}/>
                    
                    {(menuList.length > 0) &&
                      menuList?.map((data, index) => {
                        return (
                          <AssigneeInputCard
                            data={data}
                            key={index}
                            index={index}
                            authValue={authValue}
                            questions={questions}
                            financialYearId={financialYearId}
                            fetchquestionApi={fetchquestionApi}
                          />
                        );
                      })}
                  </div>
                </ul>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="new_button_style" onClick={saveHandler}>
            Save
          </Button>
          {permissionList?.includes("DELETE_ASSIGNED_QUESTION") && (
            <Button variant="danger" onClick={deleteHanlder}>
              Delete
            </Button>
          )}

        </Modal.Footer>
      </Modal>
    </>
  );
}
