// KrdDown - Kurdish Calendar & Events
const KurdistanCalendar = {
    kurdishMonths: [
        'خاکەلێوە', 'گوڵان', 'جۆزەردان', 'پووشپەڕ',
        'گەلاوێژ', 'خەرمانان', 'ڕەزبەر', 'گەڵاڕێزان',
        'سەرماوەز', 'بەفرانبار', 'ڕێبەندان', 'ڕەشەمێ'
    ],
    
    kurdishDays: [
        'یەکشەممە', 'دووشەممە', 'سێشەممە',
        'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'
    ],
    
    events: [
        { date: '03-21', title: 'نەورۆز پیرۆز بێت! 🌸', icon: 'fa-fire' },
        { date: '03-14', title: 'یادی هەڵەبجە 🕊️', icon: 'fa-dove' },
        { date: '03-08', title: 'ڕۆژی جیهانی ژنان 👩‍👧‍👧', icon: 'fa-venus' },
    ],
    
    init() {
        this.createCalendarWidget();
        this.checkTodayEvents();
    },
    
    getCurrentKurdishDate() {
        const now = new Date();
        const day = this.kurdishDays[now.getDay()];
        const month = this.kurdishMonths[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear() + 700; // Approximate Kurdish year
        
        return { day, month, date, year };
    },
    
    checkTodayEvents() {
        const today = new Date();
        const todayStr = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        
        const todayEvent = this.events.find(e => e.date === todayStr);
        if (todayEvent) {
            setTimeout(() => {
                toast(todayEvent.title, todayEvent.icon);
            }, 4000);
        }
    },
    
    createCalendarWidget() {
        const kurdishDate = this.getCurrentKurdishDate();
        
        const widget = document.createElement('div');
        widget.className = 'glass rounded-3xl p-5 mt-5 text-center border border-emerald-500/20 animate-on-scroll';
        widget.innerHTML = `
            <h3 class="text-sm font-black text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <i class="fa-solid fa-calendar-days"></i> ڕۆژژمێری کوردی
            </h3>
            <div class="text-2xl font-black text-white mb-1">${kurdishDate.date} ${kurdishDate.month}</div>
            <div class="text-sm text-slate-400 mb-1">${kurdishDate.day}</div>
            <div class="text-xs text-slate-500">ساڵی ${kurdishDate.year}ی کوردی</div>
            
            <div class="mt-3 pt-3 border-t border-white/5">
                <p class="text-[10px] text-slate-500">
                    <i class="fa-solid fa-location-dot text-rose-400"></i> 
                    Made with ❤️ in Kurdistan
                </p>
            </div>
        `;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(widget, footer);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => KurdistanCalendar.init(), 3000);
});
