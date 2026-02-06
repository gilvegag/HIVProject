'use client';

import { useState } from 'react';
import { View, Text, Button, Card, Select, Badge, TextField, Checkbox, Alert } from 'reshaped';

type Screen =
  | 'landing'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'onboarding-4'
  | 'urgent-support'
  | 'browse-peers'
  | 'chat'
  | 'faq'
  | 'no-peer'
  | 'offline-message'
  | 'offline-confirmation'
  | 'check-message'
  | 'offline-response'
  | 'crisis';

interface Peer {
  id: number;
  username: string;
  age: number;
  province: string;
  avatar: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const selectPeer = (peer: Peer) => {
    setSelectedPeer(peer);
  };

  return (
    <main className="phone-container">
      {currentScreen === 'landing' && <LandingScreen navigate={navigate} />}
      {currentScreen === 'onboarding-1' && <Onboarding1 navigate={navigate} />}
      {currentScreen === 'onboarding-2' && <Onboarding2 navigate={navigate} />}
      {currentScreen === 'onboarding-3' && <Onboarding3 navigate={navigate} />}
      {currentScreen === 'onboarding-4' && <Onboarding4 navigate={navigate} />}
      {currentScreen === 'urgent-support' && <UrgentSupport navigate={navigate} />}
      {currentScreen === 'browse-peers' && (
        <BrowsePeers navigate={navigate} selectPeer={selectPeer} />
      )}
      {currentScreen === 'chat' && <ChatScreen navigate={navigate} peer={selectedPeer} />}
      {currentScreen === 'faq' && <FAQScreen navigate={navigate} />}
      {currentScreen === 'no-peer' && <NoPeerScreen navigate={navigate} />}
      {currentScreen === 'offline-message' && <OfflineMessage navigate={navigate} />}
      {currentScreen === 'offline-confirmation' && (
        <OfflineConfirmation navigate={navigate} />
      )}
      {currentScreen === 'check-message' && <CheckMessage navigate={navigate} />}
      {currentScreen === 'offline-response' && <OfflineResponse navigate={navigate} />}
      {currentScreen === 'crisis' && <CrisisResources navigate={navigate} />}
    </main>
  );
}

// SCREEN COMPONENTS

function LandingScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={5}>
      <View direction="row" justify="end" paddingBlock={3} attributes={{ style: { borderBottom: '1px solid #e5e5e5' } }}>
        <Select defaultValue="en" size="small" attributes={{ style: { width: '80px' } }}>
          <Select.Option value="en">EN</Select.Option>
          <Select.Option value="es">ES</Select.Option>
        </Select>
      </View>

      <View gap={4} paddingBlock={8}>
        <View gap={3}>
          <Text variant="title-3" weight="bold">
            You're not alone in this
          </Text>
          <Text variant="body-2" color="neutral-faded">
            A safe and anonymous space where people living with HIV share experiences and
            support each other.
          </Text>
        </View>

        <View gap={2}>
          <Button
            fullWidth
            size="large"
            variant="solid"
            color="primary"
            onClick={() => navigate('urgent-support')}
          >
            Talk to someone now
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="neutral"
            onClick={() => navigate('onboarding-1')}
          >
            What is this platform?
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="neutral"
            onClick={() => navigate('check-message')}
          >
            Check offline message
          </Button>
        </View>
      </View>

      <Card padding={4}>
        <View gap={3}>
          <TrustItem icon="🔒" title="100% Anonymous" text="No real names or personal information required." />
          <TrustItem icon="👥" title="Moderated and Safe" text="Conversations monitored for your safety." />
          <TrustItem icon="⚕️" title="Not medical advice" text="We share experiences, not diagnoses or treatments." />
        </View>
      </Card>
    </View>
  );
}

function TrustItem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View gap={1}>
      <Text variant="body-3" weight="medium">
        {icon} {title}
      </Text>
      <Text variant="caption-1" color="neutral-faded">
        {text}
      </Text>
    </View>
  );
}

