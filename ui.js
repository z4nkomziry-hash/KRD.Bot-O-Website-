// KrdDown - UI Animations & Effects
const UI = {
    // ===== Scroll Animations =====
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate-hidden');
            observer.observe(el);
        });
    },

    // ===== Ripple Effect on Buttons =====
    addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    },

    // ===== Typing Animation =====
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    },

    // ===== Counter Animation =====
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = Math.floor(target).toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    },

    // ===== Parallax Effect =====
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            document.querySelectorAll('.parallax').forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    },

    // ===== Theme Menu Toggle =====
    showThemeMenu(event) {
        event.stopPropagation();
        const existing = document.querySelector('.theme-menu');
        if (existing) {
            existing.remove();
            return;
        }
        
        const menu = document.createElement('div');
        menu.className = 'theme-menu';
        menu.innerHTML = `
            <button class="theme-option ${document.body.classList.contains('light-mode') ? 'active' : ''}" onclick="UI.setTheme('light')">
                <i class="fa-solid fa-sun"></i> ڕووناک
            </button>
            <button class="theme-option ${!document.body.classList.contains('light-mode') && !document.body.classList.contains('oled-mode') ? 'active' : ''}" onclick="UI.setTheme('dark')">
                <i class="fa-solid fa-moon"></i> تاریک
            </button>
            <button class="theme-option ${document.body.classList.contains('oled-mode') ? 'active' : ''}" onclick="UI.setTheme('oled')">
                <i class="fa-solid fa-circle"></i> OLED
            </button>
            <button class="theme-option ${document.body.classList.contains('sepia-mode') ? 'active' : ''}" onclick="UI.setTheme('sepia')">
                <i class="fa-solid fa-book"></i> Sepia
            </button>
        `;
        
        const rect = event.target.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        
        document.body.appendChild(menu);
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    },

    // ===== Set Theme =====
    setTheme(theme) {
        document.body.classList.remove('light-mode', 'oled-mode', 'sepia-mode');
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('txtTheme');
        
        switch(theme) {
            case 'light':
                document.body.classList.add('light-mode');
                themeIcon.className = 'fa-solid fa-sun';
                themeText.textContent = 'مۆدی ڕووناك';
                localStorage.setItem('tikjet_theme', 'light');
                break;
            case 'dark':
                themeIcon.className = 'fa-solid fa-moon';
                themeText.textContent = 'مۆدی تاریك';
                localStorage.setItem('tikjet_theme', 'dark');
                break;
            case 'oled':
                document.body.classList.add('oled-mode');
                themeIcon.className = 'fa-solid fa-circle';
                themeText.textContent = 'مۆدی OLED';
                localStorage.setItem('tikjet_theme', 'oled');
                break;
            case 'sepia':
                document.body.classList.add('sepia-mode');
                themeIcon.className = 'fa-solid fa-book';
                themeText.textContent = 'مۆدی Sepia';
                localStorage.setItem('tikjet_theme', 'sepia');
                break;
        }
        
        document.querySelector('.theme-menu')?.remove();
        toast('مۆدێ گوهۆری! 🎨', 'fa-palette');
    },

    // ===== Loading Skeleton =====
    showSkeleton(container, count = 6) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            skeleton.style.cssText = `
                height: ${Math.random() * 100 + 100}px;
                margin-bottom: 10px;
                border-radius: 12px;
            `;
            container.appendChild(skeleton);
        }
    },

    // ===== Smooth Scroll to Top =====
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ===== Confetti Effect =====
    celebrate() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#ec4899', '#a855f7', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 999999;
                pointer-events: none;
                animation: confettiFall ${Math.random() * 2 + 2}s ease-in forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }
};

// ===== Confetti Animation =====
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(${Math.random() * 720}deg); opacity: 0; }
    }
    @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
    }
    .animate-hidden { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
    .animate-visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(confettiStyle);

// ===== Initialize UI =====
window.addEventListener('DOMContentLoaded', () => {
    UI.initScrollAnimations();
    UI.initParallax();
    
    // Add ripple effect to download button
    const downloadBtn = document.getElementById('btnDownload');
    if (downloadBtn) UI.addRippleEffect(downloadBtn);
    
    // Add scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollBtn.className = 'fixed bottom-6 right-6 w-12 h-12 rounded-full btn-pink text-white shadow-lg z-50 opacity-0 transition-opacity duration-300 flex items-center justify-center';
    scrollBtn.onclick = UI.scrollToTop;
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        scrollBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
    });
});
