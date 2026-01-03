import React from "react";
import Select from "react-select";

export const MutlipleSelect = (props) => {
  const calculateArr = (e) => {
    props.parentCallback(e);
  }
  return (
    <>
      <Select
        defaultValue={props.sixthAnswer}
        isMulti
        name="colors"
        options={props.options}
        onChange={(e) => calculateArr(e)}
        className="basic-multi-select form"
        classNamePrefix="select"
      ></Select>
    </>
  );
};
