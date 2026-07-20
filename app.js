// ============================================
// KrdDown - Main Application Logic
// Compatible with original design
// ============================================

let currentLang = localStorage.getItem('tikjet_lang') || '';
let currentMode = 'link';
let albumImages = [];
let searchHistory = JSON.parse(localStorage.getItem('tikjet_history') || '[]');
let currentActiveVideoUrl = '';
let deferredPrompt;
let activeGalleryList = [];
let activeGalleryIndex = 0;

// ===== Language Data =====
const langData = {
    badini: {
        title: 'دابەزاندنا ڤیدیۆ و ستۆریێن تۆڕێن جڤاکی بێ لۆگۆ',
        placeholder: 'لینکی ڤیدیۆیێ لڤێرە دانێ...', placeholderUser: 'ناڤێ حسابێ بنڤیسە...',
        paste: 'پێوەکە', download: 'دابەزینە', quickQ: 'دێ چەوا میدیا دابەزێنم？',
        guideT: 'ڕێبەرێ دابەزاندنێ یێ بلەز', rateText: 'نرخاندنا مالپەری بکە',
        faqHead: 'پرسیارێن بەربڵاو (FAQs)', thanks: 'سوپاس بۆ دەنگدان و پشتەڤانیا تە! 🌟',
        followers: 'فۆڵۆوێرس', hearts: 'لایکەکان', album: 'ئەلبومێن وێنەیان', history: 'دوایین لێگەرینەکان',
        visitSponsor: 'سەردان بکە', copyText: 'کۆپی بکە', copiedText: 'کۆپی بوو! ✅', supportTitle: 'پشتەڤانیا تە بومن 💎',
        trendingTitle: 'ڤیدیۆیێن ترێند یێن کوردی (Trending Reels)', shareTitle: 'لینکێ سایتێ مە بەڵاڤ بکە دگەل هەڤالێن خۆ:',
        pwaDesc: 'داخستن و جێگیرکرنا مالپەری وەک ئەپلیکەسیۆن ل سەر شاشێ.', pwaLater: 'پاشان', pwaInstall: 'جێگیرکە',
        iosTitle: 'KrdDown دابەزێنە وەک ئەپ', iosSubtitle: 'تایبەت بۆ سیستەمێ iOS / iPhone',
        iosStep1: 'ل خوارێ کلیک ل سەر دوگمەیا بارکردنێ Share بکە.', iosStep2: 'پاشان کلیک ل سەر Add to Home Screen بکە.', iosStep3: 'ل لایێ ڕاست کلیک ل سەر Add بکە.', iosThanks: 'سۆپاس، تێگەهشتم',
        qualitySel: 'کواڵیتیا دابەزاندنێ هەلبژێرە:', quickDl: 'داونلۆدا بلەز', audioDl: 'MP3 دەنگ', dlAll: 'هەمی دابەزینە',
        clearHistory: 'پاککرنەوە', promoBtn: '🚀 خەڵات و دیاریێن ئەڤڕۆ (کلیک بکە)',
        faqQ1: 'ئەرێ دابەزاندنا ڤیدیۆیان پارەیە؟', faqA1: 'نەخێر، خزمەتگوزاریا KrdDown ب تەمامی بێبەرامبەرە و تو دشێی بێ سنوور ڤیدیۆیان دابەزینی.',
        footer: '© 2026 KrdDown. گەشەپێدەر زانیار المزوري الکوردی، هەموو مافەکان پارێزراون.',
        themeDark: 'مۆدی تاریك', themeLight: 'مۆدی ڕووناك'
    },
    sorani: {
        title: 'داگرتنی ڤیدیۆ و ستۆرییەکانی تۆڕە جڤاکیەکان بێ لۆگۆ',
        placeholder: 'لینکی ڤیدیۆکە لێرە دابنێ...', placeholderUser: 'ناوی ئەکاونتەکە بنووسە...',
        paste: 'پەیست بکە', download: 'دایبەزێنە', quickQ: 'چۆن میدیا دابگرم؟',
        guideT: 'ڕێبەری خێرای داگرتن', rateText: 'نرخاندنی ماڵپەڕەکە بکە',
        faqHead: 'پرسیارە باوەکان (FAQs)', thanks: 'سوپاس بۆ دەنگدانەکەت! 🌟',
        followers: 'فۆڵۆوێرس', hearts: 'لایکەکان', album: 'ئەلبومی وێنەکان', history: 'دوایین گەڕانەکان',
        visitSponsor: 'سەردان بکە', copyText: 'کۆپی بکە', copiedText: 'کۆپی بوو! ✅', supportTitle: 'پشتگیری تۆ بۆ من 💎',
        trendingTitle: 'ڤیدیۆ ترێندە کوردییەکان (Trending Reels)', shareTitle: 'لینکی ماڵپەڕەکەمان بڵاو بکەرەوە لەگەڵ هاوڕێکانت:',
        pwaDesc: 'داگرتن و جێگیرکردنی ماڵپەڕەکە وەک ئەپ بۆ سەر شاشەی سەرەکی.', pwaLater: 'پاشان', pwaInstall: 'جێگیرکە',
        iosTitle: 'KrdDown داگرە وەک ئەپ', iosSubtitle: 'تایبەت بۆ سیستەمی iOS / iPhone',
        iosStep1: 'لە خوارەوە کلیک لەسەر دوگمەی Share بکە.', iosStep2: 'پاشان کلیک لەسەر Add to Home Screen بکە.', iosStep3: 'لە لای ڕاست کلیک لەسەر Add بکە.', iosThanks: 'سوپاس، تێگەیشتم',
        qualitySel: 'کوالێتی داگرتن هەڵبژێرە:', quickDl: 'داگرتنی خێرا', audioDl: 'دەنگی MP3', dlAll: 'هەموو دابەزێنە',
        clearHistory: 'پاککردنەوە', promoBtn: '🚀 خەڵات و دیارییەکانی ئەمڕۆ (کلیک بکە)',
        faqQ1: 'ئایا داگرتنی ڤیدیۆکان پارەیە؟', faqA1: 'نەخێر، خزمەتگوزاری KrdDown بە تەواوی بێبەرامبەرە و تۆ دەتوانیت بێ سنوور ڤیدیۆکان دابگریت.',
        footer: '© 2026 KrdDown. گەشەپێدەر زانیار المزوري الکوردی، هەموو مافەکان پارێزراون.',
        themeDark: 'مۆدی تاریک', themeLight: 'مۆدی ڕووناک'
    },
    ar: {
        title: 'تحميل فيديوهات وقصص منصات التواصل بدون علامة مائية',
        placeholder: 'ضع رابط الفيديو هنا...', placeholderUser: 'أدخل اسم المستخدم...',
        paste: 'لصق', download: 'تحميل', quickQ: 'كيف يمكنني تحميل الميديا؟',
        guideT: 'دليل التحميل السريع', rateText: 'قيّم موقعنا',
        faqHead: 'الأسئلة الشائعة (FAQs)', thanks: 'شكراً لتقييمك ودعمك! 🌟',
        followers: 'متابعين', hearts: 'إعجابات', album: 'ألبوم الصور', history: 'آخر عمليات البحث',
        visitSponsor: 'زيارة الحساب', copyText: 'نسخ', copiedText: 'تم النسخ! ✅', supportTitle: 'دعمك لي 💎',
        trendingTitle: 'الفيديوهات الكردية الرائجة (Trending Reels)', shareTitle: 'شارك رابط موقعنا مع أصدقائك:',
        pwaDesc: 'تثبيت وتحميل الموقع كتطبيق مباشر على شاشة هاتفك.', pwaLater: 'لاحقاً', pwaInstall: 'تثبيت',
        iosTitle: 'تحميل KrdDown كتطبيق', iosSubtitle: 'مخصص لأنظمة iOS / iPhone',
        iosStep1: 'في الأسفل انقر على زر المشاركة Share.', iosStep2: 'ثم اختر إضافة إلى الشاشة الرئيسية Add to Home Screen.', iosStep3: 'في الأعلى انقر على إضافة Add.', iosThanks: 'شكراً، فهمت',
        qualitySel: 'اختر جودة التحميل:', quickDl: 'تحميل سريع', audioDl: 'صوت MP3', dlAll: 'تحميل الكل',
        clearHistory: 'مسح السجل', promoBtn: '🚀 جوائز وهدايا اليوم (اضغط هنا)',
        faqQ1: 'هل تحميل الفيديوهات مدفوع؟', faqA1: 'لا، خدمة KrdDown مجانية تماماً ويمكنك تحميل الفيديوهات بلا حدود.',
        footer: '© 2026 KrdDown. المطور زانيار المزوري الكردي، جميع الحقوق محفوظة.',
        themeDark: 'الوضع الداكن', themeLight: 'الوضع الفاتح'
    },
    en: {
        title: 'Download Social Media Videos & Stories Without Watermark',
        placeholder: 'Paste video link here...', placeholderUser: 'Enter username...',
        paste: 'Paste', download: 'Download', quickQ: 'How to download media?',
        guideT: 'Quick Download Guide', rateText: 'Rate our website',
        faqHead: 'Frequently Asked Questions', thanks: 'Thanks for your rating and support! 🌟',
        followers: 'Followers', hearts: 'Likes', album: 'Photo Album', history: 'Recent Searches',
        visitSponsor: 'Visit Profile', copyText: 'Copy', copiedText: 'Copied! ✅', supportTitle: 'Your Support Me 💎',
        trendingTitle: 'Trending Kurdish Videos (Reels)', shareTitle: 'Share our website link with your friends:',
        pwaDesc: 'Install and add this website as an app on your home screen.', pwaLater: 'Later', pwaInstall: 'Install',
        iosTitle: 'Download KrdDown as App', iosSubtitle: 'Exclusive for iOS / iPhone devices',
        iosStep1: 'At the bottom, click on the Share button.', iosStep2: 'Then scroll down and click Add to Home Screen.', iosStep3: 'At the top right, click on Add.', iosThanks: 'Thanks, I got it',
        qualitySel: 'Select Download Quality:', quickDl: 'Quick Download', audioDl: 'MP3 Audio', dlAll: 'Download All',
        clearHistory: 'Clear History', promoBtn: "🚀 Today's Rewards & Gifts (Click Here)",
        faqQ1: 'Is downloading videos free?', faqA1: 'KrdDown service is completely free and you can download videos without any limitations.',
        footer: '© 2026 KrdDown. Developed by Zanyar Al-Mzuri Al-Kurdi, All Rights Reserved.',
        themeDark: 'Dark Mode', themeLight: 'Light Mode'
    }
};

