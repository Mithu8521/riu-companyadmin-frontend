import ReactApexChart from "react-apexcharts";

export const formatNumber = (val) => {
    if (val === null || val === undefined || val === '' || isNaN(val)) return 0;
    if (typeof val === 'number') {
        return Number(val.toFixed(2));
    }
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : Number(parsed.toFixed(2));
};

const formatLabel = (str) => {
  if (!str || typeof str !== 'string') return '';

  return str
    // Replace underscores and hyphens with spaces
    .replace(/[_-]+/g, ' ')
    // Add space before capital letters (for camelCase or PascalCase)
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Add space between letters and numbers
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    // Convert multiple spaces to one
    .replace(/\s+/g, ' ')
    // Trim and capitalize the first letter
    .trim()
    .replace(/^./, s => s.toUpperCase());
};

export const formatNumberWithSuffix = (val) => {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'number') return val;
    
    const absVal = Math.abs(val);
    
    if (absVal >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
    } else if (absVal >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
    }
    return val.toFixed(0);
};

export const formatDataArray = (arr) => {
    if (!Array.isArray(arr)) return arr;
    return arr.map(val => typeof val === 'number' ? formatNumber(val) : val);
};

export const formatSeries = (series) => {
    if (!Array.isArray(series)) return series;
    return series.map(s => ({
        ...s,
        data: Array.isArray(s.data) ? formatDataArray(s.data) : s.data
    }));
};

export const getSeriesColors = (series, colorMap, defaultColors) => {
    return series && series.map(s => {
        if (colorMap && colorMap[s.name]) {
            return colorMap[s.name];
        }
        return s.color || defaultColors[0];
    });
};

export const shouldBeStacked = (series, colorMap) => {
    if (!series || series.length <= 1) return false;
    if (!colorMap || Object.keys(colorMap).length === 0) return false;
    return series.length === Object.keys(colorMap).length;
};

export const getBaseChartConfig = (theme = 'light', customColors = null, data = {}) => ({
    title: {
        text: data.title,
        align: 'left',
    },
    chart: {
        fontFamily: 'Inter, system-ui, sans-serif',
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            }
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
        },
        background: 'transparent',
        dropShadow: {
            enabled: true,
            color: '#3b82f6',
            top: 3,
            left: 3,
            blur: 5,
            opacity: 0.1
        },
        zoom: {
            enabled: true
        }
    },
    colors: customColors || [
        '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', 
        '#ef4444', '#8b5cf6', '#ec4899', '#84cc16',
        '#f97316', '#14b8a6', '#8b5a87', '#059669'
    ],
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#374151']
        },
        formatter: function(val) {
            return formatNumberWithSuffix(val);
        }
    },
    tooltip: {
        theme: theme,
        style: {
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        fillSeriesColor: false,
        marker: {
            show: true,
        }
    },
    grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 0,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
            width: 12,
            height: 12,
            radius: 6
        },
        itemMargin: {
            horizontal: 15,
            vertical: 5
        },
        formatter: function(seriesName, opts) {
            const unit = data.unitsMap?.[seriesName];
            return unit ? `${seriesName} (${unit})` : seriesName;
        }
    }
});


const ErrorMessage = ({ message = "No data available to display" }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            backgroundColor: '#fefefe',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{
                fontSize: '64px',
                marginBottom: '20px',
                opacity: 0.3
            }}>
                📊
            </div>
            <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px 0',
                textAlign: 'center'
            }}>
                {message}
            </h3>
            <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0,
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                Try adjusting your filters or contact support if the issue persists
            </p>
        </div>
    );
};

