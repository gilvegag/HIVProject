'use client';

import { View, Card, Button } from 'reshaped';
import { useState, useEffect, useRef } from 'react';
import type { Message, Peer } from '@/lib/socketClient';

interface ChatScreenProps {
  peer: Peer;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onSwitchPeer: () => void;
  onEndConversation: () => void;
}

export function ChatScreen({ 
  peer, 
  messages, 
  onSendMessage, 
  onSwitchPeer, 
  onEndConversation 
}: ChatScreenProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ 
      width: '359px',
      maxWidth: '90vw',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '6px',
      boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fafafa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {peer.avatar}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'black' }}>
              {peer.username}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {peer.age} años • {peer.province}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onSwitchPeer}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            ↔️ Cambiar persona
          </button>
          
          <button
            onClick={onEndConversation}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e57373',
              background: 'white',
              color: '#d32f2f',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffebee';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            ❌ Finalizar
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              Conversación iniciada
            </div>
            <div style={{ fontSize: '14px' }}>
              Di hola para comenzar
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId !== peer.userId; // Si no es el peer, soy yo
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}
              >
                {!isMe && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {peer.avatar}
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: isMe ? '#305dfb' : 'white',
                    color: isMe ? 'white' : 'black',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.message}
                </div>

                {isMe && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#305dfb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    👤
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e0e0e0',
        background: 'white',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '44px',
            maxHeight: '120px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#305dfb';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#ddd';
          }}
        />
        
        <button
          onClick={handleSend}
          disabled={!messageInput.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: messageInput.trim() ? '#305dfb' : '#ccc',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            minHeight: '44px',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (messageInput.trim()) {
              e.currentTarget.style.background = '#2347d9';
            }
          }}
          onMouseLeave={(e) => {
            if (messageInput.trim()) {
              e.currentTarget.style.background = '#305dfb';
            }
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
