// KrdDown Main Application Logic
let currentLang = getCurrentLang();
let currentMode = 'link';
let albumImages = [];
let searchHistory = JSON.parse(localStorage.getItem('tikjet_history') || '[]');
let currentActiveVideoUrl = '';
let deferredPrompt;
let activeGalleryList = [];
let activeGalleryIndex = 0;

// ===== DOM Content Loaded =====
window.addEventListener('DOMContentLoaded', () => {
    // Show welcome modal after delay
    setTimeout(() => {
        document.getElementById('welcomeModal').classList.add('show');
    }, 600);
    
    // Check for auto-paste from clipboard
    checkClipboardForUrl();
    
    // Initialize language
    changeLanguage(currentLang);
    document.getElementById('langSelect').value = currentLang;
    
    // Render history
    renderHistory();
    
    // Check theme
    applyStoredTheme();
});

// ===== Welcome Modal Functions =====
function selectNetwork(name, gradient) {
    document.getElementById('welcomeModal').classList.remove('show');
    const downloadBtn = document.getElementById('btnDownload');
    downloadBtn.style.background = gradient;
    toast(`تۆڕێ ${name} هاتە هەڵبژاردن! 🚀`, 'fa-circle-check');
}

// ===== Contact Modal =====
function openContactModal() {
    document.getElementById('contactModal').classList.add('show');
}

function closeContactModal(e) {
    if(e.target.id === 'contactModal') {
        document.getElementById('contactModal').classList.remove('show');
    }
}

// ===== PWA Installation =====
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!sessionStorage.getItem('pwa_dismissed') && !isIosDevice()) {
        setTimeout(() => {
            document.getElementById('pwaBanner').classList.add('show');
        }, 3000);
    }
});

function installPwa() {
    if (!deferredPrompt) return;
    document.getElementById('pwaBanner').classList.remove('show');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
}

function dismissPwa() {
    document.getElementById('pwaBanner').classList.remove('show');
    sessionStorage.setItem('pwa_dismissed', 'true');
}

function isIosDevice() {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

function isIsInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

// ===== Clipboard Auto-Paste =====
function checkClipboardForUrl() {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        navigator.clipboard.readText().then(text => {
            if (text && (text.includes('tiktok.com') || text.includes('instagram.com') || 
                        text.includes('facebook.com') || text.includes('pinterest.com') || 
                        text.includes('snapchat.com')) && document.getElementById('tiktokUrl').value === '') {
                document.getElementById('tiktokUrl').value = text;
                toast('لینکێ خۆکارانە پەیست بوو! 📋', 'fa-paste');
            }
        }).catch(() => { });
    }
}

// ===== Copy Functions =====
function copyCaptionText() {
    const desc = document.getElementById('previewDescription').textContent;
    if(!desc.trim()) return toast('چ دەق لڤێرە نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc).then(() => {
        toast('وەسف هاتە کۆپیکردن! 📋', 'fa-copy');
        const btnSpan = document.getElementById('txtCopyCap');
        btnSpan.textContent = 'کۆپی بوو! ✅';
        setTimeout(() => { btnSpan.textContent = langData[currentLang].copyText; }, 2000);
    });
}

// ===== Share Functions =====
function shareToSnapchat() {
    window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(window.location.href)}`, '_blank');
    toast('ڕەوانەی سناپچاتێ بوو! 💛', 'fa-snapchat');
}

function shareToTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("باشترین سایت بۆ دابەزاندنا ڤیدیۆیان! 🚀")}`, '_blank');
    toast('ڕەوانەی تێلێگرامێ بوو! 💙', 'fa-telegram');
}

// ===== Theme Management =====
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('tikjet_theme', isLight ? 'light' : 'dark');
    document.getElementById('themeIcon').className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    const l = langData[currentLang] || langData['badini'];
    document.getElementById('txtTheme').textContent = isLight ? l.themeLight : l.themeDark;
}

function applyStoredTheme() {
    const isLight = localStorage.getItem('tikjet_theme') === 'light';
    const body = document.body;
    const l = langData[currentLang] || langData['badini'];
    
    if (isLight) {
        body.classList.add('light-mode');
        document.getElementById('themeIcon').className = 'fa-solid fa-sun';
        document.getElementById('txtTheme').textContent = l.themeLight;
    } else {
        body.classList.remove('light-mode');
        document.getElementById('themeIcon').className = 'fa-solid fa-moon';
        document.getElementById('txtTheme').textContent = l.themeDark;
    }
}

// ===== Quick Guide =====
function toggleQuickGuide() { 
    document.getElementById('quickGuideBox').classList.toggle('hidden'); 
}

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    if (content.style.maxHeight) { 
        content.style.maxHeight = null; 
        icon.className = "fa-solid fa-chevron-down text-xs text-slate-500"; 
    } else { 
        content.style.maxHeight = content.scrollHeight + "px"; 
        icon.className = "fa-solid fa-chevron-up text-xs text-pink-500"; 
    }
}

