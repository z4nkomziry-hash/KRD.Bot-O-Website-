// KrdDown - Sponsor/Donation System
const SponsorSystem = {
    sponsors: [
        { name: 'هێمن عەلی', amount: '$25', message: 'بەرهەمێکی نایاب! 🎉' },
        { name: 'سارا محەمەد', amount: '$10', message: 'سوپاس بۆ خزمەتگوزارییەکەت' },
        { name: 'دلشاد عمر', amount: '$50', message: 'پشتگیری دەکەم! 💪' },
    ],
    
    init() {
        this.createSponsorButton();
        this.createSponsorModal();
    },
    
    createSponsorButton() {
        // Add sponsor button next to developer card
        const devCard = document.querySelector('.dev-card-modern');
        if (!devCard) return;
        
        const btnDiv = devCard.querySelector('.flex.gap-3');
        if (!btnDiv) return;
        
        const separator = document.createElement('span');
        separator.className = 'text-slate-600';
        separator.textContent = '|';
        
        const sponsorBtn = document.createElement('button');
        sponsorBtn.className = 'text-amber-400 hover:text-amber-300 flex items-center gap-1';
        sponsorBtn.innerHTML = '<i class="fa-solid fa-heart"></i> پشتگیری';
        sponsorBtn.onclick = () => this.showSponsorModal();
        
        btnDiv.appendChild(separator);
        btnDiv.appendChild(sponsorBtn);
    },
    
    createSponsorModal() {
        const modal = document.createElement('div');
        modal.id = 'sponsorModal';
        modal.className = 'welcome-modal';
        modal.onclick = (e) => {
            if (e.target.id === 'sponsorModal') {
                modal.classList.remove('show');
            }
        };
        
        modal.innerHTML = `
            <div class="welcome-content glass w-[90%] max-w-[450px] p-6 rounded-3xl text-center border border-white/10 shadow-2xl">
                <button onclick="document.getElementById('sponsorModal').classList.remove('show')" class="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white text-xs transition-all">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="text-5xl mb-3">💎</div>
                <h3 class="text-lg font-black text-white mb-2">پشتگیری KrdDown بکە</h3>
                <p class="text-xs text-slate-400 mb-4">یارمەتیمان بدە بۆ بەردەوامبوونی خزمەتگوزاری بێبەرامبەر</p>
                
                <div class="grid grid-cols-3 gap-2 mb-4">
                    <button onclick="SponsorSystem.donate('5')" class="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all text-white font-bold text-sm">$5</button>
                    <button onclick="SponsorSystem.donate('10')" class="p-3 rounded-xl bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 transition-all text-amber-400 font-bold text-sm">$10</button>
                    <button onclick="SponsorSystem.donate('25')" class="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all text-white font-bold text-sm">$25</button>
                </div>
                
                <div class="space-y-2 mb-4">
                    ${this.sponsors.map(s => `
                        <div class="flex items-center justify-between bg-white/5 rounded-xl p-2.5 border border-white/5">
                            <div class="flex items-center gap-2">
                                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">
                                    ${s.name.charAt(0)}
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-white font-bold">${s.name}</p>
                                    <p class="text-[10px] text-slate-500">${s.message}</p>
                                </div>
                            </div>
                            <span class="text-xs font-black text-amber-400">${s.amount}</span>
                        </div>
                    `).join('')}
                </div>
                
                <a href="https://www.buymeacoffee.com/zaniyar" target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm rounded-xl transition-all">
                    <i class="fa-solid fa-mug-hot"></i> Buy Me a Coffee
                </a>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    showSponsorModal() {
        const modal = document.getElementById('sponsorModal');
        if (modal) modal.classList.add('show');
    },
    
    donate(amount) {
        window.open(`https://www.buymeacoffee.com/zaniyar`, '_blank');
        toast('سوپاس بۆ پشتگیری تۆ! ❤️', 'fa-heart');
        if (typeof SoundFX !== 'undefined') SoundFX.playJingle();
        if (typeof UI !== 'undefined') UI.celebrate();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => SponsorSystem.init(), 1500);
});
