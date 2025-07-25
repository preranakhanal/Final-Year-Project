"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Mic, User2 } from "lucide-react"
import Image from "next/image"
import { WelcomeMessage } from "./welcome-message"

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: string;
}


interface TextChatProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onSwitchToVoice?: () => void
  isTyping?: boolean
  renderSuggestions?: React.ReactNode
  currentMode?: 'chat' | 'quiz'
  reasonMode?: boolean
}

export function TextChat({ messages, onSendMessage, onSwitchToVoice, isTyping, renderSuggestions, currentMode = 'chat', reasonMode = false }: TextChatProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Force scroll to bottom after every message update
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
          // Fallback
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }
    };
    
    // Use timeout to ensure DOM is fully updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }


  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-slate-50/30">
      {/* Enhanced Messages Area */}
      <ScrollArea className="flex-1 px-4 custom-scrollbar" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto py-6">
          {messages.length === 0 && !isTyping ? (
            <WelcomeMessage currentMode={currentMode} reasonMode={reasonMode} />
          ) : (
            <>
            {messages.map((message, idx) => {
              // Always generate a unique key using id, timestamp, and index
              const key = `${message.id}-${typeof message.timestamp === 'string' ? message.timestamp : (message.timestamp?.getTime?.() ?? idx)}-${idx}`;
              
              // Format timestamp properly with error handling
              const formatTimestamp = (timestamp: string | Date) => {
                try {
                  let dateObj;
                  
                  if (typeof timestamp === 'string') {
                    // Clean up malformed timestamp (remove Z if +00:00 is present)
                    let cleanTimestamp = timestamp;
                    if (timestamp.includes('+00:00Z')) {
                      cleanTimestamp = timestamp.replace('+00:00Z', 'Z');
                    }
                    dateObj = new Date(cleanTimestamp);
                  } else if (timestamp instanceof Date) {
                    // Check if the Date object is valid first
                    if (isNaN(timestamp.getTime())) {
                      console.warn('Invalid Date object received:', timestamp);
                      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use current time as fallback
                    }
                    dateObj = timestamp;
                  } else {
                    console.warn('Unknown timestamp type:', typeof timestamp, timestamp);
                    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use current time as fallback
                  }
                  
                  // Final check if date is valid
                  if (isNaN(dateObj.getTime())) {
                    console.warn('Invalid timestamp after processing:', timestamp);
                    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use current time as fallback
                  }
                  
                  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch (error) {
                  console.warn('Error formatting timestamp:', timestamp, error);
                  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Use current time as fallback
                }
              };
              
              const timeString = formatTimestamp(message.timestamp);
              
              return (
                <div key={key} className={`group mb-6 flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-slide-in`}>
                  <div className="flex gap-3 max-w-[80%]" style={{ flexDirection: message.sender === "user" ? 'row-reverse' : 'row' }}>
                    {/* Enhanced Avatar */}
                    <div className="flex-shrink-0 relative">
                      {message.sender === "assistant" ? (
                        <div className="w-9 h-9 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full animate-pulse opacity-20"></div>
                          <div className="relative w-full h-full bg-white rounded-full shadow-lg border-2 border-purple-100 flex items-center justify-center">
                            <Image
                              src="/phish-shield-logo.png"
                              alt="Phish Shield Bot"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                          <User2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Enhanced Message Content */}
                    <div className={`flex-1 min-w-0 ${message.sender === "user" ? "text-left" : "text-left"}`}>
                      {message.sender === "assistant" ? (
                        <div className="group relative">
                          <div
                            className={`
                              inline-block px-4 py-3 rounded-2xl text-sm leading-6 whitespace-pre-wrap break-words
                              bg-white border border-gray-200 text-gray-800 shadow-sm message-hover-effect
                              hover:shadow-md transition-all duration-200
                              relative overflow-hidden
                            `}
                            dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-700">$1</strong>') }}
                          />
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 via-purple-50/20 to-purple-50/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div
                            className={`
                              inline-block px-4 py-3 rounded-2xl text-sm leading-6 whitespace-pre-wrap break-words
                              bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg message-hover-effect
                              hover:shadow-xl hover:scale-[1.02] transition-all duration-200
                              relative overflow-hidden
                            `}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10">{message.content}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${message.sender === "user" ? "text-right" : "text-left"}`}>
                        {timeString}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
                          {isTyping && (
                <div className="group mb-6 flex justify-start animate-slide-in">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 relative">
                      <div className="w-9 h-9 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full animate-pulse opacity-30"></div>
                        <div className="relative w-full h-full bg-white rounded-full shadow-lg border-2 border-purple-100 flex items-center justify-center">
                          <Image
                            src="/phish-shield-logo.png"
                            alt="Phish Shield Bot"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="inline-block px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 text-sm leading-6 shadow-sm">
                        {/* Enhanced Animated 3-dot typing indicator */}
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                          <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                          <span className="w-2 h-2 bg-purple-500 rounded-full typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
      {/* Suggestions above input */}
      {renderSuggestions && (
        <div className="px-4 pb-3">
          <div className="max-w-4xl mx-auto">
            {renderSuggestions}
          </div>
        </div>
      )}
      
      {/* Enhanced Input Area */}
      <div className="relative">
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent to-white/50 pointer-events-none"></div>
        
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="relative flex items-end gap-3">
              {/* Enhanced Input Container */}
              <div className="flex-1 relative">
                <div className="relative flex items-end gap-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-purple-400/50 transition-all duration-200">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about cybersecurity... 🛡️"
                    className="flex-1 min-h-[52px] max-h-[160px] resize-none border-0 bg-transparent px-4 py-3 text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                    rows={1}
                  />
                  
                  {/* Voice Mode Toggle Button */}
                  {onSwitchToVoice && (
                    <Button
                      onClick={onSwitchToVoice}
                      variant="ghost"
                      size="sm"
                      className="m-2 h-10 w-10 p-0 rounded-xl text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 hover:scale-105"
                      title="Switch to Voice Mode"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}
                  
                  {/* Enhanced Send Button */}
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    size="sm"
                    className={`
                      m-2 h-10 w-10 p-0 rounded-xl transition-all duration-200 
                      ${inputValue.trim() 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                💡 <span className="font-medium">Tip:</span> Be specific about your cybersecurity questions for better help.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Secure connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
