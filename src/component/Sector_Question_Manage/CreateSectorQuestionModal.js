import React, { useState } from "react";
import config from "../../config/config.json";
import { apiCall } from "../../_services/apiCall";
import { Col, Row } from "react-bootstrap";

const CreateSectorQuestionModal = (prpos) => {
  const {
    currentFrameworksData,
    currentTopicData,
    frameworkData,
    currentKpiData,
    currentAddFrameworkQuestionData,
    addQuestionList,
    module,
    financial_year_id,
  } = prpos;
  console.log(financial_year_id, currentTopicData);
  const [inputFields, setInputFields] = useState([
    {
      questionType: "",
      questionHeading: "",
      questionTitle: "",
      question_detail: {},
      formula: "",
      graphApplicable: "NO",
    },
  ]);
  const [entity, setEntity] = useState("company");

  const handleEnableGraph = (event, index) => {
    const values = [...inputFields];
    values[index]["graphApplicable"] = event.target.value;
    setInputFields(values);
  };
  const handleFormula = (event, index) => {
    const values = [...inputFields];
    values[index]["formula"] = event.target.value;
    setInputFields(values);
  };
  const handleChange = (event, index) => {
    const values = [...inputFields];

    values[index][event.target.name] = event.target.value;
    if (event.target.name == "questionType") {
      if (event.target.value == "tabular_question") {
        values[index]["question_detail"] = {
          row: [""],
          column: [""],
        };
      } else if (event.target.value == "quantitative_trends") {
        values[index]["question_detail"] = {
          reading_value: [""],
        };
      } else if (event.target.value == "quantitative") {
        values[index]["question_detail"] = {
          mcqs: [""],
        };
      } else if (event.target.value == "") {
        values[index]["question_detail"] = {};
      } else {
        values[index]["question_detail"] = {};
      }
    }
    setInputFields(values);
  };

  const handleAdd = () => {
    setInputFields([
      ...inputFields,
      {
        questionType: "",
        questionHeading: "",
        questionTitle: "",
        question_detail: {},
        formula: "",
        graphApplicable: "NO",
      },
    ]);
  };

  const handleRemove = (index) => {
    if (inputFields.length !== 1) {
      const values = [...inputFields];
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    if (currentKpiData) {
      obj.frameworkId = currentAddFrameworkQuestionData?.id;
      obj.topicId = currentKpiData?.topicId;
      obj.kpiId = currentKpiData.id;
    } else if (currentTopicData) {
      obj.frameworkId = currentTopicData?.frameworkId;
      obj.topicId = currentTopicData?.id;
    } else {
      obj.frameworkId = currentFrameworksData?.id;
    }

    obj.entity = entity;
    obj.questions = JSON.stringify(inputFields);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}createCustomSectorQuestion`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
    }
  };

  const createAssessmentQuestion = async (e) => {
    e.preventDefault();
    console.log(financial_year_id);
    let obj = {};
    obj.entity = "supplier";
    obj.financialYearId = financial_year_id?.id;
    obj.questions = JSON.stringify(inputFields);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}createAssessmentQuestion`,
      {},
      obj,
      "POST"
    );
    if (isSuccess) {
    }
  };

  const addQuestionDetailLabel = (e, key, index) => {
    e.preventDefault();
    const values = [...inputFields];
    values[index]["question_detail"][key].push("");
    setInputFields(values);
  };

  const removeQuestionDetailLabel = (e, key, i, index) => {
    e.preventDefault();
    const values = [...inputFields];

    let row = values[index]["question_detail"][key];
    if (row.length < 2) {
      return false;
    }
    row.splice(i, 1);
    setInputFields(values);
  };

  const handleQuestionDetailLabelChange = (event, key, i, index) => {
    event.preventDefault();
    const values = [...inputFields];
    values[index]["question_detail"][key][i] = event.target.value;
    setInputFields(values);
  };

  return (
    <>
      <form
        name="form"
        onSubmit={(e) =>
          module === "SUPPLIER_QUESTION_LIST"
            ? createAssessmentQuestion(e)
            : handleSubmit(e)
        }
      >
        <div className="business_detail">
          {module !== "SUPPLIER_QUESTION_LIST" && (
            <div className="py-2 px-3">
              <p className="m-0">
                <b>
                  {addQuestionList?.frameworkTitle +
                    "/" +
                    addQuestionList?.topicTitle +
                    (addQuestionList?.kpiTitle === undefined
                      ? " "
                      : +"/" + addQuestionList?.kpiTitle)}
                </b>
              </p>
            </div>
          )}

          {inputFields?.map((item, index) => (
            <>
              <div className="Questions__Boxes_forEntity">
                <Row>
                  <Col md={12}>
                    <div className="mb-2">
                      <label htmlFor="industryType">
                        Select Question Type*
                      </label>
                      <select
                        className="select_one industrylist"
                        name="questionType"
                        value={item.questionType}
                        onChange={(event) => handleChange(event, index)}
                      >
                        <option>Select Question Type</option>
                        <option value="qualitative">Qualitative</option>
                        <option value="yes_no" title="">
                          Yes/No
                        </option>
                        <option value="quantitative">Quantitative</option>
                        <option value="tabular_question">
                          Tabular Question
                        </option>
                        <option value="quantitative_trends">
                          Quantitative Trends
                        </option>
                      </select>
                    </div>
                  </Col>
                  {item?.questionType === "qualitative" ||
                    item?.questionType === "yes_no" ||
                    item?.questionType === "quantitative" ||
                    item?.questionType === "tabular_question" ||
                    item?.questionType === "quantitative_trends" ? (
                    <div className="mb-2">
                      <label htmlFor="title">Question Heading</label>
                      <input
                        type="text"
                        name="questionHeading"
                        className="form-control py-2"
                        placeholder="Enter Question Heading or Leave This Options"
                        value={item.questionHeading}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.questionType === "quantitative_trends" && (
                    <div className="mb-2">
                      <label htmlFor="title">Formula</label>
                      <input
                        type="text"
                        name="questionHeading"
                        className="form-control py-2"
                        placeholder="Enter Formula"
                        value={item.formula}
                        onChange={(event) => handleFormula(event, index)}
                      />
                    </div>
                  )}
                  {item.questionType === "tabular_question" && (
                    <div className="mb-2">
                      <label htmlFor="industryType">Enable Graph*</label>
                      <select
                        className="select_one industrylist"
                        name="questionType"
                        value={item?.graphApplicable}
                        onChange={(event) => handleEnableGraph(event, index)}
                      >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                      </select>
                    </div>
                  )}
                  {item?.questionType === "qualitative" ||
                    item?.questionType === "yes_no" ||
                    item?.questionType === "quantitative" ||
                    item?.questionType === "tabular_question" ||
                    item?.questionType === "quantitative_trends" ? (
                    <div className="mb-2">
                      <label htmlFor="questionTitle">Sector Question* </label>
                      <textarea
                        type="text"
                        name="questionTitle"
                        className="form-control"
                        placeholder="Write Sector Question title"
                        value={item.questionTitle}
                        onChange={(event) => handleChange(event, index)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    {item.questionType === "quantitative_trends" ? (
                      <>
                        <label htmlFor="industryType">
                          Reading Value Options
                        </label>
                        {item.question_detail?.reading_value &&
                          item.question_detail.reading_value.map(
                            (currElement, i) => {
                              return (
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control py-2 mb-2"
                                    value={currElement}
                                    placeholder={`Add Reading value label ${i + 1
                                      }`}
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
                    {item.questionType === "tabular_question" ? (
                      <>
                        <div className="mt-2">
                          <label htmlFor="industryType">Add rows</label>
                          {item.question_detail?.row &&
                            item.question_detail.row.map((currElement, i) => {
                              return (
                                <div
                                  className="d-flex mb-2 justify-content-between"
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
                                      style={{ fontSize: "20px" }}
                                    ></i>
                                  </button>
                                  <button
                                    className="new_button_style-red"
                                    style={{ width: "60px" }}
                                    onClick={(e) =>
                                      removeQuestionDetailLabel(
                                        e,
                                        "row",
                                        i,
                                        index
                                      )
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
                                className="d-flex mb-2 justify-content-between"
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
                                    style={{ fontSize: "20px" }}
                                  ></i>
                                </button>
                                <button
                                  className="new_button_style-red"
                                  style={{ width: "60px" }}
                                  onClick={(e) =>
                                    removeQuestionDetailLabel(
                                      e,
                                      "column",
                                      i,
                                      index
                                    )
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
                    {inputFields.length >= 2 ? (
                      <div>
                        <button
                          type="button"
                          className="remove new_button_style-red"
                          onClick={(e) => handleRemove(index)}
                          title="Delete"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Row>
              </div>
            </>
          ))}
        </div>
        <div className="d-flex Add__Questions_btns justify-content-between">
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

export default CreateSectorQuestionModal;
