import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
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
import PieChartVisualizer from "../DashboardComponents/PieChartVisualizer";

// Enhanced color palette matching the first dashboard
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

const TrainerOverviewDashboard = ({ trainingData = [], financialYearId }) => {
  const [activeTab, setActiveTab] = useState("trainings");
  const [selectedPrinciple, setSelectedPrinciple] = useState("All");

  // Process training data to extract analytics
  const processedData = useMemo(() => {
    if (!trainingData || trainingData.length === 0) {
      return {
        stats: {
          totalTrainings: 0,
          totalParticipants: 0,
          averageAcceptanceRate: 0,
          averageAttendanceRate: 0,
          totalHours: 0,
        },
        quarterlyData: [],
        principleData: [],
        topicData: [],
        trainingsByStatus: [],
        upcomingTrainings: [],
        completedTrainings: [],
      };
    }

    // Calculate basic statistics
    const totalTrainings = trainingData.length;
    const totalParticipants = trainingData.reduce(
      (sum, training) => sum + (training.userId?.length || 0),
      0
    );

    let totalAccepted = 0;
    let totalAttendees = 0;
    let totalInvited = 0;
    let totalHours = 0;

    trainingData.forEach((training) => {
      const invited = training.userId?.length || 0;
      const accepted = training.acceptedUserId?.length || 0;
      const attended = training.attendantUserId?.length || 0;

      totalInvited += invited;
      totalAccepted += accepted;
      totalAttendees += attended;

      // Calculate training hours
      if (training.fromTime && training.toTime) {
        const fromTime = new Date(`2000-01-01T${training.fromTime}`);
        const toTime = new Date(`2000-01-01T${training.toTime}`);
        const hours = (toTime - fromTime) / (1000 * 60 * 60);
        totalHours += hours * attended; // Total hours attended by all participants
      }
    });

    const averageAcceptanceRate =
      totalInvited > 0 ? ((totalAccepted / totalInvited) * 100).toFixed(1) : 0;
    const averageAttendanceRate =
      totalAccepted > 0
        ? ((totalAttendees / totalAccepted) * 100).toFixed(1)
        : 0;

    // Process quarterly data
    const quarterlyMap = {};
    trainingData.forEach((training) => {
      const date = new Date(training.fromDate);
      const year = date.getFullYear();
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      const key = `Q${quarter} ${year}`;

      if (!quarterlyMap[key]) {
        quarterlyMap[key] = {
          quarter: key,
          trainings: 0,
          participants: 0,
          accepted: 0,
          attended: 0,
          hours: 0,
        };
      }

      quarterlyMap[key].trainings += 1;
      quarterlyMap[key].participants += training.userId?.length || 0;
      quarterlyMap[key].accepted += training.acceptedUserId?.length || 0;
      quarterlyMap[key].attended += training.attendantUserId?.length || 0;

      if (training.fromTime && training.toTime) {
        const fromTime = new Date(`2000-01-01T${training.fromTime}`);
        const toTime = new Date(`2000-01-01T${training.toTime}`);
        const hours = (toTime - fromTime) / (1000 * 60 * 60);
        quarterlyMap[key].hours +=
          hours * (training.attendantUserId?.length || 0);
      }
    });

    const quarterlyData = Object.values(quarterlyMap).sort((a, b) => {
      const [quarterA, yearA] = a.quarter.split(" ");
      const [quarterB, yearB] = b.quarter.split(" ");
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return parseInt(quarterA.substring(1)) - parseInt(quarterB.substring(1));
    });

    // Process BRSR principle data
    const principleMap = {};
    trainingData.forEach((training) => {
      if (training.mapPrinciple && Array.isArray(training.mapPrinciple)) {
        training.mapPrinciple.forEach((principle) => {
          const principleKey = principle.title || `Principle ${principle.id}`;
          if (!principleMap[principleKey]) {
            principleMap[principleKey] = {
              name: principleKey,
              trainings: 0,
              participants: 0,
              hours: 0,
              description: principle.title || "",
            };
          }

          principleMap[principleKey].trainings += 1;
          principleMap[principleKey].participants +=
            training.attendantUserId?.length || 0;

          if (training.fromTime && training.toTime) {
            const fromTime = new Date(`2000-01-01T${training.fromTime}`);
            const toTime = new Date(`2000-01-01T${training.toTime}`);
            const hours = (toTime - fromTime) / (1000 * 60 * 60);
            principleMap[principleKey].hours +=
              hours * (training.attendantUserId?.length || 0);
          }
        });
      }
    });

    const principleData = Object.values(principleMap);

    // Process topic data
    const topicMap = {};
    trainingData.forEach((training) => {
      if (training.mapTopic && Array.isArray(training.mapTopic)) {
        training.mapTopic.forEach((topic) => {
          const topicKey = topic.topic;
          if (!topicMap[topicKey]) {
            topicMap[topicKey] = {
              name: topicKey,
              trainings: 0,
              participants: 0,
              hours: 0,
            };
          }

          topicMap[topicKey].trainings += 1;
          topicMap[topicKey].participants +=
            training.attendantUserId?.length || 0;

          if (training.fromTime && training.toTime) {
            const fromTime = new Date(`2000-01-01T${training.fromTime}`);
            const toTime = new Date(`2000-01-01T${training.toTime}`);
            const hours = (toTime - fromTime) / (1000 * 60 * 60);
            topicMap[topicKey].hours +=
              hours * (training.attendantUserId?.length || 0);
          }
        });
      }
    });

    const topicData = Object.values(topicMap);

    // Categorize trainings by status
    const currentDate = new Date();
    const upcomingTrainings = [];
    const completedTrainings = [];
    const inProgressTrainings = [];

    trainingData.forEach((training) => {
      const trainingDate = new Date(training.fromDate);
      const status =
        trainingDate > currentDate
          ? "upcoming"
          : trainingDate.toDateString() === currentDate.toDateString()
          ? "in-progress"
          : "completed";

      const processedTraining = {
        ...training,
        acceptanceRate:
          training.userId?.length > 0
            ? (
                ((training.acceptedUserId?.length || 0) /
                  training.userId.length) *
                100
              ).toFixed(1)
            : 0,
        attendanceRate:
          training.acceptedUserId?.length > 0
            ? (
                ((training.attendantUserId?.length || 0) /
                  training.acceptedUserId.length) *
                100
              ).toFixed(1)
            : 0,
        principleNames:
          training.mapPrinciple?.map((p) => p.title).join(", ") ||
          "Not specified",
        topicNames:
          training.mapTopic?.map((t) => t.topic).join(", ") || "Not specified",
      };

      if (status === "upcoming") {
        upcomingTrainings.push(processedTraining);
      } else if (status === "completed") {
        completedTrainings.push(processedTraining);
      } else {
        inProgressTrainings.push(processedTraining);
      }
    });

    return {
      stats: {
        totalTrainings,
        totalParticipants,
        averageAcceptanceRate,
        averageAttendanceRate,
        totalHours: Math.round(totalHours),
      },
      quarterlyData,
      principleData,
      topicData,
      upcomingTrainings: upcomingTrainings.sort(
        (a, b) => new Date(a.fromDate) - new Date(b.fromDate)
      ),
      completedTrainings: completedTrainings.sort(
        (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
      ),
      inProgressTrainings,
    };
  }, [trainingData]);

  // Filter training history based on selected BRSR principle
  const filteredTrainingHistory =
    selectedPrinciple === "All"
      ? processedData.completedTrainings
      : processedData.completedTrainings.filter((training) =>
          training.principleNames.includes(selectedPrinciple)
        );

  // Get unique principle names for filter dropdown
  const uniquePrinciples = [
    ...new Set(
      trainingData.flatMap(
        (training) => training.mapPrinciple?.map((p) => p.title) || []
      )
    ),
  ];

  const tabConfig = [
    {
      key: "trainings",
      label: "Training History",
      icon: "📋",
      description: "Complete record of past trainings",
    },
    // {
    //   key: "analytics",
    //   label: "Analytics",
    //   icon: "📈",
    //   description: "Training performance analytics",
    // },
    {
      key: "brsr",
      label: "BRSR Categories",
      icon: "🏷️",
      description: "Training by BRSR principles",
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

  const StatsCards = ({ data }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "27px",
          marginBottom: "20px",
        }}
      >
        {/* Total Trainings Card */}
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
              {data.totalTrainings}
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Total Trainings
            </h6>
            <div style={{ fontSize: "12px", color: "#666" }}>
              All training sessions
            </div>
          </div>
          <div>
            <span style={{ fontSize: "20px", color: "#4F46E5" }}>📚</span>
          </div>
        </div>

        {/* Total Participants Card */}
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
              {data.totalParticipants}
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Total Participants
            </h6>
            <div style={{ fontSize: "12px", color: "#666" }}>
              All invited participants
            </div>
          </div>
          <div>
            <span style={{ fontSize: "20px", color: "#10B981" }}>👥</span>
          </div>
        </div>

        {/* Acceptance Rate Card */}
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
                color: "#F59E0B",
              }}
            >
              {data.averageAcceptanceRate}%
            </h3>
            <h6
              style={{
                margin: "6px 0",
                fontSize: "12px",
                fontWeight: "medium",
                color: "#6b7280",
              }}
            >
              Acceptance Rate
            </h6>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Of invited participants
            </div>
          </div>
          <div>
            <span style={{ fontSize: "20px", color: "#F59E0B" }}>✅</span>
          </div>
        </div>

        {/* Total Hours Card */}
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
                color: "#EF4444",
              }}
            >
              {data.totalHours}
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
            <div style={{ fontSize: "12px", color: "#666" }}>
              Training hours delivered
            </div>
          </div>
          <div>
            <span style={{ fontSize: "20px", color: "#EF4444" }}>⏱️</span>
          </div>
        </div>
      </div>
    );
  };

  const BRSRPrinciplesTable = ({ principles, totalHours }) => {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
        <div className="p-8">
          <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-inner bg-white">
            <table className="min-w-full border border-gray-300 table-fixed">
              <thead className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-10 py-8 text-left border-r border-gray-300 w-1/5">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        BRSR Principle
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
                {principles.map((principle, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 transition-all duration-500 group border-b border-gray-200"
                  >
                    <td className="px-10 py-8 border-r border-gray-200">
                      <div
                        className="inline-flex items-center px-5 py-3 rounded-full text-sm font-semibold shadow-md border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
                        style={{
                          backgroundColor: `${COLORS[index % COLORS.length]}20`,
                          color: COLORS[index % COLORS.length],
                          borderColor: `${COLORS[index % COLORS.length]}40`,
                        }}
                      >
                        <span className="relative z-10">{principle.name}</span>
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
                            borderColor: `${COLORS[index % COLORS.length]}30`,
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
                                  totalHours > 0
                                    ? Math.min(
                                        (principle.hours / totalHours) * 100,
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
                              borderColor: `${COLORS[index % COLORS.length]}40`,
                            }}
                          >
                            {totalHours > 0
                              ? ((principle.hours / totalHours) * 100).toFixed(
                                  1
                                )
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
    );
  };

  const TrainingHistoryTable = ({ trainings }) => {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
        <div className="p-8">
          <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-inner bg-white">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-6 text-left border-r border-gray-300 w-1/8">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </span>
                      <span className="text-gray-400 text-lg">📅</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-left border-r border-gray-300 w-2/8">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Training Title
                      </span>
                      <span className="text-gray-400 text-lg">📋</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-left border-r border-gray-300 w-1/8">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Trainer
                      </span>
                      <span className="text-gray-400 text-lg">👤</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-left border-r border-gray-300 w-1/8">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Participants
                      </span>
                      <span className="text-gray-400 text-lg">👥</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-center border-r border-gray-300 w-1/8">
                    <div className="flex items-center justify-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Acceptance
                      </span>
                      <span className="text-gray-400 text-lg">✅</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-center border-r border-gray-300 w-1/8">
                    <div className="flex items-center justify-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Attendance
                      </span>
                      <span className="text-gray-400 text-lg">📊</span>
                    </div>
                  </th>
                  <th className="px-6 py-6 text-left w-1/8">
                    <div className="flex items-center gap-3 my-2">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        BRSR Category
                      </span>
                      <span className="text-gray-400 text-lg">🏷️</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 transition-all duration-500 group border-b border-gray-200"
                  >
                    <td className="px-6 py-6 border-r border-gray-200 whitespace-nowrap">
                      <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-3 py-2 rounded-lg border-gray-200 inline-block">
                        <div className="text-sm font-medium text-gray-800">
                          {new Date(training.fromDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-gray-200">
                      <div className="font-medium text-gray-900">
                        {training.trainingTitle}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-gray-200">
                      <div className="text-sm text-gray-700">
                        {training.trainingFacilitator}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-gray-200">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Invited:
                          </span>
                          <span className="text-sm font-medium">
                            {training.userId?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Attended:
                          </span>
                          <span className="text-sm font-medium">
                            {training.attendantUserId?.length || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-gray-200">
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: `${training.acceptanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {training.acceptanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-r border-gray-200">
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${training.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {training.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-start">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-medium shadow-sm border"
                          style={{
                            backgroundColor: `${
                              COLORS[index % COLORS.length]
                            }20`,
                            color: COLORS[index % COLORS.length],
                            borderColor: `${COLORS[index % COLORS.length]}40`,
                          }}
                        >
                          {training.principleNames}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CustomPieChart = ({ data, totalHours }) => {
    // Transform the data to match the expected format
    const pieData = data.map((item, index) => ({
      key: item.name,
      label: item.name,
      value: item.hours,
      percentage: totalHours > 0 ? (item.hours / totalHours) * 100 : 0,
      color: COLORS[index % COLORS.length],
      startAngle: 0, // Will be calculated by the visualizer
      endAngle: 0, // Will be calculated by the visualizer
    }));

    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Training Hours by Topic
          </h2>
          <div className="p-2 rounded-full bg-green-50">
            <span className="text-xl">⏰</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-3xl font-bold text-emerald-600">
            {totalHours}
            <span className="text-lg ml-1">hours</span>
          </div>
          <p className="text-sm text-gray-500">
            Total training hours delivered
          </p>
        </div>

        <PieChartVisualizer
          pieData={pieData}
          noDataToDisplay={data.length === 0}
          unit="hours"
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Summary Cards */}
        <StatsCards data={processedData.stats} />

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

        {activeTab === "trainings" && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-gray-800">
                  Training History
                </h4>
                {/* <div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPrinciple}
                    onChange={(e) => setSelectedPrinciple(e.target.value)}
                  >
                    <option value="All">All Principles</option>
                    {uniquePrinciples.map((principle) => (
                      <option key={principle} value={principle}>
                        {principle}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>

              <TrainingHistoryTable trainings={filteredTrainingHistory} />
            </div>
          </div>
        )}

        {/* {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-xl font-bold text-gray-800">
                      Training Hours by Topic
                    </h5>
                    <div className="p-2 rounded-full bg-green-50">
                      <span className="text-xl">⏰</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-emerald-600">
                      {processedData.stats.totalHours}
                      {}
                      <span className="text-lg ml-1"> hours</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Total training hours delivered
                    </p>
                  </div>

                  <CustomPieChart
                    data={processedData.topicData}
                    totalHours={processedData.stats.totalHours}
                  />
                </div>
              </div>
            </div>
          </div>
        )} */}

        {activeTab === "brsr" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BRSR Training Hours Radar */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                <div className="p-8" backgroundColor="white">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-xl font-bold text-gray-800">
                      BRSR Training Hours
                    </h5>
                  </div>
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={processedData.principleData}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Tooltip />
                        <Radar
                          name="Hours"
                          dataKey="hours"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* BRSR Principles Summary */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                <div className="p-8 my-3">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-xl font-bold text-gray-800">
                      BRSR Principles Summary
                    </h5>
                  </div>
                  <BRSRPrinciplesTable
                    principles={processedData.principleData}
                    totalHours={processedData.stats.totalHours}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerOverviewDashboard;