// ===== DOM Ready =====
window.addEventListener('DOMContentLoaded', () => {
    // Show welcome modal
    setTimeout(() => {
        const modal = document.getElementById('welcomeModal');
        if (modal) modal.classList.add('show');
    }, 600);

    // Initialize language
    if (!currentLang) {
        let browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
        if (browserLang.startsWith('ar')) currentLang = 'ar';
        else if (browserLang.startsWith('en')) currentLang = 'en';
        else currentLang = 'badini';
    }
    changeLanguage(currentLang);
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;

    // Render history
    renderHistory();

    // Apply theme
    if (localStorage.getItem('tikjet_theme') === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'fa-solid fa-sun';
        const txt = document.getElementById('txtTheme');
        if (txt) txt.textContent = 'مۆدی ڕووناك';
    }

    // Initialize additional features if available
    if (typeof SmartDetect !== 'undefined') {
        // Smart detect is auto-initialized
    }
    if (typeof BatchDownload !== 'undefined') {
        setTimeout(() => BatchDownload.init(), 1000);
    }
    if (typeof Analytics !== 'undefined') {
        Analytics.init();
    }
    if (typeof ReferralSystem !== 'undefined') {
        ReferralSystem.init();
    }
    if (typeof ExtendedPlatforms !== 'undefined') {
        ExtendedPlatforms.createPlatformShowcase();
    }
    if (typeof UI !== 'undefined') {
        UI.initScrollAnimations();
    }

    // Check iOS PWA
    checkIOSPWA();
});

