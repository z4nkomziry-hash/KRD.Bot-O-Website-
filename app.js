// KrdDown - Updated Main App Logic (app.js)
// Version: 2.0 - All Features Integrated

// ===== Global State =====
let currentLang = getCurrentLang();
let currentMode = 'link';
let albumImages = [];
let searchHistory = JSON.parse(localStorage.getItem('tikjet_history') || '[]');
let currentActiveVideoUrl = '';
let deferredPrompt;
let activeGalleryList = [];
let activeGalleryIndex = 0;

// ===== Initialize Everything =====
window.addEventListener('DOMContentLoaded', () => {
    // Show welcome modal
    setTimeout(() => {
        document.getElementById('welcomeModal')?.classList.add('show');
    }, 600);
    
    // Initialize language
    changeLanguage(currentLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    // Render history
    renderHistory();
    
    // Apply stored theme
    applyStoredTheme();
    
    // Initialize all systems
    if (typeof BatchDownload !== 'undefined') BatchDownload.init();
    if (typeof Analytics !== 'undefined') Analytics.init();
    if (typeof ReferralSystem !== 'undefined') ReferralSystem.init();
    if (typeof ExtendedPlatforms !== 'undefined') ExtendedPlatforms.createPlatformShowcase();
    if (typeof UI !== 'undefined') {
        UI.initScrollAnimations();
        UI.initParallax();
    }
    
    // Load trending videos
    setTimeout(loadTrendingSection, 1500);
});

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
    const theme = localStorage.getItem('tikjet_theme') || 'dark';
    const body = document.body;
    const l = langData[currentLang] || langData['badini'];
    
    body.classList.remove('light-mode', 'oled-mode', 'sepia-mode');
    
    switch(theme) {
        case 'light':
            body.classList.add('light-mode');
            document.getElementById('themeIcon').className = 'fa-solid fa-sun';
            document.getElementById('txtTheme').textContent = l.themeLight;
            break;
        case 'oled':
            body.classList.add('oled-mode');
            document.getElementById('themeIcon').className = 'fa-solid fa-circle';
            document.getElementById('txtTheme').textContent = 'OLED';
            break;
        case 'sepia':
            body.classList.add('sepia-mode');
            document.getElementById('themeIcon').className = 'fa-solid fa-book';
            document.getElementById('txtTheme').textContent = 'Sepia';
            break;
        default:
            document.getElementById('themeIcon').className = 'fa-solid fa-moon';
            document.getElementById('txtTheme').textContent = l.themeDark;
    }
}

// ===== Welcome Modal =====
function selectNetwork(name, gradient) {
    document.getElementById('welcomeModal')?.classList.remove('show');
    const downloadBtn = document.getElementById('btnDownload');
    if (downloadBtn) downloadBtn.style.background = gradient;
    toast(`تۆڕێ ${name} هاتە هەڵبژاردن! 🚀`, 'fa-circle-check');
}

// ===== Contact Modal =====
function openContactModal() {
    document.getElementById('contactModal')?.classList.add('show');
}

function closeContactModal(e) {
    if(e.target.id === 'contactModal') {
        document.getElementById('contactModal')?.classList.remove('show');
    }
}

// ===== Quick Guide =====
function toggleQuickGuide() { 
    document.getElementById('quickGuideBox')?.classList.toggle('hidden'); 
}

// ===== FAQ =====
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

// ===== Rating =====
function submitRate(val) { 
    const thanks = document.getElementById('rateThanks');
    if (thanks) {
        thanks.classList.remove('hidden');
        thanks.textContent = langData[currentLang]?.thanks || 'Thanks! 🌟';
    }
    toast(`تە ${val} ستێرە دان! ⭐`, 'fa-star');
    
    // Trigger celebration
    if (val >= 4 && typeof UI !== 'undefined') {
        UI.celebrate();
    }
}

// ===== Input Management =====
function clearInputField() {
    const input = document.getElementById('tiktokUrl');
    if (input) {
        input.value = '';
        input.focus();
    }
    toast('کادر هاتە پاککرن! 🧹', 'fa-trash-can');
}

