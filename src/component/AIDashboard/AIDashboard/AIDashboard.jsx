import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { apiCall } from "../../../_services/apiCall";
import config from "../../../config/config.json";
import { Send, X, Minimize2, Maximize2, ThumbsUp, ThumbsDown } from 'lucide-react';
import PromptHistorySidebar from './PromptHistorySidebar';
import { ChartFactory, formatDataArray, formatNumber, formatSeries } from "./utils";
import { Container, Row, Col, Modal } from 'react-bootstrap';
import PublishCategoryModal from './PublishCategoryModal';

const styles = {
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderBottom: '1px solid #e5e7eb'
    },
    modalHeaderTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: 0
    },
    modalHeaderActions: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    },
    iconButton: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'white',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
    },
    mainContainer: {
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#1f2937',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    chatContainer: {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    messagesArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px 0'
    },
    messageWrapper: {
        marginBottom: '24px',
        display: 'flex',
        gap: '12px'
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px'
    },
    assistantMessageWrapper: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: '24px',
        gap: '12px'
    },
    messageContent: {
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
        marginTop: '4px'
    },
    userAvatar: {
        backgroundColor: '#3f88a5',
        color: 'white'
    },
    assistantAvatar: {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        border: '1px solid #e5e7eb'
    },
    messageBubble: {
        maxWidth: '600px',
        borderRadius: '18px',
        padding: '12px 16px',
        fontSize: '15px',
        lineHeight: '1.5'
    },
    userMessage: {
        backgroundColor: '#3f88a5',
        color: 'white'
    },
    assistantMessage: {
        backgroundColor: 'white',
        color: '#1f2937',
        border: '1px solid #e5e7eb'
    },
    timestamp: {
        fontSize: '11px',
        color: '#9ca3af',
        marginTop: '4px',
        paddingLeft: '4px'
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '12px',
        border: '1px solid #e5e7eb',
        width: '100%',
        maxWidth: '900px'
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #f3f4f6',
        gap: '10px'
    },
    chartTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937',
        margin: 0
    },
    saveButton: {
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#374151',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },
    feedbackButton: {
        backgroundColor: 'transparent',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },
    feedbackButtonActive: {
        backgroundColor: '#f3f4f6',
        borderColor: '#d1d5db'
    },
    likeButtonActive: {
        backgroundColor: '#dcfce7',
        borderColor: '#86efac',
        color: '#166534'
    },
    dislikeButtonActive: {
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
        color: '#991b1b'
    },
    remainingPromptText: {
        marginTop: '8px',
        fontSize: '14px',
        color: '#555',
    },
    inputSection: {
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '20px 0'
    },
    inputWrapper: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
    },
    textareaContainer: {
        flex: 1,
        position: 'relative'
    },
    textarea: {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '24px',
        padding: '12px 50px 12px 20px',
        fontSize: '15px',
        resize: 'none',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
        outline: 'none'
    },
    sendButton: {
        position: 'absolute',
        right: '8px',
        bottom: '8px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#3f88a5',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    sendButtonDisabled: {
        backgroundColor: '#d1d5db',
        cursor: 'not-allowed'
    },
    historyButton: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0
    },
    syncButton: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    examplesSection: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
    },
    examplesTitle: {
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '8px',
        fontWeight: 500
    },
    exampleButton: {
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#374151',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%',
        marginBottom: '8px'
    },
    loadingDots: {
        display: 'flex',
        gap: '4px',
        padding: '8px'
    },
    loadingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#6b7280'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
    },
    emptyStateIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    emptyStateTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '8px'
    },
    emptyStateText: {
        fontSize: '15px',
        color: '#6b7280'
    },
    scrollToBottom: {
        position: 'absolute',
        bottom: '140px',
        right: '40px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#3f88a5',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s',
        zIndex: 1000
    },
    loadMoreButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        color: '#374151',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        marginBottom: '20px',
        transition: 'all 0.2s'
    },
    modelContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f9fafb',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
    },
    modelButton: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    modelButtonActive: {
        backgroundColor: 'white',
        color: '#1f2937',
        fontWeight: 600,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    modelBadge: {
        fontSize: '12px',
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    freeBadge: {
        backgroundColor: '#e5e7eb',
        color: '#6b7280'
    },
    claudeBadge: {
        backgroundColor: '#ede9fe',
        color: '#6b21a8'
    },
    chatgptBadge: {
        backgroundColor: '#d1fae5',
        color: '#065f46'
    }
};

const ChatMessage = React.memo(({ msg, onRefresh, onSave, onFeedback, message }) => {
    return (
        <div style={msg.isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper}>
            <div style={styles.messageContent}>
                {(msg.text || message) && <div style={{
                    ...styles.messageBubble,
                    ...(msg.isUser ? styles.userMessage : styles.assistantMessage)
                }}>
                    {msg.text || message}
                </div>}

                {msg.chartData && (
                    <div style={styles.chartContainer}>
                        <div style={styles.chartHeader}>
                            <h3 style={styles.chartTitle}>{msg.chartData.title}</h3>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {/* Like Button */}
                                <button
                                    onClick={() => onFeedback(msg.id, 'like')}
                                    style={{
                                        ...styles.feedbackButton,
                                        ...(msg.feedback === 'like' ? styles.likeButtonActive : {})
                                    }}
                                    onMouseOver={(e) => {
                                        if (msg.feedback !== 'like') {
                                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                                            e.currentTarget.style.borderColor = '#bbf7d0';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (msg.feedback !== 'like') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }
                                    }}
                                    title="Like this graph"
                                >
                                    <ThumbsUp size={16} fill={msg.feedback === 'like' ? '#166534' : 'none'} />
                                </button>

                                {/* Dislike Button */}
                                <button
                                    onClick={() => onFeedback(msg.id, 'dislike')}
                                    style={{
                                        ...styles.feedbackButton,
                                        ...(msg.feedback === 'dislike' ? styles.dislikeButtonActive : {})
                                    }}
                                    onMouseOver={(e) => {
                                        if (msg.feedback !== 'dislike') {
                                            e.currentTarget.style.backgroundColor = '#fef2f2';
                                            e.currentTarget.style.borderColor = '#fecaca';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (msg.feedback !== 'dislike') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }
                                    }}
                                    title="Dislike this graph"
                                >
                                    <ThumbsDown size={16} fill={msg.feedback === 'dislike' ? '#991b1b' : 'none'} />
                                </button>

                                {/* Refresh Button */}
                                <button
                                    onClick={() => onRefresh(msg.id)}
                                    style={styles.saveButton}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                    title="Refresh graph"
                                >
                                    🔄
                                </button>

                                {/* Save/Publish Button */}
                                <button
                                    onClick={() => onSave(msg)}
                                    style={styles.saveButton}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                        e.target.style.borderColor = '#e5e7eb';
                                    }}
                                    title="Publish graph"
                                >
                                    📤
                                </button>
                            </div>
                        </div>
                        <ChartFactory
                            chartData={msg.chartData}
                            chartOptions={{ height: 400 }}
                        />
                    </div>
                )}

                <div style={styles.timestamp}>{msg.timestamp}</div>
            </div>
            {msg.isUser && (
                <div style={{ ...styles.avatar, ...styles.userAvatar }}>
                    👤
                </div>
            )}
        </div>
    );
});

