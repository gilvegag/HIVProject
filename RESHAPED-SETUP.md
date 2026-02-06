# Using Reshaped Design System for HIV Peer Support Platform

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/gilbert.vega/HIV
npm install
```

This will install:
- Next.js
- React
- **Reshaped v3.9** (the design system)

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Reshaped Components Used

Based on your wireframes, here are the Reshaped components we'll use:

### Layout & Structure
```jsx
import { View, Container } from 'reshaped';

<View padding={4} gap={3}>
  <Container width="375px">
    {/* Content */}
  </Container>
</View>
```

### Typography
```jsx
import { Text } from 'reshaped';

<Text variant="title-3" weight="bold">You're not alone in this</Text>
<Text variant="body-2" color="neutral-faded">A safe and anonymous space...</Text>
```

### Buttons
```jsx
import { Button } from 'reshaped';

<Button fullWidth size="large" variant="solid">
  Talk to someone now
</Button>

<Button fullWidth variant="outlined">
  What is this platform?
</Button>
```

### Cards & Lists
```jsx
import { Card } from 'reshaped';

<Card padding={3}>
  <View gap={2}>
    <Text>Card content</Text>
  </View>
</Card>
```

### Peer List Items
```jsx
<Card 
  onClick={() => selectPeer(peer)} 
  hoverable
  padding={3}
>
  <View direction="row" align="center" gap={3}>
    <View.Item>
      <Avatar size="large">{peer.avatar}</Avatar>
    </View.Item>
    <View.Item grow>
      <Text variant="body-2" weight="bold">{peer.username}</Text>
      <Text variant="caption-1" color="neutral-faded">
        {peer.age} years old • {peer.province}
      </Text>
      <Badge color="positive">Available now</Badge>
    </View.Item>
  </View>
</Card>
```

### Forms
```jsx
import { TextField, Select, Checkbox } from 'reshaped';

<TextField 
  placeholder="Type your message..." 
  fullWidth
/>

<Select fullWidth>
  <Select.Option value="en">English</Select.Option>
  <Select.Option value="es">Español</Select.Option>
</Select>

<Checkbox>
  I understand this is for emotional support
</Checkbox>
```

### Chat Interface
```jsx
<View gap={2} padding={3}>
  {messages.map(msg => (
    <View 
      key={msg.id}
      align={msg.isUser ? 'end' : 'start'}
    >
      <Card 
        padding={2}
        attributes={{
          style: {
            background: msg.isUser ? '#1a1a1a' : '#f0f0f0',
            color: msg.isUser ? 'white' : 'inherit'
          }
        }}
      >
        <Text>{msg.text}</Text>
      </Card>
    </View>
  ))}
</View>
```

### Badges & Status
```jsx
import { Badge } from 'reshaped';

<Badge color="positive" icon={IconCircleFilled}>
  Available now
</Badge>
```

### Alerts & Disclaimers
```jsx
import { Alert } from 'reshaped';

<Alert color="neutral">
  <Text weight="medium">Remember:</Text>
  Peers share personal experiences, not medical recommendations.
</Alert>
```

---

## Theming

Reshaped supports automatic dark mode and custom themes. For this project:

```jsx
import { Reshaped } from 'reshaped';

<Reshaped theme="reshaped" colorMode="light">
  <App />
</Reshaped>
```

---

## Component Mapping

| Wireframe Element | Reshaped Component |
|-------------------|-------------------|
| Headlines | `<Text variant="title-3">` |
| Body text | `<Text variant="body-2">` |
| Primary buttons | `<Button variant="solid">` |
| Secondary buttons | `<Button variant="outlined">` |
| Cards | `<Card>` |
| Lists | `<View gap={2}>` |
| Forms | `<TextField>`, `<Select>`, `<Checkbox>` |
| Badges | `<Badge>` |
| Alerts | `<Alert>` |
| Avatar icons | `<Avatar>` or custom emoji |

---

## Color System

Reshaped uses semantic colors. For this health-focused app:

```jsx
// Neutral grays (primary)
backgroundColor="neutral"
color="neutral-faded"

// Success/Available
color="positive"

// Warnings
color="critical"

// Backgrounds
backgroundColor="neutral-faded"
```

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Review documentation**: https://reshaped.so/docs
3. **Start development**: `npm run dev`
4. **Build for production**: `npm run build`
5. **Deploy to Vercel**: `vercel --prod`

---

## Resources

- **Reshaped Docs**: https://reshaped.so/docs
- **Component Library**: https://reshaped.so/components
- **Figma File**: https://www.figma.com/design/6mTt3KChCR0EZqRqn8ii7F
- **GitHub Repo**: https://github.com/formaat-design/reshaped

