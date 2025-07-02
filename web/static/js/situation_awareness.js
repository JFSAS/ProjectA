// 全局变量和初始化
let charts = {};
let updateInterval;
const updateFrequency = 5000; // 数据更新频率（毫秒）

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    updateAllCharts();
    
    // 定时更新数据
    updateInterval = setInterval(updateAllCharts, updateFrequency);
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 检测窗口尺寸变化
    window.addEventListener('resize', function() {
        for (let chartId in charts) {
            if (charts[chartId]) {
                charts[chartId].resize();
            }
        }
    });
    
    // 显示欢迎通知
    showNotification('系统已准备就绪', 'success');
});

// 初始化所有图表
function initializeCharts() {
    initDetectionTrend();
    initCameraPerformance();
    initActivityHeatmap();
    initTrajectorySankey();
    initSpatiotemporalChart();
    initFeatureCharts();
    initSystemGauges();
    initCameraMap();
}

// 绑定事件监听器
function bindEventListeners() {
    // 时间筛选按钮
    document.querySelectorAll('.time-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.time-filter .filter-btn.active').classList.remove('active');
            this.classList.add('active');
            
            const timeRange = this.dataset.time;
            updateAllCharts(timeRange);
        });
    });
    
    // 检测趋势分段控制
    document.querySelectorAll('.segmented-control .segment').forEach(segment => {
        segment.addEventListener('click', function() {
            document.querySelector('.segmented-control .segment.active').classList.remove('active');
            this.classList.add('active');
            
            const detectionType = this.dataset.target;
            updateDetectionTrend(detectionType);
        });
    });
    
    // 时间选择器按钮
    document.querySelectorAll('.time-selector .time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.time-selector .time-btn.active').classList.remove('active');
            this.classList.add('active');
            
            const timeOfDay = this.dataset.time;
            updateActivityHeatmap(timeOfDay);
        });
    });
    
    // 性能摄像头选择
    document.getElementById('performance-camera').addEventListener('change', function() {
        updateCameraPerformance(this.value);
    });
    
    // 时空视图选择
    document.getElementById('spatiotemporal-view').addEventListener('change', function() {
        updateSpatiotemporalChart(this.value);
    });
    
    
    
    // 预警操作按钮
    document.querySelectorAll('.alert-actions .action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const alertItem = this.closest('.alert-item');
            
            if (this.querySelector('.fa-check')) {
                alertItem.style.opacity = '0.5';
                setTimeout(() => {
                    alertItem.style.display = 'none';
                }, 500);
                
                showNotification('预警已处理', 'success');
            } else if (this.querySelector('.fa-eye')) {
                showNotification('正在查看预警详情...', 'info');
            }
        });
    });
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.querySelector('.notification');
    const notificationText = notification.querySelector('span');
    const notificationIcon = notification.querySelector('i');
    
    notification.className = 'notification ' + type;
    notificationText.textContent = message;
    
    if (type === 'success') {
        notificationIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notificationIcon.className = 'fas fa-times-circle';
    } else if (type === 'info') {
        notificationIcon.className = 'fas fa-info-circle';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 更新所有图表
function updateAllCharts(timeRange = 'realtime') {
    updateDetectionTrend();
    updateCameraPerformance();
    updateActivityHeatmap();
    updateTrajectorySankey();
    updateSpatiotemporalChart();
    updateFeatureCharts();
    updateSystemGauges();
    updateCameraMap(); // 添加这一行
}


// 初始化检测趋势图
function initDetectionTrend() {
    const chartDom = document.getElementById('detection-trend');
    charts.detectionTrend = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['人员检测', '人脸检测'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            right: 10,
            top: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        series: [
            {
                name: '人员检测',
                type: 'line',
                smooth: true,
                data: [],
                symbol: 'emptyCircle',
                symbolSize: 8,
                showSymbol: false,
                lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                },
                itemStyle: {
                    color: '#00c2ff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(0, 194, 255, 0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0, 194, 255, 0.1)'
                        }
                    ])
                }
            },
            {
                name: '人脸检测',
                type: 'line',
                smooth: true,
                data: [],
                symbol: 'emptyCircle',
                symbolSize: 8,
                showSymbol: false,
                lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(22, 206, 83, 0.2)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                },
                itemStyle: {
                    color: '#ff00c8'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(35, 168, 50, 0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(11, 186, 75, 0.1)'
                        }
                    ])
                }
            }
        ]
    };
    
    charts.detectionTrend.setOption(option);
}

// 初始化摄像头性能矩阵
function initCameraPerformance() {
    const chartDom = document.getElementById('camera-performance');
    charts.cameraPerformance = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: [
                { name: '检测性能', max: 100 },
                { name: '分辨率', max: 100 },
                { name: '帧率', max: 100 },
                { name: '稳定性', max: 100 },
                { name: '负载', max: 100 }
            ],
            center: ['50%', '50%'],
            radius: '65%',
            splitNumber: 5,
            shape: 'circle',
            name: {
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(0, 194, 255, 0.02)', 'rgba(0, 194, 255, 0.05)', 'rgba(0, 194, 255, 0.08)', 'rgba(0, 194, 255, 0.12)', 'rgba(0, 194, 255, 0.18)'],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        series: [
            {
                name: '摄像头性能',
                type: 'radar',
                data: [
                    {
                        value: [],
                        name: '平均性能',
                        areaStyle: {
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 194, 255, 0.6)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0, 194, 255, 0.1)'
                                }
                            ])
                        },
                        lineStyle: {
                            width: 3,
                            color: '#00c2ff'
                        },
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#00c2ff'
                        }
                    }
                ]
            }
        ]
    };
    
    charts.cameraPerformance.setOption(option);
}

// 初始化活动热点图
function initActivityHeatmap() {
    const chartDom = document.getElementById('activity-heatmap');
    charts.activityHeatmap = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return `${params.name}: ${params.value[2]} 人次`;
            }
        },
        grid: {
            top: '10%',
            left: '3%',
            right: '3%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)']
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        yAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)']
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            itemWidth: 15,
            itemHeight: 120,
            precision: 0,
            text: ['高', '低'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            inRange: {
                color: ['#00d46a', '#ffb300', '#ff4757']
            }
        },
        series: [
            {
                name: '人员活动热度',
                type: 'heatmap',
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                }
            }
        ]
    };
    
    charts.activityHeatmap.setOption(option);
}

// 初始化轨迹桑基图
function initTrajectorySankey() {
    const chartDom = document.getElementById('trajectory-sankey');
    charts.trajectorySankey = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                layoutIterations: 64,
                layout: 'none',
                emphasis: {
                    focus: 'adjacency'
                },
                data: [],
                links: [],
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5,
                    opacity: 0.6
                },
                itemStyle: {
                    color: '#00c2ff',
                    borderColor: '#000',
                    borderWidth: 1
                },
                label: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'Arial'
                }
            }
        ]
    };
    
    charts.trajectorySankey.setOption(option);
}

// 初始化时空关联分析
function initSpatiotemporalChart() {
    const chartDom = document.getElementById('spatiotemporal-chart');
    charts.spatiotemporalChart = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            position: 'top',
            formatter: function(params) {
                return `${params.name}: ${params.value[2]}`;
            }
        },
        grid: {
            top: '10%',
            left: '3%',
            right: '3%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['区域A', '区域B', '区域C', '区域D', '区域E'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)']
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        yAxis: {
            type: 'category',
            data: ['区域A', '区域B', '区域C', '区域D', '区域E'],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)']
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            itemWidth: 15,
            itemHeight: 120,
            text: ['强', '弱'],
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            },
            inRange: {
                color: ['#00d46a', '#00c2ff', '#6e00ff']
            }
        },
        series: [
            {
                name: '关联强度',
                type: 'heatmap',
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                }
            }
        ]
    };
    
    charts.spatiotemporalChart.setOption(option);
}

// 初始化特征统计图表
function initFeatureCharts() {
   
    
    // 初始化停留时长分布图
    const chart2Dom = document.getElementById('feature-chart-2');
    charts.featureChart2 = echarts.init(chart2Dom);
    
    const option2 = {
        backgroundColor: 'transparent',
        title: {
            text: '停留时长分布',
            left: 'center',
            top: 5,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '5%',
            bottom: '15%',
            top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 9,
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 9
            }
        },
        series: [
            {
                name: '人数',
                type: 'bar',
                data: [],
                barWidth: '40%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#00c2ff'
                        },
                        {
                            offset: 1,
                            color: '#0084ff'
                        }
                    ])
                }
            }
        ]
    };
    
    charts.featureChart2.setOption(option2);
    
    // 初始化重复出现频率图
    const chart3Dom = document.getElementById('feature-chart-3');
    charts.featureChart3 = echarts.init(chart3Dom);
    
    const option3 = {
        backgroundColor: 'transparent',
        title: {
            text: '重复出现频率',
            left: 'center',
            top: 5,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 5,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 10
            }
        },
        series: [
            {
                name: '出现频率',
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 12,
                        color: '#fff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            }
        ],
        color: ['#ff00c8', '#ffb300', '#00d46a']
    };
    
    charts.featureChart3.setOption(option3);
}

// 初始化系统状态仪表盘
function initSystemGauges() {
    // CPU仪表盘
    const cpuDom = document.getElementById('cpu-gauge');
    charts.cpuGauge = echarts.init(cpuDom);
    
    const cpuOption = getGaugeOption('CPU使用率');
    charts.cpuGauge.setOption(cpuOption);
    
    // 内存仪表盘
    const memoryDom = document.getElementById('memory-gauge');
    charts.memoryGauge = echarts.init(memoryDom);
    
    const memoryOption = getGaugeOption('内存使用率');
    charts.memoryGauge.setOption(memoryOption);
    
    // GPU仪表盘
    const gpuDom = document.getElementById('gpu-gauge');
    charts.gpuGauge = echarts.init(gpuDom);
    
    const gpuOption = getGaugeOption('GPU使用率');
    charts.gpuGauge.setOption(gpuOption);
    
    // 存储仪表盘
    const storageDom = document.getElementById('storage-gauge');
    charts.storageGauge = echarts.init(storageDom);
    
    const storageOption = getGaugeOption('存储使用率');
    charts.storageGauge.setOption(storageOption);
}

