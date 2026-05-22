import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getDiseaseById } from '@/lib/diseases'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, diseaseId } = await req.json()

    const disease = getDiseaseById(diseaseId)
    if (!disease) {
      return NextResponse.json({ error: 'Disease not found' }, { status: 404 })
    }

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'DOCTOR' : 'PATIENT'}: ${m.content}`)
      .join('\n')

    const prompt = `You are a medical education evaluator. A medical student conducted a diagnostic interview with a simulated patient who has ${disease.name}.

The key symptoms the patient had: ${disease.keySymptoms.join(', ')}

Conversation:
${conversationText}

Respond ONLY with valid JSON, no markdown, no backticks:
{"overallScore":75,"symptomsIdentified":3,"totalSymptoms":${disease.keySymptoms.length},"categories":{"historyTaking":70,"questioning":75,"communication":80,"clinicalReasoning":70},"strengths":["strength 1","strength 2"],"improvements":["improvement 1","improvement 2"],"likelyDiagnosis":"what the doctor concluded","correctDiagnosis":"${disease.name}","summary":"2-3 sentence feedback"}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    const clean = content.text.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid feedback format' }, { status: 500 })
    }
    const feedback = JSON.parse(jsonMatch[0])
    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 })
  }
}