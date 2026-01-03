/* eslint-disable jsx-a11y/alt-text */
import Swal from "sweetalert2";
import { sweetAlert } from "../../../../utils/UniversalFunction";
import React, { Component } from "react";
import Sidebar from "../../../sidebar/sidebar";
import Headerss from "../../../header/header";
import Edit from '../../../../img/edit.png'
import Delete from '../../../../img/delete.png'
import ListComponent from "./list";
import "./board_skills.css";
import { Button, Modal } from "semantic-ui-react";

import config from "../../../../config/config.json";
import axios from "axios";
import { authenticationService } from "../../../../_services/authentication";
import { boardSkillService } from "../../../../_services/company/boardSkillsService";
const ProfilePics =
  "https://res.cloudinary.com/dmklsntsw/image/upload/v1658480882/dummyPic.75a04487_fqfqey.png";

const baseURL = config.baseURL;
const currentUser = authenticationService.currentUserValue;

export default class board_skills_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show2: false,
      close: false,
      isChecked: false,
      error: null,
      isLoaded: false,
      isLoaded2: false,
      isLoaded3: false,
      isLoading: false,
      items: [],
      answersss: [],
      // selectedUser: [],
      questions: [],
      boardSkillQuestionsSubject: [],
      boardSkillQuestionsRelevant: [],
      answers: [],
      submitted: false,
      frameworksUsed: [],
      environment: "",
      name: "",
      biography: "",
      uploadImage: null,
      selected: [],
      selected2: [],
      selectedUser: [],
      selectedUser2: [],
      editableImage: "",
      setId: "",
      isEditableOrNot: false,
      actualImage: null,
      open: false,
      open2: false,
      setMessage: "",
      title: "",
      expertiseOrskillValue: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    this.deleteBoard = this.deleteBoard.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setOpen2 = this.setOpen2.bind(this);
    this.setOpen3 = this.setOpen3.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
    this.serverRequest2 = this.serverRequest2.bind(this);
    this.createBoardSkills = this.createBoardSkills.bind(this);
  }

  async createBoardSkills(e) {
    const { title, expertiseOrskillValue } = this.state;
    if (title && expertiseOrskillValue) {
      let obj = {};
      obj.description = expertiseOrskillValue;
      obj.title = title;
      let response = await boardSkillService.createBoardSkills(obj);
      let checkStatusCode = response.statusCode === 200;
      if (checkStatusCode) {
        this.serverRequest2();
        this.setState({
          title: "",
          expertiseOrskillValue: "",
        });
      }
    }
  }

  onFileChange = (event) => {
    this.setState({ uploadImage: event.target.files[0] });
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
      let dataURL = reader.result;
      let output = document.getElementById("output");
      output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  setOpen(data) {
    this.setState({ open: data });
  }

  setOpen2(data, boardInformation) {
    this.setState({
      open2: data,
      setId: boardInformation.id,
      name: boardInformation.name,
      biography: boardInformation.biography,
      selectedUser: boardInformation.subject.split(","),
      editableImage:
        boardInformation.uploadImage === null
          ? ProfilePics
          : config.BASE_URL + boardInformation.uploadImage,
      actualImage: boardInformation.uploadImage,
      selectedUser2: boardInformation.relevantSkills.split(","),
    });
  }
  setOpen3(data) {
    this.setState({ open2: data });
  }
  deleteBoard = (event) => {
    let id = event.target.getAttribute("data-id");
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    Swal.fire({
      title: "Do you want to delete this board member?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#19619c",
      // denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            config.API_URL + "removeBoard",
            {
              id: id,
              current_role: localStorage.getItem("role"),
            },
            {
              headers,
            }
          )
          .then((response) => {
            sweetAlert("success", response.data.message);
            const pushToRoute = "/board_skills_detail";
            setTimeout(() => {
              window.location.href = baseURL + pushToRoute;
            }, 1000);
          })
          .catch(function (response) {
            sweetAlert("error", response.data.message);
          });
      } else if (result.isDenied) {
        sweetAlert("info", "User Safe");
      }
    });
  };

  deleteUser = (event) => {
    let id = this.state.setId;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    axios
      .post(
        config.API_URL + "removeImage",
        {
          id: id,
          current_role: localStorage.getItem("role"),
        },
        {
          headers,
        }
      )
      .then((response) => {
        sweetAlert("success", response.data.message);
        const pushToRoute = "/board_skills_detail";
        setTimeout(() => {
          window.location.href = baseURL + pushToRoute;
        }, 1000);
      })
      .catch(function (response) {
        sweetAlert("error", response.data.message);
      });
  };

  editModal(boardInformation) {
    this.setState({
      show2: true,
      setId: boardInformation.id,
      name: boardInformation.name,
      biography: boardInformation.biography,
      selectedUser: boardInformation.subject.split(","),
      editableImage:
        boardInformation.uploadImage === null
          ? ProfilePics
          : config.BASE_URL + boardInformation.uploadImage,
      actualImage: boardInformation.uploadImage,
      selectedUser2: boardInformation.relevantSkills.split(","),
    });
  }
  handleSubmit2(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
      isLoading: true,
    });
    const formData = new FormData();

    const { selectedUser, selectedUser2 } = this.state;
    let checkFrameworksUsed = selectedUser.length === 0;
    let checkEnvironment = selectedUser2.length === 0;
    if (checkFrameworksUsed) {
      this.setState({
        setMessage:
          "Subject matter expertise you have used at least one checkbox required",
        isLoading: false,
      });
    } else if (checkEnvironment) {
      this.setState({
        setMessage: "Relevant Skills at least one checkbox required",
        isLoading: false,
      });
    } else {
      if (this.state.uploadImage !== null) {
        formData.append(
          "uploadImage",
          this.state.uploadImage,
          this.state.uploadImage.name
        );
      }
      formData.append("name", this.state.name);
      formData.append("biography", this.state.biography);
      formData.append("subject", selectedUser);
      formData.append("relevantSkills", selectedUser2);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };
      axios
        .post(
          config.OLD_API_URL + "boardSkillsUpdate/" + this.state.setId + `?current_role=${localStorage.getItem("role")}`,
          formData,
          { headers }
        )
        .then((response) => {
          this.setState({
            setMessage: response.data.message,
            show2: false,
            name: "",
            biography: "",
            uploadImage: null,
            selected: [],
            selected2: [],
            selectedUser: [],
            selectedUser2: [],
          });
          setTimeout(() => {
            this.setState({
              isLoading: false,
            });
            this.setOpen3(false);
            window.location.reload();
          }, 1000);
        })
        .catch(function (error) {
          if (error.response) {
            this.setState({
              setMessage: error.response.data.message,
              isLoading: false,
            });
          }
        });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const formData = new FormData();

    const { selectedUser, selectedUser2 } = this.state;
    let checkFrameworksUsed = selectedUser.length === 0;
    let checkEnvironment = selectedUser2.length === 0;
    if (checkFrameworksUsed) {
      sweetAlert(
        "error",
        "Subject matter expertise you have used at least one checkbox required"
      );
    } else if (checkEnvironment) {
      sweetAlert("error", "Relevant Skills at least one checkbox required");
    } else {
      if (this.state.uploadImage !== null) {
        formData.append(
          "uploadImage",
          this.state.uploadImage,
          this.state.uploadImage.name
        );
      }
      formData.append("name", this.state.name);
      formData.append("biography", this.state.biography);
      formData.append("subject", selectedUser);
      formData.append("relevantSkills", selectedUser2);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      };
      axios
        .post(config.OLD_API_URL + `boardSkills?current_role=${localStorage.getItem("role")}`, formData, { headers })
        .then((response) => {
          sweetAlert("success", "Record Created!");
          setTimeout(() => {
            this.setState({
              show: false,
              name: "",
              biography: "",
              uploadImage: null,
              selected: [],
              selected2: [],
              selectedUser: [],
              selectedUser2: [],
            });
            window.location.href = baseURL + "/board_skills_detail";
          }, 10);
        })
        .catch(function (error) {
          if (error.response) {
            sweetAlert("error", error.response.data.message);
          }
        });
    }
  }

  serverRequest() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    fetch(config.API_URL + `getBoardMembers?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.result,
            isEditableOrNot: result?.insertOrUpdate,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  serverRequest2() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };

    fetch(config.API_URL + `getBoardSkillsQuestions?current_role=${localStorage.getItem("role")}`, { headers })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded2: true,
            boardSkillQuestionsSubject: result.boardSkillQuestionsSubject,
            boardSkillQuestionsRelevant: result.boardSkillQuestionsRelevant,
          });
        },
        (error) => {
          this.setState({
            isLoaded2: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    this.serverRequest();
    this.serverRequest2();
  }

  handleMultiSelect = (e, data) => {
    // debugger
    const { checked } = e.target;
    if (checked) {
      this.setState({
        selectedUser: [...this.state.selectedUser, data],
      });
    } else {
      let tempuser = this.state.selectedUser?.filter(
        (item) => Number(item) !== Number(data)
      );
      this.setState({
        selectedUser: tempuser,
      });
    }
  };
  handleMultiSelect2 = (e, data) => {
    // debugger
    const { checked } = e.target;
    if (checked) {
      this.setState({
        selectedUser2: [...this.state.selectedUser2, data],
      });
    } else {
      let tempuser2 = this.state.selectedUser2?.filter(
        (item2) => Number(item2) !== Number(data)
      );
      this.setState({
        selectedUser2: tempuser2,
      });
    }
  };

  render() {
    const {
      selectedUser,
      selectedUser2,
      boardSkillQuestionsSubject,
      boardSkillQuestionsRelevant,
      items,
      isEditableOrNot,
    } = this.state;
    return (
      <div>
        <Sidebar dataFromParent={this.props.location.pathname} />
        <Headerss />
        <div className="main_wrapper">
          <div className="inner_wraapper">
            <div className="container-fluid">
              <section className="d_text">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="governance">
                        <div className="text_Parts">
                          <div className="back_doll">
                            <div className="Member_chain">
                              <div className="back_mel">
                                <h4 className="critical_h font-heading">Members </h4>
                              </div>
                              <div className="back_mel">
                                {isEditableOrNot && (
                                  <button
                                    className="btn add_supplier_t"
                                    variant="none"
                                    onClick={() => this.setOpen(true)}
                                  >
                                    + add new member
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="new_bel mt-4">
                              {items.map((item3, key3) => (
                                <div key={key3} className="velle">
                                  <div className="text_tnp">
                                    <div className="text_image">
                                      <img
                                        src={
                                          item3.uploadImage === null
                                            ? ProfilePics
                                            : config.BASE_URL +
                                            item3.uploadImage
                                        }
                                        alt=""
                                      />
                                    </div>
                                    <div className="helop_tex helop_text2">
                                      <div className="d-flex justify-content-between">
                                        <h4 className="Willi">{item3.name}</h4>
                                      </div>

                                      <p className="graphic_pri">
                                        {item3.biography}
                                      </p>

                                      <div className="t_matter">
                                        <div className="hoel_text">
                                          <h4 className="matterexperties fw-bold">
                                            Subject matter expertise:
                                          </h4>
                                          <div className="helop">
                                            <ul className="grapic">
                                              <ListComponent
                                                items={item3.subjectInText.split(
                                                  ","
                                                )}
                                              />
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      {/* <!--  --> */}
                                      <div className="a_maj">
                                        <div className="hoel_text">
                                          <div className="d-flex justify-content-between">
                                            <h4 className="matterexperties fw-bold">
                                              Relevant Skills:
                                            </h4>
                                          </div>
                                          <div className="helop">
                                            <ul className="grapic">
                                              <ListComponent
                                                items={item3.relevantSkillsInText.split(
                                                  ","
                                                )}
                                              />
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="button-edit">
                                      {isEditableOrNot && (
                                        <>
                                          <Button
                                            className="edit mb-3"
                                            variant="none"
                                            onClick={() =>
                                              this.setOpen2(true, item3)
                                            }
                                          >
                                            <img src={Edit} alt="" className="mx-2 icon-image" srcSet="" />
                                            Edit
                                          </Button>
                                          <Button
                                            className="negative ui button"
                                            variant="none"
                                            data-id={item3.id}
                                            onClick={(e) => this.deleteBoard(e)}
                                          >
                                            <img src={Delete} alt="" className="mx-2 icon-image" srcSet="" />
                                            Delete
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="placerop">
                                    <div className="text_image_me"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="save_Governance">
                            <span className=""></span>
                          </div>
                          <Modal
                            onClose={() => this.setOpen(false)}
                            onOpen={() => this.setOpen(true)}
                            open={this.state.open}
                            className="modal_box"
                          >
                            <div className="row">
                              <div className="col-md-4"></div>
                              <div className="col-md-4">
                                <div className="modal-heading heading_add"><h4>Add New Member</h4></div>
                              </div>
                              <div className="col-md-4 float-right">
                                <button
                                  // color="black"
                                  className="btn btn-danger button-red" onClick={() => this.setOpen(false)} > X </button>
                              </div>
                            </div>

                            <Modal.Content>
                              <Modal.Description>
                                <form name="form" onSubmit={this.handleSubmit}>
                                  <div className="modal-body vekp">
                                    <div className="row">
                                      <div className="col-md-8">
                                        <div className="mdoel_glop">
                                          <div className="form-group convell">
                                            <label
                                              className="name_help"
                                              htmlFor="exampleFormControlInput1"
                                            >
                                              Name
                                            </label>
                                            <input
                                              type="text"
                                              name="name"
                                              className="form-control mellp"
                                              id="exampleFormControlInput1"
                                              placeholder="Enter Name"
                                              onChange={this.handleChange}
                                              // value={this.state.name}
                                              required
                                            />
                                          </div>
                                          <div className="form-group convel">
                                            <label
                                              className="name_help"
                                              htmlFor="exampleFormControlInput1"
                                            >
                                              Brief Biography
                                            </label>
                                            <textarea
                                              className="form-control text_np"
                                              name="biography"
                                              id="exampleFormControlTextarea1"
                                              placeholder="Write Biography"
                                              rows="3"
                                              onChange={this.handleChange}
                                              // defaultValue={ this.state.biography }
                                              required
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="uploer_fline">
                                          <div className="fline_img upload-button2">
                                            <img
                                              className="user-image mt-2"
                                              id="output"
                                            />
                                            <input
                                              type="file"
                                              name="uploadImage"
                                              accept='.jpg, .png, .jpeg'
                                              className="form-control"
                                              onChange={this.onFileChange}
                                            />

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rolop">
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="metter_text">
                                            <h4 className="metter_one">
                                              Subject matter expertise
                                            </h4>
                                          </div>
                                          <div className="row">
                                            {boardSkillQuestionsSubject.map(
                                              (item, key) => (
                                                <div
                                                  key={key}
                                                  className="col-md-6"
                                                >
                                                  <div className="form-check form-check-inline clobal_checkup">
                                                    <input
                                                      className="form-check-input"
                                                      name="subject"
                                                      type="checkbox"
                                                      onChange={(e) =>
                                                        this.handleMultiSelect(
                                                          e,
                                                          item.id
                                                        )
                                                      }
                                                      // checked={selectedUser?.some(
                                                      //   (subjectss) =>
                                                      //     Number(subjectss) ===
                                                      //     item.id
                                                      // )}
                                                      id="inlineCheckbox14"
                                                    />
                                                    <label
                                                      className="form-check-label label_onekl"
                                                      htmlFor="inlineCheckbox14"
                                                    >
                                                      {item.description}
                                                    </label>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div className="qop">
                                          <div className="veant">
                                            <h4 className="vante">
                                              Relevant Skills
                                            </h4>
                                          </div>

                                          <div className="row">
                                            {boardSkillQuestionsRelevant.map(
                                              (item2, key2) => (
                                                <div
                                                  key={key2}
                                                  className="col-md-6"
                                                >
                                                  <div className="form-check form-check-inline clobal_checkup">
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      onChange={(e) =>
                                                        this.handleMultiSelect2(
                                                          e,
                                                          item2.id
                                                        )
                                                      }
                                                      // checked={selectedUser2?.some(
                                                      //   (relevants) =>
                                                      //     Number(relevants) ===
                                                      //     item2.id
                                                      // )}
                                                      id="inlineCheckbox1140"
                                                    />
                                                    <label
                                                      className="form-check-label label_onekl"
                                                      htmlFor="inlineCheckbox114"
                                                    >
                                                      {item2.description}
                                                    </label>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className="row"
                                          style={{ padding: "0 10px 21px" }}
                                        >
                                          <div className="col-md-4">
                                            <select
                                              name="title"
                                              value={this.state.title}
                                              onChange={(e) =>
                                                this.handleChange(e)
                                              }
                                              className="form-control"
                                            >
                                              <option className="selectOptions" value={""}>
                                                Select option
                                              </option>
                                              <option value={"Subject"}>
                                                Subject matter expertise
                                              </option>
                                              <option value={"Relevant"}>
                                                Relevant Skills
                                              </option>
                                            </select>
                                          </div>
                                          <div className="col-md-4">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                this.handleChange(e)
                                              }
                                              name="expertiseOrskillValue"
                                              value={
                                                this.state.expertiseOrskillValue
                                              }
                                              className="form-control"
                                              placeholder="Enter your expertise or skills"
                                            />
                                          </div>
                                          <div className="col-md-4 board_skill">
                                            <div
                                              className="page-wid link_bal_next skill-save-btn"
                                              onClick={(e) =>
                                                this.createBoardSkills(e)

                                              }
                                              value={"Save"}
                                            >
                                              Save
                                            </div>
                                            {/* <input
                                              className="btn btn-success page-wid"
                                              onClick={(e) =>
                                                this.createBoardSkills(e)
                                              }
                                              value={"Save"}
                                            /> */}
                                          </div>
                                        </div>
                                        <div className="cenlr board_skill_2">
                                          <button
                                            className="page_save page_width"
                                            type="submit"
                                          >
                                            submit
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </Modal.Description>
                            </Modal.Content>
                          </Modal>
                          <Modal
                            onClose={() => this.setOpen2(false)}
                            onOpen={() => this.setOpen2(true)}
                            open={this.state.open2}
                            className="modal_box"
                          >
                            <div className="row">
                              <div className="col-md-4"></div>
                              <div className="col-md-4">
                                <div className="modal-heading heading_add">
                                  <h4>Update Member</h4>
                                </div>
                              </div>
                              <div className="col-md-4 float-right">
                                <button
                                  // color="black"
                                  className="btn btn-danger button-red" onClick={() => this.setOpen3(false)} > X </button>
                              </div>
                            </div>
                            <Modal.Content>
                              <Modal.Description>
                                <form name="form" onSubmit={this.handleSubmit2}>
                                  <div className="modal-body vekp">
                                    <div className="row">
                                      <div className="col-md-8">
                                        <div className="mdoel_glop">
                                          <div className="form-group convell">
                                            <label
                                              className="name_help"
                                              htmlFor="exampleFormControlInput1"
                                            >
                                              Name
                                            </label>
                                            <input
                                              type="text"
                                              name="name"
                                              className="form-control mellp"
                                              id="exampleFormControlInput1"
                                              placeholder=""
                                              onChange={this.handleChange}
                                              value={this.state.name}
                                              required
                                            />
                                          </div>
                                          <div className="form-group convel">
                                            <label
                                              className="name_help"
                                              htmlFor="exampleFormControlInput1"
                                            >
                                              Brief Biography
                                            </label>
                                            <textarea
                                              className="form-control text_np"
                                              name="biography"
                                              id="exampleFormControlTextarea1"
                                              rows="3"
                                              onChange={this.handleChange}
                                              defaultValue={
                                                this.state.biography
                                              }
                                              required
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="uploer_fline">
                                          <div className="fline_img upload-button2">
                                            <div className="text_image mt-0">
                                              <img
                                                id="output"
                                                src={this.state.editableImage}
                                                alt=""
                                              />
                                            </div>
                                            <div className="d-flex input-dd justify-content-center">
                                              <input
                                                type="file"
                                                name="uploadImage"
                                                accept='.jpg, .png, .jpeg'
                                                className="form-control div-upload"
                                                onChange={this.onFileChange}
                                                placeholder="Edit Image"
                                              />
                                              <span className="cancel-button badge badge-danger form-control">
                                                Edit Image
                                              </span>
                                              {this.state.actualImage && (
                                                <span
                                                  onClick={this.deleteUser}
                                                  className="cancel-button2 badge badge-danger form-control"
                                                >
                                                  Remove
                                                </span>
                                              )}

                                              {this.state.actualImage ===
                                                null && (
                                                  <span
                                                    title="Image Not Available"
                                                    className="cancel-button2 badge badge-danger form-control"
                                                  >
                                                    Remove
                                                  </span>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="rolop">
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="metter_text">
                                            <h4 className="metter_one">
                                              Subject matter expertise
                                            </h4>
                                          </div>

                                          <div className="row">
                                            {boardSkillQuestionsSubject.map(
                                              (item, key) => (
                                                <div
                                                  key={key}
                                                  className="col-md-6"
                                                >
                                                  <div className="form-check form-check-inline clobal_checkup">
                                                    <input
                                                      className="form-check-input"
                                                      name="subject"
                                                      type="checkbox"
                                                      onChange={(e) =>
                                                        this.handleMultiSelect(
                                                          e,
                                                          item.id
                                                        )
                                                      }
                                                      checked={selectedUser?.some(
                                                        (subjectss) =>
                                                          Number(subjectss) ===
                                                          item.id
                                                      )}
                                                      id="inlineCheckbox14"
                                                    />
                                                    <label
                                                      className="form-check-label label_onekl"
                                                      htmlFor="inlineCheckbox14"
                                                    >
                                                      {item.description}
                                                    </label>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div className="qop">
                                          <div className="veant">
                                            <h4 className="vante">
                                              Relevant Skills
                                            </h4>
                                          </div>

                                          <div className="row">
                                            {boardSkillQuestionsRelevant.map(
                                              (item2, key2) => (
                                                <div
                                                  key={key2}
                                                  className="col-md-6"
                                                >
                                                  <div className="form-check form-check-inline clobal_checkup">
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      onChange={(e) =>
                                                        this.handleMultiSelect2(
                                                          e,
                                                          item2.id
                                                        )
                                                      }
                                                      checked={selectedUser2?.some(
                                                        (relevants) =>
                                                          Number(relevants) ===
                                                          item2.id
                                                      )}
                                                      id="inlineCheckbox1140"
                                                    />
                                                    <label
                                                      className="form-check-label label_onekl"
                                                      htmlFor="inlineCheckbox114"
                                                    >
                                                      {item2.description}
                                                    </label>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className="row"
                                          style={{ padding: "0 10px 21px" }}
                                        >
                                          <div className="col-md-4">
                                            <select
                                              name="title"
                                              value={this.state.title}
                                              onChange={(e) =>
                                                this.handleChange(e)
                                              }
                                              className="form-control"
                                            >
                                              <option className="selectOptions" value={""}>
                                                Select option
                                              </option>
                                              <option value={"Subject"}>
                                                Subject matter expertise
                                              </option>
                                              <option value={"Relevant"}>
                                                Relevant Skills
                                              </option>
                                            </select>
                                          </div>
                                          <div className="col-md-4">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                this.handleChange(e)
                                              }
                                              name="expertiseOrskillValue"
                                              value={
                                                this.state.expertiseOrskillValue
                                              }
                                              className="form-control"
                                              placeholder="Enter your expertise or skills"
                                            />
                                          </div>
                                          <div className="col-md-4 board_skill">
                                            <div
                                              className="link_bal_next page-wid skill-save-btn"
                                              onClick={(e) =>
                                                this.createBoardSkills(e)
                                              }
                                              value={"Save"}
                                            >
                                              Save
                                            </div>
                                          </div>
                                        </div>
                                        <div className="cenlr board_skill_2">
                                          {this.state.isLoading && (
                                            <button
                                              primary
                                              loading
                                              type="submit"
                                              className="page_save page_width"
                                            >
                                              UPDATE
                                            </button>
                                          )}
                                          {this.state.isLoading === false && (
                                            <button
                                              primary
                                              type="submit"
                                              className="page_save page_width"
                                            >
                                              UPDATE
                                            </button>
                                          )}
                                          <h3 className="message_updated">
                                            {this.state.setMessage}</h3>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </Modal.Description>
                            </Modal.Content>
                          </Modal>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
