import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ============================================
// 1. ANONYMOUS IDENTITY SYSTEM
// ============================================

class AnonymousIdentity {
  constructor() {
    this.users = new Map(); // userId -> userData
    this.deviceFingerprints = new Map(); // fingerprint -> userId[]
  }

  createUser(deviceFingerprint) {
    const userId = uuidv4();
    const recoveryPhrase = this.generateRecoveryPhrase();
    
    const userData = {
      userId,
      recoveryPhrase,
      deviceFingerprint,
      createdAt: Date.now(),
      trustLevel: 1, // Start at level 1 (low trust)
      conversationCount: 0,
      reportCount: 0,
      lastActivity: Date.now(),
      rateLimit: {
        urgentRequests: [],
        messagesCount: 0,
        reportsCount: 0,
      },
    };

    this.users.set(userId, userData);
    
    // Track device fingerprint
    if (!this.deviceFingerprints.has(deviceFingerprint)) {
      this.deviceFingerprints.set(deviceFingerprint, []);
    }
    this.deviceFingerprints.get(deviceFingerprint).push(userId);

    return { userId, recoveryPhrase };
  }

  generateRecoveryPhrase() {
    // Simple 6-word recovery phrase
    const words = [
      'mountain', 'ocean', 'forest', 'river', 'sunset', 'meadow',
      'thunder', 'crystal', 'phoenix', 'garden', 'breeze', 'journey',
      'harmony', 'wisdom', 'courage', 'shelter', 'beacon', 'serenity',
      'horizon', 'cascade', 'whisper', 'anchor', 'compass', 'lantern',
    ];
    
    const phrase = [];
    for (let i = 0; i < 6; i++) {
      phrase.push(words[Math.floor(Math.random() * words.length)]);
    }
    return phrase.join('-');
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  recoverByPhrase(recoveryPhrase, newDeviceFingerprint) {
    for (const [userId, userData] of this.users.entries()) {
      if (userData.recoveryPhrase === recoveryPhrase) {
        // Update device fingerprint
        userData.deviceFingerprint = newDeviceFingerprint;
        userData.lastActivity = Date.now();
        
        // Track new device
        if (!this.deviceFingerprints.has(newDeviceFingerprint)) {
          this.deviceFingerprints.set(newDeviceFingerprint, []);
        }
        this.deviceFingerprints.get(newDeviceFingerprint).push(userId);
        
        return userData;
      }
    }
    return null;
  }

  updateActivity(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.lastActivity = Date.now();
    }
  }
}

// ============================================
// 2. DEVICE FINGERPRINTING (LIGHTWEIGHT)
// ============================================

function generateDeviceFingerprint(data) {
  const { userAgent, language, timezone, screenResolution } = data;
  const fingerprint = `${userAgent}-${language}-${timezone}-${screenResolution}`;
  return bcrypt.hashSync(fingerprint, 10); // Non-reversible hash
}

// ============================================
// 3. RATE LIMITING BY CONTEXT
// ============================================

