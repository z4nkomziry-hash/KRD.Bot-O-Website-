// KrdDown - Referral System
const ReferralSystem = {
    referralCode: null,
    referrals: [],
    
    init() {
        this.referralCode = this.getOrCreateCode();
        this.loadReferrals();
        this.createReferralUI();
    },
    
    getOrCreateCode() {
        let code = localStorage.getItem('krddown_referral_code');
        if (!code) {
            code = 'KRD' + Math.random().toString(36).substring(2, 8).toUpperCase();
            localStorage.setItem('krddown_referral_code', code);
        }
        return code;
    },
    
    loadReferrals() {
        const saved = localStorage.getItem('krddown_referrals');
        this.referrals = saved ? JSON.parse(saved) : [];
    },
    
    saveReferrals() {
        localStorage.setItem('krddown_referrals', JSON.stringify(this.referrals));
    },
    
    getReferralLink() {
        return `${window.location.origin}?ref=${this.referralCode}`;
    },
    
    addReferral(name) {
        if (this.referrals.find(r => r.name === name)) return;
        this.referrals.push({
            name: name,
            date: new Date().toISOString(),
            downloads: 0
        });
        this.saveReferrals();
        this.updateUI();
        toast('ئاماژەدان زیاد کرا! 🤝', 'fa-user-plus');
    },
    
    createReferralUI() {
        const section = document.createElement('div');
        section.id = 'referralSection';
        section.className = 'glass rounded-3xl p-5 mt-5 border border-amber-500/20 animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-amber-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-gift"></i> سیستمی ئاماژەدان (Referral)
            </h3>
            <div class="bg-white/5 rounded-2xl p-4 mb-3">
                <p class="text-xs text-slate-400 mb-2">کۆدی ئاماژەدانی تۆ:</p>
                <div class="flex items-center gap-2">
                    <code class="bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-lg text-sm font-bold">${this.referralCode}</code>
                    <button onclick="ReferralSystem.copyReferralLink()" class="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-lg">
                        <i class="fa-solid fa-copy"></i> کۆپی
                    </button>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">هاوڕێ ئاماژەپێدراوەکان: <b class="text-white">${this.referrals.length}</b></span>
                <button onclick="ReferralSystem.shareReferral()" class="text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg font-bold">
                    <i class="fa-solid fa-share-nodes"></i> هاوبەشکردن
                </button>
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        }
    },
    
    updateUI() {
        const section = document.getElementById('referralSection');
        if (section) {
            section.querySelector('b').textContent = this.referrals.length;
        }
    },
    
    copyReferralLink() {
        navigator.clipboard.writeText(this.getReferralLink()).then(() => {
            toast('لینکی ئاماژەدان کۆپی کرا! 📋', 'fa-copy');
        });
    },
    
    shareReferral() {
        const text = `🚀 باشترین داونلۆدەری ڤیدیۆ بەکاربهێنە:\n${this.getReferralLink()}\n\nبە کۆدی من: ${this.referralCode}`;
        if (navigator.share) {
            navigator.share({ title: 'KrdDown', text: text });
        } else {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(this.getReferralLink())}&text=${encodeURIComponent(text)}`, '_blank');
        }
    }
};

// Check for referral on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
        localStorage.setItem('krddown_referred_by', refCode);
        toast('بەخێربێیت! تۆ لە ڕێگەی ئاماژەدانەوە هاتوویت! 🎉', 'fa-gift');
    }
    
    ReferralSystem.init();
});
