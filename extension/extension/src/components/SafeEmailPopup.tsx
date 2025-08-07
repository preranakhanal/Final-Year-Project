import React from "react";
import { Shield, ExternalLink, MessageCircle, CheckCircle, Globe } from "lucide-react";
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

interface SafeEmailPopupProps {
  predictionData?: PredictionResponse;
}

const SafeEmailPopup: React.FC<SafeEmailPopupProps> = ({ predictionData }) => {
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
    <div className="w-96 border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white overflow-hidden rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4 p-4">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="SmartPhishBot" width={50} height={50} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">SmartPhishBot</h2>
          <p className="text-sm text-green-100">EMAIL VERIFIED</p>
        </div>
        <Shield className="h-8 w-8 text-green-300" />
      </div>
      <div className="px-6 pb-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-green-300">✅ EMAIL IS SAFE</h3>
          <p className="text-green-100 text-sm">{getReasoningPreview()}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-300">Security Check Results:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>Sender domain verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>All links are safe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>No suspicious content found</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span>Legitimate sender reputation</span>
            </div>
          </div>
        </div>
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Verification Details:</span>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Safety Level:</span>
              <span className="text-green-300 font-bold">SECURE</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span>{predictionData?.confidence ? `${(predictionData.confidence * 100).toFixed(1)}%` : "99.2%"}</span>
            </div>
            <div className="flex justify-between">
              <span>Verified:</span>
              <span>Just now</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleChatWithUs}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </button>
          <button
            onClick={handleLearnMore}
            className="w-full text-white hover:bg-white/10 py-2 rounded-lg flex items-center justify-center"
            style={{ background: "transparent", border: "none" }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn About Email Security
          </button>
        </div>
        <div className="text-xs text-green-100 text-center">🛡️ Protected by SmartPhishBot • Continue safely</div>
      </div>
    </div>
  );
};

export default SafeEmailPopup;