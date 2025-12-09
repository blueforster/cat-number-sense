// 主要的 JavaScript 功能

document.addEventListener('DOMContentLoaded', function() {
    // 平滑滾動功能
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 動態載入效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 為卡片元素添加淡入效果
    const cards = document.querySelectorAll('.post-card, .video-card, .blog-post');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 響應式導航選單（如果需要漢堡選單）
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.menu-toggle')) {
                const menuToggle = document.createElement('button');
                menuToggle.className = 'menu-toggle';
                menuToggle.innerHTML = '☰';
                menuToggle.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #2c3e50;
                `;
                
                nav.insertBefore(menuToggle, navMenu);
                
                menuToggle.addEventListener('click', () => {
                    navMenu.style.display = navMenu.style.display === 'none' ? 'flex' : 'none';
                });
            }
        } else {
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
                navMenu.style.display = 'flex';
            }
        }
    };

    // 初始化響應式選單
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // 為外部連結添加新視窗開啟
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // 簡單的載入動畫
    const pageLoader = () => {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        loader.innerHTML = '<div style="width: 40px; height: 40px; border: 3px solid #3498db; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
        
        // 添加旋轉動畫
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
        
        // 頁面載入完成後移除載入動畫
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.remove();
                    }
                }, 300);
            }, 500);
        });
    };

    // 只在頁面首次載入時顯示載入動畫
    if (document.readyState === 'loading') {
        pageLoader();
    }

    // 瀏覽人數統計功能
    const viewCounter = {
        // 使用 localStorage 模擬簡單的瀏覽統計
        getViews: function(postId) {
            const views = localStorage.getItem(`views_${postId}`) || 0;
            return parseInt(views);
        },
        
        incrementViews: function(postId) {
            const currentViews = this.getViews(postId);
            const newViews = currentViews + 1;
            localStorage.setItem(`views_${postId}`, newViews);
            return newViews;
        },
        
        initPageViews: function() {
            // 檢測當前頁面並增加瀏覽次數
            const path = window.location.pathname;
            let postId = null;
            
            if (path.includes('sample-post.html')) {
                postId = 'sample-post';
            } else if (path.includes('getting-started.html')) {
                postId = 'getting-started';
            }
            
            if (postId) {
                // 增加當前文章的瀏覽次數
                const views = this.incrementViews(postId);
                const viewElement = document.getElementById('current-post-views');
                if (viewElement) {
                    viewElement.textContent = views;
                }
            }
            
            // 更新所有瀏覽次數顯示
            this.updateViewDisplays();
        },
        
        updateViewDisplays: function() {
            // 更新部落格列表頁面的瀏覽次數
            const sampleViews = this.getViews('sample-post');
            const gettingStartedViews = this.getViews('getting-started');
            
            const sampleElement = document.getElementById('views-sample');
            const gettingStartedElement = document.getElementById('views-getting-started');
            
            if (sampleElement) {
                sampleElement.textContent = sampleViews;
            }
            
            if (gettingStartedElement) {
                gettingStartedElement.textContent = gettingStartedViews;
            }
            
            // 更新側邊欄的熱門文章瀏覽次數
            const viewCounts = document.querySelectorAll('.view-count');
            viewCounts.forEach((element, index) => {
                if (index === 0) {
                    element.textContent = sampleViews;
                } else if (index === 1) {
                    element.textContent = gettingStartedViews;
                }
            });
        }
    };
    
    // 初始化瀏覽次數統計
    viewCounter.initPageViews();
    
    // 每隔 5 秒更新一次顯示（模擬即時更新）
    setInterval(() => {
        viewCounter.updateViewDisplays();
    }, 5000);

    console.log('網站已載入完成！歡迎來到我的個人網站 🎉');
});

// ========= 文章互動功能 =========

// 初始化文章互動功能
function initializePostEngagement(postId) {
    loadReactionCounts(postId);
    loadUserReactions(postId);
}

// 載入反應計數
function loadReactionCounts(postId) {
    const reactions = getPostReactions(postId);
    
    document.getElementById(`like-count-${postId}`).textContent = reactions.like || 0;
    document.getElementById(`love-count-${postId}`).textContent = reactions.love || 0;
    document.getElementById(`useful-count-${postId}`).textContent = reactions.useful || 0;
}

// 載入用戶反應狀態
function loadUserReactions(postId) {
    const userReactions = getUserReactions(postId);
    
    Object.keys(userReactions).forEach(reactionType => {
        if (userReactions[reactionType]) {
            const btn = document.getElementById(`${reactionType}-btn-${postId}`);
            if (btn) btn.classList.add('active');
        }
    });
}

// 獲取文章反應資料
function getPostReactions(postId) {
    const reactions = localStorage.getItem(`post_reactions_${postId}`);
    return reactions ? JSON.parse(reactions) : { like: 0, love: 0, useful: 0 };
}

// 保存文章反應資料
function savePostReactions(postId, reactions) {
    localStorage.setItem(`post_reactions_${postId}`, JSON.stringify(reactions));
}

// 獲取用戶反應狀態
function getUserReactions(postId) {
    const userReactions = localStorage.getItem(`user_reactions_${postId}`);
    return userReactions ? JSON.parse(userReactions) : { like: false, love: false, useful: false };
}

// 保存用戶反應狀態
function saveUserReactions(postId, userReactions) {
    localStorage.setItem(`user_reactions_${postId}`, JSON.stringify(userReactions));
}

// 切換按讚
function toggleLike(postId) {
    toggleReaction(postId, 'like');
}

// 切換反應
function toggleReaction(postId, reactionType) {
    const reactions = getPostReactions(postId);
    const userReactions = getUserReactions(postId);
    const btn = document.getElementById(`${reactionType}-btn-${postId}`);
    const countElement = document.getElementById(`${reactionType}-count-${postId}`);
    
    // 切換用戶反應狀態
    const wasActive = userReactions[reactionType];
    userReactions[reactionType] = !wasActive;
    
    // 更新計數
    if (wasActive) {
        reactions[reactionType] = Math.max(0, (reactions[reactionType] || 0) - 1);
        btn.classList.remove('active');
    } else {
        reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        btn.classList.add('active');
        
        // 添加動畫效果
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }
    
    // 更新顯示
    countElement.textContent = reactions[reactionType];
    
    // 保存資料
    savePostReactions(postId, reactions);
    saveUserReactions(postId, userReactions);
    
    // 顯示感謝訊息
    if (!wasActive) {
        showToast(`感謝您的${getReactionText(reactionType)}！`);
    }
}

// 獲取反應文字
function getReactionText(reactionType) {
    const texts = {
        like: '按讚',
        love: '喜歡',
        useful: '實用'
    };
    return texts[reactionType] || '反應';
}

// 顯示提示訊息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 2000);
}

// 分享到 Facebook
function shareToFacebook() {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    openShareWindow(shareUrl, 'Facebook');
}

// 分享到 Twitter
function shareToTwitter() {
    const url = window.location.href;
    const title = document.title;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    openShareWindow(shareUrl, 'Twitter');
}

// 分享到 LINE
function shareToLine() {
    const url = window.location.href;
    const title = document.title;
    const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    openShareWindow(shareUrl, 'LINE');
}

// 複製連結
function copyToClipboard() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyToClipboard(url);
        });
    } else {
        fallbackCopyToClipboard(url);
    }
}

// 備用複製方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        showToast('複製失敗，請手動複製網址');
    }
    
    document.body.removeChild(textArea);
}

// 顯示複製成功
function showCopySuccess() {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.text').textContent = '已複製！';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.text').textContent = '複製連結';
        }, 2000);
    }
    
    showToast('連結已複製到剪貼簿！');
}

// 開啟分享視窗
function openShareWindow(url, platform) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
        url,
        `share_${platform}`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    showToast(`正在開啟 ${platform} 分享視窗...`);
}

// 添加 CSS 動畫
const engagementStyle = document.createElement('style');
engagementStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(engagementStyle);