function UrgentSupport({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2} align="center">
        <Button
          variant="ghost"
          color="neutral"
          onClick={() => navigate('landing')}
        >
          🏠
        </Button>
      </View>

      <View gap={3}>
        <View gap={2}>
          <Text variant="title-4" weight="bold">
            Immediate Support
          </Text>
          <Text variant="body-2" color="neutral-faded">
            Browse available peer volunteers and choose who you'd like to talk to.
          </Text>
        </View>

        <Button
          fullWidth
          size="large"
          variant="solid"
          color="primary"
          onClick={() => navigate('browse-peers')}
        >
          Browse available peers
        </Button>
      </View>

      <Card padding={3}>
        <View gap={2}>
          <Text variant="featured-3" weight="medium">
            What will happen?
          </Text>
          <View gap={1}>
            <Text variant="body-3">1. You'll see a list of available peer volunteers</Text>
            <Text variant="body-3">2. Choose someone based on their profile info</Text>
            <Text variant="body-3">3. Start a 1:1 anonymous conversation</Text>
            <Text variant="body-3">4. You can end the conversation at any time</Text>
          </View>
        </View>
      </Card>

      <Alert color="neutral">
        <View gap={1}>
          <Text variant="body-3" weight="medium">
            Remember:
          </Text>
          <Text variant="caption-1">
            Peers share personal experiences, not medical recommendations. For professional care,
            contact CCSS or your doctor.
          </Text>
        </View>
      </Alert>

      <Button fullWidth variant="outlined" onClick={() => navigate('faq')}>
        View general information
      </Button>

      <View align="center" paddingBlock={2}>
        <Button variant="ghost" size="small" onClick={() => navigate('crisis')}>
          Crisis resources & emergency help
        </Button>
      </View>
    </View>
  );
}

function BrowsePeers({
  navigate,
  selectPeer,
}: {
  navigate: (screen: Screen) => void;
  selectPeer: (peer: Peer) => void;
}) {
  const peers: Peer[] = [
    { id: 1, username: 'Luna27', age: 27, province: 'San José', avatar: '🌙' },
    { id: 2, username: 'Esperanza_CR', age: 34, province: 'Heredia', avatar: '🦋' },
    { id: 3, username: 'Carlos_Tico', age: 41, province: 'Puntarenas', avatar: '🌊' },
    { id: 4, username: 'Mariposa88', age: 29, province: 'Alajuela', avatar: '🌸' },
    { id: 5, username: 'SolCaribe', age: 38, province: 'Limón', avatar: '☀️' },
    { id: 6, username: 'Pacifico_Azul', age: 45, province: 'Guanacaste', avatar: '🌴' },
  ];

  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2} align="center">
        <Button
          variant="ghost"
          onClick={() => navigate('landing')}
        >
          🏠
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('urgent-support')}
        >
          ← Back
        </Button>
      </View>

      <View gap={2}>
        <Text variant="title-4" weight="bold">
          Available Peers
        </Text>
        <Text variant="body-2" color="neutral-faded">
          Choose someone to connect with based on their profile.
        </Text>
      </View>

      <Card padding={3}>
        <View gap={2}>
          <Text variant="caption-1" weight="medium" color="neutral-faded">
            FILTER BY:
          </Text>
          <View direction="row" gap={2}>
            <View.Item grow>
              <Select defaultValue="all-provinces" fullWidth size="small">
                <Select.Option value="all-provinces">All provinces</Select.Option>
                <Select.Option value="san-jose">San José</Select.Option>
                <Select.Option value="heredia">Heredia</Select.Option>
                <Select.Option value="alajuela">Alajuela</Select.Option>
                <Select.Option value="puntarenas">Puntarenas</Select.Option>
                <Select.Option value="limon">Limón</Select.Option>
                <Select.Option value="guanacaste">Guanacaste</Select.Option>
              </Select>
            </View.Item>
            <View.Item grow>
              <Select defaultValue="all-ages" fullWidth size="small">
                <Select.Option value="all-ages">All ages</Select.Option>
                <Select.Option value="18-25">18-25</Select.Option>
                <Select.Option value="26-35">26-35</Select.Option>
                <Select.Option value="36-45">36-45</Select.Option>
                <Select.Option value="46+">46+</Select.Option>
              </Select>
            </View.Item>
          </View>
        </View>
      </Card>

      <View gap={2}>
        {peers.map((peer) => (
          <Card
            key={peer.id}
            padding={3}
            attributes={{
              onClick: () => {
                selectPeer(peer);
                navigate('chat');
              },
              style: { cursor: 'pointer', transition: 'all 0.2s' },
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
                    Available now
                  </Badge>
                </View>
              </View.Item>
            </View>
          </Card>
        ))}
      </View>

      <Alert color="neutral">
        <View gap={1}>
          <Text variant="body-3" weight="medium">
            No one you'd like to talk to?
          </Text>
          <Text variant="caption-1">
            You can leave an offline message and a peer will respond later.
          </Text>
        </View>
      </Alert>

      <Button fullWidth variant="outlined" onClick={() => navigate('offline-message')}>
        Leave offline message
      </Button>
    </View>
  );
}

function ChatScreen({
  navigate,
  peer,
}: {
  navigate: (screen: Screen) => void;
  peer: Peer | null;
}) {
  const displayPeer = peer || { username: 'Luna27', age: 27, province: 'San José' };

  return (
    <View padding={4} gap={3}>
      <View direction="row" gap={2} align="center">
        <Button
          variant="ghost"
          onClick={() => navigate('landing')}
        >
          🏠
        </Button>
      </View>

      <Card padding={3}>
        <View gap={1}>
          <Text variant="body-2" weight="bold">
            {displayPeer.username} • {displayPeer.age}, {displayPeer.province}
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
              Anonymous 1:1 conversation
            </Text>
          </View>
        </View>
      </Card>

      <Alert color="neutral">
        <View gap={1}>
          <Text variant="body-3" weight="medium">
            Lived experience, not medical advice:
          </Text>
          <Text variant="caption-1">
            This person shares their personal experience, not treatment recommendations.
          </Text>
        </View>
      </Alert>

      <View
        gap={2}
        padding={3}
        attributes={{
          style: {
            height: '350px',
            overflowY: 'auto',
            background: '#fafafa',
            borderRadius: '8px',
          },
        }}
      >
        <Card padding={2} attributes={{ style: { background: '#e5e5e5', maxWidth: '80%' } }}>
          <Text variant="body-3">
            Hi! Thanks for reaching out. I'm here to listen without judgment. How are you feeling
            today?
          </Text>
        </Card>
        <View direction="row" justify="end" attributes={{ style: { width: '100%' } }}>
          <Card
            padding={2}
            attributes={{
              style: { background: '#1a1a1a', color: 'white', maxWidth: '80%' },
            }}
          >
            <Text variant="body-3" attributes={{ style: { color: 'white' } }}>
              I'm scared and overwhelmed. Just got diagnosed recently.
            </Text>
          </Card>
        </View>
        <Card padding={2} attributes={{ style: { background: '#e5e5e5', maxWidth: '80%' } }}>
          <Text variant="body-3">
            I completely understand. When I received my diagnosis, I felt the same way - scared, confused, like my world was ending. Those feelings are valid.
          </Text>
        </Card>
        <View direction="row" justify="end" attributes={{ style: { width: '100%' } }}>
          <Card
            padding={2}
            attributes={{
              style: { background: '#1a1a1a', color: 'white', maxWidth: '80%' },
            }}
          >
            <Text variant="body-3" attributes={{ style: { color: 'white' } }}>
              Does it get better?
            </Text>
          </Card>
        </View>
        <Card padding={2} attributes={{ style: { background: '#e5e5e5', maxWidth: '80%' } }}>
          <Text variant="body-3">
            It does. I promise you, it does. It takes time, but with support and treatment, life becomes manageable again. You're already taking an important step by reaching out.
          </Text>
        </Card>
      </View>

      <View direction="row" gap={2}>
        <View.Item grow>
          <TextField placeholder="Type your message..." fullWidth />
        </View.Item>
        <Button variant="solid">Send</Button>
      </View>

      <View direction="row" justify="space-between" paddingBlock={2} attributes={{ style: { fontSize: '14px' } }}>
        <Button variant="ghost" size="small" color="critical">
          🚩 Report
        </Button>
        <Button variant="ghost" size="small" onClick={() => navigate('browse-peers')}>
          ← Switch peer
        </Button>
        <Button variant="ghost" size="small" onClick={() => navigate('landing')}>
          ❌ End
        </Button>
      </View>
    </View>
  );
}

