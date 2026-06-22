/* helperbot.js - Versión totalmente funcional y autónoma
  Implementa: Manejo de estados de ánimo, respuestas contextuales basadas en hábitos/roles,
  persistencia local, auto-scroll y accesibilidad.
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
    console.warn('HelperBot: Elementos del DOM faltantes — widget no inicializado.');
    return;
  }

  // 1. Cargar o inicializar el historial de conversación
  let convo = [];
  try { 
    convo = JSON.parse(localStorage.getItem('helperbot_convo') || '[]'); 
  } catch (e) { 
    convo = []; 
  }

  // Si la conversación está vacía, añadir saludo inicial predeterminado
  if (convo.length === 0) {
    convo.push({ role: 'bot', text: '¡Hola! Soy tu asistente de HelperBot. Estoy aquí para ayudarte con tus rutinas de aula, tus roles como Helper y para saber cómo te sientes hoy. ¿En qué puedo ayudarte?' });
    localStorage.setItem('helperbot_convo', JSON.stringify(convo));
  }

  // 2. Renderizar la conversación en el panel
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
    convo.push({ role, text });
    try { localStorage.setItem('helperbot_convo', JSON.stringify(convo)); } catch(e){}
    renderConvo();
  }

  // 3. Sistema Integrado de Respuestas Inteligentes de HelperBot (Simulación de IA Local)
  function getLocalResponse(input) {
    const text = input.toLowerCase().trim();
    
    // Respuestas basadas en emociones
    if (text.includes('feliz') || text.includes('contento') || text.includes('bien')) {
      return "¡Qué excelente noticia! 🎉 Me alegra mucho que empieces o continúes tu día con esa energía. ¡Aprovecha esa motivación para liderar hoy en tu isla de trabajo!";
    }
    if (text.includes('tranquilo') || text.includes('relajado') || text.includes('calmo')) {
      return "La tranquilidad es un estado ideal para concentrarse y aprender con claridad. 🧘‍♂️ ¡Que tengas una sesión muy productiva y enfocada!";
    }
    if (text.includes('preocupado') || text.includes('asustado') || text.includes('ansioso')) {
      return "Entiendo que te sientas así. A veces las tareas o los exámenes generan presión. 😟 Recuerda respirar hondo, organizar tus materiales paso a paso y, si lo necesitas, coméntaselo a tu docente tutor en el bloque de tutoría.";
    }
    if (text.includes('molesto') || text.includes('enojado') || text.includes('enfadado')) {
      return "Lamento que las cosas no vayan bien en este momento. 😠 Está bien sentir enojo, pero recuerda pausar antes de actuar. Si necesitas un momento fuera de la isla de trabajo o hablar con tu tutor, avísame.";
    }
    if (text.includes('triste') || text.includes('mal') || text.includes('cansado')) {
      return "Siento escuchar eso. 🥺 El cansancio o la tristeza son válidos. Recuerda que cada paso cuenta y que tu equipo y tu tutor están para apoyarte. ¡No estás solo!";
    }

    // Respuestas sobre roles / Helpers
    if (text.includes('helper') || text.includes('roles') || text.includes('rol') || text.includes('responsabilidad')) {
      return "¡Los Helpers son la clave del aula! 🌟 Recuerda que tenemos 6 roles principales en cada isla: Organización (mochilas/lockers), Limpieza, Materiales (tareas/recursos), Entorno (luz/ventilación), Pizarra y Convivencia. ¿Tienes alguna duda sobre las funciones de un rol específico?";
    }
    if (text.includes('limpieza') || text.includes('limpiar')) {
      return "🧹 Como Helper de Limpieza, tu misión es asegurar que al cambiar de clase y al final de la jornada el piso y las carpetas de tu isla queden impecables. ¡El orden externo ayuda al orden mental!";
    }
    if (text.includes('organización') || text.includes('mochila') || text.includes('locker')) {
      return "🎒 Como Helper de Organización, debes verificar que las mochilas no obstruyan el paso y que los lockers estén cerrados y ordenados. ¡Evitemos accidentes!";
    }
    if (text.includes('materiales') || text.includes('tarea')) {
      return "📚 Como Helper de Materiales, coordinas la entrega rápida de fichas de trabajo, cuadernos o tareas de tu isla hacia el docente. ¡Ahorras tiempo valioso de aprendizaje!";
    }
    if (text.includes('convivencia') || text.includes('acuerdo')) {
      return "🤝 Como Helper de Convivencia, recuerdas amablemente a tus compañeros los acuerdos del aula (como levantar la mano para hablar) y promueves que todos participen en equipo.";
    }

    // Respuestas sobre Rutinas e Indicadores
    if (text.includes('rutina') || text.includes('hábitos') || text.includes('hábito')) {
      return "📋 Las rutinas salvan vidas escolares. Se dividen en: Inicio (revisar lockers, abrir ventanas, agendar el día), Durante el día (entrega y cuidado) y Cierre (apagar ventiladores, guardar todo). El objetivo es cumplirlas de forma autónoma, ¡sin que el profesor tenga que recordarlo!";
    }
    if (text.includes('plickers') || text.includes('código') || text.includes('qr') || text.includes('datos')) {
      return "🤖 Escaneamos tus respuestas usando tarjetas Plickers para procesar los datos del aula en menos de 2 minutos. Así tu tutor sabe exactamente cómo se siente el salón o si las rutinas se están consolidando.";
    }
    if (text.includes('hola') || text.includes('buenos dias') || text.includes('buenas tardes')) {
      return "¡Hola! Qué gusto saludarte. 😊 ¿Quieres registrar tu estado emocional, revisar tus deberes de Helper o aprender sobre las rutinas del aula?";
    }
    if (text.includes('gracias') || text.includes('adios') || text.includes('chau')) {
      return "¡De nada! 🙌 Sigue construyendo tu autonomía día a día. ¡Nos vemos en el próximo escaneo de HelperBot!";
    }

    // Respuesta por defecto
    return "Interesante pregunta. 🧐 Recuerda que HelperBot analiza las 4 dimensiones del aula: Bienestar Emocional, Rutinas, Roles de Helpers y Control de Salidas. ¿Me podrías dar más detalles o usar palabras clave como 'roles', 'rutinas' o decirme una emoción?";
  }

  // 4. Lógica de envío y procesamiento de mensajes
  async function askAssistant(text) {
    // Añadir indicador visual de "pensando..."
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'msg bot thinking';
    thinkingDiv.textContent = 'Escribiendo...';
    panelBody.appendChild(thinkingDiv);
    panelBody.scrollTop = panelBody.scrollHeight;

    // Simular un retraso natural de respuesta (600ms)
    setTimeout(async () => {
      thinkingDiv.remove();

      /* Opcional: Si en el futuro tienes una API real corriendo en tu servidor,
        el código intentará conectarse a ella automáticamente.
      */
      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            addMessage('bot', data.reply);
            return;
          }
        }
      } catch (err) {
        // Si no hay servidor API activo, la ejecución cae silenciosamente al sistema local
      }

      // Si no hay API externa, usar la base de conocimientos local estructurada
      const reply = getLocalResponse(text);
      addMessage('bot', reply);
    }, 600);
  }

  // 5. Vincular acciones rápidas (Los botones de la burbuja flotante)
  document.querySelectorAll('.quick-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevenir interferencias de clicks
      const emotion = button.getAttribute('data-answer');
      
      // Abrir el panel de conversación
      openPanel(true);
      
      // Simular que el usuario envió la emoción seleccionada
      addMessage('user', `Me siento ${emotion}`);
      askAssistant(emotion);
      
      // Ocultar la burbuja exterior una vez seleccionado
      if (bubble) bubble.style.display = 'none';
    });
  });

  // 6. Controladores de la Interfaz (Abrir, Cerrar, Atajos de teclado)
  function openPanel(focusInput = false) {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'false');
    // Forzar visibilidad por estilos si el CSS base depende del atributo
    panel.style.display = 'flex'; 
    renderConvo();
    if (focusInput) setTimeout(() => panelInput.focus(), 50);
  }

  function closePanel() {
    if (!panel) return;
    panel.setAttribute('aria-hidden', 'true');
    panel.style.display = 'none';
  }

  if (helperImgBtn) {
    helperImgBtn.addEventListener('click', () => {
      const isHidden = panel.style.display === 'none' || panel.getAttribute('aria-hidden') === 'true';
      if (isHidden) {
        openPanel(true);
      } else {
        closePanel();
      }
    });
  }

  if (helperClose && bubble) {
    helperClose.addEventListener('click', (e) => {
      e.stopPropagation();
      bubble.style.display = 'none';
    });
  }

  if (openChat) {
    openChat.addEventListener('click', (e) => {
      e.preventDefault();
      openPanel(true);
      if (bubble) bubble.style.display = 'none';
    });
  }

  if (panelClose) {
    panelClose.addEventListener('click', () => closePanel());
  }

  // Envío del formulario de texto escrito
  panelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = panelInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    panelInput.value = '';
    await askAssistant(text);
  });

  // Soporte de Accesibilidad por Teclado (Esc para cerrar, Ctrl+K para abrir/enfocar)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePanel();
      if (bubble) bubble.style.display = 'none';
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPanel(true);
    }
  });

})();