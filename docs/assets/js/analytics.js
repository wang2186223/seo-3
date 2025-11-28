// Page visit data collection
function sendPageVisit() {
    getUserIP().then(userIP => {
        const data = {
            page: window.location.href,
            userAgent: navigator.userAgent,
            userIP: userIP,
            referrer: getReferrerSource(),
            referrerUrl: document.referrer || 'Direct/None'
        };
        
        fetch('https://script.google.com/macros/s/AKfycbyF5Vot_R9Rq_hoZmcPeK_-2rY9tPphz9jLsru1KX7z-krv7-LIJ90fFHSJ0tNJbPQX/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).catch(error => console.log('Analytics error:', error));
    }).catch(error => {
        const data = {
            page: window.location.href,
            userAgent: navigator.userAgent,
            userIP: 'Unknown',
            referrer: getReferrerSource(),
            referrerUrl: document.referrer || 'Direct/None'
        };
        
        fetch('https://script.google.com/macros/s/AKfycbyF5Vot_R9Rq_hoZmcPeK_-2rY9tPphz9jLsru1KX7z-krv7-LIJ90fFHSJ0tNJbPQX/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).catch(error => console.log('Analytics error:', error));
    });
}

function getReferrerSource() {
    const referrer = document.referrer || '';
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('utm_source')) {
        return `UTM: ${urlParams.get('utm_source')}/${urlParams.get('utm_medium')||''}`;
    }
    if (urlParams.has('fbclid')) return 'Paid: Facebook';
    if (urlParams.has('gclid')) return 'Paid: Google';
    
    if (!referrer) {
        return document.cookie.includes('returning_visitor') ? 'Direct: Returning' : 'Direct: First';
    }
    
    try {
        const refUrl = new URL(referrer);
        const refHost = refUrl.hostname.toLowerCase();
        const refPath = refUrl.pathname;
        
        if (refHost === window.location.hostname) {
            if (refPath === '/') return 'Internal: Homepage';
            if (refPath.includes('/novels/') && !refPath.includes('/chapter-')) return 'Internal: Novel Page';
            if (refPath.includes('/chapter-')) return 'Internal: Chapter';
            return 'Internal: Navigation';
        }
        
        if (refHost.includes('google.')) return refPath.includes('/imgres') ? 'Organic: Google Images' : 'Organic: Google';
        if (refHost.includes('bing.com')) return 'Organic: Bing';
        if (refHost.includes('yahoo.com')) return 'Organic: Yahoo';
        if (refHost.includes('facebook.com') || refHost.includes('fb.com')) return 'Social: Facebook';
        if (refHost.includes('twitter.com') || refHost.includes('t.co')) return 'Social: Twitter';
        if (refHost.includes('reddit.com')) return 'Social: Reddit';
        
        return 'External: ' + refHost;
    } catch (e) {
        return 'Error: Invalid';
    }
}

(function() {
    if (!document.cookie.includes('returning_visitor')) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = 'returning_visitor=1; expires=' + expires.toUTCString() + '; path=/';
    }
})();

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const ipData = await response.json();
        return ipData.ip;
    } catch (error1) {
        try {
            const response = await fetch('https://httpbin.org/ip');
            const ipData = await response.json();
            return ipData.origin.split(',')[0].trim();
        } catch (error2) {
            return 'Unknown';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendPageVisit);
} else {
    sendPageVisit();
}
