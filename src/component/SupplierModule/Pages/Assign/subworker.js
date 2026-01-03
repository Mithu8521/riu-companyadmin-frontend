import React, { useReducer, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
export default function AssignQuestions() {

  const [showMultiSelect, setShowMultiSelect] = useReducer(
    (show) => !show,
    false
  );
  const [showMultiSelect1, setShowMultiSelect1] = useReducer(
    (show) => !show,
    false
  );

  const [selectedName] = useState("");
  const [setSearchField] = useState("");

  const handleChange = (e) => {
    setSearchField(e.target.value);
  };

  return (
    <>
      <div>
        <div className="d-flex dropdown">
          <Dropdown>
            Assigned To:
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <input className="form-control dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" value={selectedName} placeholder="Roop Chandra" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div className="d-head">
                <label htmlFor="exampleFormControlInput1" className="form-label" >
                  Search Assinee
                </label>
                <input type="text" className="form-control mt-2" onKeyDown="" id="exampleFormControlInput1" placeholder="search" data-search onChange={handleChange} />
                <div className="items">
                  <ul className="p-0 m-2">
                    <div data-filter-item className="filterNames" id="filterNames" data-filter-name="">
                      <li key={1} className="d-flex pb-2" style={{ "align-items": "center" }} >
                        <Link className="dropdown-item p-0" to="#">
                          <div className="form-check check-form d-flex">
                            <div className="form-d">
                              <img className="flex_img" src="https://www.theseforeignroads.com/wp-content/uploads/2018/09/Essay-Roads-Featured.jpg" height="30" width="30" alt="" />
                              <label className="form-check-label" htmlFor="exampleRadios1" >
                                Roop Chandra
                              </label>
                            </div>
                          </div>
                        </Link>
                        <i className="fas fa-plus" role="button" onClick={setShowMultiSelect} />
                      </li>
                    </div>
                    {showMultiSelect && (
                      <>
                        <Multiselect
                          isObject={false}
                          onKeyPressFn={function noRefCheck() { }}
                          onRemove={function noRefCheck() { }}
                          onSearch={function noRefCheck() { }}
                          onSelect={function noRefCheck() { }}
                          options={[
                            "Ouestion 1 to 10",
                            "Ouestion 10 to 20",
                            "Ouestion 20 to 30",
                            "Ouestion 30 to 40",
                            "Ouestion 40 to 50",
                          ]}
                        />
                      </>
                    )}
                    <div data-filter-item className="filterNames" id="filterNames1" data-filter-name="" >
                      <li key={1} className="d-flex" style={{ "align-items": "center" }} >
                        <Link className="dropdown-item p-0 mt-2 mb-2" to="#">
                          <div className="form-check check-form d-flex">
                            <div className="form-d">
                              <img className="flex_img" src="https://www.theseforeignroads.com/wp-content/uploads/2018/09/Essay-Roads-Featured.jpg" height="30" width="30" alt="" />
                              <label className="form-check-label" htmlFor="exampleRadios1" >
                                Roop Chandra Syana
                              </label>
                            </div>
                          </div>
                        </Link>
                        <span className="" onClick={""}>
                          <i className="fas fa-plus" role="button" onClick={setShowMultiSelect1} />
                        </span>
                      </li>
                    </div>
                    {showMultiSelect1 && (
                      <>
                        <Multiselect
                          isObject={false}
                          onKeyPressFn={function noRefCheck() { }}
                          onRemove={function noRefCheck() { }}
                          onSearch={function noRefCheck() { }}
                          onSelect={function noRefCheck() { }}
                          options={[
                            "Ouestion 1 to 10",
                            "Ouestion 10 to 20",
                            "Ouestion 20 to 30",
                            "Ouestion 30 to 40",
                            "Ouestion 40 to 50",
                          ]}
                        />
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}