// ===== Welcome Modal =====
function selectNetwork(name, gradient) {
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.classList.remove('show');
    const btn = document.getElementById('btnDownload');
    if (btn) btn.style.background = gradient;
    toast('تۆڕێ ' + name + ' هاتە هەڵبژاردن! 🚀', 'fa-circle-check');
}

// ===== Contact Modal =====
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.add('show');
}

function closeContactModal(e) {
    if (e.target.id === 'contactModal') {
        const modal = document.getElementById('contactModal');
        if (modal) modal.classList.remove('show');
    }
}

// ===== PWA Functions =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!sessionStorage.getItem('pwa_dismissed') && !isIosDevice()) {
        setTimeout(() => {
            const banner = document.getElementById('pwaBanner');
            if (banner) banner.classList.add('show');
        }, 3000);
    }
});

function installPwa() {
    if (!deferredPrompt) return;
    const banner = document.getElementById('pwaBanner');
    if (banner) banner.classList.remove('show');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
}

function dismissPwa() {
    const banner = document.getElementById('pwaBanner');
    if (banner) banner.classList.remove('show');
    sessionStorage.setItem('pwa_dismissed', 'true');
}

function isIosDevice() {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

function checkIOSPWA() {
    if (isIosDevice() && !(('standalone' in window.navigator) && window.navigator.standalone)) {
        if (!sessionStorage.getItem('ios_pwa_dismissed')) {
            setTimeout(() => {
                const banner = document.getElementById('iosPwaBanner');
                if (banner) banner.classList.remove('hidden');
            }, 2500);
        }
    }
}

function dismissIosBanner() {
    const banner = document.getElementById('iosPwaBanner');
    if (banner) banner.classList.add('hidden');
    sessionStorage.setItem('ios_pwa_dismissed', 'true');
}

// ===== Auto-paste from clipboard =====
window.addEventListener('focus', () => {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        navigator.clipboard.readText().then(text => {
            const input = document.getElementById('tiktokUrl');
            if (text && (text.includes('tiktok.com') || text.includes('instagram.com') || 
                text.includes('facebook.com') || text.includes('pinterest.com') || 
                text.includes('snapchat.com') || text.includes('youtube.com') || 
                text.includes('youtu.be')) && input && input.value === '') {
                input.value = text;
                toast('لینکێ خۆکارانە پەیست بوو! 📋', 'fa-paste');
            }
        }).catch(() => {});
    }
});