class RateLimiter {
  constructor() {
    this.limits = {
      urgentRequest: { max: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per 24h
      messagesBurst: { max: 10, windowMs: 60 * 1000 }, // 10 per minute
      reporting: { max: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
    };
  }

  canPerformAction(user, actionType) {
    const now = Date.now();
    const limit = this.limits[actionType];

    if (!limit) return { allowed: true };

    if (actionType === 'urgentRequest') {
      // Filter out old requests
      user.rateLimit.urgentRequests = user.rateLimit.urgentRequests.filter(
        (timestamp) => now - timestamp < limit.windowMs
      );

      if (user.rateLimit.urgentRequests.length >= limit.max) {
        return {
          allowed: false,
          message: "We're protecting the space. Please try again later.",
          retryAfter: Math.ceil((limit.windowMs - (now - user.rateLimit.urgentRequests[0])) / 1000),
        };
      }

      user.rateLimit.urgentRequests.push(now);
      return { allowed: true };
    }

    return { allowed: true };
  }
}

// ============================================
// 4. PROGRESSIVE TRUST MODEL
// ============================================

class TrustSystem {
  calculateTrust(user) {
    let trustScore = user.trustLevel;

    // Increase trust based on time on platform (days)
    const daysActive = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
    if (daysActive > 30) trustScore += 2;
    else if (daysActive > 7) trustScore += 1;

    // Conversation count bonus
    if (user.conversationCount > 20) trustScore += 2;
    else if (user.conversationCount > 10) trustScore += 1;

    // Report penalty
    if (user.reportCount > 0) trustScore -= user.reportCount;

    return Math.max(1, Math.min(trustScore, 10)); // Keep between 1-10
  }

  canMatchWithPeer(user, peer) {
    const userTrust = this.calculateTrust(user);
    const peerTrust = this.calculateTrust(peer);

    // Low trust users can only match with higher trust peers
    if (userTrust < 3 && peerTrust < 3) {
      return false; // Prevent two new users from matching
    }

    return true;
  }

  getPriorityScore(user) {
    return this.calculateTrust(user);
  }
}

// ============================================
// 5. MODERATION SYSTEM
// ============================================

class ModerationSystem {
  constructor() {
    this.flaggedPhrases = [
      'medical advice',
      'diagnosis',
      'prescription',
      'treatment plan',
      'doctor recommendation',
      'cure',
      'medication dose',
    ];
    
    this.suspiciousPatterns = {
      rapidMessages: 10, // messages per minute
      repeatedReports: 3, // reports received
    };
  }

  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    const flags = [];

    // Check for medical advice phrases
    for (const phrase of this.flaggedPhrases) {
      if (lowerMessage.includes(phrase)) {
        flags.push({
          type: 'medical_advice',
          phrase,
          severity: 'medium',
        });
      }
    }

    // Check for URLs (phishing protection)
    if (/https?:\/\//.test(message)) {
      flags.push({
        type: 'external_link',
        severity: 'low',
      });
    }

    return {
      allowed: flags.length === 0 || flags.every((f) => f.severity === 'low'),
      flags,
      warning: flags.length > 0 ? this.generateWarning(flags) : null,
    };
  }

  generateWarning(flags) {
    if (flags.some((f) => f.type === 'medical_advice')) {
      return 'Remember: This space is for companionship and sharing experiences, not medical advice.';
    }
    return 'Please keep conversations focused on peer support.';
  }

  shouldFreezeConversation(user) {
    // Freeze if user has been reported multiple times
    return user.reportCount >= this.suspiciousPatterns.repeatedReports;
  }

  downgradeTrust(user) {
    user.trustLevel = Math.max(1, user.trustLevel - 1);
    user.reportCount += 1;
  }
}

// ============================================
// INITIALIZE SYSTEMS
// ============================================

const identitySystem = new AnonymousIdentity();
const rateLimiter = new RateLimiter();
const trustSystem = new TrustSystem();
const moderationSystem = new ModerationSystem();

// ============================================
// PEER MATCHING SYSTEM
// ============================================

class PeerMatcher {
  constructor() {
    this.availablePeers = new Map(); // userId -> peerData
    this.activeConversations = new Map(); // conversationId -> { user1, user2, messages }
  }

  addAvailablePeer(userId, peerData) {
    this.availablePeers.set(userId, peerData);
  }

  removeAvailablePeer(userId) {
    this.availablePeers.delete(userId);
  }

  findMatch(userId, filters = {}) {
    const user = identitySystem.getUser(userId);
    if (!user) return null;

    const candidates = Array.from(this.availablePeers.entries())
      .filter(([peerId, peerData]) => {
        if (peerId === userId) return false; // Can't match with self

        // Apply filters
        if (filters.province && peerData.province !== filters.province) return false;
        if (filters.ageRange) {
          const [min, max] = filters.ageRange.split('-').map(Number);
          if (peerData.age < min || peerData.age > max) return false;
        }

        // Check trust compatibility
        const peer = identitySystem.getUser(peerId);
        return trustSystem.canMatchWithPeer(user, peer);
      })
      .sort((a, b) => {
        // Sort by trust score (higher trust first)
        const trustA = trustSystem.getPriorityScore(identitySystem.getUser(a[0]));
        const trustB = trustSystem.getPriorityScore(identitySystem.getUser(b[0]));
        return trustB - trustA;
      });

    return candidates.length > 0 ? candidates[0] : null;
  }

