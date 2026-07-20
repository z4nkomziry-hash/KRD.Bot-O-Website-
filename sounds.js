// KrdDown - Sound Effects System
const SoundFX = {
    enabled: true,
    audioContext: null,
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            this.enabled = false;
        }
    },
    
    // Play success sound
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create a pleasant "ding" sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.setValueAtTime(1100, now + 0.1);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1320, now + 0.1);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.3);
    },
    
    // Play error sound
    playError() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
    },
    
    // Play click sound
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.05);
    },
    
    // Play download complete jingle
    playJingle() {
        if (!this.enabled || !this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            
            gain.gain.setValueAtTime(0.2, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.2);
        });
    },
    
    // Toggle sound
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('krddown_sound', this.enabled ? 'on' : 'off');
        toast(this.enabled ? 'دەنگ چالاک بوو! 🔊' : 'دەنگ کوژایەوە! 🔇', 
              this.enabled ? 'fa-volume-high' : 'fa-volume-xmark');
        if (this.enabled) this.playClick();
    }
};

// Initialize sound system
document.addEventListener('DOMContentLoaded', () => {
    // Initialize on first user interaction
    const initSound = () => {
        SoundFX.init();
        const saved = localStorage.getItem('krddown_sound');
        if (saved === 'off') SoundFX.enabled = false;
        document.removeEventListener('click', initSound);
    };
    document.addEventListener('click', initSound);
    
    // Add sound toggle button to header
    const headerBar = document.querySelector('.social-header-bar .flex.items-center.gap-3');
    if (headerBar) {
        const soundBtn = document.createElement('button');
        soundBtn.className = 'glass-light text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white';
        soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        soundBtn.title = 'Sound Toggle';
        soundBtn.onclick = (e) => {
            e.stopPropagation();
            SoundFX.toggle();
        };
        headerBar.appendChild(soundBtn);
    }
});

// ===== Override toast to add sounds =====
const originalToast = toast;
toast = function(msg, icon) {
    if (icon?.includes('check') || icon?.includes('success') || msg?.includes('سەرکەفتی')) {
        SoundFX.playSuccess();
    } else if (icon?.includes('times') || icon?.includes('error') || icon?.includes('exclamation')) {
        SoundFX.playError();
    } else {
        SoundFX.playClick();
    }
    originalToast(msg, icon);
};

// ===== Play jingle on first successful download =====
let firstDownload = true;
const originalForceDownload2 = forceDownload;
forceDownload = async function(url, filename) {
    if (firstDownload) {
        SoundFX.playJingle();
        firstDownload = false;
    }
    return originalForceDownload2(url, filename);
};
