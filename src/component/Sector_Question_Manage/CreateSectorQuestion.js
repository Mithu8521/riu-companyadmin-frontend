import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { InputGroup } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { sectorQuestionService } from "../../_services/admin/global-controls/sectorQuestionService";
import { frameworkService } from "../../_services/admin/global-controls/frameworkService";
import { topicService } from "../../_services/admin/global-controls/topicService";
import config from '../../config/config.json';
import axios from "axios";
import { apiCall } from "../../_services/apiCall";

export const CreateSectorQuestion = () => {
  const location = useLocation();
  const history = useHistory();
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
  const [framework, setFramework] = useState("");
  const [entity, setEntity] = useState("company");
  const [questionType, setQuestionType] = useState("");
  const [readingValue, setReadingValue] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [topics, setTopics] = useState("");
  const [topic, setTopic] = useState("");
  const [kpis, setKpis] = useState([]);
  const [kpi, setKpi] = useState("");
  const [row, setRow] = useState([""]);
  const [column, setColumn] = useState([""]);
  let companyId = localStorage.getItem('user_temp_id');
  let token = JSON.parse(localStorage.getItem('currentUser'));

  // useEffect(() => {
  //   callApi();
  // }, []);

  const callApi = async () => {
    const { isSuccess, data } = await apiCall(`${config.API_URL}getFramework`, {}, { type: "QUESTION" }, "GET");
    if (isSuccess) {
      setFrameworks(data?.data);
    }
    // axios.get(`${config.API_URL}getFramework?type=QUESTION`,{
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   }
    // }).then((response) =>{
    //     setFrameworks(response?.data?.data);
    // }).catch((error) =>{
    //   console.log(error);
    // })
  };
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


  const handleChangeFramework = (value) => {
    // value=value.split("-")
    setFramework(value);
    getTopics(value);
  };



  const getTopics = async (frameworkId) => {
    const { isSuccess, data } = await apiCall(`${config.API_URL}getTopic`, {}, { type: "QUESTION", framework_id: frameworkId }, "GET");
    if (isSuccess) {
      setTopics(data.data);
    }
    // axios.get(`${config.API_URL}getTopic?type=QUESTION&framework_id=${frameworkId}`,{
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   }
    // }).then((response) =>{
    //   setTopics(response?.data?.data);
    // }).catch((error) =>{
    //   console.log(error);
    // })   
  }
  const getKpis = async (topicId, frameworkId) => {
    console.log(topicId, "topicId")
    // let response =  topicService.getKpisAccordingToFrameworkAndTopics(
    //   topicId
    // );
    const { isSuccess, data } = await apiCall(`${config.API_URL}getKpi`, {}, { type: "QUESTION", topic_id: topicId, framework_id: frameworkId }, "GET");
    if (isSuccess) {
      setKpis(data.data);
    }
    // axios.get(`${config.API_URL}getKpi?type=QUESTION&topic_id=${topicId}&framework_id=${frameworkId}`,{
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   }
    // }).then((response) =>{
    //   setKpis(response?.data?.data);
    //   console.log(response?.data?.data,"topic data");
    // }).catch((error) =>{
    //   console.log(error);
    // })  
  }

  const handleChangeTopic = (value) => {
    setTopic(value);
    getKpis(value, framework);
  };

  const handleChangeKpi = (value) => {
    setKpi(value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {};
    obj.framework_id = framework;
    if (topic || kpi) {
      obj.topic_id = topic;
      obj.kpi_id = kpi;
    }
    obj.entity = entity;
    obj.company_id = localStorage.getItem("user_temp_id");
    // obj.questionType = questionType;
    // obj.readingValue = readingValue;
    obj.questions = inputFields;
    const { isSuccess, data } = await apiCall(`${config.API_URL}createSectorQuestion`, {}, obj, "POST");
    if (isSuccess) {
      history.push('/questions_framework_wise');
    }
    // sectorQuestionService.createSectorQuestion(obj).then((response) =>{
    //   history.push('/questions_framework_wise');
    // });
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
    <div>
      <Sidebar dataFromParent={location.pathname} />
      <Header />
      <div className="main_wrapper">
        <div className="inner_wraapper">
          <div className="container-fluid">
            <section className="d_text">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="color_div_on framwork_2">
                      <div className="business_detail">
                        <div className="saved_cards">
                          <form
                            name="form"
                            onSubmit={(e) => handleSubmit(e)}
                          >
                            <div className="business_detail">
                              <div className="heading">
                                <h4>Add Sector Questions</h4>
                              </div>
                              <hr className="line"></hr>
                              <div className="row">
                                <div className="col-lg-6 col-xs-6">
                                  <div className="form-group mb-4">
                                    <label htmlFor="industryType">
                                      Select Framework*
                                    </label>
                                    <select
                                      name="tab_name"
                                      onChange={(e) =>
                                        handleChangeFramework(
                                          e.target.value
                                        )
                                      }
                                      className="select_one industrylist"
                                    >
                                      <option>Select Framework</option>
                                      {frameworks &&
                                        frameworks.map((item, key) => (
                                          <option key={key} value={`${item.id}`}>
                                            {item.title}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-xs-6">
                                  <div className="form-group mb-4">
                                    <label
                                      htmlFor="industryType" >
                                      Select Topic*
                                    </label>
                                    {topics.length > 0 ?
                                      <select
                                        name="tab_name"
                                        onChange={(e) =>
                                          handleChangeTopic(e.target.value)
                                        }
                                        className="select_one industrylist"
                                      >
                                        <option >Select Topic</option>
                                        {topics &&
                                          topics.map((item, key) => (
                                            <option key={key} value={`${item.id}`}>
                                              {item.title}
                                            </option>
                                          ))}
                                      </select>
                                      :
                                      <select
                                        name="tab_name"
                                        onChange={(e) =>
                                          handleChangeTopic(e.target.value)
                                        }
                                        className="select_one industrylist"
                                        required={topics.length > 0}
                                        disabled
                                      >
                                        <option value="">Select Topics</option>
                                      </select>
                                    }
                                  </div>
                                </div>
                                <div className="col-lg-6 col-xs-6">
                                  <div className="form-group mb-4">
                                    <label
                                      htmlFor="industryType" >
                                      Select KPI*
                                    </label>
                                    {kpis.length > 0 ?
                                      <select
                                        name="tab_name"
                                        onChange={(e) =>
                                          handleChangeKpi(e.target.value)
                                        }
                                        className="select_one industrylist"
                                      >
                                        <option>Select KPI</option>
                                        {kpis &&
                                          kpis.map((item, key) => (
                                            <option key={key} value={item.id}>
                                              {item.title}
                                            </option>
                                          ))}
                                      </select>
                                      :
                                      <select
                                        name="tab_name"
                                        onChange={(e) =>
                                          handleChangeKpi(e.target.value)
                                        }
                                        className="select_one industrylist"
                                        required={kpis.length > 0}
                                        disabled
                                      >
                                        <option value="">Select Kpis</option>
                                      </select>
                                    }
                                  </div>
                                </div>
                                <div className="col-lg-6 col-xs-6">
                                  <div className="form-group mb-4">
                                    <label
                                      htmlFor="industryType" >
                                      Select Entity*
                                    </label>
                                    <select
                                      name="tab_name"
                                      id=""
                                      onChange={(e) =>
                                        setEntity(e.target.value)
                                      }
                                      className="select_one industrylist"
                                    >
                                      <option>Select Entity</option>
                                      <option value="company">
                                        For Company
                                      </option>
                                      <option value="supplier">
                                        For Supplier
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {inputFields?.map((item, index) => (
                                <>
                                  <div className="mb-4">
                                    <label htmlFor="industryType">
                                      Select Question Type*
                                    </label>
                                    <select className="select_one industrylist" name="question_type" value={item.question_type} onChange={(event) =>
                                      handleChange(event, index)
                                    }
                                    >
                                      <option>
                                        Select Question Type
                                      </option>
                                      <option value="qualitative">
                                        Qualitative
                                      </option>
                                      <option value="yes_no" title="">
                                        Yes/No
                                      </option>
                                      <option value="quantitative">
                                        Quantitative
                                      </option>
                                      <option value="tabular_question">
                                        Tabular Question
                                      </option>
                                      <option value="quantitative_trends">
                                        Quantitative Trends
                                      </option>
                                    </select>
                                  </div>
                                  {(item?.question_type === "qualitative" || item?.question_type === "yes_no" || item?.question_type === "quantitative" || item?.question_type === "tabular_question" || item?.question_type === "quantitative_trends" ?
                                    <div className="mb-4">
                                      <label
                                        htmlFor="title" >
                                        Question Heading
                                      </label>
                                      <input
                                        type="text"
                                        name="questionHeading"
                                        className="form-control py-3"
                                        placeholder="Enter Question Heading or Leave This Options"
                                        value={item.questionHeading}
                                        onChange={(event) =>
                                          handleChange(event, index)
                                        }
                                      />
                                    </div>
                                    : "")}
                                  {item.question_type === "quantitative_trends" &&
                                    <div className="mb-4">
                                      <label
                                        htmlFor="title" >
                                        Formula
                                      </label>
                                      <input
                                        type="text"
                                        name="questionHeading"
                                        className="form-control py-3"
                                        placeholder="Enter Formula"
                                        value={item.formula}
                                        onChange={(event) =>
                                          handleFormula(event, index)
                                        }
                                      />
                                    </div>
                                  }
                                  {item.question_type ===
                                    "tabular_question" && (
                                      <div className="mb-4">
                                        <label
                                          htmlFor="industryType"
                                        >
                                          Enable Graph*
                                        </label>
                                        <select
                                          className="select_one industrylist"
                                          name="question_type"
                                          value={item?.graph_applicable}
                                          onChange={(event) =>
                                            handleEnableGraph(event, index)
                                          }
                                        >
                                          <option value="NO">NO</option>
                                          <option value="YES">YES</option>
                                        </select>
                                      </div>
                                    )}
                                  {(item?.question_type === "qualitative" || item?.question_type === "yes_no" || item?.question_type === "quantitative" || item?.question_type === "tabular_question" || item?.question_type === "quantitative_trends" ?
                                    <div className="mb-4">
                                      <label
                                        htmlFor="question"
                                      >
                                        Sector Question*{" "}
                                      </label>
                                      <textarea
                                        type="text"
                                        name="question"
                                        className="form-control"
                                        placeholder="Write Sector Question title"
                                        value={item.question}
                                        onChange={(event) =>
                                          handleChange(event, index)
                                        }
                                      />
                                    </div>
                                    : ""
                                  )}
                                  <div className="mb-4">
                                    {item.question_type ===
                                      "quantitative_trends" ? (
                                      <>
                                        <label
                                          htmlFor="industryType"
                                        >
                                          Reading Value Options
                                        </label>
                                        {item.question_detail?.reading_value && item.question_detail.reading_value.map((currElement, i) => {
                                          return <div className="d-flex">
                                            <input type="text"
                                              className="form-control"
                                              value={currElement}
                                              placeholder={`Add Reading value label ${i + 1}`}
                                              onChange={(e) => handleQuestionDetailLabelChange(e, 'reading_value', i, index)}
                                            />
                                            {/* <button className="page_save page_width" onClick={(e) => addQuestionDetailLabel(e,'reading_value',index)}>Add</button>
                                                <button className="page_save page_width" onClick={(e) => removeQuestionDetailLabel(e,'reading_value',i, index)}>Remove</button> */}
                                          </div>
                                        })}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {/* {item.question_type ===
                                        "quantitative" ? (
                                          <>
                                            <div className="mt-2">
                                            <label
                                              htmlFor="industryType"
                                              className="mb-2"
                                            >
                                              Add Options
                                            </label>
                                            {item.question_detail?.mcqs && item.question_detail.mcqs.map((currElement, i) => {
                                              return <div className="d-flex">
                                                <input type="text"
                                                  className="form-control  py-3 w-75"
                                                  value={currElement}
                                                  placeholder={`Add Option ${i + 1}`}
                                                  onChange={(e) => handleQuestionDetailLabelChange(e,'mcqs', i,index)}
                                                />
                                                <button className="page_save page_width" onClick={(e) => addQuestionDetailLabel(e,'mcqs',index)}>Add</button>
                                                <button className="page_save page_width" onClick={(e) => removeQuestionDetailLabel(e,'mcqs',i, index)}>Remove</button>
                                              </div>
                                            })}
                                          </div>
                                      
                                        </>
                                      ) : (
                                        ""
                                      )} */}

                                    {item.question_type ===
                                      "tabular_question" ? (
                                      <>
                                        <div className="mt-2">
                                          <label
                                            htmlFor="industryType"
                                          >
                                            Add rows
                                          </label>
                                          {item.question_detail?.row && item.question_detail.row.map((currElement, i) => {
                                            return (
                                              <div className="d-flex mb-4 justify-content-between" style={{ gap: '20px' }}>
                                                <input type="text"
                                                  className="form-control"
                                                  value={currElement}
                                                  placeholder={`add row label ${i + 1}`}
                                                  onChange={(e) => handleQuestionDetailLabelChange(e, 'row', i, index)}
                                                />
                                                <button className="new_button_style-green" style={{ width: '60px' }}
                                                  onClick={(e) => addQuestionDetailLabel(e, 'row', index)}
                                                >
                                                  <i className="fas fa-plus-circle" style={{ fontSize: '20px' }}></i>
                                                </button>
                                                <button className="new_button_style-red" style={{ width: '60px' }}
                                                  onClick={(e) => removeQuestionDetailLabel(e, 'row', i, index)}
                                                >
                                                  <i className="fas fa-trash-alt" style={{ fontSize: '17px' }}></i>
                                                </button>
                                              </div>
                                            )
                                          })}
                                        </div>
                                        <label htmlFor="industryType">
                                          Add columns
                                        </label>
                                        {item.question_detail?.column && item.question_detail?.column.map((currElement, i) => {
                                          return (
                                            <div className="d-flex mb-4 justify-content-between" style={{ gap: '20px' }}>
                                              <input type="text"
                                                className="form-control"
                                                value={currElement}
                                                placeholder={`add column label ${i + 1}`}
                                                onChange={(e) => handleQuestionDetailLabelChange(e, 'column', i, index)}
                                              />
                                              <button className="new_button_style-green" style={{ width: '60px' }}
                                                onClick={(e) => addQuestionDetailLabel(e, 'column', index)}
                                              >
                                                <i className="fas fa-plus-circle" style={{ fontSize: '20px' }}></i>
                                              </button>
                                              <button className="new_button_style-red" style={{ width: '60px' }}
                                                onClick={(e) => removeQuestionDetailLabel(e, 'column', i, index)}
                                              >
                                                <i className="fas fa-trash-alt" style={{ fontSize: '17px' }}></i>
                                              </button>
                                            </div>
                                          )
                                        })}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {inputFields.length >= 2 ?
                                    <div>
                                      <button
                                        type="button"
                                        className="remove new_button_style-red mb-4 "
                                        onClick={(e) => handleRemove(index)}
                                      >
                                        <i className="fas fa-trash-alt"></i> Delete
                                      </button>
                                    </div>
                                    : ""
                                  }
                                </>
                              ))}
                            </div>
                            <div
                              className="d-flex"
                              style={{ justifyContent: "space-between" }}
                            >
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
                                <button
                                  type="submit"
                                  className="new_button_style"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
