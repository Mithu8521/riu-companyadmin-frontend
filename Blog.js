import React, { Component } from "react";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import Headers from "../Header/header";
import Sidebars from "../Sidebar/sidebar";
import Footers from "../Footer/footer";
import Files from "react-files";
import renderHTML from "react-render-html";
import { BaseURL, postData } from "../base_url";
import { CSVLink } from "react-csv";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactPaginate from "react-paginate";
import Progress from "react-progress-2";
import "react-progress-2/main.css";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

export default class Blog extends Component {
  state = {
    usercount: "0",
    currentPage: 1,
    postsPerPage: 10,
    deleteValid: false,
    content: "",
    heading: "",
    blog_id: "",
    successs: false,
    addblogsuccess: false,
    deletesuccess: "",
    userlist: [],
    selectedUser: [],
    dec_pop: "",
    total: "",
    count: 10,
    from_date: "",
    sort: " ",
    sort_title: "",
    to_date: "",
  };

  componentDidMount = () => {
    this.getblog_api(this.state.sort, this.state.sort_title, this.state.count);
  };

  getblog_api = (sort, sort_title, count) => {
    const body = new FormData();
    if (this.state.search) {
      body.set("search", this.state.search ? this.state.search : "");
    }
    body.set("sort", sort ? sort : "");
    body.set("sort_title", sort_title ? sort_title : "");
    body.set("count", count ? count : "");
    if (this.state.from_date) {
      body.set("from_date", moment(this.state.from_date).format("YYYY-MM-DD"));
    }
    if (this.state.to_date) {
      body.set("to_date", moment(this.state.to_date).format("YYYY-MM-DD"));
    }

    postData(`getblog?page=${this.state.currentPage}`, body).then((result) => {
      if (result.status === 200) {
        this.setState({
          userlist: result?.data?.data?.data,
          loading: true,
          pageCount: result?.data.data.last_page,
          from: result?.data.data.from,
          last_page: result?.data.data.last_page,
          per_page: result?.data.data.per_page,
          to: result?.data.data.to,
          total: result?.data.data.total,
          message: result?.message,
        });
      }
    });
  };

  onFilesChange = (files) => {
    if (files[0]) {
      this.setState({
        image: files[0],
        image_url: URL.createObjectURL(files[0]),
      });
    }
  };

  onFilesError = (error, file) => {
  };

  addblog_api = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("content", this.state.content);
    data.append("heading", this.state.heading);

