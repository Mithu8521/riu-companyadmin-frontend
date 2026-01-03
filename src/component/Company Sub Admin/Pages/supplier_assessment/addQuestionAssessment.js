import React, { useState } from "react";

const AddQuestionAssessment = () => {
  const [inputFields, setInputFields] = useState([
    {
      question_type: "",
      questionHeading: "",
      question: "",
      question_detail: {},
      formula: "",
      graph_applicable: "NO",
    }
  ])

  const handleEnableGraph = (event, index) => {
    const values = [...inputFields];
    values[index]["graph_applicable"] = event.target.value
    setInputFields(values);
  };
  const handleFormula = (event, index) => {
    const values = [...inputFields];
    values[index]["formula"] = event.target.value
    setInputFields(values);
  };
  const handleChange = (event, index) => {
    const values = [...inputFields];

    values[index][event.target.name] = event.target.value;
    if (event.target.name == "question_type") {
      if (event.target.value == "tabular_question") {
        values[index]["question_detail"] = {
          "row": [""], "column": [""]
        }
      }
      else if (event.target.value == "quantitative_trends") {
        values[index]["question_detail"] = {
          "reading_value": [""]
        }


      }
      else if (event.target.value == "quantitative") {
        values[index]["question_detail"] = {
          "mcqs": [""]
        }


      }
      else if (event.target.value == "") {
        values[index]["question_detail"] = {}
      }
      else {
        values[index]["question_detail"] = {}
      }
    }
    setInputFields(values);
  };

  // adds new input
  const handleAdd = () => {
    setInputFields([
      ...inputFields,
      {
        question_type: "",
        questionHeading: "",
        question: "",
        question_detail: {},
        formula: "",
        graph_applicable: "NO",
      }
    ]);
  };

  // removes input
  const handleRemove = (index) => {
    if (inputFields.length !== 1) {
      const values = [...inputFields];
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  const addQuestionDetailLabel = (e, key, index) => {
    e.preventDefault();
    const values = [...inputFields]
    values[index]['question_detail'][key].push("")
    setInputFields(values);
  }

  const removeQuestionDetailLabel = (e, key, i, index) => {
    e.preventDefault();
    const values = [...inputFields]

    let row = values[index]['question_detail'][key]
    if (row.length < 2) {
      return false
    }
    row.splice(i, 1)
    setInputFields(values);
  }

  const handleQuestionDetailLabelChange = (event, key, i, index) => {
    event.preventDefault();
    const values = [...inputFields];
    values[index]['question_detail'][key][i] = event.target.value;
    setInputFields(values);
  };
  return (
    <>
      <form name="form">
        <div className="business_detail">
          {inputFields?.map((item, index) => (
            <>
              <div className="mb-4">
                <label htmlFor="industryType">Select Question Type*</label>
                <select
                  className="select_one industrylist"
                  name="question_type"
                  value={item.question_type}
                  onChange={(event) => handleChange(event, index)}
                >
                  <option>Select Question Type</option>
                  <option value="qualitative">Qualitative</option>
                  <option value="yes_no" title="">
                    Yes/No
                  </option>
                  <option value="quantitative">Quantitative</option>
                  <option value="tabular_question">Tabular Question</option>
                  <option value="quantitative_trends">
                    Quantitative Trends
                  </option>
                </select>
              </div>
              {item?.question_type === "qualitative" ||
                item?.question_type === "yes_no" ||
                item?.question_type === "quantitative" ||
                item?.question_type === "tabular_question" ||
                item?.question_type === "quantitative_trends" ? (
                <div className="mb-4">
                  <label htmlFor="title">Question Heading</label>
                  <input
                    type="text"
                    name="questionHeading"
                    className="form-control py-3"
                    placeholder="Enter Question Heading or Leave This Options"
                    value={item.questionHeading}
                    onChange={(event) => handleChange(event, index)}
                  />
                </div>
              ) : (
                ""
              )}
              {item.question_type === "quantitative_trends" && (
                <div className="mb-4">
                  <label htmlFor="title">Formula</label>
                  <input
                    type="text"
                    name="questionHeading"
                    className="form-control py-3"
                    placeholder="Enter Formula"
                    value={item.formula}
                    onChange={(event) => handleFormula(event, index)}
                  />
                </div>
              )}
              {item.question_type === "tabular_question" && (
                <div className="mb-4">
                  <label htmlFor="industryType">Enable Graph*</label>
                  <select
                    className="select_one industrylist"
                    name="question_type"
                    value={item?.graph_applicable}
                    onChange={(event) => handleEnableGraph(event, index)}
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                </div>
              )}
              {item?.question_type === "qualitative" ||
                item?.question_type === "yes_no" ||
                item?.question_type === "quantitative" ||
                item?.question_type === "tabular_question" ||
                item?.question_type === "quantitative_trends" ? (
                <div className="mb-4">
                  <label htmlFor="question">Sector Question* </label>
                  <textarea
                    type="text"
                    name="question"
                    className="form-control"
                    placeholder="Write Sector Question title"
                    value={item.question}
                    onChange={(event) => handleChange(event, index)}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="mb-4">
                {item.question_type === "quantitative_trends" ? (
                  <>
                    <label htmlFor="industryType">Reading Value Options</label>
                    {item.question_detail?.reading_value &&
                      item.question_detail.reading_value.map(
                        (currElement, i) => {
                          return (
                            <div className="d-flex">
                              <input
                                type="text"
                                className="form-control"
                                value={currElement}
                                placeholder={`Add Reading value label ${i + 1}`}
                                onChange={(e) =>
                                  handleQuestionDetailLabelChange(
                                    e,
                                    "reading_value",
                                    i,
                                    index
                                  )
                                }
                              />
                            </div>
                          );
                        }
                      )}
                  </>
                ) : (
                  ""
                )}
                {item.question_type === "tabular_question" ? (
                  <>
                    <div className="mt-2">
                      <label htmlFor="industryType">Add rows</label>
                      {item.question_detail?.row &&
                        item.question_detail.row.map((currElement, i) => {
                          return (
                            <div
                              className="d-flex mb-4 justify-content-between"
                              style={{ gap: "20px" }}
                            >
                              <input
                                type="text"
                                className="form-control"
                                value={currElement}
                                placeholder={`add row label ${i + 1}`}
                                onChange={(e) =>
                                  handleQuestionDetailLabelChange(
                                    e,
                                    "row",
                                    i,
                                    index
                                  )
                                }
                              />
                              <button
                                className="new_button_style-green"
                                style={{ width: "60px" }}
                                onClick={(e) =>
                                  addQuestionDetailLabel(e, "row", index)
                                }
                              >
                                <i
                                  className="fas fa-plus-circle"
                                  style={{ fontSize: "17px" }}
                                ></i>
                              </button>
                              <button
                                className="new_button_style-red"
                                style={{ width: "60px" }}
                                onClick={(e) =>
                                  removeQuestionDetailLabel(e, "row", i, index)
                                }
                              >
                                <i
                                  className="fas fa-trash-alt"
                                  style={{ fontSize: "17px" }}
                                ></i>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                    <label htmlFor="industryType">Add columns</label>
                    {item.question_detail?.column &&
                      item.question_detail?.column.map((currElement, i) => {
                        return (
                          <div
                            className="d-flex mb-4 justify-content-between"
                            style={{ gap: "20px" }}
                          >
                            <input
                              type="text"
                              className="form-control"
                              value={currElement}
                              placeholder={`add column label ${i + 1}`}
                              onChange={(e) =>
                                handleQuestionDetailLabelChange(
                                  e,
                                  "column",
                                  i,
                                  index
                                )
                              }
                            />
                            <button
                              className="new_button_style-green"
                              style={{ width: "60px" }}
                              onClick={(e) =>
                                addQuestionDetailLabel(e, "column", index)
                              }
                            >
                              <i
                                className="fas fa-plus-circle"
                                style={{ fontSize: "17px" }}
                              ></i>
                            </button>
                            <button
                              className="new_button_style-red"
                              style={{ width: "60px" }}
                              onClick={(e) =>
                                removeQuestionDetailLabel(e, "column", i, index)
                              }
                            >
                              <i
                                className="fas fa-trash-alt"
                                style={{ fontSize: "17px" }}
                              ></i>
                            </button>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  ""
                )}
              </div>
              {inputFields.length >= 2 ? (
                <div>
                  <button
                    type="button"
                    className="remove new_button_style-red mb-4 "
                    onClick={(e) => handleRemove(index)}
                  >
                    <i className="fas fa-trash-alt"></i> &nbsp; Delete
                  </button>
                </div>
              ) : (
                ""
              )}
            </>
          ))}
        </div>
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
          <div className="global_link">
            <button
              type="button"
              className="new_button_style add"
              onClick={(e) => handleAdd()}
            >
              ADD More
            </button>
          </div>
          <div className="global_link">
            <button type="submit" className="new_button_style">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddQuestionAssessment;
