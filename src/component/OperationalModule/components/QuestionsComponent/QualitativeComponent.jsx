import React, { useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";


const QualitativeComponent = ({
  isReadOnly,
  edit,
  menu,
  answer,
  setAnswer,
  currentQuestion,
  matchedAnswer,
  handleDoubleClick,
}) => {
  const isAudit = (menu === 'audit');
  const [response, setResponse] = useState(answer?.response || "");
  const [note, setNote] = useState(answer?.note || [[""]]);
  const [responseError, setResponseError] = useState("");
  const [localResponse, setLocalResponse] = useState(response);

  useEffect(() => {
    setLocalResponse(response);
  }, [response]);

  const initializeAnswer = () => {
    if (currentQuestion) {
      if (matchedAnswer) {
        setResponse(matchedAnswer.answer || "");

        setNote((prevState) => {
          // Check if matchedAnswer.note is a string
          if (typeof matchedAnswer.note === "string") {
            return [[matchedAnswer.note]]; // Wrap the string in a 2D array
          }

          // Check if matchedAnswer.note is a 2D array
          if (
            Array.isArray(matchedAnswer.note) &&
            Array.isArray(matchedAnswer.note[0])
          ) {
            return matchedAnswer.note; // Use it as is
          }

          // If matchedAnswer.note is not a string or a 2D array, return an empty 2D array
          return [[""]];
        });

        setAnswer((prevState) => ({
          ...prevState,
          answer: matchedAnswer.answer || "",
          note: (() => {
            // Check if matchedAnswer.note is a string
            if (typeof matchedAnswer.note === "string") {
              return [[matchedAnswer.note]]; // Wrap the string in a 2D array
            }

            // Check if matchedAnswer.note is a 2D array
            if (
              Array.isArray(matchedAnswer.note) &&
              Array.isArray(matchedAnswer.note[0])
            ) {
              return matchedAnswer.note; // Use it as is
            }

            // If matchedAnswer.note is not a string or a 2D array, return an empty 2D array
            return [[""]];
          })()
        }));
      } else {
        setAnswer((prevState) => ({
          ...prevState,
          answer: "",
          note: [[""]],
        }));
        setResponse("");
        setNote([[""]]);
      }
    } else {
      setResponse("");
    }
  };

  const handleLocalResponseChange = (e) => {
    setLocalResponse(e.target.value);
    handleResponseChange(e); // to keep the original response state updated
  };

  const handleResponseChange = (e) => {
    const newResponse = e.target.value;

    if (currentQuestion?.title?.toLowerCase().includes("email address")) {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newResponse) &&
        newResponse !== ""
      ) {
        setResponseError("Please enter a valid email address.");
      } else {
        setResponseError("");
        setResponse(newResponse);
      }
    } else if (currentQuestion?.title?.toLowerCase().includes("website")) {
      const urlPattern =
        /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/i;
      if (!urlPattern.test(newResponse) && newResponse !== "") {
        setResponseError("Please enter a valid website URL.");
      } else {
        setResponseError("");
        setResponse(newResponse);
      }
    } else {
      setResponseError("");
      setResponse(newResponse);
    }

    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answer: newResponse,
    }));
  };

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote([[newNote]]);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      note: [[newNote]],
    }));
  };

  useEffect(() => {
    initializeAnswer();
  }, [matchedAnswer, currentQuestion]);

  const [address, setAddress] = useState(null);

  const handleChange = (newAddress) => {
    setAddress(newAddress);
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      answer: newAddress,
    }));
    setResponse(newAddress);
  };

  function getComponent(components, type) {
    return (
      components.find((component) => component.types.includes(type))
        ?.long_name || ""
    );
  }

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const addressComponents = results[0].address_components;
      setAddress(addressComponents);
      const streetNumber = getComponent(addressComponents, "street_number");
      const route = getComponent(addressComponents, "route");
      const city = getComponent(addressComponents, "locality");
      const state = getComponent(
        addressComponents,
        "administrative_area_level_1"
      );
      const zipcode = getComponent(addressComponents, "postal_code");

      // Combine the components into a single address string
      const completeAddress = `${streetNumber ? streetNumber + " " : ""
        }${route}, ${city}, ${state} ${zipcode}`;
      setResponse(completeAddress);
      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        answer: completeAddress,
      }));
      setAddress(completeAddress);
    } catch (error) {
      console.error("Error selecting location", error);
    }
  };

  return (
    <>
      {/* First Row with Response Field */}
      <Row>
        <Col md={12}>
          <Form.Group controlId="formInput11">
            <Form.Label className="custom-label">Response</Form.Label>
            {currentQuestion?.title?.toLowerCase().includes("when was the company incorporateds?") ? (
              <DatePicker
                selected={response ? new Date(response) : null}
                onChange={(date) => {
                  setResponse(date ? date.toISOString() : "");
                  setAnswer((prevAnswer) => ({
                    ...prevAnswer,
                    answer: date ? date.toISOString() : "",
                  }));
                }}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            ) : currentQuestion?.title?.toLowerCase().includes("what is the financial year for this reports?") ? (
              <div>
                <DatePicker
                  selected={response ? new Date(response) : null}
                  onChange={(date) => {
                    setResponse(date ? date.getFullYear().toString() : "");
                    setAnswer((prevAnswer) => ({
                      ...prevAnswer,
                      answer: date ? date.getFullYear().toString() : "",
                    }));
                  }}
                  className="form-control"
                  showYearPicker
                  dateFormat="yyyy"
                />
              </div>
            ) : currentQuestion?.title?.toLowerCase().includes("paid-up capital?") ? (
              <>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control
                    style={{ backgroundColor: "#Dfebef" }}
                    type="text"
                    value={response || ""}
                    onChange={handleResponseChange}
                    readOnly={!edit || isReadOnly}
                  />
                </InputGroup>
              </>
            ) : currentQuestion?.title?.toLowerCase().includes("address of the registered offices?") ? (
              <>
                <PlacesAutocomplete
                  value={address || response}
                  onChange={handleChange}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Type your location... *",
                          className: "location-search-input w-100 mb-2",
                        })}
                        required
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId}
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </>
            ) : currentQuestion?.title?.toLowerCase().includes("address of the corporate offices?") ? (
              <>
                <PlacesAutocomplete
                  value={address || response}
                  onChange={handleChange}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Type your location... *",
                          className: "location-search-input w-100 mb-2",
                        })}
                        required
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId}
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </>
            ) : (
              <InputGroup>
                <Form.Control
                  style={{ backgroundColor: "#Dfebef" }}
                  type="text"
                  as="textarea"
                  value={localResponse || ""}
                  onChange={handleLocalResponseChange}
                  onDoubleClick={() => handleDoubleClick(localResponse)}
                  readOnly={!edit || isReadOnly}
                />
              </InputGroup>
            )}

            {responseError && <p style={{ color: "red" }}>{responseError}</p>}
          </Form.Group>
        </Col>
      </Row>

      {/* Conditional Rendering for Note Field */}
      {currentQuestion?.applicableNote === 1 && (
        <Row>
          <Col md={12}>
            <Form.Group controlId="formInput12">
              <Form.Label className="custom-label">Note</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: "#Dfebef",
                  resize: "horizontal",
                  overflow: "auto",
                }}
                type="text"
                as="textarea"
                value={note[0][0]}
                onDoubleClick={() => handleDoubleClick(note)}
                onChange={handleNoteChange}
                readOnly={!edit || isReadOnly}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
    </>
  );
};

export default QualitativeComponent;