function Onboarding1({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View gap={1} align="center" paddingBlock={2}>
        <View direction="row" gap={2}>
          {[1, 2, 3, 4].map((step, i) => (
            <View
              key={step}
              attributes={{
                style: {
                  width: '60px',
                  height: '4px',
                  background: i === 0 ? '#1a1a1a' : '#ddd',
                  borderRadius: '2px',
                },
              }}
            />
          ))}
        </View>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Select your language</Text>
        <Text variant="body-2" color="neutral-faded">
          Choose the language you're most comfortable with.
        </Text>

        <View gap={2}>
          <Card padding={3} attributes={{ style: { cursor: 'pointer', border: '2px solid #1a1a1a' } }}>
            <Text variant="body-2" weight="medium">English</Text>
          </Card>
          <Card padding={3} attributes={{ style: { cursor: 'pointer' } }}>
            <Text variant="body-2" weight="medium">Español</Text>
          </Card>
        </View>

        <Button fullWidth variant="solid" onClick={() => navigate('onboarding-2')}>Continue</Button>
      </View>
    </View>
  );
}

function Onboarding2({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View gap={1} align="center" paddingBlock={2}>
        <View direction="row" gap={2}>
          {[1, 2, 3, 4].map((step, i) => (
            <View
              key={step}
              attributes={{
                style: {
                  width: '60px',
                  height: '4px',
                  background: i < 2 ? '#1a1a1a' : '#ddd',
                  borderRadius: '2px',
                },
              }}
            />
          ))}
        </View>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">What is this platform?</Text>
        
        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-3" weight="medium">✓ What we ARE:</Text>
            <Text variant="caption-1">
              • A space for emotional support<br/>
              • People living with HIV sharing experiences<br/>
              • Professionally validated information
            </Text>
          </View>
        </Card>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-3" weight="medium">✗ What we ARE NOT:</Text>
            <Text variant="caption-1">
              • We don't provide diagnoses or medical prescriptions<br/>
              • We are not a public social network<br/>
              • We don't share profiles or identities
            </Text>
          </View>
        </Card>

        <Button fullWidth variant="solid" onClick={() => navigate('onboarding-3')}>Understood, continue</Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('onboarding-1')}>Back</Button>
      </View>
    </View>
  );
}

function Onboarding3({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View gap={1} align="center" paddingBlock={2}>
        <View direction="row" gap={2}>
          {[1, 2, 3, 4].map((step, i) => (
            <View
              key={step}
              attributes={{
                style: {
                  width: '60px',
                  height: '4px',
                  background: i < 3 ? '#1a1a1a' : '#ddd',
                  borderRadius: '2px',
                },
              }}
            />
          ))}
        </View>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Help us understand your situation</Text>
        <Text variant="body-2" color="neutral-faded">
          This is optional, but helps us connect you better.
        </Text>

        <View gap={2}>
          <Text variant="caption-1" weight="medium" color="neutral-faded">YOUR CURRENT SITUATION:</Text>
          <Card padding={3} attributes={{ style: { cursor: 'pointer' } }}>
            <Text variant="body-3">Recent diagnosis (less than 6 months)</Text>
          </Card>
          <Card padding={3} attributes={{ style: { cursor: 'pointer' } }}>
            <Text variant="body-3">Living with HIV</Text>
          </Card>
          <Card padding={3} attributes={{ style: { cursor: 'pointer' } }}>
            <Text variant="body-3">Prefer not to specify</Text>
          </Card>
        </View>

        <Button fullWidth variant="solid" onClick={() => navigate('onboarding-4')}>Continue</Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('onboarding-2')}>Back</Button>
      </View>
    </View>
  );
}

function Onboarding4({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View gap={1} align="center" paddingBlock={2}>
        <View direction="row" gap={2}>
          {[1, 2, 3, 4].map(() => (
            <View
              key={Math.random()}
              attributes={{
                style: {
                  width: '60px',
                  height: '4px',
                  background: '#1a1a1a',
                  borderRadius: '2px',
                },
              }}
            />
          ))}
        </View>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Consent and Agreement</Text>
        
        <Alert color="neutral">
          <Text variant="body-3" weight="medium">Important:</Text>
          <Text variant="caption-1">
            This platform connects people who share lived experiences. It does not replace professional medical care.
          </Text>
        </Alert>

        <View gap={2}>
          <Checkbox>I understand this is for emotional support, not medical advice</Checkbox>
          <Checkbox>I agree to keep conversations respectful and not share personally identifiable information</Checkbox>
          <Checkbox>I understand conversations are moderated for everyone's safety</Checkbox>
        </View>

        <Button fullWidth variant="solid" onClick={() => navigate('urgent-support')}>Accept and continue</Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('onboarding-3')}>Back</Button>
      </View>
    </View>
  );
}

function FAQScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
        <Button variant="ghost" onClick={() => navigate('urgent-support')}>← Back</Button>
      </View>

      <View gap={2}>
        <Text variant="title-4" weight="bold">Basic Information</Text>
        <Text variant="body-2" color="neutral-faded">
          Professionally validated information about HIV.
        </Text>
      </View>

      <View gap={3}>
        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-2" weight="medium">What happens after an HIV diagnosis?</Text>
            <Text variant="body-3" color="neutral-faded">
              HIV is a manageable chronic condition with treatment. With proper medical care, people with HIV live long and healthy lives.
            </Text>
          </View>
        </Card>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-2" weight="medium">Is treatment effective?</Text>
            <Text variant="body-3" color="neutral-faded">
              Yes. Antiretroviral treatment (ART) is highly effective. With treatment adherence, the viral load can become undetectable (Undetectable = Untransmittable).
            </Text>
          </View>
        </Card>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-2" weight="medium">Where to get professional help in Costa Rica?</Text>
            <Text variant="body-3" color="neutral-faded">
              CCSS (Caja Costarricense de Seguro Social) offers free treatment for people with HIV. You can go to your local clinic or request a referral.
            </Text>
            <Button variant="ghost" size="small">→ CCSS website</Button>
          </View>
        </Card>
      </View>

      <Button fullWidth variant="solid" onClick={() => navigate('urgent-support')}>Talk to someone</Button>
    </View>
  );
}

function NoPeerScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4} align="center">
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View
        attributes={{
          style: {
            width: '80px',
            height: '80px',
            background: '#e5e5e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '20px 0',
          },
        }}
      >
        ⏸
      </View>

      <View gap={3} align="center">
        <Text variant="title-5" weight="bold">No peers available right now</Text>
        <Text variant="body-3" color="neutral-faded" align="center">
          We're sorry there's no one available at this moment. You can leave a message and a peer will respond when available.
        </Text>

        <Button fullWidth variant="solid" onClick={() => navigate('offline-message')}>
          Leave an offline message
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('urgent-support')}>
          Try again later
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('faq')}>
          View general information
        </Button>
      </View>

      <Alert color="neutral">
        <Text variant="body-3" weight="medium">Need urgent help?</Text>
        <Text variant="caption-1">
          If you're in emotional crisis, contact emergency services or available help lines.
        </Text>
        <Button variant="ghost" size="small" onClick={() => navigate('crisis')}>→ View crisis resources</Button>
      </Alert>
    </View>
  );
}

