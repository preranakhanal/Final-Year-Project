import React from "react";

export function ErrorAnalysisPopup({ onRetry, errorMessage }: { onRetry?: () => void; errorMessage?: string }) {
  const handleLearnMore = () => {
    window.open('http://localhost:3000', '_blank');
  };

  const handleChatWithUs = () => {
    window.open('http://localhost:3000', '_blank');
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
    else console.log("Retry analysis clicked");
  };

  return (
    <div style={{ width: 400, border: '2px solid #fed7aa', background: '#fff7ed', boxShadow: '0 4px 16px #0002', padding: 28, borderRadius: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <img src="/logo.png" alt="SmartPhishBot" width={56} height={56} style={{ borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#9a3412', margin: 0 }}>SmartPhishBot</h2>
          <p style={{ fontSize: 18, color: '#ea580c', margin: 0 }}>Analysis Error</p>
        </div>
        {/* AlertCircle SVG */}
        <svg width="28" height="28" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, border: '2px solid #fed7aa', padding: 22, marginBottom: 22 }}>
        <p style={{ color: '#ea580c', fontWeight: 700, textAlign: 'center', margin: 0, fontSize: 20 }}>Error occurred during analysis</p>
        <p style={{ fontSize: 16, color: '#374151', marginTop: 12, textAlign: 'center', fontWeight: 500 }}>
          We couldn't complete the email security check. Please try again or contact support.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        <button
          onClick={handleRetry}
          style={{
            width: '100%',
            border: '2px solid #fdba74',
            color: '#ea580c',
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
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.1)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fff7ed';
            e.currentTarget.style.borderColor = '#fb923c';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#fdba74';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(234, 88, 12, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(234, 88, 12, 0.1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.15)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #fb923c';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {/* RefreshCw SVG */}
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.37 4.36A9 9 0 0 0 21 15"/></svg>
          Try Again
        </button>
        <button
          onClick={handleLearnMore}
          style={{
            width: '100%',
            border: '2px solid #fdba74',
            color: '#ea580c',
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
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.1)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fff7ed';
            e.currentTarget.style.borderColor = '#fb923c';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#fdba74';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(234, 88, 12, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(234, 88, 12, 0.1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.15)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #fb923c';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {/* ExternalLink SVG */}
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Learn More
        </button>
        <button
          onClick={handleChatWithUs}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
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
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(234, 88, 12, 0.3)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(234, 88, 12, 0.3)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.4)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #fdba74';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {/* MessageCircle SVG */}
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 3 12.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z"/><polyline points="8.5 12.5 12 15.5 15.5 12.5"/></svg>
          Chat with Us
        </button>
      </div>
      <div style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', paddingTop: 12, fontWeight: 500 }}>
        Technical issues can happen. We're here to help you stay protected.

        {errorMessage && (
          <div style={{ marginTop: 10, color: '#b91c1c', fontSize: 15 }}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
