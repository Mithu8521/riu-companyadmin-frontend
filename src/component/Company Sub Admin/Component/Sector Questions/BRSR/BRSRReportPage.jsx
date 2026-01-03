import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import QualitativeQuestionType from "./QualitativeQuestionType";
import QuantitativeTrendsType from "./QuantitativeTrendsType";
import TabularQuestionType from "./TabularQuestionType";
import YesNoType from "./YesNoType";

const BRSRReportPage = ({}) => {
    const [groupedBySection, setGroupedBySection] = useState({});
    const [reportData, setReportData] = useState(null);
    const [availableSection, setAvailableSection] = useState(null);
    const [groupedTopicsData, setGroupedTopicsData] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [filterQuestionListAnswer, setFilterQuestionListAnswer] = useState(null);

    console.log('Inside BRSRRepotPage');

    useEffect(() => {
        const data = localStorage.getItem("brsrReportData");
        console.log('Data', data);
        if (data) {
            setReportData(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        console.log('Report Data', reportData);
        if (reportData) {
            setAvailableSection(reportData.availableSection);
            setGroupedTopicsData(reportData.groupedTopicsData);
            setSearchTerm(reportData.searchTerm);
            setAnswers(reportData.answers);
            setFilterQuestionListAnswer(reportData.filterQuestionListAnswer);
        }
    }, [reportData]);

    useEffect(() => {
        const localGroupedBySection = {};

        if (groupedTopicsData) {
        Object.keys(groupedTopicsData).forEach((section) => {
            if (Array.isArray(groupedTopicsData[section])) {
            localGroupedBySection[section] = groupedTopicsData[section].reduce((acc, topic) => {
                if (!acc[topic.heading]) {
                acc[topic.heading] = [];
                }
                acc[topic.heading].push(topic);
                return acc;
            }, {});
            }
        });
        }

        setGroupedBySection(localGroupedBySection);
    }, [groupedTopicsData]);

    const renderQuestionComponent = (item) => {
        switch (item.questionType) {
            case 'qualitative':
                return <QualitativeQuestionType title={item.title} answer={item.answer} note={item?.note} />;
            case 'tabular_question':
                return <TabularQuestionType item={item} note={item?.note} combinedAnswers={item.combinedAnswers} question_detail={item.question_detail} title={item.title} answer={item.answer} />;
            case 'quantitative':
                return <QualitativeQuestionType note={item?.note} title={item.title} answer={item.answer} />;
            case 'yes_no':
                return <YesNoType note={item?.note} title={item.title} answer={item.answer} notApplicable={item?.notApplicable} />
            case 'quantitative_trends':
                return <QuantitativeTrendsType item={item} note={item?.note} title={item.title} answer={item?.answer} filterQuestionListAnswer={filterQuestionListAnswer} />
            default:
                return <p>Unknown question type</p>;
        }
    };

    const sortedItems = (selectedSection, selectedHeading) => {
        const groupedByHeading = groupedBySection[selectedSection];
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
            combinedAnswers: correspondingAnswer?.combinedAnswers || "No Combined",
            answer: item?.questionType === "quantitative_trends"
                ? (correspondingAnswer?.answer || "No Combined")
                : (correspondingAnswer?.answer || "No Answer"),
            };
        });

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

        return sortItems(matchedItems);
    };

    if (!reportData) {
        console.log('No Report Data');
        return <p>BRSR report data not found...</p>;
    } 

    if (!availableSection || !groupedTopicsData || !answers || !Array.isArray(filterQuestionListAnswer)){
        console.log('Loading BRSR data');
        return <p>Loading BRSR report data...</p>;
    }

    return (
        <div style={{ padding: "2rem", backgroundColor: "#fafafa" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "2rem" }}>
            BRSR Report Preview
        </h1>

        {Array.isArray(availableSection) && availableSection.map((section, sindex) => (
            <div key={`section-${sindex}`} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "22px", borderBottom: "2px solid #007bff", paddingBottom: "0.5rem" }}>{section}</h2>
            <Row className="w-100" style={{ margin: 0 }}>
                {groupedBySection && Object.keys(groupedBySection).length > 0 &&
                Object.keys(groupedBySection[section]).map((heading, hindex) => (
                    <div key={`heading-${hindex}`} style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ fontSize: "18px", fontWeight: "500", color: "#495057" }}>{heading}</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                        <tbody>
                        {sortedItems(section, heading).map((item, itindex) => (
                            <React.Fragment key={`heading-item-${itindex}`}>
                            <tr style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "12px", verticalAlign: "top" }}>
                                <strong>{item?.report_id}</strong>
                                </td>
                                <td style={{ padding: "12px", verticalAlign: "top" }}>
                                {item?.title?.replace(/\b(Yes|No)\b/g, '')}
                                </td>
                                {sindex === 0 && hindex === 0 && itindex < 15 ? (
                                <td style={{ padding: "12px", verticalAlign: "top" }}>
                                    {renderQuestionComponent(item)}
                                </td>
                                ) : null}
                            </tr>
                            {(sindex > 0 || hindex > 0 || itindex >= 15) && (
                                <tr>
                                <td colSpan={3} style={{ padding: "12px", verticalAlign: "top" }}>
                                    {renderQuestionComponent(item)}
                                </td>
                                </tr>
                            )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                    </div>
                ))}
            </Row>
            </div>
        ))}
        </div>
    );
};

export default BRSRReportPage;
