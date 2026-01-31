# VibeVoice Assistant

![VibeVoice AI productivity assistant interface showing a purple chat bubble with user request to set a homework reminder, the assistant's confirmation response, and a tap-to-speak button for voice input](<Reminder app.png>)

A voice-first productivity assistant built for the AI Vibe Coding Hackathon. Speak naturally to add tasks, set reminders, brainstorm ideas, or ask questions — VibeVoice responds with a lifelike voice and handles English + basic Swahili phrases (perfect for Nairobi users!).
Live Demo: [Add your deployed link here, e.g., Vercel/Netlify]
GitHub: [your-repo-link]

🌟 Features

Natural Voice Input: Use your microphone to speak commands (Web Speech API).
Lifelike Voice Responses: Powered by ElevenLabs (Rachel voice) for premium, streaming TTS.
Smart AI Brain: Groq's Llama-3.3-70B model understands tasks, reminders, and casual chat — fast and free-tier friendly.
Text Fallback: Type messages if voice has issues (great for reliability/accessibility).
Swahili Support: Handles mixed English/Swahili (e.g., "Remindar me kucall mom kesho").
Mobile-Friendly UI: Clean, modern design with animations and pulsing mic button.
Browser TTS Backup: Falls back to built-in voices if ElevenLabs credits run low.

Example commands:

"Add a task to submit my hackathon project"
"Set a reminder to call mom at 5 PM"
"Help me brainstorm hackathon ideas"

🛠️ Tech Stack

Backend: Node.js + Express
AI: Groq API (Llama-3.3-70B-versatile)
Text-to-Speech: ElevenLabs (streaming, turbo v2 model)
Speech-to-Text: Browser Web Speech API
Frontend: Vanilla HTML/CSS/JS
Vibe Coding Tools: Cursor, Bolt.new, Lovable — ~90% generated via AI prompts!

Built entirely with free tools and sponsor integrations (ElevenLabs for voice bounty!).

🚀 Setup & Running Locally

Clone the repoBashgit clone https://github.com/your-username/vibevoice-assistant.git
cd vibevoice-assistant
Install dependenciesBashnpm install
Create .env file (in the root folder)envGROQ_API_KEY=gq-your-groq-key-here   # From console.groq.com
ELEVENLABS_API_KEY=your-elevenlabs-key-here
VOICE_ID=21m00Tcm4TlvDq8ikWAM        # Rachel (or your preferred premade voice ID)
PORT=3000
Start the serverBashnode server.js
Open in browser: http://localhost:3000
Allow microphone permission → Click the mic and speak!

📱 Deployment Tips

Deploy free on Vercel, Render, or Netlify (static + serverless functions work great).
For full voice features, ensure HTTPS (required for mic access).

🤝 Contributing
Feel free to fork and improve! Add calendar integration, persistent tasks (localStorage/DB), or more languages.
🙌 Acknowledgments

AI Vibe Coding Hackathon organizers & sponsors (ElevenLabs, Groq, Daytona, etc.)
Built by ERNEST in Nairobi, Kenya — vibe-coded in 72 hours!
Special thanks to free AI tools that made this possible.