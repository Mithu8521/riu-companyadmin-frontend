import React, { Fragment, useState } from "react";
import { Modal, Form, InputGroup, Table } from 'react-bootstrap';
import '../../../Sector_Question_Manage/control.css'

const AddQuestion = () => {
    const [formValues, setFormValues] = useState([
        { heading: "", description: "" },
    ]);
    const [value, setValue] = useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleChange1 = (i, e) => {
        let updatedFormValues = [...formValues];
        updatedFormValues[i][e.target.heading] = e.target.value;
        setFormValues(updatedFormValues);
    };

    const addFormFields = () => {
        setFormValues([...formValues, { heading: "", description: "" }]);
    };

    const removeFormFields = (i) => {
        let updatedFormValues = [...formValues];
        updatedFormValues.splice(i, 1);
        setFormValues(updatedFormValues);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(formValues));
    };

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Add Sector Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    <div className="saved_cards">
                        <form name="form" onSubmit={handleSubmit}>
                            {formValues && formValues?.map((e, index) => (
                                <div className="form-inline" key={index}>
                                    <div className="question_card_section mb-2">
                                        <label htmlFor="industryType" className="mb-2" > Select Question Type* </label>
                                        <Fragment>
                                            <select onChange={handleChange} className="form-control">
                                                <option hidden disabled selected> Select Question Type</option>
                                                <option value="" title=""> Qualitative  </option>
                                                <option value="" title=""> Yes/No </option>
                                                <option value="" title=""> Quantitative </option>
                                                <option value="quantitativeTrends"> Quantitative Trands</option>
                                                <option value="" title=""> Tabular Question </option>
                                            </select>
                                            {value === "quantitativeTrends" ?
                                                <>
                                                    <Table striped bordered rounded className="mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '20%' }}>Attribute</th>
                                                                <th style={{ width: '80%' }}>Value</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Date</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <input className="p-2 w-100 form-control" type="date" id="" name="" />
                                                                        <span className="px-2"> to</span>
                                                                        <input className="p-2 w-100 form-control" type="date" id="" name="" />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Meter Id</td>
                                                                <td>
                                                                    <Form.Select aria-label="Default select example p-5">
                                                                        <option hidden>Please Select the Meter ID</option>
                                                                        <option value="1">One</option>
                                                                        <option value="2">Two</option>
                                                                        <option value="3">Three</option>
                                                                    </Form.Select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Process</td>
                                                                <td>
                                                                    <Form.Select aria-label="Default select example">
                                                                        <option hidden>Please Select the Process</option>
                                                                        <option value="1">One</option>
                                                                        <option value="2">Two</option>
                                                                        <option value="3">Three</option>
                                                                    </Form.Select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Reading value</td>
                                                                <td>
                                                                    <InputGroup>
                                                                        <Form.Control type="number" style={{ width: "70%" }} aria-label="first_input" />
                                                                        <Form.Select name="tab_name" id="" className="select_one industrylist" style={{ width: "30%" }}>
                                                                            <option hidden disabled selected> Form.Select Value</option>
                                                                            <option value="" title=""> kiloleter (kl)</option>
                                                                            <option value="" title=""> kiloleter (kl)</option>
                                                                            <option value="" title=""> kiloleter (kl)</option>
                                                                            <option value="" title=""> kiloleter (kl)</option>
                                                                        </Form.Select>
                                                                    </InputGroup>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Note</td>
                                                                <td>
                                                                    <Form.Control as="textarea" placeholder="Leave a Note here" style={{ height: '100px' }} />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Attachment</td>
                                                                <td>
                                                                    <Form.Group controlId="formFile">
                                                                        <Form.Control type="file" />
                                                                    </Form.Group>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </>
                                                : ""}
                                        </Fragment>
                                        <label htmlFor="title" className="mb-2" > Question Heading </label>
                                        <input type="text" name="text" className="form-control" placeholder="Enter Question Heading or Leave Options" onChange={e => handleChange1(index, e)} />
                                        <label htmlFor="question" className="mb-2" > Sector Question* </label>
                                        <textarea type="text" name="text" className="form-control" placeholder="Write Sector Question title" onChange={e => handleChange1(index, e)} />
                                        {
                                            index ?
                                                <button type="button" className="remove page_width page_save" onClick={() => removeFormFields(index)}>Remove</button>
                                                : null
                                        }
                                    </div>
                                </div>
                            ))}
                            <Modal.Footer className="justify-content-between pb-0 pt-1 px-0">
                                <button type="button" className="link_bal_next m-0" onClick={() => addFormFields()}> Add More </button>
                                <button type="submit" className="link_bal_next m-0" > Add Now </button>
                            </Modal.Footer>
                        </form>
                    </div>
                </div>
            </Modal.Body>
        </div>
    );
};

export default AddQuestion;