  createConversation(userId1, userId2) {
    const conversationId = uuidv4();
    this.activeConversations.set(conversationId, {
      user1: userId1,
      user2: userId2,
      messages: [],
      startedAt: Date.now(),
      frozen: false,
    });

    // Remove from available peers
    this.removeAvailablePeer(userId1);
    this.removeAvailablePeer(userId2);

    return conversationId;
  }

  addMessage(conversationId, userId, message) {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation || conversation.frozen) return false;

    // Moderate message
    const moderation = moderationSystem.analyzeMessage(message);
    
    const messageData = {
      id: uuidv4(),
      userId,
      message,
      timestamp: Date.now(),
      flags: moderation.flags,
      warning: moderation.warning,
    };

    conversation.messages.push(messageData);

    return {
      allowed: moderation.allowed,
      messageData,
      warning: moderation.warning,
    };
  }

  endConversation(conversationId) {
    const conversation = this.activeConversations.get(conversationId);
    if (conversation) {
      // Update user stats
      const user1 = identitySystem.getUser(conversation.user1);
      const user2 = identitySystem.getUser(conversation.user2);
      
      if (user1) user1.conversationCount += 1;
      if (user2) user2.conversationCount += 1;

      this.activeConversations.delete(conversationId);
    }
  }
}

const peerMatcher = new PeerMatcher();

// ============================================
// EXPRESS ROUTES
// ============================================

// Create or recover anonymous identity
app.post('/api/identity/create', (req, res) => {
  const { deviceFingerprint } = req.body;
  
  if (!deviceFingerprint) {
    return res.status(400).json({ error: 'Device fingerprint required' });
  }

  const { userId, recoveryPhrase } = identitySystem.createUser(deviceFingerprint);

  res.cookie('userId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  res.json({
    userId,
    recoveryPhrase,
    message: 'Save your recovery phrase! You\'ll need it to access your account on other devices.',
  });
});

