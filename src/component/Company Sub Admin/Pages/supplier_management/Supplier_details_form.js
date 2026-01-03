import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Row, Col, Form, Card, Modal } from "react-bootstrap";
import "./supplier_management.css";
import "./supplier_details_form.css";
import axios from "axios";
import { event } from "jquery";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { sweetAlert } from "../../../../utils/UniversalFunction";
import config from "../../../../config/config.json";
import { authenticationService } from "../../../../_services/authentication";
import { Country, State, City } from "country-state-city";
import { useHistory } from "react-router-dom";

const Supplier_details_form = (props) => {
  const currentUser = authenticationService.currentUserValue;
  const ref = useRef(true);
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [industryList, setIndustryList] = useState([]);
  const [state, setState] = useState(State.getAllStates());
  const [city, setCity] = useState("");
  const [supplier, setSupplier] = useState({
    company_name: "",
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    industry: "",
    company_address: "",
    company_country: "",
    company_state: "",
    company_city: "",
    company_pin: "",
  });
  const [validEmail, setValidEmail] = useState(false);

  // const {
  //   first_name,
  //   last_name,
  //   email,
  //   company_name,
  //   // finalIds,
  //   industry,
  //   mobile,
  //   company_address,
  //   company_country,
  //   company_city,
  //   company_state,
  //   company_pin,
  // } = supplier;

  const handleSubmit = (event) => {
    event.preventDefault();
    let formdata = new FormData(event.target);
    console.log(Object.fromEntries(formdata));

    setSubmitted(true);

    setSupplier({ ...Object.fromEntries(formdata) });

    setValidEmail(emailValidator(Object.fromEntries(formdata).email));
  };

  const onChangeCountry = (e) => {
    let selectedCountry = Country.getAllCountries().filter((country) => {
      if (country.name === e.target.value) return country.isoCode;
    });
    setState(
      State.getAllStates().filter((state) => {
        if (state.countryCode === selectedCountry[0].isoCode)
          return state.isoCode;
      })
    );
  };

  const onChangeStates = (e) => {
    let selectedState = state.filter((state) => {
      if (state.name === e.target.value) return state.isoCode;
    });
    setCity(
      City.getCitiesOfState(
        selectedState[0].countryCode,
        selectedState[0].isoCode
      )
    );
  };

  const closeModal = (e) => {
    props.setIsOpen();
  };

  const emailValidator = (text) => {
    let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}getCompanyIndustryName?current_role=${localStorage.getItem("role")}`)
      .then((res) => {
        setIndustryList(res.data.companyIndustry);
        console.log(res.data.companyIndustry);
      })
      .catch((err) => {
        sweetAlert("error", err);
      });
  }, []);

  useEffect(() => {
    const firstRender = ref.current;
    console.log("useeffect run");

    if (
      supplier.first_name &&
      supplier.last_name &&
      supplier.email &&
      supplier.company_name &&
      supplier.industry &&
      supplier.mobile &&
      supplier.email &&
      supplier.company_address &&
      supplier.company_country &&
      supplier.company_pin &&
      submitted
    ) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };

      axios
        .post(
          `${config.API_URL}inviteSupplier`,
          {
            first_name: supplier.first_name,
            last_name: supplier.last_name,
            email: supplier.email,
            mobile: supplier.mobile,
            company_name: supplier.company_name,
            company_industry: supplier.industry?.split("-")[0],
            company_industry_id: supplier.industry?.split("-")[1],
            company_address: supplier.company_address,
            company_country: supplier.company_country,
            company_state: supplier.company_state,
            company_city: supplier.company_city,
            company_pin: supplier.company_pin,
            current_role: localStorage.getItem("role")
          },
          { headers }
        )
        .then((response) => {
          sweetAlert("success", response.data.message);
          setTimeout(() => {
            const newLocal = "/supplier_management_form";
            history.push(newLocal);
          }, 1000);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert("error", error.response.data.errorMessage);
          }
        });
    } else {
      if (!firstRender) {
        sweetAlert("error", "Please fill all input");
      }
    }
  }, [supplier, submitted]);
  // const [address, setAddress] = useState('');
  const [address, setAddress] = useState('');
  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      console.log('Selected Location:', { address: selectedAddress, latLng });
      // You can do something with the selected location data here
    } catch (error) {
      console.error('Error selecting location', error);
    }
  };
  return (
    <>
      <Modal show={props.isOpen} className="w-100" size="lg">
        <Modal.Header closeButton >
          <Modal.Title>
            Add your supplier's details below and we will reach out to them on
            your behalf.
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit} id="form">
          <Modal.Body>
            <Row>
              <Col md={8}>
                <div className="mb-3">
                  <label>Supplier Company Name*</label>
                  <input
                    type="text"
                    className="form-control input_areas_selection pb-2"
                    name="company_name"
                    id="floatingInput"
                    placeholder="Enter Company Name"
                    required
                    title="Please Enter Company Name"
                  />
                </div>
                <div>
                  <label htmlFor="exampleInputEmail1">Industry*</label>
                  <select
                    name="industry"
                    id="industry"
                    placeholder="Select Industry Name"
                    // onChange={(event) => handleChange(event)}
                    val
                    className="form-control input_areas_selection pb-2"
                    required
                    title="Please Select Industry Name"
                  >
                    <option value="" disabled selected>
                      Please Select Industry Name
                    </option>
                    {industryList &&
                      industryList?.map((item) => (
                        <option
                          value={`${item.title + "-" + item.industry_type_id}`}
                        >
                          {item.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <PlacesAutocomplete
                    value={address}
                    onChange={handleChange}
                    onSelect={handleSelect}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: 'Type your location...',
                            className: 'location-search-input',
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion) => (
                            <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                              {suggestion.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>

                <div>
                  <label> Address*</label>
                  <input
                    type="text"
                    id="address"
                    name="company_address"
                    className="form-control input_areas_selection pb-2"
                    placeholder="Enter Company Address"
                    required
                    title="Please Enter Company Address"
                  />
                </div>
                <Row>
                  <Col md={6}>
                    <div>
                      <label>Country*</label>
                      <select
                        name="company_country"
                        id="country"
                        placeholder="Select Country Name"
                        val
                        className="form-control input_areas_selection pb-2"
                        onChange={(e) => onChangeCountry(e)}
                        required
                        title="Please Select Country Name"
                      >
                        <option value="" disabled selected>
                          Please Select Country
                        </option>
                        {Country.getAllCountries().map((country, i) => (
                          <option>{country.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div>
                      <label>State</label>
                      <select
                        name="company_state"
                        id="state"
                        placeholder="Select State Name"
                        val
                        className="form-control input_areas_selection pb-2"
                        onChange={(e) => onChangeStates(e)}
                      >
                        <option value="" disabled selected>
                          Please Select State
                        </option>
                        {state.map((state, i) => (
                          <option>{state.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <div>
                      <label>City</label>
                      <select
                        name="company_city"
                        id="city"
                        placeholder="Select City Name"
                        val
                        className="form-control input_areas_selection pb-2"
                      >
                        <option value="" disabled selected>
                          Please Select City
                        </option>
                        {[...city].map((city, i) => (
                          <option>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>{" "}
                  <Col md={6}>
                    <div>
                      <label>PIN</label>
                      <input
                        type="text"
                        name="company_pin"
                        id="pin"
                        placeholder="Enter PIN"
                        className="form-control input_areas_selection pb-2"
                        maxLength={10}
                        required
                        title="Please Enter PIN"
                      />
                    </div>
                  </Col>{" "}
                </Row>
              </Col>
              <Col md={4}>
                <Card className=" p-3 personal_details">
                  <div className="personal_div">
                    <label htmlFor="exampleInputEmail1">
                      Contact First Name*
                    </label>
                    <input
                      type="text"
                      className="form-control input_areas_selection personal_input"
                      name="first_name"
                      id="floatingInput"
                      placeholder="Enter First Name"
                      size={"50"}
                      required
                      title="Please Enter First Name"
                    />
                    {/* {submitted && !supplier.first_name && (
                    <div className="required">First Name is required</div>
                  )} */}
                  </div>
                  <div className="personal_div">
                    <label htmlFor="exampleInputEmail1">
                      Contact Last Name*
                    </label>
                    <input
                      type="text"
                      className="form-control input_areas_selection pb-2 personal_input"
                      name="last_name"
                      id="floatingInput"
                      placeholder="Enter Last Name"
                      size={"50"}
                    />
                    {/* {submitted && !supplier.last_name && (
                    <div className="required">Last Name is required</div>
                  )} */}
                  </div>
                  <div className="personal_div">
                    <label htmlFor="exampleInputEmail1">
                      Contact Mobile Number*
                    </label>
                    <input
                      type="text"
                      className="form-control input_areas_selection personal_input"
                      name="mobile"
                      id="floatingInput"
                      placeholder="Enter Mobile Number"
                      required
                      title="Please Enter Mobile Number"
                    />
                    {/* // {submitted && !supplier.mobile && (
                  //   <div className="required">Mobile Number is required</div>
                  // )} */}
                  </div>
                  <div className="personal_div">
                    <label htmlFor="exampleInputEmail1">
                      Contact Email Address*
                    </label>
                    <input
                      type="email"
                      // onBlur={(text) => emailValidator(text)}
                      className="form-control input_areas_selection pb-2 personal_input"
                      // onChange={handleChange}
                      //value={email}
                      name="email"
                      id="floatingInput"
                      placeholder="Enter Email Address"
                      required
                      title="Please Enter Email Address"
                    />
                    {/* {submitted && !supplier.email && (
                    <div className="required">Email Address is required</div>
                  )} */}
                    {submitted && !validEmail && (
                      <div className="required">
                        Enter a valid email address
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button className="new_button_style" type="submit">
              INVITE SUPPLIER
            </Button>
            <Button className="resetButton" type="reset">
              Reset
            </Button>
            <Button className="closeButton" type="button" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Supplier_details_form;
