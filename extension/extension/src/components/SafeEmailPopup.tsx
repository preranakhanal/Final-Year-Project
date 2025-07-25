import React from "react";

interface PredictionResponse {
  status: string;
  prediction: number;
  confidence: number;
  phishing_probability: number;
  safe_probability: number;
  reasoning: string[];
  technical_details: any;
}

interface SafeEmailPopupProps {
  predictionData?: PredictionResponse;
}

export function SafeEmailPopup({ predictionData }: SafeEmailPopupProps) {
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
    // Open chat support
    window.open('http://localhost:3000', '_blank');
  };

  // Get the first 15 words from reasoning
  const getReasoningPreview = () => {
    if (!predictionData?.reasoning || predictionData.reasoning.length === 0) {
      return "This email has been verified and appears to be legitimate and secure.";
    }
    
    const reasoningText = predictionData.reasoning[0];
    const words = reasoningText.split(' ');
    if (words.length <= 15) {
      return reasoningText;
    }
    return words.slice(0, 15).join(' ') + '...';
  };

  return (
    <div style={{ width: 320, border: '1px solid #bbf7d0', background: '#f0fdf4', boxShadow: '0 2px 8px #0001', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <img src="/logo.png" alt="SmartPhishBot" width={40} height={40} style={{ borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#166534', margin: 0 }}>SmartPhishBot</h2>
          <p style={{ fontSize: 14, color: '#22c55e', margin: 0 }}>Email Verified</p>
        </div>
        {/* Shield SVG */}
        <svg width="24" height="24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #bbf7d0', padding: 16, marginBottom: 16 }}>
        <p style={{ color: '#111827', fontWeight: 500, textAlign: 'center', margin: 0 }}>This email is safe</p>
        <p style={{ fontSize: 13, color: '#374151', marginTop: 8, textAlign: 'center' }}>
          {getReasoningPreview()}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <button
          onClick={handleLearnMore}
          style={{
            width: '100%',
            border: '2px solid #86efac',
            color: '#16a34a',
            background: '#fff',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.1)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f0fdf4';
            e.currentTarget.style.borderColor = '#4ade80';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(22, 163, 74, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#86efac';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(22, 163, 74, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(22, 163, 74, 0.1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(22, 163, 74, 0.15)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #4ade80';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {/* ExternalLink SVG */}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Learn More
        </button>
        <button
          onClick={handleChatWithUs}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 3px 12px rgba(22, 163, 74, 0.25)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #15803d 0%, #166534 100%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(22, 163, 74, 0.25)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 1px 8px rgba(22, 163, 74, 0.25)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.35)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #86efac';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {/* MessageCircle SVG */}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 3 12.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z"/><polyline points="8.5 12.5 12 15.5 15.5 12.5"/></svg>
          Chat with Us
        </button>
      </div>
      <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'center', paddingTop: 8 }}>
        SmartPhishBot helps keep your emails secure and verified.
      </div>
    </div>
  );
}
