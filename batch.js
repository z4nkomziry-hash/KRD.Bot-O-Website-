// KrdDown - Batch Download System
const BatchDownload = {
    links: [],
    isActive: false,
    
    // Initialize batch mode
    init() {
        this.createBatchUI();
        this.loadSettings();
    },
    
    // Create batch UI elements
    createBatchUI() {
        // Create batch toggle button
        const batchToggle = document.createElement('button');
        batchToggle.id = 'batchToggleBtn';
        batchToggle.className = 'mode-btn';
        batchToggle.innerHTML = '<i class="fa-solid fa-layer-group"></i> Batch';
        batchToggle.onclick = () => this.toggleBatchMode();
        
        const modeContainer = document.querySelector('.flex.gap-2.justify-center');
        if (modeContainer && modeContainer.children.length < 3) {
            modeContainer.appendChild(batchToggle);
        }
        
        // Create batch panel
        const batchPanel = document.createElement('div');
        batchPanel.id = 'batchPanel';
        batchPanel.className = 'hidden glass rounded-2xl p-4 mt-3 border border-pink-500/20';
        batchPanel.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-pink-500">
                    <i class="fa-solid fa-list-check mr-1"></i> 
                    داونلۆدی کۆمەڵە (<span id="batchCount">0</span> لینک)
                </span>
                <div class="flex gap-2">
                    <button onclick="BatchDownload.clearAll()" class="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg bg-rose-500/10">
                        <i class="fa-solid fa-trash"></i> پاککردنەوە
                    </button>
                    <button onclick="BatchDownload.downloadAll()" class="text-[10px] text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg bg-emerald-500/10 font-bold">
                        <i class="fa-solid fa-download"></i> داونلۆدی هەموو
                    </button>
                </div>
            </div>
            <div id="batchList" class="space-y-2 max-h-[200px] overflow-y-auto">
                <p class="text-[10px] text-slate-500 text-center py-4">هێشتا هیچ لینکێک زیاد نەکراوە</p>
            </div>
            <div class="mt-3 flex gap-2">
                <input type="text" id="batchInput" placeholder="لینکێ لێرە بنڤیسە..." 
                       class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500/50">
                <button onclick="BatchDownload.addLink()" class="btn-pink text-white text-xs font-bold px-4 py-2 rounded-xl">
                    <i class="fa-solid fa-plus"></i> زیادکە
                </button>
            </div>
        `;
        
        const downloadCard = document.querySelector('.glass.rounded-3xl.p-5.shadow-2xl');
        if (downloadCard) {
            downloadCard.appendChild(batchPanel);
        }
    },
    
    // Toggle batch mode
    toggleBatchMode() {
        this.isActive = !this.isActive;
        const panel = document.getElementById('batchPanel');
        const toggle = document.getElementById('batchToggle');
        
        if (this.isActive) {
            panel.classList.remove('hidden');
            toggle.classList.add('active');
            toast('مۆدی داونلۆدی کۆمەڵە چالاک بوو! 📦', 'fa-layer-group');
        } else {
            panel.classList.add('hidden');
            toggle.classList.remove('active');
        }
    },
    
    // Add link to batch
    addLink() {
        const input = document.getElementById('batchInput');
        const url = input?.value.trim();
        
        if (!url) return toast('تکایە لینکێ بنڤیسە!', 'fa-exclamation');
        
        const detected = SmartDetect.detect(url);
        if (!detected || detected.platform === 'username') {
            return toast('لینکەکە دروست نییە!', 'fa-times-circle');
        }
        
        // Check for duplicates
        if (this.links.find(l => l.url === url)) {
            return toast('ئەم لینکە پێشتر زیاد کراوە!', 'fa-copy');
        }
        
        this.links.push({
            url: url,
            platform: detected.platform,
            name: detected.name,
            icon: detected.icon,
            color: detected.color
        });
        
        input.value = '';
        this.renderList();
        this.saveSettings();
        toast('لینک زیاد کرا! ✅', 'fa-check');
    },
    
    // Remove link from batch
    removeLink(index) {
        this.links.splice(index, 1);
        this.renderList();
        this.saveSettings();
    },
    
    // Clear all links
    clearAll() {
        if (this.links.length === 0) return;
        if (confirm('ئایا دڵنیای کە دەتەوێ هەموو لینکەکان پاک بکەیتەوە؟')) {
            this.links = [];
            this.renderList();
            this.saveSettings();
            toast('هەموو لینکەکان پاککرانەوە! 🧹', 'fa-trash');
        }
    },
    
    // Render batch list
    renderList() {
        const container = document.getElementById('batchList');
        const countEl = document.getElementById('batchCount');
        
        if (!container || !countEl) return;
        
        countEl.textContent = this.links.length;
        
        if (this.links.length === 0) {
            container.innerHTML = '<p class="text-[10px] text-slate-500 text-center py-4">هێشتا هیچ لینکێک زیاد نەکراوە</p>';
            return;
        }
        
        container.innerHTML = this.links.map((link, index) => `
            <div class="flex items-center justify-between bg-white/5 rounded-xl p-2.5 border border-white/5 hover:border-pink-500/20 transition-all">
                <div class="flex items-center gap-2 truncate">
                    <i class="fa-brands ${link.icon} text-xs" style="color: ${link.color}"></i>
                    <span class="text-[10px] text-slate-300 truncate max-w-[200px]">${link.url}</span>
                    <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500">${link.name}</span>
                </div>
                <button onclick="BatchDownload.removeLink(${index})" class="text-slate-500 hover:text-rose-400 text-xs flex-shrink-0">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `).join('');
    },
    
    // Download all links in batch
    async downloadAll() {
        if (this.links.length === 0) {
            return toast('هیچ لینکێک نییە بۆ داونلۆد!', 'fa-exclamation');
        }
        
        toast(`داونلۆدی ${this.links.length} لینک دەستی پێکرد... 🚀`, 'fa-rocket');
        
        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            toast(`داونلۆدی ${i + 1}/${this.links.length}: ${link.name}...`, 'fa-spinner fa-spin');
            
            try {
                await KrdAPI.downloadMedia(link.url, link.platform);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between downloads
            } catch (e) {
                toast(`هەڵە لە داونلۆدی ${link.name}! 😕`, 'fa-times');
            }
        }
        
        toast('هەموو داونلۆدەکان تەواو بوون! 🎉', 'fa-check-circle');
        UI.celebrate();
    },
    
    // Save to localStorage
    saveSettings() {
        localStorage.setItem('krddown_batch_links', JSON.stringify(this.links));
    },
    
    // Load from localStorage
    loadSettings() {
        const saved = localStorage.getItem('krddown_batch_links');
        if (saved) {
            try {
                this.links = JSON.parse(saved);
                this.renderList();
            } catch(e) {
                this.links = [];
            }
        }
    }
};

// Initialize batch download on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => BatchDownload.init(), 1000);
});