// ===== Copy Functions =====
function copyCaptionText() {
    const desc = document.getElementById('previewDescription');
    if (!desc || !desc.textContent.trim()) return toast('چ دەق لڤێرە نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc.textContent).then(() => {
        toast('وەسف هاتە کۆپیکردن! 📋', 'fa-copy');
        const btnSpan = document.getElementById('txtCopyCap');
        if (btnSpan) {
            btnSpan.textContent = 'کۆپی بوو! ✅';
            setTimeout(() => { btnSpan.textContent = 'کۆپی بکە'; }, 2000);
        }
    });
}

function copyGalleryCaption() {
    const desc = document.getElementById('galleryPopupDesc');
    if (!desc || !desc.textContent || desc.textContent.startsWith("دهێتە")) return toast('چ دەق نینە!', 'fa-exclamation-triangle');
    navigator.clipboard.writeText(desc.textContent).then(() => {
        toast('دەق هاتە کۆپیکردن! 📋', 'fa-copy');
    });
}

// ===== Share Functions =====
function shareToSnapchat() {
    window.open('https://www.snapchat.com/scan?attachmentUrl=' + encodeURIComponent(window.location.href), '_blank');
    toast('ڕەوانەی سناپچاتێ بوو! 💛', 'fa-snapchat');
}

function shareToTelegram() {
    window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent("باشترین سایت بۆ دابەزاندنا ڤیدیۆیان! 🚀"), '_blank');
    toast('ڕەوانەی تێلێگرامێ بوو! 💙', 'fa-telegram');
}

