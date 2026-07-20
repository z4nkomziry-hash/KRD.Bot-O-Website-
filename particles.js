// KrdDown - Floating Particles Background
const ParticlesSystem = {
    colors: ['#8b5cf6', '#d946ef', '#ec4899', '#3b82f6', '#10b981'],
    
    init() {
        this.createContainer();
        this.createParticles();
    },
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        container.id = 'particlesContainer';
        document.body.appendChild(container);
    },
    
    createParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;
        
        const count = 20;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 10;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            container.appendChild(particle);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    ParticlesSystem.init();
});
