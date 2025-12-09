// 背景圖片應用腳本
// 這個腳本負責將管理後台設定的背景圖片應用到實際網站

(function() {
    // 從 localStorage 載入設定
    function loadBackgroundSettings() {
        const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
        return {
            backgroundType: settings.backgroundType || 'gradient',
            backgroundImage: settings.backgroundImage,
            unsplashImage: settings.unsplashImage,
            overlayOpacity: settings.overlayOpacity || 40
        };
    }

    // 應用背景設定
    function applyBackgroundSettings() {
        const settings = loadBackgroundSettings();
        const heroElement = document.querySelector('.hero');
        
        if (!heroElement) return;

        // 移除現有的背景類別
        heroElement.classList.remove('has-background');
        
        // 根據設定類型應用背景
        switch (settings.backgroundType) {
            case 'image':
                if (settings.backgroundImage) {
                    applyCustomBackground(heroElement, settings.backgroundImage, settings.overlayOpacity);
                }
                break;
            
            case 'unsplash':
                if (settings.unsplashImage) {
                    applyCustomBackground(heroElement, settings.unsplashImage, settings.overlayOpacity);
                }
                break;
            
            case 'gradient':
            default:
                // 保持原有的漸層背景
                heroElement.style.removeProperty('--hero-bg-image');
                break;
        }
    }

    // 應用自定義背景
    function applyCustomBackground(element, imageUrl, overlayOpacity) {
        element.classList.add('has-background');
        element.style.setProperty('--hero-bg-image', `url("${imageUrl}")`);
        
        // 動態調整遮罩透明度
        const overlay = element.querySelector('::before') || element;
        const overlayValue = overlayOpacity / 100;
        
        // 建立或更新遮罩樣式
        let styleElement = document.getElementById('dynamic-hero-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-hero-styles';
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            .hero.has-background::before {
                background: rgba(0, 0, 0, ${overlayValue}) !important;
            }
        `;
    }

    // 等待 DOM 載入完成後執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBackgroundSettings);
    } else {
        applyBackgroundSettings();
    }

    // 監聽設定變更（當管理員在另一個分頁更新設定時）
    window.addEventListener('storage', function(e) {
        if (e.key === 'site_settings') {
            applyBackgroundSettings();
        }
    });

    // 提供全局函數供其他腳本調用
    window.updateHeroBackground = applyBackgroundSettings;
})();