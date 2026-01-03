import React, { useState, useRef, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';

const SearchableSelect = ({ 
  field, 
  value, 
  options, 
  isDisabled, 
  updateFormData, 
  formFields, 
  commonStyle,
  width
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-select when there's only one option
  useEffect(() => {
    if (options.length === 1 && !value) {
      const singleOption = options[0];
      const optionValue = typeof singleOption === 'string' ? singleOption : singleOption.value;
      updateFormData(field.name, optionValue);
    }
  }, [options, value, field.name, updateFormData]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option => {
        const optionText = typeof option === 'string' ? option : option.label;
        return optionText.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (selectedOption) => {
    const selectedValue = typeof selectedOption === 'string' ? selectedOption : selectedOption.value;
    updateFormData(field.name, selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    if (!value) return '';
    const selectedOption = options.find(option => 
      (typeof option === 'string' ? option : option.value) === value
    );
    return typeof selectedOption === 'string' ? selectedOption : selectedOption?.label || value;
  };

  const getPlaceholderText = () => {
    if (isDisabled) {
      return `Select ${
        field.dependsOn
          ? formFields
              .find((f) => f.name === field.dependsOn)
              ?.label?.toLowerCase() ||
            field.label.toLowerCase().replace("*").trim()
          : field.label.toLowerCase().replace("*").trim()
      } first`;
    }
    return `Choose ${field.label.toLowerCase().replace("*").trim()}...`;
  };

  // Check if dropdown should be disabled (original disabled state OR only one option)
  const shouldDisableDropdown = isDisabled || options.length <= 1;

  // If only one option, use regular select but disabled
  if (options.length === 1) {
    return (
      <Col md={width||12} key={field.name}>
        <Form.Group>
          <Form.Label
            className="fw-semibold mb-2 d-flex align-items-center"
            style={{ color: "#1e293b", fontSize: "0.9rem" }}
          >
            <div
              className="rounded-circle me-2"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#06b6d4",
              }}
            ></div>
            {field.label} {field.required && "*"}
          </Form.Label>
          <div className="position-relative">
            <Form.Select
              value={value}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              disabled={true}
              className="border-2 py-2 ps-3 pe-4"
              style={{
                ...commonStyle,
                backgroundColor: '#e9ecef',
                cursor: 'not-allowed'
              }}
            >
              {options.map((option) => (
                <option
                  key={typeof option === "string" ? option : option.value}
                  value={typeof option === "string" ? option : option.value}
                >
                  {typeof option === "string" ? option : option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </Form.Group>
      </Col>
    );
  }

  // If 5 or fewer options (but more than 1), use custom dropdown without search
  if (options.length <= 5) {
    return (
      <Col md={width||12} key={field.name}>
        <Form.Group>
          <Form.Label
            className="fw-semibold mb-2 d-flex align-items-center"
            style={{ color: "#1e293b", fontSize: "0.9rem" }}
          >
            <div
              className="rounded-circle me-2"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#06b6d4",
              }}
            ></div>
            {field.label} {field.required && "*"}
          </Form.Label>
          <div className="position-relative" ref={dropdownRef}>
            <div
              className={`form-select border-2 py-2 ps-3 pe-4 d-flex align-items-center justify-content-between ${
                shouldDisableDropdown ? 'disabled' : ''
              }`}
              style={{
                ...commonStyle,
                cursor: shouldDisableDropdown ? 'not-allowed' : 'pointer',
                backgroundColor: shouldDisableDropdown ? '#e9ecef' : 'white'
              }}
              onClick={() => !shouldDisableDropdown && setIsOpen(!isOpen)}
            >
              <span style={{ color: value ? '#000' : '#6c757d' }}>
                {value ? getDisplayValue() : getPlaceholderText()}
              </span>
              <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </div>
            
            {isOpen && !shouldDisableDropdown && (
              <div
                className="position-absolute w-100 bg-white border rounded shadow-lg"
                style={{
                  top: '100%',
                  zIndex: 1000,
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}
              >
                <div className="py-1">
                  {options.map((option) => (
                    <div
                      key={typeof option === "string" ? option : option.value}
                      className="px-3 py-2 cursor-pointer hover-bg-light"
                      style={{ 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        backgroundColor: (typeof option === "string" ? option : option.value) === value ? '#f8f9fa' : 'transparent'
                      }}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = (typeof option === "string" ? option : option.value) === value ? '#f8f9fa' : 'transparent'}
                    >
                      {typeof option === "string" ? option : option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Form.Group>
      </Col>
    );
  }

  // For more than 5 options, use searchable dropdown
  return (
    <Col md={width||12} key={field.name}>
      <Form.Group>
        <Form.Label
          className="fw-semibold mb-2 d-flex align-items-center"
          style={{ color: "#1e293b", fontSize: "0.9rem" }}
        >
          <div
            className="rounded-circle me-2"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#06b6d4",
            }}
          ></div>
          {field.label} {field.required && "*"}
        </Form.Label>
        <div className="position-relative" ref={dropdownRef}>
          <div
            className={`form-select border-2 py-2 ps-3 pe-4 d-flex align-items-center justify-content-between ${
              isDisabled ? 'disabled' : ''
            }`}
            style={{
              ...commonStyle,
              cursor: shouldDisableDropdown ? 'not-allowed' : 'pointer',
              backgroundColor: shouldDisableDropdown ? '#e9ecef' : 'white'
            }}
            onClick={() => !shouldDisableDropdown && setIsOpen(!isOpen)}
          >
            <span style={{ color: value ? '#000' : '#6c757d' }}>
              {value ? getDisplayValue() : getPlaceholderText()}
            </span>
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </div>
          
          {isOpen && !shouldDisableDropdown && (
            <div
              className="position-absolute w-100 bg-white border rounded shadow-lg"
              style={{
                top: '100%',
                zIndex: 1000,
                maxHeight: '250px',
                overflowY: 'auto'
              }}
            >
              <div className="p-2 border-bottom">
                <Form.Control
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${field.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 shadow-none"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              <div className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={typeof option === "string" ? option : option.value}
                      className="px-3 py-2 cursor-pointer hover-bg-light"
                      style={{ 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        backgroundColor: (typeof option === "string" ? option : option.value) === value ? '#f8f9fa' : 'transparent'
                      }}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = (typeof option === "string" ? option : option.value) === value ? '#f8f9fa' : 'transparent'}
                    >
                      {typeof option === "string" ? option : option.label}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Form.Group>
    </Col>
  );
};

export default SearchableSelect;