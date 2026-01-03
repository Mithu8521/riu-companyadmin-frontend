// src/components/Header/HeaderFunctional.js
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { authenticationService } from "../../_services/authentication";
import { history } from "../../_helpers/history";
import { Link, NavLink } from "react-router-dom";
import config from "../../config/config.json";
import { FiBell } from "react-icons/fi";
import "./header.css";
import { PermissionMenuContext } from "../../contextApi/permissionBasedMenuContext";
import swal from "sweetalert";
import { apiCall } from "../../_services/apiCall";
import NoNotification from "../../img/no-results.png";
import { Button, Modal } from "react-bootstrap";
import { initSocket, closeSocket } from "./socketClient";
import { getPeriodValue } from "../../utils/PeriodCalculationUtils";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNotifications } from "../../hooks/useNotification";
import { useAuthGuard } from "../../hooks/useAuthGuard";

// Color constants
const COLORS = {
  primary: "#007bff",
  primaryDark: "#0056b3",
  primaryLight: "#e7f3ff",
  danger: "#dc3545",
  success: "#28a745",
  textPrimary: "#333333",
  textSecondary: "#666666",
  textMuted: "#999999",
  bgLight: "#f8f9fa",
  bgWhite: "#ffffff",
  border: "#e0e0e0",
};

// pulled out badge style to avoid recreating each render
const notificationBadgeStyle = {
  position: "absolute",
  top: 2,
  right: 2,
  backgroundColor: COLORS.danger,
  color: COLORS.bgWhite,
  borderRadius: "50%",
  padding: "4px 7px",
  fontSize: "11px",
  fontWeight: 700,
  lineHeight: 1,
  minWidth: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: `0 0 0 2px ${COLORS.bgWhite}`,
  border: `2px solid ${COLORS.bgWhite}`,
};