// ===== Trending =====
function loadTrendingVideo(url) {
    switchMode('link');
    const input = document.getElementById('tiktokUrl');
    if (input) input.value = url;
    toast('ڤیدیۆیا ترێند هاتە جێگیرکرن!', 'fa-fire');
    const el = document.getElementById('tiktokUrl');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== Theme =====
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('tikjet_theme', isLight ? 'light' : 'dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    const txt = document.getElementById('txtTheme');
    if (txt) txt.textContent = isLight ? 'مۆدی ڕووناك' : 'مۆدی تاریك';
}

// ===== Quick Guide =====
function toggleQuickGuide() {
    const guide = document.getElementById('quickGuideBox');
    if (guide) guide.classList.toggle('hidden');
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
    if (thanks) thanks.classList.remove('hidden');
    toast('تە ' + val + ' ستێرە دان! ⭐', 'fa-star');
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
    } else {
        toast('وێبگەڕەکەت ڕێگە بە خوێندنەوەی بڵۆک کراو نادات.', 'fa-exclamation-triangle');
    }
}

// ===== Mode Switch =====
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    const input = document.getElementById('tiktokUrl');
    const icon = document.getElementById('inputIcon');
    const l = langData[currentLang] || langData['badini'];

    if (mode === 'link') {
        const modeLink = document.getElementById('modeLink');
        if (modeLink) modeLink.classList.add('active');
        if (input) input.placeholder = l.placeholder;
        if (icon) icon.className = "input-icon fa-solid fa-link";
    } else {
        const modeUsername = document.getElementById('modeUsername');
        if (modeUsername) modeUsername.classList.add('active');
        if (input) input.placeholder = l.placeholderUser;
        if (icon) icon.className = "input-icon fa-solid fa-at";
    }
}

// ===== Language =====
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tikjet_lang', lang);
    const l = langData[lang] || langData['badini'];

    const isEnglish = (lang === 'en');
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = isEnglish ? 'en' : (lang === 'ar' ? 'ar' : 'ku');

    const elements = {
        mainTitle: l.title,
        txtPaste: l.paste,
        txtDownload: l.download,
        txtQuickQuestion: l.quickQ,
        txtGuideTitle: l.guideT,
        txtFaqHeader: l.faqHead,
        txtFollowers: l.followers,
        txtHearts: l.hearts,
        txtAlbum: l.album,
        txtHistoryTitle: l.history,
        txtTrendingSectionTitle: l.trendingTitle,
        txtShareSectionTitle: l.shareTitle,
        txtPwaDesc: l.pwaDesc,
        txtPwaLater: l.pwaLater,
        txtIosTitle: l.iosTitle,
        txtIosSubtitle: l.iosSubtitle,
        txtIosStep1: l.iosStep1,
        txtIosStep2: l.iosStep2,
        txtIosStep3: l.iosStep3,
        txtIosThanks: l.iosThanks,
        txtQuickDl: l.quickDl,
        txtAudioDl: l.audioDl,
        txtDlAll: l.dlAll,
        txtPromoBtn: l.promoBtn,
        faqQ1: l.faqQ1,
        faqA1: l.faqA1,
        footerCredit: l.footer,
        step1: l.step1 || '',
        step2: l.step2 || '',
        step3: l.step3 || ''
    };

    for (const [id, text] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'txtQualitySelect') {
                el.innerHTML = '<i class="fa-solid fa-sliders"></i> ' + l.qualitySel;
            } else if (id === 'btnClearHistory') {
                el.innerHTML = '<i class="fa-solid fa-trash"></i> ' + l.clearHistory;
            } else {
                el.textContent = text;
            }
        }
    }

    const btnPwaInstall = document.getElementById('btnPwaInstall');
    if (btnPwaInstall) btnPwaInstall.textContent = l.pwaInstall;

    const rateThanks = document.getElementById('rateThanks');
    if (rateThanks) rateThanks.textContent = l.thanks;

    const input = document.getElementById('tiktokUrl');
    if (input) input.placeholder = currentMode === 'link' ? l.placeholder : l.placeholderUser;
}

