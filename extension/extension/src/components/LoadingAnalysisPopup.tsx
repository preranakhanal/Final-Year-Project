import React, { useEffect, useState } from "react";

export function LoadingAnalysisPopup() {
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    "Scanning email headers...",
    "Analyzing sender reputation...",
    "Checking for suspicious links...",
    "Verifying content authenticity...",
    "Finalizing security assessment...",
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((oldStep) => {
        if (oldStep < analysisSteps.length - 1) {
          return oldStep + 1;
        }
        clearInterval(stepTimer);
        return oldStep;
      });
    }, 1000);
    return () => clearInterval(stepTimer);
  }, [analysisSteps.length]);

  return (
    <div style={{ width: 400, border: '2px solid #bfdbfe', background: '#eff6ff', boxShadow: '0 4px 16px #0002', padding: 28, borderRadius: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <img src="/logo.png" alt="SmartPhishBot" width={56} height={56} style={{ borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e3a8a', margin: 0 }}>SmartPhishBot</h2>
          <p style={{ fontSize: 18, color: '#2563eb', margin: 0 }}>Analyzing Email</p>
        </div>
        {/* Shield SVG */}
        <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, border: '2px solid #bfdbfe', padding: 22, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          {/* Mail SVG */}
          <svg width="40" height="40" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 6-8.97 6.48a2 2 0 0 1-2.06 0L2 6"/></svg>
        </div>
        <p style={{ color: '#2563eb', fontWeight: 700, textAlign: 'center', marginBottom: 12, fontSize: 20 }}>Analyzing email security</p>
        <p style={{ fontSize: 16, color: '#374151', textAlign: 'center', marginBottom: 18, fontWeight: 500 }}>
          Please wait while we check this email for potential threats...
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Loader SVG with spin animation */}
          <svg width="40" height="40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
          <div style={{ fontSize: 15, color: '#64748b', textAlign: 'center', fontWeight: 500 }}>{analysisSteps[currentStep]}</div>
        </div>
      </div>
      <div style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', paddingTop: 12, fontWeight: 500 }}>
        Advanced AI protection in progress...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
