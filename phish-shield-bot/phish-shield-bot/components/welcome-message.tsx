import React from 'react';
import Image from "next/image";
import { Shield, MessageSquare, Brain, Zap } from 'lucide-react';

interface WelcomeMessageProps {
  currentMode: 'chat' | 'quiz';
  reasonMode?: boolean;
}

export function WelcomeMessage({ currentMode, reasonMode }: WelcomeMessageProps) {
  if (reasonMode) return null;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-scale">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 mx-auto mb-6 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-gradient bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600">
            <Image
              src="/phish-shield-logo.png"
              alt="Phish Shield Bot"
              width={70}
              height={70}
              className="rounded-2xl"
            />
          </div>
        </div>

        {/* Welcome Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Phish Shield Bot
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your AI-powered cybersecurity assistant, ready to help you stay safe online
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="group p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Threat Detection</h3>
              <p className="text-sm text-gray-600">Learn to identify and prevent phishing attacks</p>
            </div>

            <div className="group p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {currentMode === 'chat' ? <MessageSquare className="w-6 h-6 text-white" /> : <Brain className="w-6 h-6 text-white" />}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {currentMode === 'chat' ? 'Interactive Chat' : 'Knowledge Testing'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentMode === 'chat' 
                  ? 'Ask questions and get expert cybersecurity advice' 
                  : 'Test your knowledge with interactive quizzes'
                }
              </p>
            </div>

            <div className="group p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Help</h3>
              <p className="text-sm text-gray-600">Get instant responses to your security concerns</p>
            </div>
          </div>

          {/* Current Mode Indicator */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                currentMode === 'chat' ? 'bg-blue-400' : 'bg-emerald-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                Currently in{' '}
                <span className={`font-semibold ${
                  currentMode === 'chat' ? 'text-blue-600' : 'text-emerald-600'
                }`}>
                  {currentMode === 'chat' ? 'Chat Mode' : 'Quiz Mode'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
