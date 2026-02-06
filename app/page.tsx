'use client';

import { useState, useEffect } from 'react';
import { View, Text, Card, Button } from 'reshaped';
import { LaFuenteLayout } from '@/components/LaFuenteLayout';
import { HeroContent } from '@/components/HeroContent';
import { IdentifyForm } from '@/components/IdentifyForm';
import { TermsConditions } from '@/components/TermsConditions';
import { PeerBrowser } from '@/components/PeerBrowser';
import { ChatScreen } from '@/components/ChatScreen';
import identityManager from '@/lib/identityManager';
import socketClient, { type Peer, type Message } from '@/lib/socketClient';

type Screen = 'landing-hero' | 'landing-form' | 'terms' | 'peer-browser' | 'chat';

export default function LaFuenteApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing-hero');
  const [identity, setIdentity] = useState<any>(null);
  
  // Profile data
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [province, setProvince] = useState('');
  
  // Chat data - con peer ficticio para testing
  const [availablePeers, setAvailablePeers] = useState<Peer[]>([
    {
      userId: 'demo-user-123',
      username: 'Luna27',
      age: 28,
      province: 'San José',
      avatar: '🌙',
      socketId: 'demo-socket'
    }
  ]);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Initialize
  useEffect(() => {
    async function init() {
      const id = await identityManager.getOrCreateIdentity();
      if (id) {
        setIdentity(id);
        await socketClient.connect(id.userId);
        setupSocketListeners();
      }
    }
    init();
    return () => socketClient.disconnect();
  }, []);

  function setupSocketListeners() {
    socketClient.on('chat_started', (data: any) => {
      console.log('💬 Chat started:', data);
      setConversationId(data.conversationId);
      setSelectedPeer(data.peer);
      setMessages([]);
      setCurrentScreen('chat');
    });

    socketClient.on('message_received', (message: Message) => {
      console.log('📩 Message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('peers_list', (peersList: Peer[]) => {
      console.log('👥 Peers list received:', peersList);
      setAvailablePeers(peersList);
    });

    socketClient.on('peer_unavailable', () => {
      alert('Esta persona ya no está disponible. Por favor, elige otra.');
      setCurrentScreen('peer-browser');
    });
  }

  function handleStartChat() {
    // Swap content: Hero → Form
    setCurrentScreen('landing-form');
  }

  function handleBackToHero() {
    // Swap content: Form → Hero
    setCurrentScreen('landing-hero');
  }

  function handleBackToForm() {
    // Go back to form
    setCurrentScreen('landing-form');
  }

  function handleContinueToTerms() {
    if (!username.trim()) return;
    // Go to terms screen
    setCurrentScreen('terms');
  }

  function handleAcceptTerms() {
    // After accepting terms, set user as available and browse peers
    const avatars = ['🌙', '🦋', '🌊', '🌸', '☀️', '🌴', '🌺', '🦜', '🐠', '🌻'];
    socketClient.setAvailable({
      username,
      age: parseInt(age) || 25,
      province: province || 'San José',
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    });
    
    // Browse peers
    socketClient.browsePeers();
    setCurrentScreen('peer-browser');
  }

  function handleSelectPeer(peer: Peer) {
    console.log('🎯 Selected peer:', peer);
    
    // Si es el peer de demo, simular el inicio de chat
    if (peer.userId === 'demo-user-123') {
      setSelectedPeer(peer);
      setConversationId('demo-conversation-123');
      setMessages([]);
      setCurrentScreen('chat');
      
      // Mensaje de bienvenida simulado después de 1 segundo
      setTimeout(() => {
        setMessages([{
          id: 'demo-msg-1',
          conversationId: 'demo-conversation-123',
          senderId: peer.userId,
          userId: peer.userId,
          message: 'Hola! 👋 Gracias por conectar. ¿Cómo estás hoy?',
          timestamp: Date.now()
        }]);
      }, 1000);
    } else {
      // Peer real - usar socket
      socketClient.requestChat(peer.userId);
    }
  }

  function handleBackToPeerBrowser() {
    socketClient.browsePeers();
    setCurrentScreen('peer-browser');
  }

  function handleSendMessage(message: string) {
    if (!conversationId || !message.trim()) return;
    
    // Add my message to local state
    const myMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: identity?.userId || 'me',
      userId: identity?.userId || 'me',
      message,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, myMessage]);
    
    // Si es conversación demo, simular respuesta
    if (conversationId === 'demo-conversation-123') {
      // Respuestas automáticas simuladas
      const demoResponses = [
        'Gracias por compartir eso conmigo. Te entiendo.',
        'Eso suena difícil. ¿Cómo te has sentido con eso?',
        'Estoy aquí para escucharte. Tómate tu tiempo.',
        'He pasado por algo similar. No estás sol@.',
        'Es completamente válido sentirse así. Gracias por confiar en mí.'
      ];
      
      setTimeout(() => {
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        setMessages((prev) => [...prev, {
          id: `demo-response-${Date.now()}`,
          conversationId: 'demo-conversation-123',
          senderId: 'demo-user-123',
          userId: 'demo-user-123',
          message: randomResponse,
          timestamp: Date.now()
        }]);
      }, 1500 + Math.random() * 1000); // Respuesta después de 1.5-2.5 segundos
    } else {
      // Conversación real - usar socket
      socketClient.sendMessage(conversationId, message);
    }
  }

  function handleEndConversation() {
    setSelectedPeer(null);
    setConversationId(null);
    setMessages([]);
    setCurrentScreen('landing-hero');
  }

  // LANDING PAGE WITH SWAPPABLE CONTENT
  if (currentScreen === 'landing-hero' || currentScreen === 'landing-form' || currentScreen === 'terms' || currentScreen === 'peer-browser') {
    return (
      <LaFuenteLayout>
        {/* SWAPPABLE CONTENT AREA */}
        {currentScreen === 'landing-hero' && (
          <HeroContent onStartChat={handleStartChat} />
        )}
        
        {currentScreen === 'landing-form' && (
          <IdentifyForm
            username={username}
            age={age}
            province={province}
            onUsernameChange={setUsername}
            onAgeChange={setAge}
            onProvinceChange={setProvince}
            onBack={handleBackToHero}
            onContinue={handleContinueToTerms}
          />
        )}

        {currentScreen === 'terms' && (
          <TermsConditions
            onAccept={handleAcceptTerms}
            onBack={handleBackToForm}
          />
        )}

        {currentScreen === 'peer-browser' && (
          <PeerBrowser
            peers={availablePeers}
            onSelectPeer={handleSelectPeer}
            onBack={handleBackToForm}
          />
        )}
      </LaFuenteLayout>
    );
  }

  // CHAT SCREEN - dentro del layout pero sin footer
  if (currentScreen === 'chat' && selectedPeer) {
    return (
      <LaFuenteLayout showFooter={false}>
        <ChatScreen
          peer={selectedPeer}
          messages={messages}
          onSendMessage={handleSendMessage}
          onSwitchPeer={handleBackToPeerBrowser}
          onEndConversation={handleEndConversation}
        />
      </LaFuenteLayout>
    );
  }

  return null;
}