// Recover identity with recovery phrase
app.post('/api/identity/recover', (req, res) => {
  const { recoveryPhrase, deviceFingerprint } = req.body;

  if (!recoveryPhrase || !deviceFingerprint) {
    return res.status(400).json({ error: 'Recovery phrase and device fingerprint required' });
  }

  const userData = identitySystem.recoverByPhrase(recoveryPhrase, deviceFingerprint);

  if (!userData) {
    return res.status(404).json({ error: 'Invalid recovery phrase' });
  }

  res.cookie('userId', userData.userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  res.json({
    userId: userData.userId,
    message: 'Identity recovered successfully',
  });
});

// Get user trust level (anonymous)
app.get('/api/user/trust', (req, res) => {
  const userId = req.cookies.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'No identity found' });
  }

  const user = identitySystem.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const trustLevel = trustSystem.calculateTrust(user);

  res.json({
    trustLevel,
    conversationCount: user.conversationCount,
    accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// ============================================
// SOCKET.IO - REAL-TIME CHAT
// ============================================

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let userId = null;
  let conversationId = null;

  // Authenticate socket connection
  socket.on('authenticate', (data) => {
    userId = data.userId;
    const user = identitySystem.getUser(userId);

    if (!user) {
      socket.emit('auth_error', { message: 'Invalid user ID' });
      return;
    }

    console.log('✅ User authenticated:', userId);
    identitySystem.updateActivity(userId);
    socket.emit('authenticated', { userId });
  });

  // Browse available peers
  socket.on('browse_peers', (filters) => {
    console.log('📋 Browse peers requested by:', userId);
    console.log('📋 Available peers count:', peerMatcher.availablePeers.size);
    
    const peers = Array.from(peerMatcher.availablePeers.entries())
      .map(([peerId, peerData]) => ({
        id: peerId,
        username: peerData.username,
        age: peerData.age,
        province: peerData.province,
        avatar: peerData.avatar,
      }))
      .filter((peer) => {
        if (filters.province && peer.province !== filters.province) return false;
        if (filters.ageRange) {
          const [min, max] = filters.ageRange.split('-').map(Number);
          if (peer.age < min || peer.age > max) return false;
        }
        return true;
      });

    console.log('📋 Sending peers list:', peers.length, 'peers');
    socket.emit('peers_list', peers);
  });

  // Make self available for matching
  socket.on('set_available', (peerData) => {
    if (!userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    console.log('👤 User set available:', userId, peerData);
    peerMatcher.addAvailablePeer(userId, { ...peerData, socketId: socket.id });
    console.log('👤 Total available peers:', peerMatcher.availablePeers.size);
    socket.emit('status_update', { available: true });
  });

  // Request to chat with specific peer
  socket.on('request_chat', async (data) => {
    const { peerId } = data;
    
    console.log('💬 Chat requested by:', userId, 'with peer:', peerId);
    
    if (!userId) {
      console.log('❌ User not authenticated');
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const user = identitySystem.getUser(userId);

    // Check rate limiting
    const rateCheck = rateLimiter.canPerformAction(user, 'urgentRequest');
    if (!rateCheck.allowed) {
      console.log('❌ Rate limited');
      socket.emit('rate_limited', {
        message: rateCheck.message,
        retryAfter: rateCheck.retryAfter,
      });
      return;
    }

    // Check if peer is available
    const peerData = peerMatcher.availablePeers.get(peerId);
    if (!peerData) {
      console.log('❌ Peer not available:', peerId);
      socket.emit('peer_unavailable', { message: 'Peer is no longer available' });
      return;
    }

    // Get requester data before removing from available peers
    const requesterData = peerMatcher.availablePeers.get(userId);

    // Create conversation
    conversationId = peerMatcher.createConversation(userId, peerId);
    console.log('✅ Conversation created:', conversationId);

    // Notify both users
    socket.emit('chat_started', { conversationId, peer: peerData });
    console.log('✅ Sent chat_started to requester');
    
    const peerSocket = io.sockets.sockets.get(peerData.socketId);
    if (peerSocket) {
      peerSocket.emit('chat_started', {
        conversationId,
        peer: requesterData || { username: 'Anonymous', age: 0, province: 'Unknown', avatar: '👤' },
      });
      console.log('✅ Sent chat_started to peer');
    } else {
      console.log('❌ Peer socket not found');
    }
  });

  // Send message
  socket.on('send_message', (data) => {
    const { conversationId: convId, message } = data;

    if (!userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const result = peerMatcher.addMessage(convId, userId, message);

    if (!result) {
      socket.emit('error', { message: 'Conversation not found or frozen' });
      return;
    }

    // Send to both users in conversation
    const conversation = peerMatcher.activeConversations.get(convId);
    const recipientId = conversation.user1 === userId ? conversation.user2 : conversation.user1;
    
    // Emit to sender
    socket.emit('message_received', result.messageData);
    
    // Show warning if flagged
    if (result.warning) {
      socket.emit('moderation_warning', { message: result.warning });
    }

    // Emit to recipient
    const recipientData = peerMatcher.availablePeers.get(recipientId);
    if (recipientData) {
      const recipientSocket = io.sockets.sockets.get(recipientData.socketId);
      if (recipientSocket) {
        recipientSocket.emit('message_received', result.messageData);
      }
    }
  });

  // Report peer
  socket.on('report_peer', (data) => {
    const { peerId, reason } = data;

    if (!userId) return;

    const reportedUser = identitySystem.getUser(peerId);
    if (reportedUser) {
      moderationSystem.downgradeTrust(reportedUser);
      
      // Check if should freeze
      if (moderationSystem.shouldFreezeConversation(reportedUser)) {
        // Freeze all conversations with this user
        for (const [convId, conv] of peerMatcher.activeConversations.entries()) {
          if (conv.user1 === peerId || conv.user2 === peerId) {
            conv.frozen = true;
          }
        }
      }
    }

    socket.emit('report_submitted', { message: 'Thank you for helping us keep this space safe.' });
  });

  // End conversation
  socket.on('end_conversation', (data) => {
    if (conversationId) {
      peerMatcher.endConversation(conversationId);
      socket.emit('conversation_ended');
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (userId) {
      peerMatcher.removeAvailablePeer(userId);
      
      if (conversationId) {
        peerMatcher.endConversation(conversationId);
      }
    }
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3100;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Socket.IO ready for connections`);
  console.log(`✅ Anonymous identity system active`);
  console.log(`✅ Moderation and safety features enabled`);
});
