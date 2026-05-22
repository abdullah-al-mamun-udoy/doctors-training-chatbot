# MedTrain — Doctors Training Chatbot
**PRT581 Assessment 02 — Group Work**

An interactive medical training chatbot where medical students practice diagnosing patients by conducting symptom interviews with AI-powered simulated patients.

## Features
- 5 disease cases: Melanoma, Coronary Artery Disease, Gastritis, Type 2 Diabetes, Pneumonia
- Realistic AI patient that only reveals symptoms when asked
- Performance scoring & feedback after each session
- Terminal/medical aesthetic UI

## Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Get your Anthropic API Key
- Go to https://console.anthropic.com/
- Create an account and generate an API key

### 3. Add your API key
Open `.env.local` and replace the placeholder:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 4. Run the app
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## How It Works
1. **Select a disease case** from the home page
2. **Chat with the simulated patient** — ask about symptoms, history, lifestyle
3. **End the session** when you think you have enough info
4. **Get scored** on your diagnostic performance

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude API

## Project Structure
```
app/
  page.tsx              — Disease selection home page
  chat/[diseaseId]/     — Chat interface
  api/chat/             — API route for patient responses
  api/feedback/         — API route for performance evaluation
components/
  FeedbackModal.tsx     — Post-session score modal
lib/
  diseases.ts           — Disease data & patient prompts
```