const Header = () => {
  const { dispatch } = useContext(PermissionMenuContext);
  useAuthGuard();

  const {
    currentUser,
    currentUserId,
    profilePicture,
    firstName,
    lastName,
  } = useCurrentUser();

  const {
    notificationData,
    unreadCount,
    isProcessing,
    getNotificationToUser,
    markNotificationRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications(currentUserId);

  // local state
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // refs for correct behavior
  const dropdownRef = useRef(null);
  const isPopUpOpenRef = useRef(isPopUpOpen);

  useEffect(() => {
    isPopUpOpenRef.current = isPopUpOpen;
  }, [isPopUpOpen]);

  // helper: save menu/role to context (still used?)
  const saveToContext = (payloadValue, typeValue) => {
    dispatch({
      type: typeValue,
      payload: payloadValue,
    });
  };

  // keyboard shortcuts
  const handleKeyboardShortcuts = (e) => {
    if (e.altKey && e.key === "s") {
      e.preventDefault();
      sidebarOpen();
    }
  };

  // click outside dropdown
  const handleClickOutside = (e) => {
    // If confirmation modal is open, ignore closing dropdown
    if (isPopUpOpenRef.current) return;

    // ignore clicks on bootstrap modal/backdrop
    if (
      e.target.classList.contains("modal") ||
      e.target.classList.contains("modal-backdrop")
    ) {
      return;
    }

    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  // custom event handler (if other parts of app dispatch 'app:notification')
  const handleAppNotificationEvent = async () => {
    try {
      await getNotificationToUser();
    } catch (err) {
      console.warn("Error handling app:notification event", err);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    window.addEventListener("app:notification", handleAppNotificationEvent);
    document.addEventListener("mousedown", handleClickOutside);

    if (!document.getElementById("sidebar-wrapper")) {
      console.warn("Sidebar wrapper element not found in the DOM");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
      window.removeEventListener("app:notification", handleAppNotificationEvent);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sidebar toggle (still DOM-based, but centralized)
  const sidebarOpen = () => {
    const sidebar = document.getElementById("sidebar-wrapper");
    if (!sidebar) {
      console.error("Sidebar element not found");
      return;
    }
    const isActive = sidebar.classList.contains("active-sidebar");
    if (isActive) {
      sidebar.classList.remove("active-sidebar");
      sidebar.style.display = "block";
      sidebar.style.zIndex = "3";
      requestAnimationFrame(() => {
        sidebar.style.marginLeft = "0rem";
        window.dispatchEvent(new Event("resize"));
      });
    } else {
      sidebar.classList.add("active-sidebar");
      sidebar.style.marginLeft = "-15rem";
      setTimeout(() => {
        sidebar.style.display = "none";
        window.dispatchEvent(new Event("resize"));
      }, 200);
    }
    document.body.classList.toggle("sidebar-open");
  };

  const goToPreviousPath = () => {
    window.history.back();
  };

  const handleDropdownToggle = async () => {
    await getNotificationToUser();
    setIsDropdownOpen((prev) => !prev);
  };

  const logoutUser = useCallback(async () => {
    try {
      const headers = {};
      if (currentUserId) headers.userId = currentUserId;

      await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}logout`,
        headers,
        {},
        "POST"
      );
    } catch (err) {
      console.warn("Logout request failed", err);
    }
  }, [currentUserId]);

  const logout = () => {
    logoutUser();
    closeSocket();
    authenticationService.logout();
    history.push("/");
    localStorage.clear();
  };

  const handlePopUp = (modeValue) => {
    setMode(modeValue);
    setIsPopUpOpen(true);
  };

  const handleClose = () => {
    setIsPopUpOpen(false);
    setMode(null);
  };

  const handleConfirmAction = () => {
    if (mode === "CLEARALL") {
      clearAllNotifications()
        .then(() => {
          handleClose();
          swal({
            icon: "success",
            title: "Success",
            text: "All notifications cleared.",
            timer: 2000,
          });
        })
        .catch(() => {
          swal({
            icon: "error",
            title: "Error",
            text: "Failed to clear notifications.",
            timer: 2000,
          });
        });
    } else if (mode === "MARKREAD") {
      markAllAsRead()
        .then(() => {
          handleClose();
          swal({
            icon: "success",
            title: "Success",
            text: "All notifications marked as read.",
            timer: 2000,
          });
        })
        .catch(() => {
          swal({
            icon: "error",
            title: "Error",
            text: "Failed to mark notifications as read.",
            timer: 2000,
          });
        });
    }
  };

  // socket for notifications
  useEffect(() => {
    if (!currentUserId) return;

    const socket = initSocket(currentUserId);
    if (!socket) return;

    const handleNotification = (payload) => {
      getNotificationToUser();
    };

    socket.on("chatNotification", handleNotification);

    return () => {
      socket.off("chatNotification", handleNotification);
    };
  }, [currentUserId, getNotificationToUser]);

  const getPageTitle = () => {
    const fullUrl = window.location.href.split("/");
    const uri = window.location.pathname.split("/");
    const path = uri[1];
    let title = "";

    if (fullUrl[3] !== "sub_accounts") {
      title = fullUrl.pop().toUpperCase();
    } else {
      title = fullUrl[3];
    }

    title = title.replaceAll("_", " ");
    if (title === "SUPPLIER FAST") title = "SUPPLIER";
    if (title === "SUSTAINABLE")
      title = "SUSTAINABLE DEVELOPMENT GOALS";
    if (fullUrl[3] === "checkout") title = "Success";
    if (path === "Leadership_Governance")
      title = "Leadership & Governance";
    if (path === "Cyber_Digital") title = "Cyber & Digital";
    if (path === "Business_Model_Innovation")
      title = "Business Model & Innovation";
    if (path === "suppliers_fast") title = "Suppliers";
    if (title === "HOME") title = "Dashboard";

    return title;
  };

  const pageTitle = getPageTitle();

  return (
    <div
      style={{
        position: "sticky",
        top: "0",
        zIndex: 99,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="d-flex" id="wrapper" style={{ width: "100%" }}>
        <div id="page-content-wrapper" style={{ width: "100%" }}>
          <nav
            className="navbar navbar-expand-lg border-bottom navclassName background topbar_esg"
            style={{ width: "100%" }}
          >
            <div className="container-fluid">
              <div className="deahbord" id="sidebarToggle">
                <NavLink
                  to="#"
                  className="sidebar_bar"
                  onClick={sidebarOpen}
                >
                  <i className="fas fa-bars"></i>
                </NavLink>
                <h4 className="back_quninti back_quninti_2 m-0">
                  <a className="back_text">
                    <span className="step_icon">
                      <i
                        onClick={goToPreviousPath}
                        className="far fa-long-arrow-left"
                      ></i>
                    </span>
                    {pageTitle}
                  </a>
                </h4>
              </div>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav align-items-center ms-auto gap-3">
                  {currentUser?.frameworkData?.some(
                    (item) => item.id === 48
                  ) && (
                      <li className="nav-item">
                        <div className="btn-outline-secondary">
                          <NavLink to="/analytics">
                            <button className="esg_button_style">
                              Quick View Reporting
                            </button>
                          </NavLink>
                        </div>
                      </li>
                    )}

                  <li className="nav-item">
                    <div className="btn-outline-secondary">
                      <NavLink to="/data-analytics">
                        <button className="esg_button_style">
                          Data Analytics
                        </button>
                      </NavLink>
                    </div>
                  </li>

                  {/* Notification dropdown */}
                  <li
                    className="nav-item dropdown notification-dropdown"
                    style={{ position: "static" }}
                    ref={dropdownRef}
                  >
                    <div
                      className="elly"
                      style={{ position: "relative" }}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle();
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          position: "relative",
                          padding: "8px",
                          color: COLORS.primary,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FiBell
                          className="ellly"
                          style={{
                            color: COLORS.primary,
                            fontSize: "28px",
                            strokeWidth: "2px",
                          }}
                        />
                        {unreadCount > 0 && (
                          <span style={notificationBadgeStyle}>
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </a>
                    </div>

                    <div
                      className={`dropdown-menu dropdown-menu-end dropdown_menu ${isDropdownOpen ? "show" : ""
                        }`}
                      style={{
                        width: "420px",
                        maxWidth: "calc(100vw - 40px)",
                        position: "fixed",
                        right: "20px",
                        top: "70px",
                        zIndex: 1050,
                        display: isDropdownOpen ? "block" : "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "8px",
                        backgroundColor: COLORS.bgWhite,
                      }}
                    >
                      <div className="notification_section">
                        <div
                          className="hstack border-bottom justify-content-between p-3"
                          style={{ backgroundColor: COLORS.bgLight }}
                        >
                          <h5
                            className="mb-0"
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: COLORS.textPrimary,
                            }}
                          >
                            Notifications
                          </h5>
                          <div className="hstack gap-3">
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePopUp("MARKREAD");
                              }}
                              style={{
                                cursor: "pointer",
                                fontSize: "13px",
                                color: COLORS.primary,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                                transition: "color 0.2s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color = COLORS.primaryDark)
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color = COLORS.primary)
                              }
                            >
                              Mark all as read
                            </a>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePopUp("CLEARALL");
                              }}
                              style={{
                                cursor: "pointer",
                                fontSize: "13px",
                                color: COLORS.danger,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                                transition: "color 0.2s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color = "#c82333")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color = COLORS.danger)
                              }
                            >
                              Clear all
                            </a>
                          </div>
                        </div>

                        <div
                          className="notification_body"
                          style={{
                            maxHeight: "400px",
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          {notificationData && notificationData.length > 0 ? (
                            notificationData.map((item) => {
                              const rawMeta = item?.metadata;
                              let meta = {};

                              if (rawMeta) {
                                if (typeof rawMeta === "string") {
                                  try {
                                    meta = JSON.parse(rawMeta);
                                  } catch (e) {
                                    console.warn("Invalid metadata JSON for notification", item.id, e);
                                    meta = {};
                                  }
                                } else if (typeof rawMeta === "object") {
                                  meta = rawMeta || {};
                                }
                              }

                              const titleText = item?.title || "Notification";

                              // ---- SAFE LOCATION HANDLING ----
                              let locationStr = null;

                              const location = meta && typeof meta === "object" ? meta.location : null;

                              if (location && typeof location === "object") {
                                if (location.unitCode) {
                                  locationStr = location.unitCode;
                                } else {
                                  const parts = [];

                                  if (location.area) parts.push(location.area);
                                  if (location.city) parts.push(location.city);
                                  if (location.state) parts.push(location.state);
                                  if (location.country) parts.push(location.country);

                                  if (parts.length > 0) {
                                    locationStr = parts.join(", ");
                                  }
                                }
                              }

                              const financialYear = meta.financialYear;

                              const createdAtStr = item.createdAt
                                ? new Date(item.createdAt).toLocaleString()
                                : "";

                              const period = getPeriodValue(item.fromDate, item.toDate);

                              const htmlBody = item.body;

                              const maxLen = 80;
                              let displayHtml = item.body || "";

                              if (typeof displayHtml === "string" && displayHtml.length > maxLen) {
                                displayHtml = displayHtml.substring(0, maxLen) + "…";
                              }
                              const questionTitlte = meta?.title?.length > 100  ?meta?.title.substring(0,100) + "..." : meta.title;

                              return (
                                <div
                                  className="d-flex gap-3 border-bottom p-3 notification-item"
                                  key={item.id}
                                  style={{
                                    backgroundColor: item.isRead
                                      ? "transparent"
                                      : COLORS.primaryLight,
                                    transition: "all 0.2s ease",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                >
                                  {!item.isRead && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: "4px",
                                        backgroundColor: COLORS.primary,
                                      }}
                                    />
                                  )}

                                  <div
                                    className="icon-badge"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: COLORS.primary,
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <i
                                      className="fas fa-bell"
                                      style={{
                                        color: COLORS.bgWhite,
                                        fontSize: "16px",
                                      }}
                                    />
                                  </div>

                                  <div style={{ flex: 1 }}>
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                      <h6
                                        style={{
                                          margin: 0,
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          color: COLORS.textPrimary,
                                        }}
                                      >
                                        {titleText}
                                      </h6>

                                      <small
                                        style={{
                                          color: COLORS.textMuted,
                                          fontSize: "11px",
                                          whiteSpace: "nowrap",
                                          marginLeft: "10px",
                                        }}
                                      >
                                        {createdAtStr}
                                      </small>
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 6,
                                        marginBottom: 6,
                                      }}
                                    >
                                      {questionTitlte && (
                                        <div
                                          style={{
                                            fontSize: 13,
                                            color: COLORS.textSecondary,
                                          }}
                                          title= {meta?.title}
                                        >
                                          <strong
                                            style={{
                                              color: COLORS.textPrimary,
                                              fontWeight: 600,
                                              marginRight: 6,
                                            }}
                                          >
                                            Question:
                                          </strong>
                                          <span>{questionTitlte}</span>
                                        </div>
                                      )}
                                      {locationStr && (
                                        <div
                                          style={{
                                            fontSize: 13,
                                            color: COLORS.textSecondary,
                                          }}
                                        >
                                          <strong
                                            style={{
                                              color: COLORS.textPrimary,
                                              fontWeight: 600,
                                              marginRight: 6,
                                            }}
                                          >
                                            Location:
                                          </strong>
                                          <span>{locationStr}</span>
                                        </div>
                                      )}

                                      {financialYear && (
                                        <div
                                          style={{
                                            fontSize: 13,
                                            color: COLORS.textSecondary,
                                          }}
                                        >
                                          <strong
                                            style={{
                                              color: COLORS.textPrimary,
                                              fontWeight: 600,
                                              marginRight: 6,
                                            }}
                                          >
                                            Financial year:
                                          </strong>
                                          <span>{financialYear}</span>
                                        </div>
                                      )}

                                      {period && (
                                        <div
                                          style={{
                                            fontSize: 13,
                                            color: COLORS.textSecondary,
                                          }}
                                        >
                                          <strong
                                            style={{
                                              color: COLORS.textPrimary,
                                              fontWeight: 600,
                                              marginRight: 6,
                                            }}
                                          >
                                            Period:
                                          </strong>
                                          <span>{period}</span>
                                        </div>
                                      )}
                                    </div>

                                    <p
                                      className="notification-body-html"
                                      style={{
                                        margin: "6px 0",
                                        fontSize: "13px",
                                        color: COLORS.textSecondary,
                                        lineHeight: "1.5",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                      }}
                                      title={meta.plainBody}
                                    >
                                      <strong
                                        style={{
                                          color: COLORS.textPrimary,
                                          fontWeight: 600,
                                          marginRight: 6,
                                        }}
                                      >
                                        Message:
                                      </strong>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: displayHtml,
                                        }}
                                      />
                                    </p>

                                    {!item.isRead && (
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          markNotificationRead(item.id);
                                        }}
                                        className="notification-action"
                                        style={{
                                          fontSize: "12px",
                                          color: COLORS.primary,
                                          textDecoration: "none",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Mark as read
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div
                              className="notification-empty-state"
                              style={{
                                padding: "40px",
                                textAlign: "center",
                              }}
                            >
                              <img
                                src={NoNotification}
                                alt="No Notifications"
                                style={{
                                  maxWidth: "180px",
                                  opacity: 0.5,
                                  marginBottom: "15px",
                                }}
                              />
                              <p
                                style={{
                                  color: COLORS.textMuted,
                                  fontSize: "14px",
                                  margin: 0,
                                }}
                              >
                                No notifications yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Profile dropdown */}
                  <li className="nav-item dropdown text_down">
                    <div className="image_round">
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="image--coverq"
                      />
                    </div>

                    <a
                      className="home_drop"
                      id="navbarDropdown"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style={{
                        color: COLORS.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {firstName} {lastName}{" "}
                      <i
                        className="fa fa-caret-down elly"
                        aria-hidden="true"
                      ></i>
                    </a>

                    <div
                      className="dropdown-menu dropdown-menu-end dropdown_menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link to="/settings" className="dropdown-item">
                        <i
                          className="fa fa-user"
                          style={{ color: COLORS.primary }}
                        ></i>
                        <span>My Profile</span>
                      </Link>

                      <Link
                        onClick={logout}
                        to="/"
                        className="dropdown-item"
                      >
                        <i
                          className="fa fa-sign-out"
                          style={{ color: COLORS.danger }}
                        ></i>
                        <span>Logout</span>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Confirmation Modal */}
          <Modal
            show={isPopUpOpen}
            onHide={handleClose}
            centered
            backdrop="static"
            style={{ zIndex: 10000 }}
          >
            <Modal.Header
              closeButton
              style={{
                borderBottom: `2px solid ${COLORS.primary}`,
                backgroundColor: COLORS.bgWhite,
                padding: "20px 24px",
              }}
            >
              <Modal.Title
                style={{
                  color: "black",
                  fontSize: "20px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i
                  className="fas fa-exclamation-circle"
                  style={{
                    color: "black",
                    fontSize: "24px",
                  }}
                ></i>
                <span
                  style={{
                    color: "black",
                    fontSize: "24px",
                  }}
                >
                  Confirmation
                </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{ padding: "32px 24px", fontSize: "15px", lineHeight: 1.7 }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor:
                      mode === "CLEARALL" ? "#dc354520" : "#007bff20",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    border: `4px solid ${mode === "CLEARALL" ? COLORS.danger : COLORS.primary
                      }`,
                  }}
                >
                  <i
                    className={
                      mode === "CLEARALL"
                        ? "fas fa-trash-alt"
                        : "fas fa-check-circle"
                    }
                    style={{
                      fontSize: "36px",
                      color:
                        mode === "CLEARALL" ? COLORS.danger : COLORS.primary,
                    }}
                  />
                </div>
                <h5
                  style={{
                    marginBottom: "16px",
                    color: COLORS.textPrimary,
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {mode === "CLEARALL"
                    ? "Clear All Notifications?"
                    : "Mark All as Read?"}
                </h5>
                <p
                  style={{
                    color: COLORS.textSecondary,
                    marginBottom: 0,
                    lineHeight: "1.7",
                    fontSize: "15px",
                  }}
                >
                  {mode === "CLEARALL"
                    ? "This action will permanently delete all your notifications. This cannot be undone."
                    : "This will mark all your notifications as read. You can still view them later."}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer
              style={{
                borderTop: `1px solid ${COLORS.border}`,
                padding: "20px 24px",
                justifyContent: "center",
                gap: "12px",
                backgroundColor: COLORS.bgWhite,
              }}
            >
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={isProcessing}
                style={{
                  minWidth: "130px",
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                  borderWidth: "2px",
                }}
              >
                <i className="fas fa-times" style={{ marginRight: "8px" }}></i>
                Cancel
              </Button>
              <Button
                variant={mode === "CLEARALL" ? "danger" : "primary"}
                onClick={handleConfirmAction}
                disabled={isProcessing}
                style={{
                  minWidth: "130px",
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  backgroundColor:
                    mode === "CLEARALL" ? COLORS.danger : COLORS.primary,
                  borderColor:
                    mode === "CLEARALL" ? COLORS.danger : COLORS.primary,
                  borderWidth: "2px",
                }}
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "8px" }}
                    ></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i
                      className={
                        mode === "CLEARALL" ? "fas fa-trash" : "fas fa-check"
                      }
                      style={{ marginRight: "8px" }}
                    ></i>
                    Confirm
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Header;
