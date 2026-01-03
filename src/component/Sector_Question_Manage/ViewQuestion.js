import React, { useEffect } from "react";
import ViewQuestionDetails from "./ViewQuestionDetails";

const ViewQuestion = ({ questionData, setSelectedRow, module }) => {
  useEffect(() => {
    setSelectedRow(questionData?.id);
  }, [questionData]);
  return (
    <>
      <div className="align-items-center justify-content-center gap-4">
        <ViewQuestionDetails questionData={questionData} module={module} />
      </div>
    </>
  );
};

export default ViewQuestion;