// ===== Rating System =====
function submitRate(val) { 
    document.getElementById('rateThanks').classList.remove('hidden'); 
    toast(`تە ${val} ستێرە دان! ⭐`, 'fa-star'); 
}

// ===== Input Management =====
function clearInputField() {
    const inputField = document.getElementById('tiktokUrl');
    inputField.value = '';
    inputField.focus();
    toast('کادر هاتە پاککرن! 🧹', 'fa-trash-can');
}

function pasteLink() {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        navigator.clipboard.readText().then(text => {
            document.getElementById('tiktokUrl').value = text;
            toast('لینک پەیست بوو 📋', 'fa-paste');
        }).catch(() => { 
            toast('دەستەیری نینە بۆ پەیستکرنێ!', 'fa-exclamation-triangle'); 
        });
    } else {
        toast('وێبگەڕەکەت ڕێگە بە خوێندنەوەی بڵۆک کراو نادات.', 'fa-exclamation-triangle');
    }
}

// ===== Mode Switching =====
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const input = document.getElementById('tiktokUrl');
    const icon = document.getElementById('inputIcon');
    const l = langData[currentLang] || langData['badini'];
    
    if (mode === 'link') {
        document.getElementById('modeLink').classList.add('active');
        input.placeholder = l.placeholder;
        icon.className = "input-icon fa-solid fa-link";
    } else {
        document.getElementById('modeUsername').classList.add('active');
        input.placeholder = l.placeholderUser;
        icon.className = "input-icon fa-solid fa-at";
    }
}

// ===== Toast Notification =====
function toast(msg, icon = 'fa-circle-info') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
    c.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        t.style.transition = 'all 0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

// ===== Progress Animation =====
function animateProgress() {
    const bar = document.getElementById('liquidProgressBar');
    bar.style.width = '0%';
    setTimeout(() => bar.style.width = '40%', 200);
    setTimeout(() => bar.style.width = '75%', 600);
    setTimeout(() => bar.style.width = '100%', 1200);
    setTimeout(() => bar.style.width = '0%', 1600);
}

