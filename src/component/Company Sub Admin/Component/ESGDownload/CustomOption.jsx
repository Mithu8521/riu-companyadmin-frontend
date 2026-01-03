import React from "react";
import { components } from "react-select";

const CustomOption = (props) => {
  const { isSelected, data, innerRef, innerProps, selectOption } = props;

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Prevent the menu from closing
    selectOption(data);  // Toggle the selection
  };

  const renderLabel = () => {
    if (data.label.includes(",")) {
      const words = data.label.split(",").map((word) => word.trim());
      const secondWord = words[1] || "";
      const fourthLastWord = words[words.length - 4] || "";
      return (
        <div>
          {secondWord}, {fourthLastWord}
        </div>
      );
    } else {
      return <div>{data.label}</div>;
    }
  };

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "8px 10px",
        cursor: "pointer",
      }}
    >
      {/* Checkbox block */}
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleCheckboxClick} // Handle checkbox click
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid #3f88a5",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected ? "#3f88a5" : "transparent",
          }}
        >
          {isSelected && (
            <span style={{ color: "white", fontSize: "14px" }}>✔</span>
          )}
        </div>
      </div>

      {/* Label block */}
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {renderLabel()}
      </div>
    </div>
  );
};

export default CustomOption;
