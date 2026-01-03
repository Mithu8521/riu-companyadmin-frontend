import React, { useEffect, useState } from "react";
import { apiCall } from "../../../../_services/apiCall";
import config from "../../../../config/config.json";
import { ColumnChartData } from "./chartData";
import CustomBarChart from "./CustomBarChart";
import './Chart/summarygraph.css' // Import the custom bar chart component
// import './Chart/summarygraph.css';

const SummeryGraph = ({ fromDate, toDate, financialYearId }) => {
  const [graphData, setGraphData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [questionIds, setQuestionIds] = useState();
  const [questionIdData, setQuestionIdData] = useState();

  const overAllStatusOverview = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}overAllStatusOverview`,
      {},
      {
        fromDate: fromDate,
        toDate: toDate,
        financialYearId: financialYearId
      },
      "GET"
    );


    if (isSuccess) {
      const datas = data?.data;
      setQuestionIdData(datas);
      let allData = {
        "total": 0,
        "noAnswered": 0,
        "noAccepted": 0,
        "noRejected": 0,
        "noResponded": 0,
        "noNotResponded": 0,
        "answeredQuestionIds": [],
        "acceptedQuestionIds": [],
        "rejectedQuestionIds": [],
        "notRespondedQuestionId": []
      };

      // Accumulate the data and question IDs
      for (let category in datas) {
        allData.total += datas[category].total;
        allData.noAnswered += datas[category].noAnswered;
        allData.noAccepted += datas[category].noAccepted;
        allData.noRejected += datas[category].noRejected;
        allData.noResponded += datas[category].noResponded;
        allData.noNotResponded += datas[category].noNotResponded;

        setQuestionIds([...datas[category].answeredQuestionIds, ...datas[category].acceptedQuestionIds, ...datas[category].rejectedQuestionIds, ...datas[category].notRespondedQuestionId])

        allData.answeredQuestionIds.push(...datas[category].answeredQuestionIds);
        allData.acceptedQuestionIds.push(...datas[category].acceptedQuestionIds);
        allData.rejectedQuestionIds.push(...datas[category].rejectedQuestionIds);
        allData.notRespondedQuestionId.push(...datas[category].notRespondedQuestionId);
      }

      // Calculate percentages
      allData['answered'] = (Number(allData['noAnswered']) / Number(allData['total'])) * 100;
      allData['accepted'] = (Number(allData['noAccepted']) / Number(allData['total'])) * 100;
      allData['rejected'] = (Number(allData['noRejected']) / Number(allData['total'])) * 100;
      allData['responded'] = (Number(allData['noResponded']) / Number(allData['total'])) * 100;
      allData['notResponded'] = (Number(allData['noNotResponded']) / Number(allData['total'])) * 100;

      const newData = { "All": allData, ...datas };


      const GraphData = await ColumnChartData(
        [["Answered"], ["Accepted"], ["Rejected"], ["Not Responded"]],
        [
          {
            data: [
              newData["All"]?.answered?.toFixed(2),
              newData["All"]?.accepted?.toFixed(2),
              newData["All"]?.rejected?.toFixed(2),
              newData["All"]?.notResponded?.toFixed(2),
            ],
          },
        ]
      );

      setChartData(GraphData);
      setGraphData(newData);

      // Set question IDs based on selected category
      const selectedData = newData[selectedCategory] || newData["All"];
      setQuestionIds([
        selectedData.answeredQuestionIds,
        selectedData.acceptedQuestionIds,
        selectedData.rejectedQuestionIds,
        selectedData.notRespondedQuestionId,
      ]);

    }
  };



  useEffect(() => {
    overAllStatusOverview();
  }, [fromDate, toDate, financialYearId]);

  const handleCheckboxChange = async (category) => {
    setSelectedCategory(category);

    const selectedData = graphData[category] || graphData["All"];
    setQuestionIds([
      selectedData.answeredQuestionIds || [],
      selectedData.acceptedQuestionIds || [],
      selectedData.rejectedQuestionIds || [],
      selectedData.notRespondedQuestionId || [],
    ]);

  };
  return (
    <div className="maincole">
      <div>
        <h3 className="fs-4" style={{
          color: '#011627',
          fontSize: 24,
          fontFamily: 'Open Sans',
          fontWeight: '600',
          marginBottom: "20px",
          wordWrap: 'break-word'
        }}>Questions Progress By Category</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.keys(graphData).map((category, index) => (
          <div key={index} className="radio-container"> {/* Add some margin between each pair */}
            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <input
                type="radio"
                id={`checkbox-${category}`}
                checked={selectedCategory === category}
                onChange={() => handleCheckboxChange(category)}
                className="radio-input"
              />
              <label className="radio-label" htmlFor={`checkbox-${category}`}>
                {category}
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="graphhh">
        {chartData && (
          <CustomBarChart options={chartData?.options} series={chartData?.series} questionIds={questionIdData} selectedCategory={selectedCategory} />
        )}
      </div>
    </div>
  );
};

export default SummeryGraph;