const AIDashboard = ({ isOpen, onClose }) => {
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [synceLoading, setSynceLoading] = useState(false);
    const [error, setError] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [selectedGraphToPublish, setSelectedGraphToPublish] = useState(null);
    const [publishLoading, setPublishLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [promptHistory, setPromptHistory] = useState([]);
    const [availablePrompt, setAvailablePrompt] = useState([]);
    const [showHistorySidebar, setShowHistorySidebar] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [selectedModel, setSelectedModel] = useState('free');
    const [allHistoryData, setAllHistoryData] = useState([]);
    const chatEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const previousScrollHeightRef = useRef(0);
    const MESSAGES_PER_PAGE = 4;

    const sampleQueries = useMemo(() => [
        'Show me Fuel consumption KPI WISE for the financial year 2024-2025 for all quarters as a bar chart',
        "Display Grid Electricity consumption for financial year 2024-2025 as a line chart",
        "Create a pie chart showing renewable vs non-renewable energy distribution",
        "Show electricity consumption by location as a heatmap",
    ], []);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSaveGraph = useCallback((chartData) => {
        setSelectedGraphToPublish(chartData);
        setShowPublishModal(true);
    }, []);

    const handleFeedback = useCallback(async (graphId, feedbackType) => {
        try {
            // Update UI optimistically
            setChatHistory(prev =>
                prev.map(message =>
                    message.id === graphId
                        ? { 
                            ...message, 
                            feedback: message.feedback === feedbackType ? null : feedbackType 
                          }
                        : message
                )
            );

            // Make API call to save feedback
            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}graph/feedback`,
                {},
                { 
                    graphId: Number(graphId), 
                    feedback: feedbackType 
                },
                "POST"
            );

            if (!isSuccess) {
                // Revert on failure
                setChatHistory(prev =>
                    prev.map(message =>
                        message.id === graphId
                            ? { ...message, feedback: null }
                            : message
                    )
                );
                setError("Failed to save feedback");
            }
        } catch (error) {
            console.error("Error saving feedback:", error);
            setError("Error saving feedback. Please try again.");
        }
    }, []);

    const publishGraphData = useCallback(async (graphId, script, query, category) => {
        setPublishLoading(true);
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}publish/graph`,
                {},
                { graphId: Number(graphId), query, script, category: category || 'Energy' },
                "POST"
            );
            if (isSuccess) {
                setShowPublishModal(false);
                setSelectedGraphToPublish(null);
            } else {
                setError("Failed to publish graph");
            }
        } catch (error) {
            setError("Error publishing graph. Please try again.");
        } finally {
            setPublishLoading(false);
        }
    }, []);

    const handlePublishConfirm = useCallback((selectedCategory) => {
        if (selectedGraphToPublish) {
            publishGraphData(
                selectedGraphToPublish.id,
                selectedGraphToPublish.script,
                selectedGraphToPublish.query,
                selectedCategory
            );
        }
    }, [selectedGraphToPublish, publishGraphData]);

    const transformApiDataForChart = useCallback((apiData) => {
        const chartType = apiData.graphType?.toLowerCase() || 'bar';
        const baseColors = apiData.colors || [];

        let transformedData = {
            title: apiData.title || 'Energy Data',
            graphType: chartType,
            graphCategory: apiData.graphCategory || 'Environment',
            unit: apiData.unit || '',
            xAxisTitle: apiData.xAxisTitle || 'Categories',
            yAxisTitle: apiData.yAxisTitle || 'Values',
            colors: baseColors
        };

        switch (chartType) {
            case 'pie':
            case 'donut':
                transformedData = {
                    ...transformedData,
                    labels: apiData.labels || apiData.categories || [],
                    values: formatDataArray(apiData.values || (apiData.series && apiData.series[0] ? apiData.series[0].data : []) || []),
                    colors: baseColors.length > 0
                        ? baseColors
                        : (apiData.series && apiData.series[0] && apiData.series[0].colors
                            ? apiData.series[0].colors
                            : [])
                };
                break;

            case 'scatter':
                const scatterSeries = apiData.series || [{
                    name: apiData.title || 'Data Points',
                    data: apiData.scatterData ||
                        (apiData.categories ? apiData.categories.map((cat, idx) => [idx, apiData.series?.[0]?.data?.[idx] || 0]) : [])
                }];
                transformedData = {
                    ...transformedData,
                    series: scatterSeries.map((s, idx) => ({
                        ...s,
                        data: s.data.map(point => [formatNumber(point[0]), formatNumber(point[1])]),
                        color: s.color || (baseColors[idx] || baseColors[0])
                    }))
                };
                break;

            case 'heatmap':
                transformedData = {
                    ...transformedData,
                    series: formatSeries(apiData.series || [{
                        name: 'Data',
                        data: apiData.categories ? apiData.categories.map((cat, idx) => ({
                            x: cat,
                            y: formatNumber(apiData.series?.[0]?.data?.[idx] || 0)
                        })) : []
                    }], baseColors)
                };
                break;

            case 'radar':
                transformedData = {
                    ...transformedData,
                    categories: apiData.categories || [],
                    series: formatSeries(apiData.series || [{
                        name: apiData.title || 'Data',
                        data: apiData.series?.[0]?.data || []
                    }], baseColors)
                };
                break;

            case 'boxplot':
                const boxplotSeries = apiData.series || [{
                    name: apiData.title || 'Data',
                    type: 'boxPlot',
                    data: apiData.boxPlotData ||
                        (apiData.series?.[0]?.data || []).map((val, idx) => ({
                            x: apiData.categories?.[idx] || `Category ${idx}`,
                            y: [
                                formatNumber(Math.max(0, val - val * 0.2)),
                                formatNumber(val - val * 0.1),
                                formatNumber(val),
                                formatNumber(val + val * 0.1),
                                formatNumber(val + val * 0.2)
                            ]
                        }))
                }];
                transformedData = {
                    ...transformedData,
                    categories: apiData.categories || [],
                    series: boxplotSeries.map((s, idx) => ({
                        ...s,
                        color: s.color || (baseColors[idx] || baseColors[0])
                    }))
                };
                break;

            case 'mixed':
                transformedData = {
                    ...transformedData,
                    categories: apiData.categories || [],
                    primaryYAxisTitle: apiData.primaryYAxisTitle || 'Primary Values',
                    secondaryYAxisTitle: apiData.secondaryYAxisTitle || 'Secondary Values',
                    series: formatSeries(apiData.series || [
                        {
                            name: 'Line Series',
                            type: 'line',
                            data: apiData.lineData || (apiData.series?.[0]?.data || [])
                        },
                        {
                            name: 'Area Series',
                            type: 'area',
                            data: apiData.areaData || (apiData.series?.[0]?.data || []).map(val => formatNumber(val * 0.8))
                        },
                        {
                            name: 'Column Series',
                            type: 'column',
                            yAxisIndex: 1,
                            data: apiData.barData || (apiData.series?.[0]?.data || []).map(val => formatNumber(val * 1.2))
                        }
                    ], baseColors)
                };
                break;

            default:
                transformedData = {
                    ...transformedData,
                    categories: apiData.categories || [],
                    series: formatSeries(apiData.series || [{
                        name: apiData.title || 'Data',
                        data: []
                    }], baseColors)
                };
                break;
        }

        return transformedData;
    }, []);

    const graphHistoryData = useCallback(async (page = 0, isLoadingMore = false) => {
        if (isLoadingMore) {
            setLoadingMore(true);
        } else {
            setHistoryLoading(true);
        }

        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}graphHistoryData`,
                {},
                {},
                "GET"
            );

            if (isSuccess && data.data && Array.isArray(data.data)) {
                const reverseData = data.data.reverse();
                setAllHistoryData(reverseData);

                const totalMessages = reverseData.length * 2;
                const totalPages = Math.ceil(totalMessages / MESSAGES_PER_PAGE);

                if (!isLoadingMore) {
                    const startIndex = Math.max(0, reverseData.length - 2);
                    const initialData = reverseData.slice(startIndex);

                    const processedHistory = initialData.map(item => {
                        let chartData = null;

                        if (item.response) {
                            try {
                                const parsedResponse = JSON.parse(item.response);
                                chartData = transformApiDataForChart(parsedResponse);
                            } catch (e) {
                                console.error("Error parsing response:", e);
                            }
                        }

                        return {
                            userMessage: {
                                id: item.id,
                                text: item.query,
                                script: item.script,
                                query: item.query,
                                isUser: true,
                                timestamp: new Date(item.createdAt)?.toLocaleTimeString()
                            },
                            aiMessage: {
                                text: chartData ? "" : "Unable to load visualization.",
                                isUser: false,
                                id: item.id,
                                script: item.script,
                                query: item.query,
                                timestamp: new Date(item.createdAt)?.toLocaleTimeString(),
                                chartData: chartData,
                                feedback: item.feedback || null
                            }
                        };
                    });

                    const flattenedHistory = processedHistory.flatMap(item => [
                        item.userMessage,
                        item.aiMessage
                    ]);

                    setChatHistory(flattenedHistory);
                    setHasMore(reverseData.length > 2);

                    const promptHistoryData = reverseData.map(item => ({
                        prompt: item.query,
                        timestamp: new Date(item.createdAt)?.toLocaleString(),
                        chartType: item.response ? JSON.parse(item.response).graphType : null,
                        id: item.id
                    }));
                    setPromptHistory(promptHistoryData);
                }
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setHistoryLoading(false);
            setLoadingMore(false);
        }
    }, [transformApiDataForChart, MESSAGES_PER_PAGE]);

    const availableProviders = useCallback(async () => {
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}availableProviders`,
                {},
                {},
                "GET"
            );

            if (isSuccess && data.data) {
                setAvailablePrompt(data.data)
                setSelectedModel(data?.data?.defaultProvider)
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    }, []);

    const getRefreshGraphs = useCallback(async (graphId) => {
        setError("");
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}refreshGraph`,
                {},
                { graphId: Number(graphId) },
                "POST"
            );

            if (isSuccess && data.data) {
                const refreshedItem = data.data;

                if (refreshedItem) {
                    let chartData = null;

                    try {
                        chartData = transformApiDataForChart(refreshedItem);
                    } catch (e) {
                        console.error("Error parsing refreshed graph data:", e);
                        setError("Failed to process refreshed graph data");
                        return;
                    }

                    setChatHistory(prev =>
                        prev.map(message =>
                            message.id == graphId
                                ? { ...message, chartData: chartData }
                                : message
                        )
                    );
                } else {
                    setError("Refreshed graph data is invalid");
                }
            } else {
                setError("Failed to refresh graph");
            }
        } catch (error) {
            console.error("Error refreshing graph:", error);
            setError("An error occurred while refreshing the graph");
        } finally {
            setLoading(false);
        }
    }, [transformApiDataForChart]);

    const synceGraphData = useCallback(async () => {
        setSynceLoading(true);
        setError("");

        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}synce/graph`,
                {},
                {},
                "POST"
            );

            if (isSuccess) {
                console.log("Sync successful", data);
                setCurrentPage(0);
                setHasMore(true);
                graphHistoryData(0, false);
            } else {
                setError("Failed to sync graph data");
            }
        } catch (error) {
            console.error("Error syncing data:", error);
            setError("Error syncing data. Please try again.");
        } finally {
            setSynceLoading(false);
        }
    }, [graphHistoryData]);

    const generateGraphData = useCallback(async () => {
        if (userInput) {
            setLoading(true);
            setError("");

            try {
                const { isSuccess, data, message } = await apiCall(
                    `${config.POSTLOGIN_API_URL_COMPANY}genrateGraphData`,
                    {},
                    { userInput, model: selectedModel },
                    "GET"
                );
                setMessage(message)
                if (isSuccess) {
                    setUserInput('')
                    availableProviders()
                    const transformedData = data.data;

                    let chartData = null;

                    if (transformedData.response) {
                        try {
                            const parsedResponse = JSON.parse(transformedData.response);
                            chartData = transformApiDataForChart(parsedResponse);
                        } catch (e) {
                            console.error("Error parsing response:", e);
                        }
                    }

                    const processedHistory = {
                        userMessage: {
                            id: transformedData.id,
                            text: transformedData.query,
                            script: transformedData.script,
                            query: transformedData.query,
                            isUser: true,
                            timestamp: new Date(transformedData.createdAt).toLocaleTimeString()
                        },
                        aiMessage: {
                            text: chartData
                                ? ""
                                : "Unable to load visualization.",
                            isUser: false,
                            id: transformedData.id,
                            script: transformedData.script,
                            query: transformedData.query,
                            timestamp: new Date(transformedData.createdAt).toLocaleTimeString(),
                            chartData: chartData,
                            feedback: null
                        }
                    };

                    setChatHistory(prev => [...prev, processedHistory.userMessage, processedHistory.aiMessage]);
                } else {
                    setChatHistory(prev => [...prev, {
                        text: message,
                        isUser: false,
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                }
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setChatHistory(prev => [...prev, {
                    text: message,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } finally {
                setLoading(false);
            }
        }
    }, [userInput, selectedModel, transformApiDataForChart, availableProviders]);

    const handleSubmit = useCallback(() => {
        if (userInput.trim()) {
            generateGraphData();
        } else {
            setError("Please enter a query");
        }
    }, [userInput, generateGraphData]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const handleSelectPrompt = useCallback((item) => {
        setUserInput(item.prompt);
        setShowHistorySidebar(false);
    }, []);

    const handleInputChange = useCallback((e) => {
        setUserInput(e.target.value);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore && allHistoryData.length > 0) {
            setLoadingMore(true);

            if (messagesAreaRef.current) {
                previousScrollHeightRef.current = messagesAreaRef.current.scrollHeight;
            }

            const currentDisplayedGraphs = chatHistory.length / 2;
            const startIndex = Math.max(0, allHistoryData.length - currentDisplayedGraphs - 2);
            const endIndex = allHistoryData.length - currentDisplayedGraphs;
            const moreData = allHistoryData.slice(startIndex, endIndex);

            if (moreData.length > 0) {
                const processedHistory = moreData.map(item => {
                    let chartData = null;

                    if (item.response) {
                        try {
                            const parsedResponse = JSON.parse(item.response);
                            chartData = transformApiDataForChart(parsedResponse);
                        } catch (e) {
                            console.error("Error parsing response:", e);
                        }
                    }

                    return {
                        userMessage: {
                            id: item.id,
                            text: item.query,
                            script: item.script,
                            query: item.query,
                            isUser: true,
                            timestamp: new Date(item.createdAt).toLocaleTimeString()
                        },
                        aiMessage: {
                            text: chartData ? "" : "Unable to load visualization.",
                            isUser: false,
                            id: item.id,
                            script: item.script,
                            query: item.query,
                            timestamp: new Date(item.createdAt).toLocaleTimeString(),
                            chartData: chartData,
                            feedback: item.feedback || null
                        }
                    };
                });

                const flattenedHistory = processedHistory.flatMap(item => [
                    item.userMessage,
                    item.aiMessage
                ]);

                setChatHistory(prev => [...flattenedHistory, ...prev]);

                const totalDisplayedAfterLoad = currentDisplayedGraphs + moreData.length;
                setHasMore(totalDisplayedAfterLoad < allHistoryData.length);

                setTimeout(() => {
                    if (messagesAreaRef.current) {
                        const newScrollHeight = messagesAreaRef.current.scrollHeight;
                        const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
                        messagesAreaRef.current.scrollTop = scrollDiff;
                    }
                    setLoadingMore(false);
                }, 100);
            } else {
                setHasMore(false);
                setLoadingMore(false);
            }
        }
    }, [chatHistory, allHistoryData, hasMore, loadingMore, transformApiDataForChart]);

    const handleScrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleScroll = useCallback(() => {
        if (messagesAreaRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;

            const isScrolledUp = scrollHeight - scrollTop - clientHeight > 200;
            setShowScrollToBottom(isScrolledUp);

            if (scrollTop < 100 && hasMore && !loadingMore) {
                handleLoadMore();
            }
        }
    }, [hasMore, loadingMore, handleLoadMore]);

    useEffect(() => {
        const messagesArea = messagesAreaRef.current;
        if (messagesArea) {
            messagesArea.addEventListener('scroll', handleScroll);
            return () => messagesArea.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
            setHasMore(true);
            setChatHistory([]);
            setAllHistoryData([]);
            graphHistoryData(0, false);
            availableProviders();
            setTimeout(() => {
                scrollToBottom();
            }, 300);
        }
    }, [isOpen, graphHistoryData, scrollToBottom, availableProviders]);

    const mainContainerHeight = useMemo(() =>
        isMinimized ? '0' : '75vh',
        [isMinimized]);

    const getModelBadgeStyles = useMemo(() => {
        switch (selectedModel) {
            case 'claude':
                return styles.claudeBadge;
            case 'chatgpt':
                return styles.chatgptBadge;
            default:
                return styles.freeBadge;
        }
    }, [selectedModel]);

    return (
        <>
            <Modal
                show={isOpen}
                onHide={() => {
                    if (!isMinimized) {
                        onClose();
                        setIsMinimized(false);
                    }
                }}
                size={isMinimized ? "sm" : "xl"}
                fullscreen={isFullscreen}
                centered
                backdrop={isMinimized ? false : true}
            >
                <div style={styles.modalHeader}>
                    <h3 style={styles.modalHeaderTitle}>
                        AI Analytics
                    </h3>
                    <div style={styles.modalHeaderActions}>
                        <button
                            style={styles.iconButton}
                            onClick={() => setIsMinimized(!isMinimized)}
                            title={isMinimized ? "Maximize" : "Minimize"}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            {isMinimized ? <Maximize2 size={18} color="#6b7280" /> : <Minimize2 size={18} color="#6b7280" />}
                        </button>
                        <button
                            style={styles.iconButton}
                            onClick={() => {
                                onClose();
                                setIsMinimized(false);
                            }}
                            title="Close"
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#fee2e2';
                                e.currentTarget.style.borderColor = '#fecaca';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <X size={18} color="#6b7280" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <Modal.Body style={{ padding: 0 }}>
                        <div style={{ ...styles.mainContainer, height: mainContainerHeight }}>
                            <PromptHistorySidebar
                                history={promptHistory}
                                isOpen={showHistorySidebar}
                                onClose={() => setShowHistorySidebar(false)}
                                onSelectPrompt={handleSelectPrompt}
                            />

                            <div style={styles.header}>
                                <Container>
                                    <div style={styles.headerContent}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <h1 style={styles.headerTitle}>
                                                <span>⚡</span>
                                                AI Analytics
                                            </h1>
                                            <div style={{
                                                ...styles.modelBadge,
                                                ...getModelBadgeStyles
                                            }}>
                                                {availablePrompt?.promptLimit?.remaining !== undefined && (
                                                    <h3 style={styles.remainingPromptText}>
                                                        Remaining Paid Prompts: {availablePrompt.promptLimit.remaining}
                                                    </h3>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={styles.modelContainer}>
                                                {availablePrompt?.providers?.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setSelectedModel(item.id)}
                                                        style={{
                                                            ...styles.modelButton,
                                                            ...(selectedModel === item.id ? styles.modelButtonActive : {}),
                                                        }}
                                                        onMouseOver={(e) => {
                                                            if (selectedModel !== item.id) {
                                                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                            }
                                                        }}
                                                        onMouseOut={(e) => {
                                                            if (selectedModel !== item.id) {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                            }
                                                        }}
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={synceGraphData}
                                                style={styles.syncButton}
                                                disabled={synceLoading}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                                            >
                                                {synceLoading ? 'Syncing...' : 'Sync Data'}
                                            </button>
                                        </div>
                                    </div>
                                </Container>
                            </div>

                            <Container style={styles.chatContainer}>
                                <div style={styles.messagesArea} ref={messagesAreaRef}>
                                    {historyLoading ? (
                                        <div style={{ ...styles.emptyState, padding: '40px 20px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                border: '3px solid #e5e7eb',
                                                borderTop: '3px solid #3f88a5',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                margin: '0 auto 16px'
                                            }} />
                                            <div style={styles.emptyStateText}>Loading history...</div>
                                        </div>
                                    ) : chatHistory.length === 0 ? (
                                        <div style={styles.emptyState}>
                                            <div style={styles.emptyStateIcon}>💬</div>
                                            <div style={styles.emptyStateTitle}>Start a conversation</div>
                                            <div style={styles.emptyStateText}>
                                                Ask me anything about your data and I'll help you visualize it
                                            </div>
                                        </div>
                                    ) : (
                                        <Row>
                                            <Col lg={11} xl={10} className="mx-auto">
                                                {loadingMore && (
                                                    <div style={{
                                                        ...styles.loadMoreButton,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        opacity: 0.7,
                                                        cursor: 'not-allowed'
                                                    }}>
                                                        <div style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            border: '2px solid #e5e7eb',
                                                            borderTop: '2px solid #3f88a5',
                                                            borderRadius: '50%',
                                                            animation: 'spin 1s linear infinite'
                                                        }} />
                                                        <span>Loading more graphs...</span>
                                                    </div>
                                                )}

                                                {chatHistory.map((msg, idx) => (
                                                    <ChatMessage
                                                        key={`${msg.id}-${idx}`}
                                                        msg={msg}
                                                        onRefresh={getRefreshGraphs}
                                                        onSave={handleSaveGraph}
                                                        onFeedback={handleFeedback}
                                                        message={message}
                                                    />
                                                ))}

                                                {loading && (
                                                    <div style={{ ...styles.messageWrapper, ...styles.assistantMessageWrapper }}>
                                                        <div style={{ ...styles.avatar, ...styles.assistantAvatar }}>
                                                            ⚡
                                                        </div>
                                                        <div >
                                                            {userInput}
                                                        </div>
                                                        <div style={{ ...styles.messageBubble, ...styles.assistantMessage }}>
                                                            <div style={styles.loadingDots}>
                                                                <div style={{ ...styles.loadingDot, animation: 'bounce 1.4s infinite ease-in-out 0s' }} />
                                                                <div style={{ ...styles.loadingDot, animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                                                                <div style={{ ...styles.loadingDot, animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={chatEndRef} />
                                            </Col>
                                        </Row>
                                    )}
                                </div>

                                {showScrollToBottom && (
                                    <button
                                        onClick={handleScrollToBottom}
                                        style={styles.scrollToBottom}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'scale(1.1)';
                                            e.target.style.backgroundColor = '#2c6b7f';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.backgroundColor = '#3f88a5';
                                        }}
                                        title="Scroll to latest message"
                                    >
                                        <span style={{ fontSize: '24px' }}>↓</span>
                                    </button>
                                )}

                                <div style={styles.inputSection}>
                                    <Row>
                                        <Col lg={11} xl={10} className="mx-auto">
                                            <div style={styles.inputWrapper}>
                                                <div style={styles.textareaContainer}>
                                                    <textarea
                                                        value={userInput}
                                                        onChange={handleInputChange}
                                                        onKeyPress={handleKeyPress}
                                                        placeholder="Ask about your data..."
                                                        style={styles.textarea}
                                                        rows={1}
                                                        disabled={loading}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = '#3f88a5';
                                                            e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = '#d1d5db';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={loading || !userInput.trim()}
                                                        style={{
                                                            ...styles.sendButton,
                                                            ...(loading || !userInput.trim() ? styles.sendButtonDisabled : {})
                                                        }}
                                                        onMouseOver={(e) => {
                                                            if (!loading && userInput.trim()) {
                                                                e.target.style.backgroundColor = '#2c6b7f';
                                                            }
                                                        }}
                                                        onMouseOut={(e) => {
                                                            if (!loading && userInput.trim()) {
                                                                e.target.style.backgroundColor = '#3f88a5';
                                                            }
                                                        }}
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {chatHistory.length === 0 && (
                                                <div style={styles.examplesSection}>
                                                    <div style={styles.examplesTitle}>Try asking:</div>
                                                    <Row>
                                                        {sampleQueries.map((query, index) => (
                                                            <Col md={6} key={index}>
                                                                <button
                                                                    onClick={() => setUserInput(query)}
                                                                    style={styles.exampleButton}
                                                                    disabled={loading}
                                                                    onMouseOver={(e) => {
                                                                        e.target.style.backgroundColor = '#f3f4f6';
                                                                        e.target.style.borderColor = '#d1d5db';
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.target.style.backgroundColor = '#f9fafb';
                                                                        e.target.style.borderColor = '#e5e7eb';
                                                                    }}
                                                                >
                                                                    {query}
                                                                </button>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            )}

                                            {error && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px 16px',
                                                    backgroundColor: '#fef2f2',
                                                    border: '1px solid #fecaca',
                                                    borderRadius: '12px',
                                                    color: '#991b1b',
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <span>⚠️</span>
                                                    <span>{error}</span>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        </div>
                    </Modal.Body>
                )}

                <style>{`
                    @keyframes bounce {
                        0%, 80%, 100% { 
                            transform: scale(0);
                            opacity: 0.5;
                        } 
                        40% { 
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    textarea::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    textarea::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    textarea::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 3px;
                    }
                    
                    textarea::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                `}</style>

                <PublishCategoryModal
                    show={showPublishModal}
                    onHide={() => {
                        if (!publishLoading) {
                            setShowPublishModal(false);
                            setSelectedGraphToPublish(null);
                        }
                    }}
                    onConfirm={handlePublishConfirm}
                    initialCategory={selectedGraphToPublish?.chartData?.graphCategory || 'Energy'}
                    loading={publishLoading}
                />
            </Modal>
        </>
    );
};

export default AIDashboard;