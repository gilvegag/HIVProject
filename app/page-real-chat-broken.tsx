'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button, Card, Badge, TextField, Alert, Select } from 'reshaped';
import identityManager from '@/lib/identityManager';
import socketClient, { type Peer, type Message } from '@/lib/socketClient';

type Screen = 'identity-setup' | 'profile-setup' | 'browse-peers' | 'chat' | 'landing';

export default function RealChatDemo() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('identity-setup');
  const [identity, setIdentity] = useState<any>(null);
  const [trustInfo, setTrustInfo] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  
  // User profile
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [province, setProvince] = useState('San José');

  // Initialize identity and connection
  useEffect(() => {
    async function init() {
      try {
        // Get or create identity
        const id = await identityManager.getOrCreateIdentity();
        if (!id) {
          setError('Failed to create identity');
          return;
        }
        
        setIdentity(id);

        // Get trust level
        const trust = await identityManager.getTrustLevel();
        setTrustInfo(trust);

        // Connect to socket
        await socketClient.connect(id.userId);
        setConnected(true);

        // Set up event listeners
        setupSocketListeners();

        // Auto-navigate to profile setup after identity is set up
        setTimeout(() => {
          setCurrentScreen('profile-setup');
        }, 2000);

      } catch (err: any) {
        setError(err.message);
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
      console.log('Received peers list:', peersList);
      setPeers(peersList);
    });

    socketClient.on('chat_started', (data: any) => {
      console.log('✅ Chat started:', data);
      console.log('Setting conversation ID:', data.conversationId);
      console.log('Setting peer:', data.peer);
      setConversationId(data.conversationId);
      setSelectedPeer(data.peer);
      setMessages([]);
      setError(null);
      setCurrentScreen('chat');
      console.log('Screen changed to chat');
    });

    socketClient.on('message_received', (message: Message) => {
      console.log('Message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('moderation_warning', (data: any) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    socketClient.on('rate_limited', (data: any) => {
      setError(data.message);
    });

    socketClient.on('peer_unavailable', (data: any) => {
      console.log('❌ Peer unavailable:', data);
      setError(data.message);
    });

    socketClient.on('error', (data: any) => {
      console.log('❌ Socket error:', data);
      setError(data.message || 'Connection error');
    });

    socketClient.on('status_update', (data: any) => {
      if (data.available) {
        setIsAvailable(true);
      }
    });
  }

  function makeAvailable() {
    if (!username || !age) {
      setError('Please complete your profile first');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const avatars = ['🌙', '🦋', '🌊', '🌸', '☀️', '🌴', '🌺', '🦜', '🐠', '🌻'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    socketClient.setAvailable({ 
      username, 
      age: parseInt(age), 
      province, 
      avatar 
    });
    
    setIsAvailable(true);
    setError('✅ You are now available! Other users can connect with you.');
    setTimeout(() => setError(null), 3000);
  }

  function browsePeers() {
    socketClient.browsePeers();
  }

  function requestChat(peer: Peer) {
    console.log('🔵 Requesting chat with peer:', peer);
    console.log('🔵 Peer ID:', peer.id);
    console.log('🔵 Socket connected:', socketClient.isConnected());
    setError('Connecting to ' + peer.username + '...');
    socketClient.requestChat(peer.id);
    
    // Add timeout to check if chat started
    setTimeout(() => {
      if (currentScreen !== 'chat') {
        console.log('⚠️ Chat did not start after 5 seconds');
        setError('Connection timeout. Please try again.');
      }
    }, 5000);
  }

  function sendMessage() {
    if (!conversationId || !messageInput.trim()) return;
    
    console.log('Sending message:', messageInput);
    socketClient.sendMessage(conversationId, messageInput);
    setMessageInput('');
  }

  // IDENTITY SETUP SCREEN
  if (currentScreen === 'identity-setup') {
    return (
      <main className="phone-container">
        <View padding={4} gap={4}>
          <View gap={3}>
            <Text variant="title-3" weight="bold">
              ✅ Your Anonymous Identity
            </Text>
            
            {identity && (
              <>
                <Card padding={4} attributes={{ style: { border: '2px solid #4CAF50' } }}>
                  <View gap={3}>
                    <View gap={1}>
                      <Text variant="caption-1" weight="medium" color="neutral-faded">
                        YOUR USER ID:
                      </Text>
                      <Text variant="body-3" attributes={{ style: { fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' } }}>
                        {identity.userId}
                      </Text>
                    </View>

                    <View gap={1}>
                      <Text variant="caption-1" weight="medium" color="neutral-faded">
                        🔑 RECOVERY PHRASE (SAVE THIS!):
                      </Text>
                      <Text variant="body-2" weight="bold" attributes={{ style: { fontFamily: 'monospace' } }}>
                        {identity.recoveryPhrase}
                      </Text>
                      <Text variant="caption-1" color="neutral-faded">
                        Save this phrase! You'll need it to recover your identity on other devices.
                      </Text>
                    </View>
                  </View>
                </Card>

                {trustInfo && (
                  <Card padding={3}>
                    <View gap={2}>
                      <Text variant="body-3" weight="medium">
                        📊 Your Trust Level: {trustInfo.trustLevel}/10
                      </Text>
                      <Text variant="caption-1">
                        Conversations: {trustInfo.conversationCount} | 
                        Account age: {trustInfo.accountAge} days
                      </Text>
                    </View>
                  </Card>
                )}

                {connected && (
                  <Alert color="positive">
                    <Text variant="body-3">✅ Connected to chat server</Text>
                  </Alert>
                )}
              </>
            )}

            {error && (
              <Alert color="critical">
                <Text variant="body-3">{error}</Text>
              </Alert>
            )}

            <Text variant="body-2" color="neutral-faded">
              Redirecting to profile setup in 2 seconds...
            </Text>
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
            <Text variant="title-4" weight="bold">
              Create Your Anonymous Profile
            </Text>
            <Text variant="body-2" color="neutral-faded">
              Choose how you want to appear to other peers. This info is visible to others.
            </Text>
          </View>

          <Alert color="neutral">
            <Text variant="body-3" weight="medium">
              🔒 Anonymous & Safe
            </Text>
            <Text variant="caption-1">
              Use a nickname (not your real name). Your identity remains anonymous.
            </Text>
          </Alert>

          <View gap={3}>
            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                NICKNAME (VISIBLE TO OTHERS):
              </Text>
              <input
                type="text"
                placeholder="e.g., Luna27, Esperanza_CR"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <Text variant="caption-1" color="neutral-faded">
                Choose a nickname that doesn't reveal your identity
              </Text>
            </View>

            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                YOUR AGE:
              </Text>
              <input
                type="number"
                placeholder="e.g., 28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={18}
                max={99}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </View>

            <View gap={2}>
              <Text variant="caption-1" weight="medium" color="neutral-faded">
                PROVINCE IN COSTA RICA:
              </Text>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px',
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

          {error && (
            <Alert color="critical">
              <Text variant="body-3">{error}</Text>
            </Alert>
          )}

          <Card padding={3}>
            <View gap={2}>
              <Text variant="body-3" weight="medium">
                Example: How you'll appear
              </Text>
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
                  🌙
                </View>
                <View gap={0}>
                  <Text variant="body-3" weight="bold">
                    {username || 'YourNickname'}
                  </Text>
                  <Text variant="caption-1" color="neutral-faded">
                    {age || '28'} years old • {province}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <Button
            fullWidth
            size="large"
            variant="solid"
            color="primary"
            onClick={() => {
              if (!username || !age) {
                setError('Please fill in all fields');
                setTimeout(() => setError(null), 3000);
                return;
              }
              if (parseInt(age) < 18 || parseInt(age) > 99) {
                setError('Age must be between 18 and 99');
                setTimeout(() => setError(null), 3000);
                return;
              }
              setCurrentScreen('browse-peers');
            }}
            disabled={!username || !age}
          >
            Continue to Peer List
          </Button>

          <Text variant="caption-1" color="neutral-faded" align="center">
            You can change this information later
          </Text>
        </View>
      </main>
    );
  }

  // BROWSE PEERS SCREEN
  if (currentScreen === 'browse-peers') {
    return (
      <main className="phone-container">
        <View padding={4} gap={4}>
          <View gap={2}>
            <Text variant="title-4" weight="bold">
              Real-Time Peer Connections
            </Text>
            <Text variant="body-2" color="neutral-faded">
              This is the REAL system working with the backend!
            </Text>
          </View>

          {identity && (
            <Card padding={3} attributes={{ style: { border: '1px solid #e5e5e5' } }}>
              <View gap={2}>
                <Text variant="caption-1" weight="medium">YOUR IDENTITY:</Text>
                <Text variant="body-3" attributes={{ style: { fontSize: '10px', wordBreak: 'break-all' } }}>
                  ID: {identity.userId.substring(0, 20)}...
                </Text>
                {trustInfo && (
                  <Badge color="positive" size="small">
                    Trust Level: {trustInfo.trustLevel}/10
                  </Badge>
                )}
              </View>
            </Card>
          )}

          <View direction="row" gap={2}>
            <Button 
              fullWidth 
              variant="solid" 
              color="primary"
              onClick={browsePeers}
            >
              🔄 Refresh Peers
            </Button>
            <Button 
              fullWidth 
              variant={isAvailable ? 'outlined' : 'solid'}
              onClick={makeAvailable}
            >
              {isAvailable ? '✓ Available' : 'Set Available'}
            </Button>
          </View>

          {error && (
            <Alert color={error.includes('✅') ? 'positive' : 'critical'}>
              <Text variant="body-3">{error}</Text>
            </Alert>
          )}

          <View gap={2}>
            <View direction="row" justify="space-between" align="center">
              <Text variant="body-3" weight="medium">
                Connected Peers: {peers.length}
              </Text>
              {isAvailable && (
                <Badge color="positive" size="small">
                  You're visible
                </Badge>
              )}
            </View>

            {peers.length === 0 ? (
              <Card padding={4}>
                <View gap={3} align="center">
                  <Text variant="body-3" color="neutral-faded" align="center">
                    No peers online right now.
                  </Text>
                  <Text variant="caption-1" color="neutral-faded" align="center">
                    {isAvailable 
                      ? "You're available! Waiting for others to join..."
                      : "Click 'Set Available' to let others connect with you"}
                  </Text>
                  <View
                    attributes={{
                      style: {
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        width: '100%',
                      },
                    }}
                  >
                    <Text variant="caption-1" weight="medium">
                      🧪 Testing tip:
                    </Text>
                    <Text variant="caption-1">
                      Open this in another browser window (or incognito mode) and click "Set Available" there too. You'll see each other!
                    </Text>
                  </View>
                </View>
              </Card>
            ) : (
              peers.map((peer) => (
                <Card
                  key={peer.id}
                  padding={3}
                  attributes={{
                    onClick: () => requestChat(peer),
                    style: { 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      border: '2px solid transparent',
                    },
                    onMouseEnter: (e: any) => {
                      e.currentTarget.style.border = '2px solid #1a1a1a';
                    },
                    onMouseLeave: (e: any) => {
                      e.currentTarget.style.border = '2px solid transparent';
                    },
                  }}
                >
                  <View direction="row" align="center" gap={3}>
                    <View
                      attributes={{
                        style: {
                          width: '50px',
                          height: '50px',
                          background: '#f0f0f0',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                        },
                      }}
                    >
                      {peer.avatar}
                    </View>
                    <View.Item grow>
                      <View gap={1}>
                        <Text variant="body-2" weight="bold">
                          {peer.username}
                        </Text>
                        <Text variant="caption-1" color="neutral-faded">
                          {peer.age} years old • {peer.province}
                        </Text>
                        <Badge color="positive" size="small">
                          💬 Click to chat
                        </Badge>
                      </View>
                    </View.Item>
                  </View>
                </Card>
              ))
            )}
          </View>

          {!isAvailable && (
            <Alert color="neutral">
              <View gap={2}>
                <Text variant="body-3" weight="medium">
                  👋 Want to be available for others?
                </Text>
                <Text variant="caption-1">
                  Click "Set Available" above to let other users see you and start conversations with you.
                </Text>
              </View>
            </Alert>
          )}

          <Card padding={3}>
            <View gap={2}>
              <Text variant="body-3" weight="medium">🧪 Testing Instructions:</Text>
              <Text variant="caption-1">
                1. Fill in your profile (nickname, age, province)<br />
                2. Click "Set Available" to make yourself visible<br />
                3. Open another browser window (incognito mode)<br />
                4. In window 2, also set available with different info<br />
                5. Click "Refresh Peers" to see each other<br />
                6. Click on a peer card to start chatting!
              </Text>
            </View>
          </Card>
        </View>
      </main>
    );
  }

  // CHAT SCREEN
  if (currentScreen === 'chat' && selectedPeer && conversationId) {
    return (
      <main className="phone-container">
        <View padding={4} gap={3}>
          <View direction="row" gap={2} align="center">
            <Button
              variant="ghost"
              onClick={() => setCurrentScreen('browse-peers')}
            >
              ← Back
            </Button>
          </View>

          <Card padding={3}>
            <View gap={1}>
              <Text variant="body-2" weight="bold">
                Chatting with: {selectedPeer.username}
              </Text>
              <Text variant="caption-1" color="neutral-faded">
                {selectedPeer.age}, {selectedPeer.province}
              </Text>
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
                <Text variant="caption-1" color="positive">
                  Live conversation
                </Text>
              </View>
            </View>
          </Card>

          {error && (
            <Alert color="critical">
              <Text variant="body-3">{error}</Text>
            </Alert>
          )}

          <View
            gap={2}
            padding={3}
            attributes={{
              style: {
                height: '400px',
                overflowY: 'auto',
                background: '#fafafa',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            {messages.length === 0 ? (
              <View align="center" justify="center" attributes={{ style: { height: '100%' } }}>
                <View gap={2} align="center">
                  <Text variant="body-2" weight="bold">
                    💬 Chat Started!
                  </Text>
                  <Text variant="body-3" color="neutral-faded" align="center">
                    Send a message to start the conversation
                  </Text>
                </View>
              </View>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.userId === identity?.userId;
                return (
                  <View
                    key={msg.id}
                    direction="row"
                    justify={isOwn ? 'end' : 'start'}
                    attributes={{ style: { width: '100%', marginBottom: '8px' } }}
                  >
                    <Card
                      padding={2}
                      attributes={{
                        style: {
                          background: isOwn ? '#1a1a1a' : '#e5e5e5',
                          color: isOwn ? 'white' : 'black',
                          maxWidth: '80%',
                        },
                      }}
                    >
                      <View gap={1}>
                        <Text
                          variant="body-3"
                          attributes={{ style: { color: isOwn ? 'white' : 'black' } }}
                        >
                          {msg.message}
                        </Text>
                        <Text 
                          variant="caption-1" 
                          attributes={{ 
                            style: { 
                              color: isOwn ? '#ccc' : '#666',
                              fontSize: '10px'
                            } 
                          }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Text>
                        {msg.warning && (
                          <Alert color="critical">
                            <Text variant="caption-1">
                              ⚠️ {msg.warning}
                            </Text>
                          </Alert>
                        )}
                      </View>
                    </Card>
                  </View>
                );
              })
            )}
          </View>

          <View direction="row" gap={2}>
            <View.Item grow>
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </View.Item>
            <Button variant="solid" onClick={sendMessage}>
              Send
            </Button>
          </View>

          <View direction="row" justify="space-between">
            <Button
              variant="ghost"
              size="small"
              color="critical"
              onClick={() => {
                socketClient.reportPeer(selectedPeer.id, 'misconduct');
                setError('Report submitted. Thank you for keeping this space safe.');
              }}
            >
              🚩 Report
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                if (conversationId) {
                  socketClient.endConversation(conversationId);
                }
                setCurrentScreen('browse-peers');
              }}
            >
              ❌ End Chat
            </Button>
          </View>
        </View>
      </main>
    );
  }

  return null;
}
