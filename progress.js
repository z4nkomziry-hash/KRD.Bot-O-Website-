// KrdDown - Real Download Progress System
const DownloadProgress = {
    progressBar: null,
    progressText: null,
    progressContainer: null,
    
    // Create progress UI
    createProgressUI() {
        // Remove existing if any
        this.removeProgressUI();
        
        this.progressContainer = document.createElement('div');
        this.progressContainer.id = 'downloadProgressContainer';
        this.progressContainer.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-[99999] animate-slideUp';
        this.progressContainer.innerHTML = `
            <div class="glass rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-download text-pink-500 animate-bounce"></i>
                        <span class="text-xs font-bold text-white" id="progressLabel">داونلۆد دەستی پێکرد...</span>
                    </div>
                    <span class="text-xs font-black text-pink-500" id="progressPercent">0%</span>
                </div>
                <div class="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div id="progressBarFill" class="absolute top-0 left-0 h-full rounded-full transition-all duration-300" 
                         style="width: 0%; background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6);"></div>
                </div>
                <div class="flex items-center justify-between mt-2">
                    <span class="text-[10px] text-slate-400" id="progressSpeed">--</span>
                    <span class="text-[10px] text-slate-400" id="progressSize">--</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.progressContainer);
        
        this.progressBar = document.getElementById('progressBarFill');
        this.progressText = document.getElementById('progressPercent');
    },
    
    // Update progress
    update(percent, speed = '', size = '') {
        if (!this.progressContainer) this.createProgressUI();
        
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(percent, 100)}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(percent)}%`;
        }
        
        // Update speed
        const speedEl = document.getElementById('progressSpeed');
        if (speedEl && speed) {
            speedEl.textContent = `⚡ ${speed}`;
        }
        
        // Update size
        const sizeEl = document.getElementById('progressSize');
        if (sizeEl && size) {
            sizeEl.textContent = `📦 ${size}`;
        }
        
        // Update label
        const label = document.getElementById('progressLabel');
        if (label) {
            if (percent >= 100) {
                label.textContent = 'داونلۆد تەواو بوو! ✅';
                label.querySelector('i')?.classList.replace('fa-download', 'fa-check-circle');
                label.querySelector('i')?.classList.replace('text-pink-500', 'text-emerald-400');
            } else if (percent > 0) {
                label.textContent = 'داونلۆد بەردەوامە... 📥';
            }
        }
    },
    
    // Simulate progress for APIs that don't support real progress
    simulateProgress(duration = 3000) {
        this.createProgressUI();
        let progress = 0;
        const interval = 100;
        const steps = duration / interval;
        const increment = 90 / steps;
        
        const timer = setInterval(() => {
            progress += increment;
            if (progress >= 90) {
                clearInterval(timer);
                progress = 90;
            }
            
            // Random speed display
            const speeds = ['1.2 MB/s', '2.5 MB/s', '3.8 MB/s', '5.1 MB/s', '800 KB/s'];
            const sizes = ['12.4 MB', '25.7 MB', '8.9 MB', '45.2 MB'];
            
            this.update(
                progress,
                speeds[Math.floor(Math.random() * speeds.length)],
                sizes[Math.floor(Math.random() * sizes.length)]
            );
        }, interval);
        
        return {
            complete: () => {
                clearInterval(timer);
                this.update(100, 'تەواو بوو', '✅');
                setTimeout(() => this.removeProgressUI(), 2000);
            },
            error: () => {
                clearInterval(timer);
                const label = document.getElementById('progressLabel');
                if (label) {
                    label.textContent = 'هەڵە ڕوویدا! ❌';
                }
                this.update(0);
                setTimeout(() => this.removeProgressUI(), 2000);
            }
        };
    },
    
    // Remove progress UI
    removeProgressUI() {
        if (this.progressContainer) {
            this.progressContainer.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => {
                this.progressContainer?.remove();
                this.progressContainer = null;
                this.progressBar = null;
                this.progressText = null;
            }, 300);
        }
    }
};

// ===== Add animation CSS =====
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100%); opacity: 0; }
    }
    .animate-slideUp {
        animation: slideUp 0.3s ease forwards;
    }
`;
document.head.appendChild(progressStyle);

// ===== Override forceDownload to use progress =====
const originalForceDownload = forceDownload;
forceDownload = async function(url, filename) {
    const progress = DownloadProgress.simulateProgress(2000);
    
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error("Download failed");
        
        const contentLength = response.headers.get('content-length');
        const total = parseInt(contentLength, 10);
        let loaded = 0;
        
        const reader = response.body.getReader();
        const chunks = [];
        
        while(true) {
            const {done, value} = await reader.read();
            if(done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            if(total) {
                const percent = (loaded / total) * 100;
                const speed = `${(loaded / 1024 / 1024).toFixed(1)} MB`;
                const size = `${(total / 1024 / 1024).toFixed(1)} MB`;
                DownloadProgress.update(percent, speed, size);
            }
        }
        
        const blob = new Blob(chunks);
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        progress.complete();
        toast('داونلۆد بە سەرکەوتویی تەواو بوو! 🎉', 'fa-check-circle');
        UI.celebrate();
        
    } catch(error) {
        progress.error();
        window.open(url, '_blank');
        toast('لە پەنجەرەی نوێدا کرایەوە 🌐', 'fa-external-link');
    }
};