export const BarChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }
    
    const isStacked = data.stacked;
    const isGrouped = data.grouped;
    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);
    
    // For single distributed series, show categories in legend instead of series name
    // Only when colorMap has actual entries (not empty/undefined)
    const showCategoryLegend = !isStacked && data.series?.length === 1 && 
                                data.colorMap && Object.keys(data.colorMap).length > 0;
    
    // For non-stacked single series with colorMap, use colorMap values as bar colors
    const barColors = showCategoryLegend
        ? Object.values(data.colorMap)
        : seriesColors;

    const baseConfig = getBaseChartConfig('light', barColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'bar',
            height: options.height || 450,
            stacked: isStacked && !isGrouped
        },
        xaxis: {
            categories: data.categories || [],
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: '#64748b'
                }
            },
            tickPlacement: 'on'
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                },
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: '#64748b'
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: options.horizontal || false,
                columnWidth: options.columnWidth || '60%',
                endingShape: 'rounded',
                distributed: showCategoryLegend,  // Only distribute when showing category legend
                dataLabels: {
                    position: options.horizontal ? 'center' : 'top',
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumberWithSuffix(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            },
            offsetY: -20
        },
        legend: showCategoryLegend ? {
            ...baseConfig.legend,
            show: true,
            showForSingleSeries: true,
            customLegendItems: data.categories,
            markers: {
                fillColors: barColors
            },
            formatter: function(seriesName, opts) {
                const unit = data.unitsMap?.[seriesName] || data.unit || '';
                return unit ? `${seriesName} (${unit})` : seriesName;
            }
        } : baseConfig.legend,
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)?.toLocaleString()} ${unit}`;
                }
            }
        }
    };

    if (!isStacked) {
        // Only set custom colors for distributed bars (when colorMap is defined)
        if (showCategoryLegend) {
            chartConfig['colors'] = barColors;
        }
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="bar"
                height={options.height || 450}
            />
        </div>
    );
};

export const LineChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'line',
            height: options.height || 450,
        },
        stroke: {
            curve: options.curve || 'smooth',
            width: options.strokeWidth || 4,
            dashArray: options.dashArray || 0
        },
        xaxis: {
            categories: data.categories || [],
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#64748b'
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                }
            }
        },
        markers: {
            size: options.markerSize || 8,
            strokeWidth: 3,
            strokeColors: '#fff',
            hover: {
                size: 10
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumberWithSuffix(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            },
            offsetY: -10
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)?.toLocaleString()} ${unit}`;
                }
            }
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="line"
                height={options.height || 450}
            />
        </div>
    );
};

