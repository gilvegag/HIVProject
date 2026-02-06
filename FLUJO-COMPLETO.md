# Flujo Completo del Chat - La Fuente

## 🎯 Descripción General

El flujo completo conecta el diseño de Figma con la funcionalidad de los wireframes y el sistema de chat en tiempo real. Todo usando el diseño modular de Reshaped.

## 📱 Flujo de Usuario

### 1. **Landing Page - Hero** (`landing-hero`)
**Componente:** `HeroContent`
- Usuario ve el mensaje principal "No estás sol@"
- Ilustración y descripción del servicio
- CTA principal: "Hablar con alguien ahora"

**Acción:** Click en CTA → va a `landing-form`

---

### 2. **Identificación** (`landing-form`)
**Componente:** `IdentifyForm`
- Usuario introduce:
  - Apodo/nickname (ej: "Luz", "Tico87")
  - Edad
  - Provincia
- Botón "Volver" regresa al hero
- Botón "Continuar" avanza a términos

**Acción:** Click en "Continuar" → va a `terms`

---

### 3. **Términos y Condiciones** (`terms`)
**Componente:** `TermsConditions`
- Usuario debe aceptar 3 checkboxes:
  1. ✓ Esto es apoyo emocional, no médico
  2. ✓ Mantener conversaciones respetuosas
  3. ✓ Conversaciones son moderadas
- Botón "Aceptar y continuar" solo se activa cuando todos estén marcados
- Botón "Volver" regresa a la forma de identificación

**Acción:** Click en "Aceptar" → se conecta al backend y va a `peer-browser`

---

### 4. **Navegador de Peers** (`peer-browser`)
**Componente:** `PeerBrowser`
- Muestra lista de personas disponibles en tiempo real
- Cada persona muestra:
  - Avatar (emoji)
  - Nombre de usuario
  - Edad y provincia
  - Estado: "Disponible ahora" (punto verde)
- **Filtros:**
  - Por provincia
  - Por rango de edad (18-25, 26-35, 36-45, 46+)
- Click en cualquier persona inicia el chat
- Botón "Volver" permite cambiar la identificación

**Acción:** Click en un peer → solicita chat y va a `chat`

---

### 5. **Chat Activo** (`chat`)
**Componente:** `ChatScreen`
- **Header:**
  - Avatar y nombre del peer
  - Edad y provincia
  - Botones: "Cambiar persona" y "Finalizar"
