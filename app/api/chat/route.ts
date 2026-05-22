import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getDiseaseById } from '@/lib/diseases'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, diseaseId } = await req.json()

    if (!diseaseId) {
      return NextResponse.json({ error: 'Disease ID is required' }, { status: 400 })
    }

    const disease = getDiseaseById(diseaseId)
    if (!disease) {
      return NextResponse.json({ error: 'Disease not found' }, { status: 404 })
    }

    // Filter out empty messages and ensure valid format
    const validMessages = messages.filter((m: { role: string; content: string }) => 
      m.content && m.content.trim() !== ''
    )

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: disease.systemPrompt,
      messages: validMessages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    return NextResponse.json({ message: content.text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}