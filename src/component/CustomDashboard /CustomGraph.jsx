import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, GripVertical } from "lucide-react";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import { ChartFactory, formatDataArray, formatNumber, formatSeries } from "../AIDashboard/AIDashboard/utils";
import BiDashboard from "./CustomDashboard";

const CustomGraph = ({ tabName }) => {
    const [biGraphs, setBiGraphs] = useState([]);
    const [originalGraphs, setOriginalGraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, graphId: null, graphQuery: "", type: "" });
    const [deleting, setDeleting] = useState(null);
    const [showBiDashboard, setShowBiDashboard] = useState(false);
    const [editingGraph, setEditingGraph] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const autoScrollIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        getAllGraphs();
    }, [tabName]);

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target);
    };

    const handleDragOver = (index) => {
        if (draggedItem === null) return;
        setDragOverItem(index);
    };

    const startAutoScroll = (mouseY) => {
        // Clear existing interval
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }

        const scrollZone = 100;
        const scrollSpeed = 10;
        const viewportHeight = window.innerHeight;

        // Scroll up
        if (mouseY < scrollZone) {
            autoScrollIntervalRef.current = setInterval(() => {
                window.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
            }, 16);
        }
        // Scroll down
        else if (mouseY > viewportHeight - scrollZone) {
            autoScrollIntervalRef.current = setInterval(() => {
                window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
            }, 16);
        }
    };

    const stopAutoScroll = () => {
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }
    };

    const handleDragOverWithScroll = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        
        handleDragOver(index);
        startAutoScroll(e.clientY);
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        
        stopAutoScroll();

        if (draggedItem === null || draggedItem === index) {
            setDraggedItem(null);
            setDragOverItem(null);
            return;
        }

        const newGraphs = [...biGraphs];
        const draggedGraph = newGraphs[draggedItem];

        newGraphs.splice(draggedItem, 1);
        const insertIndex = draggedItem < index ? index - 1 : index;
        newGraphs.splice(insertIndex, 0, draggedGraph);

        setBiGraphs(newGraphs);
        setIsDirty(true);
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragEnd = () => {
        stopAutoScroll();
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragLeave = (e, index) => {
        // Only clear if we're actually leaving the card area
        const rect = e.currentTarget.getBoundingClientRect();
        const isOutside = (
            e.clientY < rect.top ||
            e.clientY >= rect.bottom ||
            e.clientX < rect.left ||
            e.clientX >= rect.right
        );

        if (isOutside && dragOverItem === index) {
            setDragOverItem(null);
        }
    };

    // ... rest of your existing functions (getAllGraphs, getBiGraphs, etc.) ...
    const getAllGraphs = () => {
        getBiGraphs();
    };

    const getBiGraphs = async () => {
        try {
            const { isSuccess, data } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graphs`,
                {},
                { category: tabName?.replace(/\s*&\s*/g, '&') },
                "GET"
            );

            if (isSuccess && data.data && Array.isArray(data.data)) {
                const graphsWithData = await Promise.all(
                    data.data.map(async (graph) => {
                        try {
                            const { isSuccess: dataSuccess, data: {data: graphData} } = await apiCall(
                                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graph.id}/data`,
                                {},
                                { dashboardId: graph.id },
                                "GET"
                            );
                            let chartData = null;
                            if (dataSuccess && graphData.data) {
                                chartData = {
                                    data: graphData, 
                                    chartType: graph.chartType, 
                                    xAxisField: graph.xAxisField, 
                                    stackByField: graph.stackByField, 
                                    title: graph.title
                                }
                            }

                            return {
                                ...graph,
                                id: graph.id,
                                graphId: graph.id,
                                query: graph.title,
                                description: graph.description,
                                chartData: chartData,
                                type: 'bi',
                                createdAt: new Date(graph.createdAt).toLocaleString(),
                                updatedAt: new Date(graph.updatedAt).toLocaleString(),
                                xAxisField: graph.xAxisField,
                                stackByField: graph.stackByField,
                                chartType: graph.chartType,
                                widgetConfig: graph.widgetConfig
                            };
                        } catch (error) {
                            console.error(`Error fetching data for BI graph ${graph.id}:`, error);
                            return {
                                ...graph,
                                id: graph?.id,
                                graphId: graph?.id,
                                query: graph?.title,
                                description: graph?.description,
                                chartData: { 
                                    chartType: graph?.chartType, 
                                    xAxisField: graph?.xAxisField, 
                                    stackByField: graph?.stackByField, 
                                    title: graph?.title
                                },
                                type: 'bi',
                                createdAt: new Date(graph?.createdAt).toLocaleString(),
                                updatedAt: new Date(graph?.updatedAt).toLocaleString(),
                                xAxisField: graph?.xAxisField,
                                stackByField: graph?.stackByField,
                                chartType: graph?.chartType,
                                widgetConfig: graph?.widgetConfig
                            };
                        }
                    })
                );

                const filteredGraphs = graphsWithData.filter(g => g !== null);
                setBiGraphs(filteredGraphs);
                setOriginalGraphs(JSON.parse(JSON.stringify(filteredGraphs)));
                setIsDirty(false);
            }
        } catch (error) {
            console.error("Error fetching BI graphs:", error);
        }
    };

    const handleDeleteClick = (graphId, graphQuery, type) => {
        setDeleteConfirm({ show: true, graphId, graphQuery, type });
    };

    const handleEditClick = (graph) => {
        setEditingGraph(graph);
        setShowBiDashboard(true);
    };

    const getRefreshBIGraph = async (graphId) => {
        setError("");
        try {
            const { isSuccess: dataSuccess, data: {data: graphData} } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graphId}/sync`,
                {},
                {},
                "POST"
            );

            if (dataSuccess && graphData.data) {
                const graph = biGraphs.find(graph => graph.id === graphId);
                const chartData = {
                    data: graphData, 
                    chartType: graph.chartType,
                    xAxisField: graph.xAxisField, 
                    stackByField: graph.stackByField, 
                    title: graph.title,
                };
                
                setBiGraphs(prev =>
                    prev.map(g =>
                        g.id === graphId
                            ? { ...g, chartData: chartData }
                            : g
                    )
                );
            } else {
                setError("Failed to refresh BI graph");
            }
        } catch (error) {
            console.error("Error refreshing BI graph:", error);
            setError("An error occurred while refreshing the BI graph");
        }
    };

    const handleDeleteConfirm = async () => {
        const { graphId } = deleteConfirm;
        setDeleting(graphId);

        try {
            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graph/${graphId}`,
                {},
                {},
                "DELETE"
            );

            if (isSuccess) {
                setBiGraphs(prev => prev.filter(graph => graph.id !== graphId));
            } else {
                setError("Failed to delete BI graph");
            }

            setDeleteConfirm({ show: false, graphId: null, graphQuery: "", type: "" });
        } catch (error) {
            console.error("Error deleting graph:", error);
            setError("An error occurred while deleting the graph");
        } finally {
            setDeleting(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, graphId: null, graphQuery: "", type: "" });
    };

    const handleSaveOrder = async () => {
        try {
            setIsSaving(true);
            setError("");

            const graphOrders = biGraphs.map((graph, index) => ({
                id: graph.id,
                displayOrder: index
            }));

            const { isSuccess } = await apiCall(
                `${config.POSTLOGIN_API_URL_COMPANY}bi-graphs/reorder`,
                {},
                { graphOrders: graphOrders },
                "POST"
            );

            if (isSuccess) {
                setOriginalGraphs(JSON.parse(JSON.stringify(biGraphs)));
                setIsDirty(false);
                console.log("Graphs reordered successfully");
            } else {
                setError("Failed to save graph order");
            }
        } catch (error) {
            console.error("Error saving graph order:", error);
            setError("An error occurred while saving the graph order");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelReorder = () => {
        setBiGraphs(JSON.parse(JSON.stringify(originalGraphs)));
        setIsDirty(false);
    };

    const styles = {
        // ... your existing styles ...
        container: {
            minHeight: '100vh',
            padding: '40px 20px'
        },
        contentWrapper: {
            maxWidth: '1400px',
            margin: '0 auto'
        },
        graphsGrid: {
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            animation: 'fadeIn 0.6s ease-out'
        },
        graphCard: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
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
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
        },
        dragHandle: {
            position: 'absolute',
            top: '32px',
            left: '32px',
            cursor: 'grab',
            color: '#cbd5e0',
            transition: 'color 0.3s ease',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            zIndex: 10,
            userSelect: 'none'
        },
        graphHeader: {
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e2e8f0',
            paddingLeft: '50px'
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
        graphDescription: {
            fontSize: '14px',
            color: '#718096',
            marginTop: '8px',
            lineHeight: '1.5'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        },
        iconButton: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
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
        loadingContainer: {
            textAlign: 'center',
            padding: '100px 20px'
        },
        spinner: {
            width: '60px',
            height: '60px',
            border: '6px solid #e5e7eb',
            borderTop: '6px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
        },
        loadingText: {
            color: '#6b7280',
            fontSize: '18px',
            fontWeight: '500'
        },
        emptyContainer: {
            textAlign: 'center',
            padding: '100px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
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
            lineHeight: '1.6',
            marginBottom: '24px'
        },
        biDashboardButton: {
            position: 'absolute',
            top: '65px',
            right: '20px',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 100
        },
        saveButtonContainer: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            display: 'flex',
            gap: '12px',
            zIndex: 500,
            animation: 'slideUp 0.4s ease-out'
        },
        saveButton: {
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        cancelButton: {
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            background: '#e2e8f0',
            color: '#4a5568',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
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
        modalCancelButton: {
            background: '#e2e8f0',
            color: '#4a5568'
        },
        confirmButton: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }
    };

    return (
        <div style={styles.container}>
            <div>
                <button
                    onClick={() => {
                        setEditingGraph(null);
                        setShowBiDashboard(true);
                    }}
                    style={styles.biDashboardButton}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }}
                    title="Create New Graph"
                >
                    + Create
                </button>
            </div>
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
                ) : biGraphs.length === 0 ? (
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
                        {biGraphs.map((graph, index) => (
                            <div
                                key={`bi-${graph.id}`}
                                onDragOver={(e) => handleDragOverWithScroll(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragLeave={(e) => handleDragLeave(e, index)}
                                style={{
                                    ...styles.graphCard,
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                    opacity: deleting === graph.id ? 0.5 : draggedItem === index ? 0.6 : 1,
                                    pointerEvents: deleting === graph.id ? 'none' : 'auto',
                                    backgroundColor: dragOverItem === index && draggedItem !== index ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.95)',
                                    border: dragOverItem === index && draggedItem !== index ? '2px dashed #10b981' : 'none',
                                    transform: draggedItem === index ? 'scale(0.98) rotate(2deg)' : 'scale(1)',
                                    transition: draggedItem !== null ? 'none' : 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (draggedItem === null) {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (draggedItem === null) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                            >
                                <div style={styles.cardAccent} />

                                {/* Drag Handle - Now a div instead of button */}
                                <div
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        ...styles.dragHandle,
                                        cursor: draggedItem === index ? 'grabbing' : 'grab'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.color = '#10b981';
                                        e.currentTarget.style.background = '#f0fdf4';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.color = '#cbd5e0';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                    title="Drag to reorder"
                                >
                                    ⋮⋮
                                </div>

                                <div style={styles.graphHeader}>
                                    <div style={styles.graphHeaderTop}>
                                        <div style={{ flex: 1 }}>
                                            <div style={styles.graphQuery}>{graph.query}</div>
                                            {graph.description && (
                                                <div style={styles.graphDescription}>{graph.description}</div>
                                            )}
                                        </div>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                style={styles.iconButton}
                                                onClick={() => handleEditClick(graph)}
                                                title="Edit Graph"
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = '#dbeafe';
                                                    e.currentTarget.style.borderColor = '#bfdbfe';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                style={styles.iconButton}
                                                onClick={() => getRefreshBIGraph(graph.id)}
                                                disabled={loading}
                                                title="Refresh Graph"
                                                onMouseOver={(e) => {
                                                    if (!loading) {
                                                        e.currentTarget.style.background = '#f3f4f6';
                                                        e.currentTarget.style.borderColor = '#d1d5db';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!loading) {
                                                        e.currentTarget.style.background = 'white';
                                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                                    }
                                                }}
                                            >
                                                🔄
                                            </button>
                                            <button
                                                style={styles.iconButton}
                                                onClick={() => handleDeleteClick(graph.id, graph.query, 'bi')}
                                                title="Delete Graph"
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = '#fee2e2';
                                                    e.currentTarget.style.borderColor = '#fecaca';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ChartFactory
                                    chartData={graph.chartData}
                                    chartOptions={{ height: 450, transform: true }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isDirty && (
                <div style={styles.saveButtonContainer}>
                    <button
                        style={styles.saveButton}
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        onMouseOver={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }
                        }}
                    >
                        {isSaving ? 'Saving...' : '✓ Save Order'}
                    </button>
                    <button
                        style={styles.cancelButton}
                        onClick={handleCancelReorder}
                        disabled={isSaving}
                        onMouseOver={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.background = '#cbd5e0';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isSaving) {
                                e.currentTarget.style.background = '#e2e8f0';
                            }
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {showBiDashboard && (
                <BiDashboard
                    isOpen={showBiDashboard}
                    editingGraph={editingGraph}
                    onClose={() => {
                        setShowBiDashboard(false);
                        setEditingGraph(null);
                        getAllGraphs();
                    }}
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
                            Are you sure you want to delete this BI graph? This action cannot be undone.
                            <div style={styles.modalQuery}>"{deleteConfirm.graphQuery}"</div>
                        </div>
                        <div style={styles.modalActions}>
                            <button
                                style={{ ...styles.modalButton, ...styles.modalCancelButton }}
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
                                disabled={deleting !== null}
                                onMouseOver={(e) => {
                                    if (deleting === null) {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (deleting === null) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                    }
                                }}
                            >
                                {deleting !== null ? 'Deleting...' : 'Delete Graph'}
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
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                * {
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
};

export default CustomGraph;