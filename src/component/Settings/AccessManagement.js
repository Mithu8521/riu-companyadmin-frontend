import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Form,
  FormGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import Loader from "../loader/Loader"; 
import edit from "./edit.png";
import deletee from "./delete.png";

const AccessManagement = (props) => {
  const { tab, userPermissionList } = props;
  const [pemissionList, setPemissionList] = useState(null);
  const [showAddManagement, setShowAddManagement] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [currentRoleId, setCurrentRoleId] = useState("");
  const [mode, setMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [managementListValue, setManagementListValue] = useState([]);
  const [filterListValue, setFilterListValue] = useState([]);
  const [updatedPermissions, setUpdatedPermissions] = useState([]);
  const [auditModule, setAuditModule] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSkelton, setshowSkelton] = useState(false);
  const [answerAccepted, setAnswerAccepted] = useState();
  const [isError, setIsError] = useState(false);
  const [deleteAccessPopup, setDeleteAccessPopup] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndices, setActiveIndices] = React.useState({});

  const closeDeleteAccessPopup = () => setDeleteAccessPopup(false);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const showDeleteAccessPopup = (id) => {
    setSelectedId(id);
    setDeleteAccessPopup(true);
  };

  const handleShowAddManagement = () => {
    setMode("create");
    setShowAddManagement(true);
  };

  const handleEditRoleMasterShow = (id, inputValue) => {
    setMode("edit");
    setSelectedId(id);
    setRoleName(inputValue);
    setShowAddManagement(true);
  };

  const handleCloseAddManagement = () => {
    setMode("create");
    setIsError(false);
    setShowAddManagement(false);
  };

  const setRoleTitle = (e) => {
    const inputValue = e.target.value;
    const isDuplicate = managementListValue.some(
      (data) => data.role_name === inputValue
    );
    if (isDuplicate) {
      setIsError(true);
    } else {
      setRoleName(inputValue);
      setIsError(false);
    }
  };

  const createRoleMaster = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createRoleMaster`,
      {},
      { roleName: roleName },
      "POST"
    );
    if (isSuccess) {
      roleManagementList();
      setRoleName("");
      handleCloseAddManagement();
    }
  };

  const updateRoleMaster = async (e) => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updateRoleMaster`,
      {},
      { roleName: roleName, id: selectedId },
      "POST"
    );
    if (isSuccess) {
      roleManagementList();
      setRoleName("");
      handleCloseAddManagement();
    }
  };
  
  const deleteRoleMaster = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `deleteRoleMaster`,
      {},
      { id: selectedId },
      "POST"
    );
    if (isSuccess) {
      roleManagementList();
      closeDeleteAccessPopup();
    }
  };

  const handleSearch = (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === "") {
      setFilterListValue([...managementListValue]);
    } else {
      const filteredResult = managementListValue.filter((item) =>
        item.role_name.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
      );
      setFilterListValue(filteredResult);
    }
  };
  
  const roleManagementList = async () => {
    setshowSkelton(true);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getMasterData`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      setManagementListValue(data?.data?.reverse());
      setFilterListValue(data?.data);
    }
  };

  const rolePermissionList = async (roleId) => {
    setshowSkelton(true);
    setCurrentRoleId(roleId);
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getPermissionDataBasedOnRoleId`,
      {},
      { role_id: roleId },
      "GET"
    );
    if (isSuccess) {
      setshowSkelton(false);
      setPemissionList(data.data);
      setAnswerAccepted(data?.answerAccepted);
    }
  };
  
  const updatePermissionToRole = async () => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `updatePermissionToRole`,
      {},
      { updatedPermissions: updatedPermissions, roleId: currentRoleId },
      "POST"
    );
    if (isSuccess) {
      rolePermissionList(currentRoleId);
    }
  };

  const MenuItem = ({
    index,
    item,
    handleCheckboxChange,
    handleAccordionClick,
    activeIndices,
    parentKey = "" // Pass an identifier for nested items
  }) => {
    const handleAllCheckboxChange = () => {
      // Determine if all checkboxes should be checked or unchecked
      // If all are currently checked, we'll uncheck them all; otherwise, check them all
      const allChecked = !item.permissions.every((permission) => permission.checked);
      
      // Update all checkboxes to the new state
      item.permissions.forEach((permission) => {
        handleCheckboxChange(item.sequence, item, permission.permissionCode, parentKey, allChecked);
      });
    };

    // Create a unique key for each accordion level (outer or inner)
    const accordionKey = parentKey ? `${parentKey}-${index}` : `${index}`;

    return (
      <div className="my-2">
        <Accordion>
          <Accordion.Item eventKey={accordionKey}>
            <h2 className="accordion-header" id={`heading${accordionKey}`}>
              <button
                className="accordion-button d-flex justify-content-between align-items-center"
                type="button"
                style={{
                  backgroundColor: "#BFD7E0",
                  color: "black",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1rem",
                }}
                onClick={() => handleAccordionClick(accordionKey)}
                aria-expanded={!!activeIndices[accordionKey]} // Check against activeIndices object
                aria-controls={`collapse${accordionKey}`}
              >
                <div style={{ flex: "0 0 80%" }}>
                  <span style={{ color: "black", marginBottom: "10px" }}>
                    {index + 1}. {item?.caption}
                  </span>
                </div>
                <div
                  style={{
                    flex: "0 0 10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="btn btn-sm btn-outline-secondary"
                    style={{
                      fontWeight: "bold",
                      height: "30px",
                      width: "30px",
                      border: "1.5px solid",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: "grey",
                    }}
                  >
                    {!!activeIndices[accordionKey] ? "-" : "+"}
                  </div>
                </div>
              </button>
            </h2>
            <div
              id={`collapse${accordionKey}`}
              className={`accordion-collapse collapse ${activeIndices[accordionKey] ? "show" : ""}`}
              aria-labelledby={`heading${accordionKey}`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body" style={{ background: "#E3EBED" }}>
                <Row style={{ gap: "21px", width: "100%" }}>
                  {!showSkelton ? (
                    <>
                      {item.permissions.length > 0 && !item.sub_menu.length && (
                        <Col md={4} className="permission-checkbox" style={{ padding: "10px 10px", background: "#E3EBED", border: "1px solid black" }}>
                          <Form.Check
                            type="checkbox"
                            id={`checkAll${item.sequence}`}
                            label="All"
                            checked={item.permissions.length > 0 && item.permissions.every((permission) => permission.checked)}
                            onChange={handleAllCheckboxChange}
                          />
                        </Col>
                      )}
                      {item.sub_menu.length > 0
                        ? item.sub_menu.map((subItem, subIndex) => (
                          <MenuItem
                            key={subItem.sequence}
                            index={subIndex}
                            item={subItem}
                            handleCheckboxChange={handleCheckboxChange}
                            handleAccordionClick={handleAccordionClick}
                            activeIndices={activeIndices}
                            parentKey={accordionKey} // Pass current accordionKey as parentKey
                          />
                        ))
                        : item.permissions.map((permission, permissionIndex) => (
                          <Col key={permissionIndex} md={4} className="permission-checkbox" style={{ padding: "10px 10px", background: "#E3EBED", border: "1px solid black" }}>
                            <Form.Check
                              type="checkbox"
                              id={`check${permissionIndex}`}
                              label={permission.view}
                              checked={permission.checked}
                              onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                              onChange={(e) => {
                                e.preventDefault(); // Prevent default behavior
                                handleCheckboxChange(item.sequence, item, permission.permissionCode, parentKey);
                              }}
                            />
                          </Col>
                        ))}
                    </>
                  ) : (
                    <Loader />
                  )}
                </Row>
              </div>
            </div>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  };

  const Menu = ({ jsonData }) => {
    const updatedPermission = async (menuItem, code, forceChecked = null) => {
      if (menuItem && menuItem.permissions) {
        const permissionIndex = menuItem.permissions.findIndex(
          (permission) => permission.permissionCode === code
        );
        if (permissionIndex !== -1) {
          const updatedPermissions = [...menuItem.permissions];
          // Use forceChecked if provided, otherwise toggle the current state
          updatedPermissions[permissionIndex].checked = forceChecked !== null 
            ? forceChecked 
            : !updatedPermissions[permissionIndex].checked;
            
          const updatedParentMenuItem = {
            ...menuItem,
            permissions: updatedPermissions,
          };
          return updatedParentMenuItem;
        }
      }
    };
    
    const handleCheckboxChange = async (
      menuSequence,
      menuItem,
      code,
      parentKey,
      forceChecked = null // New parameter to force a specific checked state
    ) => {
      let tmpUpdated;
      
      // Handle parent-child relationship
      if (parentKey) {
        // Find the parent menu item based on parentKey
        const parentMenuItem = findParentMenuItem(jsonData, parentKey);
        
        if (parentMenuItem) {
          // Update the corresponding sub-menu item
          const updatedParentMenuItem = {
            ...parentMenuItem,
            sub_menu: parentMenuItem.sub_menu.map((subItem) => {
              if (subItem.sequence === menuSequence) {
                return {
                  ...subItem,
                  ...updatedPermission(subItem, code, forceChecked),
                };
              }
              return subItem;
            })
          };
          tmpUpdated = updatedParentMenuItem;
        }
      } else {
        // Direct update for top-level menu items
        tmpUpdated = await updatedPermission(menuItem, code, forceChecked);
      }

      // Update the state with the changes
      const existingDataIndex = updatedPermissions.findIndex(
        (item) => item.sequenceId === menuSequence
      );
      
      if (existingDataIndex !== -1) {
        const updatedPermissionsCopy = [...updatedPermissions];
        updatedPermissionsCopy[existingDataIndex] = {
          sequenceId: menuSequence,
          permission: tmpUpdated,
        };
        setUpdatedPermissions(updatedPermissionsCopy);
      } else {
        setUpdatedPermissions((prevData) => {
          const updatedData = [...prevData];
          const existingPermissionIndex = updatedData.findIndex(
            (item) => item.sequenceId === menuSequence
          );

          if (existingPermissionIndex !== -1) {
            // If sequenceId already exists, update the existing object
            updatedData[existingPermissionIndex] = {
              sequenceId: menuSequence,
              permission: tmpUpdated,
            };
          } else {
            // If sequenceId doesn't exist, add a new object to the array
            updatedData.push({
              sequenceId: menuSequence,
              permission: tmpUpdated,
            });
          }

          return updatedData;
        });
      }
    };

    // Helper function to find a parent menu item based on the parentKey
    const findParentMenuItem = (menuItems, parentKey) => {
      // Parse the parentKey to get the index
      const index = parseInt(parentKey.split('-')[0]);
      if (!isNaN(index) && index >= 0 && index < menuItems.length) {
        return menuItems[index];
      }
      return null;
    };

    const handleAccordionClick = (key) => {
      setActiveIndices((prevIndices) => {
        // Toggle just the clicked one
        return {
          ...prevIndices,
          [key]: !prevIndices[key]
        };
      });
    };

    return (
      <div>
        {!showSkelton ? (
          jsonData.map((menuItem, index) => (
            <MenuItem
              index={index}
              key={menuItem.sequence}
              item={menuItem}
              handleCheckboxChange={handleCheckboxChange}
              handleAccordionClick={handleAccordionClick}
              activeIndices={activeIndices} // Pass the activeIndices object
            />
          ))
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (filterListValue && filterListValue.length > 0) {
      const initialSelectedItem = filterListValue[0];
      setSelectedItem(initialSelectedItem?.id);
      rolePermissionList(initialSelectedItem?.id);
      setAuditModule(initialSelectedItem.system_created);
    }
  }, [filterListValue]);
  
  useEffect(() => {
    roleManagementList();
  }, [tab]);

  const [show, setShow] = useState(false);

  // Function to toggle the modal visibility
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      <div className="Introduction framwork_2" style={{ background: "white", borderRadius: "15px" }}>
        <div className="Card__section">
          <Row>
            <Col md={12} style={{ padding: "2rem" }}>
              <div className="directly p-0 hstack gap-2 justify-content-end">
                <div style={{ position: "relative", width: "100%" }}>
                  <span
                    className="search-icon"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "10px",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#3f8aa5",
                      pointerEvents: "none", // Make it non-clickable
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </span>

                  <input
                    type="search"
                    className="w-100"
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #3f8aa5",
                      padding: "10px 30px 10px 35px", // Adjust padding to make space for the icon
                    }}
                    placeholder="Search"
                    name="search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {userPermissionList.some(
                  (permission) =>
                    permission.permissionCode === "CREATE_MANAGEMENT_ROLE" &&
                    permission.checked
                ) && (
                    <button
                      className=""
                      onClick={handleShowAddManagement}
                      style={{
                        background: "#3F8AA5",
                        border: "none",
                        padding: "10px 30px",
                        borderRadius: "5px",
                        color: "white",
                      }}
                    >
                      Add Role
                    </button>
                  )}
              </div>
              <div className="table_setting" style={{ marginTop: "10px" }}>
                <Table striped bordered>
                  <thead style={{ border: "none" }}>
                    <tr className="fixed_tr_section" style={{
                      border: "none",
                      borderBottom: "2px solid #83BBD5",
                    }}>
                      <th style={{
                        width: 60,
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}>#</th>
                      <th style={{
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                        width: "55vw"
                      }}>Role Name</th>
                      <th style={{
                        border: "none",
                        color: "#11546f",
                        fontSize: "18px",
                        fontWeight: 600,
                      }}>Action</th>
                    </tr>
                  </thead>
                </Table>
                {!showSkelton ? (
                  filterListValue && filterListValue?.length > 0 ? (
                    <div style={{ width: "100%", paddingLeft: "0.5rem", paddingRight: "1rem" }}>
                      {filterListValue &&
                        filterListValue?.map((item, key) => (
                          <div
                            key={key}
                            style={{ borderBottom: "2px solid #83BBD5", padding: "20px 0px", display: "flex", width: "100%" }}
                          >
                            <div style={{
                              width: "6%",
                              color: "#3f8aa5",
                              fontSize: "16px",
                            }}>{key + 1}</div>
                            <div
                              style={{
                                width: "79%",
                                color: "#3f8aa5",
                                fontSize: "16px",
                              }}
                            >
                              {item?.role_name}
                            </div>
                            <div style={{
                              display: "flex",
                              gap: "10px",
                              width: "15%",
                            }} className="hstack gap-1">
                              {userPermissionList.some(
                                (permission) =>
                                  permission.permissionCode ===
                                  "REASSIGN_USER" && permission.checked
                              ) && (
                                  <img
                                    src={edit}
                                    title="Edit Role"
                                    onClick={() =>
                                      item?.is_deletable &&
                                      handleEditRoleMasterShow(item?.id, item?.role_name)
                                    }
                                    style={{
                                      cursor: item?.is_deletable ? "pointer" : "not-allowed",
                                      opacity: item?.is_deletable ? 1 : 0.5,
                                    }}
                                  />
                                )}
                              &nbsp;&nbsp;
                              {userPermissionList.some(
                                (permission) =>
                                  permission.permissionCode ===
                                  "REMOVE_USER" && permission.checked
                              ) && (
                                  <img src={deletee}
                                    onClick={() => {
                                      item?.is_deletable && showDeleteAccessPopup(item?.id);
                                    }}
                                    style={{
                                      cursor: item?.is_deletable ? "pointer" : "not-allowed",
                                      opacity: item?.is_deletable ? 1 : 0.5,
                                    }}
                                    title="Delete Role"
                                  ></img>
                                )}
                            </div>
                            <button
                              className=""
                              onClick={() => {
                                rolePermissionList(item?.id);
                                setAuditModule(item.system_created);
                                setSelectedItem(item?.id);
                                handleShow()
                              }}
                              style={{
                                background: "#3F8AA5",
                                border: "none",
                                fontWeight: 700,
                                letterSpacing: "0px",
                                padding: "10px 30px",
                                borderRadius: "5px",
                                color: "white",
                              }}
                            >
                              Permissions
                            </button>
                          </div>
                        ))}
                    </div >
                  ) : (
                    <div>
                      No Data Found
                    </div>
                  )
                ) : (
                  <Loader />
                )}
              </div>
            </Col>

            <Modal show={show} onHide={handleClose} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "#3f88a5", fontSize: "24px" }}>Permissions Group</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="access__group__section">
                  <div className="access__section">
                    {pemissionList && <Menu jsonData={pemissionList} />}
                  </div>
                  {answerAccepted && (
                    <div className="access__section">
                      <p>Do you want to audit?</p>
                      <FormGroup>
                        <Form.Check
                          type="checkbox"
                          id="checkYes"
                          label="Yes"
                          checked={answerAccepted === "YES"}
                        // onChange={() => handleCheckboxChange("YES")}
                        />
                        <Form.Check
                          type="checkbox"
                          id="checkNo"
                          label="No"
                          checked={answerAccepted === "NO"}
                        // onChange={() => handleCheckboxChange("NO")}
                        />
                      </FormGroup>
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={updatePermissionToRole}>
                  Assign Permission
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </div>
      </div>

      {/* Add/Edit Management ------------------- */}
      <Modal show={showAddManagement} onHide={handleCloseAddManagement}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>
              {mode === "create" ? "Create" : "Update"} Role
            </Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control"
            type="text"
            defaultValue={mode === "create" ? "" : roleName}
            placeholder="Enter Role Name"
            onChange={(e) => setRoleTitle(e)}
          />
          <span style={{ color: "red" }}>
            {isError && "This Role Already Exist."}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style"
            type="submit"
            disabled={isError || roleName === "" ? true : false}
            onClick={mode === "create" ? createRoleMaster : updateRoleMaster}
          >
            {mode === "create" ? "Create Role" : "Update Role"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Management ------------------------- */}
      <Modal show={deleteAccessPopup} onHide={closeDeleteAccessPopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Form.Label>Confirmation</Form.Label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="new_button_style__reject"
            type="submit"
            onClick={() => deleteRoleMaster()}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccessManagement;