// City Situation Awareness Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Fetch user cameras from API
    fetchUserCameras();
    

    // Add hotspot click events
    setupHotspotEvents();

});

// Fetch alerts from the backend API
function fetchAlerts() {
    fetch('/api/alerts/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update our alerts data
            alertsData = data;
            // Render the alerts
            renderAlerts(alertsData);
        })
        .catch(error => {
            console.error('Error fetching alerts:', error);
            showNotification('获取预警信息失败', 'error');
        });
}

// Fetch user cameras from the backend API
function fetchUserCameras() {
    fetch('/api/user-cameras/')
        .then(response => response.json())
        .then(cameras => {
            renderCameraList(cameras);
        })
        .catch(error => {
            console.error('Error fetching user cameras:', error);
            showNotification('获取监控列表失败', 'error');
        });
}


// Setup time-based visualization
function setupTimeBasedVisualization() {
    const timeButtons = document.querySelectorAll('.date-range button');
    if (!timeButtons.length) return;
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update heatmap based on selected time range
            const timeRange = this.textContent.trim();
            showNotification(`正在加载${timeRange}数据...`, 'info');
            
            setTimeout(() => {
                updateHeatmapData();
                showNotification(`已更新为${timeRange}热力图数据`, 'success');
            }, 1000);
        });
    });
}

// Format time for display
function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) {
        return `${diff}秒前`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}分钟前`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}小时前`;
    } else {
        return date.toLocaleString();
    }
}

// 全屏切换功能
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`全屏错误: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


// Setup  video list interactions
function setupVideoMainInteractions() {
    const mainVideo = document.querySelector('.mainVideo');
    const mainVideoTitle = document.getElementById('main-video-title');
    const mainVideoDescription = document.getElementById('main-video-description');
    const mainVideoPeople = document.getElementById('main-video-people');
    const mainVideoAlerts = document.getElementById('main-video-alerts');
    const mainVideoTime = document.getElementById('main-video-time');
    const mainVideoDetailBtn = document.getElementById('main-video-detail-btn');
    const mainVideoFullscreenBtn = document.getElementById('main-video-fullscreen-btn');
    const cameraFeeds = document.querySelectorAll('.camera-feed');
    const cameraDetailBtns = document.querySelectorAll('.camera-detail-btn');
    
    if (!mainVideo || !mainVideoTitle || !mainVideoDescription || !cameraFeeds.length) {
        console.warn('主视频元素或视频列表未找到');
        return;
    }
    
    // 设置主视频详情按钮点击事件
    if (mainVideoDetailBtn) {
        mainVideoDetailBtn.addEventListener('click', function() {
            const activeCamera = document.querySelector('.camera-feed.active');
            if (activeCamera) {
                const cameraId = activeCamera.getAttribute('data-id');
                const cameraName = mainVideoTitle.textContent;
                
                // 跳转到详情页
                window.location.href = `monitor-detail?id=${cameraId}`;
                
                // 显示通知
                showNotification(`正在加载 ${cameraName} 的详细监控信息...`, 'info');
            }
        });
    }

    if (mainVideoFullscreenBtn) {
        mainVideoFullscreenBtn.addEventListener('click', function() {
            toggleFullscreen(mainVideo);
        });
    }
}

function setupVideoListInteractions(){
    const cameraFeeds = document.querySelectorAll('.camera-feed');
    const cameraDetailBtns = document.querySelectorAll('.camera-detail-btn');  

    // 设置摄像头"查看"按钮点击事件
    setupCameraDetailButtons();
    
    //为监控点列表每个卡片添加点击事件
    cameraFeeds.forEach(feed => {
        feed.addEventListener('click', () => {
            //移除所有卡片的激活状态
            console.log(feed)
            cameraFeeds.forEach(item => item.classList.remove('active'));
            
            //添加当前卡片的激活状态
            feed.classList.add('active')

            //获取当前卡片的数据
            videoElement = feed.querySelector(".videoElement")

            updateMainVideo(videoElement)
        })
    })
}

// 设置摄像头"查看"按钮点击事件
function setupCameraDetailButtons() {
    const viewButtons = document.querySelectorAll('.action-btn.view');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 阻止事件冒泡，防止触发卡片的点击事件
            e.stopPropagation();
            
            // 获取摄像头ID
            const cameraId = this.getAttribute('data-id');
            const cameraName = this.getAttribute('data-name');
            
            // 跳转到详情页
            window.location.href = `monitor-detail?id=${cameraId}`;
            
            // 显示通知
            showNotification(`正在加载 ${cameraName} 的详细监控信息...`, 'info');
        });
    });
}

// Render camera list
function renderCameraList(cameras) {
    const monitoringContainer = document.querySelector('.monitoring-container');
    if (!monitoringContainer) return;

    monitoringContainer.innerHTML = '';
    
    // 创建主视频区域
    const mainVideoContainer = document.createElement('div');
    mainVideoContainer.className = 'main-video-container';
    mainVideoContainer.innerHTML = `
        <div class="main-video-preview">
            <video class="mainVideo" muted autoplay width="1024" height="576">Your browser is too old which doesn't support HTML5 video.</video>
            <div class="main-video-status">
               在线
            </div>
        </div>
        <div class="main-video-overlay">
            <div class="main-video-info">
                <div class="main-video-details">
                    <div class="main-video-title">
                        <i class="fas fa-map-marker-alt"></i>
                        <span id="main-video-title">选择摄像头</span>
                    </div>
                    <div class="main-video-description" id="main-video-description">
                        请选择一个摄像头查看详情
                    </div>
                    <div class="main-video-stats">
                        <span class="stat">
                            <i class="fas fa-users"></i>
                            <span id="main-video-people">0人</span>
                        </span>
                        <span class="stat">
                            <i class="fas fa-exclamation-circle"></i>
                            <span id="main-video-alerts">0告警</span>
                        </span>
                        <span class="stat">
                            <i class="fas fa-clock"></i>
                            <span id="main-video-time">更新于 刚刚</span>
                        </span>
                    </div>
                </div>
                <div class="main-video-actions">
                    <button class="main-video-btn" id="main-video-detail-btn">
                        <i class="fas fa-external-link-alt"></i>
                        查看详情
                    </button>
                    <button class="main-video-btn" id="main-video-fullscreen-btn">
                        <i class="fas fa-expand"></i>
                        全屏
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 创建视频列表容器
    const videoListContainer = document.createElement('div');
    videoListContainer.className = 'video-list-container';
    videoListContainer.innerHTML = `
        <div class="video-list-header">
            <div class="video-list-title">监控点列表</div>
        </div>
        <div class="video-list"></div>
    `;
    
    // 添加主视频区域和视频列表容器到监控容器
    monitoringContainer.appendChild(mainVideoContainer);
    monitoringContainer.appendChild(videoListContainer);
    
    // 获取视频列表元素
    const videoList = videoListContainer.querySelector('.video-list');
    
    cameras.forEach(camera => {
        const cameraElement = document.createElement('div');
        cameraElement.className = 'camera-feed';
        cameraElement.setAttribute('data-id', camera.id);
        cameraElement.setAttribute('data-title', camera.location);
        cameraElement.setAttribute('data-description', camera.description || '');
        cameraElement.setAttribute('data-people', '4');
        cameraElement.setAttribute('data-alerts', '0');
        cameraElement.setAttribute('data-time', new Date().toLocaleTimeString());
        
        cameraElement.innerHTML = `
            <div class="camera-preview">
                <video class="videoElement" autoplay muted></video>
                <div class="camera-status status-online">
                    在线
                </div>
                <div class="camera-favorite ${camera.is_favorite ? 'active' : ''}" data-id="${camera.id}">
                    <i class="fas fa-star"></i>
                </div>
            </div>
            <div class="camera-info">
                <h3 class="camera-name">${camera.camera_name}</h3>
                <div class="camera-location">
                    <i class="fas fa-map-marker-alt"></i> ${camera.location || '未知位置'}
                </div>
                <div class="camera-id">ID: ${camera.id}</div>
                <div class="camera-actions">
                    <button class="action-btn view" title="查看详情" data-id="${camera.id}" data-name="${camera.camera_name}" data-location="${camera.location || '未知位置'}">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="action-btn edit" title="编辑设置">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                </div>
            </div>
        `;
        
        videoList.appendChild(cameraElement);
        
        // 设置视频播放
        const videoElement = cameraElement.querySelector('.videoElement');
        if (videoElement) {
            // 使用摄像头的 stream_url
            videoElement.setAttribute('src_stream', camera.stream_url);
            playFlvVideo(camera.stream_url, videoElement);
        }
    });

    //设置列表卡片交互
    setupVideoListInteractions();
    

    // 设置第一个摄像头为激活状态并更新主视频
    const firstCamera = videoList.querySelector('.camera-feed');
    if (firstCamera) {
        firstCamera.classList.add('active');
        const firstVideoElement = firstCamera.querySelector('.videoElement');
        if (firstVideoElement) {
            updateMainVideo(firstVideoElement);
        }
    } 
}

// 添加一个变量来保存当前视频流 URL
let currentStreamUrl = null;

// 更新主视频显示
function updateMainVideo(videoElement) {
    const mainVideo = document.querySelector('.mainVideo');
    const mainVideoTitle = document.getElementById('main-video-title');
    const mainVideoDescription = document.getElementById('main-video-description');
    const mainVideoPeople = document.getElementById('main-video-people');
    const mainVideoAlerts = document.getElementById('main-video-alerts');
    const mainVideoTime = document.getElementById('main-video-time');
    
    if (!mainVideo || !mainVideoTitle || !mainVideoDescription) {
        console.error('主视频元素或视频列表未找到');
        return;
    }
    
    // 获取父元素（camera-feed）
    const cameraFeed = videoElement.closest('.camera-feed');
    if (!cameraFeed) {
        console.error('未找到摄像头父元素');
        return;
    }
    
    // 更新主视频信息
    mainVideoTitle.textContent = cameraFeed.getAttribute('data-title');
    mainVideoDescription.textContent = cameraFeed.getAttribute('data-description');
    mainVideoPeople.textContent = cameraFeed.getAttribute('data-people');
    mainVideoAlerts.textContent = cameraFeed.getAttribute('data-alerts');
    mainVideoTime.textContent = cameraFeed.getAttribute('data-time');
    
    // 获取摄像头视频流并播放
    const srcStream = videoElement.getAttribute('src_stream');
    if (srcStream) {
        // 使用 requestAnimationFrame 确保在下一帧执行
        requestAnimationFrame(() => {
            console.log('更新主视频', srcStream, mainVideo)
            playFlvVideo(srcStream, mainVideo);
        });
    }
    setupVideoMainInteractions()
}   

