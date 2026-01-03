import React, { useState } from "react";
import ParticipantModal from "./ParticipantModal";

const TrainingTable = ({ trainings, searchTerm, loading }) => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    participants: [],
    trainingTitle: "",
  });

  const filteredTrainings = trainings.filter(
    (training) =>
      training.trainingTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const openParticipantModal = (participants, title) => {
    setModalData({ isOpen: true, participants: participants || [], title });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, participants: [], title: "" });
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
          Loading training data...
        </div>
      </div>
    );
  }

  return (
    <>
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
            tableLayout: "fixed", // This ensures fixed column widths
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <th
                style={{
                  width: "5%", // Fixed width for index column
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                #
              </th>
              <th
                style={{
                  width: "15%", // Fixed width for training title
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                📚 Training Title
              </th>
              <th
                style={{
                  width: "7%", // Fixed width for from date
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                📅 From Date
              </th>
              <th
                style={{
                  width: "7%", // Fixed width for to date
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                📅 To Date
              </th>
              <th
                style={{
                  width: "7%", // Fixed width for facilitator
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🏢 Facilitator
              </th>
              <th
                style={{
                  width: "7%", // Fixed width for trainer
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                👨‍🏫 Trainer
              </th>
              <th
                style={{
                  width: "9%", // Fixed width for category
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🏷️ Categories
              </th>
              <th
                style={{
                  width: "9%", // Fixed width for principle
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                ⚖️ Principles
              </th>
              <th
                style={{
                  width: "5%", // Fixed width for registered count
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                ✅ Registered
              </th>
              <th
                style={{
                  width: "5%", // Fixed width for attended count
                  padding: "16px 12px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🚀 Attended
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainings.map((training, index) => (
              <tr
                key={training.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fafbff" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#6b7280",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    color: "#374151",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={training.title || training.trainingTitle} // Tooltip for full text
                >
                  {training.title || training.trainingTitle}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {training.fromDate || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {training.toDate || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={training.trainingFacilitator || "N/A"}
                >
                  {training.trainingFacilitator || "N/A"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={(training.trainers || []).map((t) => t?.name).filter(Boolean).join(", ")}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      display: "inline-block",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={(training.trainers || []).map(t => t?.name).filter(Boolean).join(", ")}
                  >
                    {(training.trainers || [])
                      .map(t => t?.name)
                      .filter(Boolean)
                      .map((name, idx) => (
                        <div key={idx}>{name}</div>
                      ))}
                  </span>

                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={(training.categories || []).map(category => category?.title).filter(Boolean).join(", ")}
                  >
                    {(training.categories || [])
                      .map(c => c?.title)
                      .filter(Boolean)
                      .map((title, idx) => (
                        <div key={idx}>{title}</div>
                      ))}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={(training.principles || []).map(principle => principle?.title).filter(Boolean).join(", ")}
                  >
                    {(training.principles || [])
                      .map(p => p?.title)
                      .filter(Boolean)
                      .map((title, idx) => (
                        <div key={idx}>{title}</div>
                      ))}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#059669" }}>
                      {training.counts?.acceptedCount || 0}
                    </span>
                    <button
                      onClick={() =>
                        openParticipantModal(
                          training.acceptedUsers,
                          "Registered Participants"
                        )
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#6366f1",
                        padding: "2px",
                      }}
                      title="View registered participants"
                    >
                      👥
                    </button>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#059669" }}>
                      {training.counts?.attendantCount || 0}
                    </span>
                    <button
                      onClick={() =>
                        openParticipantModal(
                          training.attendantUsers,
                          "Attended Participants"
                        )
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#f59e0b",
                        padding: "2px",
                      }}
                      title="View attended participants"
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ParticipantModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        participants={modalData.participants}
        title={modalData.title}
      />
    </>
  );
};

export default TrainingTable;