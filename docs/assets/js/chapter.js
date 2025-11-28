// DOM Elements
const themeBtn = document.getElementById('theme-btn');
const backBtn = document.getElementById('back-btn');
const smallFontBtn = document.getElementById('small-font');
const mediumFontBtn = document.getElementById('medium-font');
const largeFontBtn = document.getElementById('large-font');
const content = document.querySelector('.content');

// Theme Toggle
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Font Size Controls
if (smallFontBtn) {
    smallFontBtn.addEventListener('click', () => {
        content.classList.remove('font-small', 'font-medium', 'font-large');
        content.classList.add('font-small');
        updateFontButtons(smallFontBtn);
        localStorage.setItem('fontSize', 'small');
    });
}

if (mediumFontBtn) {
    mediumFontBtn.addEventListener('click', () => {
        content.classList.remove('font-small', 'font-medium', 'font-large');
        content.classList.add('font-medium');
        updateFontButtons(mediumFontBtn);
        localStorage.setItem('fontSize', 'medium');
    });
}

if (largeFontBtn) {
    largeFontBtn.addEventListener('click', () => {
        content.classList.remove('font-small', 'font-medium', 'font-large');
        content.classList.add('font-large');
        updateFontButtons(largeFontBtn);
        localStorage.setItem('fontSize', 'large');
    });
}

function updateFontButtons(activeBtn) {
    [smallFontBtn, mediumFontBtn, largeFontBtn].forEach(btn => btn && btn.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
}

// Load saved font size
const savedFontSize = localStorage.getItem('fontSize');
if (savedFontSize) {
    content.classList.remove('font-small', 'font-medium', 'font-large');
    content.classList.add('font-' + savedFontSize);
    
    const fontButtons = {'small': smallFontBtn, 'medium': mediumFontBtn, 'large': largeFontBtn};
    if (fontButtons[savedFontSize]) updateFontButtons(fontButtons[savedFontSize]);
}

// Next chapter domain redirect
function getNextUrl(url) {
    if (!window.NEXT_DOMAIN || !url) return url;
    try {
        const path = new URL(url, location.origin).pathname;
        return window.NEXT_DOMAIN + path;
    } catch (e) {
        return url;
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('prev-chapter');
        if (prevBtn && !prevBtn.disabled) window.location.href = prevBtn.href;
    } else if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('next-chapter');
        if (nextBtn && !nextBtn.disabled) {
            const newUrl = getNextUrl(nextBtn.href);
            window.location.href = newUrl;
        }
    }
});

// Save reading history
document.addEventListener('DOMContentLoaded', function() {
    const novelTitle = document.querySelector('.chapter-title');
    if (!novelTitle) return;
    
    const novelData = {
        title: novelTitle.textContent.split(' - ')[1] || novelTitle.textContent,
        url: window.location.pathname,
        timestamp: new Date().toISOString()
    };
    
    let history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    history = history.filter(item => item.title !== novelData.title);
    history.unshift(novelData);
    history = history.slice(0, 5);
    
    localStorage.setItem('readingHistory', JSON.stringify(history));
});
