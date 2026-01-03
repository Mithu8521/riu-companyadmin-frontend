import React from "react";
import Select from "react-select";
export const SelectBox = (props) => {
  return (
    <div>
      <Select placeholder="Select Industry" options={props.options} />
    </div>
  );
};