export const AreaChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const isStacked = shouldBeStacked(data.series, data.colorMap);
    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'area',
            height: options.height || 450,
            stacked: isStacked,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: options.opacityFrom || 0.8,
                opacityTo: options.opacityTo || 0.2,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: options.curve || 'smooth',
            width: options.strokeWidth || 3
        },
        xaxis: {
            categories: data.categories || [],
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)?.toLocaleString()} ${unit}`;
                }
            }
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="area"
                height={options.height || 450}
            />
        </div>
    );
};

export const PieChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'pie',
            height: options.height || 450
        },
        labels: data.labels || [],
        plotOptions: {
            pie: {
                donut: {
                    size: options.donutSize || '0%'
                },
                expandOnClick: true,
                dataLabels: {
                    offset: options.labelOffset || 0,
                    minAngleToShowLabel: 10
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                const value = data.values?.[opts.seriesIndex] || '';
                const formattedValue = formatNumber(value);
                return `${formatNumber(val)}%\n${formattedValue}`;
            },
            style: {
                fontSize: '12px',
                fontWeight: 600
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { seriesIndex }) {
                    const label = data.labels?.[seriesIndex];
                    const unit = data.unitsMap?.[label] || data.unit || '';
                    return `${formatNumber(val)} ${unit}`;
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <ReactApexChart
            options={chartConfig}
            series={data.values || []}
            type="pie"
            height={options.height || 450}
        />
    );
};

export const DonutChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }
    return <PieChart data={data} options={{...options, donutSize: options.donutSize || '50%'}} />;
};

export const ScatterChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }
    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'scatter',
            height: options.height || 450
        },
        title: {
            text: data.title || 'Scatter Chart',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
            }
        },
        xaxis: {
            title: {
                text: formatLabel(data.xAxisTitle) || 'Categories',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            },
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                }
            }
        },
        yaxis: {
            title: {
                text: data.yAxisTitle || 'Y Values',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            },
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                }
            }
        },
        markers: {
            size: options.markerSize || 8,
            strokeWidth: 2,
            strokeColors: '#fff',
            hover: {
                size: 12
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const point = data.series[seriesIndex].data[dataPointIndex];
                const seriesName = w.config.series[seriesIndex]?.name;
                const unit = data.unitsMap?.[seriesName] || data.unit || '';
                return `
                    <div class="p-3 bg-white border rounded shadow-lg">
                        <div class="font-semibold">${seriesName}</div>
                        <div>X: ${formatNumber(point[0])?.toLocaleString()}</div>
                        <div>Y: ${formatNumber(point[1])?.toLocaleString()} ${unit}</div>
                    </div>
                `;
            }
        }
    };

    return (
        <ReactApexChart
            options={chartConfig}
            series={data.series || []}
            type="scatter"
            height={options.height || 450}
        />
    );
};

export const HeatmapChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'heatmap',
            height: options.height || 450,
        },
        title: {
            text: data.title || 'Heatmap Chart',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
            }
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: options.radius || 0,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: options.colorRanges || [{
                        from: -30,
                        to: 5,
                        color: '#00A100',
                        name: 'low',
                    }, {
                        from: 6,
                        to: 20,
                        color: '#128FD9',
                        name: 'medium',
                    }, {
                        from: 21,
                        to: 45,
                        color: '#FFB200',
                        name: 'high',
                    }, {
                        from: 46,
                        to: 55,
                        color: '#FF0000',
                        name: 'extreme',
                    }]
                }
            }
        },
        dataLabels: {
            enabled: options.showDataLabels !== false,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                colors: ['#fff']
            }
        },
        xaxis: {
            title: {
                text: formatLabel(data.xAxisTitle) || 'Categories',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            }
        },
        yaxis: {
            title: {
                text: data.yAxisTitle || 'Series',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)} ${unit}`;
                }
            }
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="heatmap"
                height={options.height || 450}
            />
        </div>
    );
};

export const RadarChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }
    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'radar',
            height: options.height || 450
        },
        title: {
            text: data.title || 'Radar Chart',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
            }
        },
        xaxis: {
            categories: data.categories || []
        },
        plotOptions: {
            radar: {
                size: options.size || 140,
                polygons: {
                    strokeColors: '#e9e9e9',
                    fill: {
                        colors: ['#f8f9fa', '#e9ecef']
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)} ${unit}`;
                }
            }
        }
    };

    return (
        <ReactApexChart
            options={chartConfig}
            series={data.series || []}
            type="radar"
            height={options.height || 450}
        />
    );
};

export const BoxPlotChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'boxPlot',
            height: options.height || 450,
        },
        title: {
            text: data.title || 'Box Plot Chart',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
            }
        },
        xaxis: {
            categories: data.categories || [],
            title: {
                text: formatLabel(data.xAxisTitle) || 'Categories',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            }
        },
        yaxis: {
            title: {
                text: data.yAxisTitle || 'Values',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            },
            labels: {
                formatter: function (val) {
                    return formatNumber(val)?.toLocaleString() || val;
                }
            }
        },
        plotOptions: {
            boxPlot: {
                colors: {
                    upper: seriesColors[0] || '#5A67D8',
                    lower: seriesColors[1] || '#667eea'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)} ${unit}`;
                }
            }
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="boxPlot"
                height={options.height || 450}
            />
        </div>
    );
};