// ===== Toast =====
function toast(msg, icon = 'fa-circle-info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<i class="fa-solid ' + icon + '"></i> ' + msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
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

// ===== History =====
function renderHistory() {
    const container = document.getElementById('historyContainer');
    const section = document.getElementById('historySection');
    if (!container || !section) return;
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
    const input = document.getElementById('tiktokUrl');
    if (input) input.value = item.value;
}

// ===== Force Download =====
async function forceDownload(url, filename) {
    toast('داونلۆد دەستی پێکرد... 📥', 'fa-spinner fa-spin');
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Download failed");
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
    }
}

function downloadWithQuality(quality) {
    if (!currentActiveVideoUrl) return toast('هیچ میدیا نینە!', 'fa-times');
    toast('کواڵیتیا ' + quality + ' دهێتە حازرکرن... 🚀', 'fa-circle-notch fa-spin');
    setTimeout(() => { forceDownload(currentActiveVideoUrl, 'KrdDown_' + quality + '_video.mp4'); }, 1000);
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
    albumImages.forEach((url, i) => { setTimeout(() => forceDownload(url, 'KrdDown_Image_' + (i + 1) + '.jpg'), i * 400); });
}

// ===== Custom Gallery =====
async function openCustomGallery(index) {
    if (!activeGalleryList || activeGalleryList.length === 0) return;
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
    const authorEl = document.getElementById('galleryPopupAuthor');
    const descEl = document.getElementById('galleryPopupDesc');
    if (authorEl) authorEl.textContent = "...";
    if (descEl) descEl.textContent = "دهێتە حازرکرن / Loading...";

    try {
        let directApiUrl = 'https://www.tikwm.com/api/?url=' + encodeURIComponent(currentItem.url);
        const res = await fetch(directApiUrl);
        const json = await res.json();

        if (json.code === 0 && json.data) {
            const d = json.data;
            videoElement.src = d.play;
            videoElement.play().catch(() => {});
            if (authorEl) authorEl.textContent = d.author.nickname || 'User';
            if (descEl) descEl.textContent = d.title || '';
            const dlBtn = document.getElementById('galleryPopupDlBtn');
            const audioBtn = document.getElementById('galleryPopupAudioBtn');
            if (dlBtn) dlBtn.onclick = () => forceDownload(d.play, 'KrdDown_' + d.id + '.mp4');
            if (audioBtn) audioBtn.onclick = () => forceDownload(d.music, 'KrdDown_AUDIO_' + d.id + '.mp3');
        } else {
            if (descEl) descEl.textContent = "میدیا نەهاتە دیتن!";
        }
    } catch {
        if (descEl) descEl.textContent = "کێشەیەک د تۆرێ دا هەیە";
    }
}

function navigateCustomGallery(direction) {
    if (activeGalleryList.length <= 1) return;
    activeGalleryIndex += direction;
    if (activeGalleryIndex >= activeGalleryList.length) activeGalleryIndex = 0;
    if (activeGalleryIndex < 0) activeGalleryIndex = activeGalleryList.length - 1;
    loadVideoInGalleryPopup();
}

function closeCustomGallery() {
    const video = document.getElementById('galleryPopupVideo');
    if (video) video.pause();
    const modal = document.getElementById('customGalleryModal');
    if (modal) modal.style.display = 'none';
}

