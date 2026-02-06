'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button, Card, Badge, Alert } from 'reshaped';
import identityManager from '@/lib/identityManager';
import socketClient, { type Peer, type Message } from '@/lib/socketClient';

type Screen = 'landing' | 'profile-setup' | 'chat';

export default function LaFuenteApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [identity, setIdentity] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // User profile
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [province, setProvince] = useState('San José');
  const [language, setLanguage] = useState<'es' | 'en'>('es'); // Default Spanish

  // Initialize identity and connection
  useEffect(() => {
    async function init() {
      try {
        const id = await identityManager.getOrCreateIdentity();
        if (id) {
          setIdentity(id);
          await socketClient.connect(id.userId);
          setConnected(true);
          setupSocketListeners();
        }
      } catch (err: any) {
        console.error('Initialization error:', err);
      }
    }

    init();

    return () => {
      socketClient.disconnect();
    };
  }, []);

  function setupSocketListeners() {
    socketClient.on('peers_list', (peersList: Peer[]) => {
      setPeers(peersList);
      // Auto-select first peer if available
      if (peersList.length > 0 && !selectedPeer) {
        requestChat(peersList[0]);
      }
    });

    socketClient.on('chat_started', (data: any) => {
      setConversationId(data.conversationId);
      setSelectedPeer(data.peer);
      setMessages([]);
      setError(null);
      setCurrentScreen('chat');
    });

    socketClient.on('message_received', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('moderation_warning', (data: any) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    socketClient.on('peer_unavailable', (data: any) => {
      setError(data.message);
    });
  }

  function handleStartChat() {
    if (!identity) return;
    setCurrentScreen('profile-setup');
  }

  function handleProfileComplete() {
    if (!username || !age) {
      setError('Por favor completa todos los campos');
      return;
    }

    const avatars = ['🌙', '🦋', '🌊', '🌸', '☀️', '🌴'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    socketClient.setAvailable({ 
      username, 
      age: parseInt(age), 
      province, 
      avatar 
    });

    // Browse for peers
    socketClient.browsePeers();
    
    // Show loading state while finding peers
    setCurrentScreen('chat');
  }

  function requestChat(peer: Peer) {
    socketClient.requestChat(peer.id);
  }

  function sendMessage() {
    if (!conversationId || !messageInput.trim()) return;
    socketClient.sendMessage(conversationId, messageInput);
    setMessageInput('');
  }

  const t = language === 'es' ? {
    // Landing
    landing_hero: 'No estás solo/a en esto',
    landing_subtitle: 'Un espacio seguro y anónimo donde personas viviendo con VIH comparten experiencias y se acompañan.',
    landing_cta: 'Hablar con alguien ahora',
    trust_anonymous: '100% Anónimo',
    trust_anonymous_desc: 'No se requieren nombres reales ni información personal.',
    trust_safe: 'Moderado y Seguro',
    trust_safe_desc: 'Conversaciones monitoreadas para tu seguridad.',
    trust_medical: 'No es consejo médico',
    trust_medical_desc: 'Compartimos experiencias, no diagnósticos ni tratamientos.',
    
    // Profile
    profile_title: 'Crear tu perfil anónimo',
    profile_subtitle: 'Elige cómo quieres aparecer a otros pares.',
    profile_nickname: 'Apodo (no uses tu nombre real)',
    profile_age: 'Edad',
    profile_province: 'Provincia',
    profile_continue: 'Continuar al chat',
    
    // Chat
    chat_connecting: 'Conectando con un par...',
    chat_connected: 'Conversación en vivo',
    chat_placeholder: 'Escribe tu mensaje...',
    chat_send: 'Enviar',
    chat_disclaimer: 'Experiencia vivida, no consejo médico',
    chat_disclaimer_text: 'Esta persona comparte su experiencia personal, no recomendaciones de tratamiento.',
  } : {
    // Landing
    landing_hero: "You're not alone in this",
    landing_subtitle: 'A safe and anonymous space where people living with HIV share experiences and support each other.',
    landing_cta: 'Talk to someone now',
    trust_anonymous: '100% Anonymous',
    trust_anonymous_desc: 'No real names or personal information required.',
    trust_safe: 'Moderated and Safe',
    trust_safe_desc: 'Conversations monitored for your safety.',
    trust_medical: 'Not medical advice',
    trust_medical_desc: 'We share experiences, not diagnoses or treatments.',
    
    // Profile
    profile_title: 'Create your anonymous profile',
    profile_subtitle: 'Choose how you want to appear to other peers.',
    profile_nickname: 'Nickname (don\'t use your real name)',
    profile_age: 'Age',
    profile_province: 'Province',
    profile_continue: 'Continue to chat',
    
    // Chat
    chat_connecting: 'Connecting with a peer...',
    chat_connected: 'Live conversation',
    chat_placeholder: 'Type your message...',
    chat_send: 'Send',
    chat_disclaimer: 'Lived experience, not medical advice',
    chat_disclaimer_text: 'This person shares their personal experience, not treatment recommendations.',
  };

  // LANDING SCREEN
  if (currentScreen === 'landing') {
    return (
      <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <View padding={6} gap={8} align="center" attributes={{ style: { maxWidth: '800px', margin: '0 auto' } }}>
          {/* Language Selector */}
          <View direction="row" justify="end" attributes={{ style: { width: '100%' } }}>
            <View direction="row" gap={2}>
              <Button 
                variant={language === 'es' ? 'solid' : 'ghost'} 
                size="small"
                onClick={() => setLanguage('es')}
              >
                ES
              </Button>
              <Button 
                variant={language === 'en' ? 'solid' : 'ghost'}
                size="small"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
            </View>
          </View>

          {/* Hero Section */}
          <View gap={4} align="center" paddingBlock={8}>
            <Text 
              variant="display-3" 
              weight="bold" 
              align="center"
              attributes={{ style: { color: 'white' } }}
            >
              {t.landing_hero}
            </Text>
            
            <Text 
              variant="title-5" 
              align="center"
              attributes={{ style: { color: 'rgba(255,255,255,0.9)', maxWidth: '600px' } }}
            >
              {t.landing_subtitle}
            </Text>

            <View paddingBlock={3}>
              <Button 
                size="large" 
                variant="solid"
                onClick={handleStartChat}
                attributes={{
                  style: {
                    background: 'white',
                    color: '#667eea',
                    padding: '16px 48px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }
                }}
              >
                {t.landing_cta}
              </Button>
            </View>
          </View>

          {/* Trust Elements */}
          <View gap={3} attributes={{ style: { width: '100%', maxWidth: '700px' } }}>
            <Card padding={4}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">🔒 {t.trust_anonymous}</Text>
                <Text variant="body-3" color="neutral-faded">{t.trust_anonymous_desc}</Text>
              </View>
            </Card>

            <Card padding={4}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">👥 {t.trust_safe}</Text>
                <Text variant="body-3" color="neutral-faded">{t.trust_safe_desc}</Text>
              </View>
            </Card>

            <Card padding={4}>
              <View gap={2}>
                <Text variant="body-2" weight="bold">⚕️ {t.trust_medical}</Text>
                <Text variant="body-3" color="neutral-faded">{t.trust_medical_desc}</Text>
              </View>
            </Card>
          </View>
        </View>
      </main>
    );
  }

  // PROFILE SETUP SCREEN
  if (currentScreen === 'profile-setup') {
    return (
      <main className="phone-container">
        <View padding={4} gap={4}>
          <View gap={2}>
            <Text variant="title-4" weight="bold">{t.profile_title}</Text>
            <Text variant="body-2" color="neutral-faded">{t.profile_subtitle}</Text>
          </View>

          {error && (
            <Alert color="critical">
              <Text variant="body-3">{error}</Text>
            </Alert>
          )}

          <View gap={3}>
            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                {t.profile_nickname.toUpperCase()}
              </Text>
              <input
                type="text"
                placeholder="Luna27, Esperanza_CR..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              />
            </View>

            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                {t.profile_age.toUpperCase()}
              </Text>
              <input
                type="number"
                placeholder="28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={18}
                max={99}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              />
            </View>

            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                {t.profile_province.toUpperCase()}
              </Text>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="San José">San José</option>
                <option value="Heredia">Heredia</option>
                <option value="Alajuela">Alajuela</option>
                <option value="Puntarenas">Puntarenas</option>
                <option value="Limón">Limón</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Cartago">Cartago</option>
              </select>
            </View>
          </View>

          <Button
            fullWidth
            size="large"
            variant="solid"
            color="primary"
            onClick={handleProfileComplete}
            disabled={!username || !age}
          >
            {t.profile_continue}
          </Button>
        </View>
      </main>
    );
  }

  // CHAT SCREEN
  if (currentScreen === 'chat') {
    return (
      <main className="phone-container">
        <View padding={4} gap={3}>
          {/* Chat Header */}
          {selectedPeer ? (
            <Card padding={3}>
              <View gap={1}>
                <View direction="row" align="center" gap={2}>
                  <View
                    attributes={{
                      style: {
                        width: '40px',
                        height: '40px',
                        background: '#f0f0f0',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      },
                    }}
                  >
                    {selectedPeer.avatar}
                  </View>
                  <View>
                    <Text variant="body-2" weight="bold">{selectedPeer.username}</Text>
                    <Text variant="caption-1" color="neutral-faded">
                      {selectedPeer.age} {language === 'es' ? 'años' : 'years old'}, {selectedPeer.province}
                    </Text>
                  </View>
                </View>
                <View direction="row" align="center" gap={1}>
                  <View
                    attributes={{
                      style: {
                        width: '8px',
                        height: '8px',
                        background: '#4CAF50',
                        borderRadius: '50%',
                      },
                    }}
                  />
                  <Text variant="caption-1" color="positive">{t.chat_connected}</Text>
                </View>
              </View>
            </Card>
          ) : (
            <Card padding={3}>
              <Text variant="body-2" align="center" color="neutral-faded">
                {t.chat_connecting}
              </Text>
            </Card>
          )}

          {/* Disclaimer */}
          <Alert color="neutral">
            <View gap={1}>
              <Text variant="body-3" weight="medium">{t.chat_disclaimer}</Text>
              <Text variant="caption-1">{t.chat_disclaimer_text}</Text>
            </View>
          </Alert>

          {error && (
            <Alert color="critical">
              <Text variant="body-3">{error}</Text>
            </Alert>
          )}

          {/* Messages */}
          <View
            gap={2}
            padding={3}
            attributes={{
              style: {
                height: '400px',
                overflowY: 'auto',
                background: '#fafafa',
                borderRadius: '8px',
              },
            }}
          >
            {messages.length === 0 ? (
              <View align="center" justify="center" attributes={{ style: { height: '100%' } }}>
                <Text variant="body-3" color="neutral-faded" align="center">
                  {language === 'es' ? 'Inicia la conversación...' : 'Start the conversation...'}
                </Text>
              </View>
            ) : (
              messages.map((msg) => {
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
                          background: isOwn ? '#667eea' : '#e5e5e5',
                          maxWidth: '80%',
                        },
                      }}
                    >
                      <Text
                        variant="body-3"
                        attributes={{ style: { color: isOwn ? 'white' : 'black' } }}
                      >
                        {msg.message}
                      </Text>
                    </Card>
                  </View>
                );
              })
            )}
          </View>

          {/* Message Input */}
          <View direction="row" gap={2}>
            <View.Item grow>
              <input
                type="text"
                placeholder={t.chat_placeholder}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              />
            </View.Item>
            <Button variant="solid" onClick={sendMessage} disabled={!conversationId}>
              {t.chat_send}
            </Button>
          </View>
        </View>
      </main>
    );
  }

  return null;
}
