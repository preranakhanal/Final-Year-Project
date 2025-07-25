import React, { useEffect, useState } from "react";

function ExtensionHomepage() {
  function handleSettings() {
    console.log("Settings clicked");
  }
function handleLearnMore() {
  window.open('http://localhost:3000', '_blank');
}
function handleChatWithUs() {
  window.open('http://localhost:3000', '_blank');
}
  function handleViewStats() {
    console.log("View stats clicked");
  }
  return (
    <div style={{ width: 400, border: '2px solid #e5e7eb', background: '#f9fafb', borderRadius: 16, boxShadow: '0 4px 16px #0002', padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
        <img src="/logo.png" alt="SmartPhishBot" width={56} height={56} style={{ borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>SmartPhishBot</h2>
          <p style={{ fontSize: 18, color: '#6b7280', margin: 0 }}>Email Security Extension</p>
        </div>
        {/* Shield SVG */}
        <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5.25-3.5 10-8 10S4 17.25 4 12V7l8-4z"/></svg>
      </div>
      <div style={{ background: '#fff', borderRadius: 10, border: '2px solid #e5e7eb', padding: 22, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          {/* Mail SVG */}
          <svg width="40" height="40" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M22 5l-10 7L2 5"/></svg>
        </div>
        <p style={{ color: '#2563eb', fontWeight: 700, textAlign: 'center', margin: 0, marginBottom: 12, fontSize: 20 }}>Ready to protect you</p>
        <p style={{ fontSize: 16, color: '#374151', textAlign: 'center', margin: 0, fontWeight: 500 }}>
          Open an email to start automatic security scanning and phishing detection.
        </p>
      </div>
      <div style={{ background: '#eff6ff', borderRadius: 10, border: '2px solid #bfdbfe', padding: 18, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* BarChart3 SVG */}
          <svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="12" width="4" height="8"/><rect x="9" y="8" width="4" height="12"/><rect x="15" y="4" width="4" height="16"/></svg>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1e3a8a' }}>Protection Stats</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 15 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 20 }}>127</div>
            <div style={{ color: '#64748b', fontWeight: 500 }}>Safe Emails</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#dc2626', fontSize: 20 }}>8</div>
            <div style={{ color: '#64748b', fontWeight: 500 }}>Blocked Threats</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
        <button
          onClick={handleLearnMore}
          style={{
            border: '2px solid #d1d5db',
            color: '#374151',
            background: '#fff',
            borderRadius: 8,
            padding: '14px 0',
            fontWeight: 600,
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}
        >
          {/* ExternalLink SVG */}
          <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Learn More
        </button>
        <button
          onClick={handleChatWithUs}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '14px 0',
            fontWeight: 600,
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}
        >
          {/* MessageCircle SVG */}
          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 3 12.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z"/><polyline points="8 10 12 14 16 10"/></svg>
          Support
        </button>
      </div>
      <div style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', paddingTop: 12, fontWeight: 500 }}>
        SmartPhishBot v2.1.0 • Always protecting your inbox
      </div>
    </div>
  );
}

export default ExtensionHomepage;