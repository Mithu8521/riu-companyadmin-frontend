import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const AddLocationAutoComplete = (props) => {
  const { handleSourceChangeHandler } = props;
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    area: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const sourceChange = (selectedLoca) => {
    handleSourceChangeHandler(selectedLoca);
  };
  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      // Extract area, city, state, country, and zip code from results
      const addressComponents = results[0].address_components;
      const area =
        addressComponents.find((component) =>
          component.types.includes("sublocality_level_1")
        )?.long_name || "";
      const city =
        addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name || "";
      const state =
        addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const country =
        addressComponents.find((component) =>
          component.types.includes("country")
        )?.long_name || "";
      const zipCode =
        addressComponents.find((component) =>
          component.types.includes("postal_code")
        )?.long_name || "";

      // Set the selected suggestion as the input value
      setAddress(selectedAddress);

      // Update the state with individual address fields
      setSelectedLocation({
        area,
        city,
        state,
        country,
        zipCode,
      });



      // You can do something with the selected location data here
    } catch (error) {
      console.error("Error selecting location", error);
    }
  };
  const handleManualInputChange = (field, value) => {
    // Update the state with manually entered information
    setSelectedLocation((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    sourceChange((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  return (
    <div>
      <div>
        <PlacesAutocomplete
          value={address}
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
                  placeholder: "Type your location...",
                  className: "location-search-input form-control input-height",
                })}
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

        {/* Display individual address fields with input fields for manual entry */}
        <div>
          <div className={"form-group fg"}>
            <label className="st_name" htmlFor="name">
              Area
            </label>
            <input
              className="form-control input-height"
              type="text"
              placeholder="Auto fill Area"
              readOnly
              value={selectedLocation.area}
              onChange={(e) => handleManualInputChange("area", e.target.value)}
            />
          </div>
          <Row>
            <Col md={6}>
              <div className={"form-group fg"}>
                <label className="st_name" htmlFor="name">
                  City
                </label>
                <input
                  className="form-control input-height"
                  type="text"
                  placeholder="Auto fill City"
                  value={selectedLocation.city}
                  readOnly
                  onChange={(e) =>
                    handleManualInputChange("city", e.target.value)
                  }
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={"form-group fg"}>
                <label className="st_name" htmlFor="name">
                  State
                </label>
                <input
                  className="form-control input-height"
                  type="text"
                  placeholder="Auto fill State"
                  value={selectedLocation.state}
                  readOnly
                  onChange={(e) =>
                    handleManualInputChange("state", e.target.value)
                  }
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={"form-group fg"}>
                <label className="st_name" htmlFor="name">
                  Country
                </label>
                <input
                  className="form-control input-height"
                  type="text"
                  placeholder="Auto fill Country"
                  value={selectedLocation.country}
                  readOnly
                  onChange={(e) =>
                    handleManualInputChange("country", e.target.value)
                  }
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={"form-group fg"}>
                <label className="st_name" htmlFor="name">
                  Zip Code
                </label>
                <input
                  className="form-control input-height"
                  type="text"
                  placeholder="Auto fill Zip Code"
                  value={selectedLocation.zipCode}
                  readOnly
                  onChange={(e) =>
                    handleManualInputChange("zipCode", e.target.value)
                  }
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AddLocationAutoComplete;
