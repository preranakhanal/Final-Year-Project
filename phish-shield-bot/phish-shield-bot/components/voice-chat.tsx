"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX, User, Send } from "lucide-react"
import type { Message } from "./text-chat"
import type SpeechRecognition from "speech-recognition"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface VoiceChatProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  isSpeaking: boolean
  onSwitchToText: () => void
  currentMode: 'chat' | 'quiz'
}

export function VoiceChat({ messages, onSendMessage, isListening, setIsListening, isSpeaking, onSwitchToText, currentMode }: VoiceChatProps) {
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)

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
  }, [messages])

  // Initialize MediaRecorder for audio recording
  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        
        // Try different audio formats based on browser support
        let mimeType = 'audio/webm;codecs=opus'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/webm'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/mp4'
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = 'audio/wav'
            }
          }
        }
        
        const recorder = new MediaRecorder(stream, { mimeType })
        let chunks: Blob[] = []

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data)
          }
        }

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: mimeType })
          await transcribeAudio(audioBlob, mimeType)
          chunks = [] // Reset chunks
        }

        setMediaRecorder(recorder)
      } catch (error) {
        console.error("Failed to initialize media recorder:", error)
        setError("Microphone access denied. Please allow microphone access.")
      }
    }

    initializeRecorder()
  }, [])

  // Transcribe audio using the backend API
  const transcribeAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsTranscribing(true)
    setError("")

    try {
      const formData = new FormData()
      
      // Set the correct file extension based on MIME type
      let fileName = 'recording.wav'
      if (mimeType.includes('webm')) {
        fileName = 'recording.webm'
      } else if (mimeType.includes('mp4')) {
        fileName = 'recording.m4a'
      } else if (mimeType.includes('ogg')) {
        fileName = 'recording.ogg'
      }
      
      formData.append("audio", audioBlob, fileName)

      const response = await fetch("http://localhost:8000/api/transcribe/", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.text) {
        onSendMessage(data.text)
        setTranscript("")
      } else {
        setError(data.error || "Failed to transcribe audio")
      }
    } catch (error) {
      console.error("Transcription error:", error)
      setError("Failed to connect to transcription service")
    } finally {
      setIsTranscribing(false)
    }
  }

  // Legacy browser speech recognition (fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"

        // Request microphone permission first
        const requestMicrophonePermission = async () => {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            return true
          } catch (error) {
            console.error("Microphone permission denied:", error)
            return false
          }
        }

        recognition.onstart = () => {
          setIsListening(true)
          setError("")
        }

        recognition.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript("")
            onSendMessage(finalTranscript)
          } else {
            setTranscript(interimTranscript)
          }
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)

          let errorMessage = ""
          switch (event.error) {
            case "network":
              errorMessage = "Network error. Please check your internet connection and try again."
              break
            case "not-allowed":
              errorMessage = "Microphone access denied. Please allow microphone access and try again."
              break
            case "no-speech":
              errorMessage = "No speech detected. Please try speaking again."
              break
            case "audio-capture":
              errorMessage = "No microphone found. Please check your microphone and try again."
              break
            case "service-not-allowed":
              errorMessage = "Speech recognition service not available. Try using text mode instead."
              break
            default:
              errorMessage = `Speech recognition error: ${event.error}. Please try again or use text mode.`
          }
          setError(errorMessage)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        // Store the permission check function
        recognition.requestPermission = requestMicrophonePermission
        recognitionRef.current = recognition
      } else {
        setIsSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onSendMessage, setIsListening])

  const startListening = async () => {
    // Use high-quality API transcription instead of browser speech recognition
    startRecording()
  }

  const stopListening = () => {
    stopRecording()
  }

  const toggleSpeech = () => {
    if ("speechSynthesis" in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
      }
    }
  }

  // Start recording audio
  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      mediaRecorder.start()
      setIsRecording(true)
      setIsListening(true)
      setError("")
    }
  }

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsListening(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Avatar Section */}
      <div className="w-80 border-r bg-gradient-to-b from-purple-50 to-blue-50 p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <div
            className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
              isSpeaking
                ? "animate-pulse shadow-lg shadow-green-200"
                : isListening
                ? "animate-pulse shadow-lg shadow-purple-200"
                : "shadow-lg"
            }`}
          >
            <Image
              src="/phish-shield-logo.png"
              alt="Phish Shield Bot"
              width={128}
              height={128}
              className="rounded-full"
            />
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mb-2">Phish Shield Bot</h3>

          <div className="text-sm text-slate-600 mb-4">
            {isSpeaking ? (
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-green-600" />
                <span>Speaking...</span>
              </div>
            ) : isTranscribing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Transcribing...</span>
              </div>
            ) : isListening ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Recording...</span>
              </div>
            ) : (
              <span>Ready to protect you</span>
            )}
          </div>

          {transcript && (
            <Card className="p-3 mb-4 bg-purple-50 border-purple-200">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Hearing: </span>
                {transcript}
              </p>
            </Card>
          )}
        </div>

        {/* Voice Controls */}
        <div className="space-y-3 w-full">
          {error && (
            <Card className="p-3 bg-red-50 border-red-200">
              <p className="text-sm text-red-700">{error}</p>
              <Button onClick={onSwitchToText} variant="outline" size="sm" className="mt-2 w-full">
                Switch to Text Mode
              </Button>
            </Card>
          )}

          {isSupported && currentMode === 'chat' ? (
            <>
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`w-full ${isListening ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
                size="lg"
                disabled={isTranscribing || (!!error && !error.includes("No speech detected"))}
              >
                {isTranscribing ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Transcribing...
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>

              <Button
                onClick={onSwitchToText}
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                size="sm"
              >
                Switch to Text Mode
              </Button>
            </>
          ) : currentMode === 'quiz' ? (
            <Card className="p-3 bg-orange-50 border-orange-200">
              <p className="text-sm text-orange-700 text-center mb-2">Voice mode not available in Quiz Mode</p>
              <Button onClick={onSwitchToText} variant="outline" size="sm" className="w-full">
                Switch to Text Mode
              </Button>
            </Card>
          ) : (
            <Card className="p-3 bg-red-50 border-red-200">
              <p className="text-sm text-red-700 text-center mb-2">Speech recognition not supported in this browser</p>
              <Button onClick={onSwitchToText} variant="outline" size="sm" className="w-full">
                Switch to Text Mode
              </Button>
            </Card>
          )}

          {isSpeaking && currentMode === 'chat' && (
            <Button onClick={toggleSpeech} variant="outline" className="w-full" size="sm">
              <VolumeX className="w-4 h-4 mr-2" />
              Stop Speaking
            </Button>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="flex-shrink-0">
                  {message.sender === "assistant" ? (
                    <div className="w-8 h-8 relative">
                      <Image
                        src="/phish-shield-logo.png"
                        alt="Phish Shield Bot"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className={`max-w-[70%] ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  {message.sender === "assistant" ? (
                    <div
                      className={`p-3 rounded-lg bg-slate-100 text-slate-800 text-sm leading-6 whitespace-pre-wrap break-words`}
                      dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  ) : (
                    <div
                      className={`p-3 rounded-lg bg-blue-600 text-white text-sm leading-6 whitespace-pre-wrap break-words`}
                    >
                      {message.content}
                    </div>
                  )}
                  {message.type === "voice" && (
                    <div className="flex items-center gap-1 mt-1 opacity-70">
                      <Mic className="w-3 h-3" />
                      <span className="text-xs">Voice message</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50">
          <p className="text-sm text-slate-600 text-center">
            {isSupported
              ? 'Click "Start Speaking" to use voice chat or switch to text mode'
              : "Voice chat not supported. Please switch to text mode."}
          </p>
        </div>
      </div>
    </div>
  )
}
