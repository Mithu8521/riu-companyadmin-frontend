import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { ChartFactory, formatDataArray, formatNumber, formatSeries } from "./AIDashboard/utils";
import AIDashboard from "./AIDashboard/AIDashboard";

const AIGraph = ({ tabName }) => {
    const [publishedGraphs, setPublishedGraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, graphId: null, graphQuery: "" });
    const [deleting, setDeleting] = useState(null);
    const [showAIDashboard, setShowAIDashboard] = useState(false);

    useEffect(() => {
        getPublishedGraphs();
    }, []);
    useEffect(() => {
        if (!showAIDashboard) {
            getPublishedGraphs();
        }
    }, [showAIDashboard]);

    const transformApiDataForChart = (apiData) => {
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
                        // Add color to each series if available
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
                // For bar, line, area, column charts
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
    };

    const getPublishedGraphs = async () => {
        setLoading(true);
        setError("");
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}publishGraph`,
                {},
                { category: tabName },
                "GET"
            );

            if (isSuccess && data.data && Array.isArray(data.data)) {
                const processedGraphs = data.data
                    .filter(item => item.output && item.status === 1)
                    .map(item => {
                        let chartData = null;

                        try {
                            chartData = transformApiDataForChart(item.output);
                        } catch (e) {
                            console.error("Error parsing graph data:", e);
                        }

                        return {
                            id: item.id,
                            graphId: item.graphId,
                            query: item.query,
                            chartData: chartData,
                            createdAt: new Date(item.createdAt).toLocaleString(),
                            updatedAt: new Date(item.updatedAt).toLocaleString()
                        };
                    })
                    .filter(item => item.chartData !== null);

                setPublishedGraphs(processedGraphs);
            } else {
                setError("Failed to load published graphs");
            }
        } catch (error) {
            console.error("Error fetching published graphs:", error);
            setError("An error occurred while loading graphs");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (graphId, graphQuery) => {
        setDeleteConfirm({ show: true, graphId, graphQuery });
    };

    const getRefreshGraphs = async (graphId) => {
        setError("");
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}refreshGraph`,
                {},
                { graphId },
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

                    setPublishedGraphs(prev =>
                        prev.map(graph =>
                            graph.id === graphId
                                ? { ...graph, chartData: chartData }
                                : graph
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
    };

    const handleDeleteConfirm = async () => {
        const graphId = deleteConfirm.graphId;
        setDeleting(graphId);

        try {
            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}publishGraph`,
                {},
                { graphId },
                "DELETE"
            );

            if (isSuccess) {
                setPublishedGraphs(prev => prev.filter(graph => graph.id !== graphId));
                setDeleteConfirm({ show: false, graphId: null, graphQuery: "" });
            } else {
                setError("Failed to delete graph");
            }
        } catch (error) {
            console.error("Error deleting graph:", error);
            setError("An error occurred while deleting the graph");
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, graphId: null, graphQuery: "" });
    };

    const styles = {
        container: {
            minHeight: '100vh',
            padding: '40px 20px'
        },
        contentWrapper: {
            maxWidth: '1400px',
            margin: '0 auto'
        },
        loadingContainer: {
            textAlign: 'center',
            padding: '100px 20px'
        },
        spinner: {
            width: '60px',
            height: '60px',
            border: '6px solid rgba(255, 255, 255, 0.3)',
            borderTop: '6px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
        },
        loadingText: {
            color: 'white',
            fontSize: '18px',
            fontWeight: '500'
        },
        emptyContainer: {
            textAlign: 'center',
            padding: '100px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        emptyIcon: {
            fontSize: '80px',
            marginBottom: '20px',
            opacity: '0.6'
        },
        emptyTitle: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '12px'
        },
        emptyText: {
            fontSize: '16px',
            color: '#718096',
            lineHeight: '1.6'
        },
        graphsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(900px, 1fr))',
            gap: '30px',
            animation: 'fadeIn 0.6s ease-out'
        },
        graphCard: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
        },
        cardAccent: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #3f88a5 0%, #2a5f75 100%)'
        },
        graphHeader: {
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e2e8f0'
        },
        graphHeaderTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px'
        },
        graphQuery: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#2d3748',
            lineHeight: '1.5',
            flex: 1,
            marginRight: '16px'
        },
        deleteButton: {
            background: 'white',
            color: 'white',
            border: 'none',
            // padding: '8px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        },
        refreshButtonSmall: {
            background: 'white',
            color: 'white',
            border: 'none',
            // padding: '8px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: loading ? 0.7 : 1
        },
        graphMeta: {
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#718096',
            background: '#f7fafc',
            padding: '6px 14px',
            borderRadius: '8px',
            fontWeight: '500'
        },
        metaIcon: {
            fontSize: '16px'
        },
        errorContainer: {
            background: 'rgba(254, 226, 226, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #fc8181',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)',
            animation: 'shake 0.5s ease-in-out'
        },
        errorIcon: {
            fontSize: '24px'
        },
        errorText: {
            color: '#991b1b',
            fontSize: '16px',
            fontWeight: '500',
            flex: 1
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out'
        },
        modal: {
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            animation: 'scaleIn 0.3s ease-out'
        },
        modalHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
        },
        modalIcon: {
            fontSize: '32px',
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d3748',
            margin: 0
        },
        modalContent: {
            fontSize: '16px',
            color: '#4a5568',
            lineHeight: '1.6',
            marginBottom: '24px'
        },
        modalQuery: {
            background: '#f7fafc',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '15px',
            color: '#2d3748',
            fontWeight: '500',
            marginTop: '12px',
            fontStyle: 'italic'
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
        },
        modalButton: {
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none'
        },
        cancelButton: {
            background: '#e2e8f0',
            color: '#4a5568'
        },
        confirmButton: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        },
        floatingButton: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3f88a5 0%, #3f88a5 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 999
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                {error && (
                    <div style={styles.errorContainer}>
                        <span style={styles.errorIcon}>⚠</span>
                        <span style={styles.errorText}>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner} />
                        <div style={styles.loadingText}>Loading your analytics...</div>
                    </div>
                ) : publishedGraphs.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <div style={styles.emptyIcon}>📊</div>
                        <div style={styles.emptyTitle}>No Published Graphs Yet</div>
                        <div style={styles.emptyText}>
                            Your published analytics will appear here.<br />
                            Start by creating and publishing your first visualization.
                        </div>
                    </div>
                ) : (
                    <div style={styles.graphsGrid}>
                        {publishedGraphs.map((graph, index) => (
                            <div
                                key={graph.id}
                                style={{
                                    ...styles.graphCard,
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                    opacity: deleting === graph.id ? 0.5 : 1,
                                    pointerEvents: deleting === graph.id ? 'none' : 'auto'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                <div style={styles.cardAccent} />

                                <div style={styles.graphHeader}>
                                    <div style={styles.graphHeaderTop}>
                                        <div style={styles.graphQuery}>{graph.query}</div>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                style={styles.refreshButtonSmall}
                                                onClick={() => getRefreshGraphs(graph.graphId)}
                                                disabled={loading}
                                                onMouseOver={(e) => {
                                                    if (!loading) {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(63, 136, 165, 0.4)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!loading) {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(63, 136, 165, 0.3)';
                                                    }
                                                }}
                                            >
                                                🔄
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteClick(graph.id, graph.query)}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div style={styles.graphMeta}>
                                        <div style={styles.metaItem}>
                                            <span style={styles.metaIcon}>🕒</span>
                                            <span>Created: {graph.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                {graph.chartData && (
                                    <ChartFactory
                                        chartData={graph.chartData}
                                        chartOptions={{ height: 450 }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => setShowAIDashboard(true)}
                style={styles.floatingButton}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px #3f88a5';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px #3f88a5';
                }}
                title="AI Lens"
            >
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={48} />
                    <span
                        style={{
                            position: 'absolute',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        AI
                    </span>
                </div>
            </button>


            {showAIDashboard && (
                <AIDashboard
                    isOpen={showAIDashboard}
                    onClose={() => setShowAIDashboard(false)}
                />
            )}

            {deleteConfirm.show && (
                <div style={styles.modalOverlay} onClick={handleDeleteCancel}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalIcon}>⚠️</div>
                            <h2 style={styles.modalTitle}>Confirm Deletion</h2>
                        </div>
                        <div style={styles.modalContent}>
                            Are you sure you want to delete this graph? This action cannot be undone.
                            <div style={styles.modalQuery}>"{deleteConfirm.graphQuery}"</div>
                        </div>
                        <div style={styles.modalActions}>
                            <button
                                style={{ ...styles.modalButton, ...styles.cancelButton }}
                                onClick={handleDeleteCancel}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#cbd5e0';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#e2e8f0';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.modalButton, ...styles.confirmButton }}
                                onClick={handleDeleteConfirm}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }}
                            >
                                Delete Graph
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                * {
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
};

export default AIGraph;