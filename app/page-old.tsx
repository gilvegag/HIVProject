'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button, Card, TextField, Select } from 'reshaped';
import identityManager from '@/lib/identityManager';
import socketClient, { type Peer, type Message } from '@/lib/socketClient';

// Image assets from Figma
const imgVector = "https://www.figma.com/api/mcp/asset/17d6d614-93b8-4a18-8cc2-eeec25f6538c";
const imgOpenDoodlesIllustration = "https://www.figma.com/api/mcp/asset/b6faf763-3216-448a-bbed-43a4b5112c34";
const imgMessageIcon = "https://www.figma.com/api/mcp/asset/8a8591a5-7b0c-460b-996d-efd237fce6e1";
const imgLogo1 = "https://www.figma.com/api/mcp/asset/fe988fc8-767e-4642-847e-3a4d41a084fc";
const imgLogo2 = "https://www.figma.com/api/mcp/asset/8c8c348f-291e-40ab-98d1-07277ea596af";

type Screen = 'landing' | 'profile-setup' | 'chat';

export default function LaFuenteApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [identity, setIdentity] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  
  // Profile data
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [province, setProvince] = useState('');
  
  // Chat data
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Initialize identity
  useEffect(() => {
    async function init() {
      const id = await identityManager.getOrCreateIdentity();
      if (id) {
        setIdentity(id);
        await socketClient.connect(id.userId);
        setConnected(true);
        setupSocketListeners();
      }
    }
    init();
    return () => socketClient.disconnect();
  }, []);

  function setupSocketListeners() {
    socketClient.on('chat_started', (data: any) => {
      setConversationId(data.conversationId);
      setSelectedPeer(data.peer);
      setMessages([]);
      setCurrentScreen('chat');
    });

    socketClient.on('message_received', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('peers_list', (peersList: Peer[]) => {
      if (peersList.length > 0) {
        socketClient.requestChat(peersList[0].id);
      }
    });
  }

  function handleStartChat() {
    setCurrentScreen('profile-setup');
  }

  function handleContinueToChat() {
    if (!username.trim()) return;
    
    const avatars = ['🌙', '🦋', '🌊', '🌸', '☀️', '🌴'];
    socketClient.setAvailable({
      username,
      age: parseInt(age) || 25,
      province: province || 'San José',
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    });
    
    socketClient.browsePeers();
  }

  function sendMessage() {
    if (!conversationId || !messageInput.trim()) return;
    socketClient.sendMessage(conversationId, messageInput);
    setMessageInput('');
  }

  // LANDING PAGE
  if (currentScreen === 'landing') {
    return (
      <div style={{ background: '#fafafa', minHeight: '100vh', padding: '26px 93px' }}>
        <View gap={8}>
          {/* Header */}
          <View direction="row" justify="space-between" align="center">
            {/* Logo */}
            <div style={{ width: '250px', height: '135px', position: 'relative' }}>
              <img src={imgVector} alt="La Fuente Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Menu */}
            <View direction="row" gap={1} attributes={{
              style: {
                background: '#fafafa',
                padding: '3px',
                borderRadius: '6px',
                boxShadow: '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)'
              }
            }}>
              <Button variant="ghost" size="medium">Cómo funciona</Button>
              <Button variant="ghost" size="medium">Recursos de emergencia</Button>
              <Button variant="ghost" size="medium">Preguntas frecuentes</Button>
            </View>
          </View>

          {/* Hero Section */}
          <View direction="row" align="center" gap={6}>
            {/* Left: Text and CTA */}
            <View gap={4} attributes={{ style: { maxWidth: '424px' } }}>
              <Text variant="title-5" weight="bold" attributes={{ style: { fontSize: '48px', lineHeight: '52px', color: '#262726' } }}>
                No estás sol@
              </Text>
              
              <Text variant="featured-2" attributes={{ style: { fontSize: '24px', lineHeight: '32px', color: 'black' } }}>
                Este es un espacio seguro y anónimo donde personas que viven con VIH comparten experiencias y se acompañan.
              </Text>

              <Button 
                variant="solid" 
                color="primary"
                size="large"
                onClick={handleStartChat}
                attributes={{
                  style: {
                    background: '#1860fa',
                    borderRadius: '999px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '56px',
                    boxShadow: '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <span style={{ fontSize: '24px' }}>💬</span>
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Hablar con alguien ahora</span>
              </Button>
            </View>

            {/* Right: Illustration */}
            <div style={{ width: '665px', height: '369px' }}>
              <img src={imgOpenDoodlesIllustration} alt="Illustration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </View>

          {/* Trust Cards */}
          <View direction="row" gap={4} justify="center">
            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '266px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>🔒</span>
                  <span style={{ fontSize: '18px' }}> 100% Anónimo</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  No se requieren nombres reales ni información personal.
                </Text>
              </View>
            </Card>

            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '263px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>👥</span>
                  <span style={{ fontSize: '18px' }}> Moderado y Seguro</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  Conversaciones monitoreadas para tu seguridad.
                </Text>
              </View>
            </Card>

            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '266px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>⚕️</span>
                  <span style={{ fontSize: '18px' }}> No es consejo médico</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  Compartimos experiencias, no diagnósticos ni tratamientos.
                </Text>
              </View>
            </Card>
          </View>

          {/* Logos */}
          <View direction="row" gap={2} align="center" justify="center">
            <Text variant="body-1">Avalado por:</Text>
            <img src={imgLogo1} alt="Logo 1" style={{ width: '146px', height: '138px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            <img src={imgLogo2} alt="Logo 2" style={{ width: '190px', height: '95px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </View>
        </View>
      </div>
    );
  }

  // PROFILE SETUP
  if (currentScreen === 'profile-setup') {
    return (
      <div style={{ background: '#fafafa', minHeight: '100vh', padding: '26px 93px' }}>
        <View gap={8}>
          {/* Header (same as landing) */}
          <View direction="row" justify="space-between" align="center">
            <div style={{ width: '250px', height: '135px', position: 'relative' }}>
              <img src={imgVector} alt="La Fuente Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <View direction="row" gap={1} attributes={{
              style: {
                background: '#fafafa',
                padding: '3px',
                borderRadius: '6px',
                boxShadow: '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)'
              }
            }}>
              <Button variant="ghost" size="medium">Cómo funciona</Button>
              <Button variant="ghost" size="medium">Recursos de emergencia</Button>
              <Button variant="ghost" size="medium">Preguntas frecuentes</Button>
            </View>
          </View>

          {/* Form Card */}
          <View align="center">
            <Card padding={6} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '359px'
              }
            }}>
              <View gap={4}>
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setCurrentScreen('landing')}
                  attributes={{ style: { width: 'fit-content' } }}
                >
                  ← Volver
                </Button>

                {/* Title */}
                <View gap={3}>
                  <Text variant="featured-2" attributes={{ style: { fontSize: '24px', lineHeight: '32px' } }}>
                    Solo un poco de contexto
                  </Text>
                  
                  <Text variant="body-3" attributes={{ style: { fontSize: '14px', lineHeight: '20px' } }}>
                    No necesitás decir quién sos.{'\n'}
                    Esto es únicamente para que la conversación se sienta más cercana y respetuosa.
                  </Text>
                </View>

                {/* Form Fields */}
                <View gap={4}>
                  <TextField
                    label="¿Cómo te gustaría que te llamen acá?"
                    placeholder="Ej. Luz, Tico87, Azul"
                    value={username}
                    onChange={(event: any) => setUsername(event.target.value)}
                    helperText="Puede ser cualquier nombre. No tiene que ser real."
                  />

                  <TextField
                    label="Tu edad (opcional)"
                    placeholder="Ej. 25"
                    value={age}
                    onChange={(event: any) => setAge(event.target.value)}
                    helperText="Nos ayuda a conectar personas en momentos de vida similares."
                    inputAttributes={{ type: 'number' }}
                  />

                  <View gap={1}>
                    <Text variant="body-3" weight="medium">Provincia donde estás (opcional)</Text>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        background: 'white'
                      }}
                    >
                      <option value="">Escoja su provincia</option>
                      <option value="San José">San José</option>
                      <option value="Heredia">Heredia</option>
                      <option value="Alajuela">Alajuela</option>
                      <option value="Puntarenas">Puntarenas</option>
                      <option value="Limón">Limón</option>
                      <option value="Guanacaste">Guanacaste</option>
                      <option value="Cartago">Cartago</option>
                    </select>
                    <Text variant="body-3" color="neutral-faded">
                      Solo para contexto general. No compartimos tu ubicación exacta.
                    </Text>
                  </View>
                </View>

                {/* Continue Button */}
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleContinueToChat}
                  disabled={!username.trim()}
                  attributes={{ style: { width: 'fit-content' } }}
                >
                  Continuar
                </Button>
              </View>
            </Card>
          </View>

          {/* Trust Cards (same as landing) */}
          <View direction="row" gap={4} justify="center">
            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '266px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>🔒</span>
                  <span style={{ fontSize: '18px' }}> 100% Anónimo</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  No se requieren nombres reales ni información personal.
                </Text>
              </View>
            </Card>

            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '263px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>👥</span>
                  <span style={{ fontSize: '18px' }}> Moderado y Seguro</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  Conversaciones monitoreadas para tu seguridad.
                </Text>
              </View>
            </Card>

            <Card padding={4} attributes={{
              style: {
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
                width: '266px'
              }
            }}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">
                  <span style={{ fontSize: '14px' }}>⚕️</span>
                  <span style={{ fontSize: '18px' }}> No es consejo médico</span>
                </Text>
                <Text variant="body-2" attributes={{ style: { fontSize: '18px' } }}>
                  Compartimos experiencias, no diagnósticos ni tratamientos.
                </Text>
              </View>
            </Card>
          </View>

          {/* Logos */}
          <View direction="row" gap={2} align="center" justify="center">
            <Text variant="body-1">Avalado por:</Text>
            <img src={imgLogo1} alt="Logo 1" style={{ width: '146px', height: '138px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            <img src={imgLogo2} alt="Logo 2" style={{ width: '190px', height: '95px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </View>
        </View>
      </div>
    );
  }

  // CHAT SCREEN
  if (currentScreen === 'chat') {
    return (
      <main className="phone-container">
        <View padding={4} gap={3}>
          {selectedPeer && (
            <Card padding={3}>
              <View gap={1}>
                <View direction="row" align="center" gap={2}>
                  <Text variant="body-2" weight="bold">{selectedPeer.username}</Text>
                  <Text variant="caption-1" color="neutral-faded">
                    {selectedPeer.age} años, {selectedPeer.province}
                  </Text>
                </View>
                <View direction="row" align="center" gap={1}>
                  <div style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }} />
                  <Text variant="caption-1" color="positive">Conversación en vivo</Text>
                </View>
              </View>
            </Card>
          )}

          <View
            gap={2}
            padding={3}
            attributes={{
              style: {
                height: '500px',
                overflowY: 'auto',
                background: '#fafafa',
                borderRadius: '8px',
              },
            }}
          >
            {messages.map((msg) => {
              const isOwn = msg.userId === identity?.userId;
              return (
                <View
                  key={msg.id}
                  direction="row"
                  justify={isOwn ? 'end' : 'start'}
                  attributes={{ style: { width: '100%' } }}
                >
                  <Card
                    padding={2}
                    attributes={{
                      style: {
                        background: isOwn ? '#1860fa' : '#e5e5e5',
                        maxWidth: '80%',
                      },
                    }}
                  >
                    <Text variant="body-3" attributes={{ style: { color: isOwn ? 'white' : 'black' } }}>
                      {msg.message}
                    </Text>
                  </Card>
                </View>
              );
            })}
          </View>

          <View direction="row" gap={2}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e5e5e5',
                fontSize: '14px',
              }}
            />
            <Button variant="solid" color="primary" onClick={sendMessage}>
              Enviar
            </Button>
          </View>
        </View>
      </main>
    );
  }

  return null;
}
