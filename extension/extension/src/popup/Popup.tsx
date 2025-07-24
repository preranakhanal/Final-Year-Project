import React from 'react';
import { PhishingWarningPopup } from "../components/PhishingWarningPopup";
import { SafeEmailPopup } from "../components/SafeEmailPopup";
import { LoadingAnalysisPopup } from "../components/LoadingAnalysisPopup";
import { ErrorAnalysisPopup } from "../components/ErrorAnalysisPopup";
import { fetchRecentEmails, getGmailAuthToken } from '../gmail/gmailApi';
import { analyzeEmail, EmailContent } from '../ml/phishingDetector';
import ExtensionHomepage from "../components/ExtensionHomepage";

console.log('Popup component rendered');

const Popup = () => {
    const [isPhishing, setIsPhishing] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState<EmailContent | null>(null);
    const [showHomepage, setShowHomepage] = React.useState(false);
    const [predictionData, setPredictionData] = React.useState<any>(null);

    const handleLearnMoreClick = () => {
        setShowModal(true);
    };

    const checkForPhishing = React.useCallback(async () => {
        console.log('checkForPhishing called');
        setLoading(true);
        setError(null);
        setShowHomepage(false);
        // Instead of extracting emailId in the popup, request it from the content script
        // Get the current tab's URL to determine if we are in a mailbox root or an email view
        const [tab] = await new Promise<chrome.tabs.Tab[]>((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, resolve);
        });
        const tabUrl = tab?.url || '';
        // If the URL is a mailbox root (e.g. #inbox, #sent, etc.), show homepage
        if (/^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#\w+\/?$/.test(tabUrl)) {
            setShowHomepage(true);
            setError(null);
            setLoading(false);
            return;
        }
        // Otherwise, request emailId from content script as before
        try {
            setLoading(true);
            setError(null);
            // Ask the content script for the emailId
            console.log('Popup: Requesting emailId from content script');
            const emailId = await new Promise<string | null>((resolve) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (!tabs[0]?.id) return resolve(null);
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        { type: 'GET_EMAIL_ID' },
                        (response) => {
                            resolve(response?.emailId || null);
                        }
                    );
                });
            });
            if (!emailId) {
                setShowHomepage(false);
                setError('No email selected. Please select an email to analyze.\n\nMake sure you have an individual email open in Gmail, not just the inbox or a label.');
                setLoading(false);
                console.warn('Popup: No emailId found. User must open an individual email for analysis.');
                return;
            }
            // Now send the message to the background script
            console.log('Popup: Sending ANALYZE_EMAIL message to background with emailId:', emailId);
            const result = await new Promise<any>((resolve, reject) => {
                chrome.runtime.sendMessage({ type: 'ANALYZE_EMAIL', emailId }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                });
            });
            console.log('Popup: Received response from background:', result);
            if (!result || typeof result !== 'object') {
                setError('Phishing analysis failed: Invalid response from backend.');
                setShowHomepage(false);
                setLoading(false);
                return;
            }
            if (result.status === 'error') {
                setError(result.error || 'Unknown error from backend.');
                setShowHomepage(false);
                setLoading(false);
                return;
            }
            setIsPhishing(result.status === 'phishing');
            setPredictionData(result);
            setShowHomepage(false);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError('Failed to analyze email: ' + err);
            setShowHomepage(false);
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        console.log('useEffect running, calling checkForPhishing');
        checkForPhishing();
    }, [checkForPhishing]);

    return (
        <div className="popup-container" style={{ minWidth: 420, minHeight: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
            {showHomepage && <ExtensionHomepage />}
            {!showHomepage && (
            <>
                {error && (
                <ErrorAnalysisPopup onRetry={checkForPhishing} errorMessage={error} />
                )}
                {!error && (
                <>
                    {loading && <LoadingAnalysisPopup />}
                    {!loading && (
                    isPhishing ? <PhishingWarningPopup /> : <SafeEmailPopup predictionData={predictionData} />
                    )}
                </>
                )}
            </>
            )}
        </div>
    );
};

export default Popup;