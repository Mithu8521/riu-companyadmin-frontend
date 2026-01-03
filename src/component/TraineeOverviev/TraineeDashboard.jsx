import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Enhanced color palette for better visual appeal
const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
];

const STATUS_COLORS = {
  Completed: "#10B981",
  "Not Completed": "#EF4444",
  Confirmed: "#4F46E5",
  Pending: "#F59E0B",
};

// BRSR Principles with enhanced colors
const BRSR_PRINCIPLES = [
  {
    id: "Principle 1",
    color: "#4F46E5",
    description: "Ethics, Transparency & Accountability",
  },
  {
    id: "Principle 2",
    color: "#10B981",
    description: "Product Lifecycle Sustainability",
  },
  {
    id: "Principle 3",
    color: "#F59E0B",
    description: "Employee Well-being",
  },
  {
    id: "Principle 4",
    color: "#EF4444",
    description: "Stakeholder Engagement",
  },
  {
    id: "Principle 5",
    color: "#8B5CF6",
    description: "Human Rights",
  },
  {
    id: "Principle 6",
    color: "#06B6D4",
    description: "Environment",
  },
  {
    id: "Principle 7",
    color: "#84CC16",
    description: "Policy Advocacy",
  },
  {
    id: "Principle 8",
    color: "#F97316",
    description: "Inclusive Growth",
  },
  {
    id: "Principle 9",
    color: "#EC4899",
    description: "Customer Value",
  },
];

