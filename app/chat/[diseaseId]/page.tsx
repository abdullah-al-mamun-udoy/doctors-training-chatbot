'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDiseaseById } from '@/lib/diseases'
import FeedbackModal from '@/components/FeedbackModal'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface FeedbackData {
  overallScore: number
  symptomsIdentified: number
  totalSymptoms: number
  categories: {
    historyTaking: number
    questioning: number
    communication: number
    clinicalReasoning: number
  }
  strengths: string[]
  improvements: string[]
  likelyDiagnosis: string
  correctDiagnosis: string
  summary: string
}

export default function ChatPage({ params }: { params: { diseaseId: string } }) {
  const router = useRouter()
  const disease = getDiseaseById(params.diseaseId)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [isGettingFeedback, setIsGettingFeedback] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (!disease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-red-400">Disease not found. <a href="/" className="underline">Go back</a></p>
      </div>
    )
  }

  const startSession = async () => {
    setSessionStarted(true)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diseaseId: params.diseaseId,
          messages: [{ role: 'user', content: 'Hello, I need to see a doctor today.' }],
        }),
      })
      const data = await res.json()
      setMessages([
        { role: 'assistant', content: data.message },
      ])
    } catch {
      setMessages([{ role: 'assistant', content: 'Hello, please have a seat. What brings you in today?' }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setMessageCount(prev => prev + 1)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseaseId: params.diseaseId, messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'I\'m sorry, could you repeat that?' }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const endSession = async () => {
    if (messages.length < 4) return
    setIsGettingFeedback(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseaseId: params.diseaseId, messages }),
      })
      const data = await res.json()
      setFeedback(data)
    } catch {
      alert('Failed to generate feedback. Please try again.')
    } finally {
      setIsGettingFeedback(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const difficultyColor: Record<string, string> = {
    Beginner: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400',
  }

  return (
    <main className="h-screen flex flex-col bg-medical-dark">
      {/* Top Bar */}
      <div className="flex-none border-b border-medical-border bg-medical-card px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-xs font-mono opacity-40 hover:opacity-80 transition-opacity"
            >
              ← CASES
            </button>
            <div className="h-4 w-px bg-medical-border" />
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-mono opacity-50 uppercase">{disease.category}</span>
                <span className={`text-xs font-mono ${difficultyColor[disease.difficulty]}`}>
                  [{disease.difficulty}]
                </span>
              </div>
              <h2 className="text-sm font-mono text-medical-text">{disease.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono opacity-40">
              {messageCount} question{messageCount !== 1 ? 's' : ''} asked
            </span>
            {sessionStarted && messages.length >= 4 && (
              <button
                onClick={endSession}
                disabled={isGettingFeedback}
                className="px-4 py-1.5 border border-medical-green text-medical-green rounded font-mono text-xs hover:bg-medical-green hover:text-medical-dark transition-all"
              >
                {isGettingFeedback ? 'Evaluating...' : 'END SESSION'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {!sessionStarted ? (
            /* Pre-session briefing */
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-block p-6 border border-medical-border rounded-lg bg-medical-card glow-border mb-6">
                <div className="text-xs font-mono opacity-50 mb-4 uppercase tracking-wider">Patient Briefing</div>
                <h2 className="text-2xl font-display text-medical-green mb-2">{disease.name}</h2>
                <p className="text-sm font-mono opacity-60 mb-4">{disease.description}</p>
                <div className="text-left border-t border-medical-border pt-4">
                  <p className="text-xs font-mono opacity-40 mb-2">// INSTRUCTIONS</p>
                  <ul className="text-xs font-mono opacity-60 space-y-1">
                    <li>• Ask the patient about their symptoms and medical history</li>
                    <li>• Ask one or two questions at a time — be natural</li>
                    <li>• Try to determine the diagnosis through conversation</li>
                    <li>• End the session when ready for your performance evaluation</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={startSession}
                className="px-10 py-3 bg-medical-green text-medical-dark rounded font-mono font-bold text-sm hover:bg-medical-accent transition-colors"
              >
                START CONSULTATION →
              </button>
            </div>
          ) : (
            /* Messages */
            <>
              <div className="text-center text-xs font-mono opacity-30 py-2">
                — Session Started —
              </div>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`animate-slide-up ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <span className={`text-xs font-mono opacity-40 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'user' ? '👨‍⚕️ Doctor (You)' : '🤒 Patient'}
                    </span>
                    <div className={`p-4 rounded text-sm font-mono leading-relaxed ${
                      msg.role === 'user' ? 'chat-bubble-doctor' : 'chat-bubble-patient'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-slide-up">
                  <div className="max-w-[80%]">
                    <span className="text-xs font-mono opacity-40 px-1">🤒 Patient</span>
                    <div className="p-4 mt-1 chat-bubble-patient rounded">
                      <div className="typing-indicator flex items-center gap-1">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      {sessionStarted && (
        <div className="flex-none border-t border-medical-border bg-medical-card px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <div className="flex-1 flex items-center border border-medical-border rounded bg-medical-dark focus-within:border-medical-green transition-colors">
              <span className="pl-3 text-medical-green text-sm font-mono opacity-60">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the patient a question..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-3 text-sm font-mono text-medical-text placeholder-medical-text/20 outline-none"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-medical-green text-medical-dark rounded font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-medical-accent transition-all"
            >
              SEND
            </button>
          </div>
          <p className="text-center text-xs font-mono opacity-20 mt-2">Enter to send • End session when ready for evaluation</p>
        </div>
      )}

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          feedback={feedback}
          onClose={() => router.push('/')}
          onRestart={() => {
            setFeedback(null)
            setMessages([])
            setMessageCount(0)
            setSessionStarted(false)
          }}
        />
      )}
    </main>
  )
}
