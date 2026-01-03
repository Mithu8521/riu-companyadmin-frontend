import axios from "axios"
import React, { useEffect, useState } from "react"
import "./SectorQuestion.css"
import config from "../../../../config/config.json"

export default function SectorQuestionTab({
  setType,
  type,
  refrenceId,
  setRefrenceID,
}) {
  const [frameworkList, setFrameWorkList] = useState()
  const [topicList, setTopicList] = useState()
  const [KpiList, setKpiList] = useState()
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  )

  useEffect(() => {
    fetchFrameWork()
    fetchTopic()
    fetchKpi()
  }, [localStorage.getItem("token")])

  const fetchFrameWork = () => {
    // axios
    //   .get(
    //     `${
    //       config.API_URL
    //     }getFrameworksAccordingToTabs?company_id=${localStorage.getItem(
    //       "user_temp_id"
    //     )}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setFrameWorkList(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.log(error, "error");
    //   });
  }
  const fetchTopic = () => {
    // axios
    //   .get(
    //     `${
    //       config.API_URL
    //     }getTopicsAccordingToTabs?company_id=${localStorage.getItem(
    //       "user_temp_id"
    //     )}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setTopicList(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.log(error, "error");
    //   });
  }
  const fetchKpi = () => {
    // axios
    //   .get(
    //     `${
    //       config.API_URL
    //     }getKpisAccordingToTabs?company_id=${localStorage.getItem(
    //       "user_temp_id"
    //     )}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setKpiList(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.log(error, "error");
    //   });
  }

  return (
    <>
      <div className="tab__wrapper__section">
        <div
          className={`${type === "ALL"
            ? "tab__wrapper selected_tab_wrapper"
            : "tab__wrapper"
            }`}
          onClick={() => {
            setType("ALL")
            setRefrenceID()
          }}
        >
          All
        </div>
        <div
          className={`${type === "QUESTION"
            ? "tab__wrapper selected_tab_wrapper"
            : "tab__wrapper"
            }`}
          onClick={() => {
            setType("QUESTION")
          }}
        >
          Framework
        </div>
        <div
          className={`${type === "TOPIC"
            ? "tab__wrapper selected_tab_wrapper"
            : "tab__wrapper"
            }`}
          onClick={() => {
            setType("TOPIC")
          }}
        >
          Topics
        </div>
        <div
          className={`${type === "KPI"
            ? "tab__wrapper selected_tab_wrapper"
            : "tab__wrapper"
            }`}
          onClick={() => {
            setType("KPI")
          }}
        >
          Kpis
        </div>
      </div>
      {type === "ALL" && <div className="value__tab__section"></div>}
      {type === "QUESTION" && (
        <div className="value__tab__section">
          {frameworkList?.map((data, index) => {
            return (
              <div
                key={index}
                className={
                  refrenceId === data?.framework_mapping_id && "selected"
                }
                onClick={() => {
                  setRefrenceID(data?.framework_mapping_id)
                  setType("QUESTION")
                }}
              >
                {data?.title}
              </div>
            )
          })}
        </div>
      )}
      {type === "TOPIC" && (
        <div className="value__tab__section">
          {topicList?.map((data, index) => {
            return (
              <div
                key={index}
                className={refrenceId === data?.topic_mapping_id && "selected"}
                onClick={() => {
                  setRefrenceID(data?.topic_mapping_id)
                  setType("TOPIC")
                }}
              >
                {data?.title}
              </div>
            )
          })}
        </div>
      )}
      {type === "KPI" && (
        <div className="value__tab__section">
          {KpiList?.map((data, index) => {
            return (
              <div
                key={index}
                className={refrenceId === data?.kpi_mapping_id && "selected"}
                onClick={() => {
                  setRefrenceID(data?.kpi_mapping_id)
                  setType("KPI")
                }}
              >
                {data?.title}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
