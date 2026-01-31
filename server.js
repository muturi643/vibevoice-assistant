require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch').default; // node-fetch v2 for streaming
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID;

const SYSTEM_PROMPT = `You are VibeVoice Assistant, a friendly and efficient productivity helper. 
Help users manage tasks, set reminders, answer questions, or brainstorm. 
Be concise, confirm actions (e.g., "Added task: Buy milk"), and speak naturally. 
Support English primarily, but handle Swahili phrases if used (you're in Nairobi!).`;

app.post('/chat', async (req, res) => {
  const { messages } = req.body; // array of { role: 'user' | 'assistant', content: string }

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    res.json({ response: responseText });
  } catch (error) {
    console.error('Groq error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

app.post('/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('No text provided');

  try {
    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: { stability: 0.75, similarity_boost: 0.85 },
      }),
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error('ElevenLabs TTS failed:', ttsRes.status, errorText);
      throw new Error(`TTS failed: ${ttsRes.status}`);
    }

    res.set('Content-Type', 'audio/mpeg');
    ttsRes.body.pipe(res);
  } catch (error) {
    console.error('TTS error:', error.message);
    res.status(500).send('TTS failed');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


