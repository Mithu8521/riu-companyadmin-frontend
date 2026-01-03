import React from 'react'

export default function QuestionTypeTabSection({ questionType, setQuestionType }) {
  return (
    <div className="question_type_filter">
      <div
        className={`${questionType === 'All' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("All");
        }}
      >
        All
      </div>
      <div
        className={`${questionType === 'quantitative' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("quantitative");
        }}
      >
        Quantitative
      </div>
      <div
        className={`${questionType === 'tabular_question' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("tabular_question");
        }}
      >
        Tabular Question
      </div>
      <div
        className={`${questionType === 'qualitative' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("qualitative");
        }}
      >
        Qualitative
      </div>
      <div
        className={`${questionType === 'yes_no' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("yes_no");
        }}
      >
        Close Range
      </div>
      <div
        className={`${questionType === 'quantitative_trends' ? "selected_question_type" : ''}`}
        onClick={() => {
          setQuestionType("quantitative_trends");
        }}
      >
        Quantitative Trends
      </div>
    </div>
  )
}