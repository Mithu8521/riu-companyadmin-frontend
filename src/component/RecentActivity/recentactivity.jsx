import React, { useState, useEffect } from "react";
import NoNotification from "../../img/no-results.png";
import { NavLink } from "react-router-dom";
import "./recentactivity.css";
import "../ProgressBySector/sectorprogress.css";

const RecentActivity = ({ todaysActivities,heading }) => {
  // State to track how many activities are loaded
  const [loadedActivities, setLoadedActivities] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state

  const itemsPerLoad = 10; // Number of items to load initially and on each scroll

  // Function to load more activities
  const loadMoreActivities = () => {
    if (loading) return; // Prevent loading if already loading

    setLoading(true);

    // Get the next set of activities to load
    const nextActivities = todaysActivities.slice(loadedActivities.length, loadedActivities.length + itemsPerLoad);
    setLoadedActivities((prev) => [...prev, ...nextActivities]);

    setLoading(false);
  };

  // Load the initial set of activities when the component mounts
  useEffect(() => {
    loadMoreActivities();
  }, [todaysActivities]);

  // Handle scroll to load more data
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      loadMoreActivities();
    }
  };

  return (
    <div className="recentclass" style={{ height: "100%" }}>
      <div style={{ marginBottom: "10px", marginTop: "1%" }}>
        <h5>{heading}</h5>
      </div>
      <div
        className="activity_section scroll-container"
        style={{ height: "100%", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {loadedActivities.length > 0 ? (
          loadedActivities.map((notification) => (
            <div key={notification.id} style={{ display: "flex" }}>
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <div className="circle-icon" style={{ marinTop: "%" }}>
                  <div className="name_icon">
                    {notification?.userName?.charAt(0)}
                  </div>
                </div>
              </div>

              <div
                style={{ flexDirection: "column" }}
                className="d-flex flex-wrap mb-2 mt-2 w-100"
              >
                <div className="d-flex align-items-center">
                  <div className="name">{notification?.userName}</div>
                  <div>
                    <NavLink
                      style={{ marginTop: "0%" }}
                      onClick={() => {
                        localStorage.setItem(
                          "reportingQuestion",
                          JSON.stringify([notification?.questionId])
                        );
                      }}
                      to={{
                        pathname: "/reporting-modules/all-module",
                        state: {
                          reportingQuestion: [notification?.questionId],
                        },
                      }}
                    >
                      <span title={notification?.massage}>
                        {notification?.massage.length > 30
                          ? `${notification?.massage.slice(0, 50)}.....`
                          : notification?.massage}
                      </span>
                    </NavLink>{" "}
                  </div>
                </div>

                <div className="d-flex" style={{ marginLeft: "1%" }}>
                  <span
                    style={{
                      marginLeft: "5px",
                      color: "#3F88A5",
                      fontSize: 14,
                      fontFamily: "Open Sans",
                      fontWeight: "400",
                      wordWrap: "break-word",
                      marginRight: "10px",
                    }}
                  >
                    Time:{" "}
                    {new Date(notification?.createdAt).toLocaleTimeString()}
                  </span>

                  <span
                    style={{
                      marginLeft: "5px",
                      color: "#3F88A5",
                      fontSize: 14,
                      fontFamily: "Open Sans",
                      fontWeight: "400",
                      wordWrap: "break-word",
                    }}
                  >
                    Date:{" "}
                    {new Date(notification?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100 h-75">
            {" "}
            <img
              src={NoNotification}
              alt="No Notification Here..."
              className="w-50 h-100"
            />
          </div>
        )}
        {loading && <div>Loading more...</div>}
      </div>
    </div>
  );
};

export default RecentActivity;
