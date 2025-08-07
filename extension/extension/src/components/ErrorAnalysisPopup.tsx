import React from "react";

interface ErrorAnalysisPopupProps {
  errorMessage?: string;
  onRetry?: () => void;
}
import { AlertCircle, ExternalLink, MessageCircle, RefreshCw, Wifi } from "lucide-react";
import Image from "next/image";


const ErrorAnalysisPopup: React.FC<ErrorAnalysisPopupProps> = ({ errorMessage, onRetry }) => {
  const handleLearnMore = () => {
    window.open('http://localhost:3000/troubleshooting', '_blank');
  };
  const handleChatWithUs = () => {
    window.open('http://localhost:3000', '_blank');
  };
  const handleRetry = () => {
    if (onRetry) onRetry();
  };
  return (
    <div className="w-96 border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white overflow-hidden rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4 p-4">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="SmartPhishBot" width={50} height={50} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">SmartPhishBot</h2>
          <p className="text-sm text-orange-100">ANALYSIS ERROR</p>
        </div>
        <AlertCircle className="h-8 w-8 text-yellow-300" />
      </div>
      <div className="px-6 pb-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 text-yellow-300">⚠️ CONNECTION ERROR</h3>
          <p className="text-orange-100 text-sm">{errorMessage || "Unable to complete security analysis"}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-yellow-300">Possible Issues:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-orange-300" />
              <span>Network connection problems</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-300" />
              <span>Server temporarily unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-orange-300" />
              <span>Analysis timeout occurred</span>
            </div>
          </div>
        </div>
        <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3">
          <div className="text-center">
            <div className="text-sm font-medium mb-2">What to do next:</div>
            <div className="text-xs text-orange-100">
              Try refreshing or check your internet connection. If the problem persists, contact our support team.
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={handleChatWithUs}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center"
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
            Troubleshooting Guide
          </button>
        </div>
        <div className="text-xs text-orange-100 text-center">🛡️ Your security is our priority • We're here to help</div>
      </div>
    </div>
  );
};

export default ErrorAnalysisPopup;