- **Área de mensajes:**
  - Mensajes del peer (izquierda, fondo blanco)
  - Mis mensajes (derecha, fondo azul #305dfb)
  - Auto-scroll al último mensaje
- **Input de mensaje:**
  - Textarea para escribir
  - Enter para enviar
  - Botón "Enviar"
- **Footer de seguridad:**
  - Recordatorio de que es apoyo emocional, no médico

**Acciones:**
- "Cambiar persona" → regresa a `peer-browser`
- "Finalizar" → regresa a `landing-hero`

---

## 🏗️ Arquitectura de Componentes

```
LaFuenteLayout (Layout reutilizable)
├── Logo
├── TopMenu
├── [CONTENIDO DINÁMICO] ← Aquí se intercambian los componentes
│   ├── HeroContent
│   ├── IdentifyForm
│   ├── TermsConditions
│   └── PeerBrowser
├── TrustCards
└── LogosFooter

ChatScreen (Pantalla completa independiente)
├── Header del peer
├── Área de mensajes
├── Input de mensaje
└── Footer de seguridad
```

## 🎨 Diseño y Estilo

### Colores Principales
- **Fondo general:** `#FAFAFA`
- **Primario (botones/mensajes):** `#305dfb`
- **Blanco (cards):** `#FFFFFF`
- **Bordes:** `#e0e0e0`
- **Estado disponible:** `#4CAF50`
- **Alerta:** `#fff8e1` (fondo), `#ffd54f` (borde)

### Tipografía
- **Títulos grandes:** 48px, weight 800
- **Títulos de sección:** 24px, weight 600
- **Texto normal:** 14px
- **Mensajes de chat:** 14px

### Espaciado
- **Gap entre elementos:** 16-48px
- **Padding de cards:** 24px
- **Border radius:** 6-12px para cards, 999px para botones

## 🔌 Integración Backend

### Socket Events

**Enviados por el cliente:**
```typescript
socketClient.setAvailable({ username, age, province, avatar })
socketClient.browsePeers()
socketClient.requestChat(peerId)
socketClient.sendMessage(conversationId, message)
```

**Recibidos del servidor:**
```typescript
'peers_list' → Actualiza lista de disponibles
'chat_started' → Abre pantalla de chat con peer
'message_received' → Añade mensaje a la conversación
'peer_unavailable' → Muestra alerta y regresa a navegador
```

## 🚀 Testing del Flujo

### Paso a paso:
1. Abrir `http://localhost:3002`
2. Ver landing page → Click "Hablar con alguien ahora"
3. Llenar formulario (nombre, edad, provincia) → Click "Continuar"
4. Marcar los 3 checkboxes → Click "Aceptar y continuar"
5. Ver lista de peers disponibles → Click en alguno
6. Enviar mensajes en el chat
7. Probar "Cambiar persona" o "Finalizar"

### Modo Demo (Sin backend):
El sistema incluye un usuario ficticio "Luna27 🌙" para probar el flujo completo sin necesidad de backend:
1. Completa el formulario de identificación
2. Acepta los términos
3. Verás a "Luna27" en la lista de peers
4. Click para iniciar chat
5. Envía mensajes y recibe respuestas automáticas simuladas

### Para probar con múltiples usuarios (Con backend):
1. Asegúrate de que el servidor esté corriendo en `http://localhost:3100`
2. Abrir en ventana normal: `http://localhost:3002`
3. Abrir en ventana incógnito: `http://localhost:3002`
4. Completar identificación en ambas
5. Aceptar términos en ambas
6. Se deben ver mutuamente en la lista de peers (además de Luna27)
7. Iniciar chat desde cualquiera
8. Los mensajes deben aparecer en tiempo real en ambas ventanas

## 🎨 Diseño Consistente

Todas las pantallas del flujo tienen las **mismas dimensiones exactas** (359px × 600px):
- Formulario de identificación: 359px × 600px
- Términos y condiciones: 359px × 600px (con scroll interno si es necesario)
- Navegador de peers: 359px × 600px (con scroll interno)
- Chat: 359px × 600px

Esto crea una experiencia visual **perfectamente consistente** donde:
- ✅ La caja nunca cambia de tamaño
- ✅ Solo cambia el contenido interno
- ✅ Transiciones ultra suaves entre pantallas
- ✅ El header y footer permanecen en posición fija

## 📁 Archivos Creados/Modificados

### Nuevos Componentes:
- `components/TermsConditions.tsx` - Pantalla de consentimiento (359px × 600px)
- `components/PeerBrowser.tsx` - Lista de peers con filtros (359px × 600px)
- `components/ChatScreen.tsx` - Chat en tiempo real (359px × 600px)

### Modificados:
- `app/page.tsx` - Flujo completo integrado con modo demo
- `components/HeroContent.tsx` - Proporciones de imagen corregidas
- `components/LaFuenteLayout.tsx` - Layout consistente (600px min-height)
- `components/IdentifyForm.tsx` - Formulario base (359px × 600px)

### Estilos:
- `components/HeroContent.css` - Responsive hero
- `components/LaFuenteLayout.css` - Responsive layout
- `components/IdentifyForm.css` - Responsive form

## ✅ Funcionalidad Implementada

✓ Landing page con diseño exacto de Figma
✓ Formulario de identificación
✓ Términos y condiciones con validación
✓ Navegador de peers con filtros en tiempo real
✓ Chat en tiempo real con UI moderna
✓ Sistema de mensajería bidireccional
✓ Gestión de estados y transiciones
✓ Diseño responsive
✓ Integración completa con backend Socket.io

## 🎯 Características de Seguridad

- ✓ Identidad anónima (UUID)
- ✓ Moderación mencionada en UI
- ✓ Recordatorios constantes (no es consejo médico)
- ✓ Consentimiento explícito antes de chatear
- ✓ Opción de cambiar o finalizar conversación en cualquier momento

## 🔄 Próximos Pasos Sugeridos

1. **Probar con usuarios reales** en diferentes ventanas/dispositivos
2. **Agregar indicador de "escribiendo..."** cuando el peer está escribiendo
3. **Notificaciones de nuevos mensajes** cuando estés en otra pestaña
4. **Guardar conversaciones** para poder revisar después
5. **Sistema de reportes** para comportamiento inapropiado
6. **Deploy a producción** con variables de entorno correctas

---

**¡El flujo completo está listo para probar!** 🎉

Ejecuta `npm run dev` y abre `http://localhost:3002` para verlo en acción.
