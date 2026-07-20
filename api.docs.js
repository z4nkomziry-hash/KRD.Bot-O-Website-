// KrdDown - API Documentation & Developer Portal
const APIDocs = {
    endpoints: {
        download: {
            method: 'GET',
            url: 'https://www.tikwm.com/api/',
            params: '?url=VIDEO_URL',
            description: 'داونلۆدی ڤیدیۆ بە بەکارهێنانی API'
        }
    },
    
    init() {
        this.createAPISection();
    },
    
    createAPISection() {
        const section = document.createElement('div');
        section.className = 'glass rounded-3xl p-5 mt-5 border border-sky-500/20 animate-on-scroll';
        section.innerHTML = `
            <h3 class="text-sm font-black text-sky-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-code"></i> API بۆ پەرەپێدەران
            </h3>
            <p class="text-xs text-slate-400 mb-4">پەرەپێدەران دەتوانن KrdDown لە ناو ئەپ و وێبسایتەکانی خۆیاندا بەکاربهێنن</p>
            
            <div class="bg-slate-900 rounded-2xl p-4 text-left mb-3">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">GET</span>
                    <code class="text-xs text-slate-300">https://www.tikwm.com/api/</code>
                </div>
                <p class="text-[10px] text-slate-500 mb-2">پارامێتەرەکان:</p>
                <div class="bg-black/30 rounded-lg p-2 mb-2">
                    <code class="text-[10px] text-pink-400">url</code>
                    <span class="text-[10px] text-slate-500"> - لینکی ڤیدیۆکە (پێویستە)</span>
                </div>
                <p class="text-[10px] text-slate-500 mb-2">نمونەی بەکارهێنان:</p>
                <div class="bg-black/50 rounded-lg p-3 overflow-x-auto">
                    <pre class="text-[10px] text-emerald-400">fetch('https://www.tikwm.com/api/?url=VIDEO_URL')
  .then(res => res.json())
  .then(data => {
    console.log(data.data.play); // Video URL
    console.log(data.data.music); // Audio URL
  });</pre>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-white/5 rounded-xl p-3 text-center">
                    <span class="text-lg font-black text-sky-400">20+</span>
                    <p class="text-[10px] text-slate-500">پلاتفۆرم</p>
                </div>
                <div class="bg-white/5 rounded-xl p-3 text-center">
                    <span class="text-lg font-black text-sky-400">4K</span>
                    <p class="text-[10px] text-slate-500">کوالێتی</p>
                </div>
                <div class="bg-white/5 rounded-xl p-3 text-center">
                    <span class="text-lg font-black text-sky-400">24/7</span>
                    <p class="text-[10px] text-slate-500">ئۆنلاین</p>
                </div>
                <div class="bg-white/5 rounded-xl p-3 text-center">
                    <span class="text-lg font-black text-sky-400">بێبەرامبەر</span>
                    <p class="text-[10px] text-slate-500">هەمیشە</p>
                </div>
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
    setTimeout(() => APIDocs.init(), 3500);
});
