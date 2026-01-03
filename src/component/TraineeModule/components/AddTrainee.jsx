import React, { useEffect, useState } from "react";
import "./AddTrainee.css";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";

const AddTrainee = ({ selectedEmails, setSelectedEmails }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [traineeList, setTraineeList] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredEmails = traineeList.filter((email) =>
        email?.email?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredEmails);
    } else {
      setSuggestions([]);
    }
  };

  const handleEmailSelect = (email) => {
    if (!selectedEmails.some((e) => e.email === email?.email)) {
      setSelectedEmails([...selectedEmails, email]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeEmail = (emailToRemove) => {
    setSelectedEmails(
      selectedEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      if (suggestions.length > 0) {
        handleEmailSelect(suggestions[0]);
      } else if (inputValue.trim() && isValidEmail(inputValue.trim())) {
        const newEmail = { name: "", email: inputValue.trim() };
        handleEmailSelect(newEmail);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getAllRegisteredTrainee = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAllRegisteredTrainee`,
      {},
      {},
      "GET"
    );

    if (isSuccess) {
      setTraineeList(data?.data);
    }
  };

  useEffect(() => {
    getAllRegisteredTrainee();
  }, []);

  return (
    <div className="email-dropdown" >

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Guest Email"
        className="email-input"
      />
      {suggestions.length > 0 && (
        <ul className="dropdown-list">
          {suggestions.map((email, index) => (
            <li
              key={index}
              onClick={() => handleEmailSelect(email)}
              className="dropdown-item"
            >
              <div className="dropdown-content">
                <span className="dropdown-title">{email.first_name}</span>
                <span className="dropdown-email">{email.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="selected-emails mt-2">
        {selectedEmails.map((email, index) => (
          <div className="email-chip" key={index}>
            <span>{email?.name || email?.email}</span>
            <button onClick={() => removeEmail(email)}>&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTrainee;
