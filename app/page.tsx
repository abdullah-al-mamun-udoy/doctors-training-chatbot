'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { diseases } from '@/lib/diseases'

const difficultyColor: Record<string, string> = {
  Beginner: 'text-green-400 border-green-400',
  Intermediate: 'text-yellow-400 border-yellow-400',
  Advanced: 'text-red-400 border-red-400',
}

export default function HomePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  const handleStart = () => {
    if (selected) router.push(`/chat/${selected}`)
  }

  return (
    <main className="min-h-screen bg-medical-dark p-6 md:p-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse-slow" />
            <span className="text-medical-text text-xs tracking-widest uppercase opacity-60">
              PRT581 — Medical Training System v1.0
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-medical-green glow-text leading-tight">
            Doctors-Training-Chatbot
          </h1>
          <p className="text-medical-text opacity-70 mt-3 text-lg font-mono">
            Select a patient case to begin your diagnostic interview
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-medical-green via-medical-border to-transparent" />
        </div>

        {/* Instructions */}
        <div className="mb-8 p-4 border border-yellow-900 bg-yellow-900/10 rounded">
          <p className="text-yellow-400 text-sm font-mono">
            <span className="opacity-60">// </span>
            OBJECTIVE: Chat with the simulated patient to identify their condition. Ask about symptoms, history, and lifestyle. End the session to receive your performance score.
          </p>
        </div>

        {/* Disease Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {diseases.map((disease) => (
            <button
              key={disease.id}
              onClick={() => setSelected(disease.id)}
              className={`text-left p-5 rounded border transition-all duration-200 glow-border ${
                selected === disease.id
                  ? 'border-medical-green bg-medical-green/10'
                  : 'border-medical-border bg-medical-card hover:border-medical-muted'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono opacity-50 uppercase tracking-wider">
                  {disease.category}
                </span>
                <span
                  className={`text-xs font-mono border rounded px-2 py-0.5 ${difficultyColor[disease.difficulty]}`}
                >
                  {disease.difficulty}
                </span>
              </div>
              <h3 className={`font-display text-lg mb-2 ${selected === disease.id ? 'text-medical-green glow-text' : 'text-medical-text'}`}>
                {disease.name}
              </h3>
              <p className="text-xs font-mono opacity-50 mb-3 leading-relaxed">
                {disease.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {disease.keySymptoms.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-medical-muted/30 border border-medical-border rounded px-2 py-0.5 text-medical-text opacity-60"
                  >
                    {s}
                  </span>
                ))}
                {disease.keySymptoms.length > 3 && (
                  <span className="text-xs opacity-40 px-1 py-0.5">
                    +{disease.keySymptoms.length - 3} more
                  </span>
                )}
              </div>
              {selected === disease.id && (
                <div className="mt-3 flex items-center gap-2 text-medical-green text-xs">
                  <span className="animate-blink">▶</span> Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStart}
            disabled={!selected}
            className={`px-8 py-3 rounded font-mono text-sm tracking-wider transition-all duration-200 ${
              selected
                ? 'bg-medical-green text-medical-dark hover:bg-medical-accent font-bold cursor-pointer'
                : 'bg-medical-border text-medical-text opacity-30 cursor-not-allowed'
            }`}
          >
            BEGIN SESSION →
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-medical-border text-center text-xs font-mono opacity-30">
          PRT581 Assessment 02 — Group Work — Doctors Training Chatbot
        </div>
      </div>
    </main>
  )
}