const StatCard = ({ title, value, icon, color, subtitle, trend }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 opacity-5 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className="inline-flex p-2 rounded-lg shadow-sm flex-shrink-0 w-8 h-8 items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          {trend && (
            <div className="flex items-center text-xs font-medium text-green-600">
              <span className="mr-1">↗</span>
              {trend}
            </div>
          )}
        </div>

        <h3 className="text-xs font-medium text-gray-600 mb-2 leading-relaxed group-hover:text-gray-700 transition-colors">
          {title}
        </h3>

        <div
          className="text-xl font-bold mb-1 transition-colors"
          style={{ color }}
        >
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const TraineeDashboard = ({
  trainingData = [],
  financialYearId,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState("brsr");
  const [selectedPrinciple, setSelectedPrinciple] = useState("All");

  // Process the training data to calculate statistics
  const processedData = useMemo(() => {
    if (!trainingData || !Array.isArray(trainingData) || !currentUserId) {
      return {
        currentStats: {
          accepted: 0,
          rejected: 0,
          completed: 0,
          notCompleted: 0,
          totalHours: 0,
        },
        quarterlyData: [],
        upcomingTrainings: [],
        trainingHistory: [],
        trainingPerHours: [],
        brsrPrincipleData: [],
      };
    }

    // Filter trainings where current user is involved
    const userTrainings = trainingData.filter(
      (training) => training.userId && training.userId.includes(currentUserId)
    );

    // Calculate current stats
    const currentDate = new Date();
    const accepted = userTrainings.filter(
      (training) =>
        training.acceptedUserId &&
        training.acceptedUserId.includes(currentUserId)
    ).length;

    const rejected = userTrainings.filter(
      (training) =>
        training.nonAcceptedUserId &&
        training.nonAcceptedUserId.includes(currentUserId)
    ).length;

    const completed = userTrainings.filter((training) => {
      const trainingEndDate = new Date(training.toDate);
      return (
        trainingEndDate < currentDate &&
        training.attendantUserId &&
        training.attendantUserId.includes(currentUserId)
      );
    }).length;

    const notCompleted = userTrainings.filter((training) => {
      const trainingEndDate = new Date(training.toDate);
      return (
        trainingEndDate < currentDate &&
        training.nonAttendantUserId &&
        training.nonAttendantUserId.includes(currentUserId)
      );
    }).length;

    // Calculate total hours
    const totalHours = userTrainings.reduce((total, training) => {
      if (
        training.attendantUserId &&
        training.attendantUserId.includes(currentUserId)
      ) {
        const startTime = new Date(`1970-01-01T${training.fromTime}`);
        const endTime = new Date(`1970-01-01T${training.toTime}`);
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0);

    // Process quarterly data
    const quarterlyStats = {};
    userTrainings.forEach((training) => {
      const date = new Date(training.fromDate);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const quarterKey = `Q${quarter} ${year}`;

      if (!quarterlyStats[quarterKey]) {
        quarterlyStats[quarterKey] = {
          quarter: quarterKey,
          accepted: 0,
          rejected: 0,
          completed: 0,
          notCompleted: 0,
          hours: 0,
        };
      }

      if (
        training.acceptedUserId &&
        training.acceptedUserId.includes(currentUserId)
      ) {
        quarterlyStats[quarterKey].accepted++;
      }
      if (
        training.nonAcceptedUserId &&
        training.nonAcceptedUserId.includes(currentUserId)
      ) {
        quarterlyStats[quarterKey].rejected++;
      }

      const trainingEndDate = new Date(training.toDate);
      if (trainingEndDate < currentDate) {
        if (
          training.attendantUserId &&
          training.attendantUserId.includes(currentUserId)
        ) {
          quarterlyStats[quarterKey].completed++;
          const startTime = new Date(`1970-01-01T${training.fromTime}`);
          const endTime = new Date(`1970-01-01T${training.toTime}`);
          const hours = (endTime - startTime) / (1000 * 60 * 60);
          quarterlyStats[quarterKey].hours += hours;
        }
        if (
          training.nonAttendantUserId &&
          training.nonAttendantUserId.includes(currentUserId)
        ) {
          quarterlyStats[quarterKey].notCompleted++;
        }
      }
    });

    const quarterlyData = Object.values(quarterlyStats).sort((a, b) => {
      const [qA, yearA] = a.quarter.split(" ");
      const [qB, yearB] = b.quarter.split(" ");
      return (
        new Date(yearA, parseInt(qA.slice(1)) * 3) -
        new Date(yearB, parseInt(qB.slice(1)) * 3)
      );
    });

    // Get upcoming trainings
    const upcomingTrainings = userTrainings
      .filter((training) => {
        const trainingDate = new Date(training.fromDate);
        return trainingDate >= currentDate;
      })
      .map((training) => ({
        id: training.id,
        name: training.trainingTitle,
        date: training.fromDate,
        duration: (() => {
          const startTime = new Date(`1970-01-01T${training.fromTime}`);
          const endTime = new Date(`1970-01-01T${training.toTime}`);
          return (endTime - startTime) / (1000 * 60 * 60);
        })(),
        status:
          training.acceptedUserId &&
          training.acceptedUserId.includes(currentUserId)
            ? "Confirmed"
            : "Pending",
        brsrPrinciple:
          training.mapPrinciple && training.mapPrinciple[0]
            ? `Principle ${
                training.mapPrinciple[0].title.match(/\d+/)?.[0] || ""
              }`
            : "N/A",
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get training history
    const trainingHistory = userTrainings
      .filter((training) => {
        const trainingDate = new Date(training.toDate);
        return trainingDate < currentDate;
      })
      .map((training) => {
        const isCompleted =
          training.attendantUserId &&
          training.attendantUserId.includes(currentUserId);
        return {
          id: training.id,
          name: training.trainingTitle,
          date: training.fromDate,
          duration: (() => {
            const startTime = new Date(`1970-01-01T${training.fromTime}`);
            const endTime = new Date(`1970-01-01T${training.toTime}`);
            return (endTime - startTime) / (1000 * 60 * 60);
          })(),
          status: isCompleted ? "Completed" : "Not Completed",
          score: training.score || (isCompleted ? null : 0),
          brsrPrinciple:
            training.mapPrinciple && training.mapPrinciple[0]
              ? `Principle ${
                  training.mapPrinciple[0].title.match(/\d+/)?.[0] || ""
                }`
              : "N/A",
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Process training hours by category
    const categoryHours = {};
    userTrainings.forEach((training) => {
      if (
        training.attendantUserId &&
        training.attendantUserId.includes(currentUserId) &&
        training.mapTopic
      ) {
        training.mapTopic.forEach((topic) => {
          const categoryName = topic.topic || "Other";
          if (!categoryHours[categoryName]) {
            categoryHours[categoryName] = 0;
          }
          const startTime = new Date(`1970-01-01T${training.fromTime}`);
          const endTime = new Date(`1970-01-01T${training.toTime}`);
          const hours = (endTime - startTime) / (1000 * 60 * 60);
          categoryHours[categoryName] += hours;
        });
      }
    });

    const trainingPerHours = Object.entries(categoryHours).map(
      ([name, hours]) => ({
        name,
        hours: Math.round(hours * 10) / 10,
      })
    );

    // Process BRSR principle data
    const principleStats = {};

    // Initialize all principles
    for (let i = 1; i <= 9; i++) {
      const principleKey = `Principle ${i}`;
      principleStats[principleKey] = {
        name: principleKey,
        trainings: 0,
        hours: 0,
        description:
          BRSR_PRINCIPLES.find((p) => p.id === principleKey)?.description || "",
      };
    }

    userTrainings.forEach((training) => {
      if (
        training.attendantUserId &&
        training.attendantUserId.includes(currentUserId) &&
        training.mapPrinciple
      ) {
        training.mapPrinciple.forEach((principle) => {
          const principleNumber = principle.title.match(/\d+/)?.[0];
          if (principleNumber) {
            const principleKey = `Principle ${principleNumber}`;
            if (principleStats[principleKey]) {
              principleStats[principleKey].trainings++;
              const startTime = new Date(`1970-01-01T${training.fromTime}`);
              const endTime = new Date(`1970-01-01T${training.toTime}`);
              const hours = (endTime - startTime) / (1000 * 60 * 60);
              principleStats[principleKey].hours += hours;
            }
          }
        });
      }
    });

    const brsrPrincipleData = Object.values(principleStats).map(
      (principle) => ({
        ...principle,
        hours: Math.round(principle.hours * 10) / 10,
      })
    );

    return {
      currentStats: {
        accepted,
        rejected,
        completed,
        notCompleted,
        totalHours: Math.round(totalHours * 10) / 10,
      },
      quarterlyData,
      upcomingTrainings,
      trainingHistory,
      trainingPerHours,
      brsrPrincipleData,
    };
  }, [trainingData, currentUserId]);

  // Filter training history based on selected BRSR principle
  const filteredTrainingHistory =
    selectedPrinciple === "All"
      ? processedData.trainingHistory
      : processedData.trainingHistory.filter(
          (training) => training.brsrPrinciple === selectedPrinciple
        );

  // Function to get color for BRSR principle
  const getPrincipleColor = (principle) => {
    const found = BRSR_PRINCIPLES.find((p) => p.id === principle);
    return found ? found.color : "#9CA3AF";
  };

  const tabConfig = [
    {
      key: "brsr",
      label: "BRSR Overview",
      icon: "📊",
      description: "Training metrics across BRSR principles",
    },
    {
      key: "history",
      label: "Training History",
      icon: "📋",
      description: "Complete record of past trainings",
    },
    {
      key: "hours",
      label: "Training Hours",
      icon: "⏰",
      description: "Time analysis and breakdown",
    },
  ];

  // Tab button component with emoji icon
  const TabButton = ({ tab, isActive, onClick }) => (
    <button
      className={`btn button ${isActive ? " activebtn" : ""}`}
      onClick={() => onClick(tab.key)}
      style={{
        margin: "0 5px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span className="text-base">{tab.icon}</span>
      <span>{tab.label}</span>
    </button>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "27px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRight: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#2563eb",
              }}
            >
              {processedData.currentStats.totalHours}
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Total Hours
            </h6>
          </div>
          <div>
            <span style={{ fontSize: "20px" }}>🎯</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRight: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#16a34a",
              }}
            >
              {processedData.currentStats.completed}
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Completed
            </h6>
          </div>
          <div>
            <span style={{ fontSize: "20px" }}>🏆</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRight: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#9333ea",
              }}
            >
              {
                processedData.brsrPrincipleData.filter((p) => p.trainings > 0)
                  .length
              }
              /9
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Principles
            </h6>
          </div>
          <div>
            <span style={{ fontSize: "20px" }}>📋</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#d97706",
              }}
            >
              {processedData.currentStats.accepted +
                processedData.currentStats.rejected >
              0
                ? Math.round(
                    (processedData.currentStats.accepted /
                      (processedData.currentStats.accepted +
                        processedData.currentStats.rejected)) *
                      100
                  )
                : 0}
              %
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Acceptance
            </h6>
          </div>
          <div>
            <span style={{ fontSize: "20px" }}>📊</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <div
          className="d-flex buttoncont"
          style={{
            marginBottom: "25px",
            overflow: "auto",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "thin",
            scrollbarHeight: "1px",
          }}
        >
          {tabConfig.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              onClick={setActiveTab}
            />
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "brsr" && (
        <div className="space-y-6">
          {/* Enhanced Stats Cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "stretch",
              gap: "27px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRight: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
                >
                  {processedData.currentStats.accepted}
                </h3>
                <h6
                  style={{
                    margin: "6px 0",
                    fontSize: "12px",
                    fontWeight: "medium",
                    color: "#6b7280",
                  }}
                >
                  Trainings Accepted
                </h6>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Successfully enrolled
                </div>
              </div>
              <div>
                <span style={{ fontSize: "20px", color: "#10B981" }}>✓</span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRight: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#EF4444",
                  }}
                >
                  {processedData.currentStats.rejected}
                </h3>
                <h6
                  style={{
                    margin: "6px 0",
                    fontSize: "12px",
                    fontWeight: "medium",
                    color: "#6b7280",
                  }}
                >
                  Trainings Rejected
                </h6>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Declined invitations
                </div>
              </div>
              <div>
                <span style={{ fontSize: "20px", color: "#EF4444" }}>✗</span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRight: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#4F46E5",
                  }}
                >
                  {processedData.currentStats.completed}
                </h3>
                <h6
                  style={{
                    margin: "6px 0",
                    fontSize: "12px",
                    fontWeight: "medium",
                    color: "#6b7280",
                  }}
                >
                  Trainings Completed
                </h6>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Successfully finished
                </div>
              </div>
              <div>
                <span style={{ fontSize: "20px", color: "#4F46E5" }}>🏆</span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#F59E0B",
                  }}
                >
                  {processedData.currentStats.notCompleted}
                </h3>
                <h6
                  style={{
                    margin: "6px 0",
                    fontSize: "12px",
                    fontWeight: "medium",
                    color: "#6b7280",
                  }}
                >
                  Trainings Missed
                </h6>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Not attended
                </div>
              </div>
              <div>
                <span style={{ fontSize: "20px", color: "#F59E0B" }}>⚠</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            <div className="p-8">
              <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-inner bg-white">
                <table className="min-w-full border border-gray-300 table-fixed">
                  <thead className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-10 py-8 text-left border-r border-gray-300 w-1/5">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Principle
                          </span>
                          <span className="text-gray-400 text-lg">📌</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-left border-r border-gray-300 w-2/5">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Description
                          </span>
                          <span className="text-gray-400 text-lg">📝</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                        <div className="flex items-center justify-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Trainings
                          </span>
                          <span className="text-gray-400 text-lg">📚</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                        <div className="flex items-center justify-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Hours
                          </span>
                          <span className="text-gray-400 text-lg">⏰</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-left w-1/6">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Progress
                          </span>
                          <span className="text-gray-400 text-lg">📈</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.brsrPrincipleData.map((principle, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 transition-all duration-500 group border-b border-gray-200"
                      >
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div
                            className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold shadow-md border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
                            style={{
                              backgroundColor: `${
                                COLORS[index % COLORS.length]
                              }20`,
                              color: COLORS[index % COLORS.length],
                              borderColor: `${COLORS[index % COLORS.length]}40`,
                            }}
                          >
                            <span className="relative z-10">
                              {principle.name}
                            </span>
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(45deg, ${
                                  COLORS[index % COLORS.length]
                                }, transparent)`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="max-w-sm">
                            <div className="text-base font-medium text-gray-900 leading-relaxed mb-1">
                              {principle.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                              <span className="text-base font-bold text-gray-800">
                                {principle.trainings}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="flex justify-center">
                            <div
                              className="px-4 py-2 rounded-xl shadow-sm border-2 font-semibold text-base"
                              style={{
                                backgroundColor: `${
                                  COLORS[index % COLORS.length]
                                }15`,
                                color: COLORS[index % COLORS.length],
                                borderColor: `${
                                  COLORS[index % COLORS.length]
                                }30`,
                              }}
                            >
                              {principle.hours}{" "}
                              <span className="text-sm opacity-75">hrs</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="flex-1">
                              <div className="w-32 bg-gray-200 rounded-full h-4 relative overflow-hidden shadow-inner">
                                <div
                                  className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                                  style={{
                                    width: `${
                                      processedData.currentStats.totalHours > 0
                                        ? Math.min(
                                            (principle.hours /
                                              processedData.currentStats
                                                .totalHours) *
                                              100,
                                            100
                                          )
                                        : 0
                                    }%`,
                                    background: `linear-gradient(90deg, ${
                                      COLORS[index % COLORS.length]
                                    }E6, ${COLORS[index % COLORS.length]})`,
                                  }}
                                >
                                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                                  <div
                                    className="absolute inset-0 opacity-50 animate-pulse"
                                    style={{
                                      background: `linear-gradient(90deg, transparent, ${
                                        COLORS[index % COLORS.length]
                                      }80, transparent)`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span
                                className="text-sm font-bold px-3 py-2 rounded-lg shadow-sm border"
                                style={{
                                  backgroundColor: `${
                                    COLORS[index % COLORS.length]
                                  }20`,
                                  color: COLORS[index % COLORS.length],
                                  borderColor: `${
                                    COLORS[index % COLORS.length]
                                  }40`,
                                }}
                              >
                                {processedData.currentStats.totalHours > 0
                                  ? (
                                      (principle.hours /
                                        processedData.currentStats.totalHours) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                %
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            <div className="p-8">
              <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-inner bg-white">
                <table className="min-w-full border border-gray-300 table-fixed">
                  <thead className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-10 py-8 text-left border-r border-gray-300 w-1/5">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Training Name
                          </span>
                          <span className="text-gray-400 text-lg">📋</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-left border-r border-gray-300 w-2/5">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Date
                          </span>
                          <span className="text-gray-400 text-lg">📅</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                        <div className="flex items-center justify-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Duration
                          </span>
                          <span className="text-gray-400 text-lg">⏱️</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                        <div className="flex items-center justify-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            BRSR Category
                          </span>
                          <span className="text-gray-400 text-lg">🏷️</span>
                        </div>
                      </th>
                      <th className="px-10 py-8 text-left w-1/6">
                        <div className="flex items-center gap-3 my-2">
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </span>
                          <span className="text-gray-400 text-lg">✅</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrainingHistory.map((training, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 transition-all duration-500 group border-b border-gray-200"
                      >
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div
                            className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold shadow-md border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
                            style={{
                              backgroundColor: `${
                                COLORS[index % COLORS.length]
                              }20`,
                              color: COLORS[index % COLORS.length],
                              borderColor: `${COLORS[index % COLORS.length]}40`,
                            }}
                          >
                            <span className="relative z-10">
                              {training.name}
                            </span>
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(45deg, ${
                                  COLORS[index % COLORS.length]
                                }, transparent)`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                              <div className="text-sm font-medium text-gray-800">
                                {new Date(training.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                              <span className="text-base font-bold text-gray-800">
                                <span className="text-sm font-bold text-emerald-700">
                                  {training.duration.toFixed(1)}
                                </span>
                                <span className="text-xs text-emerald-600 ml-1">
                                  hrs
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-r border-gray-200">
                          <div className="flex justify-center">
                            <div
                              className="px-4 py-2 rounded-xl shadow-sm border-2 font-semibold text-base"
                              style={{
                                backgroundColor: `${
                                  COLORS[index % COLORS.length]
                                }15`,
                                color: COLORS[index % COLORS.length],
                                borderColor: `${
                                  COLORS[index % COLORS.length]
                                }30`,
                              }}
                            >
                              {training.brsrPrinciple}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                              <span
                                className="text-sm font-bold px-3 py-2 rounded-lg shadow-sm border"
                                style={{
                                  backgroundColor: `${
                                    COLORS[index % COLORS.length]
                                  }20`,
                                  color: COLORS[index % COLORS.length],
                                  borderColor: `${
                                    COLORS[index % COLORS.length]
                                  }40`,
                                }}
                              >
                                {training.status}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "hours" && (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
              <div className="p-8">
                <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-inner bg-white">
                  <table className="min-w-full border border-gray-300 table-fixed">
                    <thead className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-10 py-8 text-left border-r border-gray-300 w-1/5">
                          <div className="flex items-center gap-3 my-2">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Training Category
                            </span>
                            <span className="text-gray-400 text-lg">📋</span>
                          </div>
                        </th>
                        <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                          <div className="flex items-center justify-center gap-3 my-2">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Hours
                            </span>
                            <span className="text-gray-400 text-lg">⏱️</span>
                          </div>
                        </th>
                        <th className="px-10 py-8 text-center border-r border-gray-300 w-1/6">
                          <div className="flex items-center justify-center gap-3 my-2">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Percentage
                            </span>
                            <span className="text-gray-400 text-lg">🏷️</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.trainingPerHours.map((category, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 transition-all duration-500 group border-b border-gray-200"
                        >
                          <td className="px-10 py-8 border-r border-gray-200">
                            <div
                              className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold shadow-md border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
                              style={{
                                backgroundColor: `${
                                  COLORS[index % COLORS.length]
                                }20`,
                                color: COLORS[index % COLORS.length],
                                borderColor: `${
                                  COLORS[index % COLORS.length]
                                }40`,
                              }}
                            >
                              <span className="relative z-10">
                                {category.name}
                              </span>
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                style={{
                                  background: `linear-gradient(45deg, ${
                                    COLORS[index % COLORS.length]
                                  }, transparent)`,
                                }}
                              ></div>
                            </div>
                          </td>

                                                  <td className="px-10 py-8 border-r border-gray-200">
                            <div className="flex justify-center">
                              <div
                                className="px-4 py-2 rounded-xl shadow-sm border-2 font-semibold text-base"
                                style={{
                                  backgroundColor: `${
                                    COLORS[index % COLORS.length]
                                  }15`,
                                  color: COLORS[index % COLORS.length],
                                  borderColor: `${
                                    COLORS[index % COLORS.length]
                                  }30`,
                                }}
                              >
                                <span className="text-sm font-bold text-emerald-700">
                                    {category.hours}
                                  </span>
                                  <span className="text-xs text-emerald-600 ml-1">
                                    hrs
                                  </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8 border-r border-gray-200">
                            <div className="flex justify-center">
                              <div
                                className="px-4 py-2 rounded-xl shadow-sm border-2 font-semibold text-base"
                                style={{
                                  backgroundColor: `${
                                    COLORS[index % COLORS.length]
                                  }15`,
                                  color: COLORS[index % COLORS.length],
                                  borderColor: `${
                                    COLORS[index % COLORS.length]
                                  }30`,
                                }}
                              >
                                {processedData.currentStats.totalHours > 0
                                  ? (
                                      (category.hours /
                                        processedData.currentStats.totalHours) *
                                      100
                                    ).toFixed(1)
                                  : 0}
                                %
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
       
        </div>
      )}
    </div>
  );
};

export default TraineeDashboard;