// ===== Main Download =====
async function downloadVideo() {
    let input = document.getElementById('tiktokUrl');
    if (!input) return;
    input = input.value.trim();
    if (!input) return toast('تکایە دەقەکێ بنڤیسە!', 'fa-exclamation');

    animateProgress();
    const btn = document.getElementById('btnDownload');
    if (btn) btn.disabled = true;

    const previewCard = document.getElementById('previewCard');
    const photoCard = document.getElementById('photoCard');
    const vipCard = document.getElementById('vipUserCard');
    if (previewCard) previewCard.classList.add('hidden');
    if (photoCard) photoCard.classList.add('hidden');
    if (vipCard) vipCard.classList.add('hidden');

    // If not TikTok, use Cobalt API
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
                if (pCard) pCard.classList.remove('hidden');
                const img = document.getElementById('previewImage');
                const vid = document.getElementById('previewVideo');
                if (img) img.classList.add('hidden');
                if (vid) {
                    vid.classList.remove('hidden');
                    vid.src = result.url;
                }
                const author = document.getElementById('previewAuthor');
                const desc = document.getElementById('previewDescription');
                if (author) author.textContent = 'Social Media Media';
                if (desc) desc.textContent = 'Ready to Download';
                const dlBtn = document.getElementById('previewDownloadBtn');
                const audioBtn = document.getElementById('previewDownloadAudioBtn');
                if (dlBtn) dlBtn.onclick = () => forceDownload(result.url, 'download.mp4');
                if (audioBtn) audioBtn.onclick = () => forceDownload(result.url, 'audio.mp3');

                toast('سەرکەفتی بوو! 🎉', 'fa-check');
            } else if (result.status === 'picker' && result.picker && result.picker.length > 0) {
                saveToHistory(input, currentMode);
                albumImages = result.picker.map(item => item.url);
                const grid = document.getElementById('photoGrid');
                if (grid) {
                    grid.innerHTML = '';
                    albumImages.forEach((url, i) => {
                        const proxyUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
                        const container = document.createElement('div');
                        container.className = "relative group rounded-lg overflow-hidden";
                        container.innerHTML = '<img src="' + proxyUrl + '" class="w-full aspect-square object-cover" alt="Image"><button onclick="forceDownload(\'' + url + '\', \'img_' + i + '.jpg\')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"><i class="fa-solid fa-download"></i></button>';
                        grid.appendChild(container);
                    });
                }
                if (photoCard) photoCard.classList.remove('hidden');
                toast('سەرکەفتی بوو! 🎉', 'fa-check');
            } else {
                toast('میدیا نەهاتە دیتن یان بلۆک کراوە!', 'fa-times');
            }
        } catch {
            toast('کێشەیەک هەیە د سێرڤەری گشتی دا!', 'fa-times');
        } finally {
            if (btn) btn.disabled = false;
        }
        return;
    }

    // TikTok API
    try {
        let apiUrl = currentMode === 'link'
            ? 'https://www.tikwm.com/api/?url=' + encodeURIComponent(input)
            : 'https://www.tikwm.com/api/user/posts?unique_id=' + encodeURIComponent(input.replace('@', '')) + '&count=15';

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.code === 0 && data.data) {
            saveToHistory(input, currentMode);
            if (currentMode === 'link') {
                const d = data.data;
                if (d.images && d.images.length > 0) {
                    albumImages = d.images;
                    const grid = document.getElementById('photoGrid');
                    if (grid) {
                        grid.innerHTML = '';
                        d.images.forEach((url, i) => {
                            const proxyUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
                            const container = document.createElement('div');
                            container.className = "relative group rounded-lg overflow-hidden";
                            container.innerHTML = '<img src="' + proxyUrl + '" class="w-full aspect-square object-cover" alt="Album Image"><button onclick="forceDownload(\'' + url + '\', \'img_' + i + '.jpg\')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"><i class="fa-solid fa-download"></i></button>';
                            grid.appendChild(container);
                        });
                    }
                    if (photoCard) photoCard.classList.remove('hidden');
                } else {
                    currentActiveVideoUrl = d.play;
                    const pCard = document.getElementById('previewCard');
                    if (pCard) pCard.classList.remove('hidden');
                    const img = document.getElementById('previewImage');
                    const vid = document.getElementById('previewVideo');
                    if (img) img.classList.add('hidden');
                    if (vid) {
                        vid.classList.remove('hidden');
                        vid.src = d.play;
                    }
                    const author = document.getElementById('previewAuthor');
                    const desc = document.getElementById('previewDescription');
                    if (author) author.textContent = d.author.nickname || 'User';
                    if (desc) desc.textContent = d.title || '';
                    const dlBtn = document.getElementById('previewDownloadBtn');
                    const audioBtn = document.getElementById('previewDownloadAudioBtn');
                    if (dlBtn) dlBtn.onclick = () => forceDownload(d.play, 'video.mp4');
                    if (audioBtn) audioBtn.onclick = () => forceDownload(d.music, 'music.mp3');
                }
            } else {
                const posts = data.data.videos;
                if (posts && posts.length > 0) {
                    const user = posts[0].author;
                    const vipAvatar = document.getElementById('vipAvatar');
                    const vipName = document.getElementById('vipName');
                    const vipUsername = document.getElementById('vipUsername');
                    const vipFollowers = document.getElementById('vipFollowers');
                    const vipHearts = document.getElementById('vipHearts');
                    if (vipAvatar) vipAvatar.src = user.avatar;
                    if (vipName) vipName.textContent = user.nickname;
                    if (vipUsername) vipUsername.textContent = '@' + user.unique_id;
                    if (vipFollowers) vipFollowers.textContent = 'N/A';
                    if (vipHearts) vipHearts.textContent = 'N/A';

                    const grid = document.getElementById('vipPostGrid');
                    if (grid) {
                        grid.innerHTML = '';
                        activeGalleryList = posts.map(p => ({ url: 'https://www.tiktok.com/@' + user.unique_id + '/video/' + p.video_id }));
                        posts.forEach((p, idx) => {
                            const item = document.createElement('div');
                            item.className = "relative rounded-xl overflow-hidden aspect-square bg-slate-800 cursor-pointer group";
                            item.innerHTML = '<img src="' + p.cover + '" class="w-full h-full object-cover" alt="Cover"><div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><i class="fa-solid fa-play text-white text-lg"></i></div>';
                            item.onclick = () => { openCustomGallery(idx); };
                            grid.appendChild(item);
                        });
                    }
                    if (vipCard) vipCard.classList.remove('hidden');
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
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ===== Smart Download (uses KrdAPI if available) =====
async function downloadAnyPlatform(url) {
    if (!url) {
        const input = document.getElementById('tiktokUrl');
        if (input) url = input.value.trim();
    }
    if (!url) return;

    if (typeof KrdAPI !== 'undefined' && KrdAPI.downloadMedia) {
        animateProgress();
        const btn = document.getElementById('btnDownload');
        if (btn) btn.disabled = true;

        try {
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
                if (typeof Analytics !== 'undefined') Analytics.trackDownload(result.platform);
            } else {
                toast('دابەزاندن سەرکەفتی نەبوو! 😕', 'fa-times-circle');
            }
        } catch {
            toast('کێشەیەک ڕوویدا!', 'fa-times');
        } finally {
            if (btn) btn.disabled = false;
        }
    } else {
        // Fallback to default download
        downloadVideo();
    }
}

function displayPhotoAlbum(images) {
    const grid = document.getElementById('photoGrid');
    const card = document.getElementById('photoCard');
    if (!grid || !card) return;
    grid.innerHTML = '';
    images.forEach((url, i) => {
        const proxyUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
        const container = document.createElement('div');
        container.className = "relative group rounded-lg overflow-hidden";
        container.innerHTML = '<img src="' + proxyUrl + '" class="w-full aspect-square object-cover" alt="Photo"><button onclick="forceDownload(\'' + url + '\', \'KrdDown_Photo_' + (i + 1) + '.jpg\')" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"><i class="fa-solid fa-download mr-1"></i> دابەزێنە</button>';
        grid.appendChild(container);
    });
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth' });
}

function displayVideoPreview(result) {
    const pCard = document.getElementById('previewCard');
    if (!pCard) return;
    pCard.classList.remove('hidden');
    const img = document.getElementById('previewImage');
    const vid = document.getElementById('previewVideo');
    if (img) img.classList.add('hidden');
    if (vid) {
        vid.classList.remove('hidden');
        vid.src = result.videoUrl;
    }
    const author = document.getElementById('previewAuthor');
    const desc = document.getElementById('previewDescription');
    if (author) author.textContent = result.author;
    if (desc) desc.textContent = result.title || 'Ready to Download';
    const dlBtn = document.getElementById('previewDownloadBtn');
    const audioBtn = document.getElementById('previewDownloadAudioBtn');
    if (dlBtn) dlBtn.onclick = () => forceDownload(result.videoUrl, 'KrdDown_' + result.platform + '_' + result.id + '.mp4');
    if (audioBtn) audioBtn.onclick = () => forceDownload(result.audioUrl || result.videoUrl, 'KrdDown_Audio_' + result.id + '.mp3');
    pCard.scrollIntoView({ behavior: 'smooth' });
}
