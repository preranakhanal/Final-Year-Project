

import React, { useEffect, useState } from "react";
import { Loader2, Mail, Shield } from "lucide-react";
import Image from "next/image";

interface LoadingAnalysisPopupProps {
  steps?: string[];
}

const LoadingAnalysisPopup: React.FC<LoadingAnalysisPopupProps> = ({ steps }) => {
  const defaultSteps = [
    "Scanning email headers...",
    "Analyzing sender reputation...",
    "Checking for suspicious links...",
    "Verifying content authenticity...",
    "Finalizing security assessment...",
  ];
  const analysisSteps = steps && steps.length > 0 ? steps : defaultSteps;
  const [currentStep, setCurrentStep] = useState(0);

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
    <div className="w-96 border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white overflow-hidden rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4 p-4">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="SmartPhishBot" width={50} height={50} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">SmartPhishBot</h2>
          <p className="text-sm text-blue-100">ANALYZING EMAIL</p>
        </div>
        <Shield className="h-8 w-8 text-blue-300" />
      </div>
      <div className="px-6 pb-6 space-y-6 flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">🔍 Scanning in Progress</h3>
          <p className="text-blue-100 text-sm">Advanced AI security analysis</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-12 w-12 text-blue-300 mr-3" />
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
          <div className="space-y-4">
            <div className="text-lg font-medium text-white">Analyzing email security</div>
            <div className="text-sm text-blue-100">Please wait while we check this email for potential threats...</div>
            <div className="bg-blue-500/30 rounded-lg p-3 mt-4">
              <div className="text-sm text-blue-100 mb-2">Current Step:</div>
              <div className="text-white font-medium">{analysisSteps[currentStep]}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-300" />
          <span className="text-sm text-blue-100">Advanced AI protection in progress...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnalysisPopup;