function OfflineMessage({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
        <Button variant="ghost" onClick={() => navigate('no-peer')}>← Back</Button>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Leave an Offline Message</Text>
        <Text variant="body-2" color="neutral-faded">
          A peer volunteer will respond to your message when they're available.
        </Text>

        <Alert color="neutral">
          <Text variant="body-3" weight="medium">Anonymous messaging:</Text>
          <Text variant="caption-1">
            Your message is completely anonymous. We'll provide you with a private code to check for responses.
          </Text>
        </Alert>

        <View gap={2}>
          <Text variant="caption-1" weight="medium" color="neutral-faded">YOUR MESSAGE OR QUESTION:</Text>
          <TextField 
            placeholder="Share what's on your mind. A peer will respond with their experience and support..." 
            multiline 
            inputAttributes={{ rows: 6 }} 
          />
        </View>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-3" weight="medium">What happens next?</Text>
            <Text variant="caption-1">
              1. Your anonymous message is sent to our peer volunteers<br/>
              2. You'll receive a private access code<br/>
              3. A volunteer will respond within 24-48 hours<br/>
              4. Return with your code to read the response
            </Text>
          </View>
        </Card>

        <Button fullWidth variant="solid" onClick={() => navigate('offline-confirmation')}>
          Send message
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('no-peer')}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

function OfflineConfirmation({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4} align="center">
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
      </View>
      
      <View
        attributes={{
          style: {
            width: '80px',
            height: '80px',
            background: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '20px 0',
            color: 'white',
          },
        }}
      >
        ✓
      </View>

      <View gap={3} align="center">
        <Text variant="title-5" weight="bold">Message Sent</Text>
        <Text variant="body-3" color="neutral-faded" align="center">
          Your message has been sent anonymously to our peer volunteers.
        </Text>

        <Card padding={4} attributes={{ style: { textAlign: 'center', border: '2px solid #1a1a1a' } }}>
          <View gap={2}>
            <Text variant="caption-1" weight="medium">Your private access code:</Text>
            <Text 
              variant="title-3" 
              weight="bold" 
              attributes={{ 
                style: { 
                  letterSpacing: '4px', 
                  fontFamily: 'monospace' 
                } 
              }}
            >
              A7K9-M3X2
            </Text>
            <Text variant="caption-1" color="neutral-faded">
              Save this code to check for responses
            </Text>
          </View>
        </Card>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-3" weight="medium">Expected response time:</Text>
            <Text variant="caption-1">
              A peer volunteer will typically respond within 24-48 hours. You can return to this platform and enter your code to check for responses.
            </Text>
          </View>
        </Card>

        <Button fullWidth variant="solid" onClick={() => navigate('landing')}>
          Return to home
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('faq')}>
          View information while waiting
        </Button>
      </View>
    </View>
  );
}

function CheckMessage({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
        <Button variant="ghost" onClick={() => navigate('landing')}>← Back</Button>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Check Your Message</Text>
        <Text variant="body-2" color="neutral-faded">
          Enter the access code you received to check if a peer has responded to your message.
        </Text>

        <View gap={2}>
          <Text variant="caption-1" weight="medium" color="neutral-faded">ENTER YOUR ACCESS CODE:</Text>
          <TextField 
            placeholder="XXXX-XXXX" 
            inputAttributes={{ 
              style: { 
                textAlign: 'center', 
                letterSpacing: '3px', 
                fontFamily: 'monospace',
                textTransform: 'uppercase'
              },
              maxLength: 9
            }} 
          />
        </View>

        <Button fullWidth variant="solid" onClick={() => navigate('offline-response')}>
          Check for response
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('landing')}>
          Cancel
        </Button>

        <Alert color="neutral">
          <Text variant="body-3" weight="medium">Don't have a code?</Text>
          <Text variant="caption-1">
            You receive an access code when you send an offline message. If no peers are available, you can leave a message and get a code.
          </Text>
        </Alert>
      </View>
    </View>
  );
}

