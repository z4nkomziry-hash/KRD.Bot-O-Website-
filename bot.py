#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KrdDown Telegram Bot - 24/7 Online
Developed by Zaniyar Al-Mzuri Al-Kurdi
GitHub: https://github.com/zaniyar/krddown
"""

import os
import re
import json
import time
import logging
import asyncio
import aiohttp
from datetime import datetime
from urllib.parse import quote

# Telegram Bot
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, BotCommand
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters
from telegram.constants import ParseMode

# ===== Configuration =====
# Replace with your bot token from @BotFather
BOT_TOKEN = "8241969791:AAFk0huUXrMTccIDY33p1sx1ioXQ8hMk92k"

# Webhook URL for production (leave empty for polling mode)
WEBHOOK_URL = os.environ.get('WEBHOOK_URL', '')
PORT = int(os.environ.get('PORT', 8080))

# ===== Logging =====
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ===== Bot Configuration =====
BOT_NAME = "KrdDown Downloader"
BOT_USERNAME = "@KrdDownBot"
WEBSITE_URL = "https://krddown.vercel.app"
ADMIN_URL = "https://krddown.vercel.app/admin.html"
DONATE_URL = "https://krddown.vercel.app/donate.html"

# ===== Supported Platforms =====
PLATFORMS = {
    'tiktok.com': {'name': 'TikTok', 'icon': '🎵', 'api': 'tikwm', 'color': '#ff0050'},
    'vm.tiktok.com': {'name': 'TikTok', 'icon': '🎵', 'api': 'tikwm', 'color': '#ff0050'},
    'vt.tiktok.com': {'name': 'TikTok', 'icon': '🎵', 'api': 'tikwm', 'color': '#ff0050'},
    'instagram.com': {'name': 'Instagram', 'icon': '📸', 'api': 'cobalt', 'color': '#e1306c'},
    'instagr.am': {'name': 'Instagram', 'icon': '📸', 'api': 'cobalt', 'color': '#e1306c'},
    'youtube.com': {'name': 'YouTube', 'icon': '▶️', 'api': 'cobalt', 'color': '#ff0000'},
    'youtu.be': {'name': 'YouTube', 'icon': '▶️', 'api': 'cobalt', 'color': '#ff0000'},
    'facebook.com': {'name': 'Facebook', 'icon': '📘', 'api': 'cobalt', 'color': '#1877f2'},
    'fb.watch': {'name': 'Facebook', 'icon': '📘', 'api': 'cobalt', 'color': '#1877f2'},
    'fb.com': {'name': 'Facebook', 'icon': '📘', 'api': 'cobalt', 'color': '#1877f2'},
    'snapchat.com': {'name': 'Snapchat', 'icon': '👻', 'api': 'cobalt', 'color': '#fffc00'},
    'pinterest.com': {'name': 'Pinterest', 'icon': '📌', 'api': 'cobalt', 'color': '#e60023'},
    'pin.it': {'name': 'Pinterest', 'icon': '📌', 'api': 'cobalt', 'color': '#e60023'},
    'twitter.com': {'name': 'Twitter/X', 'icon': '🐦', 'api': 'cobalt', 'color': '#1da1f2'},
    'x.com': {'name': 'Twitter/X', 'icon': '🐦', 'api': 'cobalt', 'color': '#1da1f2'},
    'reddit.com': {'name': 'Reddit', 'icon': '🤖', 'api': 'cobalt', 'color': '#ff4500'},
    'vimeo.com': {'name': 'Vimeo', 'icon': '🎬', 'api': 'cobalt', 'color': '#1ab7ea'},
    'dailymotion.com': {'name': 'Dailymotion', 'icon': '📺', 'api': 'cobalt', 'color': '#00aaff'},
    'linkedin.com': {'name': 'LinkedIn', 'icon': '💼', 'api': 'cobalt', 'color': '#0a66c2'},
    'twitch.tv': {'name': 'Twitch', 'icon': '🎮', 'api': 'cobalt', 'color': '#9146ff'},
}

# ===== User Statistics =====
user_stats = {}
total_downloads = 0
platform_stats = {}

# ===== API Functions =====
async def download_tiktok(url):
    """Download TikTok video using tikwm API"""
    try:
        api_url = f'https://www.tikwm.com/api/?url={quote(url)}'
        
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url, timeout=30) as response:
                data = await response.json()
                
                if data.get('code') == 0 and data.get('data'):
                    video_data = data['data']
                    
                    result = {
                        'success': True,
                        'platform': 'TikTok',
                        'author': video_data.get('author', {}).get('nickname', 'Unknown'),
                        'title': video_data.get('title', 'No Title'),
                        'video_url': video_data.get('play'),
                        'audio_url': video_data.get('music'),
                        'images': video_data.get('images', []),
                        'cover': video_data.get('cover'),
                        'duration': video_data.get('duration', 0),
                        'views': video_data.get('play_count', 0),
                        'likes': video_data.get('digg_count', 0),
                        'id': video_data.get('id', 'unknown')
                    }
                    
                    return result
                    
        return {'success': False, 'error': 'Could not fetch video'}
        
    except Exception as e:
        logger.error(f"TikTok download error: {e}")
        return {'success': False, 'error': str(e)}

async def download_cobalt(url):
    """Download using Cobalt API (Universal)"""
    try:
        api_url = 'https://api.cobalt.tools/api/json'
        
        payload = {
            'url': url,
            'vQuality': '720',
            'filenamePattern': 'basic',
            'isAudioOnly': False
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(api_url, json=payload, headers=headers, timeout=60) as response:
                result = await response.json()
                
                if result.get('status') in ['redirect', 'stream', 'tunnel']:
                    return {
                        'success': True,
                        'platform': 'Social Media',
                        'author': 'Download Ready',
                        'title': 'Video',
                        'video_url': result.get('url'),
                        'audio_url': result.get('url'),
                        'images': [],
                        'cover': None,
                        'id': str(int(time.time()))
                    }
                elif result.get('status') == 'picker' and result.get('picker'):
                    return {
                        'success': True,
                        'platform': 'Social Media',
                        'author': 'Album Ready',
                        'title': 'Photo Album',
                        'video_url': None,
                        'audio_url': None,
                        'images': [item.get('url') for item in result['picker']],
                        'cover': None,
                        'id': str(int(time.time()))
                    }
                    
        return {'success': False, 'error': 'Download failed'}
        
    except Exception as e:
        logger.error(f"Cobalt download error: {e}")
        return {'success': False, 'error': str(e)}

def detect_platform(url):
    """Detect platform from URL"""
    url_lower = url.lower()
    
    for domain, info in PLATFORMS.items():
        if domain in url_lower:
            return info
    
    return {'name': 'Unknown', 'icon': '🔗', 'api': 'cobalt', 'color': '#ffffff'}

async def download_media(url):
    """Smart download - auto detect platform and download"""
    global total_downloads, platform_stats
    
    platform = detect_platform(url)
    logger.info(f"Downloading from {platform['name']}: {url[:80]}...")
    
    if platform['api'] == 'tikwm':
        result = await download_tiktok(url)
    else:
        result = await download_cobalt(url)
    
    if result.get('success'):
        result['platform'] = platform['name']
        result['platform_icon'] = platform['icon']
        result['platform_color'] = platform['color']
        
        # Update stats
        total_downloads += 1
        platform_stats[platform['name']] = platform_stats.get(platform['name'], 0) + 1
    
    return result

# ===== Telegram Handlers =====
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send welcome message when /start is issued"""
    user = update.effective_user
    user_id = str(user.id)
    
    # Track user
    if user_id not in user_stats:
        user_stats[user_id] = {
            'name': user.first_name,
            'username': user.username,
            'downloads': 0,
            'first_seen': datetime.now().isoformat()
        }
    
    welcome_text = f"""
<b>🎉 بەخێربێیت بۆ {BOT_NAME}!</b>

<b>{user.first_name}</b>ی بەڕێز،
ئەم بۆتە دەتوانێت ڤیدیۆ لە زیاتر لە <b>20+ پلاتفۆرم</b> داونلۆد بکات!

<b>📋 پلاتفۆرمە پشتگیریکراوەکان:</b>
• 🎵 TikTok (بێ واتەرمارک)
• 📸 Instagram (Reels, Posts, Stories)
• ▶️ YouTube (Shorts, Videos)
• 📘 Facebook (Videos, Reels)
• 👻 Snapchat
• 📌 Pinterest
• 🐦 Twitter/X
• 🤖 Reddit
• 🎬 Vimeo
• 📺 Dailymotion
• 🎮 Twitch

<b>🛠 چۆنیەتی بەکارهێنان:</b>
تەنها <b>لینکی ڤیدیۆکە</b> بنێرە و چاوەڕێی داونلۆد بە!

━━━━━━━━━━━━━━━━━━
<b>👨‍💻 گەشەپێدەر:</b> Zaniyar Al-Mzuri
<b>🌐 وێبسایت:</b> {WEBSITE_URL}
━━━━━━━━━━━━━━━━━━
"""
    
    keyboard = [
        [
            InlineKeyboardButton("🌐 وێبسایت", url=WEBSITE_URL),
            InlineKeyboardButton("📊 ئەدمین", url=ADMIN_URL)
        ],
        [
            InlineKeyboardButton("💎 پشتگیری", url=DONATE_URL),
            InlineKeyboardButton("📊 ئاماری من", callback_data="mystats")
        ],
        [
            InlineKeyboardButton("📢 هاوبەشکردن", switch_inline_query=""),
            InlineKeyboardButton("📖 ڕێبەر", callback_data="guide")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Send welcome photo if available
    try:
        await update.message.reply_photo(
            photo="https://krddown.vercel.app/icon.png",
            caption=welcome_text,
            parse_mode=ParseMode.HTML,
            reply_markup=reply_markup
        )
    except:
        await update.message.reply_text(
            welcome_text,
            parse_mode=ParseMode.HTML,
            reply_markup=reply_markup,
            disable_web_page_preview=True
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send help message"""
    help_text = f"""
<b>📚 ڕێبەری بەکارهێنانی {BOT_NAME}</b>

<b>1️⃣ داونلۆدی ڤیدیۆ (سادەترین ڕێگە):</b>
تەنها لینکی ڤیدیۆکە بنێرە

<b>2️⃣ داونلۆدی بێ واتەرمارک:</b>
بۆ TikTok و Instagram بێ واتەرمارک

<b>3️⃣ کوالێتی بەرز:</b>
پشتگیری HD, Full HD, 4K

<b>4️⃣ داونلۆدی وێنەکان:</b>
بۆ پۆستی وێنەیی، هەموو وێنەکان یەکسەر دەنێردرێن

<b>💡 فەرمانەکان:</b>
/start - دەستپێکردنەوە
/help - یارمەتی
/stats - ئامارەکانی بۆت
/about - دەربارەی بۆت
/donate - پشتگیری
/website - وێبسایت

<b>⚠️ تێبینی:</b>
بۆ ڤیدیۆی گەورە، چاوەڕێ بە!
"""
    await update.message.reply_text(help_text, parse_mode=ParseMode.HTML)

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show bot statistics"""
    users_count = len(user_stats)
    
    stats_text = f"""
<b>📊 ئاماری {BOT_NAME}</b>

• 🟢 <b>ڕەوش:</b> Online 24/7
• 👥 <b>بەکارهێنەران:</b> {users_count}
• 📥 <b>کۆی داونلۆدەکان:</b> {total_downloads}
• ⚡ <b>خێرایی:</b> High Speed
• 🌐 <b>پلاتفۆرم:</b> 20+
• 💎 <b>کوالێتی:</b> Up to 4K
• 🔒 <b>ئاسایش:</b> Encrypted

━━━━━━━━━━━━━━━━━━
<b>📈 داونلۆدەکان بەپێی پلاتفۆرم:</b>
"""
    
    if platform_stats:
        sorted_platforms = sorted(platform_stats.items(), key=lambda x: x[1], reverse=True)
        for platform, count in sorted_platforms[:10]:
            icon = next((v['icon'] for v in PLATFORMS.values() if v['name'] == platform), '📹')
            stats_text += f"\n{icon} <b>{platform}:</b> {count}"
    else:
        stats_text += "\n📭 هێشتا هیچ داونلۆدێک نەکراوە"
    
    stats_text += f"""
━━━━━━━━━━━━━━━━━━
<b>تایبەتمەندییەکان:</b>
✅ داونلۆدی بێ واتەرمارک
✅ پشتگیری 20+ پلاتفۆرم
✅ کوالێتی HD/4K
✅ داونلۆدی خێرا
✅ 24/7 ئۆنلاین
"""
    await update.message.reply_text(stats_text, parse_mode=ParseMode.HTML)

async def about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """About the bot"""
    about_text = f"""
<b>🚀 دەربارەی {BOT_NAME}</b>

ئەم بۆتە لە لایەن <b>Zaniyar Al-Mzuri</b> گەشەپێدراوە.
ئامانجی ئەم پلاتفۆرمە پێشکەشکردنی خزمەتگوزارییەکی خێرا و بێبەرامبەرە بۆ داونلۆدی ڤیدیۆ.

<b>📱 تۆڕە کۆمەڵایەتییەکان:</b>
• Instagram: @z44nko
• TikTok: @z44nko
• Telegram: @z_14x
• Snapchat: z44nko

<b>🌐 وێبسایت:</b>
{WEBSITE_URL}

<b>💎 پشتگیری بکە:</b>
/donate
"""
    await update.message.reply_text(about_text, parse_mode=ParseMode.HTML)

async def website_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send website link"""
    keyboard = [[InlineKeyboardButton("🌐 بکەرەوەی وێبسایت", url=WEBSITE_URL)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        f"🌐 <b>وێبسایتی KrdDown</b>\n\n"
        f"بۆ داونلۆدی ڤیدیۆ بە کوالێتی بەرزتر و ئەزموونێکی باشتر، "
        f"سەردانی وێبسایتەکەمان بکە:\n\n"
        f"🔗 {WEBSITE_URL}",
        parse_mode=ParseMode.HTML,
        reply_markup=reply_markup
    )

async def donate_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Donation information"""
    donate_text = """
<b>💎 پشتگیری KrdDown Bot بکە</b>

ئەگەر ئەم بۆتە بەسوود بوو بۆت، دەتوانیت پشتگیریمان بکەیت:

<b>☕ Buy Me a Coffee:</b>
https://www.buymeacoffee.com/zaniyar

<b>💳 PayPal:</b>
https://paypal.me/zaniyar

━━━━━━━━━━━━━━━━━━
<b>❤️ سوپاس بۆ پشتگیری تۆ!</b>
هەموو بەخشینێک یارمەتی بەردەوامبوونی خزمەتگوزاری بێبەرامبەر دەدات
"""
    keyboard = [
        [InlineKeyboardButton("☕ Buy Me a Coffee", url="https://www.buymeacoffee.com/zaniyar")],
        [InlineKeyboardButton("💳 PayPal", url="https://paypal.me/zaniyar")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(donate_text, parse_mode=ParseMode.HTML, reply_markup=reply_markup)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming messages - detect URL and download"""
    message = update.message
    text = message.text.strip()
    user = message.from_user
    user_id = str(user.id)
    chat_id = message.chat_id
    
    # Track user
    if user_id not in user_stats:
        user_stats[user_id] = {
            'name': user.first_name,
            'username': user.username,
            'downloads': 0,
            'first_seen': datetime.now().isoformat()
        }
    
    # Check if message contains URL
    url_pattern = r'https?://[^\s]+'
    urls = re.findall(url_pattern, text)
    
    if not urls:
        # No URL found - send help
        await message.reply_text(
            "⚠️ <b>تکایە لینکی ڤیدیۆکە بنێرە!</b>\n\n"
            "بۆ نمونە:\n"
            "<code>https://www.tiktok.com/@user/video/123456789</code>\n"
            "<code>https://www.instagram.com/reel/ABC123/</code>\n"
            "<code>https://youtube.com/shorts/ABC123</code>\n\n"
            "📋 /help بۆ ڕێبەری بەکارهێنان",
            parse_mode=ParseMode.HTML
        )
        return
    
    # Process URL
    url = urls[0]
    platform = detect_platform(url)
    
    # Send processing message
    processing_msg = await message.reply_text(
        f"{platform['icon']} <b>لینک دۆزرایەوە!</b>\n"
        f"📱 پلاتفۆرم: <b>{platform['name']}</b>\n\n"
        f"⏳ <b>چاوەڕێ بە...</b>\n"
        f"ڤیدیۆکەت ئامادە دەکرێت...",
        parse_mode=ParseMode.HTML
    )
    
    # Send typing action
    await context.bot.send_chat_action(chat_id=chat_id, action="upload_video")
    
    try:
        # Download media
        result = await download_media(url)
        
        if result.get('success'):
            # Update user stats
            user_stats[user_id]['downloads'] = user_stats[user_id].get('downloads', 0) + 1
            
            if result.get('video_url'):
                video_url = result['video_url']
                
                # Prepare caption
                caption = f"{result.get('platform_icon', '🎬')} <b>{result.get('platform', 'Video')}</b>"
                if result.get('author'):
                    caption += f"\n👤 <b>بەکارهێنەر:</b> {result['author']}"
                if result.get('title') and result['title'] != 'Video' and result['title'] != 'No Title':
                    caption += f"\n📝 <b>ناونیشان:</b> {result['title'][:100]}"
                
                if result.get('views'):
                    caption += f"\n👁 <b>بینین:</b> {result['views']:,}"
                if result.get('likes'):
                    caption += f"\n❤️ <b>لایک:</b> {result['likes']:,}"
                
                caption += f"\n\n⚡ <b>داونلۆد کرا لە:</b> {BOT_USERNAME}"
                caption += f"\n🌐 <b>وێبسایت:</b> {WEBSITE_URL}"
                
                # Try to send as video
                try:
                    await message.reply_video(
                        video=video_url,
                        caption=caption,
                        parse_mode=ParseMode.HTML,
                        supports_streaming=True,
                        reply_to_message_id=message.message_id
                    )
                    await processing_msg.delete()
                    
                    logger.info(f"✅ Download sent: {platform['name']} for @{user.username or user_id}")
                    
                except Exception as e:
                    logger.warning(f"Cannot send video directly: {e}")
                    
                    keyboard = [
                        [
                            InlineKeyboardButton("📥 داونلۆدی ڤیدیۆ", url=video_url),
                            InlineKeyboardButton("🎵 داونلۆدی دەنگ", url=result.get('audio_url', video_url))
                        ],
                        [
                            InlineKeyboardButton("🌐 بکەرەوە لە وێبسایت", url=WEBSITE_URL)
                        ]
                    ]
                    reply_markup = InlineKeyboardMarkup(keyboard)
                    
                    await processing_msg.edit_text(
                        f"{caption}\n\n"
                        f"⚠️ <b>ڤیدیۆکە زۆر گەورەیە!</b>\n"
                        f"تکایە لەسەر دوگمەی خوارەوە کلیک بکە بۆ داونلۆد:",
                        parse_mode=ParseMode.HTML,
                        reply_markup=reply_markup
                    )
                    
            elif result.get('images'):
                # Send photos
                images = result['images'][:10]
                
                caption = f"{result.get('platform_icon', '📸')} <b>{result.get('platform', 'Album')}</b>"
                if result.get('author'):
                    caption += f"\n👤 <b>بەکارهێنەر:</b> {result['author']}"
                caption += f"\n🖼 <b>ژمارەی وێنەکان:</b> {len(images)}"
                caption += f"\n\n⚡ <b>{BOT_USERNAME}</b>"
                
                if len(images) == 1:
                    await message.reply_photo(
                        photo=images[0],
                        caption=caption,
                        parse_mode=ParseMode.HTML,
                        reply_to_message_id=message.message_id
                    )
                else:
                    # Send as album
                    media_group = []
                    for i, img_url in enumerate(images):
                        if i == 0:
                            media_group.append({
                                'type': 'photo',
                                'media': img_url,
                                'caption': caption,
                                'parse_mode': ParseMode.HTML
                            })
                        else:
                            media_group.append({'type': 'photo', 'media': img_url})
                    
                    await message.reply_media_group(
                        media=media_group,
                        reply_to_message_id=message.message_id
                    )
                
                await processing_msg.delete()
                logger.info(f"✅ Album sent: {platform['name']}")
        else:
            await processing_msg.edit_text(
                f"❌ <b>هەڵە!</b>\n"
                f"نەتوانرا ڤیدیۆکە داونلۆد بکرێت.\n\n"
                f"🔗 لینکەکە دڵنیا بەوە کە دروستە!\n"
                f"🔒 هەندێک ڤیدیۆ پرایڤەتن و ناتوانرێن داونلۆد بکرێن.\n\n"
                f"📋 /help بۆ یارمەتی\n"
                f"🌐 سەردانی {WEBSITE_URL} بکە بۆ داونلۆدی ڕاستەوخۆ",
                parse_mode=ParseMode.HTML
            )
            
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        await processing_msg.edit_text(
            "❌ <b>کێشەیەک ڕوویدا!</b>\n"
            "تکایە دواتر هەوڵبدەرەوە.\n\n"
            f"📋 /help بۆ یارمەتی\n"
            f"🌐 سەردانی وێبسایت بکە: {WEBSITE_URL}",
            parse_mode=ParseMode.HTML
        )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle button clicks"""
    query = update.callback_query
    await query.answer()
    
    user_id = str(query.from_user.id)
    
    if query.data == "mystats":
        downloads = user_stats.get(user_id, {}).get('downloads', 0)
        await query.message.reply_text(
            f"📊 <b>ئاماری تۆ</b>\n\n"
            f"👤 <b>ناو:</b> {query.from_user.first_name}\n"
            f"📥 <b>داونلۆدەکان:</b> {downloads}\n"
            f"📅 <b>یەکەم سەردان:</b> {user_stats.get(user_id, {}).get('first_seen', 'نەزانراو')[:10]}\n\n"
            f"⚡ <b>{BOT_USERNAME}</b>",
            parse_mode=ParseMode.HTML
        )
    
    elif query.data == "guide":
        await help_command(update, context)

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle errors"""
    logger.error(f"Update {update} caused error {context.error}")
    
    try:
        if update and update.effective_message:
            await update.effective_message.reply_text(
                "❌ کێشەیەکی تەکنیکی ڕوویدا.\n"
                "تکایە دواتر هەوڵبدەرەوە."
            )
    except:
        pass

# ===== Health Check Endpoint =====
from aiohttp import web

async def health_check(request):
    """Health check endpoint for monitoring"""
    return web.Response(
        text=json.dumps({
            'status': 'ok',
            'bot': BOT_USERNAME,
            'uptime': '24/7',
            'users': len(user_stats),
            'downloads': total_downloads
        }),
        content_type='application/json'
    )

async def start_web_server():
    """Start aiohttp web server for health checks"""
    app = web.Application()
    app.router.add_get('/health', health_check)
    app.router.add_get('/', health_check)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PORT)
    await site.start()
    logger.info(f"Health check server running on port {PORT}")

# ===== Main Application =====
def main():
    """Start the bot"""
    logger.info(f"🤖 Starting {BOT_NAME}...")
    logger.info(f"👤 Bot: {BOT_USERNAME}")
    logger.info(f"🌐 Website: {WEBSITE_URL}")
    logger.info("=" * 50)
    
    # Validate token
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE" or not BOT_TOKEN:
        logger.error("❌ BOT_TOKEN is not set! Please set your bot token.")
        return
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("about", about_command))
    application.add_handler(CommandHandler("donate", donate_command))
    application.add_handler(CommandHandler("website", website_command))
    
    # Add message handler for URLs
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Add callback handler
    application.add_handler(CallbackQueryHandler(button_callback))
    
    # Add error handler
    application.add_error_handler(error_handler)
    
    # Set bot commands
    commands = [
        BotCommand("start", "🚀 دەستپێکردن"),
        BotCommand("help", "📋 یارمەتی"),
        BotCommand("stats", "📊 ئامارەکان"),
        BotCommand("about", "ℹ️ دەربارە"),
        BotCommand("donate", "💎 پشتگیری"),
        BotCommand("website", "🌐 وێبسایت"),
    ]
    
    # Start health check server
    loop = asyncio.get_event_loop()
    loop.create_task(start_web_server())
    
    # Start bot
    if WEBHOOK_URL and 'railway' in WEBHOOK_URL.lower():
        # Webhook mode (production)
        logger.info(f"🌐 Starting webhook mode: {WEBHOOK_URL}")
        application.run_webhook(
            listen="0.0.0.0",
            port=PORT,
            url_path=BOT_TOKEN,
            webhook_url=f"{WEBHOOK_URL}/{BOT_TOKEN}"
        )
    else:
        # Polling mode (development)
        logger.info("📡 Starting polling mode...")
        logger.info("✅ Bot is ready! Send /start to @KrdDownBot")
        application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