// ===== History Management =====
function renderHistory() {
    const container = document.getElementById('historyContainer');
    const section = document.getElementById('historySection');
    if (searchHistory.length === 0) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    container.innerHTML = '';
    searchHistory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-card';
        div.innerHTML = `
            <div class="flex items-center gap-3 truncate">
                <i class="fa-solid ${item.type === 'link' ? 'fa-link' : 'fa-at'} text-pink-500 text-xs"></i>
                <span class="text-xs font-semibold truncate cursor-pointer text-slate-300" onclick="loadHistoryItem(${index})">${item.value}</span>
            </div>
            <button onclick="deleteHistoryItem(${index})" class="text-[11px] text-slate-500 hover:text-rose-400"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(div);
    });
}

function saveToHistory(value, type) {
    searchHistory = searchHistory.filter(h => h.value !== value);
    searchHistory.unshift({ value, type });
    if (searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem('tikjet_history', JSON.stringify(searchHistory));
    renderHistory();
}

function deleteHistoryItem(index) { 
    searchHistory.splice(index, 1); 
    localStorage.setItem('tikjet_history', JSON.stringify(searchHistory)); 
    renderHistory(); 
}

function clearHistory() { 
    searchHistory = []; 
    localStorage.removeItem('tikjet_history'); 
    renderHistory(); 
}

function loadHistoryItem(index) { 
    const item = searchHistory[index]; 
    switchMode(item.type); 
    document.getElementById('tiktokUrl').value = item.value; 
}

// ===== Download Management =====
async function forceDownload(url, filename) {
    toast('داونلۆد دەستی پێکرد... 📥', 'fa-spinner fa-spin');
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error("CORS or network error");
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; 
        a.download = filename;
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        toast('داونلۆد تەواو بوو! ✅', 'fa-check-circle');
    } catch { 
        window.open(url, '_blank');
        toast('داونلۆد دەستی پێکرد لە پەنجەرەی نوێ! 🌐', 'fa-external-link');
    }
}

function downloadWithQuality(quality) {
    if (!currentActiveVideoUrl) return toast('هیچ میدیا نینە!', 'fa-times');
    toast(`کواڵیتیا ${quality} دهێتە حازرکرن... 🚀`, 'fa-circle-notch fa-spin');
    setTimeout(() => { forceDownload(currentActiveVideoUrl, `KrdDown_${quality}_video.mp4`); }, 1000);
}

function downloadPremiumQuality() {
    toast('بۆ دابەزاندنا 4K HDR، دێ هێیە ڕەوانەکرن... 🔒', 'fa-lock');
    setTimeout(() => {
        window.open('https://www.effectivecpmnetwork.com/pyz9djf0zb', '_blank');
        if (currentActiveVideoUrl) { forceDownload(currentActiveVideoUrl, 'KrdDown_4K_HDR.mp4'); }
    }, 1500);
}

function downloadAllPhotos() {
    if (albumImages.length === 0) return;
    albumImages.forEach((url, i) => { 
        setTimeout(() => forceDownload(url, `KrdDown_Image_${i+1}.jpg`), i * 400); 
    });
}

// ===== Main Download Function =====
async function downloadVideo() {
    let input = document.getElementById('tiktokUrl').value.trim();
    if (!input) return toast('تکایە دەقەکێ بنڤیسە!', 'fa-exclamation');
    
    animateProgress();
    const btn = document.getElementById('btnDownload');
    btn.disabled = true;
    
    document.getElementById('previewCard').classList.add('hidden');
    document.getElementById('photoCard').classList.add('hidden');
    document.getElementById('vipUserCard').classList.add('hidden');
    
    // Try Cobalt API first for universal downloads
    if (currentMode === 'link' && (!input.includes('tiktok.com') && !input.includes('vmt.io'))) {
        try {
            const response = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ url: input, vQuality: '720', filenamePattern: 'basic' })
            });
            const result = await response.json();
            
            if (result.status === 'redirect' || result.status === 'stream') {
                saveToHistory(input, currentMode);
                currentActiveVideoUrl = result.url;
                
                const pCard = document.getElementById('previewCard'); 
                pCard.classList.remove('hidden');
                document.getElementById('previewImage').classList.add('hidden'); 
                document.getElementById('previewVideo').classList.remove('hidden');
                
                document.getElementById('previewVideo').src = result.url;
                document.getElementById('previewAuthor').textContent = 'Social Media Media';
                document.getElementById('previewDescription').textContent = 'Ready to Download';
                document.getElementById('previewDownloadBtn').onclick = () => forceDownload(result.url, 'download.mp4');
                document.getElementById('previewDownloadAudioBtn').onclick = () => forceDownload(result.url, 'audio.mp3');
                
                toast('سەرکەفتی بوو! 🎉', 'fa-check');
                btn.disabled = false;
                return;
            }
        } catch {
            // Fallback to TikTok API
        }
    }
    
    // Use TikTok API
    try {
        let apiUrl = currentMode === 'link' 
            ? `https://www.tikwm.com/api/?url=${encodeURIComponent(input)}` 
            : `https://www.tikwm.com/api/user/posts?unique_id=${encodeURIComponent(input.replace('@',''))}&count=15`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.code === 0 && data.data) {
            saveToHistory(input, currentMode);
            if (currentMode === 'link') {
                const d = data.data;
                if (d.images && d.images.length > 0) {
                    albumImages = d.images;
                    const grid = document.getElementById('photoGrid'); grid.innerHTML = '';
                    d.images.forEach((url, i) => {
                        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
                        const container = document.createElement('div');
                        container.className = "relative group rounded-lg overflow-hidden";
                        container.innerHTML = `<img src="${proxyUrl}" class="w-full aspect-square object-cover" alt="Album Image" loading="lazy"><button onclick="forceDownload('${url}', 'img_${i}.jpg')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"><i class="fa-solid fa-download"></i></button>`;
                        grid.appendChild(container);
                    });
                    document.getElementById('photoCard').classList.remove('hidden');
                } else {
                    currentActiveVideoUrl = d.play;
                    const pCard = document.getElementById('previewCard'); pCard.classList.remove('hidden');
                    document.getElementById('previewImage').classList.add('hidden'); 
                    document.getElementById('previewVideo').classList.remove('hidden');
                    document.getElementById('previewVideo').src = d.play;
                    document.getElementById('previewAuthor').textContent = d.author.nickname || 'User';
                    document.getElementById('previewDescription').textContent = d.title || '';
                    document.getElementById('previewDownloadBtn').onclick = () => forceDownload(d.play, 'video.mp4');
                    document.getElementById('previewDownloadAudioBtn').onclick = () => forceDownload(d.music, 'music.mp3');
                }
            } else {
                // Username mode - show gallery
                const posts = data.data.videos;
                if(posts && posts.length > 0) {
                    const user = posts[0].author;
                    document.getElementById('vipAvatar').src = user.avatar; 
                    document.getElementById('vipName').textContent = user.nickname; 
                    document.getElementById('vipUsername').textContent = `@${user.unique_id}`;
                    document.getElementById('vipFollowers').textContent = 'N/A'; 
                    document.getElementById('vipHearts').textContent = 'N/A';
                    
                    const grid = document.getElementById('vipPostGrid'); grid.innerHTML = '';
                    activeGalleryList = posts.map(p => ({ url: `https://www.tiktok.com/@${user.unique_id}/video/${p.video_id}` }));

                    posts.forEach((p, idx) => {
                        const item = document.createElement('div');
                        item.className = "relative rounded-xl overflow-hidden aspect-square bg-slate-800 cursor-pointer group";
                        item.innerHTML = `<img src="${p.cover}" class="w-full h-full object-cover" alt="Cover" loading="lazy"><div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><i class="fa-solid fa-play text-white text-lg"></i></div>`;
                        item.onclick = () => { openCustomGallery(idx); };
                        grid.appendChild(item);
                    });
                    document.getElementById('vipUserCard').classList.remove('hidden');
                } else { 
                    toast('چو پۆست نەهاتنە دیتن!', 'fa-times'); 
                }
            }
            toast('سەرکەفتی بوو! 🎉', 'fa-check');
        } else { 
            toast('میدیا نەهاتە دیتن!', 'fa-times'); 
        }
    } catch { 
        toast('کێشەیەک هەیە د تۆرێ دا!', 'fa-times'); 
    }
    finally { 
        btn.disabled = false; 
    }
}

