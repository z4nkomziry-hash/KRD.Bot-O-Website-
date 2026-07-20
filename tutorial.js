// KrdDown - Video Tutorial System
const TutorialSystem = {
    tutorials: [
        {
            title: 'چۆنیەتی داونلۆد لە TikTok',
            duration: '2:30',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
            title: 'چۆنیەتی داونلۆد لە Instagram',
            duration: '1:45',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
            title: 'ناساندنی تایبەتمەندییەکان',
            duration: '4:20',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
            url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
        }
    ],
    
    init() {
        this.createTutorialSection();
    },
    
    createTutorialSection() {
        const section = document.createElement('div');
        section.className = 'glass rounded-3xl p-5 mt-5 border border-white/5 animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-white mb-3 flex items-center gap-2">
                <i class="fa-brands fa-youtube text-red-500"></i> ڕێنمایی ڤیدیۆیی
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                ${this.tutorials.map(t => `
                    <div onclick="window.open('${t.url}', '_blank')" class="bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group">
                        <div class="relative aspect-video bg-slate-800 overflow-hidden">
                            <img src="${t.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="${t.title}">
                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-all">
                                    <i class="fa-solid fa-play text-white text-sm ml-0.5"></i>
                                </div>
                            </div>
                            <span class="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">${t.duration}</span>
                        </div>
                        <p class="text-[11px] p-2 text-slate-300 font-bold">${t.title}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        const trendingSection = document.querySelector('.glass.rounded-3xl.p-5.mt-5.border.border-pink-500\\/10');
        if (trendingSection) {
            trendingSection.parentNode.insertBefore(section, trendingSection.nextSibling);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => TutorialSystem.init(), 2500);
});
