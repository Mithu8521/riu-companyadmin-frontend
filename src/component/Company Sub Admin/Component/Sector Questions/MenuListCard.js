import React, { useReducer, useState } from 'react'
import { Link } from 'react-router-dom';

export default function MenuListCard({ data, inputFields, setInputFields, index, questions }) {
  const [showMultiSelect, setShowMultiSelect] = useReducer(
    (show) => !show,
    false
  );

  const [dataId, setDataId] = useState();
  const [error, setError] = useState('');
  let prevData;

  const findData = (str) => {
    const strArray = str.trim().split(",");
    let questionIndexes = [];
    let questionsId = [];
    for (let char of strArray) {
      if (Number.isNaN(Number(char))) {
        //   console.log("not a number", char);
        const newStrArray = char && char.split("-") || [];
        //   console.log("newStrAray", newStrArray);
        if (newStrArray.length === 2) {
          const firstChar = newStrArray[0];
          const secChar = newStrArray[1];
          if (Number.isNaN(Number(firstChar)) || Number.isNaN(Number(secChar))) {
            setError("Please enter a valid string. 1, 2, 3-5, 4");
            break;
          } else {
            if (+secChar > +firstChar) {
              let newArray = [];
              for (let i = firstChar; i <= secChar; i++) {
                newArray.push(i - 1);
              }
              questionIndexes = [...questionIndexes, ...newArray]
            } else {
              setError("Please enter a valid string. range should be in increamenatl mode 1-4");
              break;
            }
          }
        } else {
          setError("Please enter a valid range. 1, 2, 4-6, 7");
          break;
        }

      } else {
        // console.log("valid number", +char);
        questionIndexes.push(+char - 1)
      }
    }
    if (questionIndexes.length > 0) {
      const values = questions.map((data, index) => {
        const dataMatch = questionIndexes.some(value => value == index);
        if (dataMatch) {
          questionsId.push(data?.id);
          console.log(data?.id);
        }
      })
      console.log(questionsId, "values");
      prevData[index]['questions'] = questionsId;
      setInputFields(prevData);
    }
  };


  const findData = (str) => {
    const strArray = str.trim().split(",");
    let questionIndexes = [];
    let questionsId = [];
    for (let char of strArray) {
      if (Number.isNaN(Number(char))) {
        //   console.log("not a number", char);
        const newStrArray = char && char.split("-") || [];
        //   console.log("newStrAray", newStrArray);
        if (newStrArray.length === 2) {
          const firstChar = newStrArray[0];
          const secChar = newStrArray[1];
          if (Number.isNaN(Number(firstChar)) || Number.isNaN(Number(secChar))) {
            setError("Please enter a valid string. 1, 2, 3-5, 4");
            break;
          } else {
            if (+secChar > +firstChar) {
              let newArray = [];
              for (let i = firstChar; i <= secChar; i++) {
                newArray.push(i - 1);
              }
              questionIndexes = [...questionIndexes, ...newArray]
            } else {
              setError("Please enter a valid string. range should be in increamenatl mode 1-4");
              break;
            }
          }
        } else {
          setError("Please enter a valid range. 1, 2, 4-6, 7");
          break;
        }

      } else {
        // console.log("valid number", +char);
        questionIndexes.push(+char - 1)
      }
    }
    if (questionIndexes.length > 0) {
      const values = questions.map((data, index) => {
        const dataMatch = questionIndexes.some(value => value == index);
        if (dataMatch) {
          questionsId.push(data?.id);
          console.log(data?.id);
        }
      })
      console.log(questionsId, "values");
      prevData[index]['questions'] = questionsId;
      setInputFields(prevData);
    }
  };


  const changeHandler = (e) => {
    setDataId(e.target.value);
    prevData = inputFields;
    findData(e.target.value);
  }
  return (
    <div><div>
      <li
        className="d-flex pb-2"
        style={{ "align-items": "center" }}
      >
        <Link className="dropdown-item p-0" to="#">
          <div className="form-check check-form d-flex">
            <div className="form-d">
              <img
                className="flex_img"
                src="https://www.theseforeignroads.com/wp-content/uploads/2018/09/Essay-Roads-Featured.jpg"
                height="30"
                width="30"
                alt=""
              />
              <label
                className="form-check-label"
                htmlFor="exampleRadios1"
              >
                {data?.firstName} {data?.lastName}
              </label>
            </div>
          </div>
        </Link>
        <i
          className="fas fa-plus"
          role="button"
          onClick={setShowMultiSelect}
        />
      </li>
      {showMultiSelect && (
        <>
          <input
            name="range"
            placeholder="1-8"
            value={dataId}
            onChange={changeHandler}
          />
          {error && <>{error}</>}
        </>
      )}
    </div></div>
  )
}
