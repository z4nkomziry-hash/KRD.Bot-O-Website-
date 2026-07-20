// KrdDown - GitHub Integration
const GitHubIntegration = {
    repo: 'zaniyar/krddown',
    stars: 0,
    forks: 0,
    
    async init() {
        await this.fetchRepoStats();
        this.createGitHubCard();
    },
    
    async fetchRepoStats() {
        try {
            const res = await fetch(`https://api.github.com/repos/${this.repo}`);
            const data = await res.json();
            this.stars = data.stargazers_count || 0;
            this.forks = data.forks_count || 0;
        } catch(e) {
            // Fallback values
            this.stars = 0;
            this.forks = 0;
        }
    },
    
    createGitHubCard() {
        const section = document.createElement('div');
        section.className = 'glass rounded-3xl p-5 mt-5 border border-white/5 text-center animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-white mb-3 flex items-center justify-center gap-2">
                <i class="fa-brands fa-github text-purple-400"></i> Open Source لە GitHub
            </h3>
            <p class="text-xs text-slate-400 mb-4">ئەم پڕۆژەیە Open Source ە! دەتوانیت لە GitHub دا بەشداری بکەیت</p>
            
            <div class="flex justify-center gap-4 mb-4">
                <div class="text-center">
                    <span class="block text-lg font-black text-amber-400" id="githubStars">${this.stars}</span>
                    <span class="text-[10px] text-slate-500">⭐ ئەستێرە</span>
                </div>
                <div class="text-center">
                    <span class="block text-lg font-black text-sky-400" id="githubForks">${this.forks}</span>
                    <span class="text-[10px] text-slate-500">🔱 Fork</span>
                </div>
            </div>
            
            <div class="flex justify-center gap-2">
                <a href="https://github.com/${this.repo}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all">
                    <i class="fa-brands fa-github"></i> GitHub
                </a>
                <a href="https://github.com/${this.repo}/stargazers" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/30 transition-all">
                    <i class="fa-solid fa-star"></i> ئەستێرە بدە
                </a>
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
    setTimeout(() => GitHubIntegration.init(), 2000);
});
