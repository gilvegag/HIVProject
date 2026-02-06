# 🎭 Modo Demo - Usuario Ficticio

## ¿Qué es?

El sistema ahora incluye un **usuario ficticio** para que puedas probar el flujo completo del chat **sin necesidad de tener el backend corriendo** o abrir múltiples ventanas.

## 👤 Usuario Demo

**Nombre:** Luna27  
**Avatar:** 🌙  
**Edad:** 28 años  
**Provincia:** San José  

## 🚀 Cómo Usar el Modo Demo

1. **Abre la aplicación:**
   ```
   npm run dev
   ```
   Visita: `http://localhost:3002`

2. **Completa el flujo:**
   - Click en "Hablar con alguien ahora"
   - Llena tu información (nombre, edad, provincia)
   - Acepta los términos y condiciones
   - Verás a "Luna27 🌙" en la lista de peers disponibles

3. **Inicia el chat:**
   - Click en Luna27
   - Envía mensajes
   - **Luna27 responderá automáticamente** con mensajes de apoyo simulados

## 💬 Respuestas Automáticas

Luna27 tiene un conjunto de respuestas empáticas que aparecen después de 1.5-2.5 segundos:
- "Gracias por compartir eso conmigo. Te entiendo."
- "Eso suena difícil. ¿Cómo te has sentido con eso?"
- "Estoy aquí para escucharte. Tómate tu tiempo."
- "He pasado por algo similar. No estás sol@."
- "Es completamente válido sentirse así. Gracias por confiar en mí."

## ✨ Ventajas del Modo Demo

✅ **No requiere backend** - Funciona sin servidor Socket.io  
✅ **Testing rápido** - Prueba el flujo completo inmediatamente  
✅ **UI/UX completo** - Experimenta toda la interfaz  
✅ **Diseño responsive** - Prueba en diferentes tamaños de pantalla  
✅ **Respuestas realistas** - Simula una conversación real con delays  

## 🔄 Funcionalidad Demo vs Real

### Modo Demo (Luna27):
- ✅ Formulario de identificación
- ✅ Términos y condiciones
- ✅ Lista de peers (muestra a Luna27)
- ✅ Chat con respuestas automáticas
- ✅ Cambiar persona / Finalizar conversación
- ❌ No se conecta al backend
- ❌ No hay otros usuarios reales

### Modo Real (Con Backend):
- ✅ Todo lo del modo demo
- ✅ Usuarios reales en tiempo real
- ✅ Mensajes bidireccionales en vivo
- ✅ Múltiples peers disponibles
- ✅ Sistema de moderación activo

## 🔧 Backend Real (Opcional)

Si quieres probar con usuarios reales además de Luna27:

1. **Inicia el servidor:**
   ```bash
   cd server
   npm start
   ```

2. **Abre múltiples ventanas:**
   - Normal: `http://localhost:3002`
   - Incógnito: `http://localhost:3002`

3. **Verás:**
   - Luna27 (ficticio)
   - Otros usuarios reales conectados

## 🎨 Diseño Consistente

Todas las pantallas mantienen las **mismas dimensiones** (359px × 600px):
- Formulario de identificación: 359px × 600px
- Términos y condiciones: 359px × 600px  
- Navegador de peers: 359px × 600px
- **Chat: 359px × 600px** ← Dimensiones consistentes en todas

Esto crea una experiencia visual perfectamente uniforme donde la caja nunca cambia de tamaño.

## 📱 Layout

Todas las pantallas (incluyendo el chat) están dentro del **LaFuenteLayout**, manteniendo:
- Logo y menú superior
- Trust cards al final
- Logos footer
- Fondo consistente (#FAFAFA)
- **Caja central de 359px × 600px** (siempre del mismo tamaño)
- Solo cambia el contenido dentro de la caja

```
┌─────────────────────────────┐
│     LaFuenteLayout          │
│   ┌─────────────────────┐   │
│   │  Logo + Menu        │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │   [359px × 600px]   │   │ ← Siempre el mismo tamaño
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │   Trust Cards       │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │   Footer Logos      │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
```

---

**¡Perfecto para demos, testing y desarrollo de UI!** 🎉
