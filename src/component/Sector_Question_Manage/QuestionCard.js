import React from "react";

const QuestionCard = ({ data, index, setCurrentData, selectedRow }) => {
  return (
    <tr
      style={{
        backgroundColor: selectedRow === data?.id ? "#1f9ed1" : "",
      }}
    >
      <td>
        <span>{index}</span>
      </td>
      <td
        onClick={() => {
          setCurrentData(data);
        }}
      >
        <span>{data?.title}</span>
      </td>
    </tr>
  );
};

export default QuestionCard;
