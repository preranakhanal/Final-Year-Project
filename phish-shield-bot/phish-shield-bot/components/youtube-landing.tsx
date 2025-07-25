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
      thumbnail: "/placeholder.svg?height=180&width=320&text=What+is+Phishing",
      description:
        "Learn about phishing attacks and how to protect yourself from cybercriminals trying to steal your personal information.",
    },
    {
      id: 2,
      title: "Phishing Email 📧 and Types of Phishing Emails #cybersecurity #trending #viralvideo",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Types+of+Phishing+Email",
      description:
        "Discover different types of phishing emails and learn to identify suspicious messages in your inbox.",
    },
    {
      id: 3,
      title: "How to Spot Phishing Emails - Cybersecurity Awareness Training",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Spot+Phishing+Emails",
      description:
        "Essential tips and techniques to identify and avoid phishing emails before they compromise your security.",
    },
    {
      id: 4,
      title: "Types of Phishing Attacks Explained - Spear Phishing, Whaling & More",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Types+of+Phishing+Attacks",
      description:
        "Comprehensive guide to different phishing attack methods including spear phishing, whaling, and vishing.",
    },
    {
      id: 5,
      title: "How to Avoid Phishing Scams - Complete Protection Guide 2024",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Avoid+Phishing+Scams",
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
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="bg-white shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:scale-105"
            >
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent group-hover:from-purple-900/70 transition-all rounded-t-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-70 group-hover:opacity-100 transition-opacity fill-white" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 leading-tight">
                    {video.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>

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
