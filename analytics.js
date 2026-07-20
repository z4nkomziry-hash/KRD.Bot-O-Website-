// KrdDown - Simple Analytics System
const Analytics = {
    data: {
        totalDownloads: 0,
        platformStats: {},
        dailyVisits: {},
        lastVisit: null
    },
    
    init() {
        this.loadData();
        this.trackVisit();
        this.trackPlatforms();
    },
    
    // Load saved data
    loadData() {
        const saved = localStorage.getItem('krddown_analytics');
        if (saved) {
            try {
                this.data = { ...this.data, ...JSON.parse(saved) };
            } catch(e) {}
        }
    },
    
    // Save data
    saveData() {
        localStorage.setItem('krddown_analytics', JSON.stringify(this.data));
    },
    
    // Track page visit
    trackVisit() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.data.dailyVisits[today]) {
            this.data.dailyVisits[today] = 0;
        }
        this.data.dailyVisits[today]++;
        this.data.lastVisit = new Date().toISOString();
        
        this.saveData();
    },
    
    // Track download by platform
    trackDownload(platform) {
        this.data.totalDownloads++;
        
        if (!this.data.platformStats[platform]) {
            this.data.platformStats[platform] = 0;
        }
        this.data.platformStats[platform]++;
        
        this.saveData();
        this.updateDashboard();
    },
    
    // Auto-track platforms from URL patterns
    trackPlatforms() {
        // Listen for successful downloads
        const originalToast = toast;
        toast = function(msg, icon) {
            if (msg.includes('سەرکەفتی') || msg.includes('success')) {
                const input = document.getElementById('tiktokUrl');
                if (input?.value) {
                    const detected = SmartDetect.detect(input.value);
                    if (detected) {
                        Analytics.trackDownload(detected.platform);
                    }
                }
            }
            originalToast(msg, icon);
        };
    },
    
    // Update dashboard if exists
    updateDashboard() {
        const dashboard = document.getElementById('analyticsDashboard');
        if (!dashboard) return;
        
        document.getElementById('totalDownloadsCount').textContent = this.data.totalDownloads;
        
        const platformList = document.getElementById('platformStatsList');
        if (platformList) {
            platformList.innerHTML = Object.entries(this.data.platformStats)
                .sort((a, b) => b[1] - a[1])
                .map(([platform, count]) => {
                    const info = SmartDetect.patterns[platform] || { icon: 'fa-link', color: '#fff', name: platform };
                    return `
                        <div class="flex items-center justify-between bg-white/5 rounded-lg p-2">
                            <span class="text-xs flex items-center gap-2">
                                <i class="fa-brands ${info.icon}" style="color: ${info.color}"></i>
                                ${info.name}
                            </span>
                            <span class="text-xs font-bold text-pink-500">${count}</span>
                        </div>
                    `;
                }).join('');
        }
    },
    
    // Create analytics dashboard
    createDashboard() {
        // Remove existing if any
        const existing = document.getElementById('analyticsDashboard');
        if (existing) existing.remove();
        
        const dashboard = document.createElement('div');
        dashboard.id = 'analyticsDashboard';
        dashboard.className = 'glass rounded-3xl p-5 mt-5 border border-emerald-500/20';
        dashboard.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-black text-emerald-400 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie"></i> ئاماری داونلۆدەکان
                </h3>
                <span class="text-[10px] text-slate-500">Local Stats</span>
            </div>
            
            <!-- Total Downloads -->
            <div class="text-center mb-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <span class="text-3xl font-black text-emerald-400" id="totalDownloadsCount">0</span>
                <p class="text-[10px] text-slate-400 mt-1">کۆی گشتی داونلۆدەکان</p>
            </div>
            
            <!-- Platform Stats -->
            <div class="space-y-2" id="platformStatsList">
                <p class="text-[10px] text-slate-500 text-center">هێشتا هیچ داونلۆدێک نەکراوە</p>
            </div>
            
            <!-- Reset Button -->
            <button onclick="Analytics.resetStats()" class="w-full mt-3 text-[10px] text-rose-400 hover:text-rose-300 py-2 rounded-xl bg-rose-500/5">
                <i class="fa-solid fa-rotate-right mr-1"></i> ڕێستکردنی ئامارەکان
            </button>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(dashboard, footer);
        }
        
        this.updateDashboard();
    },
    
    // Reset stats
    resetStats() {
        if (confirm('ئایا دڵنیای کە دەتەوێ هەموو ئامارەکان ڕێست بکەیت؟')) {
            this.data = {
                totalDownloads: 0,
                platformStats: {},
                dailyVisits: {},
                lastVisit: new Date().toISOString()
            };
            this.saveData();
            this.updateDashboard();
            toast('ئامارەکان ڕێستکران! 📊', 'fa-rotate-right');
        }
    }
};

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
    
    // Create dashboard button in developer card
    const devCard = document.querySelector('.dev-card-modern');
    if (devCard) {
        const linksDiv = devCard.querySelector('.flex.gap-3');
        if (linksDiv) {
            const separator = document.createElement('span');
            separator.className = 'text-slate-600';
            separator.textContent = '|';
            
            const statsBtn = document.createElement('button');
            statsBtn.className = 'text-emerald-400 hover:text-emerald-300 flex items-center gap-1';
            statsBtn.innerHTML = '<i class="fa-solid fa-chart-simple"></i> ئامارەکان';
            statsBtn.onclick = () => {
                Analytics.createDashboard();
                document.getElementById('analyticsDashboard')?.scrollIntoView({ behavior: 'smooth' });
            };
            
            linksDiv.appendChild(separator);
            linksDiv.appendChild(statsBtn);
        }
    }
});
