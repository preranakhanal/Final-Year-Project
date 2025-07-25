import { getGmailAuthToken } from '../gmail/gmailApi';
import { analyzeEmail } from '../ml/phishingDetector';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Phishing Detector Extension Installed');
}); 

// @ts-ignore
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.action === 'analyzeEmail') {
        const { emailContent, emailImages } = request.data;

        // Placeholder: always return not phishing
        const isSuspicious = false;

        console.log('Email content analysis result:', emailContent, isSuspicious);

        sendResponse({ isPhishing: false });
        return true; // Keep the message channel open for sendResponse
    }
});

// @ts-ignore
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
    if (request.action === 'fetchEmails') {
        // Placeholder: return empty array
        sendResponse({ emails: [] });
        return true; // Keep the message channel open for sendResponse
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.type === 'ANALYZE_EMAIL' && request.emailId) {
        (async () => {
            try {
                const token = await getGmailAuthToken();
                const res = await fetch(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${request.emailId}?format=full`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) {
                    sendResponse({ status: 'error', error: 'Failed to fetch email: ' + res.statusText });
                    return;
                }
                const msg = await res.json();
                const headers = msg.payload.headers;
                const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
                const sender = headers.find((h: any) => h.name === 'From')?.value || '';
                let body = '';
                if (msg.payload.parts && msg.payload.parts.length > 0) {
                    const part = msg.payload.parts.find((p: any) => p.mimeType === 'text/plain');
                    if (part && part.body && part.body.data) {
                        body = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                    }
                } else if (msg.payload.body && msg.payload.body.data) {
                    body = atob(msg.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                }
                const emailObj = { subject, body, sender, attachments: [] };
                const analysisResult = await analyzeEmail(emailObj);
                console.log('Phishing analysis result:', analysisResult);
                if (analysisResult.error) {
                    console.error('Phishing analysis error:', analysisResult.error);
                    sendResponse({ status: 'error', error: analysisResult.error });
                    return;
                }
                console.log('Result:', { status: analysisResult.isPhishing ? 'phishing' : 'safe' });
                // Send the complete analysis result instead of just the status
                sendResponse({
                    status: analysisResult.isPhishing ? 'phishing' : 'safe',
                    prediction: analysisResult.prediction,
                    confidence: analysisResult.confidence,
                    phishing_probability: analysisResult.phishing_probability,
                    safe_probability: analysisResult.safe_probability,
                    reasoning: analysisResult.reasoning,
                    technical_details: analysisResult.technical_details
                });
            } catch (err) {
                console.error('Error analyzing email:', err);
                sendResponse({ status: 'error', error: String(err) });
            }
        })();
        return true; // Keep the message channel open for async sendResponse
    }
});