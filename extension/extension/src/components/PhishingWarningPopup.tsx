import React from "react";

const AlertTriangleIcon = () => (
  <svg width="24" height="24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
);
const ExternalLinkIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const MessageCircleIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 3 12.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z"/><polyline points="8.5 12.5 12 15.5 15.5 12.5"/></svg>
);


interface PredictionResponse {
  status: string;
  prediction: number;
  confidence: number;
  phishing_probability: number;
  safe_probability: number;
  reasoning: string[];
  technical_details: any;
}

interface PhishingWarningPopupProps {
  predictionData?: PredictionResponse;
}

export function PhishingWarningPopup({ predictionData }: PhishingWarningPopupProps) {
  const handleLearnMore = () => {
    // Open learn more page with ?reason= param containing the full backend reason
    let reason = '';
    if (predictionData?.reasoning && predictionData.reasoning.length > 0) {
      reason = encodeURIComponent(predictionData.reasoning[0]);
    }
    const url = `http://localhost:3000${reason ? `?reason=${reason}` : ''}`;
    window.open(url, '_blank');
  };

  const handleChatWithUs = () => {
    window.open('http://localhost:3000', '_blank');
  };

  return (
    <div style={{ width: 400, border: '2px solid #fecaca', background: '#fef2f2', boxShadow: '0 4px 16px #0002', padding: 28, borderRadius: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <img src="/logo.png" alt="SmartPhishBot" width={56} height={56} style={{ borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#7f1d1d', margin: 0 }}>SmartPhishBot</h2>
          <p style={{ fontSize: 18, color: '#b91c1c', margin: 0 }}>Security Alert</p>
        </div>
        <AlertTriangleIcon />
      </div>
      <div style={{ background: '#fff', borderRadius: 10, border: '2px solid #fecaca', padding: 22, marginBottom: 22 }}>
        <p style={{ color: '#b91c1c', fontWeight: 700, textAlign: 'center', margin: 0, fontSize: 20 }}>This is a phishing email</p>
        <p style={{ fontSize: 16, color: '#374151', marginTop: 12, textAlign: 'center', fontWeight: 500 }}>
          This email appears to be attempting to steal your personal information or credentials. Please do not click any links or provide any sensitive data.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        <button
          onClick={handleLearnMore}
          style={{
            width: '100%',
            border: '2px solid #fca5a5',
            color: '#b91c1c',
            background: '#fff',
            borderRadius: 10,
            padding: '16px 0',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#f87171';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#fca5a5';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(220, 38, 38, 0.1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #f87171';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          <ExternalLinkIcon />
          Learn More
        </button>
        <button
          onClick={handleChatWithUs}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '16px 0',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.3)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(220, 38, 38, 0.3)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.4)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #fca5a5';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          <MessageCircleIcon />
          Chat with Us
        </button>
      </div>
      <div style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', paddingTop: 12, fontWeight: 500 }}>
        Stay safe online. Never share personal information with suspicious emails.
      </div>
    </div>
  );
}
