import React, { useEffect, useState } from "react";
import Sidebar from "../../../sidebar/sidebar";
import './TopicManager.css';
import Header from "../../../header/header";
import axios from "axios";
import "./SectorQuestion.css";
import config from "../../../../config/config.json";
import { FormControl } from "react-bootstrap";
import { Row, Col, ListGroup, Button } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import swal from "sweetalert";
import { apiCall } from "../../../../_services/apiCall";
import { USER_TYPE_CODE_MAPPING } from "../../../../_constants/constants";
import Loader from "../../../loader/Loader";
import QualitativeQuestionType from "./QualitativeQuestionType";
import TabularQuestionType from "./TabularQuestionType";
import YesNoType from "./YesNoType";
import QuantitativeTrendsType from "./QuantitativeTrendsType";
import SectorQuestionFilterSelection from "./SectorQuestionFilterSelection";

const SectorQuestionNew = (props) => {

  const [entity, setEntity] = useState([]);
  const [entityList, setEntityList] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [documents, setDocuments] = useState();

  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [timePeriods, setTimePeriods] = useState({})
  const [locationOption, setLocationOption] = useState();
  const [toDate, setToDate] = useState("")
  const [keyTab, setKeyTab] = useState("compare")

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const [filterQuestionListAnswer, setFilterQuestionListAnswer] = useState([]);

  const [filterQuestionList, setFilterQuestionList] = useState([]);
  const [datas, setDatas] = useState(false);
  const [financialYearId, setFinancialYearId] = useState(0);
  const [financialYear, setFinancialYear] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState([]);
  const authValue = JSON.parse(localStorage.getItem("currentUser"));

  const current_role = localStorage.getItem("role");
  const current_user_type_code = USER_TYPE_CODE_MAPPING[current_role];

  const handleClose = async () => {
    setShow(false)
  }

  const downloadPdf = async () => {
  }

  const getSectorQuestionAnswer = async () => {
    if (!locationOption || !Array.isArray(locationOption)) {
      console.warn("locationOption is not properly initialized");
      return;
    }
    
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSectorQuestionAnswer`,
      {},
      { financialYearId, locationIds: locationOption.map(item => item.id), fromDate: Object.values(timePeriods) },
      "GET"
    );
    if (isSuccess) {
      setFilterQuestionListAnswer(data.data || [])
    };
  }

  // Fetch documents data without dependency checks initially
  const getDocuments = async () => {
    try {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}documents`,
        {},
        {
          financialYearId
        },
        "GET"
      );
      if (isSuccess && data?.documents) {
        setDocuments(data.documents.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {}));
      } else {
        console.error("Failed to fetch documents:", data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    if (entity[0]) {
      getFinancialYear();
    }
  }, [entity[0]]);

  useEffect(() => {
    getFinancialYear();
  }, []);
  
  useEffect(() => {
    if (filterQuestionList && Array.isArray(filterQuestionList) && filterQuestionList.length > 0) {
      setSelectedRow(filterQuestionList[0]?.id);
      setIneerRowSelectedRow(false);
    }
  }, [filterQuestionList]);

  useEffect(() => {
    if (financialYearId && entity) fetchStoredData();
    if (financialYearId) getDocuments();
  }, [financialYearId, entity]);
  
  const getFinancialYear = async () => {
    // Check if data exists in local storage
    const storedData = localStorage.getItem('financialYearData');
    
    if (storedData) {
      // Data exists in local storage, parse and use it
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          setFinancialYear(parsedData);
          
          if (parsedData.length) {
            setFinancialYearId(parsedData[parsedData.length - 1].id);
            if (financialYearId && entity) {
              fetchStoredData();
            }
          }
        }
      } catch (error) {
        console.error("Error parsing stored financial year data:", error);
        // If parsing fails, remove corrupted data and fetch fresh
        localStorage.removeItem('financialYearData');
        getFinancialYear();
      }
    } else {
      // Data not in local storage, call API
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getFinancialYear`,
        {},
        {}
      );
      
      if (isSuccess && data && data.data && Array.isArray(data.data)) {
        // Store the response in local storage for future use
        localStorage.setItem('financialYearData', JSON.stringify(data.data));
        
        // Set state with the API response
        setFinancialYear(data.data);
        
        if (data.data.length) {
          setFinancialYearId(data.data[data.data.length - 1].id);
          if (financialYearId && entity) {
            fetchStoredData();
          }
        }
      }
    }
  };

  const settingEntities = async () => {
    if (current_user_type_code === "company") {
      setEntity([{ name: "company", id: 1 }]);

      setEntityList([
        { name: "company", id: 1 },
        { name: "supplier", id: 3 },
      ]);
    }
    if (current_user_type_code === "supplier") {
      const { isSuccess, data, error } = await getSupplierEntities();
      if (isSuccess && data && data.entities && Array.isArray(data.entities)) {
        setEntityList(
          data.entities.map((entity) => ({
            name: entity.register_company_name,
            id: entity.companyId,
          }))
        );
      }
      if (error) {
        swal({
          icon: "error",
          title: "Could not get entity companies!",
          timer: 1000,
        });
      }
    }
  };
  
  useEffect(() => {
    settingEntities();
  }, []);

  const getSupplierEntities = async () => {
    return await apiCall(
      `${config.API_URL}getSupplierEntities`,
      {},
      {
        supplier_id:
          current_role === "SUPPLIER" ? authValue.id : authValue.parent_id,
      }
    );
  };

  const fetchStoredData = async () => {
    if (financialYearId) {
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}getESGReport`,
        {},
        {
          type: "SQ",
          financial_year_id: financialYearId ? financialYearId : 6,
        },
        "GET"
      );
      if (isSuccess && data && data.data) {
        const responseData = data.data;
        if (data.mainCompany && (!Array.isArray(responseData) || responseData.length === 0)) {
          // Handle case where mainCompany exists but no data
        } else {
          if (!responseData?.mainCompany) {
            getSectorQuestion([], [], []);
          }
          const storeData = responseData[0]?.frameworkTopicKpi || "{}";
          if (!storeData.frameworkId || !Array.isArray(storeData.frameworkId) || storeData.frameworkId.length === 0) {
            // Handle case where framework data is missing
          } else {
            if (Array.isArray(responseData) && responseData.length === 0 && responseData?.mainCompany) {
              // Handle empty response with mainCompany
            } else {
              getSectorQuestion(
                storeData.frameworkId,
                (storeData.mandatoryTopicsId || [])
                  .concat(storeData.voluntaryTopicsId || [])
                  .concat(storeData.customTopicsId || []),
                (storeData.mandatoryKpiId || [])
                  .concat(storeData.voluntaryKpiId || [])
                  .concat(storeData.customKpiId || [])
              );
            }
          }
        }
      }
    }
  };
  
  const getSectorQuestion = (
    frameworkIds,
    topicIds,
    kpiIds,
    selectedDesignationId,
    selectedUserId,
    selectedLocationId,
    fromDate,
    toDate,
    selectedStatusId
  ) => {
    let questionId = props.location?.state?.questionIds;
    if (questionId) {
      setFinancialYearId(30);
    }
    const locatStorageIds = localStorage.getItem("questionIds");
    if (locatStorageIds) {
      questionId = [locatStorageIds];
    }
    axios
      .get(
        `${config.POSTLOGIN_API_URL_COMPANY
        }getSectorQuestion?type=CUSTOM&financialYearId=${financialYearId ? financialYearId : 6
        }&questionnaireType=SQ&frameworkIds=[${frameworkIds}]&topicIds=[${topicIds}]&kpiIds=[${kpiIds}]${questionId ? `&questionIds=[${questionId}]` : "&questionIds=undefined"
        }& roleIds=[${selectedDesignationId}]&userIds=[${selectedUserId}]&locationIds=[${selectedLocationId}]&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            userId: JSON.parse(localStorage.getItem("currentUser")).id,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        localStorage.removeItem("questionIds");
        if (
          response &&
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setDatas(true);
          setAllQuestion(response.data.data)
          const groupedTopicsData = response.data.data.reduce((acc, obj) => {
            const { report_id, topic_name, ...rest } = obj;
            if (!acc[topic_name]) {
              acc[topic_name] = [];
            }
            acc[topic_name].push({ report_id, topic_name, ...rest });
            return acc;
          }, {});
          setGroupedTopicsData(groupedTopicsData);

          setAnswers(response.data.answers || []);
        } else {
          setFilterQuestionList([]);
          setAnswers([]);
          setAllQuestion([]);
          setGroupedTopicsData({});
        }
      })
      .catch((error) => {
        console.log(error);
        // Reset states on error
        setFilterQuestionList([]);
        setAnswers([]);
        setAllQuestion([]);
        setGroupedTopicsData({});
      });
  };
  
  const [allQuestion, setAllQuestion] = useState([])
  const [groupedTopicsData, setGroupedTopicsData] = useState({});
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSection, setSelectedSection] = useState();
  const [availableSection, setAvailableSection] = useState([]);
  
  useEffect(() => {
    if (allQuestion && Array.isArray(allQuestion) && selectedFramework) {
      const newGroupedTopicsData = allQuestion.reduce((acc, obj) => {
        const { report_id, topic_name, frameworkId, ...rest } = obj;
        if (Number(selectedFramework) === Number(frameworkId)) {
          if (!acc[topic_name]) {
            acc[topic_name] = [];
          }
          acc[topic_name].push({ report_id, topic_name, ...rest });
        }
        return acc;
      }, {});
      
      setGroupedTopicsData(newGroupedTopicsData);
  
      if (newGroupedTopicsData && Object.keys(newGroupedTopicsData).length > 0) {
        setAvailableSection(Object.keys(newGroupedTopicsData));
      } else {
        setAvailableSection([]);
      }
    }
  }, [allQuestion, selectedFramework]);

  const [searchTerm, setSearchTerm] = useState('');

  // Fixed groupedByHeading with proper safety checks
  const groupedByHeading = selectedSection && groupedTopicsData && groupedTopicsData[selectedSection] && Array.isArray(groupedTopicsData[selectedSection])
    ? groupedTopicsData[selectedSection].reduce((acc, topic) => {
        if (!acc[topic.heading]) {
          acc[topic.heading] = [];
        }
        acc[topic.heading].push(topic);
        return acc;
      }, {})
    : {};

  const [showModalTopic, setShowModalTopic] = useState(false);

  const [selectedInnerRow, setIneerRowSelectedRow] = useState(null);

  const [activeIndexAccordion, setActiveIndexAccordion] = useState(null);

  const handleReplaceSection = (section) => {
    setSelectedSection(section);
    setSelectedHeading(null);
    setShowModalTopic(false);
  };

  const filteredItems = groupedByHeading[selectedHeading] && Array.isArray(groupedByHeading[selectedHeading])
    ? groupedByHeading[selectedHeading].filter((item) => {
        return item?.title?.toLowerCase().includes(searchTerm?.toLowerCase());
      })
    : [];

  const matchedItems = filteredItems.map((item) => {
    const correspondingAnswer = Array.isArray(answers) 
      ? answers.find((answer) => answer.questionId === item.id)
      : null;
    
    return {
      ...item,
      notApplicable: correspondingAnswer?.notApplicable,
      note: correspondingAnswer?.note,
      proofDocuments: correspondingAnswer?.proofDocument,
      combinedAnswers: correspondingAnswer?.combinedAnswers || "No Combined",
      answer: item?.questionType === "quantitative_trends"
        ? (correspondingAnswer?.answer || "No Combined")
        : (correspondingAnswer?.answer || "No Answer"),
    };
  });

  const handleHeadingClick = (heading) => {
    setSelectedHeading(selectedHeading === heading ? null : heading);
  };

  const handleAccordionClick = (index) => {
    setActiveIndexAccordion(activeIndexAccordion === index ? null : index);
  };

  const sortItems = (items) => {
    if (!Array.isArray(items)) return [];
    
    return items.sort((a, b) => {
      // If either report_id is null or undefined, keep the original order
      if (!a?.report_id || !b?.report_id) {
        if (!a?.report_id && !b?.report_id) {
          return 0; // If both are null or undefined, they are considered equal
        }
        return !a?.report_id ? 1 : -1; // If only one is null or undefined, move it to the end
      }

      const regex = /^(\d+)([a-zA-Z()]*)$/;

      const aMatch = a.report_id.match(regex);
      const bMatch = b.report_id.match(regex);

      if (!aMatch || !bMatch) {
        // Handle cases where the regex doesn't match
        return a.report_id.localeCompare(b.report_id);
      }

      const [, aNum, aChar] = aMatch;
      const [, bNum, bChar] = bMatch;

      if (parseInt(aNum, 10) !== parseInt(bNum, 10)) {
        return parseInt(aNum, 10) - parseInt(bNum, 10);
      }

      return aChar.localeCompare(bChar);
    });
  };

  const sortedItems = sortItems(matchedItems);
  
  useEffect(() => {
    setSearchTerm("");
  }, [selectedHeading])
  
  const handleSidebarToggle = (isOpen) => {
    setSidebarExpanded(isOpen);
  };
  
  const renderQuestionComponent = (item) => {
    switch (item.questionType) {
      case 'qualitative':
        return <QualitativeQuestionType title={item.title} answer={item.answer} note={item?.note} proofDocuments ={item?.proofDocuments} documents={documents}/>;
      case 'tabular_question':
        return <TabularQuestionType item={item} note={item?.note} combinedAnswers={item.combinedAnswers} question_detail={item.question_detail} title={item.title} answer={item.answer} documents={documents}/>;
      case 'quantitative':
        return <QualitativeQuestionType note={item?.note} title={item.title} answer={item.answer}/>;
      case 'yes_no':
        return <YesNoType note={item?.note} title={item.title} answer={item.answer} notApplicable={item?.notApplicable} proofDocuments ={item?.proofDocuments} documents={documents}/>
      case 'quantitative_trends':
        return <QuantitativeTrendsType item={item} note={item?.note} title={item.title} answer={item?.answer} filterQuestionListAnswer={filterQuestionListAnswer}/>
      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div
      className="d-flex flex-row mainclass"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div
        style={{
         flex: sidebarExpanded ? "0 0 21%" : "0 0 60px", position: "sticky", top: 0, zIndex: 999,transition: "flex 0.3s ease"
        }}
      >
        <Sidebar
          dataFromParent={props.location.pathname}
          onSidebarToggle={handleSidebarToggle} 
        />
      </div>

      {/* Main Content */}
      <div style={{flex: sidebarExpanded ? "1 1 79%" : "1 1 calc(100% - 60px)",
          transition: "flex 0.3s ease" , minHeight: "100vh", overflowY: "auto" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Header />
        </div>
        <div className="main_wrapper p-3" >
          <>
            <div className="inner_wraapper" style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px", position: "sticky" }}>
              <SectorQuestionFilterSelection 
                currentTab={1} 
                setKeyTab={setKeyTab} 
                keyTab={keyTab} 
                setLocationOption={setLocationOption} 
                setTimePeriods={setTimePeriods} 
                setFinancialYearId={setFinancialYearId} 
                downloadPdf={downloadPdf}
                setFromDate={setFromDate} 
                setToDate={setToDate} 
                financialYear={financialYear} 
                setFinancialYear={setFinancialYear} 
                show={show} 
                setShow={setShow} 
                financialYearId={financialYearId} 
                getSectorQuestionAnswer={getSectorQuestionAnswer} 
                handleClose={handleClose}
                selectedFramework={selectedFramework} 
                setSelectedFramework={setSelectedFramework}
                availableSection={availableSection}
                groupedTopicsData={groupedTopicsData}
                searchTerm={searchTerm}
                answers={answers}
                filterQuestionListAnswer={filterQuestionListAnswer}
              />
            </div>

            <div className="w-100 d-flex justify-content-between p-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', width: "100%", backgroundColor: "white", borderRadius: "10px" }}>
                <div style={{ width: '70%' }}>
                  <ListGroup>
                    {selectedSection ? (
                      <ListGroup>
                        <ListGroup.Item
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: "#3F88A5" }}
                        >
                          <span>{selectedSection}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    ) : (
                      <div style={{
                        color: '#3F88A5',
                        fontSize: "14px",
                        fontFamily: 'Open Sans',
                        fontWeight: '700',
                        paddingTop: "10px",
                        wordWrap: 'break-word'
                      }}>Please add a section first</div>
                    )}
                  </ListGroup>
                </div>
                <div style={{ width: '30%', display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <Button 
                    style={{ 
                      color: "white", 
                      backgroundColor: "#3F88A5", 
                      paddingLeft: "25%", 
                      paddingRight: "25%", 
                      borderColor: "transparent" 
                    }} 
                    onClick={() => setShowModalTopic(true)}>
                    {selectedSection ? "Replace" : "Add"}
                  </Button>
                </div>

                <Modal show={showModalTopic} onHide={() => setShowModalTopic(false)} size="lg" style={{ width: "100%", maxHeight: "80vh" }}>
                  <Modal.Header closeButton>
                    <Modal.Title>Select Section</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ListGroup >
                      {Array.isArray(availableSection) && availableSection.map(section => (
                        <ListGroup.Item
                          key={section}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>{section}</span>
                          <Button
                            style={{ color: "white", backgroundColor: "#3F88A5", paddingLeft: "5%", paddingRight: "5%", borderColor: "transparent" }}
                            onClick={() => handleReplaceSection(section)}
                          >
                            {selectedSection ? "Replace" : "Add"}
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
            
            <div className="w-100 d-flex justify-content-between " style={{ paddingTop: "0px", paddingLeft: "2rem", paddingRight: "0rem" }}>
              {selectedSection ? (
                <div className="w-100">
                  <div className="w-100">
                    <Row className="w-100">
                      {Object.keys(groupedByHeading).map((heading, index) => (
                        <Col md={3} key={index} style={{ padding: '10px', marginRight: "0px" }}>
                          <div
                            className={`normal-text ${selectedHeading === heading ? 'selected' : ''}`}
                            onClick={() => handleHeadingClick(heading)}
                          >
                            {heading}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              ) : null}
            </div>
            
            <div className="w-100 d-flex justify-content-between p-4" style={{ borderRadius: "10px" }}>
              {selectedHeading ? (
                <div className="container w-100 p-4" style={{ backgroundColor: "#F4F7F8", borderRadius: "10px" }}>
                  <div className="accordion" id="accordionExample" style={{
                    maxWidth: "69vw", maxHeight: "calc(65vh - 120px)", overflow: "auto",
                  }}>
                    <div className="search-bar-wrapper" style={{ marginLeft: "0%", width: "100%", marginBottom: "5%" }}>
                      <InputGroup className="search-bar h-100">
                        <InputGroup.Text id="basic-addon1">
                          <FaSearch style={{ color: "#9CBFCD" }} />
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Search Questions"
                          aria-label="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-describedby="basic-addon1"
                        />
                      </InputGroup>
                    </div>

                    {Array.isArray(sortedItems) && sortedItems.length > 0 ? (
                      sortedItems.map((item, index) => (
                        <div className="accordion-item my-3" key={index} style={{ border: "none", backgroundColor: "transparent" }}>
                          <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                              className="accordion-button d-flex justify-content-between align-items-center"
                              type="button"
                              style={{ backgroundColor: "#BFD7E0", color: "black" }}
                              onClick={() => handleAccordionClick(index)}
                              aria-expanded={activeIndexAccordion === index}
                              aria-controls={`collapse${index}`}
                            >
                              <span style={{ color: "black" }}>{item?.report_id}. {" "}{item?.title?.replace(/\b(Yes|No)\b/g, '')}</span>
                              <span
                                className="btn btn-sm btn-outline-secondary ms-2"
                                style={{
                                  fontWeight: "bold",
                                  border: "1.5px solid",
                                  borderColor: "black",
                                  padding: "0.4%",
                                  paddingLeft: "1%",
                                  paddingRight: "1%",
                                }}
                              >
                                {activeIndexAccordion === index ? "-" : "+"}
                              </span>
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className={`accordion-collapse collapse ${activeIndexAccordion === index ? "show" : ""}`}
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#accordionExample"
                            style={{
                              backgroundColor: '#F4F7F8',
                              border: "2px solid #3F88A5",
                              borderRadius: "10px",
                              color: 'black',
                              marginTop: "10px"
                            }}
                          >
                            <div className="accordion-body" style={{ width: '100%', maxWidth: "100%", overflow: "auto", paddingBottom: "0px" }}>
                              <div className="w-100" style={{ maxWidth: "100%", overflow: "auto" }}>
                                {renderQuestionComponent(item)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        No questions found
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            
            {financialYear && Array.isArray(financialYear) && financialYear.length > 0 ? (
              <div className="">
                <div>
                  {!groupedTopicsData || Object.keys(groupedTopicsData).length === 0 ? (
                    !datas && financialYearId ? (
                      <div className="row">
                        <div className="col-12">
                          <Loader />
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )
                  ) : (
                    <>
                    </>
                  )}
                </div>
              </div>
            ) : (
              financialYearId && (
                <div className="row">
                </div>
              )
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default SectorQuestionNew;