// 仪表盘配置生成器
function getGaugeOption(title) {
    return {
        backgroundColor: 'transparent',
        series: [
            {
                type: 'gauge',
                radius: '90%',
                startAngle: 225,
                endAngle: -45,
                pointer: {
                    show: true,
                    length: '70%',
                    width: 3
                },
                axisLine: {
                    lineStyle: {
                        width: 10,
                        color: [
                            [0.3, '#00d46a'],
                            [0.7, '#ffb300'],
                            [1, '#ff4757']
                        ]
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    distance: -15,
                    length: 12,
                    lineStyle: {
                        color: 'auto',
                        width: 2
                    }
                },
                axisLabel: {
                    distance: -30,
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 9
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 20,
                    offsetCenter: [0, '40%'],
                    formatter: '{value}%',
                    color: 'rgba(255, 255, 255, 0.9)'
                },
                data: [
                    {
                        value: 0
                    }
                ],
                title: {
                    show: false
                }
            }
        ]
    };
}



// 更新检测趋势图
function updateDetectionTrend(type = 'persons') {
    // 获取检测数据 - 实际应用中应从API获取
    const trendData = getMockTrendData();
    
    const option = {
        xAxis: {
            data: trendData.times
        },
        series: [
            {
                name: '人员检测',
                data: trendData.persons
            },
            {
                name: '人脸检测',
                data: trendData.faces
            }
        ]
    };
    
    if (type === 'persons') {
        option.series[1].itemStyle = { opacity: 0.3 };
        option.series[1].lineStyle = { width: 1, opacity: 0.3 };
        option.series[1].areaStyle = { opacity: 0.1 };
    } else if (type === 'faces') {
        option.series[0].itemStyle = { opacity: 0.3 };
        option.series[0].lineStyle = { width: 1, opacity: 0.3 };
        option.series[0].areaStyle = { opacity: 0.1 };
    }
    
    charts.detectionTrend.setOption(option);
}

// 更新摄像头性能矩阵
function updateCameraPerformance(cameraGroup = 'all') {
    // 获取性能数据 - 实际应用中应从API获取
    const performanceData = getMockPerformanceData(cameraGroup);
    
    charts.cameraPerformance.setOption({
        series: [
            {
                data: performanceData
            }
        ]
    });
}

// 更新活动热点图
function updateActivityHeatmap(timeOfDay = 'morning') {
    // 获取热点数据 - 实际应用中应从API获取
    const heatmapData = getMockActivityData(timeOfDay);
    
    charts.activityHeatmap.setOption({
        series: [
            {
                data: heatmapData
            }
        ]
    });
}

// 更新轨迹桑基图
function updateTrajectorySankey() {
    // 获取轨迹数据 - 实际应用中应从API获取
    const trajectoryData = getMockTrajectoryData();
    
    charts.trajectorySankey.setOption({
        series: [
            {
                data: trajectoryData.nodes,
                links: trajectoryData.links
            }
        ]
    });
}

// 更新时空关联图
function updateSpatiotemporalChart(view = 'hour') {
    // 获取关联数据 - 实际应用中应从API获取
    const spatiotemporalData = getMockSpatiotemporalData(view);
    
    charts.spatiotemporalChart.setOption({
        series: [
            {
                data: spatiotemporalData
            }
        ]
    });
}

// 更新特征统计图表
function updateFeatureCharts() {
    // 获取特征数据 - 实际应用中应从API获取
    const featureData = getMockFeatureData();
    

    // 更新停留时长分布
    charts.featureChart2.setOption({
        xAxis: {
            data: featureData.durations.categories
        },
        series: [
            {
                data: featureData.durations.values
            }
        ]
    });
    
    // 更新重复出现频率
    charts.featureChart3.setOption({
        series: [
            {
                data: featureData.frequencies
            }
        ]
    });
}

// 更新系统状态仪表盘
function updateSystemGauges() {
    // 获取系统数据 - 实际应用中应从API获取
    const systemData = getMockSystemData();
    
    // 更新CPU使用率
    charts.cpuGauge.setOption({
        series: [
            {
                data: [
                    {
                        value: systemData.cpu
                    }
                ]
            }
        ]
    });
    
    // 更新内存使用率
    charts.memoryGauge.setOption({
        series: [
            {
                data: [
                    {
                        value: systemData.memory
                    }
                ]
            }
        ]
    });
    
    // 更新GPU使用率
    charts.gpuGauge.setOption({
        series: [
            {
                data: [
                    {
                        value: systemData.gpu
                    }
                ]
            }
        ]
    });
    
    // 更新存储使用率
    charts.storageGauge.setOption({
        series: [
            {
                data: [
                    {
                        value: systemData.storage
                    }
                ]
            }
        ]
    });
}

// 找到initCameraMap函数（约992行），完全替换为以下代码
function initCameraMap() {
    // 摄像头位置数据（相对于地图的百分比位置）
    const cameraPositions = {
        '东出口': { x: 75, y: 50 },
        '西出口': { x: 25, y: 50 },
        '北出口': { x: 50, y: 25 },
        '南出口': { x: 50, y: 75 }
    };
    
    // 获取地图容器
    const mapContainer = document.getElementById('camera-map');
    
    // 设置地图背景
    mapContainer.style.backgroundImage = 'url("static/images/map.png")';
    
    // 清除之前的摄像头标记
    const oldMarkers = mapContainer.querySelectorAll('.camera-marker');
    oldMarkers.forEach(marker => marker.remove());
    
    // 创建摄像头标记
    for (const [name, position] of Object.entries(cameraPositions)) {
        const marker = document.createElement('div');
        marker.className = 'camera-marker active';
        marker.setAttribute('data-camera', name);
        
        // 设置位置
        marker.style.left = `${position.x}%`;
        marker.style.top = `${position.y}%`;
        
        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.className = 'camera-tooltip';
        tooltip.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px;">${name}</div>
            <div>状态: <span style="color:#00d46a">在线</span></div>
            <div>检测人数: 0</div>
            <div>检测人脸: 0</div>
        `;
        
        marker.appendChild(tooltip);
        mapContainer.appendChild(marker);
    }
    
    // 监听窗口大小变化，调整地图
    window.addEventListener('resize', adjustMapAspectRatio);
    
    // 初始调整地图
    adjustMapAspectRatio();
    
    // 初始更新摄像头状态
    updateCameraMap();
}

// 调整地图容器宽高比以匹配背景图，但控制最大高度
function adjustMapAspectRatio() {
    const mapContainer = document.getElementById('camera-map');
    
    // 创建临时图片对象获取原始尺寸
    const img = new Image();
    img.src = 'static/images/map.png';
    
    img.onload = function() {
        // 计算宽高比
        const aspectRatio = img.height / img.width;
        
        // 计算新高度
        let newHeight = mapContainer.offsetWidth * aspectRatio;
        
        // 限制最大高度 - 这里可以设置一个较小的值
        // const maxHeight = 350; // 限制最大高度
        // if (newHeight > maxHeight) {
        //     newHeight = maxHeight;
        // }
        
        mapContainer.style.height = `${newHeight}px`;
        console.log(newHeight)
    };
}

// 添加新函数：更新摄像头状态
function updateCameraMap() {
    // 获取模拟数据
    const camerasData = getMockCameraData();
    
    // 更新所有摄像头标记
    const markers = document.querySelectorAll('.camera-marker');
    
    markers.forEach(marker => {
        const cameraName = marker.getAttribute('data-camera');
        const cameraData = camerasData.find(c => c.name === cameraName);
        
        if (!cameraData) return;
        
        // 更新状态类名
        marker.className = `camera-marker ${cameraData.status}`;
        
        // 更新大小以反映人流量，但使用更小的范围（最小16px，最大24px）
        const size = 16 + Math.min(8, cameraData.detections / 5);
        marker.style.width = `${size}px`;
        marker.style.height = `${size}px`;

        // 更新提示框内容
        const tooltip = marker.querySelector('.camera-tooltip');
        tooltip.innerHTML = `
            <div style="font-weight:bold;margin-bottom:5px;">${cameraName}</div>
            <div>状态: <span style="color:${cameraData.status === 'active' ? '#00d46a' : '#ff4757'}">
                ${cameraData.status === 'active' ? '在线' : '离线'}</span>
            </div>
            ${cameraData.status === 'active' ? `
                <div>检测人数: ${cameraData.detections}</div>
                <div>检测人脸: ${cameraData.faces}</div>
            ` : `
                <div>上次在线: ${cameraData.lastSeen || '未知'}</div>
            `}
        `;
    });
}
// ===== 模拟数据生成函数 =====

// 添加新函数：生成模拟摄像头数据
function getMockCameraData() {
    return [
        {
            name: '东出口',
            status: 'active',
            detections: Math.floor(Math.random() * 30) + 5,
            faces: Math.floor(Math.random() * 20) + 3,
            resolution: '1080p'
        },
        {
            name: '西出口',
            status: 'active',
            detections: Math.floor(Math.random() * 25) + 3,
            faces: Math.floor(Math.random() * 15) + 2,
            resolution: '1080p'
        },
        {
            name: '北出口',
            status: Math.random() > 0.3 ? 'active' : 'inactive',
            detections: Math.floor(Math.random() * 20) + 2,
            faces: Math.floor(Math.random() * 10) + 1,
            lastSeen: '10:23:45',
            resolution: '720p'
        },
        {
            name: '南出口',
            status: Math.random() > 0.2 ? 'active' : 'inactive',
            detections: Math.floor(Math.random() * 35) + 10,
            faces: Math.floor(Math.random() * 25) + 5,
            lastSeen: '09:45:12',
            resolution: '1080p'
        }
    ];
}

// 生成检测趋势数据
function getMockTrendData() {
    const times = [];
    const persons = [];
    const faces = [];
    
    for (let i = 0; i < 24; i++) {
        times.push(i + ':00');
        
        // 模拟高峰期
        let personFactor = 1;
        if (i >= 8 && i <= 10) personFactor = 1.5; // 早高峰
        if (i >= 17 && i <= 19) personFactor = 1.8; // 晚高峰
        
        let personCount = Math.round(Math.random() * 50 * personFactor);
        persons.push(personCount);
        
        // 人脸数量通常小于人数
        let faceCount = Math.round(personCount * (0.5 + Math.random() * 0.3));
        faces.push(faceCount);
    }
    
    return { times, persons, faces };
}

// 生成性能矩阵数据
function getMockPerformanceData(cameraGroup) {
    // 不同摄像头组的性能特征
    const performances = {
        all: [85, 80, 75, 90, 70],
        group1: [92, 85, 78, 88, 75],
        group2: [78, 90, 72, 95, 68],
        group3: [86, 65, 70, 80, 88]
    };
    
    return [
        {
            value: performances[cameraGroup] || performances.all,
            name: cameraGroup === 'all' ? '平均性能' : cameraGroup + '性能'
        }
    ];
}

// 生成活动热点数据
function getMockActivityData(timeOfDay) {
    const data = [];
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    
    // 不同时段的活动模式
    let intensityPattern;
    
    if (timeOfDay === 'morning') {
        intensityPattern = [
            [10, 15, 20, 15, 10, 5, 10], // 00:00
            [5, 10, 15, 10, 5, 5, 5],     // 04:00
            [80, 85, 80, 85, 80, 40, 30], // 08:00
            [60, 65, 60, 65, 60, 50, 40], // 12:00
            [50, 55, 50, 55, 50, 60, 50], // 16:00
            [30, 35, 30, 35, 30, 40, 30]  // 20:00
        ];
    } else if (timeOfDay === 'noon') {
        intensityPattern = [
            [10, 15, 10, 15, 10, 5, 5],   // 00:00
            [5, 10, 5, 10, 5, 5, 5],      // 04:00
            [50, 55, 50, 55, 50, 30, 25], // 08:00
            [85, 90, 85, 90, 85, 60, 50], // 12:00
            [60, 65, 60, 65, 60, 45, 40], // 16:00
            [40, 45, 40, 45, 40, 35, 30]  // 20:00
        ];
    } else if (timeOfDay === 'evening') {
        intensityPattern = [
            [10, 15, 10, 15, 10, 5, 5],   // 00:00
            [5, 10, 5, 10, 5, 5, 5],      // 04:00
            [50, 55, 50, 55, 50, 30, 25], // 08:00
            [60, 65, 60, 65, 60, 50, 45], // 12:00
            [85, 90, 85, 90, 85, 55, 45], // 16:00
            [70, 75, 70, 75, 70, 60, 50]  // 20:00
        ];
    } else {
        // 默认模式
        intensityPattern = [
            [10, 15, 10, 15, 10, 5, 5],   // 00:00
            [5, 10, 5, 10, 5, 5, 5],      // 04:00
            [60, 65, 60, 65, 60, 35, 30], // 08:00
            [70, 75, 70, 75, 70, 55, 45], // 12:00
            [65, 70, 65, 70, 65, 50, 40], // 16:00
            [50, 55, 50, 55, 50, 45, 35]  // 20:00
        ];
    }
    
    // 根据模式生成数据
    for (let i = 0; i < hours.length; i++) {
        for (let j = 0; j < weekdays.length; j++) {
            // 添加一些随机波动
            let baseValue = intensityPattern[i][j];
            let value = Math.max(0, Math.min(100, baseValue + Math.round((Math.random() - 0.5) * 10)));
            
            data.push([j, i, value]);
        }
    }
    
    return data;
}

// 生成轨迹桑基图数据
function getMockTrajectoryData() {
    const nodes = [
        { name: '南出口' },
        { name: '北出口' },
        { name: '西出口' },
        { name: '东出口' },
    ];
    
    const links = [
        { source: '南出口', target: '北出口', value: 10 },
        { source: '南出口', target: '西出口', value: 20 },
        { source: '南出口', target: '东出口', value: 30 },
        { source: '北出口', target: '西出口', value: 15 },
        { source: '北出口', target: '东出口', value: 25 },
        { source: '西出口', target: '东出口', value: 35 }
    ];
    
    return { nodes, links };
}

// 生成时空关联数据
function getMockSpatiotemporalData(view) {
    const data = [];
    const areas = ['区域A', '区域B', '区域C', '区域D', '区域E'];
    
    // 不同区域之间的关联强度
    const correlationMatrix = [
        [100, 70, 30, 20, 10], // A与各区域的关联
        [70, 100, 50, 25, 15], // B与各区域的关联
        [30, 50, 100, 55, 25], // C与各区域的关联
        [20, 25, 55, 100, 60], // D与各区域的关联
        [10, 15, 25, 60, 100]  // E与各区域的关联
    ];
    
    // 生成相关性数据
    for (let i = 0; i < areas.length; i++) {
        for (let j = 0; j < areas.length; j++) {
            // 添加一些随机波动
            let baseValue = correlationMatrix[i][j];
            let value = Math.max(0, Math.min(100, baseValue + Math.round((Math.random() - 0.5) * 10)));
            
            data.push([i, j, value]);
        }
    }
    
    return data;
}

// 生成特征统计数据
function getMockFeatureData() {
    // 活动状态数据
    const activities = [
        { name: '站立', value: Math.round(Math.random() * 30 + 20) },
        { name: '行走', value: Math.round(Math.random() * 30 + 15) },
        { name: '奔跑', value: Math.round(Math.random() * 15 + 5) },
        { name: '坐着', value: Math.round(Math.random() * 20 + 10) },
        { name: '其他', value: Math.round(Math.random() * 10 + 5) }
    ];
    
    // 停留时长数据
    const durations = {
        categories: ['<1分钟', '1-5分钟', '5-15分钟', '15-30分钟', '>30分钟'],
        values: [
            Math.round(Math.random() * 20 + 10),
            Math.round(Math.random() * 30 + 20),
            Math.round(Math.random() * 25 + 15),
            Math.round(Math.random() * 15 + 5),
            Math.round(Math.random() * 10 + 3)
        ]
    };
    
    // 出现频率数据
    const frequencies = [
        { name: '首次出现', value: Math.round(Math.random() * 30 + 40) },
        { name: '重复出现', value: Math.round(Math.random() * 20 + 20) },
        { name: '频繁出现', value: Math.round(Math.random() * 10 + 10) }
    ];
    
    return { activities, durations, frequencies };
}

// 生成系统状态数据
function getMockSystemData() {
    return {
        cpu: Math.round(Math.random() * 40 + 30),
        memory: Math.round(Math.random() * 30 + 40),
        gpu: Math.round(Math.random() * 50 + 30),
        storage: Math.round(Math.random() * 20 + 30)
    };
} 