function pasteLink() {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        navigator.clipboard.readText().then(text => {
            const input = document.getElementById('tiktokUrl');
            if (input) input.value = text;
            toast('لینک پەیست بوو 📋', 'fa-paste');
        }).catch(() => { 
            toast('دەستەیری نینە بۆ پەیستکرنێ!', 'fa-exclamation-triangle'); 
        });
    }
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const input = document.getElementById('tiktokUrl');
    const icon = document.getElementById('inputIcon');
    const l = langData[currentLang] || langData['badini'];
    
    if (mode === 'link') {
        document.getElementById('modeLink')?.classList.add('active');
        if (input) input.placeholder = l.placeholder;
        if (icon) icon.className = "input-icon fa-solid fa-link";
    } else {
        document.getElementById('modeUsername')?.classList.add('active');
        if (input) input.placeholder = l.placeholderUser;
        if (icon) icon.className = "input-icon fa-solid fa-at";
    }
}

// ===== PWA Functions =====
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!sessionStorage.getItem('pwa_dismissed') && !isIosDevice()) {
        setTimeout(() => {
            document.getElementById('pwaBanner')?.classList.add('show');
        }, 3000);
    }
});

function installPwa() {
    if (!deferredPrompt) return;
    document.getElementById('pwaBanner')?.classList.remove('show');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
}

function dismissPwa() {
    document.getElementById('pwaBanner')?.classList.remove('show');
    sessionStorage.setItem('pwa_dismissed', 'true');
}

function isIosDevice() {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

window.addEventListener('load', () => {
    if (isIosDevice() && !(('standalone' in window.navigator) && window.navigator.standalone)) {
        if (!sessionStorage.getItem('ios_pwa_dismissed')) {
            setTimeout(() => {
                document.getElementById('iosPwaBanner')?.classList.remove('hidden');
            }, 2500);
        }
    }
});

function dismissIosBanner() {
    document.getElementById('iosPwaBanner')?.classList.add('hidden');
    sessionStorage.setItem('ios_pwa_dismissed', 'true');
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

// ===== Copy Functions =====
function copyCaptionText() {
    const desc = document.getElementById('previewDescription')?.textContent;
    if(!desc?.trim()) return toast('چ دەق لڤێرە نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc).then(() => {
        toast('وەسف هاتە کۆپیکردن! 📋', 'fa-copy');
    });
}

function copyGalleryCaption() {
    const desc = document.getElementById('galleryPopupDesc')?.textContent;
    if(!desc || desc.startsWith("دهێتە")) return toast('چ دەق نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc).then(() => { 
        toast('دەق هاتە کۆپیکردن! 📋', 'fa-copy'); 
    });
}

// ===== Progress Animation =====
function animateProgress() {
    const bar = document.getElementById('liquidProgressBar');
    if (!bar) return;
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
    if (!container || !section) return;
    
    if (searchHistory.length === 0) { 
        section.classList.add('hidden'); 
        return; 
    }
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
    if (searchHistory.length > 10) searchHistory.pop();
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
    toast('مێژوو پاککرایەوە! 🧹', 'fa-check');
}

function loadHistoryItem(index) { 
    const item = searchHistory[index]; 
    if (item) {
        switchMode(item.type); 
        const input = document.getElementById('tiktokUrl');
        if (input) input.value = item.value;
    }
}

// ===== Download Functions =====
async function forceDownload(url, filename) {
    if (typeof DownloadProgress !== 'undefined') {
        const progress = DownloadProgress.simulateProgress(2000);
        
        try {
            const response = await fetch(url);
            if(!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl; 
            a.download = filename;
            document.body.appendChild(a); 
            a.click(); 
            a.remove();
            progress.complete();
            toast('داونلۆد تەواو بوو! ✅', 'fa-check-circle');
            
            // Track download
            if (typeof Analytics !== 'undefined') {
                const detected = SmartDetect?.detect(url);
                if (detected) Analytics.trackDownload(detected.platform);
            }
        } catch { 
            progress.error();
            window.open(url, '_blank');
            toast('لە پەنجەرەی نوێدا کرایەوە 🌐', 'fa-external-link');
        }
    } else {
        window.open(url, '_blank');
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

// ===== Main Download =====
async function downloadVideo() {
    let input = document.getElementById('tiktokUrl')?.value.trim();
    if (!input) return toast('تکایە دەقەکێ بنڤیسە!', 'fa-exclamation');
    
    animateProgress();
    const btn = document.getElementById('btnDownload');
    if (btn) btn.disabled = true;
    
    // Hide all cards
    ['previewCard', 'photoCard', 'vipUserCard'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });
    
    // Detect platform
    const platform = SmartDetect?.detect(input);
    
    try {
        if (platform && platform.platform !== 'username') {
            // Use universal download
            await downloadAnyPlatform(input);
        } else if (currentMode === 'link') {
            // Try TikTok API
            const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(input)}`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            
            if (data.code === 0 && data.data) {
                saveToHistory(input, currentMode);
                const d = data.data;
                
                if (d.images && d.images.length > 0) {
                    // Photo album
                    albumImages = d.images;
                    displayPhotoAlbum(d.images);
                } else {
                    // Video
                    currentActiveVideoUrl = d.play;
                    displayVideoPreview({
                        videoUrl: d.play,
                        audioUrl: d.music,
                        author: d.author?.nickname || 'User',
                        title: d.title || '',
                        platform: 'tiktok',
                        id: d.id || Date.now()
                    });
                }
                toast('سەرکەفتی بوو! 🎉', 'fa-check');
                
                // Track download
                if (typeof Analytics !== 'undefined') {
                    Analytics.trackDownload('tiktok');
                }
            } else {
                toast('میدیا نەهاتە دیتن!', 'fa-times');
            }
        }
    } catch { 
        toast('کێشەیەک هەیە د تۆرێ دا!', 'fa-times'); 
    } finally { 
        if (btn) btn.disabled = false; 
    }
}

async function downloadAnyPlatform(url) {
    if (!url) {
        url = document.getElementById('tiktokUrl')?.value.trim();
    }
    if (!url) return;
    
    const result = await KrdAPI.downloadMedia(url);
    
    if (result.success) {
        saveToHistory(url, 'link');
        
        if (result.type === 'album') {
            albumImages = result.images;
            displayPhotoAlbum(result.images);
        } else {
            currentActiveVideoUrl = result.videoUrl;
            displayVideoPreview(result);
        }
        
        toast('سەرکەفتی بوو! 🎉', 'fa-check-circle');
        
        // Track download
        if (typeof Analytics !== 'undefined') {
            Analytics.trackDownload(result.platform);
        }
    } else {
        toast('دابەزاندن سەرکەفتی نەبوو! 😕', 'fa-times-circle');
    }
}

function displayPhotoAlbum(images) {
    const grid = document.getElementById('photoGrid');
    const card = document.getElementById('photoCard');
    if (!grid || !card) return;
    
    grid.innerHTML = '';
    images.forEach((url, i) => {
        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
        const container = document.createElement('div');
        container.className = "relative group rounded-lg overflow-hidden";
        container.innerHTML = `
            <img src="${proxyUrl}" class="w-full aspect-square object-cover" alt="Photo ${i+1}" loading="lazy">
            <button onclick="forceDownload('${url}', 'KrdDown_Photo_${i+1}.jpg')" 
                    class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                <i class="fa-solid fa-download mr-1"></i> دابەزێنە
            </button>
        `;
        grid.appendChild(container);
    });
    
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth' });
}

function displayVideoPreview(result) {
    const pCard = document.getElementById('previewCard');
    if (!pCard) return;
    
    pCard.classList.remove('hidden');
    
    const video = document.getElementById('previewVideo');
    const image = document.getElementById('previewImage');
    
    if (video) {
        video.classList.remove('hidden');
        video.src = result.videoUrl;
    }
    if (image) image.classList.add('hidden');
    
    const author = document.getElementById('previewAuthor');
    const desc = document.getElementById('previewDescription');
    
    if (author) author.textContent = result.author;
    if (desc) desc.textContent = result.title || 'Ready to Download';
    
    const dlBtn = document.getElementById('previewDownloadBtn');
    const audioBtn = document.getElementById('previewDownloadAudioBtn');
    
    if (dlBtn) dlBtn.onclick = () => forceDownload(result.videoUrl, `KrdDown_${result.platform}_${result.id}.mp4`);
    if (audioBtn) audioBtn.onclick = () => forceDownload(result.audioUrl || result.videoUrl, `KrdDown_Audio_${result.id}.mp3`);
    
    pCard.scrollIntoView({ behavior: 'smooth' });
}

// ===== Gallery Functions =====
function loadTrendingVideo(url) {
    switchMode('link');
    const input = document.getElementById('tiktokUrl');
    if (input) input.value = url;
    toast('ڤیدیۆیا ترێند هاتە جێگیرکرن!', 'fa-fire');
    document.getElementById('tiktokUrl')?.scrollIntoView({ behavior: 'smooth' });
}

async function openCustomGallery(index) {
    if(!activeGalleryList || activeGalleryList.length === 0) return;
    activeGalleryIndex = index;
    const modal = document.getElementById('customGalleryModal');
    if (modal) modal.style.display = 'flex';
    loadVideoInGalleryPopup();
}

async function loadVideoInGalleryPopup() {
    const currentItem = activeGalleryList[activeGalleryIndex];
    const videoElement = document.getElementById('galleryPopupVideo');
    if (!videoElement) return;
    
    videoElement.pause(); 
    videoElement.src = '';
    
    const author = document.getElementById('galleryPopupAuthor');
    const desc = document.getElementById('galleryPopupDesc');
    
    if (author) author.textContent = "...";
    if (desc) desc.textContent = "دهێتە حازرکرن / Loading...";

    try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(currentItem.url)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();
        
        if(json.code === 0 && json.data) {
            const d = json.data;
            videoElement.src = d.play;
            videoElement.play().catch(()=>{});
            if (author) author.textContent = d.author?.nickname || 'User';
            if (desc) desc.textContent = d.title || '';
            
            const dlBtn = document.getElementById('galleryPopupDlBtn');
            const audioBtn = document.getElementById('galleryPopupAudioBtn');
            
            if (dlBtn) dlBtn.onclick = () => forceDownload(d.play, `KrdDown_${d.id}.mp4`);
            if (audioBtn) audioBtn.onclick = () => forceDownload(d.music, `KrdDown_AUDIO_${d.id}.mp3`);
        } else {
            if (desc) desc.textContent = "میدیا نەهاتە دیتن!";
        }
    } catch {
        if (desc) desc.textContent = "کێشەیەک د تۆرێ دا هەیە";
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
    document.getElementById('galleryPopupVideo')?.pause();
    const modal = document.getElementById('customGalleryModal');
    if (modal) modal.style.display = 'none';
}

// ===== Trending Videos =====
async function loadTrendingSection() {
    const grid = document.getElementById('trendingGrid');
    if (!grid) return;
    
    try {
        if (typeof KrdAPI !== 'undefined') {
            const trending = await KrdAPI.getTrendingVideos();
            grid.innerHTML = '';
            
            trending.slice(0, 6).forEach((item) => {
                const card = document.createElement('div');
                card.className = "bg-white/5 rounded-xl overflow-hidden p-2 border border-white/5 cursor-pointer hover:border-pink-500/30 transition-all";
                card.onclick = () => {
                    const input = document.getElementById('tiktokUrl');
                    if (input) input.value = item.url;
                    downloadVideo();
                };
                card.innerHTML = `
                    <div class="aspect-[9/14] bg-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                        <i class="fa-solid fa-play text-white/40 text-xl absolute"></i>
                        <div class="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-white">
                            <i class="fa-solid fa-fire text-orange-500 mr-1"></i> Trending
                        </div>
                    </div>
                    <span class="text-[10px] block mt-1.5 text-slate-300 font-bold truncate">${item.title || 'Trending Video'}</span>
                `;
                grid.appendChild(card);
            });
        }
    } catch(e) {
        grid.innerHTML = '<div class="col-span-full text-center text-xs text-slate-400 py-4">Trending videos unavailable</div>';
    }
}

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

// ===== Toast (Fallback) =====
if (typeof toast === 'undefined') {
    function toast(msg, icon = 'fa-circle-info') {
        const c = document.getElementById('toastContainer');
        if (!c) return;
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
}
