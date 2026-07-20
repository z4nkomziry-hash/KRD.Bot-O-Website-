// KrdDown v3.0 - Premium App Logic
// Clean, minimal, efficient

let currentPlatform = 'tiktok';
let currentVideoUrl = '';
let currentMode = 'link';

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initInputListener();
    initPlatformButtons();
    loadLanguage();
});

// ===== Input Listener =====
function initInputListener() {
    const input = document.getElementById('tiktokUrl');
    const clearBtn = document.getElementById('clearBtn');
    
    if (!input || !clearBtn) return;
    
    input.addEventListener('input', () => {
        clearBtn.classList.toggle('hidden', input.value.length === 0);
    });
}

// ===== Platform Selection =====
function initPlatformButtons() {
    const buttons = document.querySelectorAll('.platform-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.dataset.platform;
        });
    });
}

function selectPlatform(platform) {
    currentPlatform = platform;
    const buttons = document.querySelectorAll('.platform-btn');
    buttons.forEach(b => {
        b.classList.toggle('active', b.dataset.platform === platform);
    });
    toast(`پلاتفۆرمی ${platform} هەڵبژێردرا`, 'fa-check-circle');
}

// ===== Clear Input =====
function clearInputField() {
    const input = document.getElementById('tiktokUrl');
    const clearBtn = document.getElementById('clearBtn');
    if (input) {
        input.value = '';
        input.focus();
        if (clearBtn) clearBtn.classList.add('hidden');
    }
}

// ===== Paste Link =====
function pasteLink() {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then(text => {
            const input = document.getElementById('tiktokUrl');
            const clearBtn = document.getElementById('clearBtn');
            if (input) {
                input.value = text;
                if (clearBtn) clearBtn.classList.remove('hidden');
            }
            toast('لینک پەیست کرا', 'fa-paste');
        }).catch(() => {
            toast('ناتوانرێت پەیست بکرێت', 'fa-times');
        });
    }
}

// ===== Toggle Guide =====
function toggleGuide() {
    const guide = document.getElementById('guideSection');
    if (guide) {
        guide.classList.toggle('hidden');
        if (!guide.classList.contains('hidden')) {
            guide.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ===== Toggle FAQ =====
function toggleFaq(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isOpen = content.classList.contains('open');
    
    // Close all FAQs
    document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.faq-trigger i').forEach(i => {
        i.classList.remove('fa-minus');
        i.classList.add('fa-plus');
    });
    
    if (!isOpen) {
        content.classList.add('open');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

// ===== Share to Telegram =====
function shareToTelegram() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('🚀 باشترین داونلۆدەری ڤیدیۆ - KrdDown');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

// ===== Download Video =====
async function downloadVideo() {
    const input = document.getElementById('tiktokUrl');
    const url = input?.value?.trim();
    
    if (!url) {
        toast('تکایە لینکی ڤیدیۆ بنووسە', 'fa-exclamation-circle');
        return;
    }
    
    // Show progress
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const btn = document.getElementById('btnDownload');
    
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (progressBar) progressBar.style.width = '0%';
    if (btn) btn.disabled = true;
    
    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) {
            progress = 90;
            clearInterval(interval);
        }
        if (progressBar) progressBar.style.width = `${progress}%`;
    }, 300);
    
    try {
        // Try TikTok API
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        clearInterval(interval);
        
        if (data.code === 0 && data.data) {
            const d = data.data;
            currentVideoUrl = d.play || d.hdplay || d.wmplay;
            
            // Update progress
            if (progressBar) progressBar.style.width = '100%';
            
            // Show preview
            showPreview(d);
            
            toast('سەرکەوتوو بوو! 🎉', 'fa-check-circle');
        } else {
            // Try Cobalt API
            const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ url: url })
            });
            const cobaltData = await cobaltRes.json();
            
            if (cobaltData.url) {
                currentVideoUrl = cobaltData.url;
                if (progressBar) progressBar.style.width = '100%';
                showPreview({ play: cobaltData.url, title: 'Video', author: { nickname: 'Ready' } });
                toast('سەرکەوتوو بوو! 🎉', 'fa-check-circle');
            } else {
                throw new Error('Download failed');
            }
        }
    } catch (e) {
        if (progressBar) progressBar.style.width = '0%';
        toast('کێشەیەک ڕوویدا، دووبارە هەوڵ بدە', 'fa-times-circle');
    } finally {
        if (btn) btn.disabled = false;
        setTimeout(() => {
            if (progressContainer) progressContainer.classList.add('hidden');
        }, 1500);
    }
}

// ===== Show Preview =====
function showPreview(data) {
    const section = document.getElementById('previewSection');
    const video = document.getElementById('previewVideo');
    const image = document.getElementById('previewImage');
    const author = document.getElementById('previewAuthor');
    const desc = document.getElementById('previewDescription');
    const platform = document.getElementById('previewPlatform');
    const dlBtn = document.getElementById('previewDownloadBtn');
    const audioBtn = document.getElementById('previewAudioBtn');
    
    if (!section) return;
    
    section.classList.remove('hidden');
    
    if (data.images && data.images.length > 0) {
        if (video) video.classList.add('hidden');
        if (image) {
            image.classList.remove('hidden');
            image.src = data.images[0];
        }
    } else {
        if (image) image.classList.add('hidden');
        if (video) {
            video.classList.remove('hidden');
            video.src = data.play || currentVideoUrl;
        }
    }
    
    if (author) author.textContent = data.author?.nickname || 'بێ ناو';
    if (desc) desc.textContent = data.title || 'ئامادەی داونلۆد';
    if (platform) platform.textContent = currentPlatform;
    
    if (dlBtn) dlBtn.onclick = () => {
        if (currentVideoUrl) {
            window.open(currentVideoUrl, '_blank');
            toast('داونلۆد دەستی پێکرد', 'fa-download');
        }
    };
    
    if (audioBtn) audioBtn.onclick = () => {
        if (data.music) {
            window.open(data.music, '_blank');
            toast('دەنگ داونلۆد کرا', 'fa-music');
        }
    };
    
    section.scrollIntoView({ behavior: 'smooth' });
}

// ===== Download Quality =====
function downloadQuality(quality) {
    if (!currentVideoUrl) {
        toast('سەرەتا ڤیدیۆ بدۆزەرەوە', 'fa-exclamation-circle');
        return;
    }
    toast(`کوالێتی ${quality} داونلۆد دەکرێت...`, 'fa-spinner');
    setTimeout(() => {
        window.open(currentVideoUrl, '_blank');
    }, 500);
}

// ===== Theme Toggle =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('themeIcon');
    const isLight = document.body.classList.contains('light-mode');
    
    if (icon) {
        icon.className = isLight ? 'fa-solid fa-sun text-sm' : 'fa-solid fa-moon text-sm';
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Apply saved theme
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'fa-solid fa-sun text-sm';
    }
})();

// ===== Toast =====
function toast(msg, icon = 'fa-circle-info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid ${icon} text-violet-400"></i> ${msg}`;
    container.appendChild(t);
    
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        t.style.transition = 'all 0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

// ===== Language =====
function loadLanguage() {
    // Simple language support
    const lang = localStorage.getItem('lang') || 'badini';
    const select = document.getElementById('langSelect');
    if (select) select.value = lang;
}

function changeLanguage(lang) {
    localStorage.setItem('lang', lang);
    // In production, this would load translations
    toast('زمان گۆڕدرا', 'fa-language');
}
