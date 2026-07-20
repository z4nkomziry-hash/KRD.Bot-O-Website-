// KrdDown - Smart Link Detection System
const SmartDetect = {
    // Platform patterns
    patterns: {
        tiktok: {
            domains: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com'],
            regex: /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|m\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+|video\/\d+|[\w]+\/?)/i,
            icon: 'fa-tiktok',
            color: '#ff0050',
            name: 'TikTok'
        },
        instagram: {
            domains: ['instagram.com', 'instagr.am', 'ig.me'],
            regex: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p\/|reel\/|stories\/|tv\/)[\w-]+/i,
            icon: 'fa-instagram',
            color: '#e1306c',
            name: 'Instagram'
        },
        youtube: {
            domains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
            regex: /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/i,
            icon: 'fa-youtube',
            color: '#ff0000',
            name: 'YouTube'
        },
        facebook: {
            domains: ['facebook.com', 'fb.com', 'fb.watch'],
            regex: /(?:https?:\/\/)?(?:www\.|web\.|m\.)?(?:facebook\.com|fb\.com|fb\.watch)\/(?:[\w.-]+\/videos\/|reel\/|watch\/\?v=|share\/)[\w.-]+/i,
            icon: 'fa-facebook',
            color: '#1877f2',
            name: 'Facebook'
        },
        snapchat: {
            domains: ['snapchat.com', 'snap.com'],
            regex: /(?:https?:\/\/)?(?:www\.)?snapchat\.com\/(?:add\/|spotlight\/|story\/)[\w.-]+/i,
            icon: 'fa-snapchat',
            color: '#fffc00',
            name: 'Snapchat'
        },
        pinterest: {
            domains: ['pinterest.com', 'pin.it', 'pinterest.co'],
            regex: /(?:https?:\/\/)?(?:www\.|[\w]+\.)?pinterest\.(?:com|co\.[\w]+)\/(?:pin\/|board\/)[\w.-]+/i,
            icon: 'fa-pinterest',
            color: '#e60023',
            name: 'Pinterest'
        }
    },

    // Detect platform from URL
    detect(url) {
        if (!url || !url.trim()) return null;
        
        const urlLower = url.toLowerCase().trim();
        
        for (const [key, pattern] of Object.entries(this.patterns)) {
            if (pattern.regex.test(urlLower)) {
                return {
                    platform: key,
                    ...pattern
                };
            }
        }
        
        // Check if it's a username (no URL pattern)
        if (/^@?[\w.-]{2,30}$/.test(urlLower)) {
            return {
                platform: 'username',
                icon: 'fa-user',
                color: '#a855f7',
                name: 'Username Search'
            };
        }
        
        return null;
    },

    // Extract video ID from URL
    extractId(url, platform) {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
            
            switch(platform) {
                case 'tiktok':
                    const tiktokMatch = urlObj.pathname.match(/\/video\/(\d+)/);
                    return tiktokMatch ? tiktokMatch[1] : null;
                case 'instagram':
                    const igMatch = urlObj.pathname.match(/\/(p|reel|tv)\/([\w-]+)/);
                    return igMatch ? igMatch[2] : null;
                case 'youtube':
                    if (urlObj.hostname.includes('youtu.be')) {
                        return urlObj.pathname.slice(1);
                    }
                    return urlObj.searchParams.get('v');
                default:
                    return Date.now().toString();
            }
        } catch {
            return Date.now().toString();
        }
    },

    // Validate URL format
    isValidUrl(url) {
        try {
            new URL(url.startsWith('http') ? url : 'https://' + url);
            return true;
        } catch {
            return false;
        }
    },

    // Get platform icon HTML
    getIconHtml(platform) {
        const pattern = this.patterns[platform];
        if (!pattern) return '<i class="fa-solid fa-link"></i>';
        return `<i class="fa-brands ${pattern.icon}" style="color: ${pattern.color}"></i>`;
    },

    // Show detection result in UI
    showDetectionBadge(result) {
        let existingBadge = document.getElementById('detectionBadge');
        if (existingBadge) existingBadge.remove();
        
        if (!result) return;
        
        const badge = document.createElement('div');
        badge.id = 'detectionBadge';
        badge.className = 'flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs font-bold animate-fadeIn';
        badge.style.cssText = `
            background: ${result.color}15;
            border: 1px solid ${result.color}40;
            color: ${result.color};
        `;
        badge.innerHTML = `
            <i class="fa-brands ${result.icon}"></i>
            <span>${result.name} - دەستنیشانکرا ✅</span>
        `;
        
        const inputWrapper = document.querySelector('.input-wrapper');
        if (inputWrapper) {
            inputWrapper.parentNode.insertBefore(badge, inputWrapper.nextSibling);
        }
        
        // Auto remove after 3 seconds
        setTimeout(() => badge.remove(), 3000);
    }
};

// ===== Auto-detect on input =====
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('tiktokUrl');
    if (!input) return;
    
    let detectTimeout;
    input.addEventListener('input', () => {
        clearTimeout(detectTimeout);
        detectTimeout = setTimeout(() => {
            const url = input.value.trim();
            if (url.length > 3) {
                const result = SmartDetect.detect(url);
                if (result && result.platform !== 'username') {
                    SmartDetect.showDetectionBadge(result);
                    
                    // Change input icon
                    const icon = document.getElementById('inputIcon');
                    if (icon) {
                        icon.className = `input-icon fa-brands ${result.icon}`;
                        icon.style.color = result.color;
                    }
                } else {
                    const icon = document.getElementById('inputIcon');
                    if (icon) {
                        icon.className = 'input-icon fa-solid fa-link';
                        icon.style.color = '';
                    }
                }
            }
        }, 500);
    });
    
    // Auto-paste from clipboard on focus
    input.addEventListener('focus', () => {
        if (!input.value && navigator.clipboard) {
            navigator.clipboard.readText().then(text => {
                const detected = SmartDetect.detect(text);
                if (detected && detected.platform !== 'username') {
                    input.value = text;
                    SmartDetect.showDetectionBadge(detected);
                    toast('لینک بە شێوەی خۆکار دۆزرایەوە! 🎯', 'fa-magnifying-glass');
                }
            }).catch(() => {});
        }
    });
});

// ===== Add animation CSS =====
const smartDetectStyle = document.createElement('style');
smartDetectStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(smartDetectStyle);
