import React from "react";
import { Shield, Mail, MessageCircle, BarChart3, CheckCircle } from "lucide-react";
import Image from "next/image";

interface ExtensionHomepageProps {
  stats?: {
    emailsProtected?: number;
    threatsBlocked?: number;
    version?: string;
  };
}

const ExtensionHomepage: React.FC<ExtensionHomepageProps> = ({ stats }) => {
  const handleLearnMore = () => {
    window.open('http://localhost:3000/learn', '_blank');
  };
  const handleChatWithUs = () => {
    window.open('http://localhost:3000', '_blank');
  };
  return (
    <div className="w-96 border-0 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white overflow-hidden rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4 p-4">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="SmartPhishBot" width={50} height={50} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">SmartPhishBot</h2>
          <p className="text-sm text-blue-100">Email Security Extension</p>
        </div>
      </div>
      <div className="px-6 pb-6 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Be protected. Be safe.</h3>
          <p className="text-blue-100 text-sm">Advanced AI-powered email security</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-300" />
            <span className="text-sm">Real-time phishing detection</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span className="text-sm">{stats?.emailsProtected ?? 127} emails protected today</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-green-300" />
            <span className="text-sm">{stats?.threatsBlocked ?? 8} threats blocked this week</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-green-300" />
            <span className="text-sm">All email clients supported</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <Mail className="h-8 w-8 text-white mx-auto mb-2" />
          <p className="text-sm text-blue-100">Open an email to start scanning</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleChatWithUs}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Get Support
          </button>
          <button
            onClick={handleLearnMore}
            className="w-full text-white hover:bg-white/10 py-2 rounded-lg flex items-center justify-center"
            style={{ background: "transparent", border: "none" }}
          >
            Learn more about protection
          </button>
        </div>
        <div className="text-xs text-blue-100 text-center">SmartPhishBot {stats?.version ?? 'v2.1.0'} • 30-day protection guarantee</div>
      </div>
    </div>
  );
};

export default ExtensionHomepage;