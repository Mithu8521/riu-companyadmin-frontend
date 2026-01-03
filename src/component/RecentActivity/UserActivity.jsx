import React, { useState, useEffect } from "react";
import NoNotification from "../../img/no-results.png";
import { NavLink } from "react-router-dom";
import "./recentactivity.css";
import "../ProgressBySector/sectorprogress.css";

// Inline styles for the component
const styles = {
  searchContainer: {
    width: "250px",
    position: "relative",
  },
  searchInput: {
    borderRadius: "20px",
    paddingLeft: "15px",
    paddingRight: "30px",
    border: "1px solid #ddd",
    height: "35px",
    fontSize: "14px",
  },
  activityTableHeader: {
    padding: "10px 15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    fontWeight: 600,
    color: "#495057",
    fontSize: "14px",
    borderBottom: "2px solid #e9ecef",
  },
  activityRow: {
    padding: "10px 15px",
    borderBottom: "1px solid #e9ecef",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  activityRowHover: {
    backgroundColor: "#f8f9fa",
  },
  dateTime: {
    fontSize: "13px",
    color: "#6c757d",
  },
  date: {
    fontWeight: 500,
    marginBottom: "2px",
  },
  time: {
    fontSize: "12px",
  },
  circleIcon: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#3F88A5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  },
  nameIcon: {
    color: "white",
    fontWeight: 600,
    fontSize: "16px",
  },
  name: {
    fontWeight: 500,
    fontSize: "14px",
    color: "#343a40",
  },
  messageLink: {
    color: "#495057",
    textDecoration: "none",
  },
  messageLinkHover: {
    color: "#3F88A5",
    textDecoration: "underline",
  },
  noResults: {
    textAlign: "center",
    width: "100%",
    padding: "3rem 0",
  },
  noResultsImage: {
    width: "25%",
    maxWidth: "200px",
  },
  loadingSpinner: {
    textAlign: "center",
    padding: "0.75rem 0",
  },
  scrollContainer: {
    height: "calc(100% - 90px)",
    overflowY: "auto",
  },
  // Adjusted column widths without event column
  timeCol: { width: "15%" },
  userCol: { width: "25%" },
  messageCol: { width: "45%" },
  statusCol: { width: "15%" },
  // Status badges
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "4px",
    textAlign: "center",
    display: "inline-block",
    fontWeight: "500",
    fontSize: "12px",
  },
  successStatus: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  failedStatus: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  pendingStatus: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  }
};

const UsersActivity = ({ usersActivity, heading }) => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loadedActivities, setLoadedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const itemsPerLoad = 10;

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time in AM/PM format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Filter activities based on search term
  useEffect(() => {
    if (!usersActivity) return;
    
    const filtered = usersActivity.filter((activity) => {
      return (
        activity?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity?.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(activity?.createdAt).includes(searchTerm) ||
        formatTime(activity?.createdAt).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity?.metadata && JSON.stringify(activity?.metadata).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    
    setFilteredActivities(filtered);
    setLoadedActivities(filtered.slice(0, itemsPerLoad));
  }, [searchTerm, usersActivity]);

  // Load more activities on scroll
  const loadMoreActivities = () => {
    if (loading) return;
    setLoading(true);

    const currentLength = loadedActivities.length;
    const nextActivities = filteredActivities.slice(
      currentLength,
      currentLength + itemsPerLoad
    );
    
    setLoadedActivities((prev) => [...prev, ...nextActivities]);
    setLoading(false);
  };

  // Handle scroll to load more data
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
      ) < 5;
    if (bottom) {
      loadMoreActivities();
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get status badge style based on status value
  const getStatusStyle = (status) => {
    const statusText = status ? status.toLowerCase() : "";
    
    if (statusText === "success" || statusText === "completed") {
      return { ...styles.statusBadge, ...styles.successStatus };
    } else if (statusText === "failed" || statusText === "error") {
      return { ...styles.statusBadge, ...styles.failedStatus };
    } else if (statusText === "pending" || statusText === "in progress") {
      return { ...styles.statusBadge, ...styles.pendingStatus };
    } else {
      // Default style for unknown status
      return { ...styles.statusBadge, backgroundColor: "#e9ecef", color: "#495057" };
    }
  };

  return (
    <div className="recentclass" style={{ height: "100%" }}>
      <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "15px", marginTop: "1%" }}>
        <h5>{heading}</h5>
        <div style={styles.searchContainer}>
          <input
            type="text"
            className="form-control"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Activity Table Header */}
      <div className="d-flex mb-2" style={styles.activityTableHeader}>
        <div style={styles.timeCol}>Date & Time</div>
        <div style={styles.userCol}>User</div>
        <div style={styles.messageCol}>Event</div>
        <div style={styles.statusCol}>Status</div>
      </div>
      
      <div
        className="activity_section"
        style={styles.scrollContainer}
        onScroll={handleScroll}
      >
        {loadedActivities.length > 0 ? (
          loadedActivities.map((notification) => (
            <div 
              key={notification.id} 
              className="d-flex align-items-center"
              style={{
                ...styles.activityRow,
                ...(hoveredRow === notification.id && styles.activityRowHover)
              }}
              onMouseEnter={() => setHoveredRow(notification.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div style={styles.timeCol}>
                <div style={styles.dateTime}>
                  <div style={styles.date}>{formatDate(notification?.createdAt)}</div>
                  <div style={styles.time}>{formatTime(notification?.createdAt)}</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center" style={styles.userCol}>
                <div style={styles.circleIcon}>
                  <div style={styles.nameIcon}>
                    {notification?.userName?.charAt(0) || "U"}
                  </div>
                </div>
                <div style={styles.name}>{notification?.userName}</div>
              </div>
              
              <div style={styles.messageCol}>
                <NavLink
                  onClick={() => {
                    if (notification?.questionId) {
                      localStorage.setItem(
                        "reportingQuestion",
                        JSON.stringify([notification?.questionId])
                      );
                    }
                  }}
                  to={{
                    pathname: notification?.questionId 
                      ? "/reporting-modules/all-module" 
                      : "#",
                    state: {
                      reportingQuestion: notification?.questionId 
                        ? [notification?.questionId] 
                        : [],
                    },
                  }}
                  style={{
                    ...styles.messageLink,
                    ...(hoveredLink === notification.id && styles.messageLinkHover)
                  }}
                  onMouseEnter={() => setHoveredLink(notification.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span title={notification?.message}>
                    {notification?.message}
                  </span>
                </NavLink>
              </div>

              <div style={styles.statusCol}>
                <span style={getStatusStyle(notification?.status)}>
                  {notification?.status || "Unknown"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <img
              src={NoNotification}
              alt="No Activities Found"
              style={styles.noResultsImage}
            />
            <p className="mt-3">No activities found</p>
          </div>
        )}
        {loading && (
          <div style={styles.loadingSpinner}>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersActivity;