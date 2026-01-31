const chatDiv = document.getElementById('chat');
const speakBtn = document.getElementById('speakBtn');
const status = document.getElementById('status');
const audio = document.getElementById('audio');

// Text fallback input (always visible now for reliability)
const fallbackWrapper = document.createElement('div');
fallbackWrapper.style.margin = '15px 0 0';
fallbackWrapper.innerHTML = `
  <p style="font-size: 0.8rem; color: #9ca3af; margin: 0 0 8px;">Or type your message:</p>
  <input id="textInput" type="text" placeholder="Type here and press Enter..." style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 1rem;">
`;
document.querySelector('.controls-area').appendChild(fallbackWrapper);

const textInput = document.getElementById('textInput');

let messages = [];
let voiceErrorCount = 0; // Track repeated voice errors

// Browser support check
if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
  status.textContent = 'Speech not supported – use text input below. Try Chrome!';
  speakBtn.style.opacity = '0.5';
  console.error('Web Speech API not supported');
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Recognition ? new Recognition() : null;

if (recognition) {
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatDiv.appendChild(msg);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function handleUserInput(text) {
  if (!text.trim()) return;
  status.textContent = 'Processing...';
  addMessage('user', text);
  messages.push({ role: 'user', content: text });

  try {
    const chatRes = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!chatRes.ok) throw new Error('Chat failed');
    const { response } = await chatRes.json();
    addMessage('assistant', response);
    messages.push({ role: 'assistant', content: response });

    // Try ElevenLabs first (premium voice)
    const ttsRes = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response }),
    });

    if (ttsRes.ok) {
      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audio.src = audioUrl;
      audio.play();
      console.log('ElevenLabs voice played');
    } else {
      // Fallback to browser TTS
      console.log('ElevenLabs failed – using browser voice fallback');
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'en-US'; // Or 'sw-KE' if available
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    status.textContent = 'Error – try again';
    console.error('Handle input error:', err);
  }

  status.textContent = 'Ready';
  speakBtn.classList.remove('listening');
  speakBtn.disabled = false;
  textInput.value = '';
}

// Voice button
speakBtn.addEventListener('click', () => {
  if (!recognition) {
    status.textContent = 'Voice not available – type below';
    return;
  }
  recognition.start();
  speakBtn.classList.add('listening');
  status.textContent = 'Listening...';
  speakBtn.disabled = true;
});

if (recognition) {
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleUserInput(transcript);
    voiceErrorCount = 0; // Reset on success
  };

  recognition.onerror = (event) => {
    console.error('SpeechRecognition error:', event.error);
    voiceErrorCount++;

    let msg = 'Voice error – try text input below';
    if (event.error === 'network') {
      msg = 'Voice network error – use Chrome incognito, disable ad-blockers, or type below';
    } else if (event.error === 'not-allowed') {
      msg = 'Mic permission denied – check browser settings & reload';
    }

    status.textContent = msg;
    speakBtn.classList.remove('listening');
    speakBtn.disabled = false;

    if (voiceErrorCount > 2) {
      speakBtn.style.display = 'none'; // Hide mic if repeated fails
      status.textContent = 'Voice unavailable – using text mode';
    }
  };

  recognition.onend = () => {
    speakBtn.classList.remove('listening');
    if (status.textContent.includes('Listening')) {
      status.textContent = 'Ready';
      speakBtn.disabled = false;
    }
  };
}

// Text input handler
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleUserInput(textInput.value.trim());
  }
});

// Intro message already in HTML