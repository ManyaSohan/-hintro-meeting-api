import axios from 'axios';

export async function analyzeMeeting(transcript: any[]) {
  const transcriptText = transcript
    .map((t: any) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
    .join('\n');

  const prompt = `You are a meeting analyst. Analyze ONLY what is explicitly stated in this transcript.
Do NOT invent any information. Every insight MUST cite the exact timestamp it comes from.

TRANSCRIPT:
${transcriptText}

Return ONLY valid JSON (no markdown, no backticks) in this exact format:
{
  "summary": [{ "text": "...", "citations": [{ "timestamp": "00:10" }] }],
  "actionItems": [{ "task": "...", "assignee": "...", "citations": [{ "timestamp": "..." }] }],
  "decisions": [{ "text": "...", "citations": [{ "timestamp": "..." }] }],
  "followUps": [{ "text": "...", "citations": [{ "timestamp": "..." }] }]
}`;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const text = response.data.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}