    data.append("image", this.state.image);
    axios
      .post(
        `${BaseURL}/api/${this.state.blog_id ? `edit_blog/${this.state.blog_id}` : `add_blogs`
        }`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.message === "blog Added Successfully") {
          this.setState({
            success: res.data.message,
            addblogsuccess: true,
          });
          // this.props.history.push('/Slider-List')
          // window.location.reload();
          this.getblog_api(
            this.state.sort,
            this.state.sort_title,
            this.state.count
          );
        }
        if (res.data.message === "Blog Updated Successfully") {
          this.setState({
            success: res.data.message,
            addblogsuccess: true,
          });
          this.getblog_api(
            this.state.sort,
            this.state.sort_title,
            this.state.count
          );
        }
        if (res.data.message === "Somthing Went Wrong") {
          this.setState({
            mess_err: res.data.message,
          });
        }
        if (res.data.data.heading || res.data.data.content) {
          this.setState({
            banner_image_err: res.data.data.heading || res.data.data.content,
          });
        }
      })
      .catch((err) => {
      });
  };

  delete_blog = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BaseURL}/api/delete_blog/${this.state.id_d}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.message === "Record deleted successfully !") {
          this.setState({
            deletesuccess: res.data.message,
            successs: true,
          });
          // this.props.history.push('/Slider-List')
          // window.location.reload();
          this.getblog_api(
            this.state.sort,
            this.state.sort_title,
            this.state.count
          );
        }
        if (res.data.message === "Something Went Wrong") {
          this.setState({
            deletemess_err: res.data.message,
          });
        }
      })
      .catch((err) => {
      });
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };
  handleChange = (e) => {
    this.setState({
      postsPerPage: e.target.value,
    });
  };
  paginate = (number) => {
    this.setState({
      currentPage: number,
    });
  };

  handleChange1 = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleChange3 = (a) => {
    this.setState({
      content: a,
    });
  };

  deleteblog_id = (id) => {
    this.setState({
      id_d: id,
      deleteValid: true,
    });
  };
  edit_blog = (id) => {
    const img = this.state.userlist
      ? this.state.userlist.filter((x) => x.id === id)
      : "";

    this.setState({
      blog_id: id,
      image_url: img[0].image,
      content: img[0].content,
      heading: img[0].heading,
    });
  };

  dismiss = () => {
    this.setState({
      content: "",
      heading: "",
      blog_id: "",
      image_url: "",
    });
  };

  onCancel = () => {
    if (this.state.addblogsuccess === true) {
      window.location.reload();
    }

    this.setState({
      deleteValid: false,
      successs: false,
      addblogsuccess: false,
    });
  };

  get_content = (content) => {
    const cont = content.slice(0, 200);
    return cont > 200 ? cont + "..." : cont;
  };

  blog = (e) => {
    const filter_data = this.state.userlist
      ? this.state.userlist?.filter((x) => x.id === e)
      : [];
    this.setState({
      dec_pop: filter_data[0].content,
    });
  };

  handlePageClick = async (data) => {
    const page = data.selected >= 0 ? data.selected + 1 : 0;
    await Promise.resolve(this.setState(() => ({ currentPage: page })));
    this.getblog_api(this.state.sort, this.state.sort_title, this.state.count);
  };

  handleMultiSelect = (e, data) => {
    const { name, checked } = e.target;
    if (checked) {
      if (name === "allSelect") {
        this.setState({
          selectedUser: this.state.userlist,
        });
      } else {
        this.setState({
          selectedUser: [...this.state.selectedUser, data],
        });
      }
    } else {
      if (name === "allSelect") {
        this.setState({
          selectedUser: [],
        });
      } else {
        let tempuser = this.state.selectedUser?.filter(
          (item) => item.id !== data.id
        );
        this.setState({
          selectedUser: tempuser,
        });
      }
    }
  };

  handleCount = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.getblog_api(
      this.state.sort,
      this.state.sort_title,
      event.target.value
    );
  };

  searchSort = (sort, sort_title) => {
    this.setState({
      sort: sort,
      sort_title: sort_title,
    });
    this.getblog_api(sort, sort_title, this.state.count);
  };

  _handleKey = (e) => {
    if (e.key === "Enter") {
      this.getblog_api(
        this.state.sort,
        this.state.sort_title,
        this.state.count
      );
    } else if (e.key === "Backspace" && !this.state.search) {
      this.getblog_api(
        this.state.sort,
        this.state.sort_title,
        this.state.count
      );
    } else {
    }
  };

  _handleKey1 = (e) => {
    debugger;
    this.setState({
      from_date: "",
    });
  };

  _handleKey2 = () => {
    this.setState({
      to_date: "",
    });
  };

  handleFromDate = (inputName, data) => {
    if (data) {
      this.setState({ [inputName]: moment(data._d).format("YYYY-MM-DD") });
    } else {
      this.setState({
        [inputName]: "",
      });
    }
  };

  getData = (e) => { };

  render() {
    const {
      dec_pop,
      total,
      deleteValid,
      successs,
      addblogsuccess,
      selectedUser,
    } = this.state;
    const yesterday = moment().subtract(0, "day");
    const valid = (current) => {
      return yesterday.isAfter(current);
    };

    const yesterday1 = moment().subtract(1, "day");
    const valids = (current) => {
      return yesterday1.isAfter(current);
    };

    const tableData = this.state.userlist?.map((data, i) => (
      <tr id="dataid53" role="row" className="even" key={i}>
        <td className="text-center">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectedUser?.some((item) => item?.id === data.id)}
            onChange={(e) => this.handleMultiSelect(e, data)}
          />
        </td>
        <td className="text-center">{i + 1}</td>
        <td>{data.heading}</td>
        <td className="hpo">
          {this.get_content(data?.content)}
          <button
            type="button"
            className="btn btn-success btn-sm hr"
            data-toggle="modal"
            data-target="#blogdescription"
            data-backdrop="static"
            data-keyboard="false"
            onClick={(e) => this.blog(data.id)}
          >
            View More
          </button>
        </td>
        <td>
          <img
            src={data.image}
            className="img-fluid img_css"
            style={{ maxHeight: "80px", width: "100px" }}
            alt={data.image}
          />
        </td>
        <td>{data.created_at}</td>
        <td>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            data-toggle="modal"
            data-target="#myModalblog"
            data-backdrop="static"
            data-keyboard="false"
            onClick={(e) => this.edit_blog(data.id)}
          >
            Edit
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={(e) => this.deleteblog_id(data.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        {deleteValid ? (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="success"
            cancelBtnText="cancel"
            title="Are you sure?"
            onConfirm={(e) => this.delete_blog(e)}
            onCancel={this.onCancel}
            focusCancelBtn
          />
        ) : (
          ""
        )}

        {successs ? (
          <SweetAlert
            success
            title="Are you sure?"
            onConfirm={this.onCancel}
          ></SweetAlert>
        ) : (
          ""
        )}

        {addblogsuccess ? (
          <SweetAlert
            success
            title="Blog added successfully"
            onConfirm={this.onCancel}
          ></SweetAlert>
        ) : (
          ""
        )}

        <div className="page">
          {/* <!-- Main Navbar--> */}

          <Headers />

          <div className="page-content d-flex align-items-stretch">
            {/* <!-- Side Navbar --> */}
            <Sidebars dataFromParent={this.props.location.pathname} />
            <div className="content-inner">
              <section className="slip_text vfg w">
                <div className="container-fluid">
                  <div className="row bg-white has-shadow one">
                    <div className="col-sm-5">
                      <div className="anny_text">
                        <div className="input-group">
                          <div className="series_three m-0">
                            <h6>All Blog</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-7 text-right">
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#myModalblog"
                        data-backdrop="static"
                        data-keyboard="false"
                      >
                        Add Blog
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section className="dashboard-counts no-padding-bottom">
                <div className="container-fluid">
                  <div className="model">
                    <div className="modal" id="myModalblog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Add New Blog
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                              onClick={this.dismiss}
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <form
                            id="add_banner"
                            onSubmit={(e) => this.addblog_api(e)}
                          >
                            <div className="modal-body">
                              <div className="form-group">
                                <label
                                  className="slider_lit col-form-label"
                                  for="heading"
                                >
                                  Headings:
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="heading"
                                  name="heading"
                                  value={this.state.heading}
                                  placeholder="heading"
                                  onChange={(e) => this.handleChange1(e)}
                                  required
                                />
                              </div>

                              {/* <div className="form-group">
                                                                <label className="slider_lit col-form-label" for="content">Content:</label>
                                                                <textarea className="form-control" id="content" name="content" value={this.state.content} placeholder="content ....." onChange={(e) => this.handleChange1(e)} required ></textarea> */}
                              {/* <input type="text" className="form-control" id="content" name="content" placeholder="content" onChange={(e) => this.handleChange1(e)} required /> */}
                              {/* </div> */}
                              <label
                                className="slider_lit col-form-label"
                                for="content"
                              >
                                Content:
                              </label>
                              <CKEditor
                                // value={this.state.content}

                                editor={ClassicEditor}
                                data={this.state.content}
                                onReady={(editor) => {
                                  // You can store the "editor" and use when it is needed.
                                }}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  this.handleChange3(data);
                                }}
                                onBlur={(event, editor) => {
                                }}
                                onFocus={(event, editor) => {
                                }}

                              // onChange={this.handleChange3}
                              />

                              <div className="form-group">
                                <label
                                  className="slider_lit col-form-label"
                                  for="image"
                                >
                                  Select Item images:
                                </label>
                                <Files
                                  className="form-control po"
                                  onChange={this.onFilesChange}
                                  onError={this.onFilesError}
                                  accepts={[
                                    "image/png",
                                    ".jpg",
                                    ".jpeg",
                                    ".pdf",
                                    "audio/*",
                                  ]}
                                  multiple
                                  maxFileSize={10000000}
                                  minFileSize={0}
                                  clickable
                                >
                                  {this.state.image_url ? (
                                    <img
                                      src={this.state.image_url}
                                      alt={this.state.image_url}
                                      style={{ height: "50px" }}
                                    />
                                  ) : (
                                    "click to upload"
                                  )}
                                </Files>
                              </div>

                              <div className="modal-footer">
                                <button
                                  className="btn btn-secondary"
                                  data-dismiss="modal"
                                  onClick={this.dismiss}
                                >
                                  Close
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="model">
                    <div className="modal" id="blogdescription">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Blog Description
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                              onClick={this.dismiss}
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              {/* <span>{dec_pop}</span>
                               */}
                              {renderHTML(dec_pop)}
                            </div>
                            <div className="modal-footer">
                              <button
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={this.dismiss}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="client no-padding-bottom bfx">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="series_lo">
                        <div className="series_one">
                          <div className="series_five">
                            <div className="row mb-3 mt-3">
                              <div className="col-sm-3 text-left"></div>
                              <div className="col-sm-3">
                                <div className="date-pik">
                                  <label className="mr-2">From</label>
                                  <Datetime
                                    onChange={(date) =>
                                      this.handleFromDate("from_date", date)
                                    }
                                    onKeyDown={(e) =>
                                      this._handleKey1("from_date")
                                    }
                                    isValidDate={valids}
                                    name="from_date"
                                    value={this.state.from_date}
                                    dateFormat="DD-MM-YYYY"
                                    timeFormat={false}
                                    inputProps={{
                                      placeholder: "DD-MM-YYYY",
                                      type: "search",
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-3">
                                <div className="date-pik">
                                  <label className="mr-2">To</label>
                                  <Datetime
                                    onChange={(date) =>
                                      this.handleFromDate("to_date", date)
                                    }
                                    onKeyDown={(e) => this._handleKey2()}
                                    isValidDate={valid}
                                    name="from_date"
                                    value={this.state.from_date}
                                    dateFormat="DD-MM-YYYY"
                                    timeFormat={false}
                                    inputProps={{
                                      placeholder: "DD-MM-YYYY",
                                      type: "search",
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-sm-3 text-right">
                                <div className="form-outline one w-100">
                                  <input
                                    type="search"
                                    id="form1"
                                    className="form-control"
                                    placeholder="Search Id Number and Name"
                                    onChange={(e) => this.searchSpace(e)}
                                    onKeyDown={this._handleKey}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={(e) =>
                                      this.getblog_api(
                                        this.state.sort,
                                        this.state.sort_title,
                                        this.state.count
                                      )
                                    }
                                  >

                                    Search
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-3 text-left">
                              {!selectedUser?.length > 0 ? (
                                <button
                                  className="btn btn-success mr-2"
                                  disabled
                                >
                                  Export To Excel
                                </button>
                              ) : (
                                <CSVLink
                                  className="btn btn-success mr-2"
                                  data={this.state.selectedUser}
                                  onClick={this.EmtySelect}
                                >
                                  Export To Excel
                                </CSVLink>
                              )}
                            </div>
                            <table
                              className="table table-striped table-bordered zero-configuration dataTable no-footer"
                              id="DataTables_Table_0"
                              role="grid"
                              aria-describedby="DataTables_Table_0_info"
                            >
                              <thead>
                                <tr role="row">
                                  <th
                                    className="text-center bg-white"
                                    style={{ width: "58px" }}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="allSelect"
                                      // allSelect selected when both length equal
                                      // slecteduser === allUser
                                      checked={
                                        selectedUser?.length > 0
                                          ? selectedUser?.length ===
                                          this.state.userlist?.length
                                          : false
                                      }
                                      onChange={(e) =>
                                        this.handleMultiSelect(
                                          e,
                                          this.state.userlist
                                        )
                                      }
                                    />
                                  </th>
                                  <th
                                    className="sorting_asc text-center"
                                    style={{ width: "58px" }}
                                  >
                                    Sr No.
                                  </th>
                                  <th
                                    className="sorting"
                                    style={{ width: "212px" }}
                                    onClick={(e) =>
                                      this.searchSort(
                                        this.state.sort === "asc"
                                          ? "desc"
                                          : "asc",
                                        "heading"
                                      )
                                    }
                                  >
                                    Headings
                                  </th>
                                  <th
                                    className="sorting"
                                    style={{ width: "338px" }}
                                    onClick={(e) =>
                                      this.searchSort(
                                        this.state.sort === "asc"
                                          ? "desc"
                                          : "asc",
                                        "content"
                                      )
                                    }
                                  >
                                    Content
                                  </th>
                                  <th
                                    className="sorting"
                                    style={{ width: "207px" }}
                                  >
                                    Image
                                  </th>
                                  <th
                                    className="sorting"
                                    style={{ width: "258px" }}
                                    onClick={(e) =>
                                      this.searchSort(
                                        this.state.sort === "asc"
                                          ? "desc"
                                          : "asc",
                                        "created_at"
                                      )
                                    }
                                  >
                                    Created at
                                  </th>
                                  <th
                                    className="text-dark bg-white"
                                    style={{ width: "135px" }}
                                  >
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>{tableData}</tbody>
                            </table>
                            <div className="row mb-3 mt-3">
                              <div className="col-sm-6 text-left">
                                <div className="form-outline">
                                  <label>Show entries</label>
                                  <select
                                    name="count"
                                    aria-controls="example"
                                    className="ml-2"
                                    value={this.state.count}
                                    onChange={this.handleCount}
                                  >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-6 text-left">
                                {total > 10 ? (
                                  <div className="homple_number">
                                    <Progress.Component
                                      style={{ background: "orange" }}
                                      thumbStyle={{ background: "green" }}
                                    />

                                    <ReactPaginate
                                      pageCount={this.state.pageCount}
                                      initialPage={this.state.currentPage - 1}
                                      forcePage={this.state.currentPage - 1}
                                      pageRangeDisplayed={2}
                                      marginPagesDisplayed={2}
                                      previousLabel="&#x276E;"
                                      nextLabel="&#x276F;"
                                      containerClassName="uk-pagination uk-flex-center"
                                      activeClassName="uk-active"
                                      disabledClassName="uk-disabled"
                                      onPageChange={this.handlePageClick}
                                      disableInitialCallback={true}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <Footers />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
