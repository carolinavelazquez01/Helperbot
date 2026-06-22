/* helperbot.js
  Mejoras:
  - Robustez si el markup no está presente
  - Accesibilidad: focus management, keyboard support, aria updates
  - Reemplaza el mensaje "Pensando…" en lugar de apilar múltiples
  - Soporta backend /api/assistant si existe
*/

(() => {
  const bubble = document.getElementById('helperBubble');
  const helperImgBtn = document.getElementById('helperImgBtn');
  const helperClose = document.getElementById('helperClose');
  const openChat = document.getElementById('openChat');
  const panel = document.getElementById('helperPanel');
  const panelClose = document.getElementById('panelClose');
  const panelBody = document.getElementById('panelBody');
  const panelForm = document.getElementById('panelForm');
  const panelInput = document.getElementById('panelInput');

  if (!panelBody || !panelForm || !panelInput) {
    // Required elements are missing; abort silently
    console.warn('HelperBot: elementos del DOM faltantes — widget no inicializado.');
    return;
  }

  // Conversación persistente
  let convo = [];
  try { convo = JSON.parse(localStorage.getItem('helperbot_convo') || '[]'); } catch (e) { convo = []; }

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

  function saveConvo() {
    try { localStorage.setItem('helperbot_convo', JSON.stringify(convo)); } catch (e) { /* ignore */ }
  }

  function addMessage(role, text, options = {}) {
    // If last message is a temporary "loading" placeholder from bot, replace it
    if (role === 'bot' && convo.length > 0) {
      const last = convo[convo.length - 1];
      if (last && last._loading) {
        convo[convo.length - 1] = { role, text, t: Date.now() };
        saveConvo(); renderConvo(); return;
      }
    }
    convo.push({ role, text, t: Date.now(), ...(options.loading ? { _loading: true } : {}) });
    saveConvo(); renderConvo();
  }

  // Preguntas iniciales simples (puedes personalizar)
  function onQuickAnswer(ans) {
    addMessage('user', ans);
    const localResp = localReply(ans);
    addMessage('bot', localResp);
  }

  function localReply(text) {
    text = String(text).toLowerCase();
    if (text.includes('feliz') || text.includes('tranquilo')) {
      return '¡Qué bueno! Si necesitas compartir algo más, cuéntame.';
    }
    if (text.includes('preocup') || text.includes('estres')) {
      return 'Siento que te preocupa algo. ¿Quieres que registre esto para que el tutor lo revise?';
    }
    if (text.includes('salida') || text.includes('permane')) {
      return 'Puedo registrar salidas y frecuencia. ¿Quieres dejar una nota?';
    }
    return 'Interesante. ¿Quieres que te pregunte algo sobre rutinas, roles o permanencia?';
  }

  // Try backend, else fallback local
  async function askAssistant(prompt) {
    // show loading placeholder
    addMessage('bot', 'Pensando…', { loading: true });
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error('No backend');
      const data = await res.json();
      const reply = data && data.reply ? data.reply : localReply(prompt);
      addMessage('bot', reply);
    } catch (e) {
      // fallback local
      const reply = localReply(prompt);
      addMessage('bot', reply);
    }
  }

  // Event listeners for quick buttons
  document.querySelectorAll('.quick-btn').forEach(b => {
    b.addEventListener('click', (ev) => { ev.preventDefault(); const ans = b.getAttribute('data-answer'); onQuickAnswer(ans); });
    b.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); b.click(); } });
  });

  // helper image button toggles bubble
  if (helperImgBtn && bubble) {
    helperImgBtn.addEventListener('click', () => {
      const visible = bubble.style.display !== 'none' && bubble.style.display !== '';
      bubble.style.display = visible ? 'none' : 'block';
    });
  }

  if (helperClose && bubble) helperClose.addEventListener('click', () => bubble.style.display = 'none');

  if (openChat && panel) openChat.addEventListener('click', (e) => { e.preventDefault(); openPanel(); });
  if (panelClose) panelClose.addEventListener('click', () => closePanel());

  panelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = panelInput.value.trim(); if (!text) return;
    addMessage('user', text);
    panelInput.value = '';
    await askAssistant(text);
  });

  // Keyboard support: Esc to close panel/bubble, Ctrl+K to focus input
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closePanel(); if (bubble) bubble.style.display = 'none'; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPanel(true); }
  });

  function openPanel(focusInput = false) {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'false');
    renderConvo();
    if (focusInput) setTimeout(() => panelInput.focus(), 50);
  }
  function closePanel() { if (!panel) return; panel.setAttribute('aria-hidden', 'true'); }

  // initialize conversation
  if (convo.length === 0) addMessage('bot', 'Hola, soy HelperBot. ¿Cómo te sientes hoy en clase?'); else renderConvo();

})();
