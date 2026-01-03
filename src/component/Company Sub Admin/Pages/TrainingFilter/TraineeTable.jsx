import React from "react";

const TraineeTable = ({ trainees, searchTerm, loading }) => {
    const filteredTrainees = trainees.filter(
      (trainee) =>
        trainee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.departmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.categoryId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            borderRadius: "12px",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>
            Loading trainee data...
          </div>
        </div>
      );
    }
  
    return (
      <div
        style={{
          overflowX: "auto",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              }}
            >
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                #
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                👤 Name
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                📧 Email
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🆔 Employee ID
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                👨‍👩‍👧‍👦 Gender
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🏢 Department
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                💼 Category
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                📚 Trainings
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🏷️ Categories
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                📂 Topics
              </th>
              <th
                style={{
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                ⚖️ Principles
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainees.map((trainee, index) => (
              <tr
                key={`${trainee.employeeId}-${index}`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f0fcff" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{ padding: "12px", fontWeight: "600", color: "#374151" }}
                >
                  {trainee.employeeName || "N/A"}
                </td>
                <td style={{ padding: "12px", color: "#374151" }}>
                  {trainee.email || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  {trainee.employeeId || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  {trainee.gender || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  {trainee.departmentId || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  {trainee.categoryId || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#059669",
                        fontSize: "16px",
                      }}
                    >
                      {trainee.trainings?.length || 0}
                    </span>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "10px",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={trainee.trainings?.join(", ") || "None"}
                    >
                      {(trainee.trainings || [])
                        .map((name, idx) => (
                          <div key={idx}>{name}</div>
                        ))}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#06b6d4",
                        fontSize: "16px",
                      }}
                    >
                      {trainee.categories?.length || 0}
                    </span>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "10px",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={trainee.categories?.join(", ") || "None"}
                    >
                      {(trainee.categories || [])
                        .map((title, idx) => (
                          <div key={idx}>{title}</div>
                        ))}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#7c3aed",
                        fontSize: "16px",
                      }}
                    >
                      {trainee.topics?.length || 0}
                    </span>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "10px",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={trainee.topics?.join(", ") || "None"}
                    >
                      {(trainee.topics || [])
                        .map((topic, idx) => (
                          <div key={idx}>{topic}</div>
                        ))}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#dc2626",
                        fontSize: "16px",
                      }}
                    >
                      {trainee.principles?.length || 0}
                    </span>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "10px",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={trainee.principles?.join(", ") || "None"}
                    >
                      {(trainee.principles || [])
                        .map((title, idx) => (
                          <div key={idx}>{title}</div>
                        ))}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default TraineeTable;