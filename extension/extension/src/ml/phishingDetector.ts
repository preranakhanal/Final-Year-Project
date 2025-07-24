import * as tf from '@tensorflow/tfjs';

export interface EmailContent {
    subject: string;
    body: string;
    sender: string;
    attachments: string[];
}

export interface AnalyzeEmailResult {
    isPhishing: boolean;
    error?: string;
    prediction?: number;
    confidence?: number;
    phishing_probability?: number;
    safe_probability?: number;
    reasoning?: string[];
    technical_details?: any;
}

export async function analyzeEmail(email: EmailContent): Promise<AnalyzeEmailResult> {
    try {
        const response = await fetch('http://localhost:8000/ml/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: email.body }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return { isPhishing: false, error: 'Phishing detection backend error: ' + errorText };
        }
        const data = await response.json();
        console.log('Phishing detection response:', data);
        console.log('typeof data.prediction:', typeof data.prediction);
        if (typeof data.prediction !== 'number') {
            console.error('Invalid prediction response:', data);
            return { isPhishing: false, error: 'Phishing detection backend error: Invalid response from server.' };
        }
        console.log('Phishing detection prediction:', data.prediction);
        const result = { 
            isPhishing: data.prediction === 0,
            prediction: data.prediction,
            confidence: data.confidence,
            phishing_probability: data.phishing_probability,
            safe_probability: data.safe_probability,
            reasoning: data.reasoning,
            technical_details: data.technical_details
        };
        console.log('Phishing detection result:', result);
        return result;
    } catch (error: any) {
        console.error('Phishing detection error:', error);
        return { isPhishing: false, error: 'Phishing detection error: ' + (error?.message || error) };
    }
}


export function extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

export function isSuspiciousUrl(url: string): boolean {
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl']; // Add more suspicious domains as needed
    const domain = new URL(url).hostname;

    return suspiciousDomains.includes(domain);
}