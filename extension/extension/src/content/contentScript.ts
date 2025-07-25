function getCurrentEmailIdFromDom(): string | null {
    // Try to find the open message's data-legacy-message-id in the Gmail DOM
    const messageNode = document.querySelector('div[role="main"] .adn[data-legacy-message-id]');
    if (messageNode) {
        const messageId = messageNode.getAttribute('data-legacy-message-id');
        if (messageId && /^[a-zA-Z0-9_-]{16,}$/.test(messageId)) {
            return messageId;
        } else {
            console.warn('Extracted messageId from DOM is not valid:', messageId);
        }
    } else {
        console.warn('No message node with data-legacy-message-id found in DOM.');
    }
    return null;
}

function showPhishingBannerPlaceholder() {
    // Show a neutral banner indicating analysis will appear in the popup
    let banner = document.getElementById('phishing-detector-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'phishing-detector-banner';
        banner.className = 'banner';
        banner.style.background = '#e3e3e3';
        banner.style.color = '#333';
        banner.style.fontWeight = 'bold';
        banner.style.padding = '12px';
        banner.style.marginBottom = '12px';
        banner.style.borderRadius = '6px';
        banner.style.zIndex = '9999';
        banner.style.position = 'relative';
        banner.innerText = 'Phishing Detector: Analysis will appear in the extension popup.';
        // Insert at the top of the Gmail view
        const gmailView = document.querySelector('div[role="main"]');
        if (gmailView) {
            gmailView.prepend(banner);
        } else {
            document.body.prepend(banner);
        }
    }
}

async function showPhishingBannerAuto() {
    const emailId = getCurrentEmailIdFromDom();
    if (!emailId) return;
    // Only run in the top window (not in iframes)
    if (window.top !== window.self) return;
    // Remove any existing banner
    const oldBanner = document.getElementById('phishing-detector-banner');
    if (oldBanner) oldBanner.remove();
    // Request analysis from the background/popup via chrome.runtime.sendMessage
    chrome.runtime.sendMessage({ type: 'ANALYZE_EMAIL', emailId }, (response) => {
        let banner = document.createElement('div');
        banner.id = 'phishing-detector-banner';
        banner.className = 'banner';
        banner.style.position = 'relative';
        banner.style.zIndex = '9999';
        banner.style.marginBottom = '12px';
        banner.style.borderRadius = '6px';
        banner.style.fontWeight = 'bold';
        banner.style.fontSize = '1rem';
        // Insert at the top of the Gmail view
        const gmailView = document.querySelector('div[role="main"]');
        if (gmailView) {
            gmailView.prepend(banner);
        } else {
            document.body.prepend(banner);
        }
    });
}

// Monitor for email changes and auto-analyze
let lastEmailId: string | null = null;
function monitorGmailAuto() {
    setInterval(() => {
        const emailId = getCurrentEmailIdFromDom();
        if (emailId && emailId !== lastEmailId) {
            lastEmailId = emailId;
            chrome.storage.local.set({ currentEmailId: emailId });
            showPhishingBannerAuto();
        }
    }, 1000);
}

// Listen for GET_EMAIL_ID messages from the popup and respond with the emailId from the Gmail DOM
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.type === 'GET_EMAIL_ID') {
        let emailId = null;
        try {
            let emailNode = document.querySelector('div[role="main"] .adn[data-legacy-message-id]');
            if (!emailNode) {
                emailNode = document.querySelector('[data-legacy-message-id]');
            }
            if (!emailNode) {
                emailNode = document.querySelector('[data-message-id]');
            }
            if (emailNode) {
                emailId = emailNode.getAttribute('data-legacy-message-id') || emailNode.getAttribute('data-message-id');
            }
        } catch (err) {
            console.error('Error extracting emailId from DOM:', err);
        }
        sendResponse({ emailId });
        return true;
    }
});

monitorGmailAuto();