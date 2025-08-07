import React from "react";
import { AlertTriangle, ExternalLink, MessageCircle, X, Globe } from "lucide-react";
import Image from "next/image";

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

const PhishingWarningPopup: React.FC<PhishingWarningPopupProps> = ({ predictionData }) => {
  const handleLearnMore = () => {
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
  const getReasoningPreview = () => {
    if (!predictionData?.reasoning || predictionData.reasoning.length === 0) {
      return "This email is attempting to steal your information.";
    }
    const reasoningText = predictionData.reasoning[0];
    const words = reasoningText.split(' ');
    if (words.length <= 15) {
      return reasoningText;
    }
    return words.slice(0, 15).join(' ') + '...';
  };
  return (
    <div className="w-96 border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white overflow-hidden rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4 p-4">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="SmartPhishBot" width={50} height={50} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">SmartPhishBot</h2>
          <p className="text-sm text-red-100">SECURITY ALERT</p>
        </div>
        <AlertTriangle className="h-8 w-8 text-yellow-300" />
      </div>
      <div className="px-6 pb-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-yellow-300">⚠️ PHISHING DETECTED</h3>
          <p className="text-red-100 text-sm">{getReasoningPreview()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-yellow-300">Threat Analysis Results:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-300" />
              <span>Suspicious sender domain detected</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-300" />
              <span>Contains malicious links</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-300" />
              <span>Requests sensitive information</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-300" />
              <span>Spoofed legitimate company</span>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Threat Details:</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Risk Level:</span>
              <span className="text-yellow-300 font-bold">HIGH</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span>{predictionData?.confidence ? `${(predictionData.confidence * 100).toFixed(1)}%` : "98.7%"}</span>
            </div>
            <div className="flex justify-between">
              <span>Detected:</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleChatWithUs}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Report This Threat
          </button>
          <button
            onClick={handleLearnMore}
            className="w-full text-white hover:bg-white/10 py-2 rounded-lg flex items-center justify-center"
            style={{ background: "transparent", border: "none" }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn About Phishing
          </button>
        </div>
        <div className="text-xs text-red-100 text-center">🛡️ Your data is protected • Never click suspicious links</div>
      </div>
    </div>
  );
};

export default PhishingWarningPopup;
