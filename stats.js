/**
 * stats.js - Page Statistics Overlay Bookmarklet
 * Part of the Edge Toolkit
 * 
 * Features:
 * - Word & Character counts
 * - Reading time estimates (200/250/300 WPM)
 * - Image analysis (alt text coverage)
 * - Heading hierarchy & interactive outline
 * - Link metrics & density
 * - Paragraph, list, code block, and table counts
 */

(function() {
    const ID = '__edge_stats_overlay';
    const existing = document.getElementById(ID);
    if (existing) {
        existing.remove();
        return;
    }

    // --- Data Gathering ---
    const text = document.body.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    
    const paragraphs = document.querySelectorAll('p').length;
    const lists = document.querySelectorAll('ul, ol').length;
    const codeBlocks = document.querySelectorAll('pre, code').length;
    const tables = document.querySelectorAll('table').length;

    const images = Array.from(document.querySelectorAll('img'));
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length;
    const altPercentage = images.length > 0 ? Math.round((imagesWithAlt / images.length) * 100) : 100;

    const links = Array.from(document.querySelectorAll('a[href]'));
    const internalLinks = links.filter(l => l.host === window.location.host).length;
    const externalLinks = links.length - internalLinks;
    const linkDensity = words > 0 ? ((links.length / words) * 100).toFixed(1) : 0;

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.innerText.trim(),
        el: h
    }));

    // --- Utilities ---
    const formatTime = (wpm) => {
        const mins = Math.ceil(words / wpm);
        return mins === 1 ? '1 min' : `${mins} mins`;
    };

    const escapeHTML = (str) => str.replace(/[&<>"']/g, m => ({
        '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
    }[m]));

    // --- UI Generation ---
    const overlay = document.createElement('div');
    overlay.id = ID;
    
    // Design Tokens (Zinc-inspired)
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bg = isDark ? '#18181b' : '#ffffff';
    const fg = isDark ? '#f4f4f5' : '#18181b';
    const border = isDark ? '#3f3f46' : '#e4e4e7';
    const muted = isDark ? '#a1a1aa' : '#71717a';
    const accent = '#6366f1'; // Indigo

    overlay.innerHTML = `
        <style>
            #${ID} {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 360px;
                max-height: calc(100vh - 40px);
                background: ${bg};
                color: ${fg};
                border: 1px solid ${border};
                border-radius: 12px;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: edgeSlideIn 0.3s ease-out;
            }
            @keyframes edgeSlideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .header {
                padding: 16px;
                border-bottom: 1px solid ${border};
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .header h2 { margin: 0; font-size: 16px; font-weight: 600; }
            .close-btn { 
                cursor: pointer; background: none; border: none; color: ${muted}; font-size: 20px; 
                padding: 4px; line-height: 1; border-radius: 4px;
            }
            .close-btn:hover { color: ${fg}; background: ${isDark ? '#27272a' : '#f4f4f5'}; }
            
            .content { padding: 16px; overflow-y: auto; flex: 1; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
            .stat-box { padding: 12px; background: ${isDark ? '#27272a' : '#f9fafb'}; border-radius: 8px; border: 1px solid ${border}; }
            .stat-label { font-size: 11px; color: ${muted}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .stat-value { font-size: 18px; font-weight: 700; }
            
            .section-title { font-size: 12px; font-weight: 600; color: ${muted}; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
            .outline { list-style: none; padding: 0; margin: 0; }
            .outline-item { 
                padding: 6px 8px; border-radius: 4px; cursor: pointer; 
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                transition: background 0.2s;
            }
            .outline-item:hover { background: ${isDark ? '#27272a' : '#f4f4f5'}; color: ${accent}; }
            .h1 { font-weight: 600; }
            .h2 { padding-left: 16px; font-size: 13px; }
            .h3 { padding-left: 32px; font-size: 12px; }
            .h4, .h5, .h6 { padding-left: 48px; font-size: 12px; color: ${muted}; }

            .wpm-toggle { display: flex; gap: 4px; background: ${isDark ? '#27272a' : '#f4f4f5'}; padding: 4px; border-radius: 8px; margin-top: 8px; }
            .wpm-btn { 
                flex: 1; border: none; background: none; color: ${muted}; padding: 4px; 
                font-size: 11px; cursor: pointer; border-radius: 4px; transition: all 0.2s;
            }
            .wpm-btn.active { background: ${bg}; color: ${fg}; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

            .footer { padding: 12px 16px; border-top: 1px solid ${border}; font-size: 11px; color: ${muted}; display: flex; justify-content: space-between; }
        </style>

        <div class="header">
            <h2>Page Statistics</h2>
            <button class="close-btn" onclick="document.getElementById('${ID}').remove()">&times;</button>
        </div>
        
        <div class="content">
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-label">Words</div>
                    <div class="stat-value">${words.toLocaleString()}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Characters</div>
                    <div class="stat-value">${chars.toLocaleString()}</div>
                </div>
            </div>

            <div class="section-title">Reading Time</div>
            <div id="__stats_read_time" class="stat-value">${formatTime(250)}</div>
            <div class="wpm-toggle">
                <button class="wpm-btn" data-wpm="200">200 WPM</button>
                <button class="wpm-btn active" data-wpm="250">250 WPM</button>
                <button class="wpm-btn" data-wpm="300">300 WPM</button>
            </div>

            <div class="section-title">Content Breakdown</div>
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                <div class="stat-box" style="padding: 8px;">
                    <div class="stat-label">Paragraphs</div>
                    <div class="stat-value" style="font-size: 14px;">${paragraphs}</div>
                </div>
                <div class="stat-box" style="padding: 8px;">
                    <div class="stat-label">Lists</div>
                    <div class="stat-value" style="font-size: 14px;">${lists}</div>
                </div>
                <div class="stat-box" style="padding: 8px;">
                    <div class="stat-label">Images</div>
                    <div class="stat-value" style="font-size: 14px;">${images.length} <span style="font-size: 10px; font-weight: normal; color: ${muted};">(${altPercentage}% alt)</span></div>
                </div>
            </div>

            <div class="section-title">Link Analysis</div>
            <div class="grid">
                <div class="stat-box">
                    <div class="stat-label">Total Links</div>
                    <div class="stat-value">${links.length}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Link Density</div>
                    <div class="stat-value">${linkDensity}%</div>
                </div>
            </div>

            <div class="section-title">Heading Outline</div>
            <div class="outline">
                ${headings.length > 0 
                    ? headings.map((h, i) => `
                        <div class="outline-item h${h.level}" data-index="${i}">
                            ${escapeHTML(h.text || 'Untitled Section')}
                        </div>
                    `).join('')
                    : `<div style="color: ${muted}; font-style: italic; padding: 8px;">No headings found</div>`
                }
            </div>
        </div>

        <div class="footer">
            <span>Edge Toolkit: stats</span>
            <span>v0.1</span>
        </div>
    `;

    document.body.appendChild(overlay);

    // --- Event Handlers ---
    
    // Reading Speed Toggles
    overlay.querySelectorAll('.wpm-btn').forEach(btn => {
        btn.onclick = () => {
            overlay.querySelectorAll('.wpm-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const wpm = parseInt(btn.dataset.wpm);
            document.getElementById('__stats_read_time').innerText = formatTime(wpm);
        };
    });

    // Heading Navigation
    overlay.querySelectorAll('.outline-item').forEach(item => {
        item.onclick = () => {
            const index = item.dataset.index;
            headings[index].el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Flash effect on the heading
            const originalColor = headings[index].el.style.color;
            headings[index].el.style.color = accent;
            setTimeout(() => { headings[index].el.style.color = originalColor; }, 1000);
        };
    });

    // Escape Key to Close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Tab Title Feedback
    const originalTitle = document.title;
    document.title = `📊 Stats: ${words} words...`;
    setTimeout(() => { document.title = originalTitle; }, 2000);

})();
