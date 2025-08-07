"use client"

import { useState } from "react"
import YouTubeLanding from "@/components/youtube-landing";
import VideoQuizInterface from "@/components/video-quiz-interface";
import { Button } from "@/components/ui/button"

export default function Page() {
  const [showQuiz, setShowQuiz] = useState(false)

  if (showQuiz) {
    return (
      <div>
        
        <VideoQuizInterface />
      </div>
    )
  }

  return <YouTubeLanding onStartQuiz={() => setShowQuiz(true)} />
}
