// KrdDown - Multi-Platform API Handler
const KrdAPI = {
    // API Endpoints
    endpoints: {
        tiktok: 'https://www.tikwm.com/api/',
        instagram: 'https://api.cobalt.tools/api/json',
        youtube: 'https://api.cobalt.tools/api/json',
        facebook: 'https://api.cobalt.tools/api/json',
        pinterest: 'https://api.cobalt.tools/api/json',
        snapchat: 'https://api.cobalt.tools/api/json'
    },

    // Detect platform from URL
    detectPlatform(url) {
        const urlLower = url.toLowerCase();
        if (urlLower.includes('tiktok.com') || urlLower.includes('vm.tiktok')) return 'tiktok';
        if (urlLower.includes('instagram.com') || urlLower.includes('instagr.am')) return 'instagram';
        if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
        if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) return 'facebook';
        if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) return 'pinterest';
        if (urlLower.includes('snapchat.com')) return 'snapchat';
        return 'unknown';
    },

    // Universal download function
    async downloadMedia(url, platform = null) {
        if (!platform) platform = this.detectPlatform(url);
        
        toast(`دەستنیشانکرن: ${platform} 🔍`, 'fa-search');
        
        switch(platform) {
            case 'tiktok':
                return await this.downloadTikTok(url);
            case 'instagram':
                return await this.downloadCobalt(url, 'instagram');
            case 'youtube':
                return await this.downloadYouTube(url);
            case 'facebook':
                return await this.downloadCobalt(url, 'facebook');
            case 'pinterest':
                return await this.downloadPinterest(url);
            case 'snapchat':
                return await this.downloadCobalt(url, 'snapchat');
            default:
                return await this.downloadCobalt(url, 'unknown');
        }
    },

    // TikTok Download
    async downloadTikTok(url) {
        const apiUrl = `${this.endpoints.tiktok}?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            return {
                success: true,
                platform: 'tiktok',
                type: data.data.images ? 'album' : 'video',
                videoUrl: data.data.play,
                audioUrl: data.data.music,
                images: data.data.images || [],
                author: data.data.author?.nickname || 'Unknown',
                title: data.data.title || '',
                id: data.data.id || Date.now()
            };
        }
        return { success: false, error: 'TikTok download failed' };
    },

    // Cobalt API (Instagram, Facebook, Snapchat, etc.)
    async downloadCobalt(url, platform) {
        const response = await fetch(this.endpoints.instagram, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            },
            body: JSON.stringify({ 
                url: url, 
                vQuality: '720', 
                filenamePattern: 'basic',
                isAudioOnly: false
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'redirect' || result.status === 'stream') {
            return {
                success: true,
                platform: platform,
                type: 'video',
                videoUrl: result.url,
                audioUrl: result.url,
                images: [],
                author: platform.charAt(0).toUpperCase() + platform.slice(1) + ' Media',
                title: 'Ready to Download',
                id: Date.now()
            };
        } else if (result.status === 'picker' && result.picker?.length > 0) {
            return {
                success: true,
                platform: platform,
                type: 'album',
                videoUrl: null,
                audioUrl: null,
                images: result.picker.map(item => item.url),
                author: platform.charAt(0).toUpperCase() + platform.slice(1) + ' Album',
                title: 'Photo Album',
                id: Date.now()
            };
        }
        return { success: false, error: 'Download failed' };
    },

    // YouTube Download
    async downloadYouTube(url) {
        return await this.downloadCobalt(url, 'youtube');
    },

    // Pinterest Download
    async downloadPinterest(url) {
        return await this.downloadCobalt(url, 'pinterest');
    },

    // Download Instagram by username
    async downloadInstagramProfile(username) {
        toast('Instagram profile downloading is limited 🚧', 'fa-info-circle');
        // Instagram API requires authentication
        // This is a placeholder for future implementation
        return { success: false, error: 'Instagram profile requires special API' };
    },

    // Get trending videos (Kurdish)
    async getTrendingVideos() {
        const trendingUrls = [
            'https://www.tiktok.com/@z44nko/video/7311111111',
            'https://www.tiktok.com/@zano.b22/video/7322222222',
            'https://www.tiktok.com/@kurdish_vibes/video/7333333333',
            'https://www.tiktok.com/@hawler_beauty/video/7344444444',
            'https://www.tiktok.com/@slemani_style/video/7355555555',
            'https://www.tiktok.com/@duhok_life/video/7366666666'
        ];
        
        const trending = [];
        for (const url of trendingUrls) {
            try {
                const result = await this.downloadTikTok(url);
                if (result.success) {
                    trending.push({
                        url: url,
                        title: result.title,
                        author: result.author,
                        thumbnail: result.type === 'video' ? result.videoUrl : result.images[0]
                    });
                }
            } catch (e) {
                // Skip failed items
            }
        }
        return trending;
    }
};

// ===== Global Functions for HTML Buttons =====
async function downloadAnyPlatform(url) {
    if (!url) {
        url = document.getElementById('tiktokUrl').value.trim();
    }
    
    if (!url) return toast('تکایە لینکێ بنڤیسە! 📝', 'fa-exclamation');
    
    animateProgress();
    const btn = document.getElementById('btnDownload');
    btn.disabled = true;
    
    // Hide all cards
    document.getElementById('previewCard').classList.add('hidden');
    document.getElementById('photoCard').classList.add('hidden');
    document.getElementById('vipUserCard').classList.add('hidden');
    
    const platform = KrdAPI.detectPlatform(url);
    toast(`پلاتفۆرم: ${platform} 📱`, 'fa-mobile-screen');
    
    try {
        const result = await KrdAPI.downloadMedia(url, platform);
        
        if (result.success) {
            saveToHistory(url, 'link');
            
            if (result.type === 'album' && result.images.length > 0) {
                // Show photo album
                displayPhotoAlbum(result.images);
            } else if (result.type === 'video' && result.videoUrl) {
                // Show video preview
                currentActiveVideoUrl = result.videoUrl;
                displayVideoPreview(result);
            }
            
            toast('سەرکەفتی بوو! 🎉', 'fa-check-circle');
        } else {
            toast('دابەزاندن سەرکەفتی نەبوو! 😕', 'fa-times-circle');
        }
    } catch (error) {
        toast('کێشەیەک ڕوویدا! دوبارە هەوڵبدە 🔄', 'fa-exclamation-triangle');
    } finally {
        btn.disabled = false;
    }
}

function displayPhotoAlbum(images) {
    albumImages = images;
    const grid = document.getElementById('photoGrid');
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
    
    document.getElementById('photoCard').classList.remove('hidden');
    document.getElementById('photoCard').scrollIntoView({ behavior: 'smooth' });
}

function displayVideoPreview(result) {
    const pCard = document.getElementById('previewCard');
    pCard.classList.remove('hidden');
    
    document.getElementById('previewImage').classList.add('hidden');
    document.getElementById('previewVideo').classList.remove('hidden');
    
    document.getElementById('previewVideo').src = result.videoUrl;
    document.getElementById('previewAuthor').textContent = result.author;
    document.getElementById('previewDescription').textContent = result.title || 'Ready to Download';
    
    // Set download buttons
    document.getElementById('previewDownloadBtn').onclick = () => 
        forceDownload(result.videoUrl, `KrdDown_${result.platform}_${result.id}.mp4`);
    
    document.getElementById('previewDownloadAudioBtn').onclick = () => 
        forceDownload(result.audioUrl || result.videoUrl, `KrdDown_Audio_${result.id}.mp3`);
    
    pCard.scrollIntoView({ behavior: 'smooth' });
}

// ===== Trending Videos Handler =====
async function loadTrendingSection() {
    const grid = document.getElementById('trendingGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="col-span-full text-center text-xs text-slate-400 py-4"><i class="fa-solid fa-spinner fa-spin mr-2"></i>بارکردنی ترێندەکان...</div>';
    
    try {
        const trending = await KrdAPI.getTrendingVideos();
        grid.innerHTML = '';
        
        trending.forEach((item, index) => {
            if (index >= 6) return; // Show max 6 items
            
            const card = document.createElement('div');
            card.className = "bg-white/5 rounded-xl overflow-hidden p-2 border border-white/5 cursor-pointer hover:border-pink-500/30 transition-all";
            card.onclick = () => {
                document.getElementById('tiktokUrl').value = item.url;
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
    } catch (e) {
        grid.innerHTML = '<div class="col-span-full text-center text-xs text-slate-400 py-4">Trending videos unavailable</div>';
    }
}

// Load trending on page load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadTrendingSection, 1500);
});
