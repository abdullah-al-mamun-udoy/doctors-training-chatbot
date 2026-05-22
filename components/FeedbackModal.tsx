'use client'

interface FeedbackData {
  overallScore: number
  symptomsIdentified: number
  totalSymptoms: number
  categories?: {
    historyTaking?: number
    questioning?: number
    communication?: number
    clinicalReasoning?: number
  }
  strengths?: string[]
  improvements?: string[]
  likelyDiagnosis?: string
  correctDiagnosis?: string
  summary?: string
}

interface FeedbackModalProps {
  feedback: FeedbackData
  onClose: () => void
  onRestart: () => void
}

export default function FeedbackModal({ feedback, onClose, onRestart }: FeedbackModalProps) {
  const score = feedback.overallScore ?? 0
  const scoreColor = score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
  const likelyDx = feedback.likelyDiagnosis ?? ''
  const correctDx = feedback.correctDiagnosis ?? ''
  const diagnosisCorrect = likelyDx && correctDx
    ? likelyDx.toLowerCase().includes(correctDx.toLowerCase().split(' ')[0].toLowerCase())
    : false
  const categories = feedback.categories ?? {}
  const strengths = feedback.strengths ?? []
  const improvements = feedback.improvements ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-medical-card border border-medical-border rounded-lg glow-border overflow-hidden">
        <div className="p-6 border-b border-medical-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-medical-green" />
            <span className="text-xs font-mono opacity-50 uppercase tracking-wider">Session Complete — Performance Report</span>
          </div>
          <div className="flex items-end gap-4 mt-4">
            <div>
              <div className={`text-6xl font-display font-bold ${scoreColor}`}>{score}</div>
              <div className="text-xs font-mono opacity-50">/ 100 overall score</div>
            </div>
            <div className="flex-1 mb-2">
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${score}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {(likelyDx || correctDx) && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">Diagnosis Assessment</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-medical-border rounded bg-medical-dark">
                  <div className="text-xs opacity-50 mb-1">Your Diagnosis</div>
                  <div className={`text-sm font-mono ${diagnosisCorrect ? 'text-green-400' : 'text-red-400'}`}>{likelyDx || 'Not determined'}</div>
                </div>
                <div className="p-3 border border-green-900 rounded bg-green-900/10">
                  <div className="text-xs opacity-50 mb-1">Correct Diagnosis</div>
                  <div className="text-sm font-mono text-green-400">{correctDx}</div>
                </div>
              </div>
            </div>
          )}

          {feedback.totalSymptoms > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">
                Symptoms Identified: {feedback.symptomsIdentified ?? 0}/{feedback.totalSymptoms}
              </h3>
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${((feedback.symptomsIdentified ?? 0) / feedback.totalSymptoms) * 100}%` }} />
              </div>
            </div>
          )}

          {Object.keys(categories).length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-3">Category Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(categories).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="opacity-70 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-medical-green">{value ?? 0}%</span>
                    </div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${value ?? 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(strengths.length > 0 || improvements.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">✓ Strengths</h3>
                <ul className="space-y-1">
                  {strengths.map((s, i) => <li key={i} className="text-xs font-mono text-green-400 opacity-80">• {s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">↑ To Improve</h3>
                <ul className="space-y-1">
                  {improvements.map((s, i) => <li key={i} className="text-xs font-mono text-yellow-400 opacity-80">• {s}</li>)}
                </ul>
              </div>
            </div>
          )}

          {feedback.summary && (
            <div className="p-4 border border-medical-border rounded bg-medical-dark">
              <h3 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">Summary</h3>
              <p className="text-sm font-mono text-medical-text opacity-80 leading-relaxed">{feedback.summary}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-medical-border flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2 border border-medical-border rounded font-mono text-sm hover:border-medical-muted transition-colors">
            Back to Cases
          </button>
          <button onClick={onRestart} className="px-5 py-2 bg-medical-green text-medical-dark rounded font-mono text-sm font-bold hover:bg-medical-accent transition-colors">
            Try Again →
          </button>
        </div>
      </div>
    </div>
  )
}