export const MixedChart = ({ data, options = {} }) => {
    if (data?.errorMessage) {
        return <ErrorMessage message={data.errorMessage} />;
    }

    if (!data || !data.series || !Array.isArray(data.series) || data.series.length === 0) {
        return <ErrorMessage message="No data available to display" />;
    }

    const seriesColors = getSeriesColors(data.series, data.colorMap, data.colors);

    const baseConfig = getBaseChartConfig('light', seriesColors, data);

    const chartConfig = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: 'line',
            height: options.height || 450,
        },
        title: {
            text: data.title || 'Mixed Chart',
            align: 'center',
            style: {
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b'
            }
        },
        xaxis: {
            categories: data.categories || [],
            title: {
                text: formatLabel(data.xAxisTitle) || 'Categories',
                style: {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b'
                }
            }
        },
        yaxis: [
            {
                title: {
                    text: data.primaryYAxisTitle || 'Primary Axis',
                    style: {
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#64748b'
                    }
                },
                labels: {
                    formatter: function (val) {
                        return formatNumber(val)?.toLocaleString() || val;
                    }
                }
            },
            {
                opposite: true,
                title: {
                    text: data.secondaryYAxisTitle || 'Secondary Axis',
                    style: {
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#64748b'
                    }
                },
                labels: {
                    formatter: function (val) {
                        return formatNumber(val)?.toLocaleString() || val;
                    }
                }
            }
        ],
        stroke: {
            width: [4, 4, 0],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '50%'
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return formatNumber(val);
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#374151']
            }
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                    const seriesName = w.config.series[seriesIndex]?.name;
                    const unit = data.unitsMap?.[seriesName] || data.unit || '';
                    return `${formatNumber(val)?.toLocaleString()} ${unit}`;
                }
            }
        }
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <ReactApexChart
                options={chartConfig}
                series={data.series || []}
                type="line"
                height={options.height || 450}
            />
        </div>
    );
};

const transformBiChartData = (data, chartType, xAxisField, stackByField, title) => {
    if (!data || !data.data || data.data.length === 0) return null;

    const chartData = data.data;
    const metadata = data.metadata || {};
    const colors = ['#3f88a5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'];
    let series = [];
    let categories = [];
    let colorMap = {};
    let unitsMap = {}; // Map to store units per series/category

    // === PIE/DONUT CHARTS ===
    if (chartType?.toLowerCase() === 'pie' || chartType?.toLowerCase() === 'donut') {

        if (stackByField) {
            throw new Error('Pie Chart does not support Stack By Field');
        }

        const aggregated = {};
        chartData.forEach(item => {
            const label = item[xAxisField] || 'Unknown';
            const value = parseFloat(item.sum_value) || 0;
            aggregated[label] = (aggregated[label] || 0) + value;
        });

        const labels = Object.keys(aggregated);
        const values = Object.values(aggregated);
        const unit = chartData[0]?.unit || '';

        labels.forEach((lbl, idx) => {
            colorMap[lbl] = colors[idx % colors.length];
            unitsMap[lbl] = unit;
        });

        return {
            graphType: chartType,
            title: title || 'Pie Chart',
            labels: labels,
            values: values,
            colors: colors,
            colorMap: colorMap,
            unitsMap: unitsMap,
            unit: unit,
            series: [{ name: 'Values', data: values }]
        };
    }

    // === REGULAR STACKED CHARTS ===
    if (stackByField && xAxisField) {
        const groupedData = {};
        const stackValues = new Set();
        const xValues = new Set();

        chartData.forEach(item => {
            const xVal = item[xAxisField];
            const stackVal = item[stackByField];
            const value = parseFloat(item.sum_value) || 0;
            xValues.add(xVal);
            stackValues.add(stackVal);

            if (!groupedData[stackVal]) {
                groupedData[stackVal] = {};
            }
            groupedData[stackVal][xVal] = (groupedData[stackVal][xVal] || 0) + value;
            
            // Capture unit for this stackVal (series)
            if (!unitsMap[stackVal] && item.unit) {
                unitsMap[stackVal] = item.unit;
            }
        });

        categories = Array.from(xValues);
        const stackValuesArr = [...stackValues];
        stackValuesArr.forEach((stackVal, index) => {
            const color = colors[index % colors.length];
            colorMap[stackVal] = color;

            series.push({
                name: String(stackVal),
                data: categories.map(xVal => groupedData[stackVal][xVal] || 0),
                color: color
            });
        });
    }
    // === SINGLE SERIES ===
    else if (xAxisField) {
        const groupedData = {};
        chartData.forEach(item => {
            const xVal = item[xAxisField];
            const value = parseFloat(item.sum_value) || 0;
            groupedData[xVal] = (groupedData[xVal] || 0) + value;
        });

        categories = Object.keys(groupedData);
        const aggregateKey = metadata.aggregate ? Object.keys(metadata.aggregate)[0] : 'Value';
        const seriesName = (aggregateKey === 'sum' && title) ? title : (aggregateKey || title || 'Value');

        // For single series, all categories have the same unit
        const unit = chartData[0]?.unit || '';
        unitsMap[seriesName] = unit;
        
        // Also store unit for each category (needed for pie/donut chart legends)
        categories.forEach(cat => {
            unitsMap[cat] = unit;
        });
        
        series = [{
            name: seriesName,
            data: categories.map(cat => groupedData[cat]),
            color: colors[0]
        }];
    } else {
        throw new Error('xAxisField is required');
    }

    const formattedSeries = formatSeries(series);

    return {
        graphType: chartType,
        title: title || 'Chart',
        categories,
        series: formattedSeries,
        xAxisTitle: xAxisField || 'X-Axis',
        yAxisTitle: 'Value',
        colors,
        ...(Object.keys(colorMap).length > 0 && { colorMap }), // Only include if not empty
        unitsMap: unitsMap,
        unit: Object.values(unitsMap)[0] || '', // Fallback to first unit
        stacked: !!stackByField,
        grouped: !!stackByField && metadata.isGroupedStacked
    };
};

