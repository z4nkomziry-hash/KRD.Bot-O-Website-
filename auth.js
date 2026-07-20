// KrdDown - User Authentication System
const AuthSystem = {
    currentUser: null,
    users: [],
    
    init() {
        this.loadUsers();
        this.checkLoginStatus();
        this.createAuthUI();
    },
    
    loadUsers() {
        const saved = localStorage.getItem('krddown_users');
        this.users = saved ? JSON.parse(saved) : [];
    },
    
    saveUsers() {
        localStorage.setItem('krddown_users', JSON.stringify(this.users));
    },
    
    checkLoginStatus() {
        const saved = localStorage.getItem('krddown_current_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.updateUIForLoggedInUser();
        }
    },
    
    createAuthUI() {
        // Add login/register button to header
        const headerBar = document.querySelector('.social-header-bar .flex.items-center.gap-3');
        if (!headerBar) return;
        
        const authBtn = document.createElement('button');
        authBtn.id = 'authBtn';
        authBtn.className = 'glass-light text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer text-amber-400';
        
        if (this.currentUser) {
            authBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${this.currentUser.name}`;
            authBtn.onclick = () => this.showUserMenu();
        } else {
            authBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> هەژمار';
            authBtn.onclick = () => this.showLoginModal();
        }
        
        headerBar.appendChild(authBtn);
    },
    
    updateUIForLoggedInUser() {
        const authBtn = document.getElementById('authBtn');
        if (authBtn && this.currentUser) {
            authBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${this.currentUser.name}`;
            authBtn.onclick = () => this.showUserMenu();
        }
    },
    
    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'welcome-modal show';
        modal.id = 'loginModal';
        modal.onclick = (e) => { if (e.target.id === 'loginModal') modal.remove(); };
        
        modal.innerHTML = `
            <div class="welcome-content glass w-[90%] max-w-[400px] p-6 rounded-3xl text-center border border-white/10 shadow-2xl">
                <button onclick="document.getElementById('loginModal').remove()" class="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white text-xs transition-all">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="text-4xl mb-3">👤</div>
                <h3 class="text-lg font-black text-white mb-4">دروستکردنی هەژمار</h3>
                
                <div class="space-y-3 mb-4">
                    <input type="text" id="loginName" placeholder="ناوی تەواو..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50">
                    <input type="email" id="loginEmail" placeholder="ئیمەیڵ (ئارەزوومەندانە)..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50">
                    <input type="password" id="loginPassword" placeholder="وشەی نهێنی..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50">
                </div>
                
                <button onclick="AuthSystem.register()" class="w-full btn-pink text-white font-bold py-3 rounded-xl mb-2">
                    <i class="fa-solid fa-user-plus mr-2"></i> دروستکردنی هەژمار
                </button>
                
                <p class="text-[10px] text-slate-500 mt-3">
                    بە دروستکردنی هەژمار، مێژووی داونلۆدەکانت پارێزراو دەبێت
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    register() {
        const name = document.getElementById('loginName')?.value.trim();
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value.trim();
        
        if (!name) return toast('تکایە ناوی خۆت بنووسە', 'fa-exclamation-circle');
        if (!password) return toast('تکایە وشەی نهێنی بنووسە', 'fa-exclamation-circle');
        
        // Check if user exists
        const existingUser = this.users.find(u => u.name === name);
        if (existingUser) {
            // Login
            if (existingUser.password === password) {
                this.currentUser = existingUser;
                this.login();
                document.getElementById('loginModal')?.remove();
                toast('بەخێربێیتەوە ' + name + '! 👋', 'fa-hand-wave');
            } else {
                toast('وشەی نهێنی هەڵەیە!', 'fa-lock');
            }
            return;
        }
        
        // Register new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            avatar: this.generateAvatar(name),
            joinDate: new Date().toISOString(),
            downloads: 0,
            favorites: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        this.login();
        
        document.getElementById('loginModal')?.remove();
        toast('بەخێربێیت ' + name + '! 🎉', 'fa-party-horn');
        
        if (typeof UI !== 'undefined') UI.celebrate();
    },
    
    login() {
        localStorage.setItem('krddown_current_user', JSON.stringify(this.currentUser));
        this.updateUIForLoggedInUser();
        this.createUserProfileCard();
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('krddown_current_user');
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> هەژمار';
            authBtn.onclick = () => this.showLoginModal();
        }
        const profileCard = document.getElementById('userProfileCard');
        if (profileCard) profileCard.remove();
        toast('بە سڵامەتی! 👋', 'fa-hand-wave');
    },
    
    showUserMenu() {
        const menu = document.createElement('div');
        menu.className = 'welcome-modal show';
        menu.id = 'userMenuModal';
        menu.onclick = (e) => { if (e.target.id === 'userMenuModal') menu.remove(); };
        
        menu.innerHTML = `
            <div class="welcome-content glass w-[90%] max-w-[350px] p-6 rounded-3xl text-center border border-white/10 shadow-2xl">
                <button onclick="document.getElementById('userMenuModal').remove()" class="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white text-xs transition-all">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                    ${this.currentUser?.avatar || '👤'}
                </div>
                <h3 class="text-lg font-black text-white mb-1">${this.currentUser?.name}</h3>
                <p class="text-xs text-slate-400 mb-3">${this.currentUser?.email || 'ئیمەیڵ نەنووسراوە'}</p>
                
                <div class="flex justify-center gap-4 mb-4">
                    <div class="text-center">
                        <span class="block text-lg font-black text-pink-500">${this.currentUser?.downloads || 0}</span>
                        <span class="text-[10px] text-slate-500">داونلۆد</span>
                    </div>
                    <div class="text-center">
                        <span class="block text-lg font-black text-amber-400">${this.currentUser?.favorites?.length || 0}</span>
                        <span class="text-[10px] text-slate-500">پەسەندکراو</span>
                    </div>
                </div>
                
                <button onclick="AuthSystem.logout()" class="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2.5 rounded-xl text-sm transition-all">
                    <i class="fa-solid fa-right-from-bracket mr-2"></i> چوونە دەرەوە
                </button>
            </div>
        `;
        
        document.body.appendChild(menu);
    },
    
    generateAvatar(name) {
        // Generate emoji avatar based on name
        const emojis = ['🦁', '🐯', '🐼', '🦊', '🐨', '🐰', '🦄', '🐲', '🦅', '🦉'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return emojis[Math.abs(hash) % emojis.length];
    },
    
    createUserProfileCard() {
        const existing = document.getElementById('userProfileCard');
        if (existing) existing.remove();
        
        const card = document.createElement('div');
        card.id = 'userProfileCard';
        card.className = 'glass rounded-3xl p-5 mt-5 text-center border border-violet-500/20 animate-on-scroll';
        card.innerHTML = `
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-black mx-auto mb-2">
                ${this.currentUser?.avatar}
            </div>
            <h3 class="text-sm font-black text-white">${this.currentUser?.name}</h3>
            <p class="text-[10px] text-slate-400 mb-3">بەخێربێیتەوە! داونلۆدەکانت لێرە پارێزراو دەبن</p>
            <div class="flex justify-center gap-3 text-[10px]">
                <span class="text-pink-400"><i class="fa-solid fa-download mr-1"></i> ${this.currentUser?.downloads || 0} داونلۆد</span>
                <span class="text-amber-400"><i class="fa-solid fa-heart mr-1"></i> ${this.currentUser?.favorites?.length || 0} پەسەند</span>
            </div>
        `;
        
        const promoSection = document.querySelector('.mt-5.space-y-4');
        if (promoSection) {
            promoSection.parentNode.insertBefore(card, promoSection);
        }
    },
    
    incrementDownloads() {
        if (this.currentUser) {
            this.currentUser.downloads = (this.currentUser.downloads || 0) + 1;
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].downloads = this.currentUser.downloads;
                this.saveUsers();
            }
            localStorage.setItem('krddown_current_user', JSON.stringify(this.currentUser));
        }
    }
};

// Override download function to count downloads
const originalDownloadVideo = downloadVideo;
downloadVideo = async function() {
    await originalDownloadVideo();
    AuthSystem.incrementDownloads();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => AuthSystem.init(), 500);
});
