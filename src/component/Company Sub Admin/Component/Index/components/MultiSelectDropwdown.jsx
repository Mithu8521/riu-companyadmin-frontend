import React from 'react';
import Form from 'react-bootstrap/Form';

const MultiSelectDropdown = ({ options, selectedOptions, onSelect }) => {
  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      onSelect(selectedOptions.filter((selected) => selected !== option));
    } else {
      onSelect([...selectedOptions, option]);
    }
  };

  return (
    <div className="custom-dropdown">
      {options.map((option, index) => (
        <div key={index} className="dropdown-item">
          <Form.Check
            type="checkbox"
            label={option}
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
          />
        </div>
      ))}
    </div>
  );
};

export default MultiSelectDropdown;
