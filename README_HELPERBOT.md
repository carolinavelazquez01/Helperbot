# HelperBot — Instrucciones rápidas

Archivos incluidos
- helperbot.html
- assets/helperbot.css
- assets/helperbot.js
- assets/helperbot.svg

Integración (rápida)
1. Copia `helperbot.html` en tu plantilla y pégalo justo antes de `</body>` (o inclúyelo como parcial).
2. Asegúrate de servir los assets en `/assets/` (o actualiza las rutas en el HTML):
   ```html
   <link rel="stylesheet" href="/assets/helperbot.css">
   <script defer src="/assets/helperbot.js"></script>
   ```
3. Prueba localmente con un servidor simple (por ejemplo `python3 -m http.server 8000`) y abre `http://localhost:8000`.

Comportamiento
- Por defecto el bot funciona en modo local: respuestas simples y persistencia en `localStorage`.
- Si existe un endpoint POST `/api/assistant` que responda JSON `{ reply: "..." }`, el bot lo usará para obtener respuestas más inteligentes.

Ejemplo de endpoint (Node/Express)
```js
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.post('/api/assistant', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'missing prompt' });
  try {
    // Llamada a OpenAI (ejemplo): usa tu propia implementación/SDK y maneja errores.
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 300 })
    });
    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || 'Lo siento, no tengo respuesta.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error en el servidor' });
  }
});
app.listen(3000, () => console.log('Assistant API en :3000'));
```

Privacidad y buenas prácticas
- No pongas claves/API keys en el frontend.
- Si recoges datos de estudiantes, anonimiza y pide consentimiento según normativa local.
- Considera almacenar datos en backend si necesitas consolidar respuestas para análisis.

Siguientes mejoras que puedo hacer por ti (elige una):
1) Guardar respuestas en un backend (ejemplo con Firebase o SQLite).
2) Integrar con Plickers: importar CSV o conectar a una API.
3) Personalizar diálogos, texto y diseño según tu identidad.
4) Crear una función serverless (Vercel/Lambda) para `/api/assistant` lista para desplegar.

Si quieres que haga alguno de esos pasos ahora, dime el número y lo implemento.
