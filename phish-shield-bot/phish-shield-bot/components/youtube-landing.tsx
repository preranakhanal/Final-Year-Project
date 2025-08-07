"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Play, MessageCircle } from "lucide-react"

interface YouTubeLandingProps {
  onStartQuiz: () => void
}

export default function YouTubeLanding({ onStartQuiz }: YouTubeLandingProps) {
  const videos = [
    {
      id: 1,
      title: "What is Phishing & How To Be Safe From it in Nepali | Phishing Attack| Facebook Phishing",
      url: "https://youtu.be/zLPNVxLS0fw?si=tRuzOhSRbU0NoXNGIn",
      embedId: "zLPNVxLS0fw",
      description:
        "Learn about phishing attacks and how to protect yourself from cybercriminals trying to steal your personal information.",
    },
    {
      id: 2,
      title: "Phishing Email 📧 and Types of Phishing Emails #cybersecurity #trending #viralvideo",
      url: "https://youtu.be/PAw5zJMCkP0?si=5e8Czloo7f_5-1i_",
      embedId: "PAw5zJMCkP0",
      description:
        "Discover different types of phishing emails and learn to identify suspicious messages in your inbox.",
    },
    {
      id: 3,
      title: "How to Spot Phishing Emails - Cybersecurity Awareness Training",
      url: "https://youtu.be/WNVTGTrWcvw?si=7lVF8zT4Ga2fj2hk",
      embedId: "WNVTGTrWcvw",
      description:
        "Essential tips and techniques to identify and avoid phishing emails before they compromise your security.",
    },
    {
      id: 4,
      title: "Types of Phishing Attacks Explained - Spear Phishing, Whaling & More",
      url: "https://youtu.be/FBGnODfUecY?si=hYTWfFqr1ekT_kI0",
      embedId: "FBGnODfUecY",
      description:
        "Comprehensive guide to different phishing attack methods including spear phishing, whaling, and vishing.",
    },
    {
      id: 5,
      title: "How to Avoid Phishing Scams - Complete Protection Guide 2024",
      url: "https://youtu.be/C6z-HadM258?si=Qyo9v2_H9B55ovV7",
      embedId: "C6z-HadM258",
      description: "Ultimate guide to protecting yourself from phishing scams with practical tips and best practices.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header with Logo and Chat Mode Button */}
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
                    bg-blue-400/30 text-blue-100 border border-blue-300/50
                  `}>
                    💬 Video Mode
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mode Toggle Button */}
              <Button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="
                  bg-purple-500/20 text-white border-purple-300/30 hover:bg-purple-500/30
                  backdrop-blur-sm border rounded-xl px-4 py-2 text-sm font-semibold
                  hover:scale-105 hover:shadow-lg shadow-md transition-all duration-300
                "
              >
                💬 Chat Mode
              </Button>
            </div>
          </div>
        </div>

      <div className="p-6">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Phishing Awareness Training Videos
          </h2>
          <p className="text-gray-700 text-lg">Learn to identify and protect yourself from phishing attacks</p>
        </div>

        {/* Video Grid - 3 columns on large screens, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="bg-white shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:scale-105"
            >
              <CardContent className="p-0">
                <div className="relative group">
                  <iframe
                    width="100%"
                    height="220"
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover rounded-t-lg"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2 leading-tight">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  <Button
                    onClick={onStartQuiz}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 border-0"
                  >
                    Click to see Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center max-w-4xl mx-auto border border-purple-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-gray-700 mb-6">
            Take our comprehensive phishing awareness quiz and learn how to protect yourself from cyber threats. Watch
            the videos and answer questions to become a cybersecurity expert!
          </p>
          <Button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium border-0"
          >
            Start Complete Training Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
