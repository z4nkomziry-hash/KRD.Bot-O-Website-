// KrdDown - Advanced Charts & Dashboard
const ChartsSystem = {
    data: {
        daily: [12, 19, 8, 15, 25, 10, 18],
        platforms: [
            { name: 'TikTok', value: 45, color: '#ff0050' },
            { name: 'Instagram', value: 25, color: '#e1306c' },
            { name: 'YouTube', value: 15, color: '#ff0000' },
            { name: 'Facebook', value: 10, color: '#1877f2' },
            { name: 'Others', value: 5, color: '#8b5cf6' }
        ]
    },
    
    init() {
        this.loadData();
        this.createChartsSection();
    },
    
    loadData() {
        const saved = localStorage.getItem('krddown_chart_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.data = { ...this.data, ...parsed };
            } catch(e) {}
        }
    },
    
    createChartsSection() {
        const section = document.createElement('div');
        section.className = 'glass rounded-3xl p-5 mt-5 border border-emerald-500/20 animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-emerald-400 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-chart-pie"></i> ئاماری داونلۆدەکان
            </h3>
            
            <!-- Bar Chart -->
            <div class="mb-4">
                <p class="text-[10px] text-slate-500 mb-2">داونلۆدەکانی ئەم هەفتەیە</p>
                <div class="flex items-end gap-1.5 h-24" id="barChart">
                    ${this.data.daily.map((val, i) => `
                        <div class="flex-1 flex flex-col items-center gap-1">
                            <span class="text-[9px] text-slate-400">${val}</span>
                            <div class="w-full bg-gradient-to-t from-pink-500 to-violet-500 rounded-t-md transition-all duration-500 hover:opacity-80" style="height: ${val * 3}px"></div>
                            <span class="text-[8px] text-slate-600">${['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ه'][i]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Pie Chart -->
            <div>
                <p class="text-[10px] text-slate-500 mb-2">داونلۆد بەپێی پلاتفۆرم</p>
                <div class="space-y-2" id="platformChart">
                    ${this.data.platforms.map(p => `
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-slate-400 w-16">${p.name}</span>
                            <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500" style="width: ${p.value}%; background: ${p.color}"></div>
                            </div>
                            <span class="text-[10px] text-slate-500 w-8 text-left">${p.value}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-white/5 flex justify-between text-[10px]">
                <span class="text-slate-500">کۆی گشتی: <b class="text-white">${this.data.daily.reduce((a, b) => a + b, 0)}</b></span>
                <span class="text-slate-500">پلاتفۆرم: <b class="text-white">${this.data.platforms.length}</b></span>
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => ChartsSystem.init(), 4000);
});