function OfflineResponse({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
        <Button variant="ghost" onClick={() => navigate('check-message')}>← Back</Button>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Peer Response</Text>
        <Text variant="body-2" color="neutral-faded">
          A volunteer has responded to your message.
        </Text>

        <Alert color="neutral">
          <Text variant="body-3" weight="medium">Your original message:</Text>
        </Alert>

        <Card padding={3} attributes={{ style: { borderLeft: '4px solid #1a1a1a' } }}>
          <View gap={2}>
            <Text variant="body-3" color="neutral-faded">
              "I'm scared. I don't know what to do after my diagnosis. Does it get better?"
            </Text>
            <Text variant="caption-1" color="neutral-faded">
              Sent 2 days ago
            </Text>
          </View>
        </Card>

        <Alert color="neutral">
          <Text variant="body-3" weight="medium">Peer volunteer response:</Text>
        </Alert>

        <Card padding={3}>
          <View gap={2}>
            <Text variant="body-3">
              Thank you for sharing. Your fear is completely valid and something many of us have felt. When I was diagnosed, I felt the same way - scared, confused, overwhelmed.
              <br/><br/>
              I want you to know: yes, it does get better. The first weeks and months are the hardest emotionally, but with time, treatment, and support, life becomes manageable and even full again.
              <br/><br/>
              Treatment today is incredibly effective. I've been undetectable for 3 years now, living a completely normal life. The fear lessens as you learn more and connect with others who understand.
              <br/><br/>
              Take things one day at a time. Be gentle with yourself. And know that you're not alone in this journey.
            </Text>
            <Text variant="caption-1" color="neutral-faded">
              — Peer volunteer • Responded 1 day ago
            </Text>
          </View>
        </Card>

        <Button fullWidth variant="solid" onClick={() => navigate('urgent-support')}>
          Continue conversation live
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('faq')}>
          View more information
        </Button>
        <Button fullWidth variant="outlined" onClick={() => navigate('landing')}>
          Return to home
        </Button>
      </View>
    </View>
  );
}

function CrisisResources({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <View padding={4} gap={4}>
      <View direction="row" gap={2}>
        <Button variant="ghost" onClick={() => navigate('landing')}>🏠</Button>
        <Button variant="ghost" onClick={() => navigate('landing')}>← Back</Button>
      </View>

      <View gap={3}>
        <Text variant="title-4" weight="bold">Crisis Resources</Text>
        <Text variant="body-2" color="neutral-faded">
          If you're experiencing an emotional crisis or thoughts of self-harm, these resources can help you immediately.
        </Text>

        <Alert color="critical">
          <Text variant="body-3" weight="bold">⚠️ Immediate Emergency:</Text>
          <Text variant="body-3">
            If you're in immediate danger, call 911
          </Text>
        </Alert>

        <Text variant="body-2" weight="medium">Help Lines in Costa Rica</Text>

        <View gap={3}>
          <Card padding={3}>
            <View gap={2}>
              <Text variant="body-3" weight="medium">National Psychiatric Hospital</Text>
              <Text variant="caption-1">24/7 crisis line</Text>
              <Text variant="body-2" weight="bold">Phone: 2222-0400</Text>
            </View>
          </Card>

          <Card padding={3}>
            <View gap={2}>
              <Text variant="body-3" weight="medium">
                Institute on Alcoholism and Drug Dependence (IAFA)
              </Text>
              <Text variant="caption-1">Guidance and emotional support</Text>
              <Text variant="body-2" weight="bold">Phone: 800-4232-322</Text>
            </View>
          </Card>

          <Card padding={3}>
            <View gap={2}>
              <Text variant="body-3" weight="medium">CCSS - Comprehensive Care</Text>
              <Text variant="caption-1">
                Your local clinic can refer you to mental health services and psychological support.
              </Text>
              <Button variant="ghost" size="small">→ Find your clinic</Button>
            </View>
          </Card>
        </View>

        <Button fullWidth variant="outlined" onClick={() => navigate('landing')}>
          Back to home
        </Button>
      </View>
    </View>
  );
}
