"use client"

import { useState, useEffect } from "react"
import { TextChat } from "./text-chat"
import { VoiceChat } from "./voice-chat"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useChatWebSocket } from "@/lib/useChatWebSocket"

// ...existing code...

export function ChatModule() {
  const [chatMode, setChatMode] = useState<"text" | "voice">("text")
  const [messages, setMessages] = useState<Array<{ id: string; content: string; sender: string; timestamp: Date; type: string }>>([])
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [currentMode, setCurrentMode] = useState<"chat" | "quiz">("chat")
  const [reasonMode, setReasonMode] = useState<boolean>(false)
  const [pendingReason, setPendingReason] = useState<string | null>(null)

  // Detect reason param on mount
  useEffect(() => {
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    if (!searchParams) return;
    const reason = searchParams.get("reason");
    if (reason) {
      setReasonMode(true);
      setPendingReason(reason);
    }
    // Only run on mount
  }, []);

  // WebSocket integration
  const { sendMessage, reinitializeWithMode, clearCurrentModeSession } = useChatWebSocket((msg) => {
    if (msg.type === "bot_response") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: msg.content,
          sender: "assistant",
          timestamp: new Date(msg.timestamp),
          type: "text",
        },
      ])
      setIsTyping(false)
    } else if (msg.type === "message") {
      // Handle user messages from session history
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: msg.content,
          sender: "user",
          timestamp: new Date(msg.timestamp),
          type: "text",
        },
      ])
    } else if (msg.type === "system_message") {
      // Handle system messages if needed
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: msg.content,
          sender: "assistant",
          timestamp: new Date(msg.timestamp),
          type: "text",
        },
      ])
    }
  }, reasonMode ? "reason" : currentMode)
  // If reasonMode is active, clear session and set only the reason message on mount
  useEffect(() => {
    if (reasonMode && pendingReason) {
      clearCurrentModeSession();
      reinitializeWithMode("reason");
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            content: pendingReason,
            sender: "user",
            timestamp: new Date(),
            type: "text",
          },
        ]);
        sendMessage(pendingReason);
        setIsTyping(true);
      }, 500);
    }
    // Only run when reasonMode and pendingReason are set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reasonMode, pendingReason]);

  const addMessage = (content: string, sender: string, type = "text") => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type,
    }
    setMessages((prev) => [...prev, newMessage])

    // Send user message through WebSocket
    if (sender === "user") {
      sendMessage(content)
      setIsTyping(true)
    }
  }

  const toggleChatMode = () => {
    setChatMode((prev) => (prev === "text" ? "voice" : "text"))
    // Stop any ongoing speech when switching modes
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Suggested questions based on mode
  const suggestedQuestions = reasonMode
    ? []
    : currentMode === 'chat' 
      ? [
          "How can I spot a phishing email?",
          "What should I do if I clicked a suspicious link?",
          "How do I create a strong password?",
        ]
      : [
          "Start a phishing detection quiz",
          "Test my cybersecurity knowledge",
          "Give me a security scenario to solve",
        ]

  // Clear chat handler - only clears current mode or reason session
  const handleClearChat = () => {
    setMessages([])
    clearCurrentModeSession()
  }

  // Switch mode handler (disables switching if in reason mode)
  const handleSwitchMode = () => {
    if (reasonMode) return;
    const newMode = currentMode === 'chat' ? 'quiz' : 'chat';
    
    // Immediate mode switch without notifications
    setCurrentMode(newMode);
    setMessages([]);
    reinitializeWithMode(newMode);
    
    // If switching to quiz mode, auto start quiz after a brief delay
    if (newMode === 'quiz') {
      setTimeout(() => {
        setIsTyping(true);
        // Auto-send a message to start the quiz
        addMessage("Start the quiz", "user", "text");
      }, 500); // Quick delay for WebSocket reconnection
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700"></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 relative bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Image
                  src="/phish-shield-logo.png"
                  alt="Phish Shield Bot Logo"
                  width={32}
                  height={32}
                  className="rounded-xl"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-sm">Phish Shield Bot</h1>
              <div className="flex items-center gap-2">
                <p className="text-purple-100 text-sm font-medium">AI-powered cybersecurity assistant</p>
                <div className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm
                  ${reasonMode 
                    ? 'bg-orange-400/30 text-orange-100 border border-orange-300/50' 
                    : currentMode === 'quiz' 
                    ? 'bg-emerald-400/30 text-emerald-100 border border-emerald-300/50'
                    : 'bg-blue-400/30 text-blue-100 border border-blue-300/50'
                  }
                `}>
                  {reasonMode ? '🔍 Analyzing' : currentMode === 'chat' ? '💬 Chat Mode' : '🧠 Quiz Mode'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mode Toggle Button */}
            <Button
              onClick={handleSwitchMode}
              disabled={reasonMode}
              className={`
                relative overflow-hidden transition-all duration-300 
                ${reasonMode ? 'opacity-50 cursor-not-allowed' : ''}
                ${currentMode === 'quiz' 
                  ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }
                backdrop-blur-sm border rounded-xl px-4 py-2 text-sm font-semibold
                hover:scale-105 hover:shadow-lg shadow-md
              `}
            >
              <span className="relative z-10">
                {currentMode === 'chat' ? '🧠 Quiz Mode' : '💬 Chat Mode'}
              </span>
            </Button>

            {/* Video Mode */}
            <Button
              onClick={() => {
                window.location.href = "/video-learning";
              }}
              className="
                bg-purple-500/20 text-white border-purple-300/30 hover:bg-purple-500/30
                backdrop-blur-sm border rounded-xl px-4 py-2 text-sm font-semibold
                hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300
              "
            >
              🎥 Video Mode
            </Button>
 
            {/* Clear Chat Button */}
            <Button
              onClick={handleClearChat}
              className="
                bg-red-500/20 text-white border-red-300/30 hover:bg-red-500/30
                backdrop-blur-sm border rounded-xl px-4 py-2 text-sm font-semibold
                hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300
              "
            >
              🗑️ Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {chatMode === "text" ? (
          <>
            <div className="flex-1 flex flex-col min-h-0">
              <TextChat
                messages={messages}
                onSendMessage={(content) => addMessage(content, "user", "text")}
                onSwitchToVoice={currentMode === 'chat' ? toggleChatMode : undefined}
                isTyping={isTyping}
                currentMode={currentMode}
                reasonMode={reasonMode}
                renderSuggestions={messages.length === 0 && !reasonMode ? (
                  <div className="relative">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {currentMode === 'chat' ? '💬 How can I help you today?' : '🧠 Ready to test your knowledge?'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentMode === 'chat' 
                          ? 'Choose a topic below or ask me anything about cybersecurity' 
                          : 'Select a quiz topic or let me create a custom challenge for you'
                        }
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {suggestedQuestions.map((q, index) => (
                        <Button
                          key={q}
                          variant="outline"
                          className={`
                            group relative overflow-hidden rounded-lg p-3 h-auto text-left transition-all duration-300
                            border hover:border-purple-300 hover:shadow-md hover:scale-[1.01]
                            bg-gradient-to-br ${
                              currentMode === 'chat' 
                                ? index % 3 === 0 ? 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100' 
                                  : index % 3 === 1 ? 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                                  : 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                                : index % 3 === 0 ? 'from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100'
                                  : index % 3 === 1 ? 'from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100'
                                  : 'from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100'
                            }
                          `}
                          onClick={() => addMessage(q, "user", "text")}
                        >
                          <div className="relative z-10">
                            <div className="flex items-start gap-2">
                              <div className={`
                                flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-sm
                                ${currentMode === 'chat' 
                                  ? index % 3 === 0 ? 'bg-blue-100' : index % 3 === 1 ? 'bg-purple-100' : 'bg-green-100'
                                  : index % 3 === 0 ? 'bg-orange-100' : index % 3 === 1 ? 'bg-indigo-100' : 'bg-teal-100'
                                }
                              `}>
                                {currentMode === 'chat' 
                                  ? index % 3 === 0 ? '🔍' : index % 3 === 1 ? '🔗' : '🔐'
                                  : index % 3 === 0 ? '🎯' : index % 3 === 1 ? '🧪' : '🎲'
                                }
                              </div>
                              <span className="text-xs font-medium text-gray-800 leading-tight">
                                {q}
                              </span>
                            </div>
                          </div>
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}
              />
            </div>
          </>
        ) : (
          <VoiceChat
            messages={messages}
            onSendMessage={(content) => addMessage(content, "user", "voice")}
            isListening={isListening}
            setIsListening={setIsListening}
            isSpeaking={isSpeaking}
            onSwitchToText={toggleChatMode}
            currentMode={currentMode}
          />
        )}
      </div>
    </div>
  )
// ...existing code...
}
