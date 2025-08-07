"use client"

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function VideoQuizInterface() {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [autoPlayTimer, setAutoPlayTimer] = useState<NodeJS.Timeout | null>(null)

  const videos = [
    {
      id: 1,
      title: "What is Phishing",
      url: "https://youtu.be/zLPNVxLS0fw?si=tRuzOhSRbU0NoXNGIn",
      embedId: "zLPNVxLS0fw",
    },
    {
      id: 2,
      title: "Types of Phishing Email",
      url: "https://youtu.be/PAw5zJMCkP0?si=5e8Czloo7f_5-1i_",
      embedId: "PAw5zJMCkP0",
    },
    {
      id: 3,
      title: "How to Spot Phishing/Awareness",
      url: "https://youtu.be/WNVTGTrWcvw?si=7lVF8zT4Ga2fj2hk",
      embedId: "WNVTGTrWcvw",
    },
    {
      id: 4,
      title: "Types of Phishing",
      url: "https://youtu.be/FBGnODfUecY?si=hYTWfFqr1ekT_kI0",
      embedId: "FBGnODfUecY",
    },
    {
      id: 5,
      title: "How to Avoid Phishing",
      url: "https://youtu.be/C6z-HadM258?si=Qyo9v2_H9B55ovV7",
      embedId: "C6z-HadM258",
    },
  ]

  const questions = [
    {
      id: 1,
      question: "What is phishing primarily designed to do?",
      options: [
        "Improve website security",
        "Steal personal information and credentials",
        "Speed up internet connection",
        "Block malicious websites",
      ],
      correct: "Steal personal information and credentials",
      explanation:
        "Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information like passwords, credit card numbers, and personal data.",
    },
    {
      id: 2,
      question: "Which of the following is a common type of phishing email?",
      options: [
        "Newsletter subscription",
        "Fake bank security alerts",
        "Software update notifications",
        "Weather reports",
      ],
      correct: "Fake bank security alerts",
      explanation:
        "Fake bank security alerts are one of the most common phishing tactics, where criminals pretend to be from your bank claiming there's a security issue with your account.",
    },
    {
      id: 3,
      question: "What should you check to spot a phishing email?",
      options: [
        "Email font size",
        "Sender's email address and URL links",
        "Email background color",
        "Number of images",
      ],
      correct: "Sender's email address and URL links",
      explanation:
        "Always verify the sender's email address for suspicious domains and hover over links to check if they lead to legitimate websites before clicking.",
    },
    {
      id: 4,
      question: "Which is NOT a common type of phishing attack?",
      options: ["Spear phishing", "Whaling", "Vishing (Voice phishing)", "Data encryption"],
      correct: "Data encryption",
      explanation:
        "Data encryption is a security measure to protect data, not a phishing attack. Spear phishing, whaling, and vishing are all types of phishing attacks.",
    },
    {
      id: 5,
      question: "What is the best way to avoid phishing attacks?",
      options: [
        "Click all links to verify them",
        "Share passwords with trusted friends",
        "Verify sender identity and use 2FA",
        "Disable antivirus software",
      ],
      correct: "Verify sender identity and use 2FA",
      explanation:
        "Always verify the sender's identity through official channels and use two-factor authentication (2FA) to add an extra layer of security to your accounts.",
    },
  ]

  const handleSubmit = () => {
    if (selectedAnswer) {
      const correct = selectedAnswer === questions[currentQuestion].correct
      setIsCorrect(correct)
      setShowFeedback(true)
    }
  }

  const handleFeedbackNext = () => {
    setShowFeedback(false)

    if (currentQuestion < questions.length - 1) {
      setShowConfirmation(true)
    } else {
      // Add final answer and show results
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      setShowResults(true)
    }
  }

  const handleConfirmNext = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    const nextQuestion = currentQuestion + 1
    setCurrentQuestion(nextQuestion)
    setCurrentVideo(nextQuestion)
    setSelectedAnswer("")
    setShowConfirmation(false)

    // Start countdown for auto-play
    setCountdown(5)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setAutoPlayTimer(timer)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correct++
      }
    })
    return correct
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setCurrentVideo(0)
    setSelectedAnswer("")
    setAnswers([])
    setShowResults(false)
    setShowFeedback(false)
    setShowConfirmation(false)
    setCountdown(5)
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      setAutoPlayTimer(null)
    }
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
      }
    }
  }, [autoPlayTimer])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white flex flex-col">
      {/* Video Section - 60% of viewport height */}
      <div className="h-[60vh] relative bg-black">
        {/* Header with Back Button and Video Title */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              onClick={() => {
                window.location.href = "/video-learning";
              }}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-sm"
            >
              ← Back to Videos
            </Button>
            <div className="flex-1 text-center">
              <span className="text-white text-sm font-medium">
                Video {currentVideo + 1}: {videos[currentVideo].title}
              </span>
              {countdown > 0 && countdown < 5 && (
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-xs">Auto-playing in {countdown}s</span>
                </div>
              )}
            </div>
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="w-full h-full relative">
          {/* YouTube Embed with autoplay */}
          <iframe
            key={currentVideo}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videos[currentVideo].embedId}?autoplay=${countdown === 0 ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
            title={videos[currentVideo].title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Quiz Section - 40% of viewport height */}
      <div className="h-[40vh] bg-gradient-to-br from-purple-900/90 to-blue-900/90">
        <div className="container mx-auto px-6 py-4 h-full">
          <Card className="bg-gradient-to-br from-purple-800/80 to-blue-800/80 border-purple-400/40 h-full flex flex-col backdrop-blur-sm">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-purple-300 font-normal">Phishing Awareness Quiz</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <h3 className="text-base font-medium text-white mb-3">{questions[currentQuestion].question}</h3>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="grid grid-cols-2 gap-2">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded-lg border border-purple-400/30 hover:border-purple-400 transition-colors cursor-pointer ${
                        selectedAnswer === option
                          ? "bg-gradient-to-r from-purple-600/40 to-blue-600/40 border-purple-400"
                          : "bg-white/10 backdrop-blur-sm"
                      }`}
                      onClick={() => setSelectedAnswer(option)}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${index}`}
                        className="border-gray-400 text-purple-400 flex-shrink-0"
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-white cursor-pointer flex-1 text-xs leading-tight"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-purple-400/30 flex-shrink-0">
                <div className="text-xs text-purple-300">
                  {currentQuestion + 1}/{questions.length}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-xs px-3 py-1 h-7 border-0"
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-700 border-purple-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-center flex items-center justify-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Congratulations!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-400" />
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    Sorry!
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-lg font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "Your answer is correct!" : "Your answer is incorrect."}
              </p>
              {!isCorrect && (
                <p className="text-purple-300 mt-2">Correct answer: {questions[currentQuestion].correct}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-medium text-white mb-2">Explanation:</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{questions[currentQuestion].explanation}</p>
            </div>

            <Button
              onClick={handleFeedbackNext}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
            >
              {currentQuestion < questions.length - 1 ? "Continue" : "View Results"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-700 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Confirm Navigation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-center text-gray-300">
              Are you sure you want to move to{" "}
              <span className="font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {videos[currentQuestion + 1]?.title}
              </span>{" "}
              part?
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-700 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                Yes, Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-gradient-to-br from-gray-800 to-gray-700 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Quiz Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {calculateScore()}/{questions.length}
              </div>
              <div className="text-lg text-gray-300">
                Score: {Math.round((calculateScore() / questions.length) * 100)}%
              </div>
            </div>

            <div className="space-y-2">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-gradient-to-r from-gray-700 to-gray-600"
                >
                  <span className="text-sm">Q{index + 1}</span>
                  {answers[index] === question.correct ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={resetQuiz}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                Retake Quiz
              </Button>
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-white hover:bg-gray-700 bg-transparent"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