export const ChartFactory = ({ chartData, chartOptions = { } }) => {
    if (chartData?.errorMessage) {
        return <ErrorMessage message={chartData.errorMessage} />;
    }

    if (!chartData) {
        return <ErrorMessage message="No data available to display" />;
    }

    let transformedChartData = chartData;
    try {
        if (chartOptions.transform) {
            transformedChartData = transformBiChartData(
                chartData.data, 
                chartData.chartType, 
                chartData.xAxisField,
                chartData.stackByField,
                chartData.title
            );
        }

        if (!transformedChartData) {
            return <ErrorMessage message="Unable to display chart with current selection" />;
        }

        const chartType = transformedChartData.graphType?.toLowerCase() || 'bar';

        switch (chartType) {
            case 'bar':
            case 'column':
                return <BarChart data={transformedChartData} options={chartOptions} />;
                
            case 'line':
                return <LineChart data={transformedChartData} options={chartOptions} />;
                
            case 'area':
                return <AreaChart data={transformedChartData} options={chartOptions} />;
                
            case 'pie':
                return <PieChart data={transformedChartData} options={chartOptions} />;
                
            case 'donut':
                return <DonutChart data={transformedChartData} options={chartOptions} />;
                
            case 'scatter':
                return <ScatterChart data={transformedChartData} options={chartOptions} />;
                
            case 'heatmap':
                return <HeatmapChart data={transformedChartData} options={chartOptions} />;
                
            case 'radar':
                return <RadarChart data={transformedChartData} options={chartOptions} />;
                
            case 'boxplot':
                return <BoxPlotChart data={transformedChartData} options={chartOptions} />;
                
            case 'mixed':
                return <MixedChart data={transformedChartData} options={chartOptions} />;
                
            default:
                return <BarChart data={transformedChartData} options={chartOptions} />;
        }
    } catch(error) {
        console.error('Chart rendering error:', error);
        return <ErrorMessage message={`Error: ${error.message || 'Unable to display chart'}`} />;
    }

};