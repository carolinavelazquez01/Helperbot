/* helperbot.js
  Uso:
  - Incluye /assets/helperbot.css y /assets/helperbot.js en tu página.
  - Coloca /assets/helperbot.svg o cambia la ruta en helperbot.html.
  - Por defecto funciona localmente (reglas simples).
  - Para "inteligencia" real: crea un endpoint servidor /api/assistant que llame a la API de OpenAI
    y devuelva respuestas; NO pongas la API key en el cliente.
*/

(() => {
  const bubble = document.getElementById('helperBubble');
  const helperImg = document.getElementById('helperImg');
  const helperClose = document.getElementById('helperClose');
  const openChat = document.getElementById('openChat');
  const panel = document.getElementById('helperPanel');
  const panelClose = document.getElementById('panelClose');
  const panelBody = document.getElementById('panelBody');
  const panelForm = document.getElementById('panelForm');
  const panelInput = document.getElementById('panelInput');

  // Conversación persistente
  let convo = JSON.parse(localStorage.getItem('helperbot_convo') || '[]');

  function renderConvo() {
    panelBody.innerHTML = '';
    convo.forEach(m => {
      const div = document.createElement('div');
      div.className = 'msg ' + (m.role === 'user' ? 'user' : 'bot');
      div.textContent = m.text;
      panelBody.appendChild(div);
    });
    panelBody.scrollTop = panelBody.scrollHeight;
  }

  function addMessage(role, text) {
    convo.push({ role, text, t: Date.now() });
    localStorage.setItem('helperbot_convo', JSON.stringify(convo));
    renderConvo();
  }

  // Preguntas iniciales simples (puedes personalizar)
  function onQuickAnswer(ans) {
    addMessage('user', ans);
    // Respuesta local simple
    const localResp = localReply(ans);
    addMessage('bot', localResp);
  }

  function localReply(text) {
    // Reglas simples para respuestas rápidas (modo offline)
    text = text.toLowerCase();
    if (text.includes('feliz') || text.includes('tranquilo')) {
      return '¡Qué bueno! Si necesitas compartir algo más, cuéntame.';
    }
    if (text.includes('preocup') || text.includes('estres')) {
      return 'Siento que te preocupa algo. ¿Quieres que registre esto para que el tutor lo revise?';
    }
    if (text.includes('salida') || text.includes('permane')) {
      return 'Puedo registrar salidas y frecuencia. ¿Quieres dejar una nota?';
    }
    // fallback
    return 'Interesante. ¿Quieres que te pregunte algo sobre rutinas, roles o permanencia?';
  }

  // Chat -> intenta usar servicio remoto si existe, si no usa reglas locales
  async function askAssistant(prompt) {
    // Llamada a backend recomendada (no exponer API key en cliente)
    // Se asume que /api/assistant acepta JSON {prompt: "..."} y responde {reply: "..."}
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error('No backend');
      const data = await res.json();
      if (data && data.reply) return data.reply;
      throw new Error('Respuesta inesperada');
    } catch (e) {
      // Fallback local
      return localReply(prompt);
    }
  }

  // Event listeners
  document.querySelectorAll('.quick-btn').forEach(b => {
    b.addEventListener('click', (ev) => {
      ev.preventDefault();
      const ans = b.getAttribute('data-answer');
      onQuickAnswer(ans);
    });
  });

  helperImg.addEventListener('click', () => {
    // Mostrar/ocultar burbuja
    const visible = bubble.style.display !== 'none';
    bubble.style.display = visible ? 'none' : 'block';
  });

  helperClose.addEventListener('click', () => bubble.style.display = 'none');

  openChat.addEventListener('click', (e) => {
    e.preventDefault();
    panel.setAttribute('aria-hidden', 'false');
    renderConvo();
  });

  panelClose.addEventListener('click', () => {
    panel.setAttribute('aria-hidden', 'true');
  });

  panelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = panelInput.value.trim();
    if (!text) return;
    addMessage('user', text);
    panelInput.value = '';
    addMessage('bot', 'Pensando…');
    // ask assistant
    const reply = await askAssistant(text);
    // Replace last "Pensando…" with reply
    // (Simpler: add reply)
    addMessage('bot', reply);
  });

  // cargar conversacion inicial si vacía
  if (convo.length === 0) {
    addMessage('bot', 'Hola, soy HelperBot. ¿Cómo te sientes hoy en clase?');
  } else {
    renderConvo();
  }

})();
