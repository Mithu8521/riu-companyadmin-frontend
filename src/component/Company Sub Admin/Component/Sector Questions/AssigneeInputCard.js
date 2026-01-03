import React, { useReducer, useState } from "react";
import config from "../../../../config/config.json";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AssigneeInputCard({
  data,
  index,
  questions,
  authValue,
  financialYearId,
  fetchquestionApi
}) {
  const [dataId, setDataId] = useState();
  const [error, setError] = useState("");
  const [questionNumber, setQuestionNumber] = useState();
  const [showMultiSelect, setShowMultiSelect] = useReducer(
    (show) => !show,
    false
  );
  const [editPopup, setEditPopup] = useState(false);
  const [serialNumber, setSetSerialNumber] = useState([]);

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
      setQuestionNumber(questionsId);
    }
  };

  const changeHandler = (e) => {
    setDataId(e.target.value);
    findData(e.target.value);
  };

  const saveHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        `${config.API_URL}saveQuestionCompanySubAdminWise`,
        {
          company_id: localStorage.getItem('user_temp_id'),
          current_role: localStorage.getItem("role"),
          financial_year_id: financialYearId,
          data: {
            assigned_id: data?.id,
            questions: questionNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        // fetchquestionApi();
        if (response?.data?.data?.alreadyAssignedQuestions.length > 0) {
          let number = [];
          let numberlist = response?.data?.data?.alreadyAssignedQuestions?.map(
            (data) => {
              const questionNumber = questions.findIndex(
                (item) => data === item.id
              );
              number.push(questionNumber + 1);
              console.log(number, "number");
            }
          );
          if (number.length > 0) {
            Swal.fire({
              icon: "success",
              title: "success",
              text: `Question number ${number} is already assign.`,
              timer: 6000,
            });
          }
        } else if (response?.data?.data?.invalidIds.length > 0) {
          let number = [];
          response?.data?.data?.invalidIds?.map((data) => {
            const questionNumber = questions.findIndex(
              (item) => data === item.id
            );
            number.push(questionNumber + 1);
            console.log(number, "number");
          });
          if (number.length > 0) {
            MySwal.fire({
              icon: "success",
              title: "success",
              title: (
                <div>
                  Question number {number} is allready assign to another
                  subadmin.
                  <div>do you want to assign ?</div>
                  <button
                    style={{
                      width: "100px",
                      background: "#1f9ed1",
                      padding: "16px 20px !important",
                      borderRadius: "4px",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={() =>
                      editHnadler(
                        response?.data?.data?.invalidIds,
                        data?.triggerr,
                        data?.id
                      )
                    }
                  >
                    Yes
                  </button>
                </div>
              ),
            });
          }
        } else {
          Swal.fire({
            icon: "success",
            title: "success",
            text: response?.data?.data?.message,
            timer: 1000,
          });
        }
      });
  };
  const editHnadler = (questionId, companyId, UserID) => {
    axios
      .post(
        `${config.API_URL}updateQuestionCompanySubAdminWise`,
        {
          company_id: localStorage.getItem('user_temp_id'),
          assigned_id: UserID,
          question_id: questionId,
          financial_year_id: financialYearId,
          current_role: localStorage.getItem("role"),
        },
        {
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
      });
  };
  const deleteHanlder = () => {
    const dataValue = {
      company_id: localStorage.getItem('user_temp_id'),
      data: {
        assigned_id: data?.id,
        questions: questionNumber,
      },
      financial_year_id: financialYearId,
    };

    axios
      .delete(`${config.API_URL}deleteQuestionCompanySubAdminWise?current_role=${localStorage.getItem("role")}`, {
        data: dataValue,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      });
  };
  console.log(dataId, "dataId");
  return (
    <div>
      {/* {editPopup && <EditAssigneeAdminPopup/>} */}
      <div className="dropdown__Wrapper" onClick={setShowMultiSelect}>
        <div className="form-check check-form d-flex">
          <div className="form-d">
            <img
              className="flex_img"
              src="https://www.theseforeignroads.com/wp-content/uploads/2018/09/Essay-Roads-Featured.jpg"
              height="30"
              width="30"
              alt=""
            />
            <label className="form-check-label" htmlFor="exampleRadios1">
              {data?.first_name} {data?.last_name}
            </label>
          </div>
        </div>
        <div className="arrow__icon__wrapper">
          <img src="./arrow.png" className="arrow__icon" />
        </div>
      </div>
      {showMultiSelect && (
        <div className="input__filels__wrapper">
          <input
            style={{ width: "150px" }}
            placeholder="1-8,10"
            value={dataId}
            onChange={changeHandler}
          />
          <img
            src="./save.png"
            className="action__icon"
            onClick={saveHandler}
          />
          {/* <img
            src="./edit.png"
            className="action__icon"
            onClick={editHnadler}
          /> */}
          <img
            src="./delete.png"
            className="action__icon"
            onClick={deleteHanlder}
          />
        </div>
      )}
    </div>
  );
}
