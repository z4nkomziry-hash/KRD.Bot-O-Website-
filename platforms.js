// KrdDown - Extended Platform Support (20+ Platforms)
const ExtendedPlatforms = {
    list: [
        { name: 'TikTok', icon: 'fa-tiktok', color: '#ff0050', api: 'tikwm' },
        { name: 'Instagram', icon: 'fa-instagram', color: '#e1306c', api: 'cobalt' },
        { name: 'YouTube', icon: 'fa-youtube', color: '#ff0000', api: 'cobalt' },
        { name: 'Facebook', icon: 'fa-facebook', color: '#1877f2', api: 'cobalt' },
        { name: 'Snapchat', icon: 'fa-snapchat', color: '#fffc00', api: 'cobalt' },
        { name: 'Pinterest', icon: 'fa-pinterest', color: '#e60023', api: 'cobalt' },
        { name: 'Twitter/X', icon: 'fa-x-twitter', color: '#ffffff', api: 'cobalt' },
        { name: 'Reddit', icon: 'fa-reddit', color: '#ff4500', api: 'cobalt' },
        { name: 'LinkedIn', icon: 'fa-linkedin', color: '#0a66c2', api: 'cobalt' },
        { name: 'Vimeo', icon: 'fa-vimeo', color: '#1ab7ea', api: 'cobalt' },
        { name: 'Dailymotion', icon: 'fa-dailymotion', color: '#00aaff', api: 'cobalt' },
        { name: 'Tumblr', icon: 'fa-tumblr', color: '#35465c', api: 'cobalt' },
        { name: 'SoundCloud', icon: 'fa-soundcloud', color: '#ff5500', api: 'cobalt' },
        { name: 'Twitch', icon: 'fa-twitch', color: '#9146ff', api: 'cobalt' },
        { name: 'Bilibili', icon: 'fa-bilibili', color: '#00a1d6', api: 'cobalt' },
        { name: 'Likee', icon: 'fa-play', color: '#ff3b7f', api: 'tikwm' },
        { name: 'Kwai', icon: 'fa-play', color: '#ff7a00', api: 'tikwm' },
        { name: 'CapCut', icon: 'fa-scissors', color: '#000000', api: 'cobalt' },
        { name: 'Threads', icon: 'fa-threads', color: '#ffffff', api: 'cobalt' },
        { name: 'Spotify', icon: 'fa-spotify', color: '#1db954', api: 'cobalt' }
    ],
    
    createPlatformShowcase() {
        const section = document.createElement('div');
        section.className = 'glass rounded-3xl p-5 mt-5 border border-white/5 animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-globe text-pink-500"></i> 
                <span>پلاتفۆرمە پشتگیریکراوەکان (${this.list.length}+)</span>
            </h3>
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-2" id="platformsGrid">
                ${this.list.map(p => `
                    <div class="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-pink-500/20">
                        <i class="fa-brands ${p.icon} text-lg" style="color: ${p.color}"></i>
                        <span class="text-[9px] text-slate-400">${p.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ExtendedPlatforms.createPlatformShowcase();
});