// ===== Gallery Functions =====
function loadTrendingVideo(url) {
    switchMode('link');
    document.getElementById('tiktokUrl').value = url;
    toast('ڤیدیۆیا ترێند هاتە جێگیرکرن!', 'fa-fire');
    document.getElementById('tiktokUrl').scrollIntoView({ behavior: 'smooth' });
}

async function openCustomGallery(index) {
    if(!activeGalleryList || activeGalleryList.length === 0) return;
    activeGalleryIndex = index;
    document.getElementById('customGalleryModal').style.display = 'flex';
    loadVideoInGalleryPopup();
}

async function loadVideoInGalleryPopup() {
    const currentItem = activeGalleryList[activeGalleryIndex];
    const videoElement = document.getElementById('galleryPopupVideo');
    videoElement.pause(); 
    videoElement.src = '';
    document.getElementById('galleryPopupAuthor').textContent = "...";
    document.getElementById('galleryPopupDesc').textContent = "دهێتە حازرکرن / Loading...";

    try {
        let directApiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(currentItem.url)}`;
        const res = await fetch(directApiUrl);
        const json = await res.json();
        
        if(json.code === 0 && json.data) {
            const d = json.data;
            videoElement.src = d.play;
            videoElement.play().catch(()=>{});
            document.getElementById('galleryPopupAuthor').textContent = d.author.nickname || 'User';
            document.getElementById('galleryPopupDesc').textContent = d.title || '';
            document.getElementById('galleryPopupDlBtn').onclick = () => forceDownload(d.play, `KrdDown_${d.id}.mp4`);
            document.getElementById('galleryPopupAudioBtn').onclick = () => forceDownload(d.music, `KrdDown_AUDIO_${d.id}.mp3`);
        } else {
            document.getElementById('galleryPopupDesc').textContent = "میدیا نەهاتە دیتن!";
        }
    } catch {
        document.getElementById('galleryPopupDesc').textContent = "کێشەیەک د تۆرێ دا هەیە";
    }
}

function navigateCustomGallery(direction) {
    if(activeGalleryList.length <= 1) return;
    activeGalleryIndex += direction;
    if(activeGalleryIndex >= activeGalleryList.length) activeGalleryIndex = 0;
    if(activeGalleryIndex < 0) activeGalleryIndex = activeGalleryList.length - 1;
    loadVideoInGalleryPopup();
}

function closeCustomGallery() {
    document.getElementById('galleryPopupVideo').pause();
    document.getElementById('customGalleryModal').style.display = 'none';
}

function copyGalleryCaption() {
    const desc = document.getElementById('galleryPopupDesc').textContent;
    if(!desc || desc.startsWith("دهێتە")) return toast('چ دەق نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc).then(() => { 
        toast('دەق هاتە کۆپیکردن! 📋', 'fa-copy'); 
    });
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

// ===== iOS PWA Banner =====
window.addEventListener('load', () => {
    if (isIosDevice() && !isIsInStandaloneMode()) {
        if (!sessionStorage.getItem('ios_pwa_dismissed')) {
            setTimeout(() => {
                const iosBanner = document.getElementById('iosPwaBanner');
                if (iosBanner) { iosBanner.classList.remove('hidden'); }
            }, 2500);
        }
    }
});

function dismissIosBanner() {
    const iosBanner = document.getElementById('iosPwaBanner');
    if (iosBanner) { iosBanner.classList.add('hidden'); }
    sessionStorage.setItem('ios_pwa_dismissed', 